# Weather App - Docker Management

.PHONY: help build up down logs clean reset health

help:
	@echo "Weather App Docker Commands:"
	@echo "  make build    - Build all containers"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make logs     - Show logs"
	@echo "  make clean    - Remove containers and images"
	@echo "  make reset    - Complete reset (containers + volumes)"
	@echo "  make health   - Check service health"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "🌐 Frontend: http://localhost"
	@echo "🔧 Backend: http://localhost:8001/api"
	@echo "🗄️ MongoDB: localhost:27017"

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down --rmi all
	docker system prune -f

reset:
	docker-compose down -v
	docker system prune -a -f --volumes
	@echo "🧹 Complete reset done!"

health:
	@echo "🔍 Checking service health..."
	@docker-compose ps
	@echo "\n🏥 Backend health:"
	@docker-compose exec -T backend curl -s http://localhost:8001/health || echo "❌ Backend not healthy"
	@echo "\n🗄️ MongoDB health:"
	@docker-compose exec -T mongodb mongosh --quiet --eval "db.adminCommand('ping')" || echo "❌ MongoDB not healthy"

dev-frontend:
	docker-compose up mongodb backend -d
	@echo "✅ Backend services running for frontend development"
	@echo "🔧 Start frontend with: cd frontend && npm start"

dev-backend:
	docker-compose up mongodb -d
	@echo "✅ Database running for backend development"
	@echo "🔧 Start backend with: cd backend && uvicorn server:app --reload"