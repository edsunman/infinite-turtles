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
		font-family: 'Share Tech', sans-serif;
		font-weight: 400;
		font-style: normal;
	}
	:global {
		p,
		h3 {
			font-family: 'Delicious Handrawn', serif;
			font-weight: 400;
			font-style: normal;
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
