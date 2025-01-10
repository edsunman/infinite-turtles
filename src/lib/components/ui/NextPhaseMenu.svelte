<script lang="ts">
	import { data } from '$lib/data';
	import { nextPhase } from '$lib/gameplay';
	import { gameState } from '$lib/state.svelte';
	import { onMount } from 'svelte';

	let show = $state(false);
	let rewardId = $derived(data.phases[gameState.phase.toString()].reward[0].type);
	let newCard = $derived(data.cardTypes[rewardId]);

	const close = () => {
		show = false;
		setTimeout(() => {
			nextPhase();
		}, 1000);
	};

	onMount(() => {
		setTimeout(() => {
			show = true;
		}, 100);
	});
</script>

<div id="container">
	<div id="nextPhaseMenu" class={show ? 'show' : ''}>
		<h3>new card</h3>
		<div class="image" style="background-image:url(/images/{rewardId}.svg)"></div>
		<div class="text">
			<h4>{newCard.name}</h4>
			<p>
				{@html newCard.detail}
			</p>
		</div>
		<button onclick={close}>next phase</button>
	</div>
</div>

<style>
	h3 {
		color: #6d5c53;
		font-size: 50px;
		margin: 0;
		justify-self: center;
		align-self: center;
		grid-column: 2;
	}

	h4 {
		color: #6d5c53;
		font-size: 30px;
		margin: 25px 0;
	}

	p {
		color: #6d5c53;
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
		width: 55%;
		justify-self: end;
		align-content: center;
		font-size: 20px;
	}

	.image {
		grid-column: 2;
		grid-row: 2;
		width: 45%;
		justify-self: start;
		background-repeat: no-repeat;
		background-position: center;
		background-size: auto 200px;
	}

	#nextPhaseMenu {
		grid-template-columns: auto 800px auto;
		grid-template-rows: 200px 300px;
		margin: 0 auto;
		width: 100%;
		grid-template-columns: auto 600px auto;
		grid-template-rows: 100px 300px 100px;
		display: grid;
		position: absolute;
		/* top: 200px;
		margin: 0 auto;
		left: 0;
		right: 0; */
		text-align: center;
		background-color: #c9b8a6;
		z-index: 101;
		clip-path: rect(50% 100% 50% 0%);
		transition: 0.6s cubic-bezier(0.89, 0, 0.545, 0.475);
	}

	#nextPhaseMenu.show {
		clip-path: rect(0% 100% 100% 0%);
		transition: 0.8s cubic-bezier(0.84, 0.005, 0.125, 1);
	}

	#container {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
