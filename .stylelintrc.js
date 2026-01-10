module.exports = {
  plugins: ['stylelint-prettier', 'stylelint-order'],
  overrides: [
    {
      files: ['**/*.css'],
      extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
      rules: {},
    },
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'else',
          'each',
          '@each',
          'extends',
          'include',
          'mixin',
          'if',
          'content',
          'function',
          'return',
          'define-mixin',
          'for',
          'tailwind',
        ],
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['font-smoothing'],
      },
    ],
    'declaration-empty-line-before': 'never',
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-alphabetical-order': true,
    'no-descending-specificity': null,
    'selector-class-pattern':
      '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$',
    'declaration-colon-newline-after': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'custom-property-pattern': null,
    'prettier/prettier': true,
  },
};
