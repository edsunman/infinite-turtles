<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Playground from '$lib/components/misc/Playground.svelte';
</script>

<div>
	<Canvas>
		<Playground />
	</Canvas>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	div {
		width: 100vw;
		height: 100vh;
		background: #000;
	}
</style>
