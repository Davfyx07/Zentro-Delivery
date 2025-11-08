"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Mail, Lock, AlertCircle, ArrowLeft, ChefHat, UtensilsCrossed, ShoppingBag, EyeOff, Eye } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation
    if (!email || !password) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    const success = login(email, password)

    if (success) {
      router.push("/")
    } else {
      setError("Email o contraseña incorrectos")
    }

    setIsLoading(false)
  }

  // Google Sign In (placeholder)
  const handleGoogleSignIn = () => {
    alert("Google Sign-In se implementará con NextAuth.js en la siguiente fase")
    // TODO: Implementar con NextAuth.js
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
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <span className="text-white font-bold text-4xl">Z</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">ZENTRO-DELIVERY</h2>
            <p className="text-xl text-white/90 italic">Deliver Excellence, Elevate Every Bite Instantly</p>
          </div>

          {/* Illustration with Icons */}
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

          {/* Testimonial or Feature */}
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
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-foreground dark:text-white hover:text-primary mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al inicio</span>
          </Link>

          {/* Mobile Logo - Only visible on small screens */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground dark:text-white">Zentro</h1>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-1">
              Inicia sesión
            </h2>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Bienvenido de nuevo. Ingresa tus credenciales para continuar.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground dark:text-white mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground dark:text-white mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-2.5 rounded-xl border-2 border-border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-5"
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border dark:bg-gray-700"></div>
            <span className="text-xs text-muted-foreground dark:text-gray-500 font-medium">O continúa con</span>
            <div className="flex-1 h-px bg-border dark:bg-gray-700"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full py-2.5 bg-white dark:bg-gray-800 text-foreground dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-all border-2 border-border dark:border-gray-700 flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </button>

          {/* Sign Up Link */}
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
