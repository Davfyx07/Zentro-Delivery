"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

interface RestaurantMenuItemsProps {
  items: MenuItem[]
  restaurantId: number
  restaurantName: string
}

export function RestaurantMenuItems({ items, restaurantId, restaurantName }: RestaurantMenuItemsProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const { addItem } = useCart()

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change),
    }))
  }

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1
    addItem({
      id: `${restaurantId}-${item.id}`,
      restaurantId,
      restaurantName,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
    })
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-slate-950 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-border hover:border-primary"
        >
          {/* Image */}
          <div className="relative h-48 bg-muted overflow-hidden">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-lg text-foreground mb-1">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <Minus className="w-4 h-4 text-muted-foreground" />
                </button>
                <span className="w-6 text-center font-semibold text-foreground">{quantities[item.id] || 1}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="ml-2 flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
