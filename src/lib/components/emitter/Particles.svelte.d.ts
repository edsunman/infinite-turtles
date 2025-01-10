import type { Events, Props, Slots } from '@threlte/core';
import { SvelteComponent, Snippet } from 'svelte';
import type { Points, Texture } from 'three';

type XYZ = { x: number; y: number; z: number };

export type ParticlesProps = Props<Points> & {
	/** Position of the emitter. You can update while the emitter is running. */
	emitterPosition?: XYZ;
	/** Scale of the emitter. You can update while the emitter is running. */
	emitterScale?: XYZ;
	/** Rotation of the emitter. You can update while the emitter is running. */
	emitterRotation?: XYZ;
	/** The number of particles. */
	count?: number;
	/** The life of each particle in seconds. */
	life?: number;
	/** Value between 0 and 1. Emit particles one after another or all at once. */
	explosiveness?: number;
	/** Value between 0 and 360 degrees. Gives the particles a random direction within this range.  */
	spread?: number;
	/** Normalised direction vector. */
	direction?: XYZ;
	/** Gravity direction vector. Higher numbers for stronger force. Gets stronger over life of particle. */
	gravity?: XYZ;
	/** Gravity direction vector. Higher numbers for stronger force. Constant force over life of particle. */
	wind?: XYZ;
	/** Use in combination with driftSpeed to give the particles random movement. */
	driftAmount?: number;
	/** Use in combination with driftAmount to give the particles random movement. */
	driftSpeed?: number;
	/** Initial particle force. */
	velocity?: number;
	/** Randomise the velocity by this amount in both diretions. */
	velocityRandom?: number;
	/** Size of particle over it's life. */
	size?: string | number;
	/** Randomise the size by this amount in both diretions. */
	sizeRandom?: number;
	/** Color of particle over it's life. */
	color?: string;
	/** Value between 0 and 1 to randomise the hue. */
	colorRandom?: number;
	/** Value between 0 and 1 to randomise the lightness. */
	lightnessRandom?: number;
	/** Speed to rotate the texture. */
	textureRotation?: number;
	/** Randomise the rotation by this amount in both diretions. */
	rotationRandom?: number;
	/** Slow the particle to a stop over it's life. */
	dampen?: boolean;
	/** Run the emitter once then stop. */
	oneShot?: boolean;
	/** Clamp alpha map values for a hard edge stylised look */
	clampAlpha?: boolean;
	/** Blend transparent particles for a glow effect */
	additiveBlend?: boolean;
	/** Texture for alpha values. White is opaque black is transparent. */
	alphaMap?: Texture;
	/** Texture */
	map?: Texture;
	/** Show emitter outline. */
	debug?: boolean;
	/** Bounding sphere of the emitter, defaults to 5. */
	boundingSphereRadius?: number;
	/** Bounding sphere of the emitter, defaults to 5. */
	start?: () => void;
	stop?: () => void;
	emitterStateChanged?: (e: string) => void;
	customGeometry?: Snippet;
	ref?: Points;
};

export type ParticlesEvents = Events<Points>;

export type ParticlesSlots = Slots<Points>;

export default class Particles extends SvelteComponent<
	ParticleProps,
	ParticleEvents,
	ParticleSlots
> {}
