<!--
  README actualizado: versión  en español
  - Encabezado como en la imagen de ejemplo (sin porcentajes)
  - Resumen, tecnologías usadas y planificadas
  - Instrucciones rápidas de instalación y ejecución
-->

# ZENTRO-DELIVERY

_Deliver Excellence, Elevate Every Bite Instantly_

<!-- Header tipo tarjeta (imagen/badges similar a la captura, sin porcentajes) -->

<p align="center">
  <strong style="font-size:2.2rem">ZENTRO-DELIVERY</strong><br>
  <em>Deliver Excellence, Elevate Every Bite Instantly</em>
</p>

<p align="center">
  <!-- Badges representativos (sin porcentajes) -->
  <img alt="Java" src="https://img.shields.io/badge/Java-17%2B-blue?logo=java" />
  <img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=spring" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img alt="Postgres" src="https://img.shields.io/badge/Postgres-15-blue?logo=postgresql" />
  <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-3.4.0-blue?logo=tailwindcss" />
  <img alt="Maven" src="https://img.shields.io/badge/Maven-3.8-orange?logo=apachemaven" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-auth-yellow?logo=jsonwebtokens" />
  <img alt="Axios" src="https://img.shields.io/badge/Axios-0.27-blue?logo=axios" />
</p>

---

## Descripción

Aplicación full-stack para pedidos de comida: backend en Java + Spring Boot y frontend en Next.js (React + TypeScript). El repositorio contiene código para desplegar y desarrollar la API y la app web (cliente). Este README está en español y resume lo que ya usa el proyecto y lo que se planea integrar.

## Resumen técnico (actual y planeado)

Tecnologías actuales:
- Backend: Java 17+ / Spring Boot, Maven, JWT, JPA/Hibernate
- Base de datos: PostgreSQL
- Frontend: Next.js (App Router), React, TypeScript, TailwindCSS
- Herramientas: ESLint, Axios, Turbopack (dev), npm

Tecnologías/planteamientos a usar o considerar:
- Docker y docker-compose para desarrollo y despliegue
- CI/CD (GitHub Actions) para pruebas y deploy automático
- Redis (cache / sesiones) y RabbitMQ (cola de procesos) si hacen falta
- Monitoreo básico (Prometheus / Grafana) y logging centralizado

## Vista rápida: ejecutar localmente

Siguientes instrucciones asumen que estás en Windows (PowerShell). Ajusta comandos para Linux/macOS si hace falta.

1) Clona el repositorio

```powershell
git clone https://github.com/Davfyx07/Zentro-Delivery.git
cd Zentro-Delivery
```

2) Backend (Spring Boot)

- Configura la base de datos PostgreSQL y actualiza `backend/src/main/resources/application.properties` o usa variables de entorno.

Ejemplo mínimo en `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/zentro_restaurant
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

Para ejecutar en desarrollo (desde la raíz del repo):

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

La API quedará en: http://localhost:8080

3) Frontend (Next.js)

```powershell
cd frontend
npm install
npm run dev
```

La app de cliente queda en: http://localhost:3000

Variables de entorno recomendadas (archivo `frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Estructura principal del proyecto

`/backend` - Spring Boot API (controladores, servicios, repositorios, seguridad JWT)

`/frontend` - Next.js app (app router, componentes, hooks, estilos)

Revisa las carpetas `src/main/java/com/...` y `frontend/src` para más detalles.

## Endpoints principales (resumen)

- Autenticación: `/auth/signup`, `/auth/signin`
- Restaurantes: `/api/restaurants`, `/api/restaurants/{id}`
- Comida: `/api/food/restaurant/{id}`
- Carrito: `/api/cart`, `/api/cart/add`, `/api/cart-item/{id}/remove`
- Pedidos: `/api/order`, `/api/order/user`, endpoints admin para gestión

> Nota: La API completa y rutas exactas están en los controladores dentro de `backend/src/main/java`.

## Scripts útiles

Backend (PowerShell):

```powershell
cd backend
.\mvnw.cmd spring-boot:run     # ejecutar en dev
.\mvnw.cmd clean package       # compilar empaquetar
.\mvnw.cmd test                # ejecutar tests
```

Frontend:

```powershell
cd frontend
npm run dev     # desarrollo
npm run build   # build producción
npm run start   # iniciar prod
npm run lint    # lint
```

## Recomendaciones rápidas

- Añadir `docker-compose` con servicios: app, db (postgres), redis (opcional).
- Añadir GitHub Actions para build/test en cada PR.
- Mantener las variables sensibles fuera del repo (usar `.env` o secretos del proveedor).

## Cómo contribuir

1. Crea una rama: `git checkout -b feature/mi-cambio`
2. Haz commits claros y pequeños
3. Abre PR hacia `main` y describe el cambio

## Recursos

- Next.js: https://nextjs.org/docs
- Spring Boot: https://spring.io/projects/spring-boot
- PostgreSQL: https://www.postgresql.org/
- TailwindCSS: https://tailwindcss.com/

---

© Davfyx07

