"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, MoveRight, Star } from "lucide-react"

interface RestaurantCardProps {
    restaurant: any
    onEdit: () => void
}

export function RestaurantCard({ restaurant, onEdit }: RestaurantCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all border-l-4 border-l-primary">
            <div className="relative h-48 w-full">
                <img
                    src={restaurant.images?.[0] || "/placeholder.png"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={restaurant.open ? "default" : "destructive"}>
                        {restaurant.open ? "Abierto" : "Cerrado"}
                    </Badge>
                </div>
            </div>

            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisineType}</p>
                    </div>
                    {restaurant.averageRating > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-yellow-700 dark:text-yellow-400 text-sm font-bold">
                            <Star className="w-4 h-4 fill-current" />
                            {restaurant.averageRating}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm line-clamp-2 text-muted-foreground">{restaurant.description}</p>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{restaurant.address?.address || "Sin dirección"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{restaurant.contactInformation?.mobile || "Sin teléfono"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{restaurant.openingHours || "Sin horario"}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Button onClick={onEdit} className="w-full">
                    Administrar Restaurante <MoveRight className="ml-2 w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
