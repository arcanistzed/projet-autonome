<script lang="ts">
    import type { Socket } from "socket.io-client";
    import { afterUpdate, beforeUpdate } from "svelte";

    export let socket: Socket;
    let inputValue: string,
        messages: string[] = [],
        container: HTMLUListElement,
        autoscroll: boolean;

    function sendMessage() {
        if (!inputValue) return;
        socket.emit("chat message", inputValue);
        inputValue = "";
    }

    socket.on("chat message", msg => {
        messages = [...messages, msg];
    });

    beforeUpdate(() => {
        autoscroll = container && container.offsetHeight + container.scrollTop > container.scrollHeight - 20;
    });

    afterUpdate(() => {
        if (autoscroll) container.scrollTo(0, container.scrollHeight);
    });
</script>

<div>
    <ul id="messages" bind:this={container}>
        {#each messages as message}
            <li>{message}</li>
        {/each}
    </ul>
    <form on:submit|preventDefault={sendMessage}>
        <input autocomplete="off" bind:value={inputValue} />
        <button id="send">
            <i class="fa-regular fa-paper-plane fa-lg" />
        </button>
    </form>
</div>

<style scoped>
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
        overflow-y: auto;
        word-break: break-all;
    }

    #messages > li {
        padding: 0.5em 0.5em;
        border-radius: 1em 1em 0 1em;
    }

    #messages > li:nth-child(odd) {
        background-color: hsla(0, 0%, 100%, 0.1);
    }
</style>
