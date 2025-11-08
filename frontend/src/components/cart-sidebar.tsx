"use client"

import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { useOrders } from "@/hooks/use-orders"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Mi Carrito
          </SheetTitle>
          <SheetDescription>
            {items.length === 0 
              ? 'Tu carrito está vacío' 
              : (
                <div className="flex items-center gap-2">
                  <span>Revisa tus items antes de proceder al pago</span>
                  {items.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
                    </Badge>
                  )}
                </div>
              )}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Items */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Agrega productos para empezar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-accent/50 rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.restaurantName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="font-semibold">
                        ${item.price.toFixed(2)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">${getTotal().toFixed(2)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
              >
                Proceder al Pago
              </Button>
              <Button
                onClick={() => clearCart()}
                variant="outline"
                className="w-full"
              >
                Limpiar Carrito
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
