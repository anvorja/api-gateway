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
  VEHICULAR: process.env.VEHICULAR_SERVICE_URL || 'http://impuesto-vehicular-service:3001',
  PREDIAL: process.env.PREDIAL_SERVICE_URL || 'http://impuesto-predial-service:3002',
  CONSUMO: process.env.CONSUMO_SERVICE_URL || 'http://impuesto-consumo-service:3003',
  GANADO: process.env.GANADO_SERVICE_URL || 'http://impuesto-ganado-service:3004'
};

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas de redirección a microservicios
// Impuesto Vehicular
app.use('/api/vehicular', createProxyMiddleware({
  target: SERVICES.VEHICULAR,
  pathRewrite: { '^/api/vehicular': '/api/vehiculos' },
  changeOrigin: true
}));

// Impuesto Predial
app.use('/api/predial', createProxyMiddleware({
  target: SERVICES.PREDIAL,
  pathRewrite: { '^/api/predial': '/api/predios' },
  changeOrigin: true
}));

// Impuesto de Consumo
app.use('/api/consumo', createProxyMiddleware({
  target: SERVICES.CONSUMO,
  pathRewrite: { '^/api/consumo': '/api/productos' },
  changeOrigin: true
}));

// Impuesto Ganado Mayor
app.use('/api/ganado', createProxyMiddleware({
  target: SERVICES.GANADO,
  pathRewrite: { '^/api/ganado': '/api/ganado' },
  changeOrigin: true
}));

// Ruta de verificación de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', services: SERVICES });
});

// Ruta por defecto
app.use('/', (req, res) => {
  res.status(200).json({
    message: 'API Gateway para Sistema de Impuestos',
    endpoints: [
      '/api/vehicular',
      '/api/predial',
      '/api/consumo',
      '/api/ganado'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`API Gateway ejecutándose en el puerto ${PORT}`);
  console.log('Servicios configurados:', SERVICES);
});
