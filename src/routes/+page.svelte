<script lang="ts">
	import App from '../lib/components/App.svelte';
	//import '../app.css';
</script>

<div>
	<App />
</div>

<style>
	:global(body) {
		margin: 0;
	}
	:global {
		p,
		h1,
		h3,
		button {
			font-family: 'Gamja Flower', serif;
			font-weight: 400;
			font-style: normal;
		}

		button {
			background: none;
			color: inherit;
			border: none;
			padding: 0;
			cursor: pointer;
			outline: inherit;
		}
	}
	:global(:root) {
		--green: #4eff98;
		--purple: #a56eff;
	}

	div {
		width: 100vw;
		height: 100vh;
		background: rgb(0, 0, 0);
	}
</style>
