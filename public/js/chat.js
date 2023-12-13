const socket = io();
//Elements
const $textBox = document.querySelector("#text_box");
const $sendButton = document.querySelector("#send");
const $sendLocationButton = document.querySelector("#send_location");
socket.on("sendBackToClient", (msg) => {
  console.log(msg);
});
$sendButton.addEventListener("click", (e) => {
  e.preventDefault();
  //disable
  $sendButton.setAttribute("disabled", "disabled");
  const msg = $textBox?.value;
  socket.emit("sendMessage", msg, (error) => {
    //enable
    $sendButton.removeAttribute("disabled");
    $textBox.value = "";
    $textBox.focus();
    if (error) {
      return console.error(error);
    } else {
      console.log("message delivered successfully to server");
    }
  });
});

socket.on("message", (msg) => {
  console.log(msg);
});

$sendLocationButton.addEventListener("click", () => {
  //disable
  $sendLocationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    //enable
    $sendLocationButton.removeAttribute("disabled");
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("Location shared !");
      }
    );
  });
});
