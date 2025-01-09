<script lang="ts">
	import { gameState } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';

	let page = $state(1);
</script>

<div id="container">
	<div id="rulesMenu" in:fade={{ duration: 300, delay: 300 }} out:fade={{ duration: 300 }}>
		{#if page === 1}
			<div class="image" style="background-image:url(/images/12.svg)"></div>
			<div class="text">
				<p>
					A portal to another dimention has opened and all sorts of terryfting creatures are pouring
					out.
				</p>
				<p>
					All you have to fight them are an infinate bag of turtles and a mysterious bag of runes.
				</p>
				<p>Equip your turtles with runes to defeat the monsters and close the portal!</p>
			</div>
			<button onclick={() => (page = 2)}>next</button>
		{:else if page === 2}
			<div class="image" style="background-image:url(/images/deck.svg)"></div>
			<div class="text">
				<h4>Your deck</h4>
				<p>You start the game with a deck of cards, 3 potion cards and 3 state rune cards.</p>
				<p>Every turn you get 2 actions. This means you can play two cards from your hand.</p>
				<p>
					When a card is used it goes in your discard pile. When your deck is empty the discard pile
					is shuffled and becomes your new deck.
				</p>
			</div>
			<button onclick={() => (page = 3)}>next</button>
		{:else if page === 3}
			<div class="image" style="background-image:url(/images/12.svg)"></div>
			<div class="text">
				<h4>Turtles</h4>
				<p>Begin by placing turtles. You can place a maximum of two turtles at once.</p>
				<p>Whenever you draw a card from your deck there is a 1 in 3 chance it will be a turtle.</p>
				<p>
					Enemies will attack twice and will attack turtles before attacking you. Then any surviving
					turtles will attack the nearest enemy.
				</p>
				<p>You can throw a turtle card in your deck at an enemy to try to deal -1 damage.</p>
			</div>
			<button onclick={() => (page = 4)}>next</button>
		{:else if page === 4}
			<div class="image" style="background-image:url(/images/12.svg)"></div>
			<div class="text">
				<h4>Runes</h4>
				<p>
					Turtles are defenceless on their own. Add rune cards to a turtle card to help them out.
					Each turtle can have a maximum of two rune cards.
				</p>
				<p>When a turtle dies the rune cards are placed in your discard pile.</p>
				<p>During the game you will be with new rune cards added to your deck.</p>
			</div>

			<button onclick={() => (page = 5)}>next</button>
		{:else if page === 5}
			<div class="image" style="background-image:url(/images/12.svg)"></div>
			<div class="text">
				<h4>Winning the game</h4>
				<p>
					When you have defeated an enemy or pair of enemies all teh cards are returned to your deck
					and you will gain +2 health.
				</p>
				<p>
					You will receive a new rune card as a reward and the game begins again with a new enemy.
				</p>
				<p>Defeat enough enemies and you will win the game. Good luck!</p>
			</div>
			<button onclick={() => (gameState.menuState = 'mainMenu')}>back to main menu</button>
		{/if}
	</div>
</div>

<style>
	/* 	h3 {
		color: #6d5c53;
		font-size: 50px;
		font-weight: 500;
		margin: 0;
		justify-self: center;
		align-self: center;
		grid-column: 2;
	}
 */
	h4 {
		font-size: 30px;
		margin: 25px 0;
	}

	button {
		color: #6d5c53;
		font-size: 25px;
		background-color: #c3ad95;
		padding: 6px 15px;
		border-radius: 10px;
		grid-column: 2;
		grid-row: 2;
		justify-self: end;
		align-self: center;
	}

	button:hover {
		background-color: #bfa78e;
	}

	button:active {
		background-color: #bba084;
	}

	.text {
		color: white;
		grid-column: 2;
		grid-row: 1;
		text-align: left;
		width: 55%;
		justify-self: end;
		align-content: center;
		font-size: 20px;
	}

	.image {
		grid-column: 2;
		grid-row: 1;
		width: 45%;
		justify-self: start;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 150px;
	}

	#container {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	#rulesMenu {
		grid-template-columns: auto 800px auto;
		grid-template-rows: 400px 100px;
		display: grid;
		margin: 0 auto;
		text-align: center;
		width: 100%;
	}
</style>
