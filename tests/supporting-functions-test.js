import { makeLogEvent } from '../src/loglevel-mixin';

import test from 'ava';

test('makeLogEvent plain', t => {
  const le = makeLogEvent('error', 'the message');
  t.is(le.timestamp, Date.now(), 100);
  t.is(le.level, 'error');
  t.is(le.message, 'the message');
});

test('makeLogEvent empty', t => {
  const le = makeLogEvent('error');
  t.is(le.timestamp, Date.now(), 100);
  t.is(le.level, 'error');
  t.is(le.message, undefined);
});

test('makeLogEvent error object direct', t => {
  const le = makeLogEvent('error', new Error('the error'));
  t.is(Array.isArray(le.stack), true);
  t.is(le.message, 'the error');
});

test('makeLogEvent error object indirect', t => {
  const le = makeLogEvent('error', { error: new Error('the error') });
  t.is(Array.isArray(le.stack), true);
  t.is(le.message, 'the error');
});

test('makeLogEvent overwrite timestamp', t => {
  const le = makeLogEvent('error', {
    timestamp: 1234,
    message: 'the message'
  });
  t.is(le.timestamp, 1234, 100);
  t.is(le.level, 'error');
  t.is(le.message, 'the message');
});

test('makeLogEvent with additional object', t => {
  const le = makeLogEvent('error', 'the message', {
    key1: 'value1'
  });
  t.is(le.timestamp, Date.now(), 100);
  t.is(le.level, 'error');
  t.is(le.message, 'the message');
  t.is(le.key1, 'value1');
});

test('makeLogEvent with additional object deepth', t => {
  const le = makeLogEvent(
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

  t.is(le.timestamp, Date.now(), 100);
  t.is(le.level, 'error');
  t.is(le.message, 'the message');
  t.is(le.key1, 'value1');
  t.is(le.key2, 'value2');
  t.is(le.key3, 'value3');
});
