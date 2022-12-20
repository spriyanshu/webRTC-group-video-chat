const express = require("express");
const authRouter = require("./src/routes/authRoutes");
const roomRouter = require("./src/routes/roomRoutes");
const https = require("https");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("public"));

app.use(express.json());
const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("test");
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});

app.get("/", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "Welcome to geekcast app",
  })
);

app.use("/auth/", authRouter);
app.use("/room/", roomRouter);

app.all("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "not found", message: "It looks you lost some where." });
});
module.exports = server;
