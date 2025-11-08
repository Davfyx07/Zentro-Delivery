export default function RestaurantOrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Restaurant Orders</h1>
      
      {/* Filter tabs */}
      <div className="flex space-x-4 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">All</button>
        <button className="px-4 py-2 bg-gray-200 rounded">Pending</button>
        <button className="px-4 py-2 bg-gray-200 rounded">Out for Delivery</button>
        <button className="px-4 py-2 bg-gray-200 rounded">Delivered</button>
      </div>
      
      {/* Orders list */}
      <div className="space-y-4">
        <p className="text-gray-500">No orders to display</p>
      </div>
    </div>
  )
}
