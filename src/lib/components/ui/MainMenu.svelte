<script lang="ts">
	import { startGame } from '$lib/gameplay';
	import { fade } from 'svelte/transition';
</script>

<div id="mainMenu" transition:fade={{ duration: 300 }}>
	<h1>infinite turtles</h1>
	<div><button onclick={() => startGame()}>start game</button></div>
	<div><button>rules</button></div>
	<div><button>settings</button></div>
</div>

<style>
	#mainMenu {
		top: 150px;
		position: absolute;
		margin: 0 auto;
		left: 0;
		right: 0;
		text-align: center;
	}

	h1 {
		color: white;
		font-size: 100px;
		margin-bottom: 120px;
	}

	button {
		color: white;
		font-size: 40px;
		margin-top: 20px;
		opacity: 0.8;
		transition: all 150ms;
	}

	button:hover {
		opacity: 1;
	}
</style>
