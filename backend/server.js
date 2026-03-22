// server.js

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

// console.log(process.env);
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket connection event
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});