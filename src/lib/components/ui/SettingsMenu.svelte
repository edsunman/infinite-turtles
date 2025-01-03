<script lang="ts">
</script>

<div id="settingsMenu">
	<h3>settings</h3>
</div>
<div id="mask"></div>

<style>
	h3 {
		color: white;
		font-size: 50px;
	}

	#settingsMenu {
		position: absolute;
		top: 300px;
		margin: 0 auto;
		left: 0;
		right: 0;
		text-align: center;
		background-color: #ad8f73;
		border: solid #957a61;
		border-width: 6px;
		border-radius: 12px;
		width: 300px;
		z-index: 101;
	}

	#mask {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 100;
		backdrop-filter: blur(1.5px);
	}
</style>
