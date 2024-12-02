import { cardState } from '$lib/state.svelte';

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
	// Left rune
	cardState.addCard({
		health: 5,
		rotation: { x: -1.57, y: 0, z: 0 },
		position: { x: -2.6, y: 0, z: 0.6 }
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
	positionHand();
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
	const hoverId = cardState.selectedCardId;
	cardState.cards.forEach((card) => {
		if (!card.inHand) return;
		if (card.id === hoverId) hoverHeight = 0.5;
		card.moveTo.x = i / 1.05 - offset / 1.1;
		card.moveTo.y = 3 + hoverHeight - i / 20 + (heights[i] - offset) * 0.05;
		card.moveTo.z = 3 - (heights[i] - offset) * 0.1 - hoverHeight / 2;
		card.rotateTo.x = card.id === hoverId ? -1.25 : -1.15;
		card.rotateTo.z = (i / 12) * -1 + offset / 12;
		card.settled = false;
		hoverHeight = 0;
		i++;
	});
};

function createAscendingDescendingArray(length: number) {
	const result = [];
	for (let i = 1; i <= Math.ceil(length / 2); i++) {
		result.push(i);
	}
	for (let i = Math.floor(length / 2); i >= 1; i--) {
		result.push(i);
	}
	return result;
}
