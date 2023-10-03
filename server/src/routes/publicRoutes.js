const express = require('express');
const router = express.Router();

// Importar controladores
const apiController = require('../controllers/apiController');

// Rutas públicas
router.post('/login', apiController.login);

module.exports = router;