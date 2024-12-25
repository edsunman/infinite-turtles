type Data = {
	cardTypes: {
		[key: string]: { name: string; description: string; health: number; strength: number };
	};
};

export const data: Data = {
	cardTypes: {
		'1': {
			name: 'you',
			description: '',
			health: 5,
			strength: 1
		},
		'2': {
			name: 'enemy',
			description: '',
			health: 10,
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
			description: 'drink for <span style="color:var(--purple);font-size:35px">+1</span> health',
			health: 0,
			strength: 0
		},
		'12': {
			name: 'state rune',
			description: 'gives turtle <span style="color:var(--green);font-size:35px">+2</span> health',
			health: 0,
			strength: 0
		}
	}
};
