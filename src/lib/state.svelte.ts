import type { Card } from './types';

const createCardState = () => {
	let cards = $state.raw<Card[]>([
		{
			id: 1,
			moveTo: { x: -2, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
			moveVelocity: { x: 0, y: 0, z: 0 },
			positionSettled: true,
			rotateTo: { x: -2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			rotateVelocity: { x: 0, y: 0, z: 0 },
			rotationSettled: true
		},
		{
			id: 2,
			moveTo: { x: 2, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
			moveVelocity: { x: 0, y: 0, z: 0 },
			positionSettled: true,
			rotateTo: { x: -2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			rotateVelocity: { x: 0, y: 0, z: 0 },
			rotationSettled: true
		},
		{
			id: 3,
			moveTo: { x: 4, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
			moveVelocity: { x: 0, y: 0, z: 0 },
			positionSettled: true,
			rotateTo: { x: -2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			rotateVelocity: { x: 0, y: 0, z: 0 },
			rotationSettled: true
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
		addCard
	};
};

export const cardState = createCardState();
