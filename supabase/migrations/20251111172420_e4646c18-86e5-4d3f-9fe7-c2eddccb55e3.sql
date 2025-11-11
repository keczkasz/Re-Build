-- Create storage buckets for avatars and material images
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('material-images', 'material-images', true);

-- RLS Policies for avatars bucket
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- RLS Policies for material-images bucket
CREATE POLICY "Authenticated users can upload material images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'material-images');

CREATE POLICY "Users can update their own material images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'material-images');

CREATE POLICY "Users can delete their own material images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'material-images');

CREATE POLICY "Material images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'material-images');