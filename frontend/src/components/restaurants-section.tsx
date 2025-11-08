"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useState } from "react"

const restaurants = [
  {
    id: 1,
    name: "Pizzería Roma",
    description: "Auténtica pizza italiana hecha al horno",
    image: "/italian-pizzeria-restaurant.jpg",
    status: "Abierto",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Burger House",
    description: "Las mejores hamburguesas gourmet de la ciudad",
    image: "/burger-restaurant-premium.jpg",
    status: "Abierto",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Taquería Mexicana",
    description: "Tacos y burritos auténticos mexicanos",
    image: "/vibrant-mexican-tacos.png",
    status: "Abierto",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Sushi Master",
    description: "Sushi fresco preparado por maestros japoneses",
    image: "/elegant-sushi-restaurant.png",
    status: "Cerrado",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Pollo Gourmet",
    description: "Pollo asado y preparaciones premium",
    image: "/grilled-chicken-restaurant.jpg",
    status: "Abierto",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Green Garden",
    description: "Ensaladas frescas y comida saludable",
    image: "/salad-healthy-food-restaurant.jpg",
    status: "Abierto",
    rating: 4.4,
  },
]

export function RestaurantsSection() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <section id="restaurants-section" className="py-12 md:py-16 bg-muted/50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground dark:text-white mb-8 text-balance">Restaurantes Disponibles</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurant/${restaurant.id}`}
              className="block bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:scale-105 border border-border dark:border-gray-700 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-muted dark:bg-gray-800">
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(restaurant.id)
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-md"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(restaurant.id) ? "fill-primary text-primary" : "text-muted-foreground dark:text-gray-400"
                    }`}
                  />
                </button>
                {/* Status Badge */}
                <div
                  className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-white font-semibold text-xs ${
                    restaurant.status === "Abierto" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {restaurant.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-foreground dark:text-white mb-1">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mb-3">{restaurant.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold text-foreground dark:text-white">{restaurant.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
