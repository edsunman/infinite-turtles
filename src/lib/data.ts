type Data = {
	cardTypes: { [key: string]: { name: string; health: number; strength: number } };
};

export const data: Data = {
	cardTypes: {
		'1': {
			name: 'Player',
			health: 5,
			strength: 1
		},
		'2': {
			name: 'Enemy',
			health: 10,
			strength: 1
		},
		'10': {
			name: 'Turtle',
			health: 1,
			strength: 1
		},
		'11': {
			name: 'Potion',
			health: 0,
			strength: 0
		},
		'12': {
			name: 'State Rune',
			health: 0,
			strength: 0
		}
	}
};
