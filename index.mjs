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
    socket.on("message", (/** @type {import("./src/global").Message} */ message) => {
        console.log(`message: ${message.valeur}`);

        // Envoyé le message à tous les clients
        io.emit("message", message);
    });

    // Indicateur d'écriture
    socket.on("écriture", utilisateurs => {
        console.log(`Un utilisateur est en train d'écrire...`);

        // Envoyé le à tous les autres clients
        socket.broadcast.emit("écriture", utilisateurs);
    });

    // Lors de la reception d'événements "mouvement"
    socket.on("mouvement", (/** @type {import("cannon-es").Vec3} */ Δ) => {
        console.log(`mouvement:`, Δ);

        // Envoyé le delta de mouvement à tous les clients
        io.emit("mouvement", Δ);
    });

    // Lors de la déconnection
    socket.on("disconnect", () => {
        console.log("Un utilisateur vient de se déconnecter");
    });
});

// Démarrez le serveur
server.listen(3000, () => {
    console.log("\x1b[4;32m", "Serveur démarrez sur le port 3000!", "\x1b[0m");
});
