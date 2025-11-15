import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit2, Trash2, Check, Home } from "lucide-react"

import { useToast } from "@/hooks/use-toast"

export default function AddressesManager() {
  const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    address: "",
  })

  const addresses = user?.addresses || []

  const handleOpenDialog = (address?: any) => {
    if (address && address.id) {
      setEditingId(address.id)
      setFormData({ 
        title: address.title, 
        address: address.address 
      })
    } else {
      setEditingId(null)
      setFormData({ title: "", address: "" })
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    // Validación
    if (!formData.title.trim() || !formData.address.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (editingId) {
        // Actualizar dirección existente
        await updateAddress(editingId, {
          title: formData.title.trim(),
          address: formData.address.trim(),
        })
        
        toast({
          title: " Dirección actualizada",
          description: "Tu dirección se actualizó correctamente",
        })
      } else {
        // Crear nueva dirección
        await addAddress({
          title: formData.title.trim(),
          address: formData.address.trim(),
        } as any)
        
        toast({
          title: "Dirección agregada",
          description: "Nueva dirección guardada correctamente",
        })
      }

      // Cerrar modal y limpiar formulario
      setIsOpen(false)
      setFormData({ title: "", address: "" })
      setEditingId(null)
    } catch (error: any) {
      console.error("Error al guardar dirección:", error)
      
      // Mostrar mensaje de error específico
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          "No se pudo guardar la dirección"
      
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id)
      
      const addr = addresses.find(a => a.id === id)
      toast({
        title: "✅ Dirección actualizada",
        description: `${addr?.title} es ahora tu dirección principal`,
      })
    } catch (error: any) {
      console.error("Error al establecer dirección predeterminada:", error)
      toast({
        title: "❌ Error",
        description: error.message || "No se pudo actualizar la dirección",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id)
      
      toast({
        title: "🗑️ Dirección eliminada",
        description: "Tu dirección se eliminó correctamente",
      })
    } catch (error: any) {
      console.error("Error al eliminar dirección:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la dirección",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-md">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <CardTitle>Mis Direcciones</CardTitle>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-1" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar dirección" : "Agregar nueva dirección"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">
                  Tipo de dirección
                </Label>
                <Input
                  id="title"
                  placeholder="Ej: Casa, Trabajo, Apartamento"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={isSubmitting}
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="font-semibold">
                  Dirección completa
                </Label>
                <textarea
                  id="address"
                  placeholder="Calle, número, colonia, ciudad, código postal"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground h-20 resize-none rounded-md"
                />
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full font-semibold rounded-md h-10"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Guardando...
                  </span>
                ) : (
                  <>{editingId ? "Actualizar" : "Agregar"} Dirección</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-3">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <Home className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">Aún no tienes direcciones guardadas.</p>
            <p className="text-sm text-muted-foreground">Agrega una para comenzar a ordenar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-3 border-2 flex flex-col justify-between aspect-square transition-all rounded-lg ${
                  addr.isDefault
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm">{addr.title}</h4>
                    {addr.isDefault && (
                      <Badge className="bg-primary text-primary-foreground gap-1 text-xs">
                        <Check className="w-3 h-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">{addr.address}</p>
                </div>
                <div className="flex gap-2 pt-2 mt-2 border-t flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(addr)}
                    className="text-xs flex-1 rounded-md h-7"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-destructive hover:text-destructive flex-1 rounded-md h-7"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar dirección?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará la dirección seleccionada. No se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => addr.id && handleDelete(addr.id)}
                          className="bg-destructive text-white"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {!addr.isDefault && addresses.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs w-full bg-transparent rounded-md h-7 mt-2"
                    onClick={() => addr.id && handleSetDefault(addr.id)}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Por defecto
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
    </CardContent>
    </Card>
  )
}