<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useTexture, type ThrelteGltf } from '@threlte/extras';
	import { cardState, gameState } from '$lib/state.svelte';
	import { movingBehaviour } from './cardBehaviour';
	import type { Card } from '$lib/types';

	import ParallaxMaterial from '../materials/paralax/ParallaxMaterial.svelte';
	import NumbersMaterial from '../materials/numbers/NumbersMaterial.svelte';
	import CardMaterial from '../materials/card/CardMaterial.svelte';

	import {
		BatchedMesh,
		DynamicDrawUsage,
		InstancedBufferAttribute,
		InstancedMesh,
		Object3D,
		PlaneGeometry
	} from 'three';

	let {
		gltf
	}: {
		gltf: ThrelteGltf<{
			nodes: Record<string, any>;
			materials: Record<string, any>;
		}>;
	} = $props();

	let temp: Card[] = [];
	let cardsCount = 0;
	const dummy = new Object3D();

	const instancedBorders = new InstancedMesh(gltf.nodes.Border.geometry, undefined, 100);
	instancedBorders.instanceMatrix.setUsage(DynamicDrawUsage);
	const instancedBackgrounds = new InstancedMesh(gltf.nodes.Background.geometry, undefined, 100);
	instancedBackgrounds.instanceMatrix.setUsage(DynamicDrawUsage);

	const instancedNumbers = new InstancedMesh(new PlaneGeometry(0.17, 0.17), undefined, 100);
	instancedNumbers.instanceMatrix.setUsage(DynamicDrawUsage);
	const numbersFloat = new Float32Array(100);
	const numbersBufferAttribute = new InstancedBufferAttribute(numbersFloat, 1);
	instancedNumbers.geometry.setAttribute('custom', numbersBufferAttribute);

	const maxGeometryCount = 50;
	const maxIndexCount = 100;
	const maxVertexCount = 100;
	const batched = new BatchedMesh(
		maxGeometryCount,
		maxVertexCount * maxGeometryCount,
		maxIndexCount * maxGeometryCount
	);
	batched.addGeometry(gltf.nodes.Player.geometry);
	batched.addInstance(0);
	batched.addGeometry(gltf.nodes.Enemy.geometry);
	batched.addInstance(1);
	batched.addGeometry(gltf.nodes.Turtle.geometry);
	for (let i = 0; i < 8; i++) {
		batched.addInstance(2);
	}
	batched.addGeometry(gltf.nodes.Potion.geometry);
	for (let i = 0; i < 10; i++) {
		batched.addInstance(3);
	}
	batched.addGeometry(gltf.nodes.Rune.geometry);
	for (let i = 0; i < 10; i++) {
		batched.addInstance(4);
	}

	batched.addGeometry(gltf.nodes.Heart.geometry);
	for (let i = 0; i < 10; i++) {
		batched.addInstance(5);
	}

	useTask(
		'cards-task',
		(delta) => {
			temp = cardState.cards.concat();
			cardState.cards.forEach((card, index, array) => {
				card = movingBehaviour(card, delta);
				if (card.health < 0) {
					array.splice(index, 1);
				}
			});

			//cardState.cards = temp;
			cardsCount = cardState.cards.length;

			for (let i = 0; i < 50; i++) {
				batched.setVisibleAt(i, false);
			}
			let turtleCount = 2;
			let potionCount = 10;
			let stateCount = 20;
			let numbersCount = 0;
			let deckCount = 0;
			let discardCount = 0;
			let heartCount = 30;
			for (let i = 0; i < cardsCount; i++) {
				if (temp[i].group === 'deck') deckCount++;
				if (temp[i].group === 'discard') discardCount++;
				dummy.position.set(temp[i].position.x, temp[i].position.y, temp[i].position.z);
				dummy.rotation.set(temp[i].rotation.x, temp[i].rotation.y, temp[i].rotation.z);
				dummy.updateMatrix();
				instancedBorders.setMatrixAt(i, dummy.matrix);
				instancedBackgrounds.setMatrixAt(i, dummy.matrix);
				if (temp[i].typeId === 1) {
					batched.setMatrixAt(0, dummy.matrix);
					batched.setVisibleAt(0, true);
				} else if (temp[i].typeId === 2) {
					batched.setMatrixAt(1, dummy.matrix);
					batched.setVisibleAt(1, true);
				} else if (temp[i].typeId === 10) {
					batched.setMatrixAt(turtleCount, dummy.matrix);
					batched.setVisibleAt(turtleCount, true);
					turtleCount++;
				} else if (temp[i].typeId === 11) {
					batched.setMatrixAt(potionCount, dummy.matrix);
					batched.setVisibleAt(potionCount, true);
					potionCount++;
				} else if (temp[i].typeId === 12) {
					batched.setMatrixAt(stateCount, dummy.matrix);
					batched.setVisibleAt(stateCount, true);
					stateCount++;
				}
				if (temp[i].typeId > 10 && temp[i].typeId !== 12) continue;
				// no runes or potions
				batched.setMatrixAt(heartCount, dummy.matrix);
				batched.setVisibleAt(heartCount, true);
				heartCount++;

				dummy.translateX(0.305);
				dummy.translateY(0.58);
				dummy.translateZ(0.03);
				dummy.updateMatrix();
				instancedNumbers.setMatrixAt(numbersCount, dummy.matrix);
				numbersFloat.set([temp[i].health], numbersCount);
				numbersCount++;
			}
			instancedBorders.count = cardsCount;
			instancedBorders.instanceMatrix.needsUpdate = true;
			instancedBackgrounds.count = cardsCount;
			instancedBackgrounds.instanceMatrix.needsUpdate = true;
			instancedNumbers.count = numbersCount;
			instancedNumbers.instanceMatrix.needsUpdate = true;
			instancedNumbers.geometry.attributes.custom.needsUpdate = true;
		},
		{ stage: 'gameplay-stage' }
	);
</script>

<T is={instancedBorders} frustumCulled={false}>
	<!-- {#await tex then tex}
		<T.MeshStandardMaterial map={tex}>
			<T is={tex} attach="map" flipY={false} />
		</T.MeshStandardMaterial>
	{/await} -->
	<CardMaterial />
</T>

<T is={instancedBackgrounds} frustumCulled={false}>
	<ParallaxMaterial />
</T>

<T is={instancedNumbers} frustumCulled={false}>
	<NumbersMaterial />
</T>

<T is={batched} matrixAutoUpdate={false} frustumCulled={false}>
	<CardMaterial />
</T>
