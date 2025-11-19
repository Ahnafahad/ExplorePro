import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Clock, MapPin, ChevronLeft, Check, Sparkles, Shield } from 'lucide-react'
import { api } from '../../services/api'
import { Avatar } from '../../components/common/Avatar'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'
import MockStripeCheckout from '../../components/common/MockStripeCheckout'
import MobileAppLayout from '../../components/layout/MobileAppLayout'
import { formatCurrency, calculateTotalPrice, calculateEarnings } from '../../utils/helpers'
import { MIN_TOUR_DURATION } from '../../constants'
import type { Guide } from '../../types'

const bookingSchema = z.object({
  type: z.enum(['INSTANT', 'SCHEDULED']),
  scheduledDate: z.string().optional(),
  duration: z.number().min(MIN_TOUR_DURATION, `Minimum ${MIN_TOUR_DURATION} minutes`),
  meetingPoint: z.string().min(5, 'Meeting point is required'),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function BookTour() {
  const { guideId } = useParams()
  const navigate = useNavigate()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [showPayment, setShowPayment] = useState(false)
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      type: 'INSTANT',
      duration: 60,
    },
  })

  const bookingType = watch('type')
  const duration = watch('duration')

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await api.get<Guide>(`/api/guides/${guideId}`)
        if (response.success && response.data) {
          setGuide(response.data)
        }
      } catch (error) {
        console.error('Error fetching guide:', error)
      } finally {
        setLoading(false)
      }
    }

    if (guideId) fetchGuide()
  }, [guideId])

  const totalPrice = guide ? calculateTotalPrice(guide.hourlyRate, duration || 60) : 0
  const { commission } = calculateEarnings(totalPrice)

  const onSubmit = async (data: BookingFormData) => {
    if (!guide) return
    setBookingData(data)
    setShowPayment(true)
    setStep('payment')
  }

  const handlePaymentSuccess = async () => {
    if (!guide || !bookingData) return

    try {
      setLoading(true)

      const bookingPayload = {
        guideId: guide.id,
        type: bookingData.type,
        scheduledDate: bookingData.scheduledDate || undefined,
        duration: bookingData.duration,
        meetingPoint: bookingData.meetingPoint,
        totalPrice,
      }

      await api.post('/api/bookings', bookingPayload)
      navigate('/dashboard')
    } catch (error: any) {
      alert(error.message || 'Failed to create booking')
      setShowPayment(false)
      setStep('details')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setStep('details')
  }

  if (loading && !guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20 flex items-center justify-center">
        <Loading size="lg" text="Loading..." variant="dots" fullScreen />
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="inline-flex p-6 bg-neutral-100 rounded-full mb-6">
            <MapPin className="w-12 h-12 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
            Guide not found
          </h3>
          <p className="text-neutral-600 text-lg mb-6">
            The guide you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/browse-guides')} size="lg">
            Browse Guides
          </Button>
        </div>
      </div>
    )
  }

  return (
    <MobileAppLayout showBottomNav={false}>
      {/* Mock Stripe Checkout */}
      {showPayment && (
        <MockStripeCheckout
          amount={totalPrice}
          currency="GBP"
          description={`Tour with ${guide?.user?.name}`}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}

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

      <div className="px-4 py-6">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 rounded-full mb-4">
            <Sparkles className="w-3 h-3 text-primary-600" />
            <span className="text-xs font-semibold text-primary-700">Secure Booking</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-3">
            Book Your Tour
          </h1>
          <p className="text-lg text-neutral-600">
            Complete your booking in {step === 'details' ? 'two' : 'one more'} simple step{step === 'details' ? 's' : ''}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${step === 'details' ? 'bg-primary-600 text-white' : 'bg-success-500 text-white'}
              `}>
                {step === 'payment' ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-semibold text-neutral-900">Tour Details</span>
            </div>
            <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div className={`h-full bg-primary-600 transition-all duration-500 ${
                step === 'payment' ? 'w-full' : 'w-0'
              }`} />
            </div>
            <div className="flex items-center gap-3 flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${step === 'payment' ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'}
              `}>
                2
              </div>
              <span className={`font-semibold ${
                step === 'payment' ? 'text-neutral-900' : 'text-neutral-500'
              }`}>Payment</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-4 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Calendar className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">Tour Details</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Select
                label="Booking Type"
                options={[
                  { value: 'INSTANT', label: '⚡ Book Now (Instant)' },
                  { value: 'SCHEDULED', label: '📅 Schedule for Later' },
                ]}
                {...register('type')}
                error={errors.type?.message}
              />

              {bookingType === 'SCHEDULED' && (
                <Input
                  label="Scheduled Date & Time"
                  type="datetime-local"
                  icon={<Calendar className="w-5 h-5" />}
                  {...register('scheduledDate')}
                  error={errors.scheduledDate?.message}
                />
              )}

              <Input
                label="Duration (minutes)"
                type="number"
                placeholder="60"
                icon={<Clock className="w-5 h-5" />}
                {...register('duration', { valueAsNumber: true })}
                error={errors.duration?.message}
                helperText="Minimum 30 minutes"
              />

              <Input
                label="Meeting Point"
                type="text"
                placeholder="e.g., Radcliffe Camera, Oxford"
                icon={<MapPin className="w-5 h-5" />}
                {...register('meetingPoint')}
                error={errors.meetingPoint?.message}
              />

              <div className="border-t-2 border-neutral-100 pt-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-neutral-700">Total Price:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Includes 15% platform fee
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-lg p-4 animate-fade-in-up">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Booking Summary</h3>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-neutral-100">
              <Avatar src={guide.user?.photo} name={guide.user?.name} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-neutral-900 truncate">{guide.user?.name}</p>
                <p className="text-sm text-neutral-600">Your Guide</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Hourly Rate:</span>
                <span className="font-bold text-neutral-900">{formatCurrency(guide.hourlyRate)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Duration:</span>
                <span className="font-bold text-neutral-900">{duration} min</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Platform Fee:</span>
                <span className="font-bold text-neutral-900">{formatCurrency(commission)}</span>
              </div>

              <div className="border-t-2 border-neutral-100 pt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-neutral-900">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-success-50 rounded-xl border-2 border-success-200">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-success-900 mb-1">
                    Free Cancellation
                  </p>
                  <p className="text-[10px] text-success-700 leading-relaxed">
                    Cancel up to 24 hours before for a full refund
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileAppLayout>
  )
}
