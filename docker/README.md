# Weather App - Docker Setup

## 🚀 Quick Start

```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📱 Access

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8001/api
- **MongoDB**: localhost:27017

## 🔧 Development

```bash
# Start only database for local development
docker-compose up mongodb -d

# Rebuild specific service
docker-compose up --build frontend

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec mongodb mongosh

# View real-time logs
docker-compose logs -f backend
```

## 🗄️ Database

- **Username**: admin
- **Password**: password123
- **Database**: weather_db

## 🛠️ Troubleshooting

```bash
# Remove all containers and volumes
docker-compose down -v
docker system prune -f

# Check health status
docker-compose exec backend curl http://localhost:8001/health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Reset everything
docker-compose down -v
docker-compose up --build -d
```

## 📊 Monitoring

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Container details
docker inspect weather-frontend
```