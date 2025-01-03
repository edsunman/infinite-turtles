export type XYZ = { x: number; y: number; z: number };

export type GameState = {
	state: 'menu' | 'playerTurn' | 'enemyTurn' | 'dealing' | 'discarding';
	menuState: 'none' | 'mainMenu';
	locked: boolean;
	actionsRemaining: number;
	hoverPosition: { x: number; y: number };
	damage: { x: number; y: number; text: string; key: string };
	portalSize: number;
};

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
	redAmount: number;
	order: number;
};
