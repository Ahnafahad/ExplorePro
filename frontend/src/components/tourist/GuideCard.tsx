import { useNavigate } from 'react-router-dom'
import { Star, Languages, Award, Clock, ArrowRight, Zap } from 'lucide-react'
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
    <Card
      onClick={() => navigate(`/guides/${guide.id}`)}
      variant="bordered"
      padding="lg"
      className="group cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar src={guide.user?.photo} name={guide.user?.name} size="xl" />
          {guide.isAvailable && (
            <div className="absolute -bottom-1 -right-1 flex items-center gap-1 px-2 py-1 bg-success-500 text-white rounded-full text-xs font-semibold shadow-lg">
              <Zap className="w-3 h-3 fill-current" />
              <span>Live</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-display font-bold text-neutral-900 group-hover:text-primary-600 transition-colors mb-2">
                {guide.user?.name}
              </h3>
              <div className="flex items-center gap-3 text-sm">
                {guide.averageRating && guide.averageRating > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-warning-400 text-warning-400" />
                    <span className="font-bold text-neutral-900">{guide.averageRating.toFixed(1)}</span>
                    <span className="text-neutral-500">({guide.totalReviews} reviews)</span>
                  </div>
                ) : (
                  <Badge variant="info" size="sm" dot>
                    New Guide
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="text-3xl font-display font-bold text-primary-600">
                {formatCurrency(guide.hourlyRate)}
              </div>
              <div className="text-xs text-neutral-500 font-medium">per hour</div>
            </div>
          </div>

          <p className="text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
            {guide.bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {guide.languages?.slice(0, 3).map((lang) => (
              <Badge key={lang} variant="info" size="md" icon={<Languages className="w-3 h-3" />}>
                {lang}
              </Badge>
            ))}
            {guide.specialties?.slice(0, 2).map((specialty) => (
              <Badge key={specialty} variant="primary" size="md" icon={<Award className="w-3 h-3" />}>
                {specialty}
              </Badge>
            ))}
            {(guide.languages?.length > 3 || guide.specialties?.length > 2) && (
              <Badge variant="gray" size="md">
                +{(guide.languages?.length - 3) + (guide.specialties?.length - 2)} more
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            {guide.isAvailable ? (
              <Badge variant="success" size="md" dot>
                Available Now
              </Badge>
            ) : (
              <Badge variant="gray" size="md" icon={<Clock className="w-3 h-3" />}>
                Schedule Ahead
              </Badge>
            )}

            <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
              View Profile
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
