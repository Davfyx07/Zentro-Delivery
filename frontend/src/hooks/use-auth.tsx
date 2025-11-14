"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "@/lib/api"
import { Console } from "console"

// MODELO DE DIRECCIÓN
export interface Address {
  id: string
  title: string
  address: string
  isDefault: boolean
  icon?: string
}

// MODELO DE USUARIO
export interface User {
  id: string
  email: string
  name: string
  role?: "customer" | "owner" | "admin"
  phone?: string
  addresses?: Address[]
  profileImage?: string
  createdAt: string
}

// INTERFAZ DE ESTADO
export interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => boolean
  signup: (email: string, password: string, name: string) => boolean
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  updateProfileImage: (imageUrl: string) => void
  setUser: (user: User) => void
  
  // NUEVAS FUNCIONES DE DIRECCIONES:
  addAddress: (address: Address) => void
  updateAddress: (id: string, data: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
}

// BASE LOCALSTORAGE
const getStoredUsers = (): { [key: string]: { password: string; user: User } } => {
  if (typeof window === "undefined") return {}
  const stored = localStorage.getItem("zentro_users")
  return stored ? JSON.parse(stored) : {}
}
const saveStoredUsers = (users: { [key: string]: { password: string; user: User } }) => {
  localStorage.setItem("zentro_users", JSON.stringify(users))
}

// HOOK COMPLETO
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: (email, password) => {
        const users = getStoredUsers()
        const userData = users[email]
        if (!userData || userData.password !== password) return false
        set({ user: userData.user })
        return true
      },

      signup: (email, password, name) => {
        const users = getStoredUsers()
        if (users[email]) return false // Usuario ya existe

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          role: "customer",
          addresses: [], // Inicializa las direcciones vacías
          createdAt: new Date().toISOString(),
        }
        users[email] = { password, user: newUser }
        saveStoredUsers(users)
        set({ user: newUser })
        return true
      },

      logout: () => set({ user: null }),

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state
          const updatedUser = { ...state.user, ...data }
          const users = getStoredUsers()
          if (users[state.user.email]) {
            users[state.user.email].user = updatedUser
            saveStoredUsers(users)
          }
          return { user: updatedUser }
        })
      },

      updateProfileImage: (imageUrl) => {
        set((state) => {
          if (!state.user) return state
          const updatedUser = { ...state.user, profileImage: imageUrl }
          const users = getStoredUsers()
          if (users[state.user.email]) {
            users[state.user.email].user = updatedUser
            saveStoredUsers(users)
          }
          return { user: updatedUser }
        })
      },

      setUser: (user) => set({ user }),

      // ---- DIRECCIONES MULTIPLES ----
      addAddress: async (address) => {
        const user = get().user
        if (!user) return

        try {
          //1. Llamar API para guardar dirección en BD
          const res = await api.post('/api/addresses', address)
          const saved = res.data //direccion con ID desde backend

          //2. Actualizar estado local con estados del servidor
          const updatedAddresses = [...(user.addresses || []), saved]
          const updatedUser = { ...user, addresses: updatedAddresses }

          //3. Guardar en local storage para persistencia
          const users = getStoredUsers()
          if (users[user.email]) {
            users[user.email].user = updatedUser
            saveStoredUsers(users)
          }

          set({ user: updatedUser })
        } catch (error) {
          console.error("Error al agregar dirección:", error)
          throw error
        }
      },

      updateAddress: async (id, data) => {
        const user = get().user
        if (!user) return

        try {
          const res = await api.put(`/api/addresses/${id}`, data)
          const saved = res.data
          const updatedAddresses = (user.addresses || []).map((addr) => (addr.id === id ? saved : addr))
          const updatedUser = { ...user, addresses: updatedAddresses }
          const users = getStoredUsers()
          if (users[user.email]) {
            users[user.email].user = updatedUser
            saveStoredUsers(users)
          }
          set({ user: updatedUser })
          return
        } catch (e) {
          const updatedAddresses = (user.addresses || []).map((addr) => (addr.id === id ? { ...addr, ...data } : addr))
          const updatedUser = { ...user, addresses: updatedAddresses }
          const users = getStoredUsers()
          if (users[user.email]) {
            users[user.email].user = updatedUser
            saveStoredUsers(users)
          }
          set({ user: updatedUser })
        }
      },

      deleteAddress: async (id) => {
        const user = get().user
        if (!user) return

        try {
          await api.delete(`/api/addresses/${id}`)
          const updatedAddresses = (user.addresses || []).filter((addr) => addr.id !== id)
          const updatedUser = { ...user, addresses: updatedAddresses }
          const users = getStoredUsers()
          if (users[user.email]) {
            users[user.email].user = updatedUser
            saveStoredUsers(users)
          }
          set({ user: updatedUser })
          return
        } catch (e) {
          const updatedAddresses = (user.addresses || []).filter((addr) => addr.id !== id)
          const updatedUser = { ...user, addresses: updatedAddresses }
          const users = getStoredUsers()
          if (users[user.email]) {
            users[user.email].user = updatedUser
            saveStoredUsers(users)
          }
          set({ user: updatedUser })
        }
      },

      setDefaultAddress: async (id) => {
        const user = get().user
        if (!user) return

        try {
          const res = await api.post(`/api/addresses/${id}/default`)
          const saved = res.data
          const updatedAddresses = (user.addresses || []).map((addr) => (addr.id === saved.id ? saved : { ...addr, isDefault: false }))
          const updatedUser = { ...user, addresses: updatedAddresses }
          const users = getStoredUsers()
          if (users[user.email]) {
            users[user.email].user = updatedUser
            saveStoredUsers(users)
          }
          set({ user: updatedUser })
          return
        } catch (e) {
          const updatedAddresses = (user.addresses || []).map((addr) => ({ ...addr, isDefault: addr.id === id }))
          const updatedUser = { ...user, addresses: updatedAddresses }
          const users = getStoredUsers()
          if (users[user.email]) {
            users[user.email].user = updatedUser
            saveStoredUsers(users)
          }
          set({ user: updatedUser })
        }
      },
    }),
    {
      name: "zentro_auth",
      skipHydration: true,
    },
  ),
)
