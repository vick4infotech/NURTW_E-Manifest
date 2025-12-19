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
  Users, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw
} from 'lucide-react'

interface Agent {
  id: string
  code: string
  name: string
  email: string
  phone: string
  parkId: string
  parkName: string
  status: 'active' | 'suspended'
  lastActive: string
  createdAt: string
}

interface Park {
  id: string
  name: string
  code: string
}

export default function AgentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [parks, setParks] = useState<Park[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    parkId: ''
  })

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
      
      // Mock parks data
      const mockParks: Park[] = [
        { id: '1', name: 'Ikeja Motor Park', code: 'IMP001' },
        { id: '2', name: 'Berger Motor Park', code: 'BMP002' },
        { id: '3', name: 'Mile 2 Motor Park', code: 'MMP003' },
        { id: '4', name: 'Ojodu Motor Park', code: 'OMP004' }
      ]
      
      // Mock agents data
      const mockAgents: Agent[] = [
        {
          id: '1',
          code: '1001',
          name: 'John Adebayo',
          email: 'john.adebayo@nurtw.ng',
          phone: '+234 901 234 5678',
          parkId: '1',
          parkName: 'Ikeja Motor Park',
          status: 'active',
          lastActive: '2 hours ago',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          code: '1002',
          name: 'Sarah Okafor',
          email: 'sarah.okafor@nurtw.ng',
          phone: '+234 802 345 6789',
          parkId: '2',
          parkName: 'Berger Motor Park',
          status: 'active',
          lastActive: '1 hour ago',
          createdAt: '2024-01-20'
        },
        {
          id: '3',
          code: '1003',
          name: 'Michael Uche',
          email: 'michael.uche@nurtw.ng',
          phone: '+234 703 456 7890',
          parkId: '3',
          parkName: 'Mile 2 Motor Park',
          status: 'suspended',
          lastActive: '2 days ago',
          createdAt: '2024-02-01'
        },
        {
          id: '4',
          code: '1004',
          name: 'Fatima Ibrahim',
          email: 'fatima.ibrahim@nurtw.ng',
          phone: '+234 904 567 8901',
          parkId: '1',
          parkName: 'Ikeja Motor Park',
          status: 'active',
          lastActive: '30 minutes ago',
          createdAt: '2024-02-10'
        }
      ]
      
      setParks(mockParks)
      setAgents(mockAgents)
      setIsLoading(false)
    }
    
    if (session) {
      loadData()
    }
  }, [session])

  // Filter agents based on search and status
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.code.includes(searchTerm) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.parkName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const generateAgentCode = () => {
    // Generate next available 4-digit code
    const existingCodes = agents.map(agent => parseInt(agent.code))
    const maxCode = Math.max(...existingCodes, 1000)
    return (maxCode + 1).toString()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      parkId: ''
    })
    setEditingAgent(null)
  }

  const handleAddAgent = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.parkId) {
      toast.error('Please fill in all fields')
      return
    }

    const selectedPark = parks.find(p => p.id === formData.parkId)
    const newAgent: Agent = {
      id: Date.now().toString(),
      code: generateAgentCode(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      parkId: formData.parkId,
      parkName: selectedPark?.name || '',
      status: 'active',
      lastActive: 'Just now',
      createdAt: new Date().toISOString().split('T')[0]
    }

    setAgents(prev => [...prev, newAgent])
    setShowAddDialog(false)
    resetForm()
    toast.success('Agent added successfully')
  }

  const handleEditAgent = () => {
    if (!editingAgent || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.parkId) {
      toast.error('Please fill in all fields')
      return
    }

    const selectedPark = parks.find(p => p.id === formData.parkId)
    const updatedAgent: Agent = {
      ...editingAgent,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      parkId: formData.parkId,
      parkName: selectedPark?.name || ''
    }

    setAgents(prev => prev.map(agent => agent.id === editingAgent.id ? updatedAgent : agent))
    setEditingAgent(null)
    resetForm()
    toast.success('Agent updated successfully')
  }

  const handleToggleStatus = (agent: Agent) => {
    const newStatus = agent.status === 'active' ? 'suspended' : 'active'
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: newStatus } : a))
    toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`)
  }

  const handleDeleteAgent = (agent: Agent) => {
    if (confirm(`Are you sure you want to delete agent ${agent.name}?`)) {
      setAgents(prev => prev.filter(a => a.id !== agent.id))
      toast.success('Agent deleted successfully')
    }
  }

  const openEditDialog = (agent: Agent) => {
    setEditingAgent(agent)
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      parkId: agent.parkId
    })
  }

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading agents...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
              <p className="text-gray-600">Manage NURTW agents and their park assignments</p>
            </div>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Agent</DialogTitle>
                  <DialogDescription>
                    Create a new agent account and assign them to a park.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter agent's full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="agent@nurtw.ng"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+234 XXX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="park">Assigned Park</Label>
                    <Select value={formData.parkId} onValueChange={(value) => setFormData(prev => ({ ...prev, parkId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a park" />
                      </SelectTrigger>
                      <SelectContent>
                        {parks.map(park => (
                          <SelectItem key={park.id} value={park.id}>
                            {park.name} ({park.code})
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
                  <Button onClick={handleAddAgent} className="bg-red-600 hover:bg-red-700">
                    Add Agent
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Agents</p>
                    <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Agents</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {agents.filter(a => a.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserX className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Suspended</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {agents.filter(a => a.status === 'suspended').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <RefreshCw className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recently Active</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {agents.filter(a => a.lastActive.includes('hour') || a.lastActive.includes('minute')).length}
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
                      placeholder="Search by name, code, email, or park..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="suspended">Suspended Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Agents ({filteredAgents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium">Code</th>
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Phone</th>
                      <th className="pb-3 font-medium">Park</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Last Active</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAgents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="py-3 font-mono font-medium">{agent.code}</td>
                        <td className="py-3 font-medium">{agent.name}</td>
                        <td className="py-3 text-gray-600">{agent.email}</td>
                        <td className="py-3 text-gray-600">{agent.phone}</td>
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{agent.parkName}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge 
                            className={
                              agent.status === 'active' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : 'bg-red-100 text-red-800 hover:bg-red-100'
                            }
                          >
                            {agent.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-gray-600">{agent.lastActive}</td>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(agent)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(agent)}
                              className={
                                agent.status === 'active' 
                                  ? 'border-red-300 hover:bg-red-50' 
                                  : 'border-green-300 hover:bg-green-50'
                              }
                            >
                              {agent.status === 'active' ? (
                                <UserX className="h-4 w-4 text-red-600" />
                              ) : (
                                <UserCheck className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAgent(agent)}
                              className="border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredAgents.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No agents found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Edit Agent Dialog */}
          {editingAgent && (
            <Dialog open={!!editingAgent} onOpenChange={() => setEditingAgent(null)}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Agent</DialogTitle>
                  <DialogDescription>
                    Update agent information and park assignment.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      placeholder="Enter agent's full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email Address</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      placeholder="agent@nurtw.ng"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      placeholder="+234 XXX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-park">Assigned Park</Label>
                    <Select value={formData.parkId} onValueChange={(value) => setFormData(prev => ({ ...prev, parkId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a park" />
                      </SelectTrigger>
                      <SelectContent>
                        {parks.map(park => (
                          <SelectItem key={park.id} value={park.id}>
                            {park.name} ({park.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Agent Code</Label>
                    <Input
                      value={editingAgent.code}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Agent codes cannot be changed</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingAgent(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditAgent} className="bg-red-600 hover:bg-red-700">
                    Update Agent
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
