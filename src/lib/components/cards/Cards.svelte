<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { type ThrelteGltf } from '@threlte/extras';
	import { cardState } from '$lib/state.svelte';
	import { movingBehaviour } from './cardBehaviour';

	import ParallaxMaterial from '../materials/paralax/ParallaxMaterial.svelte';
	import NumbersMaterial from '../materials/numbers/NumbersMaterial.svelte';
	import CardMaterial from '../materials/card/CardMaterial.svelte';

	import {
		BatchedMesh,
		Color,
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

	let cardsCount = 0;
	const dummy = new Object3D();
	const dummyColor = new Color(0, 0, 0);

	const instancedBackgrounds = new InstancedMesh(gltf.nodes.Background.geometry, undefined, 100);
	instancedBackgrounds.instanceMatrix.setUsage(DynamicDrawUsage);
	const backgroundsFloat = new Float32Array(100);
	const backgroundsBufferAttribute = new InstancedBufferAttribute(backgroundsFloat, 1);
	instancedBackgrounds.geometry.setAttribute('custom', backgroundsBufferAttribute);

	const instancedNumbers = new InstancedMesh(new PlaneGeometry(0.16, 0.16), undefined, 100);
	instancedNumbers.instanceMatrix.setUsage(DynamicDrawUsage);
	const numbersFloat = new Float32Array(100);
	const numbersBufferAttribute = new InstancedBufferAttribute(numbersFloat, 1);
	instancedNumbers.geometry.setAttribute('custom', numbersBufferAttribute);

	const maxGeometryCount = 100;
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
	batched.addInstance(1);
	batched.addGeometry(gltf.nodes.Turtle.geometry);
	for (let i = 0; i < 7; i++) {
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
	batched.addGeometry(gltf.nodes.Border.geometry);
	for (let i = 0; i < 50; i++) {
		batched.addInstance(6);
	}
	for (let i = 0; i < 90; i++) {
		batched.setColorAt(i, dummyColor);
	}

	useTask(
		'cards-task',
		(delta) => {
			cardState.cards.forEach((card, index, array) => {
				card = movingBehaviour(card, delta);
				if (card.health < 0) {
					array.splice(index, 1);
				}
				if (card.redAmount > 0) {
					card.redAmount -= delta;
				}
			});
			cardsCount = cardState.cards.length;

			for (let i = 0; i < 90; i++) {
				batched.setVisibleAt(i, false);
			}

			let turtleCount = 3;
			let potionCount = 10;
			let stateCount = 20;
			let enemyCount = 1;
			let numbersCount = 0;
			let heartCount = 30;
			let bordersCount = 40;
			for (let i = 0; i < cardsCount; i++) {
				dummy.position.set(
					cardState.cards[i].position.x,
					cardState.cards[i].position.y,
					cardState.cards[i].position.z
				);
				dummy.rotation.set(
					cardState.cards[i].rotation.x,
					cardState.cards[i].rotation.y,
					cardState.cards[i].rotation.z
				);
				dummy.updateMatrix();
				dummyColor.setRGB(cardState.cards[i].redAmount, 0, 0);
				instancedBackgrounds.setMatrixAt(i, dummy.matrix);
				backgroundsFloat.set(
					[cardState.cards[i].typeId >= 2 && cardState.cards[i].typeId <= 9 ? 1 : 0],
					i
				);
				if (cardState.cards[i].typeId === 1) {
					batched.setMatrixAt(0, dummy.matrix);
					batched.setVisibleAt(0, true);
					batched.setColorAt(0, dummyColor);
				} else if (cardState.cards[i].typeId >= 2 && cardState.cards[i].typeId <= 9) {
					batched.setMatrixAt(enemyCount, dummy.matrix);
					batched.setVisibleAt(enemyCount, true);
					batched.setColorAt(enemyCount, dummyColor);
					enemyCount++;
				} else if (cardState.cards[i].typeId === 10) {
					batched.setMatrixAt(turtleCount, dummy.matrix);
					batched.setVisibleAt(turtleCount, true);
					batched.setColorAt(turtleCount, dummyColor);
					turtleCount++;
				} else if (cardState.cards[i].typeId === 11) {
					batched.setMatrixAt(potionCount, dummy.matrix);
					batched.setVisibleAt(potionCount, true);
					potionCount++;
				} else if (cardState.cards[i].typeId === 12) {
					batched.setMatrixAt(stateCount, dummy.matrix);
					batched.setVisibleAt(stateCount, true);
					stateCount++;
				}
				batched.setMatrixAt(bordersCount, dummy.matrix);
				batched.setVisibleAt(bordersCount, true);
				bordersCount++;
				if (cardState.cards[i].typeId > 10 && cardState.cards[i].typeId !== 12) continue;
				// no runes or potions
				batched.setMatrixAt(heartCount, dummy.matrix);
				batched.setVisibleAt(heartCount, true);
				heartCount++;
				dummy.translateX(0.32);
				dummy.translateY(0.585);
				dummy.translateZ(0.03);
				dummy.updateMatrix();
				instancedNumbers.setMatrixAt(numbersCount, dummy.matrix);
				numbersFloat.set([cardState.cards[i].health], numbersCount);
				numbersCount++;
			}

			instancedBackgrounds.count = cardsCount;
			instancedBackgrounds.instanceMatrix.needsUpdate = true;
			instancedBackgrounds.geometry.attributes.custom.needsUpdate = true;
			instancedNumbers.count = numbersCount;
			instancedNumbers.instanceMatrix.needsUpdate = true;
			instancedNumbers.geometry.attributes.custom.needsUpdate = true;
		},
		{ stage: 'gameplay-stage' }
	);
</script>

<T is={instancedBackgrounds} frustumCulled={false}>
	<ParallaxMaterial />
</T>

<T is={instancedNumbers} frustumCulled={false}>
	<NumbersMaterial />
</T>

<T is={batched} matrixAutoUpdate={false} frustumCulled={false}>
	<CardMaterial />
</T>
