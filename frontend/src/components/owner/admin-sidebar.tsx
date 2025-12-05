"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    Menu,
    Settings,
    LogOut,
    Store,
    Users,
    ChefHat
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Restaurantes",
        href: "/admin/restaurants",
        icon: Store,
    },
    {
        title: "Menú y Comida",
        href: "/menu",
        icon: UtensilsCrossed,
    },
    {
        title: "Pedidos",
        href: "/restaurant-orders",
        icon: ShoppingBag,
    },
    {
        title: "Categorías",
        href: "/admin/categories",
        icon: Menu,
    },
    {
        title: "Ingredientes",
        href: "/admin/ingredients",
        icon: ChefHat,
    },
    {
        title: "Usuarios",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Configuración",
        href: "/admin/settings",
        icon: Settings,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push("/admin/login")
    }

    return (
        <div className="flex flex-col h-full border-r bg-card text-card-foreground">
            <div className="p-6 border-b">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                        Z
                    </div>
                    <span>Zentro Admin</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.title}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    )
}
