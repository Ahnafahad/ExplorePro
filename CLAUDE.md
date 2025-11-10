# CLAUDE.md - ExplorePro MVP

**Project**: ExplorePro - Uber for Tour Guides  
**Owner**: Ahnaf Ahad  
**Phase**: MVP Prototype (Web-first)  
**Target Launch**: 7-14 days for prototype, 3-6 months for full product  
**Initial Market**: Oxford & Cambridge, UK

---

## Project Overview

ExplorePro is a two-sided marketplace connecting tourists with local tour guides through instant and scheduled bookings. Think "Uber for Tour Guides" - tourists can book guides immediately or schedule in advance, with real-time GPS tracking, in-app payments, and dual review systems.

**Core Value Proposition**: Solve the dual problem of tourists struggling to find vetted guides in real-time AND guides lacking efficient platforms to maximize bookings.

---

## Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast, modern, simple setup)
- **Styling**: Tailwind CSS 3.4+
- **State Management**: React Context API (avoid Redux for MVP)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Maps**: Google Maps JavaScript API (@react-google-maps/api)
- **Forms**: React Hook Form with Zod validation
- **Date/Time**: date-fns
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+ with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+ (use Supabase free tier)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io (for chat and GPS tracking)
- **File Storage**: Supabase Storage (free tier)
- **Email**: SendGrid (free tier: 100 emails/day)

### Payment & APIs
- **Payments**: Stripe (test mode for prototype)
- **Maps**: Google Maps API (free tier: $200 credit/month)
- **SMS**: Twilio (test credentials for prototype)

### DevOps
- **Hosting**: Vercel (full-stack deployment - frontend + backend as serverless functions)
- **Database**: Supabase (free tier: 500MB, 2GB bandwidth)
- **Version Control**: Git + GitHub
- **Environment**: .env files (never commit!)

---

## Project Structure

```
explorepro/
├── frontend/                 # React TypeScript app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Buttons, inputs, cards, modals
│   │   │   ├── layout/      # Header, footer, sidebar
│   │   │   ├── tourist/     # Tourist-specific components
│   │   │   └── guide/       # Guide-specific components
│   │   ├── pages/           # Page components (routes)
│   │   │   ├── Home.tsx
│   │   │   ├── auth/        # Login, signup, verification
│   │   │   ├── tourist/     # Tourist dashboard, search, booking
│   │   │   ├── guide/       # Guide dashboard, tours, earnings
│   │   │   └── admin/       # Admin panel
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer (axios)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper functions
│   │   ├── constants/       # Constants, config
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Prisma models (generated)
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helpers
│   │   ├── sockets/         # Socket.io handlers
│   │   ├── types/           # TypeScript types
│   │   └── server.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                     # Documentation
│   ├── PRD.tex              # Product Requirements Document
│   ├── API.md               # API documentation
│   └── SETUP.md             # Setup instructions
│
└── README.md
```

### 🚀 Deployment Architecture

**Target Platform**: Vercel (Full-Stack Deployment)

This entire application will be deployed to **Vercel** as a monorepo:
- Frontend: Served as static files from Vercel's CDN
- Backend: Deployed as Vercel Serverless Functions
- Database: Supabase PostgreSQL (external)
- Real-time: Consider Pusher/Ably for WebSocket alternative (Vercel serverless limitations)

**Why Vercel?**
- ✅ Free tier: Unlimited deployments, 100 GB-hours compute
- ✅ Automatic HTTPS & CDN
- ✅ Git integration (auto-deploy on push)
- ✅ Built-in environment variable management
- ✅ Preview deployments for PRs
- ✅ Zero-config for frontend frameworks
- ✅ Serverless functions for backend APIs

**Note**: Vercel serverless functions have a 10-second execution timeout on hobby plan. Design long-running operations accordingly (use job queues for anything >5 seconds).

---

## MVP Feature Scope

### ✅ IN SCOPE (Build These)

