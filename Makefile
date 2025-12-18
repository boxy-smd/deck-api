.PHONY: help install dev build test clean docker-up docker-down db-setup

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	pnpm install

dev: ## Start development server
	pnpm dev

build: ## Build the application
	pnpm build

test: ## Run all tests
	pnpm test:all

test-unit: ## Run unit tests
	pnpm test:unit

test-e2e: ## Run E2E tests
	pnpm test:e2e

lint: ## Check code quality
	pnpm check

format: ## Format code
	pnpm format

clean: ## Clean build artifacts
	pnpm clean

docker-up: ## Start all Docker services
	pnpm docker:up

docker-down: ## Stop all Docker services
	pnpm docker:down

docker-logs: ## View Docker logs
	pnpm docker:logs

db-migrate: ## Run database migrations
	pnpm db:migrate

db-seed: ## Seed the database
	pnpm db:seed

db-setup: ## Setup database (migrate + seed)
	pnpm db:setup

db-studio: ## Open Drizzle Studio
	pnpm db:studio

setup: ## Complete environment setup
	@echo "🚀 Setting up Deck API..."
	pnpm install
	pnpm docker:dev
	@echo "⏳ Waiting for database..."
	@sleep 5
	pnpm db:setup
	@echo "✅ Setup complete!"

ci: ## Run CI checks locally
	pnpm lint:check
	pnpm typecheck
	pnpm test:all

deploy: build ## Build and prepare for deployment
	@echo "📦 Application built and ready for deployment"
