#!/bin/bash

echo "Starting Designer Project..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd server && npm install
cd ..

# Install frontend dependencies  
echo "Installing frontend dependencies..."
cd src && npm install
cd ..

# Start backend server in background
echo "Starting backend server..."
cd server && npm start &
BACKEND_PID=$!

# Start frontend dev server
echo "Starting frontend dev server..."
cd src && npm run serve

# Clean up on exit
trap 'kill $BACKEND_PID' EXIT