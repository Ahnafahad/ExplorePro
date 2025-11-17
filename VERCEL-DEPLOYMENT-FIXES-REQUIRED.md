# 🚨 CRITICAL: Vercel Environment Variable Fixes Required

**Before the next deployment can work, you MUST update these environment variables in Vercel Dashboard**

---

## ⚠️ **CRITICAL FIX #1: DATABASE_URL (MUST FIX!)**

**Current Problem:** Using session pooler (port 5432) which doesn't work with Vercel serverless

**Required Action in Vercel Dashboard:**

1. Go to: Settings → Environment Variables
2. Find: `DATABASE_URL`
3. **Change to (Transaction Pooler for Serverless):**

```
postgresql://postgres.aqmvbydjvacfislizjub:qD5J!9aw7GBEJF/@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Why this matters:**
- Vercel serverless functions are stateless
- Session pooler (port 5432) requires persistent connections
- Transaction pooler (port 6543) is designed for serverless
- **Without this, ALL database queries will fail!**

---

## ✅ **VERIFY: Frontend Environment Variables**

Make sure these exist in Vercel (Settings → Environment Variables):

```bash
VITE_API_URL=https://explore-pro.vercel.app
VITE_GOOGLE_MAPS_API_KEY=AIzaSyA38JeaL-YNKvv4sgSrBr1--lwxBadPD5I
VITE_SUPABASE_URL=https://aqmvbydjvacfislizjub.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbXZieWRqdmFjZmlzbGl6anViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjQ3NDksImV4cCI6MjA3ODYwMDc0OX0.JWOPsfSIlyMCzuCTe-wTlHBhlL3ZdCXsmEIQm8Hd6e8
```

All should have **"Production"** environment selected.

---

## ✅ **VERIFY: Backend Environment Variables**

Make sure these exist:

```bash
NODE_ENV=production
FRONTEND_URL=https://explore-pro.vercel.app
JWT_SECRET=explorepro_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRES_IN=7d
GOOGLE_MAPS_API_KEY=AIzaSyA38JeaL-YNKvv4sgSrBr1--lwxBadPD5I
SUPABASE_URL=https://aqmvbydjvacfislizjub.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbXZieWRqdmFjZmlzbGl6anViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjQ3NDksImV4cCI6MjA3ODYwMDc0OX0.JWOPsfSIlyMCzuCTe-wTlHBhlL3ZdCXsmEIQm8Hd6e8
SENDGRID_FROM_EMAIL=noreply@explorepro.com
```

---

## 📋 **What's Been Fixed in Code:**

✅ Backend builds with dev dependencies (includes TypeScript)
✅ Frontend builds with dev dependencies
✅ API entry point imports from compiled backend (backend/dist/server.js)
✅ Vercel.json configured for serverless deployment
✅ Rewrites route /api/* to serverless function

---

## 🚀 **Next Steps:**

### **1. Update DATABASE_URL in Vercel** ← **DO THIS FIRST!**

### **2. Verify All Environment Variables**
- Check that all VITE_ variables exist
- Check that all backend variables exist
- Ensure "Production" environment is selected for all

### **3. Push Latest Code**
```bash
git push origin master
```

### **4. Monitor Deployment**
- Go to: https://vercel.com/ahnaf-ahads-projects/explore-pro/deployments
- Wait for build to complete
- Check for errors

### **5. Test After Deployment**
- Visit: https://explore-pro.vercel.app
- Try demo login: `demo.tourist@explorepro.com` / `Demo123!`
- Check browser console for errors
- Test API: https://explore-pro.vercel.app/api/health

---

## ⚡ **Expected Build Time:**
- ~2-3 minutes (installing deps takes longest)

## ✅ **Success Indicators:**
- Build shows "Deployment completed"
- No TypeScript errors
- No "command not found" errors
- API responds at /api/health
- Demo login works

## ❌ **Failure Indicators:**
- "Can't reach database server" → DATABASE_URL not updated
- "localhost:5000" in browser console → VITE_API_URL not set
- "tsc: command not found" → Dev dependencies not installing (already fixed)
- 404 on /api/* → Serverless function not deployed

---

**CRITICAL:** The DATABASE_URL MUST be updated to transaction pooler or nothing will work!
