const WebSocket = require('ws');
// Almacena clientes conectados
const clients = new Set();

function setupWebSocket(webSocketServer) {

    webSocketServer.on('connection', (socket) => {
      console.log('Bienvenido a mi WebSocket');
      clients.add(socket);

      // Maneja mensajes del cliente conectado
      socket.on('message', (message) => {
        clients.forEach((client) => {
          client.send(message);
      });
      });
  

      //Cierra la conexion WS
      socket.on('close', () => {
        console.log('Conexión WebSocket cerrada');
      });
    });

}

// Función para notificar a todos los clientes conectados
function notifyClients(datos) {
  const jsonData = JSON.stringify(datos); // Convertir el objeto a una cadena JSON
  clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
          client.send(jsonData); // Enviar la cadena JSON
      }
  });
}


module.exports = {
    setupWebSocket,
    notifyClients
};