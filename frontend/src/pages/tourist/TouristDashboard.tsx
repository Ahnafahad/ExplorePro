import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Clock, MessageSquare, Star, Search } from 'lucide-react'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/browse-guides')} variant="secondary">
                <Search className="w-4 h-4 mr-2" />
                Find Guides
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">Manage your bookings and upcoming tours</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {bookings.filter((b) => ['PENDING', 'CONFIRMED', 'STARTED'].includes(b.status)).length}
              </div>
              <p className="text-gray-600">Upcoming Tours</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {bookings.filter((b) => b.status === 'COMPLETED').length}
              </div>
              <p className="text-gray-600">Completed Tours</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {bookings.length}
              </div>
              <p className="text-gray-600">Total Bookings</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            All Bookings
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'primary' : 'secondary'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'past' ? 'primary' : 'secondary'}
            onClick={() => setFilter('past')}
          >
            Past
          </Button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <Avatar
                      src={booking.guide?.user?.photo}
                      name={booking.guide?.user?.name}
                      size="lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.guide?.user?.name}
                          </h3>
                          <Badge variant={statusVariants[booking.status as BookingStatus]}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">
                            {formatCurrency(booking.totalPrice)}
                          </div>
                          <div className="text-xs text-gray-500">{booking.duration} min</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {booking.scheduledDate
                              ? formatDate(booking.scheduledDate, 'PPpp')
                              : 'Instant booking'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.meetingPoint}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Booked {formatRelativeTime(booking.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                          size="sm"
                          variant="secondary"
                        >
                          View Details
                        </Button>

                        {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                          <Button
                            onClick={() => handleCancelBooking(booking.id)}
                            size="sm"
                            variant="danger"
                          >
                            Cancel
                          </Button>
                        )}

                        {booking.status === 'COMPLETED' && !booking.review && (
                          <Button
                            onClick={() => navigate(`/bookings/${booking.id}/review`)}
                            size="sm"
                            variant="primary"
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Leave Review
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
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {filter === 'all'
                ? 'No bookings yet'
                : filter === 'upcoming'
                ? 'No upcoming tours'
                : 'No past tours'}
            </p>
            <Button onClick={() => navigate('/browse-guides')}>
              <Search className="w-4 h-4 mr-2" />
              Browse Guides
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
