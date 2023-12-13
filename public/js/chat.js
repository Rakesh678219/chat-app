const socket = io();
//Elements
const $textBox = document.querySelector("#text_box");
const $sendButton = document.querySelector("#send");
const $sendLocationButton = document.querySelector("#send_location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message_template").innerHTML;
const locationTemplate = document.querySelector("#location_template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar_template").innerHTML;
//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });
  document.querySelector("#sidebar").innerHTML = html;
});

socket.on("locationMessage", (url) => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    username: url.username,
    url: url.url,
    createdAt: moment(url.createdAt).format("h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
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

const autoscroll = () => {
  //new msg element
  const $newMessage = $messages.lastElementChild;

  //height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //visible height
  const visibleHeight = $messages.offsetHeight;

  //height of messages container
  const containerHeight = $messages.scrollHeight;

  //how far i have scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (msg) => {
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    msg: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
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
  autoscroll();
});
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
