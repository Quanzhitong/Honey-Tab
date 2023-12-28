const OFF = 0;

module.exports = {
    extends: '@yutengjing/eslint-config-react',
    rules: {
        'import/default': OFF,
        '@typescript-eslint/consistent-type-imports': 'error',
        // 'import/order': [
        //     'error',
        //     {
        //         groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        //         'newlines-between': 'never',
        //         pathGroupsExcludedImportTypes: ['type'],
        //     },
        // ],
    },
};
