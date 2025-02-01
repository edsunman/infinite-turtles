export type XYZ = { x: number; y: number; z: number };

export type GameState = {
	state: 'menu' | 'playerTurn' | 'enemyTurn' | 'dealing' | 'discarding';
	menuState: 'none' | 'mainMenu' | 'settingsMenu' | 'nextPhaseMenu' | 'gameOverMenu' | 'rules';
	locked: boolean;
	paused: boolean;
	actionsRemaining: number;
	hoverPosition: { x: number; y: number };
	phase: number;
	portalSize: number;
	actions: number;
	loaded: boolean;
	cameraPosition: { x: number; y: number };
	volume: number;
};

export type CardGroup = 'none' | 'deck' | 'hand' | 'discard' | 'placed' | 'onShow';

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
	strength: number;
	redAmount: number;
	order: number;
};
