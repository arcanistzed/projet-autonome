<script lang="ts">
    import { io } from "socket.io-client";

    import Jeu from "./Jeu.svelte";
    import Fenetre from "./Fenetre.svelte";
    import Chat from "./Chat.svelte";
    import Navigation from "./Navigation.svelte";
    import Configuration from "./Configuration.svelte";

    // Créer une nouvelle instance de Socket.IO sur le client
    const socket = io();
</script>

<main>
    <Jeu {socket} />
    <Navigation />
    <Configuration />
    <Fenetre component={Chat} titre={"Chat"} {socket} inset={"auto 0.5rem 0.5rem auto"} largeur={"30%"}/>
</main>
