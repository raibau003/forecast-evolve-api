# 📚 ÍNDICE DE DOCUMENTACIÓN - Forecast Evolve API

Bienvenido a la documentación completa de **Forecast Evolve API**. Esta guía te ayudará a navegar por todos los documentos disponibles.

---

## 🚀 Para Empezar

### 1. [QUICK_START.md](QUICK_START.md)
**Tiempo de lectura: 3 minutos**

¿Primera vez con la API? Empieza aquí.

- ⚡ Comandos rápidos para iniciar
- 🔑 Configuración inicial mínima
- ✅ Checklist de verificación

**Ideal para**: Poner la API en funcionamiento en menos de 5 minutos.

---

### 2. [README.md](README.md)
**Tiempo de lectura: 10 minutos**

Documentación general y completa de la API.

- 📖 Descripción del proyecto
- 🛠️ Instalación paso a paso
- 📚 Todos los endpoints con ejemplos
- 🔐 Sistema de autenticación
- 🚀 Opciones de deploy

**Ideal para**: Entender qué hace la API y cómo usarla.

---

### 3. [EXAMPLES.md](EXAMPLES.md)
**Tiempo de lectura: 15 minutos**

Ejemplos prácticos y casos de uso reales.

- 📝 Ejemplos curl completos
- 🔄 Flujos de trabajo paso a paso
- 🧪 Casos de testing
- 💡 Tips y trucos

**Ideal para**: Aprender con ejemplos concretos.

---

## 📐 Para Desarrolladores

### 4. [ARCHITECTURE.md](ARCHITECTURE.md)
**Tiempo de lectura: 20 minutos**

Arquitectura técnica detallada.

- 🏗️ Diagramas de arquitectura
- 🗂️ Estructura de archivos
- 🔄 Flujo de requests
- 🔐 Sistema de autenticación
- 🗄️ Modelo de base de datos
- 📊 Cálculos y métricas
- 🛡️ Seguridad

**Ideal para**: Entender cómo funciona internamente la API.

---

### 5. [API_KNOWLEDGE.md](API_KNOWLEDGE.md)
**Tiempo de lectura: 30 minutos**

Conocimiento completo y permanente de la API (para Claude).

- 🧠 Todo sobre el proyecto
- 📍 Ubicaciones y rutas
- 🎯 Modelo de datos completo
- 📡 Todos los endpoints
- 🔧 Cómo interactuar
- 🛠️ Casos de uso
- 💡 Tips para Claude
- 🚨 Qué nunca hacer

**Ideal para**: Referencia completa y debugging avanzado.

---

## 📂 Archivos del Proyecto

### Código Fuente

```
src/
├── index.ts              # Entry point del servidor
├── config/
│   └── database.ts       # Conexión Supabase
├── types/
│   └── index.ts          # Tipos TypeScript
├── utils/
│   ├── jwt.ts            # JWT utilities
│   ├── password.ts       # Password hashing
│   └── response.ts       # Response helpers
├── middleware/
│   ├── auth.ts           # Autenticación
│   └── validation.ts     # Validación Joi
├── services/
│   ├── auth.service.ts   # Lógica de auth
│   ├── deals.service.ts  # Lógica de deals
│   ├── contacts.service.ts
│   └── ai.service.ts     # OpenAI integration
├── controllers/
│   ├── auth.controller.ts
│   └── deals.controller.ts
└── routes/
    ├── auth.routes.ts
    └── deals.routes.ts
```

### Configuración

- **.env** - Variables de entorno (¡SECRETO!)
- **.env.example** - Template de variables
- **package.json** - Dependencias npm
- **tsconfig.json** - Configuración TypeScript
- **.gitignore** - Archivos ignorados por Git

---

## 🎯 Casos de Uso

### Usuario nuevo que quiere usar la API

1. Lee [QUICK_START.md](QUICK_START.md)
2. Configura `.env` con tus credenciales
3. Ejecuta `npm install && npm run dev`
4. Prueba con [EXAMPLES.md](EXAMPLES.md)

### Desarrollador que quiere entender el código

1. Lee [README.md](README.md) para contexto
2. Lee [ARCHITECTURE.md](ARCHITECTURE.md) para arquitectura
3. Explora el código en `src/`
4. Consulta [API_KNOWLEDGE.md](API_KNOWLEDGE.md) para detalles

### Claude que necesita interactuar con la API

1. Lee [API_KNOWLEDGE.md](API_KNOWLEDGE.md) **SIEMPRE PRIMERO**
2. Consulta [EXAMPLES.md](EXAMPLES.md) para ejemplos
3. Usa comandos de [QUICK_START.md](QUICK_START.md)

