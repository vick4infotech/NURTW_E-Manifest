'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layouts/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  MapPin, 
  FileText, 
  BarChart3,
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react'

interface DashboardStats {
  totalManifests: number
  activeManifests: number
  totalPassengers: number
  totalAgents: number
  totalParks: number
  todayManifests: number
  complianceScore: number
}

interface RecentActivity {
  id: string
  type: 'manifest' | 'agent' | 'park' | 'compliance'
  title: string
  description: string
  time: string
  status?: 'success' | 'warning' | 'info'
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalManifests: 0,
    activeManifests: 0,
    totalPassengers: 0,
    totalAgents: 0,
    totalParks: 0,
    todayManifests: 0,
    complianceScore: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin')
    }
  }, [session, status, router])

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock dashboard stats
      setStats({
        totalManifests: 156,
        activeManifests: 23,
        totalPassengers: 1847,
        totalAgents: 45,
        totalParks: 12,
        todayManifests: 8,
        complianceScore: 87
      })
      
      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'manifest',
          title: 'New manifest created',
          description: 'Lagos to Abuja - 18 passengers',
          time: '2 hours ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'agent',
          title: 'Agent registered',
          description: 'New agent AGT045 added to Ikeja Park',
          time: '4 hours ago',
          status: 'info'
        },
        {
          id: '3',
          type: 'compliance',
          title: 'Vehicle inspection due',
          description: 'LAG-123-ABC requires safety inspection',
          time: '6 hours ago',
          status: 'warning'
        },
        {
          id: '4',
          type: 'manifest',
          title: 'Manifest completed',
          description: '25 passengers safely transported to Ibadan',
          time: '8 hours ago',
          status: 'success'
        },
        {
          id: '5',
          type: 'park',
          title: 'Park updated',
          description: 'Berger Motor Park information updated',
          time: '1 day ago',
          status: 'info'
        }
      ])
      
      setIsLoading(false)
    }
    
    if (session) {
      loadDashboardData()
    }
  }, [session])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'manifest':
        return <FileText className="h-4 w-4" />
      case 'agent':
        return <Users className="h-4 w-4" />
      case 'park':
        return <MapPin className="h-4 w-4" />
      case 'compliance':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-orange-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!session) {
    return null
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="space-y-6">
          {/* Welcome Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back, {session.user?.name}. Here's what's happening today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Manifests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalManifests}</p>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+12% from last month</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Manifests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeManifests}</p>
                    <p className="text-xs text-gray-500 mt-1">Currently in progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Passengers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPassengers.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">All-time transported</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.complianceScore}%</p>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+5% improvement</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Manifests</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.todayManifests}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Agents</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalAgents}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Motor Parks</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalParks}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 py-3 border-b last:border-b-0">
                      <div className={`p-2 rounded-full bg-gray-100 ${getActivityStatusColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push('/admin/agents')}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-300 transition-colors"
                  >
                    <Users className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-900">Manage Agents</p>
                    <p className="text-sm text-gray-600">Add or edit agents</p>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/admin/parks')}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-300 transition-colors"
                  >
                    <MapPin className="h-6 w-6 text-green-600 mb-2" />
                    <p className="font-medium text-gray-900">Manage Parks</p>
                    <p className="text-sm text-gray-600">Configure motor parks</p>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/admin/manifests')}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-300 transition-colors"
                  >
                    <FileText className="h-6 w-6 text-purple-600 mb-2" />
                    <p className="font-medium text-gray-900">View Manifests</p>
                    <p className="text-sm text-gray-600">Search and export</p>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/admin/compliance')}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-300 transition-colors"
                  >
                    <BarChart3 className="h-6 w-6 text-red-600 mb-2" />
                    <p className="font-medium text-gray-900">Compliance</p>
                    <p className="text-sm text-gray-600">Monitor issues</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Database</p>
                  <p className="text-xs text-gray-600">Healthy</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">API</p>
                  <p className="text-xs text-gray-600">Operational</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Email Service</p>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">SMS Service</p>
                  <p className="text-xs text-gray-600">Degraded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
