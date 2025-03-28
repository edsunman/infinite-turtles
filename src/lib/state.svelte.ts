import { Timeline } from './helpers/animation';
import { AudioPlayer } from './helpers/audio';
import { ParticleManager } from './helpers/particles';
import type { Card, GameState } from './types';

export const gameState = $state<GameState>({
	state: 'menu',
	menuState: 'none',
	locked: false,
	paused: false,
	actionsRemaining: 2,
	hoverPosition: { x: 0, y: 0 },
	portalSize: 0,
	phase: 1,
	actions: 2,
	loaded: false,
	cameraPosition: { x: 0, y: 9.3 },
	volume: 0,
	mobile: false
});

export const cursorState = { x: 0, y: 0 };

class CardState {
	selectedCard = $state<Card | null>(null);
	hoverCard = $state<Card | null>(null);
	damagedCard = $state<Card | null>(null);
	damage = $state({ x: 0, y: 0, text: '' });
	tappedCardId = $state('');
	slots: [string, string, string, string, string, string] = ['', '', '', '', '', ''];
	cards: Card[] = [];
}

export const cardState = new CardState();

export const timeline = new Timeline();
export const sfxPlayer = new AudioPlayer();
export const particles = new ParticleManager();
