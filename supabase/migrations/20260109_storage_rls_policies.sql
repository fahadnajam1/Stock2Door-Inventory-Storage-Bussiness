-- Storage RLS policies for products bucket
-- Allow authenticated users to upload/download/delete files in their own folder

-- Policy: Allow authenticated users to upload files to their own folder
create policy "authenticated_upload_own_folder" on storage.objects
  for insert
  with check (
    bucket_id = 'products'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Allow authenticated users to read their own files
create policy "authenticated_read_own_files" on storage.objects
  for select
  using (
    bucket_id = 'products'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Allow authenticated users to delete their own files
create policy "authenticated_delete_own_files" on storage.objects
  for delete
  using (
    bucket_id = 'products'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read access to files (for displaying product images)
create policy "public_read_products" on storage.objects
  for select
  using (bucket_id = 'products');
