<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { cardState, gameState, mainTimeline } from '$lib/state.svelte';

	import Scene from './Scene.svelte';
	import { dealHand } from './cards/cardActions';
	import { endTurn } from '$lib/gameplay';

	let deckCount = $derived(cardState.cards.filter((c) => c.group === 'deck').length);
	let discardCount = $derived(cardState.cards.filter((c) => c.group === 'discard').length);
</script>

<Canvas>
	<Scene />
</Canvas>

<div style="background-color:white;position:absolute;bottom:0px;margin:20px">
	Deck: {deckCount}
	<button onclick={dealHand}>deal three</button>
	<!-- {runie} -->
</div>

<div style="background-color:white;position:absolute;bottom:0px;right:0;margin:20px">
	Discard: {discardCount}
	Actions: {gameState.actionsRemaining}
	<!-- <button onclick={discardHand}>discard hand</button> -->
	<button onclick={endTurn}>end turn</button>
</div>

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'd') {
			gameState.dev = !gameState.dev;
		}
	}}
/>
