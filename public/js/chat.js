const socket = io();
socket.on("sendBackToClient", (msg) => {
  console.log(msg);
});
document.querySelector("#send").addEventListener("click", (e) => {
  e.preventDefault();
  const msg = document.querySelector("#text_box")?.value;
  socket.emit("sendMessage", msg);
});

socket.on("message", (msg) => {
  console.log(msg);
});
