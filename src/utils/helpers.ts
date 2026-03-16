import crypto from 'crypto';

/**
 * Hash password usando el mismo algoritmo que el frontend
 */
export const hashPassword = (password: string): string => {
  const combined = password + '_evolve_2026';
  return Buffer.from(combined).toString('base64');
};

/**
 * Formatea número como USD
 */
export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formatea fecha
 */
export const formatDate = (date: string): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-CL');
};

/**
 * Formatea fecha y hora
 */
export const formatDateTime = (date: string): string => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Genera ID único
 */
export const generateId = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Limpia y valida email
 */
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Valida rango de fecha
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

/**
 * Parsea query parameters de filtros
 */
export const parseFilters = (query: any): any => {
  const filters: any = {};

  if (query.stages) {
    filters.stages = Array.isArray(query.stages) ? query.stages : [query.stages];
  }

  if (query.country) {
    filters.country = Array.isArray(query.country) ? query.country : [query.country];
  }

  if (query.software) {
    filters.software = Array.isArray(query.software) ? query.software : [query.software];
  }

  if (query.owner) {
    filters.owner = Array.isArray(query.owner) ? query.owner : [query.owner];
  }

  if (query.search) {
    filters.search = query.search;
  }

  return filters;
};

/**
 * Crea respuesta API estandarizada
 */
export const createResponse = <T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
) => {
  return {
    success,
    ...(data && { data }),
    ...(error && { error }),
    ...(message && { message })
  };
};
