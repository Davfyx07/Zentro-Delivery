"use client"

import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { X, Trash2, Plus, Minus } from "lucide-react"
import { useOrders } from "@/hooks/use-orders"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart, getItemCount } = useCart()
  const { user } = useAuth()
  const { addOrder } = useOrders()
  const router = useRouter()

  const handleCheckout = () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (items.length === 0) return

    // Create order
    addOrder({
      userId: user.id,
      items,
      total: getTotal(),
      status: "confirmed",
      address: user.address || "Dirección no especificada",
    })

    // Clear cart
    clearCart()
    onClose()

    // Redirect to orders
    router.push("/orders")
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-gray-900 shadow-lg z-50 transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-gray-700">
          <h2 className="text-xl font-bold text-foreground dark:text-white">Mi Carrito</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground dark:text-gray-400">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-muted/50 dark:bg-gray-800 rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground dark:text-white text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">{item.restaurantName}</p>
                    <p className="text-sm font-semibold text-primary mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Minus className="w-3 h-3 dark:text-white" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3 dark:text-white" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 hover:bg-red-50 rounded transition-colors text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border dark:border-gray-700 p-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="dark:text-white">Total:</span>
              <span className="text-primary">${getTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
            >
              Proceder al Pago
            </button>
            <button
              onClick={() => clearCart()}
              className="w-full py-2 bg-muted dark:bg-gray-800 text-foreground dark:text-white font-semibold rounded-lg hover:bg-muted/80 dark:hover:bg-gray-700 transition-colors border border-border dark:border-gray-700"
            >
              Limpiar Carrito
            </button>
          </div>
        )}
      </div>
    </>
  )
}
