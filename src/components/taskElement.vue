<template>
	<div class="taskElement">
		<div class="whole">
			<div class="container" :style="style">
				<p ref="taskText" class="taskText"></p>
				<div class="button">
					<button @click="goToEditor" ref="goToEditorButton">
						<img src="../assets/textIcon.svg">
					</button>
					<button @click="emit('toggleDone')">
						<img src="../assets/check.svg" class="check">
					</button>
					<button @click="emit('deleteTask')">
						<img src="../assets/trash.svg" class="trash">
					</button>
					<button class="expand" @click="toggleDisplay" ref="expandButton">
						<p ref="expand">&lt;</p>
					</button>
				</div>
			</div>
			<div class="child" ref="child">
				<elementWithLine>
					<input1 :tasks1="props.tasks" ref="input" @sendList="changeExpandDisplay"/>
				</elementWithLine>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$topbackground: hsl(249, 100%, 18%);
$expandColor: hsl(269, 100%, 32%);
$othersColor: hsl(27, 100%, 24%);

.taskElement{
	width: 100%;
}

.whole{
	display: flex;
	justify-content: center;
	flex-direction: column;
}

.child{
	display: none;
	overflow: hidden;
	margin-top: 0.4cm;
	transition: height 0.3s, margin-top 0.3s;
}

.container{
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	background-color: $topbackground;
	height: 1cm;
	border-radius: 0.2cm;
	padding-left: 0.2cm;
	padding-right: 0.2cm;
}

.container:hover{
	box-shadow: inset 0 100cm hsla(57, 100%, 50%, 0.2);
}

.taskText{
	color: white;
	overflow-x: scroll;
	width: 100%;
	white-space: nowrap;
}

.button{
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.2cm;	
}

.button > button{
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	background-color: $othersColor;
	height: 0.6cm;
	width: 0.6cm;
	border-radius: 0.1cm;
	padding: 0.1cm;
}

.check{
	width: 100%;
}

.trash{
	height: 100%;
}

.expand{
	padding: 0 !important;
	background-color: $expandColor !important;
	p{
		transition: transform 0.3s;
		user-select: none;
	}
}

.expandSpecial{
	padding: 0 !important;
	background-color: hsl(48, 83%, 31%) !important;
	p{
		transition: transform 0.3s;
		user-select: none;
	}
}
</style>

<script setup lang="ts">
import { watch, Ref, ref, onMounted } from 'vue';
import { globalState, eventBus } from '../state';

interface Task{
	top: {
		text: string,
		done: number
	},
	bottom: Object
}

const props = defineProps({
	text: {
		type: String,
		required: true
	},
	done: {
		type: Number,
		required: true
	},
	tasks: {
		type: Array<Task>,
		required: false
	},
	image: {
		type: String,
		required: true
	},
	isExpanded: {
		type: Boolean,
		required: true
	}
});

const emit = defineEmits(["deleteTask", "toggleDone"]);

const child: Ref<HTMLDivElement> = ref(null);
const expand: Ref<HTMLButtonElement> = ref(null);
const taskText: Ref<HTMLParagraphElement> = ref(null);
const expandButton: Ref<HTMLButtonElement> = ref(null);
const goToEditorButton: Ref<HTMLButtonElement> = ref(null);
const input = ref(null);

const colors = ["hsl(249, 100%, 18%)", "hsl(100, 96%, 13%)"];
let height: number;
let underConstruction: boolean;
let style = ref(`background-color: ${colors[props.done]};`);
let image = props.image;
let isThisElement = false;
let isExpanded = props.isExpanded;
let throughUser = false;

function toggleDisplay(){
	isExpanded = !isExpanded;
	if(isExpanded){
		throughUser = true;
	}
	displayChildren();
}

function displayChildren(){
	if(underConstruction) return;
	underConstruction = true;
	if(isExpanded){
		child.value.style.display = "inline-block";
		child.value.style.height = "";
		height = child.value.clientHeight;
		child.value.style.height = "0";
		expand.value.style.transform = "rotate(-90deg)";
		setTimeout(() => {
			child.value.style.height = height + "px";
			child.value.style.marginTop = "0.4cm";
		}, 1)
		setTimeout(() => {
			child.value.style.height = "";
			underConstruction = false;
		}, 300);
	}
	else{
		height = child.value.clientHeight;
		child.value.style.height = height + "px";
		expand.value.style.transform = "";
		setTimeout(() => {
			child.value.style.height = "0";
			child.value.style.marginTop = "0";
		}, 1);
		setTimeout(() => {
			child.value.style.display = "none";
			underConstruction = false;
		}, 300);
		throughUser = false;
	}
}

function displayChildrenNoAnim(){
	if(underConstruction) return;
	underConstruction = true;
	if(isExpanded){
		expand.value.style.transform = "rotate(-90deg)";
		child.value.style.display = "inline-block";
		child.value.style.height = "";
		child.value.style.marginTop = "0.4cm";
		underConstruction = false;
	}
	else{
		expand.value.style.transform = "";
		child.value.style.display = "none";
		child.value.style.height = "0";
		child.value.style.marginTop = "0";
		underConstruction = false;
		throughUser = false;
	}
}

