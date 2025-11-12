import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { Button } from '../common/Button'
import { TextArea } from '../common/TextArea'
import { StarRating } from '../common/StarRating'
import { Card } from '../common/Card'

interface ReviewFormProps {
  bookingId: string
  guideName: string
}

export function ReviewForm({ bookingId, guideName }: ReviewFormProps) {
  const navigate = useNavigate()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      await api.post('/api/reviews', {
        bookingId,
        rating,
        comment,
      })
      alert('Review submitted successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      alert(error.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        How was your tour with {guideName}?
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex justify-center">
            <StarRating rating={rating} interactive onChange={setRating} size="lg" />
          </div>
        </div>

        <TextArea
          label="Your Review (Optional)"
          rows={5}
          placeholder="Tell us about your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button type="submit" fullWidth loading={submitting}>
          Submit Review
        </Button>
      </form>
    </Card>
  )
}
