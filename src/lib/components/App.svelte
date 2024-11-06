<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { cardState } from '$lib/state.svelte';
	import type { Card } from '$lib/types';

	import Scene from './Scene.svelte';

	const lotsOfCubes = () => {
		const newCard: Card = {
			id: 2,
			moveTo: { x: 2, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
			moveVelocity: { x: 0, y: 0, z: 0 },
			positionSettled: true,
			rotateTo: { x: -2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			rotateVelocity: { x: 0, y: 0, z: 0 },
			rotationSettled: true
		};
		cardState.cards = [...cardState.cards, newCard];
	};
</script>

<Canvas>
	<Scene />
</Canvas>

<div style="background-color:white;position:absolute;bottom:0px;margin:20px">
	<button onclick={lotsOfCubes}>hello</button>
</div>
