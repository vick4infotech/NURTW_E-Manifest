'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft,
  ArrowRight,
  Car,
  Users,
  QrCode,
  MapPin,
  User,
  Phone,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  LogOut,
  Download
} from 'lucide-react'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface VehicleData {
  origin: string
  destination: string
  plateNumber: string
  driverName: string
  driverPhone: string
  capacity: number
}

interface PassengerData {
  id: string
  name: string
  nextOfKin: string
  nextOfKinPhone: string
  seatNumber: number
}

// Phone number validation function
const validatePhoneNumber = (phone: string): boolean => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  // Check if it's exactly 11 digits
  return cleanPhone.length === 11
}

// Format phone number for display
const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.slice(0, 11)
}

export default function AgentDashboard() {
  const router = useRouter()
  const manifestRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [agentCode] = useState('1001') // Mock agent code - get from authentication
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    origin: '',
    destination: '',
    plateNumber: '',
    driverName: '',
    driverPhone: '',
    capacity: 14
  })
  
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [manifestCode, setManifestCode] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Generate manifest code when vehicle data is complete
  useEffect(() => {
    if (vehicleData.origin && vehicleData.destination && agentCode) {
      const timestamp = Date.now().toString().slice(-6)
      const code = `NURTW-${vehicleData.origin.slice(0,3).toUpperCase()}-${vehicleData.destination.slice(0,3).toUpperCase()}-${agentCode}-${timestamp}`
      setManifestCode(code)
    }
  }, [vehicleData.origin, vehicleData.destination, agentCode])

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    
    if (!vehicleData.origin.trim()) newErrors.origin = 'Origin is required'
    if (!vehicleData.destination.trim()) newErrors.destination = 'Destination is required'
    if (!vehicleData.plateNumber.trim()) newErrors.plateNumber = 'Plate number is required'
    if (!vehicleData.driverName.trim()) newErrors.driverName = 'Driver name is required'
    if (!vehicleData.driverPhone.trim()) newErrors.driverPhone = 'Driver phone is required'
    if (vehicleData.capacity < 4 || vehicleData.capacity > 20) newErrors.capacity = 'Capacity must be between 4 and 20'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    setCurrentStep(2)
  }

  const addPassenger = () => {
    if (passengers.length >= vehicleData.capacity) {
      setErrors({ passenger: 'Vehicle capacity reached' })
      return
    }
    
    const newPassenger: PassengerData = {
      id: Date.now().toString(),
      name: '',
      nextOfKin: '',
      nextOfKinPhone: '',
      seatNumber: passengers.length + 1
    }
    setPassengers([...passengers, newPassenger])
    setErrors({})
  }

  const updatePassenger = (id: string, field: keyof PassengerData, value: string | number) => {
    setPassengers(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const removePassenger = (id: string) => {
    setPassengers(prev => {
      const updated = prev.filter(p => p.id !== id)
      // Reassign seat numbers
      return updated.map((p, index) => ({ ...p, seatNumber: index + 1 }))
    })
  }

  const finalizeManifest = async () => {
    // Validate all passengers have required data
    const incompletePassengers = passengers.filter(p => 
      !p.name.trim() || !p.nextOfKin.trim() || !p.nextOfKinPhone.trim()
    )
    
    if (incompletePassengers.length > 0) {
      setErrors({ passenger: 'All passengers must have complete information' })
      return
    }
    
    // Validate phone numbers
    const invalidPhones = passengers.filter(p => !validatePhoneNumber(p.nextOfKinPhone))
    if (invalidPhones.length > 0) {
      setErrors({ passenger: 'All next of kin phone numbers must be exactly 11 digits' })
      return
    }
    
    // Generate QR code with manifest data
    const qrData = JSON.stringify({
      manifestCode,
      agentCode,
      vehicle: vehicleData,
      passengers: passengers.map(p => ({
        name: p.name,
        nextOfKin: p.nextOfKin,
        nextOfKinPhone: p.nextOfKinPhone,
        seatNumber: p.seatNumber
      })),
      timestamp: new Date().toISOString(),
      totalPassengers: passengers.length
    })
    
    setQrCode(qrData)
    setCurrentStep(3)
  }

  const generatePDF = async () => {
    if (!manifestRef.current) return
    
    try {
      const canvas = await html2canvas(manifestRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      pdf.save(`NURTW-Manifest-${manifestCode}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      setErrors({ pdf: 'Failed to generate PDF. Please try again.' })
    }
  }

  const resetManifest = () => {
    setCurrentStep(1)
    setVehicleData({
      origin: '',
      destination: '',
      plateNumber: '',
      driverName: '',
      driverPhone: '',
      capacity: 14
    })
    setPassengers([])
    setManifestCode('')
    setQrCode('')
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/agent" className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Agent Dashboard</h1>
                <p className="text-sm text-gray-600">Agent Code: {agentCode}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/agent')}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { step: 1, label: 'Vehicle Setup', icon: Car },
              { step: 2, label: 'Passengers', icon: Users },
              { step: 3, label: 'Generate QR', icon: QrCode }
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep === step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : currentStep > step
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {label}
                </span>
                {step < 3 && <ArrowRight className="h-4 w-4 mx-4 text-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Vehicle Setup */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-6 w-6 mr-2 text-blue-600" />
                Step 1: Vehicle & Journey Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVehicleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Origin *</label>
                    <Input
                      value={vehicleData.origin}
                      onChange={(e) => setVehicleData(prev => ({ ...prev, origin: e.target.value }))}
                      placeholder="e.g., Lagos"
                      className={errors.origin ? 'border-red-500' : ''}
                    />
                    {errors.origin && <p className="text-red-500 text-sm mt-1">{errors.origin}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Destination *</label>
                    <Input
                      value={vehicleData.destination}
                      onChange={(e) => setVehicleData(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="e.g., Abuja"
                      className={errors.destination ? 'border-red-500' : ''}
                    />
                    {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Vehicle Plate Number *</label>
                    <Input
                      value={vehicleData.plateNumber}
                      onChange={(e) => setVehicleData(prev => ({ ...prev, plateNumber: e.target.value.toUpperCase() }))}
                      placeholder="e.g., ABC-123-XYZ"
                      className={errors.plateNumber ? 'border-red-500' : ''}
                    />
                    {errors.plateNumber && <p className="text-red-500 text-sm mt-1">{errors.plateNumber}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Vehicle Capacity *</label>
                    <Input
                      type="number"
                      min="4"
                      max="20"
                      value={vehicleData.capacity}
                      onChange={(e) => setVehicleData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 14 }))}
                      className={errors.capacity ? 'border-red-500' : ''}
                    />
                    {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Driver Name *</label>
                    <Input
                      value={vehicleData.driverName}
                      onChange={(e) => setVehicleData(prev => ({ ...prev, driverName: e.target.value }))}
                      placeholder="Driver's full name"
                      className={errors.driverName ? 'border-red-500' : ''}
                    />
                    {errors.driverName && <p className="text-red-500 text-sm mt-1">{errors.driverName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Driver Phone *</label>
                    <Input
                      type="tel"
                      value={vehicleData.driverPhone}
                      onChange={(e) => setVehicleData(prev => ({ ...prev, driverPhone: e.target.value }))}
                      placeholder="Driver's phone number"
                      className={errors.driverPhone ? 'border-red-500' : ''}
                    />
                    {errors.driverPhone && <p className="text-red-500 text-sm mt-1">{errors.driverPhone}</p>}
                  </div>
                </div>
                
                {manifestCode && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Generated Manifest Code:</p>
                    <p className="font-mono text-blue-900">{manifestCode}</p>
                  </div>
                )}
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue to Passenger Management
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Passenger Management */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Users className="h-6 w-6 mr-2 text-blue-600" />
                    Step 2: Passenger Management
                  </CardTitle>
                  <div className="text-sm text-gray-600">
                    {passengers.length} / {vehicleData.capacity} passengers
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Journey Summary */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Journey Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Route:</strong> {vehicleData.origin} → {vehicleData.destination}</p>
                    <p><strong>Vehicle:</strong> {vehicleData.plateNumber}</p>
                    <p><strong>Driver:</strong> {vehicleData.driverName}</p>
                    <p><strong>Code:</strong> {manifestCode}</p>
                  </div>
                </div>

                {/* Add Passenger Button */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Passenger List</h3>
                  <Button 
                    onClick={addPassenger} 
                    disabled={passengers.length >= vehicleData.capacity}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Passenger
                  </Button>
                </div>

                {errors.passenger && (
                  <Alert className="mb-4">
                    <AlertDescription>{errors.passenger}</AlertDescription>
                  </Alert>
                )}

                {/* Passenger List */}
                {passengers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No passengers added yet</p>
                    <p className="text-sm">Click "Add Passenger" to start building your manifest</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {passengers.map((passenger) => (
                      <Card key={passenger.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <Badge className="bg-blue-100 text-blue-800">
                                Seat #{passenger.seatNumber}
                              </Badge>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removePassenger(passenger.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Passenger Name *</label>
                              <Input
                                value={passenger.name}
                                onChange={(e) => updatePassenger(passenger.id, 'name', e.target.value)}
                                placeholder="Full name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Next of Kin *</label>
                              <Input
                                value={passenger.nextOfKin}
                                onChange={(e) => updatePassenger(passenger.id, 'nextOfKin', e.target.value)}
                                placeholder="Emergency contact name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Next of Kin Phone * (11 digits)</label>
                              <Input
                                value={passenger.nextOfKinPhone}
                                onChange={(e) => {
                                  const formatted = formatPhoneNumber(e.target.value)
                                  updatePassenger(passenger.id, 'nextOfKinPhone', formatted)
                                }}
                                placeholder="08012345678"
                                maxLength={11}
                                className={`${!validatePhoneNumber(passenger.nextOfKinPhone) && passenger.nextOfKinPhone.length > 0 ? 'border-red-500' : ''}`}
                              />
                              {passenger.nextOfKinPhone.length > 0 && !validatePhoneNumber(passenger.nextOfKinPhone) && (
                                <p className="text-red-500 text-xs mt-1">Must be exactly 11 digits</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back to Vehicle Setup
                  </Button>
                  <Button 
                    onClick={finalizeManifest} 
                    disabled={passengers.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Generate QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: QR Code Generation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                  Step 3: Manifest Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-green-600 mb-2">
                    Manifest Created Successfully!
                  </h2>
                  <p className="text-gray-600">
                    Your manifest has been finalized and is ready for use.
                  </p>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                  <Button variant="outline" onClick={resetManifest}>
                    Create New Manifest
                  </Button>
                  <Button 
                    onClick={generatePDF}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>

                {errors.pdf && (
                  <Alert className="mb-4">
                    <AlertDescription>{errors.pdf}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Printable Manifest */}
            <Card>
              <CardContent>
                <div ref={manifestRef} className="p-8 bg-white">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">NURTW Digital Platform</h1>
                    <h2 className="text-xl font-semibold text-gray-700">Passenger Manifest</h2>
                    <div className="mt-4 text-sm text-gray-600">
                      Generated on: {new Date().toLocaleString()}
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-white p-4 border-2 border-gray-300 rounded-lg">
                      <QRCode
                        size={200}
                        value={qrCode}
                        viewBox={`0 0 256 256`}
                      />
                      <p className="text-center text-sm text-gray-600 mt-2">Scan for manifest details</p>
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Manifest Code:</strong> {manifestCode}</p>
                        <p><strong>Origin:</strong> {vehicleData.origin}</p>
                        <p><strong>Destination:</strong> {vehicleData.destination}</p>
                        <p><strong>Agent Code:</strong> {agentCode}</p>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Plate Number:</strong> {vehicleData.plateNumber}</p>
                        <p><strong>Driver:</strong> {vehicleData.driverName}</p>
                        <p><strong>Driver Phone:</strong> {vehicleData.driverPhone}</p>
                        <p><strong>Capacity:</strong> {vehicleData.capacity} passengers</p>
                        <p><strong>Occupied:</strong> {passengers.length} seats</p>
                      </div>
                    </div>
                  </div>

                  {/* Passenger List */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Passenger Manifest</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Seat</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Passenger Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Next of Kin</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Emergency Phone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {passengers.map((passenger) => (
                            <tr key={passenger.id}>
                              <td className="border border-gray-300 px-4 py-2">#{passenger.seatNumber}</td>
                              <td className="border border-gray-300 px-4 py-2">{passenger.name}</td>
                              <td className="border border-gray-300 px-4 py-2">{passenger.nextOfKin}</td>
                              <td className="border border-gray-300 px-4 py-2">{passenger.nextOfKinPhone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t pt-6 mt-8">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div>
                        <p><strong>Status:</strong> <Badge className="bg-green-100 text-green-800">Active</Badge></p>
                        <p><strong>Total Passengers:</strong> {passengers.length}</p>
                      </div>
                      <div className="text-right">
                        <p>National Union of Road Transport Workers</p>
                        <p>Digital Safety Platform</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
