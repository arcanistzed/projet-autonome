// Importé les libraries utilisé par le serveur
import express from "express";
import http from "http";
import { Server } from "socket.io";

// Créer une nouvelle application Express
const app = express();

// Créer un serveur HTTP
const server = http.createServer(app);

// Créer une instance de Socket.IO à partir du serveur
const io = new Server(server);

// Utiliser les fichier static dans le directoire `public`
app.use(express.static("public"));

// Lors d'une connection au Socket
io.on("connection", socket => {
    console.log(`Un utilisateur vient de se connecter à partir de ${socket.handshake.headers["x-forwarded-for"]})`);

    // Lors de la reception d'événements "message" chat
    socket.on("message", msg => {
        console.log(`message: ${msg}`);

        // Envoyé le message à tous les clients
        io.emit("message", msg);
    });

    // Lors de la reception d'événements "mouvement"
    socket.on("mouvement", mv => {
        console.log(`mouvement:`, mv);

        // Envoyé le mouvement à tous les autres clients
        socket.broadcast.emit("mouvement", mv);
    });

    // Lors de la déconnection
    socket.on("disconnect", () => {
        console.log("Un utilisateur vient de se déconnecter");
    });
});

// Démarrez le serveur
server.listen(3000, () => {
    console.log("Serveur démarrez sur le port 3000!");
});
