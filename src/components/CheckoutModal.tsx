import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building, 
  Truck, 
  Check, 
  Lock, 
  Eye,
  EyeOff,
  MessageCircle, 
  ArrowRight
} from 'lucide-react';
import { CartItem, CustomerDetails, Order } from '../types';
import { formatCurrency, generateWhatsAppLink, getOrderWhatsAppText } from '../utils/formatters';

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

  const [step, setStep] = useState<'details' | 'payment' | 'otp_verify' | 'success'>('details');

  // Customer Form State
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: initialCustomer?.name || 'Priya Sharma',
    email: initialCustomer?.email || 'priya.sharma@example.com',
    phone: initialCustomer?.phone || '+91 98765 43210',
    address: initialCustomer?.address || '402, Magnolia Residency, Indiranagar 100ft Road',
    city: initialCustomer?.city || 'Bengaluru',
    state: initialCustomer?.state || 'Karnataka',
    pincode: initialCustomer?.pincode || '560038',
    country: 'India',
  });

  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isCvvVisible, setIsCvvVisible] = useState(false);
  const [cardHolder, setCardHolder] = useState('PRIYA SHARMA');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // OTP Simulation State
  const [inputOtp, setInputOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((acc, i) => acc + i.itemTotal, 0);
  const freeShippingThreshold = 15000;
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 450;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card' || paymentMethod === 'upi') {
      setStep('otp_verify');
    } else {
      finalizeOrder(paymentMethod === 'cod' ? 'Pending' : 'Paid');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      finalizeOrder('Paid');
    }, 1000);
  };

  const finalizeOrder = async (paymentStatus: 'Paid' | 'Pending') => {
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
      paymentMethod,
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
          description: `Order ${orderNum} confirmed with ${paymentMethod.toUpperCase()} (${paymentStatus}).`,
          completed: true,
        },
        {
          status: 'Crafting & Stitching',
          timestamp: 'Upcoming (1-2 days)',
          description: 'Saree drape and bespoke blouse tailoring in workshop.',
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
    const link = generateWhatsAppLink('8008889317', msg);
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
              {step === 'success' ? 'Order Confirmed' : '256-Bit Encrypted Secure Checkout'}
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
                  className="px-8 py-3 bg-[#2A2A2A] hover:bg-[#404040] text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
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
                    { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'netbanking', label: 'Net Banking', icon: Building },
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

                {/* UPI Configuration */}
                {paymentMethod === 'upi' && (
                  <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0] space-y-3 text-xs">
                    <p className="font-bold uppercase tracking-wider text-[10px] text-[#2A2A2A]">Instant UPI Payment</p>
                    <div className="flex flex-wrap gap-2">
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                        <button
                          type="button"
                          key={app}
                          onClick={() => setSelectedUpiApp(app)}
                          className={`px-3 py-1 border text-xs ${
                            selectedUpiApp === app
                              ? 'bg-[#2A2A2A] text-white border-[#2A2A2A]'
                              : 'bg-[#F5F2ED] border-[#DCD7D0] text-[#2A2A2A]'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">Enter UPI ID / VPA</label>
                      <input
                        type="text"
                        placeholder="yourname@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                      />
                    </div>
                  </div>
                )}

                {/* Card Configuration */}
                {paymentMethod === 'card' && (
                  <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0] space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#DCD7D0]">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-[#2A2A2A]">Card Details</span>
                      <span className="text-[9px] font-mono text-[#6B655E]">VISA • MASTERCARD • AMEX</span>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A] font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1">CVV</label>
                        <div className="relative">
                          <input
                            type={isCvvVisible ? 'text' : 'password'}
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 pr-10 text-xs text-[#2A2A2A] font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setIsCvvVisible((visible) => !visible)}
                            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#6B655E] hover:text-[#2A2A2A] cursor-pointer"
                            aria-label={isCvvVisible ? 'Hide CVV' : 'Show CVV'}
                            title={isCvvVisible ? 'Hide CVV' : 'Show CVV'}
                          >
                            {isCvvVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0] text-xs space-y-2">
                    <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2A2A2A]">Select Bank:</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                    </select>
                  </div>
                )}

                {/* COD */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-[#EAE5DF] border border-[#DCD7D0] text-xs text-[#2A2A2A] space-y-1">
                    <p className="font-bold uppercase tracking-wider text-[10px]">Cash on Delivery (COD)</p>
                    <p className="text-[#6B655E]">Pay cash upon delivery to the courier agent after inspecting the package.</p>
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
                  className="px-8 py-3.5 bg-[#2A2A2A] hover:bg-[#404040] text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Lock size={13} />
                  <span>Pay {formatCurrency(totalAmount, currency)}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: OTP Simulation */}
          {step === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="max-w-md mx-auto text-center space-y-5 py-4">
              <div className="w-12 h-12 bg-[#EAE5DF] border border-[#DCD7D0] text-[#2A2A2A] mx-auto flex items-center justify-center">
                <Lock size={18} />
              </div>

              <div>
                <h2 className="font-serif italic text-2xl text-[#2A2A2A]">Bank Security Check</h2>
                <p className="text-xs text-[#6B655E] mt-1 font-light">
                  Enter the 4-digit code sent to your registered mobile ending in <strong>4210</strong>.
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 border border-[#DCD7D0] bg-[#EAE5DF] font-mono text-xs text-[#2A2A2A]">
                  Demo Code: <strong>7392</strong>
                </span>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="7392"
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-[#F5F2ED] border border-[#2A2A2A] p-3 text-[#2A2A2A] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-4 py-2 border border-[#DCD7D0] text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2 bg-[#2A2A2A] text-white text-xs font-bold uppercase tracking-[0.2em] cursor-pointer"
                >
                  {isProcessing ? 'Verifying...' : 'Authorize'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success */}
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
                    <p className="text-[11px] text-[#6B655E]">Receive live tailoring photos and concierge status.</p>
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
