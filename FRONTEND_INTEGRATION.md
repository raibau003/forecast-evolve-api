# 🔗 Integración con Frontend - Forecast Evolve

Guía para integrar la API con tu aplicación React de Forecast Evolve.

---

## 📋 Resumen

La API replica **EXACTAMENTE** las mismas funciones que hace el frontend directamente con Supabase, pero ahora a través de endpoints REST.

**Ventajas de usar la API**:
- ✅ Lógica de negocio centralizada
- ✅ Validación consistente
- ✅ Rate limiting y seguridad
- ✅ Fácil escalabilidad
- ✅ Mejor logging y debugging
- ✅ Cache futura
- ✅ Múltiples frontends (web, mobile, etc.)

---

## 🔄 Migración Paso a Paso

### Antes (Frontend directo a Supabase)

```javascript
// app.tsx - Forma antigua
const db = async (table, method = "GET", body = null, query = "") => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": method === "POST" ? "return=representation" : ""
    },
    body: body ? JSON.stringify(body) : null
  });
  return await res.json();
};

// Uso
const deals = await db('deals', 'GET', null, '?select=*');
```

### Después (Frontend a tu API)

```javascript
// Configuración de API
const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('auth_token');

const api = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken ? `Bearer ${authToken}` : '',
      ...options.headers
    }
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Error en la petición');
  }

  return data.data;
};

// Uso
const deals = await api('/deals?page=1&limit=50');
```

---

## 🔐 1. Autenticación

### Reemplazar Login

**Antes:**
```javascript
const login = async (email, password) => {
  const hashedPassword = hashPwd(password);
  const users = await db('users', 'GET', null,
    `?select=*&email=eq.${email}&password=eq.${hashedPassword}`
  );

  if (users.length > 0) {
    setCurrentUser(users[0]);
    return users[0];
  }
  return null;
};
```

**Después:**
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const { success, data, error } = await response.json();

    if (!success) {
      alert(error);
      return null;
    }

    // Guardar token
    authToken = data.token;
    localStorage.setItem('auth_token', authToken);

    // Guardar usuario
    setCurrentUser(data.user);
    return data.user;

  } catch (error) {
    console.error('Error en login:', error);
    return null;
  }
};
```

---

## 💼 2. Deals / Oportunidades

### Listar Deals con Filtros

**Antes:**
```javascript
// Filtros manuales en frontend
const filteredDeals = deals.filter(d => {
  if (filters.stages?.length && !filters.stages.includes(d.stage)) return false;
  if (filters.country?.length && !filters.country.includes(d.country)) return false;
  // ... más filtros
  return true;
});

// Paginación manual
const start = (currentPage - 1) * itemsPerPage;
const paginatedDeals = filteredDeals.slice(start, start + itemsPerPage);
```

**Después:**
```javascript
// Filtros y paginación en backend
const fetchDeals = async (page = 1, limit = 50, filters = {}) => {
  // Construir query params
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  // Agregar filtros
  if (filters.stages?.length) {
    filters.stages.forEach(stage => params.append('stages', stage));
  }
  if (filters.country?.length) {
    filters.country.forEach(country => params.append('country', country));
  }
  if (filters.search) {
    params.append('search', filters.search);
  }

  const response = await api(`/deals?${params.toString()}`);

  return {
    data: response.data,
    pagination: response.pagination
  };
};

// Uso
const { data: deals, pagination } = await fetchDeals(1, 50, {
  stages: ['Prospecting', 'Discovery'],
  country: ['Chile'],
  search: 'Microsoft'
});

console.log(`Total: ${pagination.total} deals`);
console.log(`Página ${pagination.page} de ${pagination.totalPages}`);
```

### Crear Deal

**Antes:**
```javascript
const createDeal = async (dealData) => {
  const result = await db('deals', 'POST', dealData);
  return result;
};
```

**Después:**
```javascript
const createDeal = async (dealData) => {
  try {
    const newDeal = await api('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData)
    });

    console.log('Deal creado:', newDeal);
    return newDeal;

  } catch (error) {
    console.error('Error al crear deal:', error);
    throw error;
  }
};

