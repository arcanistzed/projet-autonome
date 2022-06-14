<script lang="ts">
    import type { Socket } from "socket.io-client";
    import type { Message } from "./global";
    import { afterUpdate, beforeUpdate } from "svelte";
    import { nom } from "./stores";

    const couleur = Math.floor(Math.random() * 360);

    export let socket: Socket;
    let valeur: string,
        messages: Message[] = [],
        contenant: HTMLUListElement,
        défilement: boolean,
        utilisateurs: string[] = [];

    // Envoyé un nouveau message au serveur
    function envoyéMessage() {
        if (!valeur) return;
        socket.emit("message", { couleur, valeur, nom: $nom });
        valeur = "";
    }

    // Partager ceux qui écrivent avec les autres clients
    function écriture(écrit: boolean) {
        socket.emit("écriture", $nom, écrit);
    }

    // Ajouter les messages reçu à partir du serveur
    socket.on("message", (message: Message) => {
        messages = [...messages, message];
    });

    // Mettre à jour les utilisateurs à partir du serveur
    socket.on("écriture", (u: string[]) => {
        utilisateurs = u;
        console.log(utilisateurs);
    });

    // Avant la mise à jour, prendre la position de défilement
    beforeUpdate(() => {
        défilement = contenant && contenant.offsetHeight + contenant.scrollTop > contenant.scrollHeight - 20;
    });

    // Après la mise à jour, appliquer le défilement
    afterUpdate(() => {
        if (défilement) contenant.scrollTo(0, contenant.scrollHeight);
    });

    // Enlever le nom précedent quand c'est changer
    nom.subscribe(() => {
        socket.emit("écriture", $nom, false);
    });

    const formatter = new Intl.ListFormat("fr-CA", { style: 'long', type: 'conjunction' });
</script>

<div>
    <ul id="messages" bind:this={contenant}>
        {#each messages as message}
            <li
                style={`background-color: hsla(${message.couleur}, 100%, 75%, 100%);`}
                class:externe={message.couleur === couleur}
            >
                {message.valeur}
                <small>{message.nom}</small>
            </li>
        {/each}
    </ul>
    {#if utilisateurs.length > 0}
        <small>
            {formatter.format(utilisateurs)}
            {utilisateurs.length === 1 ? "est" : "sont"} en train d'écrire
            &hellip;
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
        height: 15em;
        overflow-y: scroll;
        scroll-snap-type: y proximity;
        word-break: break-all;
        border-radius: 1em;
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
    }

    li {
        padding: 0.5em;
        border-radius: 1em 1em 1em 0;
        margin: 0 10% 0 0;
        scroll-snap-align: start;
        position: relative;
    }

    li.externe {
        border-radius: 1em 1em 0 1em;
        margin: 0 0 0 10%;
    }

    li small {
        opacity: 0.5;
        position: absolute;
        bottom: -1rem;
        right: 0.5rem;
    }
</style>
