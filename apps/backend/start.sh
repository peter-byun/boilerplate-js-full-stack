#!/bin/bash

# App Backend - Quick Start Script
# This script helps you get the backend up and running quickly

set -e

echo "🎵 App Backend - Quick Start"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Using default values."
else
    echo "✅ .env file already exists."
fi

echo ""
echo "🐳 Starting infrastructure services (PostgreSQL + Redis)..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 3

# Check if database exists
echo ""
echo "🗄️  Checking database..."
if docker exec app-postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw app; then
    echo "✅ Database 'app' exists."
else
    echo "📝 Database 'app' not found, creating..."
    docker exec app-postgres psql -U postgres -c "CREATE DATABASE app;"
    echo "✅ Database created."
fi

# Check for migrations
echo ""
echo "🔄 Checking migrations..."
if [ -d "src/migrations" ] && [ "$(ls -A src/migrations)" ]; then
    echo "📋 Running pending migrations..."
    pnpm migration:up
else
    echo "⚠️  No migrations found. You may need to create initial migration:"
    echo "   pnpm migration:create"
fi

echo ""
echo "🚀 Starting backend services..."
echo ""
echo "   🌐 API Gateway will run on: http://localhost:3000/api"
echo "   ⚙️  Worker Service will connect to Redis"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start both services
pnpm dev
