"use client"

import { useState } from "react"
import { X, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface MenuModalProps {
  isOpen: boolean
  onClose: () => void
  restaurantId: number
  restaurantName: string
  items: MenuItem[]
}

const defaultMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Hamburguesa Clásica",
    description: "Carne de res, queso, lechuga, tomate",
    price: 12.99,
    image: "/burger-restaurant-premium.jpg",
  },
  {
    id: "2",
    name: "Pizza Margarita",
    description: "Tomate, mozzarella, albahaca fresca",
    price: 14.99,
    image: "/italian-pizzeria-restaurant.jpg",
  },
  {
    id: "3",
    name: "Tacos al Pastor",
    description: "Carne al pastor, piña, cebolla, cilantro",
    price: 9.99,
    image: "/vibrant-mexican-tacos.png",
  },
  {
    id: "4",
    name: "Sushi Roll",
    description: "Salmón, aguacate, pepino, arroz",
    price: 15.99,
    image: "/elegant-sushi-restaurant.png",
  },
]

export function MenuModal({ isOpen, onClose, restaurantId, restaurantName, items = [] }: MenuModalProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const { addItem } = useCart()
  const menuItems = items.length > 0 ? items : defaultMenuItems

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
    setQuantities({ ...quantities, [item.id]: 1 })
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border dark:border-gray-700 bg-white dark:bg-gray-900">
              <h2 className="text-2xl font-bold text-foreground dark:text-white">{restaurantName}</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-border dark:border-gray-700 rounded-lg hover:bg-muted/30 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground dark:text-white">{item.name}</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{item.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setQuantities({
                              ...quantities,
                              [item.id]: Math.max(1, (quantities[item.id] || 1) - 1),
                            })
                          }
                          className="px-2 py-1 bg-muted dark:bg-gray-800 rounded hover:bg-muted/80 dark:hover:bg-gray-700 dark:text-white"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold dark:text-white">{quantities[item.id] || 1}</span>
                        <button
                          onClick={() =>
                            setQuantities({
                              ...quantities,
                              [item.id]: (quantities[item.id] || 1) + 1,
                            })
                          }
                          className="px-2 py-1 bg-muted dark:bg-gray-800 rounded hover:bg-muted/80 dark:hover:bg-gray-700 dark:text-white"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="ml-4 flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
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
          </div>
        </div>
      )}
    </>
  )
}
