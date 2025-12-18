#!/bin/bash

set -e

echo "🚀 Setting up Deck API development environment..."

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Run: npm install -g pnpm"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting."; exit 1; }

echo "✅ All required tools are installed"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
else
    echo "✅ .env file already exists"
fi

# Start PostgreSQL
echo "🐘 Starting PostgreSQL with Docker..."
pnpm docker:dev

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations
echo "🗄️  Running database migrations..."
pnpm db:migrate

# Seed database
echo "🌱 Seeding database..."
pnpm db:seed

echo ""
echo "✅ Setup complete! You can now run:"
echo ""
echo "  pnpm dev              # Start development server"
echo "  pnpm test             # Run unit tests"
echo "  pnpm test:e2e         # Run E2E tests"
echo "  pnpm db:studio        # Open Drizzle Studio"
echo ""
