<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { RepeatWrapping, ShaderMaterial, Texture, DoubleSide } from 'three';
	import fragmentShader from './parallax-fragment.glsl?raw';
	import vertexShader from './parallax-vertex.glsl?raw';

	let { offset = 1 } = $props();

	let map = useTexture('https://threejs.org/examples/textures/uv_grid_opengl.jpg');

	const material = new ShaderMaterial({
		side: DoubleSide,
		fragmentShader,
		vertexShader,
		uniforms: { map: { value: map }, offset: { value: offset } }
	});

	const mapLoaded = (map: Texture | undefined) => {
		if (!map) return;
		map.flipY = false;
		map.wrapS = RepeatWrapping;
		map.wrapT = RepeatWrapping;
		material.uniforms.map.value = map;
	};

	$effect(() => {
		mapLoaded($map);
	});

	$effect(() => {
		material.uniforms.offset.value = offset;
	});
</script>

<T is={material} />
