import dynamic from "next/dynamic"

// Dynamically import the client component and disable SSR to avoid prerender errors
const ResetPasswordClient = dynamic(() => import("./ResetPasswordClient"), { ssr: false })

export default function Page() {
  return <ResetPasswordClient />
}
