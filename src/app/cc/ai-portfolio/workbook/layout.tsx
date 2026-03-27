'use client'

import { AuthProvider } from '@/lib/auth-context'

export default function WorkbookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-gray-900">
        {children}
      </div>
    </AuthProvider>
  )
}
