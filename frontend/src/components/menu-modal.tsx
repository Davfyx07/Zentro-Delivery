"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{restaurantName}</DialogTitle>
          <DialogDescription>
            Selecciona los platillos que deseas agregar a tu carrito
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Menu Items */}
        <div className="space-y-4 pb-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    ${item.price.toFixed(2)}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setQuantities({
                          ...quantities,
                          [item.id]: Math.max(1, (quantities[item.id] || 1) - 1),
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{quantities[item.id] || 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setQuantities({
                          ...quantities,
                          [item.id]: (quantities[item.id] || 1) + 1,
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="ml-2"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
