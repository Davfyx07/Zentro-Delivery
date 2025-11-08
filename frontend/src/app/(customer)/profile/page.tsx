"use client"

import { useAuth } from "@/hooks/use-auth"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone, User } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateProfileImage, updateProfile } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phoneNumber: user?.phone || "",
    address: user?.address || "",
  })

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Por favor inicia sesión para ver tu perfil</p>
      </div>
    )
  }

  const handleImageChange = (imageUrl: string) => {
    updateProfileImage(imageUrl)
    // TODO: Cuando tengamos backend, enviar a Cloudinary y actualizar en DB
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const jwt = localStorage.getItem("zentro_jwt")
      console.log("JWT encontrado:", jwt ? "Sí" : "No")
      console.log("JWT value:", jwt)
      
      if (!jwt) {
        throw new Error("No JWT token found")
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )

      // Actualizar el estado local
      updateProfile({
        name: response.data.fullName,
        phone: response.data.phoneNumber,
        address: response.data.address,
      })

      toast({
        title: "✅ Perfil actualizado",
        description: "Tus cambios se guardaron correctamente",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "❌ Error",
        description: error.response?.data?.message || "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: user.name,
      phoneNumber: user.phone || "",
      address: user.address || "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">Administra tu información personal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar con foto de perfil */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>
                Haz clic en el ícono de cámara para cambiar tu foto
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <ProfilePictureUpload
                currentImage={user.profileImage}
                userName={user.name}
                onImageChange={handleImageChange}
              />
              <div className="text-center">
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Rol de Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
                  {user.role === 'customer' ? 'Cliente' : user.role === 'owner' ? 'Propietario' : 'Admin'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (Opcional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+52 123 456 7890"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Direcciones */}
          <Card>
            <CardHeader>
              <CardTitle>Dirección de Entrega</CardTitle>
              <CardDescription>
                Administra tu dirección principal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección Principal</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Calle, número, colonia, ciudad"
                    className="pl-10"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Esta dirección se guardará junto con tu nombre y teléfono al hacer clic en "Guardar Cambios" arriba.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Restaurantes Favoritos */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurantes Favoritos</CardTitle>
              <CardDescription>
                Accede rápidamente a tus lugares preferidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Aún no tienes restaurantes favoritos. Explora nuestro catálogo y guarda tus preferidos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
