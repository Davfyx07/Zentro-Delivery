const categories = [
  { name: "Pizza", icon: "🍕" },
  { name: "Hamburguesas", icon: "🍔" },
  { name: "Tacos", icon: "🌮" },
  { name: "Burritos", icon: "🌯" },
  { name: "Sushi", icon: "🍣" },
  { name: "Pollo", icon: "🍗" },
  { name: "Ensaladas", icon: "🥗" },
]

export function CategoriesSection() {
  return (
    <section className="py-12 md:py-16 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground dark:text-white mb-8 text-balance">Categorías Populares</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 border border-border dark:border-gray-700"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <p className="font-semibold text-sm text-foreground dark:text-white">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
