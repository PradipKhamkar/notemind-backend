import express from "express";
import { createServer } from "http";
import { Server } from "socket.io"
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer,{
});

io.on("connect", (socket) => {
  console.log('Socket Connected Successfully!', socket.id);
   socket.on("error", (err) => {
    console.log("❌ Socket error:", err);
  });
});


export { app, io,httpServer }