const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $message = document.querySelector("#message");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

const autoscroll = () => {
  //New message element
  const $newMessage = $message.lastElementChild

  //Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;


  //visible Height
  const visibleHeight = $message.offsetHeight

  //Height of messages container
  const containerHeight = $message.scrollHeight

  //How far have I scrolled
  const scrollOffset = $message.scrollTop + visibleHeight

  if(containerHeight - newMessageHeight <= scrollOffset){
    $message.scrollTop = $message.scrollHeight;
  }
}

socket.on("locationMessage", (message) => {
  console.log("inside location Message", message);
  const html = Mustache.render(locationMessageTemplate, { username: message.username,locationURL:message.locationURL,createdAt:moment(message.createdAt).format('h:mm a') });
  $message.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username:message.username,
    message: message.text,
    createdAt:moment(message.createdAt).format('h:mm a'),
  });
  $message.insertAdjacentHTML("beforeend", html);
  autoscroll()
});

socket.on('roomData',({room,users}) => {
  const html = Mustache.render(sidebarTemplate,{
    room,
    users
  })
  document.querySelector("#sidebar").innerHTML = html;
})

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = e.target.elements.message.value;
  //disable
  $messageFormButton.setAttribute("disabled", "disabled");
  socket.emit("sendMessage", message, () => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    console.log("The message was delivered");
  });
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browswer");
  }

  $sendLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;
      socket.emit("sendLocation", { latitude, longitude }, () => {
        $sendLocationButton.removeAttribute("disabled");
        console.log("Location Sent");
      });
    },
    (err) => {
      console.log("error", err);
    }
  );
});

socket.emit('join',{username,room},(error) => {
  if(error){
    alert(error)
    location.href = '/'
  }
});
