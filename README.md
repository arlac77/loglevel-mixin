[![npm](https://img.shields.io/npm/v/loglevel-mixin.svg)](https://www.npmjs.com/package/loglevel-mixin)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/loglevel-mixin.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/loglevel-mixin)
[![Build Status](https://secure.travis-ci.org/arlac77/loglevel-mixin.png)](http://travis-ci.org/arlac77/loglevel-mixin)
[![bithound](https://www.bithound.io/github/arlac77/loglevel-mixin/badges/score.svg)](https://www.bithound.io/github/arlac77/loglevel-mixin)
[![codecov.io](http://codecov.io/github/arlac77/loglevel-mixin/coverage.svg?branch=master)](http://codecov.io/github/arlac77/loglevel-mixin?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/loglevel-mixin/badge.svg)](https://coveralls.io/r/arlac77/loglevel-mixin)
[![Code Climate](https://codeclimate.com/github/arlac77/loglevel-mixin/badges/gpa.svg)](https://codeclimate.com/github/arlac77/loglevel-mixin)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/loglevel-mixin/badge.svg)](https://snyk.io/test/github/arlac77/loglevel-mixin)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/loglevel-mixin.svg?style=flat-square)](https://github.com/arlac77/loglevel-mixin/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/loglevel-mixin.svg?label=ready&title=Ready)](http://waffle.io/arlac77/loglevel-mixin)
[![Dependency Status](https://david-dm.org/arlac77/loglevel-mixin.svg)](https://david-dm.org/arlac77/loglevel-mixin)
[![devDependency Status](https://david-dm.org/arlac77/loglevel-mixin/dev-status.svg)](https://david-dm.org/arlac77/loglevel-mixin#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/loglevel-mixin.svg?branch=master)](http://inch-ci.org/github/arlac77/loglevel-mixin)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![downloads](http://img.shields.io/npm/dm/loglevel-mixin.svg?style=flat-square)](https://npmjs.org/package/loglevel-mixin)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

loglevel-mixin
==============

Injects methods named after a set of logLevels which are only forwarding messages.
If the current logLevel is higher or equal to the logLevel the name of the called method reflects.


usage
=====

```javascript
const llm = require('loglevel-mixin');

let someObject = { log(level,message) { console.log(`${level} ${message}`); } };

llm.defineLoggerMethods(someObject);
llm.defineLogLevelProperties(someObject);

someObject.logLevel = 'error';
someObject.info( level => 'my info message (not reported since logLevel is error)')
someObject.logLevel = 'info';
someObject.info( level => 'my info message (reported since logLevel is now info)')
```

works for ES2015 classes to
---------------------------

```javascript
const llm = require('loglevel-mixin');

const LoggingEnabledClass = llm.LogLevelMixin(class BaseClass
{
  log(level, message) { console.log(`${level} ${message}`); }
});

const someObject = new LoggingEnabledClass();

someObject.logLevel = 'error';
someObject.info( level => 'my info message (not reported since logLevel is error)')
someObject.logLevel = 'info';
someObject.info( level => 'my info message (reported since logLevel is now info)')
```

install
=======

With [npm](http://npmjs.org) do:

```shell
npm install loglevel-mixin
```

# API Reference
- loglevel-mixin

* <a name="module_loglevel-mixin..declareLevels"></a>

## loglevel-mixin~declareLevels(list) ⇒ <code>object</code>
Generate the loglevel objects out of a list of log level names.

**Kind**: inner method of [<code>loglevel-mixin</code>](#module_loglevel-mixin)  
**Returns**: <code>object</code> - levels object A hash with all the loglevels. Stored by there name.  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array.&lt;string&gt;</code> | A list of log level names. The last name in the list will become the one with the highest priority. |


* <a name="module_loglevel-mixin..defineLoggerMethods"></a>

## loglevel-mixin~defineLoggerMethods(object, logLevels, [theFunction]) ⇒ <code>undefined</code>
Adds logging methods to an existing object.
For each loglevel a method with the name of the log level will be created.

**Kind**: inner method of [<code>loglevel-mixin</code>](#module_loglevel-mixin)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | target where to assign properties to |
| logLevels | <code>object</code> | Hash with all the available loglevels. Stored by there name |
| [theFunction] | <code>function</code> | The function to be added under the loglevel name.        This function will only be called if the current loglevel is greater equal        the log level of the called logging function.        By default a method log(level,message) will be used |


* <a name="<anonymous>..newClass"></a>

## &lt;anonymous&gt;~newClass()
set the log level to the default

**Kind**: inner method of <code>&lt;anonymous&gt;</code>  

* <a name="module_loglevel-mixin..defineLogLevelProperties"></a>

## loglevel-mixin~defineLogLevelProperties(object, [logLevels], [defaultLogLevel])
Declares two properties:
 logLevel {string} `info`,`error`,...
 logLevelPriority {number}

**Kind**: inner method of [<code>loglevel-mixin</code>](#module_loglevel-mixin)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>object</code> |  | target where the properties will be written into |
| [logLevels] | <code>object</code> | <code>defaultLogLevels</code> | Hash with all the available loglevels. Stored by there name; defaults to defaultLogLevels |
| [defaultLogLevel] | <code>string</code> | <code>&quot;info&quot;</code> | the default value for the properties; defaults to `info` |


* <a name="module_loglevel-mixin..makeLogEvent"></a>

## loglevel-mixin~makeLogEvent(level, arg, [args]) ⇒ <code>object</code>
Helper function to aggregate values into a log event

**Kind**: inner method of [<code>loglevel-mixin</code>](#module_loglevel-mixin)  
**Returns**: <code>object</code> - suitable for log event processing  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>string</code> | log level |
| arg | <code>string</code> \| <code>object</code> | original log message - level and timestamp may be overwritten |
| [args] | <code>object</code> | additional values to be merged into the final log event - values have precedence |


* * *

license
=======

BSD-2-Clause
