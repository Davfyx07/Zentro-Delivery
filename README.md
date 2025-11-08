# Zentro Restaurant - Food Ordering Platform

Full-stack food ordering application with Spring Boot backend and Next.js frontend.

## 📋 Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.5.6**
- **PostgreSQL 18.0**
- **JWT Authentication**
- **Maven**

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **React 19**
- **Turbopack**

## 🚀 Prerequisites

### System Requirements
- **Node.js**: v18 or higher
- **Java**: JDK 21
- **PostgreSQL**: 18.0 or higher
- **Maven**: 3.8+ (included via wrapper)
- **Git**: Latest version

### Installation Links
- Node.js: https://nodejs.org/
- Java JDK 21: https://www.oracle.com/java/technologies/downloads/#java21
- PostgreSQL: https://www.postgresql.org/download/
- Git: https://git-scm.com/downloads

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/Davfyx07/Zentro-Restaurant.git
cd Zentro-Restaurant
```

### 2. Backend Setup

#### Configure Database
1. Create PostgreSQL database:
```sql
CREATE DATABASE zentro_restaurant;
```

2. Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/zentro_restaurant
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

#### Run Backend
```bash
cd backend
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Backend runs on: **http://localhost:8080**

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Run Development Server
```bash
npm run dev
```

Frontend runs on: **http://localhost:3000**

## 📦 Dependencies

### Backend Dependencies
See `backend/pom.xml` for complete list. Main dependencies:
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- PostgreSQL Driver
- JWT (jjwt) 0.11.5
- Lombok
- Hibernate

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.0.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^3.4.1",
    "postcss": "^8",
    "autoprefixer": "^10.0.1",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^8",
    "eslint-config-next": "15.0.0"
  }
}
```

### Optional Frontend Additions
```bash
# Material-UI (if following MUI tutorial)
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# OR shadcn/ui (modern alternative)
npx shadcn@latest init

# Axios for API calls
npm install axios

# React Query for data fetching
npm install @tanstack/react-query

# State management
npm install zustand
```

## 🗂️ Project Structure

```
Zentro-Restaurant/
├── backend/                    # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/
│   │   │   │   ├── config/    # Security, JWT config
│   │   │   │   ├── controller/# REST endpoints
│   │   │   │   ├── model/     # JPA entities
│   │   │   │   ├── repository/# Data access
│   │   │   │   ├── service/   # Business logic
│   │   │   │   └── request/   # DTOs
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── mvnw.cmd
│
└── frontend/                   # Next.js App
    ├── src/
    │   ├── app/               # App Router pages
    │   ├── components/        # React components
    │   └── lib/              # Utils, API clients
    ├── public/               # Static files
    ├── package.json
    └── next.config.ts

```

## 🔐 Environment Variables

### Backend
Create `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/zentro_restaurant
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

### Frontend
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📝 Available Scripts

### Backend
```bash
mvnw.cmd spring-boot:run    # Run development server
mvnw.cmd clean install      # Build project
mvnw.cmd test              # Run tests
```

### Frontend
```bash
npm run dev        # Development server (with Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- POST `/auth/signup` - Register new user
- POST `/auth/signin` - Login user

### Restaurants
- GET `/api/restaurants` - Get all restaurants
- GET `/api/restaurants/{id}` - Get restaurant by ID
- POST `/api/admin/restaurants` - Create restaurant (Admin)
- PUT `/api/admin/restaurants/{id}` - Update restaurant (Admin)

### Food
- GET `/api/food/restaurant/{id}` - Get restaurant food
- POST `/api/admin/food` - Create food item (Admin)
- PUT `/api/admin/food/{id}` - Update food availability (Admin)

### Cart
- GET `/api/cart` - Get user cart
- PUT `/api/cart/add` - Add item to cart
- PUT `/api/cart-item/update` - Update cart item
- DELETE `/api/cart-item/{id}/remove` - Remove cart item

### Orders
- POST `/api/order` - Create order
- GET `/api/order/user` - Get user orders
- GET `/api/admin/order/restaurant/{id}` - Get restaurant orders (Admin)
- PUT `/api/admin/order/{id}/{status}` - Update order status (Admin)

## 🧪 Testing

### Backend
```bash
cd backend
mvnw.cmd test
```

### Frontend
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Backend
- Railway: https://railway.app/
- Render: https://render.com/
- Heroku: https://heroku.com/

### Frontend
- Vercel: https://vercel.com/ (Recommended)
- Netlify: https://netlify.com/

## 📚 Resources

- Next.js Docs: https://nextjs.org/docs
- Spring Boot Docs: https://spring.io/projects/spring-boot
- TailwindCSS: https://tailwindcss.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/

## 👤 Author

**Davfyx07**
- GitHub: [@Davfyx07](https://github.com/Davfyx07)

## 📄 License

This project is for portfolio purposes.
