"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            // 📧 Llamada al backend para solicitar recuperación
            await api.post("/auth/forgot-password", { email })
            setIsSubmitted(true)
        } catch (err: any) {
            console.error("Error requesting password reset:", err)
            setError("Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio de sesión
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Recuperar Contraseña</h1>
                    <p className="mt-2 text-muted-foreground">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                </div>

                {isSubmitted ? (
                    // ✅ Estado de éxito
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">¡Correo Enviado!</h3>
                        <p className="text-sm text-green-700 dark:text-green-400">
                            Si existe una cuenta asociada a <strong>{email}</strong>, recibirás las instrucciones en unos momentos.
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">
                            ¿No recibiste el correo? Revisa tu carpeta de spam o intenta nuevamente en unos minutos.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => setIsSubmitted(false)}
                        >
                            Intentar con otro correo
                        </Button>
                    </div>
                ) : (
                    // 📝 Formulario
                    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
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
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                        </Button>
                    </form>
                )}
            </div>
        </main>
    )
}