#### User Management
- Email/password registration (tourists + guides)
- JWT authentication
- User profiles (basic: name, photo, bio, languages)
- Guide verification (ID upload + manual admin approval)

#### Guide Features
- Create guide profile with specialties
- Set availability (on/off toggle for instant bookings)
- Create tour offerings (title, description, price, duration)
- View bookings (upcoming, past)
- Basic earnings dashboard

#### Tourist Features
- Search guides (by location, language, specialty)
- View guide profiles
- Book tours (instant "book now" OR scheduled)
- In-app chat with guide
- Leave reviews after tour

#### Booking System
- Instant booking (find available guide now)
- Scheduled booking (book for future date/time)
- Duration: 30 min minimum, no maximum
- Booking confirmation via email

#### Payments
- Stripe integration (test mode)
- Pay upfront when booking
- 15% platform commission
- GBP (£) only
- Basic refund handling

#### Safety & Tracking
- Manual tour start/end confirmation
- Basic GPS location sharing (simulated in prototype)
- Emergency SOS button (sends email alert)

#### Admin Panel
- View pending guide applications
- Approve/reject guides
- View all bookings
- Basic analytics dashboard

### ❌ OUT OF SCOPE (Post-MVP)
- Social login (Google/Facebook)
- Video calls
- Advanced GPS tracking with breadcrumb trail
- Multi-day tour complex pricing
- Group bookings with split payment
- Tipping functionality
- Advanced analytics
- Mobile apps
- Multi-language support (English only for MVP)
- Multi-currency (GBP only)
- Real background checks (simulate with file upload)
- Insurance integration

---

## Code Style & Conventions

### General
- **Language**: TypeScript everywhere (strict mode enabled)
- **Formatting**: Prettier (2 spaces, single quotes, trailing commas)
- **Linting**: ESLint with TypeScript rules
- **Naming**: 
  - Files: PascalCase for components (Button.tsx), camelCase for utils (formatDate.ts)
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Types/Interfaces: PascalCase (prefix interfaces with 'I' if ambiguous)

### React/Frontend
- **Components**: Functional components only, no class components
- **Hooks**: Use custom hooks for reusable logic (prefix with 'use')
- **Props**: Destructure props in function signature
- **State**: Use useState for local state, Context for global
- **Exports**: Named exports for components (except pages which use default)
- **File structure**: One component per file
- **Styling**: Tailwind utility classes (avoid inline styles)

### Backend/API
- **Routes**: RESTful conventions
  - GET /api/guides - List guides
  - GET /api/guides/:id - Get specific guide
  - POST /api/guides - Create guide
  - PUT /api/guides/:id - Update guide
  - DELETE /api/guides/:id - Delete guide
- **Error Handling**: Always use try-catch, return consistent error format
- **Validation**: Validate all inputs using middleware (express-validator or Zod)
- **Auth**: Protect routes with JWT middleware
- **Database**: Use Prisma for all database operations (no raw SQL)

