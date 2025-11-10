# ExplorePro MVP Development Roadmap

## Current Status: Infrastructure Complete (20%)
## Required for Working MVP: 80% Remaining

---

## Phase 1: Authentication (3-4 days) - CRITICAL

### Backend Implementation
- [ ] Implement user registration with bcrypt password hashing
- [ ] Implement login with JWT token generation
- [ ] Implement password validation (min 8 chars, complexity)
- [ ] Add email uniqueness check
- [ ] Implement "Get current user" endpoint
- [ ] Add rate limiting to auth endpoints

### Frontend Implementation
- [ ] Create Login page (`frontend/src/pages/auth/Login.tsx`)
- [ ] Create Register page (`frontend/src/pages/auth/Register.tsx`)
- [ ] Create role selection (Tourist vs Guide) on registration
- [ ] Add form validation with React Hook Form + Zod
- [ ] Add error handling and user feedback
- [ ] Implement protected routes
- [ ] Add logout functionality

**Files to Create:**
- `backend/src/controllers/authController.ts`
- `backend/src/services/authService.ts`
- `frontend/src/pages/auth/Login.tsx`
- `frontend/src/pages/auth/Register.tsx`
- `frontend/src/components/common/ProtectedRoute.tsx`

---

## Phase 2: Guide Profiles (2-3 days) - CRITICAL

### Backend Implementation
- [ ] Implement create guide profile endpoint
- [ ] Implement get guide profile endpoint
- [ ] Implement update guide profile
- [ ] Implement list guides with filters (language, specialty, availability)
- [ ] Implement guide availability toggle
- [ ] Add file upload for verification documents (Supabase)
- [ ] Add pagination for guide listings

### Frontend Implementation
- [ ] Create Guide Dashboard (`frontend/src/pages/guide/Dashboard.tsx`)
- [ ] Create Guide Profile Setup (`frontend/src/pages/guide/ProfileSetup.tsx`)
- [ ] Create Guide Profile Edit page
- [ ] Create Browse Guides page (`frontend/src/pages/tourist/BrowseGuides.tsx`)
- [ ] Create Guide Profile View page
- [ ] Add search and filter components
- [ ] Add file upload component for documents

**Files to Create:**
- `backend/src/controllers/guideController.ts`
- `backend/src/services/guideService.ts`
- `backend/src/utils/fileUpload.ts`
- `frontend/src/pages/guide/Dashboard.tsx`
- `frontend/src/pages/guide/ProfileSetup.tsx`
- `frontend/src/pages/tourist/BrowseGuides.tsx`
- `frontend/src/components/guide/GuideCard.tsx`
- `frontend/src/components/common/FileUpload.tsx`

---

## Phase 3: Tour Offerings (1-2 days) - HIGH PRIORITY

### Backend Implementation
- [ ] Implement create tour endpoint
- [ ] Implement get tours for guide
- [ ] Implement update tour
- [ ] Implement delete tour
- [ ] Add validation for tour data

### Frontend Implementation
- [ ] Create Tour Management page (`frontend/src/pages/guide/Tours.tsx`)
- [ ] Create Add Tour modal/page
- [ ] Create Edit Tour form
- [ ] Display tours on guide profile

**Files to Create:**
- `backend/src/routes/tours.ts`
- `backend/src/controllers/tourController.ts`
- `backend/src/services/tourService.ts`
- `frontend/src/pages/guide/Tours.tsx`
- `frontend/src/components/guide/TourForm.tsx`

---

## Phase 4: Booking System (3-4 days) - CRITICAL

### Backend Implementation
- [ ] Implement create booking (instant & scheduled)
- [ ] Implement get bookings for user
- [ ] Implement get booking details
- [ ] Implement start tour endpoint
- [ ] Implement complete tour endpoint
- [ ] Implement cancel booking with refund calculation
- [ ] Add booking validation (guide availability, time conflicts)
- [ ] Calculate pricing with commission

### Frontend Implementation
- [ ] Create Book Tour page (`frontend/src/pages/tourist/BookTour.tsx`)
- [ ] Create Tourist Dashboard with bookings (`frontend/src/pages/tourist/Dashboard.tsx`)
- [ ] Create Guide Bookings page (`frontend/src/pages/guide/Bookings.tsx`)
- [ ] Create Booking Details page
- [ ] Add booking status tracking
- [ ] Add tour start/complete buttons for guides
- [ ] Add cancellation with refund display

**Files to Create:**
- `backend/src/controllers/bookingController.ts`
- `backend/src/services/bookingService.ts`
- `frontend/src/pages/tourist/BookTour.tsx`
- `frontend/src/pages/tourist/Dashboard.tsx`
- `frontend/src/pages/guide/Bookings.tsx`
- `frontend/src/components/booking/BookingCard.tsx`
- `frontend/src/components/booking/BookingForm.tsx`

---

## Phase 5: Stripe Payment Integration (2-3 days) - CRITICAL

### Backend Implementation
- [ ] Set up Stripe SDK
- [ ] Implement create payment intent
- [ ] Implement Stripe webhook handler
- [ ] Implement refund processing
- [ ] Store payment records in database
- [ ] Handle payment failures

### Frontend Implementation
- [ ] Install Stripe Elements
- [ ] Create Checkout component
- [ ] Implement payment form
- [ ] Add payment success/failure handling
- [ ] Display payment status in bookings

**Files to Create:**
- `backend/src/services/stripeService.ts`
- `backend/src/controllers/webhookController.ts`
- `backend/src/routes/webhooks.ts`
- `frontend/src/components/payment/CheckoutForm.tsx`
- `frontend/src/pages/tourist/PaymentSuccess.tsx`
- `frontend/src/pages/tourist/PaymentFailed.tsx`

