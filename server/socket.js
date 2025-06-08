// Import the Socket.IO server class
const { Server } = require('socket.io');

// Function to set up socket handling on the given HTTP server
const setupSocket = (server)  => {
  // Initialize socket.io server with CORS configuration
const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  // Handle new socket connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for messages from the client
    socket.on('sendMessage', (message) => {
      console.log(`Message received: ${message} by ${socket.id}` );

      // Broadcast the message to all connected clients
      io.emit('receiveMessage', message);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

// Export the setup function to use in your main server file
module.exports = { setupSocket };
