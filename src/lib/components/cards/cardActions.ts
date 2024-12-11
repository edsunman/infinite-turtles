import { cardState, gameState, mainTimeline } from '$lib/state.svelte';
import { createAscendingDescendingArray, randomNumber } from '$lib/helpers/utils';
import type { Card, XYZ, CardGroup } from '$lib/types';

export const dealCard = () => {
	if (cardState.count.deck < 1) refillDeck();
	const random = randomNumber(0, cardState.count.deck - 1);
	const handLength = cardState.cards.filter((card) => {
		return card.group === 'hand';
	}).length;
	let deckCardCount = 0;
	cardState.cards.forEach((card) => {
		if (card.group !== 'deck') return;
		if (deckCardCount === random) {
			card.rotateTo = { x: -1.15, y: 0, z: 0 };
			card.settled = false;
			card.group = 'hand';
			card.order = handLength;
		}
		deckCardCount++;
	});
	cardState.selectedCardId = '';
	positionHand();
};

export const dealHand = () => {
	gameState.state = 'dealing';
	mainTimeline.addKeyframe(0, () => dealCard());
	mainTimeline.addKeyframe(0.3, () => dealCard());
	mainTimeline.addKeyframe(0.6, () => dealCard());
	mainTimeline.addKeyframe(1, () => (gameState.state = 'playerTurn'));
};

export const discardCardFromHand = () => {
	cardState.cards.forEach((card) => {
		if (!(card.group === 'hand' && card.order === 0)) return;
		card.moveTo = { x: 6, y: 0, z: 3.7 };
		card.rotateTo = { x: -1.57, y: 0, z: 0 };
		card.settled = false;
		card.stiffness = 0.1;
		card.group = 'discard';
	});
	closeGapInHand();
	positionHand();
};

export const discardHand = () => {
	const handLength = cardState.cards.filter((card) => card.group === 'hand').length;
	gameState.state = 'discarding';
	discardCardFromHand();
	for (let i = 1; i < handLength; i++) {
		mainTimeline.addKeyframe(0.2 * i, () => {
			discardCardFromHand();
		});
	}
	mainTimeline.addKeyframe(0.3 * handLength, () => {
		gameState.state = 'playerTurn';
	});
};

export const refillDeck = () => {
	cardState.cards.forEach((card) => {
		if (card.group !== 'discard') return;
		card.position = { x: -6, y: 0, z: 3.7 };
		card.group = 'deck';
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
	moveCard(cardId, 'none', 0.02, { x: 0, y: 5, z: 0 });
	gameState.locked = true;
	mainTimeline.addKeyframe(0.3, () => moveCard(cardId, 'none', 0.2, slots[selectedSlot]));
	mainTimeline.addKeyframe(0.5, () => (gameState.locked = false));
	cardState.slots[selectedSlot] = cardId;
	closeGapInHand(cardId);
};

export const closeGapInHand = (cardId: string = '') => {
	let order = 0;
	cardState.cards.forEach((card) => {
		if (card.id === cardId) order = card.order;
	});
	cardState.cards.forEach((card) => {
		if (card.order > order) card.order--;
	});
};

export const moveCard = (
	cardId: string,
	group: CardGroup,
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
			card.group = group;
			foundCard = card;
		}
	});
	if (!foundCard) console.error('no card with id ' + cardId);
};

export const positionHand = () => {
	const handLength = cardState.cards.filter((card) => card.group === 'hand').length;
	let hoverHeight = 0;
	const offset = handLength / 2 - 0.5;
	const heights = createAscendingDescendingArray(handLength);
	const hoverId = cardState.hoverCardId;
	const selectedId = cardState.selectedCardId;
	cardState.cards.forEach((card) => {
		if (card.group !== 'hand') return;
		if (card.id === hoverId || card.id === selectedId) hoverHeight = 0.5;
		card.moveTo.x = card.order / 1.05 - offset / 1.1;
		card.moveTo.y = 2 + hoverHeight - card.order / 20 + (heights[card.order] - offset) * 0.05;
		card.moveTo.z = 3 - (heights[card.order] - offset) * 0.1 - hoverHeight / 2;
		card.rotateTo.x = card.id === hoverId || card.id === selectedId ? -1.25 : -1.15;
		card.rotateTo.z = (card.order / 12) * -1 + offset / 12;
		let stiffness = 0.4;
		if (card.id === hoverId) stiffness = 0.25;
		if (gameState.state === 'dealing') stiffness = 0.15;
		if (gameState.state === 'discarding') stiffness = 0.1;
		card.stiffness = stiffness;
		card.settled = false;
		hoverHeight = 0;
	});
};

export const setupInitialCards = () => {
	// Player
	cardState.addCard({
		typeId: 1,
		health: 10,
		rotation: { x: -1.57, y: 0, z: 0 },
		position: { x: 0, y: 0, z: -0.5 }
	});
	// Enemy
	cardState.addCard({
		typeId: 2,
		health: 10,
		rotation: { x: -1.57, y: 0, z: 0 },
		position: { x: 0, y: 0, z: -3.2 }
	});
	// Left turtle
	cardState.addCard({
		health: 1,
		rotation: { x: -1.57, y: 0, z: 0 },
		position: { x: -2, y: 0, z: -1 }
	});
	// Right turtle
	cardState.addCard({
		health: 1,
		rotation: { x: -1.57, y: 0, z: 0 },
		position: { x: 2, y: 0, z: -1 }
	});
	// Starting Deck
	for (let i = 0; i < 9; i++) {
		const j = Math.floor(i / 3);
		cardState.addCard({
			typeId: 10 + j,
			group: 'deck',
			rotation: { x: -1.57, y: 0, z: 0 },
			position: { x: -6, y: 0, z: 3.7 }
		});
	}
};
