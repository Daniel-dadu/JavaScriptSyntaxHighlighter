/* eslint node-core/documented-errors: "error" */
/* eslint node-core/alphabetize-errors: "error" */
/* eslint node-core/prefer-util-format-errors: "error" */

'use strict';

// The whole point behind this internal module is to allow Node.js to no
// longer be forced to treat every error message change as a semver-major
// change. The NodeError classes here all expose a `code` property whose
// value statically and permanently identifies the error. While the error
// message may change, the code should not.

const {
  AggregateError,
  ArrayFrom,
  ArrayIsArray,
  ArrayPrototypeIncludes,
  ArrayPrototypeIndexOf,
  ArrayPrototypeJoin,
  ArrayPrototypeMap,
  ArrayPrototypePop,
  ArrayPrototypePush,
  ArrayPrototypeSlice,
  ArrayPrototypeSplice,
  ArrayPrototypeUnshift,
  Error,
  ErrorCaptureStackTrace,
  ErrorPrototypeToString,
  JSONStringify,
  MapPrototypeGet,
  MathAbs,
  MathMax,
  Number,
  NumberIsInteger,
  ObjectDefineProperty,
  ObjectIsExtensible,
  ObjectGetOwnPropertyDescriptor,
  ObjectKeys,
  ObjectPrototypeHasOwnProperty,
  RangeError,
  ReflectApply,
  RegExpPrototypeTest,
  SafeArrayIterator,
  SafeMap,
  SafeWeakMap,
  String,
  StringPrototypeEndsWith,
  StringPrototypeIncludes,
  StringPrototypeMatch,
  StringPrototypeSlice,
  StringPrototypeSplit,
  StringPrototypeStartsWith,
  StringPrototypeToLowerCase,
  Symbol,
  SymbolFor,
  SyntaxError,
  TypeError,
  URIError,
} = primordials;

const isWindows = process.platform === 'win32';

const messages = new SafeMap();
const codes = {};

const classRegExp = /^([A-Z][a-z0-9]*)+$/;
// Sorted by a rough estimate on most frequently used entries.
const kTypes = [
  'string',
  'function',
  'number',
  'object',
  // Accept 'Function' and 'Object' as alternative to the lower cased version.
  'Function',
  'Object',
  'boolean',
  'bigint',
  'symbol',
];

const MainContextError = Error;
const overrideStackTrace = new SafeWeakMap();
const kNoOverride = Symbol('kNoOverride');
let userStackTraceLimit;
const nodeInternalPrefix = '__node_internal_';
const prepareStackTrace = (globalThis, error, trace) => {
  // API for node internals to override error stack formatting
  // without interfering with userland code.
  if (overrideStackTrace.has(error)) {
    const f = overrideStackTrace.get(error);
    overrideStackTrace.delete(error);
    return f(error, trace);
  }

  const firstFrame = trace[0]?.getFunctionName();
  if (firstFrame && StringPrototypeStartsWith(firstFrame, nodeInternalPrefix)) {
    for (let l = trace.length - 1; l >= 0; l--) {
      const fn = trace[l]?.getFunctionName();
      if (fn && StringPrototypeStartsWith(fn, nodeInternalPrefix)) {
        ArrayPrototypeSplice(trace, 0, l + 1);
        break;
      }
    }
    // `userStackTraceLimit` is the user value for `Error.stackTraceLimit`,
    // it is updated at every new exception in `captureLargerStackTrace`.
    if (trace.length > userStackTraceLimit)
      ArrayPrototypeSplice(trace, userStackTraceLimit);
  }

  const globalOverride =
    maybeOverridePrepareStackTrace(globalThis, error, trace);
  if (globalOverride !== kNoOverride) return globalOverride;

  // Normal error formatting:
  //
  // Error: Message
  //     at function (file)
  //     at file
  const errorString = ErrorPrototypeToString(error);
  if (trace.length === 0) {
    return errorString;
  }
  return `${errorString}\n    at ${ArrayPrototypeJoin(trace, '\n    at ')}`;
};

const maybeOverridePrepareStackTrace = (globalThis, error, trace) => {
  // Polyfill of V8's Error.prepareStackTrace API.
  // https://crbug.com/v8/7848
  // `globalThis` is the global that contains the constructor which
  // created `error`.
  if (typeof globalThis.Error?.prepareStackTrace === 'function') {
    return globalThis.Error.prepareStackTrace(error, trace);
  }
  // We still have legacy usage that depends on the main context's `Error`
  // being used, even when the error is from a different context.
  // TODO(devsnek): evaluate if this can be eventually deprecated/removed.
  if (typeof MainContextError.prepareStackTrace === 'function') {
    return MainContextError.prepareStackTrace(error, trace);
  }

  return kNoOverride;
};

const aggregateTwoErrors = hideStackFrames((innerError, outerError) => {
  if (innerError && outerError) {
    if (ArrayIsArray(outerError.errors)) {
      // If `outerError` is already an `AggregateError`.
      ArrayPrototypePush(outerError.errors, innerError);
      return outerError;
    }
    // eslint-disable-next-line no-restricted-syntax
    const err = new AggregateError(new SafeArrayIterator([
      outerError,
      innerError,
    ]), outerError.message);
    err.code = outerError.code;
    return err;
  }
  return innerError || outerError;
});

// Lazily loaded
let util;
let assert;

let internalUtil = null;
function lazyInternalUtil() {
  if (!internalUtil) {
    internalUtil = require('internal/util');
  }
  return internalUtil;
}

let internalUtilInspect = null;
function lazyInternalUtilInspect() {
  if (!internalUtilInspect) {
    internalUtilInspect = require('internal/util/inspect');
  }
  return internalUtilInspect;
}

let buffer;
function lazyBuffer() {
  if (buffer === undefined)
    buffer = require('buffer').Buffer;
  return buffer;
}

const addCodeToName = hideStackFrames(function addCodeToName(err, name, code) {
  // Set the stack
  err = captureLargerStackTrace(err);
  // Add the error code to the name to include it in the stack trace.
  err.name = `${name} [${code}]`;
  // Access the stack to generate the error message including the error code
  // from the name.
  err.stack; // eslint-disable-line no-unused-expressions
  // Reset the name to the actual name.
  if (name === 'SystemError') {
    ObjectDefineProperty(err, 'name', {
      value: name,
      enumerable: false,
      writable: true,
      configurable: true
    });
  } else {
    delete err.name;
  }
});

function isErrorStackTraceLimitWritable() {
  const desc = ObjectGetOwnPropertyDescriptor(Error, 'stackTraceLimit');
  if (desc === undefined) {
    return ObjectIsExtensible(Error);
  }

  return ObjectPrototypeHasOwnProperty(desc, 'writable') ?
    desc.writable :
    desc.set !== undefined;
}

// A specialized Error that includes an additional info property with
// additional information about the error condition.
// It has the properties present in a UVException but with a custom error
// message followed by the uv error code and uv error message.
// It also has its own error code with the original uv error context put into
// `err.info`.
// The context passed into this error must have .code, .syscall and .message,
// and may have .path and .dest.
class SystemError extends Error {
  constructor(key, context) {
    const limit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
    super();
    // Reset the limit and setting the name property.
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = limit;
    const prefix = getMessage(key, [], this);
    let message = `${prefix}: ${context.syscall} returned ` +
                  `${context.code} (${context.message})`;

    if (context.path !== undefined)
      message += ` ${context.path}`;
    if (context.dest !== undefined)
      message += ` => ${context.dest}`;

    ObjectDefineProperty(this, 'message', {
      value: message,
      enumerable: false,
      writable: true,
      configurable: true
    });
    addCodeToName(this, 'SystemError', key);

    this.code = key;

    ObjectDefineProperty(this, 'info', {
      value: context,
      enumerable: true,
      configurable: true,
      writable: false
    });

    ObjectDefineProperty(this, 'errno', {
      get() {
        return context.errno;
      },
      set: (value) => {
        context.errno = value;
      },
      enumerable: true,
      configurable: true
    });

    ObjectDefineProperty(this, 'syscall', {
      get() {
        return context.syscall;
      },
      set: (value) => {
        context.syscall = value;
      },
      enumerable: true,
      configurable: true
    });

    if (context.path !== undefined) {
      // TODO(BridgeAR): Investigate why and when the `.toString()` was
      // introduced. The `path` and `dest` properties in the context seem to
      // always be of type string. We should probably just remove the
      // `.toString()` and `Buffer.from()` operations and set the value on the
      // context as the user did.
      ObjectDefineProperty(this, 'path', {
        get() {
          return context.path != null ?
            context.path.toString() : context.path;
        },
        set: (value) => {
          context.path = value ?
            lazyBuffer().from(value.toString()) : undefined;
        },
        enumerable: true,
        configurable: true
      });
    }

    if (context.dest !== undefined) {
      ObjectDefineProperty(this, 'dest', {
        get() {
          return context.dest != null ?
            context.dest.toString() : context.dest;
        },
        set: (value) => {
          context.dest = value ?
            lazyBuffer().from(value.toString()) : undefined;
        },
        enumerable: true,
        configurable: true
      });
    }
  }

