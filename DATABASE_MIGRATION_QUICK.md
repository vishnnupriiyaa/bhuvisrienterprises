# 🚀 QUICK DEPLOYMENT - Database Migration

## Copy-Paste Ready SQL for Supabase

**Location:** Supabase Dashboard → SQL Editor → + New Query

**Step-by-step:**
1. Open https://app.supabase.com
2. Select your project
3. Click "SQL Editor" (left sidebar)
4. Click "+ New Query"
5. **Copy everything below** and paste into editor
6. Click "RUN" button

---

## PASTE THIS INTO SUPABASE SQL EDITOR:

```sql
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
```

---

## ✅ VERIFICATION

After running query, you should see: **"Query executed successfully"**

Then verify tables exist by going to **Table Editor** and checking:
- ✅ `shipments` table appears
- ✅ `tracking_events` table appears
- ✅ `orders` table has new `shipment_id` column

---

## 📊 WHAT THIS CREATES

| Table | Columns | Purpose |
|-------|---------|---------|
| `shipments` | 14 | Stores shipment data (tracking number, carrier, status, location) |
| `tracking_events` | 7 | Stores timeline of tracking events for each shipment |
| `orders.*` | +1 (shipment_id) | New column linking orders to shipments |

| Index | On | Purpose |
|-------|----|----|
| `idx_shipments_order_id` | shipments.order_id | Fast lookup by order |
| `idx_shipments_tracking_number` | shipments.tracking_number | Fast public tracking lookup |
| `idx_tracking_events_shipment_id` | tracking_events.shipment_id | Fast event timeline retrieval |
| `idx_orders_shipment_id` | orders.shipment_id | Fast order→shipment lookup |

---

## ⏱️ TIME REQUIRED

- Paste SQL: 1 minute
- Execute query: 10 seconds
- Verify tables: 1 minute
- **Total: ~2-3 minutes**

---

## 🎯 DEPLOYMENT STATUS

After running this SQL:

✅ Database layer ready  
✅ Tables created  
✅ Indexes optimized  
✅ Foreign keys enforced  
✅ Ready for shipment operations  

Then your app can:
- Create shipments
- Add tracking events
- Update shipment status
- Track deliveries
- View order shipments

---

## ❌ TROUBLESHOOTING

### "Error: Table orders does not exist"
- Order table hasn't been created yet
- Run other migrations first

### "Error: Column shipment_id already exists"
- Already run this migration before
- It's safe to run again (uses "IF NOT EXISTS")

### Query won't execute
- Make sure you're in correct Supabase project
- Click RUN button (not just highlight text)
- Check for typos (copy-paste should be fine)

### Want to check manually?
Run this query to verify:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('shipments', 'tracking_events')
ORDER BY table_name;
```

Should return 2 rows.

---

## ✨ THAT'S IT!

Once this runs successfully:
- ✅ Database ready
- ✅ Code already deployed to Vercel
- ✅ Your shipment tracking system is LIVE

Visit: www.bhuvisrienterprises.com

Your new shipment tracking system is now active! 🎉

