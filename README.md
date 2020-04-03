[![npm](https://img.shields.io/npm/v/loglevel-mixin.svg)](https://www.npmjs.com/package/loglevel-mixin)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/loglevel-mixin)](https://bundlephobia.com/result?p=loglevel-mixin)
[![downloads](http://img.shields.io/npm/dm/loglevel-mixin.svg?style=flat-square)](https://npmjs.org/package/loglevel-mixin)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/loglevel-mixin.svg?style=flat-square)](https://github.com/arlac77/loglevel-mixin/issues)
[![Build Status](https://travis-ci.com/arlac77/loglevel-mixin.svg?branch=master)](https://travis-ci.com/arlac77/loglevel-mixin)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/loglevel-mixin)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/loglevel-mixin/badge.svg)](https://snyk.io/test/github/arlac77/loglevel-mixin)
[![codecov.io](http://codecov.io/github/arlac77/loglevel-mixin/coverage.svg?branch=master)](http://codecov.io/github/arlac77/loglevel-mixin?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/loglevel-mixin/badge.svg)](https://coveralls.io/r/arlac77/loglevel-mixin)

# loglevel-mixin

Injects methods named after a set of logLevels which are only forwarding messages. If the current logLevel is higher or equal to the logLevel the name of the called method reflects.

So the model object itself can be used as a logger and the log level is directly attaches to the model

# usage

<!-- skip-example -->

```javascript
import { defineLogLevelProperties, defineLoggerMethods } from 'loglevel-mixin';

let someObject = {
  log(severity, message) {
    console.log(`${severity} ${message}`);
  }
};

defineLoggerMethods(someObject);
defineLogLevelProperties(someObject);

someObject.logLevel = 'error';
someObject.info(
  severity => 'my info message (not reported since logLevel is error)'
);
someObject.logLevel = 'info';
someObject.info(
  severity => 'my info message (reported since logLevel is now info)'
);
```

## works for ES2015 classes to

<!-- skip-example -->

```javascript
import { LogLevelMixin } from 'loglevel-mixin';

const LoggingEnabledClass = LogLevelMixin(
  class BaseClass {
    log(level, message) {
      console.log(`${level} ${message}`);
    }
  }
);

const someObject = new LoggingEnabledClass();

someObject.logLevel = 'error';
someObject.info(
  severity => 'my info message (not reported since logLevel is error)'
);
someObject.logLevel = 'info';
someObject.info(
  severity => 'my info message (reported since logLevel is now info)'
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

-   [Logger](#logger)
    -   [Properties](#properties)
-   [Loglevel](#loglevel)
    -   [Properties](#properties-1)
-   [defaultLogLevels](#defaultloglevels)
-   [declareLevels](#declarelevels)
    -   [Parameters](#parameters)
-   [defineLoggerMethods](#defineloggermethods)
    -   [Parameters](#parameters-1)
    -   [Examples](#examples)
-   [LOGLEVEL](#loglevel-1)
-   [LogLevelMixin](#loglevelmixin)
    -   [Parameters](#parameters-2)
    -   [Examples](#examples-1)
-   [defineLogLevelProperties](#defineloglevelproperties)
    -   [Parameters](#parameters-3)
    -   [Properties](#properties-2)
-   [makeLogEvent](#makelogevent)
    -   [Parameters](#parameters-4)

## Logger

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

### Properties

-   `entry` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## Loglevel

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

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

## declareLevels

Generate the loglevel objects out of a list of log level names.

### Parameters

-   `list` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** A list of log level names. The last name in the list will become the one with the highest priority.

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** levels object a hash with all the loglevels. Stored by there name.

## defineLoggerMethods

<!-- skip-example -->

Adds logging methods to an existing object.
For each loglevel a method with the name of the log level will be created.

### Parameters

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** target where to assign properties to
-   `logLevels` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Hash with all the available loglevels. Stored by there name (optional, default `defaultLogLevels`)
-   `theFunction` **[Logger](#logger)** to be added under the loglevel name.
           This function will only be called if the current loglevel is greater equal
           the log level of the called logging function.
           By default a method log(level,message) will be used

### Examples

```javascript
defineLoggerMethods( obj)
obj.info('info entry'); // will redirect to theFunction if obj.loglevel is at least info
obj.error('error entry'); // will redirect to theFunction if obj.loglevel is at least error
```

Returns **[undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 

## LOGLEVEL

symbol holding the actual logLevel inside of the target object

## LogLevelMixin

<!-- skip-example -->

### Parameters

-   `superclass` **class** class to be extendet
-   `logLevels` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object with all the available loglevels. Stored by their name (optional, default `defaultLogLevels`)
-   `initialLogLevel` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the default value for the logLevel property (optional, default `defaultLogLevels.info`)

### Examples

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

### Parameters

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** target where the properties will be written into
-   `logLevels` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Hash with all the available loglevels. Stored by there name (optional, default `defaultLogLevels`)
-   `initialLogLevel` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the default value for the properties (optional, default `defaultLogLevels.info`)

### Properties

-   `logLevel` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** `info`,`error`,...
-   `logLevelPriority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

## makeLogEvent

Helper function to aggregate values into a log event

### Parameters

-   `severity` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** log severity
-   `arg` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** original log message - level may be overwritten
-   `args` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** additional values to be merged into the final log event - values have precedence

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** suitable for log event processing

# license

BSD-2-Clause
