import Link from 'next/link'

export default function RestaurantsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* RestaurantCard components will go here */}
        <p className="text-gray-500">Loading restaurants...</p>
      </div>
    </div>
  )
}
