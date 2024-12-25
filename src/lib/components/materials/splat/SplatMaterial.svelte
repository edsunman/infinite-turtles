<script lang="ts">
	import { T } from '@threlte/core';
	import { ShaderMaterial, Texture } from 'three';
	import fragmentShader from './splat-fragment.glsl?raw';
	import vertexShader from './splat-vertex.glsl?raw';

	let {
		blendImage,
		noiseOffset
	}: {
		blendImage: Texture;
		noiseOffset: number;
	} = $props();

	const sm = new ShaderMaterial({
		uniforms: {
			blendTexture: { value: blendImage },
			noiseOffset: { value: noiseOffset }
		},
		fragmentShader,
		vertexShader
	});

	$effect(() => {
		sm.uniforms.noiseOffset.value = noiseOffset;
	});
</script>

<T is={sm} />
