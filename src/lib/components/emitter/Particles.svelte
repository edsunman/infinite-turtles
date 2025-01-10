<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import {
		BufferGeometry,
		Float32BufferAttribute,
		Vector3,
		ShaderMaterial,
		NormalBlending,
		AdditiveBlending,
		Mesh,
		Points
	} from 'three';
	import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
	import {
		randomPointInsideCube,
		randomDirectionSpread,
		createGradientObject,
		randomNumber
	} from './util';
	import fragmentShader from './particles-fragment.glsl?raw';
	import vertexShader from './particles-vertex.glsl?raw';
	import type { ParticlesEvents, ParticlesProps, ParticlesSlots } from './Particles.svelte';

	type $$Events = ParticlesEvents;
	type $$Slots = ParticlesSlots;
	type Particle = { life: number };

	let {
		emitterPosition = { x: 0, y: 0, z: 0 },
		emitterScale = { x: 0, y: 0, z: 0 },
		emitterRotation = { x: 0, y: 0, z: 0 },
		count = 5,
		life = 2,
		explosiveness = 0,
		spread = 0,
		direction = { x: 0, y: 1, z: 0 },
		gravity = { x: 0, y: 0, z: 0 },
		wind = { x: 0, y: 0, z: 0 },
		driftAmount = 0,
		driftSpeed = 0,
		velocity = 3,
		velocityRandom = 0,
		size = 3,
		sizeRandom = 0,
		color = '',
		colorRandom = 0,
		lightnessRandom = 0,
		textureRotation = 0,
		rotationRandom = 0,
		dampen = false,
		oneShot = false,
		clampAlpha = false,
		additiveBlend = false,
		alphaMap = undefined,
		map = undefined,
		debug = false,
		boundingSphereRadius = 5,
		start = $bindable(),
		stop = $bindable(),
		emitterStateChanged = (e: string): void => {},
		customGeometry,
		ref = $bindable(),
		...props
	}: ParticlesProps = $props();

	let directionVector = new Vector3(direction.x, direction.y, direction.z);
	let emitterLife = 10;
	let emitterState = '';
	let newPosition: { x: number; y: number; z: number };
	let paused = false;
	let pausedTime: number;
	let useAlphaMap = alphaMap ? 1 : 0;
	let useMap = map ? 1 : 0;
	let emitterMesh: Mesh | undefined = $state();
	let sampler: MeshSurfaceSampler;
	let newState = '';

	const { renderer } = useThrelte();
	const pixelRatio = renderer.getPixelRatio();
	const positionAttribute = new Float32BufferAttribute(count * 3, 3);
	const lifeAttribute = new Float32BufferAttribute(count, 1);
	const sizeAttribute = new Float32BufferAttribute(count, 1);
	const colorAttribute = new Float32BufferAttribute(count, 1);
	const lightnessAttribute = new Float32BufferAttribute(count, 1);
	const rotationAttribute = new Float32BufferAttribute(count, 1);
	const velocitiesAttribute = new Float32BufferAttribute(count * 3, 3);
	const randomAttribute = new Float32BufferAttribute(count, 1);
	const parsedColorGradient = createGradientObject(color, 16);
	const parsedSizeGradient = createGradientObject(size, 4);
	const geometry = new BufferGeometry();
	const particles: Particle[] = [];
	const samplerVector = new Vector3();

	start = () => {
		/* if (emitterState !== 'finished') {
			console.warn(
				'particles: start() was called but the emitter is ' + emitterState + ', not finished.'
			);
			return;
		} */
		paused = false;
		emitterLife = 0;
	};

	stop = () => {
		if (oneShot) {
			console.warn('particles: stop() has no effect when oneShot is set to true.');
			return;
		}
		if (emitterState !== 'running') {
			console.warn(
				'particles: stop() was called but the emitter is ' + emitterState + ', not running.'
			);
			return;
		}
		paused = true;
		pausedTime = emitterLife;
	};

	const stateChanged = () => {
		emitterStateChanged(emitterState);
	};

	if (map) map.flipY = false;
	if (alphaMap) alphaMap.flipY = false;

	for (let i = 0; i < count; i++) {
		// direction and velocity
		const pDirection = new Vector3().copy(directionVector.normalize());
		if (spread > 0) pDirection.copy(randomDirectionSpread(pDirection, spread / 2));
		const pVelocity =
			velocityRandom > 0
				? randomNumber(velocity - velocityRandom / 2, velocity + velocityRandom / 2)
				: velocity;
		pDirection.multiplyScalar(pVelocity);
		velocitiesAttribute.setXYZ(i, pDirection.x, pDirection.y, pDirection.z);

		// size, color, lightness
		let pSize = sizeRandom > 0 ? randomNumber(-sizeRandom / 2, sizeRandom / 2) : 0;
		sizeAttribute.setX(i, pSize < 0 ? 0 : pSize);
		colorAttribute.setX(i, colorRandom > 0 ? randomNumber(-colorRandom / 2, colorRandom / 2) : 0);
		lightnessAttribute.setX(
			i,
			lightnessRandom > 0 ? randomNumber(-lightnessRandom / 2, lightnessRandom / 2) : 0
		);
		rotationAttribute.setX(
			i,
			rotationRandom > 0
				? randomNumber(textureRotation - rotationRandom / 2, textureRotation + rotationRandom / 2)
				: textureRotation
		);
		randomAttribute.setX(i, Math.random());

		// life
		const pLife = -(life / count) * i * (1 - explosiveness);
		particles.push({ life: pLife });
		lifeAttribute.setX(i, pLife);
	}
	geometry.setAttribute('position', positionAttribute);
	geometry.setAttribute('life', lifeAttribute);
	geometry.setAttribute('sizeRandom', sizeAttribute);
	geometry.setAttribute('colorRandom', colorAttribute);
	geometry.setAttribute('lightnessRandom', lightnessAttribute);
	geometry.setAttribute('rotation', rotationAttribute);
	geometry.setAttribute('velocity', velocitiesAttribute);
	geometry.setAttribute('randomSeed', randomAttribute);

	const distributePreBirthParticles = () => {
		particles.forEach((particle: Particle, i: number) => {
			particle.life = -(life / count) * i * (1 - explosiveness);
		});
	};

	const positionNewParticle = (index: number) => {
		if (!emitterMesh) return;
		if (customGeometry) {
			sampler.sample(samplerVector);
			emitterMesh.updateMatrix();
			samplerVector.applyMatrix4(emitterMesh.matrix);
			positionAttribute.setXYZ(index, samplerVector.x, samplerVector.y, samplerVector.z);
		} else if (emitterScale.x > 0 || emitterScale.y > 0 || emitterScale.z > 0) {
			newPosition = randomPointInsideCube(emitterPosition, emitterScale);
			positionAttribute.setXYZ(index, newPosition.x, newPosition.y, newPosition.z);
		} else {
			positionAttribute.setXYZ(index, emitterPosition.x, emitterPosition.y, emitterPosition.z);
		}
	};

	const computeBounding = () => {
		if (!geometry.boundingSphere) geometry.computeBoundingSphere();
		if (!geometry.boundingSphere) return;
		geometry.boundingSphere.radius = boundingSphereRadius;
		geometry.boundingSphere.center.set(emitterPosition.x, emitterPosition.y, emitterPosition.z);
	};

	$effect(() => {
		emitterPosition.x, emitterPosition.x, emitterPosition.z;
		computeBounding();
	});

	$effect(() => {
		if (
			!emitterMesh ||
			emitterMesh.geometry.name === 'defaultBox' ||
			!('position' in emitterMesh.geometry.attributes)
		)
			return;
		emitterMesh.geometry = emitterMesh.geometry.toNonIndexed();
		sampler = new MeshSurfaceSampler(emitterMesh).build();
	});

	useTask((delta) => {
		emitterLife += delta;
		newState = 'running';
		if (emitterLife < life) {
			// emmitting new particles
			newState = 'starting';
		}
		if (oneShot) {
			if (emitterLife >= life) {
				// emmitting no more particles
				newState = 'stopping';
			}
			if (emitterLife >= life + life * (1 - explosiveness) + 0.1) {
				// all particles have died
				newState = 'finished';
			}
		} else if (paused) {
			if (emitterLife >= pausedTime) {
				// emmitting no more particles
				newState = 'stopping';
			}
			if (emitterLife >= pausedTime + life + 0.1) {
				// all particles have died
				newState = 'finished';
			}
		}
		if (emitterState !== newState) {
			emitterState = newState;
			stateChanged();
			if (emitterState === 'finished') distributePreBirthParticles();
		}

		if (emitterState === 'starting') {
			// move unborn particles to emitter position
			particles.forEach((particle: Particle, index: number) => {
				if (particle.life <= 0) {
					positionNewParticle(index);
				}
			});
		}
		if (emitterState !== 'finished') {
			// update particles
			particles.forEach((particle: Particle, index: number) => {
				particle.life += delta;
				if (particle.life > life) {
					// particle died
					if (emitterState === 'running' && !paused) {
						particle.life = 0;
						positionNewParticle(index);
					}
				}
				lifeAttribute.setX(index, particle.life);
			});
			lifeAttribute.needsUpdate = true;
			positionAttribute.needsUpdate = true;
		}
	});