### Usuario que quiere integrar el frontend

1. Lee [README.md](README.md) sección "Endpoints"
2. Revisa [EXAMPLES.md](EXAMPLES.md) sección "Autenticación"
3. Implementa usando axios o fetch
4. Consulta [ARCHITECTURE.md](ARCHITECTURE.md) para flujo de auth

---

## 🔍 Búsqueda Rápida

### ¿Cómo hago...?

| Tarea | Documento | Sección |
|-------|-----------|---------|
| Iniciar la API | QUICK_START.md | Comandos Rápidos |
| Obtener un token | EXAMPLES.md | Autenticación |
| Crear un deal | EXAMPLES.md | Deals |
| Generar un speech | EXAMPLES.md | AI Copilot |
| Exportar a CSV | EXAMPLES.md | Deals → Export |
| Entender JWT | ARCHITECTURE.md | Sistema de Autenticación |
| Ver estructura de DB | ARCHITECTURE.md | Modelo de Base de Datos |
| Configurar variables | README.md | Instalación → Paso 3 |
| Deploy a producción | README.md | Deploy |
| Debugging | API_KNOWLEDGE.md | Debugging |

---

## 📞 Endpoints de la API

### Base URL
```
http://localhost:3001/api
```

### Rutas Principales

| Categoría | Ruta Base | Documento |
|-----------|-----------|-----------|
| Autenticación | `/auth` | README.md, EXAMPLES.md |
| Deals | `/deals` | README.md, EXAMPLES.md |
| Contactos | `/contacts` | API_KNOWLEDGE.md |
| AI Copilot | `/ai` | EXAMPLES.md |
| Pre-Sales | `/presales` | API_KNOWLEDGE.md |
| Proposal Hub | `/proposals` | API_KNOWLEDGE.md |
| Usuarios | `/users` | API_KNOWLEDGE.md |

---

## 🔗 Links Importantes

- **Repositorio Frontend**: `/Users/javiercorrea/forecast-evolve`
- **Repositorio API**: `/Users/javiercorrea/forecast-evolve-api`
- **Supabase Dashboard**: https://app.supabase.com
- **OpenAI Platform**: https://platform.openai.com

---

## 🆘 Ayuda

### Problemas Comunes

| Problema | Solución | Documento |
|----------|----------|-----------|
| API no inicia | Verificar `.env` | QUICK_START.md |
| Token inválido | Renovar con `/auth/refresh` | EXAMPLES.md |
| Error de CORS | Configurar `CORS_ORIGIN` | README.md |
| No conecta a Supabase | Verificar keys en `.env` | API_KNOWLEDGE.md |

### ¿Dónde buscar?

- **Errores al iniciar**: QUICK_START.md
- **Errores en runtime**: API_KNOWLEDGE.md → Troubleshooting
- **Ejemplos de código**: EXAMPLES.md
- **Preguntas técnicas**: ARCHITECTURE.md
- **Referencia completa**: API_KNOWLEDGE.md

---

## 📊 Estado del Proyecto

### Implementado ✅

- ✅ Autenticación con JWT
- ✅ CRUD de Deals
- ✅ CRUD de Contactos
- ✅ AI Speech Generation
- ✅ AI Chat
- ✅ Integración con Supabase
- ✅ Integración con OpenAI
- ✅ Middleware de seguridad
- ✅ Rate limiting
- ✅ Validación de datos
- ✅ Export a CSV
- ✅ Documentación completa

### Por Implementar 🚧

- 🚧 Pre-Sales endpoints completos
- 🚧 Proposal Hub endpoints completos
- 🚧 File upload completo
- 🚧 WebSockets para real-time
- 🚧 Tests unitarios
- 🚧 Tests de integración
- 🚧 CI/CD pipeline
- 🚧 Swagger/OpenAPI docs

---

## 📝 Versionamiento

- **v1.0.0** (2026-03-16) - Release inicial
  - Autenticación JWT
  - Endpoints de Deals
  - Endpoints de Contactos
  - AI Copilot
  - Documentación completa

---

## 👥 Contribuir

Para agregar nuevos endpoints o funcionalidades:

1. Lee [ARCHITECTURE.md](ARCHITECTURE.md) para entender la estructura
2. Crea el service en `src/services/`
3. Crea el controller en `src/controllers/`
4. Define las rutas en `src/routes/`
5. Agrega validación en el middleware
6. Actualiza la documentación

---

## 📄 Licencia

MIT License

---

**Creado**: 2026-03-16  
**Última actualización**: 2026-03-16  
**Versión de la API**: 1.0.0
