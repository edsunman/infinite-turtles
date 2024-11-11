<script lang="ts">
	import { T } from '@threlte/core';
	import { Shape } from 'three';

	let { radius = 0.1, width = 1, height = 1.5 } = $props();

	const x = -(width / 2);
	const y = -(height / 2);
	const shape = new Shape();

	shape.moveTo(x, y + radius);
	shape.lineTo(x, y + height - radius);
	shape.quadraticCurveTo(x, y + height, x + radius, y + height);
	shape.lineTo(x + width - radius, y + height);
	shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
	shape.lineTo(x + width, y + radius);
	shape.quadraticCurveTo(x + width, y, x + width - radius, y);
	shape.lineTo(x + radius, y);
	shape.quadraticCurveTo(x, y, x, y + radius);
</script>

<T.ShapeGeometry args={[shape]} />
