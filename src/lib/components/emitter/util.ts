import { Vector3, Matrix4 } from 'three';

/**
 * Convenience wrapper around Math.random().
 * @param {number} min - The minimum amount.
 * @param {number} max - The maximum amount.
 */
export function randomNumber(min = 0, max = 1) {
	return Math.random() * (max - min) + min;
}

export const applyRandomAmount = (startingAmount: number, randomAmount: number) => {
	if (randomAmount === 0) return startingAmount;
	return randomNumber(startingAmount - randomAmount / 2, startingAmount + randomAmount / 2);
};

const parseGradientString = (gradientString: string) => {
	// todo : correctly order array
	const object: { stops: number[]; values: number[] } = {
		stops: [],
		values: []
	};
	// strip whitespace
	gradientString = gradientString.replaceAll(' ', '');
	// identify stops as being between a ) and %

	const stops = gradientString.match(/[^)]+(?=%)/g);
	if (!stops) return;
	// identify values as being between a ( and ) eg '0,255,0,1'
	const values = gradientString.match(/[^(]+(?=\))/g);
	if (!values || stops.length !== values.length) return;
	const rgba = gradientString.includes('rgba');
	let lastStop, lastValue;
	for (let i = 0; i < 4; i++) {
		if (values[i]) {
			const split = values[i].split(',');
			if (rgba) {
				// color gradient
				if (split.length !== 4) return;
				lastValue = [
					parseInt(split[0]) / 255,
					parseInt(split[1]) / 255,
					parseInt(split[2]) / 255,
					parseInt(split[3])
				];
			} else {
				// size gradient
				if (split.length !== 1) return;
				lastValue = parseInt(split[0]);
			}
			object.values = object.values.concat(lastValue);
			lastStop = parseInt(stops[i]) / 100;
			object.stops.push(lastStop);
		} else {
			if (!lastStop || !lastValue) return;
			object.stops.push(lastStop);
			object.values = object.values.concat(lastValue);
		}
	}
	return object;
};

export const createGradientObject = (gradientString: string | number, valueCount: number) => {
	if (typeof gradientString === 'number') {
		// size is just a number not gradient string
		return {
			stops: new Array(4).fill(1),
			values: new Array(valueCount).fill(gradientString)
		};
	}
	const gradientObject = parseGradientString(gradientString);
	if (gradientObject) {
		return gradientObject;
	} else {
		// string incorrectly formatted so just show white
		return {
			stops: new Array(4).fill(1),
			values: new Array(valueCount).fill(1)
		};
	}
};

const dummyMatrix = new Matrix4();
const upVector = new Vector3(0, 1, 0);
const vector = new Vector3();
export const setRandomDirectionSpread = (direction: Vector3, angleDegrees: number) => {
	const π = Math.PI;
	const π2 = 2 * π;
	const coneAngle = (angleDegrees * Math.PI) / 180;
	const z = Math.random() * (1 - Math.cos(coneAngle)) + Math.cos(coneAngle);
	const θ = Math.random() * π2;
	const r = Math.sqrt(1 - z * z);
	const x = r * Math.cos(θ);
	const y = r * Math.sin(θ);
	const m = dummyMatrix.lookAt(direction, vector, upVector);
	direction.set(x, y, z).applyMatrix4(m);
};

export const randomPointInsideCube = (
	position: [number, number, number],
	scale: [number, number, number]
) => {
	return {
		x: position[0] + scale[0] * (Math.random() * 1 - 0.5),
		y: position[1] + scale[1] * (Math.random() * 1 - 0.5),
		z: position[2] + scale[2] * (Math.random() * 1 - 0.5)
	};
};
