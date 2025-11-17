import { useState, useEffect } from 'react'
import { MapPin, Clock, Shield, Star, Users, TrendingUp, Check, Sparkles, Globe, Award, Calendar, DollarSign, Users as UsersIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import demoService from '../services/demoService'
import { Loading } from '../components/common/Loading'

function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [featuredTours, setFeaturedTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        if (demoService.isDemoMode()) {
          const response = await demoService.tours.getAll()
          if (response.success && response.data) {
            // Get first 3 tours as featured
            setFeaturedTours(response.data.slice(0, 3))
          }
        }
      } catch (error) {
        console.error('Error fetching featured tours:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedTours()
  }, [])

  const handleFindGuide = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  const handleBecomeGuide = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  const features = [
    {
      icon: Clock,
      title: 'Instant Booking',
      description: 'Find and book available guides in real-time, just like calling an Uber',
      color: 'primary',
    },
    {
      icon: Shield,
      title: 'Vetted Guides',
      description: 'All guides are verified and reviewed by real tourists',
      color: 'success',
    },
    {
      icon: Star,
      title: 'Secure Payments',
      description: 'Safe and secure payments through Stripe with full protection',
      color: 'accent',
    },
  ]

  const stats = [
    { value: '500+', label: 'Expert Guides', icon: Users },
    { value: '10K+', label: 'Happy Tourists', icon: Star },
    { value: '4.9', label: 'Average Rating', icon: Award },
    { value: '98%', label: 'Success Rate', icon: TrendingUp },
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Search & Browse',
      description: 'Find expert local guides by location, language, and specialty',
    },
    {
      step: '2',
      title: 'Book Instantly',
      description: 'Choose instant booking or schedule for later - it\'s up to you',
    },
    {
      step: '3',
      title: 'Explore & Enjoy',
      description: 'Meet your guide and start your personalized tour experience',
    },
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100 shadow-soft">
        <div className="container-custom py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <MapPin className="w-8 h-8 text-primary-600 relative" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">ExplorePro</span>
          </Link>
          <div className="flex gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-200 mb-6 animate-bounce-subtle">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Trusted by 10,000+ tourists</span>
            </div>

            <h1 className="font-display font-bold text-6xl lg:text-8xl text-neutral-900 mb-6 tracking-tight">
              Your <span className="gradient-text">Uber</span> for
              <br />
              Tour Guides
            </h1>

            <p className="text-xl lg:text-2xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Explore Oxford & Cambridge with verified local experts. Book instantly or schedule ahead.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={handleFindGuide} className="btn-primary text-lg px-8 py-4 shadow-glow">
                <Globe className="w-5 h-5 inline mr-2" />
                Find a Guide
              </button>
              <button onClick={handleBecomeGuide} className="btn-secondary text-lg px-8 py-4">
                Become a Guide
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-12 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success-500" />
                <span>Verified Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-200" />
                <div className="text-5xl font-display font-bold mb-2">{stat.value}</div>
                <div className="text-primary-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-neutral-900 mb-4">
              Why Choose ExplorePro?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Experience the future of guided tours with our innovative platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-hover p-8 group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-700`} />
                </div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="section section-alt">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-neutral-900 mb-4">
              Popular Tours
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Discover our most loved experiences in Oxford & Cambridge
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" text="Loading tours..." />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredTours.map((tour, index) => (
                <div
                  key={tour.id}
                  className="card card-hover overflow-hidden group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Tour Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-400 to-secondary-500 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4zIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-900">
                        {tour.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-display font-bold text-xl line-clamp-2">
                        {tour.title}
                      </h3>
                    </div>
                  </div>

                  {/* Tour Details */}
                  <div className="p-6">
                    <p className="text-neutral-600 mb-4 line-clamp-2">
                      {tour.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Clock className="w-4 h-4 text-primary-600" />
                        <span>{tour.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <UsersIcon className="w-4 h-4 text-primary-600" />
                        <span>Max {tour.maxGroupSize} people</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span className="line-clamp-1">{tour.meetingPoint}</span>
                      </div>
                    </div>

                    {tour.highlights && tour.highlights.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-neutral-700 mb-2">Highlights:</p>
                        <div className="flex flex-wrap gap-1">
                          {tour.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs"
                            >
                              {highlight}
                            </span>
                          ))}
                          {tour.highlights.length > 3 && (
                            <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                              +{tour.highlights.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">£{tour.price}</span>
                        <span className="text-neutral-500 text-sm ml-1">per person</span>
                      </div>
                      <button
                        onClick={() => user ? navigate('/browse-guides') : navigate('/register')}
                        className="btn-primary btn-sm"
                      >
                        {user ? 'Book Now' : 'Sign Up'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => user ? navigate('/browse-guides') : navigate('/register')}
              className="btn-secondary btn-lg"
            >
              View All Tours
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Getting started is simple and takes just a few minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl rotate-6 opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl shadow-glow" />
                  <span className="relative text-3xl font-display font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="font-display font-bold text-4xl lg:text-6xl mb-6">
              Ready to Start Exploring?
            </h2>
            <p className="text-xl lg:text-2xl mb-10 text-white/90">
              Join thousands of tourists and guides on ExplorePro today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleFindGuide} className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200">
                Get Started Now
              </button>
              <button onClick={handleBecomeGuide} className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <MapPin className="w-6 h-6 text-primary-400" />
              <span className="text-xl font-display font-bold">ExplorePro</span>
            </div>
            <div className="text-neutral-400 text-sm">
              © 2025 ExplorePro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
