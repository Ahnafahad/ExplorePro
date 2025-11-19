import { useState, useEffect } from 'react'
import { MapPin, Clock, Shield, Star, Users, TrendingUp, Check, Sparkles, Globe, ArrowRight, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { demoTours, demoGuides } from '../data/demoData'

interface Guide {
  id: string
  user: {
    name: string
    photo: string | null
  }
  bio: string
  languages: string[]
  specialties: string[]
  hourlyRate: number
  averageRating: number
  totalReviews: number
}

interface Tour {
  id: string
  title: string
  description: string
  duration: number
  price: number
  guide: Guide
  image?: string
}

function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([])
  const [topGuides, setTopGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedContent()
  }, [])

  const loadFeaturedContent = async () => {
    try {
      // Use demo data directly (no API calls needed!)
      setFeaturedTours(demoTours.slice(0, 6))

      // Get top-rated guides
      const sortedGuides = [...demoGuides]
        .filter((g: Guide) => g.averageRating && g.averageRating > 0)
        .sort((a: Guide, b: Guide) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 4)
      setTopGuides(sortedGuides)
    } catch (error) {
      console.error('Error loading featured content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFindGuide = () => {
    if (user) {
      navigate('/tourist/browse-guides')
    } else {
      navigate('/login')
    }
  }

  const handleBecomeGuide = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  const stats = [
    { value: '10+', label: 'Expert Guides', icon: Users },
    { value: '40+', label: 'Unique Tours', icon: MapPin },
    { value: '4.9', label: 'Avg Rating', icon: Star },
    { value: '50+', label: 'Bookings', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Mobile App Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
        {/* Fixed Header - App Style */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-100">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-neutral-900">ExplorePro</h1>
                  <p className="text-xs text-neutral-500">Oxford & Cambridge</p>
                </div>
              </Link>

              {user ? (
                <Link to="/dashboard" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section - Mobile Optimized */}
        <section className="px-4 pt-6 pb-8 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm mb-3">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-semibold text-primary-700">10,000+ Happy Tourists</span>
            </div>

            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Uber</span> for
              <br />Tour Guides
            </h2>

            <p className="text-sm text-neutral-600 mb-6">
              Explore Oxford & Cambridge with verified local experts
            </p>

            <button
              onClick={handleFindGuide}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              <Search className="w-5 h-5 inline mr-2" />
              Find Your Perfect Guide
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2 mt-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-3 text-center shadow-sm">
                <stat.icon className="w-5 h-5 mx-auto mb-1 text-primary-600" />
                <div className="text-lg font-bold text-neutral-900">{stat.value}</div>
                <div className="text-[10px] text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Tours Section */}
        <section className="px-4 py-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-neutral-900">Featured Tours</h3>
            <Link to={user ? "/tourist/browse-guides" : "/login"} className="text-sm text-primary-600 font-semibold flex items-center gap-1">
              See All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-neutral-100 rounded-xl h-32 animate-pulse" />
              ))}
            </div>
          ) : featuredTours.length > 0 ? (
            <div className="space-y-4">
              {featuredTours.map((tour) => (
                <Link
                  key={tour.id}
                  to={user ? `/tourist/guides/${tour.guide.id}` : "/login"}
                  className="block bg-white border-2 border-neutral-100 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-lg active:scale-98 transition-all"
                >
                  {/* Tour Image */}
                  {tour.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                        <span className="text-lg font-bold">£{tour.price}</span>
                      </div>
                    </div>
                  )}

                  {/* Tour Info */}
                  <div className="p-4">
                    <h4 className="font-bold text-neutral-900 mb-2 text-base">{tour.title}</h4>
                    <p className="text-xs text-neutral-600 mb-3 line-clamp-2">{tour.description}</p>

                    {/* Guide Info */}
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-neutral-100">
                      <img
                        src={tour.guide.user.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                        alt={tour.guide.user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <span className="text-sm text-neutral-700 font-medium">{tour.guide.user.name}</span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {tour.duration}min
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          {tour.guide.averageRating?.toFixed(1) || 'New'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No tours available</p>
            </div>
          )}
        </section>

        {/* Top Guides Section */}
        <section className="px-4 py-6 bg-gradient-to-b from-neutral-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-neutral-900">Top Rated Guides</h3>
            <Link to={user ? "/tourist/browse-guides" : "/login"} className="text-sm text-primary-600 font-semibold flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-neutral-100 rounded-xl h-48 animate-pulse" />
              ))}
            </div>
          ) : topGuides.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {topGuides.map((guide) => (
                <Link
                  key={guide.id}
                  to={user ? `/tourist/guides/${guide.id}` : "/login"}
                  className="bg-white border-2 border-neutral-100 rounded-xl p-3 hover:border-primary-300 hover:shadow-md active:scale-95 transition-all"
                >
                  <div className="text-center">
                    <img
                      src={guide.user.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                      alt={guide.user.name}
                      className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-4 border-white shadow-lg"
                    />
                    <h4 className="font-bold text-neutral-900 text-sm mb-1 truncate">{guide.user.name}</h4>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-neutral-900">{guide.averageRating?.toFixed(1)}</span>
                      <span className="text-xs text-neutral-500">({guide.totalReviews})</span>
                    </div>

                    {/* Specialty Badge */}
                    <div className="inline-block px-2 py-1 bg-primary-50 rounded-full mb-2">
                      <span className="text-xs font-medium text-primary-700">{guide.specialties[0]}</span>
                    </div>

                    {/* Price */}
                    <div className="text-sm font-bold text-neutral-900">
                      £{guide.hourlyRate}/hr
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </section>

        {/* Features Section - App Style */}
        <section className="px-4 py-6 bg-white">
          <h3 className="text-xl font-bold text-neutral-900 mb-4 text-center">Why Choose Us?</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-xl">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Instant Booking</h4>
                <p className="text-sm text-neutral-600">Book guides in real-time, just like Uber</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-success-50 rounded-xl">
              <div className="w-10 h-10 bg-success-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Verified Guides</h4>
                <p className="text-sm text-neutral-600">All guides are vetted and reviewed</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-accent-50 rounded-xl">
              <div className="w-10 h-10 bg-accent-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Secure Payments</h4>
                <p className="text-sm text-neutral-600">Safe transactions with Stripe</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-8 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Ready to Explore?</h3>
            <p className="text-sm text-white/90">Join thousands of tourists discovering Oxford</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleFindGuide}
              className="w-full bg-white text-primary-700 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <Globe className="w-5 h-5 inline mr-2" />
              Find a Guide Now
            </button>

            <button
              onClick={handleBecomeGuide}
              className="w-full bg-white/10 backdrop-blur-sm text-white py-4 rounded-xl font-semibold border-2 border-white/30 hover:bg-white/20 active:scale-95 transition-all"
            >
              Become a Guide
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-6 bg-neutral-900 text-white">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary-400" />
              <span className="font-bold">ExplorePro</span>
            </div>
            <p className="text-xs text-neutral-400">© 2025 ExplorePro. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Verified
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Secure
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                Rated 4.9
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
