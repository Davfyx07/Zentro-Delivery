// API Configuration for backend calls with cookie-based auth
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Envía cookies automáticamente
})

export const restaurantAPI = {
  // Public endpoints
  getAll: () => api.get('/api/restaurants'),
  getById: (id: number) => api.get(`/api/restaurants/${id}`),
  search: (keyword: string) => api.get(`/api/restaurants/search?keyword=${keyword}`),

  // Admin endpoints (owner)
  create: (data: any) => api.post('/api/admin/restaurants', data),
  update: (id: number, data: any) => api.put(`/api/admin/restaurants/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/restaurants/${id}`),
  updateStatus: (id: number) => api.put(`/api/admin/restaurants/${id}/status`),
  getByUser: () => api.get('/api/admin/restaurants/user'),
}

export const foodAPI = {
  // Public endpoints
  getByRestaurant: (restaurantId: number, params?: any) =>
    api.get(`/api/food/restaurant/${restaurantId}`, { params }),
  search: (keyword: string) => api.get(`/api/food/search?name=${keyword}`),

  // Admin endpoints (owner)
  create: (data: any) => api.post('/api/admin/food', data),
  delete: (id: number) => api.delete(`/api/admin/food/${id}`),
  updateAvailability: (id: number) => api.put(`/api/admin/food/${id}`),
}

export const cartAPI = {
  get: () => api.get('/api/cart'),
  addItem: (data: any) => api.put('/api/cart/add', data),
  updateItem: (data: any) => api.put('/api/cart-item/update', data),
  removeItem: (id: number) => api.delete(`/api/cart-item/${id}/remove`),
  clear: () => api.put('/api/cart/clear'),
}

export const orderAPI = {
  // Customer endpoints
  create: (data: any) => api.post('/api/order', data),
  getUserOrders: () => api.get('/api/order/user'),

  // Admin endpoints (owner)
  getRestaurantOrders: (restaurantId: number, status?: string) =>
    api.get(`/api/admin/order/restaurant/${restaurantId}`, { params: { order_status: status } }),
  updateStatus: (orderId: number, status: string) =>
    api.put(`/api/admin/order/${orderId}/${status}`),
}

export const categoryAPI = {
  create: (data: any) => api.post('/api/admin/category', data),
  getByRestaurant: () => api.get('/api/category/restaurant'),
}

export const ingredientAPI = {
  createCategory: (data: any) => api.post('/api/admin/ingredients/category', data),
  createItem: (data: any) => api.post('/api/admin/ingredients', data),
  updateStock: (id: number) => api.put(`/api/admin/ingredients/${id}/stock`),
  getCategories: (restaurantId: number) =>
    api.get(`/api/admin/ingredients/restaurant/${restaurantId}/category`),
  getItems: (restaurantId: number) =>
    api.get(`/api/admin/ingredients/restaurant/${restaurantId}/stock`),
}

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data: any) => api.put('/api/users/profile', data),
  uploadAvatar: (formData: FormData) => api.post('/api/users/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
}

export const addressAPI = {
  getAll: () => api.get('/api/addresses'),
  create: (data: any) => api.post('/api/addresses', data),
  update: (id: string, data: any) => api.put(`/api/addresses/${id}`, data),
  delete: (id: string) => api.delete(`/api/addresses/${id}`),
  setDefault: (id: string) => api.post(`/api/addresses/${id}/default`),
}

export default api