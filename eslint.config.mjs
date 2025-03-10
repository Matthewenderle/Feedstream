// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'import/first': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-mutating-props': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/require-prop-types': 'off',
    'require-await': 'off',
    'vue/require-default-prop': 'off',
    'vue/prop-name-casing': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'vue/no-v-for-template-key': 'off',
    'no-warning-comments': 'off',
  },
});
