import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Calendar, Star, TrendingUp, Users, Settings, Briefcase, LogOut, Sparkles, Power, Check, Play, CheckCircle2, ArrowRight } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../../components/common/Avatar'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'
import { formatCurrency, formatDate } from '../../utils/helpers'
import type { Guide, Booking, BookingStatus } from '../../types'

const statusVariants: Record<BookingStatus, 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  STARTED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'gray',
}

export default function GuideDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGuideData()
    fetchBookings()
  }, [])

  const fetchGuideData = async () => {
    try {
      const response = await api.get<Guide[]>(`/api/guides?userId=${user?.id}`)
      if (response.success && response.data && response.data.length > 0) {
        setGuide(response.data[0])
      }
    } catch (error) {
      console.error('Error fetching guide data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await api.get<Booking[]>('/api/bookings')
      if (response.success && response.data) {
        setBookings(response.data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const toggleAvailability = async () => {
    if (!guide) return

    try {
      await api.put(`/api/guides/${guide.id}/availability`)
      fetchGuideData()
    } catch (error: any) {
      alert(error.message || 'Failed to update availability')
    }
  }

  const handleStartTour = async (bookingId: string) => {
    try {
      await api.put(`/api/bookings/${bookingId}/start`)
      fetchBookings()
    } catch (error: any) {
      alert(error.message || 'Failed to start tour')
    }
  }

  const handleCompleteTour = async (bookingId: string) => {
    try {
      await api.put(`/api/bookings/${bookingId}/complete`)
      fetchBookings()
    } catch (error: any) {
      alert(error.message || 'Failed to complete tour')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const totalEarnings = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.guideEarnings, 0)

  const upcomingBookings = bookings.filter((b) =>
    ['PENDING', 'CONFIRMED', 'STARTED'].includes(b.status)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-secondary-50/20 flex items-center justify-center">
        <Loading size="lg" text="Loading dashboard..." variant="dots" fullScreen />
      </div>
    )
  }

  // If no guide profile exists, redirect to profile setup
  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-secondary-50/20 flex items-center justify-center px-4">
        <Card variant="elevated" padding="lg" className="max-w-md text-center animate-fade-in">
          <div className="inline-flex p-6 bg-secondary-100 rounded-full mb-6">
            <Briefcase className="w-12 h-12 text-secondary-600" />
          </div>
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-3">
            Complete Your Guide Profile
          </h2>
          <p className="text-lg text-neutral-600 mb-6">
            Set up your profile to start accepting tour bookings and earning money
          </p>
          <Button onClick={() => navigate('/guide/profile-setup')} fullWidth size="lg">
            <Sparkles className="w-5 h-5" />
            Set Up Profile
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-secondary-50/20">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-secondary-600 via-secondary-700 to-primary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

        <div className="relative container-custom py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-fade-in-up">
              <Avatar src={guide.user?.photo} name={guide.user?.name} size="xl" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs font-semibold">Guide Dashboard</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">
                  {guide.user?.name}
                </h1>
                <div className="flex items-center gap-3">
                  {guide.status === 'PENDING' && (
                    <Badge variant="warning" size="md" dot>Pending Approval</Badge>
                  )}
                  {guide.status === 'APPROVED' && (
                    <Badge variant="success" size="md" icon={<Check className="w-3 h-3" />}>Approved</Badge>
                  )}
                  {guide.status === 'REJECTED' && (
                    <Badge variant="danger" size="md">Rejected</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleAvailability}
                className={`
                  group flex items-center gap-2 px-5 py-3 rounded-xl font-bold shadow-lg transition-all
                  ${guide.isAvailable
                    ? 'bg-success-500 hover:bg-success-600 text-white shadow-success-500/30'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30'
                  }
                `}
              >
                <Power className="w-4 h-4" />
                {guide.isAvailable ? 'Available' : 'Unavailable'}
              </button>

              <Button onClick={() => navigate('/guide/profile')} variant="secondary" size="md">
                <Settings className="w-4 h-4" />
                Settings
              </Button>

              <Button onClick={handleLogout} variant="outline" size="md">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          <Card variant="elevated" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600 mb-2">Total Earnings</p>
                <div className="text-4xl font-display font-bold text-success-600 mb-1">
                  {formatCurrency(totalEarnings)}
                </div>
                <p className="text-xs text-neutral-500">All time</p>
              </div>
              <div className="p-3 bg-success-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600 mb-2">Upcoming Tours</p>
                <div className="text-4xl font-display font-bold text-primary-600 mb-1">
                  {upcomingBookings.length}
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
                <p className="text-sm font-semibold text-neutral-600 mb-2">Rating</p>
                <div className="text-4xl font-display font-bold text-warning-500 mb-1">
                  {guide.averageRating ? guide.averageRating.toFixed(1) : 'N/A'}
                </div>
                <p className="text-xs text-neutral-500">{guide.totalReviews} reviews</p>
              </div>
              <div className="p-3 bg-warning-100 rounded-xl">
                <Star className="w-6 h-6 text-warning-500" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600 mb-2">Total Tours</p>
                <div className="text-4xl font-display font-bold text-neutral-900 mb-1">
                  {bookings.length}
                </div>
                <p className="text-xs text-neutral-500">All time</p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-xl">
                <Users className="w-6 h-6 text-neutral-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <Card variant="bordered" padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-neutral-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Button onClick={() => navigate('/guide/tours')} fullWidth variant="secondary" size="lg">
                <Briefcase className="w-5 h-5" />
                Manage Tours
              </Button>
              <Button onClick={() => navigate('/guide/profile')} fullWidth variant="outline" size="lg">
                <Settings className="w-5 h-5" />
                Edit Profile
              </Button>
            </div>
          </Card>

          <Card variant="bordered" padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-secondary-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-neutral-900">Profile Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <span className="text-sm font-medium text-neutral-600">Status:</span>
                <Badge variant={guide.status === 'APPROVED' ? 'success' : 'warning'} size="md">
                  {guide.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <span className="text-sm font-medium text-neutral-600">Hourly Rate:</span>
                <span className="font-bold text-neutral-900">{formatCurrency(guide.hourlyRate)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <span className="text-sm font-medium text-neutral-600">Reviews:</span>
                <span className="font-bold text-neutral-900">{guide.totalReviews}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bookings */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-6">Upcoming Bookings</h2>

          {upcomingBookings.length > 0 ? (
            <div className="space-y-6">
              {upcomingBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Card variant="bordered" padding="lg" className="group">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex gap-4 flex-1">
                        <Avatar
                          src={booking.tourist?.user?.photo}
                          name={booking.tourist?.user?.name}
                          size="xl"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-display font-bold text-neutral-900 mb-2">
                                {booking.tourist?.user?.name}
                              </h3>
                              <Badge variant={statusVariants[booking.status as BookingStatus]} size="md" dot>
                                {booking.status}
                              </Badge>
                            </div>

                            <div className="text-right">
                              <div className="text-3xl font-display font-bold text-success-600">
                                {formatCurrency(booking.guideEarnings)}
                              </div>
                              <div className="text-sm text-neutral-500">Your earnings</div>
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
                              <Users className="w-4 h-4 flex-shrink-0" />
                              <span>{booking.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 flex-shrink-0" />
                              <span>{booking.meetingPoint}</span>
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

                            {booking.status === 'CONFIRMED' && (
                              <Button onClick={() => handleStartTour(booking.id)} size="sm">
                                <Play className="w-4 h-4" />
                                Start Tour
                              </Button>
                            )}

                            {booking.status === 'STARTED' && (
                              <Button onClick={() => handleCompleteTour(booking.id)} size="sm">
                                <CheckCircle2 className="w-4 h-4" />
                                Complete Tour
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
            <Card variant="bordered" padding="lg">
              <div className="text-center py-16 animate-fade-in">
                <div className="inline-flex p-6 bg-neutral-100 rounded-full mb-6">
                  <Calendar className="w-12 h-12 text-neutral-400" />
                </div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
                  No upcoming bookings
                </h3>
                <p className="text-neutral-600 text-lg mb-6 max-w-md mx-auto">
                  Toggle your availability to start receiving bookings from tourists
                </p>
                <Button onClick={toggleAvailability} size="lg">
                  <Power className="w-5 h-5" />
                  {guide.isAvailable ? 'You are available' : 'Set as Available'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
