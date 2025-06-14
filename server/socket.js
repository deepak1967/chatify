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

    // Listen for messages from the client

    socket.on('sendMessage', (chatMessage, room) => {
      if (room) {
        // Connected only those clients which join the room
        socket.to(room).emit('receiveMessage', chatMessage);
        console.log(`Message received: ${chatMessage.content} by ${chatMessage.sender}`);
      } else {
        // Broadcast the message to all connected clients
        socket.broadcast.emit('receiveMessage', chatMessage);
        console.log(`Message received: ${chatMessage.content} by ${chatMessage.sender}`);
      }
    });

    socket.on('joinRoom', (room) => {
      socket.join(room);
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
