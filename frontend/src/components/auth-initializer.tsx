"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

/**
 * Componente que inicializa la sesión del usuario
 * al cargar la aplicación si existe una cookie válida
 */
export function AuthInitializer() {
  const { initialize, isInitialized } = useAuth()

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [initialize, isInitialized])

  return null
}