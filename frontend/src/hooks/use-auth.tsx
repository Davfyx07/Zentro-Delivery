"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  email: string
  name: string
  role?: "customer" | "owner" | "admin"
  phone?: string
  address?: string
  profileImage?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => boolean
  signup: (email: string, password: string, name: string) => boolean
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  updateProfileImage: (imageUrl: string) => void
  setUser: (user: User) => void
}

// Simulated users database (persisted in localStorage)
const getStoredUsers = (): { [key: string]: { password: string; user: User } } => {
  if (typeof window === "undefined") return {}
  const stored = localStorage.getItem("zentro_users")
  return stored ? JSON.parse(stored) : {}
}

const saveStoredUsers = (users: { [key: string]: { password: string; user: User } }) => {
  localStorage.setItem("zentro_users", JSON.stringify(users))
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      login: (email: string, password: string) => {
        const users = getStoredUsers()
        const userData = users[email]

        if (!userData || userData.password !== password) {
          return false
        }

        set({ user: userData.user })
        return true
      },
      signup: (email: string, password: string, name: string) => {
        const users = getStoredUsers()

        if (users[email]) {
          return false // User already exists
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          role: "customer",
          createdAt: new Date().toISOString(),
        }

        users[email] = { password, user: newUser }
        saveStoredUsers(users)
        set({ user: newUser })
        return true
      },
      logout: () => {
        set({ user: null })
      },
      updateProfile: (data: Partial<User>) => {
        set((state) => {
          if (!state.user) return state
          const updatedUser = { ...state.user, ...data }

          // Update in storage
          const users = getStoredUsers()
          if (users[state.user.email]) {
            users[state.user.email].user = updatedUser
            saveStoredUsers(users)
          }

          return { user: updatedUser }
        })
      },
      updateProfileImage: (imageUrl: string) => {
        set((state) => {
          if (!state.user) return state
          const updatedUser = { ...state.user, profileImage: imageUrl }

          // Update in storage
          const users = getStoredUsers()
          if (users[state.user.email]) {
            users[state.user.email].user = updatedUser
            saveStoredUsers(users)
          }

          return { user: updatedUser }
        })
      },
      setUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: "zentro_auth",
    },
  ),
)
