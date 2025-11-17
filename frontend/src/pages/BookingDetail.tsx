import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Calendar, Clock } from 'lucide-react'
import { api } from '../services/api'
import demoService from '../services/demoService'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Loading } from '../components/common/Loading'
import { ChatBox } from '../components/chat/ChatBox'
import { formatCurrency, formatDate } from '../utils/helpers'
import type { Booking, BookingStatus } from '../types'

const statusVariants: Record<BookingStatus, 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  STARTED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'gray',
}

export default function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooking()
  }, [id])

  const fetchBooking = async () => {
    try {
      // Use demo service if in demo mode
      if (demoService.isDemoMode()) {
        const response = await demoService.bookings.getById(id!)
        if (response.success && response.data) {
          setBooking(response.data)
        }
      } else {
        const response = await api.get<Booking>(`/api/bookings/${id}`)
        if (response.success && response.data) {
          setBooking(response.data)
        }
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading booking..." />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Booking not found</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const isGuide = user?.role === 'GUIDE'
  const otherUser = isGuide ? booking.tourist?.user : booking.guide?.user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
                <Badge variant={statusVariants[booking.status as BookingStatus]}>
                  {booking.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar src={otherUser?.photo} name={otherUser?.name} size="lg" />
                  <div>
                    <p className="font-semibold text-gray-900">{otherUser?.name}</p>
                    <p className="text-sm text-gray-600">
                      {isGuide ? 'Tourist' : 'Tour Guide'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {booking.scheduledDate
                        ? formatDate(booking.scheduledDate, 'PPpp')
                        : 'Instant booking'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5" />
                    <span>{booking.duration} minutes</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5" />
                    <span>{booking.meetingPoint}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Price:</span>
                    <span className="text-primary-600">{formatCurrency(booking.totalPrice)}</span>
                  </div>
                  {isGuide && (
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Your Earnings:</span>
                      <span className="font-medium">
                        {formatCurrency(booking.guideEarnings)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Chat */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
              <ChatBox
                bookingId={booking.id}
                otherUser={{
                  name: otherUser?.name || 'User',
                  photo: otherUser?.photo,
                }}
              />
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>

              {booking.status === 'COMPLETED' && !isGuide && (
                <Button
                  onClick={() => navigate(`/bookings/${booking.id}/review`)}
                  fullWidth
                  className="mb-3"
                >
                  Leave Review
                </Button>
              )}

              <Button
                onClick={() => navigate('/dashboard')}
                fullWidth
                variant="secondary"
              >
                Back to Dashboard
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
