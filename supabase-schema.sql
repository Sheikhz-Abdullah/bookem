-- =============================================
-- BOOKEM DATABASE SETUP
-- Run this in Supabase SQL Editor
-- =============================================

-- CAFES TABLE
CREATE TABLE cafes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT,
  phone TEXT,
  cuisine TEXT DEFAULT 'Cafe & Bistro',
  seating TEXT DEFAULT 'Indoor & Outdoor',
  description TEXT,
  hours JSONB,
  maps_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MENU ITEMS TABLE
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  calories INTEGER,
  protein INTEGER,
  diet TEXT DEFAULT 'veg',
  emoji TEXT DEFAULT '🍽️',
  badge TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOOKINGS TABLE
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  booking_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- CAFES: owners manage their own, public can read by slug
CREATE POLICY "Owners manage own cafe" ON cafes
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Public can read cafes" ON cafes
  FOR SELECT USING (true);

-- MENU ITEMS: owners manage, public can read visible items
CREATE POLICY "Owners manage own menu" ON menu_items
  FOR ALL USING (
    cafe_id IN (SELECT id FROM cafes WHERE owner_id = auth.uid())
  );

CREATE POLICY "Public can read visible menu items" ON menu_items
  FOR SELECT USING (visible = true);

-- BOOKINGS: owners see their cafe bookings, anyone can insert
CREATE POLICY "Owners see own bookings" ON bookings
  FOR ALL USING (
    cafe_id IN (SELECT id FROM cafes WHERE owner_id = auth.uid())
  );

CREATE POLICY "Anyone can create booking" ON bookings
  FOR INSERT WITH CHECK (true);

-- =============================================
-- SAMPLE DATA (optional - for testing)
-- Comment this out after testing
-- =============================================

-- INSERT INTO cafes (owner_id, name, slug, location, phone, cuisine, seating, description, hours)
-- VALUES (
--   auth.uid(),
--   'Sands Bistro',
--   'sandsbistro',
--   'Al Qasba Canal Walk, Sharjah',
--   '+971 6 000 0000',
--   'Cafe & Bistro',
--   'Indoor & Outdoor',
--   'A relaxed all-day bistro on the Al Qasba canal.',
--   '{"Saturday":{"open":"08:00","close":"23:00","enabled":true},"Sunday":{"open":"08:00","close":"23:00","enabled":true},"Monday":{"open":"08:00","close":"23:00","enabled":true},"Tuesday":{"open":"08:00","close":"23:00","enabled":true},"Wednesday":{"open":"08:00","close":"23:00","enabled":true},"Thursday":{"open":"08:00","close":"23:00","enabled":true},"Friday":{"open":"12:00","close":"23:00","enabled":true}}'
-- );
