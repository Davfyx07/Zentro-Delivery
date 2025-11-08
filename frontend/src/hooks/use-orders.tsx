"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "./use-cart"

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "on-the-way" | "delivered"
  createdAt: string
  address: string
}

export interface OrdersState {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void
  getOrders: (userId: string) => Order[]
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order: Omit<Order, "id" | "createdAt">) => {
        const newOrder: Order = {
          ...order,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }))
      },
      getOrders: (userId: string) => {
        return get().orders.filter((order) => order.userId === userId)
      },
      updateOrderStatus: (orderId: string, status: Order["status"]) => {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
        }))
      },
    }),
    {
      name: "zentro_orders",
    },
  ),
)
