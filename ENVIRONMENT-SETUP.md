# Environment Variables Setup

## ✅ Files Created (All GITIGNORED)

### **Production Environment Files:**

1. **`.vercel-env-variables.local`** (root)
   - Complete list of all environment variables needed for Vercel
   - Copy values from here when adding to Vercel Dashboard
   - Updated with production URL: `https://explore-pro.vercel.app`

2. **`backend/.env.production`**
   - Backend production environment variables
   - Contains database, JWT, Stripe, Supabase credentials
   - Ready to use for local testing with production settings

3. **`frontend/.env.production`**
   - Frontend production environment variables
   - Contains API URL, Google Maps, Stripe publishable keys
   - All variables prefixed with `VITE_` for Vite build tool

---

## 🔐 Security Status

All environment files are properly gitignored:

```
✅ .env
✅ .env.local
✅ .env.*.local
✅ .env.production
✅ .vercel-env-variables.local
✅ backend/.env
✅ backend/.env.production
✅ frontend/.env
✅ frontend/.env.production
```

**Template files (safe to commit):**
- `backend/.env.example`
- `frontend/.env.example`

---

## 📋 How to Use

### For Vercel Deployment:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Open `.vercel-env-variables.local` file
3. Copy each variable name and value
4. Add to Vercel (select "Production" environment)
5. Redeploy after adding all variables

### For Local Development:

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your local values
npm run dev
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env with your local values (use http://localhost:5000 for VITE_API_URL)
npm run dev
```

---

## 🌐 Production URLs (Updated)

- **Frontend**: https://explore-pro.vercel.app
- **Backend API**: https://explore-pro.vercel.app/api
- **Database**: Supabase PostgreSQL (Session Pooler)
- **Storage**: Supabase Storage (profiles, verifications buckets)

---

## 🔑 Critical Variables Summary

### Must Have (App Won't Work Without):
- `DATABASE_URL` - Supabase PostgreSQL connection
- `JWT_SECRET` - Authentication token secret
- `FRONTEND_URL` - Production URL
- `VITE_API_URL` - Backend API endpoint
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` - File uploads

### Optional (App Will Work, Features Limited):
- `STRIPE_SECRET_KEY` - Payment processing
- `STRIPE_WEBHOOK_SECRET` - Payment confirmations
- `VITE_STRIPE_PUBLISHABLE_KEY` - Frontend payments
- `SENDGRID_API_KEY` - Email notifications
- `GOOGLE_MAPS_API_KEY` - Maps functionality

---

## ⚠️ Security Reminders

1. **Never commit `.env` files to Git** ✅ Already protected
2. **Generate new JWT_SECRET for production:**
   ```bash
   openssl rand -base64 32
   ```
3. **Use Stripe test keys for MVP** (test mode is safe)
4. **Rotate secrets regularly** in production

---

## 🐛 Troubleshooting

**If demo accounts don't work after deployment:**
- Check that all variables are added in Vercel
- Verify `DATABASE_URL` is correct (session pooler URL)
- Ensure you redeployed after adding environment variables
- Check Vercel build logs for errors

**If API calls fail:**
- Verify `VITE_API_URL` matches your production URL + `/api`
- Check browser console for CORS errors
- Ensure `FRONTEND_URL` is set correctly in backend

**If file uploads fail:**
- Verify Supabase storage buckets exist (`profiles`, `verifications`)
- Check bucket policies are set up correctly
- Ensure `SUPABASE_ANON_KEY` is correct in both backend and frontend

---

## 📝 Next Steps

After adding environment variables to Vercel:

1. ✅ Redeploy the application
2. ✅ Test demo accounts:
   - Tourist: `demo.tourist@explorepro.com` / `Demo123!`
   - Guide: `demo.guide@explorepro.com` / `Demo123!`
   - Admin: `demo.admin@explorepro.com` / `Demo123!`
3. ✅ Verify file uploads work
4. ✅ Test booking flow (if Stripe keys added)
5. ✅ Configure Stripe webhook (for payment confirmations)

---

**Last Updated:** 2025-01-17
**Production URL:** https://explore-pro.vercel.app
