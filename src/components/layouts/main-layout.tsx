'use client'

import { ReactNode } from 'react'
import Image from 'next/image'

interface MainLayoutProps {
  children: ReactNode
  showLogo?: boolean
  title?: string
}

export default function MainLayout({ children, showLogo = true, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {showLogo && (
        <header className="w-full bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-green-600">
                  Nigeria E-Manifest
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </div>
                {/* NURTW Logo placeholder - you can replace this with actual logo */}
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NURTW</span>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1">
        {title && (
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-4">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              </div>
            </div>
          </div>
        )}
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-gray-500">
            <p>© 2024 NURTW Digital Platform. All rights reserved.</p>
            <p className="mt-1">Your details are safe and will be kept private.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
