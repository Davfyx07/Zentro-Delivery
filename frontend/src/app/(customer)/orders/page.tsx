"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useOrders } from "@/hooks/use-orders"
import { Clock, CheckCircle, Truck, MapPin } from "lucide-react"
import Link from "next/link"

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  confirmed: { label: "Confirmada", icon: CheckCircle, color: "bg-blue-50 text-blue-700 border-blue-200" },
  preparing: { label: "Preparando", icon: Clock, color: "bg-purple-50 text-purple-700 border-purple-200" },
  "on-the-way": { label: "En camino", icon: Truck, color: "bg-orange-50 text-orange-700 border-orange-200" },
  delivered: { label: "Entregada", icon: CheckCircle, color: "bg-green-50 text-green-700 border-green-200" },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { getOrders } = useOrders()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
  }

  const orders = getOrders(user.id)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mis Órdenes</h1>
            <p className="text-muted-foreground mt-1">Historial y estado de tus pedidos</p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-border p-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">No tienes órdenes aún</p>
              <Link href="/">
                <button className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors">
                  Explorar Restaurantes
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = statusConfig[order.status]
                const StatusIcon = config.icon

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Header */}
                    <div
                      className={`px-6 py-4 border-b border-border flex items-center justify-between ${config.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-5 h-5" />
                        <div>
                          <p className="font-semibold text-sm">Orden #{order.id.toUpperCase()}</p>
                          <p className="text-xs opacity-80">{new Date(order.createdAt).toLocaleDateString("es-ES")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                        <p className="text-xs opacity-80">{config.label}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="px-6 py-4 bg-muted/30">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Artículos:</h3>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="font-semibold text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="px-6 py-4 flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Dirección de entrega</p>
                        <p className="text-foreground">{order.address}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}

