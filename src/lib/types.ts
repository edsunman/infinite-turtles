export type XYZ = { x: number; y: number; z: number };

export type Card = {
	id: number;
	position: XYZ;
	moveTo: XYZ;
	moveVelocity: XYZ;
	positionSettled: boolean;
	rotation: XYZ;
	rotateTo: XYZ;
	rotateVelocity: XYZ;
	rotationSettled: boolean;
};
