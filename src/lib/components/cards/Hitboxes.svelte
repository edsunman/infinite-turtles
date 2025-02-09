<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import {
		interactivity,
		type Intersection,
		type IntersectionEvent,
		type ThrelteGltf
	} from '@threlte/extras';
	import { cardState, gameState, sfxPlayer } from '$lib/state.svelte';
	import { positionHand, placeCard, throwCard } from '$lib/game/gameActions';
	import {
		InstancedMesh,
		MeshStandardMaterial,
		PlaneGeometry,
		DynamicDrawUsage,
		Object3D
	} from 'three';
	import SplatMaterial from '../materials/splat/SplatMaterial.svelte';
	import { Tween, Spring } from '$lib/helpers/animation';
	import { cubicInOut } from 'svelte/easing';
	import type { Card } from '$lib/types';

	interactivity();

	let {
		gltf,
		textures
	}: {
		gltf: ThrelteGltf<{
			nodes: Record<string, any>;
			materials: Record<string, any>;
		}>;
		textures: any;
	} = $props();

	let pointerMovedOffCard = false;
	let time = $state(0);
	let portalSize = $state(0);
	let portalTween = new Tween(0 as number, 3, cubicInOut);
	let cardOutlinePosition = $state({ x: 10, z: 10 });
	let leftDashOpacity = $state(0);
	let leftDashSpring = new Spring(0 as number, 0.3);
	let rightDashOpacity = $state(0);
	let rightDashSpring = new Spring(0 as number, 0.3);

	const findIntersectedCard = (intersections: Intersection[]) => {
		let card: Card | null = null;
		for (let intersect of intersections) {
			if (Object.hasOwn(intersect, 'instanceId') && intersect.instanceId !== undefined) {
				card = cardState.cards[intersect.instanceId];
				break;
			}
		}
		return card;
	};

	const pointerMoved = (e: any) => {
		if (gameState.state !== 'playerTurn' || gameState.locked) return;
		let card = findIntersectedCard(e.intersections);
		if (cardState.selectedCard) {
			if (!card) {
				// pointer over ground with card selected
				if (cardState.selectedCard && cardState.selectedCard.typeId === 10) {
					// turtle card is selected
					if (
						e.point.z > -1.7 &&
						e.point.z < -0.3 &&
						e.point.x < -1.5 &&
						e.point.x > -2.5 &&
						cardState.slots[0] === ''
					) {
						document.body.classList.add('hovering');
						rightDashSpring.set(1);
					} else if (
						e.point.z > -1.7 &&
						e.point.z < -0.3 &&
						e.point.x > 1.5 &&
						e.point.x < 2.5 &&
						cardState.slots[3] === ''
					) {
						document.body.classList.add('hovering');
						leftDashSpring.set(1);
					} else {
						pointerMovedOffCard = true;
						leftDashSpring.set(0.4);
						rightDashSpring.set(0.4);
					}
				}
				if (pointerMovedOffCard) {
					document.body.classList.remove('hovering');
					cardOutlinePosition = { x: 10, z: 10 };
					pointerMovedOffCard = false;
				}
			} else if (
				(card.id === cardState.slots[0] &&
					cardState.selectedCard.typeId >= 12 &&
					cardState.slots[2] === '') ||
				(card.id === cardState.slots[3] && cardState.selectedCard.typeId >= 12) ||
				(card.typeId >= 2 && card.typeId <= 9 && cardState.selectedCard.typeId === 10) ||
				(card.typeId === 1 && cardState.selectedCard.typeId === 11)
			) {
				document.body.classList.add('hovering');
				cardOutlinePosition = { x: card.position.x, z: card.position.z };
				pointerMovedOffCard = true;
			}
		} else {
			if (!card) {
				// pointer over ground no card selected
				if (pointerMovedOffCard) {
					cardState.hoverCard = null;
					positionHand();
					pointerMovedOffCard = false;
					document.body.classList.remove('hovering');
				}
			} else if (!(cardState.hoverCard && card.id === cardState.hoverCard.id)) {
				// pointer over different card in hand
				cardState.hoverCard = card;
				positionHand();
				pointerMovedOffCard = true;
				if (card.group === 'hand') {
					document.body.classList.add('hovering');
					sfxPlayer.play('select', { randomPitch: true });
				}
			}
		}
	};

	const pointerUp = (e: IntersectionEvent<Event>) => {
		if (gameState.state !== 'playerTurn' || gameState.locked) return;
		document.body.classList.remove('hovering');
		cardOutlinePosition = { x: 10, z: 10 };
		leftDashSpring.set(0);
		rightDashSpring.set(0);
		let card = findIntersectedCard(e.intersections);
		if (!card) {
			// clicked ground
			if (cardState.selectedCard && cardState.selectedCard.typeId === 10) {
				// turtle card is selected
				if (e.point.z > -1.7 && e.point.z < -0.3 && e.point.x < -1.5 && e.point.x > -2.5)
					placeCard(cardState.selectedCard.id, 'left', 'turtle');
				if (e.point.z > -1.7 && e.point.z < -0.3 && e.point.x > 1.5 && e.point.x < 2.5)
					placeCard(cardState.selectedCard.id, 'right', 'turtle');
			}
			cardState.selectedCard = null;
			cardState.hoverCard = null;
			positionHand();
			return;
		} else if (card.group === 'hand') {
			// clicked a card in hand
			cardState.selectedCard = card;
			if (!cardState.hoverCard) {
				sfxPlayer.play('select');
			}
			cardState.hoverCard = null;
			positionHand();
			if (card.typeId === 10) {
				leftDashSpring.set(0.4);
				rightDashSpring.set(0.4);
			}
			return;
		} else if (cardState.selectedCard) {
			// clicked a placed card with a card in hand selected
			if (card.id === cardState.slots[0] && cardState.selectedCard.typeId >= 12)
				//  clicked left turtle with rune
				placeCard(cardState.selectedCard.id, 'left', 'rune');
			if (card.id === cardState.slots[3] && cardState.selectedCard.typeId >= 12)
				//  clicked right turtle with rune
				placeCard(cardState.selectedCard.id, 'right', 'rune');
			if (card.typeId >= 2 && card.typeId <= 9 && cardState.selectedCard.typeId === 10)
				//  clicked enemy with turtle
				throwCard(cardState.selectedCard, card);
			leftDashSpring.set(0);
			rightDashSpring.set(0);
			if (card.typeId === 1 && cardState.selectedCard.typeId === 11)
				//  clicked player with potion
				throwCard(cardState.selectedCard, card);

			cardState.selectedCard = null;
			cardState.hoverCard = null;
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

	$effect(() => {
		portalTween.set(gameState.portalSize);
	});

	useTask(
		'hitbox-task',
		(delta) => {
			time += delta;
			portalSize = portalTween.update(delta);
			leftDashOpacity = leftDashSpring.update(delta);
			rightDashOpacity = rightDashSpring.update(delta);
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
		},
		{ stage: 'gameplay-stage' }
	);
</script>

<T is={mesh} onclick={() => {}} />

<T.Mesh
	name="ground"
	scale={[25, 25, 25]}
	rotation.x={-1.57}
	position.y={-0.1}
	position.z={-6}
	onpointermove={pointerMoved}
	onpointerup={pointerUp}
>
	<T.PlaneGeometry />
	<SplatMaterial noiseOffset={time / 6} {portalSize} {textures} />
</T.Mesh>

<T.Mesh
	position.x={cardOutlinePosition.x}
	position.z={cardOutlinePosition.z}
	rotation.x={-1.57}
	scale={[1.1, 1.1, 1]}
>
	<T is={gltf.nodes.Border.geometry} />
	<T.MeshToonMaterial />
</T.Mesh>

<T.Mesh position.x={2} position.z={-1} rotation.x={-1.57} scale={[1, 1, 1]}>
	<T is={gltf.nodes.Dashed.geometry} />
	<T.MeshToonMaterial transparent opacity={leftDashOpacity} />
</T.Mesh>

<T.Mesh position.x={-2} position.z={-1} rotation.x={-1.57} scale={[1, 1, 1]}>
	<T is={gltf.nodes.Dashed.geometry} />
	<T.MeshToonMaterial transparent opacity={rightDashOpacity} />
</T.Mesh>
