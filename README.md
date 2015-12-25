loglevel-mixin
==============

[![npm](https://img.shields.io/npm/v/loglevel-mixin.svg)](https://www.npmjs.com/package/loglevel-mixin)[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/loglevel-mixin)[![Build Status](https://secure.travis-ci.org/arlac77/loglevel-mixin.png)](http://travis-ci.org/arlac77/loglevel-mixin)[![Coverage Status](https://coveralls.io/repos/arlac77/loglevel-mixin/badge.svg)](https://coveralls.io/r/arlac77/loglevel-mixin)[![Code Climate](https://codeclimate.com/github/arlac77/loglevel-mixin/badges/gpa.svg)](https://codeclimate.com/github/arlac77/loglevel-mixin)[![GitHub Issues](https://img.shields.io/github/issues/arlac77/loglevel-mixin.svg?style=flat-square)](https://github.com/arlac77/loglevel-mixin/issues)[![Dependency Status](https://david-dm.org/arlac77/loglevel-mixin.svg)](https://david-dm.org/arlac77/loglevel-mixin)[![devDependency Status](https://david-dm.org/arlac77/loglevel-mixin/dev-status.svg)](https://david-dm.org/arlac77/loglevel-mixin#info=devDependencies)[![docs](http://inch-ci.org/github/arlac77/loglevel-mixin.svg?branch=master)](http://inch-ci.org/github/arlac77/loglevel-mixin)[![downloads](http://img.shields.io/npm/dm/loglevel-mixin.svg?style=flat-square)](https://npmjs.org/package/loglevel-mixin)

usage
=====

```
const llm = require(`loglevel-mixin`);

let someObject = { log(level,message) { console.log(`${level} ${message}`); } };

llm.defineLoggerMethods(someObject,
  llm.defaultLogLevels);
llm.defineLogLevelProperties(someObject,
  llm.defaultLogLevels,
  llm.defaultLogLevels.info);

someObject.info( level => "my info message")

someObject.logLevel = 'error';

someObject.info( level => "my info message (not reported)")
```

for es6 classes to
------------------

```
const llm = require(`loglevel-mixin`);

class BaseClass {
  log(level, message) { console.log(`${level} ${message}`); } }
}

llm.defineLoggerMethods(BaseClass.prototype, llm.defaultLogLevels);
class LoggingEnabledBaseClass extends llm.LogLevelMixin(BaseClass, llm.defaultLogLevels,
  llm.defaultLogLevels['info']) {}

const someObject = new LoggingEnabledBaseClass();
someObject.info( level => "my info message")
someObject.logLevel = 'error';

someObject.info( level => "my info message (not reported)")


```

install
=======

With [npm](http://npmjs.org) do:

```
npm install uti
```

license
=======

BSD-2-Clause
