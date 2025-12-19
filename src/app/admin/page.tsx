'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import MainLayout from '@/components/layouts/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials. Please check your email and password.')
      } else if (result?.ok) {
        // Successful login - redirect immediately
        router.push('/admin/dashboard')
        router.refresh() // Force refresh to update session
      } else {
        setError('An unexpected error occurred during login.')
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout title="Admin Login">
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          {/* Back to Home Link */}
          <Link 
            href="/" 
            className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          {/* Login Card */}
          <Card className="shadow-lg border-2 border-red-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-800">Admin Login</CardTitle>
              <p className="text-gray-600">Secure access for system administrators</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@nurtw.gov.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={error ? 'border-red-500' : 'border-red-300 focus:border-red-500'}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pr-10 ${error ? 'border-red-500' : 'border-red-300 focus:border-red-500'}`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert>
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading || !email.trim() || !password.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Default Credentials Info */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-red-800 mb-2">Default Credentials</h3>
              <div className="text-sm text-red-700 space-y-1">
                <p><strong>Email:</strong> admin@nurtw.gov.ng</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
              <p className="text-xs text-red-600 mt-2">
                Please change these credentials after first login
              </p>
            </CardContent>
          </Card>

          {/* Feature Info */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-red-800 mb-2">Admin Dashboard Features</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• System overview and analytics</li>
                <li>• Agent management and park assignments</li>
                <li>• Manifest search and export</li>
                <li>• Compliance and safety reports</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
