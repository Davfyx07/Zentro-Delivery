"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()
  
  // No mostrar el navbar en páginas de autenticación
  const hideNavbar = pathname === "/login" || pathname === "/signup"
  
  if (hideNavbar) {
    return null
  }
  
  return <Navbar />
}
