import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { api } from '../../services/api'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Modal } from '../../components/common/Modal'
import { Input } from '../../components/common/Input'
import { TextArea } from '../../components/common/TextArea'
import { Loading } from '../../components/common/Loading'
import { formatCurrency } from '../../utils/helpers'
import type { Tour } from '../../types'

export default function TourManagement() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    price: 50,
  })

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    try {
      const response = await api.get<Tour[]>('/api/guides/me/tours')
      if (response.success && response.data) {
        setTours(response.data)
      }
    } catch (error) {
      console.error('Error fetching tours:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingTour) {
        await api.put(`/api/tours/${editingTour.id}`, formData)
      } else {
        await api.post('/api/tours', formData)
      }

      setIsModalOpen(false)
      setEditingTour(null)
      setFormData({ title: '', description: '', duration: 60, price: 50 })
      fetchTours()
    } catch (error: any) {
      alert(error.message || 'Failed to save tour')
    }
  }

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour)
    setFormData({
      title: tour.title,
      description: tour.description,
      duration: tour.duration,
      price: tour.price,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return

    try {
      await api.delete(`/api/tours/${id}`)
      fetchTours()
    } catch (error: any) {
      alert(error.message || 'Failed to delete tour')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading tours..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Tours</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Tour
          </Button>
        </div>

        {tours.length > 0 ? (
          <div className="space-y-4">
            {tours.map((tour) => (
              <Card key={tour.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
                    <p className="text-gray-600 mb-3">{tour.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                      <span>{tour.duration} minutes</span>
                      <span className="font-semibold text-primary-600">
                        {formatCurrency(tour.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(tour)} size="sm" variant="secondary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(tour.id)} size="sm" variant="danger">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No tours yet</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Tour
              </Button>
            </div>
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTour(null)
            setFormData({ title: '', description: '', duration: 60, price: 50 })
          }}
          title={editingTour ? 'Edit Tour' : 'Add New Tour'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tour Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <TextArea
              label="Description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              required
            />

            <Input
              label="Price (£)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />

            <Button type="submit" fullWidth>
              {editingTour ? 'Update Tour' : 'Create Tour'}
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  )
}
