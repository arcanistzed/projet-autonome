<nav>
    <ul>
        <li><a href="https://daniel-math.netlify.app" target="_blank">Calculatrice</a></li>
        <li><a href="https://le-jeu-de-la-musique.netlify.app" target="_blank">Écriture</a></li>
        <li><a href="https://defilement-infinis.netlify.app" target="_blank">Défilement Infinis</a></li>
        <li><a href="drag-and-drop/">Drag & Drop</a></li>
        <li><a href="chronometre.html" target="_blank">Chronomètre</a></li>
        <li><a href="https://arcanist.me" target="_blank">Site</a></li>
    </ul>
</nav>

<style>
    nav {
        position: absolute;
        right: 0;
    }

    ul {
        display: inline-flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    li {
        backdrop-filter: blur(50px);
        background-color: hsla(0, 0%, 100%, 50%);
        transition: 250ms;
    }

    li:hover {
        background-color: hsla(0, 0%, 100%, 75%);
    }

    li:first-child {
        border-bottom-left-radius: 1rem;
    }

    a {
        display: block;
        color: black;
        text-decoration: none;
        font-weight: bold;
        padding: 1em;
    }
</style>
