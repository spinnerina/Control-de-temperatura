const express = require('express');
const router = express.Router();

//Importar controlladores
const apiController = require('../controllers/apiController');

router.get('/', apiController.saludo);





module.exports = router;