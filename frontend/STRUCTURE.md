# Frontend Structure - Zentro Restaurant

## 📁 Estructura completa del proyecto

```
frontend/src/
├── app/                                    # App Router (Next.js 14)
│   ├── page.tsx                           # Home page → /
│   ├── layout.tsx                         # Layout global (Navbar)
│   ├── globals.css                        # Estilos globales
│   │
│   ├── (auth)/                            # 🔐 Grupo de autenticación
│   │   ├── login/
│   │   │   └── page.tsx                  # Login page → /login
│   │   └── signup/
│   │       └── page.tsx                  # Signup page → /signup
│   │
│   ├── restaurant/                         # 🍽️ Restaurantes públicos
│   │   ├── page.tsx                      # Lista → /restaurant
│   │   └── [id]/
│   │       └── page.tsx                  # Detalle → /restaurant/123
│   │
│   ├── (customer)/                        # 👤 Rutas de clientes
│   │   ├── cart/
│   │   │   └── page.tsx                  # Carrito → /cart
│   │   ├── orders/
│   │   │   └── page.tsx                  # Mis órdenes → /orders
│   │   └── profile/
│   │       └── page.tsx                  # Perfil → /profile
│   │
│   └── (owner)/                           # 🏪 Panel de dueños
│       ├── dashboard/
│       │   └── page.tsx                  # Dashboard → /dashboard
│       ├── menu/
│       │   └── page.tsx                  # Gestión menú → /menu
│       └── restaurant-orders/
│           └── page.tsx                  # Órdenes → /restaurant-orders
│
├── components/                             # Componentes reutilizables
│   ├── navbar.tsx                         # Navbar principal
│   ├── footer.tsx                         # Footer (crear)
│   │
│   ├── ui/                                # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   │
│   ├── auth/                              # 🔐 Componentes de auth
│   │   ├── LoginForm.tsx                 # (crear)
│   │   ├── SignupForm.tsx                # (crear)
│   │   └── ProtectedRoute.tsx            # (crear)
│   │
│   ├── restaurant/                         # 🍽️ Componentes de restaurantes
│   │   ├── RestaurantCard.tsx            # (crear)
│   │   ├── RestaurantList.tsx            # (crear)
│   │   ├── RestaurantDetail.tsx          # (crear)
│   │   └── RestaurantSearch.tsx          # (crear)
│   │
│   ├── food/                              # 🍔 Componentes de comida
│   │   ├── FoodCard.tsx                  # (crear)
│   │   ├── FoodList.tsx                  # (crear)
│   │   ├── FoodDetail.tsx                # (crear)
│   │   └── FoodFilter.tsx                # (crear)
│   │
│   ├── cart/                              # 🛒 Componentes de carrito
│   │   ├── CartItem.tsx                  # (crear)
│   │   ├── CartSummary.tsx               # (crear)
│   │   └── CheckoutForm.tsx              # (crear)
│   │
│   ├── order/                             # 📦 Componentes de órdenes
│   │   ├── OrderCard.tsx                 # (crear)
│   │   ├── OrderStatus.tsx               # (crear)
│   │   └── OrderTracking.tsx             # (crear)
│   │
│   └── owner/                             # 🏪 Componentes de owner
│       ├── DashboardStats.tsx            # (crear)
│       ├── MenuItemForm.tsx              # (crear)
│       ├── OrderManagement.tsx           # (crear)
│       └── RestaurantForm.tsx            # (crear)
│
├── lib/                                    # Utilidades
│   ├── api.ts                             # ✅ API client (axios)
│   └── utils.ts                           # Helpers generales
│
├── types/                                  # TypeScript types
│   └── index.ts                           # ✅ Todos los tipos del backend
│
└── store/                                  # Estado global (Zustand)
    ├── authStore.ts                       # ✅ Auth state
    ├── cartStore.ts                       # (crear) Cart state
    └── restaurantStore.ts                 # (crear) Restaurant state
```

## 🎯 Mapeo Backend → Frontend

### Backend Controllers → Frontend Pages

| Backend Endpoint | Frontend Page | Descripción |
|-----------------|---------------|-------------|
| `POST /auth/signup` | `/signup` | Registro de usuarios |
| `POST /auth/signin` | `/login` | Login de usuarios |
| `GET /api/restaurants` | `/restaurant` | Lista de restaurantes |
| `GET /api/restaurants/{id}` | `/restaurant/[id]` | Detalle de restaurante |
| `GET /api/cart` | `/cart` | Ver carrito |
| `POST /api/order` | `/cart` (checkout) | Crear orden |
| `GET /api/order/user` | `/orders` | Mis órdenes |
| `GET /api/admin/restaurants/user` | `/dashboard` | Panel owner |
| `POST /api/admin/food` | `/menu` | Gestión menú |
| `GET /api/admin/order/restaurant/{id}` | `/restaurant-orders` | Órdenes del restaurante |

### Backend Models → Frontend Types

| Backend Model | Frontend Type | Archivo |
|--------------|---------------|---------|
| `User.java` | `User` | `types/index.ts` |
| `Restaurant.java` | `Restaurant` | `types/index.ts` |
| `Food.java` | `Food` | `types/index.ts` |
| `Cart.java` | `Cart` | `types/index.ts` |
| `Order.java` | `Order` | `types/index.ts` |
| `Category.java` | `Category` | `types/index.ts` |

## 🔧 Próximos pasos

### 1. Instalar dependencias faltantes
```bash
npm install axios zustand
npm install @tanstack/react-query  # Para data fetching
```

### 2. Crear componentes base
- LoginForm, SignupForm
- RestaurantCard, FoodCard
- CartItem, OrderCard

### 3. Conectar con backend
- Configurar axios interceptors
- Implementar autenticación JWT
- Hacer fetching de datos

### 4. Implementar rutas protegidas
- Middleware para auth
- Redirect si no está autenticado
- Permisos por rol (CUSTOMER, OWNER)

## 📝 Convenciones de código

### Nombres de archivos
- Componentes: `PascalCase.tsx` → `RestaurantCard.tsx`
- Páginas: `page.tsx` (reservado Next.js)
- Utils: `camelCase.ts` → `api.ts`

### Nombres de carpetas
- Rutas: `kebab-case` → `restaurant-orders/`
- Grupos: `(parentesis)` → `(auth)/`, `(customer)/`
- Dinámicas: `[corchetes]` → `[id]/`

### Imports
```tsx
// Absolute imports con alias @
import Navbar from '@/components/navbar'
import { api } from '@/lib/api'
import { User } from '@/types'
```

## 🎨 Estilos

- **TailwindCSS** para utilidades
- **shadcn/ui** para componentes base
- Clases: `className="bg-white p-4 rounded-lg"`

## 🚀 Comandos

```bash
npm run dev        # Desarrollo (Turbopack)
npm run build      # Build producción
npm run start      # Servidor producción
npm run lint       # ESLint
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
