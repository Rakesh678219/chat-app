const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const publicDirectoryPath = path.join(__dirname, "../public");
const Filter = require("bad-words");
const server = http.createServer(app);
const io = socketio(server);
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New web socket connection");

  socket.on("join", ({ username, room }) => {
    socket.join(room);
    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined!`));
    //socket.emit io.emit , socket.broadcast.emit
    //io.to.emit , socket.broadcast.to.emit
  });
  socket.on("sendMessage", (msg, callback) => {
    const filter = new Filter();
    if (filter.isProfane(msg)) {
      return callback("Profanity is not allowed!");
    }
    io.to("123").emit("message", generateMessage(msg));
    callback();
  });
  socket.on("disconnect", () => {
    io.emit("message", generateMessage("User has left the chat"));
  });
  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps/?q=${latitude},${longitude}`
      )
    );
    callback();
  });
});

server.listen(port, () => {
  console.log("Server listening on port " + port);
});
