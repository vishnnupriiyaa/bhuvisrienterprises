import { ShipmentStatus } from '../types';

/**
 * Carrier Integration Layer
 * Defines interfaces for different shipping carriers
 * Allows normalization of different carrier statuses
 */

export interface CarrierTrackingResponse {
  trackingNumber: string;
  status: ShipmentStatus;
  location?: string;
  estimatedDelivery?: string;
  events: Array<{
    status: ShipmentStatus;
    timestamp: string;
    location?: string;
    description: string;
  }>;
}

export interface ShippingProvider {
  /**
   * Create a shipment with the carrier
   */
  createShipment(
    orderId: string,
    weight: number,
    dimensions?: { length: number; width: number; height: number },
    origin?: { city: string; state: string; pincode: string },
    destination?: { city: string; state: string; pincode: string }
  ): Promise<{ trackingNumber: string; shipmentId?: string } | null>;

  /**
   * Get tracking information for a shipment
   */
  getTracking(trackingNumber: string): Promise<CarrierTrackingResponse | null>;

  /**
   * Normalize carrier-specific status to standard ShipmentStatus
   */
  normalizeStatus(carrierStatus: string): ShipmentStatus;

  /**
   * Generate tracking URL for the carrier
   */
  getTrackingUrl(trackingNumber: string): string;
}

/**
 * Base Carrier Implementation
 * Provides common functionality for carrier integrations
 */
export abstract class BaseCarrier implements ShippingProvider {
  protected carrierId: string;

  constructor(carrierId: string) {
    this.carrierId = carrierId;
  }

  abstract createShipment(
    orderId: string,
    weight: number,
    dimensions?: { length: number; width: number; height: number },
    origin?: { city: string; state: string; pincode: string },
    destination?: { city: string; state: string; pincode: string }
  ): Promise<{ trackingNumber: string; shipmentId?: string } | null>;

  abstract getTracking(trackingNumber: string): Promise<CarrierTrackingResponse | null>;

  abstract normalizeStatus(carrierStatus: string): ShipmentStatus;

  abstract getTrackingUrl(trackingNumber: string): string;

  /**
   * Validate tracking number format for this carrier
   */
  protected validateTrackingNumber(trackingNumber: string): boolean {
    return trackingNumber.length > 0;
  }
}

/**
 * Mock/Demo Carrier Implementation
 * Used for testing and demo purposes
 */
export class DemoCarrier extends BaseCarrier {
  constructor() {
    super('demo');
  }

  async createShipment(
    orderId: string,
    weight: number,
    dimensions?: { length: number; width: number; height: number },
    origin?: { city: string; state: string; pincode: string },
    destination?: { city: string; state: string; pincode: string }
  ): Promise<{ trackingNumber: string; shipmentId?: string } | null> {
    // Generate a demo tracking number
    const trackingNumber = `DEMO${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
    return { trackingNumber };
  }

  async getTracking(trackingNumber: string): Promise<CarrierTrackingResponse | null> {
    // Return mock tracking data
    const now = new Date();
    return {
      trackingNumber,
      status: 'IN_TRANSIT',
      location: 'Hyderabad, Telangana',
      estimatedDelivery: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      events: [
        {
          status: 'SHIPPED',
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Bengaluru, Karnataka',
          description: 'Shipment departed from origin facility',
        },
        {
          status: 'IN_TRANSIT',
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Hyderabad, Telangana',
          description: 'Shipment in transit',
        },
      ],
    };
  }

  normalizeStatus(carrierStatus: string): ShipmentStatus {
    const statusMap: Record<string, ShipmentStatus> = {
      'order placed': 'ORDER_PLACED',
      'payment confirmed': 'PAYMENT_CONFIRMED',
      'processing': 'PROCESSING',
      'packed': 'PACKED',
      'shipped': 'SHIPPED',
      'in transit': 'IN_TRANSIT',
      'out for delivery': 'OUT_FOR_DELIVERY',
      'delivered': 'DELIVERED',
      'delivery attempted': 'DELIVERY_ATTEMPTED',
      'delayed': 'DELAYED',
      'cancelled': 'CANCELLED',
    };
    return statusMap[carrierStatus.toLowerCase()] || 'IN_TRANSIT';
  }

  getTrackingUrl(trackingNumber: string): string {
    return `https://tracking.demo-carrier.com/${trackingNumber}`;
  }
}

/**
 * Carrier Registry
 * Manages available shipping providers
 */
export class CarrierRegistry {
  private carriers: Map<string, ShippingProvider> = new Map();

  constructor() {
    // Register default carriers
    this.register('demo', new DemoCarrier());
  }

  /**
   * Register a new carrier
   */
  register(carrierId: string, provider: ShippingProvider): void {
    this.carriers.set(carrierId.toLowerCase(), provider);
  }

  /**
   * Get a carrier by ID
   */
  getCarrier(carrierId: string): ShippingProvider | null {
    return this.carriers.get(carrierId.toLowerCase()) || null;
  }

  /**
   * Get all registered carriers
   */
  getAllCarriers(): string[] {
    return Array.from(this.carriers.keys());
  }

  /**
   * Check if a carrier is registered
   */
  hasCarrier(carrierId: string): boolean {
    return this.carriers.has(carrierId.toLowerCase());
  }
}

// Global registry instance
export const carrierRegistry = new CarrierRegistry();
