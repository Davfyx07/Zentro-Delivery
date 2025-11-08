// Types based on backend models

export interface User {
  id: number
  fullName: string
  email: string
  role: 'ROLE_CUSTOMER' | 'ROLE_OWNER' | 'ROLE_ADMIN'
  favorites: RestaurantDto[]
  addresses: Address[]
}

export interface Restaurant {
  id: number
  owner: User
  name: string
  description: string
  cuisineType: string
  address: Address
  contactInformation: ContactInformation
  openingHours: string
  images: string[]
  registrationDate: string
  open: boolean
  foods: Food[]
}

export interface RestaurantDto {
  id: number
  title: string
  images: string[]
  description: string
}

export interface Food {
  id: number
  name: string
  description: string
  price: number
  foodCategory: Category
  images: string[]
  available: boolean
  restaurant: Restaurant
  isVegetarian: boolean
  isSeasonal: boolean
  ingredients: IngredientsItem[]
  creationDate: string
}

export interface Category {
  id: number
  name: string
  restaurant: Restaurant
}

export interface Address {
  id: number
  streetAddress: string
  city: string
  stateProvince: string
  postalCode: string
  country: string
}

export interface ContactInformation {
  email: string
  mobile: string
  twitter?: string
  instagram?: string
}

export interface Cart {
  id: number
  customer: User
  total: number
  items: CartItem[]
}

export interface CartItem {
  id: number
  cart: Cart
  food: Food
  quantity: number
  ingredients: string[]
  totalPrice: number
}

export interface Order {
  id: number
  customer: User
  restaurant: Restaurant
  totalAmount: number
  orderStatus: 'PENDING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'COMPLETED'
  cratedAt: string
  deliveryAddress: Address
  items: OrderItem[]
  totalItem: number
  totalPrice: number
}

export interface OrderItem {
  id: number
  food: Food
  quantity: number
  totalPrice: number
  ingredients: string[]
}

export interface IngredientsItem {
  id: number
  name: string
  category: IngredientCategory
  restaurant: Restaurant
  inStocke: boolean
}

export interface IngredientCategory {
  id: number
  name: string
  restaurant: Restaurant
  ingredients: IngredientsItem[]
}

// Request DTOs
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  fullName: string
  email: string
  password: string
  role: 'ROLE_CUSTOMER' | 'ROLE_OWNER'
}

export interface CreateRestaurantRequest {
  name: string
  description: string
  cuisineType: string
  address: Address
  contactInformation: ContactInformation
  openingHours: string
  images: string[]
}

export interface CreateFoodRequest {
  name: string
  description: string
  price: number
  category: Category
  restaurantId: number
  images: string[]
  isVegetarian: boolean
  isSeasonal: boolean
  ingredients: IngredientsItem[]
}

export interface AddCartItemRequest {
  foodId: number
  quantity: number
  ingredients: string[]
}

export interface UpdateCartItemRequest {
  cartItemId: number
  quantity: number
}

export interface OrderRequest {
  restaurantId: number
  deliveryAddress: Address
}

// Response DTOs
export interface AuthResponse {
  jwt: string
  message: string
  role: string
}

export interface MessageResponse {
  message: string
}
