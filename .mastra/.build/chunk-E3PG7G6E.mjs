import { c as convertToCoreMessages, b as convertUint8ArrayToBase64$1, f as fetchWithRetry } from './ai-tracing.mjs';
import { M as MastraError } from './error.mjs';
import { randomUUID } from 'crypto';
import { s as safeParseAsync, u as union, k as string, l as _instanceof, m as custom, n as lazy, o as _null, p as number, q as boolean, r as record, t as array, v as object$1, w as literal, x as unknown, y as discriminatedUnion, z as looseObject, A as optional, B as base64 } from './schemas.mjs';
import { t as toJSONSchema } from './coerce.mjs';
import { Z as ZodFirstPartyTypeKind, u as unionType, s as stringType, i as instanceOfType, c as custom$1 } from './v3.mjs';

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

// src/combine-headers.ts
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
createIdGenerator$1();

// src/is-abort-error.ts
function isAbortError(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}

// src/inject-json-instruction.ts
var DEFAULT_SCHEMA_PREFIX = "JSON schema:";
var DEFAULT_SCHEMA_SUFFIX = "You MUST answer with a JSON object that matches the JSON schema above.";
var DEFAULT_GENERIC_SUFFIX = "You MUST answer with JSON.";
function injectJsonInstruction({
  prompt,
  schema,
  schemaPrefix = schema != null ? DEFAULT_SCHEMA_PREFIX : void 0,
  schemaSuffix = schema != null ? DEFAULT_SCHEMA_SUFFIX : DEFAULT_GENERIC_SUFFIX
}) {
  return [
    prompt != null && prompt.length > 0 ? prompt : void 0,
    prompt != null && prompt.length > 0 ? "" : void 0,
    // add a newline if prompt is not null
    schemaPrefix,
    schema != null ? JSON.stringify(schema) : void 0,
    schemaSuffix
  ].filter((line) => line != null).join("\n");
}
function injectJsonInstructionIntoMessages({
  messages,
  schema,
  schemaPrefix,
  schemaSuffix
}) {
  var _a, _b;
  const systemMessage = ((_a = messages[0]) == null ? void 0 : _a.role) === "system" ? { ...messages[0] } : { role: "system", content: "" };
  systemMessage.content = injectJsonInstruction({
    prompt: systemMessage.content,
    schema,
    schemaPrefix,
    schemaSuffix
  });
  return [
    systemMessage,
    ...((_b = messages[0]) == null ? void 0 : _b.role) === "system" ? messages.slice(1) : messages
  ];
}

// src/is-url-supported.ts
function isUrlSupported({
  mediaType,
  url,
  supportedUrls
}) {
  url = url.toLowerCase();
  mediaType = mediaType.toLowerCase();
  return Object.entries(supportedUrls).map(([key, value]) => {
    const mediaType2 = key.toLowerCase();
    return mediaType2 === "*" || mediaType2 === "*/*" ? { mediaTypePrefix: "", regexes: value } : { mediaTypePrefix: mediaType2.replace(/\*/, ""), regexes: value };
  }).filter(({ mediaTypePrefix }) => mediaType.startsWith(mediaTypePrefix)).flatMap(({ regexes }) => regexes).some((pattern) => pattern.test(url));
}
new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);

// src/uint8-utils.ts
var { btoa, atob } = globalThis;
function convertBase64ToUint8Array(base64String) {
  const base64Url = base64String.replace(/-/g, "+").replace(/_/g, "/");
  const latin1string = atob(base64Url);
  return Uint8Array.from(latin1string, (byte) => byte.codePointAt(0));
}
function convertUint8ArrayToBase64(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa(latin1string);
}

// src/errors/ai-sdk-error.ts
var marker = "vercel.ai.error";
var symbol = Symbol.for(marker);
var _a;
var _AISDKError = class _AISDKError extends Error {
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
    return _AISDKError.hasMarker(error, marker);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a = symbol;
var AISDKError = _AISDKError;

// src/errors/api-call-error.ts
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

// src/errors/json-parse-error.ts
var name6 = "AI_JSONParseError";
var marker7$1 = `vercel.ai.error.${name6}`;
var symbol7$1 = Symbol.for(marker7$1);
var _a7$1;
var JSONParseError = class extends AISDKError {
  constructor({ text, cause }) {
    super({
      name: name6,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage$1(cause)}`,
      cause
    });
    this[_a7$1] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7$1);
  }
};
_a7$1 = symbol7$1;

// src/errors/type-validation-error.ts
var name12 = "AI_TypeValidationError";
var marker13$1 = `vercel.ai.error.${name12}`;
var symbol13$1 = Symbol.for(marker13$1);
var _a13$1;
var _TypeValidationError = class _TypeValidationError extends AISDKError {
  constructor({ value, cause }) {
    super({
      name: name12,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage$1(cause)}`,
      cause
    });
    this[_a13$1] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13$1);
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
var TypeValidationError = _TypeValidationError;

// src/combine-headers.ts
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

// src/get-error-message.ts
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

// src/secure-json-parse.ts
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
  return isValidator(value) ? value : typeof value === "function" ? value() : standardSchemaValidator(value);
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

// src/validate-types.ts
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

// src/types/tool.ts
function tool(tool2) {
  return tool2;
}

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
function jsonSchema(jsonSchema2, {
  validate
} = {}) {
  return {
    [schemaSymbol]: true,
    _type: void 0,
    // should never be used directly
    [validatorSymbol]: true,
    get jsonSchema() {
      if (typeof jsonSchema2 === "function") {
        jsonSchema2 = jsonSchema2();
      }
      return jsonSchema2;
    },
    validate
  };
}
function isSchema(value) {
  return typeof value === "object" && value !== null && schemaSymbol in value && value[schemaSymbol] === true && "jsonSchema" in value && "validate" in value;
}
function asSchema(schema) {
  return schema == null ? jsonSchema({
    properties: {},
    additionalProperties: false
  }) : isSchema(schema) ? schema : typeof schema === "function" ? schema() : zodSchema(schema);
}

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name17 in all)
    __defProp(target, name17, { get: all[name17], enumerable: true });
};
var name7 = "AI_NoObjectGeneratedError";
var marker7 = `vercel.ai.error.${name7}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var NoObjectGeneratedError = class extends AISDKError {
  constructor({
    message = "No object generated.",
    cause,
    text: text2,
    response,
    usage,
    finishReason
  }) {
    super({ name: name7, message, cause });
    this[_a7] = true;
    this.text = text2;
    this.response = response;
    this.usage = usage;
    this.finishReason = finishReason;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7);
  }
};
_a7 = symbol7;
var name13 = "AI_MessageConversionError";
var marker13 = `vercel.ai.error.${name13}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var MessageConversionError = class extends AISDKError {
  constructor({
    originalMessage,
    message
  }) {
    super({ name: name13, message });
    this[_a13] = true;
    this.originalMessage = originalMessage;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13);
  }
};
_a13 = symbol13;

// src/prompt/data-content.ts
var dataContentSchema = union([
  string(),
  _instanceof(Uint8Array),
  _instanceof(ArrayBuffer),
  custom(
    // Buffer might not be available in some environments such as CloudFlare:
    (value) => {
      var _a17, _b;
      return (_b = (_a17 = globalThis.Buffer) == null ? void 0 : _a17.isBuffer(value)) != null ? _b : false;
    },
    { message: "Must be a Buffer" }
  )
]);
var jsonValueSchema = lazy(
  () => union([
    _null(),
    string(),
    number(),
    boolean(),
    record(string(), jsonValueSchema),
    array(jsonValueSchema)
  ])
);

// src/types/provider-metadata.ts
var providerMetadataSchema = record(
  string(),
  record(string(), jsonValueSchema)
);
var textPartSchema = object$1({
  type: literal("text"),
  text: string(),
  providerOptions: providerMetadataSchema.optional()
});
var imagePartSchema = object$1({
  type: literal("image"),
  image: union([dataContentSchema, _instanceof(URL)]),
  mediaType: string().optional(),
  providerOptions: providerMetadataSchema.optional()
});
var filePartSchema = object$1({
  type: literal("file"),
  data: union([dataContentSchema, _instanceof(URL)]),
  filename: string().optional(),
  mediaType: string(),
  providerOptions: providerMetadataSchema.optional()
});
var reasoningPartSchema = object$1({
  type: literal("reasoning"),
  text: string(),
  providerOptions: providerMetadataSchema.optional()
});
var toolCallPartSchema = object$1({
  type: literal("tool-call"),
  toolCallId: string(),
  toolName: string(),
  input: unknown(),
  providerOptions: providerMetadataSchema.optional(),
  providerExecuted: boolean().optional()
});
var outputSchema = discriminatedUnion("type", [
  object$1({
    type: literal("text"),
    value: string()
  }),
  object$1({
    type: literal("json"),
    value: jsonValueSchema
  }),
  object$1({
    type: literal("error-text"),
    value: string()
  }),
  object$1({
    type: literal("error-json"),
    value: jsonValueSchema
  }),
  object$1({
    type: literal("content"),
    value: array(
      union([
        object$1({
          type: literal("text"),
          text: string()
        }),
        object$1({
          type: literal("media"),
          data: string(),
          mediaType: string()
        })
      ])
    )
  })
]);
var toolResultPartSchema = object$1({
  type: literal("tool-result"),
  toolCallId: string(),
  toolName: string(),
  output: outputSchema,
  providerOptions: providerMetadataSchema.optional()
});

// src/prompt/message.ts
var systemModelMessageSchema = object$1(
  {
    role: literal("system"),
    content: string(),
    providerOptions: providerMetadataSchema.optional()
  }
);
var userModelMessageSchema = object$1({
  role: literal("user"),
  content: union([
    string(),
    array(union([textPartSchema, imagePartSchema, filePartSchema]))
  ]),
  providerOptions: providerMetadataSchema.optional()
});
var assistantModelMessageSchema = object$1({
  role: literal("assistant"),
  content: union([
    string(),
    array(
      union([
        textPartSchema,
        filePartSchema,
        reasoningPartSchema,
        toolCallPartSchema,
        toolResultPartSchema
      ])
    )
  ]),
  providerOptions: providerMetadataSchema.optional()
});
var toolModelMessageSchema = object$1({
  role: literal("tool"),
  content: array(toolResultPartSchema),
  providerOptions: providerMetadataSchema.optional()
});
union([
  systemModelMessageSchema,
  userModelMessageSchema,
  assistantModelMessageSchema,
  toolModelMessageSchema
]);

// src/generate-text/stop-condition.ts
function stepCountIs(stepCount) {
  return ({ steps }) => steps.length === stepCount;
}
function createToolModelOutput({
  output,
  tool: tool3,
  errorMode
}) {
  if (errorMode === "text") {
    return { type: "error-text", value: getErrorMessage$1(output) };
  } else if (errorMode === "json") {
    return { type: "error-json", value: toJSONValue(output) };
  }
  if (tool3 == null ? void 0 : tool3.toModelOutput) {
    return tool3.toModelOutput(output);
  }
  return typeof output === "string" ? { type: "text", value: output } : { type: "json", value: toJSONValue(output) };
}
function toJSONValue(value) {
  return value === void 0 ? null : value;
}

// src/generate-text/generate-text.ts
createIdGenerator({
  prefix: "aitxt",
  size: 24
});

// src/util/prepare-headers.ts
function prepareHeaders(headers, defaultHeaders) {
  const responseHeaders = new Headers(headers != null ? headers : {});
  for (const [key, value] of Object.entries(defaultHeaders)) {
    if (!responseHeaders.has(key)) {
      responseHeaders.set(key, value);
    }
  }
  return responseHeaders;
}

// src/text-stream/create-text-stream-response.ts
function createTextStreamResponse({
  status,
  statusText,
  headers,
  textStream
}) {
  return new Response(textStream.pipeThrough(new TextEncoderStream()), {
    status: status != null ? status : 200,
    statusText,
    headers: prepareHeaders(headers, {
      "content-type": "text/plain; charset=utf-8"
    })
  });
}

// src/ui-message-stream/json-to-sse-transform-stream.ts
var JsonToSseTransformStream = class extends TransformStream {
  constructor() {
    super({
      transform(part, controller) {
        controller.enqueue(`data: ${JSON.stringify(part)}

`);
      },
      flush(controller) {
        controller.enqueue("data: [DONE]\n\n");
      }
    });
  }
};

// src/ui-message-stream/ui-message-stream-headers.ts
var UI_MESSAGE_STREAM_HEADERS = {
  "content-type": "text/event-stream",
  "cache-control": "no-cache",
  connection: "keep-alive",
  "x-vercel-ai-ui-message-stream": "v1",
  "x-accel-buffering": "no"
  // disable nginx buffering
};

// src/ui-message-stream/create-ui-message-stream-response.ts
function createUIMessageStreamResponse({
  status,
  statusText,
  headers,
  stream,
  consumeSseStream
}) {
  let sseStream = stream.pipeThrough(new JsonToSseTransformStream());
  if (consumeSseStream) {
    const [stream1, stream2] = sseStream.tee();
    sseStream = stream1;
    consumeSseStream({ stream: stream2 });
  }
  return new Response(sseStream.pipeThrough(new TextEncoderStream()), {
    status,
    statusText,
    headers: prepareHeaders(headers, UI_MESSAGE_STREAM_HEADERS)
  });
}
function isDataUIMessageChunk(chunk) {
  return chunk.type.startsWith("data-");
}

// src/util/merge-objects.ts
function mergeObjects(base, overrides) {
  if (base === void 0 && overrides === void 0) {
    return void 0;
  }
  if (base === void 0) {
    return overrides;
  }
  if (overrides === void 0) {
    return base;
  }
  const result = { ...base };
  for (const key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const overridesValue = overrides[key];
      if (overridesValue === void 0)
        continue;
      const baseValue = key in base ? base[key] : void 0;
      const isSourceObject = overridesValue !== null && typeof overridesValue === "object" && !Array.isArray(overridesValue) && !(overridesValue instanceof Date) && !(overridesValue instanceof RegExp);
      const isTargetObject = baseValue !== null && baseValue !== void 0 && typeof baseValue === "object" && !Array.isArray(baseValue) && !(baseValue instanceof Date) && !(baseValue instanceof RegExp);
      if (isSourceObject && isTargetObject) {
        result[key] = mergeObjects(
          baseValue,
          overridesValue
        );
      } else {
        result[key] = overridesValue;
      }
    }
  }
  return result;
}

