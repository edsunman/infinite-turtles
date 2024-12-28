<script lang="ts">
	import { T, useTask, useThrelte, useStage } from '@threlte/core';
	import { Grid, useGltf, useDraco } from '@threlte/extras';
	import { cardState, mainTimeline } from '$lib/state.svelte';
	import { setupInitialCards } from '$lib/gameplay';
	import { onDestroy } from 'svelte';

	import Peformance from './misc/Peformance.svelte';
	import Cards from './cards/Cards.svelte';
	import Hitboxes from './cards/Hitboxes.svelte';
	import Camera from './Camera.svelte';

	const dracoLoader = useDraco();
	const gltf = useGltf('/models/cards-transformed.glb', { dracoLoader });

	setupInitialCards();

	onDestroy(() => {
		cardState.cards = [];
		cardState.slots = ['', '', '', '', '', ''];
	});

	const { mainStage, renderStage } = useThrelte();
	let paused = false;
	let speed = 1;

	useStage('gameplay-stage', {
		after: mainStage,
		before: renderStage,
		callback: (delta, runTasks) => {
			if (!paused) runTasks(delta * speed);
		}
	});

	useTask(
		'timeline-task',
		(delta) => {
			mainTimeline.update(delta);
		},
		{ stage: 'gameplay-stage' }
	);
</script>

<!-- <T.Mesh rotation.x={rotate}>
	<T.PlaneGeometry />
	<ParallaxMaterial />
</T.Mesh> -->

<!-- <Grid
	name="debug"
	gridSize={[50, 50]}
	cellColor={'#46536b'}
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={50}
	position.y={-0.01}
/> -->

<Peformance />

{#await gltf then gltf}
	<Cards {gltf} />
{/await}
<Hitboxes />

<T.AmbientLight intensity={3.5} />

<Camera />

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'p') {
			paused = !paused;
		}
		if (e.key === 'ArrowRight') {
			if (speed === 1) {
				speed = 0.5;
				console.log('0.5x');
			} else if (speed === 0.5) {
				speed = 0.25;
				console.log('0.25x');
			} else if (speed === 0.25) {
				speed = 1;
				console.log('1x');
			}
		}
	}}
/>
