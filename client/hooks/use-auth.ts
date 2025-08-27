"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authService, type User, type AuthResponse, type RegisterData, type LoginData } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      console.log("[v0] Starting auth check")

      const storedUser = authService.getStoredUser()
      const hasToken = authService.isAuthenticated()

      console.log("[v0] Stored user:", storedUser?.email)
      console.log("[v0] Has token:", hasToken)

      if (storedUser && hasToken) {
        setUser(storedUser)
        setIsAuthenticated(true)
        console.log("[v0] User authenticated from stored data")

        try {
          const currentUser = await authService.getMe()
          if (currentUser) {
            console.log("[v0] Server verification successful")
            setUser(currentUser)
          } else {
            console.log("[v0] Server verification failed, but keeping stored auth state")
            // Don't clear the auth state - the stored user and token are still valid
          }
        } catch (error) {
          console.log("[v0] Server verification error, but keeping stored auth state:", error)
          // Don't clear the auth state on server verification errors
        }
      } else {
        console.log("[v0] User not authenticated, redirecting to home")
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("[v0] Auth check error:", error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
      setLoading(true)
      const response = await authService.login(data)

      if (response.status === "success" && response.data) {
        setUser(response.data.user)
        setIsAuthenticated(true)

        setTimeout(() => {
          checkAuth()
        }, 50)
      }

      return response
    } catch (error) {
      console.error("Login error:", error)
      return {
        status: "error",
        message: "Login failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      setLoading(true)
      const response = await authService.register(data)
      return response
    } catch (error) {
      console.error("Registration error:", error)
      return {
        status: "error",
        message: "Registration failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async (email: string, code: string): Promise<AuthResponse> => {
    try {
      setLoading(true)
      const response = await authService.verifyEmail(email, code)
      return response
    } catch (error) {
      console.error("Email verification error:", error)
      return {
        status: "error",
        message: "Email verification failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
      router.push("/")
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error("Logout error:", error)
      setUser(null)
      setIsAuthenticated(false)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      setLoading(true)
      const response = await authService.forgotPassword(email)
      return response
    } catch (error) {
      console.error("Forgot password error:", error)
      return {
        status: "error",
        message: "Failed to send reset code. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string, code: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true)
      const response = await authService.resetPassword(email, code, password)

      if (response.status === "success" && response.data) {
        setUser(response.data.user)
        setIsAuthenticated(true)

        setTimeout(() => {
          checkAuth()
        }, 50)
      }

      return response
    } catch (error) {
      console.error("Reset password error:", error)
      return {
        status: "error",
        message: "Password reset failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
  }
}
