<script lang="ts">
	import { cardState, gameState } from '$lib/state.svelte';

	import { data } from '$lib/data';
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
</script>

{#if cardState.hoverCard}
	{#key cardState.hoverCard}
		<div
			id="infoBox"
			style:display={'block'}
			style:left="{gameState.hoverPosition.x}px"
			style:top="{gameState.hoverPosition.y}px"
			in:scale|global={{ delay: 500, duration: 200, easing: backOut }}
		>
			<p>{data.cardTypes[cardState.hoverCard.typeId.toString()].name}</p>
		</div>
	{/key}
{/if}

<style>
	#infoBox {
		position: absolute;
		border-radius: 10px;
		padding: 10px;
		background: black;
		color: white;
		pointer-events: none;
	}
	#infoBox p {
		font-size: 30px;
		padding: 0;
		margin: 0;
		font-family: 'Delicious Handrawn', serif;
		font-weight: 400;
		font-style: normal;
	}
</style>
