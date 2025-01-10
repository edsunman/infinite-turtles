<script lang="ts">
	import { T, useTask, useThrelte, useStage } from '@threlte/core';
	import { useGltf, useDraco, useProgress } from '@threlte/extras';
	import { gameState, timeline } from '$lib/state.svelte';

	import Peformance from './misc/Peformance.svelte';
	import Cards from './cards/Cards.svelte';
	import Hitboxes from './cards/Hitboxes.svelte';
	import Camera from './Camera.svelte';

	const dracoLoader = useDraco();
	const gltf = useGltf('/models/cards-transformed.glb', { dracoLoader });

	const { progress } = useProgress();
	$effect(() => {
		if ($progress === 1) {
			gameState.loaded = true;
		} else {
			gameState.loaded = false;
		}
	});

	const { mainStage, renderStage } = useThrelte();
	let speed = 1;

	useStage('gameplay-stage', {
		after: mainStage,
		before: renderStage,
		callback: (delta, runTasks) => {
			if (!gameState.paused) runTasks(delta * speed);
		}
	});

	useTask(
		'timeline-task',
		(delta) => {
			timeline.update(delta);
		},
		{ stage: 'gameplay-stage' }
	);
</script>

<Peformance />

{#await gltf then gltf}
	<Cards {gltf} />
	<Hitboxes {gltf} />
{/await}

<T.AmbientLight intensity={10} />

<Camera />

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'p') {
			gameState.paused = !gameState.paused;
		}
		if (e.key === 'ArrowRight') {
			if (speed === 1) {
				speed = 0.5;
			} else if (speed === 0.5) {
				speed = 0.25;
			} else if (speed === 0.25) {
				speed = 1;
			}
		}
	}}
/>
