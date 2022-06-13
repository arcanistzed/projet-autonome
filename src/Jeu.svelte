<script lang="ts">
    import type { Socket } from "socket.io-client";
    import * as CANNON from "cannon-es";
    import * as PE from "svelte-cannon";
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import DirectionalPerspectiveCamera from "./custom/DirectionalPerspectiveCamera.svelte";
    import { color } from "./stores";

    export let socket: Socket;

    let grandeur = 1,
        position = PE.writableVec3(0, 0, 0),
        direction: THREE.Vector3 & CANNON.Vec3;

    const keys: Set<string> = new Set();
    function keyDown(event: KeyboardEvent) {
        const { key } = event;
        if (document.activeElement?.matches("input")) return;
        keys.add(key);

        // Trouvé le quadrant de l'angle du camera en degré
        const quadrant = Math.round(((Math.atan2(direction?.x, direction?.z) * 180) / Math.PI + 90) / 90),
            SIN = Math.sin((quadrant * Math.PI) / 2),
            COS = Math.cos((quadrant * Math.PI) / 2);

        let Δ = new CANNON.Vec3();
        if (keys.has("ArrowLeft") || keys.has("a")) Δ.set(SIN, 0, COS);
        if (keys.has("ArrowRight") || keys.has("d")) Δ.set(-SIN, 0, -COS);
        if (keys.has("ArrowUp") || keys.has("w")) Δ.set(-COS, 0, SIN);
        if (keys.has("ArrowDown") || keys.has("s")) Δ.set(COS, 0, -SIN);
        if (keys.has(" ") && Number($position.y.toFixed(3)) == 0) Δ.set(0, 1, 0);
        socket.emit("mouvement", Δ);
    }

    function keyUp(event: KeyboardEvent) {
        const { key } = event;
        keys.delete(key);
    }

    // Texture du sol
    const floorLoader = new THREE.TextureLoader();
    const floorTexture = floorLoader.load("assets/floor.jpg");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    // Model 3d du pion
    const objLoader = new GLTFLoader();
    let model: THREE.BufferGeometry;
    objLoader.load("assets/pion.glb", ({ scene }) => {
        // @ts-expect-error
        model = scene.children.at(-1)!.geometry;
        model.scale(0.5, 0.5, 0.5);
    });

    // Appliqué les mouvement survenu sur les autres clients
    socket.on("mouvement", (Δ: CANNON.Vec3) => {
        $position = $position.addScaledVector(1, Δ);
    });
</script>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} />

<PE.World gravity={[0, -9.81, 0]}>
    <SC.Canvas antialias background={new THREE.Color("skyblue")} fog={new THREE.FogExp2("skyblue", 0.1)} shadows>
        <DirectionalPerspectiveCamera bind:direction />
        <SC.OrbitControls
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            enableZoom={false}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.5}
            target={[0, 1, 0,]}
        />
        <SC.AmbientLight intensity={0.5} />
        <SC.DirectionalLight intensity={0.8} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />

        <!-- Floor -->
        <SC.Group position={[0, -grandeur / 2, 0]}>
            <SC.Mesh
                geometry={new THREE.PlaneGeometry(50, 50)}
                material={new THREE.MeshStandardMaterial({ map: floorTexture })}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            />
            <SC.Primitive
                object={new THREE.GridHelper(50 * grandeur, 50 * grandeur, "saddlebrown", "sienna")}
                position={[0.5, 0.001, 0.5]}
            />
        </SC.Group>
        <PE.Body rotation={[-Math.PI / 2, 0, 0]} position={[0, -grandeur, 0]}>
            <PE.Plane />
        </PE.Body>

        <!-- Pion -->
        <SC.Group scale={[grandeur, grandeur, grandeur]}>
            <SC.Mesh
                geometry={model}
                material={new THREE.MeshStandardMaterial({ color: $color })}
                position={$position.toArray()}
                castShadow
                receiveShadow
            />
        </SC.Group>
        <PE.Body mass={10} bind:position={$position}>
            <PE.Box size={[grandeur, grandeur, grandeur]} />
        </PE.Body>
    </SC.Canvas>
</PE.World>
