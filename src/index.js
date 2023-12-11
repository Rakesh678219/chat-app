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

let count = 0;
io.on("connection", (socket) => {
  console.log("New web socket connection");
  socket.emit("countUpdated", count);
  socket.on("increment", () => {
    count++;
    io.emit("countUpdated", count);
  });
});

server.listen(port, () => {
  console.log("Server listening on port " + port);
});
