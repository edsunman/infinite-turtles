<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { RepeatWrapping, ShaderMaterial, Texture, DoubleSide, SRGBColorSpace } from 'three';
	import fragmentShader from './numbers-fragment.glsl?raw';
	import vertexShader from './numbers-vertex.glsl?raw';

	let { number = 1 } = $props();

	let map = useTexture('/images/numbers.png');

	const material = new ShaderMaterial({
		transparent: true,
		side: DoubleSide,
		fragmentShader,
		vertexShader,
		uniforms: { map: { value: map }, number: { value: number } }
	});

	const mapLoaded = (map: Texture | undefined) => {
		if (!map) return;
		//map.flipY = false;
		map.wrapS = RepeatWrapping;
		map.wrapT = RepeatWrapping;
		map.anisotropy = 2;
		//map.colorSpace = SRGBColorSpace;
		material.uniforms.map.value = map;
	};

	$effect(() => {
		mapLoaded($map);
	});

	$effect(() => {
		material.uniforms.number.value = number;
	});
</script>

<T is={material} />
