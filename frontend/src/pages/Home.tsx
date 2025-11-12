import { MapPin } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="w-8 h-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">ExplorePro</span>
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link to="/dashboard" className="btn-primary px-6 py-2">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-6 py-2">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary px-6 py-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <MapPin className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ExplorePro
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your Uber for Tour Guides - Explore Oxford & Cambridge with Local Experts
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={handleFindGuide} className="btn-primary px-8 py-3 text-lg">
              Find a Guide
            </button>
            <button onClick={handleBecomeGuide} className="btn-secondary px-8 py-3 text-lg">
              Become a Guide
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-3">Instant Booking</h3>
            <p className="text-gray-600">
              Find and book available guides in real-time, just like calling an Uber
            </p>
          </div>
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-3">Vetted Guides</h3>
            <p className="text-gray-600">
              All guides are verified and reviewed by real tourists
            </p>
          </div>
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
            <p className="text-gray-600">
              Safe and secure payments through Stripe with full protection
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
