/**
 * @module loglevel-mixin
 */

/**
 * @callback Logger
 * @property {Object} entry
 */

/**
 * @typedef {Object} Loglevel
 * @property {string} name
 * @property {number} priority
 */

/**
 * default log levels
 * - trace
 * - debug
 * - info
 * - notice
 * - warn
 * - error
 * - crit
 * - alert
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
 * @return {Object} levels object A hash with all the loglevels. Stored by there name.
 */
export function declareLevels(list) {
  const levels = {};
  let priority = list.length;

  list.forEach(name => {
    levels[name] = {
      name,
      priority
    };
    priority -= 1;
  });

  return levels;
}

/**
 * <!-- skip-example -->
 * Adds logging methods to an existing object.
 * For each loglevel a method with the name of the log level will be created.
 * @param {Object} object target where to assign properties to
 * @param {Object} logLevels Hash with all the available loglevels. Stored by there name
 * @param {Logger} theFunction to be added under the loglevel name.
 *        This function will only be called if the current loglevel is greater equal
 *        the log level of the called logging function.
 *        By default a method log(level,message) will be used
 * @return {undefined}
 * @example
 * defineLoggerMethods( obj)
 * obj.info('info entry'); // will redirect to theFunction if obj.loglevel is at least info
 * obj.error('error entry'); // will redirect to theFunction if obj.loglevel is at least error
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
        theFunction === undefined
          ? function(providerFunction) {
              if (this.logLevelPriority >= myLevel) {
                this.log(
                  levelName,
                  typeof providerFunction === 'function'
                    ? providerFunction(levelName)
                    : providerFunction
                );
              }
            }
          : function(providerFunction) {
              if (this.logLevelPriority >= myLevel) {
                theFunction.call(
                  this,
                  levelName,
                  typeof providerFunction === 'function'
                    ? providerFunction(levelName)
                    : providerFunction
                );
              }
            },
      enumerable: true
    };
  });

  Object.defineProperties(object, properties);
}

const LOGLEVEL = Symbol('loglevel');

/**
 * <!-- skip-example -->
 * @class
 * @classdesc This function is a mixin for ES2015 classes.
 * @param {class} superclass class to be extendet
 * @param {Object} logLevels Object with all the available loglevels. Stored by their name
 * @param {string} defaultLogLevel the default value for the logLevel property
 * @return {class} newly created class ready to be further extendet/used
 * @example
 * import { LogLevelMixin } = from 'loglevel-mixin';
 * class BaseClass {
 *   log(level, message) { console.log(`${level} ${message}`); }
 * }
 * class LoggingEnabledClass extends LogLevelMixin(BaseClass) {
 * }
 * @mixin
 */
export function LogLevelMixin(
  superclass,
  logLevels = defaultLogLevels,
  defaultLogLevel = defaultLogLevels.info
) {
  const newClass = class extends superclass {
    /**
     * set the log level to the default
     */
    constructor(...args) {
      super(...args);
      this[LOGLEVEL] = defaultLogLevel;
    }

    /**
     * @return {string} name of the current log level
     */
    get logLevel() {
      return this[LOGLEVEL].name;
    }

    /**
     * Set the logging level.
     * if an unknown logLevel is given the default logLevel will be used.
     * @param {string} level
     */
    set logLevel(level) {
      this[LOGLEVEL] = logLevels[level] || defaultLogLevel;
    }

    /**
     * @return {number} priority of the current log level
     */
    get logLevelPriority() {
      return this[LOGLEVEL].priority;
    }
  };

  defineLoggerMethods(newClass.prototype, logLevels);
  return newClass;
}

/**
 * Declares two properties:
 *  logLevel {string} `info`,`error`,...
 *  logLevelPriority {number}
 *
 * @param {Object} object target where the properties will be written into
 * @param {Object} logLevels Hash with all the available loglevels. Stored by there name
 * @param {string} defaultLogLevel the default value for the properties
 */
export function defineLogLevelProperties(
  object,
  logLevels = defaultLogLevels,
  defaultLogLevel = defaultLogLevels.info
) {
  let logLevel = defaultLogLevel;

  Object.defineProperties(object, {
    logLevel: {
      get() {
        return logLevel.name;
      },
      set(level) {
        logLevel = logLevels[level] || defaultLogLevel;
      }
    },

    logLevelPriority: {
      get() {
        return logLevel.priority;
      }
    }
  });
}

/**
 * Helper function to aggregate values into a log event
 * @param {string} level log level
 * @param {string|Object} arg original log message - level and timestamp may be overwritten
 * @param {Object} [args] additional values to be merged into the final log event - values have precedence
 * @return {Object} suitable for log event processing
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
