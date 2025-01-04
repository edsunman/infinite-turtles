import { cardState, gameState, timeline } from '$lib/state.svelte';
import {
	discardHand,
	updateCard,
	discardTurtle,
	dealHand,
	refillDeckFromDiscardPile
} from './components/cards/cardActions';

export const endTurn = () => {
	if (gameState.state !== 'playerTurn' || gameState.menuState === 'settingsMenu') return;
	let delay = 0;
	const enemy = cardState.cards.find((card) => card.typeId === 2);
	const leftTurtle = cardState.cards.find((card) => card.id === cardState.slots[0]);
	const rightTurtle = cardState.cards.find((card) => card.id === cardState.slots[3]);
	const player = cardState.cards.find((card) => card.typeId === 1);
	if (!enemy || !player) return;

	gameState.state = 'discarding';
	discardHand();

	// enemy attacks
	timeline.addKeyframe(1, () => {
		gameState.state = 'enemyTurn';
		if (leftTurtle) {
			attack(enemy.id, leftTurtle.id);
		} else {
			attack(enemy.id, player.id);
		}
		timeline.addKeyframe(1, () => {
			if (rightTurtle) {
				attack(enemy.id, rightTurtle.id);
			} else {
				attack(enemy.id, player.id);
			}
		});
	});

	// turtles attack
	if (leftTurtle && !willTurtleDie(leftTurtle.id)) {
		timeline.addKeyframe(3.5, () => {
			if (gameState.state === 'menu') return;
			attack(leftTurtle.id, enemy.id);
		});
		delay += 1;
	}
	if (rightTurtle && !willTurtleDie(rightTurtle.id)) {
		timeline.addKeyframe(3.5 + delay, () => {
			if (gameState.state === 'menu') return;
			attack(rightTurtle.id, enemy.id);
		});
		delay += 1;
	}

	timeline.addKeyframe(3.5 + delay, () => {
		if (gameState.state === 'menu') return;
		gameState.state = 'dealing';
		dealHand();
		cardState.cards.forEach((card) => {
			if (card.typeId === 10 && card.group === 'none') {
				card.health = -1;
			}
		});
	});
	timeline.addKeyframe(4.5 + delay, () => {
		if (gameState.state === 'menu') return;
		gameState.state = 'playerTurn';
		gameState.actionsRemaining = 2;
		gameState.locked = false;
	});
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
					updateCard(r.id, { health: r.health - 1 });
					cardState.damagedCard = r;
					gameState.damage.text = '-1';
					return;
				}
			}
		}
		updateCard(targetId, { health: target.health - 1, redAmount: 1 });
		cardState.damagedCard = target;
		gameState.damage.text = '-1';
		if (target.health <= 1 && target.typeId === 10) {
			timeline.addKeyframe(0.5, () => {
				// kill turtle
				discardTurtle(target.id);
			});
		}
		if (target.health <= 1 && target.typeId === 1) {
			endGame(false);
		}
		if (target.health <= 1 && target.typeId === 2) {
			timeline.addKeyframe(1, () => {
				// kill enemy
				updateCard(target.id, { health: -1 });
			});
			endGame(true);
		}
	});
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

export const startGame = (phase = 1) => {
	gameState.menuState = 'none';
	// Player
	if (phase === 1) {
		const playerId = cardState.addCard({
			typeId: 1,
			health: 10,
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
				typeId: 12,
				group: 'deck',
				position: { x: -6, y: 0, z: 3.7 },
				health: 2,
				startingHealth: 2
			});
		}
		// Enemy
		const enemyId = cardState.addCard({
			typeId: 2,
			health: 1,
			position: { x: 0, y: 2, z: -4 }
		});
		timeline.addKeyframe(3.5, () => {
			updateCard(enemyId, { moveTo: { x: 0, y: 0, z: -3.2 }, stiffness: 0.2, settled: false });
		});
	}
	if (phase === 2) {
		// Enemy
		const enemyId = cardState.addCard({
			typeId: 2,
			health: 10,
			position: { x: 0, y: 2, z: -4 }
		});
		timeline.addKeyframe(1, () => {
			updateCard(enemyId, { moveTo: { x: 0, y: 0, z: -3.2 }, stiffness: 0.2, settled: false });
		});
	}
	const delay = phase === 1 ? 3 : 0;
	timeline.addKeyframe(2 + delay, () => {
		gameState.state = 'dealing';
		dealHand();
	});
	timeline.addKeyframe(3 + delay, () => {
		gameState.state = 'playerTurn';
	});
};

export const endGame = (victory: boolean) => {
	gameState.state = 'menu';
	if (victory) {
		timeline.addKeyframe(2, () => {
			if (cardState.slots[0] !== '') {
				discardTurtle(cardState.slots[0]);
			}
			if (cardState.slots[3] !== '') {
				discardTurtle(cardState.slots[3]);
			}
			discardHand();
			gameState.menuState = 'newCardMenu';
		});
		timeline.addKeyframe(4, () => {
			refillDeckFromDiscardPile();
			gameState.damage.text = '';
		});
	} else {
		console.log('loose');
	}
};

export const nextPhase = () => {
	startGame(2);
};
