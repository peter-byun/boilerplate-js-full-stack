## Architecture

### 🌐 API Gateway (HTTP Service)

- **Role**: HTTP-facing service that handles frontend requests
- **Entry Point**: `src/main.gateway.ts`
- **Port**: `3001` (configurable via `API_PORT`)
- **Communication**: Forwards requests to Worker via Redis

### ⚙️ Worker Service (Background Microservice)

- **Role**: Handles business logic, database operations, and background tasks
- **Entry Point**: `src/main.worker.ts`
- **Port**: None (Redis transport only)
- **Communication**: Listens to Redis message patterns

### 🔗 Redis

- **Role**: Message broker for inter-service communication
- **Port**: `6379` (configurable via `REDIS_HOST` and `REDIS_PORT`)
- **Communication**: Used by both Gateway and Worker for sending/receiving messages

## 📁 File Structure

```
apps/backend/
├── src/
│   ├── main.gateway.ts              # 🌐 API Gateway entry (HTTP server)
│   ├── main.worker.ts               # ⚙️ Worker entry (Redis microservice)
│   ├── gateway.module.ts            # Gateway module config
│   ├── worker.module.ts             # Worker module config
│   ├── entities/
│   │   └── link.entity.ts           # MikroORM entity
│   └── links/
│       ├── links.gateway.controller.ts  # HTTP REST endpoints
│       ├── links.worker.controller.ts   # Redis message handlers
│       └── links.service.ts             # Business logic + DB
├── docker-compose.yml               # PostgreSQL + Redis setup
├── .env.example                     # Environment template
└── README.md                        # Full documentation
```

## 🔄 Data Flow

```
# With Redis Message Bus
Frontend Request
    ↓
API Gateway (HTTP :3001)
    ↓ (ClientProxy.send)
Redis Message Bus (:6379)
    ↓ (@MessagePattern)
Worker Service (No HTTP)
    ↓ (A Service)
PostgreSQL Database (:5432)
    ↓
Response flows back same path

# Or, without Redis
Frontend Request
    ↓
API Gateway (HTTP :3001)
    ↓ (Direct Service Call)
Worker Service (No HTTP)
    ↓ (A Service)
PostgreSQL Database (:5432)
    ↓
Response flows back same path
```
