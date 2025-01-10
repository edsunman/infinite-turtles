<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { gameState } from '$lib/state.svelte';

	import Scene from './Scene.svelte';
	import InfoBox from './ui/InfoBox.svelte';
	import Deck from './ui/Deck.svelte';
	import DamageNumbers from './ui/DamageNumbers.svelte';
	import MainMenu from './ui/MainMenu.svelte';
	/* 	import SettingsMenu from './ui/SettingsMenu.svelte'; */
	import NextPhaseMenu from './ui/NextPhaseMenu.svelte';
	import GameOverMenu from './ui/GameOverMenu.svelte';
	import Rules from './ui/Rules.svelte';
	import { fade } from 'svelte/transition';
</script>

<Canvas>
	<Scene />
</Canvas>

{#if gameState.menuState === 'mainMenu'}
	<MainMenu />
{/if}

<!-- {#if gameState.menuState === 'settingsMenu'}
	<SettingsMenu />
{/if} -->

{#if gameState.menuState === 'nextPhaseMenu'}
	<NextPhaseMenu />
{/if}

{#if gameState.menuState === 'gameOverMenu'}
	<GameOverMenu />
{/if}
{#if gameState.menuState === 'rules'}
	<Rules />
{/if}

{#if gameState.state !== 'menu'}
	<InfoBox />
	<Deck />
	<DamageNumbers />
{/if}

{#if !gameState.loaded}
	<div id="loadingScreen" out:fade={{ duration: 200, delay: 200 }}></div>
{/if}

<!-- <svelte:window
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
/> -->

<style>
	#loadingScreen {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #b59c82;
	}
</style>
