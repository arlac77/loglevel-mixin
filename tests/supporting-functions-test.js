/* global describe, it*/
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const llm = require('../dist/loglevel-mixin');

describe('makeLogEvent', () => {
  describe('plain', () => {
    const le = llm.makeLogEvent('error', 'the message');
    it('has timestamp', () => assert.closeTo(le.timestamp, Date.now(), 100));
    it('has level', () => assert.equal(le.level, 'error'));
    it('has message', () => assert.equal(le.message, 'the message'));
  });

  describe('empty', () => {
    const le = llm.makeLogEvent('error');
    it('has timestamp', () => assert.closeTo(le.timestamp, Date.now(), 100));
    it('has level', () => assert.equal(le.level, 'error'));
    it('undefined message', () => assert.isUndefined(le.message));
  });

  describe('error object', () => {
    describe('direct', () => {
      const le = llm.makeLogEvent('error', new Error('the error'));
      it('has stack', () => assert.isArray(le.stack));
      it('has error message', () => assert.equal(le.message, 'the error'));
    });
    describe('indirect', () => {
      const le = llm.makeLogEvent('error', {
        error: new Error('the error')
      });
      it('has stack', () => assert.isArray(le.stack));
      it('has error message', () => assert.equal(le.message, 'the error'));
    });
  });

  describe('overwrite timestamp', () => {
    const le = llm.makeLogEvent('error', {
      timestamp: 1234,
      message: 'the message'
    });
    it('has timestamp', () => assert.closeTo(le.timestamp, 1234, 100));
    it('has level', () => assert.equal(le.level, 'error'));
    it('has message', () => assert.equal(le.message, 'the message'));
  });

  describe('with additional object', () => {
    const le = llm.makeLogEvent('error', 'the message', {
      key1: 'value1'
    });
    it('has timestamp', () => assert.closeTo(le.timestamp, Date.now(), 100));
    it('has level', () => assert.equal(le.level, 'error'));
    it('has message', () => assert.equal(le.message, 'the message'));
    it('has additional values', () => assert.equal(le.key1, 'value1'));
  });

  describe('object and additional object', () => {
    const le = llm.makeLogEvent(
      'error',
      {
        message: 'the message',
        key2: 'value2',
        key3: 'value2'
      },
      {
        key1: 'value1',
        key3: 'value3'
      }
    );
    it('has timestamp', () => assert.closeTo(le.timestamp, Date.now(), 200));
    it('has level', () => assert.equal(le.level, 'error'));
    it('has message', () => assert.equal(le.message, 'the message'));
    it('has additional values 1', () => assert.equal(le.key1, 'value1'));
    it('has additional values 2', () => assert.equal(le.key2, 'value2'));
    it('has additional values 3', () => assert.equal(le.key3, 'value3'));
  });
});
