import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { TextArea } from '../../components/common/TextArea'
import { Card } from '../../components/common/Card'
import { FileUpload } from '../../components/common/FileUpload'
import { Sparkles, User, DollarSign, Languages, Award, FileCheck, ArrowRight, Shield, Camera } from 'lucide-react'

const profileSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  hourlyRate: z.number().min(10, 'Minimum rate is £10'),
  languages: z.string(),
  specialties: z.string(),
  verificationDoc: z.string().url().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('')
  const [verificationDocUrl, setVerificationDocUrl] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true)
      setError('')

      const payload = {
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        languages: data.languages.split(',').map((s) => s.trim()),
        specialties: data.specialties.split(',').map((s) => s.trim()),
        verificationDoc: verificationDocUrl || undefined,
      }

      await api.post('/api/guides', payload)

      // Update user profile photo if uploaded
      if (profilePhotoUrl) {
        await api.put('/api/auth/profile', { photo: profilePhotoUrl })
      }

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-secondary-50/20 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-secondary-600" />
            <span className="text-sm font-semibold text-secondary-700">Guide Profile Setup</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-4">
            Set Up Your Guide Profile
          </h1>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto">
            Complete your profile to start accepting bookings and earning money from tourists
          </p>
        </div>

        {/* Form Card */}
        <Card variant="elevated" padding="lg" className="animate-fade-in-up">
          {error && (
            <div className="mb-6 p-4 bg-danger-50 border-2 border-danger-200 rounded-xl animate-fade-in">
              <p className="text-sm font-medium text-danger-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Photo */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Camera className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-display font-bold text-neutral-900">Profile Photo</h3>
              </div>
              {user?.id && (
                <FileUpload
                  fileType="profile"
                  userId={user.id}
                  onUploadSuccess={setProfilePhotoUrl}
                  label="Upload your profile photo"
                />
              )}
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-display font-bold text-neutral-900">About You</h3>
              </div>
              <TextArea
                label="Bio"
                rows={6}
                placeholder="Tell tourists about your experience, knowledge, and what makes your tours special. Share your passion for showing visitors around your city!"
                {...register('bio')}
                error={errors.bio?.message}
                helperText="Minimum 50 characters. Be descriptive and engaging!"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-success-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-success-600" />
                </div>
                <h3 className="text-lg font-display font-bold text-neutral-900">Pricing</h3>
              </div>
              <Input
                label="Hourly Rate (£)"
                type="number"
                placeholder="50"
                icon={<DollarSign className="w-5 h-5" />}
                {...register('hourlyRate', { valueAsNumber: true })}
                error={errors.hourlyRate?.message}
                helperText="Set your hourly rate in GBP. Minimum £10/hour."
              />
            </div>

            {/* Languages */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-info-100 rounded-lg">
                  <Languages className="w-5 h-5 text-info-600" />
                </div>
                <h3 className="text-lg font-display font-bold text-neutral-900">Languages</h3>
              </div>
              <Input
                label="Languages Spoken"
                type="text"
                placeholder="English, French, Spanish"
                icon={<Languages className="w-5 h-5" />}
                {...register('languages')}
                error={errors.languages?.message}
                helperText="Enter languages you speak, separated by commas"
              />
            </div>

            {/* Specialties */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <Award className="w-5 h-5 text-warning-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-neutral-900">Specialties</h3>
              </div>
              <Input
                label="Areas of Expertise"
                type="text"
                placeholder="History, Architecture, Food, Culture"
                icon={<Award className="w-5 h-5" />}
                {...register('specialties')}
                error={errors.specialties?.message}
                helperText="Enter your areas of expertise, separated by commas"
              />
            </div>

            {/* Verification */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <FileCheck className="w-5 h-5 text-secondary-600" />
                </div>
                <h3 className="text-lg font-display font-bold text-neutral-900">Verification (Optional)</h3>
              </div>
              {user?.id && (
                <FileUpload
                  fileType="verification"
                  userId={user.id}
                  onUploadSuccess={setVerificationDocUrl}
                  label="Upload verification document (ID, certification, etc.)"
                />
              )}
            </div>

            {/* Info Box */}
            <div className="p-5 bg-info-50 rounded-xl border-2 border-info-200">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-info-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-info-900 mb-2">
                    Profile Review Process
                  </h4>
                  <p className="text-sm text-info-700 leading-relaxed mb-3">
                    Your profile will be reviewed by our team before going live. This usually takes <strong>1-2 business days</strong>.
                  </p>
                  <p className="text-xs text-info-600">
                    You'll receive an email notification once your profile is approved.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t-2 border-neutral-100 pt-6 mt-6">
              <Button type="submit" fullWidth loading={loading} size="lg">
                {!loading && (
                  <>
                    Submit for Approval
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Help Text */}
        <div className="mt-8 text-center animate-fade-in-up">
          <p className="text-sm text-neutral-500">
            Need help? Check our{' '}
            <a href="#" className="text-primary-600 hover:underline font-medium">
              Guide Guidelines
            </a>{' '}
            or{' '}
            <a href="#" className="text-primary-600 hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
