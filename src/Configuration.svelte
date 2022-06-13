<script lang="ts">
    import Fenetre from "./Fenetre.svelte";
    import Aide from "./Aide.svelte";
    import { color } from "./stores";
</script>

<Fenetre titre="Configuration">
    <input type="color" bind:value={$color} />
    <Aide />
</Fenetre>

<style>
    input {
        background: none;
        border: none;
        transition: 250ms;
        padding: 0;
        vertical-align: middle;
        height: 2rem;
        display: inline-flex;
        align-items: center;
        min-width: 5rem;
        gap: 0.5rem;
    }

    input::after {
        content: "\f1fb";
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
        font-size: 1rem;
    }
</style>
