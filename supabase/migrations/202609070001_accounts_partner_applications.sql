-- Customer accounts and partner applications for the UMUCURUZI marketplace.
-- Customer profile rows are keyed to Supabase Auth users; guest orders remain
-- supported because orders.customer_id stays nullable.

ALTER TABLE public.customers
  DROP CONSTRAINT IF EXISTS customers_id_fkey;

ALTER TABLE public.customers
  ADD CONSTRAINT customers_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS public.partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  business_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_type text NOT NULL,
  location text NOT NULL,
  notes text,
  accepts_privacy_terms boolean NOT NULL DEFAULT false,
  privacy_terms_accepted_at timestamptz,
  authorizes_pos_and_subscription boolean NOT NULL DEFAULT false,
  pos_subscription_accepted_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partner_applications_customer_id_idx
  ON public.partner_applications (customer_id);

CREATE INDEX IF NOT EXISTS partner_applications_status_created_at_idx
  ON public.partner_applications (status, created_at DESC);

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

-- Applications are written and reviewed through server-side routes using the
-- service-role client. No anonymous table access is granted.

DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
CREATE POLICY "Customers can view their own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Customers can view items from their own orders" ON public.order_items;
CREATE POLICY "Customers can view items from their own orders"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.orders
      WHERE public.orders.id = public.order_items.order_id
        AND public.orders.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Customers can view their own profile" ON public.customers;
CREATE POLICY "Customers can view their own profile"
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Customers can update their own profile" ON public.customers;
CREATE POLICY "Customers can update their own profile"
  ON public.customers
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
