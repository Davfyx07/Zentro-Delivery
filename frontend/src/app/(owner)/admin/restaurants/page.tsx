"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus } from "lucide-react"
import { api } from "@/lib/api"
import { RestaurantForm } from "@/components/owner/restaurant-form"
import { RestaurantCard } from "@/components/owner/restaurant-card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function AdminRestaurantsPage() {
    const [restaurant, setRestaurant] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const fetchRestaurant = async () => {
        try {
            setIsLoading(true)
            // Usamos get para obtener el restaurante del usuario actual
            const response = await api.get("/api/admin/restaurants/user")
            // Si el backend retorna un objeto vacío o null, lo manejamos
            if (response.data && response.data.id) {
                setRestaurant(response.data)
            } else {
                setRestaurant(null)
            }
        } catch (error) {
            console.error("Error fetching restaurant:", error)
            setRestaurant(null) // Asumimos que no tiene restaurante si falla (o 404)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRestaurant()
    }, [])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    // 1. Si NO tiene restaurante -> Mostrar Formulario de Creación
    if (!restaurant) {
        return (
            <div className="max-w-3xl mx-auto py-10 px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Bienvenido a Zentro Admin</h1>
                    <p className="text-muted-foreground mt-2">
                        Para comenzar a recibir pedidos, primero necesitas registrar tu restaurante.
                    </p>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <RestaurantForm onSuccess={fetchRestaurant} />
                </div>
            </div>
        )
    }

    // 2. Si TIENE restaurante -> Mostrar Tarjeta (Lista de uno)
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mis Restaurantes</h1>
                    <p className="text-muted-foreground">Administra la información de tu establecimiento.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <RestaurantCard
                    restaurant={restaurant}
                    onEdit={() => setIsEditOpen(true)}
                />
            </div>

            {/* Modal de Edición */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Restaurante</DialogTitle>
                        <DialogDescription>
                            Actualiza la información de tu restaurante.
                        </DialogDescription>
                    </DialogHeader>
                    <RestaurantForm
                        initialData={restaurant}
                        onSuccess={() => {
                            setIsEditOpen(false)
                            fetchRestaurant()
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
