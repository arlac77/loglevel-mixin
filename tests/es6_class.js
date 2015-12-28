/* global describe, it*/
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const llm = require('../LogLevelMixin');

describe('logging with classes', function () {

  let theValue = 0;
  let theLevel = "none";


  class BaseClass {}

  llm.defineLoggerMethods(BaseClass.prototype, llm.defaultLogLevels);
  class LoggingEnabledBaseClass extends llm.LogLevelMixin(BaseClass, llm.defaultLogLevels,
    llm.defaultLogLevels['info']) {
    log(level, message) {
      theLevel = level;
      theValue = message;
    }
  }

  const someObject = new LoggingEnabledBaseClass();
  const someOtherObject = new LoggingEnabledBaseClass();

  describe('levels', function () {
    it('default info', function () {
      assert.equal(someObject.logLevel, "info");
    });

    it('set invalid fallback info', function () {
      someObject.logLevel = "unknown";
      assert.equal(someObject.logLevel, "info");
    });

    ['trace', 'debug', 'error', 'notice', 'warn', 'debug', 'info'].forEach(level => {
      it(`set ${level}`, function () {
        someObject.logLevel = level;
        assert.equal(someObject.logLevel, level);
      });
    });

    it('default info', function () {
      someOtherObject.logLevel = 'trace';
      assert.equal(someOtherObject.logLevel, "trace");
      assert.equal(someObject.logLevel, "info");
    });
  });

  describe('logging with levels', function () {
    it('info passes', function () {
      someObject.info(level => "info message");
      assert.equal(theValue, 'info message');
      assert.equal(theLevel, 'info');
    });
    it('trace ignored', function () {
      someObject.trace(level => "trace message");
      assert.equal(theValue, 'info message');
      assert.equal(theLevel, 'info');
    });
    it('error passes', function () {
      someObject.error("error message");
      assert.equal(theValue, 'error message');
      assert.equal(theLevel, 'error');
    });
  });
});
