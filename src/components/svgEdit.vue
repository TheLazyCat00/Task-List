<template>
	<div>
		<div class="container" style="width:100%;height:100%" ref="svgEdit"></div>
		<button class="goBack" @click="goBack">&lt;</button>
	</div>
</template>

<style lang="scss" scoped>
.container{
	border-radius: 1vh;
	overflow: hidden;
}

.goBack{
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 0.7cm;
	height: 0.7cm;
	border-radius: 0 0 0.4cm 0;
	font-weight: 600;
}

.goBack:hover{
	background-color: hsl(0, 0%, 75%);
}
</style>

<script setup lang="ts">
import Editor from "svgedit/dist/editor/editor.js";
import { onMounted, ref } from "vue";
import { globalState, eventBus } from "../state";


const svgEdit = ref(null);
let editorCanvas;

function goBack(){
	globalState.shapeForList = document.getElementById("svgcontent").children[0].innerHTML;
	eventBus.emit("goToList", {});
}

function goBackClosing(){
	globalState.shapeForList = document.getElementById("svgcontent").children[0].innerHTML;
	eventBus.emit("goToListClosing", {});
}

function insert(){
	document.getElementById("svgcontent").children[0].innerHTML = globalState.shapeForEditor || "";
}

onMounted(() => {
	editorCanvas = new Editor(svgEdit.value);

	editorCanvas.setConfig({
		allowInitialUserOverride: true,
		extensions: [
			"ext-connector", 
			"ext-eyedropper", 
			"ext-grid", 
			"ext-markers", 
			"ext-opensave", 
			"ext-overview_window", 
			"ext-panning", 
			"ext-polystar"
		],
		noDefaultExtensions: true,
		userExtensions: []
	});

	editorCanvas.init();

	setTimeout(insert, 100);
});

eventBus.on("goToEditor", () => {
	insert();
});

eventBus.on("closing", () =>{
	goBackClosing();
});
</script>