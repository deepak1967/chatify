// Import the Socket.IO server class
const { Server } = require('socket.io');

let users = [];

// Function to set up socket handling on the given HTTP server
const setupSocket = (server) => {
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

    socket.on('joinUser', (username) => {
      const user = {
        username,
        id: socket.id
      }

      const existingUser = users.find(u => u.id === user.id);
      if (!existingUser) {
        users.push(user);
        return;
      }
      io.emit('allUsers', users);
    });


    // Listen for messages from the client
    socket.on('sendMessage', (message) => {
      console.log(`Message received: ${message} by ${socket.id}`);

      // Broadcast the message to all connected clients
      io.emit('receiveMessage', message);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      const index = users.findIndex(user => user.id === socket.id);
      if (index !== -1) {
        users.splice(index, 1);
      }
    });
  });
}

// Export the setup function to use in your main server file
module.exports = { setupSocket };
