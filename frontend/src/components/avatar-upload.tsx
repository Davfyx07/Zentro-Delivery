"use client"

import { useState } from "react"
import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import api from "@/lib/api"
interface AvatarUploadProps {
  currentImage?: string
  userName: string
  onUploadSuccess: (imageUrl: string) => void
}

export function AvatarUpload({ currentImage, userName, onUploadSuccess }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es muy grande. El tamaño máximo es 5MB")
      return
    }

    // Preview local
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Subir a servidor
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      //const jwt = localStorage.getItem("zentro_jwt")
      const response = await api.post(
        "/api/users/profile/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      // Actualizar con URL de Cloudinary
      onUploadSuccess(response.data.profileImage)
      setPreviewUrl(null) // Limpiar preview local
    } catch (error) {
      console.error("Error uploading avatar:", error)
      alert("Error al subir la imagen. Intenta de nuevo.")
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || currentImage} alt={userName} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 cursor-pointer shadow-lg transition-all"
        >
          <Camera className="h-4 w-4" />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        Click en la cámara para cambiar tu foto
      </p>
    </div>
  )
}
