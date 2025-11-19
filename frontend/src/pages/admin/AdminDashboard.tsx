import { useState, useEffect } from 'react'
import { Users, DollarSign, Calendar, CheckCircle, XCircle, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../../components/common/Avatar'
import { Badge } from '../../components/common/Badge'
import { Loading } from '../../components/common/Loading'
import MobileAppLayout from '../../components/layout/MobileAppLayout'
import { formatCurrency } from '../../utils/helpers'
import { demoStats, demoPendingGuides, isDemoMode } from '../../data/demoData'
import type { Guide } from '../../types'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [pendingGuides, setPendingGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchPendingGuides()
  }, [])

  const fetchStats = async () => {
    try {
      // Use demo data for demo accounts (no API calls!)
      if (isDemoMode(user?.email)) {
        setStats(demoStats)
      } else {
        // For real accounts, would call API here
        setStats(null)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingGuides = async () => {
    try {
      // Use demo data for demo accounts (no API calls!)
      if (isDemoMode(user?.email)) {
        setPendingGuides(demoPendingGuides as any[])
      } else {
        // For real accounts, would call API here
        setPendingGuides([])
      }
    } catch (error) {
      console.error('Error fetching pending guides:', error)
    }
  }

  const handleApprove = async (guideId: string) => {
    try {
      // Demo mode - simulate approval
      if (isDemoMode(user?.email)) {
        // Remove from pending list
        setPendingGuides(prev => prev.filter(g => g.id !== guideId))
        // Update stats
        setStats((prev: any) => ({
          ...prev,
          users: {
            ...prev.users,
            pendingGuides: Math.max(0, prev.users.pendingGuides - 1),
            guides: prev.users.guides + 1,
          },
        }))
        alert('Guide approved successfully! (Demo Mode)')
      } else {
        // For real accounts, would call API here
        alert('API integration needed for production')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to approve guide')
    }
  }

  const handleReject = async (guideId: string) => {
    const reason = prompt('Rejection reason (optional):')
    try {
      // Demo mode - simulate rejection
      if (isDemoMode(user?.email)) {
        // Remove from pending list
        setPendingGuides(prev => prev.filter(g => g.id !== guideId))
        // Update stats
        setStats((prev: any) => ({
          ...prev,
          users: {
            ...prev.users,
            pendingGuides: Math.max(0, prev.users.pendingGuides - 1),
          },
        }))
        alert(`Guide rejected${reason ? `: ${reason}` : ''} (Demo Mode)`)
      } else {
        // For real accounts, would call API here
        alert('API integration needed for production')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to reject guide')
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout()
      navigate('/')
    }
  }

  if (loading) {
    return (
      <MobileAppLayout showBottomNav={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading size="lg" text="Loading admin dashboard..." />
        </div>
      </MobileAppLayout>
    )
  }

  return (
    <MobileAppLayout>
      <div className="bg-gradient-to-br from-warning-600 to-warning-700 text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-2">
              <Users className="w-3 h-3" />
              <span className="text-xs font-semibold">Admin Panel</span>
            </div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-95"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 bg-neutral-50">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.users?.total || 0}</p>
                <p className="text-xs text-gray-600">Total Users</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.revenue?.commission || 0)}
                </p>
                <p className="text-xs text-gray-600">Revenue</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.bookings?.total || 0}</p>
                <p className="text-xs text-gray-600">Bookings</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.users?.pendingGuides || 0}
                </p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Guide Approvals */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Approvals</h2>

        {pendingGuides.length > 0 ? (
          <div className="space-y-3">
            {pendingGuides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <Avatar src={guide.user?.photo} name={guide.user?.name} size="lg" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {guide.user?.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{guide.user?.email}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-sm font-bold text-primary-600">
                          {formatCurrency(guide.hourlyRate)}
                        </p>
                        <p className="text-[10px] text-gray-500">per hour</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 mb-3 line-clamp-2">{guide.bio}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {guide.languages?.slice(0, 2).map((lang) => (
                        <Badge key={lang} variant="info" size="sm">
                          {lang}
                        </Badge>
                      ))}
                      {guide.specialties?.slice(0, 2).map((spec) => (
                        <Badge key={spec} variant="primary" size="sm">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(guide.id)}
                        className="flex-1 bg-success-500 hover:bg-success-600 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(guide.id)}
                        className="flex-1 bg-danger-500 hover:bg-danger-600 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>

                    {guide.verificationDoc && (
                      <a
                        href={guide.verificationDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-xs text-primary-600 hover:underline mt-2"
                      >
                        View Docs →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-sm text-gray-600">No pending approvals</p>
          </div>
        )}
      </div>
    </MobileAppLayout>
  )
}
