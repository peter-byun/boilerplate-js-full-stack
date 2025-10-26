# App | Backend API

A bolierplate for a Full-Stack JavaScript Web App.

## The Stack

- NestJS
- MikroORM
- PostgreSQL
- Redis
- NextJS
- Docker
- pnpm

## Getting Started

### Prerequisites

- Node.js
- pnpm
- Docker: PostgreSQL, Redis

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

For more details, see documents below:

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [COMMANDS.md](./docs/COMMANDS.md)
