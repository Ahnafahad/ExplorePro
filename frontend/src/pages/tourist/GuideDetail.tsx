import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, Clock, Calendar, Languages, Award, ChevronLeft, Sparkles, Check, Zap } from 'lucide-react'
import { api } from '../../services/api'
import { Avatar } from '../../components/common/Avatar'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { StarRating } from '../../components/common/StarRating'
import { Loading } from '../../components/common/Loading'
import { formatCurrency, formatRelativeTime } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'
import type { Guide, Tour, Review } from '../../types'

export default function GuideDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await api.get<Guide>(`/api/guides/${id}`)
        if (response.success && response.data) {
          setGuide(response.data)
        }
      } catch (error) {
        console.error('Error fetching guide:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchGuide()
  }, [id])

  const handleBookNow = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate(`/book/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20 flex items-center justify-center">
        <Loading size="lg" text="Loading guide details..." variant="dots" fullScreen />
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
            Back to guides
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
            {/* Guide Profile */}
            <Card variant="elevated" padding="lg">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative flex-shrink-0">
                  <Avatar src={guide.user?.photo} name={guide.user?.name} size="2xl" />
                  {guide.isAvailable && (
                    <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-3 py-1.5 bg-success-500 text-white rounded-full text-xs font-semibold shadow-lg">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>Available</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-4xl font-display font-bold text-neutral-900 mb-3">
                        {guide.user?.name}
                      </h1>
                      {guide.averageRating && guide.averageRating > 0 ? (
                        <div className="flex items-center gap-3">
                          <StarRating rating={guide.averageRating} showNumber />
                          <span className="text-neutral-600 font-medium">
                            ({guide.totalReviews} review{guide.totalReviews !== 1 ? 's' : ''})
                          </span>
                        </div>
                      ) : (
                        <Badge variant="info" size="lg" dot>
                          New Guide - No reviews yet
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Languages className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">
                          Languages
                        </div>
                        <div className="font-medium text-neutral-900">
                          {guide.languages?.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-xl">
                      <div className="p-2 bg-secondary-100 rounded-lg">
                        <Award className="w-5 h-5 text-secondary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-1">
                          Specialties
                        </div>
                        <div className="font-medium text-neutral-900">
                          {guide.specialties?.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card variant="bordered" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-display font-bold text-neutral-900">About Me</h2>
              </div>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{guide.bio}</p>
            </Card>

            {/* Tours Offered */}
            {guide.tours && guide.tours.length > 0 && (
              <Card variant="bordered" padding="lg">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-neutral-900">Tours Offered</h2>
                </div>
                <div className="space-y-4">
                  {guide.tours.map((tour: Tour, index: number) => (
                    <div
                      key={tour.id}
                      className="relative p-5 border-2 border-neutral-200 rounded-xl hover:border-primary-300 hover:shadow-medium transition-all animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-l-xl" />
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-display font-bold text-neutral-900">{tour.title}</h3>
                        <div className="text-2xl font-display font-bold text-primary-600 flex-shrink-0">
                          {formatCurrency(tour.price)}
                        </div>
                      </div>
                      <p className="text-neutral-600 leading-relaxed mb-4">{tour.description}</p>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{tour.duration} minutes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            {guide.reviews && guide.reviews.length > 0 && (
              <Card variant="bordered" padding="lg">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-warning-100 rounded-lg">
                    <Star className="w-5 h-5 text-warning-500" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-neutral-900">Reviews</h2>
                </div>
                <div className="space-y-6">
                  {guide.reviews.map((review: Review, index: number) => (
                    <div
                      key={review.id}
                      className="border-b-2 border-neutral-100 last:border-0 pb-6 last:pb-0 animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <Avatar
                          src={review.tourist?.user?.photo}
                          name={review.tourist?.user?.name}
                          size="md"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-neutral-900">
                              {review.tourist?.user?.name}
                            </p>
                            <span className="text-sm text-neutral-500">
                              {formatRelativeTime(review.createdAt)}
                            </span>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-neutral-700 leading-relaxed ml-14">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <Card variant="elevated" padding="lg" className="border-2 border-primary-200">
                {/* Price */}
                <div className="text-center mb-6 pb-6 border-b-2 border-neutral-100">
                  <div className="inline-flex items-baseline gap-2">
                    <div className="text-5xl font-display font-bold text-primary-600">
                      {formatCurrency(guide.hourlyRate)}
                    </div>
                    <div className="text-lg text-neutral-600 font-semibold">/hour</div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button onClick={handleBookNow} fullWidth size="lg" className="mb-6">
                  {guide.isAvailable ? (
                    <>
                      <Zap className="w-5 h-5" />
                      Book Now
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      Schedule Tour
                    </>
                  )}
                </Button>

                {/* Features */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-neutral-700">
                    <div className="flex items-center justify-center w-8 h-8 bg-success-100 rounded-lg flex-shrink-0">
                      <Check className="w-4 h-4 text-success-600" />
                    </div>
                    <span className="font-medium">Flexible scheduling</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-700">
                    <div className="flex items-center justify-center w-8 h-8 bg-success-100 rounded-lg flex-shrink-0">
                      <Check className="w-4 h-4 text-success-600" />
                    </div>
                    <span className="font-medium">Oxford & Cambridge</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-700">
                    <div className="flex items-center justify-center w-8 h-8 bg-success-100 rounded-lg flex-shrink-0">
                      <Check className="w-4 h-4 text-success-600" />
                    </div>
                    <span className="font-medium">Minimum 30 minutes</span>
                  </div>
                </div>

                {/* Trust Message */}
                <div className="mt-6 pt-6 border-t-2 border-neutral-100">
                  <div className="p-4 bg-primary-50 rounded-xl">
                    <p className="text-sm text-primary-700 font-medium text-center leading-relaxed">
                      🔒 Secure booking. Payment processed after tour completion.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
