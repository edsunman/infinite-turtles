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
