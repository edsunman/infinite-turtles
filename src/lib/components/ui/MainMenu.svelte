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
		font-size: 35px;
		background-color: #c1a68a;
		padding: 6px 15px;
		border-radius: 10px;
		margin-top: 25px;
	}

	button:hover {
		background-color: #cbae92;
	}

	button:active {
		background-color: #d6bba1;
	}
</style>
