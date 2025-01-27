import { cardState, gameState, timeline, sfxPlayer } from '$lib/state.svelte';
import { findClosestEnemy } from './gameUtils';
import { addCard, updateCard } from '$lib/components/cards/cardActions';
import { createAscendingDescendingArray, randomNumber } from '$lib/helpers/utils';
import { data } from '$lib/data';
import type { Card } from '$lib/types';

export const startGame = (phase = 1) => {
	gameState.menuState = 'none';
	cardState.damage.text = '';
	gameState.actionsRemaining = 2;
	cardState.slots = ['', '', '', '', '', ''];
	if (phase === 1) {
		const playerId = addCard({
			typeId: 1,
			health: data.cardTypes['1'].health,
			startingHealth: data.cardTypes['1'].health,
			strength: data.cardTypes['1'].strength,
			position: { x: 0, y: 2, z: 5 }
		});
		timeline.addKeyframe(1, () => {
			timeline.addDelay(3);
			updateCard(playerId, { moveTo: { x: 0, y: 0, z: -0.5 }, stiffness: 0.15, settled: false });
			gameState.portalSize = 0.93;
		});
		// Starting Deck
		for (let i = 0; i < 3; i++) {
			addCard({
				typeId: 11,
				group: 'deck',
				position: { x: -6, y: 0, z: 3.7 }
			});
		}
		for (let i = 0; i < 2; i++) {
			addCard({
				typeId: 12,
				group: 'deck',
				position: { x: -6, y: 0, z: 3.7 },
				health: 1,
				startingHealth: 1
			});
		}
		addCard({
			typeId: 12,
			group: 'deck',
			position: { x: -6, y: 0, z: 3.7 },
			health: 2,
			startingHealth: 2
		});
	}
	const enemyCount = data.phases[phase.toString()].enemies.length;
	let i = 0;
	for (const enemy of data.phases[phase.toString()].enemies) {
		const x = enemyCount === 1 ? 0 : i === 0 ? -0.7 : 0.7;
		i++;
		const enemyId = addCard({
			typeId: enemy.type,
			health: data.cardTypes[enemy.type.toString()].health,
			startingHealth: data.cardTypes[enemy.type.toString()].health,
			strength: data.cardTypes[enemy.type.toString()].strength,
			position: { x: 0, y: 2, z: -4 }
		});
		timeline.addKeyframe(1, () => {
			updateCard(enemyId, { moveTo: { x: x, y: 0, z: -3.2 }, stiffness: 0.2, settled: false });
		});
	}
	timeline.addKeyframe(2, () => {
		gameState.state = 'dealing';
		dealHand();
	});
	timeline.addKeyframe(3, () => {
		gameState.state = 'playerTurn';
		gameState.locked = false;
	});
};

const endGame = (victory: boolean) => {
	gameState.state = 'menu';
	if (victory) {
		if (gameState.phase === 4) {
			gameState.phase = 5;
			showGameOverMenu();
			return;
		}
		timeline.addKeyframe(1, () => {
			if (cardState.slots[0] !== '') {
				discardTurtleCard(cardState.slots[0]);
			}
			if (cardState.slots[3] !== '') {
				discardTurtleCard(cardState.slots[3]);
			}
			discardHand();
			gameState.menuState = 'nextPhaseMenu';
		});
		timeline.addKeyframe(3, () => {
			data.phases[gameState.phase.toString()].reward.forEach((card) => {
				addCard({
					typeId: card.type,
					group: 'deck',
					position: { x: -6, y: 0, z: 3.7 },
					strength: data.cardTypes[card.type].strength
				});
			});
			refillDeckFromDiscardPile();
		});
	} else {
		showGameOverMenu();
	}
};

const showGameOverMenu = () => {
	timeline.addKeyframe(1, () => {
		gameState.menuState = 'gameOverMenu';
	});
	timeline.addKeyframe(1.5, () => {
		gameState.portalSize = 0;
	});
	timeline.addKeyframe(2.5, () => {
		cardState.cards = [];
	});
};

