export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'seller' | 'presales';
  approved: boolean;
  created_at: string;
}

export interface Deal {
  id?: string;
  company: string;
  project: string;
  stage: string;
  close_date: string;
  amount: number;
  software: string;
  country: string;
  power_sponsor: string;
  sponsor: string;
  owner: string;
  owner_id: string;
  next_steps: string;
  next_steps_date: string;
  created_at?: string;
}

export interface Contact {
  id?: string;
  nombre: string;
  cargo: string;
  empresa: string;
  industria: string;
  departamento: string;
  pais: string;
  tamano_empresa: string;
  email?: string;
  telefono?: string;
  linkedin?: string;
  fuente: string[];
  estado: string;
  prioridad: string;
  account_owner?: string;
  evolve_owner?: string;
  created_at?: string;
}

export interface Proposal {
  id?: string;
  cliente: string;
  empresa: string;
  contexto: string;
  prioridad: string;
  estado: string;
  creado_por: string;
  asignado_a: string;
  fecha_entrega: string;
  archivo_url?: string;
  archivo_nombre?: string;
  archivo_tipo?: string;
  archivo_size?: number;
  estado_poc?: string;
  soe_status?: string;
  created_at?: string;
}

export interface ProposalTemplate {
  id?: string;
  nombre: string;
  linea_negocio: string;
  subcategoria: string;
  industria_sugerida: string;
  descripcion: string;
  nivel_complejidad: string;
  tipo_cliente: string;
  archivo_url: string;
  version: string;
  tags: string[];
  descargas_count: number;
  activa: boolean;
  owner_id: string;
  created_at?: string;
}

export interface Interaction {
  id?: string;
  contacto_id: string;
  tipo: 'llamada' | 'whatsapp' | 'email' | 'reunion';
  fecha: string;
  notas: string;
  resultado: string;
  proximo_paso: string;
  created_at?: string;
}

export interface Comment {
  id?: string;
  propuesta_id: string;
  usuario_id: string;
  usuario_nombre: string;
  texto: string;
  created_at?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | string[] | number | boolean | undefined;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
