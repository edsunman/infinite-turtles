<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid, OrbitControls } from '@threlte/extras';

	import Peformance from './misc/Peformance.svelte';
	import Cards from './cards/Cards.svelte';
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

<T.PerspectiveCamera makeDefault name="dev camera" position={[0, 20, 20]} fov={15}>
	<OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={1.5} position={[5, 5, 5]} />
<T.AmbientLight intensity={1.2} />
