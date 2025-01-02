import { timeline } from './helpers/animation';
import type { Card, GameState } from './types';

export const gameState = $state<GameState>({
	state: 'mainMenu',
	locked: false,
	actionsRemaining: 2,
	hoverPosition: { x: 0, y: 0 },
	damage: { x: 0, y: 0, text: '', key: '' },
	portalSize: 0
});

class CardState {
	selectedCardId = '';
	hoverCard = $state<Card | null>(null);
	damagedCard = $state<Card | null>(null);
	slots: string[] = ['', '', '', '', '', ''];
	cards: Card[] = [];
	addCard = (args: Partial<Card>) => {
		const newId = Math.random().toString(16).slice(2);
		const defaults: Card = {
			id: newId,
			health: 0,
			startingHealth: 0,
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
		this.cards = [...this.cards, newCard];
		return newId;
	};
}

export const cardState = new CardState();

export const mainTimeline = timeline();
