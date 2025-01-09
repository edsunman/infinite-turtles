type Data = {
	phases: {
		[key: string]: { enemies: { type: number }[]; reward: { type: number }[] };
	};
	cardTypes: {
		[key: string]: { name: string; description: string; health: number; strength: number };
	};
};

export const data: Data = {
	phases: {
		'1': { enemies: [{ type: 2 }], reward: [{ type: 13 }] },
		'2': { enemies: [{ type: 3 }], reward: [{ type: 14 }] },
		'3': {
			enemies: [{ type: 3 }, { type: 4 }],
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
			health: 10,
			strength: 1
		},
		'2': {
			name: 'blob',
			description: '',
			health: 2, //health: 8,
			strength: 1
		},
		'3': {
			name: 'spikey',
			description: '',
			health: 2, //health: 12,
			strength: 1
		},
		'4': {
			name: 'baby blob',
			description: '',
			health: 2,
			strength: 1
		},
		'5': {
			name: 'worm',
			description: '',
			health: 2, //health: 16,
			strength: 2
		},
		'10': {
			name: 'turtle',
			description: '',
			health: 1,
			strength: 1
		},
		'11': {
			name: 'potion',
			description: 'drink for <span style="color:#4dddff;font-size:30px">+1</span> health',
			health: 0,
			strength: 0
		},
		'12': {
			name: 'state rune',
			description:
				'shelids turtle from <span style="color:var(--green);font-size:30px">+2</span> attack',
			health: 0,
			strength: 0
		},
		'13': {
			name: 'inspect rune',
			description:
				'receive an extra card and action <br/> <br/>turtle gets <span style="color:var(--green);font-size:30px">+1</span> health',
			health: 0,
			strength: 0
		},
		'14': {
			name: 'host rune',
			description:
				'<span style="color:var(--red);font-size:30px">-3</span> damage to nearest enemy when turtle dies',
			health: 0,
			strength: 3
		},
		'15': {
			name: 'effect rune',
			description:
				'gives turtle <span style="color:var(--purple);font-size:30px">+2</span> strength<br />turtle gets <span style="color:var(--green);font-size:30px">+1</span> health',
			health: 0,
			strength: 0
		}
	}
};
