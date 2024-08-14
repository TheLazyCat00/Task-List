<template>
	<div>
		<div class="container">
			<slot/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.container{
	border-left: solid black 0.1cm;
	padding-left: 0.3cm;
	margin-bottom: 0.8cm;
}
</style>