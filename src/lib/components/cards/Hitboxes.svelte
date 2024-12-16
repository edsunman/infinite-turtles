<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { cardState, gameState } from '$lib/state.svelte';
	import { positionHand, placeCard } from './cardActions';
	import {
		InstancedMesh,
		MeshStandardMaterial,
		PlaneGeometry,
		DynamicDrawUsage,
		Object3D
	} from 'three';

	interactivity();

	const pointerMoved = (e: any) => {
		if (gameState.state !== 'playerTurn' || gameState.locked) return;
		if (cardState.selectedCardId !== '') return;
		let cardId = '';
		for (let intersect of e.intersections) {
			if (Object.hasOwn(intersect, 'instanceId')) {
				cardId = cardState.cards[intersect.instanceId].id;
				break;
			}
		}
		if (cardState.hoverCardId !== cardId) {
			cardState.hoverCardId = cardId;
			positionHand();
		}
	};

	const pointerUp = (e: any) => {
		if (gameState.state !== 'playerTurn' || gameState.locked) return;
		let card;
		for (let intersect of e.intersections) {
			if (Object.hasOwn(intersect, 'instanceId')) {
				card = cardState.cards[intersect.instanceId];
				break;
			}
		}
		const selectedCard = cardState.cards.find(
			(card) => card.id === cardState.selectedCardId && card.group === 'hand'
		);
		if (!card) {
			// clicked ground
			if (selectedCard && selectedCard.typeId === 10) {
				// turtle card is selected
				if (e.point.z > -1.7 && e.point.z < -0.3 && e.point.x < -1.5 && e.point.x > -2.5)
					placeCard(cardState.selectedCardId, 'left', 'turtle');
				if (e.point.z > -1.7 && e.point.z < -0.3 && e.point.x > 1.5 && e.point.x < 2.5)
					placeCard(cardState.selectedCardId, 'right', 'turtle');
			}
			cardState.selectedCardId = '';
			cardState.hoverCardId = '';
			positionHand();
			return;
		} else if (card.id === cardState.hoverCardId) {
			// clicked hovered card so select
			cardState.selectedCardId = card.id;
			cardState.hoverCardId = '';
			positionHand();
			return;
		} else if (card.group === 'hand') {
			// clicked a different card in hand
			cardState.selectedCardId = card.id;
			cardState.hoverCardId = '';
			positionHand();
			return;
		}

		if (!selectedCard) return;
		// Clicked a placed card with rune card selected
		if (card.id === cardState.slots[0] && selectedCard.typeId >= 12)
			//  clicked left turtle
			placeCard(cardState.selectedCardId, 'left', 'rune');
		if (card.id === cardState.slots[3] && selectedCard.typeId >= 12)
			//  clicked right turtle
			placeCard(cardState.selectedCardId, 'right', 'rune');

		cardState.selectedCardId = '';
		cardState.hoverCardId = '';
		positionHand();
	};

	const plane = new PlaneGeometry();
	const mat = new MeshStandardMaterial();
	mat.visible = false;
	const mesh = new InstancedMesh(plane, mat, 50);
	const dummy = new Object3D();
	dummy.scale.y = 1.5;
	mesh.instanceMatrix.setUsage(DynamicDrawUsage);
	mesh.name = 'hitbox';

	// TODO: maybe optimise this, do we need a hitbox for off-screen cards?
	useTask((delta) => {
		if (gameState.state !== 'playerTurn') return;
		cardState.cards.forEach((card, i) => {
			dummy.position.set(card.position.x, card.position.y, card.position.z);
			dummy.rotation.set(card.rotation.x, card.rotation.y, card.rotation.z);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		});
		mesh.count = cardState.cards.length;
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
