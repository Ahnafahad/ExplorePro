import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { MapPin, User, Briefcase, Mail, Lock, Phone, Sparkles, ArrowRight } from 'lucide-react'
import { Role } from '../../types'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [role, setRole] = useState<Role>(Role.TOURIST)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('')
      setLoading(true)
      await registerUser(data.name, data.email, data.password, role)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to register')
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
            Join ExplorePro
          </h1>
          <p className="text-lg text-neutral-600">
            Create your account to get started
          </p>
        </div>

        {/* Registration Card */}
        <div className="card card-hover p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              I want to join as a
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole(Role.TOURIST)}
                className={`
                  group relative p-5 rounded-xl border-2 transition-all duration-200
                  ${role === Role.TOURIST
                    ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 shadow-medium'
                    : 'border-neutral-200 hover:border-neutral-300 hover:shadow-soft bg-white'
                  }
                `}
              >
                <div className={`
                  p-3 mx-auto mb-3 rounded-xl w-fit transition-colors
                  ${role === Role.TOURIST ? 'bg-primary-600' : 'bg-neutral-100 group-hover:bg-neutral-200'}
                `}>
                  <User className={`w-6 h-6 ${role === Role.TOURIST ? 'text-white' : 'text-neutral-600'}`} />
                </div>
                <div className={`text-base font-bold mb-1 ${role === Role.TOURIST ? 'text-primary-700' : 'text-neutral-900'}`}>
                  Tourist
                </div>
                <div className="text-xs text-neutral-600">Find amazing guides</div>
                {role === Role.TOURIST && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setRole(Role.GUIDE)}
                className={`
                  group relative p-5 rounded-xl border-2 transition-all duration-200
                  ${role === Role.GUIDE
                    ? 'border-secondary-600 bg-gradient-to-br from-secondary-50 to-secondary-100 shadow-medium'
                    : 'border-neutral-200 hover:border-neutral-300 hover:shadow-soft bg-white'
                  }
                `}
              >
                <div className={`
                  p-3 mx-auto mb-3 rounded-xl w-fit transition-colors
                  ${role === Role.GUIDE ? 'bg-secondary-600' : 'bg-neutral-100 group-hover:bg-neutral-200'}
                `}>
                  <Briefcase className={`w-6 h-6 ${role === Role.GUIDE ? 'text-white' : 'text-neutral-600'}`} />
                </div>
                <div className={`text-base font-bold mb-1 ${role === Role.GUIDE ? 'text-secondary-700' : 'text-neutral-900'}`}>
                  Guide
                </div>
                <div className="text-xs text-neutral-600">Offer amazing tours</div>
                {role === Role.GUIDE && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-secondary-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-50 border-2 border-danger-200 rounded-xl animate-fade-in">
              <p className="text-sm font-medium text-danger-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              icon={<User className="w-5 h-5" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+44 7xxx xxxxxx"
              icon={<Phone className="w-5 h-5" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
              helperText="Minimum 8 characters"
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              {!loading && (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-center text-neutral-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
              >
                Sign in
                <Sparkles className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500 mb-4">Trusted by thousands of travelers and guides</p>
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
