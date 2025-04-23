import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./__test__/setup.ts'],
    include: ['__test__/**/*.test.ts'],
    watch: false,
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      reportsDirectory: './coverage',
      exclude: ['**/*.config.ts', 'dist', '**/index.ts'],
    }
  },
});