function closing(){
	return {top: {text: props.text, done: props.done, image, isExpanded}, bottom: input.value.getTasks()};
}

function changeRangeDisplay(finishDate){
	if(finishDate){
		style.value = getLoadingBar([getDate().getFullYear(), finishDate.month - 1, finishDate.day], props.done);
	}
	else{
		style.value = `background-color: ${colors[props.done]};`;
	}
}

function modifyText(){
	let data = extractInformation(props.text);
	taskText.value.innerHTML = data.string;
	changeRangeDisplay(data.finishDate);
	setInterval(() => {
		changeRangeDisplay(data.finishDate);
	}, 60000);
}

function extractInformation(text: string){
	let string = text;
	let bracketsPattern = /\[(.*?)]/g;
	let datePattern = /\d+\.\d+/;
	let splittingPattern = /\s*\,\s*/;
	let urlPattern = /https?:\/{2}[^\/]|file:\\{3}[^\\]/;
	let matches = [...string.matchAll(bracketsPattern)];
	let results = matches.map(match => match[1]);

	let weekDays;
	let finishDate;

	results.forEach(match => {
		let keyValuePair = match.split(splittingPattern)

		if (match === "cycle"){
			weekDays = [1, 2, 3, 4, 5, 6, 7];
		}
		else if (datePattern.test(match)){
			let day = parseInt(match.split(".")[0]);
			let month = parseInt(match.split(".")[1]);
			finishDate = {day, month};
		}
		else if (!weekDays && keyValuePair[0] === "weekDays"){
			weekDays = keyValuePair[1].replace(/\s+/g, '').split('').map(Number);
		}
		else if (urlPattern.test(keyValuePair[0])){
			let replaceString = `[${match}]`;
			let urlConstruct = `<a href="${keyValuePair[0]}">${keyValuePair[1] || keyValuePair[0]}</a>`;
			string = string.replace(replaceString, urlConstruct);
		}
	});
	return {weekDays, finishDate, string};
}

function getDate(){
	let MyDate = new Date();
	return MyDate;
}

function getDifferenceInDays(further, closer){
	let differenceMs = further - closer;
	return differenceMs/(1000*60*60*24);
}

function getLoadingBar(thisFinishDate, color: number){
	let finishDate = new Date(thisFinishDate[0], thisFinishDate[1], thisFinishDate[2]);
	if (getDifferenceInDays(finishDate, getDate()) < 0) {
		finishDate.setFullYear(finishDate.getFullYear() + 1);
	}
	let timeLeft = getDifferenceInDays(finishDate, getDate());
	let proportional = 100;
	let firstColor = "hsl(32, 92%, 34%)";
	if (timeLeft <= 7) {
		proportional = timeLeft/7*100;
	}
	if (timeLeft <= 1) {
		firstColor = "hsl(0, 94%, 25%)";
	}
    return `
		background-image: 
			linear-gradient(to right, rgba(255, 255, 255, 0.2) 0.1cm, transparent 0.1cm), 
			linear-gradient(90deg, ${firstColor} 0%, ${100 - proportional}%, ${colors[color]} ${100 - proportional}%, ${colors[color]} 100%);
		background-size: calc((100% + 0.1cm + 1px)/7) 100%, cover;
		background-repeat: repeat, no-repeat;
		background-position: calc(-0.1cm - 1px) 0, 0 0;
	`;
}

function changeExpandDisplay(tasks){
	if (tasks.length > 0) {
		expandButton.value.classList.remove("expand");
		expandButton.value.classList.add("expandSpecial");
	}
	else{
		expandButton.value.classList.remove("expandSpecial");
		expandButton.value.classList.add("expand");
	}
}

function goToEditor(){
	isThisElement = true;
	globalState.shapeForEditor = image;
	if(!globalState.editorIsReady){
		eventBus.emit("hideList", {});
		globalState.editorIsReady = true;
	}
	else{
		eventBus.emit("goToEditor", {});
	}
}

function changeButtonEditorColor(){
	if(image !== `<title style="pointer-events:inherit">Layer 1</title>` && image !== ""){
		goToEditorButton.value.style.backgroundColor = "hsl(48, 83%, 31%)";
	}
	else{
		goToEditorButton.value.style.backgroundColor = "";
	}
}

defineExpose({
	closing,
	modifyText
});

onMounted(() => {
	modifyText();
	changeButtonEditorColor();
	changeExpandDisplay(props.tasks || []);
	displayChildren();
});

watch(props, () => {
	modifyText();
	image = props.image;
	changeButtonEditorColor();
	changeExpandDisplay(props.tasks || []);
	input.value.updateTasks(props.tasks);
	// if(props.isExpanded != isExpanded && !throughUser){
	// 	isExpanded = props.isExpanded;
	// 	displayChildrenNoAnim();
	// }
});

eventBus.on("goToList", () => {
	if(isThisElement){
		image = globalState.shapeForList;
		isThisElement = false;
		changeButtonEditorColor();
	}
});

eventBus.on("goToListClosing", () => {
	if(isThisElement){
		image = globalState.shapeForList;
		isThisElement = false;
		changeButtonEditorColor();
	}
});
</script>