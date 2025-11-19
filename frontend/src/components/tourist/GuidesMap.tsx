import { MapPin, Navigation } from 'lucide-react'
import { Card } from '../common/Card'
import type { Guide } from '../../types'

interface GuidesMapProps {
  guides: Guide[]
  onGuideClick?: (guideId: string) => void
}

export function GuidesMap({ guides, onGuideClick }: GuidesMapProps) {
  // Oxford center coordinates
  const centerLat = 51.7520
  const centerLng = -1.2577

  // Calculate map bounds based on guides
  const minLat = Math.min(...guides.map(g => g.location?.lat || centerLat)) - 0.005
  const maxLat = Math.max(...guides.map(g => g.location?.lat || centerLat)) + 0.005
  const minLng = Math.min(...guides.map(g => g.location?.lng || centerLng)) - 0.005
  const maxLng = Math.max(...guides.map(g => g.location?.lng || centerLng)) + 0.005

  // Convert lat/lng to pixel coordinates
  const latToY = (lat: number) => {
    return ((maxLat - lat) / (maxLat - minLat)) * 100
  }

  const lngToX = (lng: number) => {
    return ((lng - minLng) / (maxLng - minLng)) * 100
  }

  return (
    <Card variant="bordered" padding="none" className="overflow-hidden">
      {/* Map Header */}
      <div className="p-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          <h3 className="text-lg font-display font-bold">Guide Locations</h3>
        </div>
        <p className="text-sm text-white/80 mt-1">
          {guides.length} guide{guides.length !== 1 ? 's' : ''} available in Oxford
        </p>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-96 bg-gradient-to-br from-neutral-100 to-neutral-200">
        {/* Background map image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop)',
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        {/* Guide markers */}
        {guides.map((guide, index) => {
          const x = lngToX(guide.location?.lng || centerLng)
          const y = latToY(guide.location?.lat || centerLat)

          return (
            <button
              key={guide.id}
              onClick={() => onGuideClick?.(guide.id)}
              className="absolute transform -translate-x-1/2 -translate-y-full group cursor-pointer animate-fade-in-up"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Marker pin */}
              <div className="relative">
                {/* Pulse effect */}
                <div className="absolute inset-0 animate-ping">
                  <div className={`w-12 h-12 rounded-full ${
                    guide.isAvailable ? 'bg-success-400' : 'bg-neutral-400'
                  } opacity-75`} />
                </div>

                {/* Main marker */}
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform transition-all group-hover:scale-125 ${
                  guide.isAvailable
                    ? 'bg-success-500 ring-4 ring-success-200'
                    : 'bg-neutral-500 ring-4 ring-neutral-200'
                }`}>
                  <MapPin className="w-6 h-6 text-white fill-current" />
                </div>

                {/* Tooltip */}
                <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-neutral-900 text-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <img
                        src={guide.user?.photo}
                        alt={guide.user?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-left">
                        <div>{guide.user?.name}</div>
                        <div className="text-xs text-neutral-300">
                          {guide.isAvailable ? 'Available Now' : 'Book Ahead'}
                        </div>
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute left-1/2 top-full transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-900" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Map Legend */}
      <div className="p-4 bg-neutral-50 border-t-2 border-neutral-200">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success-500" />
            <span className="text-neutral-700 font-medium">Available Now</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-500" />
            <span className="text-neutral-700 font-medium">Schedule Ahead</span>
          </div>
          <div className="flex-1" />
          <div className="text-xs text-neutral-500">
            Click markers to view guide profiles
          </div>
        </div>
      </div>
    </Card>
  )
}
