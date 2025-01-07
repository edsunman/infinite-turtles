<script lang="ts">
	import { nextPhase } from '$lib/gameplay';
	import { onMount } from 'svelte';

	let show = $state(false);

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

<div id="nextPhaseMenu" class={show ? 'show' : ''}>
	<h3>new card</h3>
	<button onclick={close}>next phase</button>
	<!-- 	<div class="grid"></div> -->
</div>

<style>
	h3 {
		color: #6d5c53;
		font-size: 50px;
		font-weight: 500;
		margin: 0;
		justify-self: center;
		align-self: center;
		grid-column: 2;
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

	#nextPhaseMenu {
		grid-template-columns: auto 600px auto;
		grid-template-rows: 100px 300px 100px;
		display: grid;
		position: absolute;
		top: 200px;
		margin: 0 auto;
		left: 0;
		right: 0;
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
</style>
