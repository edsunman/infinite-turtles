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
	import {
		randomPointInsideCube,
		setRandomDirectionSpread,
		createGradientObject,
		randomNumber,
		applyRandomAmount
	} from './util';
	import { particles as particleManager } from '$lib/state.svelte';
	import fragmentShader from './particles-fragment.glsl?raw';
	import vertexShader from './particles-vertex.glsl?raw';

	import type { ParticlesProps } from './types';

	let {
		emitterPosition = [0, 0, -0.5],
		emitterScale = [0.5, 0.1, 1.5],
		emitterRotation = [0, 0, 0],
		count = 250,
		life = 2,
		spread = 80,
		direction = { x: 0, y: 1, z: -0.5 },
		gravity = { x: 0, y: 0, z: 0 },
		wind = { x: 0, y: 0, z: 0 },
		driftAmount = 0.4,
		driftSpeed = 1,
		velocity = 2,
		velocityRandom = 0,
		size = 'size(0) 0%, size(2) 20%, size(1) 100%',
		sizeRandom = 10,
		color = 'rgba(100,255,248,0) 0%, rgba(100,255,248,1) 8%, rgba(0,185,255,1) 90%, rgba(115,0,255,0) 100%',
		colorRandom = 0,
		lightnessRandom = 0.2,
		textureRotation = 0,
		rotationRandom = 0,
		additiveBlend = false,
		alphaMap = undefined,
		map = undefined,
		debug = false
	}: ParticlesProps = $props();

	if (map) map.flipY = false;
	if (alphaMap) alphaMap.flipY = false;

	let useAlphaMap = alphaMap ? 1 : 0;
	let emitterMesh: Mesh | undefined = $state();
	let dummyPosition: { x: number; y: number; z: number };

	const { renderer } = useThrelte();
	const pixelRatio = renderer.getPixelRatio();
	const parsedColorGradient = createGradientObject(color, 16);
	const parsedSizeGradient = createGradientObject(size, 4);
	const geometry = new BufferGeometry();
	const particles: Float32Array = new Float32Array(250);
	const directionVector = new Vector3(direction.x, direction.y, direction.z);
	const dummyVector = new Vector3();

	// 0 = finished, 1 = starting, 2 = running, 3 = stopping
	const groupState = new Int8Array(5);
	const groupColors = [0.1, 0.2, 0.3, 0.4, 0.5];
	const groupLife = new Float32Array(5);
	const groupStoppedTime = new Float32Array(5);
	const groupBurst = [false, true, false, false, false];
	const groupPositions: [number, number, number][] = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	const positionAttribute = new Float32BufferAttribute(count * 3, 3);
	const lifeAttribute = new Float32BufferAttribute(count, 1);
	const sizeAttribute = new Float32BufferAttribute(count, 1);
	const colorAttribute = new Float32BufferAttribute(count, 1);
	const lightnessAttribute = new Float32BufferAttribute(count, 1);
	const rotationAttribute = new Float32BufferAttribute(count, 1);
	const velocitiesAttribute = new Float32BufferAttribute(count * 3, 3);
	const randomAttribute = new Float32BufferAttribute(count, 1);
	const groupAttribute = new Float32BufferAttribute(count, 1);

	const positionNewParticle = (index: number, group: number) => {
		dummyPosition = randomPointInsideCube(groupPositions[group], emitterScale);
		positionAttribute.setXYZ(index, dummyPosition.x, dummyPosition.y, dummyPosition.z);
	};

	// initial setup
	let groupCounter = -1;
	for (let i = 0; i < count; i++) {
		if (i % 50 === 0) {
			groupCounter++;
		}

		dummyVector.copy(directionVector.normalize());
		if (spread > 0) setRandomDirectionSpread(dummyVector, spread / 2);
		dummyVector.multiplyScalar(applyRandomAmount(velocity, velocityRandom));
		velocitiesAttribute.setXYZ(i, dummyVector.x, dummyVector.y, dummyVector.z);

		sizeAttribute.setX(i, applyRandomAmount(0, sizeRandom));
		colorAttribute.setX(i, colorRandom > 0 ? randomNumber(-colorRandom / 2, colorRandom / 2) : 0);
		lightnessAttribute.setX(i, applyRandomAmount(0, lightnessRandom));
		rotationAttribute.setX(i, applyRandomAmount(textureRotation, rotationRandom));
		randomAttribute.setX(i, Math.random());
		groupAttribute.setX(i, groupCounter);

		positionNewParticle(i, groupCounter);
	}

	geometry.setAttribute('position', positionAttribute);
	geometry.setAttribute('life', lifeAttribute);
	geometry.setAttribute('sizeRandom', sizeAttribute);
	geometry.setAttribute('colorRandom', colorAttribute);
	geometry.setAttribute('lightnessRandom', lightnessAttribute);
	geometry.setAttribute('rotation', rotationAttribute);
	geometry.setAttribute('velocity', velocitiesAttribute);
	geometry.setAttribute('randomSeed', randomAttribute);
	geometry.setAttribute('group', groupAttribute);

	particleManager.startParticles = (group, burst, hue, x = 0, z = 0) => {
		groupPositions[group][0] = x;
		groupPositions[group][2] = z;
		groupLife[group] = hue;
		groupColors[group] = hue;
		groupBurst[group] = burst;

		const offset = [0, 50, 100, 150, 200];
		for (let i = 1, o = offset[group]; o < offset[group] + 50; i++, o++) {
			const pLife = -(life / count) * i * (1 - (groupBurst[group] ? 0.8 : 0)) * 5;
			particles[o] = pLife;
			lifeAttribute.setX(o, pLife);
			positionNewParticle(o, group);
		}

		groupState[group] = 1;
	};

	particleManager.stopParticles = (group: number) => {
		if (groupState[group] === 0) return;
		groupState[group] = 3;
		groupStoppedTime[group] = groupLife[group];
	};

	useTask(
		(delta) => {
			groupState.forEach((state, index, array) => {
				if (state === 0) return;
				groupLife[index] += delta;
				if (groupBurst[index]) {
					// burst emitter
					if (groupLife[index] >= life) {
						// emmitting no more particles
						array[index] = 3;
					}
					if (groupLife[index] >= life + life * (1 - 0.3) + 0.1) {
						// all particles have died
						array[index] = 0;
						particleManager.groupNoLongerInUse(index);
					}
				} else if (state === 3) {
					// stopping
					if (groupLife[index] >= groupStoppedTime[index] + life + 0.1) {
						array[index] = 0;
						particleManager.groupNoLongerInUse(index);
					}
				}
			});

			let groupCounter = -1;
			particles.forEach((particle, index, array) => {
				if (index % 50 === 0) {
					groupCounter++;
				}
				if (groupState[groupCounter] === 0) return;
				// emitter not finished
				if (particle > life) {
					// particle died
					if (groupState[groupCounter] === 1) {
						// emitter running
						array[index] = 0;
					}
				}
				array[index] += delta;
				lifeAttribute.setX(index, array[index]);
			});

			lifeAttribute.needsUpdate = true;
			positionAttribute.needsUpdate = true;
		},
		{ stage: 'gameplay-stage' }
	);
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
			maxLifetime: {
				value: life
			},
			dampen: {
				value: 0
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
				value: 1
			},
			screenPixelRatio: {
				value: pixelRatio ? pixelRatio : 1
			},
			groupColors: {
				value: groupColors
			}
		}}
	/>
</T.Points>

<!-- <T.Mesh
	bind:ref={emitterMesh}
	scale={emitterScale}
	position={emitterPosition}
	rotation={emitterRotation}
	name="emitterDebugMesh"
>
	<T.BoxGeometry name="defaultBox" />

	<T.MeshBasicMaterial wireframe visible={debug} />
</T.Mesh> -->
