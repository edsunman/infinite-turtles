import { cardState } from '$lib/state.svelte';
import type { Card } from '$lib/types';

export const addCard = (args: Partial<Card>) => {
	const newId = Math.random().toString(16).slice(2);
	const defaults: Card = {
		id: newId,
		health: 1,
		strength: 1,
		startingHealth: 1,
		typeId: 10,
		moveTo: { x: 0, y: 0, z: 0 },
		position: { x: 0, y: 0, z: 0 },
		moveVelocity: { x: 0, y: 0, z: 0 },
		rotateTo: { x: -1.57, y: 0, z: 0 },
		rotation: { x: -1.57, y: 0, z: 0 },
		rotateVelocity: { x: 0, y: 0, z: 0 },
		stiffness: 0.3,
		settled: true,
		group: 'none',
		order: 0,
		redAmount: 0
	};
	const newCard = { ...defaults, ...args };
	cardState.cards.push(newCard);
	return newId;
};

export const updateCard = (cardId: string, args: Partial<Card>) => {
	const oldCard = cardState.cards.find((card) => card.id === cardId);
	const cardIndex = cardState.cards.findIndex((card) => card.id === cardId);
	if (!oldCard) return;
	const newCard = { ...oldCard, ...args };
	cardState.cards[cardIndex] = newCard;
};
