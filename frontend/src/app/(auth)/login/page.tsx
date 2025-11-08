"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Mail, Lock, AlertCircle, ArrowLeft, Chrome } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

  // Demo credentials
  const fillDemoCredentials = () => {
    setEmail("demo@zentro.com")
    setPassword("demo123")
  }

  // Google Sign In (placeholder)
  const handleGoogleSignIn = () => {
    alert("Google Sign-In se implementará con NextAuth.js en la siguiente fase")
    // TODO: Implementar con NextAuth.js
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-foreground dark:text-white hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver al inicio</span>
        </Link>

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Zentro</h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-border dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground dark:text-white mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground dark:text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-border dark:border-gray-600 bg-muted/50 dark:bg-gray-700 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground dark:text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground dark:text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-border dark:border-gray-600 bg-muted/50 dark:bg-gray-700 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 mt-6"
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border dark:bg-gray-600"></div>
            <span className="text-xs text-muted-foreground dark:text-gray-400">O continúa con</span>
            <div className="flex-1 h-px bg-border dark:bg-gray-600"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full py-2.5 bg-white dark:bg-gray-700 text-foreground dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-2 border-border dark:border-gray-600 flex items-center justify-center gap-2"
          >
            <Chrome className="w-5 h-5 text-blue-500" />
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border dark:bg-gray-600"></div>
            <span className="text-xs text-muted-foreground dark:text-gray-400">O prueba con credenciales de demostración</span>
            <div className="flex-1 h-px bg-border dark:bg-gray-600"></div>
          </div>

          {/* Demo Button */}
          <button
            onClick={fillDemoCredentials}
            className="w-full py-2.5 bg-muted dark:bg-gray-700 text-foreground dark:text-white font-semibold rounded-lg hover:bg-muted/80 dark:hover:bg-gray-600 transition-colors border border-border dark:border-gray-600"
          >
            Usar Demo
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

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
          <h3 className="text-xs font-semibold text-foreground dark:text-white mb-2">Credenciales de Demo:</h3>
          <div className="space-y-1 text-xs text-muted-foreground dark:text-gray-400">
            <p>Email: demo@zentro.com</p>
            <p>Contraseña: demo123</p>
          </div>
        </div>
      </div>
    </main>
  )
}
