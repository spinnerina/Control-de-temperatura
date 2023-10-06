const express = require('express');
const router = express.Router();

//Importar controlladores
const apiController = require('../controllers/apiController');

router.get('/saludo', apiController.saludo);
router.post('/webhook', apiController.guardarDatos);





module.exports = router;