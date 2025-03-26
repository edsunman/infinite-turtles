import { cardState } from '$lib/state.svelte';
import type { Card } from '$lib/types';

export const findClosestEnemy = (turtle: Card, enemies: Card[]) => {
	let closestCard: Card | undefined;
	let distance = 100;
	for (const enemy of enemies) {
		const d = Math.abs(enemy.position.x - turtle.position.x);
		if (d < distance) {
			distance = d;
			closestCard = enemy;
		}
	}
	return closestCard;
};

export const findAttachedHostCard = (turtleId: string): Card | null => {
	const slotOffset = turtleId === cardState.slots[0] ? 0 : 3;
	const attachedRuneCards = [
		cardState.cards.find((card) => card.id === cardState.slots[1 + slotOffset]),
		cardState.cards.find((card) => card.id === cardState.slots[2 + slotOffset])
	];
	let hostCard = null;
	attachedRuneCards.forEach((card) => {
		if (card && card.typeId === 14) {
			hostCard = card;
		}
	});
	return hostCard;
};
