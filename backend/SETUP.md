# Backend Setup Requirements

## Required Software

### Java Development Kit (JDK)
- **Version**: JDK 21
- **Download**: https://www.oracle.com/java/technologies/downloads/#java21
- **Alternative**: OpenJDK 21 from https://adoptium.net/
- **Verify installation**:
  ```bash
  java -version
  javac -version
  ```

### PostgreSQL
- **Version**: PostgreSQL 18.0 or higher
- **Download**: https://www.postgresql.org/download/
- **Verify**: Open pgAdmin or run `psql --version`

### Maven (Optional - included via wrapper)
- Maven 3.8+ is included as `mvnw.cmd` (Windows) or `mvnw` (Linux/Mac)
- **Manual install** (optional): https://maven.apache.org/download.cgi

### Git
- **Download**: https://git-scm.com/downloads
- **Verify**: `git --version`

## Installation Steps

### 1. Clone & Navigate
```bash
git clone https://github.com/Davfyx07/Zentro-Restaurant.git
cd Zentro-Restaurant/backend
```

### 2. Configure PostgreSQL Database

#### Create Database
```sql
-- Open pgAdmin or psql
CREATE DATABASE zentro_restaurant;
```

#### Create User (optional, if not using default postgres user)
```sql
CREATE USER zentro_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE zentro_restaurant TO zentro_user;
```

### 3. Configure Application Properties

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/zentro_restaurant
spring.datasource.username=postgres
spring.datasource.password=Admin777

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Server Configuration
server.port=8080

# JWT Configuration (already in JwtConstant.java)
# SECRET_KEY: ZentroRestaurantSecureSecretKeyForJWT2025MinimumLengthRequired
# Expiration: 86400000 (1 day)
```

### 4. Install Dependencies & Run

#### Windows
```bash
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

#### Linux/Mac
```bash
./mvnw clean install
./mvnw spring-boot:run
```

Application runs on: **http://localhost:8080**

## Dependencies (from pom.xml)

### Main Dependencies
- **Spring Boot**: 3.5.6
  - spring-boot-starter-web
  - spring-boot-starter-data-jpa
  - spring-boot-starter-security
  
- **Database**
  - postgresql (runtime)
  
- **Security**
  - io.jsonwebtoken:jjwt-api:0.11.5
  - io.jsonwebtoken:jjwt-impl:0.11.5
  - io.jsonwebtoken:jjwt-jackson:0.11.5
  
- **Development Tools**
  - lombok (optional, compileOnly)
  - spring-boot-devtools (optional)
  
- **Testing**
  - spring-boot-starter-test

