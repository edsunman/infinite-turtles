<script lang="ts">
	import { dev } from '$app/environment';
	import { T, useTask, useThrelte, useStage } from '@threlte/core';
	import { useGltf, useDraco, useProgress, useTexture } from '@threlte/extras';
	import { gameState, timeline } from '$lib/state.svelte';
	import { startGame } from '$lib/game/gameActions';
	import { untrack } from 'svelte';

	import Peformance from './misc/Peformance.svelte';
	import Cards from './cards/Cards.svelte';
	import Hitboxes from './cards/Hitboxes.svelte';
	import Camera from './Camera.svelte';
	import ParticleEmitter from './emitter/ParticleEmitter.svelte';
	//import Audio from './Audio.svelte';
	import MenuPane from './meshes/MenuPane.svelte';
	import { innerWidth } from 'svelte/reactivity/window';

	const dracoLoader = useDraco();
	const gltf = useGltf('/models/cards-transformed.glb', { dracoLoader });
	const textures = useTexture({
		atlas: '/images/map.png',
		numbers: '/images/numbers.png',
		backgrounds: '/images/card-backgrounds.png',
		circle: '/images/circle.png',
		mainBackground: '/images/background-main.png'
	});

	const { progress } = useProgress();

	$effect(() => {
		if ($progress === 1) {
			gameState.loaded = true;
			untrack(() => startGame());
		} else {
			gameState.loaded = false;
		}
	});

	$effect(() => {
		if (innerWidth.current) gameState.mobile = innerWidth.current < 751;
	});

	let speed = 1;
	const { mainStage, renderStage } = useThrelte();

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

{#if dev}
	<Peformance />
{/if}

{#await gltf then gltf}
	{#await textures then textures}
		<Cards {gltf} {textures} />
		<Hitboxes {gltf} {textures} />
	{/await}
{/await}

<T.AmbientLight intensity={10} />

<Camera />

<!-- <Audio /> -->

<ParticleEmitter />

<MenuPane />

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
