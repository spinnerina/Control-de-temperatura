// Almacena clientes conectados
const clients = new Set();

function setupWebSocket(webSocketServer) {

    webSocketServer.on('connection', (socket) => {
      console.log('Bienvenido a mi WebSocket');
      clients.add(socket);
  
      // Maneja mensajes del cliente conectado
      socket.on('message', (message) => {
        const jsonData = JSON.parse(message.data);
        console.log(`Mensaje recibido: ${jsonData.id}`);
        // Lógica para manejar mensajes WebSocket
      });
  

      //Cierra la conexion WS
      socket.on('close', () => {
        console.log('Conexión WebSocket cerrada');
      });
    });


    // Función para notificar a todos los clientes conectados
    function notifyClients(datos) {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(datos);
        }
      });
    }
}


module.exports = {
    setupWebSocket,
};