import { cardState, gameState, timeline } from '$lib/state.svelte';
import { createAscendingDescendingArray, randomNumber } from '$lib/helpers/utils';
import { endGame, actionUsed } from '$lib/gameplay';
import type { Card } from '$lib/types';
import { data } from '$lib/data';

export const dealHand = () => {
	timeline.addKeyframe(0, () => dealCard());
	timeline.addKeyframe(0.3, () => dealCard());
	timeline.addKeyframe(0.6, () => dealCard());
};

const dealCard = () => {
	const deckCount = cardState.cards.filter((c) => c.group === 'deck').length;
	if (deckCount < 1) {
		refillDeckFromDiscardPile();
	}
	const handLength = cardState.cards.filter((card) => {
		return card.group === 'hand';
	}).length;
	// TODO: if there are no turtles placed we should get at least one turtle
	const dealTurtle = randomNumber(0, 1);
	if (dealTurtle === 0) {
		cardState.addCard({
			health: data.cardTypes['10'].health,
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
	cardState.selectedCard = null;

	positionHand();
};

export const refillDeckFromDiscardPile = () => {
	cardState.cards.forEach((card) => {
		if (card.group !== 'discard') return;
		card.position = { x: -6, y: 0, z: 3.7 };
		card.group = 'deck';
		if (card.typeId === 12) card.health = card.startingHealth;
	});
};

export const discardHand = () => {
	const handLength = cardState.cards.filter((card) => card.group === 'hand').length;
	discardCardFromHand();
	for (let i = 1; i < handLength; i++) {
		timeline.addKeyframe(0.2 * i, () => {
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
	const slotOffset = turtleId === cardState.slots[0] ? 0 : 3;
	updateCard(turtleId, {
		moveTo: { x: turtleId === cardState.slots[0] ? -7 : 7, y: 5, z: -2 },
		settled: false,
		rotateTo: { x: -1.57, y: 0, z: 4 },
		stiffness: 0.08
	});
	if (cardState.slots[1 + slotOffset] !== '') {
		timeline.addKeyframe(0.1, () => {
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
		timeline.addKeyframe(0.2, () => {
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
	timeline.addKeyframe(0.5, () => {
		updateCard(turtleId, { health: -1 });
		cardState.slots[0 + slotOffset] = '';
	});
};

export const updateCard = (cardId: string, args: Partial<Card>) => {
	const oldCard = cardState.cards.find((card) => card.id === cardId);
	const cardIndex = cardState.cards.findIndex((card) => card.id === cardId);
	if (!oldCard) return;
	const newCard = { ...oldCard, ...args };
	cardState.cards[cardIndex] = newCard;
};

export const throwCard = (card: Card, target: Card) => {
	gameState.locked = true;
	if (target.typeId >= 2 && target.typeId <= 9 && card.typeId === 10) {
		if (!target) return;
		updateCard(card.id, {
			moveTo: { x: target.position.x, y: 0, z: -5 },
			rotateTo: { x: -1, y: 0, z: 3 },
			settled: false,
			group: 'none',
			stiffness: 0.1
		});
		closeGapInHand(card.id);
		timeline.addKeyframe(0.25, () => {
			updateCard(card.id, {
				moveTo: { x: randomNumber(-6, 6), y: 1, z: -6 },
				rotateTo: { x: -1, y: 0, z: -3 },
				settled: false,
				stiffness: 0.08
			});
			const hit = randomNumber(0, 1);
			if (hit) {
				updateCard(target.id, { health: target.health - 1, redAmount: 1 });
				cardState.damagedCard = target;
				cardState.damage.text = '-1';
				if (target.health <= 1 && target.typeId === 2) {
					timeline.addKeyframe(1, () => {
						// kill enemy
						updateCard(target.id, { health: -1 });
					});
					endGame(true);
				}
			} else {
				cardState.damagedCard = target;
				cardState.damage.text = '<small>miss</small>';
			}
		});
	}
	if (target.typeId === 1 && card.typeId === 11) {
		updateCard(card.id, {
			group: 'none',
			stiffness: 0.03,
			moveTo: { x: 0, y: 5, z: 0 },
			rotateTo: { x: -1.57, y: 0, z: 0 },
			settled: false
		});
		closeGapInHand(card.id);
		timeline.addKeyframe(0.3, () => {
			updateCard(card.id, {
				moveTo: { x: 6, y: 0, z: 3.7 },
				rotateTo: { x: -1.57, y: 0, z: 0 },
				settled: false,
				group: 'discard',
				stiffness: 0.08
			});
			updateCard(target.id, { health: target.health + 1 });
			cardState.damagedCard = target;
			cardState.damage.text = '+1';
		});
	}
	timeline.addKeyframe(0.5, () => actionUsed());
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
	timeline.addKeyframe(0.3, () =>
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
	timeline.addKeyframe(0.5, () => actionUsed());
};

export const damageCard = (card: Card, target: Card) => {
	let damagedHealth = target.health - card.strength;
	if (damagedHealth < 0) damagedHealth = 0;
	updateCard(target.id, { health: damagedHealth, redAmount: target.typeId <= 10 ? 1 : 0 });
	cardState.damagedCard = target;
	cardState.damage.text = '-' + card.strength;
};

export const positionHand = () => {
	const handLength = cardState.cards.filter((card) => card.group === 'hand').length;
	let hoverHeight = 0;
	const offset = handLength / 2 - 0.5;
	const heights = createAscendingDescendingArray(handLength);
	const hoverId = cardState.hoverCard ? cardState.hoverCard.id : '';
	const selectedId = cardState.selectedCard ? cardState.selectedCard.id : '';
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

const closeGapInHand = (cardId: string = '') => {
	let order = 0;
	cardState.cards.forEach((card) => {
		if (card.id === cardId) order = card.order;
	});
	cardState.cards.forEach((card) => {
		if (card.order > order) card.order--;
	});
};
