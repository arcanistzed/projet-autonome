<script context="module">
    const couleur = Math.floor(Math.random() * 360);
</script>

<script lang="ts">
    import type { Socket } from "socket.io-client";
    import type { Message } from "./global";
    import { afterUpdate, beforeUpdate } from "svelte";
    
    export let socket: Socket;
    let valeur: string,
        messages: Message[] = [],
        contenant: HTMLUListElement,
        défilement: boolean;

    function envoyéMessage() {
        if (!valeur) return;
        socket.emit("message", {couleur, valeur});
        valeur = "";
    }

    socket.on("message", message => {
        messages = [...messages, message];
    });

    beforeUpdate(() => {
        défilement = contenant && contenant.offsetHeight + contenant.scrollTop > contenant.scrollHeight - 20;
    });

    afterUpdate(() => {
        if (défilement) contenant.scrollTo(0, contenant.scrollHeight);
    });
</script>

<div>
    <ul id="messages" bind:this={contenant}>
        {#each messages as message}
            <li style={`background-color: hsla(${message.couleur}, 100%, 75%, 100%);`} class:external={message.couleur === couleur}>{message.valeur}</li>
        {/each}
    </ul>
    <form on:submit|preventDefault={envoyéMessage}>
        <input autocomplete="off" bind:value={valeur} />
        <button id="send">
            <i class="fa-regular fa-paper-plane fa-lg" />
        </button>
    </form>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    form {
        display: flex;
        gap: 0.5rem;
    }

    input {
        border: none;
        padding: 0 0.5em;
        height: 2em;
        width: 0;
        flex-grow: 1;
        border-radius: 0.5em;
        font-size: 1em;
    }

    input:focus {
        outline: none;
    }

    #send {
        background: none;
        border: none;
        outline: none;
        border-radius: 0.5em;
    }

    #send:hover,
    #send:focus {
        background-color: hsla(0, 0%, 100%, 0.25);
    }

    #messages {
        list-style-type: none;
        margin: 0;
        padding: 0;
        height: 10em;
        overflow-y: scroll;
        word-break: break-all;
        border-radius: 1em;
        box-shadow: inset 0 0 5px hsla(0, 0%, 10%, 25%);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    #messages > li {
        padding: 0.5em;
        border-radius: 1em 1em 1em 0;
        margin: 0 10% 0 0;
    }

    #messages > li.external {
        border-radius: 1em 1em 0 1em;
        margin: 0 0 0 10%;
    }
</style>
