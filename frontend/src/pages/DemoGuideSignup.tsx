import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, User, DollarSign, Languages, Award, ArrowRight, Shield, MapPin, CheckCircle } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { TextArea } from '../components/common/TextArea'
import { Card } from '../components/common/Card'

export default function DemoGuideSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    hourlyRate: '50',
    languages: 'English',
    specialties: 'History, Architecture',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = () => {
    if (step === 1 && formData.name && formData.email) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleSubmit = async () => {
    // Show success message and redirect to demo guide dashboard
    alert('🎉 Welcome to ExplorePro! Logging you in as a demo guide...')

    // Navigate to login with demo credentials
    navigate('/login', { state: { demoGuide: true } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Mobile App Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white mb-4 text-sm"
          >
            ← Back to Home
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold">Become a Guide</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Start Earning as a Guide
            </h1>
            <p className="text-sm opacity-90">
              Join our community of expert local guides
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-white'
                    : s < step
                    ? 'w-2 bg-white'
                    : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-4 py-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  Let's get started
                </h2>
                <p className="text-sm text-neutral-600">
                  Tell us a bit about yourself
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Sarah Thompson"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="sarah@example.com"
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleNext}
                fullWidth
                disabled={!formData.name || !formData.email}
                className="mt-6"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Profile Details */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  Your expertise
                </h2>
                <p className="text-sm text-neutral-600">
                  Help tourists find the perfect guide
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    About You
                  </label>
                  <TextArea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell tourists about your experience, what makes your tours special, and why you love guiding..."
                    rows={4}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Tip: Mention your qualifications and years of experience
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Languages className="w-4 h-4 inline mr-2" />
                    Languages You Speak
                  </label>
                  <Input
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    placeholder="e.g., English, French, Spanish"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Award className="w-4 h-4 inline mr-2" />
                    Your Specialties
                  </label>
                  <Input
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleInputChange}
                    placeholder="e.g., History, Architecture, Photography"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="secondary"
                  fullWidth
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  fullWidth
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Finish */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  Set your rate
                </h2>
                <p className="text-sm text-neutral-600">
                  You can always change this later
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Hourly Rate (GBP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">
                      £
                    </span>
                    <Input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      className="pl-8"
                      min="10"
                      required
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Average guide rate: £50-70/hour
                  </p>
                </div>

                {/* Preview Card */}
                <Card variant="bordered" className="bg-gradient-to-br from-primary-50 to-secondary-50">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-neutral-900">{formData.name || 'Your Name'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-primary-700 font-semibold">
                          £{formData.hourlyRate}/hr
                        </span>
                        <span className="text-xs text-neutral-500">•</span>
                        <span className="text-xs text-neutral-600">
                          {formData.languages.split(',')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
                        {formData.bio || 'Your bio will appear here...'}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Benefits */}
                <div className="bg-success-50 rounded-xl p-4 space-y-2">
                  <h4 className="font-semibold text-success-900 text-sm mb-3">
                    <Shield className="w-4 h-4 inline mr-2" />
                    What you'll get:
                  </h4>
                  {[
                    'Professional guide dashboard',
                    'Instant & scheduled bookings',
                    'Secure payments via Stripe',
                    'Real-time tour tracking',
                    '85% earnings (15% platform fee)',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-success-900">
                      <CheckCircle className="w-4 h-4 text-success-600" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="secondary"
                  fullWidth
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  className="bg-gradient-to-r from-success-600 to-primary-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Try Demo Dashboard
                </Button>
              </div>

              <p className="text-xs text-center text-neutral-500">
                This is a demo. You'll be logged in as a demo guide to explore all features.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
