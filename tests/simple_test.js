/* global describe, it*/
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const llm = require('../dist/LogLevelMixin');

describe('logging', () => {
  let theValue = 0;
  let theLevel = 'none';

  const someObject = {};
  const someOtherObject = {
    log(level, args) {
      theLevel = level;
      theValue = args;
    }
  };

  llm.defineLoggerMethods(someObject, llm.defaultLogLevels, function (level, message) {
    theLevel = level;
    theValue = message;
  });
  llm.defineLogLevelProperties(someObject, llm.defaultLogLevels, llm.defaultLogLevels.info);

  llm.defineLoggerMethods(someOtherObject);
  llm.defineLogLevelProperties(someOtherObject);

  describe('levels', () => {
    it('default info', () => assert.equal(someObject.logLevel, 'info'));

    it('set invalid fallback info', () => {
      someObject.logLevel = 'unknown';
      assert.equal(someObject.logLevel, 'info');
    });

    ['trace', 'debug', 'error', 'notice', 'warn', 'debug', 'info'].forEach(level => {
      it(`set ${level}`, () => {
        someObject.logLevel = level;
        assert.equal(someObject.logLevel, level);
      });
    });

    it('default info', () => {
      someOtherObject.logLevel = 'trace';
      assert.equal(someOtherObject.logLevel, 'trace');
      assert.equal(someObject.logLevel, 'info');
    });
  });

  describe('logging with levels', () => {
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