// Uso
const newDeal = await createDeal({
  company: 'Microsoft Chile',
  project: 'AI Implementation',
  stage: 'Prospecting',
  close_date: '2026-06-30',
  amount: '50000',
  software: 'Minddash',
  country: 'Chile',
  owner: currentUser.name,
  owner_id: currentUser.id
});
```

### Actualizar Deal

**Antes:**
```javascript
const updateDeal = async (dealId, updates) => {
  await db('deals', 'PATCH', updates, `?id=eq.${dealId}`);
};
```

**Después:**
```javascript
const updateDeal = async (dealId, updates) => {
  try {
    const updatedDeal = await api(`/deals/${dealId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });

    console.log('Deal actualizado:', updatedDeal);
    return updatedDeal;

  } catch (error) {
    console.error('Error al actualizar deal:', error);
    throw error;
  }
};

// Uso
await updateDeal('deal-uuid-123', {
  stage: 'Proposal',
  amount: '75000',
  next_steps: 'Enviar propuesta final'
});
```

### Eliminar Deal

**Antes:**
```javascript
const deleteDeal = async (dealId) => {
  await db('deals', 'DELETE', null, `?id=eq.${dealId}`);
};
```

**Después:**
```javascript
const deleteDeal = async (dealId) => {
  try {
    await api(`/deals/${dealId}`, {
      method: 'DELETE'
    });

    console.log('Deal eliminado');

  } catch (error) {
    console.error('Error al eliminar deal:', error);
    throw error;
  }
};
```

### Estadísticas

**Después (nueva funcionalidad):**
```javascript
const getDealsStats = async () => {
  const stats = await api('/deals/stats');

  console.log('Total deals:', stats.total);
  console.log('Por etapa:', stats.byStage);
  console.log('Por país:', stats.byCountry);
  console.log('Monto total:', stats.totalAmount);
  console.log('Monto promedio:', stats.avgAmount);

  return stats;
};
```

### Exportar a CSV

**Después (nueva funcionalidad):**
```javascript
const exportDealsToCSV = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.stages?.length) {
    filters.stages.forEach(s => params.append('stages', s));
  }
  // ... más filtros

  const response = await fetch(
    `${API_URL}/deals/export/csv?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  );

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `deals_export_${new Date().toISOString()}.csv`;
  a.click();
};

// Botón en UI
<button onClick={() => exportDealsToCSV(filters)}>
  📥 Exportar CSV
</button>
```

---

## 📝 3. Presales / Preventas

Similar a Deals:

```javascript
// Listar
const { data: presales } = await api('/presales?page=1&limit=50');

// Crear
const newPresale = await api('/presales', {
  method: 'POST',
  body: JSON.stringify({
    client: 'Cliente ABC',
    project: 'Proyecto XYZ',
    owner: currentUser.name,
    owner_id: currentUser.id
  })
});

// Actualizar
await api(`/presales/${id}`, {
  method: 'PUT',
  body: JSON.stringify({ stage: 'En progreso' })
});

// Eliminar
await api(`/presales/${id}`, { method: 'DELETE' });

// Exportar CSV
const exportPresalesCSV = async () => {
  const response = await fetch(`${API_URL}/presales/export/csv`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  const blob = await response.blob();
  // ... descargar
};
```

---

## 📤 4. Upload de Archivos

**Antes (directo a Supabase Storage):**
```javascript
const uploadFile = async (file) => {
  const filePath = `${Date.now()}_${file.name}`;
  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/proposal-hub/${filePath}`,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: file
    }
  );
  // ...
};
```

**Después (a través de la API):**
```javascript
const uploadFile = async (file, bucket = 'proposal-hub', folder = '') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  formData.append('folder', folder);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
      // NO incluir Content-Type, FormData lo maneja automáticamente
    },
    body: formData
  });

  const { success, data, error } = await response.json();

  if (!success) {
    throw new Error(error);
  }

  console.log('Archivo subido:', data.url);
  return data;
};

// Uso en componente
<input
  type="file"
  onChange={async (e) => {
    const file = e.target.files[0];
    const result = await uploadFile(file, 'proposal-hub', 'presales');
    // Guardar result.url en el presale/deal
  }}
/>
```

### Procesar DOCX

```javascript
const parseDocx = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload/parse-docx`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });

  const { success, data } = await response.json();

  if (success) {
    console.log('Texto extraído:', data.text);
    return data.text;
  }
};
```

---

## 🎨 5. Componente de React con Hooks

### Custom Hook para Deals

```javascript
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

