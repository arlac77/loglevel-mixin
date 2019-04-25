import {
  defineLoggerMethods,
  defaultLogLevels,
  defineLogLevelProperties
} from '../src/loglevel-mixin.mjs';

import test from 'ava';

function prepare() {
  /*
  let theValue = 0;
  let theLevel = 'none';
*/

  const someObject = {};
  const someOtherObject = {
    log(level, args) {
      someOtherObject.theLevel = level;
      someOtherObject.theValue = args;
    }
  };

  defineLoggerMethods(someObject, defaultLogLevels, function(level, message) {
    someObject.theLevel = level;
    someObject.theValue = message;
  });
  defineLogLevelProperties(someObject, defaultLogLevels, defaultLogLevels.info);

  defineLoggerMethods(someOtherObject);
  defineLogLevelProperties(someOtherObject);

  return { someObject, someOtherObject };
}

test('default info', t => {
  const { someObject } = prepare();
  t.is(someObject.logLevel, 'info');
});

test('levels set invalid fallback info', t => {
  const { someObject } = prepare();

  someObject.logLevel = 'unknown';
  t.is(someObject.logLevel, 'info');
});

test('levels', t => {
  const { someObject } = prepare();

  [
    'trace',
    'debug',
    'error',
    'notice',
    'warn',
    'debug',
    'info'
  ].forEach(level => {
    someObject.logLevel = level;
    t.is(someObject.logLevel, level);
  });
});

test('levels default info', t => {
  const { someObject, someOtherObject } = prepare();

  someOtherObject.logLevel = 'trace';
  t.is(someOtherObject.logLevel, 'trace');
  t.is(someObject.logLevel, 'info');
});

test('logging with levels info passes', t => {
  const { someObject } = prepare();

  someObject.info(level => 'info message');
  t.is(someObject.theValue, 'info message');
  t.is(someObject.theLevel, 'info');
});

test('logging with levels trace ignore', t => {
  const { someObject } = prepare();

  someObject.trace(level => 'trace message');
  t.is(someObject.theValue, undefined);
  t.is(someObject.theLevel, undefined);
});

test('logging with levels error passes', t => {
  const { someObject } = prepare();

  someObject.error(level => 'error message');
  t.is(someObject.theValue, 'error message');
  t.is(someObject.theLevel, 'error');
});
