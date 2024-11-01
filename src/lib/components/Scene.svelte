<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import {
		Grid,
		OrbitControls,
		InstancedMesh,
		Instance,
		useGltf,
		interactivity
	} from '@threlte/extras';
</script>

<Grid
	name="debug"
	gridSize={[50, 50]}
	cellColor={'#46536b'}
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={50}
	position.y={-0.01}
/>

<T.PerspectiveCamera makeDefault name="dev camera" position={[20, 20, 20]} fov={15}>
	<OrbitControls />
</T.PerspectiveCamera>
