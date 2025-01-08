<script lang="ts">
	import { T, useLoader } from '@threlte/core';
	import { RepeatWrapping, ShaderMaterial, DoubleSide, TextureLoader, SRGBColorSpace } from 'three';
	import fragmentShader from './parallax-fragment.glsl?raw';
	import vertexShader from './parallax-vertex.glsl?raw';

	let { offset = 1 } = $props();

	const textures = useLoader(TextureLoader).load(
		{
			texture1: 'images/background.png',
			texture2: 'images/background-purple.png',
			texture3: 'images/background-turtle.png',
			texture4: 'images/background-rune.png'
		},
		{
			transform: (texture) => {
				texture.flipY = false;
				texture.wrapS = RepeatWrapping;
				texture.wrapT = RepeatWrapping;
				texture.colorSpace = SRGBColorSpace;
			}
		}
	);

	const material = new ShaderMaterial({
		side: DoubleSide,
		fragmentShader,
		vertexShader,
		uniforms: { textures: { value: [] }, offset: { value: offset } }
	});

	$effect(() => {
		textures.then((t) => {
			if (!material) return;
			material.uniforms.textures.value = [t.texture1, t.texture2, t.texture3, t.texture4];
		});
	});

	$effect(() => {
		material.uniforms.offset.value = offset;
	});
</script>

<T is={material} />
