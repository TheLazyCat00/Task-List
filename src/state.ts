import { reactive } from 'vue';

export const globalState = reactive({
	shapeForEditor: null,
	shapeForList: null,
	editorIsReady: false
});

export const eventBus = reactive({
	events: {},

	on(event, callback) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(callback);
	},

	emit(event, data) {
		if (this.events[event]) {
			this.events[event].forEach(callback => callback(data));
		}
	},

	off(event, callback) {
		if (this.events[event]) {
			this.events[event] = this.events[event].filter(cb => cb !== callback);
		}
	}
});