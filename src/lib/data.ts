type Data = {
	cardTypes: { [key: string]: { name: string; health: number } };
};

export const data: Data = {
	cardTypes: {
		'1': {
			name: 'Player',
			health: 5
		},
		'2': {
			name: 'Enemy',
			health: 10
		},
		'10': {
			name: 'Turtle',
			health: 1
		},
		'11': {
			name: 'Potion',
			health: 0
		},
		'12': {
			name: 'State Rune',
			health: 0
		}
	}
};
