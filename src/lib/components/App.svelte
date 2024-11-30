<svelte:options runes={true} />

<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { cardState, gameState } from '$lib/state.svelte';
	import type { Card } from '$lib/types';

	import Scene from './Scene.svelte';
	import { dealCard } from './cards/cardActions';

	let runie = $derived(cardState.cards[0].position.x);

	const lotsOfCubes = () => {
		const newId = cardState.cards.length + 1;
		const newCard: Card = {
			id: newId,
			moveTo: { x: 2, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
			moveVelocity: { x: 0, y: 0, z: 0 },
			rotateTo: { x: -2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			rotateVelocity: { x: 0, y: 0, z: 0 },
			settled: true,
			inHand: false
		};
		cardState.cards = [...cardState.cards, newCard];
		dealCard(newId);
	};
</script>

<Canvas>
	<Scene />
</Canvas>

<div style="background-color:white;position:absolute;bottom:0px;margin:20px">
	<button onclick={lotsOfCubes}>hello</button>
	{runie}
</div>

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'd') {
			gameState.dev = !gameState.dev;
		}
	}}
/>
