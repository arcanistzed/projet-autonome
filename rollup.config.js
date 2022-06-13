// Configuration pour le module bundler Rollup

// Importer les plugins utilisé
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import execute from "rollup-plugin-execute";
import livereload from "rollup-plugin-livereload";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";

// On est en production quand on est pas en mode watch
const production = !process.env.ROLLUP_WATCH;

export default {
    // Le fichier d'entrer
    input: "src/main.ts",
    output: {
        // Générer des sourcemaps quand on n'est pas en production
        sourcemap: !production,
        format: "iife",
        name: "app",
        // Où déposer le résultat
        file: "public/build/bundle.js",
    },
    plugins: [
        // Instructions pour compiler Svelte
        svelte({
            // Générer des sourcemaps quand on n'est pas en production
            preprocess: sveltePreprocess({ sourceMap: !production }),
            compilerOptions: {
                // Utiliser des vérification run-time quand on n'est pas en production
                dev: !production,
            },
        }),
        // Extraire le CSS des components dans un fichier séparer
        css({ output: "bundle.css" }),

        // Mode browser
        resolve({
            browser: true,
            // Forcé l'utilisation des fichier locale pour Svelte
            dedupe: ["svelte"],
        }),

        // Convertir le code CommonJS (qui utilise `require()`) en esmodules (qui utilise `import`)
        commonjs(),

        // Compiler le TypeScript avec des sourcemaps inline quand on n'est pas en production
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),

        // Ne pas faire, car Express fait déjà servir les fichiers
        // !production && serve(),

        // Démarrez l'application avec Node
        !production && execute("kill-port 3000 && node index.mjs"),

        // Rechargez quand il y a des modifications
        !production && livereload(),

        // Minifier le code en mode production
        production && terser(),
    ],
    watch: {
        // Garder les étaps précédent sur l'écran
        clearScreen: false,
    },
};