  toString() {
    return `${this.name} [${this.code}]: ${this.message}`;
  }

  [SymbolFor('nodejs.util.inspect.custom')](recurseTimes, ctx) {
    return lazyInternalUtilInspect().inspect(this, {
      ...ctx,
      getters: true,
      customInspect: false
    });
  }
}

function makeSystemErrorWithCode(key) {
  return class NodeError extends SystemError {
    constructor(ctx) {
      super(key, ctx);
    }
  };
}

function makeNodeErrorWithCode(Base, key) {
  return function NodeError(...args) {
    const limit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
    const error = new Base();
    // Reset the limit and setting the name property.
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = limit;
    const message = getMessage(key, args, error);
    ObjectDefineProperty(error, 'message', {
      value: message,
      enumerable: false,
      writable: true,
      configurable: true,
    });
    ObjectDefineProperty(error, 'toString', {
      value() {
        return `${this.name} [${key}]: ${this.message}`;
      },
      enumerable: false,
      writable: true,
      configurable: true,
    });
    addCodeToName(error, Base.name, key);
    error.code = key;
    return error;
  };
}

/**
 * This function removes unnecessary frames from Node.js core errors.
 * @template {(...args: any[]) => any} T
 * @type {(fn: T) => T}
 */
function hideStackFrames(fn) {
  // We rename the functions that will be hidden to cut off the stacktrace
  // at the outermost one
  const hidden = nodeInternalPrefix + fn.name;
  ObjectDefineProperty(fn, 'name', { value: hidden });
  return fn;
}

// Utility function for registering the error codes. Only used here. Exported
// *only* to allow for testing.
function E(sym, val, def, ...otherClasses) {
  // Special case for SystemError that formats the error message differently
  // The SystemErrors only have SystemError as their base classes.
  messages.set(sym, val);
  if (def === SystemError) {
    def = makeSystemErrorWithCode(sym);
  } else {
    def = makeNodeErrorWithCode(def, sym);
  }

  if (otherClasses.length !== 0) {
    otherClasses.forEach((clazz) => {
      def[clazz.name] = makeNodeErrorWithCode(clazz, sym);
    });
  }
  codes[sym] = def;
}

function getMessage(key, args, self) {
  const msg = messages.get(key);

  if (assert === undefined) assert = require('internal/assert');

  if (typeof msg === 'function') {
    assert(
      msg.length <= args.length, // Default options do not count.
      `Code: ${key}; The provided arguments length (${args.length}) does not ` +
        `match the required ones (${msg.length}).`
    );
    return ReflectApply(msg, self, args);
  }

  const expectedLength =
    (StringPrototypeMatch(msg, /%[dfijoOs]/g) || []).length;
  assert(
    expectedLength === args.length,
    `Code: ${key}; The provided arguments length (${args.length}) does not ` +
      `match the required ones (${expectedLength}).`
  );
  if (args.length === 0)
    return msg;

  ArrayPrototypeUnshift(args, msg);
  return ReflectApply(lazyInternalUtilInspect().format, null, args);
}

let uvBinding;

function lazyUv() {
  if (!uvBinding) {
    uvBinding = internalBinding('uv');
  }
  return uvBinding;
}

const uvUnmappedError = ['UNKNOWN', 'unknown error'];

