export type ProductCategory = 'sarees' | 'ethnic' | 'western' | 'accessories' | 'gifts' | 'custom';

export interface CustomizationDetails {
  blouseStyle?: string;
  sleeveLength?: string;
  neckline?: string;
  fallAndPico?: boolean;
  petticoatAdded?: boolean;
  monogramText?: string;
  customMeasurements?: {
    bust?: number;
    waist?: number;
    hips?: number;
    shoulder?: number;
    blouseLength?: number;
    sleeveLength?: number;
    skirtLength?: number;
    unit?: 'inches' | 'cm';
  };
  additionalNotes?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  location?: string;
}

export interface ProductColorVariant {
  id: string;
  name: string;
  hex: string;
  images: string[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  images: string[];
  fabric: string;
  color: string;
  colorHex: string;
  colorVariants?: ProductColorVariant[];
  occasion: string;
  description: string;
  craftDetails: string[];
  careInstructions: string;
  availableSizes: string[];
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isCustomizable: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  customizationBasePrice?: number;
  isActive?: boolean;
}

export interface CartItem {
  id: string; // unique for this cart instance
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
  isCustomized: boolean;
  customization?: CustomizationDetails;
  customizationFee: number;
  itemTotal: number;
}

export type OrderStatus = 'Order Placed' | 'Crafting & Stitching' | 'Quality Inspection' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'razorpay' | 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery: string;
  whatsappUpdates: boolean;
  notes?: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
    completed: boolean;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses?: CustomerDetails[];
}
