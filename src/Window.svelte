<script lang="ts">
    import type { Socket } from "socket.io-client";
    import type { SvelteComponentTyped } from "svelte/internal";

    import { draggable } from "@neodrag/svelte";

    export let component: (new (...args: any) => SvelteComponentTyped) | null = null,
        title = "Window",
        fixed = false,
        inset = "auto",
        width = "unset",
        height = "unset",
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
    {#if fixed}
        <section class="fixed" style={`inset: ${inset}; width: ${width}; height: ${height}`}>
            <h1>{title}</h1>
            <svelte:component this={component} {socket} />
            <slot />
        </section>
    {:else}
        <section use:draggable={{ bounds: "body" }} style={`inset: ${inset}; width: ${width}; height: ${height}`}>
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
{/if}

<style>
    section {
        position: absolute;
        backdrop-filter: blur(50px);
        background-color: hsla(0, 0%, 100%, 0.5);
        padding: 0.5em;
        border-radius: 0.5em;
        color: black;
        box-shadow: 0 0 10px hsla(0, 0%, 10%, 25%);
    }

    .fixed {
        border-radius: 0;
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
