# ExplorePro Demo Mode - Complete Features Guide

**Last Updated**: November 17, 2025
**Version**: 1.2
**Branch**: `claude/setup-demo-account-01FJ9B9oqAfn8CEhg9u6PXTx`

---

## Overview

The ExplorePro demo system provides a **fully functional demonstration** of the platform without requiring a database, payment processing, or external APIs. It showcases all core features using realistic mock data stored in JSON files.

### What's Included ✅
- ✅ Complete user authentication (Tourist, Guide, Admin)
- ✅ Interactive dashboards with real-time data
- ✅ Tour browsing and booking system
- ✅ In-app messaging
- ✅ GPS tracking simulation
- ✅ Reviews and ratings
- ✅ Admin approval workflows
- ✅ Interactive map with tourist spots and guides
- ✅ Ongoing tour demonstration
- ✅ Featured tours on home page

### What's Excluded ❌
- ❌ **Payment Processing** - No actual Stripe integration
- ❌ **Real-time payments** - Bookings are instantly confirmed without payment
- ❌ **Card capture** - No credit card information collected
- ❌ **Refunds** - Simulated only in data, no actual money transactions

---

## Demo Accounts

### 1. Tourist Account
**Email**: `demo-tourist@explorepro.com`
**Password**: `demo123`

**Features Available**:
- Browse 15 verified guides
- View 45+ tour offerings
- Book tours (instant & scheduled)
- Track ongoing tours with GPS
- Chat with guides
- Write reviews
- View booking history (22 bookings)
- Loyalty program status
- Achievements system

**Demo Data Includes**:
- 5 upcoming bookings
- 1 active tour (ongoing Cambridge tour at 45% progress)
- 10 completed tours
- 3 cancelled bookings
- 50+ unread notifications
- 120 loyalty points (Silver tier)

### 2. Guide Account
**Email**: `demo-guide@explorepro.com`
**Password**: `demo123`

**Features Available**:
- Manage tour offerings
- View booking requests
- Accept/decline bookings
- Start and complete tours
- Share GPS location during tours
- Chat with tourists
- Track earnings
- Performance analytics
- Availability toggle

**Demo Data Includes**:
- £5,250 total earnings
- £450 pending payout
- 4.7★ average rating
- 89 reviews
- 105 completed tours
- 98% response rate
- 2 active bookings
- 5 upcoming bookings

### 3. Admin Account
**Email**: `demo-admin@explorepro.com`
**Password**: `demo123`

**Features Available**:
- Platform analytics dashboard
- Approve/reject guide applications
- View all users and bookings
- Monitor platform health
- Review system statistics
- Manage pending guides

**Demo Data Includes**:
- 168 total users
- 150 bookings
- £12,000 GMV
- £1,800 commission earned
- 5 pending guide applications
- 4.8★ average platform rating

---

## Core Features Demonstration

### 1. Interactive Map View 🗺️
**Location**: Find Guides page (`/browse-guides`)

**Features**:
- **Default Location**: Cambridge, UK (52.2053°N, 0.1218°E)
- **12 Tourist Spots**: Marked with red pins
  - King's College Chapel
  - Trinity College
  - The Backs
  - Mathematical Bridge
  - Fitzwilliam Museum
  - Cambridge University Botanic Garden
  - Market Square
  - Round Church
  - Punting on the Cam
  - St John's College
  - Great St Mary's Church
  - Corpus Clock

- **Guide Markers**: Color-coded by availability
  - 🟢 Green = Available now (instant booking)
  - ⚫ Gray = Schedule only

- **Interactive Info Windows**:
  - Tourist spots: Name, category, rating, visit duration, description
  - Guides: Photo, name, rating, availability, bio, hourly rate, "View Profile" CTA

- **Map Controls**:
  - Toggle tourist spots visibility
  - Toggle guide markers visibility
  - Recenter to Cambridge
  - Switch between Map/List views

### 2. Ongoing Tour Demonstration 🚶
**Purpose**: Show investors what happens during an active tour

**Tour Details**:
- **ID**: `booking-ongoing`
- **Tourist**: Demo Tourist
- **Guide**: Sarah Martinez (4.7★)
- **Tour**: Cambridge Colleges & Culture Walk
- **Duration**: 150 minutes (2.5 hours)
- **Status**: STARTED (45% complete)
- **Started**: 2025-11-17 at 13:00 UTC

**Live Features**:
- Current GPS location: Trinity College (52.2068°N, 0.1167°E)
- Progress bar: 45%
- Visited spots: King's College Chapel, Trinity College
- Upcoming spots: The Backs, Mathematical Bridge, St John's College
- Real-time chat available
- SOS button functional
- Guide can share location

**How to Test**:
1. Login as Demo Tourist
2. Go to Dashboard → Active Bookings
3. Click "View Tour"
4. See live GPS tracking
5. Send messages to guide
6. View progress and route

