import { MapPin } from 'lucide-react'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
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
            <button className="btn-primary px-8 py-3 text-lg">
              Find a Guide
            </button>
            <button className="btn-secondary px-8 py-3 text-lg">
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
