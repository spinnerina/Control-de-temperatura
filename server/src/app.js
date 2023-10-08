const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
require('dotenv').config();



// Middleware para verificar el token JWT
function verificaTokenFijo(req, res, next) {
  const tokenEnviado = req.query.token; // Obtén el token de la URL
  if (tokenEnviado === process.env.SECRET_KEY) {
      // Token válido, permite el acceso a la ruta
      next();
  } else {
      // Token inválido, devuelve un error de autenticación
      return res.status(401).json({ message: 'Token de autenticación inválido' });
  }
}

//Conf express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Rutas públicas (sin protección de token)
const publicRoutes = require('./routes/publicRoutes');
app.use('/public', publicRoutes);

//Conf rutas api
const apiRoutes = require('./routes/apiRoutes');
app.use('/', verificaTokenFijo, apiRoutes);

//Creo servidor http
const server = http.createServer(app);

//Conf ws
const WebSocketServer = new WebSocket.Server({ server });
const webSocketController = require('./controllers/webSocketController');
webSocketController.setupWebSocket(WebSocketServer);

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=> {
    console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});