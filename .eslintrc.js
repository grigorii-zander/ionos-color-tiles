module.exports = {
  root: true,
  extends: ['plugin:react/recommended', 'plugin:prettier/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/prop-types': 'off',
    'react/display-name': 0,
    'react/react-in-jsx-scope': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
