import { ReactNode } from 'react'
import { Home, Compass, User, Calendar, LogOut } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DemoBanner from '../common/DemoBanner'

interface MobileAppLayoutProps {
  children: ReactNode
  showBottomNav?: boolean
  showLogout?: boolean
}

export default function MobileAppLayout({ children, showBottomNav = true, showLogout = true }: MobileAppLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout()
      navigate('/')
    }
  }

  const navItems = user?.role === 'TOURIST' ? [
    { icon: Home, label: 'Home', path: '/tourist/dashboard' },
    { icon: Compass, label: 'Explore', path: '/tourist/browse-guides' },
    { icon: Calendar, label: 'Bookings', path: '/tourist/dashboard' },
    { icon: User, label: 'Profile', path: '/tourist/dashboard' },
  ] : user?.role === 'GUIDE' ? [
    { icon: Home, label: 'Dashboard', path: '/guide/dashboard' },
    { icon: Compass, label: 'Tours', path: '/guide/tours' },
    { icon: Calendar, label: 'Bookings', path: '/guide/dashboard' },
    { icon: User, label: 'Profile', path: '/guide/profile-setup' },
  ] : user?.role === 'ADMIN' ? [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: User, label: 'Guides', path: '/admin/guides' },
    { icon: Calendar, label: 'Bookings', path: '/admin/dashboard' },
    { icon: User, label: 'Users', path: '/admin/dashboard' },
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Mobile App Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col">
        {/* Demo Banner */}
        <DemoBanner />

        {/* Logout Button - Floating */}
        {showLogout && (
          <button
            onClick={handleLogout}
            className="fixed top-14 right-4 z-50 w-10 h-10 bg-danger-500 hover:bg-danger-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-20">
          {children}
        </div>

        {/* Bottom Navigation - Fixed */}
        {showBottomNav && navItems.length > 0 && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md w-full bg-white border-t border-neutral-200 shadow-2xl z-50">
            <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
              {navItems.map((item, index) => {
                const isActive = location.pathname.startsWith(item.path)
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-500 hover:text-neutral-700 active:scale-95'
                    }`}
                  >
                    <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary-100' : ''}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}
