type Data = {
	cardTypes: { [key: string]: { name: string; health: number; strength: number } };
};

export const data: Data = {
	cardTypes: {
		'1': {
			name: 'player',
			health: 5,
			strength: 1
		},
		'2': {
			name: 'enemy',
			health: 10,
			strength: 1
		},
		'10': {
			name: 'turtle',
			health: 1,
			strength: 1
		},
		'11': {
			name: 'potion',
			health: 0,
			strength: 0
		},
		'12': {
			name: 'state Rune',
			health: 0,
			strength: 0
		}
	}
};