</script>

<!-- TODO: mad type error -->
<T.Points {geometry} name="particles" {...props}>
	<T.ShaderMaterial
		blending={additiveBlend ? AdditiveBlending : NormalBlending}
		{vertexShader}
		{fragmentShader}
		depthTest
		depthWrite={false}
		transparent
		vertexColors
		uniforms={{
			alphaMap: {
				value: alphaMap
			},
			useAlphaMap: {
				value: useAlphaMap
			},
			map: {
				value: map
			},
			useMap: {
				value: useMap
			},
			maxLifetime: {
				value: life
			},
			dampen: {
				value: dampen ? 1 : 0
			},
			driftSpeed: {
				value: driftSpeed
			},
			driftAmount: {
				value: driftAmount
			},
			colorStops: {
				value: parsedColorGradient.stops
			},
			colors: {
				value: parsedColorGradient.values
			},
			sizeStops: {
				value: parsedSizeGradient.stops
			},
			sizes: {
				value: parsedSizeGradient.values
			},
			wind: {
				value: [wind.x, wind.y, wind.z]
			},
			gravity: {
				value: [gravity.x, gravity.y, gravity.z]
			},
			emitterPosition: {
				value: emitterPosition
			},
			useClamp: {
				value: clampAlpha ? 1 : 0
			},
			screenPixelRatio: {
				value: pixelRatio ? pixelRatio : 1
			}
		}}
	/>
</T.Points>

<T.Mesh
	bind:ref={emitterMesh}
	scale={[emitterScale.x, emitterScale.y, emitterScale.z]}
	position={[emitterPosition.x, emitterPosition.y, emitterPosition.z]}
	rotation={[emitterRotation.x, emitterRotation.y, emitterRotation.z]}
	name="emitterDebugMesh"
>
	{#if customGeometry}
		{@render customGeometry()}
	{:else}
		<T.BoxGeometry name="defaultBox" />
	{/if}
	<T.MeshBasicMaterial wireframe visible={debug} />
</T.Mesh>
