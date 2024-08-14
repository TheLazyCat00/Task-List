<template>
	<div ref="canvasContainerRef" class="canvas-container">
		<canvas ref="canvasRef"></canvas>
	</div>
</template>

<style scoped>
.canvas-container {
	width: 100%;
	height: 100%; /* or any height you need */
}

canvas {
	display: block; /* Remove any extra space below the canvas */
	width: 100%;
	height: 100%;
	background-color: white;
}
</style>


<script setup>
import { onMounted, ref } from 'vue';
import * as fabric from 'fabric';

const canvasRef = ref(null);
const canvasContainerRef = ref(null);

function enableDrawing() {
	canvas.isDrawingMode = !canvas.isDrawingMode; // Toggle drawing mode
	if (canvas.isDrawingMode) {
		canvas.freeDrawingBrush.color = 'black'; // Set brush color
		canvas.freeDrawingBrush.width = 5;       // Set brush width
	}
}

onMounted(() => {
	const canvas = new fabric.Canvas(canvasRef.value);

	const resizeCanvas = () => {
		const container = canvasContainerRef.value;
		canvas.setWidth(container.clientWidth);
		canvas.setHeight(container.clientHeight);
		canvas.renderAll();
	};

	resizeCanvas();

	// Add an event listener to resize the canvas when the window size changes
	window.addEventListener('resize', resizeCanvas);

	enableDrawing();
});
</script>