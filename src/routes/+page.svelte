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
			font-family: 'Sour Gummy', serif;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
			font-variation-settings: 'wdth' 100;
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
		--purple: #ff4592;
		--blue: #4dddff;
		--red: #ff4545;
	}

	div {
		width: 100vw;
		height: 100vh;
		background: rgb(0, 0, 0);
	}
</style>
