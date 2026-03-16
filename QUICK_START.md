# 🚀 QUICK START - Forecast Evolve API

## ⚡ Comandos Rápidos

### Iniciar la API
```bash
cd /Users/javiercorrea/forecast-evolve-api
npm run dev
```

### Verificar que funciona
```bash
curl http://localhost:3001/health
```

### Probar login (después de configurar Supabase)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@forecastevolve.com", "password": "admin123"}'
```

### Listar deals (con token)
```bash
TOKEN="tu_token_aqui"
curl http://localhost:3001/api/deals \
  -H "Authorization: Bearer $TOKEN"
```

## 🔑 Configuración Inicial

### 1. Instalar dependencias
```bash
cd /Users/javiercorrea/forecast-evolve-api
npm install
```

### 2. Configurar .env
Edita `/Users/javiercorrea/forecast-evolve-api/.env` con tus credenciales:
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `OPENAI_API_KEY`
- `JWT_SECRET` y `JWT_REFRESH_SECRET`

### 3. Compilar y ejecutar
```bash
npm run build
npm run dev
```

## 📚 Documentación Completa

- **README.md**: Documentación general
- **API_KNOWLEDGE.md**: Conocimiento completo de la API para Claude
- **QUICK_START.md**: Este archivo (inicio rápido)

## 🌐 URLs Importantes

- API Local: `http://localhost:3001`
- Health Check: `http://localhost:3001/health`
- Endpoints: `http://localhost:3001/api/*`
- Frontend: `http://localhost:5173` (si está corriendo)

## 📁 Archivos Clave

```
/Users/javiercorrea/forecast-evolve-api/
├── .env                    ← CONFIGURAR CON TUS CREDENCIALES
├── src/index.ts            ← Entry point
├── src/config/database.ts  ← Conexión Supabase
├── src/services/           ← Lógica de negocio
├── src/controllers/        ← Controladores HTTP
├── src/routes/             ← Definición de rutas
├── README.md               ← Documentación completa
└── API_KNOWLEDGE.md        ← Conocimiento para Claude
```

## 🎯 Endpoints Principales

| Ruta | Descripción |
|------|-------------|
| `POST /api/auth/login` | Iniciar sesión |
| `GET /api/deals` | Listar oportunidades |
| `POST /api/deals` | Crear oportunidad |
| `GET /api/deals/stats` | Estadísticas del pipeline |
| `GET /api/contacts` | Listar contactos |
| `POST /api/ai/speech` | Generar sales speech |
| `POST /api/ai/chat` | Chat con IA |

## 🐛 Troubleshooting Rápido

### Error: "Cannot connect to Supabase"
```bash
# Verificar variables de entorno
cat .env | grep SUPABASE
```

### Error: "Invalid token"
```bash
# Obtener un nuevo token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tu_email", "password": "tu_password"}'
```

### Ver logs en tiempo real
```bash
npm run dev
```

## ✅ Checklist Inicial

- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` configurado con credenciales reales
- [ ] API compilada (`npm run build`)
- [ ] API iniciada (`npm run dev`)
- [ ] Health check funcionando (`curl http://localhost:3001/health`)
- [ ] Login funcionando (probar con curl)

---

**¿Listo para empezar? Ejecuta:**

```bash
cd /Users/javiercorrea/forecast-evolve-api
npm run dev
```

Luego abre en tu navegador: `http://localhost:3001`
