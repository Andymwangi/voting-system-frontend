"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SafeUser, SessionInfo } from "@/lib/types"
import { UserRole } from "@/lib/enums"
import { API_ENDPOINTS } from "@/lib/constants"

interface SessionContextType {
  user: SafeUser | null
  session: SessionInfo | null
  isAuthenticated: boolean
  isLoading: boolean
  isVerified: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  updateUser: (userData: Partial<SafeUser>) => void
  clearSession: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [session, setSession] = useState<SessionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user && !!session
  const isVerified = user?.isVerified ?? false

  const clearSession = useCallback(() => {
    setUser(null)
    setSession(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("sessionData")
  }, [])

  const updateUser = useCallback((userData: Partial<SafeUser>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null)
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) {
        clearSession()
        return
      }

      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        clearSession()
        return
      }

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("authToken", data.data.accessToken)
        localStorage.setItem("refreshToken", data.data.refreshToken)
        localStorage.setItem("sessionData", JSON.stringify(data.data.session))

        setUser(data.data.user)
        setSession(data.data.session)
      } else {
        clearSession()
      }
    } catch (error) {
      console.error("Session refresh failed:", error)
      clearSession()
    }
  }, [clearSession])

  const login = useCallback(async (
    email: string,
    password: string,
    remember: boolean = false
  ): Promise<{ success: boolean; requires2FA?: boolean; error?: string }> => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, remember }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.data.requires2FA) {
          return { success: true, requires2FA: true }
        }

        localStorage.setItem("authToken", data.data.accessToken)
        localStorage.setItem("refreshToken", data.data.refreshToken)
        localStorage.setItem("sessionData", JSON.stringify(data.data.session))

        setUser(data.data.user)
        setSession(data.data.session)

        return { success: true }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      console.error("Login failed:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken")

      if (authToken) {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        })
      }
    } catch (error) {
      console.error("Logout request failed:", error)
    } finally {
      clearSession()
      router.push("/login")
    }
  }, [clearSession, router])

  const initializeSession = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken")
      const sessionData = localStorage.getItem("sessionData")

      if (!authToken || !sessionData) {
        setIsLoading(false)
        return
      }

      const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.data.user)
          setSession(JSON.parse(sessionData))
        } else {
          clearSession()
        }
      } else if (response.status === 401) {
        await refreshSession()
      } else {
        clearSession()
      }
    } catch (error) {
      console.error("Session initialization failed:", error)
      clearSession()
    } finally {
      setIsLoading(false)
    }
  }, [clearSession, refreshSession])

  useEffect(() => {
    initializeSession()
  }, [initializeSession])

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout

    if (isAuthenticated) {
      refreshInterval = setInterval(() => {
        refreshSession()
      }, 15 * 60 * 1000) // Refresh every 15 minutes
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [isAuthenticated, refreshSession])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" && !e.newValue) {
        clearSession()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthenticated) {
        refreshSession()
      }
    }

    const handleBeforeUnload = () => {
      if (session && !localStorage.getItem("refreshToken")) {
        clearSession()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isAuthenticated, session, clearSession, refreshSession])

  const contextValue: SessionContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    isVerified,
    login,
    logout,
    refreshSession,
    updateUser,
    clearSession,
  }

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  )
}

interface SessionGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRoles?: UserRole[]
  fallback?: React.ReactNode
}

export function SessionGuard({
  children,
  requireAuth = true,
  requireRoles = [],
  fallback,
}: SessionGuardProps) {
  const { user, isAuthenticated, isLoading } = useSession()

  if (isLoading) {
    return fallback || <div>Loading...</div>
  }

  if (requireAuth && !isAuthenticated) {
    return fallback || null
  }

  if (requireRoles.length > 0 && (!user || !requireRoles.includes(user.role))) {
    return fallback || null
  }

  return <>{children}</>
}

export default SessionProvider