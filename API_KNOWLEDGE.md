# 🧠 DOCUMENTO DE CONOCIMIENTO PERMANENTE - FORECAST EVOLVE API

> **PROPÓSITO**: Este documento contiene el conocimiento completo de la API de Forecast Evolve para que Claude pueda interactuar con la aplicación en cualquier momento sin olvidar cómo funciona.

---

## 📍 UBICACIÓN DEL PROYECTO

**Ruta completa**: `/Users/javiercorrea/forecast-evolve-api`

**Frontend relacionado**: `/Users/javiercorrea/forecast-evolve`

---

## 🎯 ¿QUÉ ES FORECAST EVOLVE?

**Forecast Evolve** es una plataforma integral de ventas (Sales Suite) que combina 5 aplicaciones:

1. **Forecast Evolve** - CRM y gestión de pipeline de ventas
2. **AI Reacher** - Prospección inteligente de contactos B2B
3. **AI Sales Copilot** - Asistente de ventas con IA (GPT-3.5)
4. **Pre-Sales App** - Gestión de propuestas comerciales
5. **Proposal Hub** - Biblioteca de plantillas de propuestas

---

## 🏗️ ARQUITECTURA COMPLETA

### Stack Tecnológico
- **Backend API**: Node.js + Express + TypeScript (este proyecto)
- **Frontend**: React 18 + TypeScript + Vite
- **Base de Datos**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **IA**: OpenAI GPT-3.5 Turbo
- **Autenticación**: JWT + Bcrypt

### Servicios Externos
1. **Supabase**: `https://akxmcjfybmvlhqxqwmpe.supabase.co`
2. **AI Reacher Backend**: `https://ai-reacher-backend-production.up.railway.app`
3. **OpenAI API**: GPT-3.5 Turbo para speeches y chat

---

## 🔑 CREDENCIALES Y ACCESO

### Variables de Entorno Críticas

```bash
# Ubicación del archivo
/Users/javiercorrea/forecast-evolve-api/.env

# Variables principales
SUPABASE_URL=https://akxmcjfybmvlhqxqwmpe.supabase.co
SUPABASE_ANON_KEY=[PROTEGIDA]
SUPABASE_SERVICE_KEY=[PROTEGIDA]
OPENAI_API_KEY=[PROTEGIDA]
JWT_SECRET=[PROTEGIDA]
```

**⚠️ IMPORTANTE**: Las API keys reales están en el archivo `.env` del proyecto.

---

## 📊 MODELO DE DATOS COMPLETO

### Tabla: `fe_users` (Usuarios)
```typescript
{
  id: string (UUID)
  name: string
  email: string (único)
  password: string (bcrypt hash)
  role: 'admin' | 'seller' | 'presales'
  approved: boolean
  created_at: timestamp
}
```

### Tabla: `fe_deals` (Oportunidades)
```typescript
{
  id: string (UUID)
  company: string
  project: string
  stage: string  // Prospecting, Qualified, Value Proposition, Proposal, Negotiation, Closed Won, Closed Lost
  close_date: date
  amount: number (USD)
  software: string
  country: string
  power_sponsor: string
  sponsor: string
  owner: string
  owner_id: string
  next_steps: string
  next_steps_date: date
  created_at: timestamp
}
```

### Tabla: `ai_reacher_contacts` (Contactos)
```typescript
{
  id: string
  nombre: string
  cargo: string
  empresa: string
  industria: string
  departamento: string  // C-Suite, Directorías, Gerencias, Jefaturas
  pais: string
  tamano_empresa: string
  email: string
  telefono: string
  linkedin: string
  fuente: string[]  // ['hunter', 'apollo']
  estado: string
  prioridad: string
  account_owner: string
  evolve_owner: string
  created_at: timestamp
}
```

### Tabla: `presales_propuestas` (Propuestas Pre-Sales)
```typescript
{
  id: string
  cliente: string
  empresa: string
  contexto: string
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Urgente'
  estado: string  // Levantamiento Datos, Cubicaciones, Presentación, Creada, Revisada, Aprobada, Enviada
  creado_por: string
  asignado_a: string
  fecha_entrega: date
  archivo_url: string
  archivo_nombre: string
  archivo_tipo: string
  archivo_size: number
  estado_poc: string  // Sin PoC, Iniciando, En Curso, Terminando, Completada
  soe_status: string  // Pendiente, En Revisión, Aprobada
  created_at: timestamp
}
```