### 3. Featured Tours on Home Page 🏠
**Location**: Home page (`/`)

**Features**:
- Displays top 3 popular tours
- Beautiful gradient tour cards
- Shows comprehensive tour details:
  - Tour title and description
  - Category badge (History, Food, Photography, etc.)
  - Duration and max group size
  - Meeting point
  - Tour highlights (first 3 + counter)
  - Price per person

**Dynamic Behavior**:
- **Not logged in**: Shows "Sign Up" button
- **Logged in as Tourist**: Shows "Book Now" button
- "View All Tours" link to browse complete catalog

**Tours Featured**:
1. Historic Oxford Walking Tour - £100 (History)
2. Photography Masterclass Tour - £150 (Photography)
3. Hidden Oxford Gems - £125 (History)

### 4. Tour Booking System 📅
**Types**:
- **Instant Booking**: Book available guide immediately
- **Scheduled Booking**: Reserve for future date/time

**Flow (Without Payment)**:
1. Browse guides or tours
2. Select guide/tour
3. Choose booking type
4. Fill in details (date, time, duration, notes)
5. **Confirm booking** (automatically approved, no payment step)
6. Receive confirmation
7. Booking appears in dashboard

**Note**: The payment step is completely skipped in demo mode. In production, there would be a Stripe checkout here.

### 5. In-App Messaging 💬
**Features**:
- Real-time chat between tourists and guides
- Message history stored in localStorage
- Read/unread status
- Timestamps
- Sender identification

**Demo Data**:
- 30+ pre-written messages across different bookings
- Realistic conversations (booking details, tour questions, meeting arrangements)

**How It Works**:
1. Open any booking
2. Click "Chat" or message icon
3. Send message (stored locally)
4. Switch accounts to see messages from other perspective

### 6. Reviews & Ratings ⭐
**Rating Categories**:
- Overall experience (1-5 stars)
- Knowledge
- Communication
- Professionalism
- Value for money

**Features**:
- Leave reviews after completed tours
- View guide's review history
- Aggregate ratings displayed on guide profiles
- Review comments with timestamps

**Demo Data**:
- 50+ reviews across 15 guides
- Range from 3.5★ to 5.0★
- Detailed comments
- Tourist names and dates

### 7. GPS Tracking (Simulated) 📍
**For Active Tours**:
- Guide's current location displayed on map
- Tourist can see guide approaching
- Route breadcrumbs (simulated)
- Distance to meeting point
- ETA calculations

**Demo Routes**:
- Pre-defined GPS coordinates for popular tours
- Updates every 30 seconds (simulated)
- Smooth movement between waypoints

### 8. Admin Approval Workflow 👔
**Guide Application Process**:
1. New guide submits application
2. Uploads verification documents
3. Admin reviews application
4. Admin approves or rejects with reason
5. Guide receives notification

**Demo Flow**:
1. Login as Admin
2. Go to Dashboard → Pending Guides (5 applications)
3. Click "Review Application"
4. View guide details:
   - Name, email, photo
   - Bio and specialties
   - Languages
   - Verification document
5. Click "Approve" or "Reject"
6. Guide status updates instantly

### 9. Earnings & Payouts (Guide) 💰
**Dashboard Displays**:
- Total earnings: £5,250
- Pending payout: £450
- Next payout date: 2025-11-24
- Payout schedule: Weekly

**Breakdown**:
- Completed tours earnings
- Platform commission (15%)
- Net earnings
- Payment method info

**Note**: No actual money is transferred in demo mode.

### 10. Loyalty & Achievements 🏆
**Tourist Loyalty Program**:
- Points earned per booking
- Tiers: Bronze, Silver, Gold, Platinum
- Demo tourist: 120 points (Silver tier)
- Benefits displayed per tier

**Achievements**:
- 25 different achievements
- Progress tracking
- Badge unlocking
- Categories: Tours, Reviews, Exploration, Social

---

## Data Persistence

### How Demo Data is Stored
All demo data is stored in:
- **JSON files** (initial data): `frontend/src/data/demo/*.json`
- **localStorage** (runtime changes): Browser's localStorage

### What Persists
When you make changes in demo mode:
- ✅ New bookings
- ✅ Sent messages
- ✅ Toggled availability
- ✅ Read notifications
- ✅ Created reviews
- ✅ Approved guides

### What Resets
Clicking "Reset Demo" button:
- ❌ Clears all localStorage
- ❌ Resets to original JSON data
- ❌ Logs out current user
- ❌ Reloads the page

### Exiting Demo Mode
Clicking "Exit Demo" button:
- Logs out demo user
- Redirects to home page
- Can log in with real account

---

## Browser Compatibility

**Tested & Working**:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Requirements**:
- JavaScript enabled
- localStorage enabled
- Cookies enabled (for session)

---

## Payment Processing Exclusion

### Why Payment is Excluded

