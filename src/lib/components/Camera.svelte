<script lang="ts">
	import { cardState, gameState } from '$lib/state.svelte';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Vector3 } from 'three';
	import { spring } from '$lib/helpers/animation';

	let devCamera = $state(false);
	let cameraRef = $state() as undefined;

	const { camera, size } = useThrelte();
	const vect = new Vector3();
	const lookAtVect = new Vector3(0, 0, -0.5);
	let cameraPos = $state({ x: 0, y: 22 });
	const cameraSpring = spring({ x: 0, y: 22 }, 0.15, 0.3);

	const scenePosToScreenPos = (x: number, y: number, z: number) => {
		vect.set(x, y, z);
		vect.project(camera.current);
		const widthHalf = size.current.width / 2;
		const heightHalf = size.current.height / 2;
		return { x: vect.x * widthHalf + widthHalf, y: -(vect.y * heightHalf) + heightHalf };
	};

	$effect(() => {
		const p = cardState.hoverCard?.position;
		if (!p) return;
		const offset = cardState.hoverCard?.group === 'hand' ? 1 : 0.5;
		gameState.hoverPosition = scenePosToScreenPos(p.x + 0.6, p.y, p.z - offset);
	});

	$effect(() => {
		const p = cardState.damagedCard?.position;
		if (!p) return;
		const d = scenePosToScreenPos(p.x, p.y, p.z);
		cardState.damage.x = d.x - 50 + (Math.random() - 0.5) * 50;
		cardState.damage.y = d.y - 50 + (Math.random() - 0.5) * 50;
		cardState.damage.key = Math.random().toString(16).slice(2);
	});

	$effect(() => {
		cameraSpring.set({ x: gameState.cameraPosition.x, y: gameState.cameraPosition.y });
	});

	useTask((delta) => {
		// @ts-ignore
		if (cameraRef) cameraRef.lookAt(lookAtVect);
		cameraPos = cameraSpring.update(delta);
	});
</script>

<T.PerspectiveCamera
	bind:ref={cameraRef}
	name="main camera"
	position={[cameraPos.x, 22, cameraPos.y]}
	fov={15}
	makeDefault={!devCamera}
/>

<T.PerspectiveCamera name="dev camera" position={[0, 10, 10]} fov={15} makeDefault={devCamera}>
	<OrbitControls />
</T.PerspectiveCamera>

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'd') {
			devCamera = !devCamera;
		}
	}}
/>
