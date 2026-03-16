import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import authRoutes from './routes/auth.routes';
import dealsRoutes from './routes/deals.routes';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares de seguridad
app.use(helmet());
app.use(compression());

// CORS
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'];
const corsOptions = {
  origin: corsOrigins,
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000');
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
const limiter = rateLimit({
  windowMs: windowMs,
  max: maxRequests
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas principales
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Forecast Evolve API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      deals: '/api/deals',
      contacts: '/api/contacts',
      ai: '/api/ai',
      presales: '/api/presales',
      proposals: '/api/proposals',
      users: '/api/users'
    }
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealsRoutes);

// Manejo de rutas no encontradas
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Manejo global de errores
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Iniciar servidor
const nodeEnv = process.env.NODE_ENV || 'development';
app.listen(PORT, () => {
  console.log('🚀 Forecast Evolve API running on port ' + PORT);
  console.log('📍 Environment: ' + nodeEnv);
  console.log('🔗 Health check: http://localhost:' + PORT + '/health');
});

export default app;
