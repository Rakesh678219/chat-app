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

document.querySelector("#send_location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
});
