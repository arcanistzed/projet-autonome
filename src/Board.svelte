<script lang="ts">
    import * as CANNON from "cannon-es";
    import * as PE from "svelte-cannon";
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import DirecionalPerspectiveCamera from "./lib/DirectionalPerspectiveCamera.svelte";

    let width = 1,
        height = 1,
        depth = 1,
        position = PE.writableVec3(0, 0, 0),
        direction: THREE.Vector3 & CANNON.Vec3;

    $: quadrant = Math.round(((Math.atan2(direction?.x, direction?.z) * 180) / Math.PI + 180 + 45) / 90);
    $: console.log(quadrant, direction, (direction?.angleTo(new THREE.Vector3(0, 0, 1)) * 180) / Math.PI);

    function keyDown(event: KeyboardEvent) {
        const { key } = event;

        const { x, y, z } = $position;
        if (["ArrowLeft", "a"].includes(key)) $position = $position.addScaledVector(1, new CANNON.Vec3(direction.z, 0, -direction.x));
        if (["ArrowRight", "d"].includes(key)) $position = $position.addScaledVector(-1, new CANNON.Vec3(direction.z, 0, -direction.x));
        if ([" "].includes(key)) $position.y = Math.min(y + 1, 1);
        if (["ArrowUp", "w"].includes(key)) $position = $position.addScaledVector(1, new CANNON.Vec3(direction.x, 0, direction.z));
        if (["ArrowDown", "s"].includes(key)) $position = $position.addScaledVector(-1, new CANNON.Vec3(direction.x, 0, direction.z));
    }

    const loader = new THREE.TextureLoader();
    const floorTexture = loader.load("assets/floor.jpg");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
</script>

<svelte:window on:keydown={keyDown} />

<PE.World gravity={[0, -9.81, 0]}>
    <SC.Canvas antialias background={new THREE.Color("skyblue")} fog={new THREE.FogExp2("skyblue", 0.1)} shadows>
        <DirecionalPerspectiveCamera bind:direction />
        <SC.OrbitControls maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
        <SC.AmbientLight intensity={0.6} />
        <SC.DirectionalLight intensity={0.6} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />

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
            material={new THREE.MeshStandardMaterial({ color: "red" })}
            scale={[width, height, depth]}
            position={$position.toArray()}
            castShadow
        />
        <PE.Body mass={1} bind:position={$position}>
            <PE.Box size={[width, height, depth]} />
        </PE.Body>
    </SC.Canvas>
</PE.World>
