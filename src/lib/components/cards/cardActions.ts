import { cardState, gameState, mainTimeline } from '$lib/state.svelte';
import type { Card, XYZ } from '$lib/types';

export const setupCards = () => {
	// Player
	cardState.addCard({
		health: 5,
		rotation: { x: -1.57, y: 0, z: 0 },
		position: { x: 0, y: 0, z: -0.5 }
	});
	// Left turtle
	cardState.addCard({
		health: 5,
		rotation: { x: -1.57, y: 0, z: 0 },
		position: { x: -2, y: 0, z: -1 }
	});
	// Right turtle
	cardState.addCard({
		health: 5,
		rotation: { x: -1.57, y: 0, z: 0 },
		position: { x: 2, y: 0, z: -1 }
	});
	// Enemy
	cardState.addCard({
		health: 5,
		rotation: { x: -1.57, y: 0, z: 0 },
		position: { x: 0, y: 0, z: -3.2 }
	});
};

export const dealCard = (cardId: string) => {
	let foundCard;
	cardState.cards.forEach((card) => {
		if (card.id === cardId) {
			card.rotateTo = { x: -1.15, y: 0, z: 0 };
			card.settled = false;
			card.inHand = true;
			foundCard = card;
		}
	});
	if (!foundCard) console.error('no card with id ' + cardId);
	cardState.selectedCardId = '';
	cardState.dealing = true;
	gameState.locked = true;
	positionHand();
	mainTimeline.addKeyframe(0.2, () => {
		cardState.dealing = false;
		gameState.locked = false;
	});
};

export const placeCard = (cardId: string, on: 'left' | 'right') => {
	let selectedSlot = 0;
	if (on === 'left') {
		if (cardState.slots[0] !== '' && cardState.slots[1] !== '') {
			return;
		}
		selectedSlot = cardState.slots[0] === '' ? 0 : 1;
	} else {
		if (cardState.slots[2] !== '' && cardState.slots[3] !== '') {
			return;
		}
		selectedSlot = cardState.slots[2] === '' ? 2 : 3;
	}
	const slots = [
		{ x: -2.6, y: 0, z: 0.6 },
		{ x: -1.4, y: 0, z: 0.6 },
		{ x: 1.4, y: 0, z: 0.6 },
		{ x: 2.6, y: 0, z: 0.6 }
	];
	moveCard(cardId, 0.02, { x: 0, y: 5, z: 0 });
	gameState.locked = true;
	mainTimeline.addKeyframe(0.3, () => moveCard(cardId, 0.2, slots[selectedSlot]));
	mainTimeline.addKeyframe(0.5, () => (gameState.locked = false));
	cardState.slots[selectedSlot] = cardId;
};

export const moveCard = (
	cardId: string,
	stiffness: number,
	moveTo: XYZ,
	rotateTo: XYZ = { x: -1.57, y: 0, z: 0 }
) => {
	let foundCard: Card | undefined;
	cardState.cards.forEach((card) => {
		if (card.id === cardId) {
			card.rotateTo = rotateTo;
			card.moveTo = moveTo;
			card.stiffness = stiffness;
			card.settled = false;
			card.inHand = false;
			foundCard = card;
		}
	});
	if (!foundCard) console.error('no card with id ' + cardId);
};

export const cardIdFromInstanceId = (instanceId: number): string => {
	const card = cardState.cards[instanceId];
	return card ? card.id : '';
};

export const positionHand = () => {
	const hand = cardState.cards.filter((card) => {
		return card.inHand;
	});
	let i = 0;
	let hoverHeight = 0;
	const offset = hand.length / 2 - 0.5;
	const heights = createAscendingDescendingArray(hand.length);
	const hoverId = cardState.hoverCardId;
	const selectedId = cardState.selectedCardId;
	cardState.cards.forEach((card) => {
		if (!card.inHand) return;
		if (card.id === hoverId || card.id === selectedId) hoverHeight = 0.5;
		card.moveTo.x = i / 1.05 - offset / 1.1;
		card.moveTo.y = 2 + hoverHeight - i / 20 + (heights[i] - offset) * 0.05;
		card.moveTo.z = 3 - (heights[i] - offset) * 0.1 - hoverHeight / 2;
		card.rotateTo.x = card.id === hoverId || card.id === selectedId ? -1.25 : -1.15;
		card.rotateTo.z = (i / 12) * -1 + offset / 12;
		let stiffness = 0.4;
		if (card.id === hoverId) stiffness = 0.25;
		if (cardState.dealing) stiffness = 0.15;
		card.stiffness = stiffness;
		card.settled = false;
		hoverHeight = 0;
		i++;
	});
};

const createAscendingDescendingArray = (length: number) => {
	const result = [];
	for (let i = 1; i <= Math.ceil(length / 2); i++) {
		result.push(i);
	}
	for (let i = Math.floor(length / 2); i >= 1; i--) {
		result.push(i);
	}
	return result;
};
