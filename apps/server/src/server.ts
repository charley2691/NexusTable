import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3001;

const app = express();

app.use(cors());

app.get("/", (_req, res) => {
  res.json({
    name: "NexusTable Server",
    version: "0.0.1",
    status: "online"
  });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174"
    ]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("request-status", () => {
    socket.emit("server-status", {
      connected: true,
      version: "0.0.1"
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`
================================
      NexusTable Server

      Status: ONLINE
      Port: ${PORT}
      Version: 0.0.1
================================
`);
});