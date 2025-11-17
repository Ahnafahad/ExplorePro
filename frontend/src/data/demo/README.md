# ExplorePro Demo System

This demo system allows users to experience all MVP features without requiring real data, database, or payment processing.

## Demo Accounts

Three demo accounts are available:

### 1. Tourist Account
- **Email**: `demo-tourist@explorepro.com`
- **Password**: `demo123`
- **Features**:
  - Search and browse 15 guides
  - View 45+ tour offerings
  - Book tours (instant & scheduled)
  - View 10 completed bookings with reviews
  - See 5 upcoming bookings
  - 2 active tours with live GPS tracking
  - Real-time chat with guides
  - Leave and manage reviews
  - View loyalty status (Silver tier)
  - See achievements and rewards
  - Access booking history with cancellations
  - Mock payment system

### 2. Guide Account
- **Email**: `demo-guide@explorepro.com`
- **Password**: `demo123`
- **Features**:
  - View earnings dashboard (£5,250 total)
  - Manage availability (toggle on/off)
  - View upcoming and active bookings
  - Start and complete tours
  - Chat with tourists
  - View and respond to reviews (4.7★ average)
  - See performance metrics
  - Access payout schedule
  - View achievements and badges
  - Create and manage tour offerings
  - Accept/decline booking requests

### 3. Admin Account
- **Email**: `demo-admin@explorepro.com`
- **Password**: `demo123`
- **Features**:
  - View platform analytics dashboard
  - Approve/reject 5 pending guide applications
  - View all 15 active guides
  - Monitor all 22 bookings across platform
  - Platform statistics (150 users, 150 bookings, £12K revenue)
  - Revenue breakdown (GMV, commission, payouts)
  - User acquisition funnel
  - Booking heatmaps and trends
  - Guide performance leaderboard
  - Category performance analysis
  - Dispute resolution (simulated)

## Demo Data Structure

### Data Files (JSON)
- **`guides.json`**: 15 detailed guide profiles with ratings, specialties, and badges
- **`tours.json`**: 45+ tour offerings across different categories
- **`bookings.json`**: 22 bookings in various states (pending, confirmed, active, completed, cancelled)
- **`reviews.json`**: 50+ reviews with detailed ratings and comments
- **`messages.json`**: 30+ chat messages between tourists and guides
- **`notifications.json`**: 50+ notifications for all user types
- **`analytics.json`**: Platform-wide statistics and trends
- **`pendingGuides.json`**: 5 guide applications awaiting approval
- **`achievements.json`**: 25 achievements for gamification
- **`gpsRoutes.json`**: Simulated GPS routes for active tours
- **`accounts.json`**: 3 demo user accounts with full profiles

### Key Features

#### 1. Database-Free Operation
- All data stored in JSON files
- localStorage used for session changes
- No backend database required
- Perfect for offline demos

#### 2. Interactive Demo
- Changes persist during session
- Book new tours → appears in guide's dashboard
- Guide starts tour → tourist sees live GPS
- Leave review → updates guide rating
- Admin approves guide → moves to active list
- All actions reflect across accounts

#### 3. Mock Systems

**Payment Processing**:
- Simulated Stripe payment (2-second delay for realism)
- Mock payment IDs generated
- No actual charges made
- Full refund calculations

**GPS Tracking**:
- Predefined routes with waypoints
- Simulated movement every 5 seconds
- Real-time location updates
- Breadcrumb trail visualization

**Real-time Features**:
- Simulated message delivery
- Notification generation
- Status updates
- Live tour tracking

#### 4. Realistic Experience
- Network delays simulated (500ms - 2s)
- Realistic timestamps
- Authentic data patterns
- Professional content

## Usage

### For Development

```typescript
import demoService from '@/services/demoService';

// Check if in demo mode
if (demoService.isDemoMode()) {
  // Use mock data
  const guides = await demoService.guides.getAll();
} else {
  // Use real API
  const guides = await api.guides.getAll();
}
```

### Demo Context

```typescript
import { useDemo } from '@/context/DemoContext';

function MyComponent() {
  const { isDemoMode, resetDemo, exitDemoMode } = useDemo();

  return (
    <div>
      {isDemoMode && (
        <button onClick={resetDemo}>Reset Demo Data</button>
      )}
    </div>
  );
}
```

### Reset Demo Data

```typescript
import demoService from '@/services/demoService';

// Reset all demo data to initial state
demoService.resetDemoData();
```

