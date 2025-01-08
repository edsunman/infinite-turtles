type Data = {
	phases: {
		[key: string]: { enemies: { type: number }[] };
	};
	cardTypes: {
		[key: string]: { name: string; description: string; health: number; strength: number };
	};
};

export const data: Data = {
	phases: {
		'1': { enemies: [{ type: 2 }] },
		'2': {
			enemies: [{ type: 2 }, { type: 3 }]
		}
	},
	cardTypes: {
		'1': {
			name: 'you',
			description: '',
			health: 10,
			strength: 1
		},
		'2': {
			name: 'enemy',
			description: '',
			health: 8,
			strength: 1
		},
		'3': {
			name: 'enemy type 2',
			description: '',
			health: 2,
			strength: 1
		},
		'10': {
			name: 'turtle',
			description: '',
			health: 1,
			strength: 1
		},
		'11': {
			name: 'potion',
			description: 'drink for <span style="color:var(--purple);font-size:33px">+1</span> health',
			health: 0,
			strength: 0
		},
		'12': {
			name: 'state rune',
			description: 'absorbs <span style="font-size:33px">+2</span> health',
			health: 0,
			strength: 0
		},
		'13': {
			name: 'inspect rune',
			description: 'receive an extra card and action while placed',
			health: 0,
			strength: 0
		},
		'14': {
			name: 'host rune',
			description:
				'<span style="color:var(--purple);font-size:33px">-3</span> damage to nearest enemy when turtle dies',
			health: 0,
			strength: 3
		},
		'15': {
			name: 'effect rune',
			description:
				'gives turtle <span style="color:var(--green);font-size:33px">+2</span> strength',
			health: 0,
			strength: 0
		}
	}
};
