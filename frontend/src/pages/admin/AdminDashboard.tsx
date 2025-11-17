import { useState, useEffect } from 'react'
import { Users, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { api } from '../../services/api'
import demoService from '../../services/demoService'
import { Avatar } from '../../components/common/Avatar'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'
import { formatCurrency } from '../../utils/helpers'
import type { Guide } from '../../types'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [pendingGuides, setPendingGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchPendingGuides()
  }, [])

  const fetchStats = async () => {
    try {
      // Use demo service if in demo mode
      const response = demoService.isDemoMode()
        ? await demoService.analytics.getPlatformStats()
        : await api.get('/api/admin/stats')

      if (response.success && response.data) {
        setStats(response.data.platform)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingGuides = async () => {
    try {
      // Use demo service if in demo mode
      const response = demoService.isDemoMode()
        ? await demoService.admin.getPendingGuides()
        : await api.get<Guide[]>('/api/admin/guides/pending')

      if (response.success && response.data) {
        setPendingGuides(response.data)
      }
    } catch (error) {
      console.error('Error fetching pending guides:', error)
    }
  }

  const handleApprove = async (guideId: string) => {
    try {
      // Use demo service if in demo mode
      if (demoService.isDemoMode()) {
        await demoService.admin.approveGuide(guideId)
      } else {
        await api.put(`/api/admin/guides/${guideId}/approve`)
      }
      fetchPendingGuides()
      fetchStats()
    } catch (error: any) {
      alert(error.message || 'Failed to approve guide')
    }
  }

  const handleReject = async (guideId: string) => {
    const reason = prompt('Rejection reason (optional):')
    try {
      // Use demo service if in demo mode
      if (demoService.isDemoMode()) {
        await demoService.admin.rejectGuide(guideId, reason || 'No reason provided')
      } else {
        await api.put(`/api/admin/guides/${guideId}/reject`, { reason })
      }
      fetchPendingGuides()
      fetchStats()
    } catch (error: any) {
      alert(error.message || 'Failed to reject guide')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading admin dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users?.total || 0}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Platform Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.revenue?.commission || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.bookings?.total || 0}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.users?.pendingGuides || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Pending Guide Approvals */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Guide Approvals</h2>

        {pendingGuides.length > 0 ? (
          <div className="space-y-4">
            {pendingGuides.map((guide) => (
              <Card key={guide.id}>
                <div className="flex items-start gap-4">
                  <Avatar src={guide.user?.photo} name={guide.user?.name} size="lg" />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {guide.user?.name}
                        </h3>
                        <p className="text-sm text-gray-600">{guide.user?.email}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">Hourly Rate</p>
                        <p className="text-xl font-bold text-primary-600">
                          {formatCurrency(guide.hourlyRate)}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{guide.bio}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {guide.languages?.map((lang) => (
                        <Badge key={lang} variant="info" size="sm">
                          {lang}
                        </Badge>
                      ))}
                      {guide.specialties?.map((spec) => (
                        <Badge key={spec} variant="primary" size="sm">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(guide.id)}
                        variant="primary"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>

                      <Button onClick={() => handleReject(guide.id)} variant="danger" size="sm">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>

                      {guide.verificationDoc && (
                        <a
                          href={guide.verificationDoc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:underline self-center"
                        >
                          View Verification Doc
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8 text-gray-600">
              No pending guide approvals
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
