<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import {
		BufferGeometry,
		Float32BufferAttribute,
		Vector3,
		NormalBlending,
		AdditiveBlending,
		Mesh
	} from 'three';
	import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
	import {
		randomPointInsideCube,
		setRandomDirectionSpread,
		createGradientObject,
		randomNumber,
		applyRandomAmount
	} from './util';
	import fragmentShader from './particles-fragment.glsl?raw';
	import vertexShader from './particles-vertex.glsl?raw';
	import type { ParticlesProps } from './types';

	let {
		emitterPosition = [0, 0, 0],
		emitterScale = [0, 0, 0],
		emitterRotation = [0, 0, 0],
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
		ref = $bindable()
	}: ParticlesProps = $props();

	let emitterLife = 0;
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
	const parsedColorGradient = createGradientObject(color, 16);
	const parsedSizeGradient = createGradientObject(size, 4);
	const geometry = new BufferGeometry();
	const particles: number[] = [];
	const samplerVector = new Vector3();
	const directionVector = new Vector3(direction.x, direction.y, direction.z);
	const dummyVector = new Vector3();

	start = () => {
		if (emitterState !== 'finished') return;
		paused = false;
		emitterLife = 0;
	};

	stop = () => {
		if (oneShot || emitterState !== 'running') return;
		paused = true;
		pausedTime = emitterLife;
	};

	const stateChanged = () => {
		emitterStateChanged(emitterState);
	};

	if (map) map.flipY = false;
	if (alphaMap) alphaMap.flipY = false;

	const positionAttribute = new Float32BufferAttribute(count * 3, 3);
	const lifeAttribute = new Float32BufferAttribute(count, 1);
	const sizeAttribute = new Float32BufferAttribute(count, 1);
	const colorAttribute = new Float32BufferAttribute(count, 1);
	const lightnessAttribute = new Float32BufferAttribute(count, 1);
	const rotationAttribute = new Float32BufferAttribute(count, 1);
	const velocitiesAttribute = new Float32BufferAttribute(count * 3, 3);
	const randomAttribute = new Float32BufferAttribute(count, 1);

	for (let i = 0; i < count; i++) {
		dummyVector.copy(directionVector.normalize());
		if (spread > 0) setRandomDirectionSpread(dummyVector, spread / 2);
		dummyVector.multiplyScalar(applyRandomAmount(velocity, velocityRandom));
		velocitiesAttribute.setXYZ(i, dummyVector.x, dummyVector.y, dummyVector.z);

		sizeAttribute.setX(i, applyRandomAmount(0, sizeRandom));
		colorAttribute.setX(i, colorRandom > 0 ? randomNumber(-colorRandom / 2, colorRandom / 2) : 0);
		lightnessAttribute.setX(i, applyRandomAmount(0, lightnessRandom));
		rotationAttribute.setX(i, applyRandomAmount(textureRotation, rotationRandom));
		randomAttribute.setX(i, Math.random());

		const pLife = -(life / count) * i * (1 - explosiveness);
		particles.push(pLife);
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
		particles.forEach((particle, index, array) => {
			array[index] = -(life / count) * index * (1 - explosiveness);
		});
	};

	const positionNewParticle = (index: number) => {
		if (!emitterMesh) return;
		if (customGeometry) {
			sampler.sample(samplerVector);
			emitterMesh.updateMatrix();
			samplerVector.applyMatrix4(emitterMesh.matrix);
			positionAttribute.setXYZ(index, samplerVector.x, samplerVector.y, samplerVector.z);
		} else if (emitterScale[0] > 0 || emitterScale[1] > 0 || emitterScale[2] > 0) {
			newPosition = randomPointInsideCube(emitterPosition, emitterScale);
			positionAttribute.setXYZ(index, newPosition.x, newPosition.y, newPosition.z);
		} else {
			positionAttribute.setXYZ(index, emitterPosition[0], emitterPosition[1], emitterPosition[2]);
		}
	};

	const computeBounding = () => {
		if (!geometry.boundingSphere) geometry.computeBoundingSphere();
		if (!geometry.boundingSphere) return;
		geometry.boundingSphere.radius = boundingSphereRadius;
		geometry.boundingSphere.center.set(emitterPosition[0], emitterPosition[1], emitterPosition[2]);
	};

	$effect(() => {
		emitterPosition[0], emitterPosition[1], emitterPosition[2];
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
			particles.forEach((particle, index, array) => {
				if (particle <= 0) {
					positionNewParticle(index);
				}
			});
		}
		if (emitterState !== 'finished') {
			// update particles
			particles.forEach((particle, index, array) => {
				array[index] += delta;
				if (array[index] > life) {
					// particle died
					if (emitterState === 'running' && !paused) {
						array[index] = 0;
						positionNewParticle(index);
					}
				}
				lifeAttribute.setX(index, array[index]);
			});
			lifeAttribute.needsUpdate = true;
			positionAttribute.needsUpdate = true;
		}
	});
</script>

<T.Points {geometry} name="particles">
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
	scale={emitterScale}
	position={emitterPosition}
	rotation={emitterRotation}
	name="emitterDebugMesh"
>
	{#if customGeometry}
		{@render customGeometry()}
	{:else}
		<T.BoxGeometry name="defaultBox" />
	{/if}
	<T.MeshBasicMaterial wireframe visible={debug} />
</T.Mesh>
