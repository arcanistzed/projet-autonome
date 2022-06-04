<script lang="ts">
    import type { Socket } from "socket.io-client";
    import type { SvelteComponentTyped } from "svelte/internal";

    import { draggable } from "@neodrag/svelte";

    export let component: (new (...args: any) => SvelteComponentTyped) | null = null,
        title = "Window",
        socket: Socket | null = null;

    let minimized = false,
        closed = false;

    function minimize() {
        minimized = !minimized;
    }

    function close() {
        closed = !closed;
    }
</script>

{#if !closed}
    <section use:draggable={{ bounds: "body" }}>
        <header>
            <h1>{title}</h1>
            <button on:click={minimize}>
                <i class="fa-regular fa-fw {minimized ? 'fa-window-maximize' : 'fa-window-minimize'}" />
            </button>
            <button on:click={close}><i class="fas fa-close fa-fw" /></button>
        </header>
        {#if !minimized}
            <svelte:component this={component} {socket} />
            <slot />
        {/if}
    </section>
{/if}

<style>
    section {
        position: absolute;
        bottom: 0.5em;
        right: 0.5em;
        width: 30%;
        backdrop-filter: blur(50px);
        background-color: hsla(0, 0%, 100%, 0.5);
        padding: 0.5em;
        border-radius: 0.5em;
        color: black;
    }

    header {
        display: flex;
        align-items: flex-start;
    }

    h1 {
        margin: 0.5em;
        flex-grow: 1;
    }

    button {
        background: none;
        border: none;
        border-radius: 0.5em;
        padding: 0.5em;
    }

    button:hover,
    button:focus {
        background-color: hsla(0, 0%, 100%, 0.25);
    }
</style>
