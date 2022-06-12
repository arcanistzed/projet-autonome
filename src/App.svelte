<script lang="ts">
    import { io } from "socket.io-client";

    import Board from "./Board.svelte";
    import Window from "./Window.svelte";
    import Chat from "./Chat.svelte";

    // Créer une nouvelle instance de Socket.IO sur le client
    const socket = io();
</script>

<main>
    <Board {socket} />
    <Window component={Chat} title={"Chat"} {socket} />
</main>
