<template>
	<div class="whole">
		<topBar ref="topBar1"></topBar>
		<div class="content" @mouseenter="hideTop()">
			<listApp></listApp>
		</div>	
	</div>
</template>

<style lang="scss" scoped>
.whole{
	background-color: white;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.content{
	width: 100%;
	height: 100%;
	background-color: black;
	border: solid black 0.4cm;
	border-top: none;
	border-right: none;
	overflow: hidden;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';

const topBar1 = ref(null);

function hideTop(){
	topBar1.value.hide();
}
</script>