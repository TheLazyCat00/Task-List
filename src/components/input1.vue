<template>
	<div>
		<div class="container">
			<div class="input1">
				<input type="text" ref="input1" spellcheck="false">
				<button @click="add">+</button>
			</div>
			<div class="tasks" v-if="tasks && tasks.length > 0">
				<taskElement ref="taskElement1" @deleteTask="deleteTask(index)" @toggleDone="toggleDone(index)" :isExpanded="task.top.isExpanded" :text="task.top.text" :tasks="task.bottom" :done="task.top.done" :image="task.top.image" v-for="(task, index) in tasks"/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$background: hsl(271, 97%, 23%);
$buttoncolor: hsl(213, 100%, 31%);

@mixin horizontalPadding($width){
	padding-left: $width;
	padding-right: $width;
}

.container{
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: start;
	flex-direction: column;
	gap: 0.6cm;
}

.input1{
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.2cm;
	background-color: $background;
	border-radius: 0.3cm;
	flex-shrink: 0;
}

.input1 > input{
	width: calc(100% - 30vw);
	height: 0.7cm;
	color: white;
	background-color: black;
	border-radius: 0.15cm;
	@include horizontalPadding(0.2cm);
	transition: width 0.5s;
}

.input1 > input:focus{
	width: calc(100% - 15vw);
}

.input1 > button{
	height: 0.7cm;
	width: 0.8cm;
	background-color: $buttoncolor;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 0.6cm;
	border-radius: 0.15cm;
}

.tasks{
	display: flex;
	justify-content: start;
	flex-direction: column;
	overflow-y: scroll;
	gap: 0.2cm;
	div{
		flex-shrink: 0;
	}
}
</style>

<script setup lang="ts">
import { Ref, ref } from 'vue';

interface Task{
	top: {
		text: string,
		done: number,
		image: string,
		isExpanded: boolean
	},
	bottom: Object
}

const props = defineProps({
	tasks1: {
		type: Array<Task>,
		required: false
	}
});

const emit = defineEmits(["sendList"])

const input1: Ref<HTMLInputElement> = ref(null);
const taskElement1 = ref(null);

let tasks: Ref<Array<Task>> = ref(props.tasks1 || []);


function add(){
	if(input1.value.value.trim() == "") return;
	tasks.value.push({top: {text: input1.value.value, done: 0, image: "", isExpanded: false}, bottom: []});
	input1.value.value = "";
	emit("sendList", tasks.value);
}

function deleteTask(index: number){
	tasks.value = getTasks();
	tasks.value.splice(index, 1);
	emit("sendList", tasks.value);
}

function toggleDone(index: number){
	tasks.value[index].top.done = (tasks.value[index].top.done + 1)%2;
}

function getTasks(){
	if(!taskElement1.value) return;
	let tasks1 = [];
	for(let element of taskElement1.value){
		tasks1.push(element.closing());
	}
	return tasks1;
}

function updateTasks(value){
	tasks.value = value || [];
}

document.addEventListener("keydown", (event) => {
	if(event.key === "Enter" && document.activeElement === input1.value) add();
});

defineExpose({
	getTasks,
	updateTasks
});
</script>