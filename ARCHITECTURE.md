# 🏗️ ARQUITECTURA - Forecast Evolve API

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                  React + TypeScript + Vite                       │
│              http://localhost:5173                               │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP/REST
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FORECAST EVOLVE API                           │
│              Node.js + Express + TypeScript                      │
│                  http://localhost:3001                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ROUTES (Rutas HTTP)                                    │    │
│  │  ├── /api/auth      → Auth Routes                       │    │
│  │  ├── /api/deals     → Deals Routes                      │    │
│  │  ├── /api/contacts  → Contacts Routes                   │    │
│  │  ├── /api/ai        → AI Routes                         │    │
│  │  └── /api/...       → Other Routes                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                           │                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  MIDDLEWARE (Capas intermedias)                         │    │
│  │  ├── authenticate   → Verificar JWT                     │    │
│  │  ├── authorize      → Verificar roles                   │    │
│  │  ├── validate       → Validar datos (Joi)               │    │
│  │  ├── rateLimit      → Control de peticiones             │    │
│  │  └── errorHandler   → Manejo de errores                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                           │                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  CONTROLLERS (Controladores)                            │    │
│  │  ├── AuthController                                     │    │
│  │  ├── DealsController                                    │    │
│  │  ├── ContactsController                                 │    │
│  │  ├── AIController                                       │    │
│  │  └── ...                                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                           │                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  SERVICES (Lógica de negocio)                           │    │
│  │  ├── AuthService    → Autenticación, JWT                │    │
│  │  ├── DealsService   → CRUD deals, stats                 │    │
│  │  ├── ContactsService → CRUD contactos                   │    │
│  │  ├── AIService      → OpenAI integration                │    │
│  │  └── ...                                                │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐
│   SUPABASE      │  │   OPENAI API    │  │  AI REACHER      │
│   PostgreSQL    │  │   GPT-3.5       │  │  BACKEND         │
│   + Storage     │  │                 │  │  (Railway)       │
└─────────────────┘  └─────────────────┘  └──────────────────┘
```

---

## 🗂️ Estructura de Archivos Detallada

```
forecast-evolve-api/
│
├── 📁 src/                          # Código fuente TypeScript
│   │
│   ├── 📄 index.ts                  # Entry point - Servidor Express
│   │
│   ├── 📁 config/                   # Configuraciones
│   │   └── database.ts              # Cliente Supabase
│   │
│   ├── 📁 types/                    # Tipos TypeScript
│   │   └── index.ts                 # Interfaces y tipos
│   │
│   ├── 📁 utils/                    # Utilidades
│   │   ├── jwt.ts                   # Generación y verificación JWT
│   │   ├── password.ts              # Hash y comparación bcrypt
│   │   └── response.ts              # Helpers de respuesta HTTP
│   │
│   ├── 📁 middleware/               # Middlewares Express
│   │   ├── auth.ts                  # Autenticación JWT
│   │   └── validation.ts            # Validación con Joi
│   │
│   ├── 📁 services/                 # Lógica de negocio
│   │   ├── auth.service.ts          # Registro, login, tokens
│   │   ├── deals.service.ts         # CRUD deals, stats, export
│   │   ├── contacts.service.ts      # CRUD contactos, search
│   │   └── ai.service.ts            # Speech generation, chat
│   │
│   ├── 📁 controllers/              # Controladores HTTP
│   │   ├── auth.controller.ts       # Endpoints de autenticación
│   │   └── deals.controller.ts      # Endpoints de deals
│   │
│   └── 📁 routes/                   # Definición de rutas
│       ├── auth.routes.ts           # Rutas /api/auth/*
│       └── deals.routes.ts          # Rutas /api/deals/*
│
├── 📁 dist/                         # Código compilado JavaScript
│   └── (generado por tsc)
│
├── 📁 node_modules/                 # Dependencias npm
│
├── 📄 .env                          # Variables de entorno (SECRETO)
├── 📄 .env.example                  # Template de .env
├── 📄 .gitignore                    # Archivos ignorados por Git
├── 📄 package.json                  # Dependencias y scripts
├── 📄 tsconfig.json                 # Configuración TypeScript
│
├── 📄 README.md                     # Documentación general
├── 📄 API_KNOWLEDGE.md              # Conocimiento para Claude
├── 📄 QUICK_START.md                # Guía de inicio rápido
├── 📄 EXAMPLES.md                   # Ejemplos de uso
└── 📄 ARCHITECTURE.md               # Este archivo
```

---

## 🔄 Flujo de una Request HTTP

### Ejemplo: Crear un Deal

```
1. Frontend                          curl -X POST /api/deals
   │
   ▼
2. Express Server                    app.post('/api/deals', ...)
   │
   ▼
