<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { cardState, gameState } from '$lib/state.svelte';
	import { cardIdFromInstanceId, positionHand, placeCard } from './cardActions';
	import {
		InstancedMesh,
		MeshStandardMaterial,
		PlaneGeometry,
		DynamicDrawUsage,
		Object3D
	} from 'three';

	interactivity();

	const pointerMoved = (e: any) => {
		if (gameState.locked) return;
		if (cardState.selectedCardId !== '') return;
		let cardId = '';
		for (let intersect of e.intersections) {
			if (Object.hasOwn(intersect, 'instanceId')) {
				cardId = cardIdFromInstanceId(intersect.instanceId);
				break;
			}
		}
		if (cardState.hoverCardId !== cardId) {
			cardState.hoverCardId = cardId;
			positionHand();
		}
	};

	const pointerUp = (e: any) => {
		if (gameState.locked) return;
		console.log(e.intersections);
		let cardId = '';
		for (let intersect of e.intersections) {
			if (Object.hasOwn(intersect, 'instanceId')) {
				cardId = cardIdFromInstanceId(intersect.instanceId);
				break;
			}
		}
		if (cardId === '' && cardState.selectedCardId !== '') {
			if (e.point.x > -2.5 && e.point.x < -1.5 && e.point.z < -0.3 && e.point.z > -1.8) {
				// left turtle
				placeCard(cardState.selectedCardId, 'left');
			} else if (e.point.x < 2.5 && e.point.x > 1.5 && e.point.z < -0.3 && e.point.z > -1.8) {
				// right turtle
				placeCard(cardState.selectedCardId, 'right');
			}
			cardState.selectedCardId = '';
			cardState.hoverCardId = '';
			positionHand();
		} else if (cardState.selectedCardId !== cardId) {
			// clicked a differnt card so select that one
			cardState.selectedCardId = cardId;
			cardState.hoverCardId = '';
			positionHand();
		}
	};

	const plane = new PlaneGeometry();
	const mat = new MeshStandardMaterial();
	mat.visible = false;
	const mesh = new InstancedMesh(plane, mat, 50);
	const dummy = new Object3D();
	dummy.scale.y = 1.5;
	mesh.instanceMatrix.setUsage(DynamicDrawUsage);
	mesh.name = 'hitbox';

	useTask((delta) => {
		cardState.cards.forEach((card, i) => {
			if (card.settled) return;
			dummy.position.set(card.position.x, card.position.y, card.position.z);
			dummy.rotation.set(card.rotation.x, card.rotation.y, card.rotation.z);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		});
		mesh.instanceMatrix.needsUpdate = true;
		mesh.computeBoundingSphere();
	});
</script>

<T is={mesh} onclick={() => {}} />

<T.Mesh
	name="ground"
	scale={[40, 40, 40]}
	rotation.x={-1.57}
	position.y={-0.1}
	onpointermove={pointerMoved}
	onpointerup={pointerUp}
>
	<T.PlaneGeometry />
	<T.MeshStandardMaterial color="#121212" />
</T.Mesh>
