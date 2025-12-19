'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layouts/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Shield, 
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Search
} from 'lucide-react'

interface ComplianceReport {
  id: string
  type: 'safety' | 'documentation' | 'vehicle' | 'driver'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved' | 'dismissed'
  agentName?: string
  parkName?: string
  plateNumber?: string
  createdAt: string
  resolvedAt?: string
  assignedTo?: string
}

interface ComplianceStats {
  totalReports: number
  openReports: number
  resolvedReports: number
  criticalReports: number
  complianceScore: number
  trendChange: number
}

export default function CompliancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState<ComplianceReport[]>([])
  const [stats, setStats] = useState<ComplianceStats>({
    totalReports: 0,
    openReports: 0,
    resolvedReports: 0,
    criticalReports: 0,
    complianceScore: 0,
    trendChange: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin')
    }
  }, [session, status, router])

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock compliance reports
      const mockReports: ComplianceReport[] = [
        {
          id: '1',
          type: 'safety',
          title: 'Vehicle Safety Check Overdue',
          description: 'Vehicle LAG-123-ABC has not completed mandatory safety inspection for 3 months',
          severity: 'high',
          status: 'open',
          agentName: 'John Adebayo',
          parkName: 'Ikeja Motor Park',
          plateNumber: 'LAG-123-ABC',
          createdAt: '2024-03-01T10:00:00',
          assignedTo: 'Safety Department'
        },
        {
          id: '2',
          type: 'documentation',
          title: 'Missing Driver License Copy',
          description: 'Driver Ibrahim Musa operating vehicle LAG-456-DEF without valid license documentation on file',
          severity: 'critical',
          status: 'in-progress',
          agentName: 'Sarah Okafor',
          parkName: 'Berger Motor Park',
          plateNumber: 'LAG-456-DEF',
          createdAt: '2024-03-02T14:30:00',
          assignedTo: 'Documentation Team'
        },
        {
          id: '3',
          type: 'vehicle',
          title: 'Expired Vehicle Registration',
          description: 'Vehicle registration for LAG-789-GHI expired on February 28, 2024',
          severity: 'high',
          status: 'resolved',
          agentName: 'Michael Uche',
          parkName: 'Mile 2 Motor Park',
          plateNumber: 'LAG-789-GHI',
          createdAt: '2024-02-28T09:15:00',
          resolvedAt: '2024-03-05T16:20:00',
          assignedTo: 'Compliance Officer'
        },
        {
          id: '4',
          type: 'driver',
          title: 'Driver Medical Certificate Expiring',
          description: 'Medical certificate for driver Chukwuma Eze expires in 5 days',
          severity: 'medium',
          status: 'open',
          agentName: 'John Adebayo',
          parkName: 'Ikeja Motor Park',
          plateNumber: 'LAG-321-JKL',
          createdAt: '2024-03-06T11:45:00',
          assignedTo: 'HR Department'
        },
        {
          id: '5',
          type: 'safety',
          title: 'Incomplete Passenger Manifest',
          description: 'Manifest NURTW-LAGOS-ABUJA-IMP001-0308-1430-001 missing passenger emergency contact information',
          severity: 'medium',
          status: 'dismissed',
          agentName: 'John Adebayo',
          parkName: 'Ikeja Motor Park',
          createdAt: '2024-03-08T15:00:00',
          resolvedAt: '2024-03-08T16:30:00'
        },
        {
          id: '6',
          type: 'vehicle',
          title: 'Insurance Coverage Gap',
          description: 'Vehicle LAG-555-MNO insurance policy lapsed and requires immediate renewal',
          severity: 'critical',
          status: 'open',
          agentName: 'Fatima Ibrahim',
          parkName: 'Ikeja Motor Park',
          plateNumber: 'LAG-555-MNO',
          createdAt: '2024-03-07T08:30:00',
          assignedTo: 'Insurance Department'
        }
      ]
      
      setReports(mockReports)
      
      // Calculate stats
      const totalReports = mockReports.length
      const openReports = mockReports.filter(r => r.status === 'open').length
      const resolvedReports = mockReports.filter(r => r.status === 'resolved').length
      const criticalReports = mockReports.filter(r => r.severity === 'critical').length
      const complianceScore = Math.round((resolvedReports / totalReports) * 100)
      
      setStats({
        totalReports,
        openReports,
        resolvedReports,
        criticalReports,
        complianceScore,
        trendChange: 5.2 // Mock trend change
      })
      
      setIsLoading(false)
    }
    
    if (session) {
      loadData()
    }
  }, [session])

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (report.agentName && report.agentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (report.parkName && report.parkName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (report.plateNumber && report.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === 'all' || report.type === selectedType
    const matchesSeverity = selectedSeverity === 'all' || report.severity === selectedSeverity
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus
    
    return matchesSearch && matchesType && matchesSeverity && matchesStatus
  })

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-GB'),
      time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'high':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100'
      case 'critical':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'resolved':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <XCircle className="h-4 w-4" />
      case 'in-progress':
        return <Clock className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />
      case 'dismissed':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const exportComplianceCSV = () => {
    const csvContent = [
      ['ID', 'Type', 'Title', 'Severity', 'Status', 'Agent', 'Park', 'Plate Number', 'Created', 'Resolved', 'Assigned To'].join(','),
      ...filteredReports.map(report => [
        report.id,
        report.type,
        `"${report.title}"`,
        report.severity,
        report.status,
        report.agentName || '',
        `"${report.parkName || ''}"`,
        report.plateNumber || '',
        formatDateTime(report.createdAt).date,
        report.resolvedAt ? formatDateTime(report.resolvedAt).date : '',
        report.assignedTo || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nurtw-compliance-reports-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Compliance reports exported successfully')
  }

  const updateReportStatus = (reportId: string, newStatus: ComplianceReport['status']) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: newStatus,
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined
          }
        : report
    ))
    toast.success(`Report status updated to ${newStatus}`)
  }

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading compliance data...</p>
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Compliance & Safety</h1>
              <p className="text-gray-600">Monitor compliance issues and safety reports</p>
            </div>
            
            <Button variant="outline" onClick={exportComplianceCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold text-gray-900">{stats.complianceScore}%</p>
                      <div className={`ml-2 flex items-center text-xs ${stats.trendChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.trendChange > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {Math.abs(stats.trendChange)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Open Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.openReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.resolvedReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Critical</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.criticalReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search reports..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report) => {
                  const createdDateTime = formatDateTime(report.createdAt)
                  const resolvedDateTime = report.resolvedAt ? formatDateTime(report.resolvedAt) : null
                  
                  return (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getSeverityColor(report.severity)}>
                                {report.severity}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {report.type}
                              </Badge>
                            </div>
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs ${getStatusColor(report.status)}`}>
                              {getStatusIcon(report.status)}
                              <span className="capitalize">{report.status}</span>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            {report.agentName && (
                              <div>
                                <p className="font-medium text-gray-700">Agent</p>
                                <p>{report.agentName}</p>
                              </div>
                            )}
                            {report.parkName && (
                              <div>
                                <p className="font-medium text-gray-700">Park</p>
                                <p>{report.parkName}</p>
                              </div>
                            )}
                            {report.plateNumber && (
                              <div>
                                <p className="font-medium text-gray-700">Vehicle</p>
                                <p className="font-mono">{report.plateNumber}</p>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-700">Created</p>
                              <p>{createdDateTime.date}</p>
                              <p className="text-xs text-gray-500">{createdDateTime.time}</p>
                            </div>
                          </div>
                          
                          {report.assignedTo && (
                            <div className="mt-2">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Assigned to:</span> {report.assignedTo}
                              </p>
                            </div>
                          )}
                          
                          {resolvedDateTime && (
                            <div className="mt-2">
                              <p className="text-sm text-green-600">
                                <CheckCircle className="h-4 w-4 inline mr-1" />
                                Resolved on {resolvedDateTime.date} at {resolvedDateTime.time}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          {report.status === 'open' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateReportStatus(report.id, 'in-progress')}
                              >
                                Start Progress
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateReportStatus(report.id, 'resolved')}
                              >
                                Mark Resolved
                              </Button>
                            </>
                          )}
                          {report.status === 'in-progress' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateReportStatus(report.id, 'resolved')}
                            >
                              Mark Resolved
                            </Button>
                          )}
                          {(report.status === 'resolved' || report.status === 'dismissed') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateReportStatus(report.id, 'open')}
                            >
                              Reopen
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {filteredReports.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No compliance reports found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