3. Route Handler                     dealsRoutes → router.post('/', ...)
   │
   ▼
4. Middleware Chain
   ├── authenticate()                Verifica JWT en header
   ├── authorize('seller')           Verifica rol del usuario
   └── validate(dealSchema)          Valida body con Joi
   │
   ▼
5. Controller                        dealsController.create(req, res)
   │
   ▼
6. Service                           dealsService.create(dealData, userId)
   │
   ▼
7. Database                          supabase.from('fe_deals').insert(...)
   │
   ▼
8. Response                          res.json({ success: true, data: deal })
```

---

## 🔐 Sistema de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│  REGISTRO DE USUARIO                                         │
└─────────────────────────────────────────────────────────────┘
    │
    ├─► POST /api/auth/register
    │    └─► { name, email, password, role }
    │
    ├─► AuthService.register()
    │    ├─► Verificar si email ya existe
    │    ├─► Hash password con bcrypt (10 rounds)
    │    ├─► Insertar en fe_users (approved=false si no es admin)
    │    └─► Generar JWT tokens
    │
    └─► Response: { user, tokens }


┌─────────────────────────────────────────────────────────────┐
│  LOGIN                                                       │
└─────────────────────────────────────────────────────────────┘
    │
    ├─► POST /api/auth/login
    │    └─► { email, password }
    │
    ├─► AuthService.login()
    │    ├─► Buscar usuario por email
    │    ├─► Verificar approved=true
    │    ├─► Comparar password con bcrypt
    │    └─► Generar JWT tokens
    │
    └─► Response: { user, tokens }
         ├─► accessToken (válido 24h)
         └─► refreshToken (válido 7d)


┌─────────────────────────────────────────────────────────────┐
│  USO DE TOKEN EN REQUESTS                                    │
└─────────────────────────────────────────────────────────────┘
    │
    ├─► GET /api/deals
    │    └─► Header: Authorization: Bearer {accessToken}
    │
    ├─► Middleware: authenticate()
    │    ├─► Extraer token del header
    │    ├─► Verificar firma JWT con JWT_SECRET
    │    ├─► Decodificar payload { userId, email, role }
    │    └─► Agregar a req.user
    │
    ├─► Middleware: authorize('seller')
    │    └─► Verificar que req.user.role == 'seller'
    │
    └─► Controller ejecuta lógica


┌─────────────────────────────────────────────────────────────┐
│  RENOVACIÓN DE TOKEN                                         │
└─────────────────────────────────────────────────────────────┘
    │
    ├─► POST /api/auth/refresh
    │    └─► { refreshToken }
    │
    ├─► Verificar refreshToken con JWT_REFRESH_SECRET
    │    └─► Si válido, generar nuevos tokens
    │
    └─► Response: { tokens }
```

---

## 🗄️ Modelo de Base de Datos

### Tablas en Supabase

```
fe_users
├── id (UUID, PK)
├── name (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── password (VARCHAR, bcrypt hash)
├── role (ENUM: admin, seller, presales)
├── approved (BOOLEAN)
└── created_at (TIMESTAMP)

fe_deals
├── id (UUID, PK)
├── company (VARCHAR)
├── project (VARCHAR)
├── stage (VARCHAR)
├── close_date (DATE)
├── amount (DECIMAL)
├── software (VARCHAR)
├── country (VARCHAR)
├── power_sponsor (VARCHAR)
├── sponsor (VARCHAR)
├── owner (VARCHAR)
├── owner_id (UUID, FK → fe_users.id)
├── next_steps (TEXT)
├── next_steps_date (DATE)
└── created_at (TIMESTAMP)

ai_reacher_contacts
├── id (UUID, PK)
├── nombre (VARCHAR)
├── cargo (VARCHAR)
├── empresa (VARCHAR)
├── industria (VARCHAR)
├── departamento (VARCHAR)
├── pais (VARCHAR)
├── tamano_empresa (VARCHAR)
├── email (VARCHAR)
├── telefono (VARCHAR)
├── linkedin (VARCHAR)
├── fuente (ARRAY)
├── estado (VARCHAR)
├── prioridad (VARCHAR)
├── account_owner (VARCHAR)
├── evolve_owner (VARCHAR)
└── created_at (TIMESTAMP)

presales_propuestas
├── id (UUID, PK)
├── cliente (VARCHAR)
├── empresa (VARCHAR)
├── contexto (TEXT)
├── prioridad (VARCHAR)
├── estado (VARCHAR)
├── creado_por (UUID, FK → fe_users.id)
├── asignado_a (UUID, FK → fe_users.id)
├── fecha_entrega (DATE)
├── archivo_url (VARCHAR)
├── archivo_nombre (VARCHAR)
├── archivo_tipo (VARCHAR)
├── archivo_size (INTEGER)
├── estado_poc (VARCHAR)
├── soe_status (VARCHAR)
└── created_at (TIMESTAMP)

proposal_hub_proposals
├── id (UUID, PK)
├── nombre (VARCHAR)
├── linea_negocio (VARCHAR)
├── subcategoria (VARCHAR)
├── industria_sugerida (VARCHAR)
├── descripcion (TEXT)
├── nivel_complejidad (VARCHAR)
├── tipo_cliente (VARCHAR)
├── archivo_url (VARCHAR)
├── version (VARCHAR)
├── tags (ARRAY)
├── descargas_count (INTEGER)
├── activa (BOOLEAN)
├── owner_id (UUID, FK → fe_users.id)
└── created_at (TIMESTAMP)

sales_interactions
├── id (UUID, PK)
├── contacto_id (UUID, FK → ai_reacher_contacts.id)
├── tipo (ENUM: llamada, whatsapp, email, reunion)
├── fecha (TIMESTAMP)
├── notas (TEXT)
├── resultado (TEXT)
├── proximo_paso (TEXT)
└── created_at (TIMESTAMP)
```

