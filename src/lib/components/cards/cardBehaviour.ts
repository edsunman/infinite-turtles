import type { Card } from '$lib/types';

export const movingBehaviour = (card: Card, delta: number) => {
	if (!card.settled) card = springCard(card, delta);
	return card;
};

const springTick = (
	currentValue: number,
	endValue: number,
	velocity: number,
	stiffness: number,
	delta: number
) => {
	//const stiffness = 0.3;
	const damping = 1;
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

const springCard = (card: Card, delta: number) => {
	card.settled = true;
	const {
		cv: cvx,
		s: sx,
		v: vx
	} = springTick(card.position.x, card.moveTo.x, card.moveVelocity.x, card.stiffness, delta);
	if (!sx) card.settled = false;
	const {
		cv: cvy,
		s: sy,
		v: vy
	} = springTick(card.position.y, card.moveTo.y, card.moveVelocity.y, card.stiffness, delta);
	if (!sy) card.settled = false;
	const {
		cv: cvz,
		s: sz,
		v: vz
	} = springTick(card.position.z, card.moveTo.z, card.moveVelocity.z, card.stiffness, delta);
	if (!sz) card.settled = false;
	const {
		cv: cvxr,
		s: sxr,
		v: vxr
	} = springTick(card.rotation.x, card.rotateTo.x, card.rotateVelocity.x, card.stiffness, delta);
	if (!sxr) card.settled = false;
	const {
		cv: cvyr,
		s: syr,
		v: vyr
	} = springTick(card.rotation.y, card.rotateTo.y, card.rotateVelocity.y, card.stiffness, delta);
	if (!syr) card.settled = false;
	const {
		cv: cvzr,
		s: szr,
		v: vzr
	} = springTick(card.rotation.z, card.rotateTo.z, card.rotateVelocity.z, card.stiffness, delta);
	if (!szr) card.settled = false;
	card.position = { x: cvx, y: cvy, z: cvz };
	card.moveVelocity = { x: vx, y: vy, z: vz };
	card.rotation = { x: cvxr, y: cvyr, z: cvzr };
	card.rotateVelocity = { x: vxr, y: vyr, z: vzr };
	return card;
};
