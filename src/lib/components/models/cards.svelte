<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@3.0.0-next.11 D:\Node\turtles\static\models\cards.glb --root /models/ --types --printwidth 120 --precision 2 --transform --resolution 1024
-->

<script lang="ts">
  import type * as THREE from 'three'

  import type { Snippet } from 'svelte'
  import { T, type Props } from '@threlte/core'
  import { useGltf } from '@threlte/extras'

  let {
    fallback,
    error,
    children,
    ref = $bindable(),
    ...props
  }: Props<THREE.Group> & {
    ref?: THREE.Group
    children?: Snippet<[{ ref: THREE.Group }]>
    fallback?: Snippet
    error?: Snippet<[{ error: Error }]>
  } = $props()

  type GLTFResult = {
    nodes: {
      Background: THREE.Mesh
      Border: THREE.Mesh
      Enemy: THREE.Mesh
      Player: THREE.Mesh
      Potion: THREE.Mesh
      Turtle: THREE.Mesh
      RuneState: THREE.Mesh
      Heart: THREE.Mesh
      EnemyScorp: THREE.Mesh
      RuneEffect: THREE.Mesh
      RuneInspect: THREE.Mesh
      RuneHost: THREE.Mesh
      EnemySkull: THREE.Mesh
      Dashed: THREE.Mesh
      HeartStone: THREE.Mesh
      EnemyBaby: THREE.Mesh
    }
    materials: {}
  }

  const gltf = useGltf<GLTFResult>('/models/cards-transformed.glb')
</script>

<T.Group
  bind:ref
  dispose={false}
  {...props}
>
  {#await gltf}
    {@render fallback?.()}
  {:then gltf}
    <T.Mesh
      geometry={gltf.nodes.Background.geometry}
      material={gltf.nodes.Background.material}
    />
    <T.Mesh
      geometry={gltf.nodes.Border.geometry}
      material={gltf.nodes.Border.material}
    />
    <T.Mesh
      geometry={gltf.nodes.Enemy.geometry}
      material={gltf.nodes.Enemy.material}
    />
    <T.Mesh
      geometry={gltf.nodes.Player.geometry}
      material={gltf.nodes.Player.material}
    />
    <T.Mesh
      geometry={gltf.nodes.Potion.geometry}
      material={gltf.nodes.Potion.material}
    />
    <T.Mesh
      geometry={gltf.nodes.Turtle.geometry}
      material={gltf.nodes.Turtle.material}
    />
    <T.Mesh
      geometry={gltf.nodes.RuneState.geometry}
      material={gltf.nodes.RuneState.material}
    />
    <T.Mesh
      geometry={gltf.nodes.Heart.geometry}
      material={gltf.nodes.Heart.material}
    />
    <T.Mesh
      geometry={gltf.nodes.EnemyScorp.geometry}
      material={gltf.nodes.EnemyScorp.material}
    />
    <T.Mesh
      geometry={gltf.nodes.RuneEffect.geometry}
      material={gltf.nodes.RuneEffect.material}
    />
    <T.Mesh
      geometry={gltf.nodes.RuneInspect.geometry}
      material={gltf.nodes.RuneInspect.material}
    />
    <T.Mesh
      geometry={gltf.nodes.RuneHost.geometry}
      material={gltf.nodes.RuneHost.material}
    />
    <T.Mesh
      geometry={gltf.nodes.EnemySkull.geometry}
      material={gltf.nodes.EnemySkull.material}
    />
    <T.Mesh
      geometry={gltf.nodes.Dashed.geometry}
      material={gltf.nodes.Dashed.material}
    />
    <T.Mesh
      geometry={gltf.nodes.HeartStone.geometry}
      material={gltf.nodes.HeartStone.material}
    />
    <T.Mesh
      geometry={gltf.nodes.EnemyBaby.geometry}
      material={gltf.nodes.EnemyBaby.material}
    />
  {:catch err}
    {@render error?.({ error: err })}
  {/await}

  {@render children?.({ ref })}
</T.Group>