## Demo Flow Examples

### Tourist Journey
1. Login with `demo-tourist@explorepro.com`
2. Browse 15 available guides
3. Search "History" → 8 guides match
4. Click Emma Thompson → 4.9★, 89 reviews
5. Select "Historic Oxford Walking Tour" (£100, 2 hours)
6. Book for Tuesday 2 PM
7. Mock payment succeeds
8. Booking appears in "Upcoming Tours"
9. Chat with Emma about meeting point
10. View 2 "Active Tours" with live GPS
11. Check 10 "Completed Tours"
12. Leave 5-star review for past tour
13. See Silver Member status (10+ tours)

### Guide Journey
1. Login with `demo-guide@explorepro.com`
2. Dashboard shows £5,250 earned
3. See 5 upcoming bookings
4. Toggle "Available Now" → status changes
5. New booking request arrives
6. Accept booking
7. Start active tour → GPS sharing begins
8. Complete tour → earnings update
9. View 4.7★ rating from 89 reviews
10. Check payout schedule (£450 pending)
11. View leaderboard (ranked #15)

### Admin Journey
1. Login with `demo-admin@explorepro.com`
2. Dashboard: 150 users, 150 bookings, £12K revenue
3. Navigate to "Pending Guides" → 5 applications
4. Review Laura Bennett's application
5. View her ID document
6. Click "Approve" → moves to active guides
7. View platform analytics charts
8. Check booking heatmap (Friday = peak)
9. Review top guides leaderboard
10. Monitor revenue trends

## Features Demonstrated

### Tourist Features (25+)
✅ Search & filter guides
✅ View detailed profiles
✅ Book instant & scheduled tours
✅ Mock payment processing
✅ View bookings (all states)
✅ Live GPS tracking
✅ Real-time chat
✅ Leave detailed reviews
✅ Notification center
✅ Loyalty program
✅ Booking modifications
✅ Cancellations with refunds
✅ Favorite guides
✅ Achievements
✅ And more!

### Guide Features (20+)
✅ Earnings dashboard
✅ Availability management
✅ Booking management
✅ Tour creation/editing
✅ GPS location sharing
✅ Chat with tourists
✅ Review management
✅ Performance metrics
✅ Payout schedule
✅ Achievements & badges
✅ And more!

### Admin Features (15+)
✅ Platform analytics
✅ Guide approval system
✅ User management
✅ Booking oversight
✅ Revenue tracking
✅ Performance monitoring
✅ Dispute resolution
✅ Report generation
✅ And more!

## localStorage Keys

The demo system uses these localStorage keys:

- `demo_current_user`: Current logged-in demo user
- `demo_bookings`: Session booking changes
- `demo_messages`: Session message additions
- `demo_notifications`: Session notification updates
- `demo_reviews`: Session review additions
- `demo_guides`: Session guide updates
- `demo_pending_guides`: Session pending guide changes

## Benefits

### For Investors
- See fully functional product
- Test all features interactively
- No technical setup required
- Professional presentation

### For Testing
- Test UI without backend
- Develop features offline
- Quick prototype iterations
- No database dependencies

### For Demos
- Works anywhere (no internet needed after load)
- No accidental real charges
- Consistent demo experience
- Easy to reset

## Technical Implementation

### Service Layer (`demoService.ts`)
- Intercepts API calls
- Returns mock data
- Simulates network delays
- Handles localStorage persistence

### Context Provider (`DemoContext.tsx`)
- Manages demo state
- Provides demo utilities
- Handles account switching
- Controls demo lifecycle

### Data Management
- JSON files for initial data
- localStorage for session changes
- Automatic persistence
- Easy reset mechanism

## Vercel Deployment

The demo system is fully compatible with Vercel:
- Static JSON files served from CDN
- No serverless function limits
- Works with static export
- Fast global loading

## Future Enhancements

Potential improvements:
- [ ] Demo video tutorials
- [ ] Guided tour walkthrough
- [ ] More demo scenarios
- [ ] Demo data generator
- [ ] Custom demo configurations
- [ ] Demo analytics tracking
- [ ] Multi-language demo data

## Support

For issues or questions about the demo system:
1. Check this README
2. Review `demoService.ts` code
3. Inspect localStorage in browser DevTools
4. Reset demo data if corrupted

---

**Last Updated**: November 17, 2025
**Version**: 1.0.0 - Initial Demo System
