#!/bin/bash

# Reset script for Insider Risk Index database
# This script will reset the database and reseed with fresh data

set -e  # Exit on any error

echo "🔄 Resetting Insider Risk Index database..."

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

# Confirm with user
read -p "⚠️  This will DELETE ALL DATA in the database. Are you sure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Database reset cancelled."
    exit 0
fi

# Check if containers are running
if ! docker ps | grep -q insider-risk-postgres; then
    print_error "PostgreSQL container is not running. Please run './scripts/setup-database.sh' first."
    exit 1
fi

# Reset the database schema
print_status "Resetting database schema..."
npx prisma migrate reset --force --skip-seed

# Push the schema again
print_status "Applying database schema..."
npx prisma db push --accept-data-loss

# Seed with fresh data
print_status "Seeding database with fresh data..."
npx prisma db seed

print_success "Database reset completed successfully!"
print_status "The database now contains fresh seed data."
print_status "Run 'npx prisma studio' to view the data in a browser."