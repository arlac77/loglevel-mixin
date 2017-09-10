/**
 * @module loglevel-mixin
 */

/**
 * default log levels
 */
export const defaultLogLevels = declareLevels([
  'trace',
  'debug',
  'info',
  'notice',
  'warn',
  'error',
  'crit',
  'alert'
]);

/**
 * Generate the loglevel objects out of a list of log level names.
 * @param {string[]} list A list of log level names. The last name in the list will become the one with the highest priority.
 * @return {object} levels object A hash with all the loglevels. Stored by there name.
 */
export function declareLevels(list) {
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
 * @param {object} object target where to assign properties to
 * @param {object} logLevels Hash with all the available loglevels. Stored by there name
 * @param {function} [theFunction] The function to be added under the loglevel name.
 *        This function will only be called if the current loglevel is greater equal
 *        the log level of the called logging function.
 *        By default a method log(level,message) will be used
 * @return {undefined}
 */
export function defineLoggerMethods(
  object,
  logLevels = defaultLogLevels,
  theFunction = undefined
) {
  const properties = {};

  Object.keys(logLevels).forEach(level => {
    const myLevel = logLevels[level].priority;
    const levelName = level;
    properties[levelName] = {
      value:
        theFunction !== undefined
          ? function(providerFunction) {
              if (this.logLevelPriority >= myLevel)
                if (typeof providerFunction === 'function') {
                  theFunction.call(
                    this,
                    levelName,
                    providerFunction(levelName)
                  );
                } else {
                  theFunction.call(this, levelName, providerFunction);
                }
            }
          : function(providerFunction) {
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
 * @class
 * @classdesc This function is a mixin for ES2015 classes.
 * @param {class} superclass class to be extendet
 * @param {object} [logLevels] Object with all the available loglevels. Stored by their name; defaults to defaultLogLevels
 * @param {string} [defaultLogLevel] the default value for the logLevel property; defaults to `info`
 * @return {class} newly created class ready to be further extendet/used
 * @example
 * ```js
 * import { LogLevelMixin } = from 'loglevel-mixin';
 * class BaseClass {
 *   log(level, message) { console.log(`${level} ${message}`); }
 * }
 * class LoggingEnabledClass extends LogLevelMixin(BaseClass) {
 * }
 * ```
 * @mixin
 */
export function LogLevelMixin(
  superclass,
  logLevels = defaultLogLevels,
  defaultLogLevel = defaultLogLevels.info
) {
  return class extends superclass {
    /**
     * set the log level to the default
     */
    constructor(...args) {
      super(...args);
      this._logLevel = defaultLogLevel;
    }

    /**
     * @return {string} name of the current log level
     */
    get logLevel() {
      return this._logLevel.name;
    }

    /**
     * Set the logging level.
     * if an unknown logLEvel is given the default logLevel will be used.
     * @param {string} level
     */
    set logLevel(level) {
      this._logLevel = logLevels[level] || defaultLogLevel;
    }

    /**
     * @return {number} priority of the current log level
     */
    get logLevelPriority() {
      return this._logLevel.priority;
    }
  };
}

/**
 * Declares two properties:
 *  logLevel {string} `info`,`error`,...
 *  logLevelPriority {number}
 *
 * @param {object} object target where the properties will be written into
 * @param {object} [logLevels=defaultLogLevels] Hash with all the available loglevels. Stored by there name; defaults to defaultLogLevels
 * @param {string} [defaultLogLevel=info] the default value for the properties; defaults to `info`
 */
export function defineLogLevelProperties(
  object,
  logLevels = defaultLogLevels,
  defaultLogLevel = defaultLogLevels.info
) {
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
 * Helper function to aggregate values into a log event
 * @param {string} level log level
 * @param {string|object} arg original log message - level and timestamp may be overwritten
 * @param {object} [args] additional values to be merged into the final log event - values have precedence
 * @return {object} suitable for log event processing
 */
export function makeLogEvent(level, arg, args) {
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
