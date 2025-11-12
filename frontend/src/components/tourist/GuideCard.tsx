import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Clock } from 'lucide-react'
import { Card } from '../common/Card'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'
import { formatCurrency } from '../../utils/helpers'
import type { Guide } from '../../types'

interface GuideCardProps {
  guide: Guide
}

export function GuideCard({ guide }: GuideCardProps) {
  const navigate = useNavigate()

  return (
    <Card onClick={() => navigate(`/guides/${guide.id}`)} className="hover:shadow-xl">
      <div className="flex gap-4">
        <Avatar src={guide.user?.photo} name={guide.user?.name} size="xl" />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{guide.user?.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                {guide.averageRating && guide.averageRating > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{guide.averageRating.toFixed(1)}</span>
                    <span className="text-gray-400">({guide.totalReviews})</span>
                  </div>
                ) : (
                  <span className="text-gray-400">New guide</span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {formatCurrency(guide.hourlyRate)}
              </div>
              <div className="text-xs text-gray-500">per hour</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{guide.bio}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {guide.languages?.slice(0, 3).map((lang) => (
              <Badge key={lang} variant="info" size="sm">
                {lang}
              </Badge>
            ))}
            {guide.specialties?.slice(0, 2).map((specialty) => (
              <Badge key={specialty} variant="primary" size="sm">
                {specialty}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            {guide.isAvailable ? (
              <Badge variant="success">Available Now</Badge>
            ) : (
              <Badge variant="gray">Unavailable</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
