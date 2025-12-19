'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import MainLayout from '@/components/layouts/main-layout'
import { Users, UserCheck, Shield, Car } from 'lucide-react'

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-16 pb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-green-600">Nigeria</span>{' '}
              <span className="text-black">E-Manifest</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Digital Passenger Safety & Insurance Platform for the National Union of Road Transport Workers
            </p>
            
            {/* Main Action Buttons */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Passenger Button */}
              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-green-500">
                <CardContent className="p-8">
                  <Link href="/passenger" className="block">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Passenger
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Register for your journey and ensure your safety
                      </p>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Register Now
                      </Button>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Agent Button */}
              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-500">
                <CardContent className="p-8">
                  <Link href="/agent" className="block">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <UserCheck className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Agent
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Manage vehicle manifests and passenger details
                      </p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Agent Login
                      </Button>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Admin Button */}
              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-red-500">
                <CardContent className="p-8">
                  <Link href="/admin" className="block">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                        <Shield className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Admin
                      </h3>
                      <p className="text-gray-600 mb-4">
                        System administration and oversight
                      </p>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Admin Login
                      </Button>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ensuring Safe and Secure Travel
              </h2>
              <p className="text-lg text-gray-600">
                Advanced digital platform for passenger safety and transport management
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Passenger Safety
                </h3>
                <p className="text-gray-600">
                  Digital manifest system ensures all passengers are accounted for and emergency contacts are available
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Vehicle Tracking
                </h3>
                <p className="text-gray-600">
                  Real-time tracking of vehicle manifests with QR code verification for enhanced security
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Agent Management
                </h3>
                <p className="text-gray-600">
                  Comprehensive tools for transport agents to manage passengers and vehicle operations efficiently
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
