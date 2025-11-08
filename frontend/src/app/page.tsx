import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { RestaurantsSection } from "@/components/restaurants-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <RestaurantsSection />
      <Footer />
    </main>
  )
}