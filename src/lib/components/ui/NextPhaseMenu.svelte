<script lang="ts">
	import { data } from '$lib/data';
	import { startNextPhase } from '$lib/game/gameActions';
	import { gameState, cursorState } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';

	let newCard = $derived(data.cardTypes[data.phases[gameState.phase.toString()].reward[0].type]);
	let width = $state(0);
	let height = $state(0);

	const onpointermove = (e: any) => {
		cursorState.x = e.clientX / width - 0.5;
		cursorState.y = e.clientY / height - 0.5;
	};
</script>

<div
	id="nextPhaseMenu"
	in:fade={{ delay: 800 }}
	out:fade={{ duration: 150 }}
	{onpointermove}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<h3>new card</h3>
	<div class="text">
		<h4>{newCard.name}</h4>
		<p>
			{@html newCard.detail}
		</p>
	</div>
	<button onclick={startNextPhase}>continue</button>
</div>

<style>
	h3 {
		color: #6d5c53;
		font-size: 75px;
		margin: 0;
		justify-self: center;
		align-self: center;
		grid-column: 2;
	}

	h4 {
		color: #6d5c53;
		font-size: 40px;
		margin: 0 0 30px 0;
	}

	p {
		color: #6d5c53;
		font-size: 25px;
		margin-bottom: 0px;
	}

	button {
		color: #6d5c53;
		font-size: 25px;
		background-color: #c3ad95;
		padding: 6px 15px;
		border-radius: 10px;
		grid-column: 2;
		grid-row: 3;
		justify-self: end;
		align-self: center;
	}

	button:hover {
		background-color: #bfa78e;
	}

	button:active {
		background-color: #bba084;
	}

	.text {
		color: white;
		grid-column: 2;
		grid-row: 2;
		text-align: left;
		width: 45%;
		justify-self: end;
		align-content: center;
		font-size: 20px;
	}

	#nextPhaseMenu {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		grid-template-columns: auto 800px auto;
		grid-template-rows: 25% 50% 25%;
		margin: 0 auto;
		display: grid;
		position: absolute;
		text-align: center;
	}

	@media screen and (max-width: 800px) {
		#nextPhaseMenu {
			grid-template-columns: 5% 90% 5%;
		}
	}

	@media screen and (max-height: 700px) {
		h3 {
			font-size: 50px;
		}

		h4 {
			font-size: 30px;
		}

		p {
			font-size: 20px;
		}
	}
</style>
