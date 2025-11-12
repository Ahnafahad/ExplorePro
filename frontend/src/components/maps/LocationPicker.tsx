import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Input } from '../common/Input'

interface LocationPickerProps {
  onLocationSelect: (location: string) => void
  initialValue?: string
}

export function LocationPicker({ onLocationSelect, initialValue = '' }: LocationPickerProps) {
  const [location, setLocation] = useState(initialValue)

  const handleSelect = (value: string) => {
    setLocation(value)
    onLocationSelect(value)
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
        <MapPin className="w-4 h-4" />
        <span>Meeting Point</span>
      </div>

      <Input
        type="text"
        placeholder="e.g., Oxford University, Radcliffe Camera"
        value={location}
        onChange={(e) => handleSelect(e.target.value)}
      />

      <p className="text-xs text-gray-500 mt-2">
        Enter a specific landmark or address where you'll meet your guide
      </p>

      {/* Placeholder for Google Maps integration */}
      <div className="mt-4 h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Google Maps integration coming soon</p>
          <p className="text-xs mt-1">For now, enter the location manually above</p>
        </div>
      </div>
    </div>
  )
}
