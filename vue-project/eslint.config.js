import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
      languageOptions: {
        globals: {
          ...globals.browser,
          // Vitest testing globals – make them read‑only for ESLint
          describe: 'readonly',
          it: 'readonly',
          test: 'readonly',
          expect: 'readonly',
          beforeEach: 'readonly',
          afterEach: 'readonly',
        },
      },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
])

