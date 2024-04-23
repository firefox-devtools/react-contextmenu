import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';
import { FlatCompat } from '@eslint/eslintrc';

// Useful function tool to more easily merge external shared configuration for a
// specific files filter.
function configsForFiles({ files, configs }) {
    return configs.map(config => ({ ...config, files }));
}

// Useful to import legacy shared configuration
const compat = new FlatCompat();

export default [
    ...compat.extends('vkbansal', 'vkbansal/react'),
    {
        languageOptions: {
            parser: babelParser,
            globals: {
                ...globals.browser
            }
        },
        rules: {
            'react/no-array-index-key': 'off'
        },
        settings: {
            react: {
                version: 'detect'
            }
        }
    },
    ...configsForFiles({
        files: ['**/tests/*.js'],
        configs: [
            jest.configs['flat/recommended'],
            jestDom.configs['flat/recommended'],
            testingLibrary.configs['flat/react'],
            {
                rules: {
                    'prefer-arrow-callback': 'off',
                    'no-mixed-requires': 'off',
                    // This disallows using direct Node properties (eg: firstChild), but we
                    // have legitimate uses:
                    'testing-library/no-node-access': 'off',
                    'import/no-extraneous-dependencies': [
                        'error',
                        { devDependencies: true }
                    ]
                }
            }
        ]
    }),
    {
        files: ['**/examples/*.js'],
        settings: {
            'import/resolver': {
                webpack: {
                    config: 'examples/webpack.config.js'
                }
            }
        },
        rules: {
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
        }
    },
    {
        files: ['eslint.config.mjs'],
        rules: {
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
        }
    }
];
