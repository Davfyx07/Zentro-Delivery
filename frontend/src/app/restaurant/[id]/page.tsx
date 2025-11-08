export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Restaurant #{params.id}</h1>
      {/* Restaurant details and menu will go here */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          {/* Food items grid */}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Cart</h2>
          {/* Cart component */}
        </div>
      </div>
    </div>
  )
}
