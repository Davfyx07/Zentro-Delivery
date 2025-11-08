"use client"

import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const scrollToRestaurants = () => {
    document.getElementById('restaurants-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <section className="pt-24 pb-12 md:pb-16 bg-gradient-to-b from-accent via-background to-background dark:from-gray-800 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white text-balance leading-tight">
              Pide tus platos favoritos en minutos
            </h1>
            <p className="text-lg text-muted-foreground dark:text-gray-300">
              Descubre los mejores restaurantes de tu ciudad y disfruta de comida deliciosa entregada en tu puerta.
            </p>
            <button 
              onClick={scrollToRestaurants}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-secondary transition-colors shadow-lg hover:shadow-xl"
            >
              Explorar restaurantes
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Image */}
          <div className="relative h-96 md:h-full rounded-2xl overflow-hidden shadow-xl">
            <img src="/hero-food.jpeg" alt="Platos deliciosos" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
   )
}