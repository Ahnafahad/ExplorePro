# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage buckets for ExplorePro file uploads.

## Prerequisites

- Supabase project created (`aqmvbydjvacfislizjub.supabase.co`)
- Supabase anon key configured in `.env` files ✅

---

## Step 1: Access Supabase Storage

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `aqmvbydjvacfislizjub`
3. Click on **Storage** in the left sidebar
4. Click **New bucket**

---

## Step 2: Create "profiles" Bucket

**For storing user profile photos**

### Settings:
- **Name**: `profiles`
- **Public bucket**: ✅ YES (Enable public access)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

### Steps:
1. Click **New bucket**
2. Enter name: `profiles`
3. Toggle **Public bucket** to ON
4. Click **Create bucket**
5. Click on the `profiles` bucket
6. Go to **Configuration** tab
7. Set **File size limit**: 5242880 bytes (5 MB)
8. Under **Allowed MIME types**, add:
   ```
   image/jpeg
   image/jpg
   image/png
   image/webp
   ```
9. Click **Save**

---

## Step 3: Create "verifications" Bucket

**For storing guide verification documents (IDs, certifications)**

### Settings:
- **Name**: `verifications`
- **Public bucket**: ❌ NO (Private bucket - only admins can view)
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `application/pdf`

### Steps:
1. Click **New bucket**
2. Enter name: `verifications`
3. Keep **Public bucket** OFF (for privacy)
4. Click **Create bucket**
5. Click on the `verifications` bucket
6. Go to **Configuration** tab
7. Set **File size limit**: 10485760 bytes (10 MB)
8. Under **Allowed MIME types**, add:
   ```
   image/jpeg
   image/jpg
   image/png
   application/pdf
   ```
9. Click **Save**

---

## Step 4: Set Up Bucket Policies (Important!)

### Profiles Bucket Policies

1. Click on `profiles` bucket
2. Go to **Policies** tab
3. Click **New policy**

#### Policy 1: Allow Public Read
```sql
-- Policy name: Public read access
-- Allowed operation: SELECT

CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');
```

#### Policy 2: Allow Authenticated Upload
```sql
-- Policy name: Authenticated users can upload
-- Allowed operation: INSERT

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);
```

#### Policy 3: Allow User Update Own File
```sql
-- Policy name: Users can update own files
-- Allowed operation: UPDATE

CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);
```

#### Policy 4: Allow User Delete Own File
```sql
-- Policy name: Users can delete own files
-- Allowed operation: DELETE

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Verifications Bucket Policies

1. Click on `verifications` bucket
2. Go to **Policies** tab
3. Click **New policy**

#### Policy 1: Allow Authenticated Upload
```sql
-- Policy name: Authenticated users can upload
-- Allowed operation: INSERT

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verifications' AND
  auth.role() = 'authenticated'
);
```

#### Policy 2: Allow Admins Read
```sql
-- Policy name: Admins can read all files
-- Allowed operation: SELECT

-- NOTE: You'll need to implement admin role checking
-- For now, allow authenticated users to read their own files

CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verifications' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Step 5: Configure CORS (If Needed)

If you encounter CORS errors:

1. Go to **Project Settings** → **API**
2. Scroll to **CORS Configuration**
3. Add your frontend URLs:
   ```
   http://localhost:5173
   https://your-app.vercel.app
   ```

---

## Step 6: Test Upload

### Test from Frontend

1. Start your frontend: `cd frontend && npm run dev`
2. Go to Guide Profile Setup page
3. Try uploading a profile photo
4. Check Supabase Storage dashboard to see uploaded file

### Verify Upload

1. In Supabase Dashboard → Storage
2. Click on `profiles` bucket
3. You should see a folder named `profile/`
4. Inside, you should see `{userId}-{timestamp}.{extension}`

---

## Quick Setup (SQL Script)

If you prefer SQL, run this in Supabase SQL Editor:

```sql
-- Enable storage if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles bucket policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Verifications bucket policies
CREATE POLICY "Authenticated users can upload verifications"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verifications' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can read own verifications"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verifications' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Troubleshooting

### Error: "Bucket not found"
- Make sure you created both `profiles` and `verifications` buckets
- Check bucket names are exactly as specified (lowercase)

### Error: "Policy violation"
- Verify policies are created correctly
- Check that user is authenticated
- For `verifications` bucket, ensure it's set to private

### Error: "File too large"
- Check file size limits (5MB for profiles, 10MB for verifications)
- Verify MIME type is allowed

### Error: "CORS error"
- Add your frontend URL to CORS configuration
- Check API URL in frontend `.env` matches backend

---

## File Structure in Storage

After setup, your storage will look like:

```
profiles/
  └── profile/
      ├── {userId1}-1699564800.jpg
      ├── {userId2}-1699564900.png
      └── ...

verifications/
  └── verification/
      ├── {userId1}-1699565000.pdf
      ├── {userId2}-1699565100.jpg
      └── ...
```

---

## Environment Variables (Already Set ✅)

**Frontend (`.env`)**:
```
VITE_SUPABASE_URL=https://aqmvbydjvacfislizjub.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Backend (`.env`)**:
```
SUPABASE_URL=https://aqmvbydjvacfislizjub.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

---

## Features Enabled

✅ Profile photo uploads
✅ Verification document uploads
✅ File validation (size, type)
✅ Automatic filename generation
✅ Public URLs for profile photos
✅ Private storage for verification documents
✅ User can only access their own files

---

## Next Steps

1. Create the two storage buckets in Supabase Dashboard
2. Set up policies as described above
3. Test file upload on Profile Setup page
4. Verify files appear in Supabase Storage

Once complete, your file upload system will be fully functional!
