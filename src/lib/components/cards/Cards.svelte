<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { cardState } from '$lib/state.svelte';
	import { interval } from '$lib/helpers/animation';
	import { movingBehaviour } from './cardBehaviour';
	import { dealCard } from './cardActions';
	import type { Card, XYZ } from '$lib/types';

	import ParallaxMaterial from '../materials/paralax/ParallaxMaterial.svelte';
	import RoundedPlane from '../geometries/RoundedPlane.svelte';

	dealCard(1);
	dealCard(2);
	dealCard(3);

	let temp: Card[] = [];
	const every5 = interval(2);
	useTask((delta) => {
		//temp = cardState.cards.concat();
		/* every5(delta, () => {
			cardState.cards.forEach((card, index, array) => {
				card.moveTo.z = Math.random() * 10;
				card.moveTo.x = Math.random() * 10;
				card.moveTo.y = Math.random() * 10;
				card.rotateTo.z = Math.random() * 10;
				card.rotateTo.x = Math.random() * 10;
				card.rotateTo.y = Math.random() * 10;
				card.settled = false;
			});
		}); */
		temp = cardState.cards.concat();
		temp.forEach((card, index, array) => {
			card = movingBehaviour(card, delta);
		});
		cardState.cards = temp;
	});
</script>

{#each cardState.cards as card, i}
	<T.Mesh
		position.x={card.position.x}
		position.y={card.position.y}
		position.z={card.position.z}
		rotation.x={card.rotation.x}
		rotation.y={card.rotation.y}
		rotation.z={card.rotation.z}
	>
		<RoundedPlane />
		<ParallaxMaterial />
	</T.Mesh>
{/each}