### Tabla: `proposal_hub_proposals` (Plantillas)
```typescript
{
  id: string
  nombre: string
  linea_negocio: string
  subcategoria: string
  industria_sugerida: string
  descripcion: string
  nivel_complejidad: 'Básico' | 'Medio' | 'Enterprise'
  tipo_cliente: 'SMB' | 'Corporate' | 'Enterprise'
  archivo_url: string
  version: string
  tags: string[]
  descargas_count: number
  activa: boolean
  owner_id: string
  created_at: timestamp
}
```

### Tabla: `sales_interactions` (Interacciones)
```typescript
{
  id: string
  contacto_id: string
  tipo: 'llamada' | 'whatsapp' | 'email' | 'reunion'
  fecha: date
  notas: string
  resultado: string
  proximo_paso: string
  created_at: timestamp
}
```

---

## 🚀 COMANDOS ESENCIALES

### Iniciar la API (Desarrollo)
```bash
cd /Users/javiercorrea/forecast-evolve-api
npm run dev
```

### Compilar TypeScript
```bash
cd /Users/javiercorrea/forecast-evolve-api
npm run build
```

### Iniciar en Producción
```bash
cd /Users/javiercorrea/forecast-evolve-api
npm start
```

### Ver logs en tiempo real
```bash
cd /Users/javiercorrea/forecast-evolve-api
npm run dev | tee -a logs/api.log
```

---

## 📡 ENDPOINTS COMPLETOS

### Base URL
```
http://localhost:3001/api
```

### 🔐 Autenticación

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Registrar nuevo usuario |
| POST | `/auth/login` | No | Iniciar sesión |
| POST | `/auth/refresh` | No | Renovar token |
| GET | `/auth/me` | Sí | Obtener perfil actual |

### 💼 Deals (Oportunidades)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/deals` | Sí | Listar deals (paginado) |
| GET | `/deals/:id` | Sí | Obtener deal específico |
| POST | `/deals` | Sí | Crear nuevo deal |
| PATCH | `/deals/:id` | Sí | Actualizar deal |
| DELETE | `/deals/:id` | Sí | Eliminar deal (admin/seller) |
| GET | `/deals/stats` | Sí | Estadísticas del pipeline |
| GET | `/deals/export` | Sí | Exportar deals a CSV |

### 📞 Contactos (AI Reacher)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/contacts` | Sí | Listar contactos |
| GET | `/contacts/:id` | Sí | Obtener contacto |
| POST | `/contacts` | Sí | Agregar contacto |
| PATCH | `/contacts/:id` | Sí | Actualizar contacto |
| POST | `/contacts/search/preview` | Sí | Búsqueda gratuita |
| POST | `/contacts/search/reveal` | Sí | Revelar datos (pagado) |

### 🤖 AI Copilot

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/ai/speech` | Sí | Generar sales speech |
| POST | `/ai/chat` | Sí | Chat con IA contextual |
| POST | `/interactions` | Sí | Registrar interacción |
| GET | `/interactions/:contactId` | Sí | Historial de contacto |

### 📄 Pre-Sales

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/presales/proposals` | Sí | Listar propuestas |
| GET | `/presales/proposals/:id` | Sí | Obtener propuesta |
| POST | `/presales/proposals` | Sí | Crear propuesta |
| PATCH | `/presales/proposals/:id` | Sí | Actualizar propuesta |
| POST | `/presales/proposals/:id/comments` | Sí | Agregar comentario |
| POST | `/presales/proposals/:id/upload` | Sí | Subir archivo |
| GET | `/presales/calendar` | Sí | Vista calendario |

### 📚 Proposal Hub

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/proposals` | Sí | Listar plantillas |
| GET | `/proposals/:id` | Sí | Obtener plantilla |
| POST | `/proposals` | Sí | Crear plantilla |
| PATCH | `/proposals/:id` | Sí | Actualizar plantilla |
| POST | `/proposals/:id/favorite` | Sí | Marcar favorito |
| POST | `/proposals/:id/download` | Sí | Registrar descarga |
| GET | `/proposals/stats` | Sí | Analytics de uso |

### 👥 Usuarios y Admin

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/users` | Admin | Listar usuarios |
| GET | `/users/:id` | Admin | Obtener usuario |
| PATCH | `/users/:id` | Admin | Actualizar usuario |
| PATCH | `/users/:id/approve` | Admin | Aprobar usuario |
| GET | `/config` | Sí | Obtener configuración |
| PATCH | `/config` | Admin | Actualizar configuración |

