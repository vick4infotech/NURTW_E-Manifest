'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layouts/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, UserCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AgentPage() {
  const [agentCode, setAgentCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agentCode.trim() || agentCode.length !== 4) {
      setError('Please enter a valid 4-digit agent code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Implement agent code validation API
      // For now, just simulate the login process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // TODO: Replace with actual agent authentication
      console.log('Agent login attempt:', agentCode)
      
      // For demo purposes, allow any 4-digit code to proceed
      router.push('/agent/dashboard')
    } catch (err) {
      setError('Failed to authenticate agent code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout title="Agent Login">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          {/* Back to Home Link */}
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          {/* Login Card */}
          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-800">Agent Login</CardTitle>
              <p className="text-gray-600">Enter your 4-digit agent code to continue</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="agentCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Code
                  </label>
                  <Input
                    id="agentCode"
                    type="text"
                    placeholder="0000"
                    value={agentCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setAgentCode(value)
                    }}
                    className={`text-center text-2xl tracking-widest ${error ? 'border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
                    maxLength={4}
                    autoComplete="off"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>

                {error && error.includes('not yet implemented') && (
                  <Alert>
                    <AlertDescription>
                      The agent authentication system is currently under development. 
                      This feature will be available in the next update.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading || agentCode.length !== 4}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Feature Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Agent Dashboard Features</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Set up vehicle details and routes</li>
                <li>• Manage passenger manifest tables</li>
                <li>• Generate QR codes for manifests</li>
                <li>• View current journey statistics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
