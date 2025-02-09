<script lang="ts">
	import { T } from '@threlte/core';
	import { ShaderMaterial, DoubleSide, Texture } from 'three';
	import fragmentShader from './parallax-fragment.glsl?raw';
	import vertexShader from './parallax-vertex.glsl?raw';

	let { texture }: { texture: Texture } = $props();

	texture.flipY = false;

	const material = new ShaderMaterial({
		side: DoubleSide,
		fragmentShader,
		vertexShader,
		uniforms: { map: { value: texture } }
	});
</script>

<T is={material} />
