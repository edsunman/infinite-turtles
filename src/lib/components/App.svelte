<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { cardState, gameState } from '$lib/state.svelte';

	import Scene from './Scene.svelte';
	import { dealHand } from './cards/cardActions';
	import { endTurn } from '$lib/gameplay';

	import InfoBox from './ui/InfoBox.svelte';

	let deckCount = $derived(cardState.cards.filter((c) => c.group === 'deck').length);
	let discardCount = $derived(cardState.cards.filter((c) => c.group === 'discard').length);
</script>

<Canvas>
	<Scene />
</Canvas>

<InfoBox />

<div style="background-color:white;position:absolute;bottom:0px;margin:20px">
	Deck: {deckCount}
	<button onclick={dealHand}>deal three</button>
</div>

<div style="background-color:white;position:absolute;bottom:0px;right:0;margin:20px">
	Discard: {discardCount}
	Actions: {gameState.actionsRemaining}
	<button onclick={endTurn}>end turn</button>
</div>

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'd') {
			gameState.dev = !gameState.dev;
		}
	}}
/>
