import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Calendar, Clock, Navigation, Radio } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Loading } from '../components/common/Loading'
import { ChatBox } from '../components/chat/ChatBox'
import MockMap from '../components/common/MockMap'
import MobileAppLayout from '../components/layout/MobileAppLayout'
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
      const response = await api.get<Booking>(`/api/bookings/${id}`)
      if (response.success && response.data) {
        setBooking(response.data)
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
    <MobileAppLayout>
      {/* Header */}
      <div className="bg-white border-b-2 border-neutral-100 sticky top-0 z-10">
        <div className="px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 font-semibold transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Live Tracking - Show when tour is active */}
        {booking.status === 'STARTED' && (
          <div className="animate-fade-in-up">
            <div className="bg-gradient-to-r from-success-600 to-primary-600 text-white p-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 animate-pulse" />
                  <span className="font-bold text-sm">Tour In Progress</span>
                </div>
                <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                  <Navigation className="w-3 h-3" />
                  Live Tracking
                </div>
              </div>
            </div>
            <MockMap
              center={{ lat: 51.752, lng: -1.2577 }}
              markers={[
                {
                  lat: 51.752,
                  lng: -1.2577,
                  label: 'Meeting Point',
                  icon: 'pin',
                  color: '#ef4444',
                },
              ]}
              showControls={true}
              showUserLocation={!isGuide}
              animateGuide={true}
              className="h-64 rounded-b-xl"
            />
            <div className="mt-3 p-3 bg-success-50 border-2 border-success-200 rounded-xl">
              <p className="text-xs text-success-700 text-center font-medium">
                {isGuide ? 'Tourist can see your live location' : 'Following guide in real-time'}
              </p>
            </div>
          </div>
        )}

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-neutral-900">Booking Details</h1>
            <Badge variant={statusVariants[booking.status as BookingStatus]}>
              {booking.status}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
              <Avatar src={otherUser?.photo} name={otherUser?.name} size="lg" />
              <div>
                <p className="font-bold text-neutral-900">{otherUser?.name}</p>
                <p className="text-sm text-neutral-600">
                  {isGuide ? 'Tourist' : 'Your Guide'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-700 text-sm">
                <Calendar className="w-4 h-4 text-primary-600" />
                <span>
                  {booking.scheduledDate
                    ? formatDate(booking.scheduledDate, 'PPpp')
                    : 'Instant booking'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-neutral-700 text-sm">
                <Clock className="w-4 h-4 text-primary-600" />
                <span>{booking.duration} minutes</span>
              </div>

              <div className="flex items-center gap-2 text-neutral-700 text-sm">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span className="flex-1">{booking.meetingPoint}</span>
              </div>
            </div>

            <div className="border-t-2 border-neutral-100 pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-neutral-700">Total Price:</span>
                <span className="text-2xl font-bold text-primary-600">{formatCurrency(booking.totalPrice)}</span>
              </div>
              {isGuide && (
                <div className="flex justify-between text-xs text-neutral-600 bg-success-50 p-2 rounded-lg">
                  <span>Your Earnings:</span>
                  <span className="font-bold text-success-700">
                    {formatCurrency(booking.guideEarnings)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {booking.status === 'COMPLETED' && !isGuide && (
          <button
            onClick={() => navigate(`/bookings/${booking.id}/review`)}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all"
          >
            Leave a Review
          </button>
        )}

        {/* Chat */}
        <div className="bg-white rounded-xl shadow-lg p-4 animate-fade-in-up">
          <h2 className="text-lg font-bold text-neutral-900 mb-3">Messages</h2>
          <ChatBox
            bookingId={booking.id}
            otherUser={{
              name: otherUser?.name || 'User',
              photo: otherUser?.photo,
            }}
          />
        </div>
      </div>
    </MobileAppLayout>
  )
}