### Error Format
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR" | "AUTH_ERROR" | "NOT_FOUND" | "SERVER_ERROR",
    message: "Human-readable error message",
    details?: any // Optional additional context
  }
}
```

### Success Format
```typescript
{
  success: true,
  data: any, // The actual response data
  message?: string // Optional success message
}
```

---

## Database Schema (Prisma)

### Core Models (Minimum Viable)

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String   // bcrypt hashed
  role          Role     @default(TOURIST)
  name          String
  phone         String?
  photo         String?  // URL to Supabase storage
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  tourist       Tourist?
  guide         Guide?
}

enum Role {
  TOURIST
  GUIDE
  ADMIN
}

model Tourist {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  preferredLang   String   @default("English")
  
  // Relations
  bookings        Booking[]
  reviews         Review[]
}

model Guide {
  id              String      @id @default(uuid())
  userId          String      @unique
  user            User        @relation(fields: [userId], references: [id])
  bio             String
  languages       String[]    // Array of language codes
  specialties     String[]    // Array of specialty tags
  hourlyRate      Float       // In GBP
  isAvailable     Boolean     @default(false)
  status          GuideStatus @default(PENDING)
  verificationDoc String?     // URL to ID document
  
  // Relations
  tours           Tour[]
  bookings        Booking[]
  reviews         Review[]
}

enum GuideStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

model Tour {
  id          String   @id @default(uuid())
  guideId     String
  guide       Guide    @relation(fields: [guideId], references: [id])
  title       String
  description String
  duration    Int      // In minutes
  price       Float    // In GBP
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  // Relations
  bookings    Booking[]
}

model Booking {
  id              String        @id @default(uuid())
  touristId       String
  tourist         Tourist       @relation(fields: [touristId], references: [id])
  guideId         String
  guide           Guide         @relation(fields: [guideId], references: [id])
  tourId          String?
  tour            Tour?         @relation(fields: [tourId], references: [id])
  
  type            BookingType
  status          BookingStatus @default(PENDING)
  
  scheduledDate   DateTime?     // For scheduled bookings
  startTime       DateTime?     // Actual start time
  endTime         DateTime?     // Actual end time
  duration        Int           // Requested duration in minutes
  
  meetingPoint    String
  totalPrice      Float         // In GBP
  commission      Float         // 15% of totalPrice
  guideEarnings   Float         // totalPrice - commission
  
  stripePaymentId String?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relations
  review          Review?
  messages        Message[]
}

enum BookingType {
  INSTANT
  SCHEDULED
}

enum BookingStatus {
  PENDING
  CONFIRMED
  STARTED
  COMPLETED
  CANCELLED
  REFUNDED
}

model Review {
  id          String   @id @default(uuid())
  bookingId   String   @unique
  booking     Booking  @relation(fields: [bookingId], references: [id])
  touristId   String
  tourist     Tourist  @relation(fields: [touristId], references: [id])
  guideId     String
  guide       Guide    @relation(fields: [guideId], references: [id])
  
  rating      Int      // 1-5 stars
  comment     String?
  createdAt   DateTime @default(now())
}

model Message {
  id          String   @id @default(uuid())
  bookingId   String
  booking     Booking  @relation(fields: [bookingId], references: [id])
  senderId    String
  content     String
  createdAt   DateTime @default(now())
}
```

---

## API Endpoints (RESTful)

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/me - Get current user

### Guides
- GET /api/guides - List all approved guides (with filters)
- GET /api/guides/:id - Get guide profile
- POST /api/guides - Create guide profile (auth required)
- PUT /api/guides/:id - Update guide profile (auth required)
- PUT /api/guides/:id/availability - Toggle availability (auth required)
- GET /api/guides/:id/tours - Get guide's tours
- GET /api/guides/:id/reviews - Get guide's reviews

### Tours
- GET /api/tours/:id - Get tour details
- POST /api/tours - Create tour (guide only)
- PUT /api/tours/:id - Update tour (guide only)
- DELETE /api/tours/:id - Delete tour (guide only)

### Bookings
- GET /api/bookings - Get user's bookings (auth required)
- GET /api/bookings/:id - Get booking details (auth required)
- POST /api/bookings - Create new booking (tourist only)
- PUT /api/bookings/:id/start - Start tour (guide only)
- PUT /api/bookings/:id/complete - Complete tour (guide only)
- DELETE /api/bookings/:id - Cancel booking

### Reviews
- POST /api/reviews - Create review (tourist only, after tour)
- GET /api/reviews/:guideId - Get reviews for guide

### Admin
- GET /api/admin/guides/pending - Get pending guide applications
- PUT /api/admin/guides/:id/approve - Approve guide
- PUT /api/admin/guides/:id/reject - Reject guide
- GET /api/admin/stats - Get platform statistics

### Payments (Stripe Webhook)
- POST /api/webhooks/stripe - Stripe webhook handler

---

## Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Backend (.env)
```bash
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/explorepro"

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Google Maps
GOOGLE_MAPS_API_KEY=your_key_here

# SendGrid
SENDGRID_API_KEY=your_key_here
SENDGRID_FROM_EMAIL=noreply@explorepro.com

# Twilio (for SMS - optional for MVP)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+447xxx

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

---

## Development Commands

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format with Prettier
```

### Backend
```bash
cd backend
npm install              # Install dependencies
npm run dev              # Start dev server with hot reload (http://localhost:5000)
npm run build            # Compile TypeScript
npm start                # Run compiled code (production)
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run seed             # Seed database with test data
```

### Database Setup
```bash
# 1. Create PostgreSQL database
createdb explorepro

# 2. Generate Prisma client
cd backend
npm run prisma:generate

# 3. Run migrations
npm run prisma:migrate

# 4. Seed with test data (optional)
npm run seed
```

---

## Critical Implementation Rules

### Security
1. **NEVER commit .env files** - Add to .gitignore immediately
2. **Always hash passwords** - Use bcrypt with salt rounds of 10
3. **Validate all inputs** - Backend must validate, frontend validation is UX only
4. **Use HTTPS in production** - Enforce SSL/TLS
5. **Rate limiting** - Add rate limiting to auth endpoints (express-rate-limit)
6. **CORS** - Configure CORS properly, only allow frontend URL
7. **SQL Injection** - Always use Prisma (parameterized queries), NEVER string concatenation

### Performance
1. **Lazy loading** - Use React.lazy() for route components
2. **Image optimization** - Compress images before upload, use WebP
3. **API caching** - Cache static data (guide profiles, tours) with appropriate TTL
4. **Database indexing** - Add indexes on frequently queried fields
5. **Pagination** - Always paginate list endpoints (limit: 20 items default)

### Error Handling
1. **Frontend** - Show user-friendly error messages, never raw API errors
2. **Backend** - Log all errors, return consistent error format
3. **Validation** - Validate early, fail fast
4. **Graceful degradation** - Handle API failures gracefully

### Testing (Post-Prototype)
1. **Unit tests** - Jest for utilities and services
2. **Integration tests** - Test API endpoints
3. **E2E tests** - Playwright for critical user flows
4. **Test coverage** - Aim for 70%+ on critical paths

---

## Payment Flow (Stripe)

### Booking Payment
1. Tourist books tour → Frontend calls backend
2. Backend creates Stripe PaymentIntent (amount = tour price)
3. Backend saves booking with status PENDING, stores paymentIntentId
4. Frontend receives client_secret, shows Stripe checkout
5. Tourist completes payment in Stripe modal
6. Stripe sends webhook to /api/webhooks/stripe
7. Backend verifies webhook, updates booking status to CONFIRMED
8. Guide gets notification, booking appears in their dashboard

### Commission Calculation
```typescript
totalPrice = tourPrice * duration
commission = totalPrice * 0.15
guideEarnings = totalPrice - commission
```

### Refund Logic
- Cancel 24+ hours before: 100% refund
- Cancel 12-24 hours: 50% refund
- Cancel 2-12 hours: 25% refund
- Cancel <2 hours: No refund

---

## GPS Tracking (Simplified for MVP)

### Prototype Approach
- Use browser Geolocation API
- Update location every 30 seconds during active tour
- Store only start/end location (not full trail)
- Display guide's current location on tourist's map

### Implementation Notes
```typescript
// Get user location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // Send to backend via Socket.io
    socket.emit('location-update', { bookingId, latitude, longitude });
  },
  (error) => console.error('Geolocation error:', error),
  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
);
```

---

## Real-time Features (Socket.io)

### Events to Implement

**Chat**
```typescript
// Client emits
socket.emit('send-message', { bookingId, message, senderId });

// Client listens
socket.on('receive-message', (message) => {
  // Update chat UI
});
```

**Location Tracking**
```typescript
// Guide emits during tour
socket.emit('location-update', { bookingId, latitude, longitude });

// Tourist listens
socket.on('guide-location', ({ latitude, longitude }) => {
  // Update map marker
});
```

