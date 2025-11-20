import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Sparkles, SlidersHorizontal, X, List, Map } from 'lucide-react'
import { api } from '../../services/api'
import { GuideCard } from '../../components/tourist/GuideCard'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import { Button } from '../../components/common/Button'
import { Loading } from '../../components/common/Loading'
import MockMap from '../../components/common/MockMap'
import { LANGUAGES, SPECIALTIES } from '../../constants'
import type { Guide } from '../../types'

export default function BrowseGuides() {
  const navigate = useNavigate()
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map') // Default to map view
  const [filters, setFilters] = useState({
    language: '',
    specialty: '',
    isAvailable: '',
    minRate: '',
    maxRate: '',
  })

  const fetchGuides = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.language) params.append('language', filters.language)
      if (filters.specialty) params.append('specialty', filters.specialty)
      if (filters.isAvailable) params.append('isAvailable', filters.isAvailable)
      if (filters.minRate) params.append('minRate', filters.minRate)
      if (filters.maxRate) params.append('maxRate', filters.maxRate)

      const response = await api.get<Guide[]>(`/api/guides?${params.toString()}`)
      if (response.success && response.data) {
        setGuides(response.data)
      }
    } catch (error) {
      console.error('Error fetching guides:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuides()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    fetchGuides()
  }

  const handleClearFilters = () => {
    setFilters({
      language: '',
      specialty: '',
      isAvailable: '',
      minRate: '',
      maxRate: '',
    })
    setTimeout(() => fetchGuides(), 0)
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

        <div className="relative container-custom py-12 lg:py-16">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">500+ Expert Guides Available</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              Find Your Perfect Guide
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Browse our verified local guides in Oxford & Cambridge. Book instantly or schedule ahead.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filters */}
        <div className="mb-8 animate-fade-in-up">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-xl">
                  <SlidersHorizontal className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-neutral-900">Filters</h2>
                  {activeFilterCount > 0 && (
                    <p className="text-sm text-neutral-600">{activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                {showFilters ? 'Hide' : 'Show'}
              </Button>
            </div>

            <div className={`space-y-6 ${!showFilters ? 'hidden lg:block' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select
                  label="Language"
                  options={[
                    { value: '', label: 'All Languages' },
                    ...LANGUAGES.map((lang) => ({ value: lang, label: lang })),
                  ]}
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                />

                <Select
                  label="Specialty"
                  options={[
                    { value: '', label: 'All Specialties' },
                    ...SPECIALTIES.map((spec) => ({ value: spec, label: spec })),
                  ]}
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                />

                <Select
                  label="Availability"
                  options={[
                    { value: '', label: 'All' },
                    { value: 'true', label: 'Available Now' },
                    { value: 'false', label: 'Schedule Later' },
                  ]}
                  value={filters.isAvailable}
                  onChange={(e) => handleFilterChange('isAvailable', e.target.value)}
                />

                <Input
                  label="Min Rate (£)"
                  type="number"
                  placeholder="10"
                  value={filters.minRate}
                  onChange={(e) => handleFilterChange('minRate', e.target.value)}
                />

                <Input
                  label="Max Rate (£)"
                  type="number"
                  placeholder="100"
                  value={filters.maxRate}
                  onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={handleSearch} className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Guides
                </Button>
                {activeFilterCount > 0 && (
                  <Button onClick={handleClearFilters} variant="outline" className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex items-center justify-between animate-fade-in-up">
          <p className="text-neutral-600 font-medium">
            {guides.length > 0 && (
              <>Found <span className="text-primary-600 font-bold">{guides.length}</span> guide{guides.length !== 1 ? 's' : ''}</>
            )}
          </p>
          <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-neutral-200">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Map className="w-4 h-4" />
              Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loading size="lg" text="Finding the best guides for you..." variant="dots" />
          </div>
        ) : guides.length > 0 ? (
          viewMode === 'map' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Map View */}
              <div className="card p-4">
                <MockMap
                  className="h-[600px]"
                  markers={guides.map((guide, index) => ({
                    lat: 51.752 + (Math.random() - 0.5) * 0.02, // Random positions around Oxford
                    lng: -1.2577 + (Math.random() - 0.5) * 0.02,
                    label: guide.user?.name || 'Guide',
                    color: guide.isAvailable ? '#10b981' : '#ef4444',
                  }))}
                  showControls={true}
                  showUserLocation={true}
                />
              </div>

              {/* Guide List Below Map */}
              <div className="grid gap-4">
                <h3 className="text-lg font-bold text-neutral-900">Available Guides</h3>
                {guides.map((guide, index) => (
                  <div
                    key={guide.id}
                    className="card p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/guides/${guide.id}`)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={guide.user?.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                        alt={guide.user?.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-900">{guide.user?.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <span>£{guide.hourlyRate}/hr</span>
                          {guide.averageRating && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                {guide.averageRating.toFixed(1)}
                              </span>
                            </>
                          )}
                          {guide.isAvailable && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-semibold">Available Now</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* List View */}
              <div className="grid gap-6">
                {guides.map((guide, index) => (
                  <div
                    key={guide.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <GuideCard guide={guide} />
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex p-6 bg-neutral-100 rounded-full mb-6">
              <MapPin className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
              No guides found
            </h3>
            <p className="text-neutral-600 text-lg mb-6 max-w-md mx-auto">
              We couldn't find any guides matching your criteria. Try adjusting your filters.
            </p>
            {activeFilterCount > 0 && (
              <Button onClick={handleClearFilters} variant="secondary" size="lg" className="flex items-center gap-2 mx-auto">
                <X className="w-5 h-5" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
