type Data = {
	phases: {
		[key: string]: { enemies: { type: number }[]; reward: { type: number }[] };
	};
	cardTypes: {
		[key: string]: {
			name: string;
			description: string;
			detail: string;
			health: number;
			strength: number;
		};
	};
};

export const data: Data = {
	phases: {
		'1': { enemies: [{ type: 3 }], reward: [{ type: 13 }] },
		'2': { enemies: [{ type: 4 }], reward: [{ type: 14 }] },
		'3': {
			enemies: [{ type: 2 }, { type: 4 }],
			reward: [{ type: 15 }]
		},
		'4': {
			enemies: [{ type: 5 }],
			reward: [{ type: 0 }]
		}
	},
	cardTypes: {
		'1': {
			name: 'you',
			description: 'max health:  <span style="font-size:30px">12</span>',
			detail: '',
			health: 10,
			strength: 1
		},
		'2': {
			name: 'blob',
			description: '',
			detail: '',
			health: 3,
			strength: 1
		},
		'3': {
			name: 'baby blob',
			description: '',
			detail: '',
			health: 1,
			strength: 1
		},
		'4': {
			name: 'spiky',
			description: '',
			health: 10,
			detail: '',
			strength: 1
		},
		'5': {
			name: 'skull',
			description: '',
			detail: '',
			health: 6,
			strength: 2
		},
		'10': {
			name: 'turtle',
			description: '',
			detail: '',
			health: 1,
			strength: 1
		},
		'11': {
			name: 'potion',
			description: 'drink for <span style="color:#4dddff;font-size:30px">+1</span> health',
			detail: '',
			health: 0,
			strength: 0
		},
		'12': {
			name: 'state rune',
			description: 'shelids turtle from attack',
			detail: '',
			health: 0,
			strength: 0
		},
		'13': {
			name: 'inspect rune',
			description:
				'receive an extra card and action <br/> <br/>turtle gets <span style="color:var(--green);font-size:30px">+1</span> health',
			detail:
				'If this rune card is placed on a turtle when the round ends you will draw an extra card and gain an extra action for the following turn.',
			health: 0,
			strength: 0
		},
		'14': {
			name: 'host rune',
			description:
				'<span style="color:var(--red);font-size:30px">-3</span> damage to nearest enemy when turtle dies',
			detail:
				'Engages a psychic bond between the turtle and an enemy. When the turtle dies -3 damage is done to the enemy.',
			health: 0,
			strength: 3
		},
		'15': {
			name: 'effect rune',
			description:
				'gives turtle <span style="color:var(--purple);font-size:30px">+2</span> strength<br />turtle gets <span style="color:var(--green);font-size:30px">+1</span> health',
			detail:
				'This rune card will increase the turtles strength by 2.<br /><br />When you place this rune your turtle will instanly gain +1 health.',
			health: 0,
			strength: 0
		}
	}
};
