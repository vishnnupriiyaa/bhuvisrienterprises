import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Check, 
  Lock, 
  MessageCircle, 
  ArrowRight
} from 'lucide-react';
import { CartItem, CustomerDetails, Order } from '../types';
import { formatCurrency, generateWhatsAppLink, getOrderWhatsAppText, STORE_WHATSAPP_NUMBER } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: 'INR' | 'USD';
  discount: number;
  couponCode?: string;
  onOrderPlaced: (order: Order) => Promise<boolean>;
  initialCustomer?: Partial<CustomerDetails>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  discount,
  couponCode,
  onOrderPlaced,
  initialCustomer,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  // Customer Form State
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: initialCustomer?.name || '',
    email: initialCustomer?.email || '',
    phone: initialCustomer?.phone || '',
    address: initialCustomer?.address || '',
    city: initialCustomer?.city || '',
    state: initialCustomer?.state || '',
    pincode: initialCustomer?.pincode || '',
    country: 'India',
  });

  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((acc, i) => acc + i.itemTotal, 0);
  const freeShippingThreshold = 2000;
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 450;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setAddressError(null);
    const normalizedPincode = customer.pincode.replace(/\D/g, '');
    if (customer.address.trim().length < 10) {
      setAddressError('Please enter a complete street address with house or building details.');
      return;
    }
    if (normalizedPincode.length !== 6) {
      setAddressError('Please enter a valid 6-digit Indian pincode.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${normalizedPincode}`);
      if (!response.ok) throw new Error('Postal verification is unavailable.');
      const [postalResult] = await response.json();
      const postOffice = postalResult?.PostOffice?.[0];
      if (postalResult?.Status !== 'Success' || !postOffice) {
        setAddressError('That pincode could not be verified. Please check your address details.');
        return;
      }

      const enteredState = customer.state.trim().toLowerCase();
      const enteredCity = customer.city.trim().toLowerCase();
      const stateMatches = postOffice.State.toLowerCase() === enteredState;
      const cityMatches = [postOffice.District, postOffice.Block, postOffice.Name]
        .filter(Boolean)
        .some((value: string) => value.toLowerCase() === enteredCity);
      if (!stateMatches || !cityMatches) {
        setAddressError(`Pincode ${normalizedPincode} belongs to ${postOffice.District}, ${postOffice.State}. Please correct the city and state.`);
        return;
      }

      setCustomer((current) => ({ ...current, pincode: normalizedPincode }));
      setStep('payment');
    } catch (error) {
      setAddressError(error instanceof Error ? error.message : 'Address verification failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (paymentMethod === 'cod') {
      await finalizeOrder('Pending', 'cod');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100),
          currency: 'INR',
          receipt: `order_${Date.now()}`,
        }),
      });
      const order = await response.json();
      if (!response.ok) throw new Error(order.error || 'Unable to start payment.');

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'BhuviSri Enterprises',
        description: `Order for ${items.length} item(s)`,
        order_id: order.order_id,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        theme: { color: '#2A2A2A' },
        handler: async (payment) => {
          try {
            const verificationResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payment),
            });
            const verification = await verificationResponse.json();
            if (!verificationResponse.ok || !verification.verified) {
              throw new Error(verification.error || 'Payment verification failed.');
            }
            await finalizeOrder('Paid', 'razorpay');
          } catch (error) {
            setIsProcessing(false);
            setPaymentError(error instanceof Error ? error.message : 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setPaymentError('Payment was cancelled before completion.');
          },
        },
      });

      razorpay.on('payment.failed', (failure) => {
        setIsProcessing(false);
        setPaymentError(failure.error?.description || 'Payment failed. Please try again.');
      });
      razorpay.open();
    } catch (error) {
      setIsProcessing(false);
      setPaymentError(error instanceof Error ? error.message : 'Unable to start payment.');
    }
  };

  const finalizeOrder = async (paymentStatus: 'Paid' | 'Pending', finalizedPaymentMethod = paymentMethod) => {
    const orderNum = `AL-${Date.now()}`;
    const now = new Date();
    const estDate = new Date();
    estDate.setDate(now.getDate() + 5);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: now.toISOString().split('T')[0],
      customer,
      items: [...items],
      subtotal,
      discount,
      couponCode: discount > 0 ? couponCode : undefined,
      shippingFee,
      totalAmount,
      paymentMethod: finalizedPaymentMethod,
      paymentStatus,
      orderStatus: 'Order Placed',
      trackingNumber: `EXP-AURA-${Math.floor(100000 + Math.random() * 900000)}`,
      courierPartner: 'BlueDart Air Express',
      estimatedDelivery: estDate.toISOString().split('T')[0],
      whatsappUpdates,
      timeline: [
        {
          status: 'Order Placed',
          timestamp: 'Just now',
          description: `Order ${orderNum} confirmed with ${finalizedPaymentMethod.toUpperCase()} (${paymentStatus}).`,
          completed: true,
        },
        {
          status: 'Crafting & Stitching',
          timestamp: 'Upcoming (1-2 days)',
          description: 'Your order is being prepared in our workshop.',
          completed: false,
        },
        {
          status: 'Quality Inspection',
          timestamp: 'Upcoming (3-4 days)',
          description: 'Final measurement auditing and steam finish.',
          completed: false,
        },
        {
          status: 'Dispatched',
          timestamp: 'Upcoming',
          description: 'Handover to express courier with insured transit.',
          completed: false,
        },
        {
          status: 'Delivered',
          timestamp: `Expected ${estDate.toDateString()}`,
          description: 'Signature luxury unboxing experience.',
          completed: false,
        }
      ]
    };

    const wasSaved = await onOrderPlaced(newOrder);
    if (!wasSaved) {
      setIsProcessing(false);
      return;
    }

    setCompletedOrder(newOrder);
    setStep('success');

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#A68A64', '#2A2A2A', '#DCD7D0', '#F5F2ED']
      });
    } catch {
      // ignore
    }
  };

  const handleShareWhatsAppOrder = () => {
    if (!completedOrder) return;
    const msg = getOrderWhatsAppText(completedOrder.orderNumber, completedOrder.customer.name, 'Confirmed & In Production');
    const link = generateWhatsAppLink(STORE_WHATSAPP_NUMBER, msg);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="checkout-modal-container"
        className="relative bg-[#F5F2ED] w-full max-w-3xl border border-[#DCD7D0] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#EAE5DF] border-b border-[#DCD7D0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#2A2A2A]" />
            <h1 className="font-serif italic text-xl text-[#2A2A2A]">
              {step === 'success' ? 'Order Confirmed' : 'Continue with Payment'}
            </h1>
          </div>

          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-1 text-[#2A2A2A] hover:opacity-60 cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* STEP 1: Shipping Address */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2A2A2A] mb-3">
                  1. Shipping & Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">State & Pincode *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                      />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={customer.pincode}
                        onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                        className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Opt-in */}
              <div className="p-3.5 bg-[#EAE5DF] border border-[#DCD7D0] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="whatsapp-updates-check"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="whatsapp-updates-check" className="text-xs text-[#2A2A2A] cursor-pointer">
                  <strong>Enable Instant WhatsApp Updates:</strong> Receive real-time artisan stitching progress, dispatch video previews, and courier tracking directly on WhatsApp.
                </label>
              </div>

              {addressError && (
                <div className="p-3 border border-[#A68A64] bg-[#F5F2ED] text-xs text-[#2A2A2A]" role="alert">
                  {addressError}
                </div>
              )}

              {/* Order Summary Mini Box */}
              <div className="p-4 bg-[#EAE5DF] border border-[#DCD7D0] text-xs flex justify-between items-center">
                <div>
                  <span className="text-[#6B655E] block uppercase tracking-wider text-[10px]">{items.length} Item(s) in Order</span>
                  <strong className="text-base text-[#2A2A2A]">{formatCurrency(totalAmount, currency)}</strong>
                </div>
                <span className="text-[#A68A64] font-bold uppercase tracking-wider text-[10px]">Free Insured Shipping</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3 bg-[#2A2A2A] hover:bg-[#404040] text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer"
                >
                  <span>{isProcessing ? 'Verifying Address...' : 'Proceed to Payment'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Gateway */}
          {step === 'payment' && (
            <form onSubmit={handleInitiatePayment} className="space-y-6">
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2A2A2A] mb-3">
                  2. Choose Payment Method
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                  {[
                    { id: 'razorpay', label: 'Razorpay / UPI / Card', icon: CreditCard },
                    { id: 'cod', label: 'COD', icon: Truck },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 border text-center text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? 'bg-[#2A2A2A] text-white border-[#2A2A2A]'
                            : 'bg-[#F5F2ED] text-[#2A2A2A] border-[#DCD7D0] hover:border-[#2A2A2A]'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="font-semibold text-[10px] uppercase tracking-wider">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod !== 'cod' && (
                  <div className="p-4 bg-[#EAE5DF] border border-[#DCD7D0] text-xs text-[#2A2A2A] space-y-1">
                    <p className="font-bold uppercase tracking-wider text-[10px]">Razorpay Secure Checkout</p>
                    <p className="text-[#6B655E]">UPI, QR scanner, cards, net banking, and wallets will open in Razorpay's secure payment window.</p>
                  </div>
                )}

                {/* COD */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-[#EAE5DF] border border-[#DCD7D0] text-xs text-[#2A2A2A] space-y-1">
                    <p className="font-bold uppercase tracking-wider text-[10px]">Cash on Delivery (COD)</p>
                    <p className="text-[#6B655E]">Pay cash upon delivery to the courier agent after inspecting the package.</p>
                  </div>
                )}

                {paymentError && (
                  <div className="p-3 border border-[#A68A64] bg-[#F5F2ED] text-xs text-[#2A2A2A]" role="alert">
                    {paymentError}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-5 py-2.5 border border-[#DCD7D0] text-[#2A2A2A] text-[10px] uppercase tracking-[0.2em] cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3.5 bg-[#2A2A2A] hover:bg-[#404040] text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Lock size={13} />
                  <span>{isProcessing ? 'Opening Secure Checkout...' : `Pay ${formatCurrency(totalAmount, currency)}`}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success */}
          {step === 'success' && completedOrder && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 bg-[#2A2A2A] text-white mx-auto flex items-center justify-center">
                <Check size={28} />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A64] font-bold">
                  Order Successfully Placed
                </span>
                <h2 className="font-serif italic text-3xl text-[#2A2A2A] mt-1">
                  Thank You, {completedOrder.customer.name}!
                </h2>
                <p className="text-xs text-[#6B655E] mt-1 font-light">
                  Order Ref: <strong className="font-mono text-[#2A2A2A]">#{completedOrder.orderNumber}</strong> • AWB: <span className="font-mono">{completedOrder.trackingNumber}</span>
                </p>
              </div>

              {/* Order Receipt */}
              <div className="p-4 bg-[#EAE5DF] border border-[#DCD7D0] text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#DCD7D0]">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#2A2A2A]">Items Summary</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#6B655E]">Delivery Est: {completedOrder.estimatedDelivery}</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-medium text-[#2A2A2A]">{it.product.name} (x{it.quantity})</p>
                        <p className="text-[10px] text-[#6B655E]">
                          Size: {it.selectedSize} {it.isCustomized ? '• Custom Tailored' : ''}
                        </p>
                      </div>
                      <span className="font-bold text-[#2A2A2A]">{formatCurrency(it.itemTotal, currency)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#DCD7D0] flex justify-between font-bold text-sm text-[#2A2A2A]">
                  <span>Amount Paid ({completedOrder.paymentMethod.toUpperCase()})</span>
                  <span>{formatCurrency(completedOrder.totalAmount, currency)}</span>
                </div>
              </div>

              {/* WhatsApp Share CTA */}
              <div className="p-4 bg-[#EAE5DF] border border-[#DCD7D0] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2A2A2A]">Connect on WhatsApp</p>
                    <p className="text-[11px] text-[#6B655E]">Receive live preparation photos and order updates.</p>
                  </div>
                </div>

                <button
                  onClick={handleShareWhatsAppOrder}
                  className="px-4 py-2 bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-[0.2em] shrink-0 cursor-pointer"
                >
                  <span>Chat with Stylist</span>
                </button>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#2A2A2A] text-white text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-[#404040]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
