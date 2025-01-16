/**
 * A timeline with internal clock to schedule simple animations.
 * @example
 * // create timeline
 * let timeline = new Timeline();
 *
 * // schedule a function to be run in two seconds time
 * timeline.addKeyframe(2, () => {
 * 	console.log('Hello in two seconds time');
 * });
 *
 * useTask((delta) => {
 * 	// update timeline every frame
 * 	timeline.update(delta);
 * }
 */
export class Timeline {
	#clock = 0;
	#keyframes: { offset: number; action: () => void; played: boolean }[] = [];
	addKeyframe(offset: number, action: () => void) {
		this.#keyframes.push({
			offset: (offset += this.#clock),
			action,
			played: false
		});
	}
	addDelay(amount: number) {
		this.#clock -= amount;
	}
	update(delta: number) {
		this.#clock += delta;
		if (this.#keyframes.length < 1) return;
		for (const keyframe of this.#keyframes) {
			if (this.#clock > keyframe.offset && !keyframe.played) {
				keyframe.action();
				keyframe.played = true;
			}
		}
		this.#keyframes = this.#keyframes.filter((k) => !k.played);
	}
}

/**
 * A class that can be used to call a function every given number of seconds.
 * @param interval - The interval in seconds.
 * @param action - The function
 * @example
 * const interval = new Interval(2, () => {
 * 	// called every two seconds
 * })
 *
 * useTask((delta) => {
 *      interval.update(delta)
 * }
 */

export class Interval {
	#seconds = 0;
	interval = 0;
	action = () => {};
	constructor(interval: number, action: () => void) {
		this.action = action;
		this.interval = interval;
	}
	update(delta: number) {
		if (this.#seconds > this.interval) {
			this.#seconds = 0;
			this.action();
		}
		this.#seconds += delta;
		return this.#seconds;
	}
}

/**
 * Similar behvour to Svelte's spring class but can be linked to Threlte's useTask.
 * An example of stiffness and damping values in action here: https://svelte.dev/examples/spring
 * @param [currentValue=0] - The starting value.
 * @param [stiffness=0.15] - Optional custom stiffness value
 * @param [damping=0.8] - Optional custom damping value
 * @param [damping=0.01] - Optional precision value value
 * @example
 *
 * // create spring
 * let sprungValue = $state(0)
 * let spring = new Spring(sprungValue, 0.15, 0.8)
 *
 * // set new value to spring towards
 * spring.set(10)
 *
 * useTask((delta) => {
 * 	// update value every frame
 * 		sprungValue = spring.update(delta)
 * }
 */
export class Spring<T extends Record<string, number> | number> {
	#currentValue;
	#endValue;
	#velocity;
	#stiffness;
	#damping;
	#precision;
	#settled;
	#velocityArray: number[];
	#settledArray: boolean[];
	constructor(startingValue: T, stiffness = 0.15, damping = 0.8, precision = 0.001) {
		this.#currentValue = startingValue;
		this.#endValue = startingValue;
		this.#velocity = 0;
		this.#stiffness = stiffness;
		this.#damping = damping;
		this.#precision = precision;
		this.#settled = false;
		this.#velocityArray = [];
		this.#settledArray = [];
		if (typeof startingValue === 'object' && startingValue) {
			Object.entries(startingValue).forEach(() => {
				this.#velocityArray.push(0);
				this.#settledArray.push(false);
			});
		}
	}
	set(value: T) {
		this.#endValue = value;
		this.#settled = false;
		this.#settledArray.forEach((part, index, array) => {
			array[index] = false;
		});
	}
	update(delta: number) {
		if (typeof this.#currentValue === 'number' && typeof this.#endValue === 'number') {
			if (this.#settled) return this.#currentValue;
			const { cv, s, v } = springTick(
				this.#stiffness,
				this.#damping,
				this.#currentValue,
				this.#endValue,
				delta,
				this.#velocity,
				this.#precision
			);
			this.#settled = s;
			this.#velocity = v;
			this.#currentValue = cv as T & number;
		} else if (typeof this.#currentValue === 'object') {
			let s = true;
			this.#settledArray.forEach((settled) => {
				if (!settled) s = false;
			});
			if (s) return this.#currentValue;
			let i = 0;
			Object.entries(this.#currentValue).forEach(([key, value]) => {
				if (typeof this.#endValue === 'number' || typeof this.#currentValue === 'number') return;
				const { cv, s, v } = springTick(
					this.#stiffness,
					this.#damping,
					value,
					this.#endValue[key],
					delta,
					this.#velocityArray[i],
					this.#precision
				);
				this.#settledArray[i] = s;
				this.#velocityArray[i] = v;
				this.#currentValue[key] = cv;
				i++;
			});
		}
		return this.#currentValue;
	}
}