// src/util/fix-json.ts
function fixJson(input) {
  const stack = ["ROOT"];
  let lastValidIndex = -1;
  let literalStart = null;
  function processValueStart(char, i, swapState) {
    {
      switch (char) {
        case '"': {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_STRING");
          break;
        }
        case "f":
        case "t":
        case "n": {
          lastValidIndex = i;
          literalStart = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_LITERAL");
          break;
        }
        case "-": {
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "{": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_OBJECT_START");
          break;
        }
        case "[": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_ARRAY_START");
          break;
        }
      }
    }
  }
  function processAfterObjectValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  function processAfterArrayValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const currentState = stack[stack.length - 1];
    switch (currentState) {
      case "ROOT":
        processValueStart(char, i, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (char) {
          case ":": {
            stack.pop();
            stack.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        processAfterObjectValue(char, i);
        break;
      }
      case "INSIDE_STRING": {
        switch (char) {
          case '"': {
            stack.pop();
            lastValidIndex = i;
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default: {
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (char) {
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (char) {
          case ",": {
            stack.pop();
            stack.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        stack.pop();
        lastValidIndex = i;
        break;
      }
      case "INSIDE_NUMBER": {
        switch (char) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".": {
            break;
          }
          case ",": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "}": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "]": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            break;
          }
          default: {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, i + 1);
        if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
          stack.pop();
          if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
            processAfterObjectValue(char, i);
          } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
            processAfterArrayValue(char, i);
          }
        } else {
          lastValidIndex = i;
        }
        break;
      }
    }
  }
  let result = input.slice(0, lastValidIndex + 1);
  for (let i = stack.length - 1; i >= 0; i--) {
    const state = stack[i];
    switch (state) {
      case "INSIDE_STRING": {
        result += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        result += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        result += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, input.length);
        if ("true".startsWith(partialLiteral)) {
          result += "true".slice(partialLiteral.length);
        } else if ("false".startsWith(partialLiteral)) {
          result += "false".slice(partialLiteral.length);
        } else if ("null".startsWith(partialLiteral)) {
          result += "null".slice(partialLiteral.length);
        }
      }
    }
  }
  return result;
}

// src/util/parse-partial-json.ts
async function parsePartialJson(jsonText) {
  if (jsonText === void 0) {
    return { value: void 0, state: "undefined-input" };
  }
  let result = await safeParseJSON({ text: jsonText });
  if (result.success) {
    return { value: result.value, state: "successful-parse" };
  }
  result = await safeParseJSON({ text: fixJson(jsonText) });
  if (result.success) {
    return { value: result.value, state: "repaired-parse" };
  }
  return { value: void 0, state: "failed-parse" };
}
function isToolUIPart(part) {
  return part.type.startsWith("tool-");
}
function isDynamicToolUIPart(part) {
  return part.type === "dynamic-tool";
}
function isToolOrDynamicToolUIPart(part) {
  return isToolUIPart(part) || isDynamicToolUIPart(part);
}
function getToolName$1(part) {
  return part.type.split("-").slice(1).join("-");
}

// src/ui/process-ui-message-stream.ts
function createStreamingUIMessageState({
  lastMessage,
  messageId
}) {
  return {
    message: (lastMessage == null ? void 0 : lastMessage.role) === "assistant" ? lastMessage : {
      id: messageId,
      metadata: void 0,
      role: "assistant",
      parts: []
    },
    activeTextParts: {},
    activeReasoningParts: {},
    partialToolCalls: {}
  };
}
function processUIMessageStream({
  stream,
  messageMetadataSchema,
  dataPartSchemas,
  runUpdateMessageJob,
  onError,
  onToolCall,
  onData
}) {
  return stream.pipeThrough(
    new TransformStream({
      async transform(chunk, controller) {
        await runUpdateMessageJob(async ({ state, write }) => {
          var _a17, _b, _c, _d;
          function getToolInvocation(toolCallId) {
            const toolInvocations = state.message.parts.filter(isToolUIPart);
            const toolInvocation = toolInvocations.find(
              (invocation) => invocation.toolCallId === toolCallId
            );
            if (toolInvocation == null) {
              throw new Error(
                "tool-output-error must be preceded by a tool-input-available"
              );
            }
            return toolInvocation;
          }
          function getDynamicToolInvocation(toolCallId) {
            const toolInvocations = state.message.parts.filter(
              (part) => part.type === "dynamic-tool"
            );
            const toolInvocation = toolInvocations.find(
              (invocation) => invocation.toolCallId === toolCallId
            );
            if (toolInvocation == null) {
              throw new Error(
                "tool-output-error must be preceded by a tool-input-available"
              );
            }
            return toolInvocation;
          }
          function updateToolPart(options) {
            var _a18;
            const part = state.message.parts.find(
              (part2) => isToolUIPart(part2) && part2.toolCallId === options.toolCallId
            );
            const anyOptions = options;
            const anyPart = part;
            if (part != null) {
              part.state = options.state;
              anyPart.input = anyOptions.input;
              anyPart.output = anyOptions.output;
              anyPart.errorText = anyOptions.errorText;
              anyPart.rawInput = anyOptions.rawInput;
              anyPart.preliminary = anyOptions.preliminary;
              anyPart.providerExecuted = (_a18 = anyOptions.providerExecuted) != null ? _a18 : part.providerExecuted;
              if (anyOptions.providerMetadata != null && part.state === "input-available") {
                part.callProviderMetadata = anyOptions.providerMetadata;
              }
            } else {
              state.message.parts.push({
                type: `tool-${options.toolName}`,
                toolCallId: options.toolCallId,
                state: options.state,
                input: anyOptions.input,
                output: anyOptions.output,
                rawInput: anyOptions.rawInput,
                errorText: anyOptions.errorText,
                providerExecuted: anyOptions.providerExecuted,
                preliminary: anyOptions.preliminary,
                ...anyOptions.providerMetadata != null ? { callProviderMetadata: anyOptions.providerMetadata } : {}
              });
            }
          }
          function updateDynamicToolPart(options) {
            var _a18;
            const part = state.message.parts.find(
              (part2) => part2.type === "dynamic-tool" && part2.toolCallId === options.toolCallId
            );
            const anyOptions = options;
            const anyPart = part;
            if (part != null) {
              part.state = options.state;
              anyPart.toolName = options.toolName;
              anyPart.input = anyOptions.input;
              anyPart.output = anyOptions.output;
              anyPart.errorText = anyOptions.errorText;
              anyPart.rawInput = (_a18 = anyOptions.rawInput) != null ? _a18 : anyPart.rawInput;
              anyPart.preliminary = anyOptions.preliminary;
              if (anyOptions.providerMetadata != null && part.state === "input-available") {
                part.callProviderMetadata = anyOptions.providerMetadata;
              }
            } else {
              state.message.parts.push({
                type: "dynamic-tool",
                toolName: options.toolName,
                toolCallId: options.toolCallId,
                state: options.state,
                input: anyOptions.input,
                output: anyOptions.output,
                errorText: anyOptions.errorText,
                preliminary: anyOptions.preliminary,
                ...anyOptions.providerMetadata != null ? { callProviderMetadata: anyOptions.providerMetadata } : {}
              });
            }
          }
          async function updateMessageMetadata(metadata) {
            if (metadata != null) {
              const mergedMetadata = state.message.metadata != null ? mergeObjects(state.message.metadata, metadata) : metadata;
              if (messageMetadataSchema != null) {
                await validateTypes({
                  value: mergedMetadata,
                  schema: messageMetadataSchema
                });
              }
              state.message.metadata = mergedMetadata;
            }
          }
          switch (chunk.type) {
            case "text-start": {
              const textPart = {
                type: "text",
                text: "",
                providerMetadata: chunk.providerMetadata,
                state: "streaming"
              };
              state.activeTextParts[chunk.id] = textPart;
              state.message.parts.push(textPart);
              write();
              break;
            }
            case "text-delta": {
              const textPart = state.activeTextParts[chunk.id];
              textPart.text += chunk.delta;
              textPart.providerMetadata = (_a17 = chunk.providerMetadata) != null ? _a17 : textPart.providerMetadata;
              write();
              break;
            }
            case "text-end": {
              const textPart = state.activeTextParts[chunk.id];
              textPart.state = "done";
              textPart.providerMetadata = (_b = chunk.providerMetadata) != null ? _b : textPart.providerMetadata;
              delete state.activeTextParts[chunk.id];
              write();
              break;
            }
            case "reasoning-start": {
              const reasoningPart = {
                type: "reasoning",
                text: "",
                providerMetadata: chunk.providerMetadata,
                state: "streaming"
              };
              state.activeReasoningParts[chunk.id] = reasoningPart;
              state.message.parts.push(reasoningPart);
              write();
              break;
            }
            case "reasoning-delta": {
              const reasoningPart = state.activeReasoningParts[chunk.id];
              reasoningPart.text += chunk.delta;
              reasoningPart.providerMetadata = (_c = chunk.providerMetadata) != null ? _c : reasoningPart.providerMetadata;
              write();
              break;
            }
            case "reasoning-end": {
              const reasoningPart = state.activeReasoningParts[chunk.id];
              reasoningPart.providerMetadata = (_d = chunk.providerMetadata) != null ? _d : reasoningPart.providerMetadata;
              reasoningPart.state = "done";
              delete state.activeReasoningParts[chunk.id];
              write();
              break;
            }
            case "file": {
              state.message.parts.push({
                type: "file",
                mediaType: chunk.mediaType,
                url: chunk.url
              });
              write();
              break;
            }
            case "source-url": {
              state.message.parts.push({
                type: "source-url",
                sourceId: chunk.sourceId,
                url: chunk.url,
                title: chunk.title,
                providerMetadata: chunk.providerMetadata
              });
              write();
              break;
            }
            case "source-document": {
              state.message.parts.push({
                type: "source-document",
                sourceId: chunk.sourceId,
                mediaType: chunk.mediaType,
                title: chunk.title,
                filename: chunk.filename,
                providerMetadata: chunk.providerMetadata
              });
              write();
              break;
            }
            case "tool-input-start": {
              const toolInvocations = state.message.parts.filter(isToolUIPart);
              state.partialToolCalls[chunk.toolCallId] = {
                text: "",
                toolName: chunk.toolName,
                index: toolInvocations.length,
                dynamic: chunk.dynamic
              };
              if (chunk.dynamic) {
                updateDynamicToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: chunk.toolName,
                  state: "input-streaming",
                  input: void 0
                });
              } else {
                updateToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: chunk.toolName,
                  state: "input-streaming",
                  input: void 0,
                  providerExecuted: chunk.providerExecuted
                });
              }
              write();
              break;
            }
            case "tool-input-delta": {
              const partialToolCall = state.partialToolCalls[chunk.toolCallId];
              partialToolCall.text += chunk.inputTextDelta;
              const { value: partialArgs } = await parsePartialJson(
                partialToolCall.text
              );
              if (partialToolCall.dynamic) {
                updateDynamicToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: partialToolCall.toolName,
                  state: "input-streaming",
                  input: partialArgs
                });
              } else {
                updateToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: partialToolCall.toolName,
                  state: "input-streaming",
                  input: partialArgs
                });
              }
              write();
              break;
            }
            case "tool-input-available": {
              if (chunk.dynamic) {
                updateDynamicToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: chunk.toolName,
                  state: "input-available",
                  input: chunk.input,
                  providerMetadata: chunk.providerMetadata
                });
              } else {
                updateToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: chunk.toolName,
                  state: "input-available",
                  input: chunk.input,
                  providerExecuted: chunk.providerExecuted,
                  providerMetadata: chunk.providerMetadata
                });
              }
              write();
              if (onToolCall && !chunk.providerExecuted) {
                await onToolCall({
                  toolCall: chunk
                });
              }
              break;
            }
            case "tool-input-error": {
              if (chunk.dynamic) {
                updateDynamicToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: chunk.toolName,
                  state: "output-error",
                  input: chunk.input,
                  errorText: chunk.errorText,
                  providerMetadata: chunk.providerMetadata
                });
              } else {
                updateToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: chunk.toolName,
                  state: "output-error",
                  input: void 0,
                  rawInput: chunk.input,
                  errorText: chunk.errorText,
                  providerExecuted: chunk.providerExecuted,
                  providerMetadata: chunk.providerMetadata
                });
              }
              write();
              break;
            }
            case "tool-output-available": {
              if (chunk.dynamic) {
                const toolInvocation = getDynamicToolInvocation(
                  chunk.toolCallId
                );
                updateDynamicToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: toolInvocation.toolName,
                  state: "output-available",
                  input: toolInvocation.input,
                  output: chunk.output,
                  preliminary: chunk.preliminary
                });
              } else {
                const toolInvocation = getToolInvocation(chunk.toolCallId);
                updateToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: getToolName$1(toolInvocation),
                  state: "output-available",
                  input: toolInvocation.input,
                  output: chunk.output,
                  providerExecuted: chunk.providerExecuted,
                  preliminary: chunk.preliminary
                });
              }
              write();
              break;
            }
            case "tool-output-error": {
              if (chunk.dynamic) {
                const toolInvocation = getDynamicToolInvocation(
                  chunk.toolCallId
                );
                updateDynamicToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: toolInvocation.toolName,
                  state: "output-error",
                  input: toolInvocation.input,
                  errorText: chunk.errorText
                });
              } else {
                const toolInvocation = getToolInvocation(chunk.toolCallId);
                updateToolPart({
                  toolCallId: chunk.toolCallId,
                  toolName: getToolName$1(toolInvocation),
                  state: "output-error",
                  input: toolInvocation.input,
                  rawInput: toolInvocation.rawInput,
                  errorText: chunk.errorText
                });
              }
              write();
              break;
            }
            case "start-step": {
              state.message.parts.push({ type: "step-start" });
              break;
            }
            case "finish-step": {
              state.activeTextParts = {};
              state.activeReasoningParts = {};
              break;
            }
            case "start": {
              if (chunk.messageId != null) {
                state.message.id = chunk.messageId;
              }
              await updateMessageMetadata(chunk.messageMetadata);
              if (chunk.messageId != null || chunk.messageMetadata != null) {
                write();
              }
              break;
            }
            case "finish": {
              await updateMessageMetadata(chunk.messageMetadata);
              if (chunk.messageMetadata != null) {
                write();
              }
              break;
            }
            case "message-metadata": {
              await updateMessageMetadata(chunk.messageMetadata);
              if (chunk.messageMetadata != null) {
                write();
              }
              break;
            }
            case "error": {
              onError == null ? void 0 : onError(new Error(chunk.errorText));
              break;
            }
            default: {
              if (isDataUIMessageChunk(chunk)) {
                if ((dataPartSchemas == null ? void 0 : dataPartSchemas[chunk.type]) != null) {
                  await validateTypes({
                    value: chunk.data,
                    schema: dataPartSchemas[chunk.type]
                  });
                }
                const dataChunk = chunk;
                if (dataChunk.transient) {
                  onData == null ? void 0 : onData(dataChunk);
                  break;
                }
                const existingUIPart = dataChunk.id != null ? state.message.parts.find(
                  (chunkArg) => dataChunk.type === chunkArg.type && dataChunk.id === chunkArg.id
                ) : void 0;
                if (existingUIPart != null) {
                  existingUIPart.data = dataChunk.data;
                } else {
                  state.message.parts.push(dataChunk);
                }
                onData == null ? void 0 : onData(dataChunk);
                write();
              }
            }
          }
          controller.enqueue(chunk);
        });
      }
    })
  );
}

// src/ui-message-stream/handle-ui-message-stream-finish.ts
function handleUIMessageStreamFinish({
  messageId,
  originalMessages = [],
  onFinish,
  onError,
  stream
}) {
  let lastMessage = originalMessages == null ? void 0 : originalMessages[originalMessages.length - 1];
  if ((lastMessage == null ? void 0 : lastMessage.role) !== "assistant") {
    lastMessage = void 0;
  } else {
    messageId = lastMessage.id;
  }
  let isAborted = false;
  const idInjectedStream = stream.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        if (chunk.type === "start") {
          const startChunk = chunk;
          if (startChunk.messageId == null && messageId != null) {
            startChunk.messageId = messageId;
          }
        }
        if (chunk.type === "abort") {
          isAborted = true;
        }
        controller.enqueue(chunk);
      }
    })
  );
  if (onFinish == null) {
    return idInjectedStream;
  }
  const state = createStreamingUIMessageState({
    lastMessage: lastMessage ? structuredClone(lastMessage) : void 0,
    messageId: messageId != null ? messageId : ""
    // will be overridden by the stream
  });
  const runUpdateMessageJob = async (job) => {
    await job({ state, write: () => {
    } });
  };
  let finishCalled = false;
  const callOnFinish = async () => {
    if (finishCalled || !onFinish) {
      return;
    }
    finishCalled = true;
    const isContinuation = state.message.id === (lastMessage == null ? void 0 : lastMessage.id);
    await onFinish({
      isAborted,
      isContinuation,
      responseMessage: state.message,
      messages: [
        ...isContinuation ? originalMessages.slice(0, -1) : originalMessages,
        state.message
      ]
    });
  };
  return processUIMessageStream({
    stream: idInjectedStream,
    runUpdateMessageJob,
    onError
  }).pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
      // @ts-expect-error cancel is still new and missing from types https://developer.mozilla.org/en-US/docs/Web/API/TransformStream#browser_compatibility
      async cancel() {
        await callOnFinish();
      },
      async flush() {
        await callOnFinish();
      }
    })
  );
}

// src/generate-text/stream-text.ts
createIdGenerator({
  prefix: "aitxt",
  size: 24
});

// src/ui/convert-to-model-messages.ts
function convertToModelMessages(messages, options) {
  const modelMessages = [];
  if (options == null ? void 0 : options.ignoreIncompleteToolCalls) {
    messages = messages.map((message) => ({
      ...message,
      parts: message.parts.filter(
        (part) => !isToolOrDynamicToolUIPart(part) || part.state !== "input-streaming" && part.state !== "input-available"
      )
    }));
  }
  for (const message of messages) {
    switch (message.role) {
      case "system": {
        const textParts = message.parts.filter((part) => part.type === "text");
        const providerMetadata = textParts.reduce((acc, part) => {
          if (part.providerMetadata != null) {
            return { ...acc, ...part.providerMetadata };
          }
          return acc;
        }, {});
        modelMessages.push({
          role: "system",
          content: textParts.map((part) => part.text).join(""),
          ...Object.keys(providerMetadata).length > 0 ? { providerOptions: providerMetadata } : {}
        });
        break;
      }
      case "user": {
        modelMessages.push({
          role: "user",
          content: message.parts.filter(
            (part) => part.type === "text" || part.type === "file"
          ).map((part) => {
            switch (part.type) {
              case "text":
                return {
                  type: "text",
                  text: part.text,
                  ...part.providerMetadata != null ? { providerOptions: part.providerMetadata } : {}
                };
              case "file":
                return {
                  type: "file",
                  mediaType: part.mediaType,
                  filename: part.filename,
                  data: part.url,
                  ...part.providerMetadata != null ? { providerOptions: part.providerMetadata } : {}
                };
              default:
                return part;
            }
          })
        });
        break;
      }
      case "assistant": {
        if (message.parts != null) {
          let processBlock2 = function() {
            var _a17, _b;
            if (block.length === 0) {
              return;
            }
            const content = [];
            for (const part of block) {
              if (part.type === "text") {
                content.push({
                  type: "text",
                  text: part.text,
                  ...part.providerMetadata != null ? { providerOptions: part.providerMetadata } : {}
                });
              } else if (part.type === "file") {
                content.push({
                  type: "file",
                  mediaType: part.mediaType,
                  filename: part.filename,
                  data: part.url
                });
              } else if (part.type === "reasoning") {
                content.push({
                  type: "reasoning",
                  text: part.text,
                  providerOptions: part.providerMetadata
                });
              } else if (part.type === "dynamic-tool") {
                const toolName = part.toolName;
                if (part.state !== "input-streaming") {
                  content.push({
                    type: "tool-call",
                    toolCallId: part.toolCallId,
                    toolName,
                    input: part.input,
                    ...part.callProviderMetadata != null ? { providerOptions: part.callProviderMetadata } : {}
                  });
                }
              } else if (isToolUIPart(part)) {
                const toolName = getToolName$1(part);
                if (part.state !== "input-streaming") {
                  content.push({
                    type: "tool-call",
                    toolCallId: part.toolCallId,
                    toolName,
                    input: part.state === "output-error" ? (_a17 = part.input) != null ? _a17 : part.rawInput : part.input,
                    providerExecuted: part.providerExecuted,
                    ...part.callProviderMetadata != null ? { providerOptions: part.callProviderMetadata } : {}
                  });
                  if (part.providerExecuted === true && (part.state === "output-available" || part.state === "output-error")) {
                    content.push({
                      type: "tool-result",
                      toolCallId: part.toolCallId,
                      toolName,
                      output: createToolModelOutput({
                        output: part.state === "output-error" ? part.errorText : part.output,
                        tool: (_b = options == null ? void 0 : options.tools) == null ? void 0 : _b[toolName],
                        errorMode: part.state === "output-error" ? "json" : "none"
                      })
                    });
                  }
                }
              } else {
                const _exhaustiveCheck = part;
                throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
              }
            }
            modelMessages.push({
              role: "assistant",
              content
            });
            const toolParts = block.filter(
              (part) => isToolUIPart(part) && part.providerExecuted !== true || part.type === "dynamic-tool"
            );
            if (toolParts.length > 0) {
              modelMessages.push({
                role: "tool",
                content: toolParts.map((toolPart) => {
                  var _a18;
                  switch (toolPart.state) {
                    case "output-error":
                    case "output-available": {
                      const toolName = toolPart.type === "dynamic-tool" ? toolPart.toolName : getToolName$1(toolPart);
                      return {
                        type: "tool-result",
                        toolCallId: toolPart.toolCallId,
                        toolName,
                        output: createToolModelOutput({
                          output: toolPart.state === "output-error" ? toolPart.errorText : toolPart.output,
                          tool: (_a18 = options == null ? void 0 : options.tools) == null ? void 0 : _a18[toolName],
                          errorMode: toolPart.state === "output-error" ? "text" : "none"
                        })
                      };
                    }
                    default: {
                      return null;
                    }
                  }
                }).filter(
                  (output) => output != null
                )
              });
            }
            block = [];
          };
          let block = [];
          for (const part of message.parts) {
            if (part.type === "text" || part.type === "reasoning" || part.type === "file" || part.type === "dynamic-tool" || isToolUIPart(part)) {
              block.push(part);
            } else if (part.type === "step-start") {
              processBlock2();
            }
          }
          processBlock2();
          break;
        }
        break;
      }
      default: {
        const _exhaustiveCheck = message.role;
        throw new MessageConversionError({
          originalMessage: message,
          message: `Unsupported role: ${_exhaustiveCheck}`
        });
      }
    }
  }
  return modelMessages;
}

// src/generate-object/generate-object.ts
createIdGenerator({ prefix: "aiobj", size: 24 });

