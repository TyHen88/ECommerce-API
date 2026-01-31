# E-commerce REST API

A production-ready E-commerce REST API built with Node.js, Express, TypeScript, Prisma, and PostgreSQL. This API follows clean architecture principles, implements best practices, and includes advanced features like payment processing, event-driven architecture, and caching.

## 🏗️ Architecture

This project follows a **Clean Architecture** pattern with clear separation of concerns:

```
src/
├── config/           # Configuration files (database, env, stripe, kafka, redis)
├── modules/          # Feature modules (auth, product, category, order)
│   ├── auth/        # Authentication & authorization
│   ├── product/     # Product CRUD operations
│   ├── category/    # Category management
│   ├── order/       # Order processing with Stripe & Kafka
│   └── user/        # User repository
├── shared/          # Shared utilities and middleware
│   ├── errors/      # Custom error classes
│   ├── middleware/  # Error handling, validation, security
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
└── __tests__/       # Test files
```

## ✨ Features

### Core Features
- ✅ **User Authentication** - JWT-based authentication with bcrypt password hashing
- ✅ **Product Management** - Full CRUD operations with Redis caching
- ✅ **Category Management** - Category CRUD with product relationships
- ✅ **Order Processing** - Order creation with inventory management

### Advanced Features
- ✅ **Payment Integration** - Stripe payment intent creation
- ✅ **Event-Driven Architecture** - Kafka event publishing for order-created events
- ✅ **Caching** - Redis caching for product list and detail
- ✅ **Security** - Rate limiting, CORS, Helmet, input validation
- ✅ **API Documentation** - Swagger/OpenAPI documentation
- ✅ **Testing** - Unit and integration tests with Jest
- ✅ **CI/CD** - GitHub Actions pipeline

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- PostgreSQL 15+
- Redis 7+
- Kafka (optional, for event publishing)
- Stripe account (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"

   # Server
   PORT=3000
   NODE_ENV=development

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d

   # Redis
   REDIS_URL=redis://localhost:6379

   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

   # Kafka
   KAFKA_BROKERS=localhost:9092
   KAFKA_CLIENT_ID=ecommerce-api

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Setup database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run build
   npm start
   ```

## 📚 API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (cached)
- `GET /api/products/:id` - Get product by ID (cached)
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Orders
- `POST /api/orders` - Create a new order (with Stripe payment intent)
- `GET /api/orders` - Get all orders (user's orders or all for admin)
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status (Admin only)

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🛠️ Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Run Prisma Studio (database GUI)
npm run prisma:studio
```

## 📦 Database Schema

The database includes the following models:
- **User** - User accounts with authentication
- **Product** - Product catalog with categories
- **Category** - Product categories
- **Order** - Customer orders
- **OrderItem** - Order line items

See `prisma/schema.prisma` for detailed schema definitions.

## 🔄 Event-Driven Architecture

When an order is created, an event is published to Kafka on the `order-created` topic. This allows for:
- Order processing workflows
- Inventory management
- Notification systems
- Analytics

## 💳 Payment Processing

Orders automatically create a Stripe payment intent. The payment intent ID is stored with the order and can be used to complete the payment on the frontend.

## 🚦 Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `KAFKA_BROKERS` | Kafka broker addresses | No |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment (development/production) | No |

## ▲ Deploy on Vercel

The API is configured for [Vercel](https://vercel.com) serverless deployment:

1. **Connect the repo** – Import the project from GitHub in [Vercel](https://vercel.com/new).
2. **Environment variables** – In Project Settings → Environment Variables, add:
   - `DATABASE_URL` – PostgreSQL connection string (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/storage/postgres))
   - `JWT_SECRET` – Strong secret for JWT signing
   - `REDIS_URL` – Redis URL (optional; use [Upstash](https://upstash.com) for serverless Redis)
   - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` – If using payments
   - `CORS_ORIGIN` – Allowed frontend origin (e.g. `https://your-app.vercel.app`)
3. **Database** – Run migrations against your production DB before or after first deploy (e.g. `npx prisma migrate deploy` locally with production `DATABASE_URL`, or in a CI step).
4. **Deploy** – Push to the connected branch; Vercel builds with `prisma generate && npm run build` and runs the Express app as a serverless function.

**Notes:** Swagger is disabled in production. Health check: `GET /health`. If `prisma generate` fails on Vercel, move `prisma` from `devDependencies` to `dependencies` in `package.json`.

## 🏭 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong, unique values for `JWT_SECRET`
3. Configure proper CORS origins
4. Use a production PostgreSQL database
5. Setup Redis cluster for high availability
6. Configure Kafka cluster for event streaming
7. Enable HTTPS
8. Setup monitoring and logging

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.

