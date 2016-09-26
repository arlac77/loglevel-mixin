/* jslint node: true, esnext: true */

'use strict';

/**
 * default log levels
 */
const defaultLogLevels = declareLevels(['trace', 'debug', 'info', 'notice', 'warn', 'error', 'crit', 'alert']);

/**
 * Generate the loglevel objects out of a list of log level names.
 * @param {string[]} list A list of log level names. The last name in the list will become the one with the highest priority.
 * @return {Object} levels object A hash with all the loglevels. Stored by there name.
 */
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
 * For each loglevel a method with the name of the log level will be created.
 * @param {Object} target object where to assign properties tp
 * @param {Object} logLevels Hash with all the available loglevels. Stored by there name
 * @param {Function} theFunction The function to be added under the loglevel name.
 *        This function will only be called if the current loglevel is greater equal
 *        the log level of the called logging function.
 *        By default a method log(level,message) will be used
 */
function defineLoggerMethods(object, logLevels = defaultLogLevels, theFunction = undefined) {
  const properties = {};

  Object.keys(logLevels).forEach(level => {
    const myLevel = logLevels[level].priority;
    const levelName = level;
    properties[levelName] = {
      value: theFunction !== undefined ?
        function (providerFunction) {
          if (this.logLevelPriority >= myLevel)
            if (typeof providerFunction === 'function') {
              theFunction.call(this, levelName, providerFunction(levelName));
            } else {
              theFunction.call(this, levelName, providerFunction);
            }
        } : function (providerFunction) {
          if (this.logLevelPriority >= myLevel)
            if (typeof providerFunction === 'function') {
              this.log(levelName, providerFunction(levelName));
            } else {
              this.log(levelName, providerFunction);
            }
        },
      enumerable: true
    };
  });

  Object.defineProperties(object, properties);
}


/**
 * Declares two properties:
 * logLevel {String} `info`,`error`,...
 * logLevelPriority {Number}
 * This is method if for classes
 * @param {Object} properties target object where the properties will be written into
 * @param {Object} logLevels Object with all the available loglevels. Stored by their name; defaults to defaultLogLevels
 * @param {String} defaultLogLevel the default value for the logLevel property; defaults to `info`
 */
function LogLevelMixin(superclass, logLevels = defaultLogLevels, defaultLogLevel = defaultLogLevels.info) {
  return class extends superclass {
    constructor() {
      super();
      this._logLevel = defaultLogLevel;
    }

    get logLevel() {
      return this._logLevel.name;
    }

    /**
     * Set the logging level
     * @param {String} level
     */
    set logLevel(level) {
      this._logLevel = logLevels[level] || defaultLogLevel;
    }
    get logLevelPriority() {
      return this._logLevel.priority;
    }
  };
}

/**
 * Declares two properties:
 *  logLevel {String} `info`,`error`,...
 *  logLevelPriority {Number}
 *
 * @param {Object} properties target object where the properties will be written into
 * @param {Object} logLevels Hash with all the available loglevels. Stored by there name; defaults to defaultLogLevels
 * @param {String} defaultLogLevel the default value for the properties; defaults to `info`
 */
function defineLogLevelProperties(object, logLevels = defaultLogLevels, defaultLogLevel = defaultLogLevels.info) {
  const properties = {};

  let logLevel = defaultLogLevel;

  properties.logLevel = {
    get() {
        return logLevel.name;
      },
      set(level) {
        logLevel = logLevels[level] || defaultLogLevel;
      }
  };

  properties.logLevelPriority = {
    get() {
      return logLevel.priority;
    }
  };

  Object.defineProperties(object, properties);
}

/**
 * Helper function to aggregates values into a log event
 * @param {String} level log level
 * @param {String|Object} arg original log message - level and timestamp may be overwritten
 * @param {Object} args additional values to be merged into the final log event - values have precedence
 * @return {Object} suitable for log event processing
 */
function makeLogEvent(level, arg, args) {
  const logevent = {
    timestamp: Date.now(),
    level: level
  };

  if (typeof arg === 'string') {
    logevent.message = arg;
    return Object.assign(logevent, args);
  } else {
    if (arg === undefined) {
      return Object.assign(logevent, args);
    }

    if (arg instanceof Error) {
      mapError(logevent, arg);
    } else if (arg.error instanceof Error) {
      mapError(logevent, arg.error);
    }

    return Object.assign(logevent, arg, args);
  }
}

function mapError(logevent, error) {
  if (error.stack) {
    logevent.stack = error.stack.split(/\n/).map(l => l.trim());
  }
  logevent.message = error.message;
}

export {
  defaultLogLevels,
  defineLoggerMethods,
  LogLevelMixin,
  defineLogLevelProperties,
  makeLogEvent
};
