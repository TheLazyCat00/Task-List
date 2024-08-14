<template>
	<div class="content1" ref="content">
		<div class="buffer"></div>
		<div class="drag"></div>
		<div class="buttons">
			<button @click="maximizeApp()"><div class="square"></div></button>
		</div>
	</div>
	<div ref="smallbar" class="smallbar" @mouseenter="show()"></div>
</template>

<style lang="scss" scoped>
$darkGrey: rgb(70, 70, 70);

*{
	transition: background-color 0.1s;
}

.content1{
	width: 100vw;
	height: 1cm;
	background-color: black;
	display: flex;
	justify-content: center;
	align-items: center;
}

.smallbar{
	width: 100vw;
	height: 0.4cm;
	display: none;
	background-color: black;
}

.drag{
	width: 100%;
	height: 100%;
}

.buttons{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 1.3cm;
}

.buttons > button{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;	
	height: 100%;
	background-color: black;
	p{
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 600;
		font-size: 0.5cm;
		color: white;
		user-select: none;
	}
}

.buttons > button:hover{
	background-color: $darkGrey;
}

.square{
	width: 0.5cm;
	height: 0.5cm;
	border: solid white 0.06cm;
	border-radius: 0.1cm;
}

.line{
	width: 0.4cm;
	height: 0.07cm;
	background-color: white;
}

.close:hover{
	background-color: red !important;
}

.buffer{
	height: 100%;
	width: 2cm;
}
</style>

<script setup>
import { ref } from 'vue';

let hidden = false;
let target;
let isFullscreen = false;

function maximizeApp(){
	if (!isFullscreen){
		document.documentElement.requestFullscreen()
			.then(isFullscreen = true);
	}
	else{
		document.exitFullscreen()
			.then(isFullscreen = false);
	}
}

function hide(){
	if (isFullscreen){
		smallbar.value.style.display = "inline-block";
		content.value.style.display = "none";
	}
}

function show(){
	content.value.style.display = "flex";
	smallbar.value.style.display = "none";
}

const content = ref(null);
const smallbar = ref(null);

defineExpose({
	hide
});
</script>