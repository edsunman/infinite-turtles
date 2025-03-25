<script lang="ts">
	import { cardState, gameState } from '$lib/state.svelte';
	import { data } from '$lib/data';
	import { scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	let width = $state(0);
	let height = $state(0);

	const cardStrength = $derived.by(() => {
		cardState.hoverCard;
		if (
			cardState.hoverCard &&
			!(cardState.hoverCard.typeId === 10 && cardState.hoverCard.group === 'placed')
		) {
			return data.cardTypes[cardState.hoverCard.typeId.toString()].strength;
		}
		let strength = 1;
		const turtleSlotNumber = cardState.slots.findIndex((s) => s === cardState.hoverCard?.id);
		const runeCards = cardState.cards.filter(
			(c) =>
				c.id === cardState.slots[1 + turtleSlotNumber] ||
				c.id === cardState.slots[2 + turtleSlotNumber]
		);
		for (const r of runeCards) {
			if (r.typeId === 15) strength += 2;
		}
		if (strength > 1) {
			return `<span style="color:var(--purple)">${strength}</span>`;
		} else {
			return 1;
		}
	});
</script>

{#if cardState.hoverCard}
	{@const card = data.cardTypes[cardState.hoverCard.typeId.toString()]}
	{#key cardState.hoverCard}
		<div
			id="infoBox"
			bind:clientWidth={width}
			bind:clientHeight={height}
			style:display={'block'}
			style:left="{gameState.hoverPosition.x - width / 2}px"
			style:top="{gameState.hoverPosition.y - height / 2 + 25}px"
			in:scale|global={{ delay: gameState.mobile ? 100 : 500, duration: 200, easing: backOut }}
		>
			<h3 class={cardState.hoverCard.typeId === 13 ? 'small' : ''}>{card.name}</h3>

			{#if cardState.hoverCard.typeId >= 2 && cardState.hoverCard.typeId <= 10}
				<p>strength: <span style="font-size:30px">{@html cardStrength}</span></p>
			{/if}
			{#if card.description}
				<p>{@html card.description}</p>
			{/if}
		</div>
	{/key}
{/if}

<style>
	div {
		z-index: 2;
		position: absolute;
		border-radius: 10px;
		padding: 8px 10px 10px 10px;
		background: #222222;
		color: white;
		pointer-events: none;
		width: 150px;
	}

	p {
		text-align: center;
		font-size: 20px;
		padding: 0;
		margin: 10px 0 0 0;
		line-height: 26px;
	}

	h3 {
		text-align: center;
		font-size: 28px;
		padding: 0;
		margin: 0;
	}

	h3.small {
		font-size: 24px;
	}
</style>
