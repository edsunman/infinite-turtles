import { cardState, gameState, mainTimeline } from '$lib/state.svelte';
import { createAscendingDescendingArray, randomNumber } from '$lib/helpers/utils';
import { endTurn } from '$lib/gameplay';
import type { Card } from '$lib/types';

export const dealHand = () => {
	mainTimeline.addKeyframe(0, () => dealCard());
	mainTimeline.addKeyframe(0.3, () => dealCard());
	mainTimeline.addKeyframe(0.6, () => dealCard());
};

const dealCard = () => {
	const deckCount = cardState.cards.filter((c) => c.group === 'deck').length;
	if (deckCount < 1) {
		// need to refill deck
		cardState.cards.forEach((card) => {
			if (card.group !== 'discard') return;
			card.position = { x: -6, y: 0, z: 3.7 };
			card.group = 'deck';
			if (card.typeId === 12) card.health = card.startingHealth;
		});
	}
	const handLength = cardState.cards.filter((card) => {
		return card.group === 'hand';
	}).length;
	const dealTurtle = randomNumber(0, 1);
	if (dealTurtle === 0) {
		cardState.addCard({
			health: 1,
			typeId: 10,
			group: 'hand',
			order: handLength,
			position: { x: -6, y: 0, z: 3.7 }
		});
	} else {
		const random = randomNumber(0, deckCount - 1);
		let i = 0;
		cardState.cards.forEach((card) => {
			if (card.group !== 'deck') return;
			if (i === random) {
				card.group = 'hand';
				card.order = handLength;
			}
			i++;
		});
	}
	cardState.selectedCardId = '';

	positionHand();
};

export const discardHand = () => {
	const handLength = cardState.cards.filter((card) => card.group === 'hand').length;
	discardCardFromHand();
	for (let i = 1; i < handLength; i++) {
		mainTimeline.addKeyframe(0.2 * i, () => {
			discardCardFromHand();
		});
	}
};

const discardCardFromHand = () => {
	cardState.cards.forEach((card) => {
		if (!(card.group === 'hand' && card.order === 0)) return;
		card.moveTo = { x: 6, y: 0, z: 3.7 };
		card.rotateTo = { x: -1.57, y: 0, z: 0 };
		card.settled = false;
		card.stiffness = 0.1;
		card.group = card.typeId === 10 ? 'none' : 'discard';
	});
	closeGapInHand();
	positionHand();
};

export const discardTurtle = (turtleId: string) => {
	gameState.locked = true;
	const slotOffset = turtleId === cardState.slots[0] ? 0 : 3;
	updateCard(turtleId, {
		moveTo: { x: -7, y: 5, z: -2 },
		settled: false,
		rotateTo: { x: -1.57, y: 0, z: 1.57 },
		stiffness: 0.08
	});
	if (cardState.slots[1 + slotOffset] !== '') {
		mainTimeline.addKeyframe(0.1, () => {
			updateCard(cardState.slots[1 + slotOffset], {
				moveTo: { x: 6, y: 0, z: 3.7 },
				settled: false,
				rotateTo: { x: -1.57, y: 0, z: 0 },
				stiffness: 0.06,
				group: 'discard'
			});
			cardState.slots[1 + slotOffset] = '';
		});
	}
	if (cardState.slots[2 + slotOffset] !== '') {
		mainTimeline.addKeyframe(0.2, () => {
			updateCard(cardState.slots[2 + slotOffset], {
				moveTo: { x: 6, y: 0, z: 3.7 },
				settled: false,
				rotateTo: { x: -1.57, y: 0, z: 0 },
				stiffness: 0.06,
				group: 'discard'
			});
			cardState.slots[2 + slotOffset] = '';
		});
	}
	mainTimeline.addKeyframe(0.5, () => {
		updateCard(turtleId, {
			health: -1
		});
		cardState.slots[0 + slotOffset] = '';
	});
	mainTimeline.addKeyframe(1, () => {
		gameState.locked = false;
	});
};

export const updateCard = (cardId: string, args: Partial<Card>) => {
	const oldCard = cardState.cards.find((card) => card.id === cardId);
	const cardIndex = cardState.cards.findIndex((card) => card.id === cardId);
	if (!oldCard) return;
	const newCard = { ...oldCard, ...args };
	cardState.cards[cardIndex] = newCard;
};

