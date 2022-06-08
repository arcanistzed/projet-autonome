<script>
import { onDestroy } from "svelte";
import { writable } from "svelte/store";
import { getCannonContext, setCannonContext } from "svelte-cannon/context-fns";
import { Material, ContactMaterial } from "cannon-es";
export let material = new Material({ friction: 0, restitution: 1 });
export let contactMaterial = new ContactMaterial(material, material, {});
const context = getCannonContext();
const { world } = context;
world.addContactMaterial(contactMaterial);
const store = writable(contactMaterial);
setCannonContext({ ...context, contactMaterial: store });
$: syncMaterial(material);
$: sync(contactMaterial);
$: store.set(contactMaterial);
let prevMaterial;
function syncMaterial(_material) {
    if (prevMaterial !== _material) {
        contactMaterial.material = _material || null;
    }
    prevMaterial = _material;
}
let prevContactMaterial;
function sync(_contactMaterial) {
    if (prevContactMaterial) {
        world.removeContactMaterla(prevContactMaterial);
    }
    world.addContactMaterial(_contactMaterial);
    prevContactMaterial = _contactMaterial;
}
onDestroy(() => {
    world.removeShape(contactMaterial);
});
</script>

<slot />