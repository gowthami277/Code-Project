const socket = io("http://localhost:5000");

const userId = prompt("Enter your user id (user1)");
const receiverId = prompt("Enter receiver user id (user2)");

socket.on("connect", () => {
  socket.emit("registerUser", userId);
});

function sendMessage() {
  const message = document.getElementById("message").value;

  socket.emit("sendMessage", {
    senderId: userId,
    receiverId: receiverId,
    message
  });

  document.getElementById("chat").innerHTML += `<p>You: ${message}</p>`;
}

socket.on("receiveMessage", (data) => {
  document.getElementById("chat").innerHTML +=
    `<p>${data.senderId}: ${data.message}</p>`;
});