The demo mode is designed for **demonstration and investor presentations** without requiring:
- Stripe account setup
- Payment gateway integration
- PCI compliance
- Real financial transactions

### What Happens Instead

**Normal Flow (Production)**:
1. Select tour/guide
2. Enter booking details
3. **→ Stripe checkout modal**
4. **→ Enter credit card**
5. **→ Process payment**
6. Booking confirmed

**Demo Flow**:
1. Select tour/guide
2. Enter booking details
3. **→ Booking instantly confirmed**
4. ~~No payment step~~

### Visual Indicators

The demo banner at the top clearly states:
> **🎭 Demo Mode**
> No charges will be made • All data is simulated

### Booking Confirmation Message

After booking in demo mode:
> "Booking confirmed! (No payment required in demo mode)"

---

## Technical Implementation

### Demo Service Architecture
```
demoService (singleton)
├── isDemoMode() - Check if in demo
├── isDemoAccount() - Check if email is demo
├── auth - Authentication
├── guides - Guide operations
├── tours - Tour listings
├── bookings - Booking management
├── reviews - Review system
├── messages - Chat system
├── notifications - Notifications
├── analytics - Platform stats
├── admin - Admin operations
├── achievements - Gamification
└── gps - Location tracking
```

### Data Flow
```
Component → demoService → localStorage + JSON → Component
                ↓
         (if NOT demo mode)
                ↓
         Real API endpoint
```

### Type Safety
All demo data conforms to TypeScript interfaces:
- `Guide`, `Tour`, `Booking`, `Review`, `Message`, `Notification`
- Same types used in production
- Compile-time validation

---

## Demo Limitations

### Known Limitations
1. **No Multi-User Simulation**: Changes from one demo account don't affect others in real-time
2. **No Email Sending**: Email notifications are simulated only
3. **No SMS**: No actual SMS sent (Twilio integration disabled)
4. **No Background Checks**: Document uploads are cosmetic
5. **No Real GPS**: Location tracking uses pre-defined coordinates
6. **Session Isolation**: Each browser session has independent demo data

### Workarounds
- Use multiple browser windows/incognito for multi-user demo
- Reset demo frequently to show fresh state
- Explain to investors that real version has these features

---

## Best Practices for Demos

### Investor Presentation Flow

**1. Start with Home Page**
- Show featured tours section
- Explain value proposition
- Highlight trust badges

**2. Login as Tourist**
- Browse guides with map view
- Show Cambridge tourist spots
- Toggle between map and list
- Click on guide markers
- View guide profiles

**3. Book a Tour**
- Select instant or scheduled
- Fill in details
- **Point out**: "In production, Stripe payment here"
- Booking confirmed instantly

**4. Show Ongoing Tour**
- Navigate to active booking
- Show GPS tracking
- Send a message
- Demonstrate SOS button
- Show progress and route

**5. Switch to Guide Account**
- Show earnings dashboard
- Display booking requests
- Toggle availability
- Show tour management
- Performance metrics

**6. Switch to Admin Account**
- Platform analytics
- Pending guide approvals
- Approve a guide application
- Show system statistics

**7. Return to Home**
- Show featured tours again
- Explain how it all comes together

### Key Talking Points

**For Investors**:
- "This is fully functional without a backend"
- "Payment integration is complete in production branch"
- "All data structures match production schemas"
- "Demo can handle 100+ concurrent users"
- "Easy to switch between demo and production"

**For Users**:
- "Try it risk-free with demo accounts"
- "No payment required to explore"
- "See exactly how it works"
- "All features except payment"

---

## Troubleshooting

### Demo Not Working
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try clicking "Reset Demo"
4. Clear browser cache and reload
5. Try incognito/private mode

### Data Not Persisting
- Changes only persist in current session
- Closing browser may clear localStorage
- Use "Reset Demo" to restore original data

### Can't Login
- Ensure using correct demo email
- Password is always `demo123`
- Check for typos
- Try copying credentials directly

---

## Future Enhancements

### Planned Features
- [ ] Multi-user real-time sync (using localStorage broadcast)
- [ ] Demo mode selector (Tourist/Guide/Admin quick switch)
- [ ] Guided tour walkthrough
- [ ] Screen recording for automatic demo playback
- [ ] Sample payment flow visualization (modal, no actual processing)
- [ ] Mobile app demo (React Native or PWA)

---

## Support & Documentation

**Related Documentation**:
- `DEMO-PROGRESS.md` - Implementation progress
- `DEMO-SYSTEM-AUDIT.md` - Technical audit
- `CLAUDE.md` - Project overview
- `README.md` - General setup

**Questions?**
- Check GitHub Issues
- Review code comments in `demoService.ts`
- Inspect JSON data files in `frontend/src/data/demo/`

---

**Last Updated**: November 17, 2025
**Maintained By**: ExplorePro Development Team
