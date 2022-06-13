<script lang="ts">
    let ouvert = false;
</script>

<button type="button" on:click={() => (ouvert = !ouvert)}>
    <i class="fa-solid fa-chevron-{ouvert ? 'up' : 'down'}" />
    Aide
</button>

{#if ouvert}
    <p>Avancé <kbd>&uparrow;</kbd> ou <kbd>W</kbd></p>
    <p>Reculé <kbd>&downarrow;</kbd> ou <kbd>S</kbd></p>
    <p>Gauche <kbd>&leftarrow;</kbd> ou <kbd>A</kbd></p>
    <p>Droite <kbd>&rightarrow;</kbd> ou <kbd>D</kbd></p>
    <p>Sauter <kbd>&bbrk;</kbd></p>
{/if}

<style>
    button {
        background: hsla(0, 0%, 0%, 10%);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: 250ms;
    }

    button:hover {
        background: hsla(0, 0%, 0%, 25%);
    }

    p {
        margin: 0.25rem 0;
    }

    kbd {
        padding: 0.1em 0.6em;
        border: 1px solid #ccc;
        background-color: white;
        box-shadow: 1px 1px 1px hsl(0, 0%, 0%, 20%);
        border-radius: 3px;
        white-space: nowrap;
    }
</style>
