<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { type ThrelteGltf } from '@threlte/extras';
	import { cardState } from '$lib/state.svelte';
	import { movingBehaviour } from './cardBehaviour';
	import { dealCard } from './cardActions';
	import type { Card } from '$lib/types';

	import ParallaxMaterial from '../materials/paralax/ParallaxMaterial.svelte';
	import { BatchedMesh, DynamicDrawUsage, InstancedMesh, Object3D } from 'three';

	let {
		gltf
	}: {
		gltf: ThrelteGltf<{
			nodes: Record<string, any>;
			materials: Record<string, any>;
		}>;
	} = $props();

	dealCard(1);
	dealCard(2);
	dealCard(3);

	let temp: Card[] = [];
	let cardsCount = 0;
	const dummy = new Object3D();

	const instancedBorders = new InstancedMesh(gltf.nodes.Border.geometry, undefined, 100);
	instancedBorders.instanceMatrix.setUsage(DynamicDrawUsage);
	const instancedBackgrounds = new InstancedMesh(gltf.nodes.Background.geometry, undefined, 100);
	instancedBackgrounds.instanceMatrix.setUsage(DynamicDrawUsage);

	const maxGeometryCount = 50;
	const maxIndexCount = 512;
	const maxVertexCount = 1024;
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
		}
		instancedBorders.count = cardsCount;
		instancedBorders.instanceMatrix.needsUpdate = true;
		instancedBackgrounds.count = cardsCount;
		instancedBackgrounds.instanceMatrix.needsUpdate = true;
	});
</script>

<T is={instancedBorders} frustumCulled={false}>
	<T.MeshStandardMaterial />
</T>

<T is={instancedBackgrounds} frustumCulled={false}>
	<ParallaxMaterial />
</T>

<T is={batched} matrixAutoUpdate={false} frustumCulled={false} />
