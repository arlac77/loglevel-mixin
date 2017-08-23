import pkg from './package.json';

export default {
  plugins: [],
  input: pkg.module,

  output: {
    format: 'cjs',
    file: pkg.main
  }
};