function uvErrmapGet(name) {
  uvBinding = lazyUv();
  if (!uvBinding.errmap) {
    uvBinding.errmap = uvBinding.getErrorMap();
  }
  return MapPrototypeGet(uvBinding.errmap, name);
}

const captureLargerStackTrace = hideStackFrames(
  function captureLargerStackTrace(err) {
    const stackTraceLimitIsWritable = isErrorStackTraceLimitWritable();
    if (stackTraceLimitIsWritable) {
      userStackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = Infinity;
    }
    ErrorCaptureStackTrace(err);
    // Reset the limit
    if (stackTraceLimitIsWritable) Error.stackTraceLimit = userStackTraceLimit;

    return err;
  });

/**
 * This creates an error compatible with errors produced in the C++
 * function UVException using a context object with data assembled in C++.
 * The goal is to migrate them to ERR_* errors later when compatibility is
 * not a concern.
 *
 * @param {Object} ctx
 * @returns {Error}
 */
const uvException = hideStackFrames(function uvException(ctx) {
  const { 0: code, 1: uvmsg } = uvErrmapGet(ctx.errno) || uvUnmappedError;
  let message = `${code}: ${ctx.message || uvmsg}, ${ctx.syscall}`;

  let path;
  let dest;
  if (ctx.path) {
    path = ctx.path.toString();
    message += ` '${path}'`;
  }
  if (ctx.dest) {
    dest = ctx.dest.toString();
    message += ` -> '${dest}'`;
  }

  // Reducing the limit improves the performance significantly. We do not lose
  // the stack frames due to the `captureStackTrace()` function that is called
  // later.
  const tmpLimit = Error.stackTraceLimit;
  if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
  // Pass the message to the constructor instead of setting it on the object
  // to make sure it is the same as the one created in C++
  // eslint-disable-next-line no-restricted-syntax
  const err = new Error(message);
  if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = tmpLimit;

  for (const prop of ObjectKeys(ctx)) {
    if (prop === 'message' || prop === 'path' || prop === 'dest') {
      continue;
    }
    err[prop] = ctx[prop];
  }

  err.code = code;
  if (path) {
    err.path = path;
  }
  if (dest) {
    err.dest = dest;
  }

  return captureLargerStackTrace(err);
});

/**
 * This creates an error compatible with errors produced in the C++
 * This function should replace the deprecated
 * `exceptionWithHostPort()` function.
 *
 * @param {number} err - A libuv error number
 * @param {string} syscall
 * @param {string} address
 * @param {number} [port]
 * @returns {Error}
 */
const uvExceptionWithHostPort = hideStackFrames(
  function uvExceptionWithHostPort(err, syscall, address, port) {
    const { 0: code, 1: uvmsg } = uvErrmapGet(err) || uvUnmappedError;
    const message = `${syscall} ${code}: ${uvmsg}`;
    let details = '';

    if (port && port > 0) {
      details = ` ${address}:${port}`;
    } else if (address) {
      details = ` ${address}`;
    }

    // Reducing the limit improves the performance significantly. We do not
    // lose the stack frames due to the `captureStackTrace()` function that
    // is called later.
    const tmpLimit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
    // eslint-disable-next-line no-restricted-syntax
    const ex = new Error(`${message}${details}`);
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = tmpLimit;
    ex.code = code;
    ex.errno = err;
    ex.syscall = syscall;
    ex.address = address;
    if (port) {
      ex.port = port;
    }

    return captureLargerStackTrace(ex);
  });

/**
 * This used to be util._errnoException().
 *
 * @param {number} err - A libuv error number
 * @param {string} syscall
 * @param {string} [original]
 * @returns {Error}
 */
const errnoException = hideStackFrames(
  function errnoException(err, syscall, original) {
    // TODO(joyeecheung): We have to use the type-checked
    // getSystemErrorName(err) to guard against invalid arguments from users.
    // This can be replaced with [ code ] = errmap.get(err) when this method
    // is no longer exposed to user land.
    if (util === undefined) util = require('util');
    const code = util.getSystemErrorName(err);
    const message = original ?
      `${syscall} ${code} ${original}` : `${syscall} ${code}`;

    const tmpLimit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
    // eslint-disable-next-line no-restricted-syntax
    const ex = new Error(message);
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = tmpLimit;
    ex.errno = err;
    ex.code = code;
    ex.syscall = syscall;

    return captureLargerStackTrace(ex);
  });

