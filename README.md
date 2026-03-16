# 🚀 Forecast Evolve API

API REST completa para **Forecast Evolve** - Plataforma integral de gestión de ventas y comercial.

## 📋 Descripción

Esta API proporciona todos los endpoints necesarios para gestionar el ecosistema completo de Forecast Evolve, incluyendo:

- 🎯 **Forecast Evolve**: Gestión de pipeline de ventas y oportunidades
- 🔍 **AI Reacher**: Prospección inteligente de contactos B2B
- 🤖 **AI Sales Copilot**: Asistente de ventas con IA (GPT-3.5)
- 📄 **Pre-Sales App**: Gestión de propuestas comerciales
- 📚 **Proposal Hub**: Biblioteca de plantillas reutilizables

## 🛠️ Tecnologías

- **Node.js** + **Express** + **TypeScript**
- **Supabase** (PostgreSQL + Storage)
- **JWT** para autenticación
- **OpenAI API** (GPT-3.5 Turbo)
- **Bcrypt** para encriptación de contraseñas
- **Joi** para validación de datos

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd forecast-evolve-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://akxmcjfybmvlhqxqwmpe.supabase.co
SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_KEY=tu_supabase_service_key

# JWT
JWT_SECRET=tu_secret_key_super_seguro
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=tu_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=tu_openai_api_key

# AI Reacher Backend
AI_REACHER_BACKEND_URL=https://ai-reacher-backend-production.up.railway.app

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 4. Compilar TypeScript

```bash
npm run build
```

### 5. Iniciar el servidor

**Modo desarrollo** (con hot-reload):
```bash
npm run dev
```

**Modo producción**:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3001`

## 📚 Endpoints de la API

### 🔐 Autenticación

#### Registrar usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "seller"
}
```

#### Iniciar sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "seller",
      "approved": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### Renovar token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Obtener perfil del usuario autenticado
```http
GET /api/auth/me
Authorization: Bearer {accessToken}
```

---

### 💼 Deals (Oportunidades)

#### Listar deals (con paginación y filtros)
```http
GET /api/deals?page=1&limit=50&sortBy=created_at&sortOrder=desc&stage=Qualified&country=Chile
Authorization: Bearer {accessToken}
```

**Parámetros de consulta:**
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 50)
- `sortBy`: Campo para ordenar (default: created_at)
- `sortOrder`: Orden asc/desc (default: desc)
- `stage`: Filtrar por etapa
- `country`: Filtrar por país
- `software`: Filtrar por software
- `owner_id`: Filtrar por dueño

#### Obtener deal por ID
```http
GET /api/deals/{id}
Authorization: Bearer {accessToken}
```

#### Crear nuevo deal
```http
POST /api/deals
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "company": "Acme Corp",
  "project": "Implementación CRM",
  "stage": "Qualified",
  "close_date": "2026-06-30",
  "amount": 50000,
  "software": "DataWorks",
  "country": "Chile",
  "power_sponsor": "CEO Juan Pérez",
  "sponsor": "CTO María González",
  "owner": "Vendedor 1",
  "next_steps": "Agendar demo",
  "next_steps_date": "2026-03-20"
}
```

#### Actualizar deal
```http
PATCH /api/deals/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "stage": "Proposal",
  "amount": 55000
}
```

#### Eliminar deal
```http
DELETE /api/deals/{id}
Authorization: Bearer {accessToken}
```

#### Obtener estadísticas del pipeline
```http
GET /api/deals/stats?ownerId=uuid
Authorization: Bearer {accessToken}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_pipeline": 500000,
      "weighted_pipeline": 250000,
      "revenue": 100000,
      "deals_by_stage": {
        "Qualified": 150000,
        "Proposal": 200000,
        "Closed Won": 100000
      },
      "count_by_stage": {
        "Qualified": 5,
        "Proposal": 3,
        "Closed Won": 2
      }
    }
  }
}
```

#### Exportar deals a CSV
```http
GET /api/deals/export?stage=Qualified
Authorization: Bearer {accessToken}
```

---

## 🔑 Autenticación y Autorización

### JWT Tokens

La API usa JWT (JSON Web Tokens) para autenticación. Cada endpoint protegido requiere un token en el header:

```http
Authorization: Bearer {accessToken}
```

### Roles de Usuario

- **admin**: Acceso completo a todos los recursos
- **seller**: Acceso a deals, contactos, AI copilot
- **presales**: Acceso a propuestas y proposal hub

### Flujo de Autenticación

1. **Registro**: El usuario se registra con `/api/auth/register`
2. **Aprobación**: Admin aprueba al usuario (excepto si el rol es admin)
3. **Login**: Usuario inicia sesión con `/api/auth/login`
4. **Token**: Recibe `accessToken` (24h) y `refreshToken` (7d)
5. **Uso**: Incluye `accessToken` en header `Authorization` en cada request
6. **Renovación**: Cuando expira, usa `/api/auth/refresh` con `refreshToken`

---

## 🗄️ Base de Datos (Supabase)

### Tablas principales:

- `fe_users`: Usuarios del sistema
- `fe_deals`: Oportunidades de venta
- `ai_reacher_contacts`: Contactos prospectados
- `sales_interactions`: Interacciones de ventas
- `presales_propuestas`: Propuestas comerciales
- `presales_comentarios`: Comentarios en propuestas
- `proposal_hub_proposals`: Plantillas de propuestas
- `proposal_hub_favoritos`: Favoritos de usuarios
- `proposal_hub_downloads`: Registro de descargas
- `fe_config`: Configuraciones globales
- `fe_catalog`: Catálogos (países, software, etc.)

---

## 🚀 Deploy

### Opción 1: Railway

1. Conecta tu repositorio a Railway
2. Configura las variables de entorno
3. Railway detectará automáticamente Node.js y ejecutará `npm start`

### Opción 2: Vercel

```bash
vercel --prod
```

### Opción 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 🧪 Testing

```bash
npm test
```

---

## 📝 Estructura del Proyecto

```
forecast-evolve-api/
├── src/
│   ├── config/           # Configuraciones (DB, etc.)
│   ├── controllers/      # Controladores de rutas
│   ├── middleware/       # Middlewares (auth, validation)
│   ├── routes/           # Definición de rutas
│   ├── services/         # Lógica de negocio
│   ├── types/            # Tipos de TypeScript
│   ├── utils/            # Utilidades (JWT, password, response)
│   └── index.ts          # Entry point
├── dist/                 # Código compilado
├── .env                  # Variables de entorno (no commitear)
├── .env.example          # Template de variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con **bcrypt** (10 rounds)
- ✅ Autenticación con **JWT**
- ✅ **Helmet** para headers de seguridad
- ✅ **CORS** configurado
- ✅ **Rate limiting** (100 requests/15min)
- ✅ Validación de datos con **Joi**
- ✅ **HTTPS** recomendado en producción

---

## 📧 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.

---

## 📄 Licencia

MIT
