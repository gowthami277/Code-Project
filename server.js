const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const Message = require("./models/Message");

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

/* SOCKET.IO */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    const msg = new Message(data);
    await msg.save();
    socket.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("typing", (receiverId) => {
    socket.to(receiverId).emit("typing");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
