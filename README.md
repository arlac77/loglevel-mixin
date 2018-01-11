[![npm](https://img.shields.io/npm/v/loglevel-mixin.svg)](https://www.npmjs.com/package/loglevel-mixin)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/loglevel-mixin.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/loglevel-mixin)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://secure.travis-ci.org/arlac77/loglevel-mixin.png)](http://travis-ci.org/arlac77/loglevel-mixin)
[![bithound](https://www.bithound.io/github/arlac77/loglevel-mixin/badges/score.svg)](https://www.bithound.io/github/arlac77/loglevel-mixin)
[![codecov.io](http://codecov.io/github/arlac77/loglevel-mixin/coverage.svg?branch=master)](http://codecov.io/github/arlac77/loglevel-mixin?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/loglevel-mixin/badge.svg)](https://coveralls.io/r/arlac77/loglevel-mixin)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/loglevel-mixin/badge.svg)](https://snyk.io/test/github/arlac77/loglevel-mixin)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/loglevel-mixin.svg?style=flat-square)](https://github.com/arlac77/loglevel-mixin/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/loglevel-mixin.svg?label=ready&title=Ready)](http://waffle.io/arlac77/loglevel-mixin)
[![Dependency Status](https://david-dm.org/arlac77/loglevel-mixin.svg)](https://david-dm.org/arlac77/loglevel-mixin)
[![devDependency Status](https://david-dm.org/arlac77/loglevel-mixin/dev-status.svg)](https://david-dm.org/arlac77/loglevel-mixin#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/loglevel-mixin.svg?branch=master)](http://inch-ci.org/github/arlac77/loglevel-mixin)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![downloads](http://img.shields.io/npm/dm/loglevel-mixin.svg?style=flat-square)](https://npmjs.org/package/loglevel-mixin)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# loglevel-mixin

Injects methods named after a set of logLevels which are only forwarding messages. If the current logLevel is higher or equal to the logLevel the name of the called method reflects.

# usage

```javascript
const llm = require('loglevel-mixin');

let someObject = {
  log(level, message) {
    console.log(`${level} ${message}`);
  }
};

llm.defineLoggerMethods(someObject);
llm.defineLogLevelProperties(someObject);

someObject.logLevel = 'error';
someObject.info(
  level => 'my info message (not reported since logLevel is error)'
);
someObject.logLevel = 'info';
someObject.info(
  level => 'my info message (reported since logLevel is now info)'
);
```

## works for ES2015 classes to

```javascript
const llm = require('loglevel-mixin');

const LoggingEnabledClass = llm.LogLevelMixin(
  class BaseClass {
    log(level, message) {
      console.log(`${level} ${message}`);
    }
  }
);

const someObject = new LoggingEnabledClass();

someObject.logLevel = 'error';
someObject.info(
  level => 'my info message (not reported since logLevel is error)'
);
someObject.logLevel = 'info';
someObject.info(
  level => 'my info message (reported since logLevel is now info)'
);
```

# install

With [npm](http://npmjs.org) do:

```shell
npm install loglevel-mixin
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [loglevel-mixin](#loglevel-mixin)
-   [Loglevel](#loglevel)
-   [defaultLogLevels](#defaultloglevels)
-   [Logger](#logger)
-   [declareLevels](#declarelevels)
-   [defineLoggerMethods](#defineloggermethods)
-   [LogLevelMixin](#loglevelmixin)
-   [defineLogLevelProperties](#defineloglevelproperties)
-   [makeLogEvent](#makelogevent)

## loglevel-mixin

## Loglevel

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

**Properties**

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

## defaultLogLevels

default log levels

-   trace
-   debug
-   info
-   notice
-   warn
-   error
-   crit
-   alert

## Logger

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

**Properties**

-   `entry` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## declareLevels

Generate the loglevel objects out of a list of log level names.

**Parameters**

-   `list` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** A list of log level names. The last name in the list will become the one with the highest priority.

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** levels object A hash with all the loglevels. Stored by there name.

## defineLoggerMethods

<!-- skip-example -->

Adds logging methods to an existing object.
For each loglevel a method with the name of the log level will be created.

**Parameters**

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** target where to assign properties to
-   `logLevels` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Hash with all the available loglevels. Stored by there name (optional, default `defaultLogLevels`)
-   `theFunction` **[Logger](#logger)** to be added under the loglevel name.
           This function will only be called if the current loglevel is greater equal
           the log level of the called logging function.
           By default a method log(level,message) will be used (optional, default `undefined`)

**Examples**

```javascript
defineLoggerMethods( obj)
obj.info('info entry'); // will redirect to theFunction if obj.loglevel is at least info
obj.error('error entry'); // will redirect to theFunction if obj.loglevel is at least error
```

Returns **[undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 

## LogLevelMixin

<!-- skip-example -->

**Parameters**

-   `superclass` **class** class to be extendet
-   `logLevels` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object with all the available loglevels. Stored by their name (optional, default `defaultLogLevels`)
-   `defaultLogLevel` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the default value for the logLevel property (optional, default `defaultLogLevels.info`)

**Examples**

```javascript
import { LogLevelMixin } = from 'loglevel-mixin';
class BaseClass {
  log(level, message) { console.log(`${level} ${message}`); }
}
class LoggingEnabledClass extends LogLevelMixin(BaseClass) {
}
```

Returns **class** newly created class ready to be further extendet/used

## defineLogLevelProperties

Declares two properties:
 logLevel {string} `info`,`error`,...
 logLevelPriority {number}

**Parameters**

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** target where the properties will be written into
-   `logLevels` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Hash with all the available loglevels. Stored by there name (optional, default `defaultLogLevels`)
-   `defaultLogLevel` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the default value for the properties (optional, default `defaultLogLevels.info`)

## makeLogEvent

Helper function to aggregate values into a log event

**Parameters**

-   `level` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** log level
-   `arg` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** original log message - level and timestamp may be overwritten
-   `args` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** additional values to be merged into the final log event - values have precedence

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** suitable for log event processing

# license

BSD-2-Clause