// src/util/is-deep-equal-data.ts
function isDeepEqualData(obj1, obj2) {
  if (obj1 === obj2)
    return true;
  if (obj1 == null || obj2 == null)
    return false;
  if (typeof obj1 !== "object" && typeof obj2 !== "object")
    return obj1 === obj2;
  if (obj1.constructor !== obj2.constructor)
    return false;
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length)
      return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!isDeepEqualData(obj1[i], obj2[i]))
        return false;
    }
    return true;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length)
    return false;
  for (const key of keys1) {
    if (!keys2.includes(key))
      return false;
    if (!isDeepEqualData(obj1[key], obj2[key]))
      return false;
  }
  return true;
}

// src/generate-object/stream-object.ts
createIdGenerator({ prefix: "aiobj", size: 24 });

// src/generate-text/output.ts
var output_exports = {};
__export(output_exports, {
  object: () => object,
  text: () => text
});
var text = () => ({
  type: "text",
  responseFormat: { type: "text" },
  async parsePartial({ text: text2 }) {
    return { partial: text2 };
  },
  async parseOutput({ text: text2 }) {
    return text2;
  }
});
var object = ({
  schema: inputSchema
}) => {
  const schema = asSchema(inputSchema);
  return {
    type: "object",
    responseFormat: {
      type: "json",
      schema: schema.jsonSchema
    },
    async parsePartial({ text: text2 }) {
      const result = await parsePartialJson(text2);
      switch (result.state) {
        case "failed-parse":
        case "undefined-input":
          return void 0;
        case "repaired-parse":
        case "successful-parse":
          return {
            // Note: currently no validation of partial results:
            partial: result.value
          };
        default: {
          const _exhaustiveCheck = result.state;
          throw new Error(`Unsupported parse state: ${_exhaustiveCheck}`);
        }
      }
    },
    async parseOutput({ text: text2 }, context) {
      const parseResult = await safeParseJSON({ text: text2 });
      if (!parseResult.success) {
        throw new NoObjectGeneratedError({
          message: "No object generated: could not parse the response.",
          cause: parseResult.error,
          text: text2,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        });
      }
      const validationResult = await safeValidateTypes({
        value: parseResult.value,
        schema
      });
      if (!validationResult.success) {
        throw new NoObjectGeneratedError({
          message: "No object generated: response did not match schema.",
          cause: validationResult.error,
          text: text2,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        });
      }
      return validationResult.value;
    }
  };
};
var ClientOrServerImplementationSchema = looseObject({
  name: string(),
  version: string()
});
var BaseParamsSchema = looseObject({
  _meta: optional(object$1({}).loose())
});
var ResultSchema = BaseParamsSchema;
var RequestSchema = object$1({
  method: string(),
  params: optional(BaseParamsSchema)
});
var ServerCapabilitiesSchema = looseObject({
  experimental: optional(object$1({}).loose()),
  logging: optional(object$1({}).loose()),
  prompts: optional(
    looseObject({
      listChanged: optional(boolean())
    })
  ),
  resources: optional(
    looseObject({
      subscribe: optional(boolean()),
      listChanged: optional(boolean())
    })
  ),
  tools: optional(
    looseObject({
      listChanged: optional(boolean())
    })
  )
});
ResultSchema.extend({
  protocolVersion: string(),
  capabilities: ServerCapabilitiesSchema,
  serverInfo: ClientOrServerImplementationSchema,
  instructions: optional(string())
});
var PaginatedResultSchema = ResultSchema.extend({
  nextCursor: optional(string())
});
var ToolSchema = object$1({
  name: string(),
  description: optional(string()),
  inputSchema: object$1({
    type: literal("object"),
    properties: optional(object$1({}).loose())
  }).loose()
}).loose();
PaginatedResultSchema.extend({
  tools: array(ToolSchema)
});
var TextContentSchema = object$1({
  type: literal("text"),
  text: string()
}).loose();
var ImageContentSchema = object$1({
  type: literal("image"),
  data: base64(),
  mimeType: string()
}).loose();
var ResourceContentsSchema = object$1({
  /**
   * The URI of this resource.
   */
  uri: string(),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: optional(string())
}).loose();
var TextResourceContentsSchema = ResourceContentsSchema.extend({
  text: string()
});
var BlobResourceContentsSchema = ResourceContentsSchema.extend({
  blob: base64()
});
var EmbeddedResourceSchema = object$1({
  type: literal("resource"),
  resource: union([TextResourceContentsSchema, BlobResourceContentsSchema])
}).loose();
ResultSchema.extend({
  content: array(
    union([TextContentSchema, ImageContentSchema, EmbeddedResourceSchema])
  ),
  isError: boolean().default(false).optional()
}).or(
  ResultSchema.extend({
    toolResult: unknown()
  })
);

// src/tool/mcp/json-rpc-message.ts
var JSONRPC_VERSION = "2.0";
var JSONRPCRequestSchema = object$1({
  jsonrpc: literal(JSONRPC_VERSION),
  id: union([string(), number().int()])
}).merge(RequestSchema).strict();
var JSONRPCResponseSchema = object$1({
  jsonrpc: literal(JSONRPC_VERSION),
  id: union([string(), number().int()]),
  result: ResultSchema
}).strict();
var JSONRPCErrorSchema = object$1({
  jsonrpc: literal(JSONRPC_VERSION),
  id: union([string(), number().int()]),
  error: object$1({
    code: number().int(),
    message: string(),
    data: optional(unknown())
  })
}).strict();
var JSONRPCNotificationSchema = object$1({
  jsonrpc: literal(JSONRPC_VERSION)
}).merge(
  object$1({
    method: string(),
    params: optional(BaseParamsSchema)
  })
).strict();
union([
  JSONRPCRequestSchema,
  JSONRPCNotificationSchema,
  JSONRPCResponseSchema,
  JSONRPCErrorSchema
]);
function createUIMessageStream({
  execute,
  onError = getErrorMessage,
  originalMessages,
  onFinish,
  generateId: generateId3 = generateId
}) {
  let controller;
  const ongoingStreamPromises = [];
  const stream = new ReadableStream({
    start(controllerArg) {
      controller = controllerArg;
    }
  });
  function safeEnqueue(data) {
    try {
      controller.enqueue(data);
    } catch (error) {
    }
  }
  try {
    const result = execute({
      writer: {
        write(part) {
          safeEnqueue(part);
        },
        merge(streamArg) {
          ongoingStreamPromises.push(
            (async () => {
              const reader = streamArg.getReader();
              while (true) {
                const { done, value } = await reader.read();
                if (done)
                  break;
                safeEnqueue(value);
              }
            })().catch((error) => {
              safeEnqueue({
                type: "error",
                errorText: onError(error)
              });
            })
          );
        },
        onError
      }
    });
    if (result) {
      ongoingStreamPromises.push(
        result.catch((error) => {
          safeEnqueue({
            type: "error",
            errorText: onError(error)
          });
        })
      );
    }
  } catch (error) {
    safeEnqueue({
      type: "error",
      errorText: onError(error)
    });
  }
  const waitForStreams = new Promise(async (resolve2) => {
    while (ongoingStreamPromises.length > 0) {
      await ongoingStreamPromises.shift();
    }
    resolve2();
  });
  waitForStreams.finally(() => {
    try {
      controller.close();
    } catch (error) {
    }
  });
  return handleUIMessageStreamFinish({
    stream,
    messageId: generateId3(),
    originalMessages,
    onFinish,
    onError
  });
}

var DefaultGeneratedFile = class {
  base64Data;
  uint8ArrayData;
  mediaType;
  constructor({ data, mediaType }) {
    const isUint8Array = data instanceof Uint8Array;
    this.base64Data = isUint8Array ? void 0 : data;
    this.uint8ArrayData = isUint8Array ? data : void 0;
    this.mediaType = mediaType;
  }
  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get base64() {
    if (this.base64Data == null) {
      this.base64Data = convertUint8ArrayToBase64(this.uint8ArrayData);
    }
    return this.base64Data;
  }
  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get uint8Array() {
    if (this.uint8ArrayData == null) {
      this.uint8ArrayData = convertBase64ToUint8Array(this.base64Data);
    }
    return this.uint8ArrayData;
  }
};
var DefaultGeneratedFileWithType = class extends DefaultGeneratedFile {
  type = "file";
  constructor(options) {
    super(options);
  }
};

// src/stream/aisdk/v5/compat/content.ts
function splitDataUrl(dataUrl) {
  try {
    const [header, base64Content] = dataUrl.split(",");
    return {
      mediaType: header?.split(";")[0]?.split(":")[1],
      base64Content
    };
  } catch {
    return {
      mediaType: void 0,
      base64Content: void 0
    };
  }
}
function convertToDataContent(content) {
  if (content instanceof Uint8Array) {
    return { data: content, mediaType: void 0 };
  }
  if (content instanceof ArrayBuffer) {
    return { data: new Uint8Array(content), mediaType: void 0 };
  }
  if (typeof content === "string") {
    try {
      content = new URL(content);
    } catch {
    }
  }
  if (content instanceof URL && content.protocol === "data:") {
    const { mediaType: dataUrlMediaType, base64Content } = splitDataUrl(content.toString());
    if (dataUrlMediaType == null || base64Content == null) {
      throw new MastraError({
        id: "INVALID_DATA_URL_FORMAT",
        text: `Invalid data URL format in content ${content.toString()}`,
        domain: "LLM" /* LLM */,
        category: "USER" /* USER */
      });
    }
    return { data: base64Content, mediaType: dataUrlMediaType };
  }
  return { data: content, mediaType: void 0 };
}
var imageMediaTypeSignatures = [
  {
    mediaType: "image/gif",
    bytesPrefix: [71, 73, 70],
    base64Prefix: "R0lG"
  },
  {
    mediaType: "image/png",
    bytesPrefix: [137, 80, 78, 71],
    base64Prefix: "iVBORw"
  },
  {
    mediaType: "image/jpeg",
    bytesPrefix: [255, 216],
    base64Prefix: "/9j/"
  },
  {
    mediaType: "image/webp",
    bytesPrefix: [82, 73, 70, 70],
    base64Prefix: "UklGRg"
  },
  {
    mediaType: "image/bmp",
    bytesPrefix: [66, 77],
    base64Prefix: "Qk"
  },
  {
    mediaType: "image/tiff",
    bytesPrefix: [73, 73, 42, 0],
    base64Prefix: "SUkqAA"
  },
  {
    mediaType: "image/tiff",
    bytesPrefix: [77, 77, 0, 42],
    base64Prefix: "TU0AKg"
  },
  {
    mediaType: "image/avif",
    bytesPrefix: [0, 0, 0, 32, 102, 116, 121, 112, 97, 118, 105, 102],
    base64Prefix: "AAAAIGZ0eXBhdmlm"
  },
  {
    mediaType: "image/heic",
    bytesPrefix: [0, 0, 0, 32, 102, 116, 121, 112, 104, 101, 105, 99],
    base64Prefix: "AAAAIGZ0eXBoZWlj"
  }
];
var stripID3 = (data) => {
  const bytes = typeof data === "string" ? convertBase64ToUint8Array(data) : data;
  const id3Size = (
    // @ts-ignore
    (bytes[6] & 127) << 21 | // @ts-ignore
    (bytes[7] & 127) << 14 | // @ts-ignore
    (bytes[8] & 127) << 7 | // @ts-ignore
    bytes[9] & 127
  );
  return bytes.slice(id3Size + 10);
};
function stripID3TagsIfPresent(data) {
  const hasId3 = typeof data === "string" && data.startsWith("SUQz") || typeof data !== "string" && data.length > 10 && data[0] === 73 && // 'I'
  data[1] === 68 && // 'D'
  data[2] === 51;
  return hasId3 ? stripID3(data) : data;
}
function detectMediaType({
  data,
  signatures
}) {
  const processedData = stripID3TagsIfPresent(data);
  for (const signature of signatures) {
    if (typeof processedData === "string" ? processedData.startsWith(signature.base64Prefix) : processedData.length >= signature.bytesPrefix.length && signature.bytesPrefix.every((byte, index) => processedData[index] === byte)) {
      return signature.mediaType;
    }
  }
  return void 0;
}

// src/agent/message-list/prompt/convert-file.ts
function convertImageFilePart(part, downloadedAssets) {
  let originalData;
  const type = part.type;
  switch (type) {
    case "image":
      originalData = part.image;
      break;
    case "file":
      originalData = part.data;
      break;
    default:
      throw new Error(`Unsupported part type: ${type}`);
  }
  const { data: convertedData, mediaType: convertedMediaType } = convertToDataContent(originalData);
  let mediaType = convertedMediaType ?? part.mediaType;
  let data = convertedData;
  if (data instanceof URL) {
    const downloadedFile = downloadedAssets[data.toString()];
    if (downloadedFile) {
      data = downloadedFile.data;
      mediaType ??= downloadedFile.mediaType;
    }
  }
  switch (type) {
    case "image": {
      if (data instanceof Uint8Array || typeof data === "string") {
        mediaType = detectMediaType({ data, signatures: imageMediaTypeSignatures }) ?? mediaType;
      }
      return {
        type: "file",
        mediaType: mediaType ?? "image/*",
        // any image
        filename: void 0,
        data,
        providerOptions: part.providerOptions
      };
    }
    case "file": {
      if (mediaType == null) {
        throw new Error(`Media type is missing for file part`);
      }
      return {
        type: "file",
        mediaType,
        filename: part.filename,
        data,
        providerOptions: part.providerOptions
      };
    }
  }
}

// src/agent/message-list/prompt/attachments-to-parts.ts
function attachmentsToParts(attachments) {
  const parts = [];
  for (const attachment of attachments) {
    let url;
    try {
      url = new URL(attachment.url);
    } catch {
      throw new Error(`Invalid URL: ${attachment.url}`);
    }
    switch (url.protocol) {
      case "http:":
      case "https:": {
        if (attachment.contentType?.startsWith("image/")) {
          parts.push({ type: "image", image: url.toString(), mimeType: attachment.contentType });
        } else {
          if (!attachment.contentType) {
            throw new Error("If the attachment is not an image, it must specify a content type");
          }
          parts.push({
            type: "file",
            data: url.toString(),
            mimeType: attachment.contentType
          });
        }
        break;
      }
      case "data:": {
        if (attachment.contentType?.startsWith("image/")) {
          parts.push({
            type: "image",
            image: attachment.url,
            mimeType: attachment.contentType
          });
        } else if (attachment.contentType?.startsWith("text/")) {
          parts.push({
            type: "file",
            data: attachment.url,
            mimeType: attachment.contentType
          });
        } else {
          if (!attachment.contentType) {
            throw new Error("If the attachment is not an image or text, it must specify a content type");
          }
          parts.push({
            type: "file",
            data: attachment.url,
            mimeType: attachment.contentType
          });
        }
        break;
      }
      default: {
        throw new Error(`Unsupported URL protocol: ${url.protocol}`);
      }
    }
  }
  return parts;
}

