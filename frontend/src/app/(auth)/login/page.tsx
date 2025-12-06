"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Mail, Lock, AlertCircle, ArrowLeft, ChefHat, UtensilsCrossed, ShoppingBag, EyeOff, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleSignInButton } from "@/components/google-sign-in-button"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation
    if (!email || !password) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    try {
      // La cookie se establece automáticamente por el backend
      await login(email, password)

      // Redirigir al home
      router.push("/")
      router.refresh()
    } catch (error: any) {
      console.error("Error en login:", error)
      setError(error.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background dark:bg-gray-900 flex">
      {/* Left Side - Image/Illustration Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <span className="text-white font-bold text-4xl">Z</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">ZENTRO-DELIVERY</h2>
            <p className="text-xl text-white/90 italic">Deliver Excellence, Elevate Every Bite Instantly</p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <ChefHat className="w-12 h-12" />
              <p className="text-sm font-medium text-center">Restaurantes de calidad</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <UtensilsCrossed className="w-12 h-12" />
              <p className="text-sm font-medium text-center">Menú variado</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <ShoppingBag className="w-12 h-12" />
              <p className="text-sm font-medium text-center">Entrega rápida</p>
            </div>
          </div>

          <div className="mt-12 max-w-md text-center">
            <p className="text-lg text-white/90">
              "La mejor experiencia de pedidos en línea. Rápido, fácil y confiable."
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 bg-background dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground dark:text-white hover:text-primary mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al inicio</span>
          </Link>

          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground dark:text-white">Zentro</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-1">
              Inicia sesión
            </h2>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Bienvenido de nuevo. Ingresa tus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              <div className="text-right mt-1">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 error-label">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="form-error">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-5"
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border dark:bg-gray-700"></div>
            <span className="text-xs text-muted-foreground dark:text-gray-500 font-medium">O continúa con</span>
            <div className="flex-1 h-px bg-border dark:bg-gray-700"></div>
          </div>

          <GoogleSignInButton
            onSuccess={() => router.push("/")}
            onError={(error) => setError(error)}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              ¿No tienes cuenta?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}