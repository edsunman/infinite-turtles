import { timeline } from './helpers/animation';
import type { Card } from './types';

export const gameState = $state({
	dev: false,
	locked: false
});

const createCardState = () => {
	let selectedCardId = '';
	let hoverCardId = '';
	let slots: string[] = ['', '', '', ''];
	let cards = $state.raw<Card[]>([]);

	const addCard = (args: Partial<Card>) => {
		const newId = Math.random().toString(16).slice(2);
		const defaults: Card = {
			id: newId,
			health: 0,
			moveTo: { x: 0, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
			moveVelocity: { x: 0, y: 0, z: 0 },
			rotateTo: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			rotateVelocity: { x: 0, y: 0, z: 0 },
			stiffness: 0.3,
			settled: true,
			inHand: false
		};
		const newCard = { ...defaults, ...args };
		cards = [...cards, newCard];
		return newId;
	};

	return {
		get cards() {
			return cards;
		},
		set cards(c) {
			cards = c;
		},
		get selectedCardId() {
			return selectedCardId;
		},
		set selectedCardId(id) {
			selectedCardId = id;
		},
		get hoverCardId() {
			return hoverCardId;
		},
		set hoverCardId(id) {
			hoverCardId = id;
		},
		get slots() {
			return slots;
		},
		set slots(c) {
			slots = c;
		},
		addCard
	};
};

export const cardState = createCardState();

export const mainTimeline = timeline();