---

## 🔧 CÓMO INTERACTUAR CON LA API

### 1. Obtener un Token de Autenticación

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@forecastevolve.com",
    "password": "admin123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Admin", "role": "admin" },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUz...",
      "refreshToken": "eyJhbGciOiJIUz..."
    }
  }
}
```

### 2. Usar el Token en Requests

```bash
curl -X GET http://localhost:3001/api/deals \
  -H "Authorization: Bearer eyJhbGciOiJIUz..."
```

### 3. Crear un Deal

```bash
curl -X POST http://localhost:3001/api/deals \
  -H "Authorization: Bearer eyJhbGciOiJIUz..." \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### 4. Obtener Estadísticas

```bash
curl -X GET http://localhost:3001/api/deals/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUz..."
```

---

## 🛠️ CASOS DE USO COMUNES

### Caso 1: Crear un nuevo usuario y deal

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Vendedor",
    "email": "vendedor@empresa.com",
    "password": "password123",
    "role": "seller"
  }'

# 2. Login (después de que admin apruebe)
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "vendedor@empresa.com", "password": "password123"}' \
  | jq -r '.data.tokens.accessToken')

# 3. Crear deal
curl -X POST http://localhost:3001/api/deals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Cliente Nuevo",
    "project": "Proyecto X",
    "stage": "Prospecting",
    "close_date": "2026-12-31",
    "amount": 100000,
    "software": "AIWorks",
    "country": "México",
    "power_sponsor": "Director General",
    "sponsor": "Gerente TI",
    "owner": "Nuevo Vendedor",
    "next_steps": "Primera llamada",
    "next_steps_date": "2026-03-17"
  }'
```

### Caso 2: Generar un sales speech con IA

```bash
curl -X POST http://localhost:3001/api/ai/speech \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Juan Pérez",
    "company": "Acme Corp",
    "position": "CEO",
    "style": "consultative"
  }'
```

### Caso 3: Exportar todos los deals a CSV

```bash
curl -X GET "http://localhost:3001/api/deals/export" \
  -H "Authorization: Bearer $TOKEN" \
  -o deals_export.csv
```

---

## 🐛 DEBUGGING Y TROUBLESHOOTING

### Ver logs de la API en tiempo real

```bash
cd /Users/javiercorrea/forecast-evolve-api
npm run dev
```

### Verificar que Supabase está conectado

```bash
curl http://localhost:3001/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-16T..."
}
```

### Problemas comunes

1. **Error: "Invalid or expired token"**
   - Solución: Renovar el token con `/api/auth/refresh`

2. **Error: "User not approved"**
   - Solución: Admin debe aprobar al usuario en `/api/users/:id/approve`

3. **Error de CORS**
   - Solución: Verificar que `CORS_ORIGIN` en `.env` incluye el origen del frontend

4. **Error de conexión a Supabase**
   - Solución: Verificar `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` en `.env`

---

## 📁 ARCHIVOS IMPORTANTES

```
/Users/javiercorrea/forecast-evolve-api/
├── src/index.ts                    # Entry point del servidor
├── src/config/database.ts          # Conexión a Supabase
├── src/utils/jwt.ts                # Manejo de JWT
├── src/middleware/auth.ts          # Autenticación y autorización
├── src/services/deals.service.ts   # Lógica de negocio de deals
├── src/services/auth.service.ts    # Lógica de autenticación
├── src/services/ai.service.ts      # Integración con OpenAI
├── src/controllers/deals.controller.ts  # Controlador de deals
├── src/routes/deals.routes.ts      # Rutas de deals
├── .env                            # Variables de entorno (¡CRÍTICO!)
├── package.json                    # Dependencias
├── tsconfig.json                   # Configuración TypeScript
└── README.md                       # Documentación general
```

---

## 🔄 FLUJOS DE TRABAJO CLAVE

### Flujo de Autenticación
1. Usuario llama a `/api/auth/login` con email y password
2. API verifica credenciales en Supabase (`fe_users`)
3. API verifica que `approved = true`
4. API hashea password con bcrypt y compara
5. API genera `accessToken` (24h) y `refreshToken` (7d) con JWT
6. Usuario usa `accessToken` en header `Authorization` en cada request
7. Cuando expira, llama a `/api/auth/refresh` con `refreshToken`

### Flujo de Creación de Deal
1. Usuario autenticado llama a `POST /api/deals`
2. Middleware `authenticate` verifica JWT
3. Controller valida datos con Joi
4. Service inserta en Supabase (`fe_deals`)
5. Service asigna `owner_id` del usuario autenticado
6. API retorna deal creado con ID

### Flujo de Generación de Speech con IA
1. Usuario llama a `POST /api/ai/speech` con datos del contacto
2. Service construye prompt contextual según estilo
3. Service llama a OpenAI GPT-3.5 Turbo
4. OpenAI genera speech personalizado
5. API retorna speech al usuario

---

## 💡 TIPS PARA CLAUDE

### Al recibir solicitudes del usuario:

1. **Verificar estado de la API**:
   ```bash
   curl http://localhost:3001/health
   ```

2. **Obtener token de prueba** (si no tiene):
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@forecastevolve.com", "password": "admin123"}'
   ```

