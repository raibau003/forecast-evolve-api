# 📖 EJEMPLOS PRÁCTICOS - Forecast Evolve API

## 🔐 1. Autenticación

### Registrar un nuevo usuario

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María González",
    "email": "maria@empresa.com",
    "password": "segura123",
    "role": "seller"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "María González",
      "email": "maria@empresa.com",
      "role": "seller",
      "approved": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "message": "User registered successfully"
}
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@empresa.com",
    "password": "segura123"
  }'
```

### Guardar token en variable (para usar en siguientes requests)

```bash
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "maria@empresa.com", "password": "segura123"}' \
  | jq -r '.data.tokens.accessToken')

echo $TOKEN
```

### Obtener perfil del usuario actual

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💼 2. Deals (Oportunidades)

### Listar todos los deals

```bash
curl http://localhost:3001/api/deals \
  -H "Authorization: Bearer $TOKEN"
```

### Listar deals con paginación

```bash
curl "http://localhost:3001/api/deals?page=1&limit=10&sortBy=amount&sortOrder=desc" \
  -H "Authorization: Bearer $TOKEN"
```

### Filtrar deals por etapa

```bash
curl "http://localhost:3001/api/deals?stage=Qualified" \
  -H "Authorization: Bearer $TOKEN"
```

### Filtrar deals por múltiples criterios

```bash
curl "http://localhost:3001/api/deals?stage=Proposal&country=Chile&software=DataWorks" \
  -H "Authorization: Bearer $TOKEN"
```

### Crear un nuevo deal

```bash
curl -X POST http://localhost:3001/api/deals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Acme Corporation",
    "project": "Implementación de BI y Analytics",
    "stage": "Qualified",
    "close_date": "2026-09-30",
    "amount": 75000,
    "software": "DataWorks",
    "country": "Chile",
    "power_sponsor": "CEO Roberto Sánchez",
    "sponsor": "CTO Ana Martínez",
    "owner": "María González",
    "next_steps": "Presentar propuesta técnica",
    "next_steps_date": "2026-03-25"
  }'
```

### Actualizar un deal existente

```bash
curl -X PATCH http://localhost:3001/api/deals/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "Proposal",
    "amount": 80000,
    "next_steps": "Revisar propuesta con equipo técnico"
  }'
```

### Obtener un deal específico

```bash
curl http://localhost:3001/api/deals/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

### Eliminar un deal

```bash
curl -X DELETE http://localhost:3001/api/deals/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

### Obtener estadísticas del pipeline

```bash
curl http://localhost:3001/api/deals/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_pipeline": 1250000,
      "weighted_pipeline": 625000,
      "revenue": 350000,
      "deals_by_stage": {
        "Prospecting": 100000,
        "Qualified": 250000,
        "Value Proposition": 300000,
        "Proposal": 400000,
        "Negotiation": 200000,
        "Closed Won": 350000
      },
      "count_by_stage": {
        "Prospecting": 5,
        "Qualified": 8,
        "Value Proposition": 6,
        "Proposal": 4,
        "Negotiation": 3,
        "Closed Won": 7
      }
    }
  }
}
```

### Exportar deals a CSV

```bash
curl http://localhost:3001/api/deals/export \
  -H "Authorization: Bearer $TOKEN" \
  -o mis_deals.csv

# O con filtros
curl "http://localhost:3001/api/deals/export?stage=Qualified&country=Chile" \
  -H "Authorization: Bearer $TOKEN" \
  -o deals_chile_qualified.csv
```

---

## 📞 3. Contactos (AI Reacher)

### Listar contactos

```bash
curl http://localhost:3001/api/contacts \
  -H "Authorization: Bearer $TOKEN"
```

### Buscar contactos (búsqueda global)

```bash
curl "http://localhost:3001/api/contacts?search=gerente&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

### Crear un nuevo contacto

```bash
curl -X POST http://localhost:3001/api/contacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Díaz",
    "cargo": "Gerente de TI",
    "empresa": "Tech Solutions SA",
    "industria": "Tecnología",
    "departamento": "Gerencias",
    "pais": "México",
    "tamano_empresa": "Enterprise",
    "email": "carlos.diaz@techsolutions.mx",
    "telefono": "+52 55 1234 5678",
    "linkedin": "https://linkedin.com/in/carlosdiaz",
    "fuente": ["manual"],
    "estado": "Nuevo",
    "prioridad": "Alta"
  }'
```

### Actualizar contacto

```bash
curl -X PATCH http://localhost:3001/api/contacts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "En Contacto",
    "prioridad": "Alta"
  }'
```

---

## 🤖 4. AI Sales Copilot

### Generar un sales speech (estilo normal)

```bash
curl -X POST http://localhost:3001/api/ai/speech \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Carlos Díaz",
    "company": "Tech Solutions SA",
    "position": "Gerente de TI",
    "style": "normal"
  }'
```

### Generar speech estilo consultivo

```bash
curl -X POST http://localhost:3001/api/ai/speech \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Ana Martínez",
    "company": "Retail Corp",
    "position": "Directora de Operaciones",
    "style": "consultative"
  }'
```

### Generar speech corto y directo

