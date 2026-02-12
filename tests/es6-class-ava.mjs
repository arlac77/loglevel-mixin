import test from "ava";
import { LogLevelMixin } from "loglevel-mixin";

class LoggingEnabledClass extends LogLevelMixin(
  class BaseClass {
    log(level, ...args) {
      this.theLevel = level;
      this.arg = args[0];
      this.args = args;
    }
  }
) {}

test("class default info", t => {
  const someObject = new LoggingEnabledClass();
  t.is(someObject.logLevel, "info");
});

test("class set invalid keep old loglevel", t => {
  const someObject = new LoggingEnabledClass();
  someObject.logLevel = "trace";
  someObject.logLevel = "unknown";
  t.is(someObject.logLevel, "trace");
});

test("class set levels", t => {
  const someObject = new LoggingEnabledClass();

  ["trace", "debug", "error", "notice", "warn", "debug", "info"].forEach(
    level => {
      someObject.logLevel = level;
      t.is(someObject.logLevel, level);
    }
  );
});

test("class default info not shared", t => {
  const someObject = new LoggingEnabledClass();
  const someOtherObject = new LoggingEnabledClass();
  someOtherObject.logLevel = "trace";
  t.is(someObject.logLevel, "info");
});

test("class logging info cb passes", t => {
  const someObject = new LoggingEnabledClass();
  someObject.info(level => "info message");
  t.is(someObject.arg, "info message");
  t.is(someObject.theLevel, "info");
});

test("class logging info passes", t => {
  const someObject = new LoggingEnabledClass();
  someObject.info("a", "b", "c");
  t.deepEqual(someObject.args, ["a", "b", "c"]);
  t.is(someObject.theLevel, "info");
});

test("class logging error eb passes", t => {
  const someObject = new LoggingEnabledClass();
  someObject.error(level => "error message");
  t.is(someObject.arg, "error message");
  t.is(someObject.theLevel, "error");
});

test("class logging trace cb ignored", t => {
  const someObject = new LoggingEnabledClass();
  someObject.trace(level => "trace message");
  t.is(someObject.arg, undefined);
  t.is(someObject.theLevel, undefined);
});