### Java Version
```xml
<properties>
    <java.version>21</java.version>
</properties>
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/
│   │   │   ├── config/
│   │   │   │   ├── AppConfig.java              # Security configuration
│   │   │   │   ├── JwtConstant.java            # JWT constants
│   │   │   │   ├── JwtProvider.java            # JWT token generation
│   │   │   │   └── JwtTokenValidator.java      # JWT validation filter
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java         # /auth/signup, /auth/signin
│   │   │   │   ├── AdminRestaurantController.java
│   │   │   │   ├── RestaurantController.java
│   │   │   │   ├── AdminFoodController.java
│   │   │   │   ├── FoodController.java
│   │   │   │   ├── CartController.java
│   │   │   │   ├── OrderController.java
│   │   │   │   ├── AdminOrderController.java
│   │   │   │   ├── CategoryController.java
│   │   │   │   ├── IngredientController.java
│   │   │   │   └── UserController.java
│   │   │   ├── model/
│   │   │   │   ├── User.java
│   │   │   │   ├── Restaurant.java
│   │   │   │   ├── Food.java
│   │   │   │   ├── Cart.java
│   │   │   │   ├── CartItem.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderItem.java
│   │   │   │   ├── Category.java
│   │   │   │   ├── IngredientsItem.java
│   │   │   │   ├── IngredientCategory.java
│   │   │   │   ├── Address.java
│   │   │   │   ├── ContactInformation.java
│   │   │   │   └── USER_ROLE.java
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── RestaurantRepository.java
│   │   │   │   ├── FoodRepository.java
│   │   │   │   ├── CartRepository.java
│   │   │   │   ├── CartItemRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── OrderItemRepository.java
│   │   │   │   ├── CategoryRepository.java
│   │   │   │   ├── IngredientItemRepository.java
│   │   │   │   ├── IngredientCategoryRepository.java
│   │   │   │   └── AddressRepository.java
│   │   │   ├── service/
│   │   │   │   ├── UserService.java + UserServiceImp.java
│   │   │   │   ├── RestaurantService.java + RestaurantServiceImp.java
│   │   │   │   ├── FoodService.java + FoodServiceImp.java
│   │   │   │   ├── CartService.java + CartServiceImp.java
│   │   │   │   ├── OrderService.java + OrderServiceImp.java
│   │   │   │   ├── CategoryService.java + CategoryServiceImp.java
│   │   │   │   ├── IngredientsService.java + IngredientServiceImp.java
│   │   │   │   └── CustomerUserDetailsService.java
│   │   │   ├── request/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── CreateRestaurantRequest.java
│   │   │   │   ├── CreateFoodRequest.java
│   │   │   │   ├── AddCartItemRequest.java
│   │   │   │   ├── UpdateCartItemRequest.java
│   │   │   │   ├── OrderRequest.java
│   │   │   │   ├── IngredientRequest.java
│   │   │   │   └── IngredientCategoryRequest.java
│   │   │   ├── response/
│   │   │   │   ├── AuthResponse.java
│   │   │   │   └── MessageResponse.java
│   │   │   └── ZentroRestaurant/
│   │   │       └── ZentroRestaurantApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── target/                     # Compiled files (gitignored)
├── pom.xml                     # Maven dependencies
└── mvnw.cmd / mvnw            # Maven wrapper
```

## Environment Setup

### Windows Environment Variables (if needed)
```
JAVA_HOME=C:\Program Files\Java\jdk-21
Path=%JAVA_HOME%\bin
```

### Database Connection Test
```bash
psql -U postgres -d zentro_restaurant
```

## Common Maven Commands

```bash
# Clean build
.\mvnw.cmd clean

# Install dependencies
.\mvnw.cmd install

# Run application
.\mvnw.cmd spring-boot:run

# Run tests
.\mvnw.cmd test

# Package as JAR
.\mvnw.cmd package

# Skip tests during build
.\mvnw.cmd install -DskipTests
```

## Testing API Endpoints

### Using Thunder Client / Postman

#### 1. Signup
```http
POST http://localhost:8080/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "ROLE_CUSTOMER"
}
```

#### 2. Signin
```http
POST http://localhost:8080/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes JWT token - use in Authorization header for protected endpoints.

## Troubleshooting

### Port 8080 already in use
```bash
# Find process
netstat -ano | findstr :8080

# Kill process
taskkill /PID <PID_NUMBER> /F
```

### Database connection error
- Verify PostgreSQL is running
- Check credentials in application.properties
- Ensure database exists

### Clean Maven cache
```bash
.\mvnw.cmd clean
Remove-Item target -Recurse -Force
```

### Lombok not working
- Install Lombok plugin for your IDE
- Enable annotation processing in IDE settings

## Production Deployment

### Build JAR
```bash
.\mvnw.cmd clean package -DskipTests
```

JAR file created in: `target/zentro-restaurant-0.0.1-SNAPSHOT.jar`

### Run JAR
```bash
java -jar target/zentro-restaurant-0.0.1-SNAPSHOT.jar
```

### Deploy Options
- Railway: https://railway.app/
- Render: https://render.com/
- Heroku: https://heroku.com/
- AWS Elastic Beanstalk
- Docker + any cloud provider
