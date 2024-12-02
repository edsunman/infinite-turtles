export type XYZ = { x: number; y: number; z: number };

export type Card = {
	id: string;
	position: XYZ;
	moveTo: XYZ;
	moveVelocity: XYZ;
	rotation: XYZ;
	rotateTo: XYZ;
	rotateVelocity: XYZ;
	settled: boolean;
	inHand: boolean;
	health: number;
};
