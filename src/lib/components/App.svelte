<script lang="ts">
	import { Canvas } from '@threlte/core';

	import Scene from './Scene.svelte';
	import InfoBox from './ui/InfoBox.svelte';
	import Deck from './ui/Deck.svelte';
	import DamageNumbers from './ui/DamageNumbers.svelte';
	import { gameState } from '$lib/state.svelte';
	import MainMenu from './ui/MainMenu.svelte';
</script>

<Canvas>
	<Scene />
</Canvas>

{#if gameState.menuState === 'mainMenu'}
	<MainMenu />
{/if}

{#if gameState.state !== 'menu'}
	<InfoBox />
	<Deck />
	<DamageNumbers />
{/if}
