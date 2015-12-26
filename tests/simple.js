/* global describe, it*/
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const llm = require('../LogLevelMixin');

describe('logging', function () {

  let theValue = 0;
  let theLevel = "none";

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

  llm.defineLoggerMethods(someOtherObject, llm.defaultLogLevels);
  llm.defineLogLevelProperties(someOtherObject, llm.defaultLogLevels, llm.defaultLogLevels.info);

  describe('levels', function () {
    it('default info', function () {
      assert.equal(someObject.logLevel, "info");
    });

    it('set invalid fallback info', function () {
      someObject.logLevel = "unknown";
      assert.equal(someObject.logLevel, "info");
    });

    ['trace', 'error', 'debug', 'info'].forEach(level => {
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
      someObject.error(level => "error message");
      assert.equal(theValue, 'error message');
      assert.equal(theLevel, 'error');
    });
  });
});
