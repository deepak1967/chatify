// Import the Socket.IO server class
const { Server } = require('socket.io');

const rooms = {};

// Function to set up socket handling on the given HTTP server
const setupSocket = (server) => {
  // Initialize socket.io server with CORS configuration
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Handle new socket connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for messages from the client
    socket.on('sendMessage', (chatMessage, room) => {
      if (room) {
        socket.to(room).emit('receiveMessage', chatMessage);
        console.log(`Message received: ${chatMessage.content} by ${chatMessage.sender}`);
      }
    });

    socket.on('joinRoom', (room, username, callback) => {
      socket.join(room);
      if (!rooms[room]) {
        rooms[room] = [];
      }

      const participant = { id: socket.id, username };
      const existingIndex = rooms[room].findIndex((user) => user.id === socket.id);
      if (existingIndex === -1) {
        rooms[room].push(participant);
      }

      callback({ room, id: socket.id, participants: rooms[room] });
      socket.to(room).emit('userJoined', participant);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      Object.keys(rooms).forEach((room) => {
        const index = rooms[room].findIndex((user) => user.id === socket.id);
        if (index !== -1) {
          const [leftUser] = rooms[room].splice(index, 1);
          if (rooms[room].length === 0) {
            delete rooms[room];
          } else {
            socket.to(room).emit('userLeft', leftUser);
          }
        }
      });
    });
  });
};

// Export the setup function to use in your main server file
module.exports = { setupSocket };
