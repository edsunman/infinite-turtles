export type XYZ = { x: number; y: number; z: number };

export type CardGroup = 'none' | 'deck' | 'hand' | 'discard' | 'placed';

export type Card = {
	id: string;
	typeId: number;
	position: XYZ;
	moveTo: XYZ;
	moveVelocity: XYZ;
	rotation: XYZ;
	rotateTo: XYZ;
	rotateVelocity: XYZ;
	settled: boolean;
	stiffness: number;
	group: CardGroup;
	health: number;
	startingHealth: number;
	order: number;
};