const useDeals = (filters = {}, page = 1, limit = 50) => {
  const [deals, setDeals] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem('auth_token');

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (filters.stages?.length) {
        filters.stages.forEach(s => params.append('stages', s));
      }
      if (filters.country?.length) {
        filters.country.forEach(c => params.append('country', c));
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await fetch(
        `${API_URL}/deals?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      const result = await response.json();

      if (result.success) {
        setDeals(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [page, limit, JSON.stringify(filters)]);

  const createDeal = async (dealData) => {
    const response = await fetch(`${API_URL}/deals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dealData)
    });

    const result = await response.json();

    if (result.success) {
      fetchDeals(); // Refrescar lista
      return result.data;
    } else {
      throw new Error(result.error);
    }
  };

  const updateDeal = async (id, updates) => {
    const response = await fetch(`${API_URL}/deals/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    const result = await response.json();

    if (result.success) {
      fetchDeals(); // Refrescar
      return result.data;
    } else {
      throw new Error(result.error);
    }
  };

  const deleteDeal = async (id) => {
    const response = await fetch(`${API_URL}/deals/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const result = await response.json();

    if (result.success) {
      fetchDeals(); // Refrescar
    } else {
      throw new Error(result.error);
    }
  };

  return {
    deals,
    pagination,
    loading,
    error,
    refetch: fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal
  };
};

export default useDeals;
```

### Uso del Hook en Componente

```javascript
import useDeals from './hooks/useDeals';

function DealsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    stages: [],
    country: []
  });

  const {
    deals,
    pagination,
    loading,
    error,
    createDeal,
    updateDeal,
    deleteDeal
  } = useDeals(filters, page, 50);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Deals ({pagination?.total})</h1>

      {/* Filtros */}
      <div>
        <select
          multiple
          onChange={(e) => {
            const stages = Array.from(e.target.selectedOptions).map(o => o.value);
            setFilters({ ...filters, stages });
          }}
        >
          <option value="Prospecting">Prospecting</option>
          <option value="Discovery">Discovery</option>
          <option value="Proposal">Proposal</option>
        </select>
      </div>

      {/* Lista de deals */}
      {deals.map(deal => (
        <div key={deal.id}>
          <h3>{deal.company}</h3>
          <p>{deal.project}</p>
          <button onClick={() => deleteDeal(deal.id)}>Eliminar</button>
        </div>
      ))}

      {/* Paginación */}
      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>
        <span>Página {page} de {pagination?.totalPages}</span>
        <button
          disabled={page === pagination?.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
```

---

## ⚙️ 6. Configuración Centralizada

```javascript
// config/api.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class APIClient {
  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token ? `Bearer ${this.token}` : '',
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data;
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data.user;
  }

  async register(email, password, name) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
    this.setToken(data.token);
    return data.user;
  }

  // Deals
  async getDeals(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/deals?${query}`);
  }

  async createDeal(dealData) {
    return this.request('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData)
    });
  }

  async updateDeal(id, updates) {
    return this.request(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteDeal(id) {
    return this.request(`/deals/${id}`, {
      method: 'DELETE'
    });
  }
}

export const api = new APIClient();
export default api;
```

### Uso

```javascript
import api from './config/api';

// Login
const user = await api.login('user@example.com', 'password');

// Deals
const deals = await api.getDeals({ page: 1, limit: 50, stages: ['Prospecting'] });

// Crear
const newDeal = await api.createDeal({
  company: 'Google',
  stage: 'Discovery',
  // ...
});
```

---

## 🚀 Migración Gradual

No tienes que migrar todo de una vez:

1. **Fase 1**: Mantén ambos sistemas (directo a Supabase + API)
2. **Fase 2**: Migra autenticación a la API
3. **Fase 3**: Migra deals a la API
4. **Fase 4**: Migra presales a la API
5. **Fase 5**: Migra uploads a la API
6. **Fase 6**: Elimina código antiguo

---

## ✅ Checklist de Migración

- [ ] Instalar dependencias de frontend (ninguna nueva necesaria)
- [ ] Crear `config/api.js` con APIClient
- [ ] Migrar Login a usar `/api/auth/login`
- [ ] Guardar JWT token en localStorage
- [ ] Migrar listado de deals a `/api/deals`
- [ ] Migrar creación de deals a `/api/deals` POST
- [ ] Migrar actualización de deals a `/api/deals/:id` PUT
- [ ] Migrar eliminación de deals a `/api/deals/:id` DELETE
- [ ] Agregar exportación CSV
- [ ] Migrar presales de la misma manera
- [ ] Migrar uploads a `/api/upload`
- [ ] Testing completo
- [ ] Eliminar código antiguo de Supabase directo

---

¡Listo para integrar! 🎉

La migración es gradual y puedes hacerla por partes.
