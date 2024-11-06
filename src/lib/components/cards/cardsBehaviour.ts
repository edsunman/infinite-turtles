import type { Card } from '$lib/types';

export const movingBehaviour = (card: Card, delta: number) => {
	if (!card.rotationSettled) card = springCardRotation(card, delta);
	if (!card.positionSettled) card = springCardPosition(card, delta);
	return card;
};

const springTick = (currentValue: number, endValue: number, velocity: number, delta: number) => {
	const stiffness = 0.1;
	const damping = 0.8;
	const precision = 0.01;
	const tensionForce = -stiffness * (currentValue - endValue);
	const dampingForce = -damping * velocity;
	const acceleration = tensionForce + dampingForce;
	velocity = velocity + acceleration;
	currentValue += velocity * delta * 60;
	let settled = false;
	if (Math.abs(velocity) < precision && Math.abs(currentValue - endValue) < precision) {
		settled = true;
	}
	return { cv: currentValue, s: settled, v: velocity };
};

const springCardPosition = (card: Card, delta: number) => {
	card.positionSettled = true;
	const {
		cv: cvx,
		s: sx,
		v: vx
	} = springTick(card.position.x, card.moveTo.x, card.moveVelocity.x, delta);
	if (!sx) card.positionSettled = false;
	const {
		cv: cvy,
		s: sy,
		v: vy
	} = springTick(card.position.y, card.moveTo.y, card.moveVelocity.y, delta);
	if (!sy) card.positionSettled = false;
	const {
		cv: cvz,
		s: sz,
		v: vz
	} = springTick(card.position.z, card.moveTo.z, card.moveVelocity.z, delta);
	if (!sz) card.positionSettled = false;
	card.position = { x: cvx, y: cvy, z: cvz };
	card.moveVelocity = { x: vx, y: vy, z: vz };
	return card;
};

const springCardRotation = (card: Card, delta: number) => {
	card.rotationSettled = true;
	const {
		cv: cvx,
		s: sx,
		v: vx
	} = springTick(card.rotation.x, card.rotateTo.x, card.rotateVelocity.x, delta);
	if (!sx) card.rotationSettled = false;
	const {
		cv: cvy,
		s: sy,
		v: vy
	} = springTick(card.rotation.y, card.rotateTo.y, card.rotateVelocity.y, delta);
	if (!sy) card.rotationSettled = false;
	const {
		cv: cvz,
		s: sz,
		v: vz
	} = springTick(card.rotation.z, card.rotateTo.z, card.rotateVelocity.z, delta);
	if (!sz) card.rotationSettled = false;
	card.rotation = { x: cvx, y: cvy, z: cvz };
	card.rotateVelocity = { x: vx, y: vy, z: vz };
	return card;
};
