<script lang="ts">
	import { sfxPlayer } from '$lib/state.svelte';
	import { Audio, AudioListener } from '@threlte/extras';
	import type { Audio as ThreeAudio } from 'three';

	let sfx: ThreeAudio | undefined = $state();

	sfxPlayer.sounds = [
		{ name: 'potion', duration: 2 },
		{ name: 'deal', duration: 1 },
		{ name: 'discard', duration: 1 }
	];

	$effect(() => {
		sfxPlayer.threeAudio = sfx;
	});
</script>

<AudioListener position={[0, 0, 0]} />
<Audio src={'/audio/sfx.mp3'} bind:ref={sfx} autoplay={false} loop={false} volume={1} />
