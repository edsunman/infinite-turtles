<script lang="ts">
	import { nextPhase } from '$lib/gameplay';
</script>

<div id="newCardMenu">
	<h3>new card</h3>
	<button onclick={nextPhase}>next phase</button>
</div>

<!-- <div id="mask"></div> -->

<style>
	h3 {
		color: #6d5c53;
		font-size: 50px;
		font-weight: 500;
	}

	#newCardMenu {
		position: absolute;
		top: 300px;
		margin: 0 auto;
		left: 0;
		right: 0;
		text-align: center;
		background-color: #ddcebc;
		border: solid #6d5c53;
		border-width: 4px;
		border-radius: 8px;
		width: 300px;
		z-index: 101;
	}

	/* 	#mask {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 100;
		backdrop-filter: blur(1px);
		background-color: rgba(0, 0, 0, 0.3);
	} */
</style>
