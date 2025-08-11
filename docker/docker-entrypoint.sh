#!/bin/bash
set -e

echo "🚀 Starting Weather App Backend..."

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB..."
while ! nc -z mongodb 27017; do
  sleep 1
done
echo "✅ MongoDB is ready!"

# Run database migrations if needed
echo "🗄️ Setting up database..."

# Start the application
echo "🌟 Starting FastAPI server..."
exec uvicorn server:app --host 0.0.0.0 --port 8001 --reload