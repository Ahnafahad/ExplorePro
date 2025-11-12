import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Calendar, Clock, MapPin, ChevronLeft } from 'lucide-react'
import { api } from '../../services/api'
import { Avatar } from '../../components/common/Avatar'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'
import { formatCurrency, calculateTotalPrice, calculateEarnings } from '../../utils/helpers'
import { STRIPE_PUBLISHABLE_KEY, MIN_TOUR_DURATION } from '../../constants'
import type { Guide } from '../../types'

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

const bookingSchema = z.object({
  type: z.enum(['INSTANT', 'SCHEDULED']),
  scheduledDate: z.string().optional(),
  duration: z.number().min(MIN_TOUR_DURATION, `Minimum ${MIN_TOUR_DURATION} minutes`),
  meetingPoint: z.string().min(5, 'Meeting point is required'),
})

type BookingFormData = z.infer<typeof bookingSchema>

function CheckoutForm({
  clientSecret,
  onSuccess,
}: {
  clientSecret: string
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
        redirect: 'if_required',
      })

      if (submitError) {
        setError(submitError.message || 'Payment failed')
      } else {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button type="submit" fullWidth loading={loading} disabled={!stripe || loading}>
        Confirm and Pay
      </Button>
    </form>
  )
}

export default function BookTour() {
  const { guideId } = useParams()
  const navigate = useNavigate()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [clientSecret, setClientSecret] = useState('')
  const [bookingData, setBookingData] = useState<any>(null)

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
  const { commission, guideEarnings } = calculateEarnings(totalPrice)

  const onSubmit = async (data: BookingFormData) => {
    if (!guide) return

    try {
      setLoading(true)

      const bookingPayload = {
        guideId: guide.id,
        type: data.type,
        scheduledDate: data.scheduledDate || undefined,
        duration: data.duration,
        meetingPoint: data.meetingPoint,
        totalPrice,
      }

      const response = await api.post('/api/bookings', bookingPayload)

      if (response.success && response.data) {
        setBookingData(response.data.booking)
        setClientSecret(response.data.paymentIntent.clientSecret)
        setStep('payment')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    navigate('/dashboard')
  }

  if (loading && !guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Guide not found</p>
          <Button onClick={() => navigate('/browse-guides')}>Browse Guides</Button>
        </div>
      </div>
    )
  }

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Tour</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {step === 'details' ? (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tour Details</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Select
                    label="Booking Type"
                    options={[
                      { value: 'INSTANT', label: 'Book Now (Instant)' },
                      { value: 'SCHEDULED', label: 'Schedule for Later' },
                    ]}
                    {...register('type')}
                    error={errors.type?.message}
                  />

                  {bookingType === 'SCHEDULED' && (
                    <Input
                      label="Scheduled Date & Time"
                      type="datetime-local"
                      {...register('scheduledDate')}
                      error={errors.scheduledDate?.message}
                    />
                  )}

                  <Input
                    label="Duration (minutes)"
                    type="number"
                    placeholder="60"
                    {...register('duration', { valueAsNumber: true })}
                    error={errors.duration?.message}
                    helperText="Minimum 30 minutes"
                  />

                  <Input
                    label="Meeting Point"
                    type="text"
                    placeholder="e.g., Oxford University, Radcliffe Camera"
                    {...register('meetingPoint')}
                    error={errors.meetingPoint?.message}
                  />

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Price:</span>
                      <span className="text-primary-600">{formatCurrency(totalPrice)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Includes 15% platform fee
                    </p>
                  </div>

                  <Button type="submit" fullWidth loading={loading}>
                    Continue to Payment
                  </Button>
                </form>
              </Card>
            ) : (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment</h2>

                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                  </Elements>
                )}
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <Avatar src={guide.user?.photo} name={guide.user?.name} size="md" />
                <div>
                  <p className="font-semibold text-gray-900">{guide.user?.name}</p>
                  <p className="text-sm text-gray-600">Your Guide</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-medium">{formatCurrency(guide.hourlyRate)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{duration} minutes</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee (15%):</span>
                  <span className="font-medium">{formatCurrency(commission)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Free cancellation up to 24 hours before the tour. See our{' '}
                  <a href="#" className="text-primary-600 hover:underline">
                    cancellation policy
                  </a>
                  .
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
