'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layouts/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Car, Users } from 'lucide-react'

interface ManifestData {
  manifest: {
    id: string
    origin: string
    destination: string
    driverName: string
    capacity: number
    currentPassengers: number
    nextSeatNumber: number
  }
}

interface PassengerData {
  name: string
  nextOfKin: string
  nextOfKinPhone: string
}

export default function PassengerPage() {
  const [step, setStep] = useState<'plate' | 'details' | 'confirmation'>('plate')
  const [plateNumber, setPlateNumber] = useState('')
  const [manifestData, setManifestData] = useState<ManifestData | null>(null)
  const [passengerData, setPassengerData] = useState<PassengerData>({
    name: '',
    nextOfKin: '',
    nextOfKinPhone: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  // Validate plate number
  const validatePlateMutation = useMutation({
    mutationFn: async (plateNumber: string) => {
      const response = await fetch('/api/manifests/validate-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plateNumber })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to validate plate number')
      }
      
      return response.json()
    },
    onSuccess: (data: ManifestData) => {
      setManifestData(data)
      setStep('details')
      setErrors({})
    },
    onError: (error: Error) => {
      setErrors({ plate: error.message })
    }
  })

  // Register passenger
  const registerPassengerMutation = useMutation({
    mutationFn: async (data: PassengerData & { manifestId: string }) => {
      const response = await fetch('/api/passengers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to register passenger')
      }
      
      return response.json()
    },
    onSuccess: () => {
      setStep('confirmation')
      setErrors({})
    },
    onError: (error: Error) => {
      setErrors({ submit: error.message })
    }
  })

  const handlePlateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!plateNumber.trim()) {
      setErrors({ plate: 'Please enter a vehicle plate number' })
      return
    }
    validatePlateMutation.mutate(plateNumber)
  }

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!passengerData.name.trim()) newErrors.name = 'Name is required'
    if (!passengerData.nextOfKin.trim()) newErrors.nextOfKin = 'Next of kin name is required'
    if (!passengerData.nextOfKinPhone.trim()) newErrors.nextOfKinPhone = 'Next of kin phone is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    if (manifestData) {
      registerPassengerMutation.mutate({
        ...passengerData,
        manifestId: manifestData.manifest.id
      })
    }
  }

  const handleStartOver = () => {
    setStep('plate')
    setPlateNumber('')
    setManifestData(null)
    setPassengerData({ name: '', nextOfKin: '', nextOfKinPhone: '' })
    setErrors({})
  }

  return (
    <MainLayout title="Passenger Registration">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {step === 'plate' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-6 w-6 text-green-600" />
                Enter Vehicle Plate Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlateSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="e.g., ABC-123-XYZ"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className={errors.plate ? 'border-red-500' : ''}
                  />
                  {errors.plate && (
                    <p className="text-red-500 text-sm mt-1">{errors.plate}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={validatePlateMutation.isPending}
                >
                  {validatePlateMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validating...</>
                  ) : (
                    'Find Vehicle'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'details' && manifestData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-green-600" />
                Passenger Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Info */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Journey Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">From:</span>
                    <p className="font-medium">{manifestData.manifest.origin}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">To:</span>
                    <p className="font-medium">{manifestData.manifest.destination}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Driver:</span>
                    <p className="font-medium">{manifestData.manifest.driverName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Seat:</span>
                    <p className="font-medium">#{manifestData.manifest.nextSeatNumber}</p>
                  </div>
                </div>
              </div>

              {/* Passenger Form */}
              <form onSubmit={handlePassengerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <Input
                    type="text"
                    value={passengerData.name}
                    onChange={(e) => setPassengerData(prev => ({ ...prev, name: e.target.value }))}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Next of Kin Name *</label>
                  <Input
                    type="text"
                    value={passengerData.nextOfKin}
                    onChange={(e) => setPassengerData(prev => ({ ...prev, nextOfKin: e.target.value }))}
                    className={errors.nextOfKin ? 'border-red-500' : ''}
                  />
                  {errors.nextOfKin && (
                    <p className="text-red-500 text-sm mt-1">{errors.nextOfKin}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Next of Kin Phone *</label>
                  <Input
                    type="tel"
                    value={passengerData.nextOfKinPhone}
                    onChange={(e) => setPassengerData(prev => ({ ...prev, nextOfKinPhone: e.target.value }))}
                    className={errors.nextOfKinPhone ? 'border-red-500' : ''}
                  />
                  {errors.nextOfKinPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.nextOfKinPhone}</p>
                  )}
                </div>

                {errors.submit && (
                  <Alert>
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleStartOver}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={registerPassengerMutation.isPending}
                  >
                    {registerPassengerMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                    ) : (
                      'Register'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'confirmation' && manifestData && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your details have been added to the manifest. Safe travels!
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold mb-2">Journey Summary</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">From:</span> {manifestData.manifest.origin}</p>
                  <p><span className="font-medium">To:</span> {manifestData.manifest.destination}</p>
                  <p><span className="font-medium">Vehicle:</span> {plateNumber}</p>
                  <p><span className="font-medium">Seat:</span> #{manifestData.manifest.nextSeatNumber}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleStartOver} variant="outline" className="flex-1">
                  Register Another
                </Button>
                <Button onClick={() => router.push('/')} className="flex-1">
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
