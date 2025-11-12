"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryToken = searchParams?.get("token") || ""
  const { toast } = useToast()

  const [token, setToken] = useState<string>(queryToken)
  const [showTokenInput, setShowTokenInput] = useState<boolean>(!queryToken)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    // If token arrives later (rare), set it and hide manual input
    if (queryToken) {
      setToken(queryToken)
      setShowTokenInput(false)
    }
  }, [queryToken])

  const validate = () => {
    const e: string[] = []
    if (!token || token.trim().length === 0) e.push("Ingresa el código de restablecimiento")
    if (!password || password.length < 8) e.push("La contraseña debe tener al menos 8 caracteres")
    if (password !== confirm) e.push("Las contraseñas no coinciden")
    setErrors(e)
    return e.length === 0
  }

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`
      await axios.post(apiUrl, { token, newPassword: password })
      toast({ title: "Contraseña actualizada", description: "Ya puedes iniciar sesión con tu nueva contraseña" })
      router.push("/login")
    } catch (err: any) {
      console.error("Reset error:", err)
      const msg = err?.response?.data || err?.message || "No se pudo actualizar la contraseña"
      toast({ title: "Error", description: String(msg), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Restablecer contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Pega el código que recibiste por email o haz clic en "Ingresar código" para escribirlo manualmente.</p>

            {!showTokenInput && (
              <div className="mb-4">
                <Label className="text-xs">Código</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={token} readOnly className="flex-1" />
                  <Button variant="ghost" onClick={() => setShowTokenInput(true)}>Ingresar código</Button>
                </div>
              </div>
            )}

            {showTokenInput && (
              <div className="space-y-3 mb-4">
                <div>
                  <Label htmlFor="token">Código de recuperación</Label>
                  <Input id="token" value={token} onChange={(ev) => setToken(ev.target.value)} placeholder="Código que recibiste por email" />
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <Label htmlFor="password">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Escribe tu nueva contraseña"
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm">Confirmar contraseña</Label>
                <Input id="confirm" type={showPassword ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repite la contraseña" />
              </div>

              {errors.length > 0 && (
                <div className="space-y-1">
                  {errors.map((err, i) => (
                    <p key={i} className="form-error">{err}</p>
                  ))}
                </div>
              )}

              <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Aplicando..." : "Establecer nueva contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
