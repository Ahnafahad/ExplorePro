import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { api } from '../../services/api'
import { GuideCard } from '../../components/tourist/GuideCard'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import { Button } from '../../components/common/Button'
import { Loading } from '../../components/common/Loading'
import { LANGUAGES, SPECIALTIES } from '../../constants'
import type { Guide } from '../../types'

export default function BrowseGuides() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Guide</h1>
          <p className="text-gray-600 mt-2">
            Browse our verified local guides in Oxford & Cambridge
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

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

          <div className="flex gap-4 mt-6">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
            <Button onClick={handleClearFilters} variant="secondary">
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" text="Finding guides..." />
          </div>
        ) : guides.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              Found {guides.length} guide{guides.length !== 1 ? 's' : ''}
            </div>
            <div className="grid gap-6">
              {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No guides found matching your criteria</p>
            <Button onClick={handleClearFilters} variant="secondary" className="mt-4">
              Clear filters and try again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