// src/agent/message-list/prompt/convert-to-mastra-v1.ts
var makePushOrCombine = (v1Messages) => {
  const idUsageCount = /* @__PURE__ */ new Map();
  const SPLIT_SUFFIX_PATTERN = /__split-\d+$/;
  return (msg) => {
    const previousMessage = v1Messages.at(-1);
    if (msg.role === previousMessage?.role && Array.isArray(previousMessage.content) && Array.isArray(msg.content) && // we were creating new messages for tool calls before and not appending to the assistant message
    // so don't append here so everything works as before
    (msg.role !== `assistant` || msg.role === `assistant` && msg.content.at(-1)?.type !== `tool-call`)) {
      for (const part of msg.content) {
        previousMessage.content.push(part);
      }
    } else {
      let baseId = msg.id;
      const hasSplitSuffix = SPLIT_SUFFIX_PATTERN.test(baseId);
      if (hasSplitSuffix) {
        v1Messages.push(msg);
        return;
      }
      const currentCount = idUsageCount.get(baseId) || 0;
      if (currentCount > 0) {
        msg.id = `${baseId}__split-${currentCount}`;
      }
      idUsageCount.set(baseId, currentCount + 1);
      v1Messages.push(msg);
    }
  };
};
function convertToV1Messages(messages) {
  const v1Messages = [];
  const pushOrCombine = makePushOrCombine(v1Messages);
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const isLastMessage = i === messages.length - 1;
    if (!message?.content) continue;
    const { content, experimental_attachments: inputAttachments = [], parts: inputParts } = message.content;
    const { role } = message;
    const fields = {
      id: message.id,
      createdAt: message.createdAt,
      resourceId: message.resourceId,
      threadId: message.threadId
    };
    const experimental_attachments = [...inputAttachments];
    const parts = [];
    for (const part of inputParts) {
      if (part.type === "file") {
        experimental_attachments.push({
          url: part.data,
          contentType: part.mimeType
        });
      } else {
        parts.push(part);
      }
    }
    switch (role) {
      case "user": {
        if (parts == null) {
          const userContent = experimental_attachments ? [{ type: "text", text: content || "" }, ...attachmentsToParts(experimental_attachments)] : { type: "text", text: content || "" };
          pushOrCombine({
            role: "user",
            ...fields,
            type: "text",
            // @ts-ignore
            content: userContent
          });
        } else {
          const textParts = message.content.parts.filter((part) => part.type === "text").map((part) => ({
            type: "text",
            text: part.text
          }));
          const userContent = experimental_attachments ? [...textParts, ...attachmentsToParts(experimental_attachments)] : textParts;
          pushOrCombine({
            role: "user",
            ...fields,
            type: "text",
            content: Array.isArray(userContent) && userContent.length === 1 && userContent[0]?.type === `text` && typeof content !== `undefined` ? content : userContent
          });
        }
        break;
      }
      case "assistant": {
        if (message.content.parts != null) {
          let processBlock2 = function() {
            const content2 = [];
            for (const part of block) {
              switch (part.type) {
                case "file":
                case "text": {
                  content2.push(part);
                  break;
                }
                case "reasoning": {
                  for (const detail of part.details) {
                    switch (detail.type) {
                      case "text":
                        content2.push({
                          type: "reasoning",
                          text: detail.text,
                          signature: detail.signature
                        });
                        break;
                      case "redacted":
                        content2.push({
                          type: "redacted-reasoning",
                          data: detail.data
                        });
                        break;
                    }
                  }
                  break;
                }
                case "tool-invocation":
                  if (part.toolInvocation.toolName !== "updateWorkingMemory") {
                    content2.push({
                      type: "tool-call",
                      toolCallId: part.toolInvocation.toolCallId,
                      toolName: part.toolInvocation.toolName,
                      args: part.toolInvocation.args
                    });
                  }
                  break;
              }
            }
            pushOrCombine({
              role: "assistant",
              ...fields,
              type: content2.some((c) => c.type === `tool-call`) ? "tool-call" : "text",
              content: typeof content2 !== `string` && Array.isArray(content2) && content2.length === 1 && content2[0]?.type === `text` ? content2[0].text : content2
            });
            const stepInvocations = block.filter((part) => `type` in part && part.type === "tool-invocation").map((part) => part.toolInvocation).filter((ti) => ti.toolName !== "updateWorkingMemory");
            const invocationsWithResults = stepInvocations.filter((ti) => ti.state === "result" && "result" in ti);
            if (invocationsWithResults.length > 0) {
              pushOrCombine({
                role: "tool",
                ...fields,
                type: "tool-result",
                content: invocationsWithResults.map((toolInvocation) => {
                  const { toolCallId, toolName, result } = toolInvocation;
                  return {
                    type: "tool-result",
                    toolCallId,
                    toolName,
                    result
                  };
                })
              });
            }
            block = [];
            blockHasToolInvocations = false;
            currentStep++;
          };
          let currentStep = 0;
          let blockHasToolInvocations = false;
          let block = [];
          for (const part of message.content.parts) {
            switch (part.type) {
              case "text": {
                if (blockHasToolInvocations) {
                  processBlock2();
                }
                block.push(part);
                break;
              }
              case "file":
              case "reasoning": {
                block.push(part);
                break;
              }
              case "tool-invocation": {
                const hasNonToolContent = block.some(
                  (p) => p.type === "text" || p.type === "file" || p.type === "reasoning"
                );
                if (hasNonToolContent || (part.toolInvocation.step ?? 0) !== currentStep) {
                  processBlock2();
                }
                block.push(part);
                blockHasToolInvocations = true;
                break;
              }
            }
          }
          processBlock2();
          const toolInvocations2 = message.content.toolInvocations;
          if (toolInvocations2 && toolInvocations2.length > 0) {
            const processedToolCallIds = /* @__PURE__ */ new Set();
            for (const part of message.content.parts) {
              if (part.type === "tool-invocation" && part.toolInvocation.toolCallId) {
                processedToolCallIds.add(part.toolInvocation.toolCallId);
              }
            }
            const unprocessedToolInvocations = toolInvocations2.filter(
              (ti) => !processedToolCallIds.has(ti.toolCallId) && ti.toolName !== "updateWorkingMemory"
            );
            if (unprocessedToolInvocations.length > 0) {
              const invocationsByStep = /* @__PURE__ */ new Map();
              for (const inv of unprocessedToolInvocations) {
                const step = inv.step ?? 0;
                if (!invocationsByStep.has(step)) {
                  invocationsByStep.set(step, []);
                }
                invocationsByStep.get(step).push(inv);
              }
              const sortedSteps = Array.from(invocationsByStep.keys()).sort((a, b) => a - b);
              for (const step of sortedSteps) {
                const stepInvocations = invocationsByStep.get(step);
                pushOrCombine({
                  role: "assistant",
                  ...fields,
                  type: "tool-call",
                  content: [
                    ...stepInvocations.map(({ toolCallId, toolName, args }) => ({
                      type: "tool-call",
                      toolCallId,
                      toolName,
                      args
                    }))
                  ]
                });
                const invocationsWithResults = stepInvocations.filter((ti) => ti.state === "result" && "result" in ti);
                if (invocationsWithResults.length > 0) {
                  pushOrCombine({
                    role: "tool",
                    ...fields,
                    type: "tool-result",
                    content: invocationsWithResults.map((toolInvocation) => {
                      const { toolCallId, toolName, result } = toolInvocation;
                      return {
                        type: "tool-result",
                        toolCallId,
                        toolName,
                        result
                      };
                    })
                  });
                }
              }
            }
          }
          break;
        }
        const toolInvocations = message.content.toolInvocations;
        if (toolInvocations == null || toolInvocations.length === 0) {
          pushOrCombine({ role: "assistant", ...fields, content: content || "", type: "text" });
          break;
        }
        const maxStep = toolInvocations.reduce((max, toolInvocation) => {
          return Math.max(max, toolInvocation.step ?? 0);
        }, 0);
        for (let i2 = 0; i2 <= maxStep; i2++) {
          const stepInvocations = toolInvocations.filter(
            (toolInvocation) => (toolInvocation.step ?? 0) === i2 && toolInvocation.toolName !== "updateWorkingMemory"
          );
          if (stepInvocations.length === 0) {
            continue;
          }
          pushOrCombine({
            role: "assistant",
            ...fields,
            type: "tool-call",
            content: [
              ...isLastMessage && content && i2 === 0 ? [{ type: "text", text: content }] : [],
              ...stepInvocations.map(({ toolCallId, toolName, args }) => ({
                type: "tool-call",
                toolCallId,
                toolName,
                args
              }))
            ]
          });
          const invocationsWithResults = stepInvocations.filter((ti) => ti.state === "result" && "result" in ti);
          if (invocationsWithResults.length > 0) {
            pushOrCombine({
              role: "tool",
              ...fields,
              type: "tool-result",
              content: invocationsWithResults.map((toolInvocation) => {
                const { toolCallId, toolName, result } = toolInvocation;
                return {
                  type: "tool-result",
                  toolCallId,
                  toolName,
                  result
                };
              })
            });
          }
        }
        if (content && !isLastMessage) {
          pushOrCombine({ role: "assistant", ...fields, type: "text", content: content || "" });
        }
        break;
      }
    }
  }
  return v1Messages;
}
unionType([
  stringType(),
  instanceOfType(Uint8Array),
  instanceOfType(ArrayBuffer),
  custom$1(
    // Buffer might not be available in some environments such as CloudFlare:
    (value) => globalThis.Buffer?.isBuffer(value) ?? false,
    { message: "Must be a Buffer" }
  )
]);
function convertDataContentToBase64String(content) {
  if (typeof content === "string") {
    return content;
  }
  if (content instanceof ArrayBuffer) {
    return convertUint8ArrayToBase64$1(new Uint8Array(content));
  }
  return convertUint8ArrayToBase64$1(content);
}
var downloadFromUrl = async ({ url, downloadRetries }) => {
  const urlText = url.toString();
  try {
    const response = await fetchWithRetry(
      urlText,
      {
        method: "GET"
      },
      downloadRetries
    );
    if (!response.ok) {
      throw new MastraError({
        id: "DOWNLOAD_ASSETS_FAILED",
        text: "Failed to download asset",
        domain: "LLM" /* LLM */,
        category: "USER" /* USER */
      });
    }
    return {
      data: new Uint8Array(await response.arrayBuffer()),
      mediaType: response.headers.get("content-type") ?? void 0
    };
  } catch (error) {
    throw new MastraError(
      {
        id: "DOWNLOAD_ASSETS_FAILED",
        text: "Failed to download asset",
        domain: "LLM" /* LLM */,
        category: "USER" /* USER */
      },
      error
    );
  }
};
async function downloadAssetsFromMessages({
  messages,
  downloadConcurrency = 10,
  downloadRetries = 3,
  supportedUrls
}) {
  const pMap = (await import('./index.mjs')).default;
  const filesToDownload = messages.filter((message) => message.role === "user").map((message) => message.content).filter((content) => Array.isArray(content)).flat().filter((part) => part.type === "image" || part.type === "file").map((part) => {
    const mediaType = part.mediaType ?? (part.type === "image" ? "image/*" : void 0);
    let data = part.type === "image" ? part.image : part.data;
    if (typeof data === "string") {
      try {
        data = new URL(data);
      } catch {
      }
    }
    return { mediaType, data };
  }).filter((part) => part.data instanceof URL).map((part) => ({
    url: part.data,
    isUrlSupportedByModel: part.mediaType != null && isUrlSupported({
      url: part.data.toString(),
      mediaType: part.mediaType,
      supportedUrls: supportedUrls ?? {}
    })
  }));
  const downloadedFiles = await pMap(
    filesToDownload,
    async (fileItem) => {
      return downloadFromUrl({ url: fileItem.url, downloadRetries });
    },
    {
      concurrency: downloadConcurrency
    }
  );
  const downloadFileList = downloadedFiles.filter(
    (downloadedFile) => downloadedFile?.data != null
  ).map(({ data, mediaType }, index) => [filesToDownload?.[index]?.url.toString(), { data, mediaType }]);
  return Object.fromEntries(downloadFileList);
}

