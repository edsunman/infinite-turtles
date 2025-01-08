<script lang="ts">
	import { cardState, gameState } from '$lib/state.svelte';
	import { data } from '$lib/data';
	import { endTurn } from '$lib/gameplay';
	import type { Card } from '$lib/types';
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';

	let deck: Card[] = $state([]);
	let discard: Card[] = $state([]);
	let deckHover = $state(false);
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

	let sortedDiscard = $derived.by(() => {
		return discard
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
	class="ui cardButton"
	id="deckButton"
	role="tooltip"
	onmouseenter={() => (deckHover = true)}
	onmouseleave={() => (deckHover = false)}
	transition:fade={{ delay: 500 }}
>
	<p>{deck.length}</p>
</div>

{#if deckHover && gameState.state === 'playerTurn' && sortedDeck.length > 0}
	<div class="ui cardList" id="deck" transition:fade={{ duration: 100 }}>
		<p>Cards in deck:</p>
		{#each sortedDeck as group}
			<div style="background-image:url(/images/{group.card.typeId}.svg)">
				<p>
					{data.cardTypes[group.card.typeId.toString()].name}
					{#if group.count > 1}
						(x{group.count})
					{/if}
				</p>
			</div>
		{/each}
	</div>
{/if}

<div class="ui" id="actions" transition:fade={{ delay: 500 }}>
	<p>actions: {gameState.actionsRemaining}</p>
</div>

<div
	class="ui cardButton"
	id="discardButton"
	role="tooltip"
	onmouseenter={() => (discardHover = true)}
	onmouseleave={() => (discardHover = false)}
	transition:fade={{ delay: 500 }}
>
	<p>{discard.length}</p>
</div>

{#if discardHover && gameState.state === 'playerTurn'}
	<div class="ui cardList" id="discard">
		<p>Discard pile:</p>
		{#each sortedDiscard as group}
			<div style="background-image:url(/images/{group.card.typeId}.svg)">
				<p>
					{data.cardTypes[group.card.typeId.toString()].name}
					{#if group.count > 1}
						(x{group.count})
					{/if}
				</p>
			</div>
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

	.cardList {
		background-color: #997f64;
		color: white;
		padding: 15px 20px;
		border-radius: 10px;
		font-size: 18px;
	}

	.cardList div {
		background-repeat: no-repeat;
		padding: 15px 0px 15px 50px;
		margin: 10px 0;
	}

	.cardButton {
		background-repeat: no-repeat;
		height: 84px;
		width: 90px;
		color: white;
		font-size: 25px;
	}

	#deckButton {
		bottom: 20px;
		left: 20px;
		background-image: url(/images/deck.svg);
	}

	#deckButton p {
		margin-top: 45px;
		margin-left: 67px;
	}

	#deck {
		bottom: 120px;
		left: 20px;
	}

	#actions {
		bottom: 20px;
		left: 140px;
		color: white;
		font-size: 25px;
	}

	#discardButton {
		bottom: 20px;
		right: 20px;
		background-image: url(/images/discard.svg);
	}

	#discardButton p {
		margin-top: 45px;
		margin-left: 9px;
	}

	#discard {
		bottom: 120px;
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
