# App | Backend API

A NestJS microservices architecture with API Gateway and Worker service, communicating via Redis transport and using PostgreSQL with MikroORM.

## Architecture

### 🌐 API Gateway (HTTP Service)

- **Entry Point**: `src/main.gateway.ts`
- **Port**: `3000` (configurable via `API_PORT`)
- **Purpose**: HTTP-facing service that handles frontend requests
- **Communication**: Forwards requests to Worker via Redis

### ⚙️ Worker Service (Background Microservice)

- **Entry Point**: `src/main.worker.ts`
- **Port**: None (Redis transport only)
- **Purpose**: Handles business logic, database operations, and background tasks
- **Communication**: Listens to Redis message patterns

### 🔗 Redis

- **Role**: Message broker for inter-service communication
- **Pattern**: Publish/Subscribe with message patterns
- **Transport**: TCP connection to Redis server

## Quick Reference

| Component         | Command                      | Port         | Description           |
| ----------------- | ---------------------------- | ------------ | --------------------- |
| **Both Services** | `pnpm dev`                   | 3000 + Redis | Run full system       |
| **API Gateway**   | `pnpm dev:gateway`           | 3000         | HTTP endpoints only   |
| **Worker**        | `pnpm dev:worker`            | Redis        | Background processing |
| **PostgreSQL**    | `docker-compose up postgres` | 5432         | Database              |
| **Redis**         | `docker-compose up redis`    | 6379         | Message broker        |

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- PostgreSQL database
- Redis server

### Quick Start

**Option 1: Using Docker (Recommended)**

1. **Start infrastructure services**:

```bash
docker-compose up -d
```

2. **Install dependencies** from the root of the monorepo:

```bash
cd ../..
pnpm install
```

3. **Set up environment variables**:

```bash
cd apps/backend
cp .env.example .env
# Default values work with docker-compose
```

4. **Run migrations**:

```bash
pnpm migration:create
pnpm migration:up
```

5. **Start both services**:

```bash
pnpm dev
```

**Option 2: Using Local Services**

1. **Install dependencies** from the root of the monorepo:

```bash
pnpm install
```

2. **Set up environment variables** - Copy the example and edit:

```bash
cd apps/backend
cp .env.example .env
# Edit .env with your database and Redis credentials
```

3. **Set up PostgreSQL** - Make sure it's running:

```bash
# Create the database if it doesn't exist
createdb app
```

4. **Generate and run migrations**:

```bash
# Generate initial migration from your entities
pnpm migration:create

# Run migrations to set up database schema
pnpm migration:up
```

5. **Start both services** (recommended):

```bash
pnpm dev
```

This will start both the API Gateway and Worker service concurrently.

**Or run services individually:**

```bash
# Start only the API Gateway (HTTP service)
pnpm dev:gateway

# Start only the Worker (background service)
pnpm dev:worker
```

The services will be available at:

- 🌐 **API Gateway**: `http://localhost:3000/api`
- ⚙️ **Worker Service**: Redis transport (no HTTP endpoint)

## Environment Variables

Create a `.env` file in the `apps/backend` directory:

### API Gateway Configuration

```env
API_PORT=3000           # HTTP port for the API Gateway
```

### Database Configuration (PostgreSQL)

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app
```

### Redis Configuration

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=          # Optional - leave empty if no password
```

### General Configuration

```env
NODE_ENV=development     # Options: development, production
```

## Available Scripts

### Development

```bash
pnpm dev              # Run both Gateway + Worker
pnpm dev:gateway      # Run only API Gateway
pnpm dev:worker       # Run only Worker service
```

### Production

```bash
pnpm build            # Build both services
pnpm start            # Run both services (production)
pnpm start:gateway    # Run only API Gateway (production)
pnpm start:worker     # Run only Worker service (production)
pnpm start:prod       # Run both with NODE_ENV=production
```

pnpm start:prod # Run both with NODE_ENV=production

````

### Database Migrations

```bash
pnpm migration:create   # Generate new migration
pnpm migration:up       # Run pending migrations
pnpm migration:down     # Rollback last migration
pnpm migration:list     # List all migrations
pnpm migration:pending  # Check pending migrations
````

### Testing

```bash
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:e2e           # Run e2e tests
pnpm lint               # Run linter
```

## API Endpoints

The API Gateway exposes the following REST endpoints:

### Links

- `GET /api/links` - Get all links
- `GET /api/links/:id` - Get a specific link
- `POST /api/links` - Create a new link
- `PUT /api/links/:id` - Update a link
- `DELETE /api/links/:id` - Delete a link

## How It Works

### Request Flow

1. **Frontend** sends HTTP request to **API Gateway** (`http://localhost:3000/api/links`)
2. **API Gateway** receives request in `LinksGatewayController`
3. **Gateway** sends message to **Worker** via Redis using `ClientProxy.send('links.findAll', {})`
4. **Redis** delivers message to **Worker Service**
5. **Worker** receives message in `LinksWorkerController` via `@MessagePattern('links.findAll')`
6. **Worker** executes business logic in `LinksService` (database operations)
7. **Worker** returns result via Redis
8. **Gateway** receives result and sends HTTP response to **Frontend**

### Message Patterns

The services communicate using these Redis message patterns:

- `links.create` - Create a new link
- `links.findAll` - Get all links
- `links.findOne` - Get a specific link
- `links.update` - Update a link
- `links.remove` - Delete a link

## Docker Setup (Optional)

If you don't have PostgreSQL or Redis locally:

```bash
docker-compose up -d

# Or individual commands:
# Start PostgreSQL
docker run -d \
  --name app-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=app \
  -p 5432:5432 \
  postgres:16-alpine

# Start Redis
docker run -d \
  --name app-redis \
  -p 6379:6379 \
  redis:7-alpine

```

## Project Structure

```
src/
├── main.gateway.ts              # API Gateway entry point (HTTP)
├── main.worker.ts               # Worker service entry point (Redis)
├── gateway.module.ts            # Gateway module configuration
├── worker.module.ts             # Worker module configuration
├── entities/
│   └── link.entity.ts           # MikroORM entities
├── links/
│   ├── links.gateway.controller.ts  # HTTP endpoints (Gateway)
│   ├── links.worker.controller.ts   # Message handlers (Worker)
│   └── links.service.ts             # Business logic + DB operations
└── migrations/                  # Database migrations
```
