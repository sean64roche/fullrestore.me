import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			allow: [],
		},
		allowedHosts: ['localhost', '127.0.0.1', 'v2202505274840342452.luckysrv.de', 'fullrestore.me'],
	},
	optimizeDeps: {
		exclude: ['node_modules/.cache'],
	}
});
