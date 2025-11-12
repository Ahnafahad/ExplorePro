import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../../services/api'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { TextArea } from '../../components/common/TextArea'
import { Select } from '../../components/common/Select'
import { Card } from '../../components/common/Card'
import { LANGUAGES, SPECIALTIES } from '../../constants'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        verificationDoc: data.verificationDoc,
      }

      await api.post('/api/guides', payload)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up Your Guide Profile</h1>
          <p className="text-gray-600">Complete your profile to start accepting bookings</p>
        </div>

        <Card>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TextArea
              label="About You"
              rows={5}
              placeholder="Tell tourists about your experience, knowledge, and what makes your tours special..."
              {...register('bio')}
              error={errors.bio?.message}
            />

            <Input
              label="Hourly Rate (£)"
              type="number"
              placeholder="50"
              {...register('hourlyRate', { valueAsNumber: true })}
              error={errors.hourlyRate?.message}
            />

            <Input
              label="Languages (comma-separated)"
              type="text"
              placeholder="English, French, Spanish"
              {...register('languages')}
              error={errors.languages?.message}
              helperText="Enter languages you speak, separated by commas"
            />

            <Input
              label="Specialties (comma-separated)"
              type="text"
              placeholder="History, Architecture, Food"
              {...register('specialties')}
              error={errors.specialties?.message}
              helperText="Enter your areas of expertise, separated by commas"
            />

            <Input
              label="Verification Document URL (Optional)"
              type="text"
              placeholder="https://..."
              {...register('verificationDoc')}
              error={errors.verificationDoc?.message}
              helperText="Upload your ID to a service like Imgur and paste the link"
            />

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Your profile will be reviewed by our team before going live. This usually takes 1-2 business days.
              </p>
              <Button type="submit" fullWidth loading={loading}>
                Submit for Approval
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
