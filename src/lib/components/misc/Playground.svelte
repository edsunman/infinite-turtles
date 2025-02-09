<script lang="ts">
	import { T, useStage, useThrelte } from '@threlte/core';
	import { OrbitControls, Grid, useDraco, useGltf, useTexture } from '@threlte/extras';
	import Cards from '$lib/components/cards/Cards.svelte';
	import { addCard } from '../cards/cardActions';
	import { onDestroy } from 'svelte';
	import { cardState } from '$lib/state.svelte';

	const dracoLoader = useDraco();
	const gltf = useGltf('/models/cards-transformed.glb', { dracoLoader });
	const textures = useTexture({
		atlas: '/images/map.png',
		numbers: '/images/numbers.png',
		backgrounds: '/images/card-backgrounds.png',
		circle: '/images/circle.png',
		mainBackground: '/images/background-main.png'
	});

	const { mainStage, renderStage } = useThrelte();
	useStage('gameplay-stage', {
		after: mainStage,
		before: renderStage
	});

	addCard({ typeId: 1 });
	addCard({ typeId: 2, position: { x: 2, y: 0, z: 0 } });
	addCard({ typeId: 3, position: { x: 4, y: 0, z: 0 } });
	addCard({ typeId: 4, position: { x: 6, y: 0, z: 0 } });
	addCard({ typeId: 5, position: { x: 8, y: 0, z: 0 } });
	addCard({ typeId: 10, position: { x: 0, y: 0, z: 2 } });
	addCard({ typeId: 11, position: { x: 2, y: 0, z: 2 } });
	addCard({ typeId: 12, position: { x: 0, y: 0, z: 4 } });
	addCard({ typeId: 13, position: { x: 2, y: 0, z: 4 } });
	addCard({ typeId: 14, position: { x: 4, y: 0, z: 4 } });
	addCard({ typeId: 15, position: { x: 6, y: 0, z: 4 } });

	onDestroy(() => {
		cardState.cards = [];
	});
</script>

<T.PerspectiveCamera name="dev camera" position={[0, 10, 10]} fov={15} makeDefault>
	<OrbitControls />
</T.PerspectiveCamera>
<Grid
	position.y={-0.1}
	fadeStrength={1}
	fadeDistance={100}
	cellColor={'#222'}
	sectionColor={'#333'}
	sectionThickness={1}
/>
{#await gltf then gltf}
	{#await textures then textures}
		<Cards {gltf} {textures} />
	{/await}
{/await}
