'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getAuthProfile } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string, userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Protect Routes Map
  const PROTECTED_ROUTES = ['/dashboard', '/reservar/confirmar']

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('token')
      
      if (!token) {
        handleUnauthorized()
        return
      }

      try {
        // Hydrate from profile API if token exists
        const profile = await getAuthProfile()
        setUser({
          id: profile.id || profile.userId,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: profile.role,
        })
      } catch (error) {
        // If token is invalid or expired
        console.error('Session expired', error)
        localStorage.removeItem('token')
        setUser(null)
        handleUnauthorized()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo se ejecuta al montar initialmente

  const handleUnauthorized = () => {
    setIsLoading(false)
    if (PROTECTED_ROUTES.includes(pathname)) {
      router.push('/login')
    }
  }

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token)
    setUser(userData)
    // Optional: could push to dashboard here, but caller typically handles routing
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
