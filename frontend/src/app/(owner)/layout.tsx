"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import type React from "react"
import { AdminSidebar } from "@/components/owner/admin-sidebar"

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { user, isInitialized } = useAuth()

    useEffect(() => {
        if (isInitialized && (!user || user.role !== "owner")) {
            router.push("/admin/login")
        }
    }, [user, isInitialized, router])

    // Show loading or nothing while checking auth
    if (!isInitialized || !user || user.role !== "owner") {
        return null
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
                <AdminSidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="container mx-auto p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
