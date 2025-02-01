<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { gameState } from '$lib/state.svelte';
	import { Tween } from '$lib/helpers/animation';
	import { quartInOut } from 'svelte/easing';

	let startingHeight = 0;
	let height = $state(startingHeight);
	let tweenedHeight = new Tween(startingHeight, 1, quartInOut);

	$effect(() => {
		tweenedHeight.set(gameState.menuState === 'nextPhaseMenu' ? 11.2 : 0);
	});

	useTask((delta) => {
		height = tweenedHeight.update(delta);
	});
</script>

<T.Mesh position={[0, 2, 3.5]} scale={[20, height, 1]} rotation={[-1.1, 0, 0]}>
	<T.PlaneGeometry />
	<T.MeshBasicMaterial color={'#c9b8a6'} toneMapped={false} />
</T.Mesh>
