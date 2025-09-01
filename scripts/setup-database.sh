#!/bin/bash

# Setup script for Insider Risk Index database
# This script will start Docker containers, run migrations, and seed data

set -e  # Exit on any error

echo "🚀 Setting up Insider Risk Index database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Use docker-compose or docker compose
DOCKER_COMPOSE="docker compose"
if ! docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
fi

print_status "Using $DOCKER_COMPOSE for container management"

# Stop existing containers if they're running
print_status "Stopping existing containers..."
$DOCKER_COMPOSE down --remove-orphans || true

# Start PostgreSQL and Redis containers
print_status "Starting database containers..."
$DOCKER_COMPOSE up -d postgres redis

# Wait for PostgreSQL to be ready
print_status "Waiting for PostgreSQL to be ready..."
max_attempts=30
attempt=0

while ! docker exec insider-risk-postgres pg_isready -U insider_risk_user -d insider_risk_index > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -gt $max_attempts ]; then
        print_error "PostgreSQL failed to start after $max_attempts attempts"
        $DOCKER_COMPOSE logs postgres
        exit 1
    fi
    print_status "Waiting for PostgreSQL... (attempt $attempt/$max_attempts)"
    sleep 2
done

print_success "PostgreSQL is ready!"

# Wait for Redis to be ready
print_status "Waiting for Redis to be ready..."
max_attempts=15
attempt=0

while ! docker exec insider-risk-redis redis-cli ping > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -gt $max_attempts ]; then
        print_error "Redis failed to start after $max_attempts attempts"
        $DOCKER_COMPOSE logs redis
        exit 1
    fi
    print_status "Waiting for Redis... (attempt $attempt/$max_attempts)"
    sleep 1
done

print_success "Redis is ready!"

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    print_status "Creating .env.local from .env.example..."
    cp .env.example .env.local
    print_warning "Please review and update .env.local with your specific configuration"
fi

# Check if Node.js packages are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing Node.js dependencies..."
    npm install
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run database migrations
print_status "Running database migrations..."
npx prisma db push --accept-data-loss

# Seed the database with comprehensive data
print_status "Seeding database with comprehensive data..."
npx prisma db seed

# Start PgAdmin container
print_status "Starting PgAdmin..."
$DOCKER_COMPOSE up -d pgadmin

print_success "Database setup completed successfully!"
echo ""
print_status "🎯 Services are now running:"
echo "  📊 PostgreSQL: localhost:5432"
echo "  🔴 Redis: localhost:6379" 
echo "  🖥️  PgAdmin: http://localhost:5050"
echo "    - Email: admin@insiderisk.io"
echo "    - Password: admin_dev_password"
echo ""
print_status "🔧 Next steps:"
echo "  1. Review .env.local configuration"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Visit http://localhost:3000 to see the application"
echo ""
print_status "🛠️  Useful commands:"
echo "  - View database: npx prisma studio"
echo "  - Reset database: npm run db:reset"
echo "  - View logs: $DOCKER_COMPOSE logs [service-name]"
echo "  - Stop services: $DOCKER_COMPOSE down"