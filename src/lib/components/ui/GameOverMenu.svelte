<script lang="ts">
	import { gameState } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let show = $state(false);
	let showButton = $state(false);
	let hide = $state(false);

	const quitToMainMenu = () => {
		hide = true;
		setTimeout(() => {
			gameState.menuState = 'mainMenu';
		}, 1000);
	};

	onMount(() => {
		setTimeout(() => {
			show = true;
		}, 100);
		setTimeout(() => {
			showButton = true;
		}, 2000);
	});
</script>

<div id="gameOverMenu" class="{show ? 'show' : ''} {hide ? 'hide' : ''}">
	<h1>defeat!</h1>
	{#if showButton}
		<button in:fade onclick={quitToMainMenu}>back to main menu</button>
	{/if}
</div>

<style>
	h1 {
		color: white;
		font-size: 150px;
		font-weight: 500;
	}

	button {
		color: white;
		font-size: 35px;
		background-color: #6b44be;
		padding: 6px 15px;
		border-radius: 10px;
	}

	button:hover {
		background-color: #7650c6;
	}

	button:active {
		background-color: #835dd1;
	}

	#gameOverMenu {
		position: absolute;
		top: 0;
		margin: 0 auto;
		left: 0;
		right: 0;
		text-align: center;
		background-color: #5c38ab;
		width: 100%;
		height: 100%;
		z-index: 101;
		transition: 1s cubic-bezier(0.84, 0.005, 0.125, 1);
		clip-path: rect(0% 100% 0% 0%);
	}

	#gameOverMenu.show {
		clip-path: rect(0% 100% 100% 0%);
	}

	#gameOverMenu.hide {
		clip-path: rect(100% 100% 100% 0%);
	}
</style>
