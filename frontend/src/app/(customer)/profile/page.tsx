"use client"

import { useAuth } from "@/hooks/use-auth"
import { AvatarUpload } from "@/components/avatar-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, User, Edit2, Check, Camera } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import  AddressesManager  from "@/components/addresses-manager"
import api from "@/lib/api"

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingProfile, setIsFetchingProfile] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phoneNumber: user?.phone || "",
  })



useEffect(() => {
  const fetchProfile = async () => {
    try {
      //  Cargar perfil
      const response = await api.get('/api/users/profile')

      // Cargar direcciones
      let addresses = []
      try {
        const addressRes = await api.get('/api/addresses')
        addresses = addressRes.data || []
        //console.log('✅ Direcciones cargadas:', addresses)
      } catch (addrError) {
        //console.warn('⚠️ Error cargando direcciones:', addrError)
      }

      // Actualizar usuario
      setUser({
        id: response.data.email,
        email: response.data.email,
        name: response.data.fullName,
        phone: response.data.phoneNumber,
        addresses: addresses, // ✅ Desde backend
        profileImage: response.data.profileImage,
        role: response.data.role === "ROLE_CUSTOMER" ? "customer" : "owner",
        createdAt: user?.createdAt || new Date().toISOString(),
      })

      setFormData({
        fullName: response.data.fullName || "",
        phoneNumber: response.data.phoneNumber || "",
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsFetchingProfile(false)
    }
  }
  fetchProfile()
}, [])
  if (!user || isFetchingProfile) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleAvatarUploadSuccess = (imageUrl: string) => {
    setUser({
      ...user,
      profileImage: imageUrl,
    })
    toast({
      title: "✅ Foto actualizada",
      description: "Tu foto de perfil se actualizó correctamente",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const jwt = localStorage.getItem("zentro_jwt")
      if (!jwt) throw new Error("No JWT token found")

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )

      setUser({
        ...user,
        name: response.data.fullName,
        phone: response.data.phoneNumber,
      })
      setIsEditing(false)

      toast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios se guardaron correctamente",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "¡Error!",
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
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col mx-auto px-4 py-8 pt-24 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">Administra tu información personal y direcciones</p>
      </div>

      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-8"> 
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Información Personal</CardTitle>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <AvatarUpload
                        currentImage={user.profileImage}
                        userName={user.name}
                        onUploadSuccess={handleAvatarUploadSuccess}
                      />
                      {/* Optional camera icon overlay if needed */}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="opacity-60"
                    />
                    <p className="text-xs text-muted-foreground">No se puede cambiar el correo electrónico</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono (Opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+52 123 456 7890"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      <Check className="w-4 h-4 mr-1" />
                      {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex justify-center md:justify-start flex-shrink-0">
                    <div className="h-32 w-32">
                      <AvatarUpload
                        currentImage={user.profileImage}
                        userName={user.name}
                        onUploadSuccess={handleAvatarUploadSuccess}
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    {formData.fullName && (
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">NOMBRE</p>
                          <p className="font-medium">{formData.fullName}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">CORREO</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    {formData.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">TELÉFONO</p>
                          <p className="font-medium">{formData.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addresses Manager */}
          <Card>
            <CardHeader>
              <CardTitle>Direcciones</CardTitle>
              <CardDescription>
                Administra todas tus direcciones, selecciona predeterminada, edita o elimina.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddressesManager />
            </CardContent>
          </Card>

          {/* Favoritos */}
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
