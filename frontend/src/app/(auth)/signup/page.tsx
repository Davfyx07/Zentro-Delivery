"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft, Sparkles, Shield, Zap, EyeOff, Eye } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Por favor ingresa un email válido")
      setIsLoading(false)
      return
    }

    const success = signup(formData.email, formData.password, formData.name)

    if (success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } else {
      setError("Este email ya está registrado")
    }

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-background dark:bg-gray-900 flex">
      {/* Left Side - Image/Illustration Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary via-secondary/90 to-primary relative overflow-hidden">
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
            <h2 className="text-4xl font-bold mb-4">Únete a Zentro</h2>
            <p className="text-xl text-white/90">Descubre una nueva forma de disfrutar la comida</p>
          </div>

          {/* Features */}
          <div className="mt-12 space-y-6 max-w-md">
            <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Experiencia Premium</h3>
                <p className="text-sm text-white/80">Acceso a los mejores restaurantes de tu ciudad</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Entrega Rápida</h3>
                <p className="text-sm text-white/80">Tu comida favorita en minutos</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">100% Seguro</h3>
                <p className="text-sm text-white/80">Pagos protegidos y datos encriptados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-6 bg-background dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-foreground dark:text-white hover:text-primary mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al inicio</span>
          </Link>

          {/* Mobile Logo - Only visible on small screens */}
          <div className="lg:hidden text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground dark:text-white">Zentro</h1>
          </div>

          {/* Header */}
          <div className="mb-5">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-1">
              Crear cuenta
            </h2>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Completa tus datos para empezar a disfrutar
            </p>
          </div>

          {/* Signup Form or Success Message */}
          {success ? (
            <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-1">¡Bienvenido a Zentro!</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">Tu cuenta ha sido creada exitosamente.</p>
              <p className="text-xs text-muted-foreground dark:text-gray-500">Redirigiendo...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground dark:text-white mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground dark:text-white mb-1.5">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </form>
          )}

          {/* Login Link */}
          {!success && (
            <div className="mt-5 text-center">
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
