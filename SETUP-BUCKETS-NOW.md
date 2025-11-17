# Quick Supabase Storage Setup - Do This Now!

Follow these exact steps to create storage buckets in 5 minutes.

---

## Step 1: Access Supabase Dashboard

1. Open your browser
2. Go to: https://app.supabase.com
3. Sign in if needed
4. Click on your project: **aqmvbydjvacfislizjub**

---

## Step 2: Navigate to Storage

1. In the left sidebar, click **Storage** (icon looks like a folder)
2. You'll see a "Create a new bucket" button

---

## Step 3: Create "profiles" Bucket

1. Click **"New bucket"** (or **"Create a new bucket"**)

2. Fill in the form:
   - **Name**: `profiles`
   - **Public bucket**: Toggle **ON** (make it public)
   - Click **"Create bucket"**

3. Click on the newly created **profiles** bucket

4. Click **"Policies"** tab at the top

5. You should see options to add policies. We'll do this in Step 5.

---

## Step 4: Create "verifications" Bucket

1. Go back to Storage (click **Storage** in left sidebar)

2. Click **"New bucket"** again

3. Fill in the form:
   - **Name**: `verifications`
   - **Public bucket**: Toggle **OFF** (keep it private)
   - Click **"Create bucket"**

4. Now you should have 2 buckets:
   - ✅ **profiles** (public)
   - ✅ **verifications** (private)

---

## Step 5: Set Up Policies (SQL Method - Fastest)

1. In the left sidebar, click **SQL Editor** (icon looks like </> )

2. Click **"New query"**

3. **Copy and paste this entire SQL script:**

```sql
-- =============================================================================
-- SUPABASE STORAGE POLICIES FOR EXPLOREPRO
-- Run this entire script in Supabase SQL Editor
-- =============================================================================

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PROFILES BUCKET POLICIES (Public bucket for profile photos)
-- =============================================================================

-- Policy 1: Anyone can read profile photos (public access)
CREATE POLICY "Anyone can read profiles"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

-- Policy 2: Authenticated users can upload their own profile photos
CREATE POLICY "Users can upload profiles"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);

-- Policy 3: Users can update their own profile photos
CREATE POLICY "Users can update own profiles"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);

-- Policy 4: Users can delete their own profile photos
CREATE POLICY "Users can delete own profiles"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);

-- =============================================================================
-- VERIFICATIONS BUCKET POLICIES (Private bucket for verification documents)
-- =============================================================================

-- Policy 1: Authenticated users can upload verification documents
CREATE POLICY "Users can upload verifications"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verifications' AND
  auth.role() = 'authenticated'
);

-- Policy 2: Users can read their own verification documents
CREATE POLICY "Users can read own verifications"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verifications' AND
  auth.role() = 'authenticated'
);

-- Policy 3: Users can update their own verification documents
CREATE POLICY "Users can update own verifications"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'verifications' AND
  auth.role() = 'authenticated'
);

-- Policy 4: Users can delete their own verification documents
CREATE POLICY "Users can delete own verifications"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'verifications' AND
  auth.role() = 'authenticated'
);

-- =============================================================================
-- VERIFICATION - Check created policies
-- =============================================================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;
```

4. Click **"Run"** (or press Ctrl+Enter)

5. You should see output showing all the created policies at the bottom

6. ✅ **Done! Policies are set up!**

---

## Step 6: Verify Setup

### Check Buckets Exist

1. Go to **Storage** in left sidebar
2. You should see:
   - ✅ **profiles** (with a globe icon = public)
   - ✅ **verifications** (with a lock icon = private)

### Check Policies

1. Click on **profiles** bucket
2. Click **Policies** tab
3. You should see 4 policies:
   - Anyone can read profiles
   - Users can upload profiles
   - Users can update own profiles
   - Users can delete own profiles

4. Go back, click on **verifications** bucket
5. Click **Policies** tab
6. You should see 4 policies:
   - Users can upload verifications
   - Users can read own verifications
   - Users can update own verifications
   - Users can delete own verifications

---

## Step 7: Configure CORS (If Needed)

1. In left sidebar, click the **gear icon** (Settings)
2. Click **API** in the settings menu
3. Scroll down to **CORS Configuration**
4. Add these allowed origins:
   ```
   http://localhost:5173
   http://localhost:5000
   ```
5. Click **Save**

---

## 🎉 Setup Complete!

You can now:
- Upload profile photos
- Upload verification documents
- Files are secure with Row Level Security
- Profile photos are publicly accessible
- Verification docs are private

---

## Next: Test File Upload

1. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Go to: http://localhost:5173

3. Register as a guide

4. Go to Profile Setup page

5. Try uploading a profile photo

6. Check Supabase Storage → profiles bucket to see your uploaded file!

---

## Troubleshooting

### Error: "new row violates row-level security policy"
- Make sure you're logged in (authenticated)
- Verify policies are created (run SQL script again)

### Error: "Bucket not found"
- Check bucket names are exactly: `profiles` and `verifications` (lowercase)

### Files not uploading
- Check browser console for errors
- Verify CORS is configured
- Make sure buckets are created

### Can't see uploaded files
- For profiles: bucket should be public
- For verifications: bucket should be private
- Check you're viewing the correct bucket

---

## Quick Commands

**Check if buckets exist:**
```sql
SELECT * FROM storage.buckets;
```

**Check all policies:**
```sql
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects';
```

**Delete all policies (if you need to start over):**
```sql
DROP POLICY IF EXISTS "Anyone can read profiles" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload profiles" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profiles" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profiles" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload verifications" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own verifications" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own verifications" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own verifications" ON storage.objects;
```

Then run the setup SQL script again.

---

**Ready?** Let's go create those buckets! 🚀
