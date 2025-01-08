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
	batched.addGeometry(gltf.nodes.EnemyScorp.geometry);
	batched.addInstance(2);
	batched.addInstance(2);
	batched.addGeometry(gltf.nodes.Turtle.geometry);
	for (let i = 0; i < 10; i++) {
		batched.addInstance(3);
	}
	batched.addGeometry(gltf.nodes.Potion.geometry);
	for (let i = 0; i < 5; i++) {
		batched.addInstance(4);
	}

	batched.addGeometry(gltf.nodes.RuneState.geometry);
	for (let i = 0; i < 5; i++) {
		batched.addInstance(5);
	}
	batched.addGeometry(gltf.nodes.RuneInspect.geometry);
	for (let i = 0; i < 5; i++) {
		batched.addInstance(6);
	}
	batched.addGeometry(gltf.nodes.RuneEffect.geometry);
	for (let i = 0; i < 5; i++) {
		batched.addInstance(7);
	}
	batched.addGeometry(gltf.nodes.RuneHost.geometry);
	for (let i = 0; i < 5; i++) {
		batched.addInstance(8);
	}

	batched.addGeometry(gltf.nodes.Heart.geometry);
	for (let i = 0; i < 10; i++) {
		batched.addInstance(9);
	}
	batched.addGeometry(gltf.nodes.Border.geometry);
	for (let i = 0; i < 40; i++) {
		batched.addInstance(10);
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

			let enemyCount = 1;
			let enemyScorpCount = 3;
			let turtleCount = 5;
			let potionCount = 15;
			let stateCount = 20;
			let inspectCount = 25;
			let effectCount = 30;
			let hostCount = 35;
			let heartCount = 40;
			let bordersCount = 50;
			let numbersCount = 0;
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
					[cardState.cards[i].typeId >= 2 && cardState.cards[i].typeId <= 9 ? 1 : 2],
					i
				);
				if (cardState.cards[i].typeId === 1) {
					batched.setMatrixAt(0, dummy.matrix);
					batched.setVisibleAt(0, true);
					batched.setColorAt(0, dummyColor);
				} else if (cardState.cards[i].typeId === 2) {
					batched.setMatrixAt(enemyCount, dummy.matrix);
					batched.setVisibleAt(enemyCount, true);
					batched.setColorAt(enemyCount, dummyColor);
					enemyCount++;
				} else if (cardState.cards[i].typeId === 3) {
					batched.setMatrixAt(enemyScorpCount, dummy.matrix);
					batched.setVisibleAt(enemyScorpCount, true);
					batched.setColorAt(enemyScorpCount, dummyColor);
					enemyScorpCount++;
				} else if (cardState.cards[i].typeId === 10) {
					batched.setMatrixAt(turtleCount, dummy.matrix);
					batched.setVisibleAt(turtleCount, true);
					batched.setColorAt(turtleCount, dummyColor);
					turtleCount++;
				} else if (cardState.cards[i].typeId === 11) {
					batched.setMatrixAt(potionCount, dummy.matrix);
					batched.setVisibleAt(potionCount, true);
					backgroundsFloat.set([0], i);
					potionCount++;
				} else if (cardState.cards[i].typeId === 12) {
					batched.setMatrixAt(stateCount, dummy.matrix);
					batched.setVisibleAt(stateCount, true);
					backgroundsFloat.set([3], i);
					stateCount++;
				} else if (cardState.cards[i].typeId === 13) {
					batched.setMatrixAt(inspectCount, dummy.matrix);
					batched.setVisibleAt(inspectCount, true);
					backgroundsFloat.set([3], i);
					inspectCount++;
				} else if (cardState.cards[i].typeId === 14) {
					batched.setMatrixAt(effectCount, dummy.matrix);
					batched.setVisibleAt(effectCount, true);
					backgroundsFloat.set([3], i);
					effectCount++;
				} else if (cardState.cards[i].typeId === 15) {
					batched.setMatrixAt(hostCount, dummy.matrix);
					batched.setVisibleAt(hostCount, true);
					backgroundsFloat.set([3], i);
					hostCount++;
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