export const throwCard = (cardId: string, at: 'player' | 'enemy') => {
	const card = cardState.cards.find((c) => c.id === cardId);
	if (!card) return;
	gameState.locked = true;
	if (at === 'enemy' && card.typeId === 10) {
		const enemy = cardState.cards.find((c) => c.typeId === 2);
		if (!enemy) return;
		updateCard(cardId, {
			moveTo: { x: 0, y: 0, z: -5 },
			rotateTo: { x: -1, y: 0, z: 3 },
			settled: false,
			group: 'none',
			stiffness: 0.1
		});
		closeGapInHand(cardId);
		mainTimeline.addKeyframe(0.25, () => {
			updateCard(cardId, {
				moveTo: { x: randomNumber(-6, 6), y: 1, z: -6 },
				rotateTo: { x: -1, y: 0, z: -3 },
				settled: false,
				stiffness: 0.08
			});
			const hit = randomNumber(0, 1);
			if (hit) {
				updateCard(enemy.id, { health: enemy.health - 1, redAmount: 1 });
				cardState.damagedCard = enemy;
				gameState.damage.text = '-1';
			} else {
				cardState.damagedCard = enemy;
				gameState.damage.text = '<small>miss</small>';
			}
		});
	}
	if (at === 'player' && card.typeId === 11) {
		const player = cardState.cards.find((c) => c.typeId === 1);
		if (!player) return;
		updateCard(cardId, {
			group: 'none',
			stiffness: 0.03,
			moveTo: { x: 0, y: 5, z: 0 },
			rotateTo: { x: -1.57, y: 0, z: 0 },
			settled: false
		});
		closeGapInHand(cardId);
		mainTimeline.addKeyframe(0.3, () => {
			updateCard(cardId, {
				moveTo: { x: 6, y: 0, z: 3.7 },
				rotateTo: { x: -1.57, y: 0, z: 0 },
				settled: false,
				group: 'discard',
				stiffness: 0.08
			});
			updateCard(player.id, { health: player.health + 1 });
		});
	}
	mainTimeline.addKeyframe(0.5, () => actionUsed());
};

export const placeCard = (cardId: string, on: 'left' | 'right', type: 'turtle' | 'rune') => {
	let selectedSlot = 0;
	if (on === 'left') {
		if (cardState.slots[1] !== '' && cardState.slots[2] !== '') {
			return;
		}
		selectedSlot = cardState.slots[1] === '' ? 1 : 2;
	} else {
		if (cardState.slots[4] !== '' && cardState.slots[5] !== '') {
			return;
		}
		selectedSlot = cardState.slots[4] === '' ? 4 : 5;
	}
	if (type === 'turtle' && on === 'left') {
		if (cardState.slots[0]) {
			return;
		}
		selectedSlot = 0;
	} else if (type === 'turtle' && on === 'right') {
		if (cardState.slots[3]) {
			return;
		}
		selectedSlot = 3;
	}
	const slotPositions = [
		{ x: -2, y: 0, z: -1 },
		{ x: -2.6, y: 0, z: 0.6 },
		{ x: -1.4, y: 0, z: 0.6 },
		{ x: 2, y: 0, z: -1 },
		{ x: 1.4, y: 0, z: 0.6 },
		{ x: 2.6, y: 0, z: 0.6 }
	];
	updateCard(cardId, {
		group: 'placed',
		stiffness: 0.03,
		moveTo: { x: 0, y: 5, z: 0 },
		rotateTo: { x: -1.57, y: 0, z: 0 },
		settled: false
	});
	gameState.locked = true;
	mainTimeline.addKeyframe(0.3, () =>
		updateCard(cardId, {
			group: 'placed',
			stiffness: 0.2,
			moveTo: slotPositions[selectedSlot],
			rotateTo: { x: -1.57, y: 0, z: 0 },
			settled: false
		})
	);
	cardState.slots[selectedSlot] = cardId;
	closeGapInHand(cardId);
	mainTimeline.addKeyframe(0.5, () => actionUsed());
};

const actionUsed = () => {
	gameState.actionsRemaining--;
	if (gameState.actionsRemaining == 0) {
		endTurn();
	} else {
		gameState.locked = false;
		// TODO: QOL check if mouse is hovered over a card
	}
};

const closeGapInHand = (cardId: string = '') => {
	let order = 0;
	cardState.cards.forEach((card) => {
		if (card.id === cardId) order = card.order;
	});
	cardState.cards.forEach((card) => {
		if (card.order > order) card.order--;
	});
};

export const positionHand = () => {
	const handLength = cardState.cards.filter((card) => card.group === 'hand').length;
	let hoverHeight = 0;
	const offset = handLength / 2 - 0.5;
	const heights = createAscendingDescendingArray(handLength);
	const hoverId = cardState.hoverCard ? cardState.hoverCard.id : '';
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