**Booking Updates**
```typescript
// Server emits on booking status change
socket.emit('booking-status', { bookingId, status });

// Clients listen
socket.on('booking-status', ({ status }) => {
  // Update UI
});
```

---

## File Upload (Supabase Storage)

### Allowed Files
- Profile photos: JPG, PNG, WebP (max 5MB)
- Verification documents: PDF, JPG, PNG (max 10MB)

### Naming Convention
```typescript
const filename = `${userId}-${Date.now()}.${extension}`;
const path = `${fileType}/${filename}`;
// Example: profiles/abc123-1699564800.jpg
```

### Frontend Upload Flow
```typescript
1. User selects file
2. Validate size and type
3. Upload to Supabase Storage
4. Get public URL
5. Save URL to database via API
```

---

## Admin Panel Requirements

### Dashboard (MVP)
- Total users (tourists, guides)
- Total bookings (today, this week, total)
- Revenue (GMV, commission earned)
- Pending guide applications count
- Average rating across all guides

### Guide Management
- List pending applications with preview
- Approve/reject with one click
- View guide details (profile, verification doc)
- Search and filter guides

---

## Deployment Checklist

### Before First Deploy
- [ ] All .env files in .gitignore
- [ ] Database migrations run
- [ ] Stripe webhooks configured
- [ ] CORS configured with production URL
- [ ] Error logging set up (Sentry or similar)
- [ ] Rate limiting enabled
- [ ] HTTPS enforced

### Vercel Deployment (Full-Stack)

**Approach**: Deploy entire application to Vercel as a monorepo with frontend + backend serverless functions

#### Deployment Strategy Options:

**Option 1: Monorepo Structure (Recommended)**
```
explorepro/
├── frontend/          # React app
├── api/              # Express backend as Vercel serverless functions
└── vercel.json       # Vercel configuration
```

**Option 2: Separate Deployments**
- Frontend: Deploy as static site
- Backend: Deploy as separate Vercel project with serverless functions

#### Vercel Configuration (vercel.json)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "frontend/dist" }
    },
    {
      "src": "backend/src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ]
}
```

#### Deployment Steps:
1. **Connect GitHub Repository**
   - Go to vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   
2. **Configure Build Settings**
   - Framework Preset: Vite (or Other)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from backend .env
   - Add frontend VITE_ variables
   - Separate variables by environment (Production, Preview, Development)

4. **Configure Database**
   - Use Supabase PostgreSQL (connection string in env vars)
   - OR add Vercel Postgres (paid tier)
   - Ensure DATABASE_URL is set

5. **Run Database Migrations**
   - Add build script: `"vercel-build": "prisma generate && prisma migrate deploy && npm run build"`
   - This runs migrations before deployment

6. **Configure Serverless Functions**
   - Ensure Express app exports handler for serverless
   - Max execution time: 10 seconds (Vercel hobby plan)
   - Memory limit: 1024 MB

7. **Test Deployment**
   - Vercel provides preview URL
   - Test all API endpoints
   - Verify database connection
   - Check Stripe webhook URL

8. **Production Domain**
   - Add custom domain (optional)
   - Configure DNS settings
   - SSL automatically provided by Vercel

#### Important Vercel Considerations:

**Serverless Function Limits (Hobby Plan)**:
- Execution time: 10 seconds max
- Memory: 1024 MB
- Invocations: 100 GB-hours/month
- Edge Functions: 100 hours/month

**Backend Adjustments for Serverless**:
```typescript
// Export handler for Vercel serverless
// backend/src/server.ts

import express from 'express';
const app = express();

