<template>
	<div class="listApp">
		<mainInput :style="`display: ${inputStyle};`" class="mainInput"></mainInput>
		<svgEdit :style="`display: ${editStyle};`" v-if="globalState.editorIsReady"></svgEdit>
	</div>
</template>

<style lang="scss" scoped>
$background: rgb(114, 80, 35);

.mainInput{
	width: 100%;
	height: 100%;
}

.listApp{
	background-color: $background;
	border-radius: 0.3cm 0 0 0.3cm;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: top;
	padding: 0.5cm;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { eventBus, globalState } from '../state';

let inputStyle = ref("block");
let editStyle = ref("block");

eventBus.on("goToEditor", () => {
	inputStyle.value = "none";
	editStyle.value = "block";
});

eventBus.on("goToList", () => {
	editStyle.value = "none";
	inputStyle.value = "block";
});

eventBus.on("hideList", () => {
	inputStyle.value = "none";
});
</script>