const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 8080;

// middleware
app.use(express.json());
app.use(cors());

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (data) => {
    try {
      const parsedData = JSON.parse(data);
      const name = parsedData.name;
      const message = parsedData.message;

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`${name}: ${message}`);
        }
      });
    } catch (error) {
      console.error("Invalid JSON received:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () =>
  console.log(`Server running on port http://localhost:${port}`)
);