3. **Listar recursos existentes antes de crear**:
   ```bash
   curl -X GET http://localhost:3001/api/deals \
     -H "Authorization: Bearer $TOKEN"
   ```

4. **Usar queries para filtrar**:
   ```bash
   curl -X GET "http://localhost:3001/api/deals?stage=Qualified&country=Chile" \
     -H "Authorization: Bearer $TOKEN"
   ```

### Al modificar el código:

1. **Recompilar después de cambios**:
   ```bash
   cd /Users/javiercorrea/forecast-evolve-api
   npm run build
   ```

2. **Reiniciar servidor en modo dev** (auto-reload):
   ```bash
   npm run dev
   ```

3. **Verificar tipos de TypeScript**:
   ```bash
   npx tsc --noEmit
   ```

---

## 🎓 CONOCIMIENTOS CLAVE QUE NUNCA OLVIDAR

1. **La API está en**: `/Users/javiercorrea/forecast-evolve-api`
2. **Puerto por defecto**: `3001`
3. **Base de datos**: Supabase PostgreSQL
4. **Autenticación**: JWT con Bearer token
5. **Roles**: admin, seller, presales
6. **Frontend original**: `/Users/javiercorrea/forecast-evolve` (React)
7. **Todos los endpoints requieren autenticación** excepto `/auth/register` y `/auth/login`
8. **La tabla principal de deals es**: `fe_deals`
9. **OpenAI se usa para**: Generar speeches y chat contextual
10. **El archivo .env contiene todas las credenciales críticas**

---

## 🚨 SEGURIDAD - NUNCA HACER

❌ **NO compartir** el contenido del archivo `.env`
❌ **NO commitear** `.env` a Git (ya está en `.gitignore`)
❌ **NO usar** contraseñas débiles en producción
❌ **NO exponer** la API sin HTTPS en producción
❌ **NO deshabilitar** rate limiting en producción
❌ **NO usar** `SUPABASE_SERVICE_KEY` en el frontend

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de considerar la API lista para producción:

- [ ] Variables de entorno configuradas en `.env`
- [ ] JWT secrets cambiados (no usar defaults)
- [ ] CORS configurado para dominios correctos
- [ ] Rate limiting activado
- [ ] HTTPS habilitado
- [ ] Logs configurados
- [ ] Backups de Supabase programados
- [ ] Monitoreo de errores activo
- [ ] Tests unitarios pasando
- [ ] Documentación actualizada

---

## 📞 PRÓXIMOS PASOS POTENCIALES

Si el usuario solicita mejoras futuras, estas son posibles:

1. **Agregar más endpoints** para:
   - Pre-Sales (propuestas, comentarios, archivos)
   - Proposal Hub (plantillas, favoritos, descargas)
   - Usuarios y administración
   - Interacciones de ventas
   - Configuraciones globales

2. **Mejorar funcionalidades**:
   - Webhooks para eventos
   - Notificaciones push
   - Integración con calendarios (Google, Outlook)
   - Reportes automáticos por email
   - Dashboard analytics en tiempo real

3. **Optimizaciones**:
   - Cache con Redis
   - GraphQL como alternativa
   - WebSockets para updates en tiempo real
   - Compresión de respuestas
   - CDN para archivos estáticos

---

**FIN DEL DOCUMENTO DE CONOCIMIENTO**

*Última actualización: 2026-03-16*
*Versión de la API: 1.0.0*
