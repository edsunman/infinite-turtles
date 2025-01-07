<script lang="ts">
	import { cardState, gameState } from '$lib/state.svelte';
	import { data } from '$lib/data';
	import { endTurn } from '$lib/gameplay';
	import type { Card } from '$lib/types';
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';

	let deck: Card[] = $state([]);
	let discard: Card[] = $state([]);
	let deckHover = $state(true);
	let discardHover = $state(false);

	let sortedDeck = $derived.by(() => {
		return deck
			.reduce<{ card: Card; count: number }[]>((acc, card) => {
				acc[card.typeId] ??= { card, count: 0 };
				acc[card.typeId]['count'] += 1;
				return acc;
			}, [])
			.filter((n) => n);
	});

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
	onmouseleave={() => (deckHover = true)}
	transition:fade={{ delay: 500 }}
>
	Deck: {deck.length}
</div>

{#if deckHover && gameState.state === 'playerTurn'}
	<div class="ui" id="deck">
		<p>Cards in deck:</p>
		{#each sortedDeck as group}
			<div style="background-image:url(/images/state-rune.svg)">
				<p>
					{data.cardTypes[group.card.typeId.toString()].name}
					{group.count > 1 ? `(x${group.count})` : ''}
				</p>
			</div>
		{/each}
	</div>
{/if}

<div class="ui" id="actions" transition:fade={{ delay: 500 }}>
	<p>actions: {gameState.actionsRemaining}</p>
</div>

<div
	class="ui"
	id="discardButton"
	role="tooltip"
	onmouseenter={() => (discardHover = true)}
	onmouseleave={() => (discardHover = false)}
	transition:fade={{ delay: 500 }}
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

<button class="ui" id="endTurn" onclick={endTurn} transition:fade={{ delay: 500 }}>end turn</button>

<style>
	p {
		margin: 0;
	}

	.ui {
		position: absolute;
	}

	#deckButton {
		bottom: 20px;
		left: 20px;
	}

	#deck {
		bottom: 100px;
		left: 20px;
		background-color: white;
		padding: 15px 20px;
		border-radius: 10px;
	}

	#deck div {
		background-repeat: no-repeat;
		padding: 15px 0px 15px 65px;
		margin: 10px 0;
	}

	#actions {
		bottom: 20px;
		left: 100px;
		color: white;
		font-size: 25px;
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
		color: white;
		font-size: 25px;
		background-color: #c1a68a;
		padding: 6px 15px;
		border-radius: 10px;
		margin-top: 25px;
		bottom: 20px;
		right: 150px;
	}

	#endTurn:hover {
		background-color: #cbae92;
	}

	#endTurn:active {
		background-color: #d6bba1;
	}
</style>
