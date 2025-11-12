import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Calendar, Star, TrendingUp, Users, Settings, Briefcase } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../../components/common/Avatar'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/helpers'
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
      // First check if guide profile exists
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

  const totalEarnings = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.guideEarnings, 0)

  const upcomingBookings = bookings.filter((b) =>
    ['PENDING', 'CONFIRMED', 'STARTED'].includes(b.status)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  // If no guide profile exists, redirect to profile setup
  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <Briefcase className="w-16 h-16 mx-auto text-primary-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Guide Profile
          </h2>
          <p className="text-gray-600 mb-6">
            Set up your profile to start accepting tour bookings
          </p>
          <Button onClick={() => navigate('/guide/profile-setup')} fullWidth>
            Set Up Profile
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar src={guide.user?.photo} name={guide.user?.name} size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{guide.user?.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  {guide.status === 'PENDING' && (
                    <Badge variant="warning">Pending Approval</Badge>
                  )}
                  {guide.status === 'APPROVED' && (
                    <Badge variant="success">Approved</Badge>
                  )}
                  {guide.status === 'REJECTED' && (
                    <Badge variant="danger">Rejected</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="text-sm text-gray-600">Availability</p>
                <button
                  onClick={toggleAvailability}
                  className={`mt-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    guide.isAvailable
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {guide.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>

              <Button onClick={() => navigate('/guide/profile')} variant="secondary">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>

              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalEarnings)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Tours</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {guide.averageRating ? guide.averageRating.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tours</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button onClick={() => navigate('/guide/tours')} fullWidth variant="secondary">
                Manage Tours
              </Button>
              <Button onClick={() => navigate('/guide/profile')} fullWidth variant="secondary">
                Edit Profile
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Profile Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant={guide.status === 'APPROVED' ? 'success' : 'warning'}>
                  {guide.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hourly Rate:</span>
                <span className="font-medium">{formatCurrency(guide.hourlyRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reviews:</span>
                <span className="font-medium">{guide.totalReviews}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bookings */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Bookings</h2>

        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <Avatar
                      src={booking.tourist?.user?.photo}
                      name={booking.tourist?.user?.name}
                      size="lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.tourist?.user?.name}
                          </h3>
                          <Badge variant={statusVariants[booking.status as BookingStatus]}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">
                            {formatCurrency(booking.guideEarnings)}
                          </div>
                          <div className="text-xs text-gray-500">Your earnings</div>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p>
                          <strong>When:</strong>{' '}
                          {booking.scheduledDate
                            ? formatDate(booking.scheduledDate, 'PPpp')
                            : 'Instant booking'}
                        </p>
                        <p>
                          <strong>Duration:</strong> {booking.duration} minutes
                        </p>
                        <p>
                          <strong>Meeting Point:</strong> {booking.meetingPoint}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                          size="sm"
                          variant="secondary"
                        >
                          View Details
                        </Button>

                        {booking.status === 'CONFIRMED' && (
                          <Button onClick={() => handleStartTour(booking.id)} size="sm">
                            Start Tour
                          </Button>
                        )}

                        {booking.status === 'STARTED' && (
                          <Button
                            onClick={() => handleCompleteTour(booking.id)}
                            size="sm"
                            variant="primary"
                          >
                            Complete Tour
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No upcoming bookings</p>
              <p className="text-sm text-gray-500 mt-2">
                Toggle your availability to start receiving bookings
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
