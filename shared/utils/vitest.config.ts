import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['__test__/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text'],
            reportsDirectory: './coverage',
            exclude: ['__test__/**/*.test.ts', 'vitest.config.ts'],
            thresholds: {
                statements: 95,
                functions: 95,
                branches: 85,
                lines: 80,
            }
        },
        watch:false
    },
    
})
