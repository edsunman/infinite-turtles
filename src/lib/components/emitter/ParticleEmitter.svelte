<script lang="ts">
	import { useTexture } from '@threlte/extras';
	import Particles from './Particles.svelte';
	import { T } from '@threlte/core';
	import { cardState } from '$lib/state.svelte';

	let start: any = $state();
	const texture = useTexture('/images/circleParticle.png');

	$effect(() => {
		if (cardState.damage.text === '+1' && cardState.damagedCard?.typeId === 1) {
			start();
		}
	});
</script>

{#snippet ringGeometry()}
	<T.RingGeometry args={[1.9, 2]} />
{/snippet}

{#await texture then alphaMap}
	<Particles
		bind:start
		emitterPosition={[0, 0, -0.5]}
		emitterScale={[0.25, 0.4, 1]}
		emitterRotation={[1.57, 0, 0]}
		count={100}
		life={2}
		explosiveness={0.7}
		spread={35}
		gravity={{ x: 0, y: 0, z: 0 }}
		direction={{ x: 0, y: 1, z: 0 }}
		wind={{ x: 0, y: 0, z: 0 }}
		driftAmount={0.4}
		driftSpeed={1}
		velocity={2}
		velocityRandom={0}
		size={'size(3) 0%, size(1) 100%'}
		sizeRandom={10}
		color={'rgba(100,255,248,0) 0%, rgba(100,255,248,1) 8%, rgba(0,185,255,1) 90%, rgba(115,0,255,0) 100%'}
		colorRandom={0}
		lightnessRandom={0.5}
		textureRotation={0}
		rotationRandom={5}
		dampen={true}
		oneShot={true}
		clampAlpha={true}
		additiveBlend={false}
		customGeometry={ringGeometry}
		{alphaMap}
	/>
{/await}
