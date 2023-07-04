import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	test: {
		include: ['src/**/*Controller.spec.ts'],
		threads: false
	},
	plugins: [tsconfigPaths()]
});
