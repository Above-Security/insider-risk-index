#!/bin/bash

# Pre-build script to ensure OG images are generated
# This can be run before building the application

echo "🔧 Running pre-build tasks..."

# Check if OG images exist
if [ ! -f "public/og-image.png" ] || [ ! -f "public/og-image-2x.png" ]; then
  echo "📸 OG images not found. Generating..."
  npm run og:generate
else
  echo "✅ OG images already exist"
fi

echo "✨ Pre-build tasks complete!"