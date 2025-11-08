"use client"

import { useState, useEffect } from "react"
import { Search, User, ShoppingCart, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { CartSidebar } from "./cart-sidebar"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user, logout } = useAuth()
  const { getItemCount } = useCart()
  const [itemCount, setItemCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setItemCount(getItemCount())
  }, [getItemCount])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleUserClick = () => {
    if (user) {
      router.push("/profile")
    } else {
      router.push("/login")
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="font-bold text-xl text-foreground dark:text-white hidden sm:inline">Zentro</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar restaurantes..."
                className="w-full px-4 py-2 rounded-full border-2 border-border dark:border-gray-700 bg-muted dark:bg-gray-800 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-muted-foreground dark:text-gray-400" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-muted dark:hover:bg-gray-800 rounded-full transition-colors text-foreground dark:text-white"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUserClick}
                  className="p-2 hover:bg-muted dark:hover:bg-gray-800 rounded-full transition-colors text-foreground dark:text-white"
                  title="Mi perfil"
                >
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-muted dark:hover:bg-gray-800 rounded-full transition-colors text-foreground dark:text-white"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="p-2 hover:bg-muted dark:hover:bg-gray-800 rounded-full transition-colors text-foreground dark:text-white">
                  <User className="w-5 h-5" />
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted dark:hover:bg-gray-800 rounded-full transition-colors text-foreground dark:text-white"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-border dark:border-gray-800">
            <div className="px-4 py-4 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full px-4 py-2 rounded-lg border-2 border-border dark:border-gray-700 bg-muted dark:bg-gray-800 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full text-left px-4 py-2 hover:bg-muted dark:hover:bg-gray-800 rounded-lg transition-colors text-foreground dark:text-white font-semibold"
              >
                Mi Carrito ({itemCount})
              </button>
              {user ? (
                <>
                  <Link href="/profile" className="block">
                    <button className="w-full text-left px-4 py-2 hover:bg-muted dark:hover:bg-gray-800 rounded-lg transition-colors text-foreground dark:text-white font-semibold">
                      Mi Perfil ({user.name})
                    </button>
                  </Link>
                  <Link href="/orders" className="block">
                    <button className="w-full text-left px-4 py-2 hover:bg-muted dark:hover:bg-gray-800 rounded-lg transition-colors text-foreground dark:text-white font-semibold">
                      Mis Órdenes
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400 font-semibold"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <button className="w-full text-left px-4 py-2 hover:bg-muted dark:hover:bg-gray-800 rounded-lg transition-colors text-foreground dark:text-white font-semibold">
                      Iniciar sesión
                    </button>
                  </Link>
                  <Link href="/signup" className="block">
                    <button className="w-full text-left px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary">
                      Crear cuenta
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
