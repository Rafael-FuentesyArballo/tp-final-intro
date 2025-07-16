
BACKEND_DIR = ./backend

.PHONY: all dev docker-up docker-down install-deps clean


all: install-deps docker-up dev


install-deps:
	@echo "Instalando dependencias de Node.js en $(BACKEND_DIR)..."
	@cd $(BACKEND_DIR) && npm install


dev:
	@echo "Iniciando el servidor de desarrollo en $(BACKEND_DIR)..."
	@cd $(BACKEND_DIR) && npm run dev


docker-up:
	@echo "Levantando los servicios de Docker Compose en $(BACKEND_DIR)..."
	@cd $(BACKEND_DIR) && docker compose up -d


docker-down:
	@echo "Deteniendo y eliminando los servicios de Docker Compose en $(BACKEND_DIR)..."
	@cd $(BACKEND_DIR) && docker compose down

clean: docker-down
	@echo "Limpieza completada."