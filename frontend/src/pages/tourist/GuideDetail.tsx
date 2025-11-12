import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, Clock, Calendar, Languages, Award, ChevronLeft } from 'lucide-react'
import { api } from '../../services/api'
import { Avatar } from '../../components/common/Avatar'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { StarRating } from '../../components/common/StarRating'
import { Loading } from '../../components/common/Loading'
import { formatCurrency } from '../../utils/helpers'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading guide details..." />
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
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guide Profile */}
            <Card>
              <div className="flex items-start gap-6">
                <Avatar src={guide.user?.photo} name={guide.user?.name} size="xl" />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {guide.user?.name}
                      </h1>
                      {guide.averageRating && guide.averageRating > 0 ? (
                        <div className="flex items-center gap-3">
                          <StarRating rating={guide.averageRating} showNumber />
                          <span className="text-gray-600">
                            ({guide.totalReviews} review{guide.totalReviews !== 1 ? 's' : ''})
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-500">New guide - No reviews yet</p>
                      )}
                    </div>

                    {guide.isAvailable && <Badge variant="success">Available Now</Badge>}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Languages className="w-5 h-5" />
                      <span>
                        <strong>Languages:</strong> {guide.languages?.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Award className="w-5 h-5" />
                      <span>
                        <strong>Specialties:</strong> {guide.specialties?.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-5 h-5" />
                      <span>
                        <strong>Rate:</strong> {formatCurrency(guide.hourlyRate)}/hour
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{guide.bio}</p>
            </Card>

            {/* Tours Offered */}
            {guide.tours && guide.tours.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tours Offered</h2>
                <div className="space-y-4">
                  {guide.tours.map((tour: Tour) => (
                    <div key={tour.id} className="border-l-4 border-primary-500 pl-4">
                      <h3 className="font-semibold text-gray-900">{tour.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tour.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                        <span>
                          <Clock className="w-4 h-4 inline mr-1" />
                          {tour.duration} min
                        </span>
                        <span className="font-semibold text-primary-600">
                          {formatCurrency(tour.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            {guide.reviews && guide.reviews.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
                <div className="space-y-4">
                  {guide.reviews.map((review: Review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar
                          src={review.tourist?.user?.photo}
                          name={review.tourist?.user?.name}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.tourist?.user?.name}
                          </p>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 ml-11">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {formatCurrency(guide.hourlyRate)}
                </div>
                <p className="text-gray-600">per hour</p>
              </div>

              <Button onClick={handleBookNow} fullWidth size="lg" className="mb-4">
                {guide.isAvailable ? 'Book Now' : 'Schedule Tour'}
              </Button>

              <div className="border-t border-gray-200 pt-4 mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Flexible scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Oxford & Cambridge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Minimum 30 minutes</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet. Payment is processed after tour completion.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
