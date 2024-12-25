<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { cardState, gameState } from '$lib/state.svelte';

	import Scene from './Scene.svelte';

	import InfoBox from './ui/InfoBox.svelte';
	import Deck from './ui/Deck.svelte';
</script>

<Canvas>
	<Scene />
</Canvas>

<InfoBox />
<Deck />

<style>
	:global {
		p,
		h3 {
			font-family: 'Delicious Handrawn', serif;
			font-weight: 400;
			font-style: normal;
		}
	}
	:root {
		--green: #4eff98;
		--purple: #a56eff;
	}
</style>
