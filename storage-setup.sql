-- Run this in Supabase SQL Editor AFTER the main schema

-- Add maps_link if not exists
ALTER TABLE cafes ADD COLUMN IF NOT EXISTS maps_link TEXT;
ALTER TABLE cafes ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('cafe-avatars', 'cafe-avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cafe avatars
CREATE POLICY "Anyone can view cafe avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'cafe-avatars');

CREATE POLICY "Owners can upload cafe avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cafe-avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update cafe avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cafe-avatars' AND auth.uid() IS NOT NULL);

-- Storage policies for menu images
CREATE POLICY "Anyone can view menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

CREATE POLICY "Owners can upload menu images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update menu images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images' AND auth.uid() IS NOT NULL);
