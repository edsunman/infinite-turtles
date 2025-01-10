import { Timeline } from './helpers/animation';
import type { Card, GameState } from './types';

export const gameState = $state<GameState>({
	state: 'menu',
	menuState: 'mainMenu',
	locked: false,
	paused: false,
	actionsRemaining: 2,
	hoverPosition: { x: 0, y: 0 },
	portalSize: 0,
	phase: 1,
	actions: 2,
	loaded: false,
	cameraPosition: { x: 0, y: 9.3 }
});

class CardState {
	selectedCard = $state<Card | null>(null);
	hoverCard = $state<Card | null>(null);
	damagedCard = $state<Card | null>(null);
	damage = $state({ x: 0, y: 0, text: '', key: '' });
	slots: [string, string, string, string, string, string] = ['', '', '', '', '', ''];
	cards: Card[] = [];
	addCard = (args: Partial<Card>) => {
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
		this.cards = [...this.cards, newCard];
		return newId;
	};
}

export const cardState = new CardState();
export const timeline = new Timeline();
