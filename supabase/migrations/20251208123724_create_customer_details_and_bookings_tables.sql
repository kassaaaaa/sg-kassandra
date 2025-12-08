-- This migration creates the customer_details and bookings tables required for the guest booking flow.

-- Create the 'customer_details' table
CREATE TABLE public.customer_details (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Optional: Enable RLS (Row Level Security) if you plan to manage access
-- ALTER TABLE public.customer_details ENABLE ROW LEVEL SECURITY;

-- Create the 'bookings' table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES public.customer_details(id) ON DELETE CASCADE NOT NULL,
  lesson_id bigint NOT NULL, -- Corresponds to number type from frontend
  lesson_name text NOT NULL,
  start_time timestamp with time zone NOT NULL,
  status text DEFAULT 'pending_assignment' NOT NULL,
  booking_reference text UNIQUE NOT NULL DEFAULT concat('BOOK-', substr(md5(random()::text), 0, 8)),
  created_at timestamp with time zone DEFAULT now()
);

-- Optional: Enable RLS (Row Level Security) if you plan to manage access
-- ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