// ... your middleware and routes ...

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
```

**Socket.io on Vercel**:
Note: Socket.io requires persistent connections which don't work well with serverless functions.
- **Alternative 1**: Use Vercel's Edge Functions with WebSockets (limited support)
- **Alternative 2**: Use third-party service like Pusher or Ably (has free tier)
- **Alternative 3**: Deploy Socket.io server separately on Railway/Render (free tier)
- **For MVP**: Use polling instead of WebSockets for real-time updates

#### Post-Deployment Checklist:
- [ ] Frontend loads correctly at Vercel URL
- [ ] API endpoints responding (/api/health check)
- [ ] Database connection working
- [ ] Stripe webhooks pointing to production URL
- [ ] CORS configured with production domain
- [ ] Environment variables all set correctly
- [ ] Google Maps API working
- [ ] File uploads to Supabase working
- [ ] Authentication (login/register) functional
- [ ] Test booking flow end-to-end

---

## Known Limitations (MVP)

1. **No real background checks** - Just file upload simulation
2. **Basic GPS** - Only current location, no trail
3. **No live support** - Only email support
4. **English only** - No i18n
5. **GBP only** - No currency conversion
6. **Manual guide approval** - Admin must manually review
7. **Basic search** - No ML recommendations
8. **No mobile app** - Web only
9. **Limited analytics** - Basic metrics only
10. **No automated testing** - Manual testing only for MVP

---

## Performance Targets (MVP)

- Page load time: < 3 seconds on 4G
- API response time: < 500ms (95th percentile)
- Database queries: < 100ms
- Concurrent users: Support 50 simultaneous users
- Uptime: 99% (acceptable downtime for MVP)

---

## Support & Troubleshooting

### Common Issues

**Database connection fails**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify network access (Supabase firewall)

**Stripe webhook not working**
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
- Verify webhook secret in .env
- Check endpoint URL in Stripe dashboard

**Maps not loading**
- Verify Google Maps API key
- Enable Maps JavaScript API in Google Cloud Console
- Check browser console for errors

**Socket.io connection issues**
- Check CORS configuration
- Verify backend URL in frontend
- Check Socket.io version compatibility

---

## Development Workflow

### Starting Fresh Session
1. Pull latest code: `git pull origin main`
2. Install new dependencies: `npm install` (both frontend & backend)
3. Run migrations: `npm run prisma:migrate`
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd frontend && npm run dev`

### Making Changes
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test locally
4. Commit with clear message: `git commit -m "feat: add guide search filter"`
5. Push and create PR: `git push origin feature/your-feature`

### Git Commit Conventions
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## Key Metrics to Track (Analytics)

### User Metrics
- New registrations (tourists vs guides)
- Active users (daily, weekly, monthly)
- User retention rate

### Booking Metrics
- Bookings per day/week/month
- Booking conversion rate (searches → bookings)
- Average booking value
- Instant vs scheduled booking ratio
- Cancellation rate

### Guide Metrics
- Guide approval rate
- Average guide rating
- Bookings per guide
- Guide utilization rate

### Revenue Metrics
- GMV (Gross Merchandise Value)
- Platform commission earned
- Average transaction value

---

## Contact & Resources

**Project Owner**: Ahnaf Ahad  
**Documentation**: See `/docs` folder  
**API Docs**: `/docs/API.md`  
**Setup Guide**: `/docs/SETUP.md`

**External Resources**:
- React Docs: https://react.dev
- Prisma Docs: https://www.prisma.io/docs
- Stripe Docs: https://stripe.com/docs
- Google Maps API: https://developers.google.com/maps
- Socket.io Docs: https://socket.io/docs

---

## Next Steps After MVP

1. **User Testing** - Get 5-10 real tourists and guides to test
2. **Analytics Integration** - Add Google Analytics or Mixpanel
3. **Mobile Optimization** - Improve mobile web experience
4. **Performance Optimization** - Profile and optimize slow queries
5. **Security Audit** - Review for security vulnerabilities
6. **Feature Expansion** - Add features from "Out of Scope" list
7. **Mobile Apps** - Build React Native apps
8. **Scale Infrastructure** - Upgrade to paid tiers as needed

---

**Last Updated**: November 9, 2025  
**Version**: 1.0 - Initial MVP Specification
