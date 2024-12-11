<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { cardState, gameState, mainTimeline } from '$lib/state.svelte';

	import Scene from './Scene.svelte';
	import { dealCard, dealHand, discardHand } from './cards/cardActions';
</script>

<Canvas>
	<Scene />
</Canvas>

<div style="background-color:white;position:absolute;bottom:0px;margin:20px">
	Deck: {cardState.count.deck}
	<button onclick={dealCard}>deal one</button>
	<button onclick={dealHand}>deal three</button>
	<!-- {runie} -->
</div>

<div style="background-color:white;position:absolute;bottom:0px;right:0;margin:20px">
	Discard: {cardState.count.discard}
	<button onclick={discardHand}>discard hand</button>
</div>

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'd') {
			gameState.dev = !gameState.dev;
		}
	}}
/>
