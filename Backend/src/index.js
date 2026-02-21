if (process.env.NODE_ENV !== 'production') {
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

const http = require("http");                 
const { dbConnect } = require("./database/connectionManager.js");
const { app } = require("./server.js");
const initSocket = require("./sockets/websocket.js");

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

// DATABASE CONNECTION
dbConnect().then(() => {
  // Create HTTP server from Express app
  const server = http.createServer(app);

  // Attach Socket.IO to the HTTP server
  initSocket(server);

  // Start server
  server.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port:", PORT);
  });
});