/**
 * Deprecated, new function is `uvExceptionWithHostPort()`
 * New function added the error description directly
 * from C++. this method for backwards compatibility
 * @param {number} err - A libuv error number
 * @param {string} syscall
 * @param {string} address
 * @param {number} [port]
 * @param {string} [additional]
 * @returns {Error}
 */
const exceptionWithHostPort = hideStackFrames(
  function exceptionWithHostPort(err, syscall, address, port, additional) {
    // TODO(joyeecheung): We have to use the type-checked
    // getSystemErrorName(err) to guard against invalid arguments from users.
    // This can be replaced with [ code ] = errmap.get(err) when this method
    // is no longer exposed to user land.
    if (util === undefined) util = require('util');
    const code = util.getSystemErrorName(err);
    let details = '';
    if (port && port > 0) {
      details = ` ${address}:${port}`;
    } else if (address) {
      details = ` ${address}`;
    }
    if (additional) {
      details += ` - Local (${additional})`;
    }

    // Reducing the limit improves the performance significantly. We do not
    // lose the stack frames due to the `captureStackTrace()` function that
    // is called later.
    const tmpLimit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
    // eslint-disable-next-line no-restricted-syntax
    const ex = new Error(`${syscall} ${code}${details}`);
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = tmpLimit;
    ex.errno = err;
    ex.code = code;
    ex.syscall = syscall;
    ex.address = address;
    if (port) {
      ex.port = port;
    }

    return captureLargerStackTrace(ex);
  });

/**
 * @param {number|string} code - A libuv error number or a c-ares error code
 * @param {string} syscall
 * @param {string} [hostname]
 * @returns {Error}
 */
const dnsException = hideStackFrames(function(code, syscall, hostname) {
  let errno;
  // If `code` is of type number, it is a libuv error number, else it is a
  // c-ares error code.
  // TODO(joyeecheung): translate c-ares error codes into numeric ones and
  // make them available in a property that's not error.errno (since they
  // can be in conflict with libuv error codes). Also make sure
  // util.getSystemErrorName() can understand them when an being informed that
  // the number is a c-ares error code.
  if (typeof code === 'number') {
    errno = code;
    // ENOTFOUND is not a proper POSIX error, but this error has been in place
    // long enough that it's not practical to remove it.
    if (code === lazyUv().UV_EAI_NODATA || code === lazyUv().UV_EAI_NONAME) {
      code = 'ENOTFOUND'; // Fabricated error name.
    } else {
      code = lazyInternalUtil().getSystemErrorName(code);
    }
  }
  const message = `${syscall} ${code}${hostname ? ` ${hostname}` : ''}`;
  // Reducing the limit improves the performance significantly. We do not lose
  // the stack frames due to the `captureStackTrace()` function that is called
  // later.
  const tmpLimit = Error.stackTraceLimit;
  if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
  // eslint-disable-next-line no-restricted-syntax
  const ex = new Error(message);
  if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = tmpLimit;
  ex.errno = errno;
  ex.code = code;
  ex.syscall = syscall;
  if (hostname) {
    ex.hostname = hostname;
  }

  return captureLargerStackTrace(ex);
});

function connResetException(msg) {
  // eslint-disable-next-line no-restricted-syntax
  const ex = new Error(msg);
  ex.code = 'ECONNRESET';
  return ex;
}

let maxStack_ErrorName;
let maxStack_ErrorMessage;
/**
 * Returns true if `err.name` and `err.message` are equal to engine-specific
 * values indicating max call stack size has been exceeded.
 * "Maximum call stack size exceeded" in V8.
 *
 * @param {Error} err
 * @returns {boolean}
 */
function isStackOverflowError(err) {
  if (maxStack_ErrorMessage === undefined) {
    try {
      function overflowStack() { overflowStack(); }
      overflowStack();
    } catch (err) {
      maxStack_ErrorMessage = err.message;
      maxStack_ErrorName = err.name;
    }
  }

  return err && err.name === maxStack_ErrorName &&
         err.message === maxStack_ErrorMessage;
}

