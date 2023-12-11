const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const publicDirectoryPath = path.join(__dirname, "../public");

const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New web socket connection");
  socket.emit("message", "Welcome to our chat app !");
  socket.broadcast.emit("message", "A new user has joined !");
  socket.on("sendMessage", (msg) => {
    io.emit("sendBackToClient", msg);
  });
  socket.on("disconnect", () => {
    io.emit("message", "User has left the chat");
  });
});

server.listen(port, () => {
  console.log("Server listening on port " + port);
});
