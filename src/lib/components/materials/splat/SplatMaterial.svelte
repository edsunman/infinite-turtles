<script lang="ts">
	import { T, useLoader } from '@threlte/core';
	import { RepeatWrapping, ShaderMaterial, SRGBColorSpace, Texture, TextureLoader } from 'three';
	import fragmentShader from './splat-fragment.glsl?raw';
	import vertexShader from './splat-vertex.glsl?raw';

	let {
		noiseOffset
	}: {
		noiseOffset: number;
	} = $props();

	const textures = useLoader(TextureLoader).load(
		{
			texture1: 'images/circle.png',
			texture2: 'images/background-main.png'
		},
		{
			transform: (texture) => {
				//texture.flipY = false;
				//texture.wrapS = RepeatWrapping;
				//texture.wrapT = RepeatWrapping;
				texture.colorSpace = SRGBColorSpace;
			}
		}
	);

	const sm = new ShaderMaterial({
		uniforms: {
			noiseOffset: { value: noiseOffset },
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
</script>

<T is={sm} />
