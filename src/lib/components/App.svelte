<svelte:options runes={true} />

<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { cardState, gameState, mainTimeline } from '$lib/state.svelte';
	import type { Card } from '$lib/types';

	import Scene from './Scene.svelte';
	import { dealCard } from './cards/cardActions';

	//let runie = $derived(cardState.cards[0].position.x);

	const lotsOfCubes = () => {
		const newId = cardState.addCard({ health: Math.random() * 15 });
		dealCard(newId);
	};
</script>

<Canvas>
	<Scene />
</Canvas>

<div style="background-color:white;position:absolute;bottom:0px;margin:20px">
	<button onclick={lotsOfCubes}>hello</button>
	<button
		onclick={() => {
			mainTimeline.addKeyframe(0, () => lotsOfCubes());
			mainTimeline.addKeyframe(0.3, () => lotsOfCubes());
		}}>t</button
	>
	<!-- {runie} -->
</div>

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'd') {
			gameState.dev = !gameState.dev;
		}
	}}
/>
