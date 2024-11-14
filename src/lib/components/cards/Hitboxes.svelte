<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { cardState } from '$lib/state.svelte';
	import { cardIdFromInstanceId, positionHand } from './cardActions';
	import {
		InstancedMesh,
		MeshStandardMaterial,
		PlaneGeometry,
		DynamicDrawUsage,
		Object3D
	} from 'three';

	interactivity();

	let hoverCardId = 0;

	const groundClicked = (e: any) => {
		//console.log(e.intersections);
		let cardId = 0;
		for (let intersect of e.intersections) {
			if (Object.hasOwn(intersect, 'instanceId')) {
				cardId = cardIdFromInstanceId(intersect.instanceId);
				//console.log(cardId);
				break;
			}
		}
		if (hoverCardId !== cardId) {
			hoverCardId = cardId;
			cardState.selectedCardId = hoverCardId;
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
	position.y={0}
	onpointermove={groundClicked}
>
	<T.PlaneGeometry />
	<T.MeshStandardMaterial color="red" />
</T.Mesh>
