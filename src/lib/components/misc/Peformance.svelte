<script lang="ts">
	import { useTask, useStage, useThrelte } from '@threlte/core';
	import { onDestroy } from 'svelte';

	const { mainStage, renderStage, renderer } = useThrelte();

	let then = 0;
	let now = 0;
	let peak = 0;
	let lastPeak = 0;
	let deltaPeak = 0;
	let lastDeltaPeak = 0;
	let gpu = $state(0);
	let gpuPeak = 0;
	let lastGpuPeak = 0;
	let clock = 0;
	let intervalCounter = 0;
	let ms = $state(0);
	let d = $state(0);

	const gl = renderer.getContext();
	const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
	let query: WebGLQuery | null = null;
	let queryCreated = false;

	const endGpu = () => {
		if (!(gl instanceof WebGL2RenderingContext)) return;
		if (queryCreated && gl.getQuery(ext.TIME_ELAPSED_EXT, gl.CURRENT_QUERY)) {
			gl.endQuery(ext.TIME_ELAPSED_EXT);
		}
	};

	const measureGpu = () => {
		if (!(gl instanceof WebGL2RenderingContext)) return;
		endGpu();
		let available = false;
		let disjoint, ns;
		if (query) {
			available = gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE);
			disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);

			if (available && !disjoint) {
				ns = gl.getQueryParameter(query, gl.QUERY_RESULT);
				const ms = ns * 1e-6;
				if (available || disjoint) {
					gl.deleteQuery(query);
					query = null;
				}
				if (available && ms > 0) {
					gpu = ms;
				}
			}
		}
		if (available || !query) {
			queryCreated = true;
			query = gl.createQuery();
			if (query) gl.beginQuery(ext.TIME_ELAPSED_EXT, query);
		}
	};

	const setupCanvas = () => {
		const canvas = document.createElement('canvas');
		canvas.height = 25;
		canvas.width = 100;
		const context = canvas.getContext('2d');
		return { canvas, context };
	};

	const updateGraph = (
		ctx: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement,
		value: number,
		offset: number
	) => {
		ctx.drawImage(canvas, -1, 0);
		ctx.fillStyle = 'hsl(230, 7%, 17%)';
		ctx.fillRect(99, 0, 1, 25);
		ctx.fillStyle = '#fff';
		ctx.fillRect(99, offset - value, 1, value);
	};

	const createFlexDiv = (title: string, parentDiv: HTMLDivElement, canvas: HTMLCanvasElement) => {
		const newDiv = document.createElement('div');
		newDiv.style.cssText =
			'display:flex;flex-direction:row;width:250px;justify-content: space-between;align-items: end;margin:2px 0;';
		const newTitleDiv = document.createElement('div');
		newTitleDiv.style.cssText = 'width:40px';
		newDiv.appendChild(newTitleDiv);
		newTitleDiv.innerHTML = '<span style="color:rgba(187, 188, 196, 0.7)">' + title + '</span> ';
		const newNumbersDiv = document.createElement('div');
		newNumbersDiv.style.cssText = 'width:110px;text-align:center;';
		newDiv.appendChild(newNumbersDiv);
		newDiv.appendChild(canvas);
		parentDiv.appendChild(newDiv);
		return newNumbersDiv;
	};

	const { canvas: tCanvas, context: tContext } = setupCanvas();
	const { canvas: dCanvas, context: dContext } = setupCanvas();
	const { canvas: gCanvas, context: gContext } = setupCanvas();

	const mainDiv = document.createElement('div');
	mainDiv.style.cssText =
		'color:#fff;font-family:Roboto Mono, Source Code Pro, Menlo, Courier, monospace;font-size:11px;font-weight:400;' +
		'position:absolute;z-index:100;background:hsl(230, 7%, 17%);margin:8px;padding:0 15px 12px;border-radius: 10px;';
	const deltaNumbersDiv = createFlexDiv('delta', mainDiv, dCanvas);
	const threlteNumbersDiv = createFlexDiv('js', mainDiv, tCanvas);
	const gpuNumbersDiv = createFlexDiv('gpu', mainDiv, gCanvas);
	document.body.prepend(mainDiv);

	$effect(() => {
		deltaNumbersDiv.innerHTML =
			d.toFixed(1) +
			'<span style="color:rgba(187, 188, 196, 0.7)"> : ' +
			lastDeltaPeak.toFixed(1) +
			'</span>';
	});
	$effect(() => {
		threlteNumbersDiv.innerHTML =
			ms.toFixed(1) + '<span style="color:rgba(187, 188, 196, 0.7)"> : ' + lastPeak.toFixed(1);
		+'</span>';
	});
	$effect(() => {
		gpuNumbersDiv.innerHTML =
			gpu.toFixed(1) + '<span style="color:rgba(187, 188, 196, 0.7)"> : ' + lastGpuPeak.toFixed(1);
		+'</span>';
	});

	useTask(
		() => {
			then = window.performance.now();
			if (ext) measureGpu();
		},
		{
			stage: useStage('monitor-begin', {
				before: mainStage
			})
		}
	);

	useTask(
		(delta) => {
			d = delta * 1000;
			clock += delta;
			intervalCounter += delta;
			if (intervalCounter > 2) {
				lastPeak = peak;
				peak = ms;
				lastDeltaPeak = deltaPeak;
				deltaPeak = delta;
				lastGpuPeak = gpuPeak;
				gpuPeak = gpu;
				intervalCounter = 0;
			}
			peak = ms > peak ? ms : peak;
			deltaPeak = d > deltaPeak ? d : deltaPeak;
			gpuPeak = gpu > gpuPeak ? gpu : gpuPeak;
			now = window.performance.now();
			ms = now - then;

			if (dContext) updateGraph(dContext, dCanvas, d, 40);
			if (tContext) updateGraph(tContext, tCanvas, ms, 25);
			if (gContext) updateGraph(gContext, gCanvas, gpu, 25);

			endGpu();
		},
		{
			stage: useStage('monitor-end', {
				after: renderStage
			})
		}
	);

	onDestroy(() => {
		document.body.removeChild(mainDiv);
		endGpu();
	});
</script>
