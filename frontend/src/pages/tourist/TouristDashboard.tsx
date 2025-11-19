import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Star, Search, TrendingUp, CheckCircle, Radio, Navigation, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../../components/common/Avatar'
import { Badge } from '../../components/common/Badge'
import { Loading } from '../../components/common/Loading'
import MockMap from '../../components/common/MockMap'
import MobileAppLayout from '../../components/layout/MobileAppLayout'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { demoBookings, isDemoMode } from '../../data/demoData'
import type { Booking, BookingStatus } from '../../types'

const statusVariants: Record<BookingStatus, 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  STARTED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'gray',
}

export default function TouristDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      // Use demo data for demo accounts (no API calls!)
      if (isDemoMode(user?.email)) {
        setBookings(demoBookings as any[])
      } else {
        // For real accounts, would call API here
        setBookings([])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'upcoming') {
      return ['PENDING', 'CONFIRMED', 'STARTED'].includes(booking.status)
    }
    if (filter === 'past') {
      return ['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(booking.status)
    }
    return true
  })

  const upcomingCount = bookings.filter((b) => ['PENDING', 'CONFIRMED', 'STARTED'].includes(b.status)).length
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length
  const activeTour = bookings.find((b) => b.status === 'STARTED')

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loading size="lg" text="Loading your dashboard..." variant="dots" fullScreen />
      </div>
    )
  }

  return (
    <MobileAppLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white px-4 py-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold opacity-90">Tourist Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-sm opacity-90">
          Manage your bookings and explore new tours
        </p>
      </div>

      {/* Active Tour - Live Tracking */}
      {activeTour && (
        <div className="px-4 pt-4 animate-fade-in-up">
          <div className="bg-gradient-to-r from-success-600 to-primary-600 text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm">Tour In Progress</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                <Navigation className="w-3 h-3" />
                Live Tracking
              </div>
            </div>
            <p className="text-sm opacity-90">Following {activeTour.guide?.user?.name}</p>
          </div>
          <MockMap
            center={{ lat: 51.752, lng: -1.2577 }}
            markers={[
              {
                lat: 51.752,
                lng: -1.2577,
                label: 'Meeting',
                icon: 'pin',
                color: '#ef4444',
              },
            ]}
            showControls={true}
            showUserLocation={true}
            animateGuide={true}
            className="h-48 rounded-b-xl"
          />
          <div className="mt-3 mb-4">
            <button
              onClick={() => navigate(`/bookings/${activeTour.id}`)}
              className="w-full bg-white text-primary-700 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              View Tour Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-center text-primary-600">{upcomingCount}</div>
            <div className="text-[10px] text-neutral-500 text-center">Upcoming</div>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <div className="text-2xl font-bold text-center text-success-600">{completedCount}</div>
            <div className="text-[10px] text-neutral-500 text-center">Completed</div>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <TrendingUp className="w-5 h-5 text-neutral-600" />
            </div>
            <div className="text-2xl font-bold text-center text-neutral-900">{bookings.length}</div>
            <div className="text-[10px] text-neutral-500 text-center">Total</div>
          </div>
        </div>

        {/* Quick Action */}
        <button
          onClick={() => navigate('/browse-guides')}
          className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mb-4"
        >
          <Search className="w-5 h-5" />
          Find New Guides
        </button>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-neutral-600 border-2 border-neutral-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              filter === 'upcoming'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-neutral-600 border-2 border-neutral-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              filter === 'past'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-neutral-600 border-2 border-neutral-200'
            }`}
          >
            Past
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm p-4 animate-fade-in-up active:scale-98 transition-all cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/bookings/${booking.id}`)}
              >
                <div className="flex gap-3 mb-3">
                  <Avatar
                    src={booking.guide?.user?.photo}
                    name={booking.guide?.user?.name}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 truncate">
                      {booking.guide?.user?.name}
                    </h3>
                    <Badge variant={statusVariants[booking.status as BookingStatus]} size="sm">
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">
                      {formatCurrency(booking.totalPrice)}
                    </div>
                    <div className="text-xs text-neutral-500">{booking.duration}min</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                    <span className="truncate">
                      {booking.scheduledDate
                        ? formatDate(booking.scheduledDate, 'PPp')
                        : 'Instant booking'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                    <span className="truncate">{booking.meetingPoint}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {booking.status === 'STARTED' && (
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-xs text-success-700 bg-success-50 px-3 py-2 rounded-lg">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span className="font-semibold">Tour is active • Click to track</span>
                    </div>
                  </div>
                )}

                {booking.status === 'COMPLETED' && !booking.review && (
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/bookings/${booking.id}/review`)
                      }}
                      className="w-full bg-primary-50 text-primary-700 py-2 rounded-lg text-sm font-semibold hover:bg-primary-100 active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      <Star className="w-4 h-4" />
                      Leave Review
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">No bookings yet</h3>
              <p className="text-sm text-neutral-500 mb-4">Start exploring and book your first tour!</p>
              <button
                onClick={() => navigate('/browse-guides')}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all"
              >
                <Search className="w-4 h-4" />
                Browse Guides
              </button>
            </div>
          )}
        </div>
      </div>
    </MobileAppLayout>
  )
}
