import type React from "react"
import { AdminSidebar } from "@/components/owner/admin-sidebar"

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
