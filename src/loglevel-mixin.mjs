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
  "trace",
  "debug",
  "info",
  "notice",
  "warn",
  "error",
  "crit",
  "alert"
]);

/**
 * Generate the loglevel objects out of a list of log level names.
 * @param {string[]} list A list of log level names. The last name in the list will become the one with the highest priority.
 * @return {Object} levels object a hash with all the loglevels. Stored by there name.
 */
export function declareLevels(list) {
  let priority = list.length;
  return Object.fromEntries(
    list.map(name => [name, { name, priority: priority-- }])
  );
}

/**
 * <!-- skip-example -->
 * Adds logging methods to an existing object.
 * For each loglevel a method with the name of the log level will be created.
 * @param {Object} object target where to assign properties to
 * @param {Object} logLevels Hash with all the available loglevels. Stored by there name
 * @param {Logger} [theFunction] to be added under the loglevel name.
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
  theFunction
) {
  Object.defineProperties(
    object,
    Object.fromEntries(
      Object.entries(logLevels).map(([name, level]) => {
        const priority = level.priority;
        return [
          name,
          {
            value:
              theFunction === undefined
                ? function (arg, ...args) {
                    if (this.logLevelPriority >= priority) {
                      this.log(
                        name,
                        typeof arg === "function" ? arg(name) : arg,
                        ...args
                      );
                    }
                  }
                : function (arg, ...args) {
                    if (this.logLevelPriority >= priority) {
                      theFunction.call(
                        this,
                        name,
                        typeof arg === "function" ? arg(name) : arg,
                        ...args
                      );
                    }
                  },
            enumerable: true
          }
        ];
      })
    )
  );
}

/**
 * <!-- skip-example -->
 * @class
 * @classdesc This function is a mixin for ES2015 classes.
 * @param {Object} superclass class to be extendet
 * @param {Object} logLevels Object with all the available loglevels. Stored by their name
 * @param {Loglevel} initialLogLevel the default value for the logLevel property
 * @return {Object} newly created class ready to be further extendet/used
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
  initialLogLevel = defaultLogLevels.info
) {
  const newClass = class extends superclass {
    #logLevel = initialLogLevel;

    /**
     * @return {string} name of the current log level
     */
    get logLevel() {
      return this.#logLevel.name;
    }

    /**
     * Set the logging level.
     * if an unknown logLevel is given the default logLevel will be used.
     * @param {string} level
     */
    set logLevel(level) {
      this.#logLevel = logLevels[level] || initialLogLevel;
    }

    /**
     * @return {number} priority of the current log level
     */
    get logLevelPriority() {
      return this.#logLevel.priority;
    }
  };

  defineLoggerMethods(newClass.prototype, logLevels);
  return newClass;
}

/**
 * Helper function to aggregate values into a log event.
 * @param {string} severity log severity
 * @param {string|Object} arg original log message - level may be overwritten
 * @param {Object} [args] additional values to be merged into the final log event - values have precedence
 * @return {Object} suitable for log event processing
 */
export function makeLogEvent(severity, arg, args) {
  if (typeof arg === "string") {
    return { severity, message: arg, ...args };
  } else {
    if (arg === undefined) {
      return {
        severity,
        ...args
      };
    }

    const logevent = {
      severity,
      ...arg,
      ...args
    };

    if (arg instanceof Error) {
      mapError(logevent, arg);
    } else if (arg.error instanceof Error) {
      mapError(logevent, arg.error);
    }

    return logevent;
  }
}

function mapError(logevent, error) {
  if (error.stack) {
    logevent.stack = error.stack.split(/\n/).map(l => l.trim());
  }
  logevent.message = error.message;
}
