import globals from "globals";
import pluginJs from "@eslint/js";
import pluginObject from "@stylistic/eslint-plugin-js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
    'plugins': {
      '@stylistic/js': pluginObject
    },
    'rules': {
        'eqeqeq': 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
          'error', 'always'
        ],
        'arrow-spacing': [
          'error', { 'before': true, 'after': true }
        ],
        '@stylistic/js/indent': [
            'error',
            2
        ],
        '@stylistic/js/linebreak-style': [
            'error',
            'unix'
        ],
        '@stylistic/js/quotes': [
            'error',
            'single'
        ],
        '@stylistic/js/semi': [
            'error',
            'never'
        ],
    }
  }
];