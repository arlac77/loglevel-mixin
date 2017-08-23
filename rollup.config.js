/* jslint node: true, esnext: true */
'use strict';

export default {
  plugins: [],
  input: pkg.module,

  output: {
    format: 'cjs',
    file: pkg.main
  }
};
