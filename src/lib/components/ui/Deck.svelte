<script lang="ts">
	import { cardState, gameState } from '$lib/state.svelte';
	import { data } from '$lib/data';
	import { endTurn } from '$lib/gameplay';
	import type { Card } from '$lib/types';
	import { untrack } from 'svelte';

	let deck: Card[] = $state([]);
	let discard: Card[] = $state([]);
	let deckHover = $state(false);
	let discardHover = $state(false);

	$effect(() => {
		gameState.state;
		untrack(() => {
			deck = cardState.cards.filter((c) => c.group === 'deck');
			discard = cardState.cards.filter((c) => c.group === 'discard');
		});
	});
</script>

<div
	class="ui"
	id="deckButton"
	role="tooltip"
	onmouseenter={() => (deckHover = true)}
	onmouseleave={() => (deckHover = false)}
>
	Deck: {deck.length}
</div>

{#if deckHover && gameState.state === 'playerTurn'}
	<div class="ui" id="deck">
		{#each deck as card}
			<p>{data.cardTypes[card.typeId.toString()].name}</p>
		{/each}
	</div>
{/if}

<div class="ui" id="actions">
	Actions: {gameState.actionsRemaining}
</div>

<div
	class="ui"
	id="discardButton"
	role="tooltip"
	onmouseenter={() => (discardHover = true)}
	onmouseleave={() => (discardHover = false)}
>
	Discard: {discard.length}
</div>

{#if discardHover && gameState.state === 'playerTurn'}
	<div class="ui" id="discard">
		{#each discard as card}
			<p>{data.cardTypes[card.typeId.toString()].name}</p>
		{/each}
	</div>
{/if}

<button class="ui" id="endTurn" onclick={endTurn}>end turn</button>

<style>
	.ui {
		position: absolute;
		background-color: white;
	}
	#deckButton {
		bottom: 20px;
		left: 20px;
	}
	#deck {
		bottom: 100px;
		left: 20px;
	}
	#actions {
		bottom: 20px;
		left: 100px;
	}
	#discardButton {
		bottom: 20px;
		right: 20px;
	}
	#discard {
		bottom: 100px;
		right: 20px;
	}
	#endTurn {
		background-color: white;
		position: absolute;
		bottom: 20px;
		right: 100px;
	}
</style>
