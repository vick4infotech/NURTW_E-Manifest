'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layouts/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Settings, 
  Save,
  Shield,
  Bell,
  Database,
  Mail,
  Smartphone,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface SystemSettings {
  // General Settings
  systemName: string
  systemEmail: string
  supportPhone: string
  timeZone: string
  language: string
  
  // Security Settings
  sessionTimeout: number
  passwordMinLength: number
  requireTwoFactor: boolean
  maxLoginAttempts: number
  
  // Notification Settings
  emailNotifications: boolean
  smsNotifications: boolean
  manifestNotifications: boolean
  complianceNotifications: boolean
  emergencyNotifications: boolean
  
  // Manifest Settings
  maxSeatingCapacity: number
  minSeatingCapacity: number
  manifestCodeFormat: string
  requireNextOfKin: boolean
  requireDriverPhone: boolean
  
  // Compliance Settings
  vehicleInspectionInterval: number
  driverLicenseRenewal: number
  medicalCertificateRenewal: number
  insuranceRenewal: number
}

const timeZones = [
  'Africa/Lagos',
  'Africa/Abuja',
  'UTC',
  'GMT'
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ha', label: 'Hausa' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'ig', label: 'Igbo' }
]

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<SystemSettings>({
    // General Settings
    systemName: 'Nigeria E-Manifest System',
    systemEmail: 'admin@nurtw.gov.ng',
    supportPhone: '+234 1 234 5678',
    timeZone: 'Africa/Lagos',
    language: 'en',
    
    // Security Settings
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireTwoFactor: false,
    maxLoginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    manifestNotifications: true,
    complianceNotifications: true,
    emergencyNotifications: true,
    
    // Manifest Settings
    maxSeatingCapacity: 20,
    minSeatingCapacity: 4,
    manifestCodeFormat: 'NURTW-{ORIGIN}-{DESTINATION}-{PARK}-{DATE}-{TIME}-{SEQ}',
    requireNextOfKin: true,
    requireDriverPhone: true,
    
    // Compliance Settings
    vehicleInspectionInterval: 90,
    driverLicenseRenewal: 365,
    medicalCertificateRenewal: 180,
    insuranceRenewal: 365
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin')
    }
  }, [session, status, router])

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, load settings from API
      // const savedSettings = await api.getSystemSettings()
      // setSettings(savedSettings)
      
      setIsLoading(false)
    }
    
    if (session) {
      loadSettings()
    }
  }, [session])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, save settings to API
      // await api.updateSystemSettings(settings)
      
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        systemName: 'Nigeria E-Manifest System',
        systemEmail: 'admin@nurtw.gov.ng',
        supportPhone: '+234 1 234 5678',
        timeZone: 'Africa/Lagos',
        language: 'en',
        sessionTimeout: 30,
        passwordMinLength: 8,
        requireTwoFactor: false,
        maxLoginAttempts: 5,
        emailNotifications: true,
        smsNotifications: true,
        manifestNotifications: true,
        complianceNotifications: true,
        emergencyNotifications: true,
        maxSeatingCapacity: 20,
        minSeatingCapacity: 4,
        manifestCodeFormat: 'NURTW-{ORIGIN}-{DESTINATION}-{PARK}-{DATE}-{TIME}-{SEQ}',
        requireNextOfKin: true,
        requireDriverPhone: true,
        vehicleInspectionInterval: 90,
        driverLicenseRenewal: 365,
        medicalCertificateRenewal: 180,
        insuranceRenewal: 365
      })
      toast.success('Settings reset to defaults')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">Configure system preferences and options</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetToDefaults}>
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-red-600 hover:bg-red-700">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'general', label: 'General', icon: Settings },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'manifests', label: 'Manifests', icon: Database },
              { id: 'compliance', label: 'Compliance', icon: CheckCircle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-white text-red-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">System Name</Label>
                      <Input
                        id="systemName"
                        value={settings.systemName}
                        onChange={(e) => handleSettingChange('systemName', e.target.value)}
                        placeholder="System display name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="systemEmail">System Email</Label>
                      <Input
                        id="systemEmail"
                        type="email"
                        value={settings.systemEmail}
                        onChange={(e) => handleSettingChange('systemEmail', e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supportPhone">Support Phone</Label>
                      <Input
                        id="supportPhone"
                        value={settings.supportPhone}
                        onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeZone">Time Zone</Label>
                      <Select value={settings.timeZone} onValueChange={(value) => handleSettingChange('timeZone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeZones.map(tz => (
                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min="5"
                        max="480"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500">Automatic logout after inactivity</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        min="6"
                        max="32"
                        value={settings.passwordMinLength}
                        onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        min="3"
                        max="10"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500">Account locked after failed attempts</p>
                    </div>
                    <div className="flex items-center space-x-3 pt-7">
                      <Switch
                        id="requireTwoFactor"
                        checked={settings.requireTwoFactor}
                        onCheckedChange={(checked) => handleSettingChange('requireTwoFactor', checked)}
                      />
                      <Label htmlFor="requireTwoFactor">Require Two-Factor Authentication</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Switch
                        id="smsNotifications"
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                      />
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                        <Label htmlFor="smsNotifications">Enable SMS Notifications</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Notification Types</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Switch
                          id="manifestNotifications"
                          checked={settings.manifestNotifications}
                          onCheckedChange={(checked) => handleSettingChange('manifestNotifications', checked)}
                        />
                        <Label htmlFor="manifestNotifications">Manifest creation and updates</Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Switch
                          id="complianceNotifications"
                          checked={settings.complianceNotifications}
                          onCheckedChange={(checked) => handleSettingChange('complianceNotifications', checked)}
                        />
                        <Label htmlFor="complianceNotifications">Compliance issues and violations</Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Switch
                          id="emergencyNotifications"
                          checked={settings.emergencyNotifications}
                          onCheckedChange={(checked) => handleSettingChange('emergencyNotifications', checked)}
                        />
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                          <Label htmlFor="emergencyNotifications">Emergency alerts and incidents</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Manifest Settings */}
          {activeTab === 'manifests' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Manifest Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minSeatingCapacity">Minimum Seating Capacity</Label>
                      <Input
                        id="minSeatingCapacity"
                        type="number"
                        min="1"
                        max="50"
                        value={settings.minSeatingCapacity}
                        onChange={(e) => handleSettingChange('minSeatingCapacity', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxSeatingCapacity">Maximum Seating Capacity</Label>
                      <Input
                        id="maxSeatingCapacity"
                        type="number"
                        min="1"
                        max="100"
                        value={settings.maxSeatingCapacity}
                        onChange={(e) => handleSettingChange('maxSeatingCapacity', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manifestCodeFormat">Manifest Code Format</Label>
                    <Input
                      id="manifestCodeFormat"
                      value={settings.manifestCodeFormat}
                      onChange={(e) => handleSettingChange('manifestCodeFormat', e.target.value)}
                      placeholder="NURTW-{ORIGIN}-{DESTINATION}-{PARK}-{DATE}-{TIME}-{SEQ}"
                    />
                    <p className="text-xs text-gray-500">
                      Available variables: {'{ORIGIN}'}, {'{DESTINATION}'}, {'{PARK}'}, {'{DATE}'}, {'{TIME}'}, {'{SEQ}'}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Required Information</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Switch
                          id="requireNextOfKin"
                          checked={settings.requireNextOfKin}
                          onCheckedChange={(checked) => handleSettingChange('requireNextOfKin', checked)}
                        />
                        <Label htmlFor="requireNextOfKin">Require next of kin information for passengers</Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Switch
                          id="requireDriverPhone"
                          checked={settings.requireDriverPhone}
                          onCheckedChange={(checked) => handleSettingChange('requireDriverPhone', checked)}
                        />
                        <Label htmlFor="requireDriverPhone">Require driver phone number</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Compliance Settings */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Compliance Intervals (Days)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleInspectionInterval">Vehicle Inspection Interval</Label>
                      <Input
                        id="vehicleInspectionInterval"
                        type="number"
                        min="30"
                        max="365"
                        value={settings.vehicleInspectionInterval}
                        onChange={(e) => handleSettingChange('vehicleInspectionInterval', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500">Days between mandatory vehicle inspections</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driverLicenseRenewal">Driver License Renewal</Label>
                      <Input
                        id="driverLicenseRenewal"
                        type="number"
                        min="365"
                        max="1825"
                        value={settings.driverLicenseRenewal}
                        onChange={(e) => handleSettingChange('driverLicenseRenewal', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500">Days before license expiration warning</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicalCertificateRenewal">Medical Certificate Renewal</Label>
                      <Input
                        id="medicalCertificateRenewal"
                        type="number"
                        min="90"
                        max="365"
                        value={settings.medicalCertificateRenewal}
                        onChange={(e) => handleSettingChange('medicalCertificateRenewal', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500">Days between medical certificate renewals</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceRenewal">Insurance Renewal</Label>
                      <Input
                        id="insuranceRenewal"
                        type="number"
                        min="365"
                        max="730"
                        value={settings.insuranceRenewal}
                        onChange={(e) => handleSettingChange('insuranceRenewal', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500">Days before insurance expiration warning</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Database Connection</span>
                        <span className="text-xs text-green-600">Healthy</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Email Service</span>
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">SMS Service</span>
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Last Backup</span>
                        <span className="text-xs text-gray-600">2 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">System Uptime</span>
                        <span className="text-xs text-gray-600">15 days</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Security Status</span>
                        <span className="text-xs text-green-600">Secure</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
