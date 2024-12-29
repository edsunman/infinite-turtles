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
			<h3>{data.cardTypes[cardState.hoverCard.typeId.toString()].name}</h3>
			{#if data.cardTypes[cardState.hoverCard.typeId.toString()].description}
				<p>{@html data.cardTypes[cardState.hoverCard.typeId.toString()].description}</p>
			{/if}
		</div>
	{/key}
{/if}

<style>
	#infoBox {
		position: absolute;
		border-radius: 10px;
		padding: 8px 10px 10px 10px;
		background: #151515;
		color: white;
		pointer-events: none;
		width: 150px;
	}
	#infoBox p {
		text-align: center;
		font-size: 26px;
		padding: 0;
		margin: 5px 0 0 0;
		line-height: 26px;
	}
	#infoBox h3 {
		text-align: center;
		font-size: 32px;
		padding: 0;
		margin: 0;
	}
</style>
