<script lang="ts">
    import Fenetre from "./Fenetre.svelte";
    import Aide from "./Aide.svelte";
    import { couleur, nom } from "./stores";
</script>

<Fenetre titre="Configuration">
    <label>Couleur <input type="color" bind:value={$couleur} /></label>
    <label>Nom <input type="text" bind:value={$nom} /></label>
    <Aide />
</Fenetre>

<style>
    input {
        background: none;
        border: none;
        transition: 250ms;
        vertical-align: middle;
        display: inline-flex;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
    }

    input[type=color] {
        padding: 0;
        height: 2rem;
    }

    input[type=text] {
        border-bottom: 1px solid black;
    }

    input::after {
        content: "\f1fb";
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
        font-size: 1rem;
    }
</style>
