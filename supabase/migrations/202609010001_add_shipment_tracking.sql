BEGIN;

-- Shipments table for tracking order shipments
CREATE TABLE IF NOT EXISTS public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  shipment_number text NOT NULL UNIQUE,
  tracking_number text NOT NULL,
  carrier text NOT NULL, -- e.g., 'fedex', 'dhl', 'ups', 'india-post', 'xpressbees'
  shipping_method text NOT NULL DEFAULT 'standard', -- e.g., 'standard', 'express', 'overnight'
  shipment_status text NOT NULL DEFAULT 'ORDER_PLACED',
  origin_location text,
  current_location text,
  destination_location text,
  estimated_delivery_date date,
  actual_delivery_date date,
  carrier_tracking_url text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Tracking events table for shipment timeline
CREATE TABLE IF NOT EXISTS public.tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  status text NOT NULL, -- e.g., 'ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'
  location text,
  description text NOT NULL DEFAULT '',
  timestamp timestamptz NOT NULL DEFAULT timezone('utc', now()),
  carrier_raw_data jsonb, -- Store raw carrier API response for reference
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Add shipment reference to orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipment_id uuid REFERENCES public.shipments(id) ON DELETE SET NULL;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment_id ON public.tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_orders_shipment_id ON public.orders(shipment_id);

COMMIT;
