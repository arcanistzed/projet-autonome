<script context="module">
    const couleur = Math.floor(Math.random() * 360);
    const uuid = crypto.randomUUID();
</script>

<script lang="ts">
    import type { Socket } from "socket.io-client";
    import type { Message } from "./global";
    import { afterUpdate, beforeUpdate } from "svelte";

    export let socket: Socket;
    let valeur: string,
        messages: Message[] = [],
        contenant: HTMLUListElement,
        défilement: boolean,
        utilisateurs: Set<string> = new Set();

    // Envoyé un nouveau message au serveur
    function envoyéMessage() {
        if (!valeur) return;
        socket.emit("message", { couleur, valeur });
        valeur = "";
    }

    // Afficher le nom des utilisateurs qui sont en train d'écrire
    function écriture(écrit: boolean) {
        écrit ? utilisateurs.add(uuid) : utilisateurs.delete(uuid);
        utilisateurs = utilisateurs; // Invalidé l'état pour mettre à jour l'interface
        socket.emit("écriture", utilisateurs); // Partagé avec les autres clients
    }

    // Ajouter les messages reçu à partir du serveur
    socket.on("message", message => {
        messages = [...messages, message];
    });

    // Avant la mise à jour, prendre la position de défilement
    beforeUpdate(() => {
        défilement = contenant && contenant.offsetHeight + contenant.scrollTop > contenant.scrollHeight - 20;
    });

    // Après la mise à jour, appliquer le défilement
    afterUpdate(() => {
        if (défilement) contenant.scrollTo(0, contenant.scrollHeight);
    });
</script>

<div>
    <ul id="messages" bind:this={contenant}>
        {#each messages as message}
            <li
                style={`background-color: hsla(${message.couleur}, 100%, 75%, 100%);`}
                class:externe={message.couleur === couleur}
            >
                {message.valeur}
            </li>
        {/each}
    </ul>
    {#if utilisateurs.size > 0}
        <small>
            {[...utilisateurs.values()].join(", ")}
            {utilisateurs.size === 1 ? "est" : "sont"} en train d'écrire &hellip;
        </small>
    {/if}
    <form on:submit|preventDefault={envoyéMessage}>
        <input autocomplete="off" bind:value={valeur} on:focus={() => écriture(true)} on:blur={() => écriture(false)} />
        <button id="envoyer">
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

    #envoyer {
        background: none;
        border: none;
        outline: none;
        border-radius: 0.5em;
    }

    #envoyer:hover,
    #envoyer:focus {
        background-color: hsla(0, 0%, 100%, 0.25);
    }

    #messages {
        list-style-type: none;
        margin: 0;
        padding: 0;
        height: 12em;
        overflow-y: scroll;
        scroll-snap-type: y proximity;
        word-break: break-all;
        border-radius: 1em;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    #messages > li {
        padding: 0.5em;
        border-radius: 1em 1em 1em 0;
        margin: 0 10% 0 0;
        scroll-snap-align: start;
    }

    #messages > li.externe {
        border-radius: 1em 1em 0 1em;
        margin: 0 0 0 10%;
    }
</style>