// Only use this for integers! Decimal numbers do not work with this function.
function addNumericalSeparator(val) {
  let res = '';
  let i = val.length;
  const start = val[0] === '-' ? 1 : 0;
  for (; i >= start + 4; i -= 3) {
    res = `_${StringPrototypeSlice(val, i - 3, i)}${res}`;
  }
  return `${StringPrototypeSlice(val, 0, i)}${res}`;
}

// Used to enhance the stack that will be picked up by the inspector
const kEnhanceStackBeforeInspector = Symbol('kEnhanceStackBeforeInspector');

// These are supposed to be called only on fatal exceptions before
// the process exits.
const fatalExceptionStackEnhancers = {
  beforeInspector(error) {
    if (typeof error[kEnhanceStackBeforeInspector] !== 'function') {
      return error.stack;
    }

    try {
      // Set the error.stack here so it gets picked up by the
      // inspector.
      error.stack = error[kEnhanceStackBeforeInspector]();
    } catch {
      // We are just enhancing the error. If it fails, ignore it.
    }
    return error.stack;
  },
  afterInspector(error) {
    const originalStack = error.stack;
    let useColors = true;
    // Some consoles do not convert ANSI escape sequences to colors,
    // rather display them directly to the stdout. On those consoles,
    // libuv emulates colors by intercepting stdout stream and calling
    // corresponding Windows API functions for setting console colors.
    // However, fatal error are handled differently and we cannot easily
    // highlight them. On Windows, detecting whether a console supports
    // ANSI escape sequences is not reliable.
    if (process.platform === 'win32') {
      const info = internalBinding('os').getOSInformation();
      const ver = ArrayPrototypeMap(StringPrototypeSplit(info[2], '.'),
                                    Number);
      if (ver[0] !== 10 || ver[2] < 14393) {
        useColors = false;
      }
    }
    const {
      inspect,
      inspectDefaultOptions: {
        colors: defaultColors
      }
    } = lazyInternalUtilInspect();
    const colors = useColors &&
                   ((internalBinding('util').guessHandleType(2) === 'TTY' &&
                   require('internal/tty').hasColors()) ||
                   defaultColors);
    try {
      return inspect(error, {
        colors,
        customInspect: false,
        depth: MathMax(inspect.defaultOptions.depth, 5)
      });
    } catch {
      return originalStack;
    }
  }
};

// Node uses an AbortError that isn't exactly the same as the DOMException
// to make usage of the error in userland and readable-stream easier.
// It is a regular error with `.code` and `.name`.
class AbortError extends Error {
  constructor() {
    super('The operation was aborted');
    this.code = 'ABORT_ERR';
    this.name = 'AbortError';
  }
}
module.exports = {
  addCodeToName, // Exported for NghttpError
  aggregateTwoErrors,
  codes,
  dnsException,
  errnoException,
  exceptionWithHostPort,
  getMessage,
  hideStackFrames,
  isErrorStackTraceLimitWritable,
  isStackOverflowError,
  connResetException,
  uvErrmapGet,
  uvException,
  uvExceptionWithHostPort,
  SystemError,
  AbortError,
  // This is exported only to facilitate testing.
  E,
  kNoOverride,
  prepareStackTrace,
  maybeOverridePrepareStackTrace,
  overrideStackTrace,
  kEnhanceStackBeforeInspector,
  fatalExceptionStackEnhancers
};

// To declare an error message, use the E(sym, val, def) function above. The sym
// must be an upper case string. The val can be either a function or a string.
// The def must be an error class.
// The return value of the function must be a string.
// Examples:
// E('EXAMPLE_KEY1', 'This is the error value', Error);
// E('EXAMPLE_KEY2', (a, b) => return `${a} ${b}`, RangeError);
//
// Once an error code has been assigned, the code itself MUST NOT change and
// any given error code must never be reused to identify a different error.
//
// Any error code added here should also be added to the documentation
//
// Note: Please try to keep these in alphabetical order
//
// Note: Node.js specific errors must begin with the prefix ERR_
E('ERR_AMBIGUOUS_ARGUMENT', 'The "%s" argument is ambiguous. %s', TypeError);
E('ERR_ARG_NOT_ITERABLE', '%s must be iterable', TypeError);

