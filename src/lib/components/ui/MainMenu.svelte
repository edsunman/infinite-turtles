<script lang="ts">
	import { startGame } from '$lib/gameplay';
	import { gameState } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';
</script>

<div id="container">
	<div id="mainMenu" in:fade={{ duration: 300, delay: 300 }} out:fade={{ duration: 300 }}>
		<h1>infinite turtles</h1>
		<div id="buttons">
			<button onclick={() => startGame()}>start game</button>
			<button onclick={() => (gameState.menuState = 'rules')}>rules</button>
		</div>
	</div>
</div>

<style>
	h1 {
		color: white;
		font-size: 100px;
		grid-column: 2;
		grid-row: 1;
		margin: 0;
		align-items: center;
	}

	button {
		color: white;
		font-size: 35px;
		background-color: #c1a68a;
		padding: 6px 15px;
		border-radius: 10px;
		margin-top: 40px;
	}

	button:hover {
		background-color: #cbae92;
	}

	button:active {
		background-color: #d6bba1;
	}

	#buttons {
		grid-column: 2;
		grid-row: 2;
		display: flex;
		flex-direction: column;
		padding: 0px 250px;
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

	#mainMenu {
		grid-template-columns: auto 800px auto;
		grid-template-rows: 200px 300px;
		display: grid;
		margin: 0 auto;
		text-align: center;
		width: 100%;
	}
</style>
