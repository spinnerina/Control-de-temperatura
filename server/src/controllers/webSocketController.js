function setupWebSocket(webSocketServer) {

    webSocketServer.on('connection', (socket) => {
      console.log('Nueva conexión WebSocket');
  
      // Manejar eventos WebSocket
      socket.on('message', (message) => {
        console.log(`Mensaje recibido: ${message}`);
        // Lógica para manejar mensajes WebSocket
      });
  
      socket.on('close', () => {
        console.log('Conexión WebSocket cerrada');
        // Lógica para manejar el cierre de conexiones WebSocket
      });
    });
}


module.exports = {
    setupWebSocket,
};