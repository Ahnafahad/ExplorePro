# ExplorePro - Uber for Tour Guides

ExplorePro is a two-sided marketplace connecting tourists with local tour guides through instant and scheduled bookings. Think "Uber for Tour Guides" - tourists can book guides immediately or schedule in advance, with real-time GPS tracking, in-app payments, and dual review systems.

## 🚀 Project Status

**Phase**: MVP Prototype (Web-first)
**Target Launch**: 7-14 days for prototype
**Initial Market**: Oxford & Cambridge, UK

## 📋 Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS 3.4+
- React Router v6
- Axios (HTTP client)
- Google Maps JavaScript API
- React Hook Form + Zod validation
- Stripe for payments

### Backend
- Node.js 18+ with Express.js
- TypeScript
- PostgreSQL 14+ (Supabase)
- Prisma (ORM)
- JWT authentication
- HTTP Polling for real-time updates (Vercel-compatible)

### Deployment
- **Vercel** (full-stack - frontend + serverless functions)
- Supabase (PostgreSQL database)
- Stripe (payments in test mode)

## 📁 Project Structure

```
explorepro/
├── frontend/                 # React TypeScript app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (routes)
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer (axios, polling)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper functions
│   │   └── constants/       # Constants, config
│   └── package.json
│
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── polling/         # HTTP polling service
│   │   └── server.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── vercel.json              # Vercel deployment config
├── CLAUDE.md                # Project specifications
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or Supabase account)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ExplorePro
```

### 2. Set Up Backend

```bash
cd backend
npm install
```

Create `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database (get from Supabase or local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/explorepro"

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Stripe (test mode keys)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# SendGrid (optional for MVP)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@explorepro.com

# Supabase (for file storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with test data
npm run seed
```

### 4. Set Up Frontend

```bash
cd ../frontend
npm install
```

Create `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 5. Run Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 🗄️ Database Management

### Prisma Studio (Database GUI)

```bash
cd backend
npm run prisma:studio
```

This opens a web interface at http://localhost:5555 to view and edit your database.

### Create New Migration

```bash
cd backend
npm run prisma:migrate
```

## 🚀 Deployment to Vercel

### Initial Setup

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

### Environment Variables on Vercel

Add all environment variables from both `.env` files in the Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add variables for Production, Preview, and Development environments

### Important Notes for Vercel Deployment

- **Serverless Functions**: Backend runs as Vercel serverless functions (10s timeout on hobby plan)
- **Real-time Updates**: Uses HTTP polling instead of WebSockets (Vercel serverless limitation)
- **Database**: Use Supabase PostgreSQL or Vercel Postgres
- **Prisma**: Migrations run automatically during deployment via `vercel-build` script

## 🔄 Real-time Updates (HTTP Polling)

Since Vercel serverless functions don't support persistent WebSocket connections, we use HTTP polling:

### Backend Polling Service
Located at `backend/src/polling/pollingService.ts` - manages pending updates for users

### Frontend Polling Service
Located at `frontend/src/services/pollingService.ts` - polls backend every 3 seconds

### API Endpoint
- `GET /api/polling/updates?since=<timestamp>` - Get new updates
- `DELETE /api/polling/updates` - Clear updates

### Usage Example

```typescript
import { pollingService } from './services/pollingService'

// Start polling
pollingService.start()

// Subscribe to booking updates
pollingService.on('booking', (update) => {
  console.log('Booking update:', update)
})

// Subscribe to messages
pollingService.on('message', (update) => {
  console.log('New message:', update)
})

// Stop polling (e.g., on logout)
pollingService.stop()
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Guides
- `GET /api/guides` - List all approved guides
- `GET /api/guides/:id` - Get guide profile
- `POST /api/guides` - Create guide profile
- `PUT /api/guides/:id` - Update guide profile
- `PUT /api/guides/:id/availability` - Toggle availability
- `GET /api/guides/:id/tours` - Get guide's tours
- `GET /api/guides/:id/reviews` - Get guide's reviews

### Bookings
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/start` - Start tour
- `PUT /api/bookings/:id/complete` - Complete tour
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/:id/messages` - Get messages
- `POST /api/bookings/:id/messages` - Send message
- `POST /api/bookings/:id/location` - Update location

### Polling
- `GET /api/polling/updates` - Poll for updates
- `DELETE /api/polling/updates` - Clear updates

## 🧪 Testing

### Test the Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Test polling endpoint (requires auth)
curl http://localhost:5000/api/polling/updates \
  -H "Authorization: Bearer <your-token>"
```

## 📝 Scripts

### Frontend Scripts
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format with Prettier
```

### Backend Scripts
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript
npm start                # Run compiled code
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run seed             # Seed database
npm run vercel-build     # Vercel deployment build script
```

## 🔐 Security Notes

- ✅ All passwords are hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ CORS configured for frontend URL only
- ✅ Helmet.js for security headers
- ✅ Rate limiting on auth endpoints (to be implemented)
- ⚠️ Never commit `.env` files
- ⚠️ Use test mode for Stripe during development

## 🐛 Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify Supabase firewall settings

### Frontend Not Loading
- Check that backend is running on port 5000
- Verify `VITE_API_URL` in frontend `.env`
- Check browser console for errors

### Polling Not Working
- Ensure user is authenticated
- Check browser network tab for 401 errors
- Verify JWT token in localStorage

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Complete project specifications
- [Prisma Schema](./backend/prisma/schema.prisma) - Database schema
- [API Routes](./backend/src/routes/) - API endpoint implementations

## 🤝 Contributing

This is an MVP prototype. For development:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear message: `git commit -m "feat: add feature"`
4. Push and create PR: `git push origin feature/your-feature`

## 📄 License

Private project - All rights reserved

## 📞 Contact

**Project Owner**: Ahnaf Ahad
**Target Market**: Oxford & Cambridge, UK

---

**Built with ❤️ for the ExplorePro MVP**
