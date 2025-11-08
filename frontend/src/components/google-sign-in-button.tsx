"use client"

import { useGoogleLogin } from "@react-oauth/google"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import { useAuth } from "@/hooks/use-auth"

interface GoogleSignInButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Conectando...")
  const { setUser } = useAuth()

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true)
      try {
        // Obtener información del usuario desde Google
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        )

        const userInfo = userInfoResponse.data

        // Enviar al backend
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
          {
            email: userInfo.email,
            name: userInfo.name,
            profileImage: userInfo.picture,
            providerId: userInfo.sub,
            idToken: tokenResponse.access_token,
          }
        )

        // Guardar JWT en localStorage
        localStorage.setItem("zentro_jwt", response.data.jwt)
        
        // Actualizar el estado de usuario en Zustand
        setUser({
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          profileImage: userInfo.picture,
          role: response.data.role === "ROLE_CUSTOMER" ? "customer" : "owner",
          createdAt: new Date().toISOString(),
        })
        
        if (onSuccess) onSuccess()
        
        // Cambiar mensaje antes de redirigir
        setLoadingMessage("¡Éxito! Redirigiendo...")
        
        // Redirigir
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 500)
      } catch (error: any) {
        console.error("Error en autenticación con Google:", error)
        console.error("Response data:", error.response?.data)
        console.error("Response status:", error.response?.status)
        const errorMessage = error.response?.data?.message || error.response?.data || "Error al iniciar sesión con Google"
        if (onError) onError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      const errorMessage = "Error al conectar con Google"
      if (onError) onError(errorMessage)
    },
  })

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => login()}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
          <span>{loadingMessage}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continuar con Google</span>
        </div>
      )}
    </Button>
  )
}
