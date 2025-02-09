<script lang="ts">
	import { T } from '@threlte/core';
	import { ShaderMaterial, Texture } from 'three';
	import fragmentShader from './card-fragment.glsl?raw';
	import vertexShader from './card-vertex.glsl?raw';

	let { texture }: { texture: Texture } = $props();

	texture.flipY = false;

	const material = new ShaderMaterial({
		fragmentShader,
		vertexShader,
		uniforms: { map: { value: texture } }
	});
</script>

<T is={material} />
