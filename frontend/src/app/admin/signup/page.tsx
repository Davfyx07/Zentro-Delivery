"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft, Store, ChefHat, TrendingUp, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminSignupPage() {
    const router = useRouter()
    const { signup } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
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

        if (!validatePasswordStrength(formData.password)) {
            setError("La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales")
            setIsLoading(false)
            return
        }

        try {
            // Registrar como DUEÑO DE RESTAURANTE
            await signup(formData.email, formData.password, formData.name, "ROLE_RESTAURANT_OWNER")

            setSuccess(true)
            setTimeout(() => {
                // Redirigir al dashboard de dueño
                router.push("/dashboard")
                router.refresh()
            }, 1500)
        } catch (error: any) {
            console.error("Error en registro:", error)
            setError(error.message || "Error al crear cuenta")
        } finally {
            setIsLoading(false)
        }
    }

    function validatePasswordStrength(password: string) {
        const minLength = password.length >= 8
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        const hasSpecialChar = /[!@#$%^&*(),.?|]/.test(password)
        return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    }

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
    )

    useEffect(() => {
        if (hasAnyError) {
            setShowPasswordRules(true)
        } else setShowPasswordRules(false)
    }, [formData.password])

    return (
        <main className="min-h-screen bg-background dark:bg-gray-900 flex">
            {/* Left Side - Image/Illustration Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6 border border-white/20">
                            <Store className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4">ZENTRO PARTNERS</h2>
                        <p className="text-xl text-gray-300 italic">Haz crecer tu negocio gastronómico</p>
                    </div>

                    <div className="mt-12 space-y-6 max-w-md">
                        <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Aumenta tus Ventas</h3>
                                <p className="text-sm text-gray-400">Llega a miles de nuevos clientes en tu zona</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <ChefHat className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Gestión Simplificada</h3>
                                <p className="text-sm text-gray-400">Control total de menú, pedidos y horarios</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-6 bg-background dark:bg-gray-900">
                <div className="w-full max-w-md">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-foreground dark:text-white hover:text-primary mb-4 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Volver al inicio</span>
                    </Link>

                    <div className="lg:hidden text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
                            <Store className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground dark:text-white">Zentro Partners</h1>
                    </div>

                    <div className="mb-5">
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-1">
                            Registra tu Restaurante
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                            Crea tu cuenta de propietario para comenzar
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                            <div className="flex justify-center mb-3">
                                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground dark:text-white mb-1">¡Cuenta Creada!</h3>
                            <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">Bienvenido a la red de Zentro Partners.</p>
                            <p className="text-xs text-muted-foreground dark:text-gray-500">Redirigiendo al panel...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nombre Completo (Propietario)</Label>
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

                            <div className="space-y-1.5">
                                <Label htmlFor="email">Correo Corporativo</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="contacto@restaurante.com"
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10"
                                    />

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
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4 bg-primary hover:bg-primary/90"
                            >
                                {isLoading ? "Registrando..." : "Registrar Restaurante"}
                            </Button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-5 text-center">
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                                ¿Ya eres socio?{" "}
                                <Link href="/admin/login" className="font-semibold text-primary hover:underline">
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
