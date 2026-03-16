#!/bin/bash

# Script de instalación y configuración de Forecast Evolve API
# Autor: Claude
# Fecha: 2026-03-16

echo "🚀 Forecast Evolve API - Instalación Automatizada"
echo "=================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js encontrado: $NODE_VERSION${NC}"

# Verificar npm
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm encontrado: $NPM_VERSION${NC}"
echo ""

# Instalar dependencias
echo "📥 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Verificar archivo .env
echo "🔑 Verificando configuración..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado${NC}"
    echo "Copiando .env.example a .env..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales${NC}"
    echo ""
    echo "Variables que debes configurar:"
    echo "  - SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_KEY"
    echo "  - OPENAI_API_KEY"
    echo "  - JWT_SECRET"
    echo "  - JWT_REFRESH_SECRET"
    echo ""
else
    echo -e "${GREEN}✅ Archivo .env encontrado${NC}"
fi

# Compilar TypeScript
echo "🔨 Compilando TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al compilar TypeScript${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Compilación exitosa${NC}"
echo ""

# Resumen
echo "=================================================="
echo -e "${GREEN}✅ ¡Instalación completada!${NC}"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Configura tus credenciales en el archivo .env:"
echo "   nano .env"
echo ""
echo "2. Inicia la API en modo desarrollo:"
echo "   npm run dev"
echo ""
echo "3. O compila y ejecuta en producción:"
echo "   npm run build"
echo "   npm start"
echo ""
echo "4. Verifica que funciona:"
echo "   curl http://localhost:3001/health"
echo ""
echo "📚 Documentación:"
echo "   - INDEX.md           → Índice completo"
echo "   - QUICK_START.md     → Inicio rápido"
echo "   - README.md          → Documentación general"
echo "   - EXAMPLES.md        → Ejemplos de uso"
echo "   - API_KNOWLEDGE.md   → Conocimiento completo (para Claude)"
echo ""
echo "=================================================="
