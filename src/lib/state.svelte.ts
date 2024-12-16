import { timeline } from './helpers/animation';
import type { Card } from './types';

export const gameState = $state<{
	state: 'playerTurn' | 'enemyTurn' | 'dealing' | 'discarding';
	dev: boolean;
	locked: boolean;
	actionsRemaining: number;
}>({
	state: 'dealing',
	dev: false,
	locked: false,
	actionsRemaining: 2
});

class CardState {
	selectedCardId = '';
	hoverCardId = '';
	slots: string[] = ['', '', '', '', '', ''];
	cards = $state.raw<Card[]>([]);
	count = $state({ deck: 0, discard: 0 });
	addCard = (args: Partial<Card>) => {
		const newId = Math.random().toString(16).slice(2);
		const defaults: Card = {
			id: newId,
			health: 0,
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
			order: 0
		};
		const newCard = { ...defaults, ...args };
		this.cards = [...this.cards, newCard];
		return newId;
	};
}

export const cardState = new CardState();

export const mainTimeline = timeline();
