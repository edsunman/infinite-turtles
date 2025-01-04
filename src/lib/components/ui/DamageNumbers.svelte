<script lang="ts">
	import { cardState } from '$lib/state.svelte';
	import { quadOut } from 'svelte/easing';

	const fadeUpwards = (node: HTMLElement) => {
		return {
			duration: 750,
			tick: (t: number) => {
				if (t === 1) node.style.visibility = 'hidden';
			},
			css: (t: number, u: number) => {
				const aU = u > 0.5 ? 1 : u * 2;
				const tOut = quadOut(t);
				return `opacity: ${aU}; transform:translate(0,-${tOut * 50}px)`;
			}
		};
	};
</script>

{#key cardState.damage.key}
	<div style:left="{cardState.damage.x}px" style:top="{cardState.damage.y}px" in:fadeUpwards|global>
		<p>{@html cardState.damage.text}</p>
	</div>
{/key}

<style>
	div {
		width: 100px;
		text-align: center;
		position: absolute;
		color: white;
		pointer-events: none;
	}
	p {
		margin: 0;
		padding: 0;
		font-size: 50px;
	}
</style>
