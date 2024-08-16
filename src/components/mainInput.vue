<template>
	<div>
		<input1 :tasks1="tasks" ref="input" class="input"></input1>
	</div>
</template>

<style lang="scss" scoped>
.input{
	width: 100%;
	height: 100%;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { eventBus } from '../state';

const input = ref(null);

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function sendClosing(){
	let tasks = input.value.getTasks();
	localStorage.setItem("tasks", JSON.stringify(tasks))
}

window.addEventListener("beforeunload", () => {
	eventBus.emit("closing", {});
	sendClosing();
});
</script>