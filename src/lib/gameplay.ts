import { cardState, gameState, timeline } from '$lib/state.svelte';
import {
	discardHand,
	updateCard,
	discardTurtleCard,
	dealHand,
	damageCard,
	refillDeckFromDiscardPile
} from './components/cards/cardActions';
import { data } from './data';
import type { Card } from './types';

// @ts-expect-error: lol
window.hello = () => {
	timeline.addKeyframe(0, () => {
		timeline.addDelay(2);
		console.log('no delay');
		timeline.addKeyframe(1, () => {
			console.log('no delay 2');
		});
	});
	timeline.addKeyframe(0, () => {
		console.log('no delay 3');
	});
};

export const startGame = (phase = 1) => {
	gameState.menuState = 'none';
	cardState.damage.text = '';
	gameState.actionsRemaining = 2;
	cardState.slots = ['', '', '', '', '', ''];

	if (phase === 1) {
		const playerId = cardState.addCard({
			typeId: 1,
			health: data.cardTypes['1'].health,
			startingHealth: data.cardTypes['1'].health,
			strength: data.cardTypes['1'].strength,
			position: { x: 0, y: 2, z: 5 }
		});
		timeline.addKeyframe(1, () => {
			updateCard(playerId, { moveTo: { x: 0, y: 0, z: -0.5 }, stiffness: 0.15, settled: false });
			gameState.portalSize = 0.93;
		});
		// Starting Deck
		for (let i = 0; i < 3; i++) {
			cardState.addCard({
				typeId: 11,
				group: 'deck',
				position: { x: -6, y: 0, z: 3.7 }
			});
		}
		for (let i = 0; i < 3; i++) {
			cardState.addCard({
				typeId: 13,
				group: 'deck',
				position: { x: -6, y: 0, z: 3.7 },
				health: 2,
				startingHealth: 2
			});
		}
	}

	const delay = phase === 1 ? 3 : 0;
	const enemyCount = data.phases[phase.toString()].enemies.length;
	let i = 0;
	for (const enemy of data.phases[phase.toString()].enemies) {
		const x = enemyCount === 1 ? 0 : i === 0 ? -0.7 : 0.7;
		i++;
		const enemyId = cardState.addCard({
			typeId: enemy.type,
			health: data.cardTypes[enemy.type.toString()].health,
			startingHealth: data.cardTypes[enemy.type.toString()].health,
			strength: data.cardTypes[enemy.type.toString()].strength,
			position: { x: 0, y: 2, z: -4 }
		});
		timeline.addKeyframe(1 + delay, () => {
			updateCard(enemyId, { moveTo: { x: x, y: 0, z: -3.2 }, stiffness: 0.2, settled: false });
		});
	}

	timeline.addKeyframe(2 + delay, () => {
		gameState.state = 'dealing';
		dealHand();
	});

	timeline.addKeyframe(3 + delay, () => {
		gameState.state = 'playerTurn';
		gameState.locked = false;
	});
};

export const endGame = (victory: boolean) => {
	gameState.state = 'menu';
	if (victory) {
		timeline.addKeyframe(1, () => {
			if (cardState.slots[0] !== '') {
				discardTurtleCard(cardState.slots[0]);
			}
			if (cardState.slots[3] !== '') {
				discardTurtleCard(cardState.slots[3]);
			}
			discardHand();
			gameState.menuState = 'newCardMenu';
		});
		timeline.addKeyframe(3, () => {
			refillDeckFromDiscardPile();
		});
	} else {
		timeline.addKeyframe(1, () => {
			gameState.menuState = 'gameOverMenu';
		});
		timeline.addKeyframe(3, () => {
			gameState.portalSize = 0;
			cardState.cards = [];
		});
	}
};

