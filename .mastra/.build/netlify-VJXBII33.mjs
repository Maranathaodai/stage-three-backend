import { RuntimeContext } from './@mastra-core-runtime-context.mjs';
import { M as MastraError } from './error.mjs';
import fs from 'fs';
import { createRequire } from 'module';
import os from 'os';
import path from 'path';
import { createHash } from 'crypto';
import { s as safeParseAsync, v as object, q as boolean, t as array, k as string, u as union, w as literal, p as number, y as discriminatedUnion, z as looseObject, x as unknown, r as record, er as _enum, f6 as tuple, ee as any, n as lazy } from './schemas.mjs';
import { g as getDefaultExportFromCjs, M as MastraBase } from './_commonjsHelpers.mjs';
import { t as toJSONSchema, n as number$1 } from './coerce.mjs';
import { Z as ZodFirstPartyTypeKind } from './v3.mjs';

let ParseError$1 = class ParseError extends Error {
  constructor(message, options) {
    super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
  }
};
function noop$1(_arg) {
}
function createParser$1(callbacks) {
  if (typeof callbacks == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  const { onEvent = noop$1, onError = noop$1, onRetry = noop$1, onComment } = callbacks;
  let incompleteLine = "", isFirstChunk = true, id, data = "", eventType = "";
  function feed(newChunk) {
    const chunk = isFirstChunk ? newChunk.replace(/^\xEF\xBB\xBF/, "") : newChunk, [complete, incomplete] = splitLines$1(`${incompleteLine}${chunk}`);
    for (const line of complete)
      parseLine(line);
    incompleteLine = incomplete, isFirstChunk = false;
  }
  function parseLine(line) {
    if (line === "") {
      dispatchEvent();
      return;
    }
    if (line.startsWith(":")) {
      onComment && onComment(line.slice(line.startsWith(": ") ? 2 : 1));
      return;
    }
    const fieldSeparatorIndex = line.indexOf(":");
    if (fieldSeparatorIndex !== -1) {
      const field = line.slice(0, fieldSeparatorIndex), offset = line[fieldSeparatorIndex + 1] === " " ? 2 : 1, value = line.slice(fieldSeparatorIndex + offset);
      processField(field, value, line);
      return;
    }
    processField(line, "", line);
  }
  function processField(field, value, line) {
    switch (field) {
      case "event":
        eventType = value;
        break;
      case "data":
        data = `${data}${value}
`;
        break;
      case "id":
        id = value.includes("\0") ? void 0 : value;
        break;
      case "retry":
        /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(
          new ParseError$1(`Invalid \`retry\` value: "${value}"`, {
            type: "invalid-retry",
            value,
            line
          })
        );
        break;
      default:
        onError(
          new ParseError$1(
            `Unknown field "${field.length > 20 ? `${field.slice(0, 20)}\u2026` : field}"`,
            { type: "unknown-field", field, value, line }
          )
        );
        break;
    }
  }
  function dispatchEvent() {
    data.length > 0 && onEvent({
      id,
      event: eventType || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: data.endsWith(`
`) ? data.slice(0, -1) : data
    }), id = void 0, data = "", eventType = "";
  }
  function reset(options = {}) {
    incompleteLine && options.consume && parseLine(incompleteLine), isFirstChunk = true, id = void 0, data = "", eventType = "", incompleteLine = "";
  }
  return { feed, reset };
}
function splitLines$1(chunk) {
  const lines = [];
  let incompleteLine = "", searchIndex = 0;
  for (; searchIndex < chunk.length; ) {
    const crIndex = chunk.indexOf("\r", searchIndex), lfIndex = chunk.indexOf(`
`, searchIndex);
    let lineEnd = -1;
    if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = Math.min(crIndex, lfIndex) : crIndex !== -1 ? crIndex === chunk.length - 1 ? lineEnd = -1 : lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1) {
      incompleteLine = chunk.slice(searchIndex);
      break;
    } else {
      const line = chunk.slice(searchIndex, lineEnd);
      lines.push(line), searchIndex = lineEnd + 1, chunk[searchIndex - 1] === "\r" && chunk[searchIndex] === `
` && searchIndex++;
    }
  }
  return [lines, incompleteLine];
}

let EventSourceParserStream$1 = class EventSourceParserStream extends TransformStream {
  constructor({ onError, onRetry, onComment } = {}) {
    let parser;
    super({
      start(controller) {
        parser = createParser$1({
          onEvent: (event) => {
            controller.enqueue(event);
          },
          onError(error) {
            onError === "terminate" ? controller.error(error) : typeof onError == "function" && onError(error);
          },
          onRetry,
          onComment
        });
      },
      transform(chunk) {
        parser.feed(chunk);
      }
    });
  }
};

// src/llm/model/gateways/base.ts
var MastraModelGateway = class {
};

// src/errors/ai-sdk-error.ts
var marker$6 = "vercel.ai.error";
var symbol$6 = Symbol.for(marker$6);
var _a$6;
var _AISDKError$6 = class _AISDKError extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a$6] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker$6);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a$6 = symbol$6;
var AISDKError$6 = _AISDKError$6;

// src/errors/api-call-error.ts
var name$6 = "AI_APICallError";
var marker2$6 = `vercel.ai.error.${name$6}`;
var symbol2$6 = Symbol.for(marker2$6);
var _a2$6;
var APICallError$6 = class APICallError extends AISDKError$6 {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name: name$6, message, cause });
    this[_a2$6] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError$6.hasMarker(error, marker2$6);
  }
};
_a2$6 = symbol2$6;

// src/errors/empty-response-body-error.ts
var name2$5 = "AI_EmptyResponseBodyError";
var marker3$5 = `vercel.ai.error.${name2$5}`;
var symbol3$5 = Symbol.for(marker3$5);
var _a3$5;
var EmptyResponseBodyError$5 = class EmptyResponseBodyError extends AISDKError$6 {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2$5, message });
    this[_a3$5] = true;
  }
  static isInstance(error) {
    return AISDKError$6.hasMarker(error, marker3$5);
  }
};
_a3$5 = symbol3$5;

// src/errors/get-error-message.ts
function getErrorMessage$6(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// src/errors/invalid-argument-error.ts
var name3$6 = "AI_InvalidArgumentError";
var marker4$6 = `vercel.ai.error.${name3$6}`;
var symbol4$6 = Symbol.for(marker4$6);
var _a4$6;
var InvalidArgumentError$6 = class InvalidArgumentError extends AISDKError$6 {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3$6, message, cause });
    this[_a4$6] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError$6.hasMarker(error, marker4$6);
  }
};
_a4$6 = symbol4$6;

// src/errors/json-parse-error.ts
var name6$6 = "AI_JSONParseError";
var marker7$6 = `vercel.ai.error.${name6$6}`;
var symbol7$6 = Symbol.for(marker7$6);
var _a7$6;
var JSONParseError$6 = class JSONParseError extends AISDKError$6 {
  constructor({ text, cause }) {
    super({
      name: name6$6,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage$6(cause)}`,
      cause
    });
    this[_a7$6] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError$6.hasMarker(error, marker7$6);
  }
};
_a7$6 = symbol7$6;

// src/errors/load-api-key-error.ts
var name7$4 = "AI_LoadAPIKeyError";
var marker8$4 = `vercel.ai.error.${name7$4}`;
var symbol8$4 = Symbol.for(marker8$4);
var _a8$4;
var LoadAPIKeyError$4 = class LoadAPIKeyError extends AISDKError$6 {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7$4, message });
    this[_a8$4] = true;
  }
  static isInstance(error) {
    return AISDKError$6.hasMarker(error, marker8$4);
  }
};
_a8$4 = symbol8$4;

// src/errors/no-such-model-error.ts
var name10$1 = "AI_NoSuchModelError";
var marker11$1 = `vercel.ai.error.${name10$1}`;
var symbol11$1 = Symbol.for(marker11$1);
var _a11$1;
var NoSuchModelError$1 = class NoSuchModelError extends AISDKError$6 {
  constructor({
    errorName = name10$1,
    modelId,
    modelType,
    message = `No such ${modelType}: ${modelId}`
  }) {
    super({ name: errorName, message });
    this[_a11$1] = true;
    this.modelId = modelId;
    this.modelType = modelType;
  }
  static isInstance(error) {
    return AISDKError$6.hasMarker(error, marker11$1);
  }
};
_a11$1 = symbol11$1;

// src/errors/type-validation-error.ts
var name12$6 = "AI_TypeValidationError";
var marker13$6 = `vercel.ai.error.${name12$6}`;
var symbol13$6 = Symbol.for(marker13$6);
var _a13$6;
var _TypeValidationError$6 = class _TypeValidationError extends AISDKError$6 {
  constructor({ value, cause }) {
    super({
      name: name12$6,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage$6(cause)}`,
      cause
    });
    this[_a13$6] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError$6.hasMarker(error, marker13$6);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
  }
};
_a13$6 = symbol13$6;
var TypeValidationError$6 = _TypeValidationError$6;

// src/errors/unsupported-functionality-error.ts
var name13$5 = "AI_UnsupportedFunctionalityError";
var marker14$5 = `vercel.ai.error.${name13$5}`;
var symbol14$5 = Symbol.for(marker14$5);
var _a14$5;
var UnsupportedFunctionalityError$5 = class UnsupportedFunctionalityError extends AISDKError$6 {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13$5, message });
    this[_a14$5] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError$6.hasMarker(error, marker14$5);
  }
};
_a14$5 = symbol14$5;

// src/combine-headers.ts
function combineHeaders$6(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => ({
      ...combinedHeaders,
      ...currentHeaders != null ? currentHeaders : {}
    }),
    {}
  );
}

// src/extract-response-headers.ts
function extractResponseHeaders$6(response) {
  return Object.fromEntries([...response.headers]);
}
var createIdGenerator$6 = ({
  prefix,
  size = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = () => {
    const alphabetLength = alphabet.length;
    const chars = new Array(size);
    for (let i = 0; i < size; i++) {
      chars[i] = alphabet[Math.random() * alphabetLength | 0];
    }
    return chars.join("");
  };
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError$6({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return () => `${prefix}${separator}${generator()}`;
};
var generateId$5 = createIdGenerator$6();

// src/is-abort-error.ts
function isAbortError$6(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}

// src/handle-fetch-error.ts
var FETCH_FAILED_ERROR_MESSAGES$6 = ["fetch failed", "failed to fetch"];
function handleFetchError$6({
  error,
  url,
  requestBodyValues
}) {
  if (isAbortError$6(error)) {
    return error;
  }
  if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES$6.includes(error.message.toLowerCase())) {
    const cause = error.cause;
    if (cause != null) {
      return new APICallError$6({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true
        // retry when network error
      });
    }
  }
  return error;
}

// src/get-runtime-environment-user-agent.ts
function getRuntimeEnvironmentUserAgent$5(globalThisAny = globalThis) {
  var _a, _b, _c;
  if (globalThisAny.window) {
    return `runtime/browser`;
  }
  if ((_a = globalThisAny.navigator) == null ? void 0 : _a.userAgent) {
    return `runtime/${globalThisAny.navigator.userAgent.toLowerCase()}`;
  }
  if ((_c = (_b = globalThisAny.process) == null ? void 0 : _b.versions) == null ? void 0 : _c.node) {
    return `runtime/node.js/${globalThisAny.process.version.substring(0)}`;
  }
  if (globalThisAny.EdgeRuntime) {
    return `runtime/vercel-edge`;
  }
  return "runtime/unknown";
}

// src/remove-undefined-entries.ts
function removeUndefinedEntries$6(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}

// src/with-user-agent-suffix.ts
function withUserAgentSuffix$5(headers, ...userAgentSuffixParts) {
  const cleanedHeaders = removeUndefinedEntries$6(
    headers != null ? headers : {}
  );
  const normalizedHeaders = new Headers(cleanedHeaders);
  const currentUserAgentHeader = normalizedHeaders.get("user-agent") || "";
  normalizedHeaders.set(
    "user-agent",
    [currentUserAgentHeader, ...userAgentSuffixParts].filter(Boolean).join(" ")
  );
  return Object.fromEntries(normalizedHeaders);
}

// src/version.ts
var VERSION$a = "3.0.12" ;
function loadApiKey$4({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (typeof apiKey === "string") {
    return apiKey;
  }
  if (apiKey != null) {
    throw new LoadAPIKeyError$4({
      message: `${description} API key must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadAPIKeyError$4({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new LoadAPIKeyError$4({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof apiKey !== "string") {
    throw new LoadAPIKeyError$4({
      message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return apiKey;
}

// src/secure-json-parse.ts
var suspectProtoRx$6 = /"__proto__"\s*:/;
var suspectConstructorRx$6 = /"constructor"\s*:/;
function _parse$6(text) {
  const obj = JSON.parse(text);
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (suspectProtoRx$6.test(text) === false && suspectConstructorRx$6.test(text) === false) {
    return obj;
  }
  return filter$6(obj);
}
function filter$6(obj) {
  let next = [obj];
  while (next.length) {
    const nodes = next;
    next = [];
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      if (Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      for (const key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          next.push(value);
        }
      }
    }
  }
  return obj;
}
function secureJsonParse$6(text) {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  try {
    return _parse$6(text);
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
  }
}
var validatorSymbol$6 = Symbol.for("vercel.ai.validator");
function validator$6(validate) {
  return { [validatorSymbol$6]: true, validate };
}
function isValidator$6(value) {
  return typeof value === "object" && value !== null && validatorSymbol$6 in value && value[validatorSymbol$6] === true && "validate" in value;
}
function asValidator$6(value) {
  return isValidator$6(value) ? value : typeof value === "function" ? value() : standardSchemaValidator$6(value);
}
function standardSchemaValidator$6(standardSchema) {
  return validator$6(async (value) => {
    const result = await standardSchema["~standard"].validate(value);
    return result.issues == null ? { success: true, value: result.value } : {
      success: false,
      error: new TypeValidationError$6({
        value,
        cause: result.issues
      })
    };
  });
}

// src/validate-types.ts
async function validateTypes$6({
  value,
  schema
}) {
  const result = await safeValidateTypes$6({ value, schema });
  if (!result.success) {
    throw TypeValidationError$6.wrap({ value, cause: result.error });
  }
  return result.value;
}
async function safeValidateTypes$6({
  value,
  schema
}) {
  const validator2 = asValidator$6(schema);
  try {
    if (validator2.validate == null) {
      return { success: true, value, rawValue: value };
    }
    const result = await validator2.validate(value);
    if (result.success) {
      return { success: true, value: result.value, rawValue: value };
    }
    return {
      success: false,
      error: TypeValidationError$6.wrap({ value, cause: result.error }),
      rawValue: value
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError$6.wrap({ value, cause: error }),
      rawValue: value
    };
  }
}

// src/parse-json.ts
async function parseJSON$6({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$6(text);
    if (schema == null) {
      return value;
    }
    return validateTypes$6({ value, schema });
  } catch (error) {
    if (JSONParseError$6.isInstance(error) || TypeValidationError$6.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError$6({ text, cause: error });
  }
}
async function safeParseJSON$6({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$6(text);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    return await safeValidateTypes$6({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: JSONParseError$6.isInstance(error) ? error : new JSONParseError$6({ text, cause: error }),
      rawValue: void 0
    };
  }
}
function parseJsonEventStream$5({
  stream,
  schema
}) {
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream$1()).pipeThrough(
    new TransformStream({
      async transform({ data }, controller) {
        if (data === "[DONE]") {
          return;
        }
        controller.enqueue(await safeParseJSON$6({ text: data, schema }));
      }
    })
  );
}
async function parseProviderOptions$4({
  provider,
  providerOptions,
  schema
}) {
  if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
    return void 0;
  }
  const parsedProviderOptions = await safeValidateTypes$6({
    value: providerOptions[provider],
    schema
  });
  if (!parsedProviderOptions.success) {
    throw new InvalidArgumentError$6({
      argument: "providerOptions",
      message: `invalid ${provider} provider options`,
      cause: parsedProviderOptions.error
    });
  }
  return parsedProviderOptions.value;
}
var getOriginalFetch2$6 = () => globalThis.fetch;
var postJsonToApi$6 = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
}) => postToApi$6({
  url,
  headers: {
    "Content-Type": "application/json",
    ...headers
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
});
var postToApi$6 = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch = getOriginalFetch2$6()
}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: withUserAgentSuffix$5(
        headers,
        `ai-sdk/provider-utils/${VERSION$a}`,
        getRuntimeEnvironmentUserAgent$5()
      ),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders$6(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError$6(error) || APICallError$6.isInstance(error)) {
          throw error;
        }
        throw new APICallError$6({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError$6(error) || APICallError$6.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError$6({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    throw handleFetchError$6({ error, url, requestBodyValues: body.values });
  }
};

// src/types/tool.ts
function tool$2(tool2) {
  return tool2;
}

// src/provider-defined-tool-factory.ts
function createProviderDefinedToolFactory$1({
  id,
  name,
  inputSchema
}) {
  return ({
    execute,
    outputSchema,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool$2({
    type: "provider-defined",
    id,
    name,
    args,
    inputSchema,
    outputSchema,
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable
  });
}
function createProviderDefinedToolFactoryWithOutputSchema$2({
  id,
  name,
  inputSchema,
  outputSchema
}) {
  return ({
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool$2({
    type: "provider-defined",
    id,
    name,
    args,
    inputSchema,
    outputSchema,
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable
  });
}

// src/resolve.ts
async function resolve$1(value) {
  if (typeof value === "function") {
    value = value();
  }
  return Promise.resolve(value);
}
var createJsonErrorResponseHandler$6 = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const responseHeaders = extractResponseHeaders$6(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError$6({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = await parseJSON$6({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError$6({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError$6({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
};
var createEventSourceResponseHandler$5 = (chunkSchema) => async ({ response }) => {
  const responseHeaders = extractResponseHeaders$6(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError$5({});
  }
  return {
    responseHeaders,
    value: parseJsonEventStream$5({
      stream: response.body,
      schema: chunkSchema
    })
  };
};
var createJsonResponseHandler$6 = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = await safeParseJSON$6({
    text: responseBody,
    schema: responseSchema
  });
  const responseHeaders = extractResponseHeaders$6(response);
  if (!parsedResult.success) {
    throw new APICallError$6({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
};

// src/zod-to-json-schema/get-relative-path.ts
var getRelativePath$2 = (pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i]) break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};

// src/zod-to-json-schema/options.ts
var ignoreOverride$2 = Symbol(
  "Let zodToJsonSchema decide on which parser to use"
);
var defaultOptions$2 = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: true,
  rejectedAdditionalProperties: false,
  definitionPath: "definitions",
  strictUnions: false,
  definitions: {},
  errorMessages: false,
  patternStrategy: "escape",
  applyRegexFlags: false,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref"
};
var getDefaultOptions$2 = (options) => typeof options === "string" ? {
  ...defaultOptions$2,
  name: options
} : {
  ...defaultOptions$2,
  ...options
};

// src/zod-to-json-schema/parsers/any.ts
function parseAnyDef$2() {
  return {};
}
function parseArrayDef$2(def, refs) {
  var _a, _b, _c;
  const res = {
    type: "array"
  };
  if (((_a = def.type) == null ? void 0 : _a._def) && ((_c = (_b = def.type) == null ? void 0 : _b._def) == null ? void 0 : _c.typeName) !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef$2(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"]
    });
  }
  if (def.minLength) {
    res.minItems = def.minLength.value;
  }
  if (def.maxLength) {
    res.maxItems = def.maxLength.value;
  }
  if (def.exactLength) {
    res.minItems = def.exactLength.value;
    res.maxItems = def.exactLength.value;
  }
  return res;
}

// src/zod-to-json-schema/parsers/bigint.ts
function parseBigintDef$2(def) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}

// src/zod-to-json-schema/parsers/boolean.ts
function parseBooleanDef$2() {
  return { type: "boolean" };
}

// src/zod-to-json-schema/parsers/branded.ts
function parseBrandedDef$2(_def, refs) {
  return parseDef$2(_def.type._def, refs);
}

// src/zod-to-json-schema/parsers/catch.ts
var parseCatchDef$2 = (def, refs) => {
  return parseDef$2(def.innerType._def, refs);
};

// src/zod-to-json-schema/parsers/date.ts
function parseDateDef$2(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy != null ? overrideDateStrategy : refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item, i) => parseDateDef$2(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser$2(def);
  }
}
var integerDateParser$2 = (def) => {
  const res = {
    type: "integer",
    format: "unix-time"
  };
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        res.minimum = check.value;
        break;
      case "max":
        res.maximum = check.value;
        break;
    }
  }
  return res;
};

// src/zod-to-json-schema/parsers/default.ts
function parseDefaultDef$2(_def, refs) {
  return {
    ...parseDef$2(_def.innerType._def, refs),
    default: _def.defaultValue()
  };
}

// src/zod-to-json-schema/parsers/effects.ts
function parseEffectsDef$2(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef$2(_def.schema._def, refs) : parseAnyDef$2();
}

// src/zod-to-json-schema/parsers/enum.ts
function parseEnumDef$2(def) {
  return {
    type: "string",
    enum: Array.from(def.values)
  };
}

// src/zod-to-json-schema/parsers/intersection.ts
var isJsonSchema7AllOfType$2 = (type) => {
  if ("type" in type && type.type === "string") return false;
  return "allOf" in type;
};
function parseIntersectionDef$2(def, refs) {
  const allOf = [
    parseDef$2(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"]
    }),
    parseDef$2(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"]
    })
  ].filter((x) => !!x);
  const mergedAllOf = [];
  allOf.forEach((schema) => {
    if (isJsonSchema7AllOfType$2(schema)) {
      mergedAllOf.push(...schema.allOf);
    } else {
      let nestedSchema = schema;
      if ("additionalProperties" in schema && schema.additionalProperties === false) {
        const { additionalProperties, ...rest } = schema;
        nestedSchema = rest;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? { allOf: mergedAllOf } : void 0;
}

// src/zod-to-json-schema/parsers/literal.ts
function parseLiteralDef$2(def) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}

// src/zod-to-json-schema/parsers/string.ts
var emojiRegex$2 = void 0;
var zodPatterns$2 = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: () => {
    if (emojiRegex$2 === void 0) {
      emojiRegex$2 = RegExp(
        "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
        "u"
      );
    }
    return emojiRegex$2;
  },
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef$2(def, refs) {
  const res = {
    type: "string"
  };
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          break;
        case "max":
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat$2(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat$2(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern$2(res, zodPatterns$2.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat$2(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat$2(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern$2(res, check.regex, check.message, refs);
          break;
        case "cuid":
          addPattern$2(res, zodPatterns$2.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern$2(res, zodPatterns$2.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern$2(
            res,
            RegExp(`^${escapeLiteralCheckValue$2(check.value, refs)}`),
            check.message,
            refs
          );
          break;
        case "endsWith":
          addPattern$2(
            res,
            RegExp(`${escapeLiteralCheckValue$2(check.value, refs)}$`),
            check.message,
            refs
          );
          break;
        case "datetime":
          addFormat$2(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat$2(res, "date", check.message, refs);
          break;
        case "time":
          addFormat$2(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat$2(res, "duration", check.message, refs);
          break;
        case "length":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "includes": {
          addPattern$2(
            res,
            RegExp(escapeLiteralCheckValue$2(check.value, refs)),
            check.message,
            refs
          );
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat$2(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat$2(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "base64url":
          addPattern$2(res, zodPatterns$2.base64url, check.message, refs);
          break;
        case "jwt":
          addPattern$2(res, zodPatterns$2.jwt, check.message, refs);
          break;
        case "cidr": {
          if (check.version !== "v6") {
            addPattern$2(res, zodPatterns$2.ipv4Cidr, check.message, refs);
          }
          if (check.version !== "v4") {
            addPattern$2(res, zodPatterns$2.ipv6Cidr, check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern$2(res, zodPatterns$2.emoji(), check.message, refs);
          break;
        case "ulid": {
          addPattern$2(res, zodPatterns$2.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat$2(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              res.contentEncoding = "base64";
              break;
            }
            case "pattern:zod": {
              addPattern$2(res, zodPatterns$2.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern$2(res, zodPatterns$2.nanoid, check.message, refs);
        }
      }
    }
  }
  return res;
}
function escapeLiteralCheckValue$2(literal, refs) {
  return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric$2(literal) : literal;
}
var ALPHA_NUMERIC$2 = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);
function escapeNonAlphaNumeric$2(source) {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    if (!ALPHA_NUMERIC$2.has(source[i])) {
      result += "\\";
    }
    result += source[i];
  }
  return result;
}
function addFormat$2(schema, value, message, refs) {
  var _a;
  if (schema.format || ((_a = schema.anyOf) == null ? void 0 : _a.some((x) => x.format))) {
    if (!schema.anyOf) {
      schema.anyOf = [];
    }
    if (schema.format) {
      schema.anyOf.push({
        format: schema.format
      });
      delete schema.format;
    }
    schema.anyOf.push({
      format: value,
      ...message && refs.errorMessages && { errorMessage: { format: message } }
    });
  } else {
    schema.format = value;
  }
}
function addPattern$2(schema, regex, message, refs) {
  var _a;
  if (schema.pattern || ((_a = schema.allOf) == null ? void 0 : _a.some((x) => x.pattern))) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push({
        pattern: schema.pattern
      });
      delete schema.pattern;
    }
    schema.allOf.push({
      pattern: stringifyRegExpWithFlags$2(regex, refs),
      ...message && refs.errorMessages && { errorMessage: { pattern: message } }
    });
  } else {
    schema.pattern = stringifyRegExpWithFlags$2(regex, refs);
  }
}
function stringifyRegExpWithFlags$2(regex, refs) {
  var _a;
  if (!refs.applyRegexFlags || !regex.flags) {
    return regex.source;
  }
  const flags = {
    i: regex.flags.includes("i"),
    // Case-insensitive
    m: regex.flags.includes("m"),
    // `^` and `$` matches adjacent to newline characters
    s: regex.flags.includes("s")
    // `.` matches newlines
  };
  const source = flags.i ? regex.source.toLowerCase() : regex.source;
  let pattern = "";
  let isEscaped = false;
  let inCharGroup = false;
  let inCharRange = false;
  for (let i = 0; i < source.length; i++) {
    if (isEscaped) {
      pattern += source[i];
      isEscaped = false;
      continue;
    }
    if (flags.i) {
      if (inCharGroup) {
        if (source[i].match(/[a-z]/)) {
          if (inCharRange) {
            pattern += source[i];
            pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
            inCharRange = false;
          } else if (source[i + 1] === "-" && ((_a = source[i + 2]) == null ? void 0 : _a.match(/[a-z]/))) {
            pattern += source[i];
            inCharRange = true;
          } else {
            pattern += `${source[i]}${source[i].toUpperCase()}`;
          }
          continue;
        }
      } else if (source[i].match(/[a-z]/)) {
        pattern += `[${source[i]}${source[i].toUpperCase()}]`;
        continue;
      }
    }
    if (flags.m) {
      if (source[i] === "^") {
        pattern += `(^|(?<=[\r
]))`;
        continue;
      } else if (source[i] === "$") {
        pattern += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (flags.s && source[i] === ".") {
      pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
      continue;
    }
    pattern += source[i];
    if (source[i] === "\\") {
      isEscaped = true;
    } else if (inCharGroup && source[i] === "]") {
      inCharGroup = false;
    } else if (!inCharGroup && source[i] === "[") {
      inCharGroup = true;
    }
  }
  return pattern;
}

// src/zod-to-json-schema/parsers/record.ts
function parseRecordDef$2(def, refs) {
  var _a, _b, _c, _d, _e, _f;
  const schema = {
    type: "object",
    additionalProperties: (_a = parseDef$2(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    })) != null ? _a : refs.allowedAdditionalProperties
  };
  if (((_b = def.keyType) == null ? void 0 : _b._def.typeName) === ZodFirstPartyTypeKind.ZodString && ((_c = def.keyType._def.checks) == null ? void 0 : _c.length)) {
    const { type, ...keyType } = parseStringDef$2(def.keyType._def, refs);
    return {
      ...schema,
      propertyNames: keyType
    };
  } else if (((_d = def.keyType) == null ? void 0 : _d._def.typeName) === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      ...schema,
      propertyNames: {
        enum: def.keyType._def.values
      }
    };
  } else if (((_e = def.keyType) == null ? void 0 : _e._def.typeName) === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && ((_f = def.keyType._def.type._def.checks) == null ? void 0 : _f.length)) {
    const { type, ...keyType } = parseBrandedDef$2(
      def.keyType._def,
      refs
    );
    return {
      ...schema,
      propertyNames: keyType
    };
  }
  return schema;
}

// src/zod-to-json-schema/parsers/map.ts
function parseMapDef$2(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef$2(def, refs);
  }
  const keys = parseDef$2(def.keyType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "0"]
  }) || parseAnyDef$2();
  const values = parseDef$2(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "1"]
  }) || parseAnyDef$2();
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}

// src/zod-to-json-schema/parsers/native-enum.ts
function parseNativeEnumDef$2(def) {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object[object[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object[key]);
  const parsedTypes = Array.from(
    new Set(actualValues.map((values) => typeof values))
  );
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}

// src/zod-to-json-schema/parsers/never.ts
function parseNeverDef$2() {
  return { not: parseAnyDef$2() };
}

// src/zod-to-json-schema/parsers/null.ts
function parseNullDef$2() {
  return {
    type: "null"
  };
}

// src/zod-to-json-schema/parsers/union.ts
var primitiveMappings$2 = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef$2(def, refs) {
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every(
    (x) => x._def.typeName in primitiveMappings$2 && (!x._def.checks || !x._def.checks.length)
  )) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings$2[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce(
      (acc, x) => {
        const type = typeof x._def.value;
        switch (type) {
          case "string":
          case "number":
          case "boolean":
            return [...acc, type];
          case "bigint":
            return [...acc, "integer"];
          case "object":
            if (x._def.value === null) return [...acc, "null"];
          case "symbol":
          case "undefined":
          case "function":
          default:
            return acc;
        }
      },
      []
    );
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce(
          (acc, x) => {
            return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
          },
          []
        )
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce(
        (acc, x) => [
          ...acc,
          ...x._def.values.filter((x2) => !acc.includes(x2))
        ],
        []
      )
    };
  }
  return asAnyOf$2(def, refs);
}
var asAnyOf$2 = (def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map(
    (x, i) => parseDef$2(x._def, {
      ...refs,
      currentPath: [...refs.currentPath, "anyOf", `${i}`]
    })
  ).filter(
    (x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0)
  );
  return anyOf.length ? { anyOf } : void 0;
};

// src/zod-to-json-schema/parsers/nullable.ts
function parseNullableDef$2(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
    def.innerType._def.typeName
  ) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    return {
      type: [
        primitiveMappings$2[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  const base = parseDef$2(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"]
  });
  return base && { anyOf: [base, { type: "null" }] };
}

// src/zod-to-json-schema/parsers/number.ts
function parseNumberDef$2(def) {
  const res = {
    type: "number"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        break;
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}

// src/zod-to-json-schema/parsers/object.ts
function parseObjectDef$2(def, refs) {
  const result = {
    type: "object",
    properties: {}
  };
  const required = [];
  const shape = def.shape();
  for (const propName in shape) {
    let propDef = shape[propName];
    if (propDef === void 0 || propDef._def === void 0) {
      continue;
    }
    const propOptional = safeIsOptional$2(propDef);
    const parsedDef = parseDef$2(propDef._def, {
      ...refs,
      currentPath: [...refs.currentPath, "properties", propName],
      propertyPath: [...refs.currentPath, "properties", propName]
    });
    if (parsedDef === void 0) {
      continue;
    }
    result.properties[propName] = parsedDef;
    if (!propOptional) {
      required.push(propName);
    }
  }
  if (required.length) {
    result.required = required;
  }
  const additionalProperties = decideAdditionalProperties$2(def, refs);
  if (additionalProperties !== void 0) {
    result.additionalProperties = additionalProperties;
  }
  return result;
}
function decideAdditionalProperties$2(def, refs) {
  if (def.catchall._def.typeName !== "ZodNever") {
    return parseDef$2(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    });
  }
  switch (def.unknownKeys) {
    case "passthrough":
      return refs.allowedAdditionalProperties;
    case "strict":
      return refs.rejectedAdditionalProperties;
    case "strip":
      return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
  }
}
function safeIsOptional$2(schema) {
  try {
    return schema.isOptional();
  } catch (e) {
    return true;
  }
}

// src/zod-to-json-schema/parsers/optional.ts
var parseOptionalDef$2 = (def, refs) => {
  var _a;
  if (refs.currentPath.toString() === ((_a = refs.propertyPath) == null ? void 0 : _a.toString())) {
    return parseDef$2(def.innerType._def, refs);
  }
  const innerSchema = parseDef$2(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "1"]
  });
  return innerSchema ? { anyOf: [{ not: parseAnyDef$2() }, innerSchema] } : parseAnyDef$2();
};

// src/zod-to-json-schema/parsers/pipeline.ts
var parsePipelineDef$2 = (def, refs) => {
  if (refs.pipeStrategy === "input") {
    return parseDef$2(def.in._def, refs);
  } else if (refs.pipeStrategy === "output") {
    return parseDef$2(def.out._def, refs);
  }
  const a = parseDef$2(def.in._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", "0"]
  });
  const b = parseDef$2(def.out._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
  });
  return {
    allOf: [a, b].filter((x) => x !== void 0)
  };
};

// src/zod-to-json-schema/parsers/promise.ts
function parsePromiseDef$2(def, refs) {
  return parseDef$2(def.type._def, refs);
}

// src/zod-to-json-schema/parsers/set.ts
function parseSetDef$2(def, refs) {
  const items = parseDef$2(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items"]
  });
  const schema = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    schema.minItems = def.minSize.value;
  }
  if (def.maxSize) {
    schema.maxItems = def.maxSize.value;
  }
  return schema;
}

// src/zod-to-json-schema/parsers/tuple.ts
function parseTupleDef$2(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef$2(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      ),
      additionalItems: parseDef$2(def.rest._def, {
        ...refs,
        currentPath: [...refs.currentPath, "additionalItems"]
      })
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef$2(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      )
    };
  }
}

// src/zod-to-json-schema/parsers/undefined.ts
function parseUndefinedDef$2() {
  return {
    not: parseAnyDef$2()
  };
}

// src/zod-to-json-schema/parsers/unknown.ts
function parseUnknownDef$2() {
  return parseAnyDef$2();
}

// src/zod-to-json-schema/parsers/readonly.ts
var parseReadonlyDef$2 = (def, refs) => {
  return parseDef$2(def.innerType._def, refs);
};

// src/zod-to-json-schema/select-parser.ts
var selectParser$2 = (def, typeName, refs) => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef$2(def);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef$2(def);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef$2();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef$2();
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef$2();
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef$2(def);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef$2(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef$2(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return () => def.getter()._def;
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef$2();
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef$2();
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef$2();
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodReadonly:
      return parseReadonlyDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef$2(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return void 0;
    default:
      return /* @__PURE__ */ ((_) => void 0)();
  }
};

// src/zod-to-json-schema/parse-def.ts
function parseDef$2(def, refs, forceResolution = false) {
  var _a;
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = (_a = refs.override) == null ? void 0 : _a.call(
      refs,
      def,
      refs,
      seenItem,
      forceResolution
    );
    if (overrideResult !== ignoreOverride$2) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref$2(seenItem, refs);
    if (seenSchema !== void 0) {
      return seenSchema;
    }
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.set(def, newItem);
  const jsonSchemaOrGetter = selectParser$2(def, def.typeName, refs);
  const jsonSchema2 = typeof jsonSchemaOrGetter === "function" ? parseDef$2(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
  if (jsonSchema2) {
    addMeta$2(def, refs, jsonSchema2);
  }
  if (refs.postProcess) {
    const postProcessResult = refs.postProcess(jsonSchema2, def, refs);
    newItem.jsonSchema = jsonSchema2;
    return postProcessResult;
  }
  newItem.jsonSchema = jsonSchema2;
  return jsonSchema2;
}
var get$ref$2 = (item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return { $ref: item.path.join("/") };
    case "relative":
      return { $ref: getRelativePath$2(refs.currentPath, item.path) };
    case "none":
    case "seen": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
        console.warn(
          `Recursive reference detected at ${refs.currentPath.join(
            "/"
          )}! Defaulting to any`
        );
        return parseAnyDef$2();
      }
      return refs.$refStrategy === "seen" ? parseAnyDef$2() : void 0;
    }
  }
};
var addMeta$2 = (def, refs, jsonSchema2) => {
  if (def.description) {
    jsonSchema2.description = def.description;
  }
  return jsonSchema2;
};

// src/zod-to-json-schema/refs.ts
var getRefs$2 = (options) => {
  const _options = getDefaultOptions$2(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return {
    ..._options,
    currentPath,
    propertyPath: void 0,
    seen: new Map(
      Object.entries(_options.definitions).map(([name, def]) => [
        def._def,
        {
          def: def._def,
          path: [..._options.basePath, _options.definitionPath, name],
          // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
          jsonSchema: void 0
        }
      ])
    )
  };
};

// src/zod-to-json-schema/zod-to-json-schema.ts
var zodToJsonSchema$2 = (schema, options) => {
  var _a;
  const refs = getRefs$2(options);
  let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce(
    (acc, [name2, schema2]) => {
      var _a2;
      return {
        ...acc,
        [name2]: (_a2 = parseDef$2(
          schema2._def,
          {
            ...refs,
            currentPath: [...refs.basePath, refs.definitionPath, name2]
          },
          true
        )) != null ? _a2 : parseAnyDef$2()
      };
    },
    {}
  ) : void 0;
  const name = typeof options === "string" ? options : (options == null ? void 0 : options.nameStrategy) === "title" ? void 0 : options == null ? void 0 : options.name;
  const main = (_a = parseDef$2(
    schema._def,
    name === void 0 ? refs : {
      ...refs,
      currentPath: [...refs.basePath, refs.definitionPath, name]
    },
    false
  )) != null ? _a : parseAnyDef$2();
  const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
  if (title !== void 0) {
    main.title = title;
  }
  const combined = name === void 0 ? definitions ? {
    ...main,
    [refs.definitionPath]: definitions
  } : main : {
    $ref: [
      ...refs.$refStrategy === "relative" ? [] : refs.basePath,
      refs.definitionPath,
      name
    ].join("/"),
    [refs.definitionPath]: {
      ...definitions,
      [name]: main
    }
  };
  combined.$schema = "http://json-schema.org/draft-07/schema#";
  return combined;
};

// src/zod-to-json-schema/index.ts
var zod_to_json_schema_default$2 = zodToJsonSchema$2;

// src/zod-schema.ts
function zod3Schema$2(zodSchema2, options) {
  var _a;
  const useReferences = (_a = void 0 ) != null ? _a : false;
  return jsonSchema$2(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => zod_to_json_schema_default$2(zodSchema2, {
      $refStrategy: useReferences ? "root" : "none"
    }),
    {
      validate: async (value) => {
        const result = await zodSchema2.safeParseAsync(value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
function zod4Schema$2(zodSchema2, options) {
  var _a;
  const useReferences = (_a = void 0 ) != null ? _a : false;
  return jsonSchema$2(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => toJSONSchema(zodSchema2, {
      target: "draft-7",
      io: "output",
      reused: useReferences ? "ref" : "inline"
    }),
    {
      validate: async (value) => {
        const result = await safeParseAsync(zodSchema2, value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
function isZod4Schema$2(zodSchema2) {
  return "_zod" in zodSchema2;
}
function zodSchema$2(zodSchema2, options) {
  if (isZod4Schema$2(zodSchema2)) {
    return zod4Schema$2(zodSchema2);
  } else {
    return zod3Schema$2(zodSchema2);
  }
}

// src/schema.ts
var schemaSymbol$2 = Symbol.for("vercel.ai.schema");
function lazySchema$2(createSchema) {
  let schema;
  return () => {
    if (schema == null) {
      schema = createSchema();
    }
    return schema;
  };
}
function jsonSchema$2(jsonSchema2, {
  validate
} = {}) {
  return {
    [schemaSymbol$2]: true,
    _type: void 0,
    // should never be used directly
    [validatorSymbol$6]: true,
    get jsonSchema() {
      if (typeof jsonSchema2 === "function") {
        jsonSchema2 = jsonSchema2();
      }
      return jsonSchema2;
    },
    validate
  };
}

// src/uint8-utils.ts
var { btoa: btoa$5} = globalThis;
function convertUint8ArrayToBase64$5(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa$5(latin1string);
}
function convertToBase64$4(value) {
  return value instanceof Uint8Array ? convertUint8ArrayToBase64$5(value) : value;
}

// src/without-trailing-slash.ts
function withoutTrailingSlash$5(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}

// src/anthropic-provider.ts

// src/version.ts
var VERSION$9 = "2.0.33" ;
var anthropicErrorDataSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      type: literal("error"),
      error: object({
        type: string(),
        message: string()
      })
    })
  )
);
var anthropicFailedResponseHandler = createJsonErrorResponseHandler$6({
  errorSchema: anthropicErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
var anthropicMessagesResponseSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      type: literal("message"),
      id: string().nullish(),
      model: string().nullish(),
      content: array(
        discriminatedUnion("type", [
          object({
            type: literal("text"),
            text: string(),
            citations: array(
              discriminatedUnion("type", [
                object({
                  type: literal("web_search_result_location"),
                  cited_text: string(),
                  url: string(),
                  title: string(),
                  encrypted_index: string()
                }),
                object({
                  type: literal("page_location"),
                  cited_text: string(),
                  document_index: number(),
                  document_title: string().nullable(),
                  start_page_number: number(),
                  end_page_number: number()
                }),
                object({
                  type: literal("char_location"),
                  cited_text: string(),
                  document_index: number(),
                  document_title: string().nullable(),
                  start_char_index: number(),
                  end_char_index: number()
                })
              ])
            ).optional()
          }),
          object({
            type: literal("thinking"),
            thinking: string(),
            signature: string()
          }),
          object({
            type: literal("redacted_thinking"),
            data: string()
          }),
          object({
            type: literal("tool_use"),
            id: string(),
            name: string(),
            input: unknown()
          }),
          object({
            type: literal("server_tool_use"),
            id: string(),
            name: string(),
            input: record(string(), unknown()).nullish()
          }),
          object({
            type: literal("web_fetch_tool_result"),
            tool_use_id: string(),
            content: union([
              object({
                type: literal("web_fetch_result"),
                url: string(),
                retrieved_at: string(),
                content: object({
                  type: literal("document"),
                  title: string().nullable(),
                  citations: object({ enabled: boolean() }).optional(),
                  source: object({
                    type: literal("text"),
                    media_type: string(),
                    data: string()
                  })
                })
              }),
              object({
                type: literal("web_fetch_tool_result_error"),
                error_code: string()
              })
            ])
          }),
          object({
            type: literal("web_search_tool_result"),
            tool_use_id: string(),
            content: union([
              array(
                object({
                  type: literal("web_search_result"),
                  url: string(),
                  title: string(),
                  encrypted_content: string(),
                  page_age: string().nullish()
                })
              ),
              object({
                type: literal("web_search_tool_result_error"),
                error_code: string()
              })
            ])
          }),
          // code execution results for code_execution_20250522 tool:
          object({
            type: literal("code_execution_tool_result"),
            tool_use_id: string(),
            content: union([
              object({
                type: literal("code_execution_result"),
                stdout: string(),
                stderr: string(),
                return_code: number()
              }),
              object({
                type: literal("code_execution_tool_result_error"),
                error_code: string()
              })
            ])
          }),
          // bash code execution results for code_execution_20250825 tool:
          object({
            type: literal("bash_code_execution_tool_result"),
            tool_use_id: string(),
            content: discriminatedUnion("type", [
              object({
                type: literal("bash_code_execution_result"),
                content: array(
                  object({
                    type: literal("bash_code_execution_output"),
                    file_id: string()
                  })
                ),
                stdout: string(),
                stderr: string(),
                return_code: number()
              }),
              object({
                type: literal("bash_code_execution_tool_result_error"),
                error_code: string()
              })
            ])
          }),
          // text editor code execution results for code_execution_20250825 tool:
          object({
            type: literal("text_editor_code_execution_tool_result"),
            tool_use_id: string(),
            content: discriminatedUnion("type", [
              object({
                type: literal("text_editor_code_execution_tool_result_error"),
                error_code: string()
              }),
              object({
                type: literal("text_editor_code_execution_view_result"),
                content: string(),
                file_type: string(),
                num_lines: number().nullable(),
                start_line: number().nullable(),
                total_lines: number().nullable()
              }),
              object({
                type: literal("text_editor_code_execution_create_result"),
                is_file_update: boolean()
              }),
              object({
                type: literal(
                  "text_editor_code_execution_str_replace_result"
                ),
                lines: array(string()).nullable(),
                new_lines: number().nullable(),
                new_start: number().nullable(),
                old_lines: number().nullable(),
                old_start: number().nullable()
              })
            ])
          })
        ])
      ),
      stop_reason: string().nullish(),
      stop_sequence: string().nullish(),
      usage: looseObject({
        input_tokens: number(),
        output_tokens: number(),
        cache_creation_input_tokens: number().nullish(),
        cache_read_input_tokens: number().nullish()
      })
    })
  )
);
var anthropicMessagesChunkSchema = lazySchema$2(
  () => zodSchema$2(
    discriminatedUnion("type", [
      object({
        type: literal("message_start"),
        message: object({
          id: string().nullish(),
          model: string().nullish(),
          usage: looseObject({
            input_tokens: number(),
            cache_creation_input_tokens: number().nullish(),
            cache_read_input_tokens: number().nullish()
          })
        })
      }),
      object({
        type: literal("content_block_start"),
        index: number(),
        content_block: discriminatedUnion("type", [
          object({
            type: literal("text"),
            text: string()
          }),
          object({
            type: literal("thinking"),
            thinking: string()
          }),
          object({
            type: literal("tool_use"),
            id: string(),
            name: string()
          }),
          object({
            type: literal("redacted_thinking"),
            data: string()
          }),
          object({
            type: literal("server_tool_use"),
            id: string(),
            name: string(),
            input: record(string(), unknown()).nullish()
          }),
          object({
            type: literal("web_fetch_tool_result"),
            tool_use_id: string(),
            content: union([
              object({
                type: literal("web_fetch_result"),
                url: string(),
                retrieved_at: string(),
                content: object({
                  type: literal("document"),
                  title: string().nullable(),
                  citations: object({ enabled: boolean() }).optional(),
                  source: object({
                    type: literal("text"),
                    media_type: string(),
                    data: string()
                  })
                })
              }),
              object({
                type: literal("web_fetch_tool_result_error"),
                error_code: string()
              })
            ])
          }),
          object({
            type: literal("web_search_tool_result"),
            tool_use_id: string(),
            content: union([
              array(
                object({
                  type: literal("web_search_result"),
                  url: string(),
                  title: string(),
                  encrypted_content: string(),
                  page_age: string().nullish()
                })
              ),
              object({
                type: literal("web_search_tool_result_error"),
                error_code: string()
              })
            ])
          }),
          // code execution results for code_execution_20250522 tool:
          object({
            type: literal("code_execution_tool_result"),
            tool_use_id: string(),
            content: union([
              object({
                type: literal("code_execution_result"),
                stdout: string(),
                stderr: string(),
                return_code: number()
              }),
              object({
                type: literal("code_execution_tool_result_error"),
                error_code: string()
              })
            ])
          }),
          // bash code execution results for code_execution_20250825 tool:
          object({
            type: literal("bash_code_execution_tool_result"),
            tool_use_id: string(),
            content: discriminatedUnion("type", [
              object({
                type: literal("bash_code_execution_result"),
                content: array(
                  object({
                    type: literal("bash_code_execution_output"),
                    file_id: string()
                  })
                ),
                stdout: string(),
                stderr: string(),
                return_code: number()
              }),
              object({
                type: literal("bash_code_execution_tool_result_error"),
                error_code: string()
              })
            ])
          }),
          // text editor code execution results for code_execution_20250825 tool:
          object({
            type: literal("text_editor_code_execution_tool_result"),
            tool_use_id: string(),
            content: discriminatedUnion("type", [
              object({
                type: literal("text_editor_code_execution_tool_result_error"),
                error_code: string()
              }),
              object({
                type: literal("text_editor_code_execution_view_result"),
                content: string(),
                file_type: string(),
                num_lines: number().nullable(),
                start_line: number().nullable(),
                total_lines: number().nullable()
              }),
              object({
                type: literal("text_editor_code_execution_create_result"),
                is_file_update: boolean()
              }),
              object({
                type: literal(
                  "text_editor_code_execution_str_replace_result"
                ),
                lines: array(string()).nullable(),
                new_lines: number().nullable(),
                new_start: number().nullable(),
                old_lines: number().nullable(),
                old_start: number().nullable()
              })
            ])
          })
        ])
      }),
      object({
        type: literal("content_block_delta"),
        index: number(),
        delta: discriminatedUnion("type", [
          object({
            type: literal("input_json_delta"),
            partial_json: string()
          }),
          object({
            type: literal("text_delta"),
            text: string()
          }),
          object({
            type: literal("thinking_delta"),
            thinking: string()
          }),
          object({
            type: literal("signature_delta"),
            signature: string()
          }),
          object({
            type: literal("citations_delta"),
            citation: discriminatedUnion("type", [
              object({
                type: literal("web_search_result_location"),
                cited_text: string(),
                url: string(),
                title: string(),
                encrypted_index: string()
              }),
              object({
                type: literal("page_location"),
                cited_text: string(),
                document_index: number(),
                document_title: string().nullable(),
                start_page_number: number(),
                end_page_number: number()
              }),
              object({
                type: literal("char_location"),
                cited_text: string(),
                document_index: number(),
                document_title: string().nullable(),
                start_char_index: number(),
                end_char_index: number()
              })
            ])
          })
        ])
      }),
      object({
        type: literal("content_block_stop"),
        index: number()
      }),
      object({
        type: literal("error"),
        error: object({
          type: string(),
          message: string()
        })
      }),
      object({
        type: literal("message_delta"),
        delta: object({
          stop_reason: string().nullish(),
          stop_sequence: string().nullish()
        }),
        usage: looseObject({
          output_tokens: number(),
          cache_creation_input_tokens: number().nullish()
        })
      }),
      object({
        type: literal("message_stop")
      }),
      object({
        type: literal("ping")
      })
    ])
  )
);
var anthropicReasoningMetadataSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      signature: string().optional(),
      redactedData: string().optional()
    })
  )
);
var anthropicFilePartProviderOptions = object({
  /**
   * Citation configuration for this document.
   * When enabled, this document will generate citations in the response.
   */
  citations: object({
    /**
     * Enable citations for this document
     */
    enabled: boolean()
  }).optional(),
  /**
   * Custom title for the document.
   * If not provided, the filename will be used.
   */
  title: string().optional(),
  /**
   * Context about the document that will be passed to the model
   * but not used towards cited content.
   * Useful for storing document metadata as text or stringified JSON.
   */
  context: string().optional()
});
var anthropicProviderOptions = object({
  sendReasoning: boolean().optional(),
  thinking: object({
    type: union([literal("enabled"), literal("disabled")]),
    budgetTokens: number().optional()
  }).optional(),
  /**
   * Whether to disable parallel function calling during tool use. Default is false.
   * When set to true, Claude will use at most one tool per response.
   */
  disableParallelToolUse: boolean().optional(),
  /**
   * Cache control settings for this message.
   * See https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
   */
  cacheControl: object({
    type: literal("ephemeral"),
    ttl: union([literal("5m"), literal("1h")]).optional()
  }).optional(),
  /**
   * Agent Skills configuration. Skills enable Claude to perform specialized tasks
   * like document processing (PPTX, DOCX, PDF, XLSX) and data analysis.
   * Requires code execution tool to be enabled.
   */
  container: object({
    id: string().optional(),
    skills: array(
      object({
        type: union([literal("anthropic"), literal("custom")]),
        skillId: string(),
        version: string().optional()
      })
    ).optional()
  }).optional()
});

// src/get-cache-control.ts
var MAX_CACHE_BREAKPOINTS = 4;
function getCacheControl$1(providerMetadata) {
  var _a;
  const anthropic2 = providerMetadata == null ? void 0 : providerMetadata.anthropic;
  const cacheControlValue = (_a = anthropic2 == null ? void 0 : anthropic2.cacheControl) != null ? _a : anthropic2 == null ? void 0 : anthropic2.cache_control;
  return cacheControlValue;
}
var CacheControlValidator = class {
  constructor() {
    this.breakpointCount = 0;
    this.warnings = [];
  }
  getCacheControl(providerMetadata, context) {
    const cacheControlValue = getCacheControl$1(providerMetadata);
    if (!cacheControlValue) {
      return void 0;
    }
    if (!context.canCache) {
      this.warnings.push({
        type: "unsupported-setting",
        setting: "cacheControl",
        details: `cache_control cannot be set on ${context.type}. It will be ignored.`
      });
      return void 0;
    }
    this.breakpointCount++;
    if (this.breakpointCount > MAX_CACHE_BREAKPOINTS) {
      this.warnings.push({
        type: "unsupported-setting",
        setting: "cacheControl",
        details: `Maximum ${MAX_CACHE_BREAKPOINTS} cache breakpoints exceeded (found ${this.breakpointCount}). This breakpoint will be ignored.`
      });
      return void 0;
    }
    return cacheControlValue;
  }
  getWarnings() {
    return this.warnings;
  }
};
var textEditor_20250728ArgsSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      maxCharacters: number().optional()
    })
  )
);
var textEditor_20250728InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      command: _enum(["view", "create", "str_replace", "insert"]),
      path: string(),
      file_text: string().optional(),
      insert_line: number().int().optional(),
      new_str: string().optional(),
      old_str: string().optional(),
      view_range: array(number().int()).optional()
    })
  )
);
var factory = createProviderDefinedToolFactory$1({
  id: "anthropic.text_editor_20250728",
  name: "str_replace_based_edit_tool",
  inputSchema: textEditor_20250728InputSchema
});
var textEditor_20250728 = (args = {}) => {
  return factory(args);
};
var webSearch_20250305ArgsSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      maxUses: number().optional(),
      allowedDomains: array(string()).optional(),
      blockedDomains: array(string()).optional(),
      userLocation: object({
        type: literal("approximate"),
        city: string().optional(),
        region: string().optional(),
        country: string().optional(),
        timezone: string().optional()
      }).optional()
    })
  )
);
var webSearch_20250305OutputSchema = lazySchema$2(
  () => zodSchema$2(
    array(
      object({
        url: string(),
        title: string(),
        pageAge: string().nullable(),
        encryptedContent: string(),
        type: literal("web_search_result")
      })
    )
  )
);
var webSearch_20250305InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      query: string()
    })
  )
);
var factory2 = createProviderDefinedToolFactoryWithOutputSchema$2({
  id: "anthropic.web_search_20250305",
  name: "web_search",
  inputSchema: webSearch_20250305InputSchema,
  outputSchema: webSearch_20250305OutputSchema
});
var webSearch_20250305 = (args = {}) => {
  return factory2(args);
};
var webFetch_20250910ArgsSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      maxUses: number().optional(),
      allowedDomains: array(string()).optional(),
      blockedDomains: array(string()).optional(),
      citations: object({ enabled: boolean() }).optional(),
      maxContentTokens: number().optional()
    })
  )
);
var webFetch_20250910OutputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      type: literal("web_fetch_result"),
      url: string(),
      content: object({
        type: literal("document"),
        title: string(),
        citations: object({ enabled: boolean() }).optional(),
        source: union([
          object({
            type: literal("base64"),
            mediaType: literal("application/pdf"),
            data: string()
          }),
          object({
            type: literal("text"),
            mediaType: literal("text/plain"),
            data: string()
          })
        ])
      }),
      retrievedAt: string().nullable()
    })
  )
);
var webFetch_20250910InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      url: string()
    })
  )
);
var factory3 = createProviderDefinedToolFactoryWithOutputSchema$2({
  id: "anthropic.web_fetch_20250910",
  name: "web_fetch",
  inputSchema: webFetch_20250910InputSchema,
  outputSchema: webFetch_20250910OutputSchema
});
var webFetch_20250910 = (args = {}) => {
  return factory3(args);
};
async function prepareTools$3({
  tools,
  toolChoice,
  disableParallelToolUse,
  cacheControlValidator
}) {
  tools = (tools == null ? void 0 : tools.length) ? tools : void 0;
  const toolWarnings = [];
  const betas = /* @__PURE__ */ new Set();
  const validator = cacheControlValidator || new CacheControlValidator();
  if (tools == null) {
    return { tools: void 0, toolChoice: void 0, toolWarnings, betas };
  }
  const anthropicTools2 = [];
  for (const tool of tools) {
    switch (tool.type) {
      case "function": {
        const cacheControl = validator.getCacheControl(tool.providerOptions, {
          type: "tool definition",
          canCache: true
        });
        anthropicTools2.push({
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
          cache_control: cacheControl
        });
        break;
      }
      case "provider-defined": {
        switch (tool.id) {
          case "anthropic.code_execution_20250522": {
            betas.add("code-execution-2025-05-22");
            anthropicTools2.push({
              type: "code_execution_20250522",
              name: "code_execution",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.code_execution_20250825": {
            betas.add("code-execution-2025-08-25");
            anthropicTools2.push({
              type: "code_execution_20250825",
              name: "code_execution"
            });
            break;
          }
          case "anthropic.computer_20250124": {
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: "computer",
              type: "computer_20250124",
              display_width_px: tool.args.displayWidthPx,
              display_height_px: tool.args.displayHeightPx,
              display_number: tool.args.displayNumber,
              cache_control: void 0
            });
            break;
          }
          case "anthropic.computer_20241022": {
            betas.add("computer-use-2024-10-22");
            anthropicTools2.push({
              name: "computer",
              type: "computer_20241022",
              display_width_px: tool.args.displayWidthPx,
              display_height_px: tool.args.displayHeightPx,
              display_number: tool.args.displayNumber,
              cache_control: void 0
            });
            break;
          }
          case "anthropic.text_editor_20250124": {
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: "str_replace_editor",
              type: "text_editor_20250124",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.text_editor_20241022": {
            betas.add("computer-use-2024-10-22");
            anthropicTools2.push({
              name: "str_replace_editor",
              type: "text_editor_20241022",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.text_editor_20250429": {
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: "str_replace_based_edit_tool",
              type: "text_editor_20250429",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.text_editor_20250728": {
            const args = await validateTypes$6({
              value: tool.args,
              schema: textEditor_20250728ArgsSchema
            });
            anthropicTools2.push({
              name: "str_replace_based_edit_tool",
              type: "text_editor_20250728",
              max_characters: args.maxCharacters,
              cache_control: void 0
            });
            break;
          }
          case "anthropic.bash_20250124": {
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: "bash",
              type: "bash_20250124",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.bash_20241022": {
            betas.add("computer-use-2024-10-22");
            anthropicTools2.push({
              name: "bash",
              type: "bash_20241022",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.memory_20250818": {
            betas.add("context-management-2025-06-27");
            anthropicTools2.push({
              name: "memory",
              type: "memory_20250818"
            });
            break;
          }
          case "anthropic.web_fetch_20250910": {
            betas.add("web-fetch-2025-09-10");
            const args = await validateTypes$6({
              value: tool.args,
              schema: webFetch_20250910ArgsSchema
            });
            anthropicTools2.push({
              type: "web_fetch_20250910",
              name: "web_fetch",
              max_uses: args.maxUses,
              allowed_domains: args.allowedDomains,
              blocked_domains: args.blockedDomains,
              citations: args.citations,
              max_content_tokens: args.maxContentTokens,
              cache_control: void 0
            });
            break;
          }
          case "anthropic.web_search_20250305": {
            const args = await validateTypes$6({
              value: tool.args,
              schema: webSearch_20250305ArgsSchema
            });
            anthropicTools2.push({
              type: "web_search_20250305",
              name: "web_search",
              max_uses: args.maxUses,
              allowed_domains: args.allowedDomains,
              blocked_domains: args.blockedDomains,
              user_location: args.userLocation,
              cache_control: void 0
            });
            break;
          }
          default: {
            toolWarnings.push({ type: "unsupported-tool", tool });
            break;
          }
        }
        break;
      }
      default: {
        toolWarnings.push({ type: "unsupported-tool", tool });
        break;
      }
    }
  }
  if (toolChoice == null) {
    return {
      tools: anthropicTools2,
      toolChoice: disableParallelToolUse ? { type: "auto", disable_parallel_tool_use: disableParallelToolUse } : void 0,
      toolWarnings,
      betas
    };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
      return {
        tools: anthropicTools2,
        toolChoice: {
          type: "auto",
          disable_parallel_tool_use: disableParallelToolUse
        },
        toolWarnings,
        betas
      };
    case "required":
      return {
        tools: anthropicTools2,
        toolChoice: {
          type: "any",
          disable_parallel_tool_use: disableParallelToolUse
        },
        toolWarnings,
        betas
      };
    case "none":
      return { tools: void 0, toolChoice: void 0, toolWarnings, betas };
    case "tool":
      return {
        tools: anthropicTools2,
        toolChoice: {
          type: "tool",
          name: toolChoice.toolName,
          disable_parallel_tool_use: disableParallelToolUse
        },
        toolWarnings,
        betas
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError$5({
        functionality: `tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var codeExecution_20250522OutputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      type: literal("code_execution_result"),
      stdout: string(),
      stderr: string(),
      return_code: number()
    })
  )
);
var codeExecution_20250522InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      code: string()
    })
  )
);
var factory4 = createProviderDefinedToolFactoryWithOutputSchema$2({
  id: "anthropic.code_execution_20250522",
  name: "code_execution",
  inputSchema: codeExecution_20250522InputSchema,
  outputSchema: codeExecution_20250522OutputSchema
});
var codeExecution_20250522 = (args = {}) => {
  return factory4(args);
};
var codeExecution_20250825OutputSchema = lazySchema$2(
  () => zodSchema$2(
    discriminatedUnion("type", [
      object({
        type: literal("bash_code_execution_result"),
        content: array(
          object({
            type: literal("bash_code_execution_output"),
            file_id: string()
          })
        ),
        stdout: string(),
        stderr: string(),
        return_code: number()
      }),
      object({
        type: literal("bash_code_execution_tool_result_error"),
        error_code: string()
      }),
      object({
        type: literal("text_editor_code_execution_tool_result_error"),
        error_code: string()
      }),
      object({
        type: literal("text_editor_code_execution_view_result"),
        content: string(),
        file_type: string(),
        num_lines: number().nullable(),
        start_line: number().nullable(),
        total_lines: number().nullable()
      }),
      object({
        type: literal("text_editor_code_execution_create_result"),
        is_file_update: boolean()
      }),
      object({
        type: literal("text_editor_code_execution_str_replace_result"),
        lines: array(string()).nullable(),
        new_lines: number().nullable(),
        new_start: number().nullable(),
        old_lines: number().nullable(),
        old_start: number().nullable()
      })
    ])
  )
);
var codeExecution_20250825InputSchema = lazySchema$2(
  () => zodSchema$2(
    discriminatedUnion("type", [
      object({
        type: literal("bash_code_execution"),
        command: string()
      }),
      discriminatedUnion("command", [
        object({
          type: literal("text_editor_code_execution"),
          command: literal("view"),
          path: string()
        }),
        object({
          type: literal("text_editor_code_execution"),
          command: literal("create"),
          path: string(),
          file_text: string().nullish()
        }),
        object({
          type: literal("text_editor_code_execution"),
          command: literal("str_replace"),
          path: string(),
          old_str: string(),
          new_str: string()
        })
      ])
    ])
  )
);
var factory5 = createProviderDefinedToolFactoryWithOutputSchema$2({
  id: "anthropic.code_execution_20250825",
  name: "code_execution",
  inputSchema: codeExecution_20250825InputSchema,
  outputSchema: codeExecution_20250825OutputSchema
});
var codeExecution_20250825 = (args = {}) => {
  return factory5(args);
};

// src/convert-to-anthropic-messages-prompt.ts
function convertToString(data) {
  if (typeof data === "string") {
    return Buffer.from(data, "base64").toString("utf-8");
  }
  if (data instanceof Uint8Array) {
    return new TextDecoder().decode(data);
  }
  if (data instanceof URL) {
    throw new UnsupportedFunctionalityError$5({
      functionality: "URL-based text documents are not supported for citations"
    });
  }
  throw new UnsupportedFunctionalityError$5({
    functionality: `unsupported data type for text documents: ${typeof data}`
  });
}
async function convertToAnthropicMessagesPrompt({
  prompt,
  sendReasoning,
  warnings,
  cacheControlValidator
}) {
  var _a, _b, _c, _d, _e;
  const betas = /* @__PURE__ */ new Set();
  const blocks = groupIntoBlocks(prompt);
  const validator = cacheControlValidator || new CacheControlValidator();
  let system = void 0;
  const messages = [];
  async function shouldEnableCitations(providerMetadata) {
    var _a2, _b2;
    const anthropicOptions = await parseProviderOptions$4({
      provider: "anthropic",
      providerOptions: providerMetadata,
      schema: anthropicFilePartProviderOptions
    });
    return (_b2 = (_a2 = anthropicOptions == null ? void 0 : anthropicOptions.citations) == null ? void 0 : _a2.enabled) != null ? _b2 : false;
  }
  async function getDocumentMetadata(providerMetadata) {
    const anthropicOptions = await parseProviderOptions$4({
      provider: "anthropic",
      providerOptions: providerMetadata,
      schema: anthropicFilePartProviderOptions
    });
    return {
      title: anthropicOptions == null ? void 0 : anthropicOptions.title,
      context: anthropicOptions == null ? void 0 : anthropicOptions.context
    };
  }
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isLastBlock = i === blocks.length - 1;
    const type = block.type;
    switch (type) {
      case "system": {
        if (system != null) {
          throw new UnsupportedFunctionalityError$5({
            functionality: "Multiple system messages that are separated by user/assistant messages"
          });
        }
        system = block.messages.map(({ content, providerOptions }) => ({
          type: "text",
          text: content,
          cache_control: validator.getCacheControl(providerOptions, {
            type: "system message",
            canCache: true
          })
        }));
        break;
      }
      case "user": {
        const anthropicContent = [];
        for (const message of block.messages) {
          const { role, content } = message;
          switch (role) {
            case "user": {
              for (let j = 0; j < content.length; j++) {
                const part = content[j];
                const isLastPart = j === content.length - 1;
                const cacheControl = (_a = validator.getCacheControl(part.providerOptions, {
                  type: "user message part",
                  canCache: true
                })) != null ? _a : isLastPart ? validator.getCacheControl(message.providerOptions, {
                  type: "user message",
                  canCache: true
                }) : void 0;
                switch (part.type) {
                  case "text": {
                    anthropicContent.push({
                      type: "text",
                      text: part.text,
                      cache_control: cacheControl
                    });
                    break;
                  }
                  case "file": {
                    if (part.mediaType.startsWith("image/")) {
                      anthropicContent.push({
                        type: "image",
                        source: part.data instanceof URL ? {
                          type: "url",
                          url: part.data.toString()
                        } : {
                          type: "base64",
                          media_type: part.mediaType === "image/*" ? "image/jpeg" : part.mediaType,
                          data: convertToBase64$4(part.data)
                        },
                        cache_control: cacheControl
                      });
                    } else if (part.mediaType === "application/pdf") {
                      betas.add("pdfs-2024-09-25");
                      const enableCitations = await shouldEnableCitations(
                        part.providerOptions
                      );
                      const metadata = await getDocumentMetadata(
                        part.providerOptions
                      );
                      anthropicContent.push({
                        type: "document",
                        source: part.data instanceof URL ? {
                          type: "url",
                          url: part.data.toString()
                        } : {
                          type: "base64",
                          media_type: "application/pdf",
                          data: convertToBase64$4(part.data)
                        },
                        title: (_b = metadata.title) != null ? _b : part.filename,
                        ...metadata.context && { context: metadata.context },
                        ...enableCitations && {
                          citations: { enabled: true }
                        },
                        cache_control: cacheControl
                      });
                    } else if (part.mediaType === "text/plain") {
                      const enableCitations = await shouldEnableCitations(
                        part.providerOptions
                      );
                      const metadata = await getDocumentMetadata(
                        part.providerOptions
                      );
                      anthropicContent.push({
                        type: "document",
                        source: part.data instanceof URL ? {
                          type: "url",
                          url: part.data.toString()
                        } : {
                          type: "text",
                          media_type: "text/plain",
                          data: convertToString(part.data)
                        },
                        title: (_c = metadata.title) != null ? _c : part.filename,
                        ...metadata.context && { context: metadata.context },
                        ...enableCitations && {
                          citations: { enabled: true }
                        },
                        cache_control: cacheControl
                      });
                    } else {
                      throw new UnsupportedFunctionalityError$5({
                        functionality: `media type: ${part.mediaType}`
                      });
                    }
                    break;
                  }
                }
              }
              break;
            }
            case "tool": {
              for (let i2 = 0; i2 < content.length; i2++) {
                const part = content[i2];
                const isLastPart = i2 === content.length - 1;
                const cacheControl = (_d = validator.getCacheControl(part.providerOptions, {
                  type: "tool result part",
                  canCache: true
                })) != null ? _d : isLastPart ? validator.getCacheControl(message.providerOptions, {
                  type: "tool result message",
                  canCache: true
                }) : void 0;
                const output = part.output;
                let contentValue;
                switch (output.type) {
                  case "content":
                    contentValue = output.value.map((contentPart) => {
                      switch (contentPart.type) {
                        case "text":
                          return {
                            type: "text",
                            text: contentPart.text
                          };
                        case "media": {
                          if (contentPart.mediaType.startsWith("image/")) {
                            return {
                              type: "image",
                              source: {
                                type: "base64",
                                media_type: contentPart.mediaType,
                                data: contentPart.data
                              }
                            };
                          }
                          if (contentPart.mediaType === "application/pdf") {
                            betas.add("pdfs-2024-09-25");
                            return {
                              type: "document",
                              source: {
                                type: "base64",
                                media_type: contentPart.mediaType,
                                data: contentPart.data
                              }
                            };
                          }
                          throw new UnsupportedFunctionalityError$5({
                            functionality: `media type: ${contentPart.mediaType}`
                          });
                        }
                      }
                    });
                    break;
                  case "text":
                  case "error-text":
                    contentValue = output.value;
                    break;
                  case "json":
                  case "error-json":
                  default:
                    contentValue = JSON.stringify(output.value);
                    break;
                }
                anthropicContent.push({
                  type: "tool_result",
                  tool_use_id: part.toolCallId,
                  content: contentValue,
                  is_error: output.type === "error-text" || output.type === "error-json" ? true : void 0,
                  cache_control: cacheControl
                });
              }
              break;
            }
            default: {
              const _exhaustiveCheck = role;
              throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
            }
          }
        }
        messages.push({ role: "user", content: anthropicContent });
        break;
      }
      case "assistant": {
        const anthropicContent = [];
        for (let j = 0; j < block.messages.length; j++) {
          const message = block.messages[j];
          const isLastMessage = j === block.messages.length - 1;
          const { content } = message;
          for (let k = 0; k < content.length; k++) {
            const part = content[k];
            const isLastContentPart = k === content.length - 1;
            const cacheControl = (_e = validator.getCacheControl(part.providerOptions, {
              type: "assistant message part",
              canCache: true
            })) != null ? _e : isLastContentPart ? validator.getCacheControl(message.providerOptions, {
              type: "assistant message",
              canCache: true
            }) : void 0;
            switch (part.type) {
              case "text": {
                anthropicContent.push({
                  type: "text",
                  text: (
                    // trim the last text part if it's the last message in the block
                    // because Anthropic does not allow trailing whitespace
                    // in pre-filled assistant responses
                    isLastBlock && isLastMessage && isLastContentPart ? part.text.trim() : part.text
                  ),
                  cache_control: cacheControl
                });
                break;
              }
              case "reasoning": {
                if (sendReasoning) {
                  const reasoningMetadata = await parseProviderOptions$4({
                    provider: "anthropic",
                    providerOptions: part.providerOptions,
                    schema: anthropicReasoningMetadataSchema
                  });
                  if (reasoningMetadata != null) {
                    if (reasoningMetadata.signature != null) {
                      validator.getCacheControl(part.providerOptions, {
                        type: "thinking block",
                        canCache: false
                      });
                      anthropicContent.push({
                        type: "thinking",
                        thinking: part.text,
                        signature: reasoningMetadata.signature
                      });
                    } else if (reasoningMetadata.redactedData != null) {
                      validator.getCacheControl(part.providerOptions, {
                        type: "redacted thinking block",
                        canCache: false
                      });
                      anthropicContent.push({
                        type: "redacted_thinking",
                        data: reasoningMetadata.redactedData
                      });
                    } else {
                      warnings.push({
                        type: "other",
                        message: "unsupported reasoning metadata"
                      });
                    }
                  } else {
                    warnings.push({
                      type: "other",
                      message: "unsupported reasoning metadata"
                    });
                  }
                } else {
                  warnings.push({
                    type: "other",
                    message: "sending reasoning content is disabled for this model"
                  });
                }
                break;
              }
              case "tool-call": {
                if (part.providerExecuted) {
                  if (part.toolName === "code_execution" && part.input != null && typeof part.input === "object" && "type" in part.input && typeof part.input.type === "string" && (part.input.type === "bash_code_execution" || part.input.type === "text_editor_code_execution")) {
                    anthropicContent.push({
                      type: "server_tool_use",
                      id: part.toolCallId,
                      name: part.input.type,
                      // map back to subtool name
                      input: part.input,
                      cache_control: cacheControl
                    });
                  } else if (part.toolName === "code_execution" || // code execution 20250522
                  part.toolName === "web_fetch" || part.toolName === "web_search") {
                    anthropicContent.push({
                      type: "server_tool_use",
                      id: part.toolCallId,
                      name: part.toolName,
                      input: part.input,
                      cache_control: cacheControl
                    });
                  } else {
                    warnings.push({
                      type: "other",
                      message: `provider executed tool call for tool ${part.toolName} is not supported`
                    });
                  }
                  break;
                }
                anthropicContent.push({
                  type: "tool_use",
                  id: part.toolCallId,
                  name: part.toolName,
                  input: part.input,
                  cache_control: cacheControl
                });
                break;
              }
              case "tool-result": {
                if (part.toolName === "code_execution") {
                  const output = part.output;
                  if (output.type !== "json") {
                    warnings.push({
                      type: "other",
                      message: `provider executed tool result output type ${output.type} for tool ${part.toolName} is not supported`
                    });
                    break;
                  }
                  if (output.value == null || typeof output.value !== "object" || !("type" in output.value) || typeof output.value.type !== "string") {
                    warnings.push({
                      type: "other",
                      message: `provider executed tool result output value is not a valid code execution result for tool ${part.toolName}`
                    });
                    break;
                  }
                  if (output.value.type === "code_execution_result") {
                    const codeExecutionOutput = await validateTypes$6({
                      value: output.value,
                      schema: codeExecution_20250522OutputSchema
                    });
                    anthropicContent.push({
                      type: "code_execution_tool_result",
                      tool_use_id: part.toolCallId,
                      content: {
                        type: codeExecutionOutput.type,
                        stdout: codeExecutionOutput.stdout,
                        stderr: codeExecutionOutput.stderr,
                        return_code: codeExecutionOutput.return_code
                      },
                      cache_control: cacheControl
                    });
                  } else {
                    const codeExecutionOutput = await validateTypes$6({
                      value: output.value,
                      schema: codeExecution_20250825OutputSchema
                    });
                    anthropicContent.push(
                      codeExecutionOutput.type === "bash_code_execution_result" || codeExecutionOutput.type === "bash_code_execution_tool_result_error" ? {
                        type: "bash_code_execution_tool_result",
                        tool_use_id: part.toolCallId,
                        cache_control: cacheControl,
                        content: codeExecutionOutput
                      } : {
                        type: "text_editor_code_execution_tool_result",
                        tool_use_id: part.toolCallId,
                        cache_control: cacheControl,
                        content: codeExecutionOutput
                      }
                    );
                  }
                  break;
                }
                if (part.toolName === "web_fetch") {
                  const output = part.output;
                  if (output.type !== "json") {
                    warnings.push({
                      type: "other",
                      message: `provider executed tool result output type ${output.type} for tool ${part.toolName} is not supported`
                    });
                    break;
                  }
                  const webFetchOutput = await validateTypes$6({
                    value: output.value,
                    schema: webFetch_20250910OutputSchema
                  });
                  anthropicContent.push({
                    type: "web_fetch_tool_result",
                    tool_use_id: part.toolCallId,
                    content: {
                      type: "web_fetch_result",
                      url: webFetchOutput.url,
                      retrieved_at: webFetchOutput.retrievedAt,
                      content: {
                        type: "document",
                        title: webFetchOutput.content.title,
                        citations: webFetchOutput.content.citations,
                        source: {
                          type: webFetchOutput.content.source.type,
                          media_type: webFetchOutput.content.source.mediaType,
                          data: webFetchOutput.content.source.data
                        }
                      }
                    },
                    cache_control: cacheControl
                  });
                  break;
                }
                if (part.toolName === "web_search") {
                  const output = part.output;
                  if (output.type !== "json") {
                    warnings.push({
                      type: "other",
                      message: `provider executed tool result output type ${output.type} for tool ${part.toolName} is not supported`
                    });
                    break;
                  }
                  const webSearchOutput = await validateTypes$6({
                    value: output.value,
                    schema: webSearch_20250305OutputSchema
                  });
                  anthropicContent.push({
                    type: "web_search_tool_result",
                    tool_use_id: part.toolCallId,
                    content: webSearchOutput.map((result) => ({
                      url: result.url,
                      title: result.title,
                      page_age: result.pageAge,
                      encrypted_content: result.encryptedContent,
                      type: result.type
                    })),
                    cache_control: cacheControl
                  });
                  break;
                }
                warnings.push({
                  type: "other",
                  message: `provider executed tool result for tool ${part.toolName} is not supported`
                });
                break;
              }
            }
          }
        }
        messages.push({ role: "assistant", content: anthropicContent });
        break;
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`content type: ${_exhaustiveCheck}`);
      }
    }
  }
  return {
    prompt: { system, messages },
    betas
  };
}
function groupIntoBlocks(prompt) {
  const blocks = [];
  let currentBlock = void 0;
  for (const message of prompt) {
    const { role } = message;
    switch (role) {
      case "system": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "system") {
          currentBlock = { type: "system", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "assistant": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "assistant") {
          currentBlock = { type: "assistant", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "user": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "tool": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return blocks;
}

// src/map-anthropic-stop-reason.ts
function mapAnthropicStopReason({
  finishReason,
  isJsonResponseFromTool
}) {
  switch (finishReason) {
    case "pause_turn":
    case "end_turn":
    case "stop_sequence":
      return "stop";
    case "refusal":
      return "content-filter";
    case "tool_use":
      return isJsonResponseFromTool ? "stop" : "tool-calls";
    case "max_tokens":
      return "length";
    default:
      return "unknown";
  }
}

// src/anthropic-messages-language-model.ts
function createCitationSource(citation, citationDocuments, generateId3) {
  var _a;
  if (citation.type !== "page_location" && citation.type !== "char_location") {
    return;
  }
  const documentInfo = citationDocuments[citation.document_index];
  if (!documentInfo) {
    return;
  }
  return {
    type: "source",
    sourceType: "document",
    id: generateId3(),
    mediaType: documentInfo.mediaType,
    title: (_a = citation.document_title) != null ? _a : documentInfo.title,
    filename: documentInfo.filename,
    providerMetadata: {
      anthropic: citation.type === "page_location" ? {
        citedText: citation.cited_text,
        startPageNumber: citation.start_page_number,
        endPageNumber: citation.end_page_number
      } : {
        citedText: citation.cited_text,
        startCharIndex: citation.start_char_index,
        endCharIndex: citation.end_char_index
      }
    }
  };
}
var AnthropicMessagesLanguageModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    var _a;
    this.modelId = modelId;
    this.config = config;
    this.generateId = (_a = config.generateId) != null ? _a : generateId$5;
  }
  supportsUrl(url) {
    return url.protocol === "https:";
  }
  get provider() {
    return this.config.provider;
  }
  get supportedUrls() {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.config).supportedUrls) == null ? void 0 : _b.call(_a)) != null ? _c : {};
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    tools,
    toolChoice,
    providerOptions
  }) {
    var _a, _b, _c, _d;
    const warnings = [];
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed"
      });
    }
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json") {
      if (responseFormat.schema == null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "responseFormat",
          details: "JSON response format requires a schema. The response format is ignored."
        });
      } else if (tools != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "tools",
          details: "JSON response format does not support tools. The provided tools are ignored."
        });
      }
    }
    const jsonResponseTool = (responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null ? {
      type: "function",
      name: "json",
      description: "Respond with a JSON object.",
      inputSchema: responseFormat.schema
    } : void 0;
    const anthropicOptions = await parseProviderOptions$4({
      provider: "anthropic",
      providerOptions,
      schema: anthropicProviderOptions
    });
    const cacheControlValidator = new CacheControlValidator();
    const { prompt: messagesPrompt, betas } = await convertToAnthropicMessagesPrompt({
      prompt,
      sendReasoning: (_a = anthropicOptions == null ? void 0 : anthropicOptions.sendReasoning) != null ? _a : true,
      warnings,
      cacheControlValidator
    });
    const isThinking = ((_b = anthropicOptions == null ? void 0 : anthropicOptions.thinking) == null ? void 0 : _b.type) === "enabled";
    const thinkingBudget = (_c = anthropicOptions == null ? void 0 : anthropicOptions.thinking) == null ? void 0 : _c.budgetTokens;
    const maxOutputTokensForModel = getMaxOutputTokensForModel(this.modelId);
    const maxTokens = maxOutputTokens != null ? maxOutputTokens : maxOutputTokensForModel;
    const baseArgs = {
      // model id:
      model: this.modelId,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_k: topK,
      top_p: topP,
      stop_sequences: stopSequences,
      // provider specific settings:
      ...isThinking && {
        thinking: { type: "enabled", budget_tokens: thinkingBudget }
      },
      // container with agent skills:
      ...(anthropicOptions == null ? void 0 : anthropicOptions.container) && {
        container: {
          id: anthropicOptions.container.id,
          skills: (_d = anthropicOptions.container.skills) == null ? void 0 : _d.map((skill) => ({
            type: skill.type,
            skill_id: skill.skillId,
            version: skill.version
          }))
        }
      },
      // prompt:
      system: messagesPrompt.system,
      messages: messagesPrompt.messages
    };
    if (isThinking) {
      if (thinkingBudget == null) {
        throw new UnsupportedFunctionalityError$5({
          functionality: "thinking requires a budget"
        });
      }
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported when thinking is enabled"
        });
      }
      if (topK != null) {
        baseArgs.top_k = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topK",
          details: "topK is not supported when thinking is enabled"
        });
      }
      if (topP != null) {
        baseArgs.top_p = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topP",
          details: "topP is not supported when thinking is enabled"
        });
      }
      baseArgs.max_tokens = maxTokens + thinkingBudget;
    }
    if (baseArgs.max_tokens > maxOutputTokensForModel) {
      if (maxOutputTokens != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "maxOutputTokens",
          details: `${baseArgs.max_tokens} (maxOutputTokens + thinkingBudget) is greater than ${this.modelId} ${maxOutputTokensForModel} max output tokens. The max output tokens have been limited to ${maxOutputTokensForModel}.`
        });
      }
      baseArgs.max_tokens = maxOutputTokensForModel;
    }
    if ((anthropicOptions == null ? void 0 : anthropicOptions.container) && anthropicOptions.container.skills && anthropicOptions.container.skills.length > 0) {
      betas.add("code-execution-2025-08-25");
      betas.add("skills-2025-10-02");
      betas.add("files-api-2025-04-14");
      if (!(tools == null ? void 0 : tools.some(
        (tool) => tool.type === "provider-defined" && tool.id === "anthropic.code_execution_20250825"
      ))) {
        warnings.push({
          type: "other",
          message: "code execution tool is required when using skills"
        });
      }
    }
    const {
      tools: anthropicTools2,
      toolChoice: anthropicToolChoice,
      toolWarnings,
      betas: toolsBetas
    } = await prepareTools$3(
      jsonResponseTool != null ? {
        tools: [jsonResponseTool],
        toolChoice: { type: "tool", toolName: jsonResponseTool.name },
        disableParallelToolUse: true,
        cacheControlValidator
      } : {
        tools: tools != null ? tools : [],
        toolChoice,
        disableParallelToolUse: anthropicOptions == null ? void 0 : anthropicOptions.disableParallelToolUse,
        cacheControlValidator
      }
    );
    const cacheWarnings = cacheControlValidator.getWarnings();
    return {
      args: {
        ...baseArgs,
        tools: anthropicTools2,
        tool_choice: anthropicToolChoice
      },
      warnings: [...warnings, ...toolWarnings, ...cacheWarnings],
      betas: /* @__PURE__ */ new Set([...betas, ...toolsBetas]),
      usesJsonResponseTool: jsonResponseTool != null
    };
  }
  async getHeaders({
    betas,
    headers
  }) {
    return combineHeaders$6(
      await resolve$1(this.config.headers),
      betas.size > 0 ? { "anthropic-beta": Array.from(betas).join(",") } : {},
      headers
    );
  }
  buildRequestUrl(isStreaming) {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.config).buildRequestUrl) == null ? void 0 : _b.call(_a, this.config.baseURL, isStreaming)) != null ? _c : `${this.config.baseURL}/messages`;
  }
  transformRequestBody(args) {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.config).transformRequestBody) == null ? void 0 : _b.call(_a, args)) != null ? _c : args;
  }
  extractCitationDocuments(prompt) {
    const isCitationPart = (part) => {
      var _a, _b;
      if (part.type !== "file") {
        return false;
      }
      if (part.mediaType !== "application/pdf" && part.mediaType !== "text/plain") {
        return false;
      }
      const anthropic2 = (_a = part.providerOptions) == null ? void 0 : _a.anthropic;
      const citationsConfig = anthropic2 == null ? void 0 : anthropic2.citations;
      return (_b = citationsConfig == null ? void 0 : citationsConfig.enabled) != null ? _b : false;
    };
    return prompt.filter((message) => message.role === "user").flatMap((message) => message.content).filter(isCitationPart).map((part) => {
      var _a;
      const filePart = part;
      return {
        title: (_a = filePart.filename) != null ? _a : "Untitled Document",
        filename: filePart.filename,
        mediaType: filePart.mediaType
      };
    });
  }
  async doGenerate(options) {
    var _a, _b, _c, _d, _e, _f;
    const { args, warnings, betas, usesJsonResponseTool } = await this.getArgs(options);
    const citationDocuments = this.extractCitationDocuments(options.prompt);
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi$6({
      url: this.buildRequestUrl(false),
      headers: await this.getHeaders({ betas, headers: options.headers }),
      body: this.transformRequestBody(args),
      failedResponseHandler: anthropicFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$6(
        anthropicMessagesResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const content = [];
    for (const part of response.content) {
      switch (part.type) {
        case "text": {
          if (!usesJsonResponseTool) {
            content.push({ type: "text", text: part.text });
            if (part.citations) {
              for (const citation of part.citations) {
                const source = createCitationSource(
                  citation,
                  citationDocuments,
                  this.generateId
                );
                if (source) {
                  content.push(source);
                }
              }
            }
          }
          break;
        }
        case "thinking": {
          content.push({
            type: "reasoning",
            text: part.thinking,
            providerMetadata: {
              anthropic: {
                signature: part.signature
              }
            }
          });
          break;
        }
        case "redacted_thinking": {
          content.push({
            type: "reasoning",
            text: "",
            providerMetadata: {
              anthropic: {
                redactedData: part.data
              }
            }
          });
          break;
        }
        case "tool_use": {
          content.push(
            // when a json response tool is used, the tool call becomes the text:
            usesJsonResponseTool ? {
              type: "text",
              text: JSON.stringify(part.input)
            } : {
              type: "tool-call",
              toolCallId: part.id,
              toolName: part.name,
              input: JSON.stringify(part.input)
            }
          );
          break;
        }
        case "server_tool_use": {
          if (part.name === "text_editor_code_execution" || part.name === "bash_code_execution") {
            content.push({
              type: "tool-call",
              toolCallId: part.id,
              toolName: "code_execution",
              input: JSON.stringify({ type: part.name, ...part.input }),
              providerExecuted: true
            });
          } else if (part.name === "web_search" || part.name === "code_execution" || part.name === "web_fetch") {
            content.push({
              type: "tool-call",
              toolCallId: part.id,
              toolName: part.name,
              input: JSON.stringify(part.input),
              providerExecuted: true
            });
          }
          break;
        }
        case "web_fetch_tool_result": {
          if (part.content.type === "web_fetch_result") {
            content.push({
              type: "tool-result",
              toolCallId: part.tool_use_id,
              toolName: "web_fetch",
              result: {
                type: "web_fetch_result",
                url: part.content.url,
                retrievedAt: part.content.retrieved_at,
                content: {
                  type: part.content.content.type,
                  title: part.content.content.title,
                  citations: part.content.content.citations,
                  source: {
                    type: part.content.content.source.type,
                    mediaType: part.content.content.source.media_type,
                    data: part.content.content.source.data
                  }
                }
              },
              providerExecuted: true
            });
          } else if (part.content.type === "web_fetch_tool_result_error") {
            content.push({
              type: "tool-result",
              toolCallId: part.tool_use_id,
              toolName: "web_fetch",
              isError: true,
              result: {
                type: "web_fetch_tool_result_error",
                errorCode: part.content.error_code
              },
              providerExecuted: true
            });
          }
          break;
        }
        case "web_search_tool_result": {
          if (Array.isArray(part.content)) {
            content.push({
              type: "tool-result",
              toolCallId: part.tool_use_id,
              toolName: "web_search",
              result: part.content.map((result) => {
                var _a2;
                return {
                  url: result.url,
                  title: result.title,
                  pageAge: (_a2 = result.page_age) != null ? _a2 : null,
                  encryptedContent: result.encrypted_content,
                  type: result.type
                };
              }),
              providerExecuted: true
            });
            for (const result of part.content) {
              content.push({
                type: "source",
                sourceType: "url",
                id: this.generateId(),
                url: result.url,
                title: result.title,
                providerMetadata: {
                  anthropic: {
                    pageAge: (_a = result.page_age) != null ? _a : null
                  }
                }
              });
            }
          } else {
            content.push({
              type: "tool-result",
              toolCallId: part.tool_use_id,
              toolName: "web_search",
              isError: true,
              result: {
                type: "web_search_tool_result_error",
                errorCode: part.content.error_code
              },
              providerExecuted: true
            });
          }
          break;
        }
        // code execution 20250522:
        case "code_execution_tool_result": {
          if (part.content.type === "code_execution_result") {
            content.push({
              type: "tool-result",
              toolCallId: part.tool_use_id,
              toolName: "code_execution",
              result: {
                type: part.content.type,
                stdout: part.content.stdout,
                stderr: part.content.stderr,
                return_code: part.content.return_code
              },
              providerExecuted: true
            });
          } else if (part.content.type === "code_execution_tool_result_error") {
            content.push({
              type: "tool-result",
              toolCallId: part.tool_use_id,
              toolName: "code_execution",
              isError: true,
              result: {
                type: "code_execution_tool_result_error",
                errorCode: part.content.error_code
              },
              providerExecuted: true
            });
          }
          break;
        }
        // code execution 20250825:
        case "bash_code_execution_tool_result":
        case "text_editor_code_execution_tool_result": {
          content.push({
            type: "tool-result",
            toolCallId: part.tool_use_id,
            toolName: "code_execution",
            result: part.content,
            providerExecuted: true
          });
          break;
        }
      }
    }
    return {
      content,
      finishReason: mapAnthropicStopReason({
        finishReason: response.stop_reason,
        isJsonResponseFromTool: usesJsonResponseTool
      }),
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        cachedInputTokens: (_b = response.usage.cache_read_input_tokens) != null ? _b : void 0
      },
      request: { body: args },
      response: {
        id: (_c = response.id) != null ? _c : void 0,
        modelId: (_d = response.model) != null ? _d : void 0,
        headers: responseHeaders,
        body: rawResponse
      },
      warnings,
      providerMetadata: {
        anthropic: {
          usage: response.usage,
          cacheCreationInputTokens: (_e = response.usage.cache_creation_input_tokens) != null ? _e : null,
          stopSequence: (_f = response.stop_sequence) != null ? _f : null
        }
      }
    };
  }
  async doStream(options) {
    const { args, warnings, betas, usesJsonResponseTool } = await this.getArgs(options);
    const citationDocuments = this.extractCitationDocuments(options.prompt);
    const body = { ...args, stream: true };
    const { responseHeaders, value: response } = await postJsonToApi$6({
      url: this.buildRequestUrl(true),
      headers: await this.getHeaders({ betas, headers: options.headers }),
      body: this.transformRequestBody(body),
      failedResponseHandler: anthropicFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler$5(
        anthropicMessagesChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    let finishReason = "unknown";
    const usage = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    const contentBlocks = {};
    let rawUsage = void 0;
    let cacheCreationInputTokens = null;
    let stopSequence = null;
    let blockType = void 0;
    const generateId3 = this.generateId;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            switch (value.type) {
              case "ping": {
                return;
              }
              case "content_block_start": {
                const contentBlockType = value.content_block.type;
                blockType = contentBlockType;
                switch (contentBlockType) {
                  case "text": {
                    contentBlocks[value.index] = { type: "text" };
                    controller.enqueue({
                      type: "text-start",
                      id: String(value.index)
                    });
                    return;
                  }
                  case "thinking": {
                    contentBlocks[value.index] = { type: "reasoning" };
                    controller.enqueue({
                      type: "reasoning-start",
                      id: String(value.index)
                    });
                    return;
                  }
                  case "redacted_thinking": {
                    contentBlocks[value.index] = { type: "reasoning" };
                    controller.enqueue({
                      type: "reasoning-start",
                      id: String(value.index),
                      providerMetadata: {
                        anthropic: {
                          redactedData: value.content_block.data
                        }
                      }
                    });
                    return;
                  }
                  case "tool_use": {
                    contentBlocks[value.index] = usesJsonResponseTool ? { type: "text" } : {
                      type: "tool-call",
                      toolCallId: value.content_block.id,
                      toolName: value.content_block.name,
                      input: "",
                      firstDelta: true
                    };
                    controller.enqueue(
                      usesJsonResponseTool ? { type: "text-start", id: String(value.index) } : {
                        type: "tool-input-start",
                        id: value.content_block.id,
                        toolName: value.content_block.name
                      }
                    );
                    return;
                  }
                  case "server_tool_use": {
                    if ([
                      "web_fetch",
                      "web_search",
                      // code execution 20250825:
                      "code_execution",
                      // code execution 20250825 text editor:
                      "text_editor_code_execution",
                      // code execution 20250825 bash:
                      "bash_code_execution"
                    ].includes(value.content_block.name)) {
                      contentBlocks[value.index] = {
                        type: "tool-call",
                        toolCallId: value.content_block.id,
                        toolName: value.content_block.name,
                        input: "",
                        providerExecuted: true,
                        firstDelta: true
                      };
                      const mappedToolName = value.content_block.name === "text_editor_code_execution" || value.content_block.name === "bash_code_execution" ? "code_execution" : value.content_block.name;
                      controller.enqueue({
                        type: "tool-input-start",
                        id: value.content_block.id,
                        toolName: mappedToolName,
                        providerExecuted: true
                      });
                    }
                    return;
                  }
                  case "web_fetch_tool_result": {
                    const part = value.content_block;
                    if (part.content.type === "web_fetch_result") {
                      controller.enqueue({
                        type: "tool-result",
                        toolCallId: part.tool_use_id,
                        toolName: "web_fetch",
                        result: {
                          type: "web_fetch_result",
                          url: part.content.url,
                          retrievedAt: part.content.retrieved_at,
                          content: {
                            type: part.content.content.type,
                            title: part.content.content.title,
                            citations: part.content.content.citations,
                            source: {
                              type: part.content.content.source.type,
                              mediaType: part.content.content.source.media_type,
                              data: part.content.content.source.data
                            }
                          }
                        }
                      });
                    } else if (part.content.type === "web_fetch_tool_result_error") {
                      controller.enqueue({
                        type: "tool-result",
                        toolCallId: part.tool_use_id,
                        toolName: "web_fetch",
                        isError: true,
                        result: {
                          type: "web_fetch_tool_result_error",
                          errorCode: part.content.error_code
                        },
                        providerExecuted: true
                      });
                    }
                    return;
                  }
                  case "web_search_tool_result": {
                    const part = value.content_block;
                    if (Array.isArray(part.content)) {
                      controller.enqueue({
                        type: "tool-result",
                        toolCallId: part.tool_use_id,
                        toolName: "web_search",
                        result: part.content.map((result) => {
                          var _a2;
                          return {
                            url: result.url,
                            title: result.title,
                            pageAge: (_a2 = result.page_age) != null ? _a2 : null,
                            encryptedContent: result.encrypted_content,
                            type: result.type
                          };
                        }),
                        providerExecuted: true
                      });
                      for (const result of part.content) {
                        controller.enqueue({
                          type: "source",
                          sourceType: "url",
                          id: generateId3(),
                          url: result.url,
                          title: result.title,
                          providerMetadata: {
                            anthropic: {
                              pageAge: (_a = result.page_age) != null ? _a : null
                            }
                          }
                        });
                      }
                    } else {
                      controller.enqueue({
                        type: "tool-result",
                        toolCallId: part.tool_use_id,
                        toolName: "web_search",
                        isError: true,
                        result: {
                          type: "web_search_tool_result_error",
                          errorCode: part.content.error_code
                        },
                        providerExecuted: true
                      });
                    }
                    return;
                  }
                  // code execution 20250522:
                  case "code_execution_tool_result": {
                    const part = value.content_block;
                    if (part.content.type === "code_execution_result") {
                      controller.enqueue({
                        type: "tool-result",
                        toolCallId: part.tool_use_id,
                        toolName: "code_execution",
                        result: {
                          type: part.content.type,
                          stdout: part.content.stdout,
                          stderr: part.content.stderr,
                          return_code: part.content.return_code
                        },
                        providerExecuted: true
                      });
                    } else if (part.content.type === "code_execution_tool_result_error") {
                      controller.enqueue({
                        type: "tool-result",
                        toolCallId: part.tool_use_id,
                        toolName: "code_execution",
                        isError: true,
                        result: {
                          type: "code_execution_tool_result_error",
                          errorCode: part.content.error_code
                        },
                        providerExecuted: true
                      });
                    }
                    return;
                  }
                  // code execution 20250825:
                  case "bash_code_execution_tool_result":
                  case "text_editor_code_execution_tool_result": {
                    const part = value.content_block;
                    controller.enqueue({
                      type: "tool-result",
                      toolCallId: part.tool_use_id,
                      toolName: "code_execution",
                      result: part.content,
                      providerExecuted: true
                    });
                    return;
                  }
                  default: {
                    const _exhaustiveCheck = contentBlockType;
                    throw new Error(
                      `Unsupported content block type: ${_exhaustiveCheck}`
                    );
                  }
                }
              }
              case "content_block_stop": {
                if (contentBlocks[value.index] != null) {
                  const contentBlock = contentBlocks[value.index];
                  switch (contentBlock.type) {
                    case "text": {
                      controller.enqueue({
                        type: "text-end",
                        id: String(value.index)
                      });
                      break;
                    }
                    case "reasoning": {
                      controller.enqueue({
                        type: "reasoning-end",
                        id: String(value.index)
                      });
                      break;
                    }
                    case "tool-call":
                      if (!usesJsonResponseTool) {
                        controller.enqueue({
                          type: "tool-input-end",
                          id: contentBlock.toolCallId
                        });
                        const toolName = contentBlock.toolName === "text_editor_code_execution" || contentBlock.toolName === "bash_code_execution" ? "code_execution" : contentBlock.toolName;
                        controller.enqueue({
                          type: "tool-call",
                          toolCallId: contentBlock.toolCallId,
                          toolName,
                          input: contentBlock.input,
                          providerExecuted: contentBlock.providerExecuted
                        });
                      }
                      break;
                  }
                  delete contentBlocks[value.index];
                }
                blockType = void 0;
                return;
              }
              case "content_block_delta": {
                const deltaType = value.delta.type;
                switch (deltaType) {
                  case "text_delta": {
                    if (usesJsonResponseTool) {
                      return;
                    }
                    controller.enqueue({
                      type: "text-delta",
                      id: String(value.index),
                      delta: value.delta.text
                    });
                    return;
                  }
                  case "thinking_delta": {
                    controller.enqueue({
                      type: "reasoning-delta",
                      id: String(value.index),
                      delta: value.delta.thinking
                    });
                    return;
                  }
                  case "signature_delta": {
                    if (blockType === "thinking") {
                      controller.enqueue({
                        type: "reasoning-delta",
                        id: String(value.index),
                        delta: "",
                        providerMetadata: {
                          anthropic: {
                            signature: value.delta.signature
                          }
                        }
                      });
                    }
                    return;
                  }
                  case "input_json_delta": {
                    const contentBlock = contentBlocks[value.index];
                    let delta = value.delta.partial_json;
                    if (delta.length === 0) {
                      return;
                    }
                    if (usesJsonResponseTool) {
                      if ((contentBlock == null ? void 0 : contentBlock.type) !== "text") {
                        return;
                      }
                      controller.enqueue({
                        type: "text-delta",
                        id: String(value.index),
                        delta
                      });
                    } else {
                      if ((contentBlock == null ? void 0 : contentBlock.type) !== "tool-call") {
                        return;
                      }
                      if (contentBlock.firstDelta && (contentBlock.toolName === "bash_code_execution" || contentBlock.toolName === "text_editor_code_execution")) {
                        delta = `{"type": "${contentBlock.toolName}",${delta.substring(1)}`;
                      }
                      controller.enqueue({
                        type: "tool-input-delta",
                        id: contentBlock.toolCallId,
                        delta
                      });
                      contentBlock.input += delta;
                      contentBlock.firstDelta = false;
                    }
                    return;
                  }
                  case "citations_delta": {
                    const citation = value.delta.citation;
                    const source = createCitationSource(
                      citation,
                      citationDocuments,
                      generateId3
                    );
                    if (source) {
                      controller.enqueue(source);
                    }
                    return;
                  }
                  default: {
                    const _exhaustiveCheck = deltaType;
                    throw new Error(
                      `Unsupported delta type: ${_exhaustiveCheck}`
                    );
                  }
                }
              }
              case "message_start": {
                usage.inputTokens = value.message.usage.input_tokens;
                usage.cachedInputTokens = (_b = value.message.usage.cache_read_input_tokens) != null ? _b : void 0;
                rawUsage = {
                  ...value.message.usage
                };
                cacheCreationInputTokens = (_c = value.message.usage.cache_creation_input_tokens) != null ? _c : null;
                controller.enqueue({
                  type: "response-metadata",
                  id: (_d = value.message.id) != null ? _d : void 0,
                  modelId: (_e = value.message.model) != null ? _e : void 0
                });
                return;
              }
              case "message_delta": {
                usage.outputTokens = value.usage.output_tokens;
                usage.totalTokens = ((_f = usage.inputTokens) != null ? _f : 0) + ((_g = value.usage.output_tokens) != null ? _g : 0);
                finishReason = mapAnthropicStopReason({
                  finishReason: value.delta.stop_reason,
                  isJsonResponseFromTool: usesJsonResponseTool
                });
                stopSequence = (_h = value.delta.stop_sequence) != null ? _h : null;
                rawUsage = {
                  ...rawUsage,
                  ...value.usage
                };
                return;
              }
              case "message_stop": {
                controller.enqueue({
                  type: "finish",
                  finishReason,
                  usage,
                  providerMetadata: {
                    anthropic: {
                      usage: rawUsage != null ? rawUsage : null,
                      cacheCreationInputTokens,
                      stopSequence
                    }
                  }
                });
                return;
              }
              case "error": {
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              default: {
                const _exhaustiveCheck = value;
                throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
              }
            }
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
  }
};
function getMaxOutputTokensForModel(modelId) {
  if (modelId.includes("claude-sonnet-4-") || modelId.includes("claude-3-7-sonnet") || modelId.includes("claude-haiku-4-5")) {
    return 64e3;
  } else if (modelId.includes("claude-opus-4-")) {
    return 32e3;
  } else if (modelId.includes("claude-3-5-haiku")) {
    return 8192;
  } else {
    return 4096;
  }
}
var bash_20241022InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      command: string(),
      restart: boolean().optional()
    })
  )
);
var bash_20241022 = createProviderDefinedToolFactory$1({
  id: "anthropic.bash_20241022",
  name: "bash",
  inputSchema: bash_20241022InputSchema
});
var bash_20250124InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      command: string(),
      restart: boolean().optional()
    })
  )
);
var bash_20250124 = createProviderDefinedToolFactory$1({
  id: "anthropic.bash_20250124",
  name: "bash",
  inputSchema: bash_20250124InputSchema
});
var computer_20241022InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      action: _enum([
        "key",
        "type",
        "mouse_move",
        "left_click",
        "left_click_drag",
        "right_click",
        "middle_click",
        "double_click",
        "screenshot",
        "cursor_position"
      ]),
      coordinate: array(number().int()).optional(),
      text: string().optional()
    })
  )
);
var computer_20241022 = createProviderDefinedToolFactory$1({
  id: "anthropic.computer_20241022",
  name: "computer",
  inputSchema: computer_20241022InputSchema
});
var computer_20250124InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      action: _enum([
        "key",
        "hold_key",
        "type",
        "cursor_position",
        "mouse_move",
        "left_mouse_down",
        "left_mouse_up",
        "left_click",
        "left_click_drag",
        "right_click",
        "middle_click",
        "double_click",
        "triple_click",
        "scroll",
        "wait",
        "screenshot"
      ]),
      coordinate: tuple([number().int(), number().int()]).optional(),
      duration: number().optional(),
      scroll_amount: number().optional(),
      scroll_direction: _enum(["up", "down", "left", "right"]).optional(),
      start_coordinate: tuple([number().int(), number().int()]).optional(),
      text: string().optional()
    })
  )
);
var computer_20250124 = createProviderDefinedToolFactory$1({
  id: "anthropic.computer_20250124",
  name: "computer",
  inputSchema: computer_20250124InputSchema
});
var memory_20250818InputSchema = lazySchema$2(
  () => zodSchema$2(
    discriminatedUnion("command", [
      object({
        command: literal("view"),
        path: string(),
        view_range: tuple([number(), number()]).optional()
      }),
      object({
        command: literal("create"),
        path: string(),
        file_text: string()
      }),
      object({
        command: literal("str_replace"),
        path: string(),
        old_str: string(),
        new_str: string()
      }),
      object({
        command: literal("insert"),
        path: string(),
        insert_line: number(),
        insert_text: string()
      }),
      object({
        command: literal("delete"),
        path: string()
      }),
      object({
        command: literal("rename"),
        old_path: string(),
        new_path: string()
      })
    ])
  )
);
var memory_20250818 = createProviderDefinedToolFactory$1({
  id: "anthropic.memory_20250818",
  name: "memory",
  inputSchema: memory_20250818InputSchema
});
var textEditor_20241022InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      command: _enum(["view", "create", "str_replace", "insert", "undo_edit"]),
      path: string(),
      file_text: string().optional(),
      insert_line: number().int().optional(),
      new_str: string().optional(),
      old_str: string().optional(),
      view_range: array(number().int()).optional()
    })
  )
);
var textEditor_20241022 = createProviderDefinedToolFactory$1({
  id: "anthropic.text_editor_20241022",
  name: "str_replace_editor",
  inputSchema: textEditor_20241022InputSchema
});
var textEditor_20250124InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      command: _enum(["view", "create", "str_replace", "insert", "undo_edit"]),
      path: string(),
      file_text: string().optional(),
      insert_line: number().int().optional(),
      new_str: string().optional(),
      old_str: string().optional(),
      view_range: array(number().int()).optional()
    })
  )
);
var textEditor_20250124 = createProviderDefinedToolFactory$1({
  id: "anthropic.text_editor_20250124",
  name: "str_replace_editor",
  inputSchema: textEditor_20250124InputSchema
});
var textEditor_20250429InputSchema = lazySchema$2(
  () => zodSchema$2(
    object({
      command: _enum(["view", "create", "str_replace", "insert"]),
      path: string(),
      file_text: string().optional(),
      insert_line: number().int().optional(),
      new_str: string().optional(),
      old_str: string().optional(),
      view_range: array(number().int()).optional()
    })
  )
);
var textEditor_20250429 = createProviderDefinedToolFactory$1({
  id: "anthropic.text_editor_20250429",
  name: "str_replace_based_edit_tool",
  inputSchema: textEditor_20250429InputSchema
});

// src/anthropic-tools.ts
var anthropicTools = {
  /**
   * The bash tool enables Claude to execute shell commands in a persistent bash session,
   * allowing system operations, script execution, and command-line automation.
   *
   * Image results are supported.
   *
   * Tool name must be `bash`.
   */
  bash_20241022,
  /**
   * The bash tool enables Claude to execute shell commands in a persistent bash session,
   * allowing system operations, script execution, and command-line automation.
   *
   * Image results are supported.
   *
   * Tool name must be `bash`.
   */
  bash_20250124,
  /**
   * Claude can analyze data, create visualizations, perform complex calculations,
   * run system commands, create and edit files, and process uploaded files directly within
   * the API conversation.
   *
   * The code execution tool allows Claude to run Bash commands and manipulate files,
   * including writing code, in a secure, sandboxed environment.
   *
   * Tool name must be `code_execution`.
   */
  codeExecution_20250522,
  /**
   * Claude can analyze data, create visualizations, perform complex calculations,
   * run system commands, create and edit files, and process uploaded files directly within
   * the API conversation.
   *
   * The code execution tool allows Claude to run both Python and Bash commands and manipulate files,
   * including writing code, in a secure, sandboxed environment.
   *
   * This is the latest version with enhanced Bash support and file operations.
   *
   * Tool name must be `code_execution`.
   */
  codeExecution_20250825,
  /**
   * Claude can interact with computer environments through the computer use tool, which
   * provides screenshot capabilities and mouse/keyboard control for autonomous desktop interaction.
   *
   * Image results are supported.
   *
   * Tool name must be `computer`.
   *
   * @param displayWidthPx - The width of the display being controlled by the model in pixels.
   * @param displayHeightPx - The height of the display being controlled by the model in pixels.
   * @param displayNumber - The display number to control (only relevant for X11 environments). If specified, the tool will be provided a display number in the tool definition.
   */
  computer_20241022,
  /**
   * Claude can interact with computer environments through the computer use tool, which
   * provides screenshot capabilities and mouse/keyboard control for autonomous desktop interaction.
   *
   * Image results are supported.
   *
   * Tool name must be `computer`.
   *
   * @param displayWidthPx - The width of the display being controlled by the model in pixels.
   * @param displayHeightPx - The height of the display being controlled by the model in pixels.
   * @param displayNumber - The display number to control (only relevant for X11 environments). If specified, the tool will be provided a display number in the tool definition.
   */
  computer_20250124,
  /**
   * The memory tool enables Claude to store and retrieve information across conversations through a memory file directory.
   * Claude can create, read, update, and delete files that persist between sessions,
   * allowing it to build knowledge over time without keeping everything in the context window.
   * The memory tool operates client-side—you control where and how the data is stored through your own infrastructure.
   *
   * Supported models: Claude Sonnet 4.5, Claude Sonnet 4, Claude Opus 4.1, Claude Opus 4.
   *
   * Tool name must be `memory`.
   */
  memory_20250818,
  /**
   * Claude can use an Anthropic-defined text editor tool to view and modify text files,
   * helping you debug, fix, and improve your code or other text documents. This allows Claude
   * to directly interact with your files, providing hands-on assistance rather than just suggesting changes.
   *
   * Supported models: Claude Sonnet 3.5
   *
   * Tool name must be `str_replace_editor`.
   */
  textEditor_20241022,
  /**
   * Claude can use an Anthropic-defined text editor tool to view and modify text files,
   * helping you debug, fix, and improve your code or other text documents. This allows Claude
   * to directly interact with your files, providing hands-on assistance rather than just suggesting changes.
   *
   * Supported models: Claude Sonnet 3.7
   *
   * Tool name must be `str_replace_editor`.
   */
  textEditor_20250124,
  /**
   * Claude can use an Anthropic-defined text editor tool to view and modify text files,
   * helping you debug, fix, and improve your code or other text documents. This allows Claude
   * to directly interact with your files, providing hands-on assistance rather than just suggesting changes.
   *
   * Note: This version does not support the "undo_edit" command.
   *
   * Tool name must be `str_replace_based_edit_tool`.
   *
   * @deprecated Use textEditor_20250728 instead
   */
  textEditor_20250429,
  /**
   * Claude can use an Anthropic-defined text editor tool to view and modify text files,
   * helping you debug, fix, and improve your code or other text documents. This allows Claude
   * to directly interact with your files, providing hands-on assistance rather than just suggesting changes.
   *
   * Note: This version does not support the "undo_edit" command and adds optional max_characters parameter.
   *
   * Supported models: Claude Sonnet 4, Opus 4, and Opus 4.1
   *
   * Tool name must be `str_replace_based_edit_tool`.
   *
   * @param maxCharacters - Optional maximum number of characters to view in the file
   */
  textEditor_20250728,
  /**
   * Creates a web fetch tool that gives Claude direct access to real-time web content.
   *
   * Tool name must be `web_fetch`.
   *
   * @param maxUses - The max_uses parameter limits the number of web fetches performed
   * @param allowedDomains - Only fetch from these domains
   * @param blockedDomains - Never fetch from these domains
   * @param citations - Unlike web search where citations are always enabled, citations are optional for web fetch. Set "citations": {"enabled": true} to enable Claude to cite specific passages from fetched documents.
   * @param maxContentTokens - The max_content_tokens parameter limits the amount of content that will be included in the context.
   */
  webFetch_20250910,
  /**
   * Creates a web search tool that gives Claude direct access to real-time web content.
   *
   * Tool name must be `web_search`.
   *
   * @param maxUses - Maximum number of web searches Claude can perform during the conversation.
   * @param allowedDomains - Optional list of domains that Claude is allowed to search.
   * @param blockedDomains - Optional list of domains that Claude should avoid when searching.
   * @param userLocation - Optional user location information to provide geographically relevant search results.
   */
  webSearch_20250305
};

// src/anthropic-provider.ts
function createAnthropic(options = {}) {
  var _a;
  const baseURL = (_a = withoutTrailingSlash$5(options.baseURL)) != null ? _a : "https://api.anthropic.com/v1";
  const getHeaders = () => withUserAgentSuffix$5(
    {
      "anthropic-version": "2023-06-01",
      "x-api-key": loadApiKey$4({
        apiKey: options.apiKey,
        environmentVariableName: "ANTHROPIC_API_KEY",
        description: "Anthropic"
      }),
      ...options.headers
    },
    `ai-sdk/anthropic/${VERSION$9}`
  );
  const createChatModel = (modelId) => {
    var _a2;
    return new AnthropicMessagesLanguageModel(modelId, {
      provider: "anthropic.messages",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
      generateId: (_a2 = options.generateId) != null ? _a2 : generateId$5,
      supportedUrls: () => ({
        "image/*": [/^https?:\/\/.*$/]
      })
    });
  };
  const provider = function(modelId) {
    if (new.target) {
      throw new Error(
        "The Anthropic model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.messages = createChatModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError$1({ modelId, modelType: "textEmbeddingModel" });
  };
  provider.imageModel = (modelId) => {
    throw new NoSuchModelError$1({ modelId, modelType: "imageModel" });
  };
  provider.tools = anthropicTools;
  return provider;
}
createAnthropic();

// src/errors/ai-sdk-error.ts
var marker$5 = "vercel.ai.error";
var symbol$5 = Symbol.for(marker$5);
var _a$5;
var _AISDKError$5 = class _AISDKError extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a$5] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker$5);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a$5 = symbol$5;
var AISDKError$5 = _AISDKError$5;

// src/errors/api-call-error.ts
var name$5 = "AI_APICallError";
var marker2$5 = `vercel.ai.error.${name$5}`;
var symbol2$5 = Symbol.for(marker2$5);
var _a2$5;
var APICallError$5 = class APICallError extends AISDKError$5 {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name: name$5, message, cause });
    this[_a2$5] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError$5.hasMarker(error, marker2$5);
  }
};
_a2$5 = symbol2$5;

// src/errors/empty-response-body-error.ts
var name2$4 = "AI_EmptyResponseBodyError";
var marker3$4 = `vercel.ai.error.${name2$4}`;
var symbol3$4 = Symbol.for(marker3$4);
var _a3$4;
var EmptyResponseBodyError$4 = class EmptyResponseBodyError extends AISDKError$5 {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2$4, message });
    this[_a3$4] = true;
  }
  static isInstance(error) {
    return AISDKError$5.hasMarker(error, marker3$4);
  }
};
_a3$4 = symbol3$4;

// src/errors/get-error-message.ts
function getErrorMessage$5(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// src/errors/invalid-argument-error.ts
var name3$5 = "AI_InvalidArgumentError";
var marker4$5 = `vercel.ai.error.${name3$5}`;
var symbol4$5 = Symbol.for(marker4$5);
var _a4$5;
var InvalidArgumentError$5 = class InvalidArgumentError extends AISDKError$5 {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3$5, message, cause });
    this[_a4$5] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError$5.hasMarker(error, marker4$5);
  }
};
_a4$5 = symbol4$5;

// src/errors/json-parse-error.ts
var name6$5 = "AI_JSONParseError";
var marker7$5 = `vercel.ai.error.${name6$5}`;
var symbol7$5 = Symbol.for(marker7$5);
var _a7$5;
var JSONParseError$5 = class JSONParseError extends AISDKError$5 {
  constructor({ text, cause }) {
    super({
      name: name6$5,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage$5(cause)}`,
      cause
    });
    this[_a7$5] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError$5.hasMarker(error, marker7$5);
  }
};
_a7$5 = symbol7$5;

// src/errors/load-api-key-error.ts
var name7$3 = "AI_LoadAPIKeyError";
var marker8$3 = `vercel.ai.error.${name7$3}`;
var symbol8$3 = Symbol.for(marker8$3);
var _a8$3;
var LoadAPIKeyError$3 = class LoadAPIKeyError extends AISDKError$5 {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7$3, message });
    this[_a8$3] = true;
  }
  static isInstance(error) {
    return AISDKError$5.hasMarker(error, marker8$3);
  }
};
_a8$3 = symbol8$3;

// src/errors/too-many-embedding-values-for-call-error.ts
var name11$2 = "AI_TooManyEmbeddingValuesForCallError";
var marker12$2 = `vercel.ai.error.${name11$2}`;
var symbol12$2 = Symbol.for(marker12$2);
var _a12$2;
var TooManyEmbeddingValuesForCallError$2 = class TooManyEmbeddingValuesForCallError extends AISDKError$5 {
  constructor(options) {
    super({
      name: name11$2,
      message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
    });
    this[_a12$2] = true;
    this.provider = options.provider;
    this.modelId = options.modelId;
    this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
    this.values = options.values;
  }
  static isInstance(error) {
    return AISDKError$5.hasMarker(error, marker12$2);
  }
};
_a12$2 = symbol12$2;

// src/errors/type-validation-error.ts
var name12$5 = "AI_TypeValidationError";
var marker13$5 = `vercel.ai.error.${name12$5}`;
var symbol13$5 = Symbol.for(marker13$5);
var _a13$5;
var _TypeValidationError$5 = class _TypeValidationError extends AISDKError$5 {
  constructor({ value, cause }) {
    super({
      name: name12$5,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage$5(cause)}`,
      cause
    });
    this[_a13$5] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError$5.hasMarker(error, marker13$5);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
  }
};
_a13$5 = symbol13$5;
var TypeValidationError$5 = _TypeValidationError$5;

// src/errors/unsupported-functionality-error.ts
var name13$4 = "AI_UnsupportedFunctionalityError";
var marker14$4 = `vercel.ai.error.${name13$4}`;
var symbol14$4 = Symbol.for(marker14$4);
var _a14$4;
var UnsupportedFunctionalityError$4 = class UnsupportedFunctionalityError extends AISDKError$5 {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13$4, message });
    this[_a14$4] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError$5.hasMarker(error, marker14$4);
  }
};
_a14$4 = symbol14$4;

// src/combine-headers.ts
function combineHeaders$5(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => ({
      ...combinedHeaders,
      ...currentHeaders != null ? currentHeaders : {}
    }),
    {}
  );
}

// src/extract-response-headers.ts
function extractResponseHeaders$5(response) {
  return Object.fromEntries([...response.headers]);
}
var createIdGenerator$5 = ({
  prefix,
  size = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = () => {
    const alphabetLength = alphabet.length;
    const chars = new Array(size);
    for (let i = 0; i < size; i++) {
      chars[i] = alphabet[Math.random() * alphabetLength | 0];
    }
    return chars.join("");
  };
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError$5({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return () => `${prefix}${separator}${generator()}`;
};
var generateId$4 = createIdGenerator$5();

// src/is-abort-error.ts
function isAbortError$5(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}

// src/handle-fetch-error.ts
var FETCH_FAILED_ERROR_MESSAGES$5 = ["fetch failed", "failed to fetch"];
function handleFetchError$5({
  error,
  url,
  requestBodyValues
}) {
  if (isAbortError$5(error)) {
    return error;
  }
  if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES$5.includes(error.message.toLowerCase())) {
    const cause = error.cause;
    if (cause != null) {
      return new APICallError$5({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true
        // retry when network error
      });
    }
  }
  return error;
}

// src/get-runtime-environment-user-agent.ts
function getRuntimeEnvironmentUserAgent$4(globalThisAny = globalThis) {
  var _a, _b, _c;
  if (globalThisAny.window) {
    return `runtime/browser`;
  }
  if ((_a = globalThisAny.navigator) == null ? void 0 : _a.userAgent) {
    return `runtime/${globalThisAny.navigator.userAgent.toLowerCase()}`;
  }
  if ((_c = (_b = globalThisAny.process) == null ? void 0 : _b.versions) == null ? void 0 : _c.node) {
    return `runtime/node.js/${globalThisAny.process.version.substring(0)}`;
  }
  if (globalThisAny.EdgeRuntime) {
    return `runtime/vercel-edge`;
  }
  return "runtime/unknown";
}

// src/remove-undefined-entries.ts
function removeUndefinedEntries$5(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}

// src/with-user-agent-suffix.ts
function withUserAgentSuffix$4(headers, ...userAgentSuffixParts) {
  const cleanedHeaders = removeUndefinedEntries$5(
    headers != null ? headers : {}
  );
  const normalizedHeaders = new Headers(cleanedHeaders);
  const currentUserAgentHeader = normalizedHeaders.get("user-agent") || "";
  normalizedHeaders.set(
    "user-agent",
    [currentUserAgentHeader, ...userAgentSuffixParts].filter(Boolean).join(" ")
  );
  return Object.fromEntries(normalizedHeaders);
}

// src/version.ts
var VERSION$8 = "3.0.12" ;
function loadApiKey$3({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (typeof apiKey === "string") {
    return apiKey;
  }
  if (apiKey != null) {
    throw new LoadAPIKeyError$3({
      message: `${description} API key must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadAPIKeyError$3({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new LoadAPIKeyError$3({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof apiKey !== "string") {
    throw new LoadAPIKeyError$3({
      message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return apiKey;
}

// src/secure-json-parse.ts
var suspectProtoRx$5 = /"__proto__"\s*:/;
var suspectConstructorRx$5 = /"constructor"\s*:/;
function _parse$5(text) {
  const obj = JSON.parse(text);
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (suspectProtoRx$5.test(text) === false && suspectConstructorRx$5.test(text) === false) {
    return obj;
  }
  return filter$5(obj);
}
function filter$5(obj) {
  let next = [obj];
  while (next.length) {
    const nodes = next;
    next = [];
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      if (Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      for (const key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          next.push(value);
        }
      }
    }
  }
  return obj;
}
function secureJsonParse$5(text) {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  try {
    return _parse$5(text);
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
  }
}
var validatorSymbol$5 = Symbol.for("vercel.ai.validator");
function validator$5(validate) {
  return { [validatorSymbol$5]: true, validate };
}
function isValidator$5(value) {
  return typeof value === "object" && value !== null && validatorSymbol$5 in value && value[validatorSymbol$5] === true && "validate" in value;
}
function asValidator$5(value) {
  return isValidator$5(value) ? value : typeof value === "function" ? value() : standardSchemaValidator$5(value);
}
function standardSchemaValidator$5(standardSchema) {
  return validator$5(async (value) => {
    const result = await standardSchema["~standard"].validate(value);
    return result.issues == null ? { success: true, value: result.value } : {
      success: false,
      error: new TypeValidationError$5({
        value,
        cause: result.issues
      })
    };
  });
}

// src/validate-types.ts
async function validateTypes$5({
  value,
  schema
}) {
  const result = await safeValidateTypes$5({ value, schema });
  if (!result.success) {
    throw TypeValidationError$5.wrap({ value, cause: result.error });
  }
  return result.value;
}
async function safeValidateTypes$5({
  value,
  schema
}) {
  const validator2 = asValidator$5(schema);
  try {
    if (validator2.validate == null) {
      return { success: true, value, rawValue: value };
    }
    const result = await validator2.validate(value);
    if (result.success) {
      return { success: true, value: result.value, rawValue: value };
    }
    return {
      success: false,
      error: TypeValidationError$5.wrap({ value, cause: result.error }),
      rawValue: value
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError$5.wrap({ value, cause: error }),
      rawValue: value
    };
  }
}

// src/parse-json.ts
async function parseJSON$5({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$5(text);
    if (schema == null) {
      return value;
    }
    return validateTypes$5({ value, schema });
  } catch (error) {
    if (JSONParseError$5.isInstance(error) || TypeValidationError$5.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError$5({ text, cause: error });
  }
}
async function safeParseJSON$5({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$5(text);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    return await safeValidateTypes$5({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: JSONParseError$5.isInstance(error) ? error : new JSONParseError$5({ text, cause: error }),
      rawValue: void 0
    };
  }
}
function parseJsonEventStream$4({
  stream,
  schema
}) {
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream$1()).pipeThrough(
    new TransformStream({
      async transform({ data }, controller) {
        if (data === "[DONE]") {
          return;
        }
        controller.enqueue(await safeParseJSON$5({ text: data, schema }));
      }
    })
  );
}
async function parseProviderOptions$3({
  provider,
  providerOptions,
  schema
}) {
  if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
    return void 0;
  }
  const parsedProviderOptions = await safeValidateTypes$5({
    value: providerOptions[provider],
    schema
  });
  if (!parsedProviderOptions.success) {
    throw new InvalidArgumentError$5({
      argument: "providerOptions",
      message: `invalid ${provider} provider options`,
      cause: parsedProviderOptions.error
    });
  }
  return parsedProviderOptions.value;
}
var getOriginalFetch2$5 = () => globalThis.fetch;
var postJsonToApi$5 = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
}) => postToApi$5({
  url,
  headers: {
    "Content-Type": "application/json",
    ...headers
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
});
var postToApi$5 = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch = getOriginalFetch2$5()
}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: withUserAgentSuffix$4(
        headers,
        `ai-sdk/provider-utils/${VERSION$8}`,
        getRuntimeEnvironmentUserAgent$4()
      ),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders$5(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError$5(error) || APICallError$5.isInstance(error)) {
          throw error;
        }
        throw new APICallError$5({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError$5(error) || APICallError$5.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError$5({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    throw handleFetchError$5({ error, url, requestBodyValues: body.values });
  }
};

// src/types/tool.ts
function tool$1(tool2) {
  return tool2;
}

// src/provider-defined-tool-factory.ts
function createProviderDefinedToolFactory({
  id,
  name,
  inputSchema
}) {
  return ({
    execute,
    outputSchema,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool$1({
    type: "provider-defined",
    id,
    name,
    args,
    inputSchema,
    outputSchema,
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable
  });
}
function createProviderDefinedToolFactoryWithOutputSchema$1({
  id,
  name,
  inputSchema,
  outputSchema
}) {
  return ({
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool$1({
    type: "provider-defined",
    id,
    name,
    args,
    inputSchema,
    outputSchema,
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable
  });
}

// src/resolve.ts
async function resolve(value) {
  if (typeof value === "function") {
    value = value();
  }
  return Promise.resolve(value);
}
var createJsonErrorResponseHandler$5 = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const responseHeaders = extractResponseHeaders$5(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError$5({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = await parseJSON$5({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError$5({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError$5({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
};
var createEventSourceResponseHandler$4 = (chunkSchema) => async ({ response }) => {
  const responseHeaders = extractResponseHeaders$5(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError$4({});
  }
  return {
    responseHeaders,
    value: parseJsonEventStream$4({
      stream: response.body,
      schema: chunkSchema
    })
  };
};
var createJsonResponseHandler$5 = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = await safeParseJSON$5({
    text: responseBody,
    schema: responseSchema
  });
  const responseHeaders = extractResponseHeaders$5(response);
  if (!parsedResult.success) {
    throw new APICallError$5({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
};

// src/zod-to-json-schema/get-relative-path.ts
var getRelativePath$1 = (pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i]) break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};

// src/zod-to-json-schema/options.ts
var ignoreOverride$1 = Symbol(
  "Let zodToJsonSchema decide on which parser to use"
);
var defaultOptions$1 = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: true,
  rejectedAdditionalProperties: false,
  definitionPath: "definitions",
  strictUnions: false,
  definitions: {},
  errorMessages: false,
  patternStrategy: "escape",
  applyRegexFlags: false,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref"
};
var getDefaultOptions$1 = (options) => typeof options === "string" ? {
  ...defaultOptions$1,
  name: options
} : {
  ...defaultOptions$1,
  ...options
};

// src/zod-to-json-schema/parsers/any.ts
function parseAnyDef$1() {
  return {};
}
function parseArrayDef$1(def, refs) {
  var _a, _b, _c;
  const res = {
    type: "array"
  };
  if (((_a = def.type) == null ? void 0 : _a._def) && ((_c = (_b = def.type) == null ? void 0 : _b._def) == null ? void 0 : _c.typeName) !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef$1(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"]
    });
  }
  if (def.minLength) {
    res.minItems = def.minLength.value;
  }
  if (def.maxLength) {
    res.maxItems = def.maxLength.value;
  }
  if (def.exactLength) {
    res.minItems = def.exactLength.value;
    res.maxItems = def.exactLength.value;
  }
  return res;
}

// src/zod-to-json-schema/parsers/bigint.ts
function parseBigintDef$1(def) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}

// src/zod-to-json-schema/parsers/boolean.ts
function parseBooleanDef$1() {
  return { type: "boolean" };
}

// src/zod-to-json-schema/parsers/branded.ts
function parseBrandedDef$1(_def, refs) {
  return parseDef$1(_def.type._def, refs);
}

// src/zod-to-json-schema/parsers/catch.ts
var parseCatchDef$1 = (def, refs) => {
  return parseDef$1(def.innerType._def, refs);
};

// src/zod-to-json-schema/parsers/date.ts
function parseDateDef$1(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy != null ? overrideDateStrategy : refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item, i) => parseDateDef$1(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser$1(def);
  }
}
var integerDateParser$1 = (def) => {
  const res = {
    type: "integer",
    format: "unix-time"
  };
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        res.minimum = check.value;
        break;
      case "max":
        res.maximum = check.value;
        break;
    }
  }
  return res;
};

// src/zod-to-json-schema/parsers/default.ts
function parseDefaultDef$1(_def, refs) {
  return {
    ...parseDef$1(_def.innerType._def, refs),
    default: _def.defaultValue()
  };
}

// src/zod-to-json-schema/parsers/effects.ts
function parseEffectsDef$1(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef$1(_def.schema._def, refs) : parseAnyDef$1();
}

// src/zod-to-json-schema/parsers/enum.ts
function parseEnumDef$1(def) {
  return {
    type: "string",
    enum: Array.from(def.values)
  };
}

// src/zod-to-json-schema/parsers/intersection.ts
var isJsonSchema7AllOfType$1 = (type) => {
  if ("type" in type && type.type === "string") return false;
  return "allOf" in type;
};
function parseIntersectionDef$1(def, refs) {
  const allOf = [
    parseDef$1(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"]
    }),
    parseDef$1(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"]
    })
  ].filter((x) => !!x);
  const mergedAllOf = [];
  allOf.forEach((schema) => {
    if (isJsonSchema7AllOfType$1(schema)) {
      mergedAllOf.push(...schema.allOf);
    } else {
      let nestedSchema = schema;
      if ("additionalProperties" in schema && schema.additionalProperties === false) {
        const { additionalProperties, ...rest } = schema;
        nestedSchema = rest;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? { allOf: mergedAllOf } : void 0;
}

// src/zod-to-json-schema/parsers/literal.ts
function parseLiteralDef$1(def) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}

// src/zod-to-json-schema/parsers/string.ts
var emojiRegex$1 = void 0;
var zodPatterns$1 = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: () => {
    if (emojiRegex$1 === void 0) {
      emojiRegex$1 = RegExp(
        "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
        "u"
      );
    }
    return emojiRegex$1;
  },
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef$1(def, refs) {
  const res = {
    type: "string"
  };
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          break;
        case "max":
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat$1(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat$1(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern$1(res, zodPatterns$1.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat$1(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat$1(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern$1(res, check.regex, check.message, refs);
          break;
        case "cuid":
          addPattern$1(res, zodPatterns$1.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern$1(res, zodPatterns$1.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern$1(
            res,
            RegExp(`^${escapeLiteralCheckValue$1(check.value, refs)}`),
            check.message,
            refs
          );
          break;
        case "endsWith":
          addPattern$1(
            res,
            RegExp(`${escapeLiteralCheckValue$1(check.value, refs)}$`),
            check.message,
            refs
          );
          break;
        case "datetime":
          addFormat$1(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat$1(res, "date", check.message, refs);
          break;
        case "time":
          addFormat$1(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat$1(res, "duration", check.message, refs);
          break;
        case "length":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "includes": {
          addPattern$1(
            res,
            RegExp(escapeLiteralCheckValue$1(check.value, refs)),
            check.message,
            refs
          );
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat$1(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat$1(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "base64url":
          addPattern$1(res, zodPatterns$1.base64url, check.message, refs);
          break;
        case "jwt":
          addPattern$1(res, zodPatterns$1.jwt, check.message, refs);
          break;
        case "cidr": {
          if (check.version !== "v6") {
            addPattern$1(res, zodPatterns$1.ipv4Cidr, check.message, refs);
          }
          if (check.version !== "v4") {
            addPattern$1(res, zodPatterns$1.ipv6Cidr, check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern$1(res, zodPatterns$1.emoji(), check.message, refs);
          break;
        case "ulid": {
          addPattern$1(res, zodPatterns$1.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat$1(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              res.contentEncoding = "base64";
              break;
            }
            case "pattern:zod": {
              addPattern$1(res, zodPatterns$1.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern$1(res, zodPatterns$1.nanoid, check.message, refs);
        }
      }
    }
  }
  return res;
}
function escapeLiteralCheckValue$1(literal, refs) {
  return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric$1(literal) : literal;
}
var ALPHA_NUMERIC$1 = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);
function escapeNonAlphaNumeric$1(source) {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    if (!ALPHA_NUMERIC$1.has(source[i])) {
      result += "\\";
    }
    result += source[i];
  }
  return result;
}
function addFormat$1(schema, value, message, refs) {
  var _a;
  if (schema.format || ((_a = schema.anyOf) == null ? void 0 : _a.some((x) => x.format))) {
    if (!schema.anyOf) {
      schema.anyOf = [];
    }
    if (schema.format) {
      schema.anyOf.push({
        format: schema.format
      });
      delete schema.format;
    }
    schema.anyOf.push({
      format: value,
      ...message && refs.errorMessages && { errorMessage: { format: message } }
    });
  } else {
    schema.format = value;
  }
}
function addPattern$1(schema, regex, message, refs) {
  var _a;
  if (schema.pattern || ((_a = schema.allOf) == null ? void 0 : _a.some((x) => x.pattern))) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push({
        pattern: schema.pattern
      });
      delete schema.pattern;
    }
    schema.allOf.push({
      pattern: stringifyRegExpWithFlags$1(regex, refs),
      ...message && refs.errorMessages && { errorMessage: { pattern: message } }
    });
  } else {
    schema.pattern = stringifyRegExpWithFlags$1(regex, refs);
  }
}
function stringifyRegExpWithFlags$1(regex, refs) {
  var _a;
  if (!refs.applyRegexFlags || !regex.flags) {
    return regex.source;
  }
  const flags = {
    i: regex.flags.includes("i"),
    // Case-insensitive
    m: regex.flags.includes("m"),
    // `^` and `$` matches adjacent to newline characters
    s: regex.flags.includes("s")
    // `.` matches newlines
  };
  const source = flags.i ? regex.source.toLowerCase() : regex.source;
  let pattern = "";
  let isEscaped = false;
  let inCharGroup = false;
  let inCharRange = false;
  for (let i = 0; i < source.length; i++) {
    if (isEscaped) {
      pattern += source[i];
      isEscaped = false;
      continue;
    }
    if (flags.i) {
      if (inCharGroup) {
        if (source[i].match(/[a-z]/)) {
          if (inCharRange) {
            pattern += source[i];
            pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
            inCharRange = false;
          } else if (source[i + 1] === "-" && ((_a = source[i + 2]) == null ? void 0 : _a.match(/[a-z]/))) {
            pattern += source[i];
            inCharRange = true;
          } else {
            pattern += `${source[i]}${source[i].toUpperCase()}`;
          }
          continue;
        }
      } else if (source[i].match(/[a-z]/)) {
        pattern += `[${source[i]}${source[i].toUpperCase()}]`;
        continue;
      }
    }
    if (flags.m) {
      if (source[i] === "^") {
        pattern += `(^|(?<=[\r
]))`;
        continue;
      } else if (source[i] === "$") {
        pattern += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (flags.s && source[i] === ".") {
      pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
      continue;
    }
    pattern += source[i];
    if (source[i] === "\\") {
      isEscaped = true;
    } else if (inCharGroup && source[i] === "]") {
      inCharGroup = false;
    } else if (!inCharGroup && source[i] === "[") {
      inCharGroup = true;
    }
  }
  return pattern;
}

// src/zod-to-json-schema/parsers/record.ts
function parseRecordDef$1(def, refs) {
  var _a, _b, _c, _d, _e, _f;
  const schema = {
    type: "object",
    additionalProperties: (_a = parseDef$1(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    })) != null ? _a : refs.allowedAdditionalProperties
  };
  if (((_b = def.keyType) == null ? void 0 : _b._def.typeName) === ZodFirstPartyTypeKind.ZodString && ((_c = def.keyType._def.checks) == null ? void 0 : _c.length)) {
    const { type, ...keyType } = parseStringDef$1(def.keyType._def, refs);
    return {
      ...schema,
      propertyNames: keyType
    };
  } else if (((_d = def.keyType) == null ? void 0 : _d._def.typeName) === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      ...schema,
      propertyNames: {
        enum: def.keyType._def.values
      }
    };
  } else if (((_e = def.keyType) == null ? void 0 : _e._def.typeName) === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && ((_f = def.keyType._def.type._def.checks) == null ? void 0 : _f.length)) {
    const { type, ...keyType } = parseBrandedDef$1(
      def.keyType._def,
      refs
    );
    return {
      ...schema,
      propertyNames: keyType
    };
  }
  return schema;
}

// src/zod-to-json-schema/parsers/map.ts
function parseMapDef$1(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef$1(def, refs);
  }
  const keys = parseDef$1(def.keyType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "0"]
  }) || parseAnyDef$1();
  const values = parseDef$1(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "1"]
  }) || parseAnyDef$1();
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}

// src/zod-to-json-schema/parsers/native-enum.ts
function parseNativeEnumDef$1(def) {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object[object[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object[key]);
  const parsedTypes = Array.from(
    new Set(actualValues.map((values) => typeof values))
  );
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}

// src/zod-to-json-schema/parsers/never.ts
function parseNeverDef$1() {
  return { not: parseAnyDef$1() };
}

// src/zod-to-json-schema/parsers/null.ts
function parseNullDef$1() {
  return {
    type: "null"
  };
}

// src/zod-to-json-schema/parsers/union.ts
var primitiveMappings$1 = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef$1(def, refs) {
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every(
    (x) => x._def.typeName in primitiveMappings$1 && (!x._def.checks || !x._def.checks.length)
  )) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings$1[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce(
      (acc, x) => {
        const type = typeof x._def.value;
        switch (type) {
          case "string":
          case "number":
          case "boolean":
            return [...acc, type];
          case "bigint":
            return [...acc, "integer"];
          case "object":
            if (x._def.value === null) return [...acc, "null"];
          case "symbol":
          case "undefined":
          case "function":
          default:
            return acc;
        }
      },
      []
    );
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce(
          (acc, x) => {
            return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
          },
          []
        )
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce(
        (acc, x) => [
          ...acc,
          ...x._def.values.filter((x2) => !acc.includes(x2))
        ],
        []
      )
    };
  }
  return asAnyOf$1(def, refs);
}
var asAnyOf$1 = (def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map(
    (x, i) => parseDef$1(x._def, {
      ...refs,
      currentPath: [...refs.currentPath, "anyOf", `${i}`]
    })
  ).filter(
    (x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0)
  );
  return anyOf.length ? { anyOf } : void 0;
};

// src/zod-to-json-schema/parsers/nullable.ts
function parseNullableDef$1(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
    def.innerType._def.typeName
  ) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    return {
      type: [
        primitiveMappings$1[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  const base = parseDef$1(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"]
  });
  return base && { anyOf: [base, { type: "null" }] };
}

// src/zod-to-json-schema/parsers/number.ts
function parseNumberDef$1(def) {
  const res = {
    type: "number"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        break;
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}

// src/zod-to-json-schema/parsers/object.ts
function parseObjectDef$1(def, refs) {
  const result = {
    type: "object",
    properties: {}
  };
  const required = [];
  const shape = def.shape();
  for (const propName in shape) {
    let propDef = shape[propName];
    if (propDef === void 0 || propDef._def === void 0) {
      continue;
    }
    const propOptional = safeIsOptional$1(propDef);
    const parsedDef = parseDef$1(propDef._def, {
      ...refs,
      currentPath: [...refs.currentPath, "properties", propName],
      propertyPath: [...refs.currentPath, "properties", propName]
    });
    if (parsedDef === void 0) {
      continue;
    }
    result.properties[propName] = parsedDef;
    if (!propOptional) {
      required.push(propName);
    }
  }
  if (required.length) {
    result.required = required;
  }
  const additionalProperties = decideAdditionalProperties$1(def, refs);
  if (additionalProperties !== void 0) {
    result.additionalProperties = additionalProperties;
  }
  return result;
}
function decideAdditionalProperties$1(def, refs) {
  if (def.catchall._def.typeName !== "ZodNever") {
    return parseDef$1(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    });
  }
  switch (def.unknownKeys) {
    case "passthrough":
      return refs.allowedAdditionalProperties;
    case "strict":
      return refs.rejectedAdditionalProperties;
    case "strip":
      return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
  }
}
function safeIsOptional$1(schema) {
  try {
    return schema.isOptional();
  } catch (e) {
    return true;
  }
}

// src/zod-to-json-schema/parsers/optional.ts
var parseOptionalDef$1 = (def, refs) => {
  var _a;
  if (refs.currentPath.toString() === ((_a = refs.propertyPath) == null ? void 0 : _a.toString())) {
    return parseDef$1(def.innerType._def, refs);
  }
  const innerSchema = parseDef$1(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "1"]
  });
  return innerSchema ? { anyOf: [{ not: parseAnyDef$1() }, innerSchema] } : parseAnyDef$1();
};

// src/zod-to-json-schema/parsers/pipeline.ts
var parsePipelineDef$1 = (def, refs) => {
  if (refs.pipeStrategy === "input") {
    return parseDef$1(def.in._def, refs);
  } else if (refs.pipeStrategy === "output") {
    return parseDef$1(def.out._def, refs);
  }
  const a = parseDef$1(def.in._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", "0"]
  });
  const b = parseDef$1(def.out._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
  });
  return {
    allOf: [a, b].filter((x) => x !== void 0)
  };
};

// src/zod-to-json-schema/parsers/promise.ts
function parsePromiseDef$1(def, refs) {
  return parseDef$1(def.type._def, refs);
}

// src/zod-to-json-schema/parsers/set.ts
function parseSetDef$1(def, refs) {
  const items = parseDef$1(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items"]
  });
  const schema = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    schema.minItems = def.minSize.value;
  }
  if (def.maxSize) {
    schema.maxItems = def.maxSize.value;
  }
  return schema;
}

// src/zod-to-json-schema/parsers/tuple.ts
function parseTupleDef$1(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef$1(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      ),
      additionalItems: parseDef$1(def.rest._def, {
        ...refs,
        currentPath: [...refs.currentPath, "additionalItems"]
      })
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef$1(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      )
    };
  }
}

// src/zod-to-json-schema/parsers/undefined.ts
function parseUndefinedDef$1() {
  return {
    not: parseAnyDef$1()
  };
}

// src/zod-to-json-schema/parsers/unknown.ts
function parseUnknownDef$1() {
  return parseAnyDef$1();
}

// src/zod-to-json-schema/parsers/readonly.ts
var parseReadonlyDef$1 = (def, refs) => {
  return parseDef$1(def.innerType._def, refs);
};

// src/zod-to-json-schema/select-parser.ts
var selectParser$1 = (def, typeName, refs) => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef$1(def);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef$1(def);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef$1();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef$1();
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef$1();
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef$1(def);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef$1(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef$1(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return () => def.getter()._def;
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef$1();
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef$1();
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef$1();
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodReadonly:
      return parseReadonlyDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef$1(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return void 0;
    default:
      return /* @__PURE__ */ ((_) => void 0)();
  }
};

// src/zod-to-json-schema/parse-def.ts
function parseDef$1(def, refs, forceResolution = false) {
  var _a;
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = (_a = refs.override) == null ? void 0 : _a.call(
      refs,
      def,
      refs,
      seenItem,
      forceResolution
    );
    if (overrideResult !== ignoreOverride$1) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref$1(seenItem, refs);
    if (seenSchema !== void 0) {
      return seenSchema;
    }
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.set(def, newItem);
  const jsonSchemaOrGetter = selectParser$1(def, def.typeName, refs);
  const jsonSchema2 = typeof jsonSchemaOrGetter === "function" ? parseDef$1(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
  if (jsonSchema2) {
    addMeta$1(def, refs, jsonSchema2);
  }
  if (refs.postProcess) {
    const postProcessResult = refs.postProcess(jsonSchema2, def, refs);
    newItem.jsonSchema = jsonSchema2;
    return postProcessResult;
  }
  newItem.jsonSchema = jsonSchema2;
  return jsonSchema2;
}
var get$ref$1 = (item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return { $ref: item.path.join("/") };
    case "relative":
      return { $ref: getRelativePath$1(refs.currentPath, item.path) };
    case "none":
    case "seen": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
        console.warn(
          `Recursive reference detected at ${refs.currentPath.join(
            "/"
          )}! Defaulting to any`
        );
        return parseAnyDef$1();
      }
      return refs.$refStrategy === "seen" ? parseAnyDef$1() : void 0;
    }
  }
};
var addMeta$1 = (def, refs, jsonSchema2) => {
  if (def.description) {
    jsonSchema2.description = def.description;
  }
  return jsonSchema2;
};

// src/zod-to-json-schema/refs.ts
var getRefs$1 = (options) => {
  const _options = getDefaultOptions$1(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return {
    ..._options,
    currentPath,
    propertyPath: void 0,
    seen: new Map(
      Object.entries(_options.definitions).map(([name, def]) => [
        def._def,
        {
          def: def._def,
          path: [..._options.basePath, _options.definitionPath, name],
          // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
          jsonSchema: void 0
        }
      ])
    )
  };
};

// src/zod-to-json-schema/zod-to-json-schema.ts
var zodToJsonSchema$1 = (schema, options) => {
  var _a;
  const refs = getRefs$1(options);
  let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce(
    (acc, [name2, schema2]) => {
      var _a2;
      return {
        ...acc,
        [name2]: (_a2 = parseDef$1(
          schema2._def,
          {
            ...refs,
            currentPath: [...refs.basePath, refs.definitionPath, name2]
          },
          true
        )) != null ? _a2 : parseAnyDef$1()
      };
    },
    {}
  ) : void 0;
  const name = typeof options === "string" ? options : (options == null ? void 0 : options.nameStrategy) === "title" ? void 0 : options == null ? void 0 : options.name;
  const main = (_a = parseDef$1(
    schema._def,
    name === void 0 ? refs : {
      ...refs,
      currentPath: [...refs.basePath, refs.definitionPath, name]
    },
    false
  )) != null ? _a : parseAnyDef$1();
  const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
  if (title !== void 0) {
    main.title = title;
  }
  const combined = name === void 0 ? definitions ? {
    ...main,
    [refs.definitionPath]: definitions
  } : main : {
    $ref: [
      ...refs.$refStrategy === "relative" ? [] : refs.basePath,
      refs.definitionPath,
      name
    ].join("/"),
    [refs.definitionPath]: {
      ...definitions,
      [name]: main
    }
  };
  combined.$schema = "http://json-schema.org/draft-07/schema#";
  return combined;
};

// src/zod-to-json-schema/index.ts
var zod_to_json_schema_default$1 = zodToJsonSchema$1;

// src/zod-schema.ts
function zod3Schema$1(zodSchema2, options) {
  var _a;
  const useReferences = (_a = void 0 ) != null ? _a : false;
  return jsonSchema$1(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => zod_to_json_schema_default$1(zodSchema2, {
      $refStrategy: useReferences ? "root" : "none"
    }),
    {
      validate: async (value) => {
        const result = await zodSchema2.safeParseAsync(value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
function zod4Schema$1(zodSchema2, options) {
  var _a;
  const useReferences = (_a = void 0 ) != null ? _a : false;
  return jsonSchema$1(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => toJSONSchema(zodSchema2, {
      target: "draft-7",
      io: "output",
      reused: useReferences ? "ref" : "inline"
    }),
    {
      validate: async (value) => {
        const result = await safeParseAsync(zodSchema2, value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
function isZod4Schema$1(zodSchema2) {
  return "_zod" in zodSchema2;
}
function zodSchema$1(zodSchema2, options) {
  if (isZod4Schema$1(zodSchema2)) {
    return zod4Schema$1(zodSchema2);
  } else {
    return zod3Schema$1(zodSchema2);
  }
}

// src/schema.ts
var schemaSymbol$1 = Symbol.for("vercel.ai.schema");
function lazySchema$1(createSchema) {
  let schema;
  return () => {
    if (schema == null) {
      schema = createSchema();
    }
    return schema;
  };
}
function jsonSchema$1(jsonSchema2, {
  validate
} = {}) {
  return {
    [schemaSymbol$1]: true,
    _type: void 0,
    // should never be used directly
    [validatorSymbol$5]: true,
    get jsonSchema() {
      if (typeof jsonSchema2 === "function") {
        jsonSchema2 = jsonSchema2();
      }
      return jsonSchema2;
    },
    validate
  };
}

// src/uint8-utils.ts
var { btoa: btoa$4} = globalThis;
function convertUint8ArrayToBase64$4(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa$4(latin1string);
}
function convertToBase64$3(value) {
  return value instanceof Uint8Array ? convertUint8ArrayToBase64$4(value) : value;
}

// src/without-trailing-slash.ts
function withoutTrailingSlash$4(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}

// src/google-provider.ts

// src/version.ts
var VERSION$7 = "2.0.23" ;
var googleErrorDataSchema = lazySchema$1(
  () => zodSchema$1(
    object({
      error: object({
        code: number().nullable(),
        message: string(),
        status: string()
      })
    })
  )
);
var googleFailedResponseHandler = createJsonErrorResponseHandler$5({
  errorSchema: googleErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
var googleGenerativeAIEmbeddingProviderOptions = lazySchema$1(
  () => zodSchema$1(
    object({
      /**
       * Optional. Optional reduced dimension for the output embedding.
       * If set, excessive values in the output embedding are truncated from the end.
       */
      outputDimensionality: number().optional(),
      /**
       * Optional. Specifies the task type for generating embeddings.
       * Supported task types:
       * - SEMANTIC_SIMILARITY: Optimized for text similarity.
       * - CLASSIFICATION: Optimized for text classification.
       * - CLUSTERING: Optimized for clustering texts based on similarity.
       * - RETRIEVAL_DOCUMENT: Optimized for document retrieval.
       * - RETRIEVAL_QUERY: Optimized for query-based retrieval.
       * - QUESTION_ANSWERING: Optimized for answering questions.
       * - FACT_VERIFICATION: Optimized for verifying factual information.
       * - CODE_RETRIEVAL_QUERY: Optimized for retrieving code blocks based on natural language queries.
       */
      taskType: _enum([
        "SEMANTIC_SIMILARITY",
        "CLASSIFICATION",
        "CLUSTERING",
        "RETRIEVAL_DOCUMENT",
        "RETRIEVAL_QUERY",
        "QUESTION_ANSWERING",
        "FACT_VERIFICATION",
        "CODE_RETRIEVAL_QUERY"
      ]).optional()
    })
  )
);

// src/google-generative-ai-embedding-model.ts
var GoogleGenerativeAIEmbeddingModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    this.maxEmbeddingsPerCall = 2048;
    this.supportsParallelCalls = true;
    this.modelId = modelId;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values,
    headers,
    abortSignal,
    providerOptions
  }) {
    const googleOptions = await parseProviderOptions$3({
      provider: "google",
      providerOptions,
      schema: googleGenerativeAIEmbeddingProviderOptions
    });
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError$2({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const mergedHeaders = combineHeaders$5(
      await resolve(this.config.headers),
      headers
    );
    if (values.length === 1) {
      const {
        responseHeaders: responseHeaders2,
        value: response2,
        rawValue: rawValue2
      } = await postJsonToApi$5({
        url: `${this.config.baseURL}/models/${this.modelId}:embedContent`,
        headers: mergedHeaders,
        body: {
          model: `models/${this.modelId}`,
          content: {
            parts: [{ text: values[0] }]
          },
          outputDimensionality: googleOptions == null ? void 0 : googleOptions.outputDimensionality,
          taskType: googleOptions == null ? void 0 : googleOptions.taskType
        },
        failedResponseHandler: googleFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler$5(
          googleGenerativeAISingleEmbeddingResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        embeddings: [response2.embedding.values],
        usage: void 0,
        response: { headers: responseHeaders2, body: rawValue2 }
      };
    }
    const {
      responseHeaders,
      value: response,
      rawValue
    } = await postJsonToApi$5({
      url: `${this.config.baseURL}/models/${this.modelId}:batchEmbedContents`,
      headers: mergedHeaders,
      body: {
        requests: values.map((value) => ({
          model: `models/${this.modelId}`,
          content: { role: "user", parts: [{ text: value }] },
          outputDimensionality: googleOptions == null ? void 0 : googleOptions.outputDimensionality,
          taskType: googleOptions == null ? void 0 : googleOptions.taskType
        }))
      },
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$5(
        googleGenerativeAITextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.embeddings.map((item) => item.values),
      usage: void 0,
      response: { headers: responseHeaders, body: rawValue }
    };
  }
};
var googleGenerativeAITextEmbeddingResponseSchema = lazySchema$1(
  () => zodSchema$1(
    object({
      embeddings: array(object({ values: array(number()) }))
    })
  )
);
var googleGenerativeAISingleEmbeddingResponseSchema = lazySchema$1(
  () => zodSchema$1(
    object({
      embedding: object({ values: array(number()) })
    })
  )
);

// src/convert-json-schema-to-openapi-schema.ts
function convertJSONSchemaToOpenAPISchema(jsonSchema) {
  if (jsonSchema == null || isEmptyObjectSchema(jsonSchema)) {
    return void 0;
  }
  if (typeof jsonSchema === "boolean") {
    return { type: "boolean", properties: {} };
  }
  const {
    type,
    description,
    required,
    properties,
    items,
    allOf,
    anyOf,
    oneOf,
    format,
    const: constValue,
    minLength,
    enum: enumValues
  } = jsonSchema;
  const result = {};
  if (description) result.description = description;
  if (required) result.required = required;
  if (format) result.format = format;
  if (constValue !== void 0) {
    result.enum = [constValue];
  }
  if (type) {
    if (Array.isArray(type)) {
      if (type.includes("null")) {
        result.type = type.filter((t) => t !== "null")[0];
        result.nullable = true;
      } else {
        result.type = type;
      }
    } else if (type === "null") {
      result.type = "null";
    } else {
      result.type = type;
    }
  }
  if (enumValues !== void 0) {
    result.enum = enumValues;
  }
  if (properties != null) {
    result.properties = Object.entries(properties).reduce(
      (acc, [key, value]) => {
        acc[key] = convertJSONSchemaToOpenAPISchema(value);
        return acc;
      },
      {}
    );
  }
  if (items) {
    result.items = Array.isArray(items) ? items.map(convertJSONSchemaToOpenAPISchema) : convertJSONSchemaToOpenAPISchema(items);
  }
  if (allOf) {
    result.allOf = allOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (anyOf) {
    if (anyOf.some(
      (schema) => typeof schema === "object" && (schema == null ? void 0 : schema.type) === "null"
    )) {
      const nonNullSchemas = anyOf.filter(
        (schema) => !(typeof schema === "object" && (schema == null ? void 0 : schema.type) === "null")
      );
      if (nonNullSchemas.length === 1) {
        const converted = convertJSONSchemaToOpenAPISchema(nonNullSchemas[0]);
        if (typeof converted === "object") {
          result.nullable = true;
          Object.assign(result, converted);
        }
      } else {
        result.anyOf = nonNullSchemas.map(convertJSONSchemaToOpenAPISchema);
        result.nullable = true;
      }
    } else {
      result.anyOf = anyOf.map(convertJSONSchemaToOpenAPISchema);
    }
  }
  if (oneOf) {
    result.oneOf = oneOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (minLength !== void 0) {
    result.minLength = minLength;
  }
  return result;
}
function isEmptyObjectSchema(jsonSchema) {
  return jsonSchema != null && typeof jsonSchema === "object" && jsonSchema.type === "object" && (jsonSchema.properties == null || Object.keys(jsonSchema.properties).length === 0) && !jsonSchema.additionalProperties;
}
function convertToGoogleGenerativeAIMessages(prompt, options) {
  var _a;
  const systemInstructionParts = [];
  const contents = [];
  let systemMessagesAllowed = true;
  const isGemmaModel = (_a = options == null ? void 0 : options.isGemmaModel) != null ? _a : false;
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        if (!systemMessagesAllowed) {
          throw new UnsupportedFunctionalityError$4({
            functionality: "system messages are only supported at the beginning of the conversation"
          });
        }
        systemInstructionParts.push({ text: content });
        break;
      }
      case "user": {
        systemMessagesAllowed = false;
        const parts = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              parts.push({ text: part.text });
              break;
            }
            case "file": {
              const mediaType = part.mediaType === "image/*" ? "image/jpeg" : part.mediaType;
              parts.push(
                part.data instanceof URL ? {
                  fileData: {
                    mimeType: mediaType,
                    fileUri: part.data.toString()
                  }
                } : {
                  inlineData: {
                    mimeType: mediaType,
                    data: convertToBase64$3(part.data)
                  }
                }
              );
              break;
            }
          }
        }
        contents.push({ role: "user", parts });
        break;
      }
      case "assistant": {
        systemMessagesAllowed = false;
        contents.push({
          role: "model",
          parts: content.map((part) => {
            var _a2, _b, _c, _d, _e, _f;
            switch (part.type) {
              case "text": {
                return part.text.length === 0 ? void 0 : {
                  text: part.text,
                  thoughtSignature: (_b = (_a2 = part.providerOptions) == null ? void 0 : _a2.google) == null ? void 0 : _b.thoughtSignature
                };
              }
              case "reasoning": {
                return part.text.length === 0 ? void 0 : {
                  text: part.text,
                  thought: true,
                  thoughtSignature: (_d = (_c = part.providerOptions) == null ? void 0 : _c.google) == null ? void 0 : _d.thoughtSignature
                };
              }
              case "file": {
                if (part.mediaType !== "image/png") {
                  throw new UnsupportedFunctionalityError$4({
                    functionality: "Only PNG images are supported in assistant messages"
                  });
                }
                if (part.data instanceof URL) {
                  throw new UnsupportedFunctionalityError$4({
                    functionality: "File data URLs in assistant messages are not supported"
                  });
                }
                return {
                  inlineData: {
                    mimeType: part.mediaType,
                    data: convertToBase64$3(part.data)
                  }
                };
              }
              case "tool-call": {
                return {
                  functionCall: {
                    name: part.toolName,
                    args: part.input
                  },
                  thoughtSignature: (_f = (_e = part.providerOptions) == null ? void 0 : _e.google) == null ? void 0 : _f.thoughtSignature
                };
              }
            }
          }).filter((part) => part !== void 0)
        });
        break;
      }
      case "tool": {
        systemMessagesAllowed = false;
        const parts = [];
        for (const part of content) {
          const output = part.output;
          if (output.type === "content") {
            for (const contentPart of output.value) {
              switch (contentPart.type) {
                case "text":
                  parts.push({
                    functionResponse: {
                      name: part.toolName,
                      response: {
                        name: part.toolName,
                        content: contentPart.text
                      }
                    }
                  });
                  break;
                case "media":
                  parts.push(
                    {
                      inlineData: {
                        mimeType: contentPart.mediaType,
                        data: contentPart.data
                      }
                    },
                    {
                      text: "Tool executed successfully and returned this image as a response"
                    }
                  );
                  break;
                default:
                  parts.push({ text: JSON.stringify(contentPart) });
                  break;
              }
            }
          } else {
            parts.push({
              functionResponse: {
                name: part.toolName,
                response: {
                  name: part.toolName,
                  content: output.value
                }
              }
            });
          }
        }
        contents.push({
          role: "user",
          parts
        });
        break;
      }
    }
  }
  if (isGemmaModel && systemInstructionParts.length > 0 && contents.length > 0 && contents[0].role === "user") {
    const systemText = systemInstructionParts.map((part) => part.text).join("\n\n");
    contents[0].parts.unshift({ text: systemText + "\n\n" });
  }
  return {
    systemInstruction: systemInstructionParts.length > 0 && !isGemmaModel ? { parts: systemInstructionParts } : void 0,
    contents
  };
}

// src/get-model-path.ts
function getModelPath(modelId) {
  return modelId.includes("/") ? modelId : `models/${modelId}`;
}
var googleGenerativeAIProviderOptions = lazySchema$1(
  () => zodSchema$1(
    object({
      responseModalities: array(_enum(["TEXT", "IMAGE"])).optional(),
      thinkingConfig: object({
        thinkingBudget: number().optional(),
        includeThoughts: boolean().optional()
      }).optional(),
      /**
       * Optional.
       * The name of the cached content used as context to serve the prediction.
       * Format: cachedContents/{cachedContent}
       */
      cachedContent: string().optional(),
      /**
       * Optional. Enable structured output. Default is true.
       *
       * This is useful when the JSON Schema contains elements that are
       * not supported by the OpenAPI schema version that
       * Google Generative AI uses. You can use this to disable
       * structured outputs if you need to.
       */
      structuredOutputs: boolean().optional(),
      /**
       * Optional. A list of unique safety settings for blocking unsafe content.
       */
      safetySettings: array(
        object({
          category: _enum([
            "HARM_CATEGORY_UNSPECIFIED",
            "HARM_CATEGORY_HATE_SPEECH",
            "HARM_CATEGORY_DANGEROUS_CONTENT",
            "HARM_CATEGORY_HARASSMENT",
            "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "HARM_CATEGORY_CIVIC_INTEGRITY"
          ]),
          threshold: _enum([
            "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
            "BLOCK_LOW_AND_ABOVE",
            "BLOCK_MEDIUM_AND_ABOVE",
            "BLOCK_ONLY_HIGH",
            "BLOCK_NONE",
            "OFF"
          ])
        })
      ).optional(),
      threshold: _enum([
        "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
        "BLOCK_LOW_AND_ABOVE",
        "BLOCK_MEDIUM_AND_ABOVE",
        "BLOCK_ONLY_HIGH",
        "BLOCK_NONE",
        "OFF"
      ]).optional(),
      /**
       * Optional. Enables timestamp understanding for audio-only files.
       *
       * https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/audio-understanding
       */
      audioTimestamp: boolean().optional(),
      /**
       * Optional. Defines labels used in billing reports. Available on Vertex AI only.
       *
       * https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/add-labels-to-api-calls
       */
      labels: record(string(), string()).optional(),
      /**
       * Optional. If specified, the media resolution specified will be used.
       *
       * https://ai.google.dev/api/generate-content#MediaResolution
       */
      mediaResolution: _enum([
        "MEDIA_RESOLUTION_UNSPECIFIED",
        "MEDIA_RESOLUTION_LOW",
        "MEDIA_RESOLUTION_MEDIUM",
        "MEDIA_RESOLUTION_HIGH"
      ]).optional(),
      /**
       * Optional. Configures the image generation aspect ratio for Gemini models.
       *
       * https://ai.google.dev/gemini-api/docs/image-generation#aspect_ratios
       */
      imageConfig: object({
        aspectRatio: _enum([
          "1:1",
          "2:3",
          "3:2",
          "3:4",
          "4:3",
          "4:5",
          "5:4",
          "9:16",
          "16:9",
          "21:9"
        ]).optional()
      }).optional()
    })
  )
);
function prepareTools$2({
  tools,
  toolChoice,
  modelId
}) {
  var _a;
  tools = (tools == null ? void 0 : tools.length) ? tools : void 0;
  const toolWarnings = [];
  const isGemini2 = modelId.includes("gemini-2");
  const supportsDynamicRetrieval = modelId.includes("gemini-1.5-flash") && !modelId.includes("-8b");
  if (tools == null) {
    return { tools: void 0, toolConfig: void 0, toolWarnings };
  }
  const hasFunctionTools = tools.some((tool) => tool.type === "function");
  const hasProviderDefinedTools = tools.some(
    (tool) => tool.type === "provider-defined"
  );
  if (hasFunctionTools && hasProviderDefinedTools) {
    toolWarnings.push({
      type: "unsupported-tool",
      tool: tools.find((tool) => tool.type === "function"),
      details: "Cannot mix function tools with provider-defined tools in the same request. Please use either function tools or provider-defined tools, but not both."
    });
  }
  if (hasProviderDefinedTools) {
    const googleTools2 = [];
    const providerDefinedTools = tools.filter(
      (tool) => tool.type === "provider-defined"
    );
    providerDefinedTools.forEach((tool) => {
      switch (tool.id) {
        case "google.google_search":
          if (isGemini2) {
            googleTools2.push({ googleSearch: {} });
          } else if (supportsDynamicRetrieval) {
            googleTools2.push({
              googleSearchRetrieval: {
                dynamicRetrievalConfig: {
                  mode: tool.args.mode,
                  dynamicThreshold: tool.args.dynamicThreshold
                }
              }
            });
          } else {
            googleTools2.push({ googleSearchRetrieval: {} });
          }
          break;
        case "google.url_context":
          if (isGemini2) {
            googleTools2.push({ urlContext: {} });
          } else {
            toolWarnings.push({
              type: "unsupported-tool",
              tool,
              details: "The URL context tool is not supported with other Gemini models than Gemini 2."
            });
          }
          break;
        case "google.code_execution":
          if (isGemini2) {
            googleTools2.push({ codeExecution: {} });
          } else {
            toolWarnings.push({
              type: "unsupported-tool",
              tool,
              details: "The code execution tools is not supported with other Gemini models than Gemini 2."
            });
          }
          break;
        default:
          toolWarnings.push({ type: "unsupported-tool", tool });
          break;
      }
    });
    return {
      tools: googleTools2.length > 0 ? googleTools2 : void 0,
      toolConfig: void 0,
      toolWarnings
    };
  }
  const functionDeclarations = [];
  for (const tool of tools) {
    switch (tool.type) {
      case "function":
        functionDeclarations.push({
          name: tool.name,
          description: (_a = tool.description) != null ? _a : "",
          parameters: convertJSONSchemaToOpenAPISchema(tool.inputSchema)
        });
        break;
      default:
        toolWarnings.push({ type: "unsupported-tool", tool });
        break;
    }
  }
  if (toolChoice == null) {
    return {
      tools: { functionDeclarations },
      toolConfig: void 0,
      toolWarnings
    };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
      return {
        tools: { functionDeclarations },
        toolConfig: { functionCallingConfig: { mode: "AUTO" } },
        toolWarnings
      };
    case "none":
      return {
        tools: { functionDeclarations },
        toolConfig: { functionCallingConfig: { mode: "NONE" } },
        toolWarnings
      };
    case "required":
      return {
        tools: { functionDeclarations },
        toolConfig: { functionCallingConfig: { mode: "ANY" } },
        toolWarnings
      };
    case "tool":
      return {
        tools: { functionDeclarations },
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY",
            allowedFunctionNames: [toolChoice.toolName]
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError$4({
        functionality: `tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}

// src/map-google-generative-ai-finish-reason.ts
function mapGoogleGenerativeAIFinishReason({
  finishReason,
  hasToolCalls
}) {
  switch (finishReason) {
    case "STOP":
      return hasToolCalls ? "tool-calls" : "stop";
    case "MAX_TOKENS":
      return "length";
    case "IMAGE_SAFETY":
    case "RECITATION":
    case "SAFETY":
    case "BLOCKLIST":
    case "PROHIBITED_CONTENT":
    case "SPII":
      return "content-filter";
    case "FINISH_REASON_UNSPECIFIED":
    case "OTHER":
      return "other";
    case "MALFORMED_FUNCTION_CALL":
      return "error";
    default:
      return "unknown";
  }
}

// src/google-generative-ai-language-model.ts
var GoogleGenerativeAILanguageModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    var _a;
    this.modelId = modelId;
    this.config = config;
    this.generateId = (_a = config.generateId) != null ? _a : generateId$4;
  }
  get provider() {
    return this.config.provider;
  }
  get supportedUrls() {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.config).supportedUrls) == null ? void 0 : _b.call(_a)) != null ? _c : {};
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    tools,
    toolChoice,
    providerOptions
  }) {
    var _a, _b;
    const warnings = [];
    const googleOptions = await parseProviderOptions$3({
      provider: "google",
      providerOptions,
      schema: googleGenerativeAIProviderOptions
    });
    if (((_a = googleOptions == null ? void 0 : googleOptions.thinkingConfig) == null ? void 0 : _a.includeThoughts) === true && !this.config.provider.startsWith("google.vertex.")) {
      warnings.push({
        type: "other",
        message: `The 'includeThoughts' option is only supported with the Google Vertex provider and might not be supported or could behave unexpectedly with the current Google provider (${this.config.provider}).`
      });
    }
    const isGemmaModel = this.modelId.toLowerCase().startsWith("gemma-");
    const { contents, systemInstruction } = convertToGoogleGenerativeAIMessages(
      prompt,
      { isGemmaModel }
    );
    const {
      tools: googleTools2,
      toolConfig: googleToolConfig,
      toolWarnings
    } = prepareTools$2({
      tools,
      toolChoice,
      modelId: this.modelId
    });
    return {
      args: {
        generationConfig: {
          // standardized settings:
          maxOutputTokens,
          temperature,
          topK,
          topP,
          frequencyPenalty,
          presencePenalty,
          stopSequences,
          seed,
          // response format:
          responseMimeType: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? "application/json" : void 0,
          responseSchema: (responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && // Google GenAI does not support all OpenAPI Schema features,
          // so this is needed as an escape hatch:
          // TODO convert into provider option
          ((_b = googleOptions == null ? void 0 : googleOptions.structuredOutputs) != null ? _b : true) ? convertJSONSchemaToOpenAPISchema(responseFormat.schema) : void 0,
          ...(googleOptions == null ? void 0 : googleOptions.audioTimestamp) && {
            audioTimestamp: googleOptions.audioTimestamp
          },
          // provider options:
          responseModalities: googleOptions == null ? void 0 : googleOptions.responseModalities,
          thinkingConfig: googleOptions == null ? void 0 : googleOptions.thinkingConfig,
          ...(googleOptions == null ? void 0 : googleOptions.imageConfig) && {
            imageConfig: googleOptions.imageConfig
          },
          ...(googleOptions == null ? void 0 : googleOptions.mediaResolution) && {
            mediaResolution: googleOptions.mediaResolution
          }
        },
        contents,
        systemInstruction: isGemmaModel ? void 0 : systemInstruction,
        safetySettings: googleOptions == null ? void 0 : googleOptions.safetySettings,
        tools: googleTools2,
        toolConfig: googleToolConfig,
        cachedContent: googleOptions == null ? void 0 : googleOptions.cachedContent,
        labels: googleOptions == null ? void 0 : googleOptions.labels
      },
      warnings: [...warnings, ...toolWarnings]
    };
  }
  async doGenerate(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    const { args, warnings } = await this.getArgs(options);
    const body = JSON.stringify(args);
    const mergedHeaders = combineHeaders$5(
      await resolve(this.config.headers),
      options.headers
    );
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi$5({
      url: `${this.config.baseURL}/${getModelPath(
        this.modelId
      )}:generateContent`,
      headers: mergedHeaders,
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$5(responseSchema),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const candidate = response.candidates[0];
    const content = [];
    const parts = (_b = (_a = candidate.content) == null ? void 0 : _a.parts) != null ? _b : [];
    const usageMetadata = response.usageMetadata;
    let lastCodeExecutionToolCallId;
    for (const part of parts) {
      if ("executableCode" in part && ((_c = part.executableCode) == null ? void 0 : _c.code)) {
        const toolCallId = this.config.generateId();
        lastCodeExecutionToolCallId = toolCallId;
        content.push({
          type: "tool-call",
          toolCallId,
          toolName: "code_execution",
          input: JSON.stringify(part.executableCode),
          providerExecuted: true
        });
      } else if ("codeExecutionResult" in part && part.codeExecutionResult) {
        content.push({
          type: "tool-result",
          // Assumes a result directly follows its corresponding call part.
          toolCallId: lastCodeExecutionToolCallId,
          toolName: "code_execution",
          result: {
            outcome: part.codeExecutionResult.outcome,
            output: part.codeExecutionResult.output
          },
          providerExecuted: true
        });
        lastCodeExecutionToolCallId = void 0;
      } else if ("text" in part && part.text != null && part.text.length > 0) {
        content.push({
          type: part.thought === true ? "reasoning" : "text",
          text: part.text,
          providerMetadata: part.thoughtSignature ? { google: { thoughtSignature: part.thoughtSignature } } : void 0
        });
      } else if ("functionCall" in part) {
        content.push({
          type: "tool-call",
          toolCallId: this.config.generateId(),
          toolName: part.functionCall.name,
          input: JSON.stringify(part.functionCall.args),
          providerMetadata: part.thoughtSignature ? { google: { thoughtSignature: part.thoughtSignature } } : void 0
        });
      } else if ("inlineData" in part) {
        content.push({
          type: "file",
          data: part.inlineData.data,
          mediaType: part.inlineData.mimeType
        });
      }
    }
    const sources = (_d = extractSources({
      groundingMetadata: candidate.groundingMetadata,
      generateId: this.config.generateId
    })) != null ? _d : [];
    for (const source of sources) {
      content.push(source);
    }
    return {
      content,
      finishReason: mapGoogleGenerativeAIFinishReason({
        finishReason: candidate.finishReason,
        hasToolCalls: content.some((part) => part.type === "tool-call")
      }),
      usage: {
        inputTokens: (_e = usageMetadata == null ? void 0 : usageMetadata.promptTokenCount) != null ? _e : void 0,
        outputTokens: (_f = usageMetadata == null ? void 0 : usageMetadata.candidatesTokenCount) != null ? _f : void 0,
        totalTokens: (_g = usageMetadata == null ? void 0 : usageMetadata.totalTokenCount) != null ? _g : void 0,
        reasoningTokens: (_h = usageMetadata == null ? void 0 : usageMetadata.thoughtsTokenCount) != null ? _h : void 0,
        cachedInputTokens: (_i = usageMetadata == null ? void 0 : usageMetadata.cachedContentTokenCount) != null ? _i : void 0
      },
      warnings,
      providerMetadata: {
        google: {
          promptFeedback: (_j = response.promptFeedback) != null ? _j : null,
          groundingMetadata: (_k = candidate.groundingMetadata) != null ? _k : null,
          urlContextMetadata: (_l = candidate.urlContextMetadata) != null ? _l : null,
          safetyRatings: (_m = candidate.safetyRatings) != null ? _m : null,
          usageMetadata: usageMetadata != null ? usageMetadata : null
        }
      },
      request: { body },
      response: {
        // TODO timestamp, model id, id
        headers: responseHeaders,
        body: rawResponse
      }
    };
  }
  async doStream(options) {
    const { args, warnings } = await this.getArgs(options);
    const body = JSON.stringify(args);
    const headers = combineHeaders$5(
      await resolve(this.config.headers),
      options.headers
    );
    const { responseHeaders, value: response } = await postJsonToApi$5({
      url: `${this.config.baseURL}/${getModelPath(
        this.modelId
      )}:streamGenerateContent?alt=sse`,
      headers,
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler$4(chunkSchema),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    let finishReason = "unknown";
    const usage = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    let providerMetadata = void 0;
    const generateId3 = this.config.generateId;
    let hasToolCalls = false;
    let currentTextBlockId = null;
    let currentReasoningBlockId = null;
    let blockCounter = 0;
    const emittedSourceUrls = /* @__PURE__ */ new Set();
    let lastCodeExecutionToolCallId;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            const usageMetadata = value.usageMetadata;
            if (usageMetadata != null) {
              usage.inputTokens = (_a = usageMetadata.promptTokenCount) != null ? _a : void 0;
              usage.outputTokens = (_b = usageMetadata.candidatesTokenCount) != null ? _b : void 0;
              usage.totalTokens = (_c = usageMetadata.totalTokenCount) != null ? _c : void 0;
              usage.reasoningTokens = (_d = usageMetadata.thoughtsTokenCount) != null ? _d : void 0;
              usage.cachedInputTokens = (_e = usageMetadata.cachedContentTokenCount) != null ? _e : void 0;
            }
            const candidate = (_f = value.candidates) == null ? void 0 : _f[0];
            if (candidate == null) {
              return;
            }
            const content = candidate.content;
            const sources = extractSources({
              groundingMetadata: candidate.groundingMetadata,
              generateId: generateId3
            });
            if (sources != null) {
              for (const source of sources) {
                if (source.sourceType === "url" && !emittedSourceUrls.has(source.url)) {
                  emittedSourceUrls.add(source.url);
                  controller.enqueue(source);
                }
              }
            }
            if (content != null) {
              const parts = (_g = content.parts) != null ? _g : [];
              for (const part of parts) {
                if ("executableCode" in part && ((_h = part.executableCode) == null ? void 0 : _h.code)) {
                  const toolCallId = generateId3();
                  lastCodeExecutionToolCallId = toolCallId;
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId,
                    toolName: "code_execution",
                    input: JSON.stringify(part.executableCode),
                    providerExecuted: true
                  });
                  hasToolCalls = true;
                } else if ("codeExecutionResult" in part && part.codeExecutionResult) {
                  const toolCallId = lastCodeExecutionToolCallId;
                  if (toolCallId) {
                    controller.enqueue({
                      type: "tool-result",
                      toolCallId,
                      toolName: "code_execution",
                      result: {
                        outcome: part.codeExecutionResult.outcome,
                        output: part.codeExecutionResult.output
                      },
                      providerExecuted: true
                    });
                    lastCodeExecutionToolCallId = void 0;
                  }
                } else if ("text" in part && part.text != null && part.text.length > 0) {
                  if (part.thought === true) {
                    if (currentTextBlockId !== null) {
                      controller.enqueue({
                        type: "text-end",
                        id: currentTextBlockId
                      });
                      currentTextBlockId = null;
                    }
                    if (currentReasoningBlockId === null) {
                      currentReasoningBlockId = String(blockCounter++);
                      controller.enqueue({
                        type: "reasoning-start",
                        id: currentReasoningBlockId,
                        providerMetadata: part.thoughtSignature ? {
                          google: {
                            thoughtSignature: part.thoughtSignature
                          }
                        } : void 0
                      });
                    }
                    controller.enqueue({
                      type: "reasoning-delta",
                      id: currentReasoningBlockId,
                      delta: part.text,
                      providerMetadata: part.thoughtSignature ? {
                        google: { thoughtSignature: part.thoughtSignature }
                      } : void 0
                    });
                  } else {
                    if (currentReasoningBlockId !== null) {
                      controller.enqueue({
                        type: "reasoning-end",
                        id: currentReasoningBlockId
                      });
                      currentReasoningBlockId = null;
                    }
                    if (currentTextBlockId === null) {
                      currentTextBlockId = String(blockCounter++);
                      controller.enqueue({
                        type: "text-start",
                        id: currentTextBlockId,
                        providerMetadata: part.thoughtSignature ? {
                          google: {
                            thoughtSignature: part.thoughtSignature
                          }
                        } : void 0
                      });
                    }
                    controller.enqueue({
                      type: "text-delta",
                      id: currentTextBlockId,
                      delta: part.text,
                      providerMetadata: part.thoughtSignature ? {
                        google: { thoughtSignature: part.thoughtSignature }
                      } : void 0
                    });
                  }
                }
              }
              const inlineDataParts = getInlineDataParts(content.parts);
              if (inlineDataParts != null) {
                for (const part of inlineDataParts) {
                  controller.enqueue({
                    type: "file",
                    mediaType: part.inlineData.mimeType,
                    data: part.inlineData.data
                  });
                }
              }
              const toolCallDeltas = getToolCallsFromParts({
                parts: content.parts,
                generateId: generateId3
              });
              if (toolCallDeltas != null) {
                for (const toolCall of toolCallDeltas) {
                  controller.enqueue({
                    type: "tool-input-start",
                    id: toolCall.toolCallId,
                    toolName: toolCall.toolName,
                    providerMetadata: toolCall.providerMetadata
                  });
                  controller.enqueue({
                    type: "tool-input-delta",
                    id: toolCall.toolCallId,
                    delta: toolCall.args,
                    providerMetadata: toolCall.providerMetadata
                  });
                  controller.enqueue({
                    type: "tool-input-end",
                    id: toolCall.toolCallId,
                    providerMetadata: toolCall.providerMetadata
                  });
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId: toolCall.toolCallId,
                    toolName: toolCall.toolName,
                    input: toolCall.args,
                    providerMetadata: toolCall.providerMetadata
                  });
                  hasToolCalls = true;
                }
              }
            }
            if (candidate.finishReason != null) {
              finishReason = mapGoogleGenerativeAIFinishReason({
                finishReason: candidate.finishReason,
                hasToolCalls
              });
              providerMetadata = {
                google: {
                  promptFeedback: (_i = value.promptFeedback) != null ? _i : null,
                  groundingMetadata: (_j = candidate.groundingMetadata) != null ? _j : null,
                  urlContextMetadata: (_k = candidate.urlContextMetadata) != null ? _k : null,
                  safetyRatings: (_l = candidate.safetyRatings) != null ? _l : null
                }
              };
              if (usageMetadata != null) {
                providerMetadata.google.usageMetadata = usageMetadata;
              }
            }
          },
          flush(controller) {
            if (currentTextBlockId !== null) {
              controller.enqueue({
                type: "text-end",
                id: currentTextBlockId
              });
            }
            if (currentReasoningBlockId !== null) {
              controller.enqueue({
                type: "reasoning-end",
                id: currentReasoningBlockId
              });
            }
            controller.enqueue({
              type: "finish",
              finishReason,
              usage,
              providerMetadata
            });
          }
        })
      ),
      response: { headers: responseHeaders },
      request: { body }
    };
  }
};
function getToolCallsFromParts({
  parts,
  generateId: generateId3
}) {
  const functionCallParts = parts == null ? void 0 : parts.filter(
    (part) => "functionCall" in part
  );
  return functionCallParts == null || functionCallParts.length === 0 ? void 0 : functionCallParts.map((part) => ({
    type: "tool-call",
    toolCallId: generateId3(),
    toolName: part.functionCall.name,
    args: JSON.stringify(part.functionCall.args),
    providerMetadata: part.thoughtSignature ? { google: { thoughtSignature: part.thoughtSignature } } : void 0
  }));
}
function getInlineDataParts(parts) {
  return parts == null ? void 0 : parts.filter(
    (part) => "inlineData" in part
  );
}
function extractSources({
  groundingMetadata,
  generateId: generateId3
}) {
  var _a;
  return (_a = groundingMetadata == null ? void 0 : groundingMetadata.groundingChunks) == null ? void 0 : _a.filter(
    (chunk) => chunk.web != null
  ).map((chunk) => ({
    type: "source",
    sourceType: "url",
    id: generateId3(),
    url: chunk.web.uri,
    title: chunk.web.title
  }));
}
var getGroundingMetadataSchema = () => object({
  webSearchQueries: array(string()).nullish(),
  retrievalQueries: array(string()).nullish(),
  searchEntryPoint: object({ renderedContent: string() }).nullish(),
  groundingChunks: array(
    object({
      web: object({ uri: string(), title: string() }).nullish(),
      retrievedContext: object({ uri: string(), title: string() }).nullish()
    })
  ).nullish(),
  groundingSupports: array(
    object({
      segment: object({
        startIndex: number().nullish(),
        endIndex: number().nullish(),
        text: string().nullish()
      }),
      segment_text: string().nullish(),
      groundingChunkIndices: array(number()).nullish(),
      supportChunkIndices: array(number()).nullish(),
      confidenceScores: array(number()).nullish(),
      confidenceScore: array(number()).nullish()
    })
  ).nullish(),
  retrievalMetadata: union([
    object({
      webDynamicRetrievalScore: number()
    }),
    object({})
  ]).nullish()
});
var getContentSchema = () => object({
  parts: array(
    union([
      // note: order matters since text can be fully empty
      object({
        functionCall: object({
          name: string(),
          args: unknown()
        }),
        thoughtSignature: string().nullish()
      }),
      object({
        inlineData: object({
          mimeType: string(),
          data: string()
        })
      }),
      object({
        executableCode: object({
          language: string(),
          code: string()
        }).nullish(),
        codeExecutionResult: object({
          outcome: string(),
          output: string()
        }).nullish(),
        text: string().nullish(),
        thought: boolean().nullish(),
        thoughtSignature: string().nullish()
      })
    ])
  ).nullish()
});
var getSafetyRatingSchema = () => object({
  category: string().nullish(),
  probability: string().nullish(),
  probabilityScore: number().nullish(),
  severity: string().nullish(),
  severityScore: number().nullish(),
  blocked: boolean().nullish()
});
var usageSchema$2 = object({
  cachedContentTokenCount: number().nullish(),
  thoughtsTokenCount: number().nullish(),
  promptTokenCount: number().nullish(),
  candidatesTokenCount: number().nullish(),
  totalTokenCount: number().nullish()
});
var getUrlContextMetadataSchema = () => object({
  urlMetadata: array(
    object({
      retrievedUrl: string(),
      urlRetrievalStatus: string()
    })
  )
});
var responseSchema = lazySchema$1(
  () => zodSchema$1(
    object({
      candidates: array(
        object({
          content: getContentSchema().nullish().or(object({}).strict()),
          finishReason: string().nullish(),
          safetyRatings: array(getSafetyRatingSchema()).nullish(),
          groundingMetadata: getGroundingMetadataSchema().nullish(),
          urlContextMetadata: getUrlContextMetadataSchema().nullish()
        })
      ),
      usageMetadata: usageSchema$2.nullish(),
      promptFeedback: object({
        blockReason: string().nullish(),
        safetyRatings: array(getSafetyRatingSchema()).nullish()
      }).nullish()
    })
  )
);
var chunkSchema = lazySchema$1(
  () => zodSchema$1(
    object({
      candidates: array(
        object({
          content: getContentSchema().nullish(),
          finishReason: string().nullish(),
          safetyRatings: array(getSafetyRatingSchema()).nullish(),
          groundingMetadata: getGroundingMetadataSchema().nullish(),
          urlContextMetadata: getUrlContextMetadataSchema().nullish()
        })
      ).nullish(),
      usageMetadata: usageSchema$2.nullish(),
      promptFeedback: object({
        blockReason: string().nullish(),
        safetyRatings: array(getSafetyRatingSchema()).nullish()
      }).nullish()
    })
  )
);
var codeExecution = createProviderDefinedToolFactoryWithOutputSchema$1({
  id: "google.code_execution",
  name: "code_execution",
  inputSchema: object({
    language: string().describe("The programming language of the code."),
    code: string().describe("The code to be executed.")
  }),
  outputSchema: object({
    outcome: string().describe('The outcome of the execution (e.g., "OUTCOME_OK").'),
    output: string().describe("The output from the code execution.")
  })
});
var googleSearch = createProviderDefinedToolFactory({
  id: "google.google_search",
  name: "google_search",
  inputSchema: lazySchema$1(
    () => zodSchema$1(
      object({
        mode: _enum(["MODE_DYNAMIC", "MODE_UNSPECIFIED"]).default("MODE_UNSPECIFIED"),
        dynamicThreshold: number().default(1)
      })
    )
  )
});
var urlContext = createProviderDefinedToolFactory({
  id: "google.url_context",
  name: "url_context",
  inputSchema: lazySchema$1(() => zodSchema$1(object({})))
});

// src/google-tools.ts
var googleTools = {
  /**
   * Creates a Google search tool that gives Google direct access to real-time web content.
   * Must have name "google_search".
   */
  googleSearch,
  /**
   * Creates a URL context tool that gives Google direct access to real-time web content.
   * Must have name "url_context".
   */
  urlContext,
  /**
   * A tool that enables the model to generate and run Python code.
   * Must have name "code_execution".
   *
   * @note Ensure the selected model supports Code Execution.
   * Multi-tool usage with the code execution tool is typically compatible with Gemini >=2 models.
   *
   * @see https://ai.google.dev/gemini-api/docs/code-execution (Google AI)
   * @see https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/code-execution-api (Vertex AI)
   */
  codeExecution
};
var GoogleGenerativeAIImageModel = class {
  constructor(modelId, settings, config) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    this.specificationVersion = "v2";
  }
  get maxImagesPerCall() {
    var _a;
    return (_a = this.settings.maxImagesPerCall) != null ? _a : 4;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate(options) {
    var _a, _b, _c;
    const {
      prompt,
      n = 1,
      size = "1024x1024",
      aspectRatio = "1:1",
      seed,
      providerOptions,
      headers,
      abortSignal
    } = options;
    const warnings = [];
    if (size != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "size",
        details: "This model does not support the `size` option. Use `aspectRatio` instead."
      });
    }
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed",
        details: "This model does not support the `seed` option through this provider."
      });
    }
    const googleOptions = await parseProviderOptions$3({
      provider: "google",
      providerOptions,
      schema: googleImageProviderOptionsSchema
    });
    const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
    const parameters = {
      sampleCount: n
    };
    if (aspectRatio != null) {
      parameters.aspectRatio = aspectRatio;
    }
    if (googleOptions) {
      Object.assign(parameters, googleOptions);
    }
    const body = {
      instances: [{ prompt }],
      parameters
    };
    const { responseHeaders, value: response } = await postJsonToApi$5({
      url: `${this.config.baseURL}/models/${this.modelId}:predict`,
      headers: combineHeaders$5(await resolve(this.config.headers), headers),
      body,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$5(
        googleImageResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      images: response.predictions.map(
        (p) => p.bytesBase64Encoded
      ),
      warnings: warnings != null ? warnings : [],
      providerMetadata: {
        google: {
          images: response.predictions.map((prediction) => ({
            // Add any prediction-specific metadata here
          }))
        }
      },
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders
      }
    };
  }
};
var googleImageResponseSchema = lazySchema$1(
  () => zodSchema$1(
    object({
      predictions: array(object({ bytesBase64Encoded: string() })).default([])
    })
  )
);
var googleImageProviderOptionsSchema = lazySchema$1(
  () => zodSchema$1(
    object({
      personGeneration: _enum(["dont_allow", "allow_adult", "allow_all"]).nullish(),
      aspectRatio: _enum(["1:1", "3:4", "4:3", "9:16", "16:9"]).nullish()
    })
  )
);

// src/google-provider.ts
function createGoogleGenerativeAI(options = {}) {
  var _a;
  const baseURL = (_a = withoutTrailingSlash$4(options.baseURL)) != null ? _a : "https://generativelanguage.googleapis.com/v1beta";
  const getHeaders = () => withUserAgentSuffix$4(
    {
      "x-goog-api-key": loadApiKey$3({
        apiKey: options.apiKey,
        environmentVariableName: "GOOGLE_GENERATIVE_AI_API_KEY",
        description: "Google Generative AI"
      }),
      ...options.headers
    },
    `ai-sdk/google/${VERSION$7}`
  );
  const createChatModel = (modelId) => {
    var _a2;
    return new GoogleGenerativeAILanguageModel(modelId, {
      provider: "google.generative-ai",
      baseURL,
      headers: getHeaders,
      generateId: (_a2 = options.generateId) != null ? _a2 : generateId$4,
      supportedUrls: () => ({
        "*": [
          // Google Generative Language "files" endpoint
          // e.g. https://generativelanguage.googleapis.com/v1beta/files/...
          new RegExp(`^${baseURL}/files/.*$`),
          // YouTube URLs (public or unlisted videos)
          new RegExp(
            `^https://(?:www\\.)?youtube\\.com/watch\\?v=[\\w-]+(?:&[\\w=&.-]*)?$`
          ),
          new RegExp(`^https://youtu\\.be/[\\w-]+(?:\\?[\\w=&.-]*)?$`)
        ]
      }),
      fetch: options.fetch
    });
  };
  const createEmbeddingModel = (modelId) => new GoogleGenerativeAIEmbeddingModel(modelId, {
    provider: "google.generative-ai",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createImageModel = (modelId, settings = {}) => new GoogleGenerativeAIImageModel(modelId, settings, {
    provider: "google.generative-ai",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId) {
    if (new.target) {
      throw new Error(
        "The Google Generative AI model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.generativeAI = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.image = createImageModel;
  provider.imageModel = createImageModel;
  provider.tools = googleTools;
  return provider;
}
createGoogleGenerativeAI();

// src/errors/ai-sdk-error.ts
var marker$4 = "vercel.ai.error";
var symbol$4 = Symbol.for(marker$4);
var _a$4;
var _AISDKError$4 = class _AISDKError extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a$4] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker$4);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a$4 = symbol$4;
var AISDKError$4 = _AISDKError$4;

// src/errors/api-call-error.ts
var name$4 = "AI_APICallError";
var marker2$4 = `vercel.ai.error.${name$4}`;
var symbol2$4 = Symbol.for(marker2$4);
var _a2$4;
var APICallError$4 = class APICallError extends AISDKError$4 {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name: name$4, message, cause });
    this[_a2$4] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError$4.hasMarker(error, marker2$4);
  }
};
_a2$4 = symbol2$4;

// src/errors/empty-response-body-error.ts
var name2$3 = "AI_EmptyResponseBodyError";
var marker3$3 = `vercel.ai.error.${name2$3}`;
var symbol3$3 = Symbol.for(marker3$3);
var _a3$3;
var EmptyResponseBodyError$3 = class EmptyResponseBodyError extends AISDKError$4 {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2$3, message });
    this[_a3$3] = true;
  }
  static isInstance(error) {
    return AISDKError$4.hasMarker(error, marker3$3);
  }
};
_a3$3 = symbol3$3;

// src/errors/get-error-message.ts
function getErrorMessage$4(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// src/errors/invalid-argument-error.ts
var name3$4 = "AI_InvalidArgumentError";
var marker4$4 = `vercel.ai.error.${name3$4}`;
var symbol4$4 = Symbol.for(marker4$4);
var _a4$4;
var InvalidArgumentError$4 = class InvalidArgumentError extends AISDKError$4 {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3$4, message, cause });
    this[_a4$4] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError$4.hasMarker(error, marker4$4);
  }
};
_a4$4 = symbol4$4;

// src/errors/invalid-prompt-error.ts
var name4$2 = "AI_InvalidPromptError";
var marker5$2 = `vercel.ai.error.${name4$2}`;
var symbol5$2 = Symbol.for(marker5$2);
var _a5$2;
var InvalidPromptError$2 = class InvalidPromptError extends AISDKError$4 {
  constructor({
    prompt,
    message,
    cause
  }) {
    super({ name: name4$2, message: `Invalid prompt: ${message}`, cause });
    this[_a5$2] = true;
    this.prompt = prompt;
  }
  static isInstance(error) {
    return AISDKError$4.hasMarker(error, marker5$2);
  }
};
_a5$2 = symbol5$2;

// src/errors/invalid-response-data-error.ts
var name5$2 = "AI_InvalidResponseDataError";
var marker6$2 = `vercel.ai.error.${name5$2}`;
var symbol6$2 = Symbol.for(marker6$2);
var _a6$2;
var InvalidResponseDataError$2 = class InvalidResponseDataError extends AISDKError$4 {
  constructor({
    data,
    message = `Invalid response data: ${JSON.stringify(data)}.`
  }) {
    super({ name: name5$2, message });
    this[_a6$2] = true;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError$4.hasMarker(error, marker6$2);
  }
};
_a6$2 = symbol6$2;

// src/errors/json-parse-error.ts
var name6$4 = "AI_JSONParseError";
var marker7$4 = `vercel.ai.error.${name6$4}`;
var symbol7$4 = Symbol.for(marker7$4);
var _a7$4;
var JSONParseError$4 = class JSONParseError extends AISDKError$4 {
  constructor({ text, cause }) {
    super({
      name: name6$4,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage$4(cause)}`,
      cause
    });
    this[_a7$4] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError$4.hasMarker(error, marker7$4);
  }
};
_a7$4 = symbol7$4;

// src/errors/too-many-embedding-values-for-call-error.ts
var name11$1 = "AI_TooManyEmbeddingValuesForCallError";
var marker12$1 = `vercel.ai.error.${name11$1}`;
var symbol12$1 = Symbol.for(marker12$1);
var _a12$1;
var TooManyEmbeddingValuesForCallError$1 = class TooManyEmbeddingValuesForCallError extends AISDKError$4 {
  constructor(options) {
    super({
      name: name11$1,
      message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
    });
    this[_a12$1] = true;
    this.provider = options.provider;
    this.modelId = options.modelId;
    this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
    this.values = options.values;
  }
  static isInstance(error) {
    return AISDKError$4.hasMarker(error, marker12$1);
  }
};
_a12$1 = symbol12$1;

// src/errors/type-validation-error.ts
var name12$4 = "AI_TypeValidationError";
var marker13$4 = `vercel.ai.error.${name12$4}`;
var symbol13$4 = Symbol.for(marker13$4);
var _a13$4;
var _TypeValidationError$4 = class _TypeValidationError extends AISDKError$4 {
  constructor({ value, cause }) {
    super({
      name: name12$4,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage$4(cause)}`,
      cause
    });
    this[_a13$4] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError$4.hasMarker(error, marker13$4);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
  }
};
_a13$4 = symbol13$4;
var TypeValidationError$4 = _TypeValidationError$4;

// src/errors/unsupported-functionality-error.ts
var name13$3 = "AI_UnsupportedFunctionalityError";
var marker14$3 = `vercel.ai.error.${name13$3}`;
var symbol14$3 = Symbol.for(marker14$3);
var _a14$3;
var UnsupportedFunctionalityError$3 = class UnsupportedFunctionalityError extends AISDKError$4 {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13$3, message });
    this[_a14$3] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError$4.hasMarker(error, marker14$3);
  }
};
_a14$3 = symbol14$3;

// src/combine-headers.ts
function combineHeaders$4(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => ({
      ...combinedHeaders,
      ...currentHeaders != null ? currentHeaders : {}
    }),
    {}
  );
}

// src/extract-response-headers.ts
function extractResponseHeaders$4(response) {
  return Object.fromEntries([...response.headers]);
}
var createIdGenerator$4 = ({
  prefix,
  size = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = () => {
    const alphabetLength = alphabet.length;
    const chars = new Array(size);
    for (let i = 0; i < size; i++) {
      chars[i] = alphabet[Math.random() * alphabetLength | 0];
    }
    return chars.join("");
  };
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError$4({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return () => `${prefix}${separator}${generator()}`;
};
var generateId$3 = createIdGenerator$4();

// src/is-abort-error.ts
function isAbortError$4(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}

// src/handle-fetch-error.ts
var FETCH_FAILED_ERROR_MESSAGES$4 = ["fetch failed", "failed to fetch"];
function handleFetchError$4({
  error,
  url,
  requestBodyValues
}) {
  if (isAbortError$4(error)) {
    return error;
  }
  if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES$4.includes(error.message.toLowerCase())) {
    const cause = error.cause;
    if (cause != null) {
      return new APICallError$4({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true
        // retry when network error
      });
    }
  }
  return error;
}

// src/get-runtime-environment-user-agent.ts
function getRuntimeEnvironmentUserAgent$3(globalThisAny = globalThis) {
  var _a, _b, _c;
  if (globalThisAny.window) {
    return `runtime/browser`;
  }
  if ((_a = globalThisAny.navigator) == null ? void 0 : _a.userAgent) {
    return `runtime/${globalThisAny.navigator.userAgent.toLowerCase()}`;
  }
  if ((_c = (_b = globalThisAny.process) == null ? void 0 : _b.versions) == null ? void 0 : _c.node) {
    return `runtime/node.js/${globalThisAny.process.version.substring(0)}`;
  }
  if (globalThisAny.EdgeRuntime) {
    return `runtime/vercel-edge`;
  }
  return "runtime/unknown";
}

// src/remove-undefined-entries.ts
function removeUndefinedEntries$4(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}

// src/with-user-agent-suffix.ts
function withUserAgentSuffix$3(headers, ...userAgentSuffixParts) {
  const cleanedHeaders = removeUndefinedEntries$4(
    headers != null ? headers : {}
  );
  const normalizedHeaders = new Headers(cleanedHeaders);
  const currentUserAgentHeader = normalizedHeaders.get("user-agent") || "";
  normalizedHeaders.set(
    "user-agent",
    [currentUserAgentHeader, ...userAgentSuffixParts].filter(Boolean).join(" ")
  );
  return Object.fromEntries(normalizedHeaders);
}

// src/version.ts
var VERSION$6 = "3.0.12" ;

// src/secure-json-parse.ts
var suspectProtoRx$4 = /"__proto__"\s*:/;
var suspectConstructorRx$4 = /"constructor"\s*:/;
function _parse$4(text) {
  const obj = JSON.parse(text);
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (suspectProtoRx$4.test(text) === false && suspectConstructorRx$4.test(text) === false) {
    return obj;
  }
  return filter$4(obj);
}
function filter$4(obj) {
  let next = [obj];
  while (next.length) {
    const nodes = next;
    next = [];
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      if (Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      for (const key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          next.push(value);
        }
      }
    }
  }
  return obj;
}
function secureJsonParse$4(text) {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  try {
    return _parse$4(text);
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
  }
}
var validatorSymbol$4 = Symbol.for("vercel.ai.validator");
function validator$4(validate) {
  return { [validatorSymbol$4]: true, validate };
}
function isValidator$4(value) {
  return typeof value === "object" && value !== null && validatorSymbol$4 in value && value[validatorSymbol$4] === true && "validate" in value;
}
function asValidator$4(value) {
  return isValidator$4(value) ? value : typeof value === "function" ? value() : standardSchemaValidator$4(value);
}
function standardSchemaValidator$4(standardSchema) {
  return validator$4(async (value) => {
    const result = await standardSchema["~standard"].validate(value);
    return result.issues == null ? { success: true, value: result.value } : {
      success: false,
      error: new TypeValidationError$4({
        value,
        cause: result.issues
      })
    };
  });
}

// src/validate-types.ts
async function validateTypes$4({
  value,
  schema
}) {
  const result = await safeValidateTypes$4({ value, schema });
  if (!result.success) {
    throw TypeValidationError$4.wrap({ value, cause: result.error });
  }
  return result.value;
}
async function safeValidateTypes$4({
  value,
  schema
}) {
  const validator2 = asValidator$4(schema);
  try {
    if (validator2.validate == null) {
      return { success: true, value, rawValue: value };
    }
    const result = await validator2.validate(value);
    if (result.success) {
      return { success: true, value: result.value, rawValue: value };
    }
    return {
      success: false,
      error: TypeValidationError$4.wrap({ value, cause: result.error }),
      rawValue: value
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError$4.wrap({ value, cause: error }),
      rawValue: value
    };
  }
}

// src/parse-json.ts
async function parseJSON$4({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$4(text);
    if (schema == null) {
      return value;
    }
    return validateTypes$4({ value, schema });
  } catch (error) {
    if (JSONParseError$4.isInstance(error) || TypeValidationError$4.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError$4({ text, cause: error });
  }
}
async function safeParseJSON$4({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$4(text);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    return await safeValidateTypes$4({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: JSONParseError$4.isInstance(error) ? error : new JSONParseError$4({ text, cause: error }),
      rawValue: void 0
    };
  }
}
function isParsableJson$2(input) {
  try {
    secureJsonParse$4(input);
    return true;
  } catch (e) {
    return false;
  }
}
function parseJsonEventStream$3({
  stream,
  schema
}) {
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream$1()).pipeThrough(
    new TransformStream({
      async transform({ data }, controller) {
        if (data === "[DONE]") {
          return;
        }
        controller.enqueue(await safeParseJSON$4({ text: data, schema }));
      }
    })
  );
}
async function parseProviderOptions$2({
  provider,
  providerOptions,
  schema
}) {
  if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
    return void 0;
  }
  const parsedProviderOptions = await safeValidateTypes$4({
    value: providerOptions[provider],
    schema
  });
  if (!parsedProviderOptions.success) {
    throw new InvalidArgumentError$4({
      argument: "providerOptions",
      message: `invalid ${provider} provider options`,
      cause: parsedProviderOptions.error
    });
  }
  return parsedProviderOptions.value;
}
var getOriginalFetch2$4 = () => globalThis.fetch;
var postJsonToApi$4 = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
}) => postToApi$4({
  url,
  headers: {
    "Content-Type": "application/json",
    ...headers
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
});
var postToApi$4 = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch = getOriginalFetch2$4()
}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: withUserAgentSuffix$3(
        headers,
        `ai-sdk/provider-utils/${VERSION$6}`,
        getRuntimeEnvironmentUserAgent$3()
      ),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders$4(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError$4(error) || APICallError$4.isInstance(error)) {
          throw error;
        }
        throw new APICallError$4({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError$4(error) || APICallError$4.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError$4({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    throw handleFetchError$4({ error, url, requestBodyValues: body.values });
  }
};
var createJsonErrorResponseHandler$4 = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const responseHeaders = extractResponseHeaders$4(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError$4({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = await parseJSON$4({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError$4({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError$4({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
};
var createEventSourceResponseHandler$3 = (chunkSchema) => async ({ response }) => {
  const responseHeaders = extractResponseHeaders$4(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError$3({});
  }
  return {
    responseHeaders,
    value: parseJsonEventStream$3({
      stream: response.body,
      schema: chunkSchema
    })
  };
};
var createJsonResponseHandler$4 = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = await safeParseJSON$4({
    text: responseBody,
    schema: responseSchema
  });
  const responseHeaders = extractResponseHeaders$4(response);
  if (!parsedResult.success) {
    throw new APICallError$4({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
};
new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);

// src/uint8-utils.ts
var { btoa: btoa$3} = globalThis;
function convertUint8ArrayToBase64$3(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa$3(latin1string);
}
function convertToBase64$2(value) {
  return value instanceof Uint8Array ? convertUint8ArrayToBase64$3(value) : value;
}

// src/without-trailing-slash.ts
function withoutTrailingSlash$3(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}

// src/chat/openai-compatible-chat-language-model.ts
function getOpenAIMetadata(message) {
  var _a, _b;
  return (_b = (_a = message == null ? void 0 : message.providerOptions) == null ? void 0 : _a.openaiCompatible) != null ? _b : {};
}
function convertToOpenAICompatibleChatMessages(prompt) {
  const messages = [];
  for (const { role, content, ...message } of prompt) {
    const metadata = getOpenAIMetadata({ ...message });
    switch (role) {
      case "system": {
        messages.push({ role: "system", content, ...metadata });
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push({
            role: "user",
            content: content[0].text,
            ...getOpenAIMetadata(content[0])
          });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part) => {
            const partMetadata = getOpenAIMetadata(part);
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text, ...partMetadata };
              }
              case "file": {
                if (part.mediaType.startsWith("image/")) {
                  const mediaType = part.mediaType === "image/*" ? "image/jpeg" : part.mediaType;
                  return {
                    type: "image_url",
                    image_url: {
                      url: part.data instanceof URL ? part.data.toString() : `data:${mediaType};base64,${convertToBase64$2(part.data)}`
                    },
                    ...partMetadata
                  };
                } else {
                  throw new UnsupportedFunctionalityError$3({
                    functionality: `file part media type ${part.mediaType}`
                  });
                }
              }
            }
          }),
          ...metadata
        });
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          const partMetadata = getOpenAIMetadata(part);
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.input)
                },
                ...partMetadata
              });
              break;
            }
          }
        }
        messages.push({
          role: "assistant",
          content: text,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0,
          ...metadata
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          const output = toolResponse.output;
          let contentValue;
          switch (output.type) {
            case "text":
            case "error-text":
              contentValue = output.value;
              break;
            case "content":
            case "json":
            case "error-json":
              contentValue = JSON.stringify(output.value);
              break;
          }
          const toolResponseMetadata = getOpenAIMetadata(toolResponse);
          messages.push({
            role: "tool",
            tool_call_id: toolResponse.toolCallId,
            content: contentValue,
            ...toolResponseMetadata
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}

// src/chat/get-response-metadata.ts
function getResponseMetadata$2({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}

// src/chat/map-openai-compatible-finish-reason.ts
function mapOpenAICompatibleFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiCompatibleProviderOptions = object({
  /**
   * A unique identifier representing your end-user, which can help the provider to
   * monitor and detect abuse.
   */
  user: string().optional(),
  /**
   * Reasoning effort for reasoning models. Defaults to `medium`.
   */
  reasoningEffort: string().optional(),
  /**
   * Controls the verbosity of the generated text. Defaults to `medium`.
   */
  textVerbosity: string().optional()
});
var openaiCompatibleErrorDataSchema$1 = object({
  error: object({
    message: string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: string().nullish(),
    param: any().nullish(),
    code: union([string(), number()]).nullish()
  })
});
var defaultOpenAICompatibleErrorStructure$1 = {
  errorSchema: openaiCompatibleErrorDataSchema$1,
  errorToMessage: (data) => data.error.message
};
function prepareTools$1({
  tools,
  toolChoice
}) {
  tools = (tools == null ? void 0 : tools.length) ? tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, toolChoice: void 0, toolWarnings };
  }
  const openaiCompatTools = [];
  for (const tool of tools) {
    if (tool.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool });
    } else {
      openaiCompatTools.push({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema
        }
      });
    }
  }
  if (toolChoice == null) {
    return { tools: openaiCompatTools, toolChoice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiCompatTools, toolChoice: type, toolWarnings };
    case "tool":
      return {
        tools: openaiCompatTools,
        toolChoice: {
          type: "function",
          function: { name: toolChoice.toolName }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError$3({
        functionality: `tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}

// src/chat/openai-compatible-chat-language-model.ts
var OpenAICompatibleChatLanguageModel = class {
  // type inferred via constructor
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    var _a, _b;
    this.modelId = modelId;
    this.config = config;
    const errorStructure = (_a = config.errorStructure) != null ? _a : defaultOpenAICompatibleErrorStructure$1;
    this.chunkSchema = createOpenAICompatibleChatChunkSchema(
      errorStructure.errorSchema
    );
    this.failedResponseHandler = createJsonErrorResponseHandler$4(errorStructure);
    this.supportsStructuredOutputs = (_b = config.supportsStructuredOutputs) != null ? _b : false;
  }
  get provider() {
    return this.config.provider;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  get supportedUrls() {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.config).supportedUrls) == null ? void 0 : _b.call(_a)) != null ? _c : {};
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    providerOptions,
    stopSequences,
    responseFormat,
    seed,
    toolChoice,
    tools
  }) {
    var _a, _b, _c, _d;
    const warnings = [];
    const compatibleOptions = Object.assign(
      (_a = await parseProviderOptions$2({
        provider: "openai-compatible",
        providerOptions,
        schema: openaiCompatibleProviderOptions
      })) != null ? _a : {},
      (_b = await parseProviderOptions$2({
        provider: this.providerOptionsName,
        providerOptions,
        schema: openaiCompatibleProviderOptions
      })) != null ? _b : {}
    );
    if (topK != null) {
      warnings.push({ type: "unsupported-setting", setting: "topK" });
    }
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !this.supportsStructuredOutputs) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is only supported with structuredOutputs"
      });
    }
    const {
      tools: openaiTools,
      toolChoice: openaiToolChoice,
      toolWarnings
    } = prepareTools$1({
      tools,
      toolChoice
    });
    return {
      args: {
        // model id:
        model: this.modelId,
        // model specific settings:
        user: compatibleOptions.user,
        // standardized settings:
        max_tokens: maxOutputTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? this.supportsStructuredOutputs === true && responseFormat.schema != null ? {
          type: "json_schema",
          json_schema: {
            schema: responseFormat.schema,
            name: (_c = responseFormat.name) != null ? _c : "response",
            description: responseFormat.description
          }
        } : { type: "json_object" } : void 0,
        stop: stopSequences,
        seed,
        ...Object.fromEntries(
          Object.entries(
            (_d = providerOptions == null ? void 0 : providerOptions[this.providerOptionsName]) != null ? _d : {}
          ).filter(
            ([key]) => !Object.keys(openaiCompatibleProviderOptions.shape).includes(key)
          )
        ),
        reasoning_effort: compatibleOptions.reasoningEffort,
        verbosity: compatibleOptions.textVerbosity,
        // messages:
        messages: convertToOpenAICompatibleChatMessages(prompt),
        // tools:
        tools: openaiTools,
        tool_choice: openaiToolChoice
      },
      warnings: [...warnings, ...toolWarnings]
    };
  }
  async doGenerate(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
    const { args, warnings } = await this.getArgs({ ...options });
    const body = JSON.stringify(args);
    const {
      responseHeaders,
      value: responseBody,
      rawValue: rawResponse
    } = await postJsonToApi$4({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders$4(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: this.failedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$4(
        OpenAICompatibleChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const choice = responseBody.choices[0];
    const content = [];
    const text = choice.message.content;
    if (text != null && text.length > 0) {
      content.push({ type: "text", text });
    }
    const reasoning = (_a = choice.message.reasoning_content) != null ? _a : choice.message.reasoning;
    if (reasoning != null && reasoning.length > 0) {
      content.push({
        type: "reasoning",
        text: reasoning
      });
    }
    if (choice.message.tool_calls != null) {
      for (const toolCall of choice.message.tool_calls) {
        content.push({
          type: "tool-call",
          toolCallId: (_b = toolCall.id) != null ? _b : generateId$3(),
          toolName: toolCall.function.name,
          input: toolCall.function.arguments
        });
      }
    }
    const providerMetadata = {
      [this.providerOptionsName]: {},
      ...await ((_d = (_c = this.config.metadataExtractor) == null ? void 0 : _c.extractMetadata) == null ? void 0 : _d.call(_c, {
        parsedBody: rawResponse
      }))
    };
    const completionTokenDetails = (_e = responseBody.usage) == null ? void 0 : _e.completion_tokens_details;
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
      providerMetadata[this.providerOptionsName].acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
    }
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
      providerMetadata[this.providerOptionsName].rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
    }
    return {
      content,
      finishReason: mapOpenAICompatibleFinishReason(choice.finish_reason),
      usage: {
        inputTokens: (_g = (_f = responseBody.usage) == null ? void 0 : _f.prompt_tokens) != null ? _g : void 0,
        outputTokens: (_i = (_h = responseBody.usage) == null ? void 0 : _h.completion_tokens) != null ? _i : void 0,
        totalTokens: (_k = (_j = responseBody.usage) == null ? void 0 : _j.total_tokens) != null ? _k : void 0,
        reasoningTokens: (_n = (_m = (_l = responseBody.usage) == null ? void 0 : _l.completion_tokens_details) == null ? void 0 : _m.reasoning_tokens) != null ? _n : void 0,
        cachedInputTokens: (_q = (_p = (_o = responseBody.usage) == null ? void 0 : _o.prompt_tokens_details) == null ? void 0 : _p.cached_tokens) != null ? _q : void 0
      },
      providerMetadata,
      request: { body },
      response: {
        ...getResponseMetadata$2(responseBody),
        headers: responseHeaders,
        body: rawResponse
      },
      warnings
    };
  }
  async doStream(options) {
    var _a;
    const { args, warnings } = await this.getArgs({ ...options });
    const body = {
      ...args,
      stream: true,
      // only include stream_options when in strict compatibility mode:
      stream_options: this.config.includeUsage ? { include_usage: true } : void 0
    };
    const metadataExtractor = (_a = this.config.metadataExtractor) == null ? void 0 : _a.createStreamExtractor();
    const { responseHeaders, value: response } = await postJsonToApi$4({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders$4(this.config.headers(), options.headers),
      body,
      failedResponseHandler: this.failedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler$3(
        this.chunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const toolCalls = [];
    let finishReason = "unknown";
    const usage = {
      completionTokens: void 0,
      completionTokensDetails: {
        reasoningTokens: void 0,
        acceptedPredictionTokens: void 0,
        rejectedPredictionTokens: void 0
      },
      promptTokens: void 0,
      promptTokensDetails: {
        cachedTokens: void 0
      },
      totalTokens: void 0
    };
    let isFirstChunk = true;
    const providerOptionsName = this.providerOptionsName;
    let isActiveReasoning = false;
    let isActiveText = false;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          // TODO we lost type safety on Chunk, most likely due to the error schema. MUST FIX
          transform(chunk, controller) {
            var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            metadataExtractor == null ? void 0 : metadataExtractor.processChunk(chunk.rawValue);
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error.message });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata$2(value)
              });
            }
            if (value.usage != null) {
              const {
                prompt_tokens,
                completion_tokens,
                total_tokens,
                prompt_tokens_details,
                completion_tokens_details
              } = value.usage;
              usage.promptTokens = prompt_tokens != null ? prompt_tokens : void 0;
              usage.completionTokens = completion_tokens != null ? completion_tokens : void 0;
              usage.totalTokens = total_tokens != null ? total_tokens : void 0;
              if ((completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens) != null) {
                usage.completionTokensDetails.reasoningTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens;
              }
              if ((completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens) != null) {
                usage.completionTokensDetails.acceptedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens;
              }
              if ((completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens) != null) {
                usage.completionTokensDetails.rejectedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens;
              }
              if ((prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens) != null) {
                usage.promptTokensDetails.cachedTokens = prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens;
              }
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAICompatibleFinishReason(
                choice.finish_reason
              );
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            const reasoningContent = (_a2 = delta.reasoning_content) != null ? _a2 : delta.reasoning;
            if (reasoningContent) {
              if (!isActiveReasoning) {
                controller.enqueue({
                  type: "reasoning-start",
                  id: "reasoning-0"
                });
                isActiveReasoning = true;
              }
              controller.enqueue({
                type: "reasoning-delta",
                id: "reasoning-0",
                delta: reasoningContent
              });
            }
            if (delta.content) {
              if (!isActiveText) {
                controller.enqueue({ type: "text-start", id: "txt-0" });
                isActiveText = true;
              }
              controller.enqueue({
                type: "text-delta",
                id: "txt-0",
                delta: delta.content
              });
            }
            if (delta.tool_calls != null) {
              for (const toolCallDelta of delta.tool_calls) {
                const index = toolCallDelta.index;
                if (toolCalls[index] == null) {
                  if (toolCallDelta.id == null) {
                    throw new InvalidResponseDataError$2({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`
                    });
                  }
                  if (((_b = toolCallDelta.function) == null ? void 0 : _b.name) == null) {
                    throw new InvalidResponseDataError$2({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`
                    });
                  }
                  controller.enqueue({
                    type: "tool-input-start",
                    id: toolCallDelta.id,
                    toolName: toolCallDelta.function.name
                  });
                  toolCalls[index] = {
                    id: toolCallDelta.id,
                    type: "function",
                    function: {
                      name: toolCallDelta.function.name,
                      arguments: (_c = toolCallDelta.function.arguments) != null ? _c : ""
                    },
                    hasFinished: false
                  };
                  const toolCall2 = toolCalls[index];
                  if (((_d = toolCall2.function) == null ? void 0 : _d.name) != null && ((_e = toolCall2.function) == null ? void 0 : _e.arguments) != null) {
                    if (toolCall2.function.arguments.length > 0) {
                      controller.enqueue({
                        type: "tool-input-delta",
                        id: toolCall2.id,
                        delta: toolCall2.function.arguments
                      });
                    }
                    if (isParsableJson$2(toolCall2.function.arguments)) {
                      controller.enqueue({
                        type: "tool-input-end",
                        id: toolCall2.id
                      });
                      controller.enqueue({
                        type: "tool-call",
                        toolCallId: (_f = toolCall2.id) != null ? _f : generateId$3(),
                        toolName: toolCall2.function.name,
                        input: toolCall2.function.arguments
                      });
                      toolCall2.hasFinished = true;
                    }
                  }
                  continue;
                }
                const toolCall = toolCalls[index];
                if (toolCall.hasFinished) {
                  continue;
                }
                if (((_g = toolCallDelta.function) == null ? void 0 : _g.arguments) != null) {
                  toolCall.function.arguments += (_i = (_h = toolCallDelta.function) == null ? void 0 : _h.arguments) != null ? _i : "";
                }
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.id,
                  delta: (_j = toolCallDelta.function.arguments) != null ? _j : ""
                });
                if (((_k = toolCall.function) == null ? void 0 : _k.name) != null && ((_l = toolCall.function) == null ? void 0 : _l.arguments) != null && isParsableJson$2(toolCall.function.arguments)) {
                  controller.enqueue({
                    type: "tool-input-end",
                    id: toolCall.id
                  });
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId: (_m = toolCall.id) != null ? _m : generateId$3(),
                    toolName: toolCall.function.name,
                    input: toolCall.function.arguments
                  });
                  toolCall.hasFinished = true;
                }
              }
            }
          },
          flush(controller) {
            var _a2, _b, _c, _d, _e, _f;
            if (isActiveReasoning) {
              controller.enqueue({ type: "reasoning-end", id: "reasoning-0" });
            }
            if (isActiveText) {
              controller.enqueue({ type: "text-end", id: "txt-0" });
            }
            for (const toolCall of toolCalls.filter(
              (toolCall2) => !toolCall2.hasFinished
            )) {
              controller.enqueue({
                type: "tool-input-end",
                id: toolCall.id
              });
              controller.enqueue({
                type: "tool-call",
                toolCallId: (_a2 = toolCall.id) != null ? _a2 : generateId$3(),
                toolName: toolCall.function.name,
                input: toolCall.function.arguments
              });
            }
            const providerMetadata = {
              [providerOptionsName]: {},
              ...metadataExtractor == null ? void 0 : metadataExtractor.buildMetadata()
            };
            if (usage.completionTokensDetails.acceptedPredictionTokens != null) {
              providerMetadata[providerOptionsName].acceptedPredictionTokens = usage.completionTokensDetails.acceptedPredictionTokens;
            }
            if (usage.completionTokensDetails.rejectedPredictionTokens != null) {
              providerMetadata[providerOptionsName].rejectedPredictionTokens = usage.completionTokensDetails.rejectedPredictionTokens;
            }
            controller.enqueue({
              type: "finish",
              finishReason,
              usage: {
                inputTokens: (_b = usage.promptTokens) != null ? _b : void 0,
                outputTokens: (_c = usage.completionTokens) != null ? _c : void 0,
                totalTokens: (_d = usage.totalTokens) != null ? _d : void 0,
                reasoningTokens: (_e = usage.completionTokensDetails.reasoningTokens) != null ? _e : void 0,
                cachedInputTokens: (_f = usage.promptTokensDetails.cachedTokens) != null ? _f : void 0
              },
              providerMetadata
            });
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
  }
};
var openaiCompatibleTokenUsageSchema$1 = object({
  prompt_tokens: number().nullish(),
  completion_tokens: number().nullish(),
  total_tokens: number().nullish(),
  prompt_tokens_details: object({
    cached_tokens: number().nullish()
  }).nullish(),
  completion_tokens_details: object({
    reasoning_tokens: number().nullish(),
    accepted_prediction_tokens: number().nullish(),
    rejected_prediction_tokens: number().nullish()
  }).nullish()
}).nullish();
var OpenAICompatibleChatResponseSchema = object({
  id: string().nullish(),
  created: number().nullish(),
  model: string().nullish(),
  choices: array(
    object({
      message: object({
        role: literal("assistant").nullish(),
        content: string().nullish(),
        reasoning_content: string().nullish(),
        reasoning: string().nullish(),
        tool_calls: array(
          object({
            id: string().nullish(),
            function: object({
              name: string(),
              arguments: string()
            })
          })
        ).nullish()
      }),
      finish_reason: string().nullish()
    })
  ),
  usage: openaiCompatibleTokenUsageSchema$1
});
var createOpenAICompatibleChatChunkSchema = (errorSchema) => union([
  object({
    id: string().nullish(),
    created: number().nullish(),
    model: string().nullish(),
    choices: array(
      object({
        delta: object({
          role: _enum(["assistant"]).nullish(),
          content: string().nullish(),
          // Most openai-compatible models set `reasoning_content`, but some
          // providers serving `gpt-oss` set `reasoning`. See #7866
          reasoning_content: string().nullish(),
          reasoning: string().nullish(),
          tool_calls: array(
            object({
              index: number(),
              id: string().nullish(),
              function: object({
                name: string().nullish(),
                arguments: string().nullish()
              })
            })
          ).nullish()
        }).nullish(),
        finish_reason: string().nullish()
      })
    ),
    usage: openaiCompatibleTokenUsageSchema$1
  }),
  errorSchema
]);
function convertToOpenAICompatibleCompletionPrompt({
  prompt,
  user = "user",
  assistant = "assistant"
}) {
  let text = "";
  if (prompt[0].role === "system") {
    text += `${prompt[0].content}

`;
    prompt = prompt.slice(1);
  }
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError$2({
          message: "Unexpected system message in prompt: ${content}",
          prompt
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
          }
        }).filter(Boolean).join("");
        text += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new UnsupportedFunctionalityError$3({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError$3({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text += `${assistant}:
`;
  return {
    prompt: text,
    stopSequences: [`
${user}:`]
  };
}

// src/completion/get-response-metadata.ts
function getResponseMetadata2$1({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}

// src/completion/map-openai-compatible-finish-reason.ts
function mapOpenAICompatibleFinishReason2(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiCompatibleCompletionProviderOptions = object({
  /**
   * Echo back the prompt in addition to the completion.
   */
  echo: boolean().optional(),
  /**
   * Modify the likelihood of specified tokens appearing in the completion.
   *
   * Accepts a JSON object that maps tokens (specified by their token ID in
   * the GPT tokenizer) to an associated bias value from -100 to 100.
   */
  logitBias: record(string(), number()).optional(),
  /**
   * The suffix that comes after a completion of inserted text.
   */
  suffix: string().optional(),
  /**
   * A unique identifier representing your end-user, which can help providers to
   * monitor and detect abuse.
   */
  user: string().optional()
});

// src/completion/openai-compatible-completion-language-model.ts
var OpenAICompatibleCompletionLanguageModel = class {
  // type inferred via constructor
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    var _a;
    this.modelId = modelId;
    this.config = config;
    const errorStructure = (_a = config.errorStructure) != null ? _a : defaultOpenAICompatibleErrorStructure$1;
    this.chunkSchema = createOpenAICompatibleCompletionChunkSchema(
      errorStructure.errorSchema
    );
    this.failedResponseHandler = createJsonErrorResponseHandler$4(errorStructure);
  }
  get provider() {
    return this.config.provider;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  get supportedUrls() {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.config).supportedUrls) == null ? void 0 : _b.call(_a)) != null ? _c : {};
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    seed,
    providerOptions,
    tools,
    toolChoice
  }) {
    var _a;
    const warnings = [];
    const completionOptions = (_a = await parseProviderOptions$2({
      provider: this.providerOptionsName,
      providerOptions,
      schema: openaiCompatibleCompletionProviderOptions
    })) != null ? _a : {};
    if (topK != null) {
      warnings.push({ type: "unsupported-setting", setting: "topK" });
    }
    if (tools == null ? void 0 : tools.length) {
      warnings.push({ type: "unsupported-setting", setting: "tools" });
    }
    if (toolChoice != null) {
      warnings.push({ type: "unsupported-setting", setting: "toolChoice" });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompatibleCompletionPrompt({ prompt });
    const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
    return {
      args: {
        // model id:
        model: this.modelId,
        // model specific settings:
        echo: completionOptions.echo,
        logit_bias: completionOptions.logitBias,
        suffix: completionOptions.suffix,
        user: completionOptions.user,
        // standardized settings:
        max_tokens: maxOutputTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        seed,
        ...providerOptions == null ? void 0 : providerOptions[this.providerOptionsName],
        // prompt:
        prompt: completionPrompt,
        // stop sequences:
        stop: stop.length > 0 ? stop : void 0
      },
      warnings
    };
  }
  async doGenerate(options) {
    var _a, _b, _c, _d, _e, _f;
    const { args, warnings } = await this.getArgs(options);
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi$4({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders$4(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: this.failedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$4(
        openaiCompatibleCompletionResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const choice = response.choices[0];
    const content = [];
    if (choice.text != null && choice.text.length > 0) {
      content.push({ type: "text", text: choice.text });
    }
    return {
      content,
      usage: {
        inputTokens: (_b = (_a = response.usage) == null ? void 0 : _a.prompt_tokens) != null ? _b : void 0,
        outputTokens: (_d = (_c = response.usage) == null ? void 0 : _c.completion_tokens) != null ? _d : void 0,
        totalTokens: (_f = (_e = response.usage) == null ? void 0 : _e.total_tokens) != null ? _f : void 0
      },
      finishReason: mapOpenAICompatibleFinishReason2(choice.finish_reason),
      request: { body: args },
      response: {
        ...getResponseMetadata2$1(response),
        headers: responseHeaders,
        body: rawResponse
      },
      warnings
    };
  }
  async doStream(options) {
    const { args, warnings } = await this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      // only include stream_options when in strict compatibility mode:
      stream_options: this.config.includeUsage ? { include_usage: true } : void 0
    };
    const { responseHeaders, value: response } = await postJsonToApi$4({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders$4(this.config.headers(), options.headers),
      body,
      failedResponseHandler: this.failedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler$3(
        this.chunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    let finishReason = "unknown";
    const usage = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    let isFirstChunk = true;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            var _a, _b, _c;
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata2$1(value)
              });
              controller.enqueue({
                type: "text-start",
                id: "0"
              });
            }
            if (value.usage != null) {
              usage.inputTokens = (_a = value.usage.prompt_tokens) != null ? _a : void 0;
              usage.outputTokens = (_b = value.usage.completion_tokens) != null ? _b : void 0;
              usage.totalTokens = (_c = value.usage.total_tokens) != null ? _c : void 0;
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAICompatibleFinishReason2(
                choice.finish_reason
              );
            }
            if ((choice == null ? void 0 : choice.text) != null) {
              controller.enqueue({
                type: "text-delta",
                id: "0",
                delta: choice.text
              });
            }
          },
          flush(controller) {
            if (!isFirstChunk) {
              controller.enqueue({ type: "text-end", id: "0" });
            }
            controller.enqueue({
              type: "finish",
              finishReason,
              usage
            });
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
  }
};
var usageSchema$1 = object({
  prompt_tokens: number(),
  completion_tokens: number(),
  total_tokens: number()
});
var openaiCompatibleCompletionResponseSchema = object({
  id: string().nullish(),
  created: number().nullish(),
  model: string().nullish(),
  choices: array(
    object({
      text: string(),
      finish_reason: string()
    })
  ),
  usage: usageSchema$1.nullish()
});
var createOpenAICompatibleCompletionChunkSchema = (errorSchema) => union([
  object({
    id: string().nullish(),
    created: number().nullish(),
    model: string().nullish(),
    choices: array(
      object({
        text: string(),
        finish_reason: string().nullish(),
        index: number()
      })
    ),
    usage: usageSchema$1.nullish()
  }),
  errorSchema
]);
var openaiCompatibleEmbeddingProviderOptions = object({
  /**
   * The number of dimensions the resulting output embeddings should have.
   * Only supported in text-embedding-3 and later models.
   */
  dimensions: number().optional(),
  /**
   * A unique identifier representing your end-user, which can help providers to
   * monitor and detect abuse.
   */
  user: string().optional()
});

// src/embedding/openai-compatible-embedding-model.ts
var OpenAICompatibleEmbeddingModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    this.modelId = modelId;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a;
    return (_a = this.config.maxEmbeddingsPerCall) != null ? _a : 2048;
  }
  get supportsParallelCalls() {
    var _a;
    return (_a = this.config.supportsParallelCalls) != null ? _a : true;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  async doEmbed({
    values,
    headers,
    abortSignal,
    providerOptions
  }) {
    var _a, _b, _c;
    const compatibleOptions = Object.assign(
      (_a = await parseProviderOptions$2({
        provider: "openai-compatible",
        providerOptions,
        schema: openaiCompatibleEmbeddingProviderOptions
      })) != null ? _a : {},
      (_b = await parseProviderOptions$2({
        provider: this.providerOptionsName,
        providerOptions,
        schema: openaiCompatibleEmbeddingProviderOptions
      })) != null ? _b : {}
    );
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError$1({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const {
      responseHeaders,
      value: response,
      rawValue
    } = await postJsonToApi$4({
      url: this.config.url({
        path: "/embeddings",
        modelId: this.modelId
      }),
      headers: combineHeaders$4(this.config.headers(), headers),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: "float",
        dimensions: compatibleOptions.dimensions,
        user: compatibleOptions.user
      },
      failedResponseHandler: createJsonErrorResponseHandler$4(
        (_c = this.config.errorStructure) != null ? _c : defaultOpenAICompatibleErrorStructure$1
      ),
      successfulResponseHandler: createJsonResponseHandler$4(
        openaiTextEmbeddingResponseSchema$1
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
      providerMetadata: response.providerMetadata,
      response: { headers: responseHeaders, body: rawValue }
    };
  }
};
var openaiTextEmbeddingResponseSchema$1 = object({
  data: array(object({ embedding: array(number()) })),
  usage: object({ prompt_tokens: number() }).nullish(),
  providerMetadata: record(string(), record(string(), any())).optional()
});
var OpenAICompatibleImageModel$1 = class OpenAICompatibleImageModel {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v2";
    this.maxImagesPerCall = 10;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt,
    n,
    size,
    aspectRatio,
    seed,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a, _b, _c, _d, _e;
    const warnings = [];
    if (aspectRatio != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "aspectRatio",
        details: "This model does not support aspect ratio. Use `size` instead."
      });
    }
    if (seed != null) {
      warnings.push({ type: "unsupported-setting", setting: "seed" });
    }
    const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
    const { value: response, responseHeaders } = await postJsonToApi$4({
      url: this.config.url({
        path: "/images/generations",
        modelId: this.modelId
      }),
      headers: combineHeaders$4(this.config.headers(), headers),
      body: {
        model: this.modelId,
        prompt,
        n,
        size,
        ...(_d = providerOptions.openai) != null ? _d : {},
        response_format: "b64_json"
      },
      failedResponseHandler: createJsonErrorResponseHandler$4(
        (_e = this.config.errorStructure) != null ? _e : defaultOpenAICompatibleErrorStructure$1
      ),
      successfulResponseHandler: createJsonResponseHandler$4(
        openaiCompatibleImageResponseSchema$1
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      images: response.data.map((item) => item.b64_json),
      warnings,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders
      }
    };
  }
};
var openaiCompatibleImageResponseSchema$1 = object({
  data: array(object({ b64_json: string() }))
});

// src/version.ts
var VERSION$5 = "1.0.22" ;

// src/openai-compatible-provider.ts
function createOpenAICompatible(options) {
  const baseURL = withoutTrailingSlash$3(options.baseURL);
  const providerName = options.name;
  const headers = {
    ...options.apiKey && { Authorization: `Bearer ${options.apiKey}` },
    ...options.headers
  };
  const getHeaders = () => withUserAgentSuffix$3(headers, `ai-sdk/openai-compatible/${VERSION$5}`);
  const getCommonModelConfig = (modelType) => ({
    provider: `${providerName}.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`);
      if (options.queryParams) {
        url.search = new URLSearchParams(options.queryParams).toString();
      }
      return url.toString();
    },
    headers: getHeaders,
    fetch: options.fetch
  });
  const createLanguageModel = (modelId) => createChatModel(modelId);
  const createChatModel = (modelId) => new OpenAICompatibleChatLanguageModel(modelId, {
    ...getCommonModelConfig("chat"),
    includeUsage: options.includeUsage,
    supportsStructuredOutputs: options.supportsStructuredOutputs
  });
  const createCompletionModel = (modelId) => new OpenAICompatibleCompletionLanguageModel(modelId, {
    ...getCommonModelConfig("completion"),
    includeUsage: options.includeUsage
  });
  const createEmbeddingModel = (modelId) => new OpenAICompatibleEmbeddingModel(modelId, {
    ...getCommonModelConfig("embedding")
  });
  const createImageModel = (modelId) => new OpenAICompatibleImageModel$1(modelId, getCommonModelConfig("image"));
  const provider = (modelId) => createLanguageModel(modelId);
  provider.languageModel = createLanguageModel;
  provider.chatModel = createChatModel;
  provider.completionModel = createCompletionModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.imageModel = createImageModel;
  return provider;
}

// src/errors/ai-sdk-error.ts
var marker$3 = "vercel.ai.error";
var symbol$3 = Symbol.for(marker$3);
var _a$3;
var _AISDKError$3 = class _AISDKError extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a$3] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker$3);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a$3 = symbol$3;
var AISDKError$3 = _AISDKError$3;

// src/errors/api-call-error.ts
var name$3 = "AI_APICallError";
var marker2$3 = `vercel.ai.error.${name$3}`;
var symbol2$3 = Symbol.for(marker2$3);
var _a2$3;
var APICallError$3 = class APICallError extends AISDKError$3 {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name: name$3, message, cause });
    this[_a2$3] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker2$3);
  }
};
_a2$3 = symbol2$3;

// src/errors/empty-response-body-error.ts
var name2$2 = "AI_EmptyResponseBodyError";
var marker3$2 = `vercel.ai.error.${name2$2}`;
var symbol3$2 = Symbol.for(marker3$2);
var _a3$2;
var EmptyResponseBodyError$2 = class EmptyResponseBodyError extends AISDKError$3 {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2$2, message });
    this[_a3$2] = true;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker3$2);
  }
};
_a3$2 = symbol3$2;

// src/errors/get-error-message.ts
function getErrorMessage$3(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// src/errors/invalid-argument-error.ts
var name3$3 = "AI_InvalidArgumentError";
var marker4$3 = `vercel.ai.error.${name3$3}`;
var symbol4$3 = Symbol.for(marker4$3);
var _a4$3;
var InvalidArgumentError$3 = class InvalidArgumentError extends AISDKError$3 {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3$3, message, cause });
    this[_a4$3] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker4$3);
  }
};
_a4$3 = symbol4$3;

// src/errors/invalid-prompt-error.ts
var name4$1 = "AI_InvalidPromptError";
var marker5$1 = `vercel.ai.error.${name4$1}`;
var symbol5$1 = Symbol.for(marker5$1);
var _a5$1;
var InvalidPromptError$1 = class InvalidPromptError extends AISDKError$3 {
  constructor({
    prompt,
    message,
    cause
  }) {
    super({ name: name4$1, message: `Invalid prompt: ${message}`, cause });
    this[_a5$1] = true;
    this.prompt = prompt;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker5$1);
  }
};
_a5$1 = symbol5$1;

// src/errors/invalid-response-data-error.ts
var name5$1 = "AI_InvalidResponseDataError";
var marker6$1 = `vercel.ai.error.${name5$1}`;
var symbol6$1 = Symbol.for(marker6$1);
var _a6$1;
var InvalidResponseDataError$1 = class InvalidResponseDataError extends AISDKError$3 {
  constructor({
    data,
    message = `Invalid response data: ${JSON.stringify(data)}.`
  }) {
    super({ name: name5$1, message });
    this[_a6$1] = true;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker6$1);
  }
};
_a6$1 = symbol6$1;

// src/errors/json-parse-error.ts
var name6$3 = "AI_JSONParseError";
var marker7$3 = `vercel.ai.error.${name6$3}`;
var symbol7$3 = Symbol.for(marker7$3);
var _a7$3;
var JSONParseError$3 = class JSONParseError extends AISDKError$3 {
  constructor({ text, cause }) {
    super({
      name: name6$3,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage$3(cause)}`,
      cause
    });
    this[_a7$3] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker7$3);
  }
};
_a7$3 = symbol7$3;

// src/errors/load-api-key-error.ts
var name7$2 = "AI_LoadAPIKeyError";
var marker8$2 = `vercel.ai.error.${name7$2}`;
var symbol8$2 = Symbol.for(marker8$2);
var _a8$2;
var LoadAPIKeyError$2 = class LoadAPIKeyError extends AISDKError$3 {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7$2, message });
    this[_a8$2] = true;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker8$2);
  }
};
_a8$2 = symbol8$2;

// src/errors/too-many-embedding-values-for-call-error.ts
var name11 = "AI_TooManyEmbeddingValuesForCallError";
var marker12 = `vercel.ai.error.${name11}`;
var symbol12 = Symbol.for(marker12);
var _a12;
var TooManyEmbeddingValuesForCallError = class extends AISDKError$3 {
  constructor(options) {
    super({
      name: name11,
      message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
    });
    this[_a12] = true;
    this.provider = options.provider;
    this.modelId = options.modelId;
    this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
    this.values = options.values;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker12);
  }
};
_a12 = symbol12;

// src/errors/type-validation-error.ts
var name12$3 = "AI_TypeValidationError";
var marker13$3 = `vercel.ai.error.${name12$3}`;
var symbol13$3 = Symbol.for(marker13$3);
var _a13$3;
var _TypeValidationError$3 = class _TypeValidationError extends AISDKError$3 {
  constructor({ value, cause }) {
    super({
      name: name12$3,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage$3(cause)}`,
      cause
    });
    this[_a13$3] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker13$3);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
  }
};
_a13$3 = symbol13$3;
var TypeValidationError$3 = _TypeValidationError$3;

// src/errors/unsupported-functionality-error.ts
var name13$2 = "AI_UnsupportedFunctionalityError";
var marker14$2 = `vercel.ai.error.${name13$2}`;
var symbol14$2 = Symbol.for(marker14$2);
var _a14$2;
var UnsupportedFunctionalityError$2 = class UnsupportedFunctionalityError extends AISDKError$3 {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13$2, message });
    this[_a14$2] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError$3.hasMarker(error, marker14$2);
  }
};
_a14$2 = symbol14$2;

// src/combine-headers.ts
function combineHeaders$3(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => ({
      ...combinedHeaders,
      ...currentHeaders != null ? currentHeaders : {}
    }),
    {}
  );
}

// src/extract-response-headers.ts
function extractResponseHeaders$3(response) {
  return Object.fromEntries([...response.headers]);
}
var createIdGenerator$3 = ({
  prefix,
  size = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = () => {
    const alphabetLength = alphabet.length;
    const chars = new Array(size);
    for (let i = 0; i < size; i++) {
      chars[i] = alphabet[Math.random() * alphabetLength | 0];
    }
    return chars.join("");
  };
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError$3({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return () => `${prefix}${separator}${generator()}`;
};
var generateId$2 = createIdGenerator$3();

// src/is-abort-error.ts
function isAbortError$3(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}

// src/handle-fetch-error.ts
var FETCH_FAILED_ERROR_MESSAGES$3 = ["fetch failed", "failed to fetch"];
function handleFetchError$3({
  error,
  url,
  requestBodyValues
}) {
  if (isAbortError$3(error)) {
    return error;
  }
  if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES$3.includes(error.message.toLowerCase())) {
    const cause = error.cause;
    if (cause != null) {
      return new APICallError$3({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true
        // retry when network error
      });
    }
  }
  return error;
}

// src/get-runtime-environment-user-agent.ts
function getRuntimeEnvironmentUserAgent$2(globalThisAny = globalThis) {
  var _a, _b, _c;
  if (globalThisAny.window) {
    return `runtime/browser`;
  }
  if ((_a = globalThisAny.navigator) == null ? void 0 : _a.userAgent) {
    return `runtime/${globalThisAny.navigator.userAgent.toLowerCase()}`;
  }
  if ((_c = (_b = globalThisAny.process) == null ? void 0 : _b.versions) == null ? void 0 : _c.node) {
    return `runtime/node.js/${globalThisAny.process.version.substring(0)}`;
  }
  if (globalThisAny.EdgeRuntime) {
    return `runtime/vercel-edge`;
  }
  return "runtime/unknown";
}

// src/remove-undefined-entries.ts
function removeUndefinedEntries$3(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}

// src/with-user-agent-suffix.ts
function withUserAgentSuffix$2(headers, ...userAgentSuffixParts) {
  const cleanedHeaders = removeUndefinedEntries$3(
    headers != null ? headers : {}
  );
  const normalizedHeaders = new Headers(cleanedHeaders);
  const currentUserAgentHeader = normalizedHeaders.get("user-agent") || "";
  normalizedHeaders.set(
    "user-agent",
    [currentUserAgentHeader, ...userAgentSuffixParts].filter(Boolean).join(" ")
  );
  return Object.fromEntries(normalizedHeaders);
}

// src/version.ts
var VERSION$4 = "3.0.12" ;
function loadApiKey$2({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (typeof apiKey === "string") {
    return apiKey;
  }
  if (apiKey != null) {
    throw new LoadAPIKeyError$2({
      message: `${description} API key must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadAPIKeyError$2({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new LoadAPIKeyError$2({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof apiKey !== "string") {
    throw new LoadAPIKeyError$2({
      message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return apiKey;
}

// src/load-optional-setting.ts
function loadOptionalSetting({
  settingValue,
  environmentVariableName
}) {
  if (typeof settingValue === "string") {
    return settingValue;
  }
  if (settingValue != null || typeof process === "undefined") {
    return void 0;
  }
  settingValue = process.env[environmentVariableName];
  if (settingValue == null || typeof settingValue !== "string") {
    return void 0;
  }
  return settingValue;
}

// src/media-type-to-extension.ts
function mediaTypeToExtension(mediaType) {
  var _a;
  const [_type, subtype = ""] = mediaType.toLowerCase().split("/");
  return (_a = {
    mpeg: "mp3",
    "x-wav": "wav",
    opus: "ogg",
    mp4: "m4a",
    "x-m4a": "m4a"
  }[subtype]) != null ? _a : subtype;
}

// src/secure-json-parse.ts
var suspectProtoRx$3 = /"__proto__"\s*:/;
var suspectConstructorRx$3 = /"constructor"\s*:/;
function _parse$3(text) {
  const obj = JSON.parse(text);
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (suspectProtoRx$3.test(text) === false && suspectConstructorRx$3.test(text) === false) {
    return obj;
  }
  return filter$3(obj);
}
function filter$3(obj) {
  let next = [obj];
  while (next.length) {
    const nodes = next;
    next = [];
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      if (Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      for (const key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          next.push(value);
        }
      }
    }
  }
  return obj;
}
function secureJsonParse$3(text) {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  try {
    return _parse$3(text);
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
  }
}
var validatorSymbol$3 = Symbol.for("vercel.ai.validator");
function validator$3(validate) {
  return { [validatorSymbol$3]: true, validate };
}
function isValidator$3(value) {
  return typeof value === "object" && value !== null && validatorSymbol$3 in value && value[validatorSymbol$3] === true && "validate" in value;
}
function lazyValidator(createValidator) {
  let validator2;
  return () => {
    if (validator2 == null) {
      validator2 = createValidator();
    }
    return validator2;
  };
}
function asValidator$3(value) {
  return isValidator$3(value) ? value : typeof value === "function" ? value() : standardSchemaValidator$3(value);
}
function standardSchemaValidator$3(standardSchema) {
  return validator$3(async (value) => {
    const result = await standardSchema["~standard"].validate(value);
    return result.issues == null ? { success: true, value: result.value } : {
      success: false,
      error: new TypeValidationError$3({
        value,
        cause: result.issues
      })
    };
  });
}

// src/validate-types.ts
async function validateTypes$3({
  value,
  schema
}) {
  const result = await safeValidateTypes$3({ value, schema });
  if (!result.success) {
    throw TypeValidationError$3.wrap({ value, cause: result.error });
  }
  return result.value;
}
async function safeValidateTypes$3({
  value,
  schema
}) {
  const validator2 = asValidator$3(schema);
  try {
    if (validator2.validate == null) {
      return { success: true, value, rawValue: value };
    }
    const result = await validator2.validate(value);
    if (result.success) {
      return { success: true, value: result.value, rawValue: value };
    }
    return {
      success: false,
      error: TypeValidationError$3.wrap({ value, cause: result.error }),
      rawValue: value
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError$3.wrap({ value, cause: error }),
      rawValue: value
    };
  }
}

// src/parse-json.ts
async function parseJSON$3({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$3(text);
    if (schema == null) {
      return value;
    }
    return validateTypes$3({ value, schema });
  } catch (error) {
    if (JSONParseError$3.isInstance(error) || TypeValidationError$3.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError$3({ text, cause: error });
  }
}
async function safeParseJSON$3({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$3(text);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    return await safeValidateTypes$3({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: JSONParseError$3.isInstance(error) ? error : new JSONParseError$3({ text, cause: error }),
      rawValue: void 0
    };
  }
}
function isParsableJson$1(input) {
  try {
    secureJsonParse$3(input);
    return true;
  } catch (e) {
    return false;
  }
}
function parseJsonEventStream$2({
  stream,
  schema
}) {
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream$1()).pipeThrough(
    new TransformStream({
      async transform({ data }, controller) {
        if (data === "[DONE]") {
          return;
        }
        controller.enqueue(await safeParseJSON$3({ text: data, schema }));
      }
    })
  );
}
async function parseProviderOptions$1({
  provider,
  providerOptions,
  schema
}) {
  if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
    return void 0;
  }
  const parsedProviderOptions = await safeValidateTypes$3({
    value: providerOptions[provider],
    schema
  });
  if (!parsedProviderOptions.success) {
    throw new InvalidArgumentError$3({
      argument: "providerOptions",
      message: `invalid ${provider} provider options`,
      cause: parsedProviderOptions.error
    });
  }
  return parsedProviderOptions.value;
}
var getOriginalFetch2$3 = () => globalThis.fetch;
var postJsonToApi$3 = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
}) => postToApi$3({
  url,
  headers: {
    "Content-Type": "application/json",
    ...headers
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
});
var postFormDataToApi = async ({
  url,
  headers,
  formData,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
}) => postToApi$3({
  url,
  headers,
  body: {
    content: formData,
    values: Object.fromEntries(formData.entries())
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
});
var postToApi$3 = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch = getOriginalFetch2$3()
}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: withUserAgentSuffix$2(
        headers,
        `ai-sdk/provider-utils/${VERSION$4}`,
        getRuntimeEnvironmentUserAgent$2()
      ),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders$3(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError$3(error) || APICallError$3.isInstance(error)) {
          throw error;
        }
        throw new APICallError$3({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError$3(error) || APICallError$3.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError$3({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    throw handleFetchError$3({ error, url, requestBodyValues: body.values });
  }
};

// src/types/tool.ts
function tool(tool2) {
  return tool2;
}
function createProviderDefinedToolFactoryWithOutputSchema({
  id,
  name,
  inputSchema,
  outputSchema
}) {
  return ({
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool({
    type: "provider-defined",
    id,
    name,
    args,
    inputSchema,
    outputSchema,
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable
  });
}
var createJsonErrorResponseHandler$3 = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const responseHeaders = extractResponseHeaders$3(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError$3({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = await parseJSON$3({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError$3({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError$3({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
};
var createEventSourceResponseHandler$2 = (chunkSchema) => async ({ response }) => {
  const responseHeaders = extractResponseHeaders$3(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError$2({});
  }
  return {
    responseHeaders,
    value: parseJsonEventStream$2({
      stream: response.body,
      schema: chunkSchema
    })
  };
};
var createJsonResponseHandler$3 = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = await safeParseJSON$3({
    text: responseBody,
    schema: responseSchema
  });
  const responseHeaders = extractResponseHeaders$3(response);
  if (!parsedResult.success) {
    throw new APICallError$3({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
};
var createBinaryResponseHandler = () => async ({ response, url, requestBodyValues }) => {
  const responseHeaders = extractResponseHeaders$3(response);
  if (!response.body) {
    throw new APICallError$3({
      message: "Response body is empty",
      url,
      requestBodyValues,
      statusCode: response.status,
      responseHeaders,
      responseBody: void 0
    });
  }
  try {
    const buffer = await response.arrayBuffer();
    return {
      responseHeaders,
      value: new Uint8Array(buffer)
    };
  } catch (error) {
    throw new APICallError$3({
      message: "Failed to read response as array buffer",
      url,
      requestBodyValues,
      statusCode: response.status,
      responseHeaders,
      responseBody: void 0,
      cause: error
    });
  }
};

// src/zod-to-json-schema/get-relative-path.ts
var getRelativePath = (pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i]) break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};

// src/zod-to-json-schema/options.ts
var ignoreOverride = Symbol(
  "Let zodToJsonSchema decide on which parser to use"
);
var defaultOptions = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: true,
  rejectedAdditionalProperties: false,
  definitionPath: "definitions",
  strictUnions: false,
  definitions: {},
  errorMessages: false,
  patternStrategy: "escape",
  applyRegexFlags: false,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref"
};
var getDefaultOptions = (options) => typeof options === "string" ? {
  ...defaultOptions,
  name: options
} : {
  ...defaultOptions,
  ...options
};

// src/zod-to-json-schema/parsers/any.ts
function parseAnyDef() {
  return {};
}
function parseArrayDef(def, refs) {
  var _a, _b, _c;
  const res = {
    type: "array"
  };
  if (((_a = def.type) == null ? void 0 : _a._def) && ((_c = (_b = def.type) == null ? void 0 : _b._def) == null ? void 0 : _c.typeName) !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"]
    });
  }
  if (def.minLength) {
    res.minItems = def.minLength.value;
  }
  if (def.maxLength) {
    res.maxItems = def.maxLength.value;
  }
  if (def.exactLength) {
    res.minItems = def.exactLength.value;
    res.maxItems = def.exactLength.value;
  }
  return res;
}

// src/zod-to-json-schema/parsers/bigint.ts
function parseBigintDef(def) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}

// src/zod-to-json-schema/parsers/boolean.ts
function parseBooleanDef() {
  return { type: "boolean" };
}

// src/zod-to-json-schema/parsers/branded.ts
function parseBrandedDef(_def, refs) {
  return parseDef(_def.type._def, refs);
}

// src/zod-to-json-schema/parsers/catch.ts
var parseCatchDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};

// src/zod-to-json-schema/parsers/date.ts
function parseDateDef(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy != null ? overrideDateStrategy : refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item, i) => parseDateDef(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser(def);
  }
}
var integerDateParser = (def) => {
  const res = {
    type: "integer",
    format: "unix-time"
  };
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        res.minimum = check.value;
        break;
      case "max":
        res.maximum = check.value;
        break;
    }
  }
  return res;
};

// src/zod-to-json-schema/parsers/default.ts
function parseDefaultDef(_def, refs) {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue()
  };
}

// src/zod-to-json-schema/parsers/effects.ts
function parseEffectsDef(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : parseAnyDef();
}

// src/zod-to-json-schema/parsers/enum.ts
function parseEnumDef(def) {
  return {
    type: "string",
    enum: Array.from(def.values)
  };
}

// src/zod-to-json-schema/parsers/intersection.ts
var isJsonSchema7AllOfType = (type) => {
  if ("type" in type && type.type === "string") return false;
  return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
  const allOf = [
    parseDef(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"]
    }),
    parseDef(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"]
    })
  ].filter((x) => !!x);
  const mergedAllOf = [];
  allOf.forEach((schema) => {
    if (isJsonSchema7AllOfType(schema)) {
      mergedAllOf.push(...schema.allOf);
    } else {
      let nestedSchema = schema;
      if ("additionalProperties" in schema && schema.additionalProperties === false) {
        const { additionalProperties, ...rest } = schema;
        nestedSchema = rest;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? { allOf: mergedAllOf } : void 0;
}

// src/zod-to-json-schema/parsers/literal.ts
function parseLiteralDef(def) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}

// src/zod-to-json-schema/parsers/string.ts
var emojiRegex = void 0;
var zodPatterns = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: () => {
    if (emojiRegex === void 0) {
      emojiRegex = RegExp(
        "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
        "u"
      );
    }
    return emojiRegex;
  },
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef(def, refs) {
  const res = {
    type: "string"
  };
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          break;
        case "max":
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern(res, zodPatterns.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern(res, check.regex, check.message, refs);
          break;
        case "cuid":
          addPattern(res, zodPatterns.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern(res, zodPatterns.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern(
            res,
            RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`),
            check.message,
            refs
          );
          break;
        case "endsWith":
          addPattern(
            res,
            RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`),
            check.message,
            refs
          );
          break;
        case "datetime":
          addFormat(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat(res, "date", check.message, refs);
          break;
        case "time":
          addFormat(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat(res, "duration", check.message, refs);
          break;
        case "length":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "includes": {
          addPattern(
            res,
            RegExp(escapeLiteralCheckValue(check.value, refs)),
            check.message,
            refs
          );
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "base64url":
          addPattern(res, zodPatterns.base64url, check.message, refs);
          break;
        case "jwt":
          addPattern(res, zodPatterns.jwt, check.message, refs);
          break;
        case "cidr": {
          if (check.version !== "v6") {
            addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
          }
          if (check.version !== "v4") {
            addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern(res, zodPatterns.emoji(), check.message, refs);
          break;
        case "ulid": {
          addPattern(res, zodPatterns.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              res.contentEncoding = "base64";
              break;
            }
            case "pattern:zod": {
              addPattern(res, zodPatterns.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern(res, zodPatterns.nanoid, check.message, refs);
        }
      }
    }
  }
  return res;
}
function escapeLiteralCheckValue(literal, refs) {
  return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
var ALPHA_NUMERIC = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);
function escapeNonAlphaNumeric(source) {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    if (!ALPHA_NUMERIC.has(source[i])) {
      result += "\\";
    }
    result += source[i];
  }
  return result;
}
function addFormat(schema, value, message, refs) {
  var _a;
  if (schema.format || ((_a = schema.anyOf) == null ? void 0 : _a.some((x) => x.format))) {
    if (!schema.anyOf) {
      schema.anyOf = [];
    }
    if (schema.format) {
      schema.anyOf.push({
        format: schema.format
      });
      delete schema.format;
    }
    schema.anyOf.push({
      format: value,
      ...message && refs.errorMessages && { errorMessage: { format: message } }
    });
  } else {
    schema.format = value;
  }
}
function addPattern(schema, regex, message, refs) {
  var _a;
  if (schema.pattern || ((_a = schema.allOf) == null ? void 0 : _a.some((x) => x.pattern))) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push({
        pattern: schema.pattern
      });
      delete schema.pattern;
    }
    schema.allOf.push({
      pattern: stringifyRegExpWithFlags(regex, refs),
      ...message && refs.errorMessages && { errorMessage: { pattern: message } }
    });
  } else {
    schema.pattern = stringifyRegExpWithFlags(regex, refs);
  }
}
function stringifyRegExpWithFlags(regex, refs) {
  var _a;
  if (!refs.applyRegexFlags || !regex.flags) {
    return regex.source;
  }
  const flags = {
    i: regex.flags.includes("i"),
    // Case-insensitive
    m: regex.flags.includes("m"),
    // `^` and `$` matches adjacent to newline characters
    s: regex.flags.includes("s")
    // `.` matches newlines
  };
  const source = flags.i ? regex.source.toLowerCase() : regex.source;
  let pattern = "";
  let isEscaped = false;
  let inCharGroup = false;
  let inCharRange = false;
  for (let i = 0; i < source.length; i++) {
    if (isEscaped) {
      pattern += source[i];
      isEscaped = false;
      continue;
    }
    if (flags.i) {
      if (inCharGroup) {
        if (source[i].match(/[a-z]/)) {
          if (inCharRange) {
            pattern += source[i];
            pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
            inCharRange = false;
          } else if (source[i + 1] === "-" && ((_a = source[i + 2]) == null ? void 0 : _a.match(/[a-z]/))) {
            pattern += source[i];
            inCharRange = true;
          } else {
            pattern += `${source[i]}${source[i].toUpperCase()}`;
          }
          continue;
        }
      } else if (source[i].match(/[a-z]/)) {
        pattern += `[${source[i]}${source[i].toUpperCase()}]`;
        continue;
      }
    }
    if (flags.m) {
      if (source[i] === "^") {
        pattern += `(^|(?<=[\r
]))`;
        continue;
      } else if (source[i] === "$") {
        pattern += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (flags.s && source[i] === ".") {
      pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
      continue;
    }
    pattern += source[i];
    if (source[i] === "\\") {
      isEscaped = true;
    } else if (inCharGroup && source[i] === "]") {
      inCharGroup = false;
    } else if (!inCharGroup && source[i] === "[") {
      inCharGroup = true;
    }
  }
  return pattern;
}

// src/zod-to-json-schema/parsers/record.ts
function parseRecordDef(def, refs) {
  var _a, _b, _c, _d, _e, _f;
  const schema = {
    type: "object",
    additionalProperties: (_a = parseDef(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    })) != null ? _a : refs.allowedAdditionalProperties
  };
  if (((_b = def.keyType) == null ? void 0 : _b._def.typeName) === ZodFirstPartyTypeKind.ZodString && ((_c = def.keyType._def.checks) == null ? void 0 : _c.length)) {
    const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
    return {
      ...schema,
      propertyNames: keyType
    };
  } else if (((_d = def.keyType) == null ? void 0 : _d._def.typeName) === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      ...schema,
      propertyNames: {
        enum: def.keyType._def.values
      }
    };
  } else if (((_e = def.keyType) == null ? void 0 : _e._def.typeName) === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && ((_f = def.keyType._def.type._def.checks) == null ? void 0 : _f.length)) {
    const { type, ...keyType } = parseBrandedDef(
      def.keyType._def,
      refs
    );
    return {
      ...schema,
      propertyNames: keyType
    };
  }
  return schema;
}

// src/zod-to-json-schema/parsers/map.ts
function parseMapDef(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef(def, refs);
  }
  const keys = parseDef(def.keyType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "0"]
  }) || parseAnyDef();
  const values = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "1"]
  }) || parseAnyDef();
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}

// src/zod-to-json-schema/parsers/native-enum.ts
function parseNativeEnumDef(def) {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object[object[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object[key]);
  const parsedTypes = Array.from(
    new Set(actualValues.map((values) => typeof values))
  );
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}

// src/zod-to-json-schema/parsers/never.ts
function parseNeverDef() {
  return { not: parseAnyDef() };
}

// src/zod-to-json-schema/parsers/null.ts
function parseNullDef() {
  return {
    type: "null"
  };
}

// src/zod-to-json-schema/parsers/union.ts
var primitiveMappings = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef(def, refs) {
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every(
    (x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length)
  )) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce(
      (acc, x) => {
        const type = typeof x._def.value;
        switch (type) {
          case "string":
          case "number":
          case "boolean":
            return [...acc, type];
          case "bigint":
            return [...acc, "integer"];
          case "object":
            if (x._def.value === null) return [...acc, "null"];
          case "symbol":
          case "undefined":
          case "function":
          default:
            return acc;
        }
      },
      []
    );
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce(
          (acc, x) => {
            return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
          },
          []
        )
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce(
        (acc, x) => [
          ...acc,
          ...x._def.values.filter((x2) => !acc.includes(x2))
        ],
        []
      )
    };
  }
  return asAnyOf(def, refs);
}
var asAnyOf = (def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map(
    (x, i) => parseDef(x._def, {
      ...refs,
      currentPath: [...refs.currentPath, "anyOf", `${i}`]
    })
  ).filter(
    (x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0)
  );
  return anyOf.length ? { anyOf } : void 0;
};

// src/zod-to-json-schema/parsers/nullable.ts
function parseNullableDef(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
    def.innerType._def.typeName
  ) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    return {
      type: [
        primitiveMappings[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  const base = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"]
  });
  return base && { anyOf: [base, { type: "null" }] };
}

// src/zod-to-json-schema/parsers/number.ts
function parseNumberDef(def) {
  const res = {
    type: "number"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        break;
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}

// src/zod-to-json-schema/parsers/object.ts
function parseObjectDef(def, refs) {
  const result = {
    type: "object",
    properties: {}
  };
  const required = [];
  const shape = def.shape();
  for (const propName in shape) {
    let propDef = shape[propName];
    if (propDef === void 0 || propDef._def === void 0) {
      continue;
    }
    const propOptional = safeIsOptional(propDef);
    const parsedDef = parseDef(propDef._def, {
      ...refs,
      currentPath: [...refs.currentPath, "properties", propName],
      propertyPath: [...refs.currentPath, "properties", propName]
    });
    if (parsedDef === void 0) {
      continue;
    }
    result.properties[propName] = parsedDef;
    if (!propOptional) {
      required.push(propName);
    }
  }
  if (required.length) {
    result.required = required;
  }
  const additionalProperties = decideAdditionalProperties(def, refs);
  if (additionalProperties !== void 0) {
    result.additionalProperties = additionalProperties;
  }
  return result;
}
function decideAdditionalProperties(def, refs) {
  if (def.catchall._def.typeName !== "ZodNever") {
    return parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    });
  }
  switch (def.unknownKeys) {
    case "passthrough":
      return refs.allowedAdditionalProperties;
    case "strict":
      return refs.rejectedAdditionalProperties;
    case "strip":
      return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
  }
}
function safeIsOptional(schema) {
  try {
    return schema.isOptional();
  } catch (e) {
    return true;
  }
}

// src/zod-to-json-schema/parsers/optional.ts
var parseOptionalDef = (def, refs) => {
  var _a;
  if (refs.currentPath.toString() === ((_a = refs.propertyPath) == null ? void 0 : _a.toString())) {
    return parseDef(def.innerType._def, refs);
  }
  const innerSchema = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "1"]
  });
  return innerSchema ? { anyOf: [{ not: parseAnyDef() }, innerSchema] } : parseAnyDef();
};

// src/zod-to-json-schema/parsers/pipeline.ts
var parsePipelineDef = (def, refs) => {
  if (refs.pipeStrategy === "input") {
    return parseDef(def.in._def, refs);
  } else if (refs.pipeStrategy === "output") {
    return parseDef(def.out._def, refs);
  }
  const a = parseDef(def.in._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", "0"]
  });
  const b = parseDef(def.out._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
  });
  return {
    allOf: [a, b].filter((x) => x !== void 0)
  };
};

// src/zod-to-json-schema/parsers/promise.ts
function parsePromiseDef(def, refs) {
  return parseDef(def.type._def, refs);
}

// src/zod-to-json-schema/parsers/set.ts
function parseSetDef(def, refs) {
  const items = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items"]
  });
  const schema = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    schema.minItems = def.minSize.value;
  }
  if (def.maxSize) {
    schema.maxItems = def.maxSize.value;
  }
  return schema;
}

// src/zod-to-json-schema/parsers/tuple.ts
function parseTupleDef(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      ),
      additionalItems: parseDef(def.rest._def, {
        ...refs,
        currentPath: [...refs.currentPath, "additionalItems"]
      })
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      )
    };
  }
}

// src/zod-to-json-schema/parsers/undefined.ts
function parseUndefinedDef() {
  return {
    not: parseAnyDef()
  };
}

// src/zod-to-json-schema/parsers/unknown.ts
function parseUnknownDef() {
  return parseAnyDef();
}

// src/zod-to-json-schema/parsers/readonly.ts
var parseReadonlyDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};

// src/zod-to-json-schema/select-parser.ts
var selectParser = (def, typeName, refs) => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef(def);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef();
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef();
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return () => def.getter()._def;
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef();
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef();
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef();
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind.ZodReadonly:
      return parseReadonlyDef(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return void 0;
    default:
      return /* @__PURE__ */ ((_) => void 0)();
  }
};

// src/zod-to-json-schema/parse-def.ts
function parseDef(def, refs, forceResolution = false) {
  var _a;
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = (_a = refs.override) == null ? void 0 : _a.call(
      refs,
      def,
      refs,
      seenItem,
      forceResolution
    );
    if (overrideResult !== ignoreOverride) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref(seenItem, refs);
    if (seenSchema !== void 0) {
      return seenSchema;
    }
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.set(def, newItem);
  const jsonSchemaOrGetter = selectParser(def, def.typeName, refs);
  const jsonSchema2 = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
  if (jsonSchema2) {
    addMeta(def, refs, jsonSchema2);
  }
  if (refs.postProcess) {
    const postProcessResult = refs.postProcess(jsonSchema2, def, refs);
    newItem.jsonSchema = jsonSchema2;
    return postProcessResult;
  }
  newItem.jsonSchema = jsonSchema2;
  return jsonSchema2;
}
var get$ref = (item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return { $ref: item.path.join("/") };
    case "relative":
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case "none":
    case "seen": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
        console.warn(
          `Recursive reference detected at ${refs.currentPath.join(
            "/"
          )}! Defaulting to any`
        );
        return parseAnyDef();
      }
      return refs.$refStrategy === "seen" ? parseAnyDef() : void 0;
    }
  }
};
var addMeta = (def, refs, jsonSchema2) => {
  if (def.description) {
    jsonSchema2.description = def.description;
  }
  return jsonSchema2;
};

// src/zod-to-json-schema/refs.ts
var getRefs = (options) => {
  const _options = getDefaultOptions(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return {
    ..._options,
    currentPath,
    propertyPath: void 0,
    seen: new Map(
      Object.entries(_options.definitions).map(([name, def]) => [
        def._def,
        {
          def: def._def,
          path: [..._options.basePath, _options.definitionPath, name],
          // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
          jsonSchema: void 0
        }
      ])
    )
  };
};

// src/zod-to-json-schema/zod-to-json-schema.ts
var zodToJsonSchema = (schema, options) => {
  var _a;
  const refs = getRefs(options);
  let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce(
    (acc, [name2, schema2]) => {
      var _a2;
      return {
        ...acc,
        [name2]: (_a2 = parseDef(
          schema2._def,
          {
            ...refs,
            currentPath: [...refs.basePath, refs.definitionPath, name2]
          },
          true
        )) != null ? _a2 : parseAnyDef()
      };
    },
    {}
  ) : void 0;
  const name = typeof options === "string" ? options : (options == null ? void 0 : options.nameStrategy) === "title" ? void 0 : options == null ? void 0 : options.name;
  const main = (_a = parseDef(
    schema._def,
    name === void 0 ? refs : {
      ...refs,
      currentPath: [...refs.basePath, refs.definitionPath, name]
    },
    false
  )) != null ? _a : parseAnyDef();
  const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
  if (title !== void 0) {
    main.title = title;
  }
  const combined = name === void 0 ? definitions ? {
    ...main,
    [refs.definitionPath]: definitions
  } : main : {
    $ref: [
      ...refs.$refStrategy === "relative" ? [] : refs.basePath,
      refs.definitionPath,
      name
    ].join("/"),
    [refs.definitionPath]: {
      ...definitions,
      [name]: main
    }
  };
  combined.$schema = "http://json-schema.org/draft-07/schema#";
  return combined;
};

// src/zod-to-json-schema/index.ts
var zod_to_json_schema_default = zodToJsonSchema;

// src/zod-schema.ts
function zod3Schema(zodSchema2, options) {
  var _a;
  const useReferences = (_a = void 0 ) != null ? _a : false;
  return jsonSchema(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => zod_to_json_schema_default(zodSchema2, {
      $refStrategy: useReferences ? "root" : "none"
    }),
    {
      validate: async (value) => {
        const result = await zodSchema2.safeParseAsync(value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
function zod4Schema(zodSchema2, options) {
  var _a;
  const useReferences = (_a = void 0 ) != null ? _a : false;
  return jsonSchema(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => toJSONSchema(zodSchema2, {
      target: "draft-7",
      io: "output",
      reused: useReferences ? "ref" : "inline"
    }),
    {
      validate: async (value) => {
        const result = await safeParseAsync(zodSchema2, value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
function isZod4Schema(zodSchema2) {
  return "_zod" in zodSchema2;
}
function zodSchema(zodSchema2, options) {
  if (isZod4Schema(zodSchema2)) {
    return zod4Schema(zodSchema2);
  } else {
    return zod3Schema(zodSchema2);
  }
}

// src/schema.ts
var schemaSymbol = Symbol.for("vercel.ai.schema");
function lazySchema(createSchema) {
  let schema;
  return () => {
    if (schema == null) {
      schema = createSchema();
    }
    return schema;
  };
}
function jsonSchema(jsonSchema2, {
  validate
} = {}) {
  return {
    [schemaSymbol]: true,
    _type: void 0,
    // should never be used directly
    [validatorSymbol$3]: true,
    get jsonSchema() {
      if (typeof jsonSchema2 === "function") {
        jsonSchema2 = jsonSchema2();
      }
      return jsonSchema2;
    },
    validate
  };
}

// src/uint8-utils.ts
var { btoa: btoa$2, atob } = globalThis;
function convertBase64ToUint8Array(base64String) {
  const base64Url = base64String.replace(/-/g, "+").replace(/_/g, "/");
  const latin1string = atob(base64Url);
  return Uint8Array.from(latin1string, (byte) => byte.codePointAt(0));
}
function convertUint8ArrayToBase64$2(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa$2(latin1string);
}
function convertToBase64$1(value) {
  return value instanceof Uint8Array ? convertUint8ArrayToBase64$2(value) : value;
}

// src/without-trailing-slash.ts
function withoutTrailingSlash$2(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}

// src/openai-provider.ts
var openaiErrorDataSchema = object({
  error: object({
    message: string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: string().nullish(),
    param: any().nullish(),
    code: union([string(), number()]).nullish()
  })
});
var openaiFailedResponseHandler = createJsonErrorResponseHandler$3({
  errorSchema: openaiErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function convertToOpenAIChatMessages({
  prompt,
  systemMessageMode = "system"
}) {
  const messages = [];
  const warnings = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            messages.push({ role: "system", content });
            break;
          }
          case "developer": {
            messages.push({ role: "developer", content });
            break;
          }
          case "remove": {
            warnings.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push({ role: "user", content: content[0].text });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part, index) => {
            var _a, _b, _c;
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "file": {
                if (part.mediaType.startsWith("image/")) {
                  const mediaType = part.mediaType === "image/*" ? "image/jpeg" : part.mediaType;
                  return {
                    type: "image_url",
                    image_url: {
                      url: part.data instanceof URL ? part.data.toString() : `data:${mediaType};base64,${convertToBase64$1(part.data)}`,
                      // OpenAI specific extension: image detail
                      detail: (_b = (_a = part.providerOptions) == null ? void 0 : _a.openai) == null ? void 0 : _b.imageDetail
                    }
                  };
                } else if (part.mediaType.startsWith("audio/")) {
                  if (part.data instanceof URL) {
                    throw new UnsupportedFunctionalityError$2({
                      functionality: "audio file parts with URLs"
                    });
                  }
                  switch (part.mediaType) {
                    case "audio/wav": {
                      return {
                        type: "input_audio",
                        input_audio: {
                          data: convertToBase64$1(part.data),
                          format: "wav"
                        }
                      };
                    }
                    case "audio/mp3":
                    case "audio/mpeg": {
                      return {
                        type: "input_audio",
                        input_audio: {
                          data: convertToBase64$1(part.data),
                          format: "mp3"
                        }
                      };
                    }
                    default: {
                      throw new UnsupportedFunctionalityError$2({
                        functionality: `audio content parts with media type ${part.mediaType}`
                      });
                    }
                  }
                } else if (part.mediaType === "application/pdf") {
                  if (part.data instanceof URL) {
                    throw new UnsupportedFunctionalityError$2({
                      functionality: "PDF file parts with URLs"
                    });
                  }
                  return {
                    type: "file",
                    file: typeof part.data === "string" && part.data.startsWith("file-") ? { file_id: part.data } : {
                      filename: (_c = part.filename) != null ? _c : `part-${index}.pdf`,
                      file_data: `data:application/pdf;base64,${convertToBase64$1(part.data)}`
                    }
                  };
                } else {
                  throw new UnsupportedFunctionalityError$2({
                    functionality: `file part media type ${part.mediaType}`
                  });
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.input)
                }
              });
              break;
            }
          }
        }
        messages.push({
          role: "assistant",
          content: text,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          const output = toolResponse.output;
          let contentValue;
          switch (output.type) {
            case "text":
            case "error-text":
              contentValue = output.value;
              break;
            case "content":
            case "json":
            case "error-json":
              contentValue = JSON.stringify(output.value);
              break;
          }
          messages.push({
            role: "tool",
            tool_call_id: toolResponse.toolCallId,
            content: contentValue
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return { messages, warnings };
}

// src/chat/get-response-metadata.ts
function getResponseMetadata$1({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}

// src/chat/map-openai-finish-reason.ts
function mapOpenAIFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiChatResponseSchema = lazyValidator(
  () => zodSchema(
    object({
      id: string().nullish(),
      created: number().nullish(),
      model: string().nullish(),
      choices: array(
        object({
          message: object({
            role: literal("assistant").nullish(),
            content: string().nullish(),
            tool_calls: array(
              object({
                id: string().nullish(),
                type: literal("function"),
                function: object({
                  name: string(),
                  arguments: string()
                })
              })
            ).nullish(),
            annotations: array(
              object({
                type: literal("url_citation"),
                start_index: number(),
                end_index: number(),
                url: string(),
                title: string()
              })
            ).nullish()
          }),
          index: number(),
          logprobs: object({
            content: array(
              object({
                token: string(),
                logprob: number(),
                top_logprobs: array(
                  object({
                    token: string(),
                    logprob: number()
                  })
                )
              })
            ).nullish()
          }).nullish(),
          finish_reason: string().nullish()
        })
      ),
      usage: object({
        prompt_tokens: number().nullish(),
        completion_tokens: number().nullish(),
        total_tokens: number().nullish(),
        prompt_tokens_details: object({
          cached_tokens: number().nullish()
        }).nullish(),
        completion_tokens_details: object({
          reasoning_tokens: number().nullish(),
          accepted_prediction_tokens: number().nullish(),
          rejected_prediction_tokens: number().nullish()
        }).nullish()
      }).nullish()
    })
  )
);
var openaiChatChunkSchema = lazyValidator(
  () => zodSchema(
    union([
      object({
        id: string().nullish(),
        created: number().nullish(),
        model: string().nullish(),
        choices: array(
          object({
            delta: object({
              role: _enum(["assistant"]).nullish(),
              content: string().nullish(),
              tool_calls: array(
                object({
                  index: number(),
                  id: string().nullish(),
                  type: literal("function").nullish(),
                  function: object({
                    name: string().nullish(),
                    arguments: string().nullish()
                  })
                })
              ).nullish(),
              annotations: array(
                object({
                  type: literal("url_citation"),
                  start_index: number(),
                  end_index: number(),
                  url: string(),
                  title: string()
                })
              ).nullish()
            }).nullish(),
            logprobs: object({
              content: array(
                object({
                  token: string(),
                  logprob: number(),
                  top_logprobs: array(
                    object({
                      token: string(),
                      logprob: number()
                    })
                  )
                })
              ).nullish()
            }).nullish(),
            finish_reason: string().nullish(),
            index: number()
          })
        ),
        usage: object({
          prompt_tokens: number().nullish(),
          completion_tokens: number().nullish(),
          total_tokens: number().nullish(),
          prompt_tokens_details: object({
            cached_tokens: number().nullish()
          }).nullish(),
          completion_tokens_details: object({
            reasoning_tokens: number().nullish(),
            accepted_prediction_tokens: number().nullish(),
            rejected_prediction_tokens: number().nullish()
          }).nullish()
        }).nullish()
      }),
      openaiErrorDataSchema
    ])
  )
);
var openaiChatLanguageModelOptions = lazyValidator(
  () => zodSchema(
    object({
      /**
       * Modify the likelihood of specified tokens appearing in the completion.
       *
       * Accepts a JSON object that maps tokens (specified by their token ID in
       * the GPT tokenizer) to an associated bias value from -100 to 100.
       */
      logitBias: record(number$1(), number()).optional(),
      /**
       * Return the log probabilities of the tokens.
       *
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       *
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       */
      logprobs: union([boolean(), number()]).optional(),
      /**
       * Whether to enable parallel function calling during tool use. Default to true.
       */
      parallelToolCalls: boolean().optional(),
      /**
       * A unique identifier representing your end-user, which can help OpenAI to
       * monitor and detect abuse.
       */
      user: string().optional(),
      /**
       * Reasoning effort for reasoning models. Defaults to `medium`.
       */
      reasoningEffort: _enum(["minimal", "low", "medium", "high"]).optional(),
      /**
       * Maximum number of completion tokens to generate. Useful for reasoning models.
       */
      maxCompletionTokens: number().optional(),
      /**
       * Whether to enable persistence in responses API.
       */
      store: boolean().optional(),
      /**
       * Metadata to associate with the request.
       */
      metadata: record(string().max(64), string().max(512)).optional(),
      /**
       * Parameters for prediction mode.
       */
      prediction: record(string(), any()).optional(),
      /**
       * Whether to use structured outputs.
       *
       * @default true
       */
      structuredOutputs: boolean().optional(),
      /**
       * Service tier for the request.
       * - 'auto': Default service tier. The request will be processed with the service tier configured in the
       *           Project settings. Unless otherwise configured, the Project will use 'default'.
       * - 'flex': 50% cheaper processing at the cost of increased latency. Only available for o3 and o4-mini models.
       * - 'priority': Higher-speed processing with predictably low latency at premium cost. Available for Enterprise customers.
       * - 'default': The request will be processed with the standard pricing and performance for the selected model.
       *
       * @default 'auto'
       */
      serviceTier: _enum(["auto", "flex", "priority", "default"]).optional(),
      /**
       * Whether to use strict JSON schema validation.
       *
       * @default false
       */
      strictJsonSchema: boolean().optional(),
      /**
       * Controls the verbosity of the model's responses.
       * Lower values will result in more concise responses, while higher values will result in more verbose responses.
       */
      textVerbosity: _enum(["low", "medium", "high"]).optional(),
      /**
       * A cache key for prompt caching. Allows manual control over prompt caching behavior.
       * Useful for improving cache hit rates and working around automatic caching issues.
       */
      promptCacheKey: string().optional(),
      /**
       * A stable identifier used to help detect users of your application
       * that may be violating OpenAI's usage policies. The IDs should be a
       * string that uniquely identifies each user. We recommend hashing their
       * username or email address, in order to avoid sending us any identifying
       * information.
       */
      safetyIdentifier: string().optional()
    })
  )
);
function prepareChatTools({
  tools,
  toolChoice,
  structuredOutputs,
  strictJsonSchema
}) {
  tools = (tools == null ? void 0 : tools.length) ? tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, toolChoice: void 0, toolWarnings };
  }
  const openaiTools2 = [];
  for (const tool of tools) {
    switch (tool.type) {
      case "function":
        openaiTools2.push({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
            strict: structuredOutputs ? strictJsonSchema : void 0
          }
        });
        break;
      default:
        toolWarnings.push({ type: "unsupported-tool", tool });
        break;
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools2, toolChoice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools2, toolChoice: type, toolWarnings };
    case "tool":
      return {
        tools: openaiTools2,
        toolChoice: {
          type: "function",
          function: {
            name: toolChoice.toolName
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError$2({
        functionality: `tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}

// src/chat/openai-chat-language-model.ts
var OpenAIChatLanguageModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    this.supportedUrls = {
      "image/*": [/^https?:\/\/.*$/]
    };
    this.modelId = modelId;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    tools,
    toolChoice,
    providerOptions
  }) {
    var _a, _b, _c, _d;
    const warnings = [];
    const openaiOptions = (_a = await parseProviderOptions$1({
      provider: "openai",
      providerOptions,
      schema: openaiChatLanguageModelOptions
    })) != null ? _a : {};
    const structuredOutputs = (_b = openaiOptions.structuredOutputs) != null ? _b : true;
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !structuredOutputs) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is only supported with structuredOutputs"
      });
    }
    const { messages, warnings: messageWarnings } = convertToOpenAIChatMessages(
      {
        prompt,
        systemMessageMode: getSystemMessageMode(this.modelId)
      }
    );
    warnings.push(...messageWarnings);
    const strictJsonSchema = (_c = openaiOptions.strictJsonSchema) != null ? _c : false;
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: openaiOptions.logitBias,
      logprobs: openaiOptions.logprobs === true || typeof openaiOptions.logprobs === "number" ? true : void 0,
      top_logprobs: typeof openaiOptions.logprobs === "number" ? openaiOptions.logprobs : typeof openaiOptions.logprobs === "boolean" ? openaiOptions.logprobs ? 0 : void 0 : void 0,
      user: openaiOptions.user,
      parallel_tool_calls: openaiOptions.parallelToolCalls,
      // standardized settings:
      max_tokens: maxOutputTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? structuredOutputs && responseFormat.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: responseFormat.schema,
          strict: strictJsonSchema,
          name: (_d = responseFormat.name) != null ? _d : "response",
          description: responseFormat.description
        }
      } : { type: "json_object" } : void 0,
      stop: stopSequences,
      seed,
      verbosity: openaiOptions.textVerbosity,
      // openai specific settings:
      // TODO AI SDK 6: remove, we auto-map maxOutputTokens now
      max_completion_tokens: openaiOptions.maxCompletionTokens,
      store: openaiOptions.store,
      metadata: openaiOptions.metadata,
      prediction: openaiOptions.prediction,
      reasoning_effort: openaiOptions.reasoningEffort,
      service_tier: openaiOptions.serviceTier,
      prompt_cache_key: openaiOptions.promptCacheKey,
      safety_identifier: openaiOptions.safetyIdentifier,
      // messages:
      messages
    };
    if (isReasoningModel(this.modelId)) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for reasoning models"
        });
      }
      if (baseArgs.top_p != null) {
        baseArgs.top_p = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topP",
          details: "topP is not supported for reasoning models"
        });
      }
      if (baseArgs.frequency_penalty != null) {
        baseArgs.frequency_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "frequencyPenalty",
          details: "frequencyPenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.presence_penalty != null) {
        baseArgs.presence_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "presencePenalty",
          details: "presencePenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.logit_bias != null) {
        baseArgs.logit_bias = void 0;
        warnings.push({
          type: "other",
          message: "logitBias is not supported for reasoning models"
        });
      }
      if (baseArgs.logprobs != null) {
        baseArgs.logprobs = void 0;
        warnings.push({
          type: "other",
          message: "logprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.top_logprobs != null) {
        baseArgs.top_logprobs = void 0;
        warnings.push({
          type: "other",
          message: "topLogprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.max_tokens != null) {
        if (baseArgs.max_completion_tokens == null) {
          baseArgs.max_completion_tokens = baseArgs.max_tokens;
        }
        baseArgs.max_tokens = void 0;
      }
    } else if (this.modelId.startsWith("gpt-4o-search-preview") || this.modelId.startsWith("gpt-4o-mini-search-preview")) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for the search preview models and has been removed."
        });
      }
    }
    if (openaiOptions.serviceTier === "flex" && !supportsFlexProcessing(this.modelId)) {
      warnings.push({
        type: "unsupported-setting",
        setting: "serviceTier",
        details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
      });
      baseArgs.service_tier = void 0;
    }
    if (openaiOptions.serviceTier === "priority" && !supportsPriorityProcessing(this.modelId)) {
      warnings.push({
        type: "unsupported-setting",
        setting: "serviceTier",
        details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
      });
      baseArgs.service_tier = void 0;
    }
    const {
      tools: openaiTools2,
      toolChoice: openaiToolChoice,
      toolWarnings
    } = prepareChatTools({
      tools,
      toolChoice,
      structuredOutputs,
      strictJsonSchema
    });
    return {
      args: {
        ...baseArgs,
        tools: openaiTools2,
        tool_choice: openaiToolChoice
      },
      warnings: [...warnings, ...toolWarnings]
    };
  }
  async doGenerate(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    const { args: body, warnings } = await this.getArgs(options);
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi$3({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders$3(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$3(
        openaiChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const choice = response.choices[0];
    const content = [];
    const text = choice.message.content;
    if (text != null && text.length > 0) {
      content.push({ type: "text", text });
    }
    for (const toolCall of (_a = choice.message.tool_calls) != null ? _a : []) {
      content.push({
        type: "tool-call",
        toolCallId: (_b = toolCall.id) != null ? _b : generateId$2(),
        toolName: toolCall.function.name,
        input: toolCall.function.arguments
      });
    }
    for (const annotation of (_c = choice.message.annotations) != null ? _c : []) {
      content.push({
        type: "source",
        sourceType: "url",
        id: generateId$2(),
        url: annotation.url,
        title: annotation.title
      });
    }
    const completionTokenDetails = (_d = response.usage) == null ? void 0 : _d.completion_tokens_details;
    const promptTokenDetails = (_e = response.usage) == null ? void 0 : _e.prompt_tokens_details;
    const providerMetadata = { openai: {} };
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
      providerMetadata.openai.acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
    }
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
      providerMetadata.openai.rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
    }
    if (((_f = choice.logprobs) == null ? void 0 : _f.content) != null) {
      providerMetadata.openai.logprobs = choice.logprobs.content;
    }
    return {
      content,
      finishReason: mapOpenAIFinishReason(choice.finish_reason),
      usage: {
        inputTokens: (_h = (_g = response.usage) == null ? void 0 : _g.prompt_tokens) != null ? _h : void 0,
        outputTokens: (_j = (_i = response.usage) == null ? void 0 : _i.completion_tokens) != null ? _j : void 0,
        totalTokens: (_l = (_k = response.usage) == null ? void 0 : _k.total_tokens) != null ? _l : void 0,
        reasoningTokens: (_m = completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens) != null ? _m : void 0,
        cachedInputTokens: (_n = promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens) != null ? _n : void 0
      },
      request: { body },
      response: {
        ...getResponseMetadata$1(response),
        headers: responseHeaders,
        body: rawResponse
      },
      warnings,
      providerMetadata
    };
  }
  async doStream(options) {
    const { args, warnings } = await this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      stream_options: {
        include_usage: true
      }
    };
    const { responseHeaders, value: response } = await postJsonToApi$3({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders$3(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler$2(
        openaiChatChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const toolCalls = [];
    let finishReason = "unknown";
    const usage = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    let isFirstChunk = true;
    let isActiveText = false;
    const providerMetadata = { openai: {} };
    return {
      stream: response.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata$1(value)
              });
            }
            if (value.usage != null) {
              usage.inputTokens = (_a = value.usage.prompt_tokens) != null ? _a : void 0;
              usage.outputTokens = (_b = value.usage.completion_tokens) != null ? _b : void 0;
              usage.totalTokens = (_c = value.usage.total_tokens) != null ? _c : void 0;
              usage.reasoningTokens = (_e = (_d = value.usage.completion_tokens_details) == null ? void 0 : _d.reasoning_tokens) != null ? _e : void 0;
              usage.cachedInputTokens = (_g = (_f = value.usage.prompt_tokens_details) == null ? void 0 : _f.cached_tokens) != null ? _g : void 0;
              if (((_h = value.usage.completion_tokens_details) == null ? void 0 : _h.accepted_prediction_tokens) != null) {
                providerMetadata.openai.acceptedPredictionTokens = (_i = value.usage.completion_tokens_details) == null ? void 0 : _i.accepted_prediction_tokens;
              }
              if (((_j = value.usage.completion_tokens_details) == null ? void 0 : _j.rejected_prediction_tokens) != null) {
                providerMetadata.openai.rejectedPredictionTokens = (_k = value.usage.completion_tokens_details) == null ? void 0 : _k.rejected_prediction_tokens;
              }
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason(choice.finish_reason);
            }
            if (((_l = choice == null ? void 0 : choice.logprobs) == null ? void 0 : _l.content) != null) {
              providerMetadata.openai.logprobs = choice.logprobs.content;
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            if (delta.content != null) {
              if (!isActiveText) {
                controller.enqueue({ type: "text-start", id: "0" });
                isActiveText = true;
              }
              controller.enqueue({
                type: "text-delta",
                id: "0",
                delta: delta.content
              });
            }
            if (delta.tool_calls != null) {
              for (const toolCallDelta of delta.tool_calls) {
                const index = toolCallDelta.index;
                if (toolCalls[index] == null) {
                  if (toolCallDelta.type !== "function") {
                    throw new InvalidResponseDataError$1({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`
                    });
                  }
                  if (toolCallDelta.id == null) {
                    throw new InvalidResponseDataError$1({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`
                    });
                  }
                  if (((_m = toolCallDelta.function) == null ? void 0 : _m.name) == null) {
                    throw new InvalidResponseDataError$1({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`
                    });
                  }
                  controller.enqueue({
                    type: "tool-input-start",
                    id: toolCallDelta.id,
                    toolName: toolCallDelta.function.name
                  });
                  toolCalls[index] = {
                    id: toolCallDelta.id,
                    type: "function",
                    function: {
                      name: toolCallDelta.function.name,
                      arguments: (_n = toolCallDelta.function.arguments) != null ? _n : ""
                    },
                    hasFinished: false
                  };
                  const toolCall2 = toolCalls[index];
                  if (((_o = toolCall2.function) == null ? void 0 : _o.name) != null && ((_p = toolCall2.function) == null ? void 0 : _p.arguments) != null) {
                    if (toolCall2.function.arguments.length > 0) {
                      controller.enqueue({
                        type: "tool-input-delta",
                        id: toolCall2.id,
                        delta: toolCall2.function.arguments
                      });
                    }
                    if (isParsableJson$1(toolCall2.function.arguments)) {
                      controller.enqueue({
                        type: "tool-input-end",
                        id: toolCall2.id
                      });
                      controller.enqueue({
                        type: "tool-call",
                        toolCallId: (_q = toolCall2.id) != null ? _q : generateId$2(),
                        toolName: toolCall2.function.name,
                        input: toolCall2.function.arguments
                      });
                      toolCall2.hasFinished = true;
                    }
                  }
                  continue;
                }
                const toolCall = toolCalls[index];
                if (toolCall.hasFinished) {
                  continue;
                }
                if (((_r = toolCallDelta.function) == null ? void 0 : _r.arguments) != null) {
                  toolCall.function.arguments += (_t = (_s = toolCallDelta.function) == null ? void 0 : _s.arguments) != null ? _t : "";
                }
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.id,
                  delta: (_u = toolCallDelta.function.arguments) != null ? _u : ""
                });
                if (((_v = toolCall.function) == null ? void 0 : _v.name) != null && ((_w = toolCall.function) == null ? void 0 : _w.arguments) != null && isParsableJson$1(toolCall.function.arguments)) {
                  controller.enqueue({
                    type: "tool-input-end",
                    id: toolCall.id
                  });
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId: (_x = toolCall.id) != null ? _x : generateId$2(),
                    toolName: toolCall.function.name,
                    input: toolCall.function.arguments
                  });
                  toolCall.hasFinished = true;
                }
              }
            }
            if (delta.annotations != null) {
              for (const annotation of delta.annotations) {
                controller.enqueue({
                  type: "source",
                  sourceType: "url",
                  id: generateId$2(),
                  url: annotation.url,
                  title: annotation.title
                });
              }
            }
          },
          flush(controller) {
            if (isActiveText) {
              controller.enqueue({ type: "text-end", id: "0" });
            }
            controller.enqueue({
              type: "finish",
              finishReason,
              usage,
              ...providerMetadata != null ? { providerMetadata } : {}
            });
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
  }
};
function isReasoningModel(modelId) {
  return (modelId.startsWith("o") || modelId.startsWith("gpt-5")) && !modelId.startsWith("gpt-5-chat");
}
function supportsFlexProcessing(modelId) {
  return modelId.startsWith("o3") || modelId.startsWith("o4-mini") || modelId.startsWith("gpt-5") && !modelId.startsWith("gpt-5-chat");
}
function supportsPriorityProcessing(modelId) {
  return modelId.startsWith("gpt-4") || modelId.startsWith("gpt-5-mini") || modelId.startsWith("gpt-5") && !modelId.startsWith("gpt-5-nano") && !modelId.startsWith("gpt-5-chat") || modelId.startsWith("o3") || modelId.startsWith("o4-mini");
}
function getSystemMessageMode(modelId) {
  var _a, _b;
  if (!isReasoningModel(modelId)) {
    return "system";
  }
  return (_b = (_a = reasoningModels[modelId]) == null ? void 0 : _a.systemMessageMode) != null ? _b : "developer";
}
var reasoningModels = {
  "o1-mini": {
    systemMessageMode: "remove"
  },
  "o1-mini-2024-09-12": {
    systemMessageMode: "remove"
  },
  "o1-preview": {
    systemMessageMode: "remove"
  },
  "o1-preview-2024-09-12": {
    systemMessageMode: "remove"
  },
  o3: {
    systemMessageMode: "developer"
  },
  "o3-2025-04-16": {
    systemMessageMode: "developer"
  },
  "o3-mini": {
    systemMessageMode: "developer"
  },
  "o3-mini-2025-01-31": {
    systemMessageMode: "developer"
  },
  "o4-mini": {
    systemMessageMode: "developer"
  },
  "o4-mini-2025-04-16": {
    systemMessageMode: "developer"
  }
};
function convertToOpenAICompletionPrompt({
  prompt,
  user = "user",
  assistant = "assistant"
}) {
  let text = "";
  if (prompt[0].role === "system") {
    text += `${prompt[0].content}

`;
    prompt = prompt.slice(1);
  }
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError$1({
          message: "Unexpected system message in prompt: ${content}",
          prompt
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
          }
        }).filter(Boolean).join("");
        text += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new UnsupportedFunctionalityError$2({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError$2({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text += `${assistant}:
`;
  return {
    prompt: text,
    stopSequences: [`
${user}:`]
  };
}

// src/completion/get-response-metadata.ts
function getResponseMetadata2({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}

// src/completion/map-openai-finish-reason.ts
function mapOpenAIFinishReason2(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiCompletionResponseSchema = lazyValidator(
  () => zodSchema(
    object({
      id: string().nullish(),
      created: number().nullish(),
      model: string().nullish(),
      choices: array(
        object({
          text: string(),
          finish_reason: string(),
          logprobs: object({
            tokens: array(string()),
            token_logprobs: array(number()),
            top_logprobs: array(record(string(), number())).nullish()
          }).nullish()
        })
      ),
      usage: object({
        prompt_tokens: number(),
        completion_tokens: number(),
        total_tokens: number()
      }).nullish()
    })
  )
);
var openaiCompletionChunkSchema = lazyValidator(
  () => zodSchema(
    union([
      object({
        id: string().nullish(),
        created: number().nullish(),
        model: string().nullish(),
        choices: array(
          object({
            text: string(),
            finish_reason: string().nullish(),
            index: number(),
            logprobs: object({
              tokens: array(string()),
              token_logprobs: array(number()),
              top_logprobs: array(record(string(), number())).nullish()
            }).nullish()
          })
        ),
        usage: object({
          prompt_tokens: number(),
          completion_tokens: number(),
          total_tokens: number()
        }).nullish()
      }),
      openaiErrorDataSchema
    ])
  )
);
var openaiCompletionProviderOptions = lazyValidator(
  () => zodSchema(
    object({
      /**
      Echo back the prompt in addition to the completion.
         */
      echo: boolean().optional(),
      /**
      Modify the likelihood of specified tokens appearing in the completion.
      
      Accepts a JSON object that maps tokens (specified by their token ID in
      the GPT tokenizer) to an associated bias value from -100 to 100. You
      can use this tokenizer tool to convert text to token IDs. Mathematically,
      the bias is added to the logits generated by the model prior to sampling.
      The exact effect will vary per model, but values between -1 and 1 should
      decrease or increase likelihood of selection; values like -100 or 100
      should result in a ban or exclusive selection of the relevant token.
      
      As an example, you can pass {"50256": -100} to prevent the <|endoftext|>
      token from being generated.
       */
      logitBias: record(string(), number()).optional(),
      /**
      The suffix that comes after a completion of inserted text.
       */
      suffix: string().optional(),
      /**
      A unique identifier representing your end-user, which can help OpenAI to
      monitor and detect abuse. Learn more.
       */
      user: string().optional(),
      /**
      Return the log probabilities of the tokens. Including logprobs will increase
      the response size and can slow down response times. However, it can
      be useful to better understand how the model is behaving.
      Setting to true will return the log probabilities of the tokens that
      were generated.
      Setting to a number will return the log probabilities of the top n
      tokens that were generated.
         */
      logprobs: union([boolean(), number()]).optional()
    })
  )
);

// src/completion/openai-completion-language-model.ts
var OpenAICompletionLanguageModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    this.supportedUrls = {
      // No URLs are supported for completion models.
    };
    this.modelId = modelId;
    this.config = config;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    tools,
    toolChoice,
    seed,
    providerOptions
  }) {
    const warnings = [];
    const openaiOptions = {
      ...await parseProviderOptions$1({
        provider: "openai",
        providerOptions,
        schema: openaiCompletionProviderOptions
      }),
      ...await parseProviderOptions$1({
        provider: this.providerOptionsName,
        providerOptions,
        schema: openaiCompletionProviderOptions
      })
    };
    if (topK != null) {
      warnings.push({ type: "unsupported-setting", setting: "topK" });
    }
    if (tools == null ? void 0 : tools.length) {
      warnings.push({ type: "unsupported-setting", setting: "tools" });
    }
    if (toolChoice != null) {
      warnings.push({ type: "unsupported-setting", setting: "toolChoice" });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompletionPrompt({ prompt });
    const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
    return {
      args: {
        // model id:
        model: this.modelId,
        // model specific settings:
        echo: openaiOptions.echo,
        logit_bias: openaiOptions.logitBias,
        logprobs: (openaiOptions == null ? void 0 : openaiOptions.logprobs) === true ? 0 : (openaiOptions == null ? void 0 : openaiOptions.logprobs) === false ? void 0 : openaiOptions == null ? void 0 : openaiOptions.logprobs,
        suffix: openaiOptions.suffix,
        user: openaiOptions.user,
        // standardized settings:
        max_tokens: maxOutputTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        seed,
        // prompt:
        prompt: completionPrompt,
        // stop sequences:
        stop: stop.length > 0 ? stop : void 0
      },
      warnings
    };
  }
  async doGenerate(options) {
    var _a, _b, _c;
    const { args, warnings } = await this.getArgs(options);
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi$3({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders$3(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$3(
        openaiCompletionResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const choice = response.choices[0];
    const providerMetadata = { openai: {} };
    if (choice.logprobs != null) {
      providerMetadata.openai.logprobs = choice.logprobs;
    }
    return {
      content: [{ type: "text", text: choice.text }],
      usage: {
        inputTokens: (_a = response.usage) == null ? void 0 : _a.prompt_tokens,
        outputTokens: (_b = response.usage) == null ? void 0 : _b.completion_tokens,
        totalTokens: (_c = response.usage) == null ? void 0 : _c.total_tokens
      },
      finishReason: mapOpenAIFinishReason2(choice.finish_reason),
      request: { body: args },
      response: {
        ...getResponseMetadata2(response),
        headers: responseHeaders,
        body: rawResponse
      },
      providerMetadata,
      warnings
    };
  }
  async doStream(options) {
    const { args, warnings } = await this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      stream_options: {
        include_usage: true
      }
    };
    const { responseHeaders, value: response } = await postJsonToApi$3({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders$3(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler$2(
        openaiCompletionChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    let finishReason = "unknown";
    const providerMetadata = { openai: {} };
    const usage = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    let isFirstChunk = true;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata2(value)
              });
              controller.enqueue({ type: "text-start", id: "0" });
            }
            if (value.usage != null) {
              usage.inputTokens = value.usage.prompt_tokens;
              usage.outputTokens = value.usage.completion_tokens;
              usage.totalTokens = value.usage.total_tokens;
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason2(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.logprobs) != null) {
              providerMetadata.openai.logprobs = choice.logprobs;
            }
            if ((choice == null ? void 0 : choice.text) != null && choice.text.length > 0) {
              controller.enqueue({
                type: "text-delta",
                id: "0",
                delta: choice.text
              });
            }
          },
          flush(controller) {
            if (!isFirstChunk) {
              controller.enqueue({ type: "text-end", id: "0" });
            }
            controller.enqueue({
              type: "finish",
              finishReason,
              providerMetadata,
              usage
            });
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
  }
};
var openaiEmbeddingProviderOptions = lazyValidator(
  () => zodSchema(
    object({
      /**
      The number of dimensions the resulting output embeddings should have.
      Only supported in text-embedding-3 and later models.
         */
      dimensions: number().optional(),
      /**
      A unique identifier representing your end-user, which can help OpenAI to
      monitor and detect abuse. Learn more.
      */
      user: string().optional()
    })
  )
);
var openaiTextEmbeddingResponseSchema = lazyValidator(
  () => zodSchema(
    object({
      data: array(object({ embedding: array(number()) })),
      usage: object({ prompt_tokens: number() }).nullish()
    })
  )
);

// src/embedding/openai-embedding-model.ts
var OpenAIEmbeddingModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    this.maxEmbeddingsPerCall = 2048;
    this.supportsParallelCalls = true;
    this.modelId = modelId;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values,
    headers,
    abortSignal,
    providerOptions
  }) {
    var _a;
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const openaiOptions = (_a = await parseProviderOptions$1({
      provider: "openai",
      providerOptions,
      schema: openaiEmbeddingProviderOptions
    })) != null ? _a : {};
    const {
      responseHeaders,
      value: response,
      rawValue
    } = await postJsonToApi$3({
      url: this.config.url({
        path: "/embeddings",
        modelId: this.modelId
      }),
      headers: combineHeaders$3(this.config.headers(), headers),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: "float",
        dimensions: openaiOptions.dimensions,
        user: openaiOptions.user
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$3(
        openaiTextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
      response: { headers: responseHeaders, body: rawValue }
    };
  }
};
var openaiImageResponseSchema = lazyValidator(
  () => zodSchema(
    object({
      data: array(
        object({
          b64_json: string(),
          revised_prompt: string().optional()
        })
      )
    })
  )
);

// src/image/openai-image-options.ts
var modelMaxImagesPerCall = {
  "dall-e-3": 1,
  "dall-e-2": 10,
  "gpt-image-1": 10,
  "gpt-image-1-mini": 10
};
var hasDefaultResponseFormat = /* @__PURE__ */ new Set([
  "gpt-image-1",
  "gpt-image-1-mini"
]);

// src/image/openai-image-model.ts
var OpenAIImageModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v2";
  }
  get maxImagesPerCall() {
    var _a;
    return (_a = modelMaxImagesPerCall[this.modelId]) != null ? _a : 1;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt,
    n,
    size,
    aspectRatio,
    seed,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a, _b, _c, _d;
    const warnings = [];
    if (aspectRatio != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "aspectRatio",
        details: "This model does not support aspect ratio. Use `size` instead."
      });
    }
    if (seed != null) {
      warnings.push({ type: "unsupported-setting", setting: "seed" });
    }
    const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
    const { value: response, responseHeaders } = await postJsonToApi$3({
      url: this.config.url({
        path: "/images/generations",
        modelId: this.modelId
      }),
      headers: combineHeaders$3(this.config.headers(), headers),
      body: {
        model: this.modelId,
        prompt,
        n,
        size,
        ...(_d = providerOptions.openai) != null ? _d : {},
        ...!hasDefaultResponseFormat.has(this.modelId) ? { response_format: "b64_json" } : {}
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$3(
        openaiImageResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      images: response.data.map((item) => item.b64_json),
      warnings,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders
      },
      providerMetadata: {
        openai: {
          images: response.data.map(
            (item) => item.revised_prompt ? {
              revisedPrompt: item.revised_prompt
            } : null
          )
        }
      }
    };
  }
};
var codeInterpreterInputSchema = lazySchema(
  () => zodSchema(
    object({
      code: string().nullish(),
      containerId: string()
    })
  )
);
var codeInterpreterOutputSchema = lazySchema(
  () => zodSchema(
    object({
      outputs: array(
        discriminatedUnion("type", [
          object({ type: literal("logs"), logs: string() }),
          object({ type: literal("image"), url: string() })
        ])
      ).nullish()
    })
  )
);
var codeInterpreterArgsSchema = lazySchema(
  () => zodSchema(
    object({
      container: union([
        string(),
        object({
          fileIds: array(string()).optional()
        })
      ]).optional()
    })
  )
);
var codeInterpreterToolFactory = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.code_interpreter",
  name: "code_interpreter",
  inputSchema: codeInterpreterInputSchema,
  outputSchema: codeInterpreterOutputSchema
});
var codeInterpreter = (args = {}) => {
  return codeInterpreterToolFactory(args);
};
var comparisonFilterSchema = object({
  key: string(),
  type: _enum(["eq", "ne", "gt", "gte", "lt", "lte"]),
  value: union([string(), number(), boolean()])
});
var compoundFilterSchema = object({
  type: _enum(["and", "or"]),
  filters: array(
    union([comparisonFilterSchema, lazy(() => compoundFilterSchema)])
  )
});
var fileSearchArgsSchema = lazySchema(
  () => zodSchema(
    object({
      vectorStoreIds: array(string()),
      maxNumResults: number().optional(),
      ranking: object({
        ranker: string().optional(),
        scoreThreshold: number().optional()
      }).optional(),
      filters: union([comparisonFilterSchema, compoundFilterSchema]).optional()
    })
  )
);
var fileSearchOutputSchema = lazySchema(
  () => zodSchema(
    object({
      queries: array(string()),
      results: array(
        object({
          attributes: record(string(), unknown()),
          fileId: string(),
          filename: string(),
          score: number(),
          text: string()
        })
      ).nullable()
    })
  )
);
var fileSearch = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.file_search",
  name: "file_search",
  inputSchema: object({}),
  outputSchema: fileSearchOutputSchema
});
var imageGenerationArgsSchema = lazySchema(
  () => zodSchema(
    object({
      background: _enum(["auto", "opaque", "transparent"]).optional(),
      inputFidelity: _enum(["low", "high"]).optional(),
      inputImageMask: object({
        fileId: string().optional(),
        imageUrl: string().optional()
      }).optional(),
      model: string().optional(),
      moderation: _enum(["auto"]).optional(),
      outputCompression: number().int().min(0).max(100).optional(),
      outputFormat: _enum(["png", "jpeg", "webp"]).optional(),
      partialImages: number().int().min(0).max(3).optional(),
      quality: _enum(["auto", "low", "medium", "high"]).optional(),
      size: _enum(["1024x1024", "1024x1536", "1536x1024", "auto"]).optional()
    }).strict()
  )
);
var imageGenerationInputSchema = lazySchema(() => zodSchema(object({})));
var imageGenerationOutputSchema = lazySchema(
  () => zodSchema(object({ result: string() }))
);
var imageGenerationToolFactory = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.image_generation",
  name: "image_generation",
  inputSchema: imageGenerationInputSchema,
  outputSchema: imageGenerationOutputSchema
});
var imageGeneration = (args = {}) => {
  return imageGenerationToolFactory(args);
};
var localShellInputSchema = lazySchema(
  () => zodSchema(
    object({
      action: object({
        type: literal("exec"),
        command: array(string()),
        timeoutMs: number().optional(),
        user: string().optional(),
        workingDirectory: string().optional(),
        env: record(string(), string()).optional()
      })
    })
  )
);
var localShellOutputSchema = lazySchema(
  () => zodSchema(object({ output: string() }))
);
var localShell = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.local_shell",
  name: "local_shell",
  inputSchema: localShellInputSchema,
  outputSchema: localShellOutputSchema
});
var webSearchArgsSchema = lazySchema(
  () => zodSchema(
    object({
      filters: object({ allowedDomains: array(string()).optional() }).optional(),
      searchContextSize: _enum(["low", "medium", "high"]).optional(),
      userLocation: object({
        type: literal("approximate"),
        country: string().optional(),
        city: string().optional(),
        region: string().optional(),
        timezone: string().optional()
      }).optional()
    })
  )
);
var webSearchInputSchema = lazySchema(() => zodSchema(object({})));
var webSearchOutputSchema = lazySchema(
  () => zodSchema(
    object({
      action: discriminatedUnion("type", [
        object({
          type: literal("search"),
          query: string().optional()
        }),
        object({
          type: literal("openPage"),
          url: string()
        }),
        object({
          type: literal("find"),
          url: string(),
          pattern: string()
        })
      ])
    })
  )
);
var webSearchToolFactory = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.web_search",
  name: "web_search",
  inputSchema: webSearchInputSchema,
  outputSchema: webSearchOutputSchema
});
var webSearch = (args = {}) => webSearchToolFactory(args);
var webSearchPreviewArgsSchema = lazySchema(
  () => zodSchema(
    object({
      searchContextSize: _enum(["low", "medium", "high"]).optional(),
      userLocation: object({
        type: literal("approximate"),
        country: string().optional(),
        city: string().optional(),
        region: string().optional(),
        timezone: string().optional()
      }).optional()
    })
  )
);
var webSearchPreviewInputSchema = lazySchema(
  () => zodSchema(object({}))
);
var webSearchPreviewOutputSchema = lazySchema(
  () => zodSchema(
    object({
      action: discriminatedUnion("type", [
        object({
          type: literal("search"),
          query: string().optional()
        }),
        object({
          type: literal("openPage"),
          url: string()
        }),
        object({
          type: literal("find"),
          url: string(),
          pattern: string()
        })
      ])
    })
  )
);
var webSearchPreview = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.web_search_preview",
  name: "web_search_preview",
  inputSchema: webSearchPreviewInputSchema,
  outputSchema: webSearchPreviewOutputSchema
});

// src/openai-tools.ts
var openaiTools = {
  /**
   * The Code Interpreter tool allows models to write and run Python code in a
   * sandboxed environment to solve complex problems in domains like data analysis,
   * coding, and math.
   *
   * @param container - The container to use for the code interpreter.
   *
   * Must have name `code_interpreter`.
   */
  codeInterpreter,
  /**
   * File search is a tool available in the Responses API. It enables models to
   * retrieve information in a knowledge base of previously uploaded files through
   * semantic and keyword search.
   *
   * Must have name `file_search`.
   *
   * @param vectorStoreIds - The vector store IDs to use for the file search.
   * @param maxNumResults - The maximum number of results to return.
   * @param ranking - The ranking options to use for the file search.
   * @param filters - The filters to use for the file search.
   */
  fileSearch,
  /**
   * The image generation tool allows you to generate images using a text prompt,
   * and optionally image inputs. It leverages the GPT Image model,
   * and automatically optimizes text inputs for improved performance.
   *
   * Must have name `image_generation`.
   *
   * @param size - Image dimensions (e.g., 1024x1024, 1024x1536)
   * @param quality - Rendering quality (e.g. low, medium, high)
   * @param format - File output format
   * @param compression - Compression level (0-100%) for JPEG and WebP formats
   * @param background - Transparent or opaque
   */
  imageGeneration,
  /**
   * Local shell is a tool that allows agents to run shell commands locally
   * on a machine you or the user provides.
   *
   * Supported models: `gpt-5-codex` and `codex-mini-latest`
   *
   * Must have name `local_shell`.
   */
  localShell,
  /**
   * Web search allows models to access up-to-date information from the internet
   * and provide answers with sourced citations.
   *
   * Must have name `web_search_preview`.
   *
   * @param searchContextSize - The search context size to use for the web search.
   * @param userLocation - The user location to use for the web search.
   *
   * @deprecated Use `webSearch` instead.
   */
  webSearchPreview,
  /**
   * Web search allows models to access up-to-date information from the internet
   * and provide answers with sourced citations.
   *
   * Must have name `web_search`.
   *
   * @param filters - The filters to use for the web search.
   * @param searchContextSize - The search context size to use for the web search.
   * @param userLocation - The user location to use for the web search.
   */
  webSearch
};
function isFileId(data, prefixes) {
  if (!prefixes) return false;
  return prefixes.some((prefix) => data.startsWith(prefix));
}
async function convertToOpenAIResponsesInput({
  prompt,
  systemMessageMode,
  fileIdPrefixes,
  store,
  hasLocalShellTool = false
}) {
  var _a, _b, _c, _d;
  const input = [];
  const warnings = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            input.push({ role: "system", content });
            break;
          }
          case "developer": {
            input.push({ role: "developer", content });
            break;
          }
          case "remove": {
            warnings.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        input.push({
          role: "user",
          content: content.map((part, index) => {
            var _a2, _b2, _c2;
            switch (part.type) {
              case "text": {
                return { type: "input_text", text: part.text };
              }
              case "file": {
                if (part.mediaType.startsWith("image/")) {
                  const mediaType = part.mediaType === "image/*" ? "image/jpeg" : part.mediaType;
                  return {
                    type: "input_image",
                    ...part.data instanceof URL ? { image_url: part.data.toString() } : typeof part.data === "string" && isFileId(part.data, fileIdPrefixes) ? { file_id: part.data } : {
                      image_url: `data:${mediaType};base64,${convertToBase64$1(part.data)}`
                    },
                    detail: (_b2 = (_a2 = part.providerOptions) == null ? void 0 : _a2.openai) == null ? void 0 : _b2.imageDetail
                  };
                } else if (part.mediaType === "application/pdf") {
                  if (part.data instanceof URL) {
                    return {
                      type: "input_file",
                      file_url: part.data.toString()
                    };
                  }
                  return {
                    type: "input_file",
                    ...typeof part.data === "string" && isFileId(part.data, fileIdPrefixes) ? { file_id: part.data } : {
                      filename: (_c2 = part.filename) != null ? _c2 : `part-${index}.pdf`,
                      file_data: `data:application/pdf;base64,${convertToBase64$1(part.data)}`
                    }
                  };
                } else {
                  throw new UnsupportedFunctionalityError$2({
                    functionality: `file part media type ${part.mediaType}`
                  });
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        const reasoningMessages = {};
        for (const part of content) {
          switch (part.type) {
            case "text": {
              const id = (_b = (_a = part.providerOptions) == null ? void 0 : _a.openai) == null ? void 0 : _b.itemId;
              if (store && id != null) {
                input.push({ type: "item_reference", id });
                break;
              }
              input.push({
                role: "assistant",
                content: [{ type: "output_text", text: part.text }],
                id
              });
              break;
            }
            case "tool-call": {
              if (part.providerExecuted) {
                break;
              }
              const id = (_d = (_c = part.providerOptions) == null ? void 0 : _c.openai) == null ? void 0 : _d.itemId;
              if (store && id != null) {
                input.push({ type: "item_reference", id });
                break;
              }
              if (hasLocalShellTool && part.toolName === "local_shell") {
                const parsedInput = await validateTypes$3({
                  value: part.input,
                  schema: localShellInputSchema
                });
                input.push({
                  type: "local_shell_call",
                  call_id: part.toolCallId,
                  id,
                  action: {
                    type: "exec",
                    command: parsedInput.action.command,
                    timeout_ms: parsedInput.action.timeoutMs,
                    user: parsedInput.action.user,
                    working_directory: parsedInput.action.workingDirectory,
                    env: parsedInput.action.env
                  }
                });
                break;
              }
              input.push({
                type: "function_call",
                call_id: part.toolCallId,
                name: part.toolName,
                arguments: JSON.stringify(part.input),
                id
              });
              break;
            }
            // assistant tool result parts are from provider-executed tools:
            case "tool-result": {
              if (store) {
                input.push({ type: "item_reference", id: part.toolCallId });
              } else {
                warnings.push({
                  type: "other",
                  message: `Results for OpenAI tool ${part.toolName} are not sent to the API when store is false`
                });
              }
              break;
            }
            case "reasoning": {
              const providerOptions = await parseProviderOptions$1({
                provider: "openai",
                providerOptions: part.providerOptions,
                schema: openaiResponsesReasoningProviderOptionsSchema
              });
              const reasoningId = providerOptions == null ? void 0 : providerOptions.itemId;
              if (reasoningId != null) {
                const reasoningMessage = reasoningMessages[reasoningId];
                if (store) {
                  if (reasoningMessage === void 0) {
                    input.push({ type: "item_reference", id: reasoningId });
                    reasoningMessages[reasoningId] = {
                      type: "reasoning",
                      id: reasoningId,
                      summary: []
                    };
                  }
                } else {
                  const summaryParts = [];
                  if (part.text.length > 0) {
                    summaryParts.push({
                      type: "summary_text",
                      text: part.text
                    });
                  } else if (reasoningMessage !== void 0) {
                    warnings.push({
                      type: "other",
                      message: `Cannot append empty reasoning part to existing reasoning sequence. Skipping reasoning part: ${JSON.stringify(part)}.`
                    });
                  }
                  if (reasoningMessage === void 0) {
                    reasoningMessages[reasoningId] = {
                      type: "reasoning",
                      id: reasoningId,
                      encrypted_content: providerOptions == null ? void 0 : providerOptions.reasoningEncryptedContent,
                      summary: summaryParts
                    };
                    input.push(reasoningMessages[reasoningId]);
                  } else {
                    reasoningMessage.summary.push(...summaryParts);
                    if ((providerOptions == null ? void 0 : providerOptions.reasoningEncryptedContent) != null) {
                      reasoningMessage.encrypted_content = providerOptions.reasoningEncryptedContent;
                    }
                  }
                }
              } else {
                warnings.push({
                  type: "other",
                  message: `Non-OpenAI reasoning parts are not supported. Skipping reasoning part: ${JSON.stringify(part)}.`
                });
              }
              break;
            }
          }
        }
        break;
      }
      case "tool": {
        for (const part of content) {
          const output = part.output;
          if (hasLocalShellTool && part.toolName === "local_shell" && output.type === "json") {
            const parsedOutput = await validateTypes$3({
              value: output.value,
              schema: localShellOutputSchema
            });
            input.push({
              type: "local_shell_call_output",
              call_id: part.toolCallId,
              output: parsedOutput.output
            });
            break;
          }
          let contentValue;
          switch (output.type) {
            case "text":
            case "error-text":
              contentValue = output.value;
              break;
            case "json":
            case "error-json":
              contentValue = JSON.stringify(output.value);
              break;
            case "content":
              contentValue = output.value.map((item) => {
                switch (item.type) {
                  case "text": {
                    return { type: "input_text", text: item.text };
                  }
                  case "media": {
                    return item.mediaType.startsWith("image/") ? {
                      type: "input_image",
                      image_url: `data:${item.mediaType};base64,${item.data}`
                    } : {
                      type: "input_file",
                      filename: "data",
                      file_data: `data:${item.mediaType};base64,${item.data}`
                    };
                  }
                }
              });
              break;
          }
          input.push({
            type: "function_call_output",
            call_id: part.toolCallId,
            output: contentValue
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return { input, warnings };
}
var openaiResponsesReasoningProviderOptionsSchema = object({
  itemId: string().nullish(),
  reasoningEncryptedContent: string().nullish()
});

// src/responses/map-openai-responses-finish-reason.ts
function mapOpenAIResponseFinishReason({
  finishReason,
  hasFunctionCall
}) {
  switch (finishReason) {
    case void 0:
    case null:
      return hasFunctionCall ? "tool-calls" : "stop";
    case "max_output_tokens":
      return "length";
    case "content_filter":
      return "content-filter";
    default:
      return hasFunctionCall ? "tool-calls" : "unknown";
  }
}
var openaiResponsesChunkSchema = lazyValidator(
  () => zodSchema(
    union([
      object({
        type: literal("response.output_text.delta"),
        item_id: string(),
        delta: string(),
        logprobs: array(
          object({
            token: string(),
            logprob: number(),
            top_logprobs: array(
              object({
                token: string(),
                logprob: number()
              })
            )
          })
        ).nullish()
      }),
      object({
        type: _enum(["response.completed", "response.incomplete"]),
        response: object({
          incomplete_details: object({ reason: string() }).nullish(),
          usage: object({
            input_tokens: number(),
            input_tokens_details: object({ cached_tokens: number().nullish() }).nullish(),
            output_tokens: number(),
            output_tokens_details: object({ reasoning_tokens: number().nullish() }).nullish()
          }),
          service_tier: string().nullish()
        })
      }),
      object({
        type: literal("response.created"),
        response: object({
          id: string(),
          created_at: number(),
          model: string(),
          service_tier: string().nullish()
        })
      }),
      object({
        type: literal("response.output_item.added"),
        output_index: number(),
        item: discriminatedUnion("type", [
          object({
            type: literal("message"),
            id: string()
          }),
          object({
            type: literal("reasoning"),
            id: string(),
            encrypted_content: string().nullish()
          }),
          object({
            type: literal("function_call"),
            id: string(),
            call_id: string(),
            name: string(),
            arguments: string()
          }),
          object({
            type: literal("web_search_call"),
            id: string(),
            status: string()
          }),
          object({
            type: literal("computer_call"),
            id: string(),
            status: string()
          }),
          object({
            type: literal("file_search_call"),
            id: string()
          }),
          object({
            type: literal("image_generation_call"),
            id: string()
          }),
          object({
            type: literal("code_interpreter_call"),
            id: string(),
            container_id: string(),
            code: string().nullable(),
            outputs: array(
              discriminatedUnion("type", [
                object({ type: literal("logs"), logs: string() }),
                object({ type: literal("image"), url: string() })
              ])
            ).nullable(),
            status: string()
          })
        ])
      }),
      object({
        type: literal("response.output_item.done"),
        output_index: number(),
        item: discriminatedUnion("type", [
          object({
            type: literal("message"),
            id: string()
          }),
          object({
            type: literal("reasoning"),
            id: string(),
            encrypted_content: string().nullish()
          }),
          object({
            type: literal("function_call"),
            id: string(),
            call_id: string(),
            name: string(),
            arguments: string(),
            status: literal("completed")
          }),
          object({
            type: literal("code_interpreter_call"),
            id: string(),
            code: string().nullable(),
            container_id: string(),
            outputs: array(
              discriminatedUnion("type", [
                object({ type: literal("logs"), logs: string() }),
                object({ type: literal("image"), url: string() })
              ])
            ).nullable()
          }),
          object({
            type: literal("image_generation_call"),
            id: string(),
            result: string()
          }),
          object({
            type: literal("web_search_call"),
            id: string(),
            status: string(),
            action: discriminatedUnion("type", [
              object({
                type: literal("search"),
                query: string().nullish()
              }),
              object({
                type: literal("open_page"),
                url: string()
              }),
              object({
                type: literal("find"),
                url: string(),
                pattern: string()
              })
            ])
          }),
          object({
            type: literal("file_search_call"),
            id: string(),
            queries: array(string()),
            results: array(
              object({
                attributes: record(string(), unknown()),
                file_id: string(),
                filename: string(),
                score: number(),
                text: string()
              })
            ).nullish()
          }),
          object({
            type: literal("local_shell_call"),
            id: string(),
            call_id: string(),
            action: object({
              type: literal("exec"),
              command: array(string()),
              timeout_ms: number().optional(),
              user: string().optional(),
              working_directory: string().optional(),
              env: record(string(), string()).optional()
            })
          }),
          object({
            type: literal("computer_call"),
            id: string(),
            status: literal("completed")
          })
        ])
      }),
      object({
        type: literal("response.function_call_arguments.delta"),
        item_id: string(),
        output_index: number(),
        delta: string()
      }),
      object({
        type: literal("response.image_generation_call.partial_image"),
        item_id: string(),
        output_index: number(),
        partial_image_b64: string()
      }),
      object({
        type: literal("response.code_interpreter_call_code.delta"),
        item_id: string(),
        output_index: number(),
        delta: string()
      }),
      object({
        type: literal("response.code_interpreter_call_code.done"),
        item_id: string(),
        output_index: number(),
        code: string()
      }),
      object({
        type: literal("response.output_text.annotation.added"),
        annotation: discriminatedUnion("type", [
          object({
            type: literal("url_citation"),
            url: string(),
            title: string()
          }),
          object({
            type: literal("file_citation"),
            file_id: string(),
            filename: string().nullish(),
            index: number().nullish(),
            start_index: number().nullish(),
            end_index: number().nullish(),
            quote: string().nullish()
          })
        ])
      }),
      object({
        type: literal("response.reasoning_summary_part.added"),
        item_id: string(),
        summary_index: number()
      }),
      object({
        type: literal("response.reasoning_summary_text.delta"),
        item_id: string(),
        summary_index: number(),
        delta: string()
      }),
      object({
        type: literal("response.reasoning_summary_part.done"),
        item_id: string(),
        summary_index: number()
      }),
      object({
        type: literal("error"),
        code: string(),
        message: string(),
        param: string().nullish(),
        sequence_number: number()
      }),
      object({ type: string() }).loose().transform((value) => ({
        type: "unknown_chunk",
        message: value.type
      }))
      // fallback for unknown chunks
    ])
  )
);
var openaiResponsesResponseSchema = lazyValidator(
  () => zodSchema(
    object({
      id: string(),
      created_at: number(),
      error: object({
        code: string(),
        message: string()
      }).nullish(),
      model: string(),
      output: array(
        discriminatedUnion("type", [
          object({
            type: literal("message"),
            role: literal("assistant"),
            id: string(),
            content: array(
              object({
                type: literal("output_text"),
                text: string(),
                logprobs: array(
                  object({
                    token: string(),
                    logprob: number(),
                    top_logprobs: array(
                      object({
                        token: string(),
                        logprob: number()
                      })
                    )
                  })
                ).nullish(),
                annotations: array(
                  discriminatedUnion("type", [
                    object({
                      type: literal("url_citation"),
                      start_index: number(),
                      end_index: number(),
                      url: string(),
                      title: string()
                    }),
                    object({
                      type: literal("file_citation"),
                      file_id: string(),
                      filename: string().nullish(),
                      index: number().nullish(),
                      start_index: number().nullish(),
                      end_index: number().nullish(),
                      quote: string().nullish()
                    }),
                    object({
                      type: literal("container_file_citation")
                    })
                  ])
                )
              })
            )
          }),
          object({
            type: literal("web_search_call"),
            id: string(),
            status: string(),
            action: discriminatedUnion("type", [
              object({
                type: literal("search"),
                query: string().nullish()
              }),
              object({
                type: literal("open_page"),
                url: string()
              }),
              object({
                type: literal("find"),
                url: string(),
                pattern: string()
              })
            ])
          }),
          object({
            type: literal("file_search_call"),
            id: string(),
            queries: array(string()),
            results: array(
              object({
                attributes: record(string(), unknown()),
                file_id: string(),
                filename: string(),
                score: number(),
                text: string()
              })
            ).nullish()
          }),
          object({
            type: literal("code_interpreter_call"),
            id: string(),
            code: string().nullable(),
            container_id: string(),
            outputs: array(
              discriminatedUnion("type", [
                object({ type: literal("logs"), logs: string() }),
                object({ type: literal("image"), url: string() })
              ])
            ).nullable()
          }),
          object({
            type: literal("image_generation_call"),
            id: string(),
            result: string()
          }),
          object({
            type: literal("local_shell_call"),
            id: string(),
            call_id: string(),
            action: object({
              type: literal("exec"),
              command: array(string()),
              timeout_ms: number().optional(),
              user: string().optional(),
              working_directory: string().optional(),
              env: record(string(), string()).optional()
            })
          }),
          object({
            type: literal("function_call"),
            call_id: string(),
            name: string(),
            arguments: string(),
            id: string()
          }),
          object({
            type: literal("computer_call"),
            id: string(),
            status: string().optional()
          }),
          object({
            type: literal("reasoning"),
            id: string(),
            encrypted_content: string().nullish(),
            summary: array(
              object({
                type: literal("summary_text"),
                text: string()
              })
            )
          })
        ])
      ),
      service_tier: string().nullish(),
      incomplete_details: object({ reason: string() }).nullish(),
      usage: object({
        input_tokens: number(),
        input_tokens_details: object({ cached_tokens: number().nullish() }).nullish(),
        output_tokens: number(),
        output_tokens_details: object({ reasoning_tokens: number().nullish() }).nullish()
      })
    })
  )
);
var TOP_LOGPROBS_MAX = 20;
var openaiResponsesProviderOptionsSchema = lazyValidator(
  () => zodSchema(
    object({
      include: array(
        _enum([
          "reasoning.encrypted_content",
          // handled internally by default, only needed for unknown reasoning models
          "file_search_call.results",
          "message.output_text.logprobs"
        ])
      ).nullish(),
      instructions: string().nullish(),
      /**
       * Return the log probabilities of the tokens.
       *
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       *
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       *
       * @see https://platform.openai.com/docs/api-reference/responses/create
       * @see https://cookbook.openai.com/examples/using_logprobs
       */
      logprobs: union([boolean(), number().min(1).max(TOP_LOGPROBS_MAX)]).optional(),
      /**
       * The maximum number of total calls to built-in tools that can be processed in a response.
       * This maximum number applies across all built-in tool calls, not per individual tool.
       * Any further attempts to call a tool by the model will be ignored.
       */
      maxToolCalls: number().nullish(),
      metadata: any().nullish(),
      parallelToolCalls: boolean().nullish(),
      previousResponseId: string().nullish(),
      promptCacheKey: string().nullish(),
      reasoningEffort: string().nullish(),
      reasoningSummary: string().nullish(),
      safetyIdentifier: string().nullish(),
      serviceTier: _enum(["auto", "flex", "priority", "default"]).nullish(),
      store: boolean().nullish(),
      strictJsonSchema: boolean().nullish(),
      textVerbosity: _enum(["low", "medium", "high"]).nullish(),
      truncation: _enum(["auto", "disabled"]).nullish(),
      user: string().nullish()
    })
  )
);
async function prepareResponsesTools({
  tools,
  toolChoice,
  strictJsonSchema
}) {
  tools = (tools == null ? void 0 : tools.length) ? tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, toolChoice: void 0, toolWarnings };
  }
  const openaiTools2 = [];
  for (const tool of tools) {
    switch (tool.type) {
      case "function":
        openaiTools2.push({
          type: "function",
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema,
          strict: strictJsonSchema
        });
        break;
      case "provider-defined": {
        switch (tool.id) {
          case "openai.file_search": {
            const args = await validateTypes$3({
              value: tool.args,
              schema: fileSearchArgsSchema
            });
            openaiTools2.push({
              type: "file_search",
              vector_store_ids: args.vectorStoreIds,
              max_num_results: args.maxNumResults,
              ranking_options: args.ranking ? {
                ranker: args.ranking.ranker,
                score_threshold: args.ranking.scoreThreshold
              } : void 0,
              filters: args.filters
            });
            break;
          }
          case "openai.local_shell": {
            openaiTools2.push({
              type: "local_shell"
            });
            break;
          }
          case "openai.web_search_preview": {
            const args = await validateTypes$3({
              value: tool.args,
              schema: webSearchPreviewArgsSchema
            });
            openaiTools2.push({
              type: "web_search_preview",
              search_context_size: args.searchContextSize,
              user_location: args.userLocation
            });
            break;
          }
          case "openai.web_search": {
            const args = await validateTypes$3({
              value: tool.args,
              schema: webSearchArgsSchema
            });
            openaiTools2.push({
              type: "web_search",
              filters: args.filters != null ? { allowed_domains: args.filters.allowedDomains } : void 0,
              search_context_size: args.searchContextSize,
              user_location: args.userLocation
            });
            break;
          }
          case "openai.code_interpreter": {
            const args = await validateTypes$3({
              value: tool.args,
              schema: codeInterpreterArgsSchema
            });
            openaiTools2.push({
              type: "code_interpreter",
              container: args.container == null ? { type: "auto", file_ids: void 0 } : typeof args.container === "string" ? args.container : { type: "auto", file_ids: args.container.fileIds }
            });
            break;
          }
          case "openai.image_generation": {
            const args = await validateTypes$3({
              value: tool.args,
              schema: imageGenerationArgsSchema
            });
            openaiTools2.push({
              type: "image_generation",
              background: args.background,
              input_fidelity: args.inputFidelity,
              input_image_mask: args.inputImageMask ? {
                file_id: args.inputImageMask.fileId,
                image_url: args.inputImageMask.imageUrl
              } : void 0,
              model: args.model,
              size: args.size,
              quality: args.quality,
              moderation: args.moderation,
              output_format: args.outputFormat,
              output_compression: args.outputCompression
            });
            break;
          }
        }
        break;
      }
      default:
        toolWarnings.push({ type: "unsupported-tool", tool });
        break;
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools2, toolChoice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools2, toolChoice: type, toolWarnings };
    case "tool":
      return {
        tools: openaiTools2,
        toolChoice: toolChoice.toolName === "code_interpreter" || toolChoice.toolName === "file_search" || toolChoice.toolName === "image_generation" || toolChoice.toolName === "web_search_preview" || toolChoice.toolName === "web_search" ? { type: toolChoice.toolName } : { type: "function", name: toolChoice.toolName },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError$2({
        functionality: `tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}

// src/responses/openai-responses-language-model.ts
var OpenAIResponsesLanguageModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    this.supportedUrls = {
      "image/*": [/^https?:\/\/.*$/],
      "application/pdf": [/^https?:\/\/.*$/]
    };
    this.modelId = modelId;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    maxOutputTokens,
    temperature,
    stopSequences,
    topP,
    topK,
    presencePenalty,
    frequencyPenalty,
    seed,
    prompt,
    providerOptions,
    tools,
    toolChoice,
    responseFormat
  }) {
    var _a, _b, _c, _d;
    const warnings = [];
    const modelConfig = getResponsesModelConfig(this.modelId);
    if (topK != null) {
      warnings.push({ type: "unsupported-setting", setting: "topK" });
    }
    if (seed != null) {
      warnings.push({ type: "unsupported-setting", setting: "seed" });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (stopSequences != null) {
      warnings.push({ type: "unsupported-setting", setting: "stopSequences" });
    }
    const openaiOptions = await parseProviderOptions$1({
      provider: "openai",
      providerOptions,
      schema: openaiResponsesProviderOptionsSchema
    });
    const { input, warnings: inputWarnings } = await convertToOpenAIResponsesInput({
      prompt,
      systemMessageMode: modelConfig.systemMessageMode,
      fileIdPrefixes: this.config.fileIdPrefixes,
      store: (_a = openaiOptions == null ? void 0 : openaiOptions.store) != null ? _a : true,
      hasLocalShellTool: hasOpenAITool("openai.local_shell")
    });
    warnings.push(...inputWarnings);
    const strictJsonSchema = (_b = openaiOptions == null ? void 0 : openaiOptions.strictJsonSchema) != null ? _b : false;
    let include = openaiOptions == null ? void 0 : openaiOptions.include;
    function addInclude(key) {
      if (include == null) {
        include = [key];
      } else if (!include.includes(key)) {
        include = [...include, key];
      }
    }
    function hasOpenAITool(id) {
      return (tools == null ? void 0 : tools.find(
        (tool) => tool.type === "provider-defined" && tool.id === id
      )) != null;
    }
    const topLogprobs = typeof (openaiOptions == null ? void 0 : openaiOptions.logprobs) === "number" ? openaiOptions == null ? void 0 : openaiOptions.logprobs : (openaiOptions == null ? void 0 : openaiOptions.logprobs) === true ? TOP_LOGPROBS_MAX : void 0;
    if (topLogprobs) {
      addInclude("message.output_text.logprobs");
    }
    const webSearchToolName = (_c = tools == null ? void 0 : tools.find(
      (tool) => tool.type === "provider-defined" && (tool.id === "openai.web_search" || tool.id === "openai.web_search_preview")
    )) == null ? void 0 : _c.name;
    if (webSearchToolName) {
      addInclude("web_search_call.action.sources");
    }
    if (hasOpenAITool("openai.code_interpreter")) {
      addInclude("code_interpreter_call.outputs");
    }
    const store = openaiOptions == null ? void 0 : openaiOptions.store;
    if (store === false && modelConfig.isReasoningModel) {
      addInclude("reasoning.encrypted_content");
    }
    const baseArgs = {
      model: this.modelId,
      input,
      temperature,
      top_p: topP,
      max_output_tokens: maxOutputTokens,
      ...((responseFormat == null ? void 0 : responseFormat.type) === "json" || (openaiOptions == null ? void 0 : openaiOptions.textVerbosity)) && {
        text: {
          ...(responseFormat == null ? void 0 : responseFormat.type) === "json" && {
            format: responseFormat.schema != null ? {
              type: "json_schema",
              strict: strictJsonSchema,
              name: (_d = responseFormat.name) != null ? _d : "response",
              description: responseFormat.description,
              schema: responseFormat.schema
            } : { type: "json_object" }
          },
          ...(openaiOptions == null ? void 0 : openaiOptions.textVerbosity) && {
            verbosity: openaiOptions.textVerbosity
          }
        }
      },
      // provider options:
      max_tool_calls: openaiOptions == null ? void 0 : openaiOptions.maxToolCalls,
      metadata: openaiOptions == null ? void 0 : openaiOptions.metadata,
      parallel_tool_calls: openaiOptions == null ? void 0 : openaiOptions.parallelToolCalls,
      previous_response_id: openaiOptions == null ? void 0 : openaiOptions.previousResponseId,
      store,
      user: openaiOptions == null ? void 0 : openaiOptions.user,
      instructions: openaiOptions == null ? void 0 : openaiOptions.instructions,
      service_tier: openaiOptions == null ? void 0 : openaiOptions.serviceTier,
      include,
      prompt_cache_key: openaiOptions == null ? void 0 : openaiOptions.promptCacheKey,
      safety_identifier: openaiOptions == null ? void 0 : openaiOptions.safetyIdentifier,
      top_logprobs: topLogprobs,
      truncation: openaiOptions == null ? void 0 : openaiOptions.truncation,
      // model-specific settings:
      ...modelConfig.isReasoningModel && ((openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null || (openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null) && {
        reasoning: {
          ...(openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null && {
            effort: openaiOptions.reasoningEffort
          },
          ...(openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null && {
            summary: openaiOptions.reasoningSummary
          }
        }
      }
    };
    if (modelConfig.isReasoningModel) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for reasoning models"
        });
      }
      if (baseArgs.top_p != null) {
        baseArgs.top_p = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topP",
          details: "topP is not supported for reasoning models"
        });
      }
    } else {
      if ((openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "reasoningEffort",
          details: "reasoningEffort is not supported for non-reasoning models"
        });
      }
      if ((openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "reasoningSummary",
          details: "reasoningSummary is not supported for non-reasoning models"
        });
      }
    }
    if ((openaiOptions == null ? void 0 : openaiOptions.serviceTier) === "flex" && !modelConfig.supportsFlexProcessing) {
      warnings.push({
        type: "unsupported-setting",
        setting: "serviceTier",
        details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
      });
      delete baseArgs.service_tier;
    }
    if ((openaiOptions == null ? void 0 : openaiOptions.serviceTier) === "priority" && !modelConfig.supportsPriorityProcessing) {
      warnings.push({
        type: "unsupported-setting",
        setting: "serviceTier",
        details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
      });
      delete baseArgs.service_tier;
    }
    const {
      tools: openaiTools2,
      toolChoice: openaiToolChoice,
      toolWarnings
    } = await prepareResponsesTools({
      tools,
      toolChoice,
      strictJsonSchema
    });
    return {
      webSearchToolName,
      args: {
        ...baseArgs,
        tools: openaiTools2,
        tool_choice: openaiToolChoice
      },
      warnings: [...warnings, ...toolWarnings],
      store
    };
  }
  async doGenerate(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
    const {
      args: body,
      warnings,
      webSearchToolName
    } = await this.getArgs(options);
    const url = this.config.url({
      path: "/responses",
      modelId: this.modelId
    });
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi$3({
      url,
      headers: combineHeaders$3(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$3(
        openaiResponsesResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    if (response.error) {
      throw new APICallError$3({
        message: response.error.message,
        url,
        requestBodyValues: body,
        statusCode: 400,
        responseHeaders,
        responseBody: rawResponse,
        isRetryable: false
      });
    }
    const content = [];
    const logprobs = [];
    let hasFunctionCall = false;
    for (const part of response.output) {
      switch (part.type) {
        case "reasoning": {
          if (part.summary.length === 0) {
            part.summary.push({ type: "summary_text", text: "" });
          }
          for (const summary of part.summary) {
            content.push({
              type: "reasoning",
              text: summary.text,
              providerMetadata: {
                openai: {
                  itemId: part.id,
                  reasoningEncryptedContent: (_a = part.encrypted_content) != null ? _a : null
                }
              }
            });
          }
          break;
        }
        case "image_generation_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.id,
            toolName: "image_generation",
            input: "{}",
            providerExecuted: true
          });
          content.push({
            type: "tool-result",
            toolCallId: part.id,
            toolName: "image_generation",
            result: {
              result: part.result
            },
            providerExecuted: true
          });
          break;
        }
        case "local_shell_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.call_id,
            toolName: "local_shell",
            input: JSON.stringify({
              action: part.action
            }),
            providerMetadata: {
              openai: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "message": {
          for (const contentPart of part.content) {
            if (((_c = (_b = options.providerOptions) == null ? void 0 : _b.openai) == null ? void 0 : _c.logprobs) && contentPart.logprobs) {
              logprobs.push(contentPart.logprobs);
            }
            content.push({
              type: "text",
              text: contentPart.text,
              providerMetadata: {
                openai: {
                  itemId: part.id
                }
              }
            });
            for (const annotation of contentPart.annotations) {
              if (annotation.type === "url_citation") {
                content.push({
                  type: "source",
                  sourceType: "url",
                  id: (_f = (_e = (_d = this.config).generateId) == null ? void 0 : _e.call(_d)) != null ? _f : generateId$2(),
                  url: annotation.url,
                  title: annotation.title
                });
              } else if (annotation.type === "file_citation") {
                content.push({
                  type: "source",
                  sourceType: "document",
                  id: (_i = (_h = (_g = this.config).generateId) == null ? void 0 : _h.call(_g)) != null ? _i : generateId$2(),
                  mediaType: "text/plain",
                  title: (_k = (_j = annotation.quote) != null ? _j : annotation.filename) != null ? _k : "Document",
                  filename: (_l = annotation.filename) != null ? _l : annotation.file_id
                });
              }
            }
          }
          break;
        }
        case "function_call": {
          hasFunctionCall = true;
          content.push({
            type: "tool-call",
            toolCallId: part.call_id,
            toolName: part.name,
            input: part.arguments,
            providerMetadata: {
              openai: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "web_search_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.id,
            toolName: webSearchToolName != null ? webSearchToolName : "web_search",
            input: JSON.stringify({}),
            providerExecuted: true
          });
          content.push({
            type: "tool-result",
            toolCallId: part.id,
            toolName: webSearchToolName != null ? webSearchToolName : "web_search",
            result: mapWebSearchOutput(part.action),
            providerExecuted: true
          });
          break;
        }
        case "computer_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.id,
            toolName: "computer_use",
            input: "",
            providerExecuted: true
          });
          content.push({
            type: "tool-result",
            toolCallId: part.id,
            toolName: "computer_use",
            result: {
              type: "computer_use_tool_result",
              status: part.status || "completed"
            },
            providerExecuted: true
          });
          break;
        }
        case "file_search_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.id,
            toolName: "file_search",
            input: "{}",
            providerExecuted: true
          });
          content.push({
            type: "tool-result",
            toolCallId: part.id,
            toolName: "file_search",
            result: {
              queries: part.queries,
              results: (_n = (_m = part.results) == null ? void 0 : _m.map((result) => ({
                attributes: result.attributes,
                fileId: result.file_id,
                filename: result.filename,
                score: result.score,
                text: result.text
              }))) != null ? _n : null
            },
            providerExecuted: true
          });
          break;
        }
        case "code_interpreter_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.id,
            toolName: "code_interpreter",
            input: JSON.stringify({
              code: part.code,
              containerId: part.container_id
            }),
            providerExecuted: true
          });
          content.push({
            type: "tool-result",
            toolCallId: part.id,
            toolName: "code_interpreter",
            result: {
              outputs: part.outputs
            },
            providerExecuted: true
          });
          break;
        }
      }
    }
    const providerMetadata = {
      openai: { responseId: response.id }
    };
    if (logprobs.length > 0) {
      providerMetadata.openai.logprobs = logprobs;
    }
    if (typeof response.service_tier === "string") {
      providerMetadata.openai.serviceTier = response.service_tier;
    }
    return {
      content,
      finishReason: mapOpenAIResponseFinishReason({
        finishReason: (_o = response.incomplete_details) == null ? void 0 : _o.reason,
        hasFunctionCall
      }),
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        reasoningTokens: (_q = (_p = response.usage.output_tokens_details) == null ? void 0 : _p.reasoning_tokens) != null ? _q : void 0,
        cachedInputTokens: (_s = (_r = response.usage.input_tokens_details) == null ? void 0 : _r.cached_tokens) != null ? _s : void 0
      },
      request: { body },
      response: {
        id: response.id,
        timestamp: new Date(response.created_at * 1e3),
        modelId: response.model,
        headers: responseHeaders,
        body: rawResponse
      },
      providerMetadata,
      warnings
    };
  }
  async doStream(options) {
    const {
      args: body,
      warnings,
      webSearchToolName,
      store
    } = await this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi$3({
      url: this.config.url({
        path: "/responses",
        modelId: this.modelId
      }),
      headers: combineHeaders$3(this.config.headers(), options.headers),
      body: {
        ...body,
        stream: true
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler$2(
        openaiResponsesChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const self = this;
    let finishReason = "unknown";
    const usage = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    const logprobs = [];
    let responseId = null;
    const ongoingToolCalls = {};
    let hasFunctionCall = false;
    const activeReasoning = {};
    let serviceTier;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if (isResponseOutputItemAddedChunk(value)) {
              if (value.item.type === "function_call") {
                ongoingToolCalls[value.output_index] = {
                  toolName: value.item.name,
                  toolCallId: value.item.call_id
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: value.item.call_id,
                  toolName: value.item.name
                });
              } else if (value.item.type === "web_search_call") {
                ongoingToolCalls[value.output_index] = {
                  toolName: webSearchToolName != null ? webSearchToolName : "web_search",
                  toolCallId: value.item.id
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: value.item.id,
                  toolName: webSearchToolName != null ? webSearchToolName : "web_search",
                  providerExecuted: true
                });
                controller.enqueue({
                  type: "tool-input-end",
                  id: value.item.id
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.id,
                  toolName: "web_search",
                  input: JSON.stringify({}),
                  providerExecuted: true
                });
              } else if (value.item.type === "computer_call") {
                ongoingToolCalls[value.output_index] = {
                  toolName: "computer_use",
                  toolCallId: value.item.id
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: value.item.id,
                  toolName: "computer_use",
                  providerExecuted: true
                });
              } else if (value.item.type === "code_interpreter_call") {
                ongoingToolCalls[value.output_index] = {
                  toolName: "code_interpreter",
                  toolCallId: value.item.id,
                  codeInterpreter: {
                    containerId: value.item.container_id
                  }
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: value.item.id,
                  toolName: "code_interpreter",
                  providerExecuted: true
                });
                controller.enqueue({
                  type: "tool-input-delta",
                  id: value.item.id,
                  delta: `{"containerId":"${value.item.container_id}","code":"`
                });
              } else if (value.item.type === "file_search_call") {
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.id,
                  toolName: "file_search",
                  input: "{}",
                  providerExecuted: true
                });
              } else if (value.item.type === "image_generation_call") {
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.id,
                  toolName: "image_generation",
                  input: "{}",
                  providerExecuted: true
                });
              } else if (value.item.type === "message") {
                controller.enqueue({
                  type: "text-start",
                  id: value.item.id,
                  providerMetadata: {
                    openai: {
                      itemId: value.item.id
                    }
                  }
                });
              } else if (isResponseOutputItemAddedChunk(value) && value.item.type === "reasoning") {
                activeReasoning[value.item.id] = {
                  encryptedContent: value.item.encrypted_content,
                  summaryParts: { 0: "active" }
                };
                controller.enqueue({
                  type: "reasoning-start",
                  id: `${value.item.id}:0`,
                  providerMetadata: {
                    openai: {
                      itemId: value.item.id,
                      reasoningEncryptedContent: (_a = value.item.encrypted_content) != null ? _a : null
                    }
                  }
                });
              }
            } else if (isResponseOutputItemDoneChunk(value)) {
              if (value.item.type === "function_call") {
                ongoingToolCalls[value.output_index] = void 0;
                hasFunctionCall = true;
                controller.enqueue({
                  type: "tool-input-end",
                  id: value.item.call_id
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.call_id,
                  toolName: value.item.name,
                  input: value.item.arguments,
                  providerMetadata: {
                    openai: {
                      itemId: value.item.id
                    }
                  }
                });
              } else if (value.item.type === "web_search_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.id,
                  toolName: "web_search",
                  result: mapWebSearchOutput(value.item.action),
                  providerExecuted: true
                });
              } else if (value.item.type === "computer_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-input-end",
                  id: value.item.id
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.id,
                  toolName: "computer_use",
                  input: "",
                  providerExecuted: true
                });
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.id,
                  toolName: "computer_use",
                  result: {
                    type: "computer_use_tool_result",
                    status: value.item.status || "completed"
                  },
                  providerExecuted: true
                });
              } else if (value.item.type === "file_search_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.id,
                  toolName: "file_search",
                  result: {
                    queries: value.item.queries,
                    results: (_c = (_b = value.item.results) == null ? void 0 : _b.map((result) => ({
                      attributes: result.attributes,
                      fileId: result.file_id,
                      filename: result.filename,
                      score: result.score,
                      text: result.text
                    }))) != null ? _c : null
                  },
                  providerExecuted: true
                });
              } else if (value.item.type === "code_interpreter_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.id,
                  toolName: "code_interpreter",
                  result: {
                    outputs: value.item.outputs
                  },
                  providerExecuted: true
                });
              } else if (value.item.type === "image_generation_call") {
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.id,
                  toolName: "image_generation",
                  result: {
                    result: value.item.result
                  },
                  providerExecuted: true
                });
              } else if (value.item.type === "local_shell_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.call_id,
                  toolName: "local_shell",
                  input: JSON.stringify({
                    action: {
                      type: "exec",
                      command: value.item.action.command,
                      timeoutMs: value.item.action.timeout_ms,
                      user: value.item.action.user,
                      workingDirectory: value.item.action.working_directory,
                      env: value.item.action.env
                    }
                  }),
                  providerMetadata: {
                    openai: { itemId: value.item.id }
                  }
                });
              } else if (value.item.type === "message") {
                controller.enqueue({
                  type: "text-end",
                  id: value.item.id
                });
              } else if (value.item.type === "reasoning") {
                const activeReasoningPart = activeReasoning[value.item.id];
                const summaryPartIndices = Object.entries(
                  activeReasoningPart.summaryParts
                ).filter(
                  ([_, status]) => status === "active" || status === "can-conclude"
                ).map(([summaryIndex]) => summaryIndex);
                for (const summaryIndex of summaryPartIndices) {
                  controller.enqueue({
                    type: "reasoning-end",
                    id: `${value.item.id}:${summaryIndex}`,
                    providerMetadata: {
                      openai: {
                        itemId: value.item.id,
                        reasoningEncryptedContent: (_d = value.item.encrypted_content) != null ? _d : null
                      }
                    }
                  });
                }
                delete activeReasoning[value.item.id];
              }
            } else if (isResponseFunctionCallArgumentsDeltaChunk(value)) {
              const toolCall = ongoingToolCalls[value.output_index];
              if (toolCall != null) {
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.toolCallId,
                  delta: value.delta
                });
              }
            } else if (isResponseCodeInterpreterCallCodeDeltaChunk(value)) {
              const toolCall = ongoingToolCalls[value.output_index];
              if (toolCall != null) {
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.toolCallId,
                  // The delta is code, which is embedding in a JSON string.
                  // To escape it, we use JSON.stringify and slice to remove the outer quotes.
                  delta: JSON.stringify(value.delta).slice(1, -1)
                });
              }
            } else if (isResponseCodeInterpreterCallCodeDoneChunk(value)) {
              const toolCall = ongoingToolCalls[value.output_index];
              if (toolCall != null) {
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.toolCallId,
                  delta: '"}'
                });
                controller.enqueue({
                  type: "tool-input-end",
                  id: toolCall.toolCallId
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: toolCall.toolCallId,
                  toolName: "code_interpreter",
                  input: JSON.stringify({
                    code: value.code,
                    containerId: toolCall.codeInterpreter.containerId
                  }),
                  providerExecuted: true
                });
              }
            } else if (isResponseCreatedChunk(value)) {
              responseId = value.response.id;
              controller.enqueue({
                type: "response-metadata",
                id: value.response.id,
                timestamp: new Date(value.response.created_at * 1e3),
                modelId: value.response.model
              });
            } else if (isTextDeltaChunk(value)) {
              controller.enqueue({
                type: "text-delta",
                id: value.item_id,
                delta: value.delta
              });
              if (((_f = (_e = options.providerOptions) == null ? void 0 : _e.openai) == null ? void 0 : _f.logprobs) && value.logprobs) {
                logprobs.push(value.logprobs);
              }
            } else if (value.type === "response.reasoning_summary_part.added") {
              if (value.summary_index > 0) {
                const activeReasoningPart = activeReasoning[value.item_id];
                activeReasoningPart.summaryParts[value.summary_index] = "active";
                for (const summaryIndex of Object.keys(
                  activeReasoningPart.summaryParts
                )) {
                  if (activeReasoningPart.summaryParts[summaryIndex] === "can-conclude") {
                    controller.enqueue({
                      type: "reasoning-end",
                      id: `${value.item_id}:${summaryIndex}`,
                      providerMetadata: { openai: { itemId: value.item_id } }
                    });
                    activeReasoningPart.summaryParts[summaryIndex] = "concluded";
                  }
                }
                controller.enqueue({
                  type: "reasoning-start",
                  id: `${value.item_id}:${value.summary_index}`,
                  providerMetadata: {
                    openai: {
                      itemId: value.item_id,
                      reasoningEncryptedContent: (_h = (_g = activeReasoning[value.item_id]) == null ? void 0 : _g.encryptedContent) != null ? _h : null
                    }
                  }
                });
              }
            } else if (value.type === "response.reasoning_summary_text.delta") {
              controller.enqueue({
                type: "reasoning-delta",
                id: `${value.item_id}:${value.summary_index}`,
                delta: value.delta,
                providerMetadata: {
                  openai: {
                    itemId: value.item_id
                  }
                }
              });
            } else if (value.type === "response.reasoning_summary_part.done") {
              if (store) {
                controller.enqueue({
                  type: "reasoning-end",
                  id: `${value.item_id}:${value.summary_index}`,
                  providerMetadata: {
                    openai: { itemId: value.item_id }
                  }
                });
                activeReasoning[value.item_id].summaryParts[value.summary_index] = "concluded";
              } else {
                activeReasoning[value.item_id].summaryParts[value.summary_index] = "can-conclude";
              }
            } else if (isResponseFinishedChunk(value)) {
              finishReason = mapOpenAIResponseFinishReason({
                finishReason: (_i = value.response.incomplete_details) == null ? void 0 : _i.reason,
                hasFunctionCall
              });
              usage.inputTokens = value.response.usage.input_tokens;
              usage.outputTokens = value.response.usage.output_tokens;
              usage.totalTokens = value.response.usage.input_tokens + value.response.usage.output_tokens;
              usage.reasoningTokens = (_k = (_j = value.response.usage.output_tokens_details) == null ? void 0 : _j.reasoning_tokens) != null ? _k : void 0;
              usage.cachedInputTokens = (_m = (_l = value.response.usage.input_tokens_details) == null ? void 0 : _l.cached_tokens) != null ? _m : void 0;
              if (typeof value.response.service_tier === "string") {
                serviceTier = value.response.service_tier;
              }
            } else if (isResponseAnnotationAddedChunk(value)) {
              if (value.annotation.type === "url_citation") {
                controller.enqueue({
                  type: "source",
                  sourceType: "url",
                  id: (_p = (_o = (_n = self.config).generateId) == null ? void 0 : _o.call(_n)) != null ? _p : generateId$2(),
                  url: value.annotation.url,
                  title: value.annotation.title
                });
              } else if (value.annotation.type === "file_citation") {
                controller.enqueue({
                  type: "source",
                  sourceType: "document",
                  id: (_s = (_r = (_q = self.config).generateId) == null ? void 0 : _r.call(_q)) != null ? _s : generateId$2(),
                  mediaType: "text/plain",
                  title: (_u = (_t = value.annotation.quote) != null ? _t : value.annotation.filename) != null ? _u : "Document",
                  filename: (_v = value.annotation.filename) != null ? _v : value.annotation.file_id
                });
              }
            } else if (isErrorChunk(value)) {
              controller.enqueue({ type: "error", error: value });
            }
          },
          flush(controller) {
            const providerMetadata = {
              openai: {
                responseId
              }
            };
            if (logprobs.length > 0) {
              providerMetadata.openai.logprobs = logprobs;
            }
            if (serviceTier !== void 0) {
              providerMetadata.openai.serviceTier = serviceTier;
            }
            controller.enqueue({
              type: "finish",
              finishReason,
              usage,
              providerMetadata
            });
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
  }
};
function isTextDeltaChunk(chunk) {
  return chunk.type === "response.output_text.delta";
}
function isResponseOutputItemDoneChunk(chunk) {
  return chunk.type === "response.output_item.done";
}
function isResponseFinishedChunk(chunk) {
  return chunk.type === "response.completed" || chunk.type === "response.incomplete";
}
function isResponseCreatedChunk(chunk) {
  return chunk.type === "response.created";
}
function isResponseFunctionCallArgumentsDeltaChunk(chunk) {
  return chunk.type === "response.function_call_arguments.delta";
}
function isResponseCodeInterpreterCallCodeDeltaChunk(chunk) {
  return chunk.type === "response.code_interpreter_call_code.delta";
}
function isResponseCodeInterpreterCallCodeDoneChunk(chunk) {
  return chunk.type === "response.code_interpreter_call_code.done";
}
function isResponseOutputItemAddedChunk(chunk) {
  return chunk.type === "response.output_item.added";
}
function isResponseAnnotationAddedChunk(chunk) {
  return chunk.type === "response.output_text.annotation.added";
}
function isErrorChunk(chunk) {
  return chunk.type === "error";
}
function getResponsesModelConfig(modelId) {
  const supportsFlexProcessing2 = modelId.startsWith("o3") || modelId.startsWith("o4-mini") || modelId.startsWith("gpt-5") && !modelId.startsWith("gpt-5-chat");
  const supportsPriorityProcessing2 = modelId.startsWith("gpt-4") || modelId.startsWith("gpt-5-mini") || modelId.startsWith("gpt-5") && !modelId.startsWith("gpt-5-nano") && !modelId.startsWith("gpt-5-chat") || modelId.startsWith("o3") || modelId.startsWith("o4-mini");
  const defaults = {
    systemMessageMode: "system",
    supportsFlexProcessing: supportsFlexProcessing2,
    supportsPriorityProcessing: supportsPriorityProcessing2
  };
  if (modelId.startsWith("gpt-5-chat")) {
    return {
      ...defaults,
      isReasoningModel: false
    };
  }
  if (modelId.startsWith("o") || modelId.startsWith("gpt-5") || modelId.startsWith("codex-") || modelId.startsWith("computer-use")) {
    if (modelId.startsWith("o1-mini") || modelId.startsWith("o1-preview")) {
      return {
        ...defaults,
        isReasoningModel: true,
        systemMessageMode: "remove"
      };
    }
    return {
      ...defaults,
      isReasoningModel: true,
      systemMessageMode: "developer"
    };
  }
  return {
    ...defaults,
    isReasoningModel: false
  };
}
function mapWebSearchOutput(action) {
  var _a;
  switch (action.type) {
    case "search":
      return { action: { type: "search", query: (_a = action.query) != null ? _a : void 0 } };
    case "open_page":
      return { action: { type: "openPage", url: action.url } };
    case "find":
      return {
        action: { type: "find", url: action.url, pattern: action.pattern }
      };
  }
}
var openaiSpeechProviderOptionsSchema = lazyValidator(
  () => zodSchema(
    object({
      instructions: string().nullish(),
      speed: number().min(0.25).max(4).default(1).nullish()
    })
  )
);

// src/speech/openai-speech-model.ts
var OpenAISpeechModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v2";
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    text,
    voice = "alloy",
    outputFormat = "mp3",
    speed,
    instructions,
    language,
    providerOptions
  }) {
    const warnings = [];
    const openAIOptions = await parseProviderOptions$1({
      provider: "openai",
      providerOptions,
      schema: openaiSpeechProviderOptionsSchema
    });
    const requestBody = {
      model: this.modelId,
      input: text,
      voice,
      response_format: "mp3",
      speed,
      instructions
    };
    if (outputFormat) {
      if (["mp3", "opus", "aac", "flac", "wav", "pcm"].includes(outputFormat)) {
        requestBody.response_format = outputFormat;
      } else {
        warnings.push({
          type: "unsupported-setting",
          setting: "outputFormat",
          details: `Unsupported output format: ${outputFormat}. Using mp3 instead.`
        });
      }
    }
    if (openAIOptions) {
      const speechModelOptions = {};
      for (const key in speechModelOptions) {
        const value = speechModelOptions[key];
        if (value !== void 0) {
          requestBody[key] = value;
        }
      }
    }
    if (language) {
      warnings.push({
        type: "unsupported-setting",
        setting: "language",
        details: `OpenAI speech models do not support language selection. Language parameter "${language}" was ignored.`
      });
    }
    return {
      requestBody,
      warnings
    };
  }
  async doGenerate(options) {
    var _a, _b, _c;
    const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
    const { requestBody, warnings } = await this.getArgs(options);
    const {
      value: audio,
      responseHeaders,
      rawValue: rawResponse
    } = await postJsonToApi$3({
      url: this.config.url({
        path: "/audio/speech",
        modelId: this.modelId
      }),
      headers: combineHeaders$3(this.config.headers(), options.headers),
      body: requestBody,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createBinaryResponseHandler(),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    return {
      audio,
      warnings,
      request: {
        body: JSON.stringify(requestBody)
      },
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders,
        body: rawResponse
      }
    };
  }
};
var openaiTranscriptionResponseSchema = lazyValidator(
  () => zodSchema(
    object({
      text: string(),
      language: string().nullish(),
      duration: number().nullish(),
      words: array(
        object({
          word: string(),
          start: number(),
          end: number()
        })
      ).nullish(),
      segments: array(
        object({
          id: number(),
          seek: number(),
          start: number(),
          end: number(),
          text: string(),
          tokens: array(number()),
          temperature: number(),
          avg_logprob: number(),
          compression_ratio: number(),
          no_speech_prob: number()
        })
      ).nullish()
    })
  )
);
var openAITranscriptionProviderOptions = lazyValidator(
  () => zodSchema(
    object({
      /**
       * Additional information to include in the transcription response.
       */
      include: array(string()).optional(),
      /**
       * The language of the input audio in ISO-639-1 format.
       */
      language: string().optional(),
      /**
       * An optional text to guide the model's style or continue a previous audio segment.
       */
      prompt: string().optional(),
      /**
       * The sampling temperature, between 0 and 1.
       * @default 0
       */
      temperature: number().min(0).max(1).default(0).optional(),
      /**
       * The timestamp granularities to populate for this transcription.
       * @default ['segment']
       */
      timestampGranularities: array(_enum(["word", "segment"])).default(["segment"]).optional()
    })
  )
);

// src/transcription/openai-transcription-model.ts
var languageMap = {
  afrikaans: "af",
  arabic: "ar",
  armenian: "hy",
  azerbaijani: "az",
  belarusian: "be",
  bosnian: "bs",
  bulgarian: "bg",
  catalan: "ca",
  chinese: "zh",
  croatian: "hr",
  czech: "cs",
  danish: "da",
  dutch: "nl",
  english: "en",
  estonian: "et",
  finnish: "fi",
  french: "fr",
  galician: "gl",
  german: "de",
  greek: "el",
  hebrew: "he",
  hindi: "hi",
  hungarian: "hu",
  icelandic: "is",
  indonesian: "id",
  italian: "it",
  japanese: "ja",
  kannada: "kn",
  kazakh: "kk",
  korean: "ko",
  latvian: "lv",
  lithuanian: "lt",
  macedonian: "mk",
  malay: "ms",
  marathi: "mr",
  maori: "mi",
  nepali: "ne",
  norwegian: "no",
  persian: "fa",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "sr",
  slovak: "sk",
  slovenian: "sl",
  spanish: "es",
  swahili: "sw",
  swedish: "sv",
  tagalog: "tl",
  tamil: "ta",
  thai: "th",
  turkish: "tr",
  ukrainian: "uk",
  urdu: "ur",
  vietnamese: "vi",
  welsh: "cy"
};
var OpenAITranscriptionModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v2";
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    audio,
    mediaType,
    providerOptions
  }) {
    const warnings = [];
    const openAIOptions = await parseProviderOptions$1({
      provider: "openai",
      providerOptions,
      schema: openAITranscriptionProviderOptions
    });
    const formData = new FormData();
    const blob = audio instanceof Uint8Array ? new Blob([audio]) : new Blob([convertBase64ToUint8Array(audio)]);
    formData.append("model", this.modelId);
    const fileExtension = mediaTypeToExtension(mediaType);
    formData.append(
      "file",
      new File([blob], "audio", { type: mediaType }),
      `audio.${fileExtension}`
    );
    if (openAIOptions) {
      const transcriptionModelOptions = {
        include: openAIOptions.include,
        language: openAIOptions.language,
        prompt: openAIOptions.prompt,
        // https://platform.openai.com/docs/api-reference/audio/createTranscription#audio_createtranscription-response_format
        // prefer verbose_json to get segments for models that support it
        response_format: [
          "gpt-4o-transcribe",
          "gpt-4o-mini-transcribe"
        ].includes(this.modelId) ? "json" : "verbose_json",
        temperature: openAIOptions.temperature,
        timestamp_granularities: openAIOptions.timestampGranularities
      };
      for (const [key, value] of Object.entries(transcriptionModelOptions)) {
        if (value != null) {
          if (Array.isArray(value)) {
            for (const item of value) {
              formData.append(`${key}[]`, String(item));
            }
          } else {
            formData.append(key, String(value));
          }
        }
      }
    }
    return {
      formData,
      warnings
    };
  }
  async doGenerate(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
    const { formData, warnings } = await this.getArgs(options);
    const {
      value: response,
      responseHeaders,
      rawValue: rawResponse
    } = await postFormDataToApi({
      url: this.config.url({
        path: "/audio/transcriptions",
        modelId: this.modelId
      }),
      headers: combineHeaders$3(this.config.headers(), options.headers),
      formData,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$3(
        openaiTranscriptionResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const language = response.language != null && response.language in languageMap ? languageMap[response.language] : void 0;
    return {
      text: response.text,
      segments: (_g = (_f = (_d = response.segments) == null ? void 0 : _d.map((segment) => ({
        text: segment.text,
        startSecond: segment.start,
        endSecond: segment.end
      }))) != null ? _f : (_e = response.words) == null ? void 0 : _e.map((word) => ({
        text: word.word,
        startSecond: word.start,
        endSecond: word.end
      }))) != null ? _g : [],
      language,
      durationInSeconds: (_h = response.duration) != null ? _h : void 0,
      warnings,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders,
        body: rawResponse
      }
    };
  }
};

// src/version.ts
var VERSION$3 = "2.0.53" ;

// src/openai-provider.ts
function createOpenAI(options = {}) {
  var _a, _b;
  const baseURL = (_a = withoutTrailingSlash$2(
    loadOptionalSetting({
      settingValue: options.baseURL,
      environmentVariableName: "OPENAI_BASE_URL"
    })
  )) != null ? _a : "https://api.openai.com/v1";
  const providerName = (_b = options.name) != null ? _b : "openai";
  const getHeaders = () => withUserAgentSuffix$2(
    {
      Authorization: `Bearer ${loadApiKey$2({
        apiKey: options.apiKey,
        environmentVariableName: "OPENAI_API_KEY",
        description: "OpenAI"
      })}`,
      "OpenAI-Organization": options.organization,
      "OpenAI-Project": options.project,
      ...options.headers
    },
    `ai-sdk/openai/${VERSION$3}`
  );
  const createChatModel = (modelId) => new OpenAIChatLanguageModel(modelId, {
    provider: `${providerName}.chat`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createCompletionModel = (modelId) => new OpenAICompletionLanguageModel(modelId, {
    provider: `${providerName}.completion`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createEmbeddingModel = (modelId) => new OpenAIEmbeddingModel(modelId, {
    provider: `${providerName}.embedding`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createImageModel = (modelId) => new OpenAIImageModel(modelId, {
    provider: `${providerName}.image`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createTranscriptionModel = (modelId) => new OpenAITranscriptionModel(modelId, {
    provider: `${providerName}.transcription`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createSpeechModel = (modelId) => new OpenAISpeechModel(modelId, {
    provider: `${providerName}.speech`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createLanguageModel = (modelId) => {
    if (new.target) {
      throw new Error(
        "The OpenAI model function cannot be called with the new keyword."
      );
    }
    return createResponsesModel(modelId);
  };
  const createResponsesModel = (modelId) => {
    return new OpenAIResponsesLanguageModel(modelId, {
      provider: `${providerName}.responses`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch,
      fileIdPrefixes: ["file-"]
    });
  };
  const provider = function(modelId) {
    return createLanguageModel(modelId);
  };
  provider.languageModel = createLanguageModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  provider.responses = createResponsesModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.image = createImageModel;
  provider.imageModel = createImageModel;
  provider.transcription = createTranscriptionModel;
  provider.transcriptionModel = createTranscriptionModel;
  provider.speech = createSpeechModel;
  provider.speechModel = createSpeechModel;
  provider.tools = openaiTools;
  return provider;
}
createOpenAI();

// src/errors/ai-sdk-error.ts
var marker$2 = "vercel.ai.error";
var symbol$2 = Symbol.for(marker$2);
var _a$2;
var _AISDKError$2 = class _AISDKError extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a$2] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker$2);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a$2 = symbol$2;
var AISDKError$2 = _AISDKError$2;

// src/errors/api-call-error.ts
var name$2 = "AI_APICallError";
var marker2$2 = `vercel.ai.error.${name$2}`;
var symbol2$2 = Symbol.for(marker2$2);
var _a2$2;
var APICallError$2 = class APICallError extends AISDKError$2 {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name: name$2, message, cause });
    this[_a2$2] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError$2.hasMarker(error, marker2$2);
  }
};
_a2$2 = symbol2$2;

// src/errors/get-error-message.ts
function getErrorMessage$2(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// src/errors/invalid-argument-error.ts
var name3$2 = "AI_InvalidArgumentError";
var marker4$2 = `vercel.ai.error.${name3$2}`;
var symbol4$2 = Symbol.for(marker4$2);
var _a4$2;
var InvalidArgumentError$2 = class InvalidArgumentError extends AISDKError$2 {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3$2, message, cause });
    this[_a4$2] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError$2.hasMarker(error, marker4$2);
  }
};
_a4$2 = symbol4$2;

// src/errors/json-parse-error.ts
var name6$2 = "AI_JSONParseError";
var marker7$2 = `vercel.ai.error.${name6$2}`;
var symbol7$2 = Symbol.for(marker7$2);
var _a7$2;
var JSONParseError$2 = class JSONParseError extends AISDKError$2 {
  constructor({ text, cause }) {
    super({
      name: name6$2,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage$2(cause)}`,
      cause
    });
    this[_a7$2] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError$2.hasMarker(error, marker7$2);
  }
};
_a7$2 = symbol7$2;

// src/errors/type-validation-error.ts
var name12$2 = "AI_TypeValidationError";
var marker13$2 = `vercel.ai.error.${name12$2}`;
var symbol13$2 = Symbol.for(marker13$2);
var _a13$2;
var _TypeValidationError$2 = class _TypeValidationError extends AISDKError$2 {
  constructor({ value, cause }) {
    super({
      name: name12$2,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage$2(cause)}`,
      cause
    });
    this[_a13$2] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError$2.hasMarker(error, marker13$2);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
  }
};
_a13$2 = symbol13$2;
var TypeValidationError$2 = _TypeValidationError$2;

// src/combine-headers.ts
function combineHeaders$2(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => ({
      ...combinedHeaders,
      ...currentHeaders != null ? currentHeaders : {}
    }),
    {}
  );
}

// src/extract-response-headers.ts
function extractResponseHeaders$2(response) {
  return Object.fromEntries([...response.headers]);
}
var createIdGenerator$2 = ({
  prefix,
  size = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = () => {
    const alphabetLength = alphabet.length;
    const chars = new Array(size);
    for (let i = 0; i < size; i++) {
      chars[i] = alphabet[Math.random() * alphabetLength | 0];
    }
    return chars.join("");
  };
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError$2({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return () => `${prefix}${separator}${generator()}`;
};
createIdGenerator$2();

// src/is-abort-error.ts
function isAbortError$2(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}

// src/handle-fetch-error.ts
var FETCH_FAILED_ERROR_MESSAGES$2 = ["fetch failed", "failed to fetch"];
function handleFetchError$2({
  error,
  url,
  requestBodyValues
}) {
  if (isAbortError$2(error)) {
    return error;
  }
  if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES$2.includes(error.message.toLowerCase())) {
    const cause = error.cause;
    if (cause != null) {
      return new APICallError$2({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true
        // retry when network error
      });
    }
  }
  return error;
}

// src/get-runtime-environment-user-agent.ts
function getRuntimeEnvironmentUserAgent$1(globalThisAny = globalThis) {
  var _a, _b, _c;
  if (globalThisAny.window) {
    return `runtime/browser`;
  }
  if ((_a = globalThisAny.navigator) == null ? void 0 : _a.userAgent) {
    return `runtime/${globalThisAny.navigator.userAgent.toLowerCase()}`;
  }
  if ((_c = (_b = globalThisAny.process) == null ? void 0 : _b.versions) == null ? void 0 : _c.node) {
    return `runtime/node.js/${globalThisAny.process.version.substring(0)}`;
  }
  if (globalThisAny.EdgeRuntime) {
    return `runtime/vercel-edge`;
  }
  return "runtime/unknown";
}

// src/remove-undefined-entries.ts
function removeUndefinedEntries$2(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}

// src/with-user-agent-suffix.ts
function withUserAgentSuffix$1(headers, ...userAgentSuffixParts) {
  const cleanedHeaders = removeUndefinedEntries$2(
    headers != null ? headers : {}
  );
  const normalizedHeaders = new Headers(cleanedHeaders);
  const currentUserAgentHeader = normalizedHeaders.get("user-agent") || "";
  normalizedHeaders.set(
    "user-agent",
    [currentUserAgentHeader, ...userAgentSuffixParts].filter(Boolean).join(" ")
  );
  return Object.fromEntries(normalizedHeaders);
}

// src/version.ts
var VERSION$2 = "3.0.12" ;

// src/secure-json-parse.ts
var suspectProtoRx$2 = /"__proto__"\s*:/;
var suspectConstructorRx$2 = /"constructor"\s*:/;
function _parse$2(text) {
  const obj = JSON.parse(text);
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (suspectProtoRx$2.test(text) === false && suspectConstructorRx$2.test(text) === false) {
    return obj;
  }
  return filter$2(obj);
}
function filter$2(obj) {
  let next = [obj];
  while (next.length) {
    const nodes = next;
    next = [];
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      if (Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      for (const key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          next.push(value);
        }
      }
    }
  }
  return obj;
}
function secureJsonParse$2(text) {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  try {
    return _parse$2(text);
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
  }
}
var validatorSymbol$2 = Symbol.for("vercel.ai.validator");
function validator$2(validate) {
  return { [validatorSymbol$2]: true, validate };
}
function isValidator$2(value) {
  return typeof value === "object" && value !== null && validatorSymbol$2 in value && value[validatorSymbol$2] === true && "validate" in value;
}
function asValidator$2(value) {
  return isValidator$2(value) ? value : typeof value === "function" ? value() : standardSchemaValidator$2(value);
}
function standardSchemaValidator$2(standardSchema) {
  return validator$2(async (value) => {
    const result = await standardSchema["~standard"].validate(value);
    return result.issues == null ? { success: true, value: result.value } : {
      success: false,
      error: new TypeValidationError$2({
        value,
        cause: result.issues
      })
    };
  });
}

// src/validate-types.ts
async function validateTypes$2({
  value,
  schema
}) {
  const result = await safeValidateTypes$2({ value, schema });
  if (!result.success) {
    throw TypeValidationError$2.wrap({ value, cause: result.error });
  }
  return result.value;
}
async function safeValidateTypes$2({
  value,
  schema
}) {
  const validator2 = asValidator$2(schema);
  try {
    if (validator2.validate == null) {
      return { success: true, value, rawValue: value };
    }
    const result = await validator2.validate(value);
    if (result.success) {
      return { success: true, value: result.value, rawValue: value };
    }
    return {
      success: false,
      error: TypeValidationError$2.wrap({ value, cause: result.error }),
      rawValue: value
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError$2.wrap({ value, cause: error }),
      rawValue: value
    };
  }
}

// src/parse-json.ts
async function parseJSON$2({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$2(text);
    if (schema == null) {
      return value;
    }
    return validateTypes$2({ value, schema });
  } catch (error) {
    if (JSONParseError$2.isInstance(error) || TypeValidationError$2.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError$2({ text, cause: error });
  }
}
async function safeParseJSON$2({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$2(text);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    return await safeValidateTypes$2({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: JSONParseError$2.isInstance(error) ? error : new JSONParseError$2({ text, cause: error }),
      rawValue: void 0
    };
  }
}
var getOriginalFetch2$2 = () => globalThis.fetch;
var postJsonToApi$2 = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
}) => postToApi$2({
  url,
  headers: {
    "Content-Type": "application/json",
    ...headers
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
});
var postToApi$2 = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch = getOriginalFetch2$2()
}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: withUserAgentSuffix$1(
        headers,
        `ai-sdk/provider-utils/${VERSION$2}`,
        getRuntimeEnvironmentUserAgent$1()
      ),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders$2(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError$2(error) || APICallError$2.isInstance(error)) {
          throw error;
        }
        throw new APICallError$2({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError$2(error) || APICallError$2.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError$2({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    throw handleFetchError$2({ error, url, requestBodyValues: body.values });
  }
};
var createJsonErrorResponseHandler$2 = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const responseHeaders = extractResponseHeaders$2(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError$2({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = await parseJSON$2({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError$2({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError$2({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
};
var createJsonResponseHandler$2 = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = await safeParseJSON$2({
    text: responseBody,
    schema: responseSchema
  });
  const responseHeaders = extractResponseHeaders$2(response);
  if (!parsedResult.success) {
    throw new APICallError$2({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
};
new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);

// src/chat/openai-compatible-chat-language-model.ts
object({
  /**
   * A unique identifier representing your end-user, which can help the provider to
   * monitor and detect abuse.
   */
  user: string().optional(),
  /**
   * Reasoning effort for reasoning models. Defaults to `medium`.
   */
  reasoningEffort: string().optional(),
  /**
   * Controls the verbosity of the generated text. Defaults to `medium`.
   */
  textVerbosity: string().optional()
});
var openaiCompatibleErrorDataSchema = object({
  error: object({
    message: string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: string().nullish(),
    param: any().nullish(),
    code: union([string(), number()]).nullish()
  })
});
var defaultOpenAICompatibleErrorStructure = {
  errorSchema: openaiCompatibleErrorDataSchema,
  errorToMessage: (data) => data.error.message
};
var openaiCompatibleTokenUsageSchema = object({
  prompt_tokens: number().nullish(),
  completion_tokens: number().nullish(),
  total_tokens: number().nullish(),
  prompt_tokens_details: object({
    cached_tokens: number().nullish()
  }).nullish(),
  completion_tokens_details: object({
    reasoning_tokens: number().nullish(),
    accepted_prediction_tokens: number().nullish(),
    rejected_prediction_tokens: number().nullish()
  }).nullish()
}).nullish();
object({
  id: string().nullish(),
  created: number().nullish(),
  model: string().nullish(),
  choices: array(
    object({
      message: object({
        role: literal("assistant").nullish(),
        content: string().nullish(),
        reasoning_content: string().nullish(),
        reasoning: string().nullish(),
        tool_calls: array(
          object({
            id: string().nullish(),
            function: object({
              name: string(),
              arguments: string()
            })
          })
        ).nullish()
      }),
      finish_reason: string().nullish()
    })
  ),
  usage: openaiCompatibleTokenUsageSchema
});
object({
  /**
   * Echo back the prompt in addition to the completion.
   */
  echo: boolean().optional(),
  /**
   * Modify the likelihood of specified tokens appearing in the completion.
   *
   * Accepts a JSON object that maps tokens (specified by their token ID in
   * the GPT tokenizer) to an associated bias value from -100 to 100.
   */
  logitBias: record(string(), number()).optional(),
  /**
   * The suffix that comes after a completion of inserted text.
   */
  suffix: string().optional(),
  /**
   * A unique identifier representing your end-user, which can help providers to
   * monitor and detect abuse.
   */
  user: string().optional()
});
var usageSchema = object({
  prompt_tokens: number(),
  completion_tokens: number(),
  total_tokens: number()
});
object({
  id: string().nullish(),
  created: number().nullish(),
  model: string().nullish(),
  choices: array(
    object({
      text: string(),
      finish_reason: string()
    })
  ),
  usage: usageSchema.nullish()
});
object({
  /**
   * The number of dimensions the resulting output embeddings should have.
   * Only supported in text-embedding-3 and later models.
   */
  dimensions: number().optional(),
  /**
   * A unique identifier representing your end-user, which can help providers to
   * monitor and detect abuse.
   */
  user: string().optional()
});
object({
  data: array(object({ embedding: array(number()) })),
  usage: object({ prompt_tokens: number() }).nullish(),
  providerMetadata: record(string(), record(string(), any())).optional()
});
var OpenAICompatibleImageModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v2";
    this.maxImagesPerCall = 10;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt,
    n,
    size,
    aspectRatio,
    seed,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a, _b, _c, _d, _e;
    const warnings = [];
    if (aspectRatio != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "aspectRatio",
        details: "This model does not support aspect ratio. Use `size` instead."
      });
    }
    if (seed != null) {
      warnings.push({ type: "unsupported-setting", setting: "seed" });
    }
    const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
    const { value: response, responseHeaders } = await postJsonToApi$2({
      url: this.config.url({
        path: "/images/generations",
        modelId: this.modelId
      }),
      headers: combineHeaders$2(this.config.headers(), headers),
      body: {
        model: this.modelId,
        prompt,
        n,
        size,
        ...(_d = providerOptions.openai) != null ? _d : {},
        response_format: "b64_json"
      },
      failedResponseHandler: createJsonErrorResponseHandler$2(
        (_e = this.config.errorStructure) != null ? _e : defaultOpenAICompatibleErrorStructure
      ),
      successfulResponseHandler: createJsonResponseHandler$2(
        openaiCompatibleImageResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      images: response.data.map((item) => item.b64_json),
      warnings,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders
      }
    };
  }
};
var openaiCompatibleImageResponseSchema = object({
  data: array(object({ b64_json: string() }))
});

// src/errors/ai-sdk-error.ts
var marker$1 = "vercel.ai.error";
var symbol$1 = Symbol.for(marker$1);
var _a$1;
var _AISDKError$1 = class _AISDKError extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a$1] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker$1);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a$1 = symbol$1;
var AISDKError$1 = _AISDKError$1;

// src/errors/api-call-error.ts
var name$1 = "AI_APICallError";
var marker2$1 = `vercel.ai.error.${name$1}`;
var symbol2$1 = Symbol.for(marker2$1);
var _a2$1;
var APICallError$1 = class APICallError extends AISDKError$1 {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name: name$1, message, cause });
    this[_a2$1] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError$1.hasMarker(error, marker2$1);
  }
};
_a2$1 = symbol2$1;

// src/errors/empty-response-body-error.ts
var name2$1 = "AI_EmptyResponseBodyError";
var marker3$1 = `vercel.ai.error.${name2$1}`;
var symbol3$1 = Symbol.for(marker3$1);
var _a3$1;
var EmptyResponseBodyError$1 = class EmptyResponseBodyError extends AISDKError$1 {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2$1, message });
    this[_a3$1] = true;
  }
  static isInstance(error) {
    return AISDKError$1.hasMarker(error, marker3$1);
  }
};
_a3$1 = symbol3$1;

// src/errors/get-error-message.ts
function getErrorMessage$1(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// src/errors/invalid-argument-error.ts
var name3$1 = "AI_InvalidArgumentError";
var marker4$1 = `vercel.ai.error.${name3$1}`;
var symbol4$1 = Symbol.for(marker4$1);
var _a4$1;
var InvalidArgumentError$1 = class InvalidArgumentError extends AISDKError$1 {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3$1, message, cause });
    this[_a4$1] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError$1.hasMarker(error, marker4$1);
  }
};
_a4$1 = symbol4$1;

// src/errors/json-parse-error.ts
var name6$1 = "AI_JSONParseError";
var marker7$1 = `vercel.ai.error.${name6$1}`;
var symbol7$1 = Symbol.for(marker7$1);
var _a7$1;
var JSONParseError$1 = class JSONParseError extends AISDKError$1 {
  constructor({ text, cause }) {
    super({
      name: name6$1,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage$1(cause)}`,
      cause
    });
    this[_a7$1] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError$1.hasMarker(error, marker7$1);
  }
};
_a7$1 = symbol7$1;

// src/errors/load-api-key-error.ts
var name7$1 = "AI_LoadAPIKeyError";
var marker8$1 = `vercel.ai.error.${name7$1}`;
var symbol8$1 = Symbol.for(marker8$1);
var _a8$1;
var LoadAPIKeyError$1 = class LoadAPIKeyError extends AISDKError$1 {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7$1, message });
    this[_a8$1] = true;
  }
  static isInstance(error) {
    return AISDKError$1.hasMarker(error, marker8$1);
  }
};
_a8$1 = symbol8$1;

// src/errors/no-such-model-error.ts
var name10 = "AI_NoSuchModelError";
var marker11 = `vercel.ai.error.${name10}`;
var symbol11 = Symbol.for(marker11);
var _a11;
var NoSuchModelError = class extends AISDKError$1 {
  constructor({
    errorName = name10,
    modelId,
    modelType,
    message = `No such ${modelType}: ${modelId}`
  }) {
    super({ name: errorName, message });
    this[_a11] = true;
    this.modelId = modelId;
    this.modelType = modelType;
  }
  static isInstance(error) {
    return AISDKError$1.hasMarker(error, marker11);
  }
};
_a11 = symbol11;

// src/errors/type-validation-error.ts
var name12$1 = "AI_TypeValidationError";
var marker13$1 = `vercel.ai.error.${name12$1}`;
var symbol13$1 = Symbol.for(marker13$1);
var _a13$1;
var _TypeValidationError$1 = class _TypeValidationError extends AISDKError$1 {
  constructor({ value, cause }) {
    super({
      name: name12$1,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage$1(cause)}`,
      cause
    });
    this[_a13$1] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError$1.hasMarker(error, marker13$1);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
  }
};
_a13$1 = symbol13$1;
var TypeValidationError$1 = _TypeValidationError$1;

// src/errors/unsupported-functionality-error.ts
var name13$1 = "AI_UnsupportedFunctionalityError";
var marker14$1 = `vercel.ai.error.${name13$1}`;
var symbol14$1 = Symbol.for(marker14$1);
var _a14$1;
var UnsupportedFunctionalityError$1 = class UnsupportedFunctionalityError extends AISDKError$1 {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13$1, message });
    this[_a14$1] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError$1.hasMarker(error, marker14$1);
  }
};
_a14$1 = symbol14$1;

// src/combine-headers.ts
function combineHeaders$1(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => ({
      ...combinedHeaders,
      ...currentHeaders != null ? currentHeaders : {}
    }),
    {}
  );
}

// src/extract-response-headers.ts
function extractResponseHeaders$1(response) {
  return Object.fromEntries([...response.headers]);
}
var createIdGenerator$1 = ({
  prefix,
  size = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = () => {
    const alphabetLength = alphabet.length;
    const chars = new Array(size);
    for (let i = 0; i < size; i++) {
      chars[i] = alphabet[Math.random() * alphabetLength | 0];
    }
    return chars.join("");
  };
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError$1({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return () => `${prefix}${separator}${generator()}`;
};
var generateId$1 = createIdGenerator$1();

// src/is-abort-error.ts
function isAbortError$1(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}

// src/handle-fetch-error.ts
var FETCH_FAILED_ERROR_MESSAGES$1 = ["fetch failed", "failed to fetch"];
function handleFetchError$1({
  error,
  url,
  requestBodyValues
}) {
  if (isAbortError$1(error)) {
    return error;
  }
  if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES$1.includes(error.message.toLowerCase())) {
    const cause = error.cause;
    if (cause != null) {
      return new APICallError$1({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true
        // retry when network error
      });
    }
  }
  return error;
}

// src/get-runtime-environment-user-agent.ts
function getRuntimeEnvironmentUserAgent(globalThisAny = globalThis) {
  var _a, _b, _c;
  if (globalThisAny.window) {
    return `runtime/browser`;
  }
  if ((_a = globalThisAny.navigator) == null ? void 0 : _a.userAgent) {
    return `runtime/${globalThisAny.navigator.userAgent.toLowerCase()}`;
  }
  if ((_c = (_b = globalThisAny.process) == null ? void 0 : _b.versions) == null ? void 0 : _c.node) {
    return `runtime/node.js/${globalThisAny.process.version.substring(0)}`;
  }
  if (globalThisAny.EdgeRuntime) {
    return `runtime/vercel-edge`;
  }
  return "runtime/unknown";
}

// src/remove-undefined-entries.ts
function removeUndefinedEntries$1(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}

// src/with-user-agent-suffix.ts
function withUserAgentSuffix(headers, ...userAgentSuffixParts) {
  const cleanedHeaders = removeUndefinedEntries$1(
    headers != null ? headers : {}
  );
  const normalizedHeaders = new Headers(cleanedHeaders);
  const currentUserAgentHeader = normalizedHeaders.get("user-agent") || "";
  normalizedHeaders.set(
    "user-agent",
    [currentUserAgentHeader, ...userAgentSuffixParts].filter(Boolean).join(" ")
  );
  return Object.fromEntries(normalizedHeaders);
}

// src/version.ts
var VERSION$1 = "3.0.12" ;
function loadApiKey$1({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (typeof apiKey === "string") {
    return apiKey;
  }
  if (apiKey != null) {
    throw new LoadAPIKeyError$1({
      message: `${description} API key must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadAPIKeyError$1({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new LoadAPIKeyError$1({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof apiKey !== "string") {
    throw new LoadAPIKeyError$1({
      message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return apiKey;
}

// src/secure-json-parse.ts
var suspectProtoRx$1 = /"__proto__"\s*:/;
var suspectConstructorRx$1 = /"constructor"\s*:/;
function _parse$1(text) {
  const obj = JSON.parse(text);
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (suspectProtoRx$1.test(text) === false && suspectConstructorRx$1.test(text) === false) {
    return obj;
  }
  return filter$1(obj);
}
function filter$1(obj) {
  let next = [obj];
  while (next.length) {
    const nodes = next;
    next = [];
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      if (Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      for (const key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          next.push(value);
        }
      }
    }
  }
  return obj;
}
function secureJsonParse$1(text) {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  try {
    return _parse$1(text);
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
  }
}
var validatorSymbol$1 = Symbol.for("vercel.ai.validator");
function validator$1(validate) {
  return { [validatorSymbol$1]: true, validate };
}
function isValidator$1(value) {
  return typeof value === "object" && value !== null && validatorSymbol$1 in value && value[validatorSymbol$1] === true && "validate" in value;
}
function asValidator$1(value) {
  return isValidator$1(value) ? value : typeof value === "function" ? value() : standardSchemaValidator$1(value);
}
function standardSchemaValidator$1(standardSchema) {
  return validator$1(async (value) => {
    const result = await standardSchema["~standard"].validate(value);
    return result.issues == null ? { success: true, value: result.value } : {
      success: false,
      error: new TypeValidationError$1({
        value,
        cause: result.issues
      })
    };
  });
}

// src/validate-types.ts
async function validateTypes$1({
  value,
  schema
}) {
  const result = await safeValidateTypes$1({ value, schema });
  if (!result.success) {
    throw TypeValidationError$1.wrap({ value, cause: result.error });
  }
  return result.value;
}
async function safeValidateTypes$1({
  value,
  schema
}) {
  const validator2 = asValidator$1(schema);
  try {
    if (validator2.validate == null) {
      return { success: true, value, rawValue: value };
    }
    const result = await validator2.validate(value);
    if (result.success) {
      return { success: true, value: result.value, rawValue: value };
    }
    return {
      success: false,
      error: TypeValidationError$1.wrap({ value, cause: result.error }),
      rawValue: value
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError$1.wrap({ value, cause: error }),
      rawValue: value
    };
  }
}

// src/parse-json.ts
async function parseJSON$1({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$1(text);
    if (schema == null) {
      return value;
    }
    return validateTypes$1({ value, schema });
  } catch (error) {
    if (JSONParseError$1.isInstance(error) || TypeValidationError$1.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError$1({ text, cause: error });
  }
}
async function safeParseJSON$1({
  text,
  schema
}) {
  try {
    const value = secureJsonParse$1(text);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    return await safeValidateTypes$1({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: JSONParseError$1.isInstance(error) ? error : new JSONParseError$1({ text, cause: error }),
      rawValue: void 0
    };
  }
}
function parseJsonEventStream$1({
  stream,
  schema
}) {
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream$1()).pipeThrough(
    new TransformStream({
      async transform({ data }, controller) {
        if (data === "[DONE]") {
          return;
        }
        controller.enqueue(await safeParseJSON$1({ text: data, schema }));
      }
    })
  );
}
async function parseProviderOptions({
  provider,
  providerOptions,
  schema
}) {
  if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
    return void 0;
  }
  const parsedProviderOptions = await safeValidateTypes$1({
    value: providerOptions[provider],
    schema
  });
  if (!parsedProviderOptions.success) {
    throw new InvalidArgumentError$1({
      argument: "providerOptions",
      message: `invalid ${provider} provider options`,
      cause: parsedProviderOptions.error
    });
  }
  return parsedProviderOptions.value;
}
var getOriginalFetch2$1 = () => globalThis.fetch;
var postJsonToApi$1 = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
}) => postToApi$1({
  url,
  headers: {
    "Content-Type": "application/json",
    ...headers
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
});
var postToApi$1 = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch = getOriginalFetch2$1()
}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: withUserAgentSuffix(
        headers,
        `ai-sdk/provider-utils/${VERSION$1}`,
        getRuntimeEnvironmentUserAgent()
      ),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders$1(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError$1(error) || APICallError$1.isInstance(error)) {
          throw error;
        }
        throw new APICallError$1({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError$1(error) || APICallError$1.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError$1({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    throw handleFetchError$1({ error, url, requestBodyValues: body.values });
  }
};
var createJsonErrorResponseHandler$1 = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const responseHeaders = extractResponseHeaders$1(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError$1({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = await parseJSON$1({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError$1({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError$1({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
};
var createEventSourceResponseHandler$1 = (chunkSchema) => async ({ response }) => {
  const responseHeaders = extractResponseHeaders$1(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError$1({});
  }
  return {
    responseHeaders,
    value: parseJsonEventStream$1({
      stream: response.body,
      schema: chunkSchema
    })
  };
};
var createJsonResponseHandler$1 = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = await safeParseJSON$1({
    text: responseBody,
    schema: responseSchema
  });
  const responseHeaders = extractResponseHeaders$1(response);
  if (!parsedResult.success) {
    throw new APICallError$1({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
};
new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);

// src/uint8-utils.ts
var { btoa: btoa$1} = globalThis;
function convertUint8ArrayToBase64$1(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa$1(latin1string);
}
function convertToBase64(value) {
  return value instanceof Uint8Array ? convertUint8ArrayToBase64$1(value) : value;
}

// src/without-trailing-slash.ts
function withoutTrailingSlash$1(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}

// src/xai-provider.ts
function convertToXaiChatMessages(prompt) {
  const messages = [];
  const warnings = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        messages.push({ role: "system", content });
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push({ role: "user", content: content[0].text });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part) => {
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "file": {
                if (part.mediaType.startsWith("image/")) {
                  const mediaType = part.mediaType === "image/*" ? "image/jpeg" : part.mediaType;
                  return {
                    type: "image_url",
                    image_url: {
                      url: part.data instanceof URL ? part.data.toString() : `data:${mediaType};base64,${convertToBase64(part.data)}`
                    }
                  };
                } else {
                  throw new UnsupportedFunctionalityError$1({
                    functionality: `file part media type ${part.mediaType}`
                  });
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.input)
                }
              });
              break;
            }
          }
        }
        messages.push({
          role: "assistant",
          content: text,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          const output = toolResponse.output;
          let contentValue;
          switch (output.type) {
            case "text":
            case "error-text":
              contentValue = output.value;
              break;
            case "content":
            case "json":
            case "error-json":
              contentValue = JSON.stringify(output.value);
              break;
          }
          messages.push({
            role: "tool",
            tool_call_id: toolResponse.toolCallId,
            content: contentValue
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return { messages, warnings };
}

// src/get-response-metadata.ts
function getResponseMetadata({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}

// src/map-xai-finish-reason.ts
function mapXaiFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "tool_calls":
    case "function_call":
      return "tool-calls";
    case "content_filter":
      return "content-filter";
    default:
      return "unknown";
  }
}
var webSourceSchema = object({
  type: literal("web"),
  country: string().length(2).optional(),
  excludedWebsites: array(string()).max(5).optional(),
  allowedWebsites: array(string()).max(5).optional(),
  safeSearch: boolean().optional()
});
var xSourceSchema = object({
  type: literal("x"),
  excludedXHandles: array(string()).optional(),
  includedXHandles: array(string()).optional(),
  postFavoriteCount: number().int().optional(),
  postViewCount: number().int().optional(),
  /**
   * @deprecated use `includedXHandles` instead
   */
  xHandles: array(string()).optional()
});
var newsSourceSchema = object({
  type: literal("news"),
  country: string().length(2).optional(),
  excludedWebsites: array(string()).max(5).optional(),
  safeSearch: boolean().optional()
});
var rssSourceSchema = object({
  type: literal("rss"),
  links: array(string().url()).max(1)
  // currently only supports one RSS link
});
var searchSourceSchema = discriminatedUnion("type", [
  webSourceSchema,
  xSourceSchema,
  newsSourceSchema,
  rssSourceSchema
]);
var xaiProviderOptions = object({
  reasoningEffort: _enum(["low", "high"]).optional(),
  searchParameters: object({
    /**
     * search mode preference
     * - "off": disables search completely
     * - "auto": model decides whether to search (default)
     * - "on": always enables search
     */
    mode: _enum(["off", "auto", "on"]),
    /**
     * whether to return citations in the response
     * defaults to true
     */
    returnCitations: boolean().optional(),
    /**
     * start date for search data (ISO8601 format: YYYY-MM-DD)
     */
    fromDate: string().optional(),
    /**
     * end date for search data (ISO8601 format: YYYY-MM-DD)
     */
    toDate: string().optional(),
    /**
     * maximum number of search results to consider
     * defaults to 20
     */
    maxSearchResults: number().min(1).max(50).optional(),
    /**
     * data sources to search from
     * defaults to ["web", "x"] if not specified
     */
    sources: array(searchSourceSchema).optional()
  }).optional()
});
var xaiErrorDataSchema = object({
  error: object({
    message: string(),
    type: string().nullish(),
    param: any().nullish(),
    code: union([string(), number()]).nullish()
  })
});
var xaiFailedResponseHandler = createJsonErrorResponseHandler$1({
  errorSchema: xaiErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function prepareTools({
  tools,
  toolChoice
}) {
  tools = (tools == null ? void 0 : tools.length) ? tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, toolChoice: void 0, toolWarnings };
  }
  const xaiTools = [];
  for (const tool of tools) {
    if (tool.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool });
    } else {
      xaiTools.push({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema
        }
      });
    }
  }
  if (toolChoice == null) {
    return { tools: xaiTools, toolChoice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
      return { tools: xaiTools, toolChoice: type, toolWarnings };
    case "required":
      return { tools: xaiTools, toolChoice: "required", toolWarnings };
    case "tool":
      return {
        tools: xaiTools,
        toolChoice: {
          type: "function",
          function: { name: toolChoice.toolName }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError$1({
        functionality: `tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}

// src/xai-chat-language-model.ts
var XaiChatLanguageModel = class {
  constructor(modelId, config) {
    this.specificationVersion = "v2";
    this.supportedUrls = {
      "image/*": [/^https?:\/\/.*$/]
    };
    this.modelId = modelId;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    seed,
    responseFormat,
    providerOptions,
    tools,
    toolChoice
  }) {
    var _a, _b, _c;
    const warnings = [];
    const options = (_a = await parseProviderOptions({
      provider: "xai",
      providerOptions,
      schema: xaiProviderOptions
    })) != null ? _a : {};
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (stopSequences != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "stopSequences"
      });
    }
    if (responseFormat != null && responseFormat.type === "json" && responseFormat.schema != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is not supported"
      });
    }
    const { messages, warnings: messageWarnings } = convertToXaiChatMessages(prompt);
    warnings.push(...messageWarnings);
    const {
      tools: xaiTools,
      toolChoice: xaiToolChoice,
      toolWarnings
    } = prepareTools({
      tools,
      toolChoice
    });
    warnings.push(...toolWarnings);
    const baseArgs = {
      // model id
      model: this.modelId,
      // standard generation settings
      max_tokens: maxOutputTokens,
      temperature,
      top_p: topP,
      seed,
      reasoning_effort: options.reasoningEffort,
      // response format
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? responseFormat.schema != null ? {
        type: "json_schema",
        json_schema: {
          name: (_b = responseFormat.name) != null ? _b : "response",
          schema: responseFormat.schema,
          strict: true
        }
      } : { type: "json_object" } : void 0,
      // search parameters
      search_parameters: options.searchParameters ? {
        mode: options.searchParameters.mode,
        return_citations: options.searchParameters.returnCitations,
        from_date: options.searchParameters.fromDate,
        to_date: options.searchParameters.toDate,
        max_search_results: options.searchParameters.maxSearchResults,
        sources: (_c = options.searchParameters.sources) == null ? void 0 : _c.map((source) => {
          var _a2;
          return {
            type: source.type,
            ...source.type === "web" && {
              country: source.country,
              excluded_websites: source.excludedWebsites,
              allowed_websites: source.allowedWebsites,
              safe_search: source.safeSearch
            },
            ...source.type === "x" && {
              excluded_x_handles: source.excludedXHandles,
              included_x_handles: (_a2 = source.includedXHandles) != null ? _a2 : source.xHandles,
              post_favorite_count: source.postFavoriteCount,
              post_view_count: source.postViewCount
            },
            ...source.type === "news" && {
              country: source.country,
              excluded_websites: source.excludedWebsites,
              safe_search: source.safeSearch
            },
            ...source.type === "rss" && {
              links: source.links
            }
          };
        })
      } : void 0,
      // messages in xai format
      messages,
      // tools in xai format
      tools: xaiTools,
      tool_choice: xaiToolChoice
    };
    return {
      args: baseArgs,
      warnings
    };
  }
  async doGenerate(options) {
    var _a, _b, _c;
    const { args: body, warnings } = await this.getArgs(options);
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi$1({
      url: `${(_a = this.config.baseURL) != null ? _a : "https://api.x.ai/v1"}/chat/completions`,
      headers: combineHeaders$1(this.config.headers(), options.headers),
      body,
      failedResponseHandler: xaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler$1(
        xaiChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const choice = response.choices[0];
    const content = [];
    if (choice.message.content != null && choice.message.content.length > 0) {
      let text = choice.message.content;
      const lastMessage = body.messages[body.messages.length - 1];
      if ((lastMessage == null ? void 0 : lastMessage.role) === "assistant" && text === lastMessage.content) {
        text = "";
      }
      if (text.length > 0) {
        content.push({ type: "text", text });
      }
    }
    if (choice.message.reasoning_content != null && choice.message.reasoning_content.length > 0) {
      content.push({
        type: "reasoning",
        text: choice.message.reasoning_content
      });
    }
    if (choice.message.tool_calls != null) {
      for (const toolCall of choice.message.tool_calls) {
        content.push({
          type: "tool-call",
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
          input: toolCall.function.arguments
        });
      }
    }
    if (response.citations != null) {
      for (const url of response.citations) {
        content.push({
          type: "source",
          sourceType: "url",
          id: this.config.generateId(),
          url
        });
      }
    }
    return {
      content,
      finishReason: mapXaiFinishReason(choice.finish_reason),
      usage: {
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
        reasoningTokens: (_c = (_b = response.usage.completion_tokens_details) == null ? void 0 : _b.reasoning_tokens) != null ? _c : void 0
      },
      request: { body },
      response: {
        ...getResponseMetadata(response),
        headers: responseHeaders,
        body: rawResponse
      },
      warnings
    };
  }
  async doStream(options) {
    var _a;
    const { args, warnings } = await this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      stream_options: {
        include_usage: true
      }
    };
    const { responseHeaders, value: response } = await postJsonToApi$1({
      url: `${(_a = this.config.baseURL) != null ? _a : "https://api.x.ai/v1"}/chat/completions`,
      headers: combineHeaders$1(this.config.headers(), options.headers),
      body,
      failedResponseHandler: xaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler$1(xaiChatChunkSchema),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    let finishReason = "unknown";
    const usage = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    let isFirstChunk = true;
    const contentBlocks = {};
    const lastReasoningDeltas = {};
    const self = this;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            var _a2, _b;
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if (isFirstChunk) {
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata(value)
              });
              isFirstChunk = false;
            }
            if (value.citations != null) {
              for (const url of value.citations) {
                controller.enqueue({
                  type: "source",
                  sourceType: "url",
                  id: self.config.generateId(),
                  url
                });
              }
            }
            if (value.usage != null) {
              usage.inputTokens = value.usage.prompt_tokens;
              usage.outputTokens = value.usage.completion_tokens;
              usage.totalTokens = value.usage.total_tokens;
              usage.reasoningTokens = (_b = (_a2 = value.usage.completion_tokens_details) == null ? void 0 : _a2.reasoning_tokens) != null ? _b : void 0;
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapXaiFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            const choiceIndex = choice.index;
            if (delta.content != null && delta.content.length > 0) {
              const textContent = delta.content;
              const lastMessage = body.messages[body.messages.length - 1];
              if ((lastMessage == null ? void 0 : lastMessage.role) === "assistant" && textContent === lastMessage.content) {
                return;
              }
              const blockId = `text-${value.id || choiceIndex}`;
              if (contentBlocks[blockId] == null) {
                contentBlocks[blockId] = { type: "text" };
                controller.enqueue({
                  type: "text-start",
                  id: blockId
                });
              }
              controller.enqueue({
                type: "text-delta",
                id: blockId,
                delta: textContent
              });
            }
            if (delta.reasoning_content != null && delta.reasoning_content.length > 0) {
              const blockId = `reasoning-${value.id || choiceIndex}`;
              if (lastReasoningDeltas[blockId] === delta.reasoning_content) {
                return;
              }
              lastReasoningDeltas[blockId] = delta.reasoning_content;
              if (contentBlocks[blockId] == null) {
                contentBlocks[blockId] = { type: "reasoning" };
                controller.enqueue({
                  type: "reasoning-start",
                  id: blockId
                });
              }
              controller.enqueue({
                type: "reasoning-delta",
                id: blockId,
                delta: delta.reasoning_content
              });
            }
            if (delta.tool_calls != null) {
              for (const toolCall of delta.tool_calls) {
                const toolCallId = toolCall.id;
                controller.enqueue({
                  type: "tool-input-start",
                  id: toolCallId,
                  toolName: toolCall.function.name
                });
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCallId,
                  delta: toolCall.function.arguments
                });
                controller.enqueue({
                  type: "tool-input-end",
                  id: toolCallId
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId,
                  toolName: toolCall.function.name,
                  input: toolCall.function.arguments
                });
              }
            }
          },
          flush(controller) {
            for (const [blockId, block] of Object.entries(contentBlocks)) {
              controller.enqueue({
                type: block.type === "text" ? "text-end" : "reasoning-end",
                id: blockId
              });
            }
            controller.enqueue({ type: "finish", finishReason, usage });
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
  }
};
var xaiUsageSchema = object({
  prompt_tokens: number(),
  completion_tokens: number(),
  total_tokens: number(),
  completion_tokens_details: object({
    reasoning_tokens: number().nullish()
  }).nullish()
});
var xaiChatResponseSchema = object({
  id: string().nullish(),
  created: number().nullish(),
  model: string().nullish(),
  choices: array(
    object({
      message: object({
        role: literal("assistant"),
        content: string().nullish(),
        reasoning_content: string().nullish(),
        tool_calls: array(
          object({
            id: string(),
            type: literal("function"),
            function: object({
              name: string(),
              arguments: string()
            })
          })
        ).nullish()
      }),
      index: number(),
      finish_reason: string().nullish()
    })
  ),
  object: literal("chat.completion"),
  usage: xaiUsageSchema,
  citations: array(string().url()).nullish()
});
var xaiChatChunkSchema = object({
  id: string().nullish(),
  created: number().nullish(),
  model: string().nullish(),
  choices: array(
    object({
      delta: object({
        role: _enum(["assistant"]).optional(),
        content: string().nullish(),
        reasoning_content: string().nullish(),
        tool_calls: array(
          object({
            id: string(),
            type: literal("function"),
            function: object({
              name: string(),
              arguments: string()
            })
          })
        ).nullish()
      }),
      finish_reason: string().nullish(),
      index: number()
    })
  ),
  usage: xaiUsageSchema.nullish(),
  citations: array(string().url()).nullish()
});

// src/version.ts
var VERSION = "2.0.26" ;

// src/xai-provider.ts
var xaiErrorStructure = {
  errorSchema: xaiErrorDataSchema,
  errorToMessage: (data) => data.error.message
};
function createXai(options = {}) {
  var _a;
  const baseURL = withoutTrailingSlash$1(
    (_a = options.baseURL) != null ? _a : "https://api.x.ai/v1"
  );
  const getHeaders = () => withUserAgentSuffix(
    {
      Authorization: `Bearer ${loadApiKey$1({
        apiKey: options.apiKey,
        environmentVariableName: "XAI_API_KEY",
        description: "xAI API key"
      })}`,
      ...options.headers
    },
    `ai-sdk/xai/${VERSION}`
  );
  const createLanguageModel = (modelId) => {
    return new XaiChatLanguageModel(modelId, {
      provider: "xai.chat",
      baseURL,
      headers: getHeaders,
      generateId: generateId$1,
      fetch: options.fetch
    });
  };
  const createImageModel = (modelId) => {
    return new OpenAICompatibleImageModel(modelId, {
      provider: "xai.image",
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch,
      errorStructure: xaiErrorStructure
    });
  };
  const provider = (modelId) => createLanguageModel(modelId);
  provider.languageModel = createLanguageModel;
  provider.chat = createLanguageModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  provider.imageModel = createImageModel;
  provider.image = createImageModel;
  return provider;
}
createXai();

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// node_modules/.pnpm/@ai-sdk+provider@2.0.0/node_modules/@ai-sdk/provider/dist/index.mjs
var marker = "vercel.ai.error";
var symbol = Symbol.for(marker);
var _a;
var _AISDKError = class _AISDKError2 extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError2.hasMarker(error, marker);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a = symbol;
var AISDKError = _AISDKError;
var name = "AI_APICallError";
var marker2 = `vercel.ai.error.${name}`;
var symbol2 = Symbol.for(marker2);
var _a2;
var APICallError = class extends AISDKError {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name, message, cause });
    this[_a2] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker2);
  }
};
_a2 = symbol2;
var name2 = "AI_EmptyResponseBodyError";
var marker3 = `vercel.ai.error.${name2}`;
var symbol3 = Symbol.for(marker3);
var _a3;
var EmptyResponseBodyError = class extends AISDKError {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2, message });
    this[_a3] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker3);
  }
};
_a3 = symbol3;
function getErrorMessage(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}
var name3 = "AI_InvalidArgumentError";
var marker4 = `vercel.ai.error.${name3}`;
var symbol4 = Symbol.for(marker4);
var _a4;
var InvalidArgumentError = class extends AISDKError {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3, message, cause });
    this[_a4] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker4);
  }
};
_a4 = symbol4;
var name4 = "AI_InvalidPromptError";
var marker5 = `vercel.ai.error.${name4}`;
var symbol5 = Symbol.for(marker5);
var _a5;
var InvalidPromptError = class extends AISDKError {
  constructor({
    prompt,
    message,
    cause
  }) {
    super({ name: name4, message: `Invalid prompt: ${message}`, cause });
    this[_a5] = true;
    this.prompt = prompt;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker5);
  }
};
_a5 = symbol5;
var name5 = "AI_InvalidResponseDataError";
var marker6 = `vercel.ai.error.${name5}`;
var symbol6 = Symbol.for(marker6);
var _a6;
var InvalidResponseDataError = class extends AISDKError {
  constructor({
    data,
    message = `Invalid response data: ${JSON.stringify(data)}.`
  }) {
    super({ name: name5, message });
    this[_a6] = true;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker6);
  }
};
_a6 = symbol6;
var name6 = "AI_JSONParseError";
var marker7 = `vercel.ai.error.${name6}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var JSONParseError = class extends AISDKError {
  constructor({ text, cause }) {
    super({
      name: name6,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a7] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7);
  }
};
_a7 = symbol7;
var name7 = "AI_LoadAPIKeyError";
var marker8 = `vercel.ai.error.${name7}`;
var symbol8 = Symbol.for(marker8);
var _a8;
var LoadAPIKeyError = class extends AISDKError {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7, message });
    this[_a8] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker8);
  }
};
_a8 = symbol8;
var name12 = "AI_TypeValidationError";
var marker13 = `vercel.ai.error.${name12}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var _TypeValidationError = class _TypeValidationError2 extends AISDKError {
  constructor({ value, cause }) {
    super({
      name: name12,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a13] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError2.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError2({ value, cause });
  }
};
_a13 = symbol13;
var TypeValidationError = _TypeValidationError;
var name13 = "AI_UnsupportedFunctionalityError";
var marker14 = `vercel.ai.error.${name13}`;
var symbol14 = Symbol.for(marker14);
var _a14;
var UnsupportedFunctionalityError = class extends AISDKError {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13, message });
    this[_a14] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker14);
  }
};
_a14 = symbol14;

// node_modules/.pnpm/eventsource-parser@3.0.3/node_modules/eventsource-parser/dist/index.js
var ParseError = class extends Error {
  constructor(message, options) {
    super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
  }
};
function noop(_arg) {
}
function createParser(callbacks) {
  if (typeof callbacks == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  const { onEvent = noop, onError = noop, onRetry = noop, onComment } = callbacks;
  let incompleteLine = "", isFirstChunk = true, id, data = "", eventType = "";
  function feed(newChunk) {
    const chunk = isFirstChunk ? newChunk.replace(/^\xEF\xBB\xBF/, "") : newChunk, [complete, incomplete] = splitLines(`${incompleteLine}${chunk}`);
    for (const line of complete)
      parseLine(line);
    incompleteLine = incomplete, isFirstChunk = false;
  }
  function parseLine(line) {
    if (line === "") {
      dispatchEvent();
      return;
    }
    if (line.startsWith(":")) {
      onComment && onComment(line.slice(line.startsWith(": ") ? 2 : 1));
      return;
    }
    const fieldSeparatorIndex = line.indexOf(":");
    if (fieldSeparatorIndex !== -1) {
      const field = line.slice(0, fieldSeparatorIndex), offset = line[fieldSeparatorIndex + 1] === " " ? 2 : 1, value = line.slice(fieldSeparatorIndex + offset);
      processField(field, value, line);
      return;
    }
    processField(line, "", line);
  }
  function processField(field, value, line) {
    switch (field) {
      case "event":
        eventType = value;
        break;
      case "data":
        data = `${data}${value}
`;
        break;
      case "id":
        id = value.includes("\0") ? void 0 : value;
        break;
      case "retry":
        /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(
          new ParseError(`Invalid \`retry\` value: "${value}"`, {
            type: "invalid-retry",
            value,
            line
          })
        );
        break;
      default:
        onError(
          new ParseError(
            `Unknown field "${field.length > 20 ? `${field.slice(0, 20)}\u2026` : field}"`,
            { type: "unknown-field", field, value, line }
          )
        );
        break;
    }
  }
  function dispatchEvent() {
    data.length > 0 && onEvent({
      id,
      event: eventType || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: data.endsWith(`
`) ? data.slice(0, -1) : data
    }), id = void 0, data = "", eventType = "";
  }
  function reset(options = {}) {
    incompleteLine && options.consume && parseLine(incompleteLine), isFirstChunk = true, id = void 0, data = "", eventType = "", incompleteLine = "";
  }
  return { feed, reset };
}
function splitLines(chunk) {
  const lines = [];
  let incompleteLine = "", searchIndex = 0;
  for (; searchIndex < chunk.length; ) {
    const crIndex = chunk.indexOf("\r", searchIndex), lfIndex = chunk.indexOf(`
`, searchIndex);
    let lineEnd = -1;
    if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = Math.min(crIndex, lfIndex) : crIndex !== -1 ? lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1) {
      incompleteLine = chunk.slice(searchIndex);
      break;
    } else {
      const line = chunk.slice(searchIndex, lineEnd);
      lines.push(line), searchIndex = lineEnd + 1, chunk[searchIndex - 1] === "\r" && chunk[searchIndex] === `
` && searchIndex++;
    }
  }
  return [lines, incompleteLine];
}

// node_modules/.pnpm/eventsource-parser@3.0.3/node_modules/eventsource-parser/dist/stream.js
var EventSourceParserStream = class extends TransformStream {
  constructor({ onError, onRetry, onComment } = {}) {
    let parser;
    super({
      start(controller) {
        parser = createParser({
          onEvent: (event) => {
            controller.enqueue(event);
          },
          onError(error) {
            onError === "terminate" ? controller.error(error) : typeof onError == "function" && onError(error);
          },
          onRetry,
          onComment
        });
      },
      transform(chunk) {
        parser.feed(chunk);
      }
    });
  }
};

// node_modules/.pnpm/zod-to-json-schema@3.24.6_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/string.js
new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");

// node_modules/.pnpm/@ai-sdk+provider-utils@3.0.1_zod@3.25.76/node_modules/@ai-sdk/provider-utils/dist/index.mjs
function combineHeaders(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => __spreadValues(__spreadValues({}, combinedHeaders), currentHeaders != null ? currentHeaders : {}),
    {}
  );
}
function extractResponseHeaders(response) {
  return Object.fromEntries([...response.headers]);
}
var createIdGenerator = ({
  prefix,
  size = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = () => {
    const alphabetLength = alphabet.length;
    const chars = new Array(size);
    for (let i = 0; i < size; i++) {
      chars[i] = alphabet[Math.random() * alphabetLength | 0];
    }
    return chars.join("");
  };
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return () => `${prefix}${separator}${generator()}`;
};
var generateId = createIdGenerator();
function isAbortError(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}
var FETCH_FAILED_ERROR_MESSAGES = ["fetch failed", "failed to fetch"];
function handleFetchError({
  error,
  url,
  requestBodyValues
}) {
  if (isAbortError(error)) {
    return error;
  }
  if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES.includes(error.message.toLowerCase())) {
    const cause = error.cause;
    if (cause != null) {
      return new APICallError({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true
        // retry when network error
      });
    }
  }
  return error;
}
function removeUndefinedEntries(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}
function loadApiKey({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (typeof apiKey === "string") {
    return apiKey;
  }
  if (apiKey != null) {
    throw new LoadAPIKeyError({
      message: `${description} API key must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof apiKey !== "string") {
    throw new LoadAPIKeyError({
      message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return apiKey;
}
var suspectProtoRx = /"__proto__"\s*:/;
var suspectConstructorRx = /"constructor"\s*:/;
function _parse(text) {
  const obj = JSON.parse(text);
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
    return obj;
  }
  return filter(obj);
}
function filter(obj) {
  let next = [obj];
  while (next.length) {
    const nodes = next;
    next = [];
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      if (Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      for (const key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          next.push(value);
        }
      }
    }
  }
  return obj;
}
function secureJsonParse(text) {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  try {
    return _parse(text);
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
  }
}
var validatorSymbol = Symbol.for("vercel.ai.validator");
function validator(validate) {
  return { [validatorSymbol]: true, validate };
}
function isValidator(value) {
  return typeof value === "object" && value !== null && validatorSymbol in value && value[validatorSymbol] === true && "validate" in value;
}
function asValidator(value) {
  return isValidator(value) ? value : standardSchemaValidator(value);
}
function standardSchemaValidator(standardSchema) {
  return validator(async (value) => {
    const result = await standardSchema["~standard"].validate(value);
    return result.issues == null ? { success: true, value: result.value } : {
      success: false,
      error: new TypeValidationError({
        value,
        cause: result.issues
      })
    };
  });
}
async function validateTypes({
  value,
  schema
}) {
  const result = await safeValidateTypes({ value, schema });
  if (!result.success) {
    throw TypeValidationError.wrap({ value, cause: result.error });
  }
  return result.value;
}
async function safeValidateTypes({
  value,
  schema
}) {
  const validator2 = asValidator(schema);
  try {
    if (validator2.validate == null) {
      return { success: true, value, rawValue: value };
    }
    const result = await validator2.validate(value);
    if (result.success) {
      return { success: true, value: result.value, rawValue: value };
    }
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: result.error }),
      rawValue: value
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: error }),
      rawValue: value
    };
  }
}
async function parseJSON({
  text,
  schema
}) {
  try {
    const value = secureJsonParse(text);
    if (schema == null) {
      return value;
    }
    return validateTypes({ value, schema });
  } catch (error) {
    if (JSONParseError.isInstance(error) || TypeValidationError.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError({ text, cause: error });
  }
}
async function safeParseJSON({
  text,
  schema
}) {
  try {
    const value = secureJsonParse(text);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    return await safeValidateTypes({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: JSONParseError.isInstance(error) ? error : new JSONParseError({ text, cause: error }),
      rawValue: void 0
    };
  }
}
function isParsableJson(input) {
  try {
    secureJsonParse(input);
    return true;
  } catch (e) {
    return false;
  }
}
function parseJsonEventStream({
  stream,
  schema
}) {
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream()).pipeThrough(
    new TransformStream({
      async transform({ data }, controller) {
        if (data === "[DONE]") {
          return;
        }
        controller.enqueue(await safeParseJSON({ text: data, schema }));
      }
    })
  );
}
var getOriginalFetch2 = () => globalThis.fetch;
var postJsonToApi = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
}) => postToApi({
  url,
  headers: __spreadValues({
    "Content-Type": "application/json"
  }, headers),
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch
});
var postToApi = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch = getOriginalFetch2()
}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: removeUndefinedEntries(headers),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
        throw new APICallError({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    throw handleFetchError({ error, url, requestBodyValues: body.values });
  }
};
var createJsonErrorResponseHandler = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const responseHeaders = extractResponseHeaders(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = await parseJSON({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
};
var createEventSourceResponseHandler = (chunkSchema) => async ({ response }) => {
  const responseHeaders = extractResponseHeaders(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError({});
  }
  return {
    responseHeaders,
    value: parseJsonEventStream({
      stream: response.body,
      schema: chunkSchema
    })
  };
};
var createJsonResponseHandler = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = await safeParseJSON({
    text: responseBody,
    schema: responseSchema
  });
  const responseHeaders = extractResponseHeaders(response);
  if (!parsedResult.success) {
    throw new APICallError({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
};
var { btoa} = globalThis;
function convertUint8ArrayToBase64(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa(latin1string);
}
function withoutTrailingSlash(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}
var ReasoningDetailSummarySchema = object({
  type: literal("reasoning.summary" /* Summary */),
  summary: string()
});
var ReasoningDetailEncryptedSchema = object({
  type: literal("reasoning.encrypted" /* Encrypted */),
  data: string()
});
var ReasoningDetailTextSchema = object({
  type: literal("reasoning.text" /* Text */),
  text: string().nullish(),
  signature: string().nullish()
});
var ReasoningDetailUnionSchema = union([
  ReasoningDetailSummarySchema,
  ReasoningDetailEncryptedSchema,
  ReasoningDetailTextSchema
]);
var ReasoningDetailsWithUnknownSchema = union([
  ReasoningDetailUnionSchema,
  unknown().transform(() => null)
]);
var ReasoningDetailArraySchema = array(ReasoningDetailsWithUnknownSchema).transform((d) => d.filter((d2) => !!d2));
var OpenRouterErrorResponseSchema = object({
  error: object({
    code: union([string(), number()]).nullable().optional().default(null),
    message: string(),
    type: string().nullable().optional().default(null),
    param: any().nullable().optional().default(null)
  })
});
var openrouterFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: OpenRouterErrorResponseSchema,
  errorToMessage: (data) => data.error.message
});

// src/utils/map-finish-reason.ts
function mapOpenRouterFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}

// src/chat/is-url.ts
function isUrl({
  url,
  protocols
}) {
  try {
    const urlObj = new URL(url);
    return protocols.has(urlObj.protocol);
  } catch (_) {
    return false;
  }
}

// src/chat/file-url-utils.ts
function getFileUrl({
  part,
  defaultMediaType
}) {
  var _a15, _b;
  if (part.data instanceof Uint8Array) {
    const base64 = convertUint8ArrayToBase64(part.data);
    return `data:${(_a15 = part.mediaType) != null ? _a15 : defaultMediaType};base64,${base64}`;
  }
  const stringUrl = part.data.toString();
  if (isUrl({
    url: stringUrl,
    protocols: /* @__PURE__ */ new Set(["http:", "https:"])
  })) {
    return stringUrl;
  }
  return stringUrl.startsWith("data:") ? stringUrl : `data:${(_b = part.mediaType) != null ? _b : defaultMediaType};base64,${stringUrl}`;
}
function getMediaType(dataUrl, defaultMediaType) {
  var _a15;
  const match = dataUrl.match(/^data:([^;]+)/);
  return match ? (_a15 = match[1]) != null ? _a15 : defaultMediaType : defaultMediaType;
}
function getBase64FromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:[^;]*;base64,(.+)$/);
  return match ? match[1] : dataUrl;
}

// src/chat/convert-to-openrouter-chat-messages.ts
function getCacheControl(providerMetadata) {
  var _a15, _b, _c;
  const anthropic = providerMetadata == null ? void 0 : providerMetadata.anthropic;
  const openrouter2 = providerMetadata == null ? void 0 : providerMetadata.openrouter;
  return (_c = (_b = (_a15 = openrouter2 == null ? void 0 : openrouter2.cacheControl) != null ? _a15 : openrouter2 == null ? void 0 : openrouter2.cache_control) != null ? _b : anthropic == null ? void 0 : anthropic.cacheControl) != null ? _c : anthropic == null ? void 0 : anthropic.cache_control;
}
function convertToOpenRouterChatMessages(prompt) {
  var _a15, _b, _c;
  const messages = [];
  for (const { role, content, providerOptions } of prompt) {
    switch (role) {
      case "system": {
        messages.push({
          role: "system",
          content,
          cache_control: getCacheControl(providerOptions)
        });
        break;
      }
      case "user": {
        if (content.length === 1 && ((_a15 = content[0]) == null ? void 0 : _a15.type) === "text") {
          const cacheControl = (_b = getCacheControl(providerOptions)) != null ? _b : getCacheControl(content[0].providerOptions);
          const contentWithCacheControl = cacheControl ? [
            {
              type: "text",
              text: content[0].text,
              cache_control: cacheControl
            }
          ] : content[0].text;
          messages.push({
            role: "user",
            content: contentWithCacheControl
          });
          break;
        }
        const messageCacheControl = getCacheControl(providerOptions);
        const contentParts = content.map(
          (part) => {
            var _a16, _b2, _c2, _d, _e, _f;
            const cacheControl = (_a16 = getCacheControl(part.providerOptions)) != null ? _a16 : messageCacheControl;
            switch (part.type) {
              case "text":
                return {
                  type: "text",
                  text: part.text,
                  // For text parts, only use part-specific cache control
                  cache_control: cacheControl
                };
              case "file": {
                if ((_b2 = part.mediaType) == null ? void 0 : _b2.startsWith("image/")) {
                  const url = getFileUrl({
                    part,
                    defaultMediaType: "image/jpeg"
                  });
                  return {
                    type: "image_url",
                    image_url: {
                      url
                    },
                    // For image parts, use part-specific or message-level cache control
                    cache_control: cacheControl
                  };
                }
                const fileName = String(
                  (_f = (_e = (_d = (_c2 = part.providerOptions) == null ? void 0 : _c2.openrouter) == null ? void 0 : _d.filename) != null ? _e : part.filename) != null ? _f : ""
                );
                const fileData = getFileUrl({
                  part,
                  defaultMediaType: "application/pdf"
                });
                if (isUrl({
                  url: fileData,
                  protocols: /* @__PURE__ */ new Set(["http:", "https:"])
                })) {
                  return {
                    type: "file",
                    file: {
                      filename: fileName,
                      file_data: fileData
                    }
                  };
                }
                return {
                  type: "file",
                  file: {
                    filename: fileName,
                    file_data: fileData
                  },
                  cache_control: cacheControl
                };
              }
              default: {
                return {
                  type: "text",
                  text: "",
                  cache_control: cacheControl
                };
              }
            }
          }
        );
        messages.push({
          role: "user",
          content: contentParts
        });
        break;
      }
      case "assistant": {
        let text = "";
        let reasoning = "";
        const reasoningDetails = [];
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.input)
                }
              });
              break;
            }
            case "reasoning": {
              reasoning += part.text;
              reasoningDetails.push({
                type: "reasoning.text" /* Text */,
                text: part.text
              });
              break;
            }
          }
        }
        messages.push({
          role: "assistant",
          content: text,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0,
          reasoning: reasoning || void 0,
          reasoning_details: reasoningDetails.length > 0 ? reasoningDetails : void 0,
          cache_control: getCacheControl(providerOptions)
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          const content2 = getToolResultContent(toolResponse);
          messages.push({
            role: "tool",
            tool_call_id: toolResponse.toolCallId,
            content: content2,
            cache_control: (_c = getCacheControl(providerOptions)) != null ? _c : getCacheControl(toolResponse.providerOptions)
          });
        }
        break;
      }
    }
  }
  return messages;
}
function getToolResultContent(input) {
  return input.output.type === "text" ? input.output.value : JSON.stringify(input.output.value);
}
union([
  literal("auto"),
  literal("none"),
  literal("required"),
  object({
    type: literal("function"),
    function: object({
      name: string()
    })
  })
]);
function getChatCompletionToolChoice(toolChoice) {
  switch (toolChoice.type) {
    case "auto":
    case "none":
    case "required":
      return toolChoice.type;
    case "tool": {
      return {
        type: "function",
        function: { name: toolChoice.toolName }
      };
    }
    default: {
      throw new Error(`Invalid tool choice type: ${toolChoice}`);
    }
  }
}
var ImageResponseSchema = object({
  type: literal("image_url"),
  image_url: object({
    url: string()
  })
});
var ImageResponseWithUnknownSchema = union([
  ImageResponseSchema,
  unknown().transform(() => null)
]);
var ImageResponseArraySchema = array(ImageResponseWithUnknownSchema).transform((d) => d.filter((d2) => !!d2));

// src/chat/schemas.ts
var OpenRouterChatCompletionBaseResponseSchema = object({
  id: string().optional(),
  model: string().optional(),
  provider: string().optional(),
  usage: object({
    prompt_tokens: number(),
    prompt_tokens_details: object({
      cached_tokens: number()
    }).nullish(),
    completion_tokens: number(),
    completion_tokens_details: object({
      reasoning_tokens: number()
    }).nullish(),
    total_tokens: number(),
    cost: number().optional(),
    cost_details: object({
      upstream_inference_cost: number().nullish()
    }).nullish()
  }).nullish()
});
var OpenRouterNonStreamChatCompletionResponseSchema = OpenRouterChatCompletionBaseResponseSchema.extend({
  choices: array(
    object({
      message: object({
        role: literal("assistant"),
        content: string().nullable().optional(),
        reasoning: string().nullable().optional(),
        reasoning_details: ReasoningDetailArraySchema.nullish(),
        images: ImageResponseArraySchema.nullish(),
        tool_calls: array(
          object({
            id: string().optional().nullable(),
            type: literal("function"),
            function: object({
              name: string(),
              arguments: string()
            })
          })
        ).optional(),
        annotations: array(
          object({
            type: _enum(["url_citation"]),
            url_citation: object({
              end_index: number(),
              start_index: number(),
              title: string(),
              url: string(),
              content: string().optional()
            })
          })
        ).nullish()
      }),
      index: number().nullish(),
      logprobs: object({
        content: array(
          object({
            token: string(),
            logprob: number(),
            top_logprobs: array(
              object({
                token: string(),
                logprob: number()
              })
            )
          })
        ).nullable()
      }).nullable().optional(),
      finish_reason: string().optional().nullable()
    })
  )
});
var OpenRouterStreamChatCompletionChunkSchema = union([
  OpenRouterChatCompletionBaseResponseSchema.extend({
    choices: array(
      object({
        delta: object({
          role: _enum(["assistant"]).optional(),
          content: string().nullish(),
          reasoning: string().nullish().optional(),
          reasoning_details: ReasoningDetailArraySchema.nullish(),
          images: ImageResponseArraySchema.nullish(),
          tool_calls: array(
            object({
              index: number().nullish(),
              id: string().nullish(),
              type: literal("function").optional(),
              function: object({
                name: string().nullish(),
                arguments: string().nullish()
              })
            })
          ).nullish(),
          annotations: array(
            object({
              type: _enum(["url_citation"]),
              url_citation: object({
                end_index: number(),
                start_index: number(),
                title: string(),
                url: string(),
                content: string().optional()
              })
            })
          ).nullish()
        }).nullish(),
        logprobs: object({
          content: array(
            object({
              token: string(),
              logprob: number(),
              top_logprobs: array(
                object({
                  token: string(),
                  logprob: number()
                })
              )
            })
          ).nullable()
        }).nullish(),
        finish_reason: string().nullable().optional(),
        index: number().nullish()
      })
    )
  }),
  OpenRouterErrorResponseSchema
]);

// src/chat/index.ts
var OpenRouterChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v2";
    this.provider = "openrouter";
    this.defaultObjectGenerationMode = "tool";
    this.supportedUrls = {
      "image/*": [
        /^data:image\/[a-zA-Z]+;base64,/,
        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
      ],
      // 'text/*': [/^data:text\//, /^https?:\/\/.+$/],
      "application/*": [/^data:application\//, /^https?:\/\/.+$/]
    };
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    frequencyPenalty,
    presencePenalty,
    seed,
    stopSequences,
    responseFormat,
    topK,
    tools,
    toolChoice
  }) {
    var _a15;
    const baseArgs = __spreadValues(__spreadValues({
      // model id:
      model: this.modelId,
      models: this.settings.models,
      // model specific settings:
      logit_bias: this.settings.logitBias,
      logprobs: this.settings.logprobs === true || typeof this.settings.logprobs === "number" ? true : void 0,
      top_logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      user: this.settings.user,
      parallel_tool_calls: this.settings.parallelToolCalls,
      // standardized settings:
      max_tokens: maxOutputTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,
      stop: stopSequences,
      response_format: responseFormat,
      top_k: topK,
      // messages:
      messages: convertToOpenRouterChatMessages(prompt),
      // OpenRouter specific settings:
      include_reasoning: this.settings.includeReasoning,
      reasoning: this.settings.reasoning,
      usage: this.settings.usage,
      // Web search settings:
      plugins: this.settings.plugins,
      web_search_options: this.settings.web_search_options,
      // Provider routing settings:
      provider: this.settings.provider
    }, this.config.extraBody), this.settings.extraBody);
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null) {
      return __spreadProps(__spreadValues({}, baseArgs), {
        response_format: {
          type: "json_schema",
          json_schema: __spreadValues({
            schema: responseFormat.schema,
            strict: true,
            name: (_a15 = responseFormat.name) != null ? _a15 : "response"
          }, responseFormat.description && {
            description: responseFormat.description
          })
        }
      });
    }
    if (tools && tools.length > 0) {
      const mappedTools = tools.filter((tool) => tool.type === "function").map((tool) => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema
        }
      }));
      return __spreadProps(__spreadValues({}, baseArgs), {
        tools: mappedTools,
        tool_choice: toolChoice ? getChatCompletionToolChoice(toolChoice) : void 0
      });
    }
    return baseArgs;
  }
  async doGenerate(options) {
    var _a15, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    const providerOptions = options.providerOptions || {};
    const openrouterOptions = providerOptions.openrouter || {};
    const args = __spreadValues(__spreadValues({}, this.getArgs(options)), openrouterOptions);
    const { value: response, responseHeaders } = await postJsonToApi({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: openrouterFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        OpenRouterNonStreamChatCompletionResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const choice = response.choices[0];
    if (!choice) {
      throw new Error("No choice in response");
    }
    const usageInfo = response.usage ? {
      inputTokens: (_a15 = response.usage.prompt_tokens) != null ? _a15 : 0,
      outputTokens: (_b = response.usage.completion_tokens) != null ? _b : 0,
      totalTokens: ((_c = response.usage.prompt_tokens) != null ? _c : 0) + ((_d = response.usage.completion_tokens) != null ? _d : 0),
      reasoningTokens: (_f = (_e = response.usage.completion_tokens_details) == null ? void 0 : _e.reasoning_tokens) != null ? _f : 0,
      cachedInputTokens: (_h = (_g = response.usage.prompt_tokens_details) == null ? void 0 : _g.cached_tokens) != null ? _h : 0
    } : {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      reasoningTokens: 0,
      cachedInputTokens: 0
    };
    const reasoningDetails = (_i = choice.message.reasoning_details) != null ? _i : [];
    const reasoning = reasoningDetails.length > 0 ? reasoningDetails.map((detail) => {
      switch (detail.type) {
        case "reasoning.text" /* Text */: {
          if (detail.text) {
            return {
              type: "reasoning",
              text: detail.text
            };
          }
          break;
        }
        case "reasoning.summary" /* Summary */: {
          if (detail.summary) {
            return {
              type: "reasoning",
              text: detail.summary
            };
          }
          break;
        }
        case "reasoning.encrypted" /* Encrypted */: {
          if (detail.data) {
            return {
              type: "reasoning",
              text: "[REDACTED]"
            };
          }
          break;
        }
      }
      return null;
    }).filter((p) => p !== null) : choice.message.reasoning ? [
      {
        type: "reasoning",
        text: choice.message.reasoning
      }
    ] : [];
    const content = [];
    content.push(...reasoning);
    if (choice.message.content) {
      content.push({
        type: "text",
        text: choice.message.content
      });
    }
    if (choice.message.tool_calls) {
      for (const toolCall of choice.message.tool_calls) {
        content.push({
          type: "tool-call",
          toolCallId: (_j = toolCall.id) != null ? _j : generateId(),
          toolName: toolCall.function.name,
          input: toolCall.function.arguments
        });
      }
    }
    if (choice.message.images) {
      for (const image of choice.message.images) {
        content.push({
          type: "file",
          mediaType: getMediaType(image.image_url.url, "image/jpeg"),
          data: getBase64FromDataUrl(image.image_url.url)
        });
      }
    }
    if (choice.message.annotations) {
      for (const annotation of choice.message.annotations) {
        if (annotation.type === "url_citation") {
          content.push({
            type: "source",
            sourceType: "url",
            id: annotation.url_citation.url,
            url: annotation.url_citation.url,
            title: annotation.url_citation.title,
            providerMetadata: {
              openrouter: {
                content: annotation.url_citation.content || ""
              }
            }
          });
        }
      }
    }
    return {
      content,
      finishReason: mapOpenRouterFinishReason(choice.finish_reason),
      usage: usageInfo,
      warnings: [],
      providerMetadata: {
        openrouter: {
          provider: (_k = response.provider) != null ? _k : "",
          usage: {
            promptTokens: (_l = usageInfo.inputTokens) != null ? _l : 0,
            completionTokens: (_m = usageInfo.outputTokens) != null ? _m : 0,
            totalTokens: (_n = usageInfo.totalTokens) != null ? _n : 0,
            cost: (_o = response.usage) == null ? void 0 : _o.cost,
            promptTokensDetails: {
              cachedTokens: (_r = (_q = (_p = response.usage) == null ? void 0 : _p.prompt_tokens_details) == null ? void 0 : _q.cached_tokens) != null ? _r : 0
            },
            completionTokensDetails: {
              reasoningTokens: (_u = (_t = (_s = response.usage) == null ? void 0 : _s.completion_tokens_details) == null ? void 0 : _t.reasoning_tokens) != null ? _u : 0
            },
            costDetails: {
              upstreamInferenceCost: (_x = (_w = (_v = response.usage) == null ? void 0 : _v.cost_details) == null ? void 0 : _w.upstream_inference_cost) != null ? _x : 0
            }
          }
        }
      },
      request: { body: args },
      response: {
        id: response.id,
        modelId: response.model,
        headers: responseHeaders
      }
    };
  }
  async doStream(options) {
    var _a15;
    const providerOptions = options.providerOptions || {};
    const openrouterOptions = providerOptions.openrouter || {};
    const args = __spreadValues(__spreadValues({}, this.getArgs(options)), openrouterOptions);
    const { value: response, responseHeaders } = await postJsonToApi({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: __spreadProps(__spreadValues({}, args), {
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.compatibility === "strict" ? __spreadValues({
          include_usage: true
        }, ((_a15 = this.settings.usage) == null ? void 0 : _a15.include) ? { include_usage: true } : {}) : void 0
      }),
      failedResponseHandler: openrouterFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        OpenRouterStreamChatCompletionChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const toolCalls = [];
    let finishReason = "other";
    const usage = {
      inputTokens: Number.NaN,
      outputTokens: Number.NaN,
      totalTokens: Number.NaN,
      reasoningTokens: Number.NaN,
      cachedInputTokens: Number.NaN
    };
    const openrouterUsage = {};
    let textStarted = false;
    let reasoningStarted = false;
    let textId;
    let reasoningId;
    let openrouterResponseId;
    let provider;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a16, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (value.provider) {
              provider = value.provider;
            }
            if (value.id) {
              openrouterResponseId = value.id;
              controller.enqueue({
                type: "response-metadata",
                id: value.id
              });
            }
            if (value.model) {
              controller.enqueue({
                type: "response-metadata",
                modelId: value.model
              });
            }
            if (value.usage != null) {
              usage.inputTokens = value.usage.prompt_tokens;
              usage.outputTokens = value.usage.completion_tokens;
              usage.totalTokens = value.usage.prompt_tokens + value.usage.completion_tokens;
              openrouterUsage.promptTokens = value.usage.prompt_tokens;
              if (value.usage.prompt_tokens_details) {
                const cachedInputTokens = (_a16 = value.usage.prompt_tokens_details.cached_tokens) != null ? _a16 : 0;
                usage.cachedInputTokens = cachedInputTokens;
                openrouterUsage.promptTokensDetails = {
                  cachedTokens: cachedInputTokens
                };
              }
              openrouterUsage.completionTokens = value.usage.completion_tokens;
              if (value.usage.completion_tokens_details) {
                const reasoningTokens = (_b = value.usage.completion_tokens_details.reasoning_tokens) != null ? _b : 0;
                usage.reasoningTokens = reasoningTokens;
                openrouterUsage.completionTokensDetails = {
                  reasoningTokens
                };
              }
              openrouterUsage.cost = value.usage.cost;
              openrouterUsage.totalTokens = value.usage.total_tokens;
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenRouterFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            const emitReasoningChunk = (chunkText) => {
              if (!reasoningStarted) {
                reasoningId = openrouterResponseId || generateId();
                controller.enqueue({
                  type: "reasoning-start",
                  id: reasoningId
                });
                reasoningStarted = true;
              }
              controller.enqueue({
                type: "reasoning-delta",
                delta: chunkText,
                id: reasoningId || generateId()
              });
            };
            if (delta.reasoning_details && delta.reasoning_details.length > 0) {
              for (const detail of delta.reasoning_details) {
                switch (detail.type) {
                  case "reasoning.text" /* Text */: {
                    if (detail.text) {
                      emitReasoningChunk(detail.text);
                    }
                    break;
                  }
                  case "reasoning.encrypted" /* Encrypted */: {
                    if (detail.data) {
                      emitReasoningChunk("[REDACTED]");
                    }
                    break;
                  }
                  case "reasoning.summary" /* Summary */: {
                    if (detail.summary) {
                      emitReasoningChunk(detail.summary);
                    }
                    break;
                  }
                }
              }
            } else if (delta.reasoning) {
              emitReasoningChunk(delta.reasoning);
            }
            if (delta.content) {
              if (reasoningStarted && !textStarted) {
                controller.enqueue({
                  type: "reasoning-end",
                  id: reasoningId || generateId()
                });
                reasoningStarted = false;
              }
              if (!textStarted) {
                textId = openrouterResponseId || generateId();
                controller.enqueue({
                  type: "text-start",
                  id: textId
                });
                textStarted = true;
              }
              controller.enqueue({
                type: "text-delta",
                delta: delta.content,
                id: textId || generateId()
              });
            }
            if (delta.annotations) {
              for (const annotation of delta.annotations) {
                if (annotation.type === "url_citation") {
                  controller.enqueue({
                    type: "source",
                    sourceType: "url",
                    id: annotation.url_citation.url,
                    url: annotation.url_citation.url,
                    title: annotation.url_citation.title,
                    providerMetadata: {
                      openrouter: {
                        content: annotation.url_citation.content || ""
                      }
                    }
                  });
                }
              }
            }
            if (delta.tool_calls != null) {
              for (const toolCallDelta of delta.tool_calls) {
                const index = (_c = toolCallDelta.index) != null ? _c : toolCalls.length - 1;
                if (toolCalls[index] == null) {
                  if (toolCallDelta.type !== "function") {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`
                    });
                  }
                  if (toolCallDelta.id == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`
                    });
                  }
                  if (((_d = toolCallDelta.function) == null ? void 0 : _d.name) == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`
                    });
                  }
                  toolCalls[index] = {
                    id: toolCallDelta.id,
                    type: "function",
                    function: {
                      name: toolCallDelta.function.name,
                      arguments: (_e = toolCallDelta.function.arguments) != null ? _e : ""
                    },
                    inputStarted: false,
                    sent: false
                  };
                  const toolCall2 = toolCalls[index];
                  if (toolCall2 == null) {
                    throw new Error("Tool call is missing");
                  }
                  if (((_f = toolCall2.function) == null ? void 0 : _f.name) != null && ((_g = toolCall2.function) == null ? void 0 : _g.arguments) != null && isParsableJson(toolCall2.function.arguments)) {
                    toolCall2.inputStarted = true;
                    controller.enqueue({
                      type: "tool-input-start",
                      id: toolCall2.id,
                      toolName: toolCall2.function.name
                    });
                    controller.enqueue({
                      type: "tool-input-delta",
                      id: toolCall2.id,
                      delta: toolCall2.function.arguments
                    });
                    controller.enqueue({
                      type: "tool-input-end",
                      id: toolCall2.id
                    });
                    controller.enqueue({
                      type: "tool-call",
                      toolCallId: toolCall2.id,
                      toolName: toolCall2.function.name,
                      input: toolCall2.function.arguments
                    });
                    toolCall2.sent = true;
                  }
                  continue;
                }
                const toolCall = toolCalls[index];
                if (toolCall == null) {
                  throw new Error("Tool call is missing");
                }
                if (!toolCall.inputStarted) {
                  toolCall.inputStarted = true;
                  controller.enqueue({
                    type: "tool-input-start",
                    id: toolCall.id,
                    toolName: toolCall.function.name
                  });
                }
                if (((_h = toolCallDelta.function) == null ? void 0 : _h.arguments) != null) {
                  toolCall.function.arguments += (_j = (_i = toolCallDelta.function) == null ? void 0 : _i.arguments) != null ? _j : "";
                }
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.id,
                  delta: (_k = toolCallDelta.function.arguments) != null ? _k : ""
                });
                if (((_l = toolCall.function) == null ? void 0 : _l.name) != null && ((_m = toolCall.function) == null ? void 0 : _m.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId: (_n = toolCall.id) != null ? _n : generateId(),
                    toolName: toolCall.function.name,
                    input: toolCall.function.arguments
                  });
                  toolCall.sent = true;
                }
              }
            }
            if (delta.images != null) {
              for (const image of delta.images) {
                controller.enqueue({
                  type: "file",
                  mediaType: getMediaType(image.image_url.url, "image/jpeg"),
                  data: getBase64FromDataUrl(image.image_url.url)
                });
              }
            }
          },
          flush(controller) {
            var _a16;
            if (finishReason === "tool-calls") {
              for (const toolCall of toolCalls) {
                if (toolCall && !toolCall.sent) {
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId: (_a16 = toolCall.id) != null ? _a16 : generateId(),
                    toolName: toolCall.function.name,
                    // Coerce invalid arguments to an empty JSON object
                    input: isParsableJson(toolCall.function.arguments) ? toolCall.function.arguments : "{}"
                  });
                  toolCall.sent = true;
                }
              }
            }
            if (reasoningStarted) {
              controller.enqueue({
                type: "reasoning-end",
                id: reasoningId || generateId()
              });
            }
            if (textStarted) {
              controller.enqueue({
                type: "text-end",
                id: textId || generateId()
              });
            }
            const openrouterMetadata = {
              usage: openrouterUsage
            };
            if (provider !== void 0) {
              openrouterMetadata.provider = provider;
            }
            controller.enqueue({
              type: "finish",
              finishReason,
              usage,
              providerMetadata: {
                openrouter: openrouterMetadata
              }
            });
          }
        })
      ),
      warnings: [],
      request: { body: args },
      response: { headers: responseHeaders }
    };
  }
};

// src/completion/convert-to-openrouter-completion-prompt.ts
function convertToOpenRouterCompletionPrompt({
  prompt,
  inputFormat,
  user = "user",
  assistant = "assistant"
}) {
  if (prompt.length === 1 && prompt[0] && prompt[0].role === "user" && prompt[0].content.length === 1 && prompt[0].content[0] && prompt[0].content[0].type === "text") {
    return { prompt: prompt[0].content[0].text };
  }
  let text = "";
  if (prompt[0] && prompt[0].role === "system") {
    text += `${prompt[0].content}

`;
    prompt = prompt.slice(1);
  }
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError({
          message: `Unexpected system message in prompt: ${content}`,
          prompt
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "file": {
              throw new UnsupportedFunctionalityError({
                functionality: "file attachments"
              });
            }
            default: {
              return "";
            }
          }
        }).join("");
        text += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map(
          (part) => {
            switch (part.type) {
              case "text": {
                return part.text;
              }
              case "tool-call": {
                throw new UnsupportedFunctionalityError({
                  functionality: "tool-call messages"
                });
              }
              case "tool-result": {
                throw new UnsupportedFunctionalityError({
                  functionality: "tool-result messages"
                });
              }
              case "reasoning": {
                throw new UnsupportedFunctionalityError({
                  functionality: "reasoning messages"
                });
              }
              case "file": {
                throw new UnsupportedFunctionalityError({
                  functionality: "file attachments"
                });
              }
              default: {
                return "";
              }
            }
          }
        ).join("");
        text += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "tool messages"
        });
      }
    }
  }
  text += `${assistant}:
`;
  return {
    prompt: text
  };
}
var OpenRouterCompletionChunkSchema = union([
  object({
    id: string().optional(),
    model: string().optional(),
    choices: array(
      object({
        text: string(),
        reasoning: string().nullish().optional(),
        reasoning_details: ReasoningDetailArraySchema.nullish(),
        finish_reason: string().nullish(),
        index: number().nullish(),
        logprobs: object({
          tokens: array(string()),
          token_logprobs: array(number()),
          top_logprobs: array(record(string(), number())).nullable()
        }).nullable().optional()
      })
    ),
    usage: object({
      prompt_tokens: number(),
      prompt_tokens_details: object({
        cached_tokens: number()
      }).nullish(),
      completion_tokens: number(),
      completion_tokens_details: object({
        reasoning_tokens: number()
      }).nullish(),
      total_tokens: number(),
      cost: number().optional()
    }).nullish()
  }),
  OpenRouterErrorResponseSchema
]);

// src/completion/index.ts
var OpenRouterCompletionLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v2";
    this.provider = "openrouter";
    this.supportedUrls = {
      "image/*": [
        /^data:image\/[a-zA-Z]+;base64,/,
        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
      ],
      "text/*": [/^data:text\//, /^https?:\/\/.+$/],
      "application/*": [/^data:application\//, /^https?:\/\/.+$/]
    };
    this.defaultObjectGenerationMode = void 0;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    frequencyPenalty,
    presencePenalty,
    seed,
    responseFormat,
    topK,
    stopSequences,
    tools,
    toolChoice
  }) {
    const { prompt: completionPrompt } = convertToOpenRouterCompletionPrompt({
      prompt,
      inputFormat: "prompt"
    });
    if (tools == null ? void 0 : tools.length) {
      throw new UnsupportedFunctionalityError({
        functionality: "tools"
      });
    }
    if (toolChoice) {
      throw new UnsupportedFunctionalityError({
        functionality: "toolChoice"
      });
    }
    return __spreadValues(__spreadValues({
      // model id:
      model: this.modelId,
      models: this.settings.models,
      // model specific settings:
      logit_bias: this.settings.logitBias,
      logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxOutputTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,
      stop: stopSequences,
      response_format: responseFormat,
      top_k: topK,
      // prompt:
      prompt: completionPrompt,
      // OpenRouter specific settings:
      include_reasoning: this.settings.includeReasoning,
      reasoning: this.settings.reasoning
    }, this.config.extraBody), this.settings.extraBody);
  }
  async doGenerate(options) {
    var _a15, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    const providerOptions = options.providerOptions || {};
    const openrouterOptions = providerOptions.openrouter || {};
    const args = __spreadValues(__spreadValues({}, this.getArgs(options)), openrouterOptions);
    const { value: response, responseHeaders } = await postJsonToApi({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: openrouterFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        OpenRouterCompletionChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    if ("error" in response) {
      throw new Error(`${response.error.message}`);
    }
    const choice = response.choices[0];
    if (!choice) {
      throw new Error("No choice in OpenRouter completion response");
    }
    return {
      content: [
        {
          type: "text",
          text: (_a15 = choice.text) != null ? _a15 : ""
        }
      ],
      finishReason: mapOpenRouterFinishReason(choice.finish_reason),
      usage: {
        inputTokens: (_c = (_b = response.usage) == null ? void 0 : _b.prompt_tokens) != null ? _c : 0,
        outputTokens: (_e = (_d = response.usage) == null ? void 0 : _d.completion_tokens) != null ? _e : 0,
        totalTokens: ((_g = (_f = response.usage) == null ? void 0 : _f.prompt_tokens) != null ? _g : 0) + ((_i = (_h = response.usage) == null ? void 0 : _h.completion_tokens) != null ? _i : 0),
        reasoningTokens: (_l = (_k = (_j = response.usage) == null ? void 0 : _j.completion_tokens_details) == null ? void 0 : _k.reasoning_tokens) != null ? _l : 0,
        cachedInputTokens: (_o = (_n = (_m = response.usage) == null ? void 0 : _m.prompt_tokens_details) == null ? void 0 : _n.cached_tokens) != null ? _o : 0
      },
      warnings: [],
      response: {
        headers: responseHeaders
      }
    };
  }
  async doStream(options) {
    const providerOptions = options.providerOptions || {};
    const openrouterOptions = providerOptions.openrouter || {};
    const args = __spreadValues(__spreadValues({}, this.getArgs(options)), openrouterOptions);
    const { value: response, responseHeaders } = await postJsonToApi({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: __spreadProps(__spreadValues({}, args), {
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
      }),
      failedResponseHandler: openrouterFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        OpenRouterCompletionChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    let finishReason = "other";
    const usage = {
      inputTokens: Number.NaN,
      outputTokens: Number.NaN,
      totalTokens: Number.NaN,
      reasoningTokens: Number.NaN,
      cachedInputTokens: Number.NaN
    };
    const openrouterUsage = {};
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a15, _b;
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (value.usage != null) {
              usage.inputTokens = value.usage.prompt_tokens;
              usage.outputTokens = value.usage.completion_tokens;
              usage.totalTokens = value.usage.prompt_tokens + value.usage.completion_tokens;
              openrouterUsage.promptTokens = value.usage.prompt_tokens;
              if (value.usage.prompt_tokens_details) {
                const cachedInputTokens = (_a15 = value.usage.prompt_tokens_details.cached_tokens) != null ? _a15 : 0;
                usage.cachedInputTokens = cachedInputTokens;
                openrouterUsage.promptTokensDetails = {
                  cachedTokens: cachedInputTokens
                };
              }
              openrouterUsage.completionTokens = value.usage.completion_tokens;
              if (value.usage.completion_tokens_details) {
                const reasoningTokens = (_b = value.usage.completion_tokens_details.reasoning_tokens) != null ? _b : 0;
                usage.reasoningTokens = reasoningTokens;
                openrouterUsage.completionTokensDetails = {
                  reasoningTokens
                };
              }
              openrouterUsage.cost = value.usage.cost;
              openrouterUsage.totalTokens = value.usage.total_tokens;
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenRouterFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.text) != null) {
              controller.enqueue({
                type: "text-delta",
                delta: choice.text,
                id: generateId()
              });
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              usage,
              providerMetadata: {
                openrouter: {
                  usage: openrouterUsage
                }
              }
            });
          }
        })
      ),
      response: {
        headers: responseHeaders
      }
    };
  }
};

// src/provider.ts
function createOpenRouter(options = {}) {
  var _a15, _b, _c;
  const baseURL = (_b = withoutTrailingSlash((_a15 = options.baseURL) != null ? _a15 : options.baseUrl)) != null ? _b : "https://openrouter.ai/api/v1";
  const compatibility = (_c = options.compatibility) != null ? _c : "compatible";
  const getHeaders = () => __spreadValues({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "OPENROUTER_API_KEY",
      description: "OpenRouter"
    })}`
  }, options.headers);
  const createChatModel = (modelId, settings = {}) => new OpenRouterChatLanguageModel(modelId, settings, {
    provider: "openrouter.chat",
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    compatibility,
    fetch: options.fetch,
    extraBody: options.extraBody
  });
  const createCompletionModel = (modelId, settings = {}) => new OpenRouterCompletionLanguageModel(modelId, settings, {
    provider: "openrouter.completion",
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    compatibility,
    fetch: options.fetch,
    extraBody: options.extraBody
  });
  const createLanguageModel = (modelId, settings) => {
    if (new.target) {
      throw new Error(
        "The OpenRouter model function cannot be called with the new keyword."
      );
    }
    if (modelId === "openai/gpt-3.5-turbo-instruct") {
      return createCompletionModel(
        modelId,
        settings
      );
    }
    return createChatModel(modelId, settings);
  };
  const provider = (modelId, settings) => createLanguageModel(modelId, settings);
  provider.languageModel = createLanguageModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  return provider;
}
createOpenRouter({
  compatibility: "strict"
  // strict for OpenRouter API
});

// src/llm/model/gateway-resolver.ts
function parseModelRouterId(routerId, gatewayPrefix) {
  if (gatewayPrefix && !routerId.startsWith(`${gatewayPrefix}/`)) {
    throw new Error(`Expected ${gatewayPrefix}/ in model router ID ${routerId}`);
  }
  const idParts = routerId.split("/");
  if (gatewayPrefix && idParts.length < 3) {
    throw new Error(
      `Expected atleast 3 id parts ${gatewayPrefix}/provider/model, but only saw ${idParts.length} in ${routerId}`
    );
  }
  const providerId = idParts.at(gatewayPrefix ? 1 : 0);
  const modelId = idParts.slice(gatewayPrefix ? 2 : 1).join(`/`);
  if (!routerId.includes(`/`) || !providerId || !modelId) {
    throw new Error(
      `Attempted to parse provider/model from ${routerId} but this ID doesn't appear to contain a provider`
    );
  }
  return {
    providerId,
    modelId
  };
}

// src/llm/model/gateways/constants.ts
var PROVIDERS_WITH_INSTALLED_PACKAGES = ["anthropic", "google", "openai", "openrouter", "xai"];
var EXCLUDED_PROVIDERS = ["github-copilot"];

// src/llm/model/gateways/models-dev.ts
var OPENAI_COMPATIBLE_OVERRIDES = {
  cerebras: {
    url: "https://api.cerebras.ai/v1"
  },
  mistral: {
    url: "https://api.mistral.ai/v1"
  },
  groq: {
    url: "https://api.groq.com/openai/v1"
  },
  togetherai: {
    url: "https://api.together.xyz/v1"
  },
  deepinfra: {
    url: "https://api.deepinfra.com/v1/openai"
  },
  perplexity: {
    url: "https://api.perplexity.ai"
  },
  vercel: {
    url: "https://ai-gateway.vercel.sh/v1",
    apiKeyEnvVar: "AI_GATEWAY_API_KEY"
  }
};
var ModelsDevGateway = class extends MastraModelGateway {
  name = "models.dev";
  prefix = void 0;
  // No prefix for registry gateway
  providerConfigs = {};
  constructor(providerConfigs) {
    super();
    if (providerConfigs) this.providerConfigs = providerConfigs;
  }
  async fetchProviders() {
    const response = await fetch("https://models.dev/api.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch from models.dev: ${response.statusText}`);
    }
    const data = await response.json();
    const providerConfigs = {};
    for (const [providerId, providerInfo] of Object.entries(data)) {
      if (EXCLUDED_PROVIDERS.includes(providerId)) continue;
      if (!providerInfo || typeof providerInfo !== "object" || !providerInfo.models) continue;
      const normalizedId = providerId;
      const isOpenAICompatible = providerInfo.npm === "@ai-sdk/openai-compatible" || providerInfo.npm === "@ai-sdk/gateway" || // Vercel AI Gateway is OpenAI-compatible
      normalizedId in OPENAI_COMPATIBLE_OVERRIDES;
      const hasInstalledPackage = PROVIDERS_WITH_INSTALLED_PACKAGES.includes(providerId);
      const hasApiAndEnv = providerInfo.api && providerInfo.env && providerInfo.env.length > 0;
      if (isOpenAICompatible || hasInstalledPackage || hasApiAndEnv) {
        const modelIds = Object.keys(providerInfo.models).sort();
        const url = providerInfo.api || OPENAI_COMPATIBLE_OVERRIDES[normalizedId]?.url;
        if (!hasInstalledPackage && !url) {
          continue;
        }
        const apiKeyEnvVar = providerInfo.env?.[0] || `${normalizedId.toUpperCase().replace(/-/g, "_")}_API_KEY`;
        const apiKeyHeader = !hasInstalledPackage ? OPENAI_COMPATIBLE_OVERRIDES[normalizedId]?.apiKeyHeader || "Authorization" : void 0;
        providerConfigs[normalizedId] = {
          url,
          apiKeyEnvVar,
          apiKeyHeader,
          name: providerInfo.name || providerId.charAt(0).toUpperCase() + providerId.slice(1),
          models: modelIds,
          docUrl: providerInfo.doc,
          // Include documentation URL if available
          gateway: `models.dev`
        };
      }
    }
    this.providerConfigs = providerConfigs;
    return providerConfigs;
  }
  buildUrl(routerId, envVars) {
    const { providerId } = parseModelRouterId(routerId);
    const config = this.providerConfigs[providerId];
    if (!config?.url) {
      return;
    }
    const baseUrlEnvVar = `${providerId.toUpperCase().replace(/-/g, "_")}_BASE_URL`;
    const customBaseUrl = envVars?.[baseUrlEnvVar] || process.env[baseUrlEnvVar];
    return customBaseUrl || config.url;
  }
  getApiKey(modelId) {
    const [provider, model] = modelId.split("/");
    if (!provider || !model) {
      throw new Error(`Could not identify provider from model id ${modelId}`);
    }
    const config = this.providerConfigs[provider];
    if (!config) {
      throw new Error(`Could not find config for provider ${provider} with model id ${modelId}`);
    }
    const apiKey = typeof config.apiKeyEnvVar === `string` ? process.env[config.apiKeyEnvVar] : void 0;
    if (!apiKey) {
      throw new Error(`Could not find API key process.env.${config.apiKeyEnvVar} for model id ${modelId}`);
    }
    return Promise.resolve(apiKey);
  }
  async resolveLanguageModel({
    modelId,
    providerId,
    apiKey
  }) {
    const baseURL = this.buildUrl(`${providerId}/${modelId}`);
    switch (providerId) {
      case "openai":
        return createOpenAI({ apiKey }).responses(modelId);
      case "gemini":
      case "google":
        return createGoogleGenerativeAI({
          apiKey
        }).chat(modelId);
      case "anthropic":
        return createAnthropic({ apiKey })(modelId);
      case "openrouter":
        return createOpenRouter({ apiKey })(modelId);
      case "xai":
        return createXai({
          apiKey
        })(modelId);
      default:
        if (!baseURL) throw new Error(`No API URL found for ${providerId}/${modelId}`);
        return createOpenAICompatible({ name: providerId, apiKey, baseURL, supportsStructuredOutputs: true }).chatModel(
          modelId
        );
    }
  }
};

// A simple TTL cache with max capacity option, ms resolution,
// autopurge, and reasonably optimized performance
// Relies on the fact that integer Object keys are kept sorted,
// and managed very efficiently by V8.

/* istanbul ignore next */
const perf =
  typeof performance === 'object' &&
  performance &&
  typeof performance.now === 'function'
    ? performance
    : Date;

const now = () => perf.now();
const isPosInt = n => n && n === Math.floor(n) && n > 0 && isFinite(n);
const isPosIntOrInf = n => n === Infinity || isPosInt(n);

class TTLCache {
  constructor({
    max = Infinity,
    ttl,
    updateAgeOnGet = false,
    checkAgeOnGet = false,
    noUpdateTTL = false,
    dispose,
    noDisposeOnSet = false,
  } = {}) {
    // {[expirationTime]: [keys]}
    this.expirations = Object.create(null);
    // {key=>val}
    this.data = new Map();
    // {key=>expiration}
    this.expirationMap = new Map();
    if (ttl !== undefined && !isPosIntOrInf(ttl)) {
      throw new TypeError(
        'ttl must be positive integer or Infinity if set'
      )
    }
    if (!isPosIntOrInf(max)) {
      throw new TypeError('max must be positive integer or Infinity')
    }
    this.ttl = ttl;
    this.max = max;
    this.updateAgeOnGet = !!updateAgeOnGet;
    this.checkAgeOnGet = !!checkAgeOnGet;
    this.noUpdateTTL = !!noUpdateTTL;
    this.noDisposeOnSet = !!noDisposeOnSet;
    if (dispose !== undefined) {
      if (typeof dispose !== 'function') {
        throw new TypeError('dispose must be function if set')
      }
      this.dispose = dispose;
    }

    this.timer = undefined;
    this.timerExpiration = undefined;
  }

  setTimer(expiration, ttl) {
    if (this.timerExpiration < expiration) {
      return
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    const t = setTimeout(() => {
      this.timer = undefined;
      this.timerExpiration = undefined;
      this.purgeStale();
      for (const exp in this.expirations) {
        this.setTimer(exp, exp - now());
        break
      }
    }, ttl);

    /* istanbul ignore else - affordance for non-node envs */
    if (t.unref) t.unref();

    this.timerExpiration = expiration;
    this.timer = t;
  }

  // hang onto the timer so we can clearTimeout if all items
  // are deleted.  Deno doesn't have Timer.unref(), so it
  // hangs otherwise.
  cancelTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timerExpiration = undefined;
      this.timer = undefined;
    }
  }

  /* istanbul ignore next */
  cancelTimers() {
    process.emitWarning(
      'TTLCache.cancelTimers has been renamed to ' +
        'TTLCache.cancelTimer (no "s"), and will be removed in the next ' +
        'major version update'
    );
    return this.cancelTimer()
  }

  clear() {
    const entries =
      this.dispose !== TTLCache.prototype.dispose ? [...this] : [];
    this.data.clear();
    this.expirationMap.clear();
    // no need for any purging now
    this.cancelTimer();
    this.expirations = Object.create(null);
    for (const [key, val] of entries) {
      this.dispose(val, key, 'delete');
    }
  }

  setTTL(key, ttl = this.ttl) {
    const current = this.expirationMap.get(key);
    if (current !== undefined) {
      // remove from the expirations list, so it isn't purged
      const exp = this.expirations[current];
      if (!exp || exp.length <= 1) {
        delete this.expirations[current];
      } else {
        this.expirations[current] = exp.filter(k => k !== key);
      }
    }

    if (ttl !== Infinity) {
      const expiration = Math.floor(now() + ttl);
      this.expirationMap.set(key, expiration);
      if (!this.expirations[expiration]) {
        this.expirations[expiration] = [];
        this.setTimer(expiration, ttl);
      }
      this.expirations[expiration].push(key);
    } else {
      this.expirationMap.set(key, Infinity);
    }
  }

  set(
    key,
    val,
    {
      ttl = this.ttl,
      noUpdateTTL = this.noUpdateTTL,
      noDisposeOnSet = this.noDisposeOnSet,
    } = {}
  ) {
    if (!isPosIntOrInf(ttl)) {
      throw new TypeError('ttl must be positive integer or Infinity')
    }
    if (this.expirationMap.has(key)) {
      if (!noUpdateTTL) {
        this.setTTL(key, ttl);
      }
      // has old value
      const oldValue = this.data.get(key);
      if (oldValue !== val) {
        this.data.set(key, val);
        if (!noDisposeOnSet) {
          this.dispose(oldValue, key, 'set');
        }
      }
    } else {
      this.setTTL(key, ttl);
      this.data.set(key, val);
    }

    while (this.size > this.max) {
      this.purgeToCapacity();
    }

    return this
  }

  has(key) {
    return this.data.has(key)
  }

  getRemainingTTL(key) {
    const expiration = this.expirationMap.get(key);
    return expiration === Infinity
      ? expiration
      : expiration !== undefined
      ? Math.max(0, Math.ceil(expiration - now()))
      : 0
  }

  get(
    key,
    {
      updateAgeOnGet = this.updateAgeOnGet,
      ttl = this.ttl,
      checkAgeOnGet = this.checkAgeOnGet,
    } = {}
  ) {
    const val = this.data.get(key);
    if (checkAgeOnGet && this.getRemainingTTL(key) === 0) {
      this.delete(key);
      return undefined
    }
    if (updateAgeOnGet) {
      this.setTTL(key, ttl);
    }
    return val
  }

  dispose(_, __) {}

  delete(key) {
    const current = this.expirationMap.get(key);
    if (current !== undefined) {
      const value = this.data.get(key);
      this.data.delete(key);
      this.expirationMap.delete(key);
      const exp = this.expirations[current];
      if (exp) {
        if (exp.length <= 1) {
          delete this.expirations[current];
        } else {
          this.expirations[current] = exp.filter(k => k !== key);
        }
      }
      this.dispose(value, key, 'delete');
      if (this.size === 0) {
        this.cancelTimer();
      }
      return true
    }
    return false
  }

  purgeToCapacity() {
    for (const exp in this.expirations) {
      const keys = this.expirations[exp];
      if (this.size - keys.length >= this.max) {
        delete this.expirations[exp];
        const entries = [];
        for (const key of keys) {
          entries.push([key, this.data.get(key)]);
          this.data.delete(key);
          this.expirationMap.delete(key);
        }
        for (const [key, val] of entries) {
          this.dispose(val, key, 'evict');
        }
      } else {
        const s = this.size - this.max;
        const entries = [];
        for (const key of keys.splice(0, s)) {
          entries.push([key, this.data.get(key)]);
          this.data.delete(key);
          this.expirationMap.delete(key);
        }
        for (const [key, val] of entries) {
          this.dispose(val, key, 'evict');
        }
        return
      }
    }
  }

  get size() {
    return this.data.size
  }

  purgeStale() {
    const n = Math.ceil(now());
    for (const exp in this.expirations) {
      if (exp === 'Infinity' || exp > n) {
        return
      }

      /* istanbul ignore next
       * mysterious need for a guard here?
       * https://github.com/isaacs/ttlcache/issues/26 */
      const keys = [...(this.expirations[exp] || [])];
      const entries = [];
      delete this.expirations[exp];
      for (const key of keys) {
        entries.push([key, this.data.get(key)]);
        this.data.delete(key);
        this.expirationMap.delete(key);
      }
      for (const [key, val] of entries) {
        this.dispose(val, key, 'stale');
      }
    }
    if (this.size === 0) {
      this.cancelTimer();
    }
  }

  *entries() {
    for (const exp in this.expirations) {
      for (const key of this.expirations[exp]) {
        yield [key, this.data.get(key)];
      }
    }
  }
  *keys() {
    for (const exp in this.expirations) {
      for (const key of this.expirations[exp]) {
        yield key;
      }
    }
  }
  *values() {
    for (const exp in this.expirations) {
      for (const key of this.expirations[exp]) {
        yield this.data.get(key);
      }
    }
  }
  [Symbol.iterator]() {
    return this.entries()
  }
}

var ttlcache = TTLCache;

var TTLCache$1 = /*@__PURE__*/getDefaultExportFromCjs(ttlcache);

// src/cache/base.ts
var MastraServerCache = class extends MastraBase {
  constructor({ name }) {
    super({
      component: "SERVER_CACHE",
      name
    });
  }
};
var InMemoryServerCache = class extends MastraServerCache {
  cache = new TTLCache$1({
    max: 1e3,
    ttl: 1e3 * 60 * 5
  });
  constructor() {
    super({ name: "InMemoryServerCache" });
  }
  async get(key) {
    return this.cache.get(key);
  }
  async set(key, value) {
    this.cache.set(key, value);
  }
  async listLength(key) {
    const list = this.cache.get(key);
    if (!Array.isArray(list)) {
      throw new Error(`${key} is not an array`);
    }
    return list.length;
  }
  async listPush(key, value) {
    const list = this.cache.get(key);
    if (Array.isArray(list)) {
      list.push(value);
    } else {
      this.cache.set(key, [value]);
    }
  }
  async listFromTo(key, from, to = -1) {
    const list = this.cache.get(key);
    if (Array.isArray(list)) {
      const endIndex = to === -1 ? void 0 : to + 1;
      return list.slice(from, endIndex);
    }
    return [];
  }
  async delete(key) {
    this.cache.delete(key);
  }
  async clear() {
    this.cache.clear();
  }
};

var NetlifyGateway = class extends MastraModelGateway {
  name = "netlify";
  prefix = "netlify";
  // All providers will be prefixed with "netlify/"
  tokenCache = new InMemoryServerCache();
  async fetchProviders() {
    const response = await fetch("https://api.netlify.com/api/v1/ai-gateway/providers");
    if (!response.ok) {
      throw new Error(`Failed to fetch from Netlify: ${response.statusText}`);
    }
    const data = await response.json();
    const netlify = {
      apiKeyEnvVar: ["NETLIFY_TOKEN", "NETLIFY_SITE_ID"],
      apiKeyHeader: "Authorization",
      // Netlify uses standard Bearer auth
      name: `Netlify`,
      gateway: `netlify`,
      models: [],
      docUrl: "https://docs.netlify.com/build/ai-gateway/overview/"
    };
    for (const [providerId, provider] of Object.entries(data.providers)) {
      for (const model of provider.models) {
        netlify.models.push(`${providerId}/${model}`);
      }
    }
    return { netlify };
  }
  async buildUrl(routerId, envVars) {
    const siteId = envVars?.["NETLIFY_SITE_ID"] || process.env["NETLIFY_SITE_ID"];
    const netlifyToken = envVars?.["NETLIFY_TOKEN"] || process.env["NETLIFY_TOKEN"];
    if (!netlifyToken) {
      throw new MastraError({
        id: "NETLIFY_GATEWAY_NO_TOKEN",
        domain: "LLM",
        category: "UNKNOWN",
        text: `Missing NETLIFY_TOKEN environment variable required for model: ${routerId}`
      });
    }
    if (!siteId) {
      throw new MastraError({
        id: "NETLIFY_GATEWAY_NO_SITE_ID",
        domain: "LLM",
        category: "UNKNOWN",
        text: `Missing NETLIFY_SITE_ID environment variable required for model: ${routerId}`
      });
    }
    try {
      const tokenData = await this.getOrFetchToken(siteId, netlifyToken);
      return tokenData.url.endsWith(`/`) ? tokenData.url.substring(0, tokenData.url.length - 1) : tokenData.url;
    } catch (error) {
      throw new MastraError({
        id: "NETLIFY_GATEWAY_TOKEN_ERROR",
        domain: "LLM",
        category: "UNKNOWN",
        text: `Failed to get Netlify AI Gateway token for model ${routerId}: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }
  /**
   * Get cached token or fetch a new site-specific AI Gateway token from Netlify
   */
  async getOrFetchToken(siteId, netlifyToken) {
    const cacheKey = `netlify-token:${siteId}:${netlifyToken}`;
    const cached = await this.tokenCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now() / 1e3 + 60) {
      return { token: cached.token, url: cached.url };
    }
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/ai-gateway/token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${netlifyToken}`
      }
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get Netlify AI Gateway token: ${response.status} ${error}`);
    }
    const tokenResponse = await response.json();
    await this.tokenCache.set(cacheKey, {
      token: tokenResponse.token,
      url: tokenResponse.url,
      expiresAt: tokenResponse.expires_at
    });
    return { token: tokenResponse.token, url: tokenResponse.url };
  }
  /**
   * Get cached token or fetch a new site-specific AI Gateway token from Netlify
   */
  async getApiKey(modelId) {
    const siteId = process.env["NETLIFY_SITE_ID"];
    const netlifyToken = process.env["NETLIFY_TOKEN"];
    if (!netlifyToken) {
      throw new MastraError({
        id: "NETLIFY_GATEWAY_NO_TOKEN",
        domain: "LLM",
        category: "UNKNOWN",
        text: `Missing NETLIFY_TOKEN environment variable required for model: ${modelId}`
      });
    }
    if (!siteId) {
      throw new MastraError({
        id: "NETLIFY_GATEWAY_NO_SITE_ID",
        domain: "LLM",
        category: "UNKNOWN",
        text: `Missing NETLIFY_SITE_ID environment variable required for model: ${modelId}`
      });
    }
    try {
      return (await this.getOrFetchToken(siteId, netlifyToken)).token;
    } catch (error) {
      throw new MastraError({
        id: "NETLIFY_GATEWAY_TOKEN_ERROR",
        domain: "LLM",
        category: "UNKNOWN",
        text: `Failed to get Netlify AI Gateway token for model ${modelId}: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }
  async resolveLanguageModel({
    modelId,
    providerId,
    apiKey
  }) {
    const baseURL = await this.buildUrl(`${providerId}/${modelId}`);
    switch (providerId) {
      case "openai":
        return createOpenAI({ apiKey, baseURL }).responses(modelId);
      case "gemini":
        return createGoogleGenerativeAI({
          baseURL: `${baseURL}/v1beta/`,
          apiKey,
          headers: {
            "user-agent": "google-genai-sdk/"
          }
        }).chat(modelId);
      case "anthropic":
        return createAnthropic({
          apiKey,
          baseURL: `${baseURL}/v1/`,
          headers: {
            "anthropic-version": "2023-06-01",
            "user-agent": "anthropic/"
          }
        })(modelId);
      default:
        return createOpenAICompatible({ name: providerId, apiKey, baseURL, supportsStructuredOutputs: true }).chatModel(
          modelId
        );
    }
  }
};

// src/llm/model/provider-registry.json
var provider_registry_default = {
  providers: {
    "moonshotai-cn": {
      url: "https://api.moonshot.cn/v1",
      apiKeyEnvVar: "MOONSHOT_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Moonshot AI (China)",
      models: ["kimi-k2-0711-preview", "kimi-k2-0905-preview", "kimi-k2-turbo-preview"],
      docUrl: "https://platform.moonshot.cn/docs/api/chat",
      gateway: "models.dev"
    },
    lucidquery: {
      url: "https://lucidquery.com/api/v1",
      apiKeyEnvVar: "LUCIDQUERY_API_KEY",
      apiKeyHeader: "Authorization",
      name: "LucidQuery AI",
      models: ["lucidnova-rf1-100b", "lucidquery-nexus-coder"],
      docUrl: "https://lucidquery.com/api/docs",
      gateway: "models.dev"
    },
    moonshotai: {
      url: "https://api.moonshot.ai/v1",
      apiKeyEnvVar: "MOONSHOT_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Moonshot AI",
      models: ["kimi-k2-0711-preview", "kimi-k2-0905-preview", "kimi-k2-turbo-preview"],
      docUrl: "https://platform.moonshot.ai/docs/api/chat",
      gateway: "models.dev"
    },
    "zai-coding-plan": {
      url: "https://api.z.ai/api/coding/paas/v4",
      apiKeyEnvVar: "ZHIPU_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Z.AI Coding Plan",
      models: ["glm-4.5", "glm-4.5-air", "glm-4.5-flash", "glm-4.5v", "glm-4.6"],
      docUrl: "https://docs.z.ai/devpack/overview",
      gateway: "models.dev"
    },
    alibaba: {
      url: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
      apiKeyEnvVar: "DASHSCOPE_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Alibaba",
      models: [
        "qvq-max",
        "qwen-flash",
        "qwen-max",
        "qwen-mt-plus",
        "qwen-mt-turbo",
        "qwen-omni-turbo",
        "qwen-omni-turbo-realtime",
        "qwen-plus",
        "qwen-plus-character-ja",
        "qwen-turbo",
        "qwen-vl-max",
        "qwen-vl-ocr",
        "qwen-vl-plus",
        "qwen2-5-14b-instruct",
        "qwen2-5-32b-instruct",
        "qwen2-5-72b-instruct",
        "qwen2-5-7b-instruct",
        "qwen2-5-omni-7b",
        "qwen2-5-vl-72b-instruct",
        "qwen2-5-vl-7b-instruct",
        "qwen3-14b",
        "qwen3-235b-a22b",
        "qwen3-32b",
        "qwen3-8b",
        "qwen3-asr-flash",
        "qwen3-coder-30b-a3b-instruct",
        "qwen3-coder-480b-a35b-instruct",
        "qwen3-coder-flash",
        "qwen3-coder-plus",
        "qwen3-livetranslate-flash-realtime",
        "qwen3-max",
        "qwen3-next-80b-a3b-instruct",
        "qwen3-next-80b-a3b-thinking",
        "qwen3-omni-flash",
        "qwen3-omni-flash-realtime",
        "qwen3-vl-235b-a22b",
        "qwen3-vl-30b-a3b",
        "qwen3-vl-plus",
        "qwq-plus"
      ],
      docUrl: "https://www.alibabacloud.com/help/en/model-studio/models",
      gateway: "models.dev"
    },
    xai: {
      apiKeyEnvVar: "XAI_API_KEY",
      name: "xAI",
      models: [
        "grok-2",
        "grok-2-1212",
        "grok-2-latest",
        "grok-2-vision",
        "grok-2-vision-1212",
        "grok-2-vision-latest",
        "grok-3",
        "grok-3-fast",
        "grok-3-fast-latest",
        "grok-3-latest",
        "grok-3-mini",
        "grok-3-mini-fast",
        "grok-3-mini-fast-latest",
        "grok-3-mini-latest",
        "grok-4",
        "grok-4-fast",
        "grok-4-fast-non-reasoning",
        "grok-beta",
        "grok-code-fast-1",
        "grok-vision-beta"
      ],
      docUrl: "https://docs.x.ai/docs/models",
      gateway: "models.dev"
    },
    vultr: {
      url: "https://api.vultrinference.com/v1",
      apiKeyEnvVar: "VULTR_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Vultr",
      models: [
        "deepseek-r1-distill-llama-70b",
        "deepseek-r1-distill-qwen-32b",
        "gpt-oss-120b",
        "kimi-k2-instruct",
        "qwen2.5-coder-32b-instruct"
      ],
      docUrl: "https://api.vultrinference.com/",
      gateway: "models.dev"
    },
    nvidia: {
      url: "https://integrate.api.nvidia.com/v1",
      apiKeyEnvVar: "NVIDIA_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Nvidia",
      models: [
        "black-forest-labs/flux.1-dev",
        "deepseek-ai/deepseek-v3.1",
        "deepseek-ai/deepseek-v3.1-terminus",
        "google/gemma-3-27b-it",
        "microsoft/phi-4-mini-instruct",
        "moonshotai/kimi-k2-instruct",
        "moonshotai/kimi-k2-instruct-0905",
        "nvidia/cosmos-nemotron-34b",
        "nvidia/llama-3.1-nemotron-ultra-253b-v1",
        "nvidia/llama-embed-nemotron-8b",
        "nvidia/nemoretriever-ocr-v1",
        "nvidia/parakeet-tdt-0.6b-v2",
        "openai/gpt-oss-120b",
        "openai/whisper-large-v3",
        "qwen/qwen3-235b-a22b",
        "qwen/qwen3-coder-480b-a35b-instruct"
      ],
      docUrl: "https://docs.api.nvidia.com/nim/",
      gateway: "models.dev"
    },
    upstage: {
      url: "https://api.upstage.ai",
      apiKeyEnvVar: "UPSTAGE_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Upstage",
      models: ["solar-mini", "solar-pro2"],
      docUrl: "https://developers.upstage.ai/docs/apis/chat",
      gateway: "models.dev"
    },
    groq: {
      url: "https://api.groq.com/openai/v1",
      apiKeyEnvVar: "GROQ_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Groq",
      models: [
        "deepseek-r1-distill-llama-70b",
        "gemma2-9b-it",
        "llama-3.1-8b-instant",
        "llama-3.3-70b-versatile",
        "llama-guard-3-8b",
        "llama3-70b-8192",
        "llama3-8b-8192",
        "meta-llama/llama-4-maverick-17b-128e-instruct",
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "meta-llama/llama-guard-4-12b",
        "mistral-saba-24b",
        "moonshotai/kimi-k2-instruct",
        "moonshotai/kimi-k2-instruct-0905",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "qwen-qwq-32b",
        "qwen/qwen3-32b"
      ],
      docUrl: "https://console.groq.com/docs/models",
      gateway: "models.dev"
    },
    mistral: {
      url: "https://api.mistral.ai/v1",
      apiKeyEnvVar: "MISTRAL_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Mistral",
      models: [
        "codestral-latest",
        "devstral-medium-2507",
        "devstral-small-2505",
        "devstral-small-2507",
        "magistral-medium-latest",
        "magistral-small",
        "ministral-3b-latest",
        "ministral-8b-latest",
        "mistral-large-latest",
        "mistral-medium-2505",
        "mistral-medium-2508",
        "mistral-medium-latest",
        "mistral-nemo",
        "mistral-small-latest",
        "open-mistral-7b",
        "open-mixtral-8x22b",
        "open-mixtral-8x7b",
        "pixtral-12b",
        "pixtral-large-latest"
      ],
      docUrl: "https://docs.mistral.ai/getting-started/models/",
      gateway: "models.dev"
    },
    vercel: {
      url: "https://ai-gateway.vercel.sh/v1",
      apiKeyEnvVar: "AI_GATEWAY_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Vercel AI Gateway",
      models: [
        "alibaba/qwen3-coder-plus",
        "alibaba/qwen3-max",
        "alibaba/qwen3-next-80b-a3b-instruct",
        "alibaba/qwen3-next-80b-a3b-thinking",
        "alibaba/qwen3-vl-instruct",
        "alibaba/qwen3-vl-thinking",
        "amazon/nova-lite",
        "amazon/nova-micro",
        "amazon/nova-pro",
        "anthropic/claude-3-haiku",
        "anthropic/claude-3-opus",
        "anthropic/claude-3.5-haiku",
        "anthropic/claude-3.5-sonnet",
        "anthropic/claude-3.7-sonnet",
        "anthropic/claude-4-1-opus",
        "anthropic/claude-4-opus",
        "anthropic/claude-4-sonnet",
        "anthropic/claude-4.5-sonnet",
        "anthropic/claude-haiku-4.5",
        "cerebras/qwen3-coder",
        "deepseek/deepseek-r1",
        "deepseek/deepseek-r1-distill-llama-70b",
        "deepseek/deepseek-v3.1-terminus",
        "deepseek/deepseek-v3.2-exp",
        "deepseek/deepseek-v3.2-exp-thinking",
        "google/gemini-2.0-flash",
        "google/gemini-2.0-flash-lite",
        "google/gemini-2.5-flash",
        "google/gemini-2.5-flash-lite",
        "google/gemini-2.5-flash-lite-preview-09-2025",
        "google/gemini-2.5-flash-preview-09-2025",
        "google/gemini-2.5-pro",
        "meta/llama-3.3-70b",
        "meta/llama-4-maverick",
        "meta/llama-4-scout",
        "mistral/codestral",
        "mistral/magistral-medium",
        "mistral/magistral-small",
        "mistral/ministral-3b",
        "mistral/ministral-8b",
        "mistral/mistral-large",
        "mistral/mistral-small",
        "mistral/mixtral-8x22b-instruct",
        "mistral/pixtral-12b",
        "mistral/pixtral-large",
        "moonshotai/kimi-k2",
        "morph/morph-v3-fast",
        "morph/morph-v3-large",
        "openai/gpt-4-turbo",
        "openai/gpt-4.1",
        "openai/gpt-4.1-mini",
        "openai/gpt-4.1-nano",
        "openai/gpt-4o",
        "openai/gpt-4o-mini",
        "openai/gpt-5",
        "openai/gpt-5-codex",
        "openai/gpt-5-mini",
        "openai/gpt-5-nano",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "openai/o1",
        "openai/o3",
        "openai/o3-mini",
        "openai/o4-mini",
        "perplexity/sonar",
        "perplexity/sonar-pro",
        "perplexity/sonar-reasoning",
        "perplexity/sonar-reasoning-pro",
        "vercel/v0-1.0-md",
        "vercel/v0-1.5-md",
        "xai/grok-2",
        "xai/grok-2-vision",
        "xai/grok-3",
        "xai/grok-3-fast",
        "xai/grok-3-mini",
        "xai/grok-3-mini-fast",
        "xai/grok-4",
        "xai/grok-4-fast",
        "xai/grok-4-fast-non-reasoning",
        "xai/grok-code-fast-1",
        "zai/glm-4.5",
        "zai/glm-4.5-air",
        "zai/glm-4.5v",
        "zai/glm-4.6"
      ],
      docUrl: "https://github.com/vercel/ai/tree/5eb85cc45a259553501f535b8ac79a77d0e79223/packages/gateway",
      gateway: "models.dev"
    },
    nebius: {
      url: "https://api.studio.nebius.com/v1/",
      apiKeyEnvVar: "NEBIUS_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Nebius AI Studio",
      models: [
        "NousResearch/hermes-4-405b",
        "NousResearch/hermes-4-70b",
        "deepseek-ai/deepseek-v3",
        "meta-llama/llama-3.3-70b-instruct-base",
        "meta-llama/llama-3.3-70b-instruct-fast",
        "meta-llama/llama-3_1-405b-instruct",
        "moonshotai/kimi-k2-instruct",
        "nvidia/llama-3_1-nemotron-ultra-253b-v1",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "qwen/qwen3-235b-a22b-instruct-2507",
        "qwen/qwen3-235b-a22b-thinking-2507",
        "qwen/qwen3-coder-480b-a35b-instruct",
        "zai-org/glm-4.5",
        "zai-org/glm-4.5-air"
      ],
      docUrl: "https://docs.studio.nebius.com/quickstart",
      gateway: "models.dev"
    },
    deepseek: {
      url: "https://api.deepseek.com",
      apiKeyEnvVar: "DEEPSEEK_API_KEY",
      apiKeyHeader: "Authorization",
      name: "DeepSeek",
      models: ["deepseek-chat", "deepseek-reasoner"],
      docUrl: "https://platform.deepseek.com/api-docs/pricing",
      gateway: "models.dev"
    },
    "alibaba-cn": {
      url: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      apiKeyEnvVar: "DASHSCOPE_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Alibaba (China)",
      models: [
        "deepseek-r1",
        "deepseek-r1-0528",
        "deepseek-r1-distill-llama-70b",
        "deepseek-r1-distill-llama-8b",
        "deepseek-r1-distill-qwen-1-5b",
        "deepseek-r1-distill-qwen-14b",
        "deepseek-r1-distill-qwen-32b",
        "deepseek-r1-distill-qwen-7b",
        "deepseek-v3",
        "deepseek-v3-1",
        "deepseek-v3-2-exp",
        "moonshot-kimi-k2-instruct",
        "qvq-max",
        "qwen-deep-research",
        "qwen-doc-turbo",
        "qwen-flash",
        "qwen-long",
        "qwen-math-plus",
        "qwen-math-turbo",
        "qwen-max",
        "qwen-mt-plus",
        "qwen-mt-turbo",
        "qwen-omni-turbo",
        "qwen-omni-turbo-realtime",
        "qwen-plus",
        "qwen-plus-character",
        "qwen-turbo",
        "qwen-vl-max",
        "qwen-vl-ocr",
        "qwen-vl-plus",
        "qwen2-5-14b-instruct",
        "qwen2-5-32b-instruct",
        "qwen2-5-72b-instruct",
        "qwen2-5-7b-instruct",
        "qwen2-5-coder-32b-instruct",
        "qwen2-5-coder-7b-instruct",
        "qwen2-5-math-72b-instruct",
        "qwen2-5-math-7b-instruct",
        "qwen2-5-omni-7b",
        "qwen2-5-vl-72b-instruct",
        "qwen2-5-vl-7b-instruct",
        "qwen3-14b",
        "qwen3-235b-a22b",
        "qwen3-32b",
        "qwen3-8b",
        "qwen3-asr-flash",
        "qwen3-coder-30b-a3b-instruct",
        "qwen3-coder-480b-a35b-instruct",
        "qwen3-coder-flash",
        "qwen3-coder-plus",
        "qwen3-max",
        "qwen3-next-80b-a3b-instruct",
        "qwen3-next-80b-a3b-thinking",
        "qwen3-omni-flash",
        "qwen3-omni-flash-realtime",
        "qwen3-vl-235b-a22b",
        "qwen3-vl-30b-a3b",
        "qwen3-vl-plus",
        "qwq-32b",
        "qwq-plus",
        "tongyi-intent-detect-v3"
      ],
      docUrl: "https://www.alibabacloud.com/help/en/model-studio/models",
      gateway: "models.dev"
    },
    venice: {
      url: "https://api.venice.ai/api/v1",
      apiKeyEnvVar: "VENICE_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Venice AI",
      models: [
        "deepseek-coder-v2-lite",
        "deepseek-r1-671b",
        "dolphin-2.9.2-qwen2-72b",
        "llama-3.1-405b",
        "llama-3.2-3b",
        "llama-3.3-70b",
        "mistral-31-24b",
        "qwen-2.5-coder-32b",
        "qwen-2.5-qwq-32b",
        "qwen-2.5-vl",
        "qwen3-235b",
        "qwen3-4b",
        "venice-uncensored"
      ],
      docUrl: "https://docs.venice.ai",
      gateway: "models.dev"
    },
    chutes: {
      url: "https://llm.chutes.ai/v1",
      apiKeyEnvVar: "CHUTES_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Chutes",
      models: [
        "Qwen/Qwen3-235B-A22B-Instruct-2507",
        "Qwen/Qwen3-235B-A22B-Thinking-2507",
        "Qwen/Qwen3-30B-A3B",
        "Qwen/Qwen3-30B-A3B-Instruct-2507",
        "Qwen/Qwen3-30B-A3B-Thinking-2507",
        "Qwen/Qwen3-Coder-30B-A3B-Instruct",
        "Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8",
        "Qwen/Qwen3-Next-80B-A3B-Instruct",
        "Qwen/Qwen3-Next-80B-A3B-Thinking",
        "chutesai/Devstral-Small-2505",
        "chutesai/Mistral-Small-3.2-24B-Instruct-2506",
        "deepseek-ai/DeepSeek-R1-0528",
        "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
        "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
        "deepseek-ai/DeepSeek-V3-0324",
        "deepseek-ai/DeepSeek-V3.1",
        "deepseek-ai/DeepSeek-V3.1-Terminus",
        "deepseek-ai/DeepSeek-V3.1-turbo",
        "deepseek-ai/DeepSeek-V3.1:THINKING",
        "deepseek-ai/DeepSeek-V3.2-Exp",
        "meituan-longcat/LongCat-Flash-Chat-FP8",
        "moonshotai/Kimi-Dev-72B",
        "moonshotai/Kimi-K2-Instruct-0905",
        "moonshotai/Kimi-K2-Instruct-75k",
        "moonshotai/Kimi-VL-A3B-Thinking",
        "openai/gpt-oss-120b",
        "tngtech/DeepSeek-R1T-Chimera",
        "tngtech/DeepSeek-TNG-R1T2-Chimera",
        "zai-org/GLM-4.5-Air",
        "zai-org/GLM-4.5-FP8",
        "zai-org/GLM-4.5-turbo",
        "zai-org/GLM-4.6-FP8",
        "zai-org/GLM-4.6-turbo"
      ],
      docUrl: "https://llm.chutes.ai/v1/models",
      gateway: "models.dev"
    },
    cortecs: {
      url: "https://api.cortecs.ai/v1",
      apiKeyEnvVar: "CORTECS_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Cortecs",
      models: [
        "claude-4-5-sonnet",
        "claude-sonnet-4",
        "deepseek-v3-0324",
        "gemini-2.5-pro",
        "gpt-4.1",
        "gpt-oss-120b",
        "kimi-k2-instruct",
        "llama-3.1-405b-instruct",
        "nova-pro-v1",
        "qwen3-32b",
        "qwen3-coder-480b-a35b-instruct"
      ],
      docUrl: "https://api.cortecs.ai/v1/models",
      gateway: "models.dev"
    },
    "github-models": {
      url: "https://models.github.ai/inference",
      apiKeyEnvVar: "GITHUB_TOKEN",
      apiKeyHeader: "Authorization",
      name: "GitHub Models",
      models: [
        "ai21-labs/ai21-jamba-1.5-large",
        "ai21-labs/ai21-jamba-1.5-mini",
        "cohere/cohere-command-a",
        "cohere/cohere-command-r",
        "cohere/cohere-command-r-08-2024",
        "cohere/cohere-command-r-plus",
        "cohere/cohere-command-r-plus-08-2024",
        "core42/jais-30b-chat",
        "deepseek/deepseek-r1",
        "deepseek/deepseek-r1-0528",
        "deepseek/deepseek-v3-0324",
        "meta/llama-3.2-11b-vision-instruct",
        "meta/llama-3.2-90b-vision-instruct",
        "meta/llama-3.3-70b-instruct",
        "meta/llama-4-maverick-17b-128e-instruct-fp8",
        "meta/llama-4-scout-17b-16e-instruct",
        "meta/meta-llama-3-70b-instruct",
        "meta/meta-llama-3-8b-instruct",
        "meta/meta-llama-3.1-405b-instruct",
        "meta/meta-llama-3.1-70b-instruct",
        "meta/meta-llama-3.1-8b-instruct",
        "microsoft/mai-ds-r1",
        "microsoft/phi-3-medium-128k-instruct",
        "microsoft/phi-3-medium-4k-instruct",
        "microsoft/phi-3-mini-128k-instruct",
        "microsoft/phi-3-mini-4k-instruct",
        "microsoft/phi-3-small-128k-instruct",
        "microsoft/phi-3-small-8k-instruct",
        "microsoft/phi-3.5-mini-instruct",
        "microsoft/phi-3.5-moe-instruct",
        "microsoft/phi-3.5-vision-instruct",
        "microsoft/phi-4",
        "microsoft/phi-4-mini-instruct",
        "microsoft/phi-4-mini-reasoning",
        "microsoft/phi-4-multimodal-instruct",
        "microsoft/phi-4-reasoning",
        "mistral-ai/codestral-2501",
        "mistral-ai/ministral-3b",
        "mistral-ai/mistral-large-2411",
        "mistral-ai/mistral-medium-2505",
        "mistral-ai/mistral-nemo",
        "mistral-ai/mistral-small-2503",
        "openai/gpt-4.1",
        "openai/gpt-4.1-mini",
        "openai/gpt-4.1-nano",
        "openai/gpt-4o",
        "openai/gpt-4o-mini",
        "openai/o1",
        "openai/o1-mini",
        "openai/o1-preview",
        "openai/o3",
        "openai/o3-mini",
        "openai/o4-mini",
        "xai/grok-3",
        "xai/grok-3-mini"
      ],
      docUrl: "https://docs.github.com/en/github-models",
      gateway: "models.dev"
    },
    togetherai: {
      url: "https://api.together.xyz/v1",
      apiKeyEnvVar: "TOGETHER_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Together AI",
      models: [
        "Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8",
        "deepseek-ai/DeepSeek-R1",
        "deepseek-ai/DeepSeek-V3",
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "moonshotai/Kimi-K2-Instruct",
        "openai/gpt-oss-120b"
      ],
      docUrl: "https://docs.together.ai/docs/serverless-models",
      gateway: "models.dev"
    },
    baseten: {
      url: "https://inference.baseten.co/v1",
      apiKeyEnvVar: "BASETEN_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Baseten",
      models: ["Qwen3/Qwen3-Coder-480B-A35B-Instruct", "moonshotai/Kimi-K2-Instruct-0905", "zai-org/GLM-4.6"],
      docUrl: "https://docs.baseten.co/development/model-apis/overview",
      gateway: "models.dev"
    },
    huggingface: {
      url: "https://router.huggingface.co/v1",
      apiKeyEnvVar: "HF_TOKEN",
      apiKeyHeader: "Authorization",
      name: "Hugging Face",
      models: [
        "MiniMaxAI/MiniMax-M2",
        "Qwen/Qwen3-235B-A22B-Thinking-2507",
        "Qwen/Qwen3-Coder-480B-A35B-Instruct",
        "Qwen/Qwen3-Embedding-4B",
        "Qwen/Qwen3-Embedding-8B",
        "Qwen/Qwen3-Next-80B-A3B-Instruct",
        "Qwen/Qwen3-Next-80B-A3B-Thinking",
        "deepseek-ai/DeepSeek-R1-0528",
        "deepseek-ai/Deepseek-V3-0324",
        "moonshotai/Kimi-K2-Instruct",
        "moonshotai/Kimi-K2-Instruct-0905",
        "zai-org/GLM-4.5",
        "zai-org/GLM-4.5-Air",
        "zai-org/GLM-4.6"
      ],
      docUrl: "https://huggingface.co/docs/inference-providers",
      gateway: "models.dev"
    },
    opencode: {
      url: "https://opencode.ai/zen/v1",
      apiKeyEnvVar: "OPENCODE_API_KEY",
      apiKeyHeader: "Authorization",
      name: "OpenCode Zen",
      models: [
        "an-gbt",
        "big-pickle",
        "claude-3-5-haiku",
        "claude-haiku-4-5",
        "claude-opus-4-1",
        "claude-sonnet-4",
        "claude-sonnet-4-5",
        "glm-4.6",
        "gpt-5",
        "gpt-5-codex",
        "grok-code",
        "kimi-k2",
        "minimax-m2",
        "qwen3-coder"
      ],
      docUrl: "https://opencode.ai/docs/zen",
      gateway: "models.dev"
    },
    fastrouter: {
      url: "https://go.fastrouter.ai/api/v1",
      apiKeyEnvVar: "FASTROUTER_API_KEY",
      apiKeyHeader: "Authorization",
      name: "FastRouter",
      models: [
        "anthropic/claude-opus-4.1",
        "anthropic/claude-sonnet-4",
        "deepseek-ai/deepseek-r1-distill-llama-70b",
        "google/gemini-2.5-flash",
        "google/gemini-2.5-pro",
        "moonshotai/kimi-k2",
        "openai/gpt-4.1",
        "openai/gpt-5",
        "openai/gpt-5-mini",
        "openai/gpt-5-nano",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "qwen/qwen3-coder",
        "x-ai/grok-4"
      ],
      docUrl: "https://fastrouter.ai/models",
      gateway: "models.dev"
    },
    google: {
      apiKeyEnvVar: "GOOGLE_GENERATIVE_AI_API_KEY",
      name: "Google",
      models: [
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-2.5-flash",
        "gemini-2.5-flash-image",
        "gemini-2.5-flash-image-preview",
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash-lite-preview-06-17",
        "gemini-2.5-flash-lite-preview-09-2025",
        "gemini-2.5-flash-preview-04-17",
        "gemini-2.5-flash-preview-05-20",
        "gemini-2.5-flash-preview-09-2025",
        "gemini-2.5-flash-preview-tts",
        "gemini-2.5-pro",
        "gemini-2.5-pro-preview-05-06",
        "gemini-2.5-pro-preview-06-05",
        "gemini-2.5-pro-preview-tts",
        "gemini-embedding-001",
        "gemini-flash-latest",
        "gemini-flash-lite-latest",
        "gemini-live-2.5-flash",
        "gemini-live-2.5-flash-preview-native-audio"
      ],
      docUrl: "https://ai.google.dev/gemini-api/docs/pricing",
      gateway: "models.dev"
    },
    inception: {
      url: "https://api.inceptionlabs.ai/v1/",
      apiKeyEnvVar: "INCEPTION_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Inception",
      models: ["mercury", "mercury-coder"],
      docUrl: "https://platform.inceptionlabs.ai/docs",
      gateway: "models.dev"
    },
    wandb: {
      url: "https://api.inference.wandb.ai/v1",
      apiKeyEnvVar: "WANDB_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Weights & Biases",
      models: [
        "Qwen/Qwen3-235B-A22B-Instruct-2507",
        "Qwen/Qwen3-235B-A22B-Thinking-2507",
        "Qwen/Qwen3-Coder-480B-A35B-Instruct",
        "deepseek-ai/DeepSeek-R1-0528",
        "deepseek-ai/DeepSeek-V3-0324",
        "meta-llama/Llama-3.1-8B-Instruct",
        "meta-llama/Llama-3.3-70B-Instruct",
        "meta-llama/Llama-4-Scout-17B-16E-Instruct",
        "microsoft/Phi-4-mini-instruct",
        "moonshotai/Kimi-K2-Instruct"
      ],
      docUrl: "https://weave-docs.wandb.ai/guides/integrations/inference/",
      gateway: "models.dev"
    },
    openai: {
      apiKeyEnvVar: "OPENAI_API_KEY",
      name: "OpenAI",
      models: [
        "codex-mini-latest",
        "gpt-3.5-turbo",
        "gpt-4",
        "gpt-4-turbo",
        "gpt-4.1",
        "gpt-4.1-mini",
        "gpt-4.1-nano",
        "gpt-4o",
        "gpt-4o-2024-05-13",
        "gpt-4o-2024-08-06",
        "gpt-4o-2024-11-20",
        "gpt-4o-mini",
        "gpt-5",
        "gpt-5-chat-latest",
        "gpt-5-codex",
        "gpt-5-mini",
        "gpt-5-nano",
        "gpt-5-pro",
        "o1",
        "o1-mini",
        "o1-preview",
        "o1-pro",
        "o3",
        "o3-deep-research",
        "o3-mini",
        "o3-pro",
        "o4-mini",
        "o4-mini-deep-research",
        "text-embedding-3-large",
        "text-embedding-3-small",
        "text-embedding-ada-002"
      ],
      docUrl: "https://platform.openai.com/docs/models",
      gateway: "models.dev"
    },
    "zhipuai-coding-plan": {
      url: "https://open.bigmodel.cn/api/coding/paas/v4",
      apiKeyEnvVar: "ZHIPU_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Zhipu AI Coding Plan",
      models: ["glm-4.5", "glm-4.5-air", "glm-4.5-flash", "glm-4.5v", "glm-4.6"],
      docUrl: "https://docs.bigmodel.cn/cn/coding-plan/overview",
      gateway: "models.dev"
    },
    perplexity: {
      url: "https://api.perplexity.ai",
      apiKeyEnvVar: "PERPLEXITY_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Perplexity",
      models: ["sonar", "sonar-pro", "sonar-reasoning", "sonar-reasoning-pro"],
      docUrl: "https://docs.perplexity.ai",
      gateway: "models.dev"
    },
    openrouter: {
      url: "https://openrouter.ai/api/v1",
      apiKeyEnvVar: "OPENROUTER_API_KEY",
      name: "OpenRouter",
      models: [
        "anthropic/claude-3.5-haiku",
        "anthropic/claude-3.7-sonnet",
        "anthropic/claude-haiku-4.5",
        "anthropic/claude-opus-4",
        "anthropic/claude-opus-4.1",
        "anthropic/claude-sonnet-4",
        "anthropic/claude-sonnet-4.5",
        "cognitivecomputations/dolphin3.0-mistral-24b",
        "cognitivecomputations/dolphin3.0-r1-mistral-24b",
        "deepseek/deepseek-chat-v3-0324",
        "deepseek/deepseek-chat-v3.1",
        "deepseek/deepseek-r1-0528-qwen3-8b:free",
        "deepseek/deepseek-r1-0528:free",
        "deepseek/deepseek-r1-distill-llama-70b",
        "deepseek/deepseek-r1-distill-qwen-14b",
        "deepseek/deepseek-r1:free",
        "deepseek/deepseek-v3-base:free",
        "deepseek/deepseek-v3.1-terminus",
        "deepseek/deepseek-v3.1-terminus:exacto",
        "featherless/qwerky-72b",
        "google/gemini-2.0-flash-001",
        "google/gemini-2.0-flash-exp:free",
        "google/gemini-2.5-flash",
        "google/gemini-2.5-flash-lite",
        "google/gemini-2.5-flash-lite-preview-09-2025",
        "google/gemini-2.5-flash-preview-09-2025",
        "google/gemini-2.5-pro",
        "google/gemini-2.5-pro-preview-05-06",
        "google/gemini-2.5-pro-preview-06-05",
        "google/gemma-2-9b-it:free",
        "google/gemma-3-12b-it",
        "google/gemma-3-27b-it",
        "google/gemma-3n-e4b-it",
        "google/gemma-3n-e4b-it:free",
        "meta-llama/llama-3.2-11b-vision-instruct",
        "meta-llama/llama-3.3-70b-instruct:free",
        "meta-llama/llama-4-scout:free",
        "microsoft/mai-ds-r1:free",
        "minimax/minimax-01",
        "minimax/minimax-m1",
        "minimax/minimax-m2:free",
        "mistralai/codestral-2508",
        "mistralai/devstral-medium-2507",
        "mistralai/devstral-small-2505",
        "mistralai/devstral-small-2505:free",
        "mistralai/devstral-small-2507",
        "mistralai/mistral-7b-instruct:free",
        "mistralai/mistral-medium-3",
        "mistralai/mistral-medium-3.1",
        "mistralai/mistral-nemo:free",
        "mistralai/mistral-small-3.1-24b-instruct",
        "mistralai/mistral-small-3.2-24b-instruct",
        "mistralai/mistral-small-3.2-24b-instruct:free",
        "moonshotai/kimi-dev-72b:free",
        "moonshotai/kimi-k2",
        "moonshotai/kimi-k2-0905",
        "moonshotai/kimi-k2-0905:exacto",
        "moonshotai/kimi-k2:free",
        "nousresearch/deephermes-3-llama-3-8b-preview",
        "nousresearch/hermes-4-405b",
        "nousresearch/hermes-4-70b",
        "openai/gpt-4.1",
        "openai/gpt-4.1-mini",
        "openai/gpt-4o-mini",
        "openai/gpt-5",
        "openai/gpt-5-chat",
        "openai/gpt-5-codex",
        "openai/gpt-5-image",
        "openai/gpt-5-mini",
        "openai/gpt-5-nano",
        "openai/gpt-5-pro",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-120b:exacto",
        "openai/gpt-oss-20b",
        "openai/o4-mini",
        "openrouter/cypher-alpha:free",
        "openrouter/horizon-alpha",
        "openrouter/horizon-beta",
        "openrouter/sonoma-dusk-alpha",
        "openrouter/sonoma-sky-alpha",
        "qwen/qwen-2.5-coder-32b-instruct",
        "qwen/qwen2.5-vl-32b-instruct:free",
        "qwen/qwen2.5-vl-72b-instruct",
        "qwen/qwen2.5-vl-72b-instruct:free",
        "qwen/qwen3-14b:free",
        "qwen/qwen3-235b-a22b-07-25",
        "qwen/qwen3-235b-a22b-07-25:free",
        "qwen/qwen3-235b-a22b-thinking-2507",
        "qwen/qwen3-235b-a22b:free",
        "qwen/qwen3-30b-a3b-instruct-2507",
        "qwen/qwen3-30b-a3b-thinking-2507",
        "qwen/qwen3-30b-a3b:free",
        "qwen/qwen3-32b:free",
        "qwen/qwen3-8b:free",
        "qwen/qwen3-coder",
        "qwen/qwen3-coder:exacto",
        "qwen/qwen3-coder:free",
        "qwen/qwen3-max",
        "qwen/qwen3-next-80b-a3b-instruct",
        "qwen/qwen3-next-80b-a3b-thinking",
        "qwen/qwq-32b:free",
        "rekaai/reka-flash-3",
        "sarvamai/sarvam-m:free",
        "thudm/glm-z1-32b:free",
        "tngtech/deepseek-r1t2-chimera:free",
        "x-ai/grok-3",
        "x-ai/grok-3-beta",
        "x-ai/grok-3-mini",
        "x-ai/grok-3-mini-beta",
        "x-ai/grok-4",
        "x-ai/grok-4-fast",
        "x-ai/grok-code-fast-1",
        "z-ai/glm-4.5",
        "z-ai/glm-4.5-air",
        "z-ai/glm-4.5-air:free",
        "z-ai/glm-4.5v",
        "z-ai/glm-4.6",
        "z-ai/glm-4.6:exacto"
      ],
      docUrl: "https://openrouter.ai/models",
      gateway: "models.dev"
    },
    zenmux: {
      url: "https://zenmux.ai/api/v1",
      apiKeyEnvVar: "ZENMUX_API_KEY",
      apiKeyHeader: "Authorization",
      name: "ZenMux",
      models: [
        "anthropic/claude-haiku-4.5",
        "anthropic/claude-opus-4.1",
        "anthropic/claude-sonnet-4.5",
        "deepseek/deepseek-chat",
        "google/gemini-2.5-pro",
        "inclusionai/lint-1t",
        "inclusionai/ring-1t",
        "kuaishou/kat-coder-pro-v1",
        "moonshotai/kimi-k2-0905",
        "openai/gpt-5",
        "openai/gpt-5-codex",
        "qwen/qwen3-coder-plus",
        "x-ai/grok-4",
        "x-ai/grok-4-fast",
        "x-ai/grok-4-fast-non-reasoning",
        "x-ai/grok-code-fast-1",
        "z-ai/glm-4.5-air",
        "z-ai/glm-4.6"
      ],
      docUrl: "https://docs.zenmux.ai",
      gateway: "models.dev"
    },
    synthetic: {
      url: "https://api.synthetic.new/v1",
      apiKeyEnvVar: "SYNTHETIC_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Synthetic",
      models: [
        "hf:MiniMaxAI/MiniMax-M2",
        "hf:Qwen/Qwen2.5-Coder-32B-Instruct",
        "hf:Qwen/Qwen3-235B-A22B-Instruct-2507",
        "hf:Qwen/Qwen3-235B-A22B-Thinking-2507",
        "hf:Qwen/Qwen3-Coder-480B-A35B-Instruct",
        "hf:deepseek-ai/DeepSeek-R1",
        "hf:deepseek-ai/DeepSeek-R1-0528",
        "hf:deepseek-ai/DeepSeek-V3",
        "hf:deepseek-ai/DeepSeek-V3-0324",
        "hf:deepseek-ai/DeepSeek-V3.1",
        "hf:deepseek-ai/DeepSeek-V3.1-Terminus",
        "hf:meta-llama/Llama-3.1-405B-Instruct",
        "hf:meta-llama/Llama-3.1-70B-Instruct",
        "hf:meta-llama/Llama-3.1-8B-Instruct",
        "hf:meta-llama/Llama-3.3-70B-Instruct",
        "hf:meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        "hf:meta-llama/Llama-4-Scout-17B-16E-Instruct",
        "hf:moonshotai/Kimi-K2-Instruct",
        "hf:moonshotai/Kimi-K2-Instruct-0905",
        "hf:openai/gpt-oss-120b",
        "hf:zai-org/GLM-4.5",
        "hf:zai-org/GLM-4.6"
      ],
      docUrl: "https://synthetic.new/pricing",
      gateway: "models.dev"
    },
    deepinfra: {
      url: "https://api.deepinfra.com/v1/openai",
      apiKeyEnvVar: "DEEPINFRA_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Deep Infra",
      models: [
        "Qwen/Qwen3-Coder-480B-A35B-Instruct",
        "Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo",
        "moonshotai/Kimi-K2-Instruct",
        "zai-org/GLM-4.5"
      ],
      docUrl: "https://deepinfra.com/models",
      gateway: "models.dev"
    },
    zhipuai: {
      url: "https://open.bigmodel.cn/api/paas/v4",
      apiKeyEnvVar: "ZHIPU_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Zhipu AI",
      models: ["glm-4.5", "glm-4.5-air", "glm-4.5-flash", "glm-4.5v", "glm-4.6"],
      docUrl: "https://docs.z.ai/guides/overview/pricing",
      gateway: "models.dev"
    },
    submodel: {
      url: "https://llm.submodel.ai/v1",
      apiKeyEnvVar: "SUBMODEL_INSTAGEN_ACCESS_KEY",
      apiKeyHeader: "Authorization",
      name: "submodel",
      models: [
        "Qwen/Qwen3-235B-A22B-Instruct-2507",
        "Qwen/Qwen3-235B-A22B-Thinking-2507",
        "Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8",
        "deepseek-ai/DeepSeek-R1-0528",
        "deepseek-ai/DeepSeek-V3-0324",
        "deepseek-ai/DeepSeek-V3.1",
        "openai/gpt-oss-120b",
        "zai-org/GLM-4.5-Air",
        "zai-org/GLM-4.5-FP8"
      ],
      docUrl: "https://submodel.gitbook.io",
      gateway: "models.dev"
    },
    zai: {
      url: "https://api.z.ai/api/paas/v4",
      apiKeyEnvVar: "ZHIPU_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Z.AI",
      models: ["glm-4.5", "glm-4.5-air", "glm-4.5-flash", "glm-4.5v", "glm-4.6"],
      docUrl: "https://docs.z.ai/guides/overview/pricing",
      gateway: "models.dev"
    },
    inference: {
      url: "https://inference.net/v1",
      apiKeyEnvVar: "INFERENCE_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Inference",
      models: [
        "google/gemma-3",
        "meta/llama-3.1-8b-instruct",
        "meta/llama-3.2-11b-vision-instruct",
        "meta/llama-3.2-1b-instruct",
        "meta/llama-3.2-3b-instruct",
        "mistral/mistral-nemo-12b-instruct",
        "osmosis/osmosis-structure-0.6b",
        "qwen/qwen-2.5-7b-vision-instruct",
        "qwen/qwen3-embedding-4b"
      ],
      docUrl: "https://inference.net/models",
      gateway: "models.dev"
    },
    requesty: {
      url: "https://router.requesty.ai/v1",
      apiKeyEnvVar: "REQUESTY_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Requesty",
      models: [
        "anthropic/claude-3-7-sonnet",
        "anthropic/claude-4-sonnet-20250522",
        "anthropic/claude-opus-4",
        "anthropic/claude-opus-4-1-20250805",
        "google/gemini-2.5-flash",
        "google/gemini-2.5-pro",
        "openai/gpt-4.1",
        "openai/gpt-4.1-mini",
        "openai/gpt-4o-mini",
        "openai/gpt-5",
        "openai/gpt-5-mini",
        "openai/gpt-5-nano",
        "openai/o4-mini"
      ],
      docUrl: "https://requesty.ai/solution/llm-routing/models",
      gateway: "models.dev"
    },
    morph: {
      url: "https://api.morphllm.com/v1",
      apiKeyEnvVar: "MORPH_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Morph",
      models: ["auto", "morph-v3-fast", "morph-v3-large"],
      docUrl: "https://docs.morphllm.com/api-reference/introduction",
      gateway: "models.dev"
    },
    lmstudio: {
      url: "http://127.0.0.1:1234/v1",
      apiKeyEnvVar: "LMSTUDIO_API_KEY",
      apiKeyHeader: "Authorization",
      name: "LMStudio",
      models: ["openai/gpt-oss-20b", "qwen/qwen3-30b-a3b-2507", "qwen/qwen3-coder-30b"],
      docUrl: "https://lmstudio.ai/models",
      gateway: "models.dev"
    },
    anthropic: {
      apiKeyEnvVar: "ANTHROPIC_API_KEY",
      name: "Anthropic",
      models: [
        "claude-3-5-haiku-20241022",
        "claude-3-5-haiku-latest",
        "claude-3-5-sonnet-20240620",
        "claude-3-5-sonnet-20241022",
        "claude-3-7-sonnet-20250219",
        "claude-3-7-sonnet-latest",
        "claude-3-haiku-20240307",
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-haiku-4-5",
        "claude-haiku-4-5-20251001",
        "claude-opus-4-0",
        "claude-opus-4-1",
        "claude-opus-4-1-20250805",
        "claude-opus-4-20250514",
        "claude-sonnet-4-0",
        "claude-sonnet-4-20250514",
        "claude-sonnet-4-5",
        "claude-sonnet-4-5-20250929"
      ],
      docUrl: "https://docs.anthropic.com/en/docs/about-claude/models",
      gateway: "models.dev"
    },
    "fireworks-ai": {
      url: "https://api.fireworks.ai/inference/v1/",
      apiKeyEnvVar: "FIREWORKS_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Fireworks AI",
      models: [
        "accounts/fireworks/models/deepseek-r1-0528",
        "accounts/fireworks/models/deepseek-v3-0324",
        "accounts/fireworks/models/deepseek-v3p1",
        "accounts/fireworks/models/glm-4p5",
        "accounts/fireworks/models/glm-4p5-air",
        "accounts/fireworks/models/gpt-oss-120b",
        "accounts/fireworks/models/gpt-oss-20b",
        "accounts/fireworks/models/kimi-k2-instruct",
        "accounts/fireworks/models/qwen3-235b-a22b",
        "accounts/fireworks/models/qwen3-coder-480b-a35b-instruct"
      ],
      docUrl: "https://fireworks.ai/docs/",
      gateway: "models.dev"
    },
    modelscope: {
      url: "https://api-inference.modelscope.cn/v1",
      apiKeyEnvVar: "MODELSCOPE_API_KEY",
      apiKeyHeader: "Authorization",
      name: "ModelScope",
      models: [
        "Qwen/Qwen3-235B-A22B-Instruct-2507",
        "Qwen/Qwen3-235B-A22B-Thinking-2507",
        "Qwen/Qwen3-30B-A3B-Instruct-2507",
        "Qwen/Qwen3-30B-A3B-Thinking-2507",
        "Qwen/Qwen3-Coder-30B-A3B-Instruct",
        "ZhipuAI/GLM-4.5",
        "ZhipuAI/GLM-4.6"
      ],
      docUrl: "https://modelscope.cn/docs/model-service/API-Inference/intro",
      gateway: "models.dev"
    },
    llama: {
      url: "https://api.llama.com/compat/v1/",
      apiKeyEnvVar: "LLAMA_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Llama",
      models: [
        "cerebras-llama-4-maverick-17b-128e-instruct",
        "cerebras-llama-4-scout-17b-16e-instruct",
        "groq-llama-4-maverick-17b-128e-instruct",
        "llama-3.3-70b-instruct",
        "llama-3.3-8b-instruct",
        "llama-4-maverick-17b-128e-instruct-fp8",
        "llama-4-scout-17b-16e-instruct-fp8"
      ],
      docUrl: "https://llama.developer.meta.com/docs/models",
      gateway: "models.dev"
    },
    scaleway: {
      url: "https://api.scaleway.ai/v1",
      apiKeyEnvVar: "SCALEWAY_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Scaleway",
      models: [
        "bge-multilingual-gemma2",
        "deepseek-r1-distill-llama-70b",
        "gemma-3-27b-it",
        "gpt-oss-120b",
        "llama-3.1-8b-instruct",
        "llama-3.3-70b-instruct",
        "mistral-nemo-instruct-2407",
        "mistral-small-3.2-24b-instruct-2506",
        "pixtral-12b-2409",
        "qwen3-235b-a22b-instruct-2507",
        "qwen3-coder-30b-a3b-instruct",
        "voxtral-small-24b-2507",
        "whisper-large-v3"
      ],
      docUrl: "https://www.scaleway.com/en/docs/generative-apis/",
      gateway: "models.dev"
    },
    cerebras: {
      url: "https://api.cerebras.ai/v1",
      apiKeyEnvVar: "CEREBRAS_API_KEY",
      apiKeyHeader: "Authorization",
      name: "Cerebras",
      models: ["gpt-oss-120b", "qwen-3-235b-a22b-instruct-2507", "qwen-3-coder-480b"],
      docUrl: "https://inference-docs.cerebras.ai/models/overview",
      gateway: "models.dev"
    },
    netlify: {
      apiKeyEnvVar: ["NETLIFY_TOKEN", "NETLIFY_SITE_ID"],
      apiKeyHeader: "Authorization",
      name: "Netlify",
      gateway: "netlify",
      models: [
        "anthropic/claude-3-5-haiku-20241022",
        "anthropic/claude-3-5-haiku-latest",
        "anthropic/claude-3-7-sonnet-20250219",
        "anthropic/claude-3-7-sonnet-latest",
        "anthropic/claude-3-haiku-20240307",
        "anthropic/claude-haiku-4-5-20251001",
        "anthropic/claude-opus-4-1-20250805",
        "anthropic/claude-opus-4-20250514",
        "anthropic/claude-sonnet-4-20250514",
        "anthropic/claude-sonnet-4-5-20250929",
        "gemini/gemini-2.0-flash",
        "gemini/gemini-2.0-flash-lite",
        "gemini/gemini-2.5-flash",
        "gemini/gemini-2.5-flash-image-preview",
        "gemini/gemini-2.5-flash-lite",
        "gemini/gemini-2.5-flash-lite-preview-09-2025",
        "gemini/gemini-2.5-flash-preview-09-2025",
        "gemini/gemini-2.5-pro",
        "gemini/gemini-flash-latest",
        "gemini/gemini-flash-lite-latest",
        "openai/codex-mini-latest",
        "openai/gpt-4.1",
        "openai/gpt-4.1-mini",
        "openai/gpt-4.1-nano",
        "openai/gpt-4o",
        "openai/gpt-4o-mini",
        "openai/gpt-5",
        "openai/gpt-5-codex",
        "openai/gpt-5-mini",
        "openai/gpt-5-nano",
        "openai/gpt-5-pro",
        "openai/o3",
        "openai/o3-mini",
        "openai/o4-mini"
      ],
      docUrl: "https://docs.netlify.com/build/ai-gateway/overview/"
    }
  },
  models: {
    "moonshotai-cn": ["kimi-k2-0711-preview", "kimi-k2-0905-preview", "kimi-k2-turbo-preview"],
    lucidquery: ["lucidnova-rf1-100b", "lucidquery-nexus-coder"],
    moonshotai: ["kimi-k2-0711-preview", "kimi-k2-0905-preview", "kimi-k2-turbo-preview"],
    "zai-coding-plan": ["glm-4.5", "glm-4.5-air", "glm-4.5-flash", "glm-4.5v", "glm-4.6"],
    alibaba: [
      "qvq-max",
      "qwen-flash",
      "qwen-max",
      "qwen-mt-plus",
      "qwen-mt-turbo",
      "qwen-omni-turbo",
      "qwen-omni-turbo-realtime",
      "qwen-plus",
      "qwen-plus-character-ja",
      "qwen-turbo",
      "qwen-vl-max",
      "qwen-vl-ocr",
      "qwen-vl-plus",
      "qwen2-5-14b-instruct",
      "qwen2-5-32b-instruct",
      "qwen2-5-72b-instruct",
      "qwen2-5-7b-instruct",
      "qwen2-5-omni-7b",
      "qwen2-5-vl-72b-instruct",
      "qwen2-5-vl-7b-instruct",
      "qwen3-14b",
      "qwen3-235b-a22b",
      "qwen3-32b",
      "qwen3-8b",
      "qwen3-asr-flash",
      "qwen3-coder-30b-a3b-instruct",
      "qwen3-coder-480b-a35b-instruct",
      "qwen3-coder-flash",
      "qwen3-coder-plus",
      "qwen3-livetranslate-flash-realtime",
      "qwen3-max",
      "qwen3-next-80b-a3b-instruct",
      "qwen3-next-80b-a3b-thinking",
      "qwen3-omni-flash",
      "qwen3-omni-flash-realtime",
      "qwen3-vl-235b-a22b",
      "qwen3-vl-30b-a3b",
      "qwen3-vl-plus",
      "qwq-plus"
    ],
    xai: [
      "grok-2",
      "grok-2-1212",
      "grok-2-latest",
      "grok-2-vision",
      "grok-2-vision-1212",
      "grok-2-vision-latest",
      "grok-3",
      "grok-3-fast",
      "grok-3-fast-latest",
      "grok-3-latest",
      "grok-3-mini",
      "grok-3-mini-fast",
      "grok-3-mini-fast-latest",
      "grok-3-mini-latest",
      "grok-4",
      "grok-4-fast",
      "grok-4-fast-non-reasoning",
      "grok-beta",
      "grok-code-fast-1",
      "grok-vision-beta"
    ],
    vultr: [
      "deepseek-r1-distill-llama-70b",
      "deepseek-r1-distill-qwen-32b",
      "gpt-oss-120b",
      "kimi-k2-instruct",
      "qwen2.5-coder-32b-instruct"
    ],
    nvidia: [
      "black-forest-labs/flux.1-dev",
      "deepseek-ai/deepseek-v3.1",
      "deepseek-ai/deepseek-v3.1-terminus",
      "google/gemma-3-27b-it",
      "microsoft/phi-4-mini-instruct",
      "moonshotai/kimi-k2-instruct",
      "moonshotai/kimi-k2-instruct-0905",
      "nvidia/cosmos-nemotron-34b",
      "nvidia/llama-3.1-nemotron-ultra-253b-v1",
      "nvidia/llama-embed-nemotron-8b",
      "nvidia/nemoretriever-ocr-v1",
      "nvidia/parakeet-tdt-0.6b-v2",
      "openai/gpt-oss-120b",
      "openai/whisper-large-v3",
      "qwen/qwen3-235b-a22b",
      "qwen/qwen3-coder-480b-a35b-instruct"
    ],
    upstage: ["solar-mini", "solar-pro2"],
    groq: [
      "deepseek-r1-distill-llama-70b",
      "gemma2-9b-it",
      "llama-3.1-8b-instant",
      "llama-3.3-70b-versatile",
      "llama-guard-3-8b",
      "llama3-70b-8192",
      "llama3-8b-8192",
      "meta-llama/llama-4-maverick-17b-128e-instruct",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "meta-llama/llama-guard-4-12b",
      "mistral-saba-24b",
      "moonshotai/kimi-k2-instruct",
      "moonshotai/kimi-k2-instruct-0905",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "qwen-qwq-32b",
      "qwen/qwen3-32b"
    ],
    mistral: [
      "codestral-latest",
      "devstral-medium-2507",
      "devstral-small-2505",
      "devstral-small-2507",
      "magistral-medium-latest",
      "magistral-small",
      "ministral-3b-latest",
      "ministral-8b-latest",
      "mistral-large-latest",
      "mistral-medium-2505",
      "mistral-medium-2508",
      "mistral-medium-latest",
      "mistral-nemo",
      "mistral-small-latest",
      "open-mistral-7b",
      "open-mixtral-8x22b",
      "open-mixtral-8x7b",
      "pixtral-12b",
      "pixtral-large-latest"
    ],
    vercel: [
      "alibaba/qwen3-coder-plus",
      "alibaba/qwen3-max",
      "alibaba/qwen3-next-80b-a3b-instruct",
      "alibaba/qwen3-next-80b-a3b-thinking",
      "alibaba/qwen3-vl-instruct",
      "alibaba/qwen3-vl-thinking",
      "amazon/nova-lite",
      "amazon/nova-micro",
      "amazon/nova-pro",
      "anthropic/claude-3-haiku",
      "anthropic/claude-3-opus",
      "anthropic/claude-3.5-haiku",
      "anthropic/claude-3.5-sonnet",
      "anthropic/claude-3.7-sonnet",
      "anthropic/claude-4-1-opus",
      "anthropic/claude-4-opus",
      "anthropic/claude-4-sonnet",
      "anthropic/claude-4.5-sonnet",
      "anthropic/claude-haiku-4.5",
      "cerebras/qwen3-coder",
      "deepseek/deepseek-r1",
      "deepseek/deepseek-r1-distill-llama-70b",
      "deepseek/deepseek-v3.1-terminus",
      "deepseek/deepseek-v3.2-exp",
      "deepseek/deepseek-v3.2-exp-thinking",
      "google/gemini-2.0-flash",
      "google/gemini-2.0-flash-lite",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-flash-lite",
      "google/gemini-2.5-flash-lite-preview-09-2025",
      "google/gemini-2.5-flash-preview-09-2025",
      "google/gemini-2.5-pro",
      "meta/llama-3.3-70b",
      "meta/llama-4-maverick",
      "meta/llama-4-scout",
      "mistral/codestral",
      "mistral/magistral-medium",
      "mistral/magistral-small",
      "mistral/ministral-3b",
      "mistral/ministral-8b",
      "mistral/mistral-large",
      "mistral/mistral-small",
      "mistral/mixtral-8x22b-instruct",
      "mistral/pixtral-12b",
      "mistral/pixtral-large",
      "moonshotai/kimi-k2",
      "morph/morph-v3-fast",
      "morph/morph-v3-large",
      "openai/gpt-4-turbo",
      "openai/gpt-4.1",
      "openai/gpt-4.1-mini",
      "openai/gpt-4.1-nano",
      "openai/gpt-4o",
      "openai/gpt-4o-mini",
      "openai/gpt-5",
      "openai/gpt-5-codex",
      "openai/gpt-5-mini",
      "openai/gpt-5-nano",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "openai/o1",
      "openai/o3",
      "openai/o3-mini",
      "openai/o4-mini",
      "perplexity/sonar",
      "perplexity/sonar-pro",
      "perplexity/sonar-reasoning",
      "perplexity/sonar-reasoning-pro",
      "vercel/v0-1.0-md",
      "vercel/v0-1.5-md",
      "xai/grok-2",
      "xai/grok-2-vision",
      "xai/grok-3",
      "xai/grok-3-fast",
      "xai/grok-3-mini",
      "xai/grok-3-mini-fast",
      "xai/grok-4",
      "xai/grok-4-fast",
      "xai/grok-4-fast-non-reasoning",
      "xai/grok-code-fast-1",
      "zai/glm-4.5",
      "zai/glm-4.5-air",
      "zai/glm-4.5v",
      "zai/glm-4.6"
    ],
    nebius: [
      "NousResearch/hermes-4-405b",
      "NousResearch/hermes-4-70b",
      "deepseek-ai/deepseek-v3",
      "meta-llama/llama-3.3-70b-instruct-base",
      "meta-llama/llama-3.3-70b-instruct-fast",
      "meta-llama/llama-3_1-405b-instruct",
      "moonshotai/kimi-k2-instruct",
      "nvidia/llama-3_1-nemotron-ultra-253b-v1",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "qwen/qwen3-235b-a22b-instruct-2507",
      "qwen/qwen3-235b-a22b-thinking-2507",
      "qwen/qwen3-coder-480b-a35b-instruct",
      "zai-org/glm-4.5",
      "zai-org/glm-4.5-air"
    ],
    deepseek: ["deepseek-chat", "deepseek-reasoner"],
    "alibaba-cn": [
      "deepseek-r1",
      "deepseek-r1-0528",
      "deepseek-r1-distill-llama-70b",
      "deepseek-r1-distill-llama-8b",
      "deepseek-r1-distill-qwen-1-5b",
      "deepseek-r1-distill-qwen-14b",
      "deepseek-r1-distill-qwen-32b",
      "deepseek-r1-distill-qwen-7b",
      "deepseek-v3",
      "deepseek-v3-1",
      "deepseek-v3-2-exp",
      "moonshot-kimi-k2-instruct",
      "qvq-max",
      "qwen-deep-research",
      "qwen-doc-turbo",
      "qwen-flash",
      "qwen-long",
      "qwen-math-plus",
      "qwen-math-turbo",
      "qwen-max",
      "qwen-mt-plus",
      "qwen-mt-turbo",
      "qwen-omni-turbo",
      "qwen-omni-turbo-realtime",
      "qwen-plus",
      "qwen-plus-character",
      "qwen-turbo",
      "qwen-vl-max",
      "qwen-vl-ocr",
      "qwen-vl-plus",
      "qwen2-5-14b-instruct",
      "qwen2-5-32b-instruct",
      "qwen2-5-72b-instruct",
      "qwen2-5-7b-instruct",
      "qwen2-5-coder-32b-instruct",
      "qwen2-5-coder-7b-instruct",
      "qwen2-5-math-72b-instruct",
      "qwen2-5-math-7b-instruct",
      "qwen2-5-omni-7b",
      "qwen2-5-vl-72b-instruct",
      "qwen2-5-vl-7b-instruct",
      "qwen3-14b",
      "qwen3-235b-a22b",
      "qwen3-32b",
      "qwen3-8b",
      "qwen3-asr-flash",
      "qwen3-coder-30b-a3b-instruct",
      "qwen3-coder-480b-a35b-instruct",
      "qwen3-coder-flash",
      "qwen3-coder-plus",
      "qwen3-max",
      "qwen3-next-80b-a3b-instruct",
      "qwen3-next-80b-a3b-thinking",
      "qwen3-omni-flash",
      "qwen3-omni-flash-realtime",
      "qwen3-vl-235b-a22b",
      "qwen3-vl-30b-a3b",
      "qwen3-vl-plus",
      "qwq-32b",
      "qwq-plus",
      "tongyi-intent-detect-v3"
    ],
    venice: [
      "deepseek-coder-v2-lite",
      "deepseek-r1-671b",
      "dolphin-2.9.2-qwen2-72b",
      "llama-3.1-405b",
      "llama-3.2-3b",
      "llama-3.3-70b",
      "mistral-31-24b",
      "qwen-2.5-coder-32b",
      "qwen-2.5-qwq-32b",
      "qwen-2.5-vl",
      "qwen3-235b",
      "qwen3-4b",
      "venice-uncensored"
    ],
    chutes: [
      "Qwen/Qwen3-235B-A22B-Instruct-2507",
      "Qwen/Qwen3-235B-A22B-Thinking-2507",
      "Qwen/Qwen3-30B-A3B",
      "Qwen/Qwen3-30B-A3B-Instruct-2507",
      "Qwen/Qwen3-30B-A3B-Thinking-2507",
      "Qwen/Qwen3-Coder-30B-A3B-Instruct",
      "Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8",
      "Qwen/Qwen3-Next-80B-A3B-Instruct",
      "Qwen/Qwen3-Next-80B-A3B-Thinking",
      "chutesai/Devstral-Small-2505",
      "chutesai/Mistral-Small-3.2-24B-Instruct-2506",
      "deepseek-ai/DeepSeek-R1-0528",
      "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
      "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
      "deepseek-ai/DeepSeek-V3-0324",
      "deepseek-ai/DeepSeek-V3.1",
      "deepseek-ai/DeepSeek-V3.1-Terminus",
      "deepseek-ai/DeepSeek-V3.1-turbo",
      "deepseek-ai/DeepSeek-V3.1:THINKING",
      "deepseek-ai/DeepSeek-V3.2-Exp",
      "meituan-longcat/LongCat-Flash-Chat-FP8",
      "moonshotai/Kimi-Dev-72B",
      "moonshotai/Kimi-K2-Instruct-0905",
      "moonshotai/Kimi-K2-Instruct-75k",
      "moonshotai/Kimi-VL-A3B-Thinking",
      "openai/gpt-oss-120b",
      "tngtech/DeepSeek-R1T-Chimera",
      "tngtech/DeepSeek-TNG-R1T2-Chimera",
      "zai-org/GLM-4.5-Air",
      "zai-org/GLM-4.5-FP8",
      "zai-org/GLM-4.5-turbo",
      "zai-org/GLM-4.6-FP8",
      "zai-org/GLM-4.6-turbo"
    ],
    cortecs: [
      "claude-4-5-sonnet",
      "claude-sonnet-4",
      "deepseek-v3-0324",
      "gemini-2.5-pro",
      "gpt-4.1",
      "gpt-oss-120b",
      "kimi-k2-instruct",
      "llama-3.1-405b-instruct",
      "nova-pro-v1",
      "qwen3-32b",
      "qwen3-coder-480b-a35b-instruct"
    ],
    "github-models": [
      "ai21-labs/ai21-jamba-1.5-large",
      "ai21-labs/ai21-jamba-1.5-mini",
      "cohere/cohere-command-a",
      "cohere/cohere-command-r",
      "cohere/cohere-command-r-08-2024",
      "cohere/cohere-command-r-plus",
      "cohere/cohere-command-r-plus-08-2024",
      "core42/jais-30b-chat",
      "deepseek/deepseek-r1",
      "deepseek/deepseek-r1-0528",
      "deepseek/deepseek-v3-0324",
      "meta/llama-3.2-11b-vision-instruct",
      "meta/llama-3.2-90b-vision-instruct",
      "meta/llama-3.3-70b-instruct",
      "meta/llama-4-maverick-17b-128e-instruct-fp8",
      "meta/llama-4-scout-17b-16e-instruct",
      "meta/meta-llama-3-70b-instruct",
      "meta/meta-llama-3-8b-instruct",
      "meta/meta-llama-3.1-405b-instruct",
      "meta/meta-llama-3.1-70b-instruct",
      "meta/meta-llama-3.1-8b-instruct",
      "microsoft/mai-ds-r1",
      "microsoft/phi-3-medium-128k-instruct",
      "microsoft/phi-3-medium-4k-instruct",
      "microsoft/phi-3-mini-128k-instruct",
      "microsoft/phi-3-mini-4k-instruct",
      "microsoft/phi-3-small-128k-instruct",
      "microsoft/phi-3-small-8k-instruct",
      "microsoft/phi-3.5-mini-instruct",
      "microsoft/phi-3.5-moe-instruct",
      "microsoft/phi-3.5-vision-instruct",
      "microsoft/phi-4",
      "microsoft/phi-4-mini-instruct",
      "microsoft/phi-4-mini-reasoning",
      "microsoft/phi-4-multimodal-instruct",
      "microsoft/phi-4-reasoning",
      "mistral-ai/codestral-2501",
      "mistral-ai/ministral-3b",
      "mistral-ai/mistral-large-2411",
      "mistral-ai/mistral-medium-2505",
      "mistral-ai/mistral-nemo",
      "mistral-ai/mistral-small-2503",
      "openai/gpt-4.1",
      "openai/gpt-4.1-mini",
      "openai/gpt-4.1-nano",
      "openai/gpt-4o",
      "openai/gpt-4o-mini",
      "openai/o1",
      "openai/o1-mini",
      "openai/o1-preview",
      "openai/o3",
      "openai/o3-mini",
      "openai/o4-mini",
      "xai/grok-3",
      "xai/grok-3-mini"
    ],
    togetherai: [
      "Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8",
      "deepseek-ai/DeepSeek-R1",
      "deepseek-ai/DeepSeek-V3",
      "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      "moonshotai/Kimi-K2-Instruct",
      "openai/gpt-oss-120b"
    ],
    baseten: ["Qwen3/Qwen3-Coder-480B-A35B-Instruct", "moonshotai/Kimi-K2-Instruct-0905", "zai-org/GLM-4.6"],
    huggingface: [
      "MiniMaxAI/MiniMax-M2",
      "Qwen/Qwen3-235B-A22B-Thinking-2507",
      "Qwen/Qwen3-Coder-480B-A35B-Instruct",
      "Qwen/Qwen3-Embedding-4B",
      "Qwen/Qwen3-Embedding-8B",
      "Qwen/Qwen3-Next-80B-A3B-Instruct",
      "Qwen/Qwen3-Next-80B-A3B-Thinking",
      "deepseek-ai/DeepSeek-R1-0528",
      "deepseek-ai/Deepseek-V3-0324",
      "moonshotai/Kimi-K2-Instruct",
      "moonshotai/Kimi-K2-Instruct-0905",
      "zai-org/GLM-4.5",
      "zai-org/GLM-4.5-Air",
      "zai-org/GLM-4.6"
    ],
    opencode: [
      "an-gbt",
      "big-pickle",
      "claude-3-5-haiku",
      "claude-haiku-4-5",
      "claude-opus-4-1",
      "claude-sonnet-4",
      "claude-sonnet-4-5",
      "glm-4.6",
      "gpt-5",
      "gpt-5-codex",
      "grok-code",
      "kimi-k2",
      "minimax-m2",
      "qwen3-coder"
    ],
    fastrouter: [
      "anthropic/claude-opus-4.1",
      "anthropic/claude-sonnet-4",
      "deepseek-ai/deepseek-r1-distill-llama-70b",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "moonshotai/kimi-k2",
      "openai/gpt-4.1",
      "openai/gpt-5",
      "openai/gpt-5-mini",
      "openai/gpt-5-nano",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "qwen/qwen3-coder",
      "x-ai/grok-4"
    ],
    google: [
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.5-flash-image",
      "gemini-2.5-flash-image-preview",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash-lite-preview-06-17",
      "gemini-2.5-flash-lite-preview-09-2025",
      "gemini-2.5-flash-preview-04-17",
      "gemini-2.5-flash-preview-05-20",
      "gemini-2.5-flash-preview-09-2025",
      "gemini-2.5-flash-preview-tts",
      "gemini-2.5-pro",
      "gemini-2.5-pro-preview-05-06",
      "gemini-2.5-pro-preview-06-05",
      "gemini-2.5-pro-preview-tts",
      "gemini-embedding-001",
      "gemini-flash-latest",
      "gemini-flash-lite-latest",
      "gemini-live-2.5-flash",
      "gemini-live-2.5-flash-preview-native-audio"
    ],
    inception: ["mercury", "mercury-coder"],
    wandb: [
      "Qwen/Qwen3-235B-A22B-Instruct-2507",
      "Qwen/Qwen3-235B-A22B-Thinking-2507",
      "Qwen/Qwen3-Coder-480B-A35B-Instruct",
      "deepseek-ai/DeepSeek-R1-0528",
      "deepseek-ai/DeepSeek-V3-0324",
      "meta-llama/Llama-3.1-8B-Instruct",
      "meta-llama/Llama-3.3-70B-Instruct",
      "meta-llama/Llama-4-Scout-17B-16E-Instruct",
      "microsoft/Phi-4-mini-instruct",
      "moonshotai/Kimi-K2-Instruct"
    ],
    openai: [
      "codex-mini-latest",
      "gpt-3.5-turbo",
      "gpt-4",
      "gpt-4-turbo",
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "gpt-4o",
      "gpt-4o-2024-05-13",
      "gpt-4o-2024-08-06",
      "gpt-4o-2024-11-20",
      "gpt-4o-mini",
      "gpt-5",
      "gpt-5-chat-latest",
      "gpt-5-codex",
      "gpt-5-mini",
      "gpt-5-nano",
      "gpt-5-pro",
      "o1",
      "o1-mini",
      "o1-preview",
      "o1-pro",
      "o3",
      "o3-deep-research",
      "o3-mini",
      "o3-pro",
      "o4-mini",
      "o4-mini-deep-research",
      "text-embedding-3-large",
      "text-embedding-3-small",
      "text-embedding-ada-002"
    ],
    "zhipuai-coding-plan": ["glm-4.5", "glm-4.5-air", "glm-4.5-flash", "glm-4.5v", "glm-4.6"],
    perplexity: ["sonar", "sonar-pro", "sonar-reasoning", "sonar-reasoning-pro"],
    openrouter: [
      "anthropic/claude-3.5-haiku",
      "anthropic/claude-3.7-sonnet",
      "anthropic/claude-haiku-4.5",
      "anthropic/claude-opus-4",
      "anthropic/claude-opus-4.1",
      "anthropic/claude-sonnet-4",
      "anthropic/claude-sonnet-4.5",
      "cognitivecomputations/dolphin3.0-mistral-24b",
      "cognitivecomputations/dolphin3.0-r1-mistral-24b",
      "deepseek/deepseek-chat-v3-0324",
      "deepseek/deepseek-chat-v3.1",
      "deepseek/deepseek-r1-0528-qwen3-8b:free",
      "deepseek/deepseek-r1-0528:free",
      "deepseek/deepseek-r1-distill-llama-70b",
      "deepseek/deepseek-r1-distill-qwen-14b",
      "deepseek/deepseek-r1:free",
      "deepseek/deepseek-v3-base:free",
      "deepseek/deepseek-v3.1-terminus",
      "deepseek/deepseek-v3.1-terminus:exacto",
      "featherless/qwerky-72b",
      "google/gemini-2.0-flash-001",
      "google/gemini-2.0-flash-exp:free",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-flash-lite",
      "google/gemini-2.5-flash-lite-preview-09-2025",
      "google/gemini-2.5-flash-preview-09-2025",
      "google/gemini-2.5-pro",
      "google/gemini-2.5-pro-preview-05-06",
      "google/gemini-2.5-pro-preview-06-05",
      "google/gemma-2-9b-it:free",
      "google/gemma-3-12b-it",
      "google/gemma-3-27b-it",
      "google/gemma-3n-e4b-it",
      "google/gemma-3n-e4b-it:free",
      "meta-llama/llama-3.2-11b-vision-instruct",
      "meta-llama/llama-3.3-70b-instruct:free",
      "meta-llama/llama-4-scout:free",
      "microsoft/mai-ds-r1:free",
      "minimax/minimax-01",
      "minimax/minimax-m1",
      "minimax/minimax-m2:free",
      "mistralai/codestral-2508",
      "mistralai/devstral-medium-2507",
      "mistralai/devstral-small-2505",
      "mistralai/devstral-small-2505:free",
      "mistralai/devstral-small-2507",
      "mistralai/mistral-7b-instruct:free",
      "mistralai/mistral-medium-3",
      "mistralai/mistral-medium-3.1",
      "mistralai/mistral-nemo:free",
      "mistralai/mistral-small-3.1-24b-instruct",
      "mistralai/mistral-small-3.2-24b-instruct",
      "mistralai/mistral-small-3.2-24b-instruct:free",
      "moonshotai/kimi-dev-72b:free",
      "moonshotai/kimi-k2",
      "moonshotai/kimi-k2-0905",
      "moonshotai/kimi-k2-0905:exacto",
      "moonshotai/kimi-k2:free",
      "nousresearch/deephermes-3-llama-3-8b-preview",
      "nousresearch/hermes-4-405b",
      "nousresearch/hermes-4-70b",
      "openai/gpt-4.1",
      "openai/gpt-4.1-mini",
      "openai/gpt-4o-mini",
      "openai/gpt-5",
      "openai/gpt-5-chat",
      "openai/gpt-5-codex",
      "openai/gpt-5-image",
      "openai/gpt-5-mini",
      "openai/gpt-5-nano",
      "openai/gpt-5-pro",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-120b:exacto",
      "openai/gpt-oss-20b",
      "openai/o4-mini",
      "openrouter/cypher-alpha:free",
      "openrouter/horizon-alpha",
      "openrouter/horizon-beta",
      "openrouter/sonoma-dusk-alpha",
      "openrouter/sonoma-sky-alpha",
      "qwen/qwen-2.5-coder-32b-instruct",
      "qwen/qwen2.5-vl-32b-instruct:free",
      "qwen/qwen2.5-vl-72b-instruct",
      "qwen/qwen2.5-vl-72b-instruct:free",
      "qwen/qwen3-14b:free",
      "qwen/qwen3-235b-a22b-07-25",
      "qwen/qwen3-235b-a22b-07-25:free",
      "qwen/qwen3-235b-a22b-thinking-2507",
      "qwen/qwen3-235b-a22b:free",
      "qwen/qwen3-30b-a3b-instruct-2507",
      "qwen/qwen3-30b-a3b-thinking-2507",
      "qwen/qwen3-30b-a3b:free",
      "qwen/qwen3-32b:free",
      "qwen/qwen3-8b:free",
      "qwen/qwen3-coder",
      "qwen/qwen3-coder:exacto",
      "qwen/qwen3-coder:free",
      "qwen/qwen3-max",
      "qwen/qwen3-next-80b-a3b-instruct",
      "qwen/qwen3-next-80b-a3b-thinking",
      "qwen/qwq-32b:free",
      "rekaai/reka-flash-3",
      "sarvamai/sarvam-m:free",
      "thudm/glm-z1-32b:free",
      "tngtech/deepseek-r1t2-chimera:free",
      "x-ai/grok-3",
      "x-ai/grok-3-beta",
      "x-ai/grok-3-mini",
      "x-ai/grok-3-mini-beta",
      "x-ai/grok-4",
      "x-ai/grok-4-fast",
      "x-ai/grok-code-fast-1",
      "z-ai/glm-4.5",
      "z-ai/glm-4.5-air",
      "z-ai/glm-4.5-air:free",
      "z-ai/glm-4.5v",
      "z-ai/glm-4.6",
      "z-ai/glm-4.6:exacto"
    ],
    zenmux: [
      "anthropic/claude-haiku-4.5",
      "anthropic/claude-opus-4.1",
      "anthropic/claude-sonnet-4.5",
      "deepseek/deepseek-chat",
      "google/gemini-2.5-pro",
      "inclusionai/lint-1t",
      "inclusionai/ring-1t",
      "kuaishou/kat-coder-pro-v1",
      "moonshotai/kimi-k2-0905",
      "openai/gpt-5",
      "openai/gpt-5-codex",
      "qwen/qwen3-coder-plus",
      "x-ai/grok-4",
      "x-ai/grok-4-fast",
      "x-ai/grok-4-fast-non-reasoning",
      "x-ai/grok-code-fast-1",
      "z-ai/glm-4.5-air",
      "z-ai/glm-4.6"
    ],
    synthetic: [
      "hf:MiniMaxAI/MiniMax-M2",
      "hf:Qwen/Qwen2.5-Coder-32B-Instruct",
      "hf:Qwen/Qwen3-235B-A22B-Instruct-2507",
      "hf:Qwen/Qwen3-235B-A22B-Thinking-2507",
      "hf:Qwen/Qwen3-Coder-480B-A35B-Instruct",
      "hf:deepseek-ai/DeepSeek-R1",
      "hf:deepseek-ai/DeepSeek-R1-0528",
      "hf:deepseek-ai/DeepSeek-V3",
      "hf:deepseek-ai/DeepSeek-V3-0324",
      "hf:deepseek-ai/DeepSeek-V3.1",
      "hf:deepseek-ai/DeepSeek-V3.1-Terminus",
      "hf:meta-llama/Llama-3.1-405B-Instruct",
      "hf:meta-llama/Llama-3.1-70B-Instruct",
      "hf:meta-llama/Llama-3.1-8B-Instruct",
      "hf:meta-llama/Llama-3.3-70B-Instruct",
      "hf:meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
      "hf:meta-llama/Llama-4-Scout-17B-16E-Instruct",
      "hf:moonshotai/Kimi-K2-Instruct",
      "hf:moonshotai/Kimi-K2-Instruct-0905",
      "hf:openai/gpt-oss-120b",
      "hf:zai-org/GLM-4.5",
      "hf:zai-org/GLM-4.6"
    ],
    deepinfra: [
      "Qwen/Qwen3-Coder-480B-A35B-Instruct",
      "Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo",
      "moonshotai/Kimi-K2-Instruct",
      "zai-org/GLM-4.5"
    ],
    zhipuai: ["glm-4.5", "glm-4.5-air", "glm-4.5-flash", "glm-4.5v", "glm-4.6"],
    submodel: [
      "Qwen/Qwen3-235B-A22B-Instruct-2507",
      "Qwen/Qwen3-235B-A22B-Thinking-2507",
      "Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8",
      "deepseek-ai/DeepSeek-R1-0528",
      "deepseek-ai/DeepSeek-V3-0324",
      "deepseek-ai/DeepSeek-V3.1",
      "openai/gpt-oss-120b",
      "zai-org/GLM-4.5-Air",
      "zai-org/GLM-4.5-FP8"
    ],
    zai: ["glm-4.5", "glm-4.5-air", "glm-4.5-flash", "glm-4.5v", "glm-4.6"],
    inference: [
      "google/gemma-3",
      "meta/llama-3.1-8b-instruct",
      "meta/llama-3.2-11b-vision-instruct",
      "meta/llama-3.2-1b-instruct",
      "meta/llama-3.2-3b-instruct",
      "mistral/mistral-nemo-12b-instruct",
      "osmosis/osmosis-structure-0.6b",
      "qwen/qwen-2.5-7b-vision-instruct",
      "qwen/qwen3-embedding-4b"
    ],
    requesty: [
      "anthropic/claude-3-7-sonnet",
      "anthropic/claude-4-sonnet-20250522",
      "anthropic/claude-opus-4",
      "anthropic/claude-opus-4-1-20250805",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "openai/gpt-4.1",
      "openai/gpt-4.1-mini",
      "openai/gpt-4o-mini",
      "openai/gpt-5",
      "openai/gpt-5-mini",
      "openai/gpt-5-nano",
      "openai/o4-mini"
    ],
    morph: ["auto", "morph-v3-fast", "morph-v3-large"],
    lmstudio: ["openai/gpt-oss-20b", "qwen/qwen3-30b-a3b-2507", "qwen/qwen3-coder-30b"],
    anthropic: [
      "claude-3-5-haiku-20241022",
      "claude-3-5-haiku-latest",
      "claude-3-5-sonnet-20240620",
      "claude-3-5-sonnet-20241022",
      "claude-3-7-sonnet-20250219",
      "claude-3-7-sonnet-latest",
      "claude-3-haiku-20240307",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-haiku-4-5",
      "claude-haiku-4-5-20251001",
      "claude-opus-4-0",
      "claude-opus-4-1",
      "claude-opus-4-1-20250805",
      "claude-opus-4-20250514",
      "claude-sonnet-4-0",
      "claude-sonnet-4-20250514",
      "claude-sonnet-4-5",
      "claude-sonnet-4-5-20250929"
    ],
    "fireworks-ai": [
      "accounts/fireworks/models/deepseek-r1-0528",
      "accounts/fireworks/models/deepseek-v3-0324",
      "accounts/fireworks/models/deepseek-v3p1",
      "accounts/fireworks/models/glm-4p5",
      "accounts/fireworks/models/glm-4p5-air",
      "accounts/fireworks/models/gpt-oss-120b",
      "accounts/fireworks/models/gpt-oss-20b",
      "accounts/fireworks/models/kimi-k2-instruct",
      "accounts/fireworks/models/qwen3-235b-a22b",
      "accounts/fireworks/models/qwen3-coder-480b-a35b-instruct"
    ],
    modelscope: [
      "Qwen/Qwen3-235B-A22B-Instruct-2507",
      "Qwen/Qwen3-235B-A22B-Thinking-2507",
      "Qwen/Qwen3-30B-A3B-Instruct-2507",
      "Qwen/Qwen3-30B-A3B-Thinking-2507",
      "Qwen/Qwen3-Coder-30B-A3B-Instruct",
      "ZhipuAI/GLM-4.5",
      "ZhipuAI/GLM-4.6"
    ],
    llama: [
      "cerebras-llama-4-maverick-17b-128e-instruct",
      "cerebras-llama-4-scout-17b-16e-instruct",
      "groq-llama-4-maverick-17b-128e-instruct",
      "llama-3.3-70b-instruct",
      "llama-3.3-8b-instruct",
      "llama-4-maverick-17b-128e-instruct-fp8",
      "llama-4-scout-17b-16e-instruct-fp8"
    ],
    scaleway: [
      "bge-multilingual-gemma2",
      "deepseek-r1-distill-llama-70b",
      "gemma-3-27b-it",
      "gpt-oss-120b",
      "llama-3.1-8b-instruct",
      "llama-3.3-70b-instruct",
      "mistral-nemo-instruct-2407",
      "mistral-small-3.2-24b-instruct-2506",
      "pixtral-12b-2409",
      "qwen3-235b-a22b-instruct-2507",
      "qwen3-coder-30b-a3b-instruct",
      "voxtral-small-24b-2507",
      "whisper-large-v3"
    ],
    cerebras: ["gpt-oss-120b", "qwen-3-235b-a22b-instruct-2507", "qwen-3-coder-480b"],
    netlify: [
      "anthropic/claude-3-5-haiku-20241022",
      "anthropic/claude-3-5-haiku-latest",
      "anthropic/claude-3-7-sonnet-20250219",
      "anthropic/claude-3-7-sonnet-latest",
      "anthropic/claude-3-haiku-20240307",
      "anthropic/claude-haiku-4-5-20251001",
      "anthropic/claude-opus-4-1-20250805",
      "anthropic/claude-opus-4-20250514",
      "anthropic/claude-sonnet-4-20250514",
      "anthropic/claude-sonnet-4-5-20250929",
      "gemini/gemini-2.0-flash",
      "gemini/gemini-2.0-flash-lite",
      "gemini/gemini-2.5-flash",
      "gemini/gemini-2.5-flash-image-preview",
      "gemini/gemini-2.5-flash-lite",
      "gemini/gemini-2.5-flash-lite-preview-09-2025",
      "gemini/gemini-2.5-flash-preview-09-2025",
      "gemini/gemini-2.5-pro",
      "gemini/gemini-flash-latest",
      "gemini/gemini-flash-lite-latest",
      "openai/codex-mini-latest",
      "openai/gpt-4.1",
      "openai/gpt-4.1-mini",
      "openai/gpt-4.1-nano",
      "openai/gpt-4o",
      "openai/gpt-4o-mini",
      "openai/gpt-5",
      "openai/gpt-5-codex",
      "openai/gpt-5-mini",
      "openai/gpt-5-nano",
      "openai/gpt-5-pro",
      "openai/o3",
      "openai/o3-mini",
      "openai/o4-mini"
    ]
  },
  version: "1.0.0"
};

// src/llm/model/provider-registry.ts
var registryData = null;
var CACHE_DIR = () => path.join(os.homedir(), ".cache", "mastra");
var CACHE_FILE = () => path.join(CACHE_DIR(), "gateway-refresh-time");
var GLOBAL_PROVIDER_REGISTRY_JSON = () => path.join(CACHE_DIR(), "provider-registry.json");
var GLOBAL_PROVIDER_TYPES_DTS = () => path.join(CACHE_DIR(), "provider-types.generated.d.ts");
var modelRouterCacheFailed = false;
function syncGlobalCacheToLocal() {
  try {
    const globalJsonExists = fs.existsSync(GLOBAL_PROVIDER_REGISTRY_JSON());
    const globalDtsExists = fs.existsSync(GLOBAL_PROVIDER_TYPES_DTS());
    if (!globalJsonExists && !globalDtsExists) {
      return;
    }
    const packageRoot = getPackageRoot();
    const localJsonPath = path.join(packageRoot, "dist", "provider-registry.json");
    const localDtsPath = path.join(packageRoot, "dist", "llm", "model", "provider-types.generated.d.ts");
    fs.mkdirSync(path.dirname(localJsonPath), { recursive: true });
    fs.mkdirSync(path.dirname(localDtsPath), { recursive: true });
    if (globalJsonExists) {
      const globalJsonContent = fs.readFileSync(GLOBAL_PROVIDER_REGISTRY_JSON(), "utf-8");
      let shouldCopyJson = true;
      if (fs.existsSync(localJsonPath)) {
        const localJsonContent = fs.readFileSync(localJsonPath, "utf-8");
        shouldCopyJson = globalJsonContent !== localJsonContent;
      }
      if (shouldCopyJson) {
        fs.writeFileSync(localJsonPath, globalJsonContent, "utf-8");
      }
    }
    if (globalDtsExists) {
      const globalDtsContent = fs.readFileSync(GLOBAL_PROVIDER_TYPES_DTS(), "utf-8");
      let shouldCopyDts = true;
      if (fs.existsSync(localDtsPath)) {
        const localDtsContent = fs.readFileSync(localDtsPath, "utf-8");
        shouldCopyDts = globalDtsContent !== localDtsContent;
      }
      if (shouldCopyDts) {
        fs.writeFileSync(localDtsPath, globalDtsContent, "utf-8");
      }
    }
  } catch (error) {
    console.warn("Failed to sync global cache to local:", error);
  }
}
function getLastRefreshTimeFromDisk() {
  try {
    if (!fs.existsSync(CACHE_FILE())) {
      return null;
    }
    const timestamp = fs.readFileSync(CACHE_FILE(), "utf-8").trim();
    return new Date(parseInt(timestamp, 10));
  } catch (err) {
    console.warn("[GatewayRegistry] Failed to read cache file:", err);
    modelRouterCacheFailed = true;
    return null;
  }
}
function saveLastRefreshTimeToDisk(date) {
  try {
    if (!fs.existsSync(CACHE_DIR())) {
      fs.mkdirSync(CACHE_DIR(), { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE(), date.getTime().toString(), "utf-8");
  } catch (err) {
    modelRouterCacheFailed = true;
    console.warn("[GatewayRegistry] Failed to write cache file:", err);
  }
}
function getPackageRoot() {
  try {
    const require2 = createRequire(import.meta.url || "file://");
    const packageJsonPath = require2.resolve("@mastra/core/package.json");
    return path.dirname(packageJsonPath);
  } catch {
    return process.cwd();
  }
}
function loadRegistry(useDynamicLoading) {
  if (!useDynamicLoading) {
    return provider_registry_default;
  }
  syncGlobalCacheToLocal();
  if (registryData) {
    return registryData;
  }
  const packageRoot = getPackageRoot();
  const possiblePaths = [
    // Built: in dist/ relative to package root (first priority - what gets distributed)
    path.join(packageRoot, "dist", "provider-registry.json"),
    // Development: in src/ relative to package root
    path.join(packageRoot, "src", "llm", "model", "provider-registry.json"),
    // Fallback: relative to cwd (for monorepo setups)
    path.join(process.cwd(), "packages/core/src/llm/model/provider-registry.json"),
    path.join(process.cwd(), "src/llm/model/provider-registry.json")
  ];
  const errors = [];
  for (const jsonPath of possiblePaths) {
    try {
      const content = fs.readFileSync(jsonPath, "utf-8");
      registryData = JSON.parse(content);
      return registryData;
    } catch (err) {
      errors.push(`${jsonPath}: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
  }
  throw new Error(
    `Failed to load provider registry with dynamic loading. Make sure provider-registry.json is generated by running: npm run generate:providers

Tried paths:
${errors.join("\n")}`
  );
}
var PROVIDER_REGISTRY = new Proxy({}, {
  get(_target, prop) {
    const registry = GatewayRegistry.getInstance();
    const providers = registry.getProviders();
    return providers[prop];
  },
  ownKeys() {
    const registry = GatewayRegistry.getInstance();
    const providers = registry.getProviders();
    return Object.keys(providers);
  },
  has(_target, prop) {
    const registry = GatewayRegistry.getInstance();
    const providers = registry.getProviders();
    return prop in providers;
  },
  getOwnPropertyDescriptor(_target, prop) {
    const registry = GatewayRegistry.getInstance();
    const providers = registry.getProviders();
    if (prop in providers) {
      return {
        enumerable: true,
        configurable: true
      };
    }
    return void 0;
  }
});
new Proxy({}, {
  get(_target, prop) {
    const registry = GatewayRegistry.getInstance();
    const models = registry.getModels();
    return models[prop];
  },
  ownKeys() {
    const registry = GatewayRegistry.getInstance();
    const models = registry.getModels();
    return Object.keys(models);
  },
  has(_target, prop) {
    const registry = GatewayRegistry.getInstance();
    const models = registry.getModels();
    return prop in models;
  },
  getOwnPropertyDescriptor(_target, prop) {
    const registry = GatewayRegistry.getInstance();
    const models = registry.getModels();
    if (prop in models) {
      return {
        enumerable: true,
        configurable: true
      };
    }
    return void 0;
  }
});
function getProviderConfig(providerId) {
  const registry = GatewayRegistry.getInstance();
  return registry.getProviderConfig(providerId);
}
var GatewayRegistry = class _GatewayRegistry {
  static instance = null;
  lastRefreshTime = null;
  refreshInterval = null;
  isRefreshing = false;
  useDynamicLoading;
  constructor(options = {}) {
    const isDev2 = process.env.MASTRA_DEV === "true" || process.env.MASTRA_DEV === "1";
    this.useDynamicLoading = options.useDynamicLoading ?? isDev2;
  }
  /**
   * Get the singleton instance
   */
  static getInstance(options) {
    if (!_GatewayRegistry.instance) {
      _GatewayRegistry.instance = new _GatewayRegistry(options);
    }
    return _GatewayRegistry.instance;
  }
  /**
   * Sync providers from all gateways
   * Requires dynamic loading to be enabled (useDynamicLoading=true).
   * @param forceRefresh - Force refresh even if recently synced
   * @param writeToSrc - Write to src/ directory in addition to dist/ (useful for manual generation in repo)
   */
  async syncGateways(forceRefresh = false, writeToSrc = false) {
    if (!this.useDynamicLoading && !writeToSrc) {
      return;
    }
    if (this.isRefreshing && !forceRefresh) {
      return;
    }
    this.isRefreshing = true;
    try {
      const { ModelsDevGateway: ModelsDevGateway2 } = await Promise.resolve().then(function () { return modelsDev4VGIWYS3; });
      const { NetlifyGateway: NetlifyGateway2 } = await Promise.resolve().then(function () { return netlifyVJXBII33; });
      const { fetchProvidersFromGateways, writeRegistryFiles } = await import('./registry-generator-DXRSYYYT.mjs');
      const gateways2 = [new ModelsDevGateway2({}), new NetlifyGateway2()];
      const { providers, models } = await fetchProvidersFromGateways(gateways2);
      const packageRoot = getPackageRoot();
      try {
        fs.mkdirSync(CACHE_DIR(), { recursive: true });
        await writeRegistryFiles(GLOBAL_PROVIDER_REGISTRY_JSON(), GLOBAL_PROVIDER_TYPES_DTS(), providers, models);
      } catch (error) {
        console.warn("[GatewayRegistry] Failed to write to global cache:", error);
      }
      const distJsonPath = path.join(packageRoot, "dist", "provider-registry.json");
      const distTypesPath = path.join(packageRoot, "dist", "llm", "model", "provider-types.generated.d.ts");
      await writeRegistryFiles(distJsonPath, distTypesPath, providers, models);
      const shouldWriteToSrc = writeToSrc;
      if (shouldWriteToSrc) {
        const srcJsonPath = path.join(packageRoot, "src", "llm", "model", "provider-registry.json");
        const srcTypesPath = path.join(packageRoot, "src", "llm", "model", "provider-types.generated.d.ts");
        await fs.promises.copyFile(distJsonPath, srcJsonPath);
        await fs.promises.copyFile(distTypesPath, srcTypesPath);
      }
      if (this.useDynamicLoading) {
        registryData = null;
      }
      this.lastRefreshTime = /* @__PURE__ */ new Date();
      saveLastRefreshTimeToDisk(this.lastRefreshTime);
    } catch (error) {
      console.error("[GatewayRegistry] \u274C Gateway sync failed:", error);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }
  /**
   * Get the last refresh time (from memory or disk cache)
   */
  getLastRefreshTime() {
    return this.lastRefreshTime || getLastRefreshTimeFromDisk();
  }
  /**
   * Start auto-refresh on an interval
   * Requires dynamic loading to be enabled (useDynamicLoading=true).
   * @param intervalMs - Interval in milliseconds (default: 1 hour)
   */
  startAutoRefresh(intervalMs = 60 * 60 * 1e3) {
    if (!this.useDynamicLoading) {
      return;
    }
    if (this.refreshInterval) {
      return;
    }
    const lastRefresh = getLastRefreshTimeFromDisk();
    const now = Date.now();
    const shouldRefresh = !modelRouterCacheFailed && (!lastRefresh || now - lastRefresh.getTime() > intervalMs);
    if (shouldRefresh) {
      this.syncGateways().catch((err) => {
        console.error("[GatewayRegistry] Initial auto-refresh failed:", err);
      });
    }
    this.refreshInterval = setInterval(() => {
      if (modelRouterCacheFailed && this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
        return;
      }
      this.syncGateways().catch((err) => {
        console.error("[GatewayRegistry] Auto-refresh failed:", err);
      });
    }, intervalMs);
    if (this.refreshInterval.unref) {
      this.refreshInterval.unref();
    }
  }
  /**
   * Stop auto-refresh
   */
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
  /**
   * Get provider configuration by ID
   */
  getProviderConfig(providerId) {
    const data = loadRegistry(this.useDynamicLoading);
    return data.providers[providerId];
  }
  /**
   * Check if a provider is registered
   */
  isProviderRegistered(providerId) {
    const data = loadRegistry(this.useDynamicLoading);
    return providerId in data.providers;
  }
  /**
   * Get all registered providers
   */
  getProviders() {
    const data = loadRegistry(this.useDynamicLoading);
    return data.providers;
  }
  /**
   * Get all models
   */
  getModels() {
    return loadRegistry(this.useDynamicLoading).models;
  }
};
var isDev = process.env.MASTRA_DEV === "true" || process.env.MASTRA_DEV === "1";
var autoRefreshEnabled = process.env.MASTRA_AUTO_REFRESH_PROVIDERS === "true" || process.env.MASTRA_AUTO_REFRESH_PROVIDERS !== "false" && isDev;
if (autoRefreshEnabled) {
  GatewayRegistry.getInstance({ useDynamicLoading: isDev }).startAutoRefresh();
}

// src/llm/model/gateways/index.ts
function findGatewayForModel(gatewayId, gateways2) {
  const prefixedGateway = gateways2.find((g) => g.prefix && gatewayId.startsWith(`${g.prefix}/`));
  if (prefixedGateway) {
    return prefixedGateway;
  }
  const unprefixedGateways = gateways2.filter((g) => !g.prefix);
  for (const gateway of unprefixedGateways) {
    return gateway;
  }
  throw new MastraError({
    id: "MODEL_ROUTER_NO_GATEWAY_FOUND",
    category: "USER",
    domain: "MODEL_ROUTER",
    text: `No Mastra model router gateway found for model id ${gatewayId}`
  });
}

// src/llm/model/router.ts
function getStaticProvidersByGateway(name) {
  return Object.fromEntries(Object.entries(PROVIDER_REGISTRY).filter(([_provider, config]) => config.gateway === name));
}
var gateways = [new NetlifyGateway(), new ModelsDevGateway(getStaticProvidersByGateway(`models.dev`))];
var ModelRouterLanguageModel = class _ModelRouterLanguageModel {
  specificationVersion = "v2";
  defaultObjectGenerationMode = "json";
  supportsStructuredOutputs = true;
  supportsImageUrls = true;
  supportedUrls = {};
  modelId;
  provider;
  config;
  gateway;
  constructor(config) {
    let normalizedConfig;
    if (typeof config === "string") {
      normalizedConfig = { id: config };
    } else if ("providerId" in config && "modelId" in config) {
      normalizedConfig = {
        id: `${config.providerId}/${config.modelId}`,
        url: config.url,
        apiKey: config.apiKey,
        headers: config.headers
      };
    } else {
      normalizedConfig = {
        id: config.id,
        url: config.url,
        apiKey: config.apiKey,
        headers: config.headers
      };
    }
    const parsedConfig = {
      ...normalizedConfig,
      routerId: normalizedConfig.id
    };
    this.gateway = findGatewayForModel(normalizedConfig.id, gateways);
    const parsed = parseModelRouterId(normalizedConfig.id, this.gateway.prefix);
    this.provider = parsed.providerId || "openai-compatible";
    if (parsed.providerId && parsed.modelId !== normalizedConfig.id) {
      parsedConfig.id = parsed.modelId;
    }
    this.modelId = parsedConfig.id;
    this.config = parsedConfig;
  }
  async doGenerate() {
    throw new Error(
      "doGenerate is not supported by Mastra model router. Mastra only uses streaming (doStream) for all LLM calls."
    );
  }
  async doStream(options) {
    let apiKey;
    try {
      if (this.config.url) {
        apiKey = this.config.apiKey || "";
      } else {
        apiKey = this.config.apiKey || await this.gateway.getApiKey(this.config.routerId);
      }
    } catch (error) {
      return {
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({
              type: "error",
              error
            });
          }
        })
      };
    }
    const model = await this.resolveLanguageModel({
      apiKey,
      ...parseModelRouterId(this.config.routerId, this.gateway.prefix)
    });
    return model.doStream(options);
  }
  async resolveLanguageModel({
    modelId,
    providerId,
    apiKey
  }) {
    const key = createHash("sha256").update(this.gateway.name + modelId + providerId + apiKey + (this.config.url || "")).digest("hex");
    if (_ModelRouterLanguageModel.modelInstances.has(key)) return _ModelRouterLanguageModel.modelInstances.get(key);
    if (this.config.url) {
      const modelInstance2 = createOpenAICompatible({
        name: providerId,
        apiKey,
        baseURL: this.config.url,
        headers: this.config.headers,
        supportsStructuredOutputs: true
      }).chatModel(modelId);
      _ModelRouterLanguageModel.modelInstances.set(key, modelInstance2);
      return modelInstance2;
    }
    const modelInstance = await this.gateway.resolveLanguageModel({ modelId, providerId, apiKey });
    _ModelRouterLanguageModel.modelInstances.set(key, modelInstance);
    return modelInstance;
  }
  static modelInstances = /* @__PURE__ */ new Map();
};

// src/llm/model/resolve-model.ts
function isOpenAICompatibleObjectConfig(modelConfig) {
  if (typeof modelConfig === "object" && "specificationVersion" in modelConfig) return false;
  if (typeof modelConfig === "object" && !("model" in modelConfig)) {
    if ("id" in modelConfig) return true;
    if ("providerId" in modelConfig && "modelId" in modelConfig) return true;
  }
  return false;
}
async function resolveModelConfig(modelConfig, runtimeContext = new RuntimeContext(), mastra) {
  if (typeof modelConfig === "object" && "specificationVersion" in modelConfig) {
    return modelConfig;
  }
  if (typeof modelConfig === "string" || isOpenAICompatibleObjectConfig(modelConfig)) {
    return new ModelRouterLanguageModel(modelConfig);
  }
  if (typeof modelConfig === "function") {
    const fromDynamic = await modelConfig({ runtimeContext, mastra });
    if (typeof fromDynamic === "string" || isOpenAICompatibleObjectConfig(fromDynamic)) {
      return new ModelRouterLanguageModel(fromDynamic);
    }
    return fromDynamic;
  }
  throw new Error("Invalid model configuration provided");
}
var ModelRouterEmbeddingModel = class {
  specificationVersion = "v2";
  modelId;
  provider;
  maxEmbeddingsPerCall = 2048;
  supportsParallelCalls = true;
  providerModel;
  constructor(config) {
    let normalizedConfig;
    if (typeof config === "string") {
      const parts = config.split("/");
      if (parts.length !== 2) {
        throw new Error(`Invalid model string format: "${config}". Expected format: "provider/model"`);
      }
      const [providerId, modelId] = parts;
      normalizedConfig = { providerId, modelId };
    } else if ("providerId" in config && "modelId" in config) {
      normalizedConfig = {
        providerId: config.providerId,
        modelId: config.modelId,
        url: config.url,
        apiKey: config.apiKey,
        headers: config.headers
      };
    } else {
      const parts = config.id.split("/");
      if (parts.length !== 2) {
        throw new Error(`Invalid model string format: "${config.id}". Expected format: "provider/model"`);
      }
      const [providerId, modelId] = parts;
      normalizedConfig = {
        providerId,
        modelId,
        url: config.url,
        apiKey: config.apiKey,
        headers: config.headers
      };
    }
    this.provider = normalizedConfig.providerId;
    this.modelId = normalizedConfig.modelId;
    if (normalizedConfig.url) {
      const apiKey = normalizedConfig.apiKey || "";
      this.providerModel = createOpenAICompatible({
        name: normalizedConfig.providerId,
        apiKey,
        baseURL: normalizedConfig.url,
        headers: normalizedConfig.headers
      }).textEmbeddingModel(normalizedConfig.modelId);
    } else {
      const registry = GatewayRegistry.getInstance();
      const providerConfig = registry.getProviderConfig(normalizedConfig.providerId);
      if (!providerConfig) {
        throw new Error(`Unknown provider: ${normalizedConfig.providerId}`);
      }
      let apiKey = normalizedConfig.apiKey;
      if (!apiKey) {
        const apiKeyEnvVar = providerConfig.apiKeyEnvVar;
        if (Array.isArray(apiKeyEnvVar)) {
          for (const envVar of apiKeyEnvVar) {
            apiKey = process.env[envVar];
            if (apiKey) break;
          }
        } else {
          apiKey = process.env[apiKeyEnvVar];
        }
      }
      if (!apiKey) {
        const envVarDisplay = Array.isArray(providerConfig.apiKeyEnvVar) ? providerConfig.apiKeyEnvVar.join(" or ") : providerConfig.apiKeyEnvVar;
        throw new Error(`API key not found for provider ${normalizedConfig.providerId}. Set ${envVarDisplay}`);
      }
      if (normalizedConfig.providerId === "openai") {
        this.providerModel = createOpenAI({ apiKey }).textEmbeddingModel(
          normalizedConfig.modelId
        );
      } else if (normalizedConfig.providerId === "google") {
        this.providerModel = createGoogleGenerativeAI({ apiKey }).textEmbedding(
          normalizedConfig.modelId
        );
      } else {
        if (!providerConfig.url) {
          throw new Error(`Provider ${normalizedConfig.providerId} does not have a URL configured`);
        }
        this.providerModel = createOpenAICompatible({
          name: normalizedConfig.providerId,
          apiKey,
          baseURL: providerConfig.url
        }).textEmbeddingModel(normalizedConfig.modelId);
      }
    }
    if (this.providerModel.maxEmbeddingsPerCall !== void 0) {
      this.maxEmbeddingsPerCall = this.providerModel.maxEmbeddingsPerCall;
    }
    if (this.providerModel.supportsParallelCalls !== void 0) {
      this.supportsParallelCalls = this.providerModel.supportsParallelCalls;
    }
  }
  async doEmbed(args) {
    return this.providerModel.doEmbed(args);
  }
};

var modelsDev4VGIWYS3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ModelsDevGateway: ModelsDevGateway
});

var netlifyVJXBII33 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  NetlifyGateway: NetlifyGateway
});

export { InMemoryServerCache as I, ModelRouterEmbeddingModel as M, PROVIDER_REGISTRY as P, ModelRouterLanguageModel as a, getProviderConfig as g, resolveModelConfig as r };
