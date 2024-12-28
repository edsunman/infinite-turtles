<script lang="ts">
	import { Canvas } from '@threlte/core';

	import Scene from './Scene.svelte';
	import InfoBox from './ui/InfoBox.svelte';
	import Deck from './ui/Deck.svelte';
	import DamageNumbers from './ui/DamageNumbers.svelte';
</script>

<Canvas>
	<Scene />
</Canvas>

<InfoBox />
<Deck />
<DamageNumbers />