---

## Phase 6: Google Maps Integration (2-3 days) - HIGH PRIORITY

### Backend Implementation
- [ ] Implement location update endpoint
- [ ] Store location updates in database
- [ ] Add location to polling service updates

### Frontend Implementation
- [ ] Create Map component with Google Maps API
- [ ] Add location picker for meeting points
- [ ] Create real-time location tracking view
- [ ] Display guide location during active tour
- [ ] Add "Current Location" button

**Files to Create:**
- `frontend/src/components/maps/Map.tsx`
- `frontend/src/components/maps/LocationPicker.tsx`
- `frontend/src/components/maps/LiveTracking.tsx`
- `frontend/src/hooks/useGeolocation.ts`

---

## Phase 7: Messaging System (1-2 days) - MEDIUM PRIORITY

### Backend Implementation
- [ ] Implement send message endpoint
- [ ] Implement get messages for booking
- [ ] Mark messages as read
- [ ] Add messages to polling service
- [ ] Add message validation

### Frontend Implementation
- [ ] Create Chat component
- [ ] Add chat to booking details page
- [ ] Display unread message count
- [ ] Add real-time message updates via polling

**Files to Create:**
- `backend/src/controllers/messageController.ts`
- `backend/src/services/messageService.ts`
- `frontend/src/components/chat/ChatBox.tsx`
- `frontend/src/components/chat/MessageList.tsx`

---

## Phase 8: Review System (1-2 days) - MEDIUM PRIORITY

### Backend Implementation
- [ ] Implement create review endpoint
- [ ] Implement get reviews for guide
- [ ] Calculate and update guide average rating
- [ ] Prevent duplicate reviews
- [ ] Only allow reviews after tour completion

### Frontend Implementation
- [ ] Create Review Form component
- [ ] Display reviews on guide profile
- [ ] Add star rating component
- [ ] Show "Leave Review" button after tour

**Files to Create:**
- `backend/src/routes/reviews.ts`
- `backend/src/controllers/reviewController.ts`
- `backend/src/services/reviewService.ts`
- `frontend/src/components/review/ReviewForm.tsx`
- `frontend/src/components/review/ReviewCard.tsx`
- `frontend/src/components/common/StarRating.tsx`

---

## Phase 9: Admin Panel (2-3 days) - HIGH PRIORITY

### Backend Implementation
- [ ] Implement get pending guides
- [ ] Implement approve guide
- [ ] Implement reject guide
- [ ] Implement get platform statistics
- [ ] Add admin-only middleware

### Frontend Implementation
- [ ] Create Admin Dashboard (`frontend/src/pages/admin/Dashboard.tsx`)
- [ ] Create Guide Approval page
- [ ] Create Statistics page
- [ ] Add admin route protection

**Files to Create:**
- `backend/src/routes/admin.ts`
- `backend/src/controllers/adminController.ts`
- `backend/src/services/adminService.ts`
- `frontend/src/pages/admin/Dashboard.tsx`
- `frontend/src/pages/admin/GuideApprovals.tsx`
- `frontend/src/components/admin/GuideApprovalCard.tsx`

---

## Phase 10: Polish & Testing (2-3 days)

### Backend
- [ ] Add input validation to all endpoints
- [ ] Add comprehensive error handling
- [ ] Add rate limiting
- [ ] Add logging
- [ ] Create seed data script
- [ ] Test all API endpoints

### Frontend
- [ ] Add loading states to all pages
- [ ] Add error boundaries
- [ ] Improve UI/UX design
- [ ] Add responsive design improvements
- [ ] Add toast notifications
- [ ] Test all user flows
- [ ] Add 404 page
- [ ] Add error pages

### Deployment
- [ ] Set up production environment variables
- [ ] Deploy to Vercel
- [ ] Set up Supabase production database
- [ ] Configure Stripe webhooks
- [ ] Test production deployment
- [ ] Set up monitoring

---

## Estimated Timeline

| Phase | Days | Priority |
|-------|------|----------|
| Authentication | 3-4 | CRITICAL |
| Guide Profiles | 2-3 | CRITICAL |
| Tour Offerings | 1-2 | HIGH |
| Booking System | 3-4 | CRITICAL |
| Stripe Integration | 2-3 | CRITICAL |
| Maps Integration | 2-3 | HIGH |
| Messaging | 1-2 | MEDIUM |
| Reviews | 1-2 | MEDIUM |
| Admin Panel | 2-3 | HIGH |
| Polish & Testing | 2-3 | HIGH |

**Total: 20-29 days** (optimistic estimate)
**Realistic with testing: 30-40 days**

---

## Critical Path to Working Demo (Minimum Viable)

If you want a **basic working demo ASAP** (7-10 days):

1. ✅ Authentication (3-4 days)
2. ✅ Guide Profiles + Browse (2-3 days)
3. ✅ Simple Booking (no payment) (2 days)
4. ✅ Basic Maps (1 day)

This would allow:
- Users to register/login
- Guides to create profiles
- Tourists to browse and book (but not pay)
- Basic location selection

---

## Priority Order

1. **MUST HAVE (MVP cannot work without):**
   - Authentication
   - Guide Profiles
   - Booking System
   - Stripe Payments

2. **SHOULD HAVE (Important for UX):**
   - Maps Integration
   - Admin Panel
   - Reviews

3. **NICE TO HAVE (Can add post-MVP):**
   - Messaging
   - Advanced search filters
   - Tour offerings (can start with simple hourly booking)

---

## Next Immediate Steps

1. Set up local development environment
2. Configure database with Supabase
3. Start with Phase 1: Authentication
4. Build incrementally and test each feature

---

**Last Updated:** November 10, 2025
**Status:** Infrastructure complete, awaiting feature implementation
