import { writable } from "svelte/store";

export const couleur = writable("#8a0000");
export const nom = writable(crypto.randomUUID());
