import React, { useState } from 'react';
import { Truck, Search, Check, X, MessageCircle } from 'lucide-react';
import { Order } from '../types';
import { formatCurrency, generateWhatsAppLink, getOrderWhatsAppText } from '../utils/formatters';

interface OrderTrackLookupProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currency: 'INR' | 'USD';
}

export const OrderTrackLookup: React.FC<OrderTrackLookupProps> = ({
  isOpen,
  onClose,
  orders,
  currency,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('AL-8492');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    orders.find((o) => o.orderNumber === 'AL-8492') || orders[0] || null
  );
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQ = searchQuery.trim().toUpperCase().replace('#', '');
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanQ ||
        o.orderNumber.toUpperCase() === `AL-${cleanQ}` ||
        o.customer.phone.includes(cleanQ) ||
        o.customer.email.toLowerCase() === cleanQ.toLowerCase()
    );

    if (found) {
      setSearchedOrder(found);
      setErrorNotice(null);
    } else {
      setSearchedOrder(null);
      setErrorNotice(`No order found matching "${searchQuery}". Please check your order ID or phone number.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="order-track-modal"
        className="relative bg-[#F5F2ED] w-full max-w-2xl border border-[#DCD7D0] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#EAE5DF] border-b border-[#DCD7D0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#F5F2ED] text-[#2A2A2A] border border-[#DCD7D0]">
              <Truck size={16} />
            </div>
            <div>
              <h1 className="font-serif italic text-xl text-[#2A2A2A]">
                Order Status & Tracking
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">Real-time artisan progress and courier transit</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#2A2A2A] hover:opacity-60 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-3 text-[#6B655E]" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. AL-8492) or Phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F2ED] border border-[#DCD7D0] pl-9 pr-3 py-2 text-xs text-[#2A2A2A] font-mono uppercase focus:outline-none focus:border-[#2A2A2A]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-[#2A2A2A] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer hover:bg-[#404040]"
            >
              Track
            </button>
          </form>

          {errorNotice && (
            <div className="p-3 bg-[#EAE5DF] border border-[#2A2A2A] text-xs text-[#2A2A2A]">
              {errorNotice}
            </div>
          )}

          {searchedOrder && (
            <div className="space-y-5">
              {/* Status Header Card */}
              <div className="p-4 bg-[#EAE5DF] border border-[#DCD7D0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#2A2A2A]">
                      Order #{searchedOrder.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-[#2A2A2A] text-white font-bold text-[9px] uppercase tracking-wider">
                      {searchedOrder.orderStatus}
                    </span>
                  </div>
                  <p className="text-[#6B655E] mt-1 text-xs">
                    Courier: <strong>{searchedOrder.courierPartner || 'BlueDart Air Express'}</strong> (AWB: <span className="font-mono">{searchedOrder.trackingNumber}</span>)
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-[#A68A64] font-bold mt-0.5">Est. Delivery: {searchedOrder.estimatedDelivery}</p>
                </div>

                <button
                  onClick={() => {
                    const msg = getOrderWhatsAppText(searchedOrder.orderNumber, searchedOrder.customer.name, searchedOrder.orderStatus);
                    const link = generateWhatsAppLink('8008889317', msg);
                    window.open(link, '_blank');
                  }}
                  className="px-3.5 py-2 bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp Updates</span>
                </button>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-3 bg-[#F5F2ED] p-4 border border-[#DCD7D0]">
                <h2 className="text-[10px] font-bold text-[#2A2A2A] uppercase tracking-[0.25em]">
                  Production & Dispatch Stages
                </h2>

                <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCD7D0]">
                  {searchedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative text-xs">
                      <span
                        className={`absolute -left-6 top-0.5 w-4 h-4 flex items-center justify-center text-[9px] ${
                          step.completed
                            ? 'bg-[#2A2A2A] text-white'
                            : 'bg-[#F5F2ED] border border-[#DCD7D0] text-[#6B655E]'
                        }`}
                      >
                        {step.completed ? <Check size={10} /> : idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <strong className={step.completed ? 'text-[#2A2A2A]' : 'text-[#6B655E]'}>
                            {step.status}
                          </strong>
                          <span className="text-[10px] text-[#6B655E]">({step.timestamp})</span>
                        </div>
                        <p className="text-[11px] text-[#6B655E] mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Snapshot */}
              <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0] text-xs space-y-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-[#2A2A2A] block">Included Items</span>
                {searchedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-[#DCD7D0] last:border-none">
                    <span>{it.product.name} (Size: {it.selectedSize})</span>
                    <span className="font-semibold text-[#2A2A2A]">{formatCurrency(it.itemTotal, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
