<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { type ThrelteGltf } from '@threlte/extras';
	import { cardState } from '$lib/state.svelte';
	import { movingBehaviour } from './cardBehaviour';
	import type { Card } from '$lib/types';

	import ParallaxMaterial from '../materials/paralax/ParallaxMaterial.svelte';
	import NumbersMaterial from '../materials/numbers/NumbersMaterial.svelte';

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

	const instancedNumbers = new InstancedMesh(new PlaneGeometry(0.3, 0.3), undefined, 100);
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
	batched.addGeometry(gltf.nodes.Rune.geometry);
	for (let i = 0; i < 50; i++) {
		batched.addInstance(0);
	}

	useTask((delta) => {
		temp = cardState.cards.concat();
		temp.forEach((card, index, array) => {
			card = movingBehaviour(card, delta);
		});
		cardState.cards = temp;
		cardsCount = temp.length;

		for (let i = 0; i < 50; i++) {
			batched.setVisibleAt(i, false);
		}
		for (let i = 0; i < cardsCount; i++) {
			dummy.position.set(temp[i].position.x, temp[i].position.y, temp[i].position.z);
			dummy.rotation.set(temp[i].rotation.x, temp[i].rotation.y, temp[i].rotation.z);
			dummy.updateMatrix();
			instancedBorders.setMatrixAt(i, dummy.matrix);
			instancedBackgrounds.setMatrixAt(i, dummy.matrix);
			batched.setMatrixAt(i, dummy.matrix);
			batched.setVisibleAt(i, true);
			dummy.translateX(0.3);
			dummy.translateY(0.6);
			dummy.translateZ(0.02);
			dummy.updateMatrix();
			instancedNumbers.setMatrixAt(i, dummy.matrix);
			numbersFloat.set([temp[i].health], i);
		}
		instancedBorders.count = cardsCount;
		instancedBorders.instanceMatrix.needsUpdate = true;
		instancedBackgrounds.count = cardsCount;
		instancedBackgrounds.instanceMatrix.needsUpdate = true;
		instancedNumbers.count = cardsCount;
		instancedNumbers.instanceMatrix.needsUpdate = true;
		instancedNumbers.geometry.attributes.custom.needsUpdate = true;
	});
</script>

<T is={instancedBorders} frustumCulled={false}>
	<T.MeshStandardMaterial />
</T>

<T is={instancedBackgrounds} frustumCulled={false}>
	<ParallaxMaterial />
</T>

<T is={instancedNumbers} frustumCulled={false}>
	<NumbersMaterial />
</T>

<T is={batched} matrixAutoUpdate={false} frustumCulled={false} />
