"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, X, Upload, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    cuisineType: z.string().min(2, "Tipo de cocina requerido"),
    openingHours: z.string().min(2, "Horario requerido"),
    address: z.object({
        title: z.string().min(2, "Título de dirección requerido"),
        address: z.string().min(5, "Dirección detallada requerida"),
    }),
    contactInformation: z.object({
        email: z.string().email("Email inválido"),
        mobile: z.string().min(10, "Móvil inválido"),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
    }),
    images: z.array(z.string()).min(1, "Sube al menos una imagen"),
})

interface RestaurantFormProps {
    initialData?: any
    onSuccess?: () => void
}

export function RestaurantForm({ initialData, onSuccess }: RestaurantFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isUploading, setIsUploading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            cuisineType: "",
            openingHours: "",
            address: {
                title: "",
                address: "",
            },
            contactInformation: {
                email: "",
                mobile: "",
                twitter: "",
                instagram: "",
            },
            images: [],
        },
    })

    // Manejador de subida de imágenes
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        const uploadedUrls: string[] = []

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const formData = new FormData()
                formData.append("file", file)
                formData.append("folder", "restaurants")

                const response = await api.post("/api/upload/image", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })

                uploadedUrls.push(response.data.imageUrl)
            }

            const currentImages = form.getValues("images")
            form.setValue("images", [...currentImages, ...uploadedUrls])

        } catch (error) {
            console.error("Upload error", error)
            toast({
                title: "Error al subir imagen",
                description: "No se pudieron subir algunas imágenes",
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
        }
    }

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images")
        form.setValue("images", currentImages.filter((_, i) => i !== index))
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (initialData?.id) {
                await api.put(`/api/admin/restaurants/${initialData.id}`, values)
                toast({ title: "Restaurante actualizado" })
            } else {
                await api.post("/api/admin/restaurants", values)
                toast({ title: "Restaurante creado exitosamente" })
            }

            router.refresh()
            if (onSuccess) onSuccess()
        } catch (error: any) {
            console.error(error)
            toast({
                title: "Error",
                description: error.response?.data?.message || "Algo salió mal",
                variant: "destructive",
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Restaurante</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. El Buen Sabor" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cuisineType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Cocina</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. Mexicana, Italiana..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="openingHours"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Horario de Apertura</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. Lun-Dom: 9am - 10pm" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contactInformation.email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email de Contacto</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="contacto@restaurante.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contactInformation.mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono / Móvil</FormLabel>
                                <FormControl>
                                    <Input placeholder="+1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe tu restaurante..." className="h-24" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ubicación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="address.title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título de Ubicación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Sede Central" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address.address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección Completa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Av. Principal #123, Ciudad" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Redes Sociales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="contactInformation.instagram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instagram</FormLabel>
                                    <FormControl>
                                        <Input placeholder="@restaurante" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactInformation.twitter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Twitter (X)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="@restaurante" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <FormLabel>Imágenes del Restaurante</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {form.watch("images").map((url, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                                <img src={url} alt={`Restaurant ${index}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg aspect-square cursor-pointer hover:bg-muted/50 transition-colors">
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Subir Imagen</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                            />
                        </label>
                    </div>
                    <FormMessage>
                        {form.formState.errors.images?.message}
                    </FormMessage>
                </div>

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isUploading}>
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                        </>
                    ) : (
                        initialData ? "Actualizar Restaurante" : "Crear Restaurante"
                    )}
                </Button>
            </form>
        </Form>
    )
}
