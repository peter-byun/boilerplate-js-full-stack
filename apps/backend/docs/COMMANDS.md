## Commands

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

### Database Migrations

```bash
pnpm migration:create   # Generate new migration
pnpm migration:up       # Run pending migrations
pnpm migration:down     # Rollback last migration
pnpm migration:list     # List all migrations
pnpm migration:pending  # Check pending migrations
```

### Testing

```bash
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:e2e           # Run e2e tests
pnpm lint               # Run linter
```

## Docker Commands

```bash
# Start both PostgreSQL and Redis
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
