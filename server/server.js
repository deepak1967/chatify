// server.js
const express = require("express");
const path = require('path');
const http = require("http");
const cors = require('cors');
const dotenv = require("dotenv");
const { setupSocket } = require("./socket");

const app = express();
app.use(cors());

// // Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;


const server = http.createServer(app);
setupSocket(server);

// Serve Angular static files
app.use(express.static(path.join(__dirname, '../client/dist/chatify')));

// Fallback route: serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/chatify/index.html'));
});


// Server Start
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

