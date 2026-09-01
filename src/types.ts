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

export type ShipmentStatus = 
  | 'ORDER_PLACED'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_ATTEMPTED'
  | 'DELAYED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  location?: string;
  description: string;
  timestamp: string;
  carrierRawData?: Record<string, any>;
}

export interface Shipment {
  id: string;
  orderId: string;
  shipmentNumber: string;
  trackingNumber: string;
  carrier: string; // 'fedex', 'dhl', 'ups', 'india-post', 'xpressbees', etc.
  shippingMethod: string; // 'standard', 'express', 'overnight'
  shipmentStatus: ShipmentStatus;
  originLocation?: string;
  currentLocation?: string;
  destinationLocation?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  carrierTrackingUrl?: string;
  trackingEvents: TrackingEvent[];
  createdAt: string;
  updatedAt: string;
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
  shipmentId?: string;
  shipment?: Shipment;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses?: CustomerDetails[];
}
