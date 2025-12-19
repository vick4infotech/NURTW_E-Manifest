'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layouts/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  FileText, 
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  MapPin,
  Users,
  Clock,
  Truck
} from 'lucide-react'

interface Manifest {
  id: string
  code: string
  agentCode: string
  agentName: string
  parkName: string
  origin: string
  destination: string
  plateNumber: string
  driverName: string
  driverPhone: string
  seatingCapacity: number
  passengerCount: number
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  completedAt?: string
  passengers: Passenger[]
}

interface Passenger {
  id: string
  seatNumber: number
  fullName: string
  nextOfKinName: string
  nextOfKinPhone: string
  addedAt: string
}

export default function ManifestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [manifests, setManifests] = useState<Manifest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedManifest, setSelectedManifest] = useState<Manifest | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

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
      
      // Mock manifest data
      const mockManifests: Manifest[] = [
        {
          id: '1',
          code: 'NURTW-LAGOS-ABUJA-IMP001-0308-1430-001',
          agentCode: '1001',
          agentName: 'John Adebayo',
          parkName: 'Ikeja Motor Park',
          origin: 'Lagos',
          destination: 'Abuja',
          plateNumber: 'LAG-123-ABC',
          driverName: 'Ibrahim Musa',
          driverPhone: '+234 803 456 7890',
          seatingCapacity: 18,
          passengerCount: 15,
          status: 'completed',
          createdAt: '2024-03-08T14:30:00',
          completedAt: '2024-03-08T20:15:00',
          passengers: [
            {
              id: '1',
              seatNumber: 1,
              fullName: 'Adebayo Johnson',
              nextOfKinName: 'Mary Johnson',
              nextOfKinPhone: '+234 901 234 5678',
              addedAt: '2024-03-08T14:35:00'
            },
            {
              id: '2',
              seatNumber: 2,
              fullName: 'Fatima Usman',
              nextOfKinName: 'Ahmed Usman',
              nextOfKinPhone: '+234 802 345 6789',
              addedAt: '2024-03-08T14:40:00'
            }
          ]
        },
        {
          id: '2',
          code: 'NURTW-LAGOS-IBADAN-BMP002-0308-0900-002',
          agentCode: '1002',
          agentName: 'Sarah Okafor',
          parkName: 'Berger Motor Park',
          origin: 'Lagos',
          destination: 'Ibadan',
          plateNumber: 'LAG-456-DEF',
          driverName: 'Olumide Adesanya',
          driverPhone: '+234 704 567 8901',
          seatingCapacity: 14,
          passengerCount: 12,
          status: 'active',
          createdAt: '2024-03-08T09:00:00',
          passengers: [
            {
              id: '3',
              seatNumber: 1,
              fullName: 'Grace Okonkwo',
              nextOfKinName: 'Paul Okonkwo',
              nextOfKinPhone: '+234 905 678 9012',
              addedAt: '2024-03-08T09:15:00'
            }
          ]
        },
        {
          id: '3',
          code: 'NURTW-LAGOS-KANO-MMP003-0307-1600-003',
          agentCode: '1003',
          agentName: 'Michael Uche',
          parkName: 'Mile 2 Motor Park',
          origin: 'Lagos',
          destination: 'Kano',
          plateNumber: 'LAG-789-GHI',
          driverName: 'Umar Sani',
          driverPhone: '+234 806 789 0123',
          seatingCapacity: 20,
          passengerCount: 18,
          status: 'completed',
          createdAt: '2024-03-07T16:00:00',
          completedAt: '2024-03-08T08:30:00',
          passengers: []
        },
        {
          id: '4',
          code: 'NURTW-LAGOS-ENUGU-IMP001-0306-1200-004',
          agentCode: '1001',
          agentName: 'John Adebayo',
          parkName: 'Ikeja Motor Park',
          origin: 'Lagos',
          destination: 'Enugu',
          plateNumber: 'LAG-321-JKL',
          driverName: 'Chukwuma Eze',
          driverPhone: '+234 907 890 1234',
          seatingCapacity: 16,
          passengerCount: 10,
          status: 'cancelled',
          createdAt: '2024-03-06T12:00:00',
          passengers: []
        }
      ]
      
      setManifests(mockManifests)
      setIsLoading(false)
    }
    
    if (session) {
      loadData()
    }
  }, [session])

  // Filter manifests
  const filteredManifests = manifests.filter(manifest => {
    const matchesSearch = manifest.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifest.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifest.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifest.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifest.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifest.driverName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || manifest.status === selectedStatus
    
    let matchesDate = true
    if (dateFilter !== 'all') {
      const manifestDate = new Date(manifest.createdAt)
      const today = new Date()
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      switch (dateFilter) {
        case 'today':
          matchesDate = manifestDate.toDateString() === today.toDateString()
          break
        case 'yesterday':
          matchesDate = manifestDate.toDateString() === yesterday.toDateString()
          break
        case 'week':
          matchesDate = manifestDate >= weekAgo
          break
        default:
          matchesDate = true
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-GB'),
      time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const exportManifestsCSV = () => {
    const csvContent = [
      ['Manifest Code', 'Agent', 'Park', 'Origin', 'Destination', 'Plate Number', 'Driver', 'Capacity', 'Passengers', 'Status', 'Created', 'Completed'].join(','),
      ...filteredManifests.map(manifest => [
        manifest.code,
        manifest.agentName,
        `"${manifest.parkName}"`,
        manifest.origin,
        manifest.destination,
        manifest.plateNumber,
        `"${manifest.driverName}"`,
        manifest.seatingCapacity,
        manifest.passengerCount,
        manifest.status,
        formatDateTime(manifest.createdAt).date,
        manifest.completedAt ? formatDateTime(manifest.completedAt).date : ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nurtw-manifests-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Manifests data exported successfully')
  }

  const exportManifestDetailCSV = (manifest: Manifest) => {
    const csvContent = [
      ['Seat Number', 'Passenger Name', 'Next of Kin', 'Next of Kin Phone', 'Added At'].join(','),
      ...manifest.passengers.map(passenger => [
        passenger.seatNumber,
        `"${passenger.fullName}"`,
        `"${passenger.nextOfKinName}"`,
        passenger.nextOfKinPhone,
        formatDateTime(passenger.addedAt).date + ' ' + formatDateTime(passenger.addedAt).time
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `manifest-${manifest.code}-passengers.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Passenger list exported successfully')
  }

  const viewManifestDetail = (manifest: Manifest) => {
    setSelectedManifest(manifest)
    setShowDetailDialog(true)
  }

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading manifests...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Manifest Management</h1>
              <p className="text-gray-600">View and manage travel manifests</p>
            </div>
            
            <Button variant="outline" onClick={exportManifestsCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export All CSV
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Manifests</p>
                    <p className="text-2xl font-bold text-gray-900">{manifests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {manifests.filter(m => m.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {manifests.filter(m => m.status === 'completed').length}
                    </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {manifests.reduce((sum, manifest) => sum + manifest.passengerCount, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by code, agent, route, or plate..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">Past Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manifests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Manifests ({filteredManifests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium">Manifest Code</th>
                      <th className="pb-3 font-medium">Agent</th>
                      <th className="pb-3 font-medium">Route</th>
                      <th className="pb-3 font-medium">Vehicle</th>
                      <th className="pb-3 font-medium">Passengers</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Created</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredManifests.map((manifest) => {
                      const createdDateTime = formatDateTime(manifest.createdAt)
                      return (
                        <tr key={manifest.id} className="hover:bg-gray-50">
                          <td className="py-3">
                            <div>
                              <p className="font-mono text-xs font-medium">{manifest.code}</p>
                              <p className="text-xs text-gray-500">{manifest.parkName}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{manifest.agentName}</p>
                              <p className="text-xs text-gray-500">Code: {manifest.agentCode}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="text-xs">{manifest.origin} → {manifest.destination}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{manifest.plateNumber}</p>
                              <p className="text-xs text-gray-500">{manifest.driverName}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="text-sm font-medium">{manifest.passengerCount}</span>
                              <span className="text-xs text-gray-500">/{manifest.seatingCapacity}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge className={getStatusColor(manifest.status)}>
                              {manifest.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div>
                              <p className="text-sm">{createdDateTime.date}</p>
                              <p className="text-xs text-gray-500">{createdDateTime.time}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewManifestDetail(manifest)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportManifestDetailCSV(manifest)}
                                disabled={manifest.passengers.length === 0}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                
                {filteredManifests.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No manifests found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Manifest Detail Dialog */}
          {selectedManifest && (
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
              <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Manifest Details</DialogTitle>
                  <DialogDescription>
                    Complete information for manifest {selectedManifest.code}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Manifest Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Trip Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Manifest Code</p>
                            <p className="font-mono">{selectedManifest.code}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Status</p>
                            <Badge className={getStatusColor(selectedManifest.status)}>
                              {selectedManifest.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Origin</p>
                            <p>{selectedManifest.origin}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Destination</p>
                            <p>{selectedManifest.destination}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Created</p>
                            <p>{formatDateTime(selectedManifest.createdAt).date} at {formatDateTime(selectedManifest.createdAt).time}</p>
                          </div>
                          {selectedManifest.completedAt && (
                            <div>
                              <p className="font-medium text-gray-700">Completed</p>
                              <p>{formatDateTime(selectedManifest.completedAt).date} at {formatDateTime(selectedManifest.completedAt).time}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Vehicle & Staff</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Agent</p>
                            <p>{selectedManifest.agentName}</p>
                            <p className="text-xs text-gray-500">Code: {selectedManifest.agentCode}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Park</p>
                            <p>{selectedManifest.parkName}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Vehicle</p>
                            <p className="font-mono">{selectedManifest.plateNumber}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Capacity</p>
                            <p>{selectedManifest.seatingCapacity} seats</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">Driver</p>
                          <p>{selectedManifest.driverName}</p>
                          <p className="text-xs text-gray-500">{selectedManifest.driverPhone}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Passengers */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Passengers ({selectedManifest.passengerCount}/{selectedManifest.seatingCapacity})
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportManifestDetailCSV(selectedManifest)}
                          disabled={selectedManifest.passengers.length === 0}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedManifest.passengers.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="border-b">
                              <tr className="text-left">
                                <th className="pb-2 font-medium">Seat</th>
                                <th className="pb-2 font-medium">Passenger Name</th>
                                <th className="pb-2 font-medium">Next of Kin</th>
                                <th className="pb-2 font-medium">Next of Kin Phone</th>
                                <th className="pb-2 font-medium">Added</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {selectedManifest.passengers.map((passenger) => {
                                const addedDateTime = formatDateTime(passenger.addedAt)
                                return (
                                  <tr key={passenger.id}>
                                    <td className="py-2 font-mono font-medium">{passenger.seatNumber}</td>
                                    <td className="py-2 font-medium">{passenger.fullName}</td>
                                    <td className="py-2">{passenger.nextOfKinName}</td>
                                    <td className="py-2 font-mono">{passenger.nextOfKinPhone}</td>
                                    <td className="py-2">
                                      <div>
                                        <p>{addedDateTime.date}</p>
                                        <p className="text-xs text-gray-500">{addedDateTime.time}</p>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">No passengers added yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setShowDetailDialog(false)}>
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
