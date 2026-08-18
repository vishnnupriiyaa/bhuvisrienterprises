export const formatCurrency = (amount: number, currency: 'INR' | 'USD' = 'INR'): string => {
  if (currency === 'USD') {
    const usd = (amount / 86).toFixed(0);
    return `$${Number(usd).toLocaleString('en-US')}`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const generateWhatsAppLink = (phone: string = '919876543210', message: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
};

export const getProductWhatsAppText = (productName: string, sku: string, price: number, url?: string): string => {
  return `Hello Aura & Loom Atelier! ✨\nI am interested in *${productName}* (SKU: ${sku}, Price: ₹${price.toLocaleString('en-IN')}).\nCan you please share more details, fabric video drape or size consultation?`;
};

export const getOrderWhatsAppText = (orderNumber: string, customerName: string, status: string): string => {
  return `Namaste ${customerName}! 🌸\nYour Aura & Loom Order *#${orderNumber}* status update: *${status}*.\nWe are carefully crafting and packing your bespoke pieces. Tap here to chat with our stylist.`;
};

export const getCustomConsultationWhatsAppText = (customerName: string, category: string, reqNum?: string): string => {
  return `Hello Aura & Loom Atelier! ✨\nMy name is *${customerName}*. I would like to schedule a bespoke consultation for: *${category}*${reqNum ? ` (Ref #${reqNum})` : ''}.\nPlease let me know available slots for a video call or styling discussion.`;
};
