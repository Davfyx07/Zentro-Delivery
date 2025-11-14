import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ConditionalNavbar } from "@/components/conditional-navbar"
import { AuthInitializer } from "@/components/auth-initializer"
import { ThemeProvider } from "@/providers/theme-provider"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zentro - Comida a Domicilio",
  description: "La mejor plataforma de entrega de comida",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* Inicializar sesión desde cookie */}
            <AuthInitializer />
            <ConditionalNavbar />
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}