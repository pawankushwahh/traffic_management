#!/bin/bash

echo "Starting build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Navigate to frontend and install dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps

# Build frontend
echo "Building frontend..."
CI=false npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "Error: Build directory not found!"
    exit 1
fi

if [ ! -f "build/index.html" ]; then
    echo "Error: index.html not found in build directory!"
    exit 1
fi

echo "Frontend build completed successfully!"

# Return to root
cd ..

# Run verification
echo "Running build verification..."
node verify-build.js
