<script lang="ts">
    import type { Socket } from "socket.io-client";
    import * as CANNON from "cannon-es";
    import * as PE from "svelte-cannon";
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import DirecionalPerspectiveCamera from "./custom/DirectionalPerspectiveCamera.svelte";
    import ContactMaterial from "./custom/ContactMaterial.svelte";
    import Window from "./Window.svelte";

    export let socket: Socket;
    let width = 1,
        height = 1,
        depth = 1,
        color = "red",
        position = PE.writableVec3(0, 0, 0),
        direction: THREE.Vector3 & CANNON.Vec3,
        quadrant = 0;

    $: quadrant = Math.round(((Math.atan2(direction?.x, direction?.z) * 180) / Math.PI + 180 + 45) / 90);

    const keys: Set<string> = new Set();
    function keyDown(event: KeyboardEvent) {
        const { key } = event;
        keys.add(key);

        const { x, y, z } = $position;
        if (keys.has("ArrowLeft")  || keys.has("a"))  $position = $position.addScaledVector(1, new CANNON.Vec3(direction.z, 0, -direction.x));
        if (keys.has("ArrowRight") || keys.has("d"))  $position = $position.addScaledVector(-1, new CANNON.Vec3(direction.z, 0, -direction.x));
        if (keys.has(" "))       if ($position.y < 1) $position = $position.addScaledVector(1, new CANNON.Vec3(0, 1, 0));
        if (keys.has("ArrowUp")    || keys.has("w"))  $position = $position.addScaledVector(1, new CANNON.Vec3(direction.x, 0, direction.z));
        if (keys.has("ArrowDown")  || keys.has("s"))  $position = $position.addScaledVector(-1, new CANNON.Vec3(direction.x, 0, direction.z));
    }

    function keyUp(event: KeyboardEvent) {
        const { key } = event;
        keys.delete(key);
    }

    const loader = new THREE.TextureLoader();
    const floorTexture = loader.load("assets/floor.jpg");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    $: socket.timeout(5000).emit("mouvement", $position, (err: Error) => {
        if (err) {
            console.log(err);
        }
    });

    // Appliqué les mouvement survenu sur les autres clients
    socket.on("mouvement", (Δ: CANNON.Vec3) => {
        $position = $position.addScaledVector(1, Δ);
    });
</script>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} />

<PE.World gravity={[0, -9.81, 0]}>
    <SC.Canvas antialias background={new THREE.Color("skyblue")} fog={new THREE.FogExp2("skyblue", 0.1)} shadows>
        <DirecionalPerspectiveCamera bind:direction />
        <SC.OrbitControls maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
        <SC.AmbientLight intensity={0.5} />
        <SC.DirectionalLight intensity={0.8} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />
        <ContactMaterial />

        <!-- Floor -->
        <SC.Mesh
            geometry={new THREE.PlaneGeometry(50, 50)}
            material={new THREE.MeshStandardMaterial({ map: floorTexture})}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -height / 2, 0]}
            receiveShadow
        />
        <PE.Body rotation={[-Math.PI / 2, 0, 0]} position={[0, -height, 0]}>
            <PE.Plane />
        </PE.Body>

        <!-- Box -->
        <SC.Mesh
            geometry={new THREE.BoxGeometry()}
            material={new THREE.MeshStandardMaterial({ color })}
            scale={[width, height, depth]}
            position={$position.toArray()}
            castShadow
            receiveShadow
        />
        <PE.Body mass={10} bind:position={$position}>
            <PE.Box size={[width, height, depth]} />
        </PE.Body>

        <!-- Obstacle -->
        <SC.Mesh
            geometry={new THREE.BoxGeometry()}
            material={new THREE.MeshStandardMaterial({ color: "blue" })}
            scale={[width / 2, height / 2, depth / 2]}
            position={[2, -0.25, 0]}
            castShadow
            receiveShadow
        />
        <PE.Body mass={5} position={[2, -0.25, 0]}>
            <PE.Box size={[width / 2, height / 2, depth / 2]} />
        </PE.Body>
    </SC.Canvas>
</PE.World>

<Window title="Configuration">
    <input type="color" bind:value={color}>
</Window>