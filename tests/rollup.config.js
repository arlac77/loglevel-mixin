import istanbul from 'rollup-plugin-istanbul';

import multiEntry from 'rollup-plugin-multi-entry';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
const external = ['ava'];
const format = 'cjs';
const sourcemap = true;

export default [
  {
    input: `tests/base-test.js`,
    output: {
      file: `build/base-test.js`,
      format,
      sourcemap
    },
    external
  },
  {
    input: `tests/es6-class-test.js`,
    output: {
      file: `build/es6-class-test.js`,
      format,
      sourcemap
    },
    external
  },
  {
    input: `tests/supporting-functions-test.js`,
    output: {
      file: `build/supporting-functions-test.js`,
      format,
      sourcemap
    },
    external
  }
];
