const express = require('express');
const fs = require('fs');
const router = express.Router();

// Ruta para obtener la URL del webhook
router.get('/webhook-config', (req, res) => {
  try {
    // Intenta leer el archivo de configuración
    const configPath = '/n8n_data/n8n_webhook_config.json';
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return res.json({ success: true, webhookUrl: config.url });
    } else {
      console.log('Archivo de configuración no encontrado, retornando fallback URL');
      return res.json({ 
        success: true, 
        webhookUrl: 'http://localhost:5678/webhook/3d8a4725-814b-4d5e-b9fb-faf2f20deaca/chat'
      });
    }
  } catch (error) {
    console.error('Error al leer configuración del webhook:', error);
    return res.json({ 
      success: true, 
      webhookUrl: 'http://localhost:5678/webhook/3d8a4725-814b-4d5e-b9fb-faf2f20deaca/chat'
    });
  }
});

module.exports = router;
