import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Tourist pages
import BrowseGuides from './pages/tourist/BrowseGuides'
import GuideDetail from './pages/tourist/GuideDetail'
import BookTour from './pages/tourist/BookTour'
import TouristDashboard from './pages/tourist/TouristDashboard'

// Guide pages
import GuideDashboard from './pages/guide/GuideDashboard'
import ProfileSetup from './pages/guide/ProfileSetup'
import TourManagement from './pages/guide/TourManagement'

// Shared pages
import BookingDetail from './pages/BookingDetail'
import ReviewPage from './pages/ReviewPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'

// Dashboard router component
function DashboardRouter() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  // Route to appropriate dashboard based on role
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />
  } else if (user.role === 'GUIDE') {
    return <Navigate to="/guide/dashboard" replace />
  } else {
    return <Navigate to="/tourist/dashboard" replace />
  }
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dynamic dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          {/* Tourist routes */}
          <Route
            path="/browse-guides"
            element={
              <ProtectedRoute allowedRoles={['TOURIST']}>
                <BrowseGuides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guides/:id"
            element={
              <ProtectedRoute allowedRoles={['TOURIST']}>
                <GuideDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:guideId"
            element={
              <ProtectedRoute allowedRoles={['TOURIST']}>
                <BookTour />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tourist/dashboard"
            element={
              <ProtectedRoute allowedRoles={['TOURIST']}>
                <TouristDashboard />
              </ProtectedRoute>
            }
          />

          {/* Guide routes */}
          <Route
            path="/guide/dashboard"
            element={
              <ProtectedRoute allowedRoles={['GUIDE']}>
                <GuideDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/profile-setup"
            element={
              <ProtectedRoute allowedRoles={['GUIDE']}>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/profile"
            element={
              <ProtectedRoute allowedRoles={['GUIDE']}>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/tours"
            element={
              <ProtectedRoute allowedRoles={['GUIDE']}>
                <TourManagement />
              </ProtectedRoute>
            }
          />

          {/* Shared routes (Tourist & Guide) */}
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute allowedRoles={['TOURIST', 'GUIDE']}>
                <BookingDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id/review"
            element={
              <ProtectedRoute allowedRoles={['TOURIST']}>
                <ReviewPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
