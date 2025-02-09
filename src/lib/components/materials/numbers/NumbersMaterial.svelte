<script lang="ts">
	import { T } from '@threlte/core';
	import { ShaderMaterial, Texture, DoubleSide } from 'three';
	import fragmentShader from './numbers-fragment.glsl?raw';
	import vertexShader from './numbers-vertex.glsl?raw';

	let { texture }: { texture: Texture } = $props();

	const material = new ShaderMaterial({
		transparent: true,
		side: DoubleSide,
		fragmentShader,
		vertexShader,
		uniforms: { map: { value: texture } }
	});
</script>

<T is={material} />
