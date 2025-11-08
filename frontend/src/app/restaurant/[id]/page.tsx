"use client"

import { useState, useMemo, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Star } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RestaurantMenuItems } from "@/components/restaurant-menu-items"

// Datos de restaurantes con menú completo
const restaurants = [
  {
    id: 1,
    name: "Pizzería Roma",
    description: "Auténtica pizza italiana hecha al horno con ingredientes importados",
    image: "/italian-pizzeria-restaurant.jpg",
    rating: 4.8,
    location: "Calle Principal 123, Centro",
    hours: "11:00 - 23:00",
    categories: ["Pizzas", "Pastas", "Postres", "Bebidas"],
    menu: [
      {
        id: "1",
        name: "Pizza Margarita",
        description: "Tomate, mozzarella, albahaca fresca",
        price: 14.99,
        image: "/italian-pizzeria-restaurant.jpg",
        category: "Pizzas",
        foodType: "VEGETARIAN_ONLY",
      },
      {
        id: "2",
        name: "Pizza Pepperoni",
        description: "Salsa de tomate, queso, pepperoni",
        price: 16.99,
        image: "/italian-pizzeria-restaurant.jpg",
        category: "Pizzas",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "3",
        name: "Pasta Carbonara",
        description: "Pasta fresca con queso pecorino y jamón",
        price: 13.99,
        image: "/italian-pizzeria-restaurant.jpg",
        category: "Pastas",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "4",
        name: "Tiramisu",
        description: "Postre italiano clásico con café",
        price: 7.99,
        image: "/italian-pizzeria-restaurant.jpg",
        category: "Postres",
        foodType: "VEGETARIAN_ONLY",
      },
    ],
  },
  {
    id: 2,
    name: "Burger House",
    description: "Las mejores hamburguesas gourmet de la ciudad",
    image: "/burger-restaurant-premium.jpg",
    rating: 4.6,
    location: "Av. Comercial 456, Zona comercial",
    hours: "10:00 - 22:00",
    categories: ["Burgers", "Sides", "Bebidas", "Postres"],
    menu: [
      {
        id: "1",
        name: "Hamburguesa Clásica",
        description: "Carne de res, queso, lechuga, tomate",
        price: 12.99,
        image: "/burger-restaurant-premium.jpg",
        category: "Burgers",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "2",
        name: "Hamburguesa Doble",
        description: "Doble carne, queso cheddar, bacon",
        price: 15.99,
        image: "/burger-restaurant-premium.jpg",
        category: "Burgers",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "3",
        name: "Papas Fritas",
        description: "Papas crujientes recién fritas",
        price: 5.99,
        image: "/burger-restaurant-premium.jpg",
        category: "Sides",
        foodType: "VEGETARIAN_ONLY",
      },
      {
        id: "4",
        name: "Coca Cola",
        description: "Bebida fría",
        price: 2.99,
        image: "/burger-restaurant-premium.jpg",
        category: "Bebidas",
        foodType: "VEGETARIAN_ONLY",
      },
    ],
  },
  {
    id: 3,
    name: "Taquería Mexicana",
    description: "Tacos y burritos auténticos mexicanos",
    image: "/vibrant-mexican-tacos.png",
    rating: 4.7,
    location: "Calle México 789, Barrio antiguo",
    hours: "12:00 - 23:30",
    categories: ["Tacos", "Burritos", "Quesadillas", "Bebidas"],
    menu: [
      {
        id: "1",
        name: "Tacos al Pastor",
        description: "Carne al pastor, piña, cebolla, cilantro",
        price: 9.99,
        image: "/vibrant-mexican-tacos.png",
        category: "Tacos",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "2",
        name: "Burrito Gigante",
        description: "Arroz, frijoles, carne, queso y salsa",
        price: 11.99,
        image: "/vibrant-mexican-tacos.png",
        category: "Burritos",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "3",
        name: "Quesadilla de Pollo",
        description: "Queso derretido con pollo deshebrado",
        price: 8.99,
        image: "/vibrant-mexican-tacos.png",
        category: "Quesadillas",
        foodType: "NON_VEGETARIAN_ONLY",
      },
    ],
  },
  {
    id: 4,
    name: "Sushi Master",
    description: "Sushi fresco preparado por maestros japoneses",
    image: "/elegant-sushi-restaurant.png",
    rating: 4.9,
    location: "Plaza Futura 321, Sector Premium",
    hours: "13:00 - 23:00",
    categories: ["Rolls", "Nigiri", "Sashimi", "Bebidas"],
    menu: [
      {
        id: "1",
        name: "Sushi Roll California",
        description: "Salmón, aguacate, pepino, arroz",
        price: 15.99,
        image: "/elegant-sushi-restaurant.png",
        category: "Rolls",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "2",
        name: "Nigiri Salmón",
        description: "Salmón fresco sobre arroz",
        price: 12.99,
        image: "/elegant-sushi-restaurant.png",
        category: "Nigiri",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "3",
        name: "Sashimi Variado",
        description: "Selección de pescados frescos",
        price: 18.99,
        image: "/elegant-sushi-restaurant.png",
        category: "Sashimi",
        foodType: "NON_VEGETARIAN_ONLY",
      },
    ],
  },
  {
    id: 5,
    name: "Pollo Gourmet",
    description: "Pollo asado y preparaciones premium",
    image: "/grilled-chicken-restaurant.jpg",
    rating: 4.5,
    location: "Calle Alameda 654, Barrio norte",
    hours: "11:30 - 22:30",
    categories: ["Pollos", "Acompañamientos", "Salsas", "Bebidas"],
    menu: [
      {
        id: "1",
        name: "Pollo Asado Entero",
        description: "Pollo jugoso recién asado al fuego",
        price: 19.99,
        image: "/grilled-chicken-restaurant.jpg",
        category: "Pollos",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "2",
        name: "Pechuga Grillada",
        description: "Pechuga tierna a la parrilla",
        price: 13.99,
        image: "/grilled-chicken-restaurant.jpg",
        category: "Pollos",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "3",
        name: "Arepa Blanca",
        description: "Arepa tradicional recién hecha",
        price: 4.99,
        image: "/grilled-chicken-restaurant.jpg",
        category: "Acompañamientos",
        foodType: "VEGETARIAN_ONLY",
      },
    ],
  },
  {
    id: 6,
    name: "Green Garden",
    description: "Ensaladas frescas y comida saludable",
    image: "/salad-healthy-food-restaurant.jpg",
    rating: 4.4,
    location: "Avenida Verde 987, Zona comercial",
    hours: "08:00 - 21:00",
    categories: ["Ensaladas", "Bowls", "Jugos", "Snacks"],
    menu: [
      {
        id: "1",
        name: "Ensalada Caesar",
        description: "Lechuga romana, pollo, queso parmesano",
        price: 10.99,
        image: "/salad-healthy-food-restaurant.jpg",
        category: "Ensaladas",
        foodType: "NON_VEGETARIAN_ONLY",
      },
      {
        id: "2",
        name: "Buddha Bowl",
        description: "Quinoa, vegetales, garbanzos, tahini",
        price: 12.99,
        image: "/salad-healthy-food-restaurant.jpg",
        category: "Bowls",
        foodType: "VEGETARIAN_ONLY",
      },
      {
        id: "3",
        name: "Jugo Verde Detox",
        description: "Espinaca, manzana, jengibre",
        price: 6.99,
        image: "/salad-healthy-food-restaurant.jpg",
        category: "Jugos",
        foodType: "SEASONAL",
      },
    ],
  },
]

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const restaurantId = Number.parseInt(id)
  const restaurant = restaurants.find((r) => r.id === restaurantId)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = useMemo(() => {
    return restaurant
      ? restaurant.menu.filter((item) => {
          const matchesCategory = !selectedCategory || item.category === selectedCategory
          const matchesFoodType = !selectedFoodType || item.foodType === selectedFoodType
          const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
          return matchesCategory && matchesFoodType && matchesSearch
        })
      : []
  }, [selectedCategory, selectedFoodType, searchQuery, restaurant])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative h-64 md:h-80 bg-muted overflow-hidden">
        <img
          src={restaurant ? restaurant.image : "/placeholder.svg"}
          alt={restaurant ? restaurant.name : "Placeholder"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </section>

      {/* Restaurant Info */}
      <section className="bg-white dark:bg-slate-950 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {restaurant ? (
            <>
              <h1 className="text-4xl font-bold text-foreground mb-2">{restaurant.name}</h1>
              <p className="text-muted-foreground text-lg mb-6">{restaurant.description}</p>

              {/* Info Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Calificación</p>
                    <p className="font-bold text-foreground">{restaurant.rating}/5.0</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ubicación</p>
                    <p className="font-bold text-foreground">{restaurant.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Horario</p>
                    <p className="font-bold text-foreground">{restaurant.hours}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <h1 className="text-2xl font-bold text-foreground">Restaurante no encontrado</h1>
              <Link href="/" className="text-primary mt-4 inline-block">
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Menu Section */}
      {restaurant && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Filtros Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white dark:bg-slate-950 rounded-xl p-4 shadow-md border border-border">
                    <input
                      type="text"
                      placeholder="Buscar platos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Categories Filter */}
                  <div className="bg-white dark:bg-slate-950 rounded-xl p-4 shadow-md border border-border">
                    <h3 className="font-bold text-foreground mb-4">Categorías</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === null}
                          onChange={() => setSelectedCategory(null)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-foreground group-hover:text-primary transition-colors">Todos</span>
                      </label>
                      {restaurant.categories.map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className="text-foreground group-hover:text-primary transition-colors">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Food Type Filter */}
                  <div className="bg-white dark:bg-slate-950 rounded-xl p-4 shadow-md border border-border">
                    <h3 className="font-bold text-foreground mb-4">Tipo de Comida</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="foodType"
                          checked={selectedFoodType === null}
                          onChange={() => setSelectedFoodType(null)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-foreground group-hover:text-primary transition-colors">Todos</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="foodType"
                          checked={selectedFoodType === "VEGETARIAN_ONLY"}
                          onChange={() => setSelectedFoodType("VEGETARIAN_ONLY")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-foreground group-hover:text-primary transition-colors"> Solo Vegetariano</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="foodType"
                          checked={selectedFoodType === "NON_VEGETARIAN_ONLY"}
                          onChange={() => setSelectedFoodType("NON_VEGETARIAN_ONLY")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-foreground group-hover:text-primary transition-colors">Solo No Vegetariano</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="foodType"
                          checked={selectedFoodType === "SEASONAL"}
                          onChange={() => setSelectedFoodType("SEASONAL")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-foreground group-hover:text-primary transition-colors">De Temporada</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold text-foreground mb-6">Menú</h2>

                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-950 rounded-xl border border-border">
                    <p className="text-muted-foreground">No hay items que coincidan con tu búsqueda</p>
                  </div>
                ) : (
                  <RestaurantMenuItems
                    items={filteredItems}
                    restaurantId={restaurant.id}
                    restaurantName={restaurant.name}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
