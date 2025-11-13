import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Clock, Star, Search, LogOut, TrendingUp, CheckCircle, X, ArrowRight, Sparkles } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../../components/common/Avatar'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/helpers'
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
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await api.get<Booking[]>('/api/bookings')
      if (response.success && response.data) {
        setBookings(response.data)
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

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      await api.delete(`/api/bookings/${bookingId}`)
      fetchBookings()
    } catch (error: any) {
      alert(error.message || 'Failed to cancel booking')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const upcomingCount = bookings.filter((b) => ['PENDING', 'CONFIRMED', 'STARTED'].includes(b.status)).length
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20 flex items-center justify-center">
        <Loading size="lg" text="Loading your dashboard..." variant="dots" fullScreen />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

        <div className="relative container-custom py-8">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-3">
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-semibold">Tourist Dashboard</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-lg text-white/90">
                Manage your bookings and explore new tours
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate('/browse-guides')} variant="secondary" size="lg">
                <Search className="w-4 h-4" />
                Find Guides
              </Button>
              <Button onClick={handleLogout} variant="outline" size="lg">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
          <Card variant="elevated" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600 mb-2">Upcoming Tours</p>
                <div className="text-4xl font-display font-bold text-primary-600 mb-1">
                  {upcomingCount}
                </div>
                <p className="text-xs text-neutral-500">Active bookings</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-xl">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600 mb-2">Completed</p>
                <div className="text-4xl font-display font-bold text-success-600 mb-1">
                  {completedCount}
                </div>
                <p className="text-xs text-neutral-500">Tours enjoyed</p>
              </div>
              <div className="p-3 bg-success-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600 mb-2">Total Bookings</p>
                <div className="text-4xl font-display font-bold text-neutral-900 mb-1">
                  {bookings.length}
                </div>
                <p className="text-xs text-neutral-500">All time</p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-neutral-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
            size="md"
          >
            All Bookings
            {filter === 'all' && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">{bookings.length}</span>}
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'primary' : 'outline'}
            onClick={() => setFilter('upcoming')}
            size="md"
          >
            Upcoming
            {filter === 'upcoming' && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">{upcomingCount}</span>}
          </Button>
          <Button
            variant={filter === 'past' ? 'primary' : 'outline'}
            onClick={() => setFilter('past')}
            size="md"
          >
            Past
            {filter === 'past' && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">{bookings.length - upcomingCount}</span>}
          </Button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => (
              <div
                key={booking.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card variant="bordered" padding="lg" className="group">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex gap-4 flex-1">
                      <Avatar
                        src={booking.guide?.user?.photo}
                        name={booking.guide?.user?.name}
                        size="xl"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-display font-bold text-neutral-900 mb-2">
                              {booking.guide?.user?.name}
                            </h3>
                            <Badge variant={statusVariants[booking.status as BookingStatus]} size="md" dot>
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-display font-bold text-primary-600">
                              {formatCurrency(booking.totalPrice)}
                            </div>
                            <div className="text-sm text-neutral-500">{booking.duration} minutes</div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-neutral-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {booking.scheduledDate
                                ? formatDate(booking.scheduledDate, 'PPpp')
                                : 'Instant booking'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{booking.meetingPoint}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>Booked {formatRelativeTime(booking.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200">
                          <Button
                            onClick={() => navigate(`/bookings/${booking.id}`)}
                            size="sm"
                            variant="secondary"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4" />
                          </Button>

                          {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                            <Button
                              onClick={() => handleCancelBooking(booking.id)}
                              size="sm"
                              variant="outline"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </Button>
                          )}

                          {booking.status === 'COMPLETED' && !booking.review && (
                            <Button
                              onClick={() => navigate(`/bookings/${booking.id}/review`)}
                              size="sm"
                              variant="primary"
                            >
                              <Star className="w-4 h-4" />
                              Leave Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex p-6 bg-neutral-100 rounded-full mb-6">
              <Calendar className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
              {filter === 'all'
                ? 'No bookings yet'
                : filter === 'upcoming'
                ? 'No upcoming tours'
                : 'No past tours'}
            </h3>
            <p className="text-neutral-600 text-lg mb-6 max-w-md mx-auto">
              {filter === 'all'
                ? 'Start exploring and book your first tour with a local guide'
                : filter === 'upcoming'
                ? 'Browse our guides to book your next adventure'
                : 'Your completed tours will appear here'}
            </p>
            <Button onClick={() => navigate('/browse-guides')} size="lg">
              <Search className="w-5 h-5" />
              Browse Guides
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
