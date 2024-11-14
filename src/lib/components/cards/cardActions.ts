import { cardState } from '$lib/state.svelte';

export const dealCard = (cardId: number) => {
	let foundCard;
	cardState.cards.forEach((card) => {
		if (card.id === cardId) {
			card.rotateTo = { x: -0.75, y: 0, z: 0 };
			card.moveTo = { x: -2 + countHand() * 1.1, y: 8, z: 9 };
			card.settled = false;
			card.inHand = true;
			foundCard = card;
		}
	});
	if (!foundCard) console.error('no card with id ' + cardId);
	positionHand();
};

export const cardIdFromInstanceId = (instanceId: number): number => {
	const card = cardState.cards[instanceId];
	return card ? card.id : 0;
};

const countHand = () => {
	let handCount = 0;
	for (const card of cardState.cards) {
		if (card.inHand) handCount++;
	}
	return handCount;
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
		card.moveTo.x = i / 1.1 - offset / 1.1;
		card.moveTo.y = 7.5 + (heights[i] - offset) / 4 + hoverHeight;
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
