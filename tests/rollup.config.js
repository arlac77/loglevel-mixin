export default ['base', 'es6-class', 'supporting-functions'].map(name => {
  return {
    input: `tests/${name}-test.js`,
    output: {
      file: `build/${name}-test.js`,
      format: 'cjs',
      sourcemap: true
    },
    external: ['ava']
  };
});
