<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid, OrbitControls, useGltf, useDraco } from '@threlte/extras';
	import { gameState, cardState } from '$lib/state.svelte';
	import { setupCards } from './cards/cardActions';

	import Peformance from './misc/Peformance.svelte';
	import Cards from './cards/Cards.svelte';
	import Hitboxes from './cards/Hitboxes.svelte';
	import { onDestroy } from 'svelte';

	const dracoLoader = useDraco();
	const gltf = useGltf('/models/cards-transformed.glb', { dracoLoader });

	setupCards();

	onDestroy(() => {
		cardState.cards = [];
	});
</script>

<!-- <T.Mesh rotation.x={rotate}>
	<T.PlaneGeometry />
	<ParallaxMaterial />
</T.Mesh> -->

<Grid
	name="debug"
	gridSize={[50, 50]}
	cellColor={'#46536b'}
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={50}
	position.y={-0.01}
/>

<Peformance />

{#await gltf then gltf}
	<Cards {gltf} />
{/await}
<Hitboxes />

<T.PerspectiveCamera
	name="main camera"
	position={[0, 22, 9.3]}
	rotation={[-1.15, 0, 0]}
	fov={15}
	makeDefault={!gameState.dev}
/>

<T.PerspectiveCamera name="dev camera" position={[0, 10, 10]} fov={15} makeDefault={gameState.dev}>
	<OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={1.5} position={[5, 5, 5]} />
<T.AmbientLight intensity={1.2} />