export const endTurn = () => {
	if (gameState.state !== 'playerTurn' || gameState.menuState === 'settingsMenu') return;
	let delay = 0;
	const enemies = cardState.cards.filter((card) => card.typeId >= 2 && card.typeId < 10);
	const leftTurtle = cardState.cards.find((card) => card.id === cardState.slots[0]);
	const rightTurtle = cardState.cards.find((card) => card.id === cardState.slots[3]);
	const player = cardState.cards.find((card) => card.typeId === 1);
	if (enemies.length < 1 || !player) return;

	gameState.state = 'discarding';
	discardHand();

	// enemy attacks
	for (const enemy of enemies) {
		timeline.addKeyframe(1 + delay, () => {
			gameState.state = 'enemyTurn';
			if (leftTurtle && cardState.cards.find((card) => card.id === cardState.slots[0])) {
				attack(enemy.id, leftTurtle.id);
			} else {
				attack(enemy.id, player.id);
			}
			timeline.addKeyframe(1.3, () => {
				if (gameState.state === 'menu') return;
				if (rightTurtle && cardState.cards.find((card) => card.id === cardState.slots[3])) {
					attack(enemy.id, rightTurtle.id);
				} else {
					attack(enemy.id, player.id);
				}
			});
		});
		delay += 2.55;
	}

	// turtles attack
	if (leftTurtle && !willTurtleDie(leftTurtle.id)) {
		timeline.addKeyframe(1 + delay, () => {
			if (gameState.state === 'menu') return;
			findClosestEnemy(leftTurtle, enemies);
			const enemy = findClosestEnemy(leftTurtle, enemies);
			if (enemy) attack(leftTurtle.id, enemy.id);
		});
		delay += 1;
	}

	if (rightTurtle && !willTurtleDie(rightTurtle.id)) {
		timeline.addKeyframe(1 + delay, () => {
			if (gameState.state === 'menu') return;
			findClosestEnemy(rightTurtle, enemies);
			const enemy = findClosestEnemy(rightTurtle, enemies);
			if (enemy) attack(rightTurtle.id, enemy.id);
		});
		delay += 1;
	}

	timeline.addKeyframe(1.5 + delay, () => {
		if (gameState.state === 'menu') return;
		gameState.state = 'dealing';
		const inspectRune = cardState.cards.find((card) => {
			return card.typeId === 13 && card.group === 'placed';
		});
		dealHand(inspectRune ? 4 : 3);
		cardState.cards.forEach((card) => {
			if (card.typeId === 10 && card.group === 'none') {
				card.health = -1;
			}
		});
	});

	timeline.addKeyframe(2.5 + delay, () => {
		if (gameState.state === 'menu') return;
		gameState.state = 'playerTurn';
		gameState.locked = false;

		const inspectRune = cardState.cards.find((card) => {
			return card.typeId === 13 && card.group === 'placed';
		});
		gameState.actionsRemaining = inspectRune ? 3 : 2;
	});
};

const findClosestEnemy = (turtle: Card, enemies: Card[]) => {
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

export const nextPhase = () => {
	startGame(2);
};

const attack = (cardId: string, targetId: string) => {
	const card = cardState.cards.find((c) => c.id === cardId);
	const target = cardState.cards.find((c) => c.id === targetId);
	if (!card || !target) {
		return;
	}

	updateCard(cardId, {
		moveTo: { x: target.position.x, y: 0.5, z: target.position.z },
		settled: false,
		stiffness: 0.15
	});

	timeline.addKeyframe(0.08, () => {
		updateCard(cardId, { moveTo: card.position, settled: false, stiffness: 0.15 });

		// inflict damage
		if (target.typeId === 10) {
			const targetSlotNumber = cardState.slots.findIndex((s) => s === target.id);
			const runeCards = cardState.cards.filter(
				(c) =>
					c.id === cardState.slots[1 + targetSlotNumber] ||
					c.id === cardState.slots[2 + targetSlotNumber]
			);
			for (const r of runeCards) {
				// state rune absorb damage
				if (r && r.typeId === 12 && r.health > 0) {
					damageCard(card.strength, r);
					return;
				}
			}
		}
		damageCard(card.strength, target);

		if (target.health <= 1 && target.typeId === 10) {
			timeline.addKeyframe(0.5, () => {
				// kill turtle
				const hostCard = discardTurtleCard(target.id);
				if (hostCard) {
					const enemies = cardState.cards.filter((card) => card.typeId >= 2 && card.typeId < 10);
					const enemy = findClosestEnemy(target, enemies);
					if (enemy) damageCard(data.cardTypes['14'].strength, enemy);
					if (enemy && enemy.health <= data.cardTypes['14'].strength) {
						timeline.addKeyframe(0.5, () => {
							// kill enemy
							killEnemy(enemy);
						});
					}
				}
			});
		}

		if (target.health <= card.strength && target.typeId === 1) {
			timeline.addKeyframe(1, () => {
				// kill player
				updateCard(target.id, { health: -1 });
				endGame(false);
			});
		}

		if (target.health <= 1 && target.typeId >= 2 && target.typeId < 10) {
			timeline.addKeyframe(1, () => {
				// kill enemy
				killEnemy(target);
			});
		}
	});
};

const killEnemy = (enemy: Card) => {
	updateCard(enemy.id, { health: -1 });
	const enemies = cardState.cards.filter(
		(card) => card.typeId >= 2 && card.typeId < 10 && card.health >= 1
	);
	if (enemies.length < 1) endGame(true);
};

const willTurtleDie = (turtleId: string) => {
	const turtleSlotNumber = cardState.slots.findIndex((s) => s === turtleId);
	const runeCards = cardState.cards.filter(
		(c) =>
			c.id === cardState.slots[1 + turtleSlotNumber] ||
			c.id === cardState.slots[2 + turtleSlotNumber]
	);
	for (const r of runeCards) {
		if (r && r.typeId === 12 && r.health > 0) {
			return false;
		}
	}
	return true;
};

export const usedAction = () => {
	gameState.actionsRemaining--;
	if (gameState.actionsRemaining == 0) {
		endTurn();
	} else {
		gameState.locked = false;
		// TODO: check if mouse is hovered over a card
	}
};
