<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { gameState } from '$lib/state.svelte';

	import Scene from './Scene.svelte';
	import InfoBox from './ui/InfoBox.svelte';
	import Deck from './ui/Deck.svelte';
	import DamageNumbers from './ui/DamageNumbers.svelte';
	import MainMenu from './ui/MainMenu.svelte';
	import SettingsMenu from './ui/SettingsMenu.svelte';
</script>

<Canvas>
	<Scene />
</Canvas>

{#if gameState.menuState === 'mainMenu'}
	<MainMenu />
{/if}

{#if gameState.menuState === 'settingsMenu'}
	<SettingsMenu />
{/if}

{#if gameState.state !== 'menu'}
	<InfoBox />
	<Deck />
	<DamageNumbers />
{/if}

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if (gameState.menuState === 'settingsMenu') {
				gameState.menuState = 'none';
				gameState.locked = false;
				gameState.paused = false;
			} else if (gameState.menuState === 'none') {
				gameState.menuState = 'settingsMenu';
				gameState.locked = true;
				gameState.paused = true;
			}
		}
	}}
/>
