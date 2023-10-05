const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const http = require('http');
const WebSocket = require('ws');
const app = express();
app.use(morgan('dev'));
require('dotenv').config();


// Middleware para verificar el token JWT
function verificaToken(req, res, next) {
    const token = req.headers['authorization'];
    console.log(process.env.SECRET_KEY);
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token de autenticación inválido' });
      }
      req.usuario = decoded; // Almacena la información del usuario decodificada en el objeto de solicitud
      next(); // Continúa con la ejecución de la ruta
    });
}

//Conf express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rutas públicas (sin protección de token)
const publicRoutes = require('./routes/publicRoutes');
app.use('/public', publicRoutes);

//Conf rutas api
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', verificaToken, apiRoutes);

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