// src/agent/message-list/prompt/image-utils.ts
function parseDataUri(dataUri) {
  if (!dataUri.startsWith("data:")) {
    return {
      isDataUri: false,
      base64Content: dataUri
    };
  }
  const base64Index = dataUri.indexOf(",");
  if (base64Index === -1) {
    return {
      isDataUri: true,
      base64Content: dataUri
    };
  }
  const header = dataUri.substring(5, base64Index);
  const base64Content = dataUri.substring(base64Index + 1);
  const semicolonIndex = header.indexOf(";");
  const mimeType = semicolonIndex !== -1 ? header.substring(0, semicolonIndex) : header;
  return {
    isDataUri: true,
    mimeType: mimeType || void 0,
    base64Content
  };
}
function createDataUri(base64Content, mimeType = "application/octet-stream") {
  if (base64Content.startsWith("data:")) {
    return base64Content;
  }
  return `data:${mimeType};base64,${base64Content}`;
}
function imageContentToString(image, fallbackMimeType) {
  if (typeof image === "string") {
    return image;
  }
  if (image instanceof URL) {
    return image.toString();
  }
  if (image instanceof Uint8Array || image instanceof ArrayBuffer || globalThis.Buffer && Buffer.isBuffer(image)) {
    const base64 = convertDataContentToBase64String(image);
    if (fallbackMimeType && !base64.startsWith("data:")) {
      return `data:${fallbackMimeType};base64,${base64}`;
    }
    return base64;
  }
  return String(image);
}
function imageContentToDataUri(image, mimeType = "image/png") {
  const imageStr = imageContentToString(image, mimeType);
  if (imageStr.startsWith("data:")) {
    return imageStr;
  }
  if (imageStr.startsWith("http://") || imageStr.startsWith("https://")) {
    return imageStr;
  }
  return `data:${mimeType};base64,${imageStr}`;
}
function getImageCacheKey(image) {
  if (image instanceof URL) {
    return image.toString();
  }
  if (typeof image === "string") {
    return image.length;
  }
  if (image instanceof Uint8Array) {
    return image.byteLength;
  }
  if (image instanceof ArrayBuffer) {
    return image.byteLength;
  }
  return image;
}
function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    if (str.startsWith("//")) {
      try {
        new URL(`https:${str}`);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}
function categorizeFileData(data, fallbackMimeType) {
  const parsed = parseDataUri(data);
  const mimeType = parsed.isDataUri && parsed.mimeType ? parsed.mimeType : fallbackMimeType;
  if (parsed.isDataUri) {
    return {
      type: "dataUri",
      mimeType,
      data
    };
  }
  if (isValidUrl(data)) {
    return {
      type: "url",
      mimeType,
      data
    };
  }
  return {
    type: "raw",
    mimeType,
    data
  };
}

// src/agent/message-list/utils/ai-v5/gemini-compatibility.ts
function ensureGeminiCompatibleMessages(messages) {
  const result = [...messages];
  const firstNonSystemIndex = result.findIndex((m) => m.role !== "system");
  if (firstNonSystemIndex === -1) {
    throw new MastraError({
      id: "NO_USER_OR_ASSISTANT_MESSAGES",
      domain: "AGENT" /* AGENT */,
      category: "USER" /* USER */,
      text: "This request does not contain any user or assistant messages. At least one user or assistant message is required to generate a response."
    });
  } else if (result[firstNonSystemIndex]?.role === "assistant") {
    result.splice(firstNonSystemIndex, 0, {
      role: "user",
      content: "."
    });
  }
  return result;
}

// src/agent/message-list/utils/ai-v5/tool.ts
function getToolName(type) {
  if (typeof type === "object" && type && "type" in type) {
    type = type.type;
  }
  if (typeof type !== "string") {
    return "unknown";
  }
  if (type === "dynamic-tool") {
    return "dynamic-tool";
  }
  if (type.startsWith("tool-")) {
    return type.slice("tool-".length);
  }
  return type;
}

// src/agent/message-list/index.ts
var MessageList = class _MessageList {
  messages = [];
  // passed in by dev in input or context
  systemMessages = [];
  // passed in by us for a specific purpose, eg memory system message
  taggedSystemMessages = {};
  memoryInfo = null;
  // used to filter this.messages by how it was added: input/response/memory
  memoryMessages = /* @__PURE__ */ new Set();
  newUserMessages = /* @__PURE__ */ new Set();
  newResponseMessages = /* @__PURE__ */ new Set();
  userContextMessages = /* @__PURE__ */ new Set();
  memoryMessagesPersisted = /* @__PURE__ */ new Set();
  newUserMessagesPersisted = /* @__PURE__ */ new Set();
  newResponseMessagesPersisted = /* @__PURE__ */ new Set();
  userContextMessagesPersisted = /* @__PURE__ */ new Set();
  generateMessageId;
  _agentNetworkAppend = false;
  constructor({
    threadId,
    resourceId,
    generateMessageId,
    // @ts-ignore Flag for agent network messages
    _agentNetworkAppend
  } = {}) {
    if (threadId) {
      this.memoryInfo = { threadId, resourceId };
    }
    this.generateMessageId = generateMessageId;
    this._agentNetworkAppend = _agentNetworkAppend || false;
  }
  add(messages, messageSource) {
    if (messageSource === `user`) messageSource = `input`;
    if (!messages) return this;
    for (const message of Array.isArray(messages) ? messages : [messages]) {
      this.addOne(
        typeof message === `string` ? {
          role: "user",
          content: message
        } : message,
        messageSource
      );
    }
    return this;
  }
  serializeSet(set) {
    return Array.from(set).map((value) => value.id);
  }
  deserializeSet(ids) {
    return new Set(ids.map((id) => this.messages.find((m) => m.id === id)).filter(Boolean));
  }
  serializeMessage(message) {
    return {
      ...message,
      createdAt: message.createdAt.toUTCString()
    };
  }
  deserializeMessage(state) {
    return {
      ...state,
      createdAt: new Date(state.createdAt)
    };
  }
  serialize() {
    return {
      messages: this.messages.map(this.serializeMessage),
      systemMessages: this.systemMessages,
      taggedSystemMessages: this.taggedSystemMessages,
      memoryInfo: this.memoryInfo,
      _agentNetworkAppend: this._agentNetworkAppend,
      memoryMessages: this.serializeSet(this.memoryMessages),
      newUserMessages: this.serializeSet(this.newUserMessages),
      newResponseMessages: this.serializeSet(this.newResponseMessages),
      userContextMessages: this.serializeSet(this.userContextMessages),
      memoryMessagesPersisted: this.serializeSet(this.memoryMessagesPersisted),
      newUserMessagesPersisted: this.serializeSet(this.newUserMessagesPersisted),
      newResponseMessagesPersisted: this.serializeSet(this.newResponseMessagesPersisted),
      userContextMessagesPersisted: this.serializeSet(this.userContextMessagesPersisted)
    };
  }
  deserialize(state) {
    this.messages = state.messages.map(this.deserializeMessage);
    this.systemMessages = state.systemMessages;
    this.taggedSystemMessages = state.taggedSystemMessages;
    this.memoryInfo = state.memoryInfo;
    this._agentNetworkAppend = state._agentNetworkAppend;
    this.memoryMessages = this.deserializeSet(state.memoryMessages);
    this.newUserMessages = this.deserializeSet(state.newUserMessages);
    this.newResponseMessages = this.deserializeSet(state.newResponseMessages);
    this.userContextMessages = this.deserializeSet(state.userContextMessages);
    this.memoryMessagesPersisted = this.deserializeSet(state.memoryMessagesPersisted);
    this.newUserMessagesPersisted = this.deserializeSet(state.newUserMessagesPersisted);
    this.newResponseMessagesPersisted = this.deserializeSet(state.newResponseMessagesPersisted);
    this.userContextMessagesPersisted = this.deserializeSet(state.userContextMessagesPersisted);
    return this;
  }
  getLatestUserContent() {
    const currentUserMessages = this.all.core().filter((m) => m.role === "user");
    const content = currentUserMessages.at(-1)?.content;
    if (!content) return null;
    return _MessageList.coreContentToString(content);
  }
  get get() {
    return {
      all: this.all,
      remembered: this.remembered,
      input: this.input,
      response: this.response
    };
  }
  get getPersisted() {
    return {
      remembered: this.rememberedPersisted,
      input: this.inputPersisted,
      taggedSystemMessages: this.taggedSystemMessages,
      response: this.responsePersisted
    };
  }
  get clear() {
    return {
      input: {
        v2: () => {
          const userMessages = Array.from(this.newUserMessages);
          this.messages = this.messages.filter((m) => !this.newUserMessages.has(m));
          this.newUserMessages.clear();
          return userMessages;
        }
      },
      response: {
        v2: () => {
          const responseMessages = Array.from(this.newResponseMessages);
          this.messages = this.messages.filter((m) => !this.newResponseMessages.has(m));
          this.newResponseMessages.clear();
          return responseMessages;
        }
      }
    };
  }
  all = {
    v3: () => this.cleanV3Metadata(this.messages.map(this.mastraMessageV2ToMastraMessageV3)),
    v2: () => this.messages,
    v1: () => convertToV1Messages(this.all.v2()),
    aiV5: {
      model: () => this.aiV5UIMessagesToAIV5ModelMessages(this.all.aiV5.ui()),
      ui: () => this.all.v3().map(_MessageList.mastraMessageV3ToAIV5UIMessage),
      // Used when calling AI SDK streamText/generateText
      prompt: () => {
        const systemMessages = this.aiV4CoreMessagesToAIV5ModelMessages(
          [...this.systemMessages, ...Object.values(this.taggedSystemMessages).flat()],
          `system`
        );
        const modelMessages = this.all.aiV5.model();
        const messages = [...systemMessages, ...modelMessages];
        return ensureGeminiCompatibleMessages(messages);
      },
      // Used for creating LLM prompt messages without AI SDK streamText/generateText
      llmPrompt: async (options = {
        downloadConcurrency: 10,
        downloadRetries: 3
      }) => {
        const modelMessages = this.all.aiV5.model();
        const systemMessages = this.aiV4CoreMessagesToAIV5ModelMessages(
          [...this.systemMessages, ...Object.values(this.taggedSystemMessages).flat()],
          `system`
        );
        const downloadedAssets = await downloadAssetsFromMessages({
          messages: modelMessages,
          downloadConcurrency: options?.downloadConcurrency,
          downloadRetries: options?.downloadRetries,
          supportedUrls: options?.supportedUrls
        });
        let messages = [...systemMessages, ...modelMessages];
        if (Object.keys(downloadedAssets || {}).length > 0) {
          messages = messages.map((message) => {
            if (message.role === "user") {
              if (typeof message.content === "string") {
                return {
                  role: "user",
                  content: [{ type: "text", text: message.content }],
                  providerOptions: message.providerOptions
                };
              }
              const convertedContent = message.content.map((part) => {
                if (part.type === "image" || part.type === "file") {
                  return convertImageFilePart(part, downloadedAssets);
                }
                return part;
              }).filter((part) => part.type !== "text" || part.text !== "");
              return {
                role: "user",
                content: convertedContent,
                providerOptions: message.providerOptions
              };
            }
            return message;
          });
        }
        messages = ensureGeminiCompatibleMessages(messages);
        return messages.map(_MessageList.aiV5ModelMessageToV2PromptMessage);
      }
    },
    /* @deprecated use list.get.all.aiV4.prompt() instead */
    prompt: () => this.all.aiV4.prompt(),
    /* @deprecated use list.get.all.aiV4.ui() */
    ui: () => this.all.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage),
    /* @deprecated use list.get.all.aiV4.core() */
    core: () => this.aiV4UIMessagesToAIV4CoreMessages(this.all.aiV4.ui()),
    aiV4: {
      ui: () => this.all.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage),
      core: () => this.aiV4UIMessagesToAIV4CoreMessages(this.all.aiV4.ui()),
      // Used when calling AI SDK streamText/generateText
      prompt: () => {
        const coreMessages = this.all.aiV4.core();
        const messages = [...this.systemMessages, ...Object.values(this.taggedSystemMessages).flat(), ...coreMessages];
        return ensureGeminiCompatibleMessages(messages);
      },
      // Used for creating LLM prompt messages without AI SDK streamText/generateText
      llmPrompt: () => {
        const coreMessages = this.all.aiV4.core();
        const systemMessages = [...this.systemMessages, ...Object.values(this.taggedSystemMessages).flat()];
        let messages = [...systemMessages, ...coreMessages];
        messages = ensureGeminiCompatibleMessages(messages);
        return messages.map(_MessageList.aiV4CoreMessageToV1PromptMessage);
      }
    }
  };
  remembered = {
    v3: () => this.remembered.v2().map(this.mastraMessageV2ToMastraMessageV3),
    v2: () => this.messages.filter((m) => this.memoryMessages.has(m)),
    v1: () => convertToV1Messages(this.remembered.v2()),
    aiV5: {
      model: () => this.aiV5UIMessagesToAIV5ModelMessages(this.remembered.aiV5.ui()),
      ui: () => this.remembered.v3().map(_MessageList.mastraMessageV3ToAIV5UIMessage)
    },
    /* @deprecated use list.get.remembered.aiV4.ui() */
    ui: () => this.remembered.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage),
    /* @deprecated use list.get.remembered.aiV4.core() */
    core: () => this.aiV4UIMessagesToAIV4CoreMessages(this.all.aiV4.ui()),
    aiV4: {
      ui: () => this.remembered.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage),
      core: () => this.aiV4UIMessagesToAIV4CoreMessages(this.all.aiV4.ui())
    }
  };
  // TODO: need to update this for new .aiV4/5.x() pattern
  rememberedPersisted = {
    v2: () => this.all.v2().filter((m) => this.memoryMessagesPersisted.has(m)),
    v1: () => convertToV1Messages(this.rememberedPersisted.v2()),
    ui: () => this.rememberedPersisted.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage),
    core: () => this.aiV4UIMessagesToAIV4CoreMessages(this.rememberedPersisted.ui())
  };
  input = {
    v3: () => this.cleanV3Metadata(
      this.messages.filter((m) => this.newUserMessages.has(m)).map(this.mastraMessageV2ToMastraMessageV3)
    ),
    v2: () => this.messages.filter((m) => this.newUserMessages.has(m)),
    v1: () => convertToV1Messages(this.input.v2()),
    aiV5: {
      model: () => this.aiV5UIMessagesToAIV5ModelMessages(this.input.aiV5.ui()),
      ui: () => this.input.v3().map(_MessageList.mastraMessageV3ToAIV5UIMessage)
    },
    /* @deprecated use list.get.input.aiV4.ui() instead */
    ui: () => this.input.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage),
    /* @deprecated use list.get.core.aiV4.ui() instead */
    core: () => this.aiV4UIMessagesToAIV4CoreMessages(this.input.ui()),
    aiV4: {
      ui: () => this.input.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage),
      core: () => this.aiV4UIMessagesToAIV4CoreMessages(this.input.aiV4.ui())
    }
  };
  // TODO: need to update this for new .aiV4/5.x() pattern
  inputPersisted = {
    v3: () => this.cleanV3Metadata(
      this.messages.filter((m) => this.newUserMessagesPersisted.has(m)).map(this.mastraMessageV2ToMastraMessageV3)
    ),
    v2: () => this.messages.filter((m) => this.newUserMessagesPersisted.has(m)),
    v1: () => convertToV1Messages(this.inputPersisted.v2()),
    ui: () => this.inputPersisted.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage),
    core: () => this.aiV4UIMessagesToAIV4CoreMessages(this.inputPersisted.ui())
  };
  response = {
    v3: () => this.response.v2().map(this.mastraMessageV2ToMastraMessageV3),
    v2: () => this.messages.filter((m) => this.newResponseMessages.has(m)),
    v1: () => convertToV1Messages(this.response.v3().map(_MessageList.mastraMessageV3ToV2)),
    aiV5: {
      ui: () => this.response.v3().map(_MessageList.mastraMessageV3ToAIV5UIMessage),
      model: () => this.aiV5UIMessagesToAIV5ModelMessages(this.response.aiV5.ui()).filter(
        (m) => m.role === `tool` || m.role === `assistant`
      ),
      modelContent: (stepNumber) => {
        if (typeof stepNumber === "number") {
          const uiMessages = this.response.aiV5.ui();
          const uiMessagesParts = uiMessages.flatMap((item) => item.parts);
          const stepBoundaries = [];
          uiMessagesParts.forEach((part, index) => {
            if (part.type === "step-start") {
              stepBoundaries.push(index);
            }
          });
          if (stepNumber === -1) {
            const toolParts = uiMessagesParts.filter((p) => p.type?.startsWith("tool-"));
            const hasStepStart = stepBoundaries.length > 0;
            if (!hasStepStart && toolParts.length > 0) {
              const lastToolPart = toolParts[toolParts.length - 1];
              if (!lastToolPart) {
                return [];
              }
              const lastToolIndex = uiMessagesParts.indexOf(lastToolPart);
              const previousToolPart = toolParts[toolParts.length - 2];
              const previousToolIndex = previousToolPart ? uiMessagesParts.indexOf(previousToolPart) : -1;
              const startIndex2 = previousToolIndex + 1;
              const stepParts3 = uiMessagesParts.slice(startIndex2, lastToolIndex + 1);
              const stepUiMessages3 = [
                {
                  id: "last-step",
                  role: "assistant",
                  parts: stepParts3
                }
              ];
              const modelMessages3 = convertToModelMessages(this.sanitizeV5UIMessages(stepUiMessages3));
              return modelMessages3.flatMap(this.response.aiV5.stepContent);
            }
            const totalSteps = stepBoundaries.length + 1;
            if (totalSteps === 1 && !hasStepStart) {
              const stepUiMessages3 = [
                {
                  id: "last-step",
                  role: "assistant",
                  parts: uiMessagesParts
                }
              ];
              const modelMessages3 = convertToModelMessages(this.sanitizeV5UIMessages(stepUiMessages3));
              return modelMessages3.flatMap(this.response.aiV5.stepContent);
            }
            const lastStepStart = stepBoundaries[stepBoundaries.length - 1];
            if (lastStepStart === void 0) {
              return [];
            }
            const stepParts2 = uiMessagesParts.slice(lastStepStart + 1);
            if (stepParts2.length === 0) {
              return [];
            }
            const stepUiMessages2 = [
              {
                id: "last-step",
                role: "assistant",
                parts: stepParts2
              }
            ];
            const modelMessages2 = convertToModelMessages(this.sanitizeV5UIMessages(stepUiMessages2));
            return modelMessages2.flatMap(this.response.aiV5.stepContent);
          }
          if (stepNumber === 1) {
            const firstStepStart = stepBoundaries[0] ?? uiMessagesParts.length;
            if (firstStepStart === 0) {
              return [];
            }
            const stepParts2 = uiMessagesParts.slice(0, firstStepStart);
            const stepUiMessages2 = [
              {
                id: "step-1",
                role: "assistant",
                parts: stepParts2
              }
            ];
            const modelMessages2 = convertToModelMessages(this.sanitizeV5UIMessages(stepUiMessages2));
            return modelMessages2.flatMap(this.response.aiV5.stepContent);
          }
          const stepIndex = stepNumber - 2;
          if (stepIndex < 0 || stepIndex >= stepBoundaries.length) {
            return [];
          }
          const startIndex = (stepBoundaries[stepIndex] ?? 0) + 1;
          const endIndex = stepBoundaries[stepIndex + 1] ?? uiMessagesParts.length;
          if (startIndex >= endIndex) {
            return [];
          }
          const stepParts = uiMessagesParts.slice(startIndex, endIndex);
          const stepUiMessages = [
            {
              id: `step-${stepNumber}`,
              role: "assistant",
              parts: stepParts
            }
          ];
          const modelMessages = convertToModelMessages(this.sanitizeV5UIMessages(stepUiMessages));
          return modelMessages.flatMap(this.response.aiV5.stepContent);
        }
        return this.response.aiV5.model().map(this.response.aiV5.stepContent).flat();
      },
      stepContent: (message) => {
        const latest = message ? message : this.response.aiV5.model().at(-1);
        if (!latest) return [];
        if (typeof latest.content === `string`) {
          return [{ type: "text", text: latest.content }];
        }
        return latest.content.map((c) => {
          if (c.type === `tool-result`)
            return {
              type: "tool-result",
              input: {},
              // TODO: we need to find the tool call here and add the input from it
              output: c.output,
              toolCallId: c.toolCallId,
              toolName: c.toolName
            };
          if (c.type === `file`)
            return {
              type: "file",
              file: new DefaultGeneratedFileWithType({
                data: typeof c.data === `string` ? parseDataUri(c.data).base64Content : c.data instanceof URL ? c.data.toString() : convertDataContentToBase64String(c.data),
                mediaType: c.mediaType
              })
            };
          if (c.type === `image`) {
            return {
              type: "file",
              file: new DefaultGeneratedFileWithType({
                data: typeof c.image === `string` ? parseDataUri(c.image).base64Content : c.image instanceof URL ? c.image.toString() : convertDataContentToBase64String(c.image),
                mediaType: c.mediaType || "unknown"
              })
            };
          }
          return { ...c };
        });
      }
    },
    aiV4: {
      ui: () => this.response.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage),
      core: () => this.aiV4UIMessagesToAIV4CoreMessages(this.response.aiV4.ui())
    }
  };
  // TODO: need to update this for new .aiV4/5.x() pattern
  responsePersisted = {
    v3: () => this.cleanV3Metadata(
      this.messages.filter((m) => this.newResponseMessagesPersisted.has(m)).map(this.mastraMessageV2ToMastraMessageV3)
    ),
    v2: () => this.messages.filter((m) => this.newResponseMessagesPersisted.has(m)),
    ui: () => this.responsePersisted.v2().map(_MessageList.mastraMessageV2ToAIV4UIMessage)
  };
  drainUnsavedMessages() {
    const messages = this.messages.filter((m) => this.newUserMessages.has(m) || this.newResponseMessages.has(m));
    this.newUserMessages.clear();
    this.newResponseMessages.clear();
    return messages;
  }
  getEarliestUnsavedMessageTimestamp() {
    const unsavedMessages = this.messages.filter((m) => this.newUserMessages.has(m) || this.newResponseMessages.has(m));
    if (unsavedMessages.length === 0) return void 0;
    return Math.min(...unsavedMessages.map((m) => new Date(m.createdAt).getTime()));
  }
  getSystemMessages(tag) {
    if (tag) {
      return this.taggedSystemMessages[tag] || [];
    }
    return this.systemMessages;
  }
  addSystem(messages, tag) {
    if (!messages) return this;
    for (const message of Array.isArray(messages) ? messages : [messages]) {
      this.addOneSystem(message, tag);
    }
    return this;
  }
  aiV4UIMessagesToAIV4CoreMessages(messages) {
    return convertToCoreMessages(this.sanitizeAIV4UIMessages(messages));
  }
  sanitizeAIV4UIMessages(messages) {
    const msgs = messages.map((m) => {
      if (m.parts.length === 0) return false;
      const safeParts = m.parts.filter(
        (p) => p.type !== `tool-invocation` || // calls and partial-calls should be updated to be results at this point
        // if they haven't we can't send them back to the llm and need to remove them.
        p.toolInvocation.state !== `call` && p.toolInvocation.state !== `partial-call`
      );
      if (!safeParts.length) return false;
      const sanitized = {
        ...m,
        parts: safeParts
      };
      if (`toolInvocations` in m && m.toolInvocations) {
        sanitized.toolInvocations = m.toolInvocations.filter((t) => t.state === `result`);
      }
      return sanitized;
    }).filter((m) => Boolean(m));
    return msgs;
  }
  /**
   * Converts various message formats to AIV4 CoreMessage format for system messages
   * @param message - The message to convert (can be string, MastraMessageV2, or AI SDK message types)
   * @returns AIV4 CoreMessage in the proper format
   */
  systemMessageToAICore(message) {
    if (typeof message === `string`) {
      return { role: "system", content: message };
    }
    if (_MessageList.isAIV5CoreMessage(message)) {
      return this.aiV5ModelMessagesToAIV4CoreMessages([message], `system`)[0];
    }
    if (_MessageList.isMastraMessageV2(message)) {
      return _MessageList.mastraMessageV2SystemToV4Core(message);
    }
    return message;
  }
  addOneSystem(message, tag) {
    const coreMessage = this.systemMessageToAICore(message);
    if (coreMessage.role !== `system`) {
      throw new Error(
        `Expected role "system" but saw ${coreMessage.role} for message ${JSON.stringify(coreMessage, null, 2)}`
      );
    }
    if (tag && !this.isDuplicateSystem(coreMessage, tag)) {
      this.taggedSystemMessages[tag] ||= [];
      this.taggedSystemMessages[tag].push(coreMessage);
    } else if (!tag && !this.isDuplicateSystem(coreMessage)) {
      this.systemMessages.push(coreMessage);
    }
  }
  isDuplicateSystem(message, tag) {
    if (tag) {
      if (!this.taggedSystemMessages[tag]) return false;
      return this.taggedSystemMessages[tag].some(
        (m) => _MessageList.cacheKeyFromAIV4CoreMessageContent(m.content) === _MessageList.cacheKeyFromAIV4CoreMessageContent(message.content)
      );
    }
    return this.systemMessages.some(
      (m) => _MessageList.cacheKeyFromAIV4CoreMessageContent(m.content) === _MessageList.cacheKeyFromAIV4CoreMessageContent(message.content)
    );
  }
  static mastraMessageV2ToAIV4UIMessage(m) {
    const experimentalAttachments = m.content.experimental_attachments ? [...m.content.experimental_attachments] : [];
    const contentString = typeof m.content.content === `string` && m.content.content !== "" ? m.content.content : m.content.parts.reduce((prev, part) => {
      if (part.type === `text`) {
        return part.text;
      }
      return prev;
    }, "");
    const parts = [];
    if (m.content.parts.length) {
      for (const part of m.content.parts) {
        if (part.type === `file`) {
          experimentalAttachments.push({
            contentType: part.mimeType,
            url: part.data
          });
        } else if (part.type === "tool-invocation" && (part.toolInvocation.state === "call" || part.toolInvocation.state === "partial-call")) {
          continue;
        } else if (part.type === "tool-invocation") {
          const toolInvocation = { ...part.toolInvocation };
          let currentStep = -1;
          let toolStep = -1;
          for (const innerPart of m.content.parts) {
            if (innerPart.type === `step-start`) currentStep++;
            if (innerPart.type === `tool-invocation` && innerPart.toolInvocation.toolCallId === part.toolInvocation.toolCallId) {
              toolStep = currentStep;
              break;
            }
          }
          if (toolStep >= 0) {
            const preparedInvocation = {
              step: toolStep,
              ...toolInvocation
            };
            parts.push({
              type: "tool-invocation",
              toolInvocation: preparedInvocation
            });
          } else {
            parts.push({
              type: "tool-invocation",
              toolInvocation
            });
          }
        } else {
          parts.push(part);
        }
      }
    }
    if (parts.length === 0 && experimentalAttachments.length > 0) {
      parts.push({ type: "text", text: "" });
    }
    if (m.role === `user`) {
      const uiMessage2 = {
        id: m.id,
        role: m.role,
        content: m.content.content || contentString,
        createdAt: m.createdAt,
        parts,
        experimental_attachments: experimentalAttachments
      };
      if (m.content.metadata) {
        uiMessage2.metadata = m.content.metadata;
      }
      return uiMessage2;
    } else if (m.role === `assistant`) {
      const isSingleTextContentArray = Array.isArray(m.content.content) && m.content.content.length === 1 && m.content.content[0].type === `text`;
      const uiMessage2 = {
        id: m.id,
        role: m.role,
        content: isSingleTextContentArray ? contentString : m.content.content || contentString,
        createdAt: m.createdAt,
        parts,
        reasoning: void 0,
        toolInvocations: `toolInvocations` in m.content ? m.content.toolInvocations?.filter((t) => t.state === "result") : void 0
      };
      if (m.content.metadata) {
        uiMessage2.metadata = m.content.metadata;
      }
      return uiMessage2;
    }
    const uiMessage = {
      id: m.id,
      role: m.role,
      content: m.content.content || contentString,
      createdAt: m.createdAt,
      parts,
      experimental_attachments: experimentalAttachments
    };
    if (m.content.metadata) {
      uiMessage.metadata = m.content.metadata;
    }
    return uiMessage;
  }
  /**
   * Converts a MastraMessageV2 system message directly to AIV4 CoreMessage format
   * This is more efficient than converting to UI message first and then to core
   * @param message - The MastraMessageV2 message to convert
   * @returns AIV4 CoreMessage with system role
   */
  static mastraMessageV2SystemToV4Core(message) {
    if (message.role !== `system` || !message.content.content)
      throw new MastraError({
        id: "INVALID_SYSTEM_MESSAGE_FORMAT",
        domain: "AGENT" /* AGENT */,
        category: "USER" /* USER */,
        text: `Invalid system message format. System messages must include 'role' and 'content' properties. The content should be a string.`,
        details: {
          receivedMessage: JSON.stringify(message, null, 2)
        }
      });
    return { role: "system", content: message.content.content };
  }
  getMessageById(id) {
    return this.messages.find((m) => m.id === id);
  }
  shouldReplaceMessage(message) {
    if (!this.messages.length) return { exists: false };
    if (!(`id` in message) || !message?.id) {
      return { exists: false };
    }
    const existingMessage = this.getMessageById(message.id);
    if (!existingMessage) return { exists: false };
    return {
      exists: true,
      shouldReplace: !_MessageList.messagesAreEqual(existingMessage, message),
      id: existingMessage.id
    };
  }
  addOne(message, messageSource) {
    if ((!(`content` in message) || !message.content && // allow empty strings
    typeof message.content !== "string") && (!(`parts` in message) || !message.parts)) {
      throw new MastraError({
        id: "INVALID_MESSAGE_CONTENT",
        domain: "AGENT" /* AGENT */,
        category: "USER" /* USER */,
        text: `Message with role "${message.role}" must have either a 'content' property (string or array) or a 'parts' property (array) that is not empty, null, or undefined. Received message: ${JSON.stringify(message, null, 2)}`,
        details: {
          role: message.role,
          messageSource,
          hasContent: "content" in message,
          hasParts: "parts" in message
        }
      });
    }
    if (message.role === `system`) {
      if (messageSource === `memory`) return null;
      const isSupportedSystemFormat = _MessageList.isAIV4CoreMessage(message) || _MessageList.isAIV5CoreMessage(message) || _MessageList.isMastraMessageV2(message);
      if (isSupportedSystemFormat) {
        return this.addSystem(message);
      }
      throw new MastraError({
        id: "INVALID_SYSTEM_MESSAGE_FORMAT",
        domain: "AGENT" /* AGENT */,
        category: "USER" /* USER */,
        text: `Invalid system message format. System messages must be CoreMessage format with 'role' and 'content' properties. The content should be a string or valid content array.`,
        details: {
          messageSource,
          receivedMessage: JSON.stringify(message, null, 2)
        }
      });
    }
    const messageV2 = this.inputToMastraMessageV2(message, messageSource);
    const { exists, shouldReplace, id } = this.shouldReplaceMessage(messageV2);
    const latestMessage = this.messages.at(-1);
    if (messageSource === `memory`) {
      for (const existingMessage of this.messages) {
        if (_MessageList.messagesAreEqual(existingMessage, messageV2)) {
          return;
        }
      }
    }
    const shouldAppendToLastAssistantMessage = latestMessage?.role === "assistant" && messageV2.role === "assistant" && latestMessage.threadId === messageV2.threadId && // If the message is from memory, don't append to the last assistant message
    messageSource !== "memory";
    const appendNetworkMessage = this._agentNetworkAppend && latestMessage && !this.memoryMessages.has(latestMessage) || !this._agentNetworkAppend;
    if (shouldAppendToLastAssistantMessage && appendNetworkMessage) {
      latestMessage.createdAt = messageV2.createdAt || latestMessage.createdAt;
      const toolResultAnchorMap = /* @__PURE__ */ new Map();
      const partsToAdd = /* @__PURE__ */ new Map();
      for (const [index, part] of messageV2.content.parts.entries()) {
        if (part.type === "tool-invocation") {
          const existingCallPart = [...latestMessage.content.parts].reverse().find((p) => p.type === "tool-invocation" && p.toolInvocation.toolCallId === part.toolInvocation.toolCallId);
          const existingCallToolInvocation = !!existingCallPart && existingCallPart.type === "tool-invocation";
          if (existingCallToolInvocation) {
            if (part.toolInvocation.state === "result") {
              existingCallPart.toolInvocation = {
                ...existingCallPart.toolInvocation,
                step: part.toolInvocation.step,
                state: "result",
                result: part.toolInvocation.result,
                args: {
                  ...existingCallPart.toolInvocation.args,
                  ...part.toolInvocation.args
                }
              };
              if (!latestMessage.content.toolInvocations) {
                latestMessage.content.toolInvocations = [];
              }
              const toolInvocationIndex = latestMessage.content.toolInvocations.findIndex(
                (t) => t.toolCallId === existingCallPart.toolInvocation.toolCallId
              );
              if (toolInvocationIndex === -1) {
                latestMessage.content.toolInvocations.push(existingCallPart.toolInvocation);
              } else {
                latestMessage.content.toolInvocations[toolInvocationIndex] = existingCallPart.toolInvocation;
              }
            }
            const existingIndex = latestMessage.content.parts.findIndex((p) => p === existingCallPart);
            toolResultAnchorMap.set(index, existingIndex);
          } else {
            partsToAdd.set(index, part);
          }
        } else {
          partsToAdd.set(index, part);
        }
      }
      this.addPartsToLatestMessage({
        latestMessage,
        messageV2,
        anchorMap: toolResultAnchorMap,
        partsToAdd
      });
      if (latestMessage.createdAt.getTime() < messageV2.createdAt.getTime()) {
        latestMessage.createdAt = messageV2.createdAt;
      }
      if (!latestMessage.content.content && messageV2.content.content) {
        latestMessage.content.content = messageV2.content.content;
      }
      if (latestMessage.content.content && messageV2.content.content && latestMessage.content.content !== messageV2.content.content) {
        latestMessage.content.content = messageV2.content.content;
      }
      this.pushMessageToSource(latestMessage, messageSource);
    } else {
      let existingIndex = -1;
      if (shouldReplace) {
        existingIndex = this.messages.findIndex((m) => m.id === id);
      }
      const existingMessage = existingIndex !== -1 && this.messages[existingIndex];
      if (shouldReplace && existingMessage) {
        this.messages[existingIndex] = messageV2;
      } else if (!exists) {
        this.messages.push(messageV2);
      }
      this.pushMessageToSource(messageV2, messageSource);
    }
    this.messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return this;
  }
  pushMessageToSource(messageV2, messageSource) {
    if (messageSource === `memory`) {
      this.memoryMessages.add(messageV2);
      this.memoryMessagesPersisted.add(messageV2);
    } else if (messageSource === `response`) {
      this.newResponseMessages.add(messageV2);
      this.newResponseMessagesPersisted.add(messageV2);
    } else if (messageSource === `input`) {
      this.newUserMessages.add(messageV2);
      this.newUserMessagesPersisted.add(messageV2);
    } else if (messageSource === `context`) {
      this.userContextMessages.add(messageV2);
      this.userContextMessagesPersisted.add(messageV2);
    } else {
      throw new Error(`Missing message source for message ${messageV2}`);
    }
  }
  /**
   * Pushes a new message part to the latest message.
   * @param latestMessage - The latest message to push the part to.
   * @param newMessage - The new message to push the part from.
   * @param part - The part to push.
   * @param insertAt - The index at which to insert the part. Optional.
   */
  pushNewMessagePart({
    latestMessage,
    newMessage,
    part,
    insertAt
    // optional
  }) {
    const partKey = _MessageList.cacheKeyFromAIV4Parts([part]);
    const latestPartCount = latestMessage.content.parts.filter(
      (p) => _MessageList.cacheKeyFromAIV4Parts([p]) === partKey
    ).length;
    const newPartCount = newMessage.content.parts.filter(
      (p) => _MessageList.cacheKeyFromAIV4Parts([p]) === partKey
    ).length;
    if (latestPartCount < newPartCount) {
      const partIndex = newMessage.content.parts.indexOf(part);
      const hasStepStartBefore = partIndex > 0 && newMessage.content.parts[partIndex - 1]?.type === "step-start";
      const needsStepStart = latestMessage.role === "assistant" && part.type === "text" && !hasStepStartBefore && latestMessage.content.parts.length > 0 && latestMessage.content.parts.at(-1)?.type === "tool-invocation";
      if (typeof insertAt === "number") {
        if (needsStepStart) {
          latestMessage.content.parts.splice(insertAt, 0, { type: "step-start" });
          latestMessage.content.parts.splice(insertAt + 1, 0, part);
        } else {
          latestMessage.content.parts.splice(insertAt, 0, part);
        }
      } else {
        if (needsStepStart) {
          latestMessage.content.parts.push({ type: "step-start" });
        }
        latestMessage.content.parts.push(part);
      }
    }
  }
  /**
   * Upserts parts of messageV2 into latestMessage based on the anchorMap.
   * This is used when appending a message to the last assistant message to ensure that parts are inserted in the correct order.
   * @param latestMessage - The latest message to upsert parts into.
   * @param messageV2 - The message to upsert parts from.
   * @param anchorMap - The anchor map to use for upserting parts.
   */
  addPartsToLatestMessage({
    latestMessage,
    messageV2,
    anchorMap,
    partsToAdd
  }) {
    for (let i = 0; i < messageV2.content.parts.length; ++i) {
      const part = messageV2.content.parts[i];
      if (!part) continue;
      const key = _MessageList.cacheKeyFromAIV4Parts([part]);
      const partToAdd = partsToAdd.get(i);
      if (!key || !partToAdd) continue;
      if (anchorMap.size > 0) {
        if (anchorMap.has(i)) continue;
        const leftAnchorV2 = [...anchorMap.keys()].filter((idx) => idx < i).pop() ?? -1;
        const rightAnchorV2 = [...anchorMap.keys()].find((idx) => idx > i) ?? -1;
        const leftAnchorLatest = leftAnchorV2 !== -1 ? anchorMap.get(leftAnchorV2) : 0;
        const offset = leftAnchorV2 === -1 ? i : i - leftAnchorV2;
        const insertAt = leftAnchorLatest + offset;
        const rightAnchorLatest = rightAnchorV2 !== -1 ? anchorMap.get(rightAnchorV2) : latestMessage.content.parts.length;
        if (insertAt >= 0 && insertAt <= rightAnchorLatest && !latestMessage.content.parts.slice(insertAt, rightAnchorLatest).some((p) => _MessageList.cacheKeyFromAIV4Parts([p]) === _MessageList.cacheKeyFromAIV4Parts([part]))) {
          this.pushNewMessagePart({
            latestMessage,
            newMessage: messageV2,
            part,
            insertAt
          });
          for (const [v2Idx, latestIdx] of anchorMap.entries()) {
            if (latestIdx >= insertAt) {
              anchorMap.set(v2Idx, latestIdx + 1);
            }
          }
        }
      } else {
        this.pushNewMessagePart({
          latestMessage,
          newMessage: messageV2,
          part
        });
      }
    }
  }
  inputToMastraMessageV2(message, messageSource) {
    if (
      // we can't throw if the threadId doesn't match and this message came from memory
      // this is because per-user semantic recall can retrieve messages from other threads
      messageSource !== `memory` && `threadId` in message && message.threadId && this.memoryInfo && message.threadId !== this.memoryInfo.threadId
    ) {
      throw new Error(
        `Received input message with wrong threadId. Input ${message.threadId}, expected ${this.memoryInfo.threadId}`
      );
    }
    if (`resourceId` in message && message.resourceId && this.memoryInfo?.resourceId && message.resourceId !== this.memoryInfo.resourceId) {
      throw new Error(
        `Received input message with wrong resourceId. Input ${message.resourceId}, expected ${this.memoryInfo.resourceId}`
      );
    }
    if (_MessageList.isMastraMessageV1(message)) {
      return this.mastraMessageV1ToMastraMessageV2(message, messageSource);
    }
    if (_MessageList.isMastraMessageV2(message)) {
      return this.hydrateMastraMessageV2Fields(message);
    }
    if (_MessageList.isAIV4CoreMessage(message)) {
      return this.aiV4CoreMessageToMastraMessageV2(message, messageSource);
    }
    if (_MessageList.isAIV4UIMessage(message)) {
      return this.aiV4UIMessageToMastraMessageV2(message, messageSource);
    }
    if (_MessageList.isAIV5CoreMessage(message)) {
      return _MessageList.mastraMessageV3ToV2(this.aiV5ModelMessageToMastraMessageV3(message, messageSource));
    }
    if (_MessageList.isAIV5UIMessage(message)) {
      return _MessageList.mastraMessageV3ToV2(this.aiV5UIMessageToMastraMessageV3(message, messageSource));
    }
    if (_MessageList.isMastraMessageV3(message)) {
      return _MessageList.mastraMessageV3ToV2(this.hydrateMastraMessageV3Fields(message));
    }
    throw new Error(`Found unhandled message ${JSON.stringify(message)}`);
  }
  lastCreatedAt;
  // this makes sure messages added in order will always have a date atleast 1ms apart.
  generateCreatedAt(messageSource, start) {
    start = start instanceof Date ? start : start ? new Date(start) : void 0;
    if (start && !this.lastCreatedAt) {
      this.lastCreatedAt = start.getTime();
      return start;
    }
    if (start && messageSource === `memory`) {
      return start;
    }
    const now = /* @__PURE__ */ new Date();
    const nowTime = start?.getTime() || now.getTime();
    const lastTime = this.messages.reduce((p, m) => {
      if (m.createdAt.getTime() > p) return m.createdAt.getTime();
      return p;
    }, this.lastCreatedAt || 0);
    if (nowTime <= lastTime) {
      const newDate = new Date(lastTime + 1);
      this.lastCreatedAt = newDate.getTime();
      return newDate;
    }
    this.lastCreatedAt = nowTime;
    return now;
  }
  newMessageId() {
    if (this.generateMessageId) {
      return this.generateMessageId();
    }
    return randomUUID();
  }
  mastraMessageV1ToMastraMessageV2(message, messageSource) {
    const coreV2 = this.aiV4CoreMessageToMastraMessageV2(
      {
        content: message.content,
        role: message.role
      },
      messageSource
    );
    return {
      id: message.id,
      role: coreV2.role,
      createdAt: this.generateCreatedAt(messageSource, message.createdAt),
      threadId: message.threadId,
      resourceId: message.resourceId,
      content: coreV2.content
    };
  }
  hydrateMastraMessageV3Fields(message) {
    if (!(message.createdAt instanceof Date)) message.createdAt = new Date(message.createdAt);
    return message;
  }
  hydrateMastraMessageV2Fields(message) {
    if (!(message.createdAt instanceof Date)) message.createdAt = new Date(message.createdAt);
    if (message.content.toolInvocations && message.content.parts) {
      message.content.toolInvocations = message.content.toolInvocations.map((ti) => {
        if (!ti.args || Object.keys(ti.args).length === 0) {
          const partWithArgs = message.content.parts.find(
            (part) => part.type === "tool-invocation" && part.toolInvocation && part.toolInvocation.toolCallId === ti.toolCallId && part.toolInvocation.args && Object.keys(part.toolInvocation.args).length > 0
          );
          if (partWithArgs && partWithArgs.type === "tool-invocation") {
            return { ...ti, args: partWithArgs.toolInvocation.args };
          }
        }
        return ti;
      });
    }
    return message;
  }
  aiV4UIMessageToMastraMessageV2(message, messageSource) {
    const content = {
      format: 2,
      parts: message.parts
    };
    if (message.toolInvocations) content.toolInvocations = message.toolInvocations;
    if (message.reasoning) content.reasoning = message.reasoning;
    if (message.annotations) content.annotations = message.annotations;
    if (message.experimental_attachments) {
      content.experimental_attachments = message.experimental_attachments;
    }
    if ("metadata" in message && message.metadata !== null && message.metadata !== void 0) {
      content.metadata = message.metadata;
    }
    return {
      id: message.id || this.newMessageId(),
      role: _MessageList.getRole(message),
      createdAt: this.generateCreatedAt(messageSource, message.createdAt),
      threadId: this.memoryInfo?.threadId,
      resourceId: this.memoryInfo?.resourceId,
      content
    };
  }
  aiV4CoreMessageToMastraMessageV2(coreMessage, messageSource) {
    const id = `id` in coreMessage ? coreMessage.id : this.newMessageId();
    const parts = [];
    const experimentalAttachments = [];
    const toolInvocations = [];
    const isSingleTextContent = messageSource === `response` && Array.isArray(coreMessage.content) && coreMessage.content.length === 1 && coreMessage.content[0] && coreMessage.content[0].type === `text` && `text` in coreMessage.content[0] && coreMessage.content[0].text;
    if (isSingleTextContent && messageSource === `response`) {
      coreMessage.content = isSingleTextContent;
    }
    if (typeof coreMessage.content === "string") {
      parts.push({
        type: "text",
        text: coreMessage.content,
        // Preserve providerOptions from CoreMessage (e.g., for system messages with cacheControl)
        ..."providerOptions" in coreMessage && coreMessage.providerOptions ? { providerMetadata: coreMessage.providerOptions } : {}
      });
    } else if (Array.isArray(coreMessage.content)) {
      for (const part of coreMessage.content) {
        switch (part.type) {
          case "text":
            const prevPart = parts.at(-1);
            if (coreMessage.role === "assistant" && prevPart && prevPart.type === "tool-invocation") {
              parts.push({ type: "step-start" });
            }
            const mergedProviderMetadata = {
              ..."providerOptions" in coreMessage && coreMessage.providerOptions ? coreMessage.providerOptions : {},
              ..."providerOptions" in part && part.providerOptions ? part.providerOptions : {}
            };
            parts.push({
              type: "text",
              text: part.text,
              ...Object.keys(mergedProviderMetadata).length > 0 ? { providerMetadata: mergedProviderMetadata } : {}
            });
            break;
          case "tool-call":
            parts.push({
              type: "tool-invocation",
              toolInvocation: {
                state: "call",
                toolCallId: part.toolCallId,
                toolName: part.toolName,
                args: part.args
              }
            });
            break;
          case "tool-result":
            let toolArgs = {};
            const toolCallInSameMsg = coreMessage.content.find(
              (p) => p.type === "tool-call" && p.toolCallId === part.toolCallId
            );
            if (toolCallInSameMsg && toolCallInSameMsg.type === "tool-call") {
              toolArgs = toolCallInSameMsg.args;
            }
            if (Object.keys(toolArgs).length === 0) {
              for (let i = this.messages.length - 1; i >= 0; i--) {
                const msg = this.messages[i];
                if (msg && msg.role === "assistant" && msg.content.parts) {
                  const toolCallPart = msg.content.parts.find(
                    (p) => p.type === "tool-invocation" && p.toolInvocation.toolCallId === part.toolCallId && p.toolInvocation.state === "call"
                  );
                  if (toolCallPart && toolCallPart.type === "tool-invocation" && toolCallPart.toolInvocation.args) {
                    toolArgs = toolCallPart.toolInvocation.args;
                    break;
                  }
                }
              }
            }
            const invocation = {
              state: "result",
              toolCallId: part.toolCallId,
              toolName: part.toolName,
              result: part.result ?? "",
              // undefined will cause AI SDK to throw an error, but for client side tool calls this really could be undefined
              args: toolArgs
              // Use the args from the corresponding tool-call
            };
            parts.push({
              type: "tool-invocation",
              toolInvocation: invocation
            });
            toolInvocations.push(invocation);
            break;
          case "reasoning":
            parts.push({
              type: "reasoning",
              reasoning: "",
              // leave this blank so we aren't double storing it in the db along with details
              details: [{ type: "text", text: part.text, signature: part.signature }]
            });
            break;
          case "redacted-reasoning":
            parts.push({
              type: "reasoning",
              reasoning: "",
              // No text reasoning for redacted parts
              details: [{ type: "redacted", data: part.data }]
            });
            break;
          case "image":
            parts.push({
              type: "file",
              data: imageContentToString(part.image),
              mimeType: part.mimeType
            });
            break;
          case "file":
            if (part.data instanceof URL) {
              parts.push({
                type: "file",
                data: part.data.toString(),
                mimeType: part.mimeType
              });
            } else if (typeof part.data === "string") {
              const categorized = categorizeFileData(part.data, part.mimeType);
              if (categorized.type === "url" || categorized.type === "dataUri") {
                parts.push({
                  type: "file",
                  data: part.data,
                  mimeType: categorized.mimeType || "image/png"
                });
              } else {
                try {
                  parts.push({
                    type: "file",
                    mimeType: categorized.mimeType || "image/png",
                    data: convertDataContentToBase64String(part.data)
                  });
                } catch (error) {
                  console.error(`Failed to convert binary data to base64 in CoreMessage file part: ${error}`, error);
                }
              }
            } else {
              try {
                parts.push({
                  type: "file",
                  mimeType: part.mimeType,
                  data: convertDataContentToBase64String(part.data)
                });
              } catch (error) {
                console.error(`Failed to convert binary data to base64 in CoreMessage file part: ${error}`, error);
              }
            }
            break;
        }
      }
    }
    const content = {
      format: 2,
      parts
    };
    if (toolInvocations.length) content.toolInvocations = toolInvocations;
    if (typeof coreMessage.content === `string`) content.content = coreMessage.content;
    if (experimentalAttachments.length) content.experimental_attachments = experimentalAttachments;
    return {
      id,
      role: _MessageList.getRole(coreMessage),
      createdAt: this.generateCreatedAt(messageSource),
      threadId: this.memoryInfo?.threadId,
      resourceId: this.memoryInfo?.resourceId,
      content
    };
  }
  static isAIV4UIMessage(msg) {
    return !_MessageList.isMastraMessage(msg) && !_MessageList.isAIV4CoreMessage(msg) && `parts` in msg && !_MessageList.hasAIV5UIMessageCharacteristics(msg);
  }
  static isAIV5CoreMessage(msg) {
    return !_MessageList.isMastraMessage(msg) && !(`parts` in msg) && `content` in msg && _MessageList.hasAIV5CoreMessageCharacteristics(msg);
  }
  static isAIV4CoreMessage(msg) {
    return !_MessageList.isMastraMessage(msg) && !(`parts` in msg) && `content` in msg && !_MessageList.hasAIV5CoreMessageCharacteristics(msg);
  }
  static isMastraMessage(msg) {
    return _MessageList.isMastraMessageV3(msg) || _MessageList.isMastraMessageV2(msg) || _MessageList.isMastraMessageV1(msg);
  }
  static isMastraMessageV1(msg) {
    return !_MessageList.isMastraMessageV2(msg) && !_MessageList.isMastraMessageV3(msg) && (`threadId` in msg || `resourceId` in msg);
  }
  static isMastraMessageV2(msg) {
    return Boolean(
      `content` in msg && msg.content && !Array.isArray(msg.content) && typeof msg.content !== `string` && `format` in msg.content && msg.content.format === 2
    );
  }
  static isMastraMessageV3(msg) {
    return Boolean(
      `content` in msg && msg.content && !Array.isArray(msg.content) && typeof msg.content !== `string` && `format` in msg.content && msg.content.format === 3
    );
  }
  static getRole(message) {
    if (message.role === `assistant` || message.role === `tool`) return `assistant`;
    if (message.role === `user`) return `user`;
    if (message.role === `system`) return `system`;
    throw new Error(
      `BUG: add handling for message role ${message.role} in message ${JSON.stringify(message, null, 2)}`
    );
  }
  static cacheKeyFromAIV4Parts(parts) {
    let key = ``;
    for (const part of parts) {
      key += part.type;
      if (part.type === `text`) {
        key += part.text;
      }
      if (part.type === `tool-invocation`) {
        key += part.toolInvocation.toolCallId;
        key += part.toolInvocation.state;
      }
      if (part.type === `reasoning`) {
        key += part.reasoning;
        key += part.details.reduce((prev, current) => {
          if (current.type === `text`) {
            return prev + current.text.length + (current.signature?.length || 0);
          }
          return prev;
        }, 0);
      }
      if (part.type === `file`) {
        key += part.data;
        key += part.mimeType;
      }
    }
    return key;
  }
  static coreContentToString(content) {
    if (typeof content === `string`) return content;
    return content.reduce((p, c) => {
      if (c.type === `text`) {
        p += c.text;
      }
      return p;
    }, "");
  }
  static cacheKeyFromAIV4CoreMessageContent(content) {
    if (typeof content === `string`) return content;
    let key = ``;
    for (const part of content) {
      key += part.type;
      if (part.type === `text`) {
        key += part.text.length;
      }
      if (part.type === `reasoning`) {
        key += part.text.length;
      }
      if (part.type === `tool-call`) {
        key += part.toolCallId;
        key += part.toolName;
      }
      if (part.type === `tool-result`) {
        key += part.toolCallId;
        key += part.toolName;
      }
      if (part.type === `file`) {
        key += part.filename;
        key += part.mimeType;
      }
      if (part.type === `image`) {
        key += getImageCacheKey(part.image);
        key += part.mimeType;
      }
      if (part.type === `redacted-reasoning`) {
        key += part.data.length;
      }
    }
    return key;
  }
  static messagesAreEqual(one, two) {
    const oneUIV4 = _MessageList.isAIV4UIMessage(one) && one;
    const twoUIV4 = _MessageList.isAIV4UIMessage(two) && two;
    if (oneUIV4 && !twoUIV4) return false;
    if (oneUIV4 && twoUIV4) {
      return _MessageList.cacheKeyFromAIV4Parts(one.parts) === _MessageList.cacheKeyFromAIV4Parts(two.parts);
    }
    const oneCMV4 = _MessageList.isAIV4CoreMessage(one) && one;
    const twoCMV4 = _MessageList.isAIV4CoreMessage(two) && two;
    if (oneCMV4 && !twoCMV4) return false;
    if (oneCMV4 && twoCMV4) {
      return _MessageList.cacheKeyFromAIV4CoreMessageContent(oneCMV4.content) === _MessageList.cacheKeyFromAIV4CoreMessageContent(twoCMV4.content);
    }
    const oneMM1 = _MessageList.isMastraMessageV1(one) && one;
    const twoMM1 = _MessageList.isMastraMessageV1(two) && two;
    if (oneMM1 && !twoMM1) return false;
    if (oneMM1 && twoMM1) {
      return oneMM1.id === twoMM1.id && _MessageList.cacheKeyFromAIV4CoreMessageContent(oneMM1.content) === _MessageList.cacheKeyFromAIV4CoreMessageContent(twoMM1.content);
    }
    const oneMM2 = _MessageList.isMastraMessageV2(one) && one;
    const twoMM2 = _MessageList.isMastraMessageV2(two) && two;
    if (oneMM2 && !twoMM2) return false;
    if (oneMM2 && twoMM2) {
      return oneMM2.id === twoMM2.id && _MessageList.cacheKeyFromAIV4Parts(oneMM2.content.parts) === _MessageList.cacheKeyFromAIV4Parts(twoMM2.content.parts);
    }
    const oneMM3 = _MessageList.isMastraMessageV3(one) && one;
    const twoMM3 = _MessageList.isMastraMessageV3(two) && two;
    if (oneMM3 && !twoMM3) return false;
    if (oneMM3 && twoMM3) {
      return oneMM3.id === twoMM3.id && _MessageList.cacheKeyFromAIV5Parts(oneMM3.content.parts) === _MessageList.cacheKeyFromAIV5Parts(twoMM3.content.parts);
    }
    const oneUIV5 = _MessageList.isAIV5UIMessage(one) && one;
    const twoUIV5 = _MessageList.isAIV5UIMessage(two) && two;
    if (oneUIV5 && !twoUIV5) return false;
    if (oneUIV5 && twoUIV5) {
      return _MessageList.cacheKeyFromAIV5Parts(one.parts) === _MessageList.cacheKeyFromAIV5Parts(two.parts);
    }
    const oneCMV5 = _MessageList.isAIV5CoreMessage(one) && one;
    const twoCMV5 = _MessageList.isAIV5CoreMessage(two) && two;
    if (oneCMV5 && !twoCMV5) return false;
    if (oneCMV5 && twoCMV5) {
      return _MessageList.cacheKeyFromAIV5ModelMessageContent(oneCMV5.content) === _MessageList.cacheKeyFromAIV5ModelMessageContent(twoCMV5.content);
    }
    return true;
  }
  cleanV3Metadata(messages) {
    return messages.map((msg) => {
      if (!msg.content.metadata || typeof msg.content.metadata !== "object") {
        return msg;
      }
      const metadata = { ...msg.content.metadata };
      const hasOriginalContent = "__originalContent" in metadata;
      const hasOriginalAttachments = "__originalExperimentalAttachments" in metadata;
      if (!hasOriginalContent && !hasOriginalAttachments) {
        return msg;
      }
      const { __originalContent, __originalExperimentalAttachments, ...cleanMetadata } = metadata;
      if (Object.keys(cleanMetadata).length === 0) {
        const { metadata: metadata2, ...contentWithoutMetadata } = msg.content;
        return { ...msg, content: contentWithoutMetadata };
      }
      return { ...msg, content: { ...msg.content, metadata: cleanMetadata } };
    });
  }
  static aiV4CoreMessageToV1PromptMessage(coreMessage) {
    if (coreMessage.role === `system`) {
      return coreMessage;
    }
    if (typeof coreMessage.content === `string` && (coreMessage.role === `assistant` || coreMessage.role === `user`)) {
      return {
        ...coreMessage,
        content: [{ type: "text", text: coreMessage.content }]
      };
    }
    if (typeof coreMessage.content === `string`) {
      throw new Error(
        `Saw text content for input CoreMessage, but the role is ${coreMessage.role}. This is only allowed for "system", "assistant", and "user" roles.`
      );
    }
    const roleContent = {
      user: [],
      assistant: [],
      tool: []
    };
    const role = coreMessage.role;
    for (const part of coreMessage.content) {
      const incompatibleMessage = `Saw incompatible message content part type ${part.type} for message role ${role}`;
      switch (part.type) {
        case "text": {
          if (role === `tool`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push(part);
          break;
        }
        case "redacted-reasoning":
        case "reasoning": {
          if (role !== `assistant`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push(part);
          break;
        }
        case "tool-call": {
          if (role === `tool` || role === `user`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push(part);
          break;
        }
        case "tool-result": {
          if (role === `assistant` || role === `user`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push(part);
          break;
        }
        case "image": {
          if (role === `tool` || role === `assistant`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push({
            ...part,
            image: part.image instanceof URL || part.image instanceof Uint8Array ? part.image : Buffer.isBuffer(part.image) || part.image instanceof ArrayBuffer ? new Uint8Array(part.image) : new URL(part.image)
          });
          break;
        }
        case "file": {
          if (role === `tool`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push({
            ...part,
            data: part.data instanceof URL ? part.data : typeof part.data === "string" ? part.data : convertDataContentToBase64String(part.data)
          });
          break;
        }
      }
    }
    if (role === `tool`) {
      return {
        ...coreMessage,
        content: roleContent[role]
      };
    }
    if (role === `user`) {
      return {
        ...coreMessage,
        content: roleContent[role]
      };
    }
    if (role === `assistant`) {
      return {
        ...coreMessage,
        content: roleContent[role]
      };
    }
    throw new Error(
      `Encountered unknown role ${role} when converting V4 CoreMessage -> V4 LanguageModelV1Prompt, input message: ${JSON.stringify(coreMessage, null, 2)}`
    );
  }
  static aiV5ModelMessageToV2PromptMessage(modelMessage) {
    if (modelMessage.role === `system`) {
      return modelMessage;
    }
    if (typeof modelMessage.content === `string` && (modelMessage.role === `assistant` || modelMessage.role === `user`)) {
      return {
        role: modelMessage.role,
        content: [{ type: "text", text: modelMessage.content }],
        providerOptions: modelMessage.providerOptions
      };
    }
    if (typeof modelMessage.content === `string`) {
      throw new Error(
        `Saw text content for input ModelMessage, but the role is ${modelMessage.role}. This is only allowed for "system", "assistant", and "user" roles.`
      );
    }
    const roleContent = {
      user: [],
      assistant: [],
      tool: []
    };
    const role = modelMessage.role;
    for (const part of modelMessage.content) {
      const incompatibleMessage = `Saw incompatible message content part type ${part.type} for message role ${role}`;
      switch (part.type) {
        case "text": {
          if (role === `tool`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push(part);
          break;
        }
        case "reasoning": {
          if (role === `tool` || role === `user`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push(part);
          break;
        }
        case "tool-call": {
          if (role !== `assistant`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push(part);
          break;
        }
        case "tool-result": {
          if (role === `assistant` || role === `user`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push(part);
          break;
        }
        case "file": {
          if (role === `tool`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push({
            ...part,
            data: part.data instanceof ArrayBuffer ? new Uint8Array(part.data) : part.data
          });
          break;
        }
        case "image": {
          if (role === `tool`) {
            throw new Error(incompatibleMessage);
          }
          roleContent[role].push({
            ...part,
            mediaType: part.mediaType || "image/unknown",
            type: "file",
            data: part.image instanceof ArrayBuffer ? new Uint8Array(part.image) : part.image
          });
          break;
        }
      }
    }
    if (role === `tool`) {
      return {
        ...modelMessage,
        content: roleContent[role]
      };
    }
    if (role === `user`) {
      return {
        ...modelMessage,
        content: roleContent[role]
      };
    }
    if (role === `assistant`) {
      return {
        ...modelMessage,
        content: roleContent[role]
      };
    }
    throw new Error(
      `Encountered unknown role ${role} when converting V5 ModelMessage -> V5 LanguageModelV2Message, input message: ${JSON.stringify(modelMessage, null, 2)}`
    );
  }
  static mastraMessageV3ToV2(v3Msg) {
    const toolInvocationParts = v3Msg.content.parts.filter((p) => isToolUIPart(p));
    const hadToolInvocations = v3Msg.content.metadata?.__hadToolInvocations === true;
    let toolInvocations = void 0;
    if (toolInvocationParts.length > 0) {
      const invocations = toolInvocationParts.map((p) => {
        const toolName = getToolName(p);
        if (p.state === `output-available`) {
          return {
            args: p.input,
            result: typeof p.output === "object" && p.output && "value" in p.output ? p.output.value : p.output,
            toolCallId: p.toolCallId,
            toolName,
            state: "result"
          };
        }
        return {
          args: p.input,
          state: "call",
          toolName,
          toolCallId: p.toolCallId
        };
      });
      toolInvocations = invocations;
    } else if (hadToolInvocations && v3Msg.role === "assistant") {
      toolInvocations = [];
    }
    const attachmentUrls = new Set(v3Msg.content.metadata?.__attachmentUrls || []);
    const v2Msg = {
      id: v3Msg.id,
      resourceId: v3Msg.resourceId,
      threadId: v3Msg.threadId,
      createdAt: v3Msg.createdAt,
      role: v3Msg.role,
      content: {
        format: 2,
        parts: v3Msg.content.parts.map((p) => {
          if (isToolUIPart(p) || p.type === "dynamic-tool") {
            const toolName = getToolName(p);
            const shared = {
              state: p.state,
              args: p.input,
              toolCallId: p.toolCallId,
              toolName
            };
            if (p.state === `output-available`) {
              return {
                type: "tool-invocation",
                toolInvocation: {
                  ...shared,
                  state: "result",
                  result: typeof p.output === "object" && p.output && "value" in p.output ? p.output.value : p.output
                },
                providerMetadata: p.callProviderMetadata
              };
            }
            return {
              type: "tool-invocation",
              toolInvocation: {
                ...shared,
                state: p.state === `input-available` ? `call` : `partial-call`
              }
            };
          }
          switch (p.type) {
            case "text":
              return p;
            case "file": {
              const fileDataSource = "url" in p && typeof p.url === "string" ? p.url : "data" in p && typeof p.data === "string" ? p.data : void 0;
              if (!fileDataSource) {
                return null;
              }
              if (attachmentUrls.has(fileDataSource)) {
                return null;
              }
              return {
                type: "file",
                mimeType: p.mediaType,
                data: fileDataSource,
                providerMetadata: p.providerMetadata
              };
            }
            case "reasoning":
              if (p.text === "") return null;
              return {
                type: "reasoning",
                reasoning: p.text,
                details: [{ type: "text", text: p.text }],
                providerMetadata: p.providerMetadata
              };
            case "source-url":
              return {
                type: "source",
                source: {
                  url: p.url,
                  id: p.sourceId,
                  sourceType: "url"
                },
                providerMetadata: p.providerMetadata
              };
            case "step-start":
              return p;
          }
          return null;
        }).filter((p) => Boolean(p))
      }
    };
    if (toolInvocations !== void 0) {
      v2Msg.content.toolInvocations = toolInvocations;
    }
    if (v3Msg.content.metadata) {
      const { __originalContent, __originalExperimentalAttachments, __attachmentUrls, ...userMetadata } = v3Msg.content.metadata;
      v2Msg.content.metadata = userMetadata;
    }
    const originalContent = v3Msg.content.metadata?.__originalContent;
    if (originalContent !== void 0) {
      const hasOnlyTextOrStepStart = v2Msg.content.parts.every((p) => p.type === `step-start` || p.type === `text`);
      if (typeof originalContent === `string` || hasOnlyTextOrStepStart) {
        v2Msg.content.content = originalContent;
      }
    }
    const originalAttachments = v3Msg.content.metadata?.__originalExperimentalAttachments;
    if (originalAttachments && Array.isArray(originalAttachments)) {
      v2Msg.content.experimental_attachments = originalAttachments || [];
    }
    const originalContentIsV5 = Array.isArray(v3Msg.content.metadata?.__originalContent) && v3Msg.content.metadata?.__originalContent.some((part) => part.type === "file");
    const urlFileParts = originalContentIsV5 ? [] : v2Msg.content.parts.filter(
      (p) => p.type === "file" && typeof p.data === "string" && (p.data.startsWith("http://") || p.data.startsWith("https://")) && !p.providerMetadata
      // Don't move if it has providerMetadata (needed for roundtrip)
    );
    if (urlFileParts.length > 0) {
      if (!v2Msg.content.experimental_attachments) {
        v2Msg.content.experimental_attachments = [];
      }
      for (const urlPart of urlFileParts) {
        if (urlPart.type === "file") {
          v2Msg.content.experimental_attachments.push({
            url: urlPart.data,
            contentType: urlPart.mimeType
          });
        }
      }
      v2Msg.content.parts = v2Msg.content.parts.filter(
        (p) => !(p.type === "file" && typeof p.data === "string" && (p.data.startsWith("http://") || p.data.startsWith("https://")) && !p.providerMetadata)
      );
    }
    if (toolInvocations && toolInvocations.length > 0) {
      const resultToolInvocations = toolInvocations.filter((t) => t.state === "result");
      if (resultToolInvocations.length > 0) {
        v2Msg.content.toolInvocations = resultToolInvocations;
      }
    }
    if (v3Msg.type) v2Msg.type = v3Msg.type;
    return v2Msg;
  }
  mastraMessageV2ToMastraMessageV3(v2Msg) {
    const parts = [];
    const v3Msg = {
      id: v2Msg.id,
      content: {
        format: 3,
        parts
      },
      role: v2Msg.role,
      createdAt: v2Msg.createdAt instanceof Date ? v2Msg.createdAt : new Date(v2Msg.createdAt),
      resourceId: v2Msg.resourceId,
      threadId: v2Msg.threadId,
      type: v2Msg.type
    };
    if (v2Msg.content.metadata) {
      v3Msg.content.metadata = { ...v2Msg.content.metadata };
    }
    if (v2Msg.content.content !== void 0) {
      v3Msg.content.metadata = {
        ...v3Msg.content.metadata || {},
        __originalContent: v2Msg.content.content
      };
    }
    if (v2Msg.content.experimental_attachments !== void 0) {
      v3Msg.content.metadata = {
        ...v3Msg.content.metadata || {},
        __originalExperimentalAttachments: v2Msg.content.experimental_attachments
      };
    }
    const fileUrls = /* @__PURE__ */ new Set();
    for (const part of v2Msg.content.parts) {
      switch (part.type) {
        case "step-start":
        case "text":
          parts.push(part);
          break;
        case "tool-invocation":
          if (part.toolInvocation.state === `result`) {
            parts.push({
              type: `tool-${part.toolInvocation.toolName}`,
              toolCallId: part.toolInvocation.toolCallId,
              state: "output-available",
              input: part.toolInvocation.args,
              output: part.toolInvocation.result,
              callProviderMetadata: part.providerMetadata
            });
          } else {
            parts.push({
              type: `tool-${part.toolInvocation.toolName}`,
              toolCallId: part.toolInvocation.toolCallId,
              state: part.toolInvocation.state === `call` ? `input-available` : `input-streaming`,
              input: part.toolInvocation.args
            });
          }
          break;
        case "source":
          parts.push({
            type: "source-url",
            sourceId: part.source.id,
            url: part.source.url,
            title: part.source.title,
            providerMetadata: part.source.providerMetadata || part.providerMetadata
          });
          break;
        case "reasoning":
          const text = part.reasoning || (part.details?.reduce((p, c) => {
            if (c.type === `text`) return p + c.text;
            return p;
          }, "") ?? "");
          if (text || part.details?.length) {
            parts.push({
              type: "reasoning",
              text: text || "",
              state: "done",
              providerMetadata: part.providerMetadata
            });
          }
          break;
        case "file": {
          const categorized = typeof part.data === "string" ? categorizeFileData(part.data, part.mimeType) : { type: "raw", mimeType: part.mimeType};
          if (categorized.type === "url" && typeof part.data === "string") {
            parts.push({
              type: "file",
              url: part.data,
              mediaType: categorized.mimeType || "image/png",
              providerMetadata: part.providerMetadata
            });
            fileUrls.add(part.data);
          } else {
            let filePartData;
            let extractedMimeType = part.mimeType;
            if (typeof part.data === "string") {
              const parsed = parseDataUri(part.data);
              if (parsed.isDataUri) {
                filePartData = parsed.base64Content;
                if (parsed.mimeType) {
                  extractedMimeType = extractedMimeType || parsed.mimeType;
                }
              } else {
                filePartData = part.data;
              }
            } else {
              filePartData = part.data;
            }
            const finalMimeType = extractedMimeType || "image/png";
            let dataUri;
            if (typeof filePartData === "string" && filePartData.startsWith("data:")) {
              dataUri = filePartData;
            } else {
              dataUri = createDataUri(filePartData, finalMimeType);
            }
            parts.push({
              type: "file",
              url: dataUri,
              // Use url field with data URI
              mediaType: finalMimeType,
              providerMetadata: part.providerMetadata
            });
          }
          fileUrls.add(part.data);
          break;
        }
      }
    }
    if (v2Msg.content.content && !v3Msg.content.parts?.some((p) => p.type === `text`)) {
      v3Msg.content.parts.push({ type: "text", text: v2Msg.content.content });
    }
    const attachmentUrls = [];
    if (v2Msg.content.experimental_attachments?.length) {
      for (const attachment of v2Msg.content.experimental_attachments) {
        if (fileUrls.has(attachment.url)) continue;
        attachmentUrls.push(attachment.url);
        parts.push({
          url: attachment.url,
          mediaType: attachment.contentType || "unknown",
          type: "file"
        });
      }
    }
    if (attachmentUrls.length > 0) {
      v3Msg.content.metadata = {
        ...v3Msg.content.metadata || {},
        __attachmentUrls: attachmentUrls
      };
    }
    return v3Msg;
  }
  aiV5UIMessagesToAIV5ModelMessages(messages) {
    const preprocessed = this.addStartStepPartsForAIV5(this.sanitizeV5UIMessages(messages));
    const result = convertToModelMessages(preprocessed);
    return result;
  }
  addStartStepPartsForAIV5(messages) {
    for (const message of messages) {
      if (message.role !== `assistant`) continue;
      for (const [index, part] of message.parts.entries()) {
        if (!isToolUIPart(part)) continue;
        if (message.parts.at(index + 1)?.type !== `step-start`) {
          message.parts.splice(index + 1, 0, { type: "step-start" });
        }
      }
    }
    return messages;
  }
  sanitizeV5UIMessages(messages) {
    const msgs = messages.map((m) => {
      if (m.parts.length === 0) return false;
      const safeParts = m.parts.filter((p) => {
        if (!isToolUIPart(p)) return true;
        return p.state === "output-available" || p.state === "output-error";
      });
      if (!safeParts.length) return false;
      const sanitized = {
        ...m,
        parts: safeParts.map((part) => {
          if (isToolUIPart(part) && part.state === "output-available") {
            return {
              ...part,
              output: typeof part.output === "object" && part.output && "value" in part.output ? part.output.value : part.output
            };
          }
          return part;
        })
      };
      return sanitized;
    }).filter((m) => Boolean(m));
    return msgs;
  }
  static mastraMessageV3ToAIV5UIMessage(m) {
    const metadata = {
      ...m.content.metadata || {}
    };
    if (m.createdAt) metadata.createdAt = m.createdAt;
    if (m.threadId) metadata.threadId = m.threadId;
    if (m.resourceId) metadata.resourceId = m.resourceId;
    const filteredParts = m.content.parts;
    return {
      id: m.id,
      role: m.role,
      metadata,
      parts: filteredParts
    };
  }
  aiV5ModelMessagesToAIV4CoreMessages(messages, messageSource) {
    const v3 = messages.map((msg) => this.aiV5ModelMessageToMastraMessageV3(msg, messageSource));
    const v2 = v3.map(_MessageList.mastraMessageV3ToV2);
    const ui = v2.map(_MessageList.mastraMessageV2ToAIV4UIMessage);
    const core = this.aiV4UIMessagesToAIV4CoreMessages(ui);
    return core;
  }
  aiV4CoreMessagesToAIV5ModelMessages(messages, source) {
    return this.aiV5UIMessagesToAIV5ModelMessages(
      messages.map((m) => this.aiV4CoreMessageToMastraMessageV2(m, source)).map((m) => this.mastraMessageV2ToMastraMessageV3(m)).map((m) => _MessageList.mastraMessageV3ToAIV5UIMessage(m))
    );
  }
  aiV5UIMessageToMastraMessageV3(message, messageSource) {
    const content = {
      format: 3,
      parts: message.parts,
      metadata: message.metadata
    };
    const metadata = message.metadata;
    const createdAt = (() => {
      if ("createdAt" in message && message.createdAt instanceof Date) {
        return message.createdAt;
      }
      if (metadata && "createdAt" in metadata && metadata.createdAt instanceof Date) {
        return metadata.createdAt;
      }
      return void 0;
    })();
    if ("metadata" in message && message.metadata) {
      content.metadata = { ...message.metadata };
    }
    return {
      id: message.id || this.newMessageId(),
      role: _MessageList.getRole(message),
      createdAt: this.generateCreatedAt(messageSource, createdAt),
      threadId: this.memoryInfo?.threadId,
      resourceId: this.memoryInfo?.resourceId,
      content
    };
  }
  aiV5ModelMessageToMastraMessageV3(coreMessage, messageSource) {
    const id = `id` in coreMessage && typeof coreMessage.id === `string` ? coreMessage.id : this.newMessageId();
    const parts = [];
    if (typeof coreMessage.content === "string") {
      parts.push({
        type: "text",
        text: coreMessage.content,
        // Preserve providerOptions from ModelMessage level (e.g., system messages with cacheControl)
        ..."providerOptions" in coreMessage && coreMessage.providerOptions ? { providerMetadata: coreMessage.providerOptions } : {}
      });
    } else if (Array.isArray(coreMessage.content)) {
      for (const part of coreMessage.content) {
        switch (part.type) {
          case "text":
            const prevPart = parts.at(-1);
            if (coreMessage.role === "assistant" && prevPart && isToolUIPart(prevPart) && prevPart.state === "output-available") {
              parts.push({
                type: "step-start"
              });
            }
            const mergedProviderMetadataV3 = {
              ..."providerOptions" in coreMessage && coreMessage.providerOptions ? coreMessage.providerOptions : {},
              ...part.providerOptions || {}
            };
            parts.push({
              type: "text",
              text: part.text,
              ...Object.keys(mergedProviderMetadataV3).length > 0 ? { providerMetadata: mergedProviderMetadataV3 } : {}
            });
            break;
          case "tool-call":
            parts.push({
              type: `tool-${part.toolName}`,
              state: "input-available",
              toolCallId: part.toolCallId,
              input: part.input
            });
            break;
          case "tool-result":
            parts.push({
              type: `tool-${part.toolName}`,
              state: "output-available",
              toolCallId: part.toolCallId,
              output: typeof part.output === "string" ? { type: "text", value: part.output } : part.output ?? { type: "text", value: "" },
              input: {},
              callProviderMetadata: part.providerOptions
            });
            break;
          case "reasoning":
            parts.push({
              type: "reasoning",
              text: part.text,
              providerMetadata: part.providerOptions
            });
            break;
          case "image": {
            let imageData;
            let extractedMimeType = part.mediaType;
            const imageStr = imageContentToDataUri(part.image, extractedMimeType || "image/png");
            const parsed = parseDataUri(imageStr);
            if (parsed.isDataUri) {
              imageData = parsed.base64Content;
              if (!extractedMimeType && parsed.mimeType) {
                extractedMimeType = parsed.mimeType;
              }
            } else if (imageStr.startsWith("http://") || imageStr.startsWith("https://")) {
              parts.push({
                type: "file",
                url: imageStr,
                mediaType: part.mediaType || "image/jpeg",
                // Default to image/jpeg for URLs
                providerMetadata: part.providerOptions
              });
              break;
            } else {
              imageData = imageStr;
            }
            const finalMimeType = extractedMimeType || "image/jpeg";
            const dataUri = imageData.startsWith("data:") ? imageData : createDataUri(imageData, finalMimeType);
            parts.push({
              type: "file",
              url: dataUri,
              mediaType: finalMimeType,
              providerMetadata: part.providerOptions
            });
            break;
          }
          case "file": {
            if (part.data instanceof URL) {
              const urlStr = part.data.toString();
              let extractedMimeType = part.mediaType;
              const parsed = parseDataUri(urlStr);
              if (parsed.isDataUri) {
                if (!extractedMimeType && parsed.mimeType) {
                  extractedMimeType = parsed.mimeType;
                }
                if (parsed.base64Content !== urlStr) {
                  const dataUri = createDataUri(parsed.base64Content, extractedMimeType || "image/png");
                  parts.push({
                    type: "file",
                    url: dataUri,
                    mediaType: extractedMimeType || "image/png",
                    providerMetadata: part.providerOptions
                  });
                } else {
                  parts.push({
                    type: "file",
                    url: urlStr,
                    mediaType: part.mediaType || "image/png",
                    providerMetadata: part.providerOptions
                  });
                }
              } else {
                parts.push({
                  type: "file",
                  url: urlStr,
                  mediaType: part.mediaType || "application/octet-stream",
                  providerMetadata: part.providerOptions
                });
              }
            } else if (typeof part.data === "string") {
              const categorized = categorizeFileData(part.data, part.mediaType);
              if (categorized.type === "url" || categorized.type === "dataUri") {
                parts.push({
                  type: "file",
                  url: part.data,
                  mediaType: categorized.mimeType || "application/octet-stream",
                  providerMetadata: part.providerOptions
                });
              } else {
                try {
                  const base64Data = convertDataContentToBase64String(part.data);
                  const dataUri = createDataUri(base64Data, categorized.mimeType || "image/png");
                  parts.push({
                    type: "file",
                    url: dataUri,
                    mediaType: categorized.mimeType || "image/png",
                    providerMetadata: part.providerOptions
                  });
                } catch (error) {
                  console.error(`Failed to convert binary data to base64 in CoreMessage file part: ${error}`, error);
                }
              }
            } else {
              try {
                const base64Data = convertDataContentToBase64String(part.data);
                const dataUri = createDataUri(base64Data, part.mediaType || "image/png");
                parts.push({
                  type: "file",
                  url: dataUri,
                  mediaType: part.mediaType || "image/png",
                  providerMetadata: part.providerOptions
                });
              } catch (error) {
                console.error(`Failed to convert binary data to base64 in CoreMessage file part: ${error}`, error);
              }
            }
            break;
          }
        }
      }
    }
    const content = {
      format: 3,
      parts
    };
    if (coreMessage.content) {
      content.metadata = {
        ...content.metadata || {},
        __originalContent: coreMessage.content
      };
    }
    return {
      id,
      role: _MessageList.getRole(coreMessage),
      createdAt: this.generateCreatedAt(messageSource),
      threadId: this.memoryInfo?.threadId,
      resourceId: this.memoryInfo?.resourceId,
      content
    };
  }
  static hasAIV5UIMessageCharacteristics(msg) {
    if (`toolInvocations` in msg || `reasoning` in msg || `experimental_attachments` in msg || `data` in msg || `annotations` in msg)
      return false;
    if (!msg.parts) return false;
    for (const part of msg.parts) {
      if (`metadata` in part) return true;
      if (`toolInvocation` in part) return false;
      if (`toolCallId` in part) return true;
      if (part.type === `source`) return false;
      if (part.type === `source-url`) return true;
      if (part.type === `reasoning`) {
        if (`state` in part || `text` in part) return true;
        if (`reasoning` in part || `details` in part) return false;
      }
      if (part.type === `file` && `mediaType` in part) return true;
    }
    return false;
  }
  static isAIV5UIMessage(msg) {
    return !_MessageList.isMastraMessage(msg) && !_MessageList.isAIV5CoreMessage(msg) && `parts` in msg && _MessageList.hasAIV5UIMessageCharacteristics(msg);
  }
  static hasAIV5CoreMessageCharacteristics(msg) {
    if (`experimental_providerMetadata` in msg) return false;
    if (typeof msg.content === `string`) return false;
    for (const part of msg.content) {
      if (part.type === `tool-result` && `output` in part) return true;
      if (part.type === `tool-call` && `input` in part) return true;
      if (part.type === `tool-result` && `result` in part) return false;
      if (part.type === `tool-call` && `args` in part) return false;
      if (`mediaType` in part) return true;
      if (`mimeType` in part) return false;
      if (`experimental_providerMetadata` in part) return false;
      if (part.type === `reasoning` && `signature` in part) return false;
      if (part.type === `redacted-reasoning`) return false;
    }
    return false;
  }
  static cacheKeyFromAIV5Parts(parts) {
    let key = ``;
    for (const part of parts) {
      key += part.type;
      if (part.type === `text`) {
        key += part.text;
      }
      if (isToolUIPart(part) || part.type === "dynamic-tool") {
        key += part.toolCallId;
        key += part.state;
      }
      if (part.type === `reasoning`) {
        key += part.text;
      }
      if (part.type === `file`) {
        key += part.url.length;
        key += part.mediaType;
        key += part.filename || "";
      }
    }
    return key;
  }
  static cacheKeyFromAIV5ModelMessageContent(content) {
    if (typeof content === `string`) return content;
    let key = ``;
    for (const part of content) {
      key += part.type;
      if (part.type === `text`) {
        key += part.text.length;
      }
      if (part.type === `reasoning`) {
        key += part.text.length;
      }
      if (part.type === `tool-call`) {
        key += part.toolCallId;
        key += part.toolName;
      }
      if (part.type === `tool-result`) {
        key += part.toolCallId;
        key += part.toolName;
      }
      if (part.type === `file`) {
        key += part.filename;
        key += part.mediaType;
      }
      if (part.type === `image`) {
        key += getImageCacheKey(part.image);
        key += part.mediaType;
      }
    }
    return key;
  }
};

// src/agent/message-list/utils/convert-messages.ts
var MessageConverter = class {
  messageList;
  constructor(messages) {
    this.messageList = new MessageList();
    this.messageList.add(messages, "memory");
  }
  to(format) {
    switch (format) {
      case "Mastra.V2":
        return this.messageList.get.all.v2();
      case "AIV4.UI":
        return this.messageList.get.all.aiV4.ui();
      case "AIV4.Core":
        return this.messageList.get.all.aiV4.core();
      case "AIV5.UI":
        return this.messageList.get.all.aiV5.ui();
      case "AIV5.Model":
        return this.messageList.get.all.aiV5.model();
      default:
        throw new Error(`Unsupported output format: ${format}`);
    }
  }
};
function convertMessages(messages) {
  return new MessageConverter(messages);
}

export { APICallError as A, DefaultGeneratedFile as D, MessageList as M, createTextStreamResponse as a, createUIMessageStreamResponse as b, convertMessages as c, createUIMessageStream as d, DefaultGeneratedFileWithType as e, asSchema as f, generateId as g, isAbortError as h, isDeepEqualData as i, jsonSchema as j, injectJsonInstructionIntoMessages as k, parsePartialJson as p, stepCountIs as s, tool as t };
