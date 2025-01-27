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
