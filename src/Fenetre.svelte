<script lang="ts">
    import type { Socket } from "socket.io-client";
    import type { SvelteComponentTyped } from "svelte/internal";

    import { draggable } from "@neodrag/svelte";

    export let component: (new (...args: any) => SvelteComponentTyped) | null = null,
        titre = "Window",
        fixé = false,
        inset = "auto",
        largeur = "unset",
        hauteur = "unset",
        socket: Socket | null = null;

    let minimizer = false,
        fermer = false;

    function minimize() {
        minimizer = !minimizer;
    }

    function ferme() {
        fermer = !fermer;
    }
</script>

{#if !fermer}
    {#if fixé}
        <dialog class="fixé" style={`inset: ${inset}; width: ${largeur}; height: ${hauteur}`}>
            <h1>{titre}</h1>
            <svelte:component this={component} {socket} />
            <slot />
        </dialog>
    {:else}
        <dialog use:draggable={{ bounds: "body" }} style={`inset: ${inset}; width: ${largeur}; height: ${hauteur}`}>
            <header>
                <h1>{titre}</h1>
                <button on:click={minimize}>
                    <i class="fa-regular fa-fw {minimizer ? 'fa-window-maximize' : 'fa-window-minimize'}" />
                </button>
                <button on:click={ferme}><i class="fas fa-close fa-fw" /></button>
            </header>

            {#if !minimizer}
                <svelte:component this={component} {socket} />
                <slot />
            {/if}
        </dialog>
    {/if}
{/if}

<style>
    dialog {
        position: absolute;
        backdrop-filter: blur(50px);
        background-color: hsla(0, 0%, 100%, 0.5);
        padding: 0.5em;
        border-radius: 0.5em;
        color: black;
        box-shadow: 0 0 10px hsla(0, 0%, 10%, 25%);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border: none;
    }

    .fixé {
        margin: 0.5rem;
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
