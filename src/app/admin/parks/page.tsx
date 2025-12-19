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
  MapPin, 
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Building,
  Download,
  Upload
} from 'lucide-react'

interface Park {
  id: string
  code: string
  name: string
  defaultOrigin: string
  city: string
  state: string
  status: 'active' | 'inactive'
  agentCount: number
  createdAt: string
  assignedAgents: Agent[]
}

interface Agent {
  id: string
  code: string
  name: string
  status: 'active' | 'suspended'
}

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

export default function ParksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [parks, setParks] = useState<Park[]>([])
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingPark, setEditingPark] = useState<Park | null>(null)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedParkForAssign, setSelectedParkForAssign] = useState<Park | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    defaultOrigin: '',
    city: '',
    state: ''
  })

  // Agent assignment state
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])

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
      
      // Mock agents data
      const mockAvailableAgents: Agent[] = [
        { id: '5', code: '1005', name: 'Ahmed Bello', status: 'active' },
        { id: '6', code: '1006', name: 'Grace Okonkwo', status: 'active' },
        { id: '7', code: '1007', name: 'Ibrahim Musa', status: 'active' },
        { id: '8', code: '1008', name: 'Blessing Okoro', status: 'active' }
      ]
      
      // Mock parks data
      const mockParks: Park[] = [
        {
          id: '1',
          code: 'IMP001',
          name: 'Ikeja Motor Park',
          defaultOrigin: 'Lagos',
          city: 'Ikeja',
          state: 'Lagos',
          status: 'active',
          agentCount: 8,
          createdAt: '2024-01-10',
          assignedAgents: [
            { id: '1', code: '1001', name: 'John Adebayo', status: 'active' },
            { id: '4', code: '1004', name: 'Fatima Ibrahim', status: 'active' }
          ]
        },
        {
          id: '2',
          code: 'BMP002',
          name: 'Berger Motor Park',
          defaultOrigin: 'Lagos',
          city: 'Ojodu',
          state: 'Lagos',
          status: 'active',
          agentCount: 6,
          createdAt: '2024-01-15',
          assignedAgents: [
            { id: '2', code: '1002', name: 'Sarah Okafor', status: 'active' }
          ]
        },
        {
          id: '3',
          code: 'MMP003',
          name: 'Mile 2 Motor Park',
          defaultOrigin: 'Lagos',
          city: 'Amuwo-Odofin',
          state: 'Lagos',
          status: 'active',
          agentCount: 4,
          createdAt: '2024-02-01',
          assignedAgents: [
            { id: '3', code: '1003', name: 'Michael Uche', status: 'suspended' }
          ]
        },
        {
          id: '4',
          code: 'OMP004',
          name: 'Ojodu Motor Park',
          defaultOrigin: 'Lagos',
          city: 'Ojodu',
          state: 'Lagos',
          status: 'inactive',
          agentCount: 0,
          createdAt: '2024-02-15',
          assignedAgents: []
        }
      ]
      
      setAvailableAgents(mockAvailableAgents)
      setParks(mockParks)
      setIsLoading(false)
    }
    
    if (session) {
      loadData()
    }
  }, [session])

  // Filter parks based on search and state
  const filteredParks = parks.filter(park => {
    const matchesSearch = park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         park.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         park.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         park.defaultOrigin.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesState = selectedState === 'all' || park.state === selectedState
    
    return matchesSearch && matchesState
  })

  const generateParkCode = () => {
    // Generate next available park code
    const existingCodes = parks.map(park => parseInt(park.code.slice(-3)))
    const maxCode = Math.max(...existingCodes, 0)
    const nextCode = (maxCode + 1).toString().padStart(3, '0')
    return `PK${nextCode}`
  }

  const resetForm = () => {
    setFormData({
      name: '',
      defaultOrigin: '',
      city: '',
      state: ''
    })
    setEditingPark(null)
  }

  const handleAddPark = () => {
    if (!formData.name.trim() || !formData.defaultOrigin.trim() || !formData.city.trim() || !formData.state) {
      toast.error('Please fill in all fields')
      return
    }

    const newPark: Park = {
      id: Date.now().toString(),
      code: generateParkCode(),
      name: formData.name.trim(),
      defaultOrigin: formData.defaultOrigin.trim(),
      city: formData.city.trim(),
      state: formData.state,
      status: 'active',
      agentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      assignedAgents: []
    }

    setParks(prev => [...prev, newPark])
    setShowAddDialog(false)
    resetForm()
    toast.success('Park added successfully')
  }

  const handleEditPark = () => {
    if (!editingPark || !formData.name.trim() || !formData.defaultOrigin.trim() || !formData.city.trim() || !formData.state) {
      toast.error('Please fill in all fields')
      return
    }

    const updatedPark: Park = {
      ...editingPark,
      name: formData.name.trim(),
      defaultOrigin: formData.defaultOrigin.trim(),
      city: formData.city.trim(),
      state: formData.state
    }

    setParks(prev => prev.map(park => park.id === editingPark.id ? updatedPark : park))
    setEditingPark(null)
    resetForm()
    toast.success('Park updated successfully')
  }

  const handleToggleStatus = (park: Park) => {
    const newStatus = park.status === 'active' ? 'inactive' : 'active'
    setParks(prev => prev.map(p => p.id === park.id ? { ...p, status: newStatus } : p))
    toast.success(`Park ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
  }

  const handleDeletePark = (park: Park) => {
    if (park.agentCount > 0) {
      toast.error('Cannot delete park with assigned agents. Please reassign agents first.')
      return
    }
    
    if (confirm(`Are you sure you want to delete ${park.name}?`)) {
      setParks(prev => prev.filter(p => p.id !== park.id))
      toast.success('Park deleted successfully')
    }
  }

  const openEditDialog = (park: Park) => {
    setEditingPark(park)
    setFormData({
      name: park.name,
      defaultOrigin: park.defaultOrigin,
      city: park.city,
      state: park.state
    })
  }

  const openAssignDialog = (park: Park) => {
    setSelectedParkForAssign(park)
    setSelectedAgents(park.assignedAgents.map(a => a.id))
    setShowAssignDialog(true)
  }

  const handleAssignAgents = () => {
    if (!selectedParkForAssign) return

    const selectedAgentObjects = availableAgents.filter(agent => selectedAgents.includes(agent.id))
    const updatedPark = {
      ...selectedParkForAssign,
      assignedAgents: selectedAgentObjects,
      agentCount: selectedAgentObjects.length
    }

    setParks(prev => prev.map(park => park.id === selectedParkForAssign.id ? updatedPark : park))
    setShowAssignDialog(false)
    setSelectedParkForAssign(null)
    setSelectedAgents([])
    toast.success('Agents assigned successfully')
  }

  const exportParksCSV = () => {
    const csvContent = [
      ['Park Code', 'Name', 'Default Origin', 'City', 'State', 'Status', 'Agent Count', 'Created Date'].join(','),
      ...parks.map(park => [
        park.code,
        `"${park.name}"`,
        park.defaultOrigin,
        park.city,
        park.state,
        park.status,
        park.agentCount,
        park.createdAt
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nurtw-parks-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Parks data exported successfully')
  }

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading parks...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Park Management</h1>
              <p className="text-gray-600">Manage motor parks and agent assignments</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportParksCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Park
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Park</DialogTitle>
                    <DialogDescription>
                      Create a new motor park with location details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Park Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter park name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="defaultOrigin">Default Origin</Label>
                      <Input
                        id="defaultOrigin"
                        placeholder="Default departure city"
                        value={formData.defaultOrigin}
                        onChange={(e) => setFormData(prev => ({ ...prev, defaultOrigin: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">City/Area</Label>
                      <Input
                        id="city"
                        placeholder="City or area location"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">State</Label>
                      <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianStates.map(state => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPark} className="bg-red-600 hover:bg-red-700">
                      Add Park
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Parks</p>
                    <p className="text-2xl font-bold text-gray-900">{parks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Parks</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {parks.filter(p => p.status === 'active').length}
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
                    <p className="text-sm font-medium text-gray-600">Total Agents</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {parks.reduce((sum, park) => sum + park.agentCount, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">States Covered</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(parks.map(p => p.state)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, code, city, or origin..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {nigerianStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParks.map((park) => (
              <Card key={park.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-red-600" />
                      {park.name}
                    </CardTitle>
                    <Badge 
                      className={
                        park.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {park.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Code</p>
                        <p className="font-mono">{park.code}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Default Origin</p>
                        <p>{park.defaultOrigin}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Location</p>
                        <p>{park.city}, {park.state}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Agents</p>
                        <p className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {park.agentCount}
                        </p>
                      </div>
                    </div>

                    {park.assignedAgents.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-700 text-sm mb-2">Assigned Agents</p>
                        <div className="flex flex-wrap gap-1">
                          {park.assignedAgents.slice(0, 3).map(agent => (
                            <Badge key={agent.id} variant="outline" className="text-xs">
                              {agent.name}
                            </Badge>
                          ))}
                          {park.assignedAgents.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{park.assignedAgents.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(park)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePark(park)}
                        className="border-red-300 hover:bg-red-50"
                        disabled={park.agentCount > 0}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAssignDialog(park)}
                      className="border-blue-300 hover:bg-blue-50"
                    >
                      <Users className="h-4 w-4 mr-1 text-blue-600" />
                      Assign Agents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredParks.length === 0 && (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No parks found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Park Dialog */}
          {editingPark && (
            <Dialog open={!!editingPark} onOpenChange={() => setEditingPark(null)}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Park</DialogTitle>
                  <DialogDescription>
                    Update park information and location details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Park Name</Label>
                    <Input
                      id="edit-name"
                      placeholder="Enter park name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-defaultOrigin">Default Origin</Label>
                    <Input
                      id="edit-defaultOrigin"
                      placeholder="Default departure city"
                      value={formData.defaultOrigin}
                      onChange={(e) => setFormData(prev => ({ ...prev, defaultOrigin: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-city">City/Area</Label>
                    <Input
                      id="edit-city"
                      placeholder="City or area location"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map(state => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Park Code</Label>
                    <Input
                      value={editingPark.code}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Park codes cannot be changed</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingPark(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditPark} className="bg-red-600 hover:bg-red-700">
                    Update Park
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Assign Agents Dialog */}
          {showAssignDialog && selectedParkForAssign && (
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Assign Agents to {selectedParkForAssign.name}</DialogTitle>
                  <DialogDescription>
                    Select agents to assign to this park.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {availableAgents.map(agent => (
                      <div key={agent.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`agent-${agent.id}`}
                          checked={selectedAgents.includes(agent.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAgents(prev => [...prev, agent.id])
                            } else {
                              setSelectedAgents(prev => prev.filter(id => id !== agent.id))
                            }
                          }}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`agent-${agent.id}`} className="flex-1 text-sm">
                          <div className="flex justify-between items-center">
                            <span>{agent.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs text-gray-500">{agent.code}</span>
                              <Badge 
                                className={
                                  agent.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {agent.status}
                              </Badge>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAssignAgents} className="bg-red-600 hover:bg-red-700">
                    Assign Agents ({selectedAgents.length})
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
