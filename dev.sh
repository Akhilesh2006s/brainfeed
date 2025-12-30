#!/bin/bash

# Development script to run both Next.js and Express servers

echo "🚀 Starting Brainfeed Development Servers..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Express Backend
echo -e "${BLUE}📡 Starting Express Backend (port 5000)...${NC}"
npm run dev:server &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start Next.js Frontend
echo -e "${GREEN}⚡ Starting Next.js Frontend (port 3000)...${NC}"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait

