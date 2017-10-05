import {
  LogLevelMixin,
  defineLoggerMethods,
  defaultLogLevels,
  defineLogLevelProperties
} from '../src/loglevel-mixin';

import test from 'ava';

function prepare() {
  return new LogLevelMixin(
    class BaseClass {
      log(level, message) {
        this.theLevel = level;
        this.theValue = message;
      }
    },
    defaultLogLevels,
    defaultLogLevels.info
  );
}

test('class default info', t => {
  const someObject = prepare();
  t.is(someObject.logLevel, 'info');
});

test('class set invalid fallback info', t => {
  const someObject = prepare();
  someObject.logLevel = 'unknown';
  t.is(someObject.logLevel, 'info');
});

test('class set levels', t => {
  const someObject = prepare();

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

/*
    it('default info', () => {
      someOtherObject.logLevel = 'trace';
      assert.equal(someOtherObject.logLevel, 'trace');
      assert.equal(someObject.logLevel, 'info');
    });
  });

  describe('logging with levels', function() {
    it('info passes', () => {
      someObject.info(level => 'info message');
      assert.equal(theValue, 'info message');
      assert.equal(theLevel, 'info');
    });
    it('trace ignored', () => {
      someObject.trace(level => 'trace message');
      assert.equal(theValue, 'info message');
      assert.equal(theLevel, 'info');
    });
    it('error passes', () => {
      someObject.error('error message');
      assert.equal(theValue, 'error message');
      assert.equal(theLevel, 'error');
    });
  });
});
*/
