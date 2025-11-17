import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Calendar, Clock, MapPin, ChevronLeft, CreditCard, Check, Sparkles, Shield } from 'lucide-react'
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
  onSuccess,
}: {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-5 bg-neutral-50 rounded-xl border-2 border-neutral-100">
        <PaymentElement />
      </div>

      {error && (
        <div className="p-4 bg-danger-50 border-2 border-danger-200 rounded-xl animate-fade-in">
          <p className="text-sm font-medium text-danger-700">{error}</p>
        </div>
      )}

      <Button type="submit" fullWidth size="lg" loading={loading} disabled={!stripe || loading}>
        {!loading && (
          <>
            <CreditCard className="w-5 h-5" />
            Confirm and Pay
          </>
        )}
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

      const response = await api.post<{
        booking: any
        paymentIntent: { clientSecret: string }
      }>('/api/bookings', bookingPayload)

      if (response.success && response.data) {
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      {/* Header */}
      <div className="bg-white border-b-2 border-neutral-100 shadow-soft">
        <div className="container-custom py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 font-semibold transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {step === 'details' ? (
              <Card variant="elevated" padding="lg" className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-neutral-900">Tour Details</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="e.g., Oxford University, Radcliffe Camera"
                    icon={<MapPin className="w-5 h-5" />}
                    {...register('meetingPoint')}
                    error={errors.meetingPoint?.message}
                  />

                  <div className="border-t-2 border-neutral-100 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-neutral-700">Total Price:</span>
                      <span className="text-3xl font-display font-bold text-primary-600">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">
                      Includes 15% platform fee
                    </p>
                  </div>

                  <Button type="submit" fullWidth size="lg" loading={loading}>
                    {!loading && (
                      <>
                        Continue to Payment
                        <Check className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            ) : (
              <Card variant="elevated" padding="lg" className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-success-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-success-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-neutral-900">Payment</h2>
                </div>

                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm onSuccess={handlePaymentSuccess} />
                  </Elements>
                )}
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 animate-fade-in-up">
              <Card variant="elevated" padding="lg" className="border-2 border-primary-200">
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-6">Booking Summary</h3>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-neutral-100">
                  <Avatar src={guide.user?.photo} name={guide.user?.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-neutral-900 truncate">{guide.user?.name}</p>
                    <p className="text-sm text-neutral-600">Your Guide</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 font-medium">Hourly Rate:</span>
                    <span className="font-bold text-neutral-900">{formatCurrency(guide.hourlyRate)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 font-medium">Duration:</span>
                    <span className="font-bold text-neutral-900">{duration} minutes</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 font-medium">Platform Fee (15%):</span>
                    <span className="font-bold text-neutral-900">{formatCurrency(commission)}</span>
                  </div>

                  <div className="border-t-2 border-neutral-100 pt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-neutral-900">Total:</span>
                    <span className="text-3xl font-display font-bold text-primary-600">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-success-50 rounded-xl border-2 border-success-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-success-900 mb-1">
                        Free Cancellation
                      </p>
                      <p className="text-xs text-success-700 leading-relaxed">
                        Cancel up to 24 hours before the tour for a full refund
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 text-center">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-primary-600 hover:underline font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:underline font-medium">
                    Cancellation Policy
                  </a>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
