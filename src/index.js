// Archivo: api-gateway/src/index.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de servicios
const SERVICES = {
  VEHICULAR_BACKEND: process.env.VEHICULAR_BACKEND_URL || 'http://impuesto-vehicular-backend:8000',
};

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas de redirección a microservicios
// Impuesto Vehicular - API Backend
app.use('/api/vehicular', createProxyMiddleware({
  target: SERVICES.VEHICULAR_BACKEND,
  pathRewrite: { '^/api/vehicular': '/api/v1' },
  changeOrigin: true,
  onProxyRes: function(proxyRes) {
    // Asegurar que las respuestas tengan los headers CORS correctos
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
  }
}));

// Ruta de verificación de salud
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    services: SERVICES
  });
})

// Ruta por defecto
app.use('/', (req, res) => {
  res.status(200).json({
    message: 'API Gateway para Sistema de Impuestos',
    endpoints: [
      '/api/vehicular', // API Backend para el servicio vehicular
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`API Gateway ejecutándose en el puerto ${PORT}`);
  console.log('Servicios configurados:', SERVICES);
});
