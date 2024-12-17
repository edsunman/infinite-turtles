import { cardState, gameState, mainTimeline } from '$lib/state.svelte';
import { discardHand, updateCard, discardTurtle, dealHand } from './components/cards/cardActions';

export const endTurn = () => {
	if (gameState.state !== 'playerTurn') return;
	let delay = 0;
	const enemy = cardState.cards.find((card) => card.typeId === 2);
	const leftTurtle = cardState.cards.find((card) => card.id === cardState.slots[0]);
	const rightTurtle = cardState.cards.find((card) => card.id === cardState.slots[3]);
	const player = cardState.cards.find((card) => card.typeId === 1);
	if (!enemy || !player) return;

	gameState.state = 'discarding';
	discardHand();

	// enemy attacks
	mainTimeline.addKeyframe(1, () => {
		gameState.state = 'enemyTurn';
		if (leftTurtle) {
			attack(enemy.id, leftTurtle.id);
			mainTimeline.addKeyframe(0.5, () => {
				if (leftTurtle.health <= 1) {
					// kill turtle
					discardTurtle('left');
				}
			});
		} else {
			attack(enemy.id, player.id);
		}
		mainTimeline.addKeyframe(1, () => {
			if (rightTurtle) {
				attack(enemy.id, rightTurtle.id);
				mainTimeline.addKeyframe(0.5, () => {
					if (rightTurtle.health <= 1) {
						// kill turtle
						discardTurtle('right');
					}
				});
			} else {
				attack(enemy.id, player.id);
			}
		});
	});

	// turtles attack
	if (leftTurtle) {
		mainTimeline.addKeyframe(3, () => {
			attack(leftTurtle.id, enemy.id);
		});
		delay += 1;
	}
	if (rightTurtle) {
		mainTimeline.addKeyframe(3 + delay, () => {
			attack(rightTurtle.id, enemy.id);
		});
		delay += 1;
	}

	mainTimeline.addKeyframe(3 + delay, () => {
		gameState.state = 'dealing';
		dealHand();
		cardState.cards.forEach((card) => {
			if (card.typeId === 10 && card.group === 'none') {
				card.health = -1;
			}
		});
	});
	mainTimeline.addKeyframe(4 + delay, () => {
		gameState.state = 'playerTurn';
		gameState.actionsRemaining = 2;
		gameState.locked = false;
	});
};

const attack = (cardId: string, targetId: string) => {
	const card = cardState.cards.find((c) => c.id === cardId);
	const target = cardState.cards.find((c) => c.id === targetId);
	if (!card || !target) return;
	updateCard(cardId, {
		moveTo: { x: target.position.x, y: 0.5, z: target.position.z },
		settled: false,
		stiffness: 0.15
	});
	mainTimeline.addKeyframe(0.08, () => {
		updateCard(cardId, { moveTo: card.position, settled: false, stiffness: 0.15 });
		updateCard(targetId, { health: target.health - 1 });
	});
};

export const setupInitialCards = () => {
	// Player
	cardState.addCard({
		typeId: 1,
		health: 10,
		position: { x: 0, y: 0, z: -0.5 }
	});
	// Enemy
	cardState.addCard({
		typeId: 2,
		health: 10,
		position: { x: 0, y: 0, z: -3.2 }
	});
	// Starting Deck
	for (let i = 0; i < 6; i++) {
		const j = Math.floor(i / 3);
		cardState.addCard({
			typeId: 11 + j,
			group: 'deck',
			position: { x: -6, y: 0, z: 3.7 }
		});
	}
	dealHand();
	mainTimeline.addKeyframe(1, () => {
		gameState.state = 'playerTurn';
	});
};
