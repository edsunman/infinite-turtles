<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { RepeatWrapping, ShaderMaterial, Texture } from 'three';
	import fragmentShader from './card-fragment.glsl?raw';
	import vertexShader from './card-vertex.glsl?raw';

	let map = useTexture('/images/map.png');

	const material = new ShaderMaterial({
		fragmentShader,
		vertexShader,
		uniforms: { map: { value: map } }
	});

	const mapLoaded = (map: Texture | undefined) => {
		if (!map) return;
		map.flipY = false;
		map.wrapS = RepeatWrapping;
		map.wrapT = RepeatWrapping;
		map.anisotropy = 2;
		//map.colorSpace = SRGBColorSpace;
		material.uniforms.map.value = map;
	};

	$effect(() => {
		mapLoaded($map);
	});

	/* 	$effect(() => {
		material.uniforms.number.value = number;
	}); */
</script>

<T is={material} />
