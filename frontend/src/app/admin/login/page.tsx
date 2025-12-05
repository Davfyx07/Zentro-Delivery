"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Mail, Lock, AlertCircle, ArrowLeft, ShieldCheck, LayoutDashboard, BarChart3, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
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
            await login(email, password)
            // Redirigir al dashboard de admin/dueño
            router.push("/dashboard")
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
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6 border border-white/20">
                            <ShieldCheck className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4">ZENTRO ADMIN</h2>
                        <p className="text-xl text-gray-300 italic">Gestión y Control Total</p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 w-full max-w-md">
                        <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                            <div className="p-3 bg-primary/20 rounded-lg">
                                <LayoutDashboard className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Panel de Control</h3>
                                <p className="text-sm text-gray-400">Visión global de tu negocio</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                            <div className="p-3 bg-primary/20 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Analíticas</h3>
                                <p className="text-sm text-gray-400">Métricas y rendimiento en tiempo real</p>
                            </div>
                        </div>
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
                        <span className="font-medium">Volver al sitio público</span>
                    </Link>

                    <div className="lg:hidden text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground dark:text-white">Zentro Admin</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-2">
                            Acceso Administrativo
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                            Ingresa tus credenciales de administrador o propietario.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Correo Corporativo</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@zentro.com"
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
                            className="w-full mt-5 bg-primary hover:bg-primary/90"
                        >
                            {isLoading ? "Verificando..." : "Entrar al Panel"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-muted-foreground">
                            Este es un sistema restringido. Cualquier acceso no autorizado será monitoreado.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
