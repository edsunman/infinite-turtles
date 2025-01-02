<script lang="ts">
	import { T, useLoader } from '@threlte/core';
	import { ShaderMaterial, SRGBColorSpace, TextureLoader } from 'three';
	import fragmentShader from './splat-fragment.glsl?raw';
	import vertexShader from './splat-vertex.glsl?raw';

	let {
		noiseOffset,
		portalSize
	}: {
		noiseOffset: number;
		portalSize: number;
	} = $props();

	const textures = useLoader(TextureLoader).load(
		{
			texture1: 'images/circle.png',
			texture2: 'images/background-main.png'
		},
		{
			transform: (texture) => {
				texture.colorSpace = SRGBColorSpace;
			}
		}
	);

	const sm = new ShaderMaterial({
		uniforms: {
			noiseOffset: { value: noiseOffset },
			portalSize: { value: portalSize },
			textures: { value: [] }
		},
		fragmentShader,
		vertexShader
	});

	$effect(() => {
		textures.then((t) => {
			if (!sm) return;
			sm.uniforms.textures.value = [t.texture1, t.texture2];
		});
	});

	$effect(() => {
		sm.uniforms.noiseOffset.value = noiseOffset;
	});

	$effect(() => {
		sm.uniforms.portalSize.value = portalSize;
	});
</script>

<T is={sm} />
