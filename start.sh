#!/bin/bash

# Weather App Docker Startup Script
echo "🌦️  Weather App - Docker Setup"
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "📋 Installation guide: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "📋 Installation guide: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Create necessary directories
echo "📁 Creating required directories..."
mkdir -p docker/ssl logs

# Set permissions
chmod +x docker/docker-entrypoint.sh

# Pull base images to speed up build
echo "📦 Pulling base images..."
docker pull node:18-alpine
docker pull nginx:alpine
docker pull python:3.11-slim
docker pull mongo:7.0

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Health check
echo "🏥 Checking service health..."
for i in {1..30}; do
    if docker-compose exec -T backend curl -f http://localhost:8001/health >/dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend health check failed"
        echo "📋 Check logs with: docker-compose logs backend"
        exit 1
    fi
    sleep 2
done

# Test MongoDB connection
echo "🗄️  Testing MongoDB..."
if docker-compose exec -T mongodb mongosh --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
    echo "✅ MongoDB is healthy!"
else
    echo "❌ MongoDB connection failed"
    echo "📋 Check logs with: docker-compose logs mongodb"
fi

# Test frontend
echo "🌐 Testing frontend..."
if curl -f http://localhost >/dev/null 2>&1; then
    echo "✅ Frontend is accessible!"
else
    echo "❌ Frontend is not accessible"
    echo "📋 Check logs with: docker-compose logs frontend"
fi

echo ""
echo "🎉 Weather App is ready!"
echo "================================"
echo "🌐 Frontend:    http://localhost"
echo "🔧 Backend API: http://localhost:8001/api"
echo "🗄️ MongoDB:     localhost:27017"
echo ""
echo "📋 Useful commands:"
echo "   docker-compose logs -f     # View logs"
echo "   docker-compose ps          # Check status"
echo "   docker-compose down        # Stop services"
echo "   make help                  # See all commands"
echo ""
echo "📖 For more info, see: docker/README.md"