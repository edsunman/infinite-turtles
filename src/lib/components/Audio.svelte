<script lang="ts">
	import { sfxPlayer } from '$lib/state.svelte';
	import { Audio, AudioListener } from '@threlte/extras';
	import type { Audio as ThreeAudio } from 'three';

	let sfx: ThreeAudio | undefined = $state();

	sfxPlayer.sounds = [
		{ name: 'deal', duration: 0.5 },
		{ name: 'select', duration: 0.5 },
		{ name: 'discard', duration: 0.5 },
		{ name: 'potion', duration: 1 },
		{ name: 'attack', duration: 0.5 },
		{ name: 'turtle-dead', duration: 0.5 },
		{ name: 'enemy-dead', duration: 1.5 }
	];

	$effect(() => {
		sfxPlayer.threeAudio = sfx;
	});
</script>

<AudioListener position={[0, 0, 0]} />
<Audio src={'/audio/sfx.mp3'} bind:ref={sfx} autoplay={false} loop={false} volume={1} />
