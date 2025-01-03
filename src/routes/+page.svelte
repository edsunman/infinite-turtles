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
		cursor: image-set('/cursor/cursor.png' 1x, '/cursor/cursor-x2.png' 2x), default;
	}
	:global(body.hovering, button) {
		cursor: image-set('/cursor/cursorHover.png' 1x, '/cursor/cursorHover-x2.png' 2x), pointer;
	}
	:global {
		p,
		h1,
		h3,
		button {
			font-family: 'Gamja Flower', serif;
			font-weight: 400;
			font-style: normal;
			user-select: none;
		}

		button {
			background: none;
			color: inherit;
			border: none;
			padding: 0;
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
