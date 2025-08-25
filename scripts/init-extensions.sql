-- PostgreSQL extensions for enhanced functionality
-- This file is executed when the PostgreSQL container starts

-- Enable UUID generation functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable additional text search capabilities
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Enable PostGIS for geographic data (if needed for future features)
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enable pg_trgm for similarity queries
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable pgcrypto for hashing and cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create database-level indexes for common queries
-- These will be applied after Prisma migrations

COMMENT ON EXTENSION "uuid-ossp" IS 'Generate universally unique identifiers';
COMMENT ON EXTENSION "unaccent" IS 'Text search dictionary that removes accents';
COMMENT ON EXTENSION "pg_trgm" IS 'Text similarity measurement and index searching';
COMMENT ON EXTENSION "pgcrypto" IS 'Cryptographic functions for data security';