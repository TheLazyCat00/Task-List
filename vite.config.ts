import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), Components({}),],
	base: process.env.NODE_ENV === 'production'
		? `./`
		: '/',
});