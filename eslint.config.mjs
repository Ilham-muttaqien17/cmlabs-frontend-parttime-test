// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/unified-signatures': 'off',
    'vue/comma-dangle': ['error', 'never'],
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'off',
    'import/consistent-type-specifier-style': 'off'
  }
});
