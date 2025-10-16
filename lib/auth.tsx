"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string
  bio?: string
  createdAt: string
  drumsticks?: number
}

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
  updateUser: (updatedUser: User) => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("auth-storage")
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        if (parsed.state?.user) {
          setUser(parsed.state.user)
        }
      } catch (error) {
        console.error("Failed to parse saved user:", error)
      }
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth-storage", JSON.stringify({ state: { user } }))
    } else {
      localStorage.removeItem("auth-storage")
    }
  }, [user])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email,
        username: email.split("@")[0],
        avatarUrl: "/user-walker.jpg",
        bio: "技术爱好者",
        createdAt: new Date().toISOString(),
        drumsticks: 90,
      }

      setUser(mockUser)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      throw new Error("登录失败")
    }
  }

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock registration - replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: Date.now().toString(),
        email,
        username,
        avatarUrl: "/user-yuzu.jpg",
        bio: "新用户",
        createdAt: new Date().toISOString(),
        drumsticks: 90,
      }

      setUser(mockUser)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      throw new Error("注册失败")
    }
  }

  const logout = () => {
    setUser(null)
  }

  const checkAuth = () => {
    // Mock auth check - in real app this would verify session
    if (user) {
      setUser(user)
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const useAuthStore = useAuth
