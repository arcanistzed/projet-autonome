import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __dirname = fileURLToPath(new URL(".", import.meta.url));

app.use(express.static("public"));

io.on("connection", socket => {
  console.log(`Un utilisateur vient de se connecter à partir de ${socket.handshake.headers["x-forwarded-for"]})`);

  socket.on("message", msg => {
    console.log(`message: ${msg}`);
    io.emit("message", msg);
  });

  socket.on("mouvement", mv => {
    console.log(`mouvement: ${mv}`);
    socket.broadcast.emit("mouvement", mv);
  })

  socket.on("disconnect", () => {
    console.log("Un utilisateur vient de se déconnecter");
  });
});

server.listen(3000, () => {
  console.log("Serveur démarrez sur le port 3000!");
});
