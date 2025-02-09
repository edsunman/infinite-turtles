<script lang="ts">
	import { T } from '@threlte/core';
	import { ShaderMaterial } from 'three';
	import fragmentShader from './splat-fragment.glsl?raw';
	import vertexShader from './splat-vertex.glsl?raw';
	import type { LoadedTextures } from '$lib/types';

	let {
		noiseOffset,
		portalSize,
		textures
	}: {
		noiseOffset: number;
		portalSize: number;
		textures: LoadedTextures;
	} = $props();

	const sm = new ShaderMaterial({
		uniforms: {
			noiseOffset: { value: noiseOffset },
			portalSize: { value: portalSize },
			textures: { value: [textures.circle, textures.mainBackground] }
		},
		fragmentShader,
		vertexShader
	});

	$effect(() => {
		sm.uniforms.noiseOffset.value = noiseOffset;
	});

	$effect(() => {
		sm.uniforms.portalSize.value = portalSize;
	});
</script>

<T is={sm} />
