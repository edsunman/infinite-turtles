import type { Card } from './types';

export const gameState = $state({
	dev: false
});

const createCardState = () => {
	let selectedCardId = $state(0);
	let cards = $state.raw<Card[]>([
		{
			id: 1,
			health: 2,
			moveTo: { x: -2, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
			moveVelocity: { x: 0, y: 0, z: 0 },
			rotateTo: { x: -2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			rotateVelocity: { x: 0, y: 0, z: 0 },
			settled: true,
			inHand: false
		},
		{
			id: 2,
			health: 3,
			moveTo: { x: 2, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
			moveVelocity: { x: 0, y: 0, z: 0 },
			rotateTo: { x: -2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			rotateVelocity: { x: 0, y: 0, z: 0 },
			settled: true,
			inHand: false
		},
		{
			id: 3,
			health: 8,
			moveTo: { x: 4, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
			moveVelocity: { x: 0, y: 0, z: 0 },
			rotateTo: { x: -2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			rotateVelocity: { x: 0, y: 0, z: 0 },
			settled: true,
			inHand: false
		}
	]);

	const addCard = () => {
		//const newCard: Card = { id: 0, position: { x: 3, y: 0, z: 0 } };
		//cards = [...cards, newCard];
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
		addCard
	};
};

export const cardState = createCardState();
