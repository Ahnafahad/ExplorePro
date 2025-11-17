import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { MapPin, Mail, Lock, ArrowRight, Sparkles, User, Compass, Shield, Zap } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      setLoading(true)
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role: 'tourist' | 'guide' | 'admin') => {
    const demoAccounts = {
      tourist: { email: 'demo.tourist@explorepro.com', password: 'Demo123!' },
      guide: { email: 'demo.guide@explorepro.com', password: 'Demo123!' },
      admin: { email: 'demo.admin@explorepro.com', password: 'Demo123!' },
    }

    try {
      setError('')
      setLoading(true)
      const account = demoAccounts[role]
      await login(account.email, account.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to login with demo account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-md w-full animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <MapPin className="w-12 h-12 text-primary-600 relative" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">ExplorePro</span>
          </Link>
          <h1 className="text-4xl font-display font-bold text-neutral-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-lg text-neutral-600">
            Sign in to continue your journey
          </p>
        </div>

        {/* Login Card */}
        <div className="card card-hover p-8">
          {error && (
            <div className="mb-6 p-4 bg-danger-50 border-2 border-danger-200 rounded-xl animate-fade-in">
              <p className="text-sm font-medium text-danger-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              {!loading && (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-center text-neutral-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
              >
                Sign up for free
                <Sparkles className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Mode */}
        <div className="mt-8 card p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full mb-2">
              <Zap className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-bold text-primary-700">DEMO MODE</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900 mb-1">
              Try ExplorePro Instantly
            </h3>
            <p className="text-xs text-neutral-600">
              Explore all features with pre-loaded demo accounts
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Tourist Demo */}
            <button
              onClick={() => handleDemoLogin('tourist')}
              disabled={loading}
              className="group relative p-4 bg-white hover:bg-primary-50 rounded-xl border-2 border-neutral-200 hover:border-primary-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 rounded-xl transition-all" />
              <div className="relative">
                <div className="w-10 h-10 mx-auto mb-2 bg-primary-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-xs font-bold text-neutral-900 mb-0.5">Tourist</p>
                <p className="text-[10px] text-neutral-500">Browse & Book</p>
              </div>
            </button>

            {/* Guide Demo */}
            <button
              onClick={() => handleDemoLogin('guide')}
              disabled={loading}
              className="group relative p-4 bg-white hover:bg-success-50 rounded-xl border-2 border-neutral-200 hover:border-success-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-success-500/0 to-success-500/0 group-hover:from-success-500/5 group-hover:to-success-500/10 rounded-xl transition-all" />
              <div className="relative">
                <div className="w-10 h-10 mx-auto mb-2 bg-success-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5 text-success-600" />
                </div>
                <p className="text-xs font-bold text-neutral-900 mb-0.5">Guide</p>
                <p className="text-[10px] text-neutral-500">Manage Tours</p>
              </div>
            </button>

            {/* Admin Demo */}
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="group relative p-4 bg-white hover:bg-warning-50 rounded-xl border-2 border-neutral-200 hover:border-warning-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-warning-500/0 to-warning-500/0 group-hover:from-warning-500/5 group-hover:to-warning-500/10 rounded-xl transition-all" />
              <div className="relative">
                <div className="w-10 h-10 mx-auto mb-2 bg-warning-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 text-warning-600" />
                </div>
                <p className="text-xs font-bold text-neutral-900 mb-0.5">Admin</p>
                <p className="text-[10px] text-neutral-500">Dashboard</p>
              </div>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-primary-200">
            <p className="text-[10px] text-center text-neutral-500">
              Each demo account has pre-loaded data including bookings, reviews, and messages
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500 mb-4">Trusted by thousands of travelers</p>
          <div className="flex items-center justify-center gap-6 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Secure
            </span>
            <span>•</span>
            <span>256-bit SSL</span>
            <span>•</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  )
}
