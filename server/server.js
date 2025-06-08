// server.js
const express = require("express");
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


// Server Start
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