```bash
curl -X POST http://localhost:3001/api/ai/speech \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Roberto Sánchez",
    "company": "Acme Corp",
    "position": "CEO",
    "style": "direct"
  }'
```

### Chat con IA (pregunta sobre ventas)

```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "¿Cómo puedo manejar una objeción de precio en una venta B2B?"
      }
    ]
  }'
```

### Conversación multi-turno con IA

```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "¿Cuál es la mejor estrategia para cerrar un deal en etapa de negociación?"
      },
      {
        "role": "assistant",
        "content": "Para cerrar un deal en etapa de negociación, te recomiendo..."
      },
      {
        "role": "user",
        "content": "¿Y si el cliente pide un descuento mayor al 20%?"
      }
    ]
  }'
```

---

## 🔄 5. Flujos Completos

### Flujo 1: Registro, Login y Creación de Deal

```bash
# 1. Registrar nuevo vendedor
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Vendedor",
    "email": "juan@ventas.com",
    "password": "ventas123",
    "role": "seller"
  }'

# 2. Login y guardar token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@ventas.com", "password": "ventas123"}' \
  | jq -r '.data.tokens.accessToken')

# 3. Crear un deal
curl -X POST http://localhost:3001/api/deals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Mi Cliente",
    "project": "Proyecto Nuevo",
    "stage": "Prospecting",
    "close_date": "2026-12-31",
    "amount": 50000,
    "software": "AIWorks",
    "country": "Argentina",
    "power_sponsor": "Director",
    "sponsor": "Gerente",
    "owner": "Juan Vendedor",
    "next_steps": "Primera reunión",
    "next_steps_date": "2026-03-20"
  }'

# 4. Ver estadísticas
curl http://localhost:3001/api/deals/stats \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
```

### Flujo 2: Prospección con AI

```bash
# 1. Buscar contacto en base de datos
curl "http://localhost:3001/api/contacts?search=gerente+TI&pais=Chile" \
  -H "Authorization: Bearer $TOKEN"

# 2. Generar speech personalizado
curl -X POST http://localhost:3001/api/ai/speech \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Pedro López",
    "company": "Innovación SA",
    "position": "Gerente de TI",
    "style": "consultative"
  }' | jq -r '.data'

# 3. Agregar contacto si no existe
curl -X POST http://localhost:3001/api/contacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pedro López",
    "cargo": "Gerente de TI",
    "empresa": "Innovación SA",
    "industria": "Retail",
    "departamento": "Gerencias",
    "pais": "Chile",
    "tamano_empresa": "Corporate",
    "estado": "Nuevo",
    "prioridad": "Media",
    "fuente": ["manual"]
  }'
```

---

## 🧪 6. Testing y Debugging

### Verificar estado de la API

```bash
curl http://localhost:3001/health
```

### Ver información general de la API

```bash
curl http://localhost:3001/ | jq '.'
```

### Probar endpoint no autenticado (debe fallar)

```bash
curl http://localhost:3001/api/deals
# Respuesta esperada: {"success": false, "error": "No token provided"}
```

### Probar con token inválido (debe fallar)

```bash
curl http://localhost:3001/api/deals \
  -H "Authorization: Bearer token_invalido"
# Respuesta esperada: {"success": false, "error": "Invalid or expired token"}
```

### Renovar token expirado

```bash
REFRESH_TOKEN="tu_refresh_token_aqui"

NEW_TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}" \
  | jq -r '.data.tokens.accessToken')

echo $NEW_TOKEN
```

---

## 📊 7. Análisis de Datos

### Obtener todos los deals y contar por etapa

```bash
curl "http://localhost:3001/api/deals?limit=1000" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data | group_by(.stage) | map({stage: .[0].stage, count: length})'
```

### Calcular pipeline total

```bash
curl http://localhost:3001/api/deals \
  -H "Authorization: Bearer $TOKEN" \
  | jq '[.data[].amount] | add'
```

### Ver top 5 deals por monto

```bash
curl "http://localhost:3001/api/deals?sortBy=amount&sortOrder=desc&limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {company, project, amount, stage}'
```

---

## 💡 Tips y Trucos

### Usar jq para formatear respuestas

```bash
# Bonito y legible
curl http://localhost:3001/api/deals \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# Solo nombres de compañías
curl http://localhost:3001/api/deals \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[].company'

# Filtrar campos específicos
curl http://localhost:3001/api/deals \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {company, amount, stage}'
```

### Crear alias para comandos frecuentes

```bash
# En ~/.bashrc o ~/.zshrc
alias fe-login='TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\": \"tu@email.com\", \"password\": \"tu_password\"}" | jq -r ".data.tokens.accessToken") && echo $TOKEN'

alias fe-deals='curl http://localhost:3001/api/deals -H "Authorization: Bearer $TOKEN" | jq "."'

alias fe-stats='curl http://localhost:3001/api/deals/stats -H "Authorization: Bearer $TOKEN" | jq "."'
```

---

**¿Necesitas más ejemplos? Consulta:**
- README.md - Documentación completa
- API_KNOWLEDGE.md - Conocimiento técnico detallado
- QUICK_START.md - Inicio rápido
