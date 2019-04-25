import { LogLevelMixin } from '../src/loglevel-mixin.mjs';

import test from 'ava';

class LoggingEnabledClass extends LogLevelMixin(
  class BaseClass {
    log(level, message) {
      this.theLevel = level;
      this.theValue = message;
    }
  }
) {}

test('class default info', t => {
  const someObject = new LoggingEnabledClass();
  t.is(someObject.logLevel, 'info');
});

test('class set invalid fallback info', t => {
  const someObject = new LoggingEnabledClass();
  someObject.logLevel = 'unknown';
  t.is(someObject.logLevel, 'info');
});

test('class set levels', t => {
  const someObject = new LoggingEnabledClass();

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

test('class default info not shared', t => {
  const someObject = new LoggingEnabledClass();
  const someOtherObject = new LoggingEnabledClass();
  someOtherObject.logLevel = 'trace';
  t.is(someObject.logLevel, 'info');
});

test('class logging info passes', t => {
  const someObject = new LoggingEnabledClass();
  someObject.info(level => 'info message');
  t.is(someObject.theValue, 'info message');
  t.is(someObject.theLevel, 'info');
});

test('class logging error passes', t => {
  const someObject = new LoggingEnabledClass();
  someObject.error(level => 'error message');
  t.is(someObject.theValue, 'error message');
  t.is(someObject.theLevel, 'error');
});

test('class logging trace ignored', t => {
  const someObject = new LoggingEnabledClass();
  someObject.trace(level => 'trace message');
  t.is(someObject.theValue, undefined);
  t.is(someObject.theLevel, undefined);
});
