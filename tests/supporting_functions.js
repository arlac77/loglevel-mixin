/* global describe, it*/
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const llm = require('../LogLevelMixin');

describe('makeLogEvent', () => {

  describe('plain', () => {
    const le = llm.makeLogEvent("error", "the message");
    it("has level", () => assert.equal(le.level, "error"));
    it("has message", () => assert.equal(le.message, "the message"));
  });

  describe('with additional object', () => {
    const le = llm.makeLogEvent("error", "the message", {
      "key1": "value1"
    });
    it("has level", () => assert.equal(le.level, "error"));
    it("has message", () => assert.equal(le.message, "the message"));
    it("has additional values", () => assert.equal(le.key1, "value1"));
  });

  describe('object and additional object', () => {
    const le = llm.makeLogEvent("error", {
      "message": "the message"
    }, {
      "key1": "value1"
    });
    it("has level", () => assert.equal(le.level, "error"));
    it("has message", () => assert.equal(le.message, "the message"));
    it("has additional values", () => assert.equal(le.key1, "value1"));
  });
});