---

## 🔌 Integraciones Externas

### 1. Supabase
- **Uso**: Base de datos PostgreSQL + Storage
- **URL**: https://akxmcjfybmvlhqxqwmpe.supabase.co
- **SDK**: @supabase/supabase-js
- **Autenticación**: Service Role Key (server-side)

### 2. OpenAI
- **Uso**: Generación de sales speeches y chat
- **Modelo**: GPT-3.5 Turbo
- **Endpoint**: https://api.openai.com/v1/chat/completions
- **Temperatura**: 0.7
- **Max Tokens**: 300 (speech), 800 (chat)

### 3. AI Reacher Backend
- **Uso**: Búsqueda y enriquecimiento de contactos B2B
- **URL**: https://ai-reacher-backend-production.up.railway.app
- **Endpoints**:
  - POST /api/search/preview (gratis)
  - POST /api/search/reveal (pagado)
- **Fuentes**: Hunter.io, Apollo.io

---

## 📊 Cálculos y Métricas

### Pipeline Statistics

```typescript
// Probabilidad de cierre por etapa
const stageProbability = {
  'Prospecting': 0.1,        // 10%
  'Qualified': 0.2,          // 20%
  'Value Proposition': 0.4,  // 40%
  'Proposal': 0.6,           // 60%
  'Negotiation': 0.8,        // 80%
  'Closed Won': 1.0          // 100%
};

// Total pipeline = Suma de todos los amounts
total_pipeline = SUM(amount)

// Weighted pipeline = Suma de (amount × probability)
// Excluye Closed Won
weighted_pipeline = SUM(amount × stageProbability[stage])
                    WHERE stage != 'Closed Won'

// Revenue = Suma de deals ganados
revenue = SUM(amount) WHERE stage = 'Closed Won'

// Win rate = Closed Won / (Closed Won + Closed Lost)
win_rate = COUNT(Closed Won) / COUNT(Closed Won + Closed Lost)
```

---

## 🛡️ Seguridad

### Capas de Seguridad

1. **Helmet** - Headers de seguridad HTTP
2. **CORS** - Control de orígenes permitidos
3. **Rate Limiting** - 100 requests por 15 min
4. **JWT** - Tokens firmados con secret
5. **Bcrypt** - Hash de contraseñas (10 rounds)
6. **Joi** - Validación de inputs
7. **HTTPS** - En producción (recomendado)

### Variables Sensibles

```bash
# NUNCA commitear a Git
JWT_SECRET
JWT_REFRESH_SECRET
SUPABASE_SERVICE_KEY
OPENAI_API_KEY
```

---

## 🚀 Despliegue

### Opción 1: Railway

```bash
# 1. Instalar CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
railway up
```

### Opción 2: Vercel

```bash
# Requiere configuración adicional para Express
vercel --prod
```

### Opción 3: Heroku

```bash
# Procfile
web: npm start

# Deploy
git push heroku main
```

### Opción 4: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

---

## 📈 Escalabilidad

### Optimizaciones Futuras

1. **Cache con Redis**
   - Cache de queries frecuentes
   - Cache de estadísticas

2. **Database Indexing**
   - Índices en fe_deals(owner_id, stage, country)
   - Índices en ai_reacher_contacts(empresa, pais)

3. **Load Balancing**
   - Múltiples instancias de la API
   - Nginx como reverse proxy

4. **Monitoring**
   - Sentry para errores
   - DataDog para métricas
   - LogRocket para debugging

5. **CDN**
   - CloudFlare para archivos estáticos
   - Edge caching

---

**Creado**: 2026-03-16  
**Versión**: 1.0.0  
**Autor**: Claude + Javier Correa
