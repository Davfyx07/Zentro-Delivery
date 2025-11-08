export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart items list */}
          <p className="text-gray-500">Your cart is empty</p>
        </div>
        <div>
          {/* Order summary and checkout */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            {/* Summary details */}
          </div>
        </div>
      </div>
    </div>
  )
}