export const endTurn = () => {
	if (gameState.state !== 'playerTurn' || gameState.menuState === 'settingsMenu') return;
	const enemies = cardState.cards.filter((card) => card.typeId >= 2 && card.typeId < 10);
	const player = cardState.cards.find((card) => card.typeId === 1);
	if (enemies.length < 1 || !player) return;
	gameState.state = 'discarding';
	discardHand();
	// enemy attacks
	for (const enemy of enemies) {
		timeline.addKeyframe(1, () => {
			const enemyAlive = cardState.cards.find((card) => card.id === enemy.id && card.health > 0);
			if (gameState.state === 'menu' || !enemyAlive) return;
			timeline.addDelay(1.3);
			gameState.state = 'enemyTurn';
			const leftTurtle = cardState.cards.find((card) => card.id === cardState.slots[0]);
			if (leftTurtle) {
				attackCard(enemy.id, leftTurtle.id);
			} else {
				attackCard(enemy.id, player.id);
			}
		});
		timeline.addKeyframe(1, () => {
			const enemyAlive = cardState.cards.find((card) => card.id === enemy.id && card.health > 0);
			if (gameState.state === 'menu' || !enemyAlive) return;
			timeline.addDelay(1.3);
			const rightTurtle = cardState.cards.find((card) => card.id === cardState.slots[3]);
			if (rightTurtle) {
				attackCard(enemy.id, rightTurtle.id);
			} else {
				attackCard(enemy.id, player.id);
			}
		});
	}
	// turtles attack
	timeline.addKeyframe(1, () => {
		const leftTurtle = cardState.cards.find((card) => card.id === cardState.slots[0]);
		if (gameState.state === 'menu' || !leftTurtle) return;
		timeline.addDelay(1.3);
		const enemy = findClosestEnemy(leftTurtle, enemies);
		if (enemy) attackCard(leftTurtle.id, enemy.id);
	});
	timeline.addKeyframe(1, () => {
		const rightTurtle = cardState.cards.find((card) => card.id === cardState.slots[3]);
		if (gameState.state === 'menu' || !rightTurtle) return;
		timeline.addDelay(1.3);
		const enemies = cardState.cards.filter((card) => card.typeId >= 2 && card.typeId < 10);
		const enemy = findClosestEnemy(rightTurtle, enemies);
		if (enemy) attackCard(rightTurtle.id, enemy.id);
	});
	// refill hand
	timeline.addKeyframe(1.5, () => {
		if (gameState.state === 'menu') return;
		gameState.state = 'dealing';
		const inspectRunes = cardState.cards.filter(
			(card) => card.typeId === 13 && card.group === 'placed'
		);
		dealHand(3 + inspectRunes.length);
		gameState.actionsRemaining = 2 + inspectRunes.length;
		gameState.actions = 2 + inspectRunes.length;
		cardState.cards.forEach((card) => {
			if (card.typeId === 10 && card.group === 'none') {
				card.health = -1;
			}
		});
	});

	timeline.addKeyframe(2.5, () => {
		if (gameState.state === 'menu') return;
		gameState.state = 'playerTurn';
		gameState.locked = false;
	});
};

export const startNextPhase = () => {
	gameState.phase++;
	startGame(gameState.phase);
};

