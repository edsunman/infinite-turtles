<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid, OrbitControls } from '@threlte/extras';
	import { gameState } from '$lib/state.svelte';

	import Peformance from './misc/Peformance.svelte';
	import Cards from './cards/Cards.svelte';
	import Hitboxes from './cards/Hitboxes.svelte';
</script>

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

<Cards />
<Hitboxes />

<T.Mesh>
	<T.MeshStandardMaterial />
	<T.BoxGeometry />
</T.Mesh>

<T.PerspectiveCamera
	name="main camera"
	position={[0, 20, 20]}
	rotation={[-0.75, 0, 0]}
	fov={15}
	makeDefault={!gameState.dev}
/>

<T.PerspectiveCamera name="dev camera" position={[0, 10, 10]} fov={15} makeDefault={gameState.dev}>
	<OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={1.5} position={[5, 5, 5]} />
<T.AmbientLight intensity={1.2} />
