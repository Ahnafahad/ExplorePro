import { useState, useEffect } from 'react'
import { MapPin, Navigation, ZoomIn, ZoomOut, Locate } from 'lucide-react'

interface MockMapProps {
  center?: { lat: number; lng: number }
  markers?: Array<{
    lat: number
    lng: number
    label?: string
    icon?: 'pin' | 'user' | 'guide'
    color?: string
  }>
  showControls?: boolean
  showUserLocation?: boolean
  animateGuide?: boolean
  className?: string
}

export default function MockMap({
  center = { lat: 51.752, lng: -1.2577 }, // Oxford
  markers = [],
  showControls = true,
  showUserLocation = false,
  animateGuide = false,
  className = '',
}: MockMapProps) {
  const [zoom, setZoom] = useState(14)
  const [guidePosition, setGuidePosition] = useState({ x: 50, y: 50 })

  // Animate guide marker movement (simulating live tracking)
  useEffect(() => {
    if (animateGuide) {
      const interval = setInterval(() => {
        setGuidePosition((prev) => ({
          x: prev.x + (Math.random() - 0.5) * 2,
          y: prev.y + (Math.random() - 0.5) * 2,
        }))
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [animateGuide])

  const handleZoomIn = () => setZoom((z) => Math.min(z + 1, 18))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 1, 10))

  return (
    <div className={`relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden ${className}`}>
      {/* SVG Map Background */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Base map with streets */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.2" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Rivers/Water */}
        <path
          d="M 10 60 Q 30 58, 50 60 T 90 65"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="2"
          opacity="0.6"
        />
        <path
          d="M 12 61 Q 32 59, 52 61 T 92 66"
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* Parks/Green spaces */}
        <ellipse cx="25" cy="30" rx="12" ry="8" fill="#86efac" opacity="0.3" />
        <ellipse cx="75" cy="40" rx="10" ry="10" fill="#86efac" opacity="0.3" />
        <rect x="15" y="70" width="20" height="15" fill="#86efac" opacity="0.3" rx="2" />

        {/* Major roads */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="#d1d5db" strokeWidth="1.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#d1d5db" strokeWidth="1.5" />
        <line x1="20" y1="0" x2="80" y2="100" stroke="#d1d5db" strokeWidth="1" />
        <line x1="80" y1="0" x2="20" y2="100" stroke="#d1d5db" strokeWidth="1" />

        {/* Buildings (simplified) */}
        <rect x="40" y="35" width="8" height="10" fill="#9ca3af" opacity="0.4" />
        <rect x="55" y="40" width="6" height="8" fill="#9ca3af" opacity="0.4" />
        <rect x="45" y="20" width="10" height="12" fill="#9ca3af" opacity="0.4" />
        <rect x="65" y="25" width="7" height="9" fill="#9ca3af" opacity="0.4" />
        <rect x="30" y="45" width="9" height="11" fill="#9ca3af" opacity="0.4" />

        {/* Radcliffe Camera (iconic landmark) */}
        <circle cx="50" cy="45" r="4" fill="#fbbf24" opacity="0.6" />
        <circle cx="50" cy="45" r="3" fill="#f59e0b" opacity="0.4" />

        {/* Static markers */}
        {markers.map((marker, index) => {
          const x = 50 + (marker.lng - center.lng) * 800
          const y = 50 - (marker.lat - center.lat) * 800
          const color = marker.color || '#ef4444'

          return (
            <g key={index}>
              {/* Marker shadow */}
              <ellipse cx={x} cy={y + 3} rx="2" ry="0.5" fill="#000" opacity="0.2" />

              {/* Marker pin */}
              <path
                d={`M ${x} ${y - 3} Q ${x - 2} ${y - 3}, ${x - 2} ${y - 1} Q ${x - 2} ${y + 1}, ${x} ${y + 3} Q ${x + 2} ${y + 1}, ${x + 2} ${y - 1} Q ${x + 2} ${y - 3}, ${x} ${y - 3}`}
                fill={color}
                stroke="#fff"
                strokeWidth="0.3"
              />
              <circle cx={x} cy={y - 1.5} r="1" fill="#fff" opacity="0.9" />

              {/* Label */}
              {marker.label && (
                <g>
                  <rect
                    x={x - 8}
                    y={y - 8}
                    width="16"
                    height="4"
                    fill="#fff"
                    opacity="0.9"
                    rx="1"
                  />
                  <text
                    x={x}
                    y={y - 5}
                    textAnchor="middle"
                    fontSize="2"
                    fill="#1f2937"
                    fontWeight="600"
                  >
                    {marker.label}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Animated guide marker */}
        {animateGuide && (
          <g style={{ transition: 'transform 3s ease-in-out' }}>
            {/* Pulsing circle */}
            <circle cx={guidePosition.x} cy={guidePosition.y} r="4" fill="#3b82f6" opacity="0.2">
              <animate
                attributeName="r"
                values="4;6;4"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.1;0.2"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Guide marker */}
            <circle cx={guidePosition.x} cy={guidePosition.y} r="2.5" fill="#3b82f6" stroke="#fff" strokeWidth="0.5" />
            <circle cx={guidePosition.x} cy={guidePosition.y} r="1" fill="#fff" opacity="0.9" />

            {/* Direction indicator */}
            <path
              d={`M ${guidePosition.x} ${guidePosition.y - 3} L ${guidePosition.x - 1} ${guidePosition.y - 1} L ${guidePosition.x + 1} ${guidePosition.y - 1} Z`}
              fill="#fff"
            />
          </g>
        )}

        {/* User location (if enabled) */}
        {showUserLocation && (
          <g>
            <circle cx="50" cy="50" r="3" fill="#3b82f6" opacity="0.3">
              <animate
                attributeName="r"
                values="3;5;3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="50" r="1.5" fill="#3b82f6" stroke="#fff" strokeWidth="0.3" />
          </g>
        )}
      </svg>

      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5 text-neutral-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5 text-neutral-700" />
          </button>
          {showUserLocation && (
            <button
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all"
              aria-label="My location"
            >
              <Locate className="w-5 h-5 text-primary-600" />
            </button>
          )}
        </div>
      )}

      {/* Map Attribution (make it look real) */}
      <div className="absolute bottom-2 left-2 text-[8px] text-neutral-500 bg-white/80 px-2 py-1 rounded">
        © ExplorePro Maps
      </div>

      {/* Zoom level indicator */}
      {showControls && (
        <div className="absolute bottom-2 right-2 text-xs text-neutral-600 bg-white/90 px-2 py-1 rounded shadow-sm">
          Zoom: {zoom}
        </div>
      )}
    </div>
  )
}
