<script lang="ts">
	import { T, useTask, useThrelte, useStage } from '@threlte/core';
	import { Grid, OrbitControls, useGltf, useDraco } from '@threlte/extras';
	import { gameState, cardState, mainTimeline } from '$lib/state.svelte';
	import { setupInitialCards } from '$lib/gameplay';

	import Peformance from './misc/Peformance.svelte';
	import Cards from './cards/Cards.svelte';
	import Hitboxes from './cards/Hitboxes.svelte';
	import { onDestroy } from 'svelte';
	import { Vector3 } from 'three';

	const dracoLoader = useDraco();
	const gltf = useGltf('/models/cards-transformed.glb', { dracoLoader });

	setupInitialCards();

	let devCamera = $state(false);

	onDestroy(() => {
		cardState.cards = [];
		cardState.slots = ['', '', '', '', '', ''];
	});

	const { camera, size, scheduler, mainStage, renderStage } = useThrelte();
	const vect = new Vector3();

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

	$effect(() => {
		const p = cardState.hoverCard?.position;
		if (!p) return;
		const offset = cardState.hoverCard?.group === 'hand' ? 1 : 0.5;
		vect.set(p.x + 0.6, p.y, p.z - offset);
		vect.project(camera.current);
		const widthHalf = size.current.width / 2;
		const heightHalf = size.current.height / 2;
		gameState.hoverPosition = {
			x: vect.x * widthHalf + widthHalf,
			y: -(vect.y * heightHalf) + heightHalf
		};
	});
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

<T.PerspectiveCamera
	name="main camera"
	position={[0, 22, 9.3]}
	rotation={[-1.15, 0, 0]}
	fov={15}
	makeDefault={!devCamera}
/>

<T.PerspectiveCamera name="dev camera" position={[0, 10, 10]} fov={15} makeDefault={devCamera}>
	<OrbitControls />
</T.PerspectiveCamera>

<T.AmbientLight intensity={3.5} />

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
		if (e.key === 'd') {
			devCamera = !devCamera;
		}
	}}
/>
