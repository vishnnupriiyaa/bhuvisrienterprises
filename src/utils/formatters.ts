export const formatCurrency = (amount: number, currency: 'INR' | 'USD' = 'INR'): string => {
  if (currency === 'USD') {
    const usd = (amount / 86).toFixed(0);
    return `$${Number(usd).toLocaleString('en-US')}`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const STORE_WHATSAPP_NUMBER = '918008889317';

export const generateWhatsAppLink = (phone: string = STORE_WHATSAPP_NUMBER, message: string): string => {
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  const cleanPhone = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly.replace(/^0(?=\d{10}$)/, '91');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
};

export const getProductWhatsAppText = (productName: string, sku: string, price: number, url?: string): string => {
  return `Hello BhuviSri Enterprises ! \nI am interested in *${productName}* (SKU: ${sku}, Price: ₹${price.toLocaleString('en-IN')}).\nCan you please share more details, fabric video drape or size consultation?`;
};

export const getOrderWhatsAppText = (orderNumber: string, customerName: string, status: string): string => {
  return `Namaste ${customerName}! \nYour BhuviSri Enterprises Order *#${orderNumber}* status update: *${status}*.\nWe are carefully preparing and packing your pieces. Tap here to chat with our team.`;
};

