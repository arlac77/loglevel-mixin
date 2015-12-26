/* jslint node: true, esnext: true */

"use strict";

const logLevels = declareLevels(['trace', 'debug', 'info', 'notice', 'warn', 'error', 'crit', 'alert']);


exports.defaultLogLevels = logLevels;

function declareLevels(list) {
  const levels = {};
  let priority = list.length;

  list.forEach(name => {
    levels[name] = {
      name: name,
      priority: priority
    };
    priority -= 1;
  });

  return levels;
}

/**
 * Adds logging methods to an existing object.
 * For each loglevel a methos will be created.
 * info()
 * @param {Object} target object where to assign properties tp
 * @param {Function} theFunction Optional function to be added under the loglevel name.
 *        This function will only be called if the current loglevel is greater equal
 *        the log level of the called logging function.
 *        By default a method log(leve,message) will be used
 */
exports.defineLoggerMethods = function (object, logLevels, theFunction) {

  const properties = {};

  Object.keys(logLevels).forEach(level => {
    const myLevel = logLevels[level].priority;
    const levelName = level;
    properties[levelName] = {
      value: theFunction ?
        function (providerFunction) {
          if (this.logLevelPriority >= myLevel)
            theFunction(levelName, providerFunction(levelName));
        } : function (providerFunction) {
          if (this.logLevelPriority >= myLevel)
            this.log(levelName, providerFunction(levelName));
        }
    };
  });

  Object.defineProperties(object, properties);
};


/**
 * Declares two properties:
 *  logLevel {String} 'info','error',...
 *  logLevelPriority {Number}
 * @param {Object} properties target object where the properties will be written into
 * @param {String} defaultLogLevel the default value for the properties
 */
module.exports.LogLevelMixin = (superclass, logLevels, defaultLogLevel) => class extends superclass {
  constructor() {
    super();
    this._logLevel = defaultLogLevel;
  }

  get logLevel() {
    return this._logLevel.name;
  }
  set logLevel(level) {
    this._logLevel = logLevels[level] || defaultLogLevel;
  }
  get logLevelPriority() {
    return this._logLevel.priority;
  }
};


/**
 * Declares two properties:
 *  logLevel {String} 'info','error',...
 *  logLevelPriority {Number}
 * @param {Object} properties target object where the properties will be written into
 * @param {String} defaultLogLevel the default value for the properties
 */
exports.defineLogLevelProperties = function (object, logLevels, defaultLogLevel) {
  const properties = {};

  let logLevel = defaultLogLevel;

  properties.logLevel = {
    get: function () {
      return logLevel.name;
    },
    set: function (level) {
      logLevel = logLevels[level] || defaultLogLevel;
    }
  };

  properties.logLevelPriority = {
    get: function () {
      return logLevel.priority;
    }
  };

  Object.defineProperties(object, properties);
};
