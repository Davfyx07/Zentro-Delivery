"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft, Sparkles, Shield, Zap, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleSignInButton } from "@/components/google-sign-in-button"
import axios from "axios"
import { validateHeaderName } from "http"

export default function SignupPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false)

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


  const handleSubmit = async (e: React.FormEvent) => {
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

    if(!validatePasswordStrength(formData.password)) {
      setError("La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          role: "ROLE_CUSTOMER",
        }
      )

      // Guardar JWT
      localStorage.setItem("zentro_jwt", response.data.jwt)

      // Actualizar el estado de usuario
      setUser({
        id: response.data.email,
        email: response.data.email,
        name: response.data.fullName,
        role: response.data.role === "ROLE_CUSTOMER" ? "customer" : "owner",
        createdAt: new Date().toISOString(),
      })

      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error: any) {
      console.error("Error en registro:", error)
      const status = error.response?.status
      const data = error.response?.data
      // Map common server statuses to friendly messages
      if (status === 409) {
        setError("Este email ya está registrado")
      } else {
        setError(data?.message || (typeof data === "string" ? data : "Ocurrió un error. Intenta de nuevo"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  function validatePasswordStrength(password: string) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?|]/.test(password);
    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }

  

// Funciones para validar cada regla
const validateRules = {
  minLength: (pw: string) => pw.length >= 8,
  hasUpper: (pw: string) => /[A-Z]/.test(pw),
  hasLower: (pw: string) => /[a-z]/.test(pw),
  hasNumber: (pw: string) => /[0-9]/.test(pw),
  hasSpecial: (pw: string) => /[!@#$%^&*(),.?|]/.test(pw),
  passwordsMatch: (pw: string, cpw: string) => pw === cpw && pw.length > 0,
}

const hasAnyError = !(
  validateRules.minLength(formData.password) &&
  validateRules.hasUpper(formData.password) &&
  validateRules.hasLower(formData.password) &&
  validateRules.hasNumber(formData.password) &&
  validateRules.hasSpecial(formData.password) &&
  validateRules.passwordsMatch(formData.password, formData.confirmPassword)
);

  useEffect(() => {
    if (hasAnyError) {
      setShowPasswordRules(true);
    } else setShowPasswordRules(false);
  }, [formData.password]);


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
              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password Input */}
             <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                  />

                  {/* Botón para toggle de reglas */}
                  <button
                    type="button"
                    onClick={() => setShowPasswordRules(!showPasswordRules)}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded"
                    aria-label="Mostrar / ocultar reglas de contraseña"
                  >
                  {showPasswordRules ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : hasAnyError ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  </button>


                  {/* Botón para mostrar/ocultar contraseña */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 hover:bg-transparent"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {showPasswordRules && (
                  <ul className="mt-2 text-xs pl-5 list-disc text-muted-foreground">
                    <li className={validateRules.minLength(formData.password) ? "text-green-600" : "text-red-600"}>
                      Mínimo 8 caracteres
                    </li>
                    <li className={validateRules.hasUpper(formData.password) ? "text-green-600" : "text-red-600"}>
                      Al menos una mayúscula (A-Z)
                    </li>
                    <li className={validateRules.hasLower(formData.password) ? "text-green-600" : "text-red-600"}>
                      Al menos una minúscula (a-z)
                    </li>
                    <li className={validateRules.hasNumber(formData.password) ? "text-green-600" : "text-red-600"}>
                      Al menos un número (0-9)
                    </li>
                    <li className={validateRules.hasSpecial(formData.password) ? "text-green-600" : "text-red-600"}>
                      Al menos un caracter especial (!@#$%^&*(),.?|)
                    </li>
                    <li className={validateRules.passwordsMatch(formData.password, formData.confirmPassword) ? "text-green-600" : "text-red-600"}>
                      Las contraseñas deben coincidir
                    </li>
                  </ul>
                )}
              </div>


              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 error-label">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="form-error">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          )}

          {/* Divider */}
          {!success && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-border dark:bg-gray-700"></div>
                <span className="text-xs text-muted-foreground dark:text-gray-500 font-medium">O continúa con</span>
                <div className="flex-1 h-px bg-border dark:bg-gray-700"></div>
              </div>

              {/* Google Sign In Button */}
              <GoogleSignInButton 
                onSuccess={() => router.push("/")}
                onError={(error) => setError(error)}
              />
            </>
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