const attackCard = (cardId: string, targetId: string) => {
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
		// state rune card
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
		let strength = card.strength;
		// effect rune card
		if (card.typeId === 10) {
			const turtleSlotNumber = cardState.slots.findIndex((s) => s === card.id);
			const runeCards = cardState.cards.filter(
				(c) =>
					c.id === cardState.slots[1 + turtleSlotNumber] ||
					c.id === cardState.slots[2 + turtleSlotNumber]
			);
			for (const r of runeCards) {
				if (r.typeId === 15) strength += 2;
			}
		}
		damageCard(strength, target);
		if (target.typeId === 1) {
			gameState.cameraPosition.x = Math.random() * 2.5 - 1.5;
			gameState.cameraPosition.y = 8;
			timeline.addKeyframe(0.1, () => {
				gameState.cameraPosition.x = 0;
				gameState.cameraPosition.y = 9.3;
			});
		}
		if (target.health <= card.strength && target.typeId === 10) {
			timeline.addKeyframe(0.5, () => {
				// kill turtle
				const hostCard = discardTurtleCard(target.id);
				if (hostCard) {
					const enemies = cardState.cards.filter((card) => card.typeId >= 2 && card.typeId < 10);
					const enemy = findClosestEnemy(target, enemies);
					if (enemy) damageCard(data.cardTypes['14'].strength, enemy);
					if (enemy && enemy.health <= data.cardTypes['14'].strength) {
						timeline.addKeyframe(0.5, () => {
							timeline.addDelay(0.5);
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
				//updateCard(target.id, { health: -1 });
				endGame(false);
			});
		}
		if (target.health <= strength && target.typeId >= 2 && target.typeId < 10) {
			timeline.addKeyframe(1, () => {
				// kill enemy
				killEnemy(target);
			});
		}
	});
};

const killEnemy = (enemy: Card) => {
	updateCard(enemy.id, {
		moveTo: { x: randomNumber(-6, 6), y: 1, z: -6 },
		rotateTo: { x: -1, y: 0, z: -3 },
		settled: false,
		stiffness: 0.08
	});
	timeline.addKeyframe(0.5, () => {
		updateCard(enemy.id, { health: -1 });
	});
	const enemies = cardState.cards.filter(
		(card) => card.typeId >= 2 && card.typeId < 10 && card.health >= 1
	);
	if (enemies.length < 1) endGame(true);
};

const useAction = () => {
	gameState.actionsRemaining--;
	if (gameState.actionsRemaining == 0) {
		endTurn();
	} else {
		gameState.locked = false;
		// TODO: check if mouse is hovered over a card
	}
};

const dealHand = (count = 3) => {
	const turtles: boolean[] = [];
	let addedTurtle = false;
	for (let i = 0; i < count; i++) {
		const addTurtle = randomNumber(0, 2) > 1 ? true : false;
		turtles.push(addTurtle);
		if (addTurtle) addedTurtle = true;
	}
	// if there are no turtles placed deal at least one turtle
	if (!addedTurtle && cardState.slots[0] === '' && cardState.slots[3] === '') {
		turtles[2] = true;
	}
	for (let i = 0; i < count; i++) {
		timeline.addKeyframe(0 + i * 0.3, () => dealCard(turtles[i]));
	}
};

const dealCard = (dealTurtle: boolean) => {
	const deckCount = cardState.cards.filter((c) => c.group === 'deck').length;
	if (deckCount < 1) {
		refillDeckFromDiscardPile();
	}
	const handLength = cardState.cards.filter((card) => {
		return card.group === 'hand';
	}).length;

	if (dealTurtle) {
		addCard({
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
	sfxPlayer.play('deal', { randomPitch: true });
	positionHand();
};

const refillDeckFromDiscardPile = () => {
	cardState.cards.forEach((card) => {
		if (card.group !== 'discard') return;
		card.position = { x: -6, y: 0, z: 3.7 };
		card.moveTo = { x: -6, y: 0, z: 3.7 };
		card.group = 'deck';
		if (card.typeId === 12) {
			card.health = card.startingHealth;
		}
	});
};

const discardHand = () => {
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
	sfxPlayer.play('discard');
};

const discardTurtleCard = (turtleId: string) => {
	const slotOffset = turtleId === cardState.slots[0] ? 0 : 3;
	updateCard(turtleId, {
		moveTo: { x: turtleId === cardState.slots[0] ? -7 : 7, y: 5, z: -2 },
		settled: false,
		rotateTo: { x: -1.57, y: 0, z: 4 },
		stiffness: 0.08
	});
	const attachedRuneCards = [
		cardState.cards.find((card) => card.id === cardState.slots[1 + slotOffset]),
		cardState.cards.find((card) => card.id === cardState.slots[2 + slotOffset])
	];
	if (attachedRuneCards[0]) {
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
	if (attachedRuneCards[1]) {
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

	let hostCardWasAttached = false;
	attachedRuneCards.forEach((card) => {
		if (card && card.typeId === 14) {
			hostCardWasAttached = true;
		}
	});
	return hostCardWasAttached;
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
				if (target.health <= 1 && target.typeId >= 2 && target.typeId <= 9) {
					timeline.addKeyframe(1, () => {
						// kill enemy
						killEnemy(target);
					});
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
			if (target.health >= 12) return;
			updateCard(target.id, { health: target.health + 1 });
			cardState.damagedCard = target;
			cardState.damage.text = '+1';
			sfxPlayer.play('potion');
		});
	}
	timeline.addKeyframe(0.5, () => useAction());
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
	timeline.addKeyframe(0.5, () => {
		useAction();
		const card = cardState.cards.find((card) => card.id === cardId);
		if (card && (card.typeId === 13 || card.typeId === 15)) {
			const turtleId = cardState.slots[on === 'left' ? 0 : 3];
			const turtle = cardState.cards.find((card) => card.id === turtleId);
			if (!turtle) return;
			updateCard(turtle.id, { health: turtle.health + 1 });
			cardState.damagedCard = turtle;
			cardState.damage.text = '+1';
		}
	});
};

const damageCard = (strength: number, target: Card) => {
	let damagedHealth = target.health - strength;
	if (damagedHealth < 0) damagedHealth = 0;
	updateCard(target.id, { health: damagedHealth, redAmount: target.typeId <= 10 ? 1 : 0 });
	cardState.damagedCard = target;
	cardState.damage.text = '-' + strength;
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