const springTick = (
	stiffness: number,
	damping: number,
	currentValue: number,
	endValue: number,
	delta: number,
	velocity: number,
	precision: number
) => {
	let settled = false;
	const tensionForce = -stiffness * (currentValue - endValue);
	const dampingForce = -damping * velocity;
	const acceleration = tensionForce + dampingForce;
	velocity = velocity + acceleration;
	currentValue += velocity * delta * 60;
	if (Math.abs(velocity) < precision && Math.abs(currentValue - endValue) < precision) {
		settled = true;
	}
	return { cv: currentValue, s: settled, v: velocity };
};

/**
 * Similar behvour to Svelte's Tween but can be linked to Threlte's useTask.
 * @param startingValue - The starting value
 * @param [duration] - The duration of the tween in seconds
 * @param [easing] - Easing function
 * @example
 * import { cubicInOut } from 'svelte/easing';
 *
 * // create tween
 * let tweenedValue = $state(0);
 * let tween = new Tween(tweenedValue, 2, cubicInOut);
 *
 * // set new value to move towards
 * tween.set(10);
 *
 * useTask((delta) => {
 *		// update value every frame
 *		tweenedValue = tween.update(delta);
 * }
 */
export class Tween<T extends Record<string, number> | number> {
	#elapsed = 0;
	#startValue;
	#currentValue;
	#endValue;
	#inter;
	#duration;
	#easing;
	constructor(startingValue: T, duration = 1, easing = (t: number) => t) {
		this.#startValue = startingValue;
		this.#currentValue = startingValue;
		this.#endValue = startingValue;
		this.#duration = duration;
		this.#easing = easing;
		this.#inter = tweenInterpolator(this.#startValue, this.#endValue);
	}
	set(value: T) {
		this.#elapsed = 0;
		this.#startValue = this.#currentValue;
		this.#endValue = value;
		this.#inter = tweenInterpolator(this.#startValue, this.#endValue);
	}
	update(delta: number) {
		if (this.#elapsed < this.#duration) {
			this.#elapsed += delta;
			this.#currentValue = this.#inter(this.#easing(this.#elapsed / this.#duration)) as T & number;
		}
		return this.#currentValue;
	}
}

const tweenInterpolator = <T extends Record<string, number> | number>(a: T, b: T) => {
	if (a === b || a !== a) return () => a;
	if (typeof b === 'object' && typeof a === 'object') {
		const keys = Object.keys(b);
		const interpolators: { [key: string]: (t: number) => number } = {};
		keys.forEach((key) => {
			interpolators[key] = tweenInterpolator(a[key], b[key]) as (t: number) => typeof t;
		});
		return (t: number) => {
			const result: { [key: string]: number } | number = {};
			keys.forEach((key) => {
				result[key] = interpolators[key](t);
			});
			return result;
		};
	} else if (typeof a === 'number' && typeof b === 'number') {
		const delta = b - a;
		return (t: number) => a + t * delta;
	} else {
		return (t: number) => t;
	}
};
