import { M as MessageList, a as createTextStreamResponse, b as createUIMessageStreamResponse, d as createUIMessageStream, D as DefaultGeneratedFile, e as DefaultGeneratedFileWithType, f as asSchema, p as parsePartialJson, i as isDeepEqualData, j as jsonSchema$1, g as generateId, s as stepCountIs, h as isAbortError, k as injectJsonInstructionIntoMessages, A as APICallError, t as tool } from './chunk-E3PG7G6E.mjs';
import { I as InstrumentClass, T as Telemetry, c as context } from './telemetry.mjs';
import { M as MastraError, g as getErrorFromUnknown, s as safeParseErrorObject } from './error.mjs';
import { M as MastraBase, R as RegisteredLogger, C as ConsoleLogger } from './_commonjsHelpers.mjs';
import { r as resolveModelConfig } from './netlify-VJXBII33.mjs';
import { O as OpenAIReasoningSchemaCompatLayer, e as OpenAISchemaCompatLayer, G as GoogleSchemaCompatLayer, h as AnthropicSchemaCompatLayer, D as DeepSeekSchemaCompatLayer, M as MetaSchemaCompatLayer, i as applyCompatLayer, j as isZodType, k as jsonSchema, o as output_exports, l as generateText, m as generateObject, n as streamText, p as streamObject, q as delay, r as ensureToolProperties, t as makeCoreTool, u as createMastraProxy, v as getOrCreateSpan, w as getValidTraceId, T as ToolStream, x as wrapMastra, y as selectFields, z as ModelSpanTracker } from './ai-tracing.mjs';
import { a as zodToJsonSchema } from './zod-to-json.mjs';
import { f as ZodArray, o as objectType, s as stringType, u as unionType, i as instanceOfType, a as anyType, r as recordType, a6 as booleanType, ad as functionType, an as literalType, aJ as undefinedType, aI as tupleType, aC as promiseType, a8 as dateType } from './v3.mjs';
import { e as executeHook } from './hooks.mjs';
import { RuntimeContext } from './@mastra-core-runtime-context.mjs';
import { T as Tool, c as createTool } from './tools.mjs';
import EventEmitter$1, { EventEmitter } from 'events';
import { TransformStream, ReadableStream as ReadableStream$1, WritableStream as WritableStream$1 } from 'stream/web';
import { z } from './zod.mjs';
import { randomUUID } from 'crypto';
import { t as trace } from './trace-api.mjs';
import { z as z$1 } from './zod-v4.mjs';

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __typeError = msg => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", {
  value,
  configurable: true
});
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
    exports: {}
  }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
// If the importer is in node compatibility mode or this is not an ESM
// file that has been converted to a CommonJS file using a Babel-
// compatible transform (i.e. "__esModule" has not been set), then set
// "default" to the CommonJS "module.exports" for node compatibility.
__defProp(target, "default", {
  value: mod,
  enumerable: true
}) , mod));
var __decoratorStart = base => [,,, __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = fn => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({
  kind: __decoratorStrings[kind],
  name,
  metadata,
  addInitializer: fn => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null))
});
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) fns[i].call(self) ;
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var it,
    done,
    ctx,
    k = flags & 7,
    p = false;
  var j = 0;
  var extraInitializers = array[j] || (array[j] = []);
  var desc = k && ((target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(target , name));
  __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    it = (0, decorators[i])(target, ctx), done._ = 1;
    __expectFn(it) && (target = it);
  }
  return __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};

// src/voice/voice.ts
var _MastraVoice_decorators, _init$1, _a$2;
_MastraVoice_decorators = [InstrumentClass({
  prefix: "voice",
  excludeMethods: ["__setTools", "__setLogger", "__setTelemetry", "#log"]
})];
var MastraVoice = class extends (_a$2 = MastraBase) {
  listeningModel;
  speechModel;
  speaker;
  realtimeConfig;
  constructor({
    listeningModel,
    speechModel,
    speaker,
    realtimeConfig,
    name
  } = {}) {
    super({
      component: "VOICE",
      name
    });
    this.listeningModel = listeningModel;
    this.speechModel = speechModel;
    this.speaker = speaker;
    this.realtimeConfig = realtimeConfig;
  }
  traced(method, methodName) {
    return this.telemetry?.traceMethod(method, {
      spanName: `voice.${methodName}`,
      attributes: {
        "voice.type": this.speechModel?.name || this.listeningModel?.name || "unknown"
      }
    }) ?? method;
  }
  updateConfig(_options) {
    this.logger.warn("updateConfig not implemented by this voice provider");
  }
  /**
   * Initializes a WebSocket or WebRTC connection for real-time communication
   * @returns Promise that resolves when the connection is established
   */
  connect(_options) {
    this.logger.warn("connect not implemented by this voice provider");
    return Promise.resolve();
  }
  /**
   * Relay audio data to the voice provider for real-time processing
   * @param audioData Audio data to relay
   */
  send(_audioData) {
    this.logger.warn("relay not implemented by this voice provider");
    return Promise.resolve();
  }
  /**
   * Trigger voice providers to respond
   */
  answer(_options) {
    this.logger.warn("answer not implemented by this voice provider");
    return Promise.resolve();
  }
  /**
   * Equip the voice provider with instructions
   * @param instructions Instructions to add
   */
  addInstructions(_instructions) {}
  /**
   * Equip the voice provider with tools
   * @param tools Array of tools to add
   */
  addTools(_tools) {}
  /**
   * Disconnect from the WebSocket or WebRTC connection
   */
  close() {
    this.logger.warn("close not implemented by this voice provider");
  }
  /**
   * Register an event listener
   * @param event Event name (e.g., 'speaking', 'writing', 'error')
   * @param callback Callback function that receives event data
   */
  on(_event, _callback) {
    this.logger.warn("on not implemented by this voice provider");
  }
  /**
   * Remove an event listener
   * @param event Event name (e.g., 'speaking', 'writing', 'error')
   * @param callback Callback function to remove
   */
  off(_event, _callback) {
    this.logger.warn("off not implemented by this voice provider");
  }
  /**
   * Get available speakers/voices
   * @returns Array of available voice IDs and their metadata
   */
  getSpeakers() {
    this.logger.warn("getSpeakers not implemented by this voice provider");
    return Promise.resolve([]);
  }
  /**
   * Get available speakers/voices
   * @returns Array of available voice IDs and their metadata
   */
  getListener() {
    this.logger.warn("getListener not implemented by this voice provider");
    return Promise.resolve({
      enabled: false
    });
  }
};
MastraVoice = /*@__PURE__*/(_ => {
  _init$1 = __decoratorStart(_a$2);
  MastraVoice = __decorateElement(_init$1, 0, "MastraVoice", _MastraVoice_decorators, MastraVoice);
  __runInitializers(_init$1, 1, MastraVoice);

  // src/voice/composite-voice.ts
  return MastraVoice;
})();

// src/voice/default-voice.ts
var DefaultVoice = class extends MastraVoice {
  constructor() {
    super();
  }
  async speak(_input) {
    throw new MastraError({
      id: "VOICE_DEFAULT_NO_SPEAK_PROVIDER",
      text: "No voice provider configured",
      domain: "MASTRA_VOICE" /* MASTRA_VOICE */,
      category: "USER" /* USER */
    });
  }
  async listen(_input) {
    throw new MastraError({
      id: "VOICE_DEFAULT_NO_LISTEN_PROVIDER",
      text: "No voice provider configured",
      domain: "MASTRA_VOICE" /* MASTRA_VOICE */,
      category: "USER" /* USER */
    });
  }
  async getSpeakers() {
    throw new MastraError({
      id: "VOICE_DEFAULT_NO_SPEAKERS_PROVIDER",
      text: "No voice provider configured",
      domain: "MASTRA_VOICE" /* MASTRA_VOICE */,
      category: "USER" /* USER */
    });
  }
  async getListener() {
    throw new MastraError({
      id: "VOICE_DEFAULT_NO_LISTENER_PROVIDER",
      text: "No voice provider configured",
      domain: "MASTRA_VOICE" /* MASTRA_VOICE */,
      category: "USER" /* USER */
    });
  }
};

// src/workflows/constants.ts
var EMITTER_SYMBOL = Symbol("emitter");
var STREAM_FORMAT_SYMBOL = Symbol("stream_format");

var MastraLLMV1 = class extends MastraBase {
  #model;
  #mastra;
  #options;
  constructor({ model, mastra, options }) {
    super({ name: "aisdk" });
    this.#model = model;
    this.#options = options;
    if (mastra) {
      this.#mastra = mastra;
      if (mastra.getLogger()) {
        this.__setLogger(this.#mastra.getLogger());
      }
    }
  }
  __registerPrimitives(p) {
    if (p.telemetry) {
      this.__setTelemetry(p.telemetry);
    }
    if (p.logger) {
      this.__setLogger(p.logger);
    }
  }
  __registerMastra(p) {
    this.#mastra = p;
  }
  getProvider() {
    return this.#model.provider;
  }
  getModelId() {
    return this.#model.modelId;
  }
  getModel() {
    return this.#model;
  }
  _applySchemaCompat(schema) {
    const model = this.#model;
    const schemaCompatLayers = [];
    if (model) {
      const modelInfo = {
        modelId: model.modelId,
        supportsStructuredOutputs: model.supportsStructuredOutputs ?? false,
        provider: model.provider
      };
      schemaCompatLayers.push(
        new OpenAIReasoningSchemaCompatLayer(modelInfo),
        new OpenAISchemaCompatLayer(modelInfo),
        new GoogleSchemaCompatLayer(modelInfo),
        new AnthropicSchemaCompatLayer(modelInfo),
        new DeepSeekSchemaCompatLayer(modelInfo),
        new MetaSchemaCompatLayer(modelInfo)
      );
    }
    return applyCompatLayer({
      schema,
      compatLayers: schemaCompatLayers,
      mode: "aiSdkSchema"
    });
  }
  async __text({
    runId,
    messages,
    maxSteps = 5,
    tools = {},
    temperature,
    toolChoice = "auto",
    onStepFinish,
    experimental_output,
    telemetry,
    threadId,
    resourceId,
    runtimeContext,
    tracingContext,
    ...rest
  }) {
    const model = this.#model;
    this.logger.debug(`[LLM] - Generating text`, {
      runId,
      messages,
      maxSteps,
      threadId,
      resourceId,
      tools: Object.keys(tools)
    });
    let schema = void 0;
    if (experimental_output) {
      this.logger.debug("[LLM] - Using experimental output", {
        runId
      });
      if (isZodType(experimental_output)) {
        schema = experimental_output;
        if (schema instanceof ZodArray) {
          schema = schema._def.type;
        }
        let jsonSchemaToUse;
        jsonSchemaToUse = zodToJsonSchema(schema, "jsonSchema7");
        schema = jsonSchema(jsonSchemaToUse);
      } else {
        schema = jsonSchema(experimental_output);
      }
    }
    const llmSpan = tracingContext.currentSpan?.createChildSpan({
      name: `llm: '${model.modelId}'`,
      type: "model_generation" /* MODEL_GENERATION */,
      input: {
        messages,
        schema
      },
      attributes: {
        model: model.modelId,
        provider: model.provider,
        parameters: {
          temperature,
          maxOutputTokens: rest.maxTokens,
          topP: rest.topP,
          frequencyPenalty: rest.frequencyPenalty,
          presencePenalty: rest.presencePenalty
        },
        streaming: false
      },
      metadata: {
        runId,
        threadId,
        resourceId
      },
      tracingPolicy: this.#options?.tracingPolicy
    });
    const argsForExecute = {
      ...rest,
      messages,
      model,
      temperature,
      tools: {
        ...tools
      },
      toolChoice,
      maxSteps,
      onStepFinish: async (props) => {
        try {
          await onStepFinish?.({ ...props, runId });
        } catch (e) {
          const mastraError = new MastraError(
            {
              id: "LLM_TEXT_ON_STEP_FINISH_CALLBACK_EXECUTION_FAILED",
              domain: "LLM" /* LLM */,
              category: "USER" /* USER */,
              details: {
                modelId: model.modelId,
                modelProvider: model.provider,
                runId: runId ?? "unknown",
                threadId: threadId ?? "unknown",
                resourceId: resourceId ?? "unknown",
                finishReason: props?.finishReason,
                toolCalls: props?.toolCalls ? JSON.stringify(props.toolCalls) : "",
                toolResults: props?.toolResults ? JSON.stringify(props.toolResults) : "",
                usage: props?.usage ? JSON.stringify(props.usage) : ""
              }
            },
            e
          );
          throw mastraError;
        }
        this.logger.debug("[LLM] - Text Step Change:", {
          text: props?.text,
          toolCalls: props?.toolCalls,
          toolResults: props?.toolResults,
          finishReason: props?.finishReason,
          usage: props?.usage,
          runId
        });
        if (props?.response?.headers?.["x-ratelimit-remaining-tokens"] && parseInt(props?.response?.headers?.["x-ratelimit-remaining-tokens"], 10) < 2e3) {
          this.logger.warn("Rate limit approaching, waiting 10 seconds", { runId });
          await delay(10 * 1e3);
        }
      },
      experimental_telemetry: {
        ...this.experimental_telemetry,
        ...telemetry
      },
      experimental_output: schema ? output_exports.object({
        schema
      }) : void 0
    };
    try {
      const result = await generateText(argsForExecute);
      if (schema && result.finishReason === "stop") {
        result.object = result.experimental_output;
      }
      llmSpan?.end({
        output: {
          text: result.text,
          object: result.object,
          reasoning: result.reasoningDetails,
          reasoningText: result.reasoning,
          files: result.files,
          sources: result.sources,
          warnings: result.warnings
        },
        attributes: {
          finishReason: result.finishReason,
          usage: result.usage
        }
      });
      return result;
    } catch (e) {
      const mastraError = new MastraError(
        {
          id: "LLM_GENERATE_TEXT_AI_SDK_EXECUTION_FAILED",
          domain: "LLM" /* LLM */,
          category: "THIRD_PARTY" /* THIRD_PARTY */,
          details: {
            modelId: model.modelId,
            modelProvider: model.provider,
            runId: runId ?? "unknown",
            threadId: threadId ?? "unknown",
            resourceId: resourceId ?? "unknown"
          }
        },
        e
      );
      llmSpan?.error({ error: mastraError });
      throw mastraError;
    }
  }
  async __textObject({
    messages,
    structuredOutput,
    runId,
    telemetry,
    threadId,
    resourceId,
    runtimeContext,
    tracingContext,
    ...rest
  }) {
    const model = this.#model;
    this.logger.debug(`[LLM] - Generating a text object`, { runId });
    const llmSpan = tracingContext.currentSpan?.createChildSpan({
      name: `llm: '${model.modelId}'`,
      type: "model_generation" /* MODEL_GENERATION */,
      input: {
        messages
      },
      attributes: {
        model: model.modelId,
        provider: model.provider,
        parameters: {
          temperature: rest.temperature,
          maxOutputTokens: rest.maxTokens,
          topP: rest.topP,
          frequencyPenalty: rest.frequencyPenalty,
          presencePenalty: rest.presencePenalty
        },
        streaming: false
      },
      metadata: {
        runId,
        threadId,
        resourceId
      },
      tracingPolicy: this.#options?.tracingPolicy
    });
    try {
      let output = "object";
      if (structuredOutput instanceof ZodArray) {
        output = "array";
        structuredOutput = structuredOutput._def.type;
      }
      const processedSchema = this._applySchemaCompat(structuredOutput);
      llmSpan?.update({
        input: {
          messages,
          schema: processedSchema
        }
      });
      const argsForExecute = {
        ...rest,
        messages,
        model,
        // @ts-expect-error - output in our implementation can only be object or array
        output,
        schema: processedSchema,
        experimental_telemetry: {
          ...this.experimental_telemetry,
          ...telemetry
        }
      };
      try {
        const result = await generateObject(argsForExecute);
        llmSpan?.end({
          output: {
            object: result.object,
            warnings: result.warnings
          },
          attributes: {
            finishReason: result.finishReason,
            usage: result.usage
          }
        });
        return result;
      } catch (e) {
        const mastraError = new MastraError(
          {
            id: "LLM_GENERATE_OBJECT_AI_SDK_EXECUTION_FAILED",
            domain: "LLM" /* LLM */,
            category: "THIRD_PARTY" /* THIRD_PARTY */,
            details: {
              modelId: model.modelId,
              modelProvider: model.provider,
              runId: runId ?? "unknown",
              threadId: threadId ?? "unknown",
              resourceId: resourceId ?? "unknown"
            }
          },
          e
        );
        llmSpan?.error({ error: mastraError });
        throw mastraError;
      }
    } catch (e) {
      if (e instanceof MastraError) {
        throw e;
      }
      const mastraError = new MastraError(
        {
          id: "LLM_GENERATE_OBJECT_AI_SDK_SCHEMA_CONVERSION_FAILED",
          domain: "LLM" /* LLM */,
          category: "USER" /* USER */,
          details: {
            modelId: model.modelId,
            modelProvider: model.provider,
            runId: runId ?? "unknown",
            threadId: threadId ?? "unknown",
            resourceId: resourceId ?? "unknown"
          }
        },
        e
      );
      llmSpan?.error({ error: mastraError });
      throw mastraError;
    }
  }
  __stream({
    messages,
    onStepFinish,
    onFinish,
    maxSteps = 5,
    tools = {},
    runId,
    temperature,
    toolChoice = "auto",
    experimental_output,
    telemetry,
    threadId,
    resourceId,
    runtimeContext,
    tracingContext,
    ...rest
  }) {
    const model = this.#model;
    this.logger.debug(`[LLM] - Streaming text`, {
      runId,
      threadId,
      resourceId,
      messages,
      maxSteps,
      tools: Object.keys(tools || {})
    });
    let schema;
    if (experimental_output) {
      this.logger.debug("[LLM] - Using experimental output", {
        runId
      });
      if (typeof experimental_output.parse === "function") {
        schema = experimental_output;
        if (schema instanceof ZodArray) {
          schema = schema._def.type;
        }
      } else {
        schema = jsonSchema(experimental_output);
      }
    }
    const llmSpan = tracingContext.currentSpan?.createChildSpan({
      name: `llm: '${model.modelId}'`,
      type: "model_generation" /* MODEL_GENERATION */,
      input: {
        messages
      },
      attributes: {
        model: model.modelId,
        provider: model.provider,
        parameters: {
          temperature,
          maxOutputTokens: rest.maxTokens,
          topP: rest.topP,
          frequencyPenalty: rest.frequencyPenalty,
          presencePenalty: rest.presencePenalty
        },
        streaming: true
      },
      metadata: {
        runId,
        threadId,
        resourceId
      },
      tracingPolicy: this.#options?.tracingPolicy
    });
    const argsForExecute = {
      model,
      temperature,
      tools: {
        ...tools
      },
      maxSteps,
      toolChoice,
      onStepFinish: async (props) => {
        try {
          await onStepFinish?.({ ...props, runId });
        } catch (e) {
          const mastraError = new MastraError(
            {
              id: "LLM_STREAM_ON_STEP_FINISH_CALLBACK_EXECUTION_FAILED",
              domain: "LLM" /* LLM */,
              category: "USER" /* USER */,
              details: {
                modelId: model.modelId,
                modelProvider: model.provider,
                runId: runId ?? "unknown",
                threadId: threadId ?? "unknown",
                resourceId: resourceId ?? "unknown",
                finishReason: props?.finishReason,
                toolCalls: props?.toolCalls ? JSON.stringify(props.toolCalls) : "",
                toolResults: props?.toolResults ? JSON.stringify(props.toolResults) : "",
                usage: props?.usage ? JSON.stringify(props.usage) : ""
              }
            },
            e
          );
          this.logger.trackException(mastraError);
          llmSpan?.error({ error: mastraError });
          throw mastraError;
        }
        this.logger.debug("[LLM] - Stream Step Change:", {
          text: props?.text,
          toolCalls: props?.toolCalls,
          toolResults: props?.toolResults,
          finishReason: props?.finishReason,
          usage: props?.usage,
          runId
        });
        if (props?.response?.headers?.["x-ratelimit-remaining-tokens"] && parseInt(props?.response?.headers?.["x-ratelimit-remaining-tokens"], 10) < 2e3) {
          this.logger.warn("Rate limit approaching, waiting 10 seconds", { runId });
          await delay(10 * 1e3);
        }
      },
      onFinish: async (props) => {
        llmSpan?.end({
          output: {
            text: props?.text,
            reasoning: props?.reasoningDetails,
            reasoningText: props?.reasoning,
            files: props?.files,
            sources: props?.sources,
            warnings: props?.warnings
          },
          attributes: {
            finishReason: props?.finishReason,
            usage: props?.usage
          }
        });
        try {
          await onFinish?.({ ...props, runId });
        } catch (e) {
          const mastraError = new MastraError(
            {
              id: "LLM_STREAM_ON_FINISH_CALLBACK_EXECUTION_FAILED",
              domain: "LLM" /* LLM */,
              category: "USER" /* USER */,
              details: {
                modelId: model.modelId,
                modelProvider: model.provider,
                runId: runId ?? "unknown",
                threadId: threadId ?? "unknown",
                resourceId: resourceId ?? "unknown",
                finishReason: props?.finishReason,
                toolCalls: props?.toolCalls ? JSON.stringify(props.toolCalls) : "",
                toolResults: props?.toolResults ? JSON.stringify(props.toolResults) : "",
                usage: props?.usage ? JSON.stringify(props.usage) : ""
              }
            },
            e
          );
          llmSpan?.error({ error: mastraError });
          this.logger.trackException(mastraError);
          throw mastraError;
        }
        this.logger.debug("[LLM] - Stream Finished:", {
          text: props?.text,
          toolCalls: props?.toolCalls,
          toolResults: props?.toolResults,
          finishReason: props?.finishReason,
          usage: props?.usage,
          runId,
          threadId,
          resourceId
        });
      },
      ...rest,
      messages,
      experimental_telemetry: {
        ...this.experimental_telemetry,
        ...telemetry
      },
      experimental_output: schema ? output_exports.object({
        schema
      }) : void 0
    };
    try {
      return streamText(argsForExecute);
    } catch (e) {
      const mastraError = new MastraError(
        {
          id: "LLM_STREAM_TEXT_AI_SDK_EXECUTION_FAILED",
          domain: "LLM" /* LLM */,
          category: "THIRD_PARTY" /* THIRD_PARTY */,
          details: {
            modelId: model.modelId,
            modelProvider: model.provider,
            runId: runId ?? "unknown",
            threadId: threadId ?? "unknown",
            resourceId: resourceId ?? "unknown"
          }
        },
        e
      );
      llmSpan?.error({ error: mastraError });
      throw mastraError;
    }
  }
  __streamObject({
    messages,
    runId,
    runtimeContext,
    threadId,
    resourceId,
    onFinish,
    structuredOutput,
    telemetry,
    tracingContext,
    ...rest
  }) {
    const model = this.#model;
    this.logger.debug(`[LLM] - Streaming structured output`, {
      runId,
      messages
    });
    const llmSpan = tracingContext.currentSpan?.createChildSpan({
      name: `llm: '${model.modelId}'`,
      type: "model_generation" /* MODEL_GENERATION */,
      input: {
        messages
      },
      attributes: {
        model: model.modelId,
        provider: model.provider,
        parameters: {
          temperature: rest.temperature,
          maxOutputTokens: rest.maxTokens,
          topP: rest.topP,
          frequencyPenalty: rest.frequencyPenalty,
          presencePenalty: rest.presencePenalty
        },
        streaming: true
      },
      metadata: {
        runId,
        threadId,
        resourceId
      },
      tracingPolicy: this.#options?.tracingPolicy
    });
    try {
      let output = "object";
      if (structuredOutput instanceof ZodArray) {
        output = "array";
        structuredOutput = structuredOutput._def.type;
      }
      const processedSchema = this._applySchemaCompat(structuredOutput);
      llmSpan?.update({
        input: {
          messages,
          schema: processedSchema
        }
      });
      const argsForExecute = {
        ...rest,
        model,
        onFinish: async (props) => {
          llmSpan?.end({
            output: {
              text: props?.text,
              object: props?.object,
              reasoning: props?.reasoningDetails,
              reasoningText: props?.reasoning,
              files: props?.files,
              sources: props?.sources,
              warnings: props?.warnings
            },
            attributes: {
              finishReason: props?.finishReason,
              usage: props?.usage
            }
          });
          try {
            await onFinish?.({ ...props, runId });
          } catch (e) {
            const mastraError = new MastraError(
              {
                id: "LLM_STREAM_OBJECT_ON_FINISH_CALLBACK_EXECUTION_FAILED",
                domain: "LLM" /* LLM */,
                category: "USER" /* USER */,
                details: {
                  modelId: model.modelId,
                  modelProvider: model.provider,
                  runId: runId ?? "unknown",
                  threadId: threadId ?? "unknown",
                  resourceId: resourceId ?? "unknown",
                  toolCalls: "",
                  toolResults: "",
                  finishReason: "",
                  usage: props?.usage ? JSON.stringify(props.usage) : ""
                }
              },
              e
            );
            this.logger.trackException(mastraError);
            llmSpan?.error({ error: mastraError });
            throw mastraError;
          }
          this.logger.debug("[LLM] - Object Stream Finished:", {
            usage: props?.usage,
            runId,
            threadId,
            resourceId
          });
        },
        messages,
        // @ts-expect-error - output in our implementation can only be object or array
        output,
        experimental_telemetry: {
          ...this.experimental_telemetry,
          ...telemetry
        },
        schema: processedSchema
      };
      try {
        return streamObject(argsForExecute);
      } catch (e) {
        const mastraError = new MastraError(
          {
            id: "LLM_STREAM_OBJECT_AI_SDK_EXECUTION_FAILED",
            domain: "LLM" /* LLM */,
            category: "THIRD_PARTY" /* THIRD_PARTY */,
            details: {
              modelId: model.modelId,
              modelProvider: model.provider,
              runId: runId ?? "unknown",
              threadId: threadId ?? "unknown",
              resourceId: resourceId ?? "unknown"
            }
          },
          e
        );
        llmSpan?.error({ error: mastraError });
        throw mastraError;
      }
    } catch (e) {
      if (e instanceof MastraError) {
        llmSpan?.error({ error: e });
        throw e;
      }
      const mastraError = new MastraError(
        {
          id: "LLM_STREAM_OBJECT_AI_SDK_SCHEMA_CONVERSION_FAILED",
          domain: "LLM" /* LLM */,
          category: "USER" /* USER */,
          details: {
            modelId: model.modelId,
            modelProvider: model.provider,
            runId: runId ?? "unknown",
            threadId: threadId ?? "unknown",
            resourceId: resourceId ?? "unknown"
          }
        },
        e
      );
      llmSpan?.error({ error: mastraError });
      throw mastraError;
    }
  }
  convertToMessages(messages) {
    if (Array.isArray(messages)) {
      return messages.map((m) => {
        if (typeof m === "string") {
          return {
            role: "user",
            content: m
          };
        }
        return m;
      });
    }
    return [
      {
        role: "user",
        content: messages
      }
    ];
  }
  async generate(messages, {
    output,
    ...rest
  }) {
    const msgs = this.convertToMessages(messages);
    if (!output) {
      const { maxSteps, onStepFinish, ...textOptions } = rest;
      return await this.__text({
        messages: msgs,
        maxSteps,
        onStepFinish,
        ...textOptions
      });
    }
    return await this.__textObject({
      messages: msgs,
      structuredOutput: output,
      ...rest
    });
  }
  stream(messages, {
    maxSteps = 5,
    output,
    onFinish,
    ...rest
  }) {
    const msgs = this.convertToMessages(messages);
    if (!output) {
      return this.__stream({
        messages: msgs,
        maxSteps,
        onFinish,
        ...rest
      });
    }
    return this.__streamObject({
      messages: msgs,
      structuredOutput: output,
      onFinish,
      ...rest
    });
  }
};

// src/errors/ai-sdk-error.ts
var marker = "vercel.ai.error";
var symbol = Symbol.for(marker);
var _a$1;
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
    return _AISDKError.hasMarker(error, marker);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a$1 = symbol;
var AISDKError = _AISDKError;

// src/errors/get-error-message.ts
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

// src/errors/type-validation-error.ts
var name12 = "AI_TypeValidationError";
var marker13 = `vercel.ai.error.${name12}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var _TypeValidationError = class _TypeValidationError extends AISDKError {
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
    return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
  }
};
_a13 = symbol13;
var TypeValidationError = _TypeValidationError;

function escapeStringRegexp(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}

const replacements = [
	// German umlauts
	['ß', 'ss'],
	['ẞ', 'Ss'],
	['ä', 'ae'],
	['Ä', 'Ae'],
	['ö', 'oe'],
	['Ö', 'Oe'],
	['ü', 'ue'],
	['Ü', 'Ue'],

	// Latin
	['À', 'A'],
	['Á', 'A'],
	['Â', 'A'],
	['Ã', 'A'],
	['Ä', 'Ae'],
	['Å', 'A'],
	['Æ', 'AE'],
	['Ç', 'C'],
	['È', 'E'],
	['É', 'E'],
	['Ê', 'E'],
	['Ë', 'E'],
	['Ì', 'I'],
	['Í', 'I'],
	['Î', 'I'],
	['Ï', 'I'],
	['Ð', 'D'],
	['Ñ', 'N'],
	['Ò', 'O'],
	['Ó', 'O'],
	['Ô', 'O'],
	['Õ', 'O'],
	['Ö', 'Oe'],
	['Ő', 'O'],
	['Ø', 'O'],
	['Ù', 'U'],
	['Ú', 'U'],
	['Û', 'U'],
	['Ü', 'Ue'],
	['Ű', 'U'],
	['Ý', 'Y'],
	['Þ', 'TH'],
	['ß', 'ss'],
	['à', 'a'],
	['á', 'a'],
	['â', 'a'],
	['ã', 'a'],
	['ä', 'ae'],
	['å', 'a'],
	['æ', 'ae'],
	['ç', 'c'],
	['è', 'e'],
	['é', 'e'],
	['ê', 'e'],
	['ë', 'e'],
	['ì', 'i'],
	['í', 'i'],
	['î', 'i'],
	['ï', 'i'],
	['ð', 'd'],
	['ñ', 'n'],
	['ò', 'o'],
	['ó', 'o'],
	['ô', 'o'],
	['õ', 'o'],
	['ö', 'oe'],
	['ő', 'o'],
	['ø', 'o'],
	['ù', 'u'],
	['ú', 'u'],
	['û', 'u'],
	['ü', 'ue'],
	['ű', 'u'],
	['ý', 'y'],
	['þ', 'th'],
	['ÿ', 'y'],
	['ẞ', 'SS'],

	// Vietnamese
	['à', 'a'],
	['À', 'A'],
	['á', 'a'],
	['Á', 'A'],
	['â', 'a'],
	['Â', 'A'],
	['ã', 'a'],
	['Ã', 'A'],
	['è', 'e'],
	['È', 'E'],
	['é', 'e'],
	['É', 'E'],
	['ê', 'e'],
	['Ê', 'E'],
	['ì', 'i'],
	['Ì', 'I'],
	['í', 'i'],
	['Í', 'I'],
	['ò', 'o'],
	['Ò', 'O'],
	['ó', 'o'],
	['Ó', 'O'],
	['ô', 'o'],
	['Ô', 'O'],
	['õ', 'o'],
	['Õ', 'O'],
	['ù', 'u'],
	['Ù', 'U'],
	['ú', 'u'],
	['Ú', 'U'],
	['ý', 'y'],
	['Ý', 'Y'],
	['ă', 'a'],
	['Ă', 'A'],
	['Đ', 'D'],
	['đ', 'd'],
	['ĩ', 'i'],
	['Ĩ', 'I'],
	['ũ', 'u'],
	['Ũ', 'U'],
	['ơ', 'o'],
	['Ơ', 'O'],
	['ư', 'u'],
	['Ư', 'U'],
	['ạ', 'a'],
	['Ạ', 'A'],
	['ả', 'a'],
	['Ả', 'A'],
	['ấ', 'a'],
	['Ấ', 'A'],
	['ầ', 'a'],
	['Ầ', 'A'],
	['ẩ', 'a'],
	['Ẩ', 'A'],
	['ẫ', 'a'],
	['Ẫ', 'A'],
	['ậ', 'a'],
	['Ậ', 'A'],
	['ắ', 'a'],
	['Ắ', 'A'],
	['ằ', 'a'],
	['Ằ', 'A'],
	['ẳ', 'a'],
	['Ẳ', 'A'],
	['ẵ', 'a'],
	['Ẵ', 'A'],
	['ặ', 'a'],
	['Ặ', 'A'],
	['ẹ', 'e'],
	['Ẹ', 'E'],
	['ẻ', 'e'],
	['Ẻ', 'E'],
	['ẽ', 'e'],
	['Ẽ', 'E'],
	['ế', 'e'],
	['Ế', 'E'],
	['ề', 'e'],
	['Ề', 'E'],
	['ể', 'e'],
	['Ể', 'E'],
	['ễ', 'e'],
	['Ễ', 'E'],
	['ệ', 'e'],
	['Ệ', 'E'],
	['ỉ', 'i'],
	['Ỉ', 'I'],
	['ị', 'i'],
	['Ị', 'I'],
	['ọ', 'o'],
	['Ọ', 'O'],
	['ỏ', 'o'],
	['Ỏ', 'O'],
	['ố', 'o'],
	['Ố', 'O'],
	['ồ', 'o'],
	['Ồ', 'O'],
	['ổ', 'o'],
	['Ổ', 'O'],
	['ỗ', 'o'],
	['Ỗ', 'O'],
	['ộ', 'o'],
	['Ộ', 'O'],
	['ớ', 'o'],
	['Ớ', 'O'],
	['ờ', 'o'],
	['Ờ', 'O'],
	['ở', 'o'],
	['Ở', 'O'],
	['ỡ', 'o'],
	['Ỡ', 'O'],
	['ợ', 'o'],
	['Ợ', 'O'],
	['ụ', 'u'],
	['Ụ', 'U'],
	['ủ', 'u'],
	['Ủ', 'U'],
	['ứ', 'u'],
	['Ứ', 'U'],
	['ừ', 'u'],
	['Ừ', 'U'],
	['ử', 'u'],
	['Ử', 'U'],
	['ữ', 'u'],
	['Ữ', 'U'],
	['ự', 'u'],
	['Ự', 'U'],
	['ỳ', 'y'],
	['Ỳ', 'Y'],
	['ỵ', 'y'],
	['Ỵ', 'Y'],
	['ỷ', 'y'],
	['Ỷ', 'Y'],
	['ỹ', 'y'],
	['Ỹ', 'Y'],

	// Arabic
	['ء', 'e'],
	['آ', 'a'],
	['أ', 'a'],
	['ؤ', 'w'],
	['إ', 'i'],
	['ئ', 'y'],
	['ا', 'a'],
	['ب', 'b'],
	['ة', 't'],
	['ت', 't'],
	['ث', 'th'],
	['ج', 'j'],
	['ح', 'h'],
	['خ', 'kh'],
	['د', 'd'],
	['ذ', 'dh'],
	['ر', 'r'],
	['ز', 'z'],
	['س', 's'],
	['ش', 'sh'],
	['ص', 's'],
	['ض', 'd'],
	['ط', 't'],
	['ظ', 'z'],
	['ع', 'e'],
	['غ', 'gh'],
	['ـ', '_'],
	['ف', 'f'],
	['ق', 'q'],
	['ك', 'k'],
	['ل', 'l'],
	['م', 'm'],
	['ن', 'n'],
	['ه', 'h'],
	['و', 'w'],
	['ى', 'a'],
	['ي', 'y'],
	['َ‎', 'a'],
	['ُ', 'u'],
	['ِ‎', 'i'],
	['٠', '0'],
	['١', '1'],
	['٢', '2'],
	['٣', '3'],
	['٤', '4'],
	['٥', '5'],
	['٦', '6'],
	['٧', '7'],
	['٨', '8'],
	['٩', '9'],

	// Persian / Farsi
	['چ', 'ch'],
	['ک', 'k'],
	['گ', 'g'],
	['پ', 'p'],
	['ژ', 'zh'],
	['ی', 'y'],
	['۰', '0'],
	['۱', '1'],
	['۲', '2'],
	['۳', '3'],
	['۴', '4'],
	['۵', '5'],
	['۶', '6'],
	['۷', '7'],
	['۸', '8'],
	['۹', '9'],

	// Pashto
	['ټ', 'p'],
	['ځ', 'z'],
	['څ', 'c'],
	['ډ', 'd'],
	['ﺫ', 'd'],
	['ﺭ', 'r'],
	['ړ', 'r'],
	['ﺯ', 'z'],
	['ږ', 'g'],
	['ښ', 'x'],
	['ګ', 'g'],
	['ڼ', 'n'],
	['ۀ', 'e'],
	['ې', 'e'],
	['ۍ', 'ai'],

	// Urdu
	['ٹ', 't'],
	['ڈ', 'd'],
	['ڑ', 'r'],
	['ں', 'n'],
	['ہ', 'h'],
	['ھ', 'h'],
	['ے', 'e'],

	// Russian
	['А', 'A'],
	['а', 'a'],
	['Б', 'B'],
	['б', 'b'],
	['В', 'V'],
	['в', 'v'],
	['Г', 'G'],
	['г', 'g'],
	['Д', 'D'],
	['д', 'd'],
	['ъе', 'ye'],
	['Ъе', 'Ye'],
	['ъЕ', 'yE'],
	['ЪЕ', 'YE'],
	['Е', 'E'],
	['е', 'e'],
	['Ё', 'Yo'],
	['ё', 'yo'],
	['Ж', 'Zh'],
	['ж', 'zh'],
	['З', 'Z'],
	['з', 'z'],
	['И', 'I'],
	['и', 'i'],
	['ый', 'iy'],
	['Ый', 'Iy'],
	['ЫЙ', 'IY'],
	['ыЙ', 'iY'],
	['Й', 'Y'],
	['й', 'y'],
	['К', 'K'],
	['к', 'k'],
	['Л', 'L'],
	['л', 'l'],
	['М', 'M'],
	['м', 'm'],
	['Н', 'N'],
	['н', 'n'],
	['О', 'O'],
	['о', 'o'],
	['П', 'P'],
	['п', 'p'],
	['Р', 'R'],
	['р', 'r'],
	['С', 'S'],
	['с', 's'],
	['Т', 'T'],
	['т', 't'],
	['У', 'U'],
	['у', 'u'],
	['Ф', 'F'],
	['ф', 'f'],
	['Х', 'Kh'],
	['х', 'kh'],
	['Ц', 'Ts'],
	['ц', 'ts'],
	['Ч', 'Ch'],
	['ч', 'ch'],
	['Ш', 'Sh'],
	['ш', 'sh'],
	['Щ', 'Sch'],
	['щ', 'sch'],
	['Ъ', ''],
	['ъ', ''],
	['Ы', 'Y'],
	['ы', 'y'],
	['Ь', ''],
	['ь', ''],
	['Э', 'E'],
	['э', 'e'],
	['Ю', 'Yu'],
	['ю', 'yu'],
	['Я', 'Ya'],
	['я', 'ya'],

	// Romanian
	['ă', 'a'],
	['Ă', 'A'],
	['ș', 's'],
	['Ș', 'S'],
	['ț', 't'],
	['Ț', 'T'],
	['ţ', 't'],
	['Ţ', 'T'],

	// Turkish
	['ş', 's'],
	['Ş', 'S'],
	['ç', 'c'],
	['Ç', 'C'],
	['ğ', 'g'],
	['Ğ', 'G'],
	['ı', 'i'],
	['İ', 'I'],

	// Armenian
	['ա', 'a'],
	['Ա', 'A'],
	['բ', 'b'],
	['Բ', 'B'],
	['գ', 'g'],
	['Գ', 'G'],
	['դ', 'd'],
	['Դ', 'D'],
	['ե', 'ye'],
	['Ե', 'Ye'],
	['զ', 'z'],
	['Զ', 'Z'],
	['է', 'e'],
	['Է', 'E'],
	['ը', 'y'],
	['Ը', 'Y'],
	['թ', 't'],
	['Թ', 'T'],
	['ժ', 'zh'],
	['Ժ', 'Zh'],
	['ի', 'i'],
	['Ի', 'I'],
	['լ', 'l'],
	['Լ', 'L'],
	['խ', 'kh'],
	['Խ', 'Kh'],
	['ծ', 'ts'],
	['Ծ', 'Ts'],
	['կ', 'k'],
	['Կ', 'K'],
	['հ', 'h'],
	['Հ', 'H'],
	['ձ', 'dz'],
	['Ձ', 'Dz'],
	['ղ', 'gh'],
	['Ղ', 'Gh'],
	['ճ', 'tch'],
	['Ճ', 'Tch'],
	['մ', 'm'],
	['Մ', 'M'],
	['յ', 'y'],
	['Յ', 'Y'],
	['ն', 'n'],
	['Ն', 'N'],
	['շ', 'sh'],
	['Շ', 'Sh'],
	['ո', 'vo'],
	['Ո', 'Vo'],
	['չ', 'ch'],
	['Չ', 'Ch'],
	['պ', 'p'],
	['Պ', 'P'],
	['ջ', 'j'],
	['Ջ', 'J'],
	['ռ', 'r'],
	['Ռ', 'R'],
	['ս', 's'],
	['Ս', 'S'],
	['վ', 'v'],
	['Վ', 'V'],
	['տ', 't'],
	['Տ', 'T'],
	['ր', 'r'],
	['Ր', 'R'],
	['ց', 'c'],
	['Ց', 'C'],
	['ու', 'u'],
	['ՈՒ', 'U'],
	['Ու', 'U'],
	['փ', 'p'],
	['Փ', 'P'],
	['ք', 'q'],
	['Ք', 'Q'],
	['օ', 'o'],
	['Օ', 'O'],
	['ֆ', 'f'],
	['Ֆ', 'F'],
	['և', 'yev'],

	// Georgian
	['ა', 'a'],
	['ბ', 'b'],
	['გ', 'g'],
	['დ', 'd'],
	['ე', 'e'],
	['ვ', 'v'],
	['ზ', 'z'],
	['თ', 't'],
	['ი', 'i'],
	['კ', 'k'],
	['ლ', 'l'],
	['მ', 'm'],
	['ნ', 'n'],
	['ო', 'o'],
	['პ', 'p'],
	['ჟ', 'zh'],
	['რ', 'r'],
	['ს', 's'],
	['ტ', 't'],
	['უ', 'u'],
	['ფ', 'ph'],
	['ქ', 'q'],
	['ღ', 'gh'],
	['ყ', 'k'],
	['შ', 'sh'],
	['ჩ', 'ch'],
	['ც', 'ts'],
	['ძ', 'dz'],
	['წ', 'ts'],
	['ჭ', 'tch'],
	['ხ', 'kh'],
	['ჯ', 'j'],
	['ჰ', 'h'],

	// Czech
	['č', 'c'],
	['ď', 'd'],
	['ě', 'e'],
	['ň', 'n'],
	['ř', 'r'],
	['š', 's'],
	['ť', 't'],
	['ů', 'u'],
	['ž', 'z'],
	['Č', 'C'],
	['Ď', 'D'],
	['Ě', 'E'],
	['Ň', 'N'],
	['Ř', 'R'],
	['Š', 'S'],
	['Ť', 'T'],
	['Ů', 'U'],
	['Ž', 'Z'],

	// Dhivehi
	['ހ', 'h'],
	['ށ', 'sh'],
	['ނ', 'n'],
	['ރ', 'r'],
	['ބ', 'b'],
	['ޅ', 'lh'],
	['ކ', 'k'],
	['އ', 'a'],
	['ވ', 'v'],
	['މ', 'm'],
	['ފ', 'f'],
	['ދ', 'dh'],
	['ތ', 'th'],
	['ލ', 'l'],
	['ގ', 'g'],
	['ޏ', 'gn'],
	['ސ', 's'],
	['ޑ', 'd'],
	['ޒ', 'z'],
	['ޓ', 't'],
	['ޔ', 'y'],
	['ޕ', 'p'],
	['ޖ', 'j'],
	['ޗ', 'ch'],
	['ޘ', 'tt'],
	['ޙ', 'hh'],
	['ޚ', 'kh'],
	['ޛ', 'th'],
	['ޜ', 'z'],
	['ޝ', 'sh'],
	['ޞ', 's'],
	['ޟ', 'd'],
	['ޠ', 't'],
	['ޡ', 'z'],
	['ޢ', 'a'],
	['ޣ', 'gh'],
	['ޤ', 'q'],
	['ޥ', 'w'],
	['ަ', 'a'],
	['ާ', 'aa'],
	['ި', 'i'],
	['ީ', 'ee'],
	['ު', 'u'],
	['ޫ', 'oo'],
	['ެ', 'e'],
	['ޭ', 'ey'],
	['ޮ', 'o'],
	['ޯ', 'oa'],
	['ް', ''],

	// Greek
	['α', 'a'],
	['β', 'v'],
	['γ', 'g'],
	['δ', 'd'],
	['ε', 'e'],
	['ζ', 'z'],
	['η', 'i'],
	['θ', 'th'],
	['ι', 'i'],
	['κ', 'k'],
	['λ', 'l'],
	['μ', 'm'],
	['ν', 'n'],
	['ξ', 'ks'],
	['ο', 'o'],
	['π', 'p'],
	['ρ', 'r'],
	['σ', 's'],
	['τ', 't'],
	['υ', 'y'],
	['φ', 'f'],
	['χ', 'x'],
	['ψ', 'ps'],
	['ω', 'o'],
	['ά', 'a'],
	['έ', 'e'],
	['ί', 'i'],
	['ό', 'o'],
	['ύ', 'y'],
	['ή', 'i'],
	['ώ', 'o'],
	['ς', 's'],
	['ϊ', 'i'],
	['ΰ', 'y'],
	['ϋ', 'y'],
	['ΐ', 'i'],
	['Α', 'A'],
	['Β', 'B'],
	['Γ', 'G'],
	['Δ', 'D'],
	['Ε', 'E'],
	['Ζ', 'Z'],
	['Η', 'I'],
	['Θ', 'TH'],
	['Ι', 'I'],
	['Κ', 'K'],
	['Λ', 'L'],
	['Μ', 'M'],
	['Ν', 'N'],
	['Ξ', 'KS'],
	['Ο', 'O'],
	['Π', 'P'],
	['Ρ', 'R'],
	['Σ', 'S'],
	['Τ', 'T'],
	['Υ', 'Y'],
	['Φ', 'F'],
	['Χ', 'X'],
	['Ψ', 'PS'],
	['Ω', 'O'],
	['Ά', 'A'],
	['Έ', 'E'],
	['Ί', 'I'],
	['Ό', 'O'],
	['Ύ', 'Y'],
	['Ή', 'I'],
	['Ώ', 'O'],
	['Ϊ', 'I'],
	['Ϋ', 'Y'],

	// Disabled as it conflicts with German and Latin.
	// Hungarian
	// ['ä', 'a'],
	// ['Ä', 'A'],
	// ['ö', 'o'],
	// ['Ö', 'O'],
	// ['ü', 'u'],
	// ['Ü', 'U'],
	// ['ű', 'u'],
	// ['Ű', 'U'],

	// Latvian
	['ā', 'a'],
	['ē', 'e'],
	['ģ', 'g'],
	['ī', 'i'],
	['ķ', 'k'],
	['ļ', 'l'],
	['ņ', 'n'],
	['ū', 'u'],
	['Ā', 'A'],
	['Ē', 'E'],
	['Ģ', 'G'],
	['Ī', 'I'],
	['Ķ', 'K'],
	['Ļ', 'L'],
	['Ņ', 'N'],
	['Ū', 'U'],
	['č', 'c'],
	['š', 's'],
	['ž', 'z'],
	['Č', 'C'],
	['Š', 'S'],
	['Ž', 'Z'],

	// Lithuanian
	['ą', 'a'],
	['č', 'c'],
	['ę', 'e'],
	['ė', 'e'],
	['į', 'i'],
	['š', 's'],
	['ų', 'u'],
	['ū', 'u'],
	['ž', 'z'],
	['Ą', 'A'],
	['Č', 'C'],
	['Ę', 'E'],
	['Ė', 'E'],
	['Į', 'I'],
	['Š', 'S'],
	['Ų', 'U'],
	['Ū', 'U'],

	// Macedonian
	['Ќ', 'Kj'],
	['ќ', 'kj'],
	['Љ', 'Lj'],
	['љ', 'lj'],
	['Њ', 'Nj'],
	['њ', 'nj'],
	['Тс', 'Ts'],
	['тс', 'ts'],

	// Polish
	['ą', 'a'],
	['ć', 'c'],
	['ę', 'e'],
	['ł', 'l'],
	['ń', 'n'],
	['ś', 's'],
	['ź', 'z'],
	['ż', 'z'],
	['Ą', 'A'],
	['Ć', 'C'],
	['Ę', 'E'],
	['Ł', 'L'],
	['Ń', 'N'],
	['Ś', 'S'],
	['Ź', 'Z'],
	['Ż', 'Z'],

	// Disabled as it conflicts with Vietnamese.
	// Serbian
	// ['љ', 'lj'],
	// ['њ', 'nj'],
	// ['Љ', 'Lj'],
	// ['Њ', 'Nj'],
	// ['đ', 'dj'],
	// ['Đ', 'Dj'],
	// ['ђ', 'dj'],
	// ['ј', 'j'],
	// ['ћ', 'c'],
	// ['џ', 'dz'],
	// ['Ђ', 'Dj'],
	// ['Ј', 'j'],
	// ['Ћ', 'C'],
	// ['Џ', 'Dz'],

	// Disabled as it conflicts with German and Latin.
	// Slovak
	// ['ä', 'a'],
	// ['Ä', 'A'],
	// ['ľ', 'l'],
	// ['ĺ', 'l'],
	// ['ŕ', 'r'],
	// ['Ľ', 'L'],
	// ['Ĺ', 'L'],
	// ['Ŕ', 'R'],

	// Disabled as it conflicts with German and Latin.
	// Swedish
	// ['å', 'o'],
	// ['Å', 'o'],
	// ['ä', 'a'],
	// ['Ä', 'A'],
	// ['ë', 'e'],
	// ['Ë', 'E'],
	// ['ö', 'o'],
	// ['Ö', 'O'],

	// Ukrainian
	['Є', 'Ye'],
	['І', 'I'],
	['Ї', 'Yi'],
	['Ґ', 'G'],
	['є', 'ye'],
	['і', 'i'],
	['ї', 'yi'],
	['ґ', 'g'],

	// Dutch
	['Ĳ', 'IJ'],
	['ĳ', 'ij'],

	// Danish
	// ['Æ', 'Ae'],
	// ['Ø', 'Oe'],
	// ['Å', 'Aa'],
	// ['æ', 'ae'],
	// ['ø', 'oe'],
	// ['å', 'aa']

	// Currencies
	['¢', 'c'],
	['¥', 'Y'],
	['߿', 'b'],
	['৳', 't'],
	['૱', 'Bo'],
	['฿', 'B'],
	['₠', 'CE'],
	['₡', 'C'],
	['₢', 'Cr'],
	['₣', 'F'],
	['₥', 'm'],
	['₦', 'N'],
	['₧', 'Pt'],
	['₨', 'Rs'],
	['₩', 'W'],
	['₫', 's'],
	['€', 'E'],
	['₭', 'K'],
	['₮', 'T'],
	['₯', 'Dp'],
	['₰', 'S'],
	['₱', 'P'],
	['₲', 'G'],
	['₳', 'A'],
	['₴', 'S'],
	['₵', 'C'],
	['₶', 'tt'],
	['₷', 'S'],
	['₸', 'T'],
	['₹', 'R'],
	['₺', 'L'],
	['₽', 'P'],
	['₿', 'B'],
	['﹩', '$'],
	['￠', 'c'],
	['￥', 'Y'],
	['￦', 'W'],

	// Latin
	['𝐀', 'A'],
	['𝐁', 'B'],
	['𝐂', 'C'],
	['𝐃', 'D'],
	['𝐄', 'E'],
	['𝐅', 'F'],
	['𝐆', 'G'],
	['𝐇', 'H'],
	['𝐈', 'I'],
	['𝐉', 'J'],
	['𝐊', 'K'],
	['𝐋', 'L'],
	['𝐌', 'M'],
	['𝐍', 'N'],
	['𝐎', 'O'],
	['𝐏', 'P'],
	['𝐐', 'Q'],
	['𝐑', 'R'],
	['𝐒', 'S'],
	['𝐓', 'T'],
	['𝐔', 'U'],
	['𝐕', 'V'],
	['𝐖', 'W'],
	['𝐗', 'X'],
	['𝐘', 'Y'],
	['𝐙', 'Z'],
	['𝐚', 'a'],
	['𝐛', 'b'],
	['𝐜', 'c'],
	['𝐝', 'd'],
	['𝐞', 'e'],
	['𝐟', 'f'],
	['𝐠', 'g'],
	['𝐡', 'h'],
	['𝐢', 'i'],
	['𝐣', 'j'],
	['𝐤', 'k'],
	['𝐥', 'l'],
	['𝐦', 'm'],
	['𝐧', 'n'],
	['𝐨', 'o'],
	['𝐩', 'p'],
	['𝐪', 'q'],
	['𝐫', 'r'],
	['𝐬', 's'],
	['𝐭', 't'],
	['𝐮', 'u'],
	['𝐯', 'v'],
	['𝐰', 'w'],
	['𝐱', 'x'],
	['𝐲', 'y'],
	['𝐳', 'z'],
	['𝐴', 'A'],
	['𝐵', 'B'],
	['𝐶', 'C'],
	['𝐷', 'D'],
	['𝐸', 'E'],
	['𝐹', 'F'],
	['𝐺', 'G'],
	['𝐻', 'H'],
	['𝐼', 'I'],
	['𝐽', 'J'],
	['𝐾', 'K'],
	['𝐿', 'L'],
	['𝑀', 'M'],
	['𝑁', 'N'],
	['𝑂', 'O'],
	['𝑃', 'P'],
	['𝑄', 'Q'],
	['𝑅', 'R'],
	['𝑆', 'S'],
	['𝑇', 'T'],
	['𝑈', 'U'],
	['𝑉', 'V'],
	['𝑊', 'W'],
	['𝑋', 'X'],
	['𝑌', 'Y'],
	['𝑍', 'Z'],
	['𝑎', 'a'],
	['𝑏', 'b'],
	['𝑐', 'c'],
	['𝑑', 'd'],
	['𝑒', 'e'],
	['𝑓', 'f'],
	['𝑔', 'g'],
	['𝑖', 'i'],
	['𝑗', 'j'],
	['𝑘', 'k'],
	['𝑙', 'l'],
	['𝑚', 'm'],
	['𝑛', 'n'],
	['𝑜', 'o'],
	['𝑝', 'p'],
	['𝑞', 'q'],
	['𝑟', 'r'],
	['𝑠', 's'],
	['𝑡', 't'],
	['𝑢', 'u'],
	['𝑣', 'v'],
	['𝑤', 'w'],
	['𝑥', 'x'],
	['𝑦', 'y'],
	['𝑧', 'z'],
	['𝑨', 'A'],
	['𝑩', 'B'],
	['𝑪', 'C'],
	['𝑫', 'D'],
	['𝑬', 'E'],
	['𝑭', 'F'],
	['𝑮', 'G'],
	['𝑯', 'H'],
	['𝑰', 'I'],
	['𝑱', 'J'],
	['𝑲', 'K'],
	['𝑳', 'L'],
	['𝑴', 'M'],
	['𝑵', 'N'],
	['𝑶', 'O'],
	['𝑷', 'P'],
	['𝑸', 'Q'],
	['𝑹', 'R'],
	['𝑺', 'S'],
	['𝑻', 'T'],
	['𝑼', 'U'],
	['𝑽', 'V'],
	['𝑾', 'W'],
	['𝑿', 'X'],
	['𝒀', 'Y'],
	['𝒁', 'Z'],
	['𝒂', 'a'],
	['𝒃', 'b'],
	['𝒄', 'c'],
	['𝒅', 'd'],
	['𝒆', 'e'],
	['𝒇', 'f'],
	['𝒈', 'g'],
	['𝒉', 'h'],
	['𝒊', 'i'],
	['𝒋', 'j'],
	['𝒌', 'k'],
	['𝒍', 'l'],
	['𝒎', 'm'],
	['𝒏', 'n'],
	['𝒐', 'o'],
	['𝒑', 'p'],
	['𝒒', 'q'],
	['𝒓', 'r'],
	['𝒔', 's'],
	['𝒕', 't'],
	['𝒖', 'u'],
	['𝒗', 'v'],
	['𝒘', 'w'],
	['𝒙', 'x'],
	['𝒚', 'y'],
	['𝒛', 'z'],
	['𝒜', 'A'],
	['𝒞', 'C'],
	['𝒟', 'D'],
	['𝒢', 'g'],
	['𝒥', 'J'],
	['𝒦', 'K'],
	['𝒩', 'N'],
	['𝒪', 'O'],
	['𝒫', 'P'],
	['𝒬', 'Q'],
	['𝒮', 'S'],
	['𝒯', 'T'],
	['𝒰', 'U'],
	['𝒱', 'V'],
	['𝒲', 'W'],
	['𝒳', 'X'],
	['𝒴', 'Y'],
	['𝒵', 'Z'],
	['𝒶', 'a'],
	['𝒷', 'b'],
	['𝒸', 'c'],
	['𝒹', 'd'],
	['𝒻', 'f'],
	['𝒽', 'h'],
	['𝒾', 'i'],
	['𝒿', 'j'],
	['𝓀', 'h'],
	['𝓁', 'l'],
	['𝓂', 'm'],
	['𝓃', 'n'],
	['𝓅', 'p'],
	['𝓆', 'q'],
	['𝓇', 'r'],
	['𝓈', 's'],
	['𝓉', 't'],
	['𝓊', 'u'],
	['𝓋', 'v'],
	['𝓌', 'w'],
	['𝓍', 'x'],
	['𝓎', 'y'],
	['𝓏', 'z'],
	['𝓐', 'A'],
	['𝓑', 'B'],
	['𝓒', 'C'],
	['𝓓', 'D'],
	['𝓔', 'E'],
	['𝓕', 'F'],
	['𝓖', 'G'],
	['𝓗', 'H'],
	['𝓘', 'I'],
	['𝓙', 'J'],
	['𝓚', 'K'],
	['𝓛', 'L'],
	['𝓜', 'M'],
	['𝓝', 'N'],
	['𝓞', 'O'],
	['𝓟', 'P'],
	['𝓠', 'Q'],
	['𝓡', 'R'],
	['𝓢', 'S'],
	['𝓣', 'T'],
	['𝓤', 'U'],
	['𝓥', 'V'],
	['𝓦', 'W'],
	['𝓧', 'X'],
	['𝓨', 'Y'],
	['𝓩', 'Z'],
	['𝓪', 'a'],
	['𝓫', 'b'],
	['𝓬', 'c'],
	['𝓭', 'd'],
	['𝓮', 'e'],
	['𝓯', 'f'],
	['𝓰', 'g'],
	['𝓱', 'h'],
	['𝓲', 'i'],
	['𝓳', 'j'],
	['𝓴', 'k'],
	['𝓵', 'l'],
	['𝓶', 'm'],
	['𝓷', 'n'],
	['𝓸', 'o'],
	['𝓹', 'p'],
	['𝓺', 'q'],
	['𝓻', 'r'],
	['𝓼', 's'],
	['𝓽', 't'],
	['𝓾', 'u'],
	['𝓿', 'v'],
	['𝔀', 'w'],
	['𝔁', 'x'],
	['𝔂', 'y'],
	['𝔃', 'z'],
	['𝔄', 'A'],
	['𝔅', 'B'],
	['𝔇', 'D'],
	['𝔈', 'E'],
	['𝔉', 'F'],
	['𝔊', 'G'],
	['𝔍', 'J'],
	['𝔎', 'K'],
	['𝔏', 'L'],
	['𝔐', 'M'],
	['𝔑', 'N'],
	['𝔒', 'O'],
	['𝔓', 'P'],
	['𝔔', 'Q'],
	['𝔖', 'S'],
	['𝔗', 'T'],
	['𝔘', 'U'],
	['𝔙', 'V'],
	['𝔚', 'W'],
	['𝔛', 'X'],
	['𝔜', 'Y'],
	['𝔞', 'a'],
	['𝔟', 'b'],
	['𝔠', 'c'],
	['𝔡', 'd'],
	['𝔢', 'e'],
	['𝔣', 'f'],
	['𝔤', 'g'],
	['𝔥', 'h'],
	['𝔦', 'i'],
	['𝔧', 'j'],
	['𝔨', 'k'],
	['𝔩', 'l'],
	['𝔪', 'm'],
	['𝔫', 'n'],
	['𝔬', 'o'],
	['𝔭', 'p'],
	['𝔮', 'q'],
	['𝔯', 'r'],
	['𝔰', 's'],
	['𝔱', 't'],
	['𝔲', 'u'],
	['𝔳', 'v'],
	['𝔴', 'w'],
	['𝔵', 'x'],
	['𝔶', 'y'],
	['𝔷', 'z'],
	['𝔸', 'A'],
	['𝔹', 'B'],
	['𝔻', 'D'],
	['𝔼', 'E'],
	['𝔽', 'F'],
	['𝔾', 'G'],
	['𝕀', 'I'],
	['𝕁', 'J'],
	['𝕂', 'K'],
	['𝕃', 'L'],
	['𝕄', 'M'],
	['𝕆', 'N'],
	['𝕊', 'S'],
	['𝕋', 'T'],
	['𝕌', 'U'],
	['𝕍', 'V'],
	['𝕎', 'W'],
	['𝕏', 'X'],
	['𝕐', 'Y'],
	['𝕒', 'a'],
	['𝕓', 'b'],
	['𝕔', 'c'],
	['𝕕', 'd'],
	['𝕖', 'e'],
	['𝕗', 'f'],
	['𝕘', 'g'],
	['𝕙', 'h'],
	['𝕚', 'i'],
	['𝕛', 'j'],
	['𝕜', 'k'],
	['𝕝', 'l'],
	['𝕞', 'm'],
	['𝕟', 'n'],
	['𝕠', 'o'],
	['𝕡', 'p'],
	['𝕢', 'q'],
	['𝕣', 'r'],
	['𝕤', 's'],
	['𝕥', 't'],
	['𝕦', 'u'],
	['𝕧', 'v'],
	['𝕨', 'w'],
	['𝕩', 'x'],
	['𝕪', 'y'],
	['𝕫', 'z'],
	['𝕬', 'A'],
	['𝕭', 'B'],
	['𝕮', 'C'],
	['𝕯', 'D'],
	['𝕰', 'E'],
	['𝕱', 'F'],
	['𝕲', 'G'],
	['𝕳', 'H'],
	['𝕴', 'I'],
	['𝕵', 'J'],
	['𝕶', 'K'],
	['𝕷', 'L'],
	['𝕸', 'M'],
	['𝕹', 'N'],
	['𝕺', 'O'],
	['𝕻', 'P'],
	['𝕼', 'Q'],
	['𝕽', 'R'],
	['𝕾', 'S'],
	['𝕿', 'T'],
	['𝖀', 'U'],
	['𝖁', 'V'],
	['𝖂', 'W'],
	['𝖃', 'X'],
	['𝖄', 'Y'],
	['𝖅', 'Z'],
	['𝖆', 'a'],
	['𝖇', 'b'],
	['𝖈', 'c'],
	['𝖉', 'd'],
	['𝖊', 'e'],
	['𝖋', 'f'],
	['𝖌', 'g'],
	['𝖍', 'h'],
	['𝖎', 'i'],
	['𝖏', 'j'],
	['𝖐', 'k'],
	['𝖑', 'l'],
	['𝖒', 'm'],
	['𝖓', 'n'],
	['𝖔', 'o'],
	['𝖕', 'p'],
	['𝖖', 'q'],
	['𝖗', 'r'],
	['𝖘', 's'],
	['𝖙', 't'],
	['𝖚', 'u'],
	['𝖛', 'v'],
	['𝖜', 'w'],
	['𝖝', 'x'],
	['𝖞', 'y'],
	['𝖟', 'z'],
	['𝖠', 'A'],
	['𝖡', 'B'],
	['𝖢', 'C'],
	['𝖣', 'D'],
	['𝖤', 'E'],
	['𝖥', 'F'],
	['𝖦', 'G'],
	['𝖧', 'H'],
	['𝖨', 'I'],
	['𝖩', 'J'],
	['𝖪', 'K'],
	['𝖫', 'L'],
	['𝖬', 'M'],
	['𝖭', 'N'],
	['𝖮', 'O'],
	['𝖯', 'P'],
	['𝖰', 'Q'],
	['𝖱', 'R'],
	['𝖲', 'S'],
	['𝖳', 'T'],
	['𝖴', 'U'],
	['𝖵', 'V'],
	['𝖶', 'W'],
	['𝖷', 'X'],
	['𝖸', 'Y'],
	['𝖹', 'Z'],
	['𝖺', 'a'],
	['𝖻', 'b'],
	['𝖼', 'c'],
	['𝖽', 'd'],
	['𝖾', 'e'],
	['𝖿', 'f'],
	['𝗀', 'g'],
	['𝗁', 'h'],
	['𝗂', 'i'],
	['𝗃', 'j'],
	['𝗄', 'k'],
	['𝗅', 'l'],
	['𝗆', 'm'],
	['𝗇', 'n'],
	['𝗈', 'o'],
	['𝗉', 'p'],
	['𝗊', 'q'],
	['𝗋', 'r'],
	['𝗌', 's'],
	['𝗍', 't'],
	['𝗎', 'u'],
	['𝗏', 'v'],
	['𝗐', 'w'],
	['𝗑', 'x'],
	['𝗒', 'y'],
	['𝗓', 'z'],
	['𝗔', 'A'],
	['𝗕', 'B'],
	['𝗖', 'C'],
	['𝗗', 'D'],
	['𝗘', 'E'],
	['𝗙', 'F'],
	['𝗚', 'G'],
	['𝗛', 'H'],
	['𝗜', 'I'],
	['𝗝', 'J'],
	['𝗞', 'K'],
	['𝗟', 'L'],
	['𝗠', 'M'],
	['𝗡', 'N'],
	['𝗢', 'O'],
	['𝗣', 'P'],
	['𝗤', 'Q'],
	['𝗥', 'R'],
	['𝗦', 'S'],
	['𝗧', 'T'],
	['𝗨', 'U'],
	['𝗩', 'V'],
	['𝗪', 'W'],
	['𝗫', 'X'],
	['𝗬', 'Y'],
	['𝗭', 'Z'],
	['𝗮', 'a'],
	['𝗯', 'b'],
	['𝗰', 'c'],
	['𝗱', 'd'],
	['𝗲', 'e'],
	['𝗳', 'f'],
	['𝗴', 'g'],
	['𝗵', 'h'],
	['𝗶', 'i'],
	['𝗷', 'j'],
	['𝗸', 'k'],
	['𝗹', 'l'],
	['𝗺', 'm'],
	['𝗻', 'n'],
	['𝗼', 'o'],
	['𝗽', 'p'],
	['𝗾', 'q'],
	['𝗿', 'r'],
	['𝘀', 's'],
	['𝘁', 't'],
	['𝘂', 'u'],
	['𝘃', 'v'],
	['𝘄', 'w'],
	['𝘅', 'x'],
	['𝘆', 'y'],
	['𝘇', 'z'],
	['𝘈', 'A'],
	['𝘉', 'B'],
	['𝘊', 'C'],
	['𝘋', 'D'],
	['𝘌', 'E'],
	['𝘍', 'F'],
	['𝘎', 'G'],
	['𝘏', 'H'],
	['𝘐', 'I'],
	['𝘑', 'J'],
	['𝘒', 'K'],
	['𝘓', 'L'],
	['𝘔', 'M'],
	['𝘕', 'N'],
	['𝘖', 'O'],
	['𝘗', 'P'],
	['𝘘', 'Q'],
	['𝘙', 'R'],
	['𝘚', 'S'],
	['𝘛', 'T'],
	['𝘜', 'U'],
	['𝘝', 'V'],
	['𝘞', 'W'],
	['𝘟', 'X'],
	['𝘠', 'Y'],
	['𝘡', 'Z'],
	['𝘢', 'a'],
	['𝘣', 'b'],
	['𝘤', 'c'],
	['𝘥', 'd'],
	['𝘦', 'e'],
	['𝘧', 'f'],
	['𝘨', 'g'],
	['𝘩', 'h'],
	['𝘪', 'i'],
	['𝘫', 'j'],
	['𝘬', 'k'],
	['𝘭', 'l'],
	['𝘮', 'm'],
	['𝘯', 'n'],
	['𝘰', 'o'],
	['𝘱', 'p'],
	['𝘲', 'q'],
	['𝘳', 'r'],
	['𝘴', 's'],
	['𝘵', 't'],
	['𝘶', 'u'],
	['𝘷', 'v'],
	['𝘸', 'w'],
	['𝘹', 'x'],
	['𝘺', 'y'],
	['𝘻', 'z'],
	['𝘼', 'A'],
	['𝘽', 'B'],
	['𝘾', 'C'],
	['𝘿', 'D'],
	['𝙀', 'E'],
	['𝙁', 'F'],
	['𝙂', 'G'],
	['𝙃', 'H'],
	['𝙄', 'I'],
	['𝙅', 'J'],
	['𝙆', 'K'],
	['𝙇', 'L'],
	['𝙈', 'M'],
	['𝙉', 'N'],
	['𝙊', 'O'],
	['𝙋', 'P'],
	['𝙌', 'Q'],
	['𝙍', 'R'],
	['𝙎', 'S'],
	['𝙏', 'T'],
	['𝙐', 'U'],
	['𝙑', 'V'],
	['𝙒', 'W'],
	['𝙓', 'X'],
	['𝙔', 'Y'],
	['𝙕', 'Z'],
	['𝙖', 'a'],
	['𝙗', 'b'],
	['𝙘', 'c'],
	['𝙙', 'd'],
	['𝙚', 'e'],
	['𝙛', 'f'],
	['𝙜', 'g'],
	['𝙝', 'h'],
	['𝙞', 'i'],
	['𝙟', 'j'],
	['𝙠', 'k'],
	['𝙡', 'l'],
	['𝙢', 'm'],
	['𝙣', 'n'],
	['𝙤', 'o'],
	['𝙥', 'p'],
	['𝙦', 'q'],
	['𝙧', 'r'],
	['𝙨', 's'],
	['𝙩', 't'],
	['𝙪', 'u'],
	['𝙫', 'v'],
	['𝙬', 'w'],
	['𝙭', 'x'],
	['𝙮', 'y'],
	['𝙯', 'z'],
	['𝙰', 'A'],
	['𝙱', 'B'],
	['𝙲', 'C'],
	['𝙳', 'D'],
	['𝙴', 'E'],
	['𝙵', 'F'],
	['𝙶', 'G'],
	['𝙷', 'H'],
	['𝙸', 'I'],
	['𝙹', 'J'],
	['𝙺', 'K'],
	['𝙻', 'L'],
	['𝙼', 'M'],
	['𝙽', 'N'],
	['𝙾', 'O'],
	['𝙿', 'P'],
	['𝚀', 'Q'],
	['𝚁', 'R'],
	['𝚂', 'S'],
	['𝚃', 'T'],
	['𝚄', 'U'],
	['𝚅', 'V'],
	['𝚆', 'W'],
	['𝚇', 'X'],
	['𝚈', 'Y'],
	['𝚉', 'Z'],
	['𝚊', 'a'],
	['𝚋', 'b'],
	['𝚌', 'c'],
	['𝚍', 'd'],
	['𝚎', 'e'],
	['𝚏', 'f'],
	['𝚐', 'g'],
	['𝚑', 'h'],
	['𝚒', 'i'],
	['𝚓', 'j'],
	['𝚔', 'k'],
	['𝚕', 'l'],
	['𝚖', 'm'],
	['𝚗', 'n'],
	['𝚘', 'o'],
	['𝚙', 'p'],
	['𝚚', 'q'],
	['𝚛', 'r'],
	['𝚜', 's'],
	['𝚝', 't'],
	['𝚞', 'u'],
	['𝚟', 'v'],
	['𝚠', 'w'],
	['𝚡', 'x'],
	['𝚢', 'y'],
	['𝚣', 'z'],

	// Dotless letters
	['𝚤', 'l'],
	['𝚥', 'j'],

	// Greek
	['𝛢', 'A'],
	['𝛣', 'B'],
	['𝛤', 'G'],
	['𝛥', 'D'],
	['𝛦', 'E'],
	['𝛧', 'Z'],
	['𝛨', 'I'],
	['𝛩', 'TH'],
	['𝛪', 'I'],
	['𝛫', 'K'],
	['𝛬', 'L'],
	['𝛭', 'M'],
	['𝛮', 'N'],
	['𝛯', 'KS'],
	['𝛰', 'O'],
	['𝛱', 'P'],
	['𝛲', 'R'],
	['𝛳', 'TH'],
	['𝛴', 'S'],
	['𝛵', 'T'],
	['𝛶', 'Y'],
	['𝛷', 'F'],
	['𝛸', 'x'],
	['𝛹', 'PS'],
	['𝛺', 'O'],
	['𝛻', 'D'],
	['𝛼', 'a'],
	['𝛽', 'b'],
	['𝛾', 'g'],
	['𝛿', 'd'],
	['𝜀', 'e'],
	['𝜁', 'z'],
	['𝜂', 'i'],
	['𝜃', 'th'],
	['𝜄', 'i'],
	['𝜅', 'k'],
	['𝜆', 'l'],
	['𝜇', 'm'],
	['𝜈', 'n'],
	['𝜉', 'ks'],
	['𝜊', 'o'],
	['𝜋', 'p'],
	['𝜌', 'r'],
	['𝜍', 's'],
	['𝜎', 's'],
	['𝜏', 't'],
	['𝜐', 'y'],
	['𝜑', 'f'],
	['𝜒', 'x'],
	['𝜓', 'ps'],
	['𝜔', 'o'],
	['𝜕', 'd'],
	['𝜖', 'E'],
	['𝜗', 'TH'],
	['𝜘', 'K'],
	['𝜙', 'f'],
	['𝜚', 'r'],
	['𝜛', 'p'],
	['𝜜', 'A'],
	['𝜝', 'V'],
	['𝜞', 'G'],
	['𝜟', 'D'],
	['𝜠', 'E'],
	['𝜡', 'Z'],
	['𝜢', 'I'],
	['𝜣', 'TH'],
	['𝜤', 'I'],
	['𝜥', 'K'],
	['𝜦', 'L'],
	['𝜧', 'M'],
	['𝜨', 'N'],
	['𝜩', 'KS'],
	['𝜪', 'O'],
	['𝜫', 'P'],
	['𝜬', 'S'],
	['𝜭', 'TH'],
	['𝜮', 'S'],
	['𝜯', 'T'],
	['𝜰', 'Y'],
	['𝜱', 'F'],
	['𝜲', 'X'],
	['𝜳', 'PS'],
	['𝜴', 'O'],
	['𝜵', 'D'],
	['𝜶', 'a'],
	['𝜷', 'v'],
	['𝜸', 'g'],
	['𝜹', 'd'],
	['𝜺', 'e'],
	['𝜻', 'z'],
	['𝜼', 'i'],
	['𝜽', 'th'],
	['𝜾', 'i'],
	['𝜿', 'k'],
	['𝝀', 'l'],
	['𝝁', 'm'],
	['𝝂', 'n'],
	['𝝃', 'ks'],
	['𝝄', 'o'],
	['𝝅', 'p'],
	['𝝆', 'r'],
	['𝝇', 's'],
	['𝝈', 's'],
	['𝝉', 't'],
	['𝝊', 'y'],
	['𝝋', 'f'],
	['𝝌', 'x'],
	['𝝍', 'ps'],
	['𝝎', 'o'],
	['𝝏', 'a'],
	['𝝐', 'e'],
	['𝝑', 'i'],
	['𝝒', 'k'],
	['𝝓', 'f'],
	['𝝔', 'r'],
	['𝝕', 'p'],
	['𝝖', 'A'],
	['𝝗', 'B'],
	['𝝘', 'G'],
	['𝝙', 'D'],
	['𝝚', 'E'],
	['𝝛', 'Z'],
	['𝝜', 'I'],
	['𝝝', 'TH'],
	['𝝞', 'I'],
	['𝝟', 'K'],
	['𝝠', 'L'],
	['𝝡', 'M'],
	['𝝢', 'N'],
	['𝝣', 'KS'],
	['𝝤', 'O'],
	['𝝥', 'P'],
	['𝝦', 'R'],
	['𝝧', 'TH'],
	['𝝨', 'S'],
	['𝝩', 'T'],
	['𝝪', 'Y'],
	['𝝫', 'F'],
	['𝝬', 'X'],
	['𝝭', 'PS'],
	['𝝮', 'O'],
	['𝝯', 'D'],
	['𝝰', 'a'],
	['𝝱', 'v'],
	['𝝲', 'g'],
	['𝝳', 'd'],
	['𝝴', 'e'],
	['𝝵', 'z'],
	['𝝶', 'i'],
	['𝝷', 'th'],
	['𝝸', 'i'],
	['𝝹', 'k'],
	['𝝺', 'l'],
	['𝝻', 'm'],
	['𝝼', 'n'],
	['𝝽', 'ks'],
	['𝝾', 'o'],
	['𝝿', 'p'],
	['𝞀', 'r'],
	['𝞁', 's'],
	['𝞂', 's'],
	['𝞃', 't'],
	['𝞄', 'y'],
	['𝞅', 'f'],
	['𝞆', 'x'],
	['𝞇', 'ps'],
	['𝞈', 'o'],
	['𝞉', 'a'],
	['𝞊', 'e'],
	['𝞋', 'i'],
	['𝞌', 'k'],
	['𝞍', 'f'],
	['𝞎', 'r'],
	['𝞏', 'p'],
	['𝞐', 'A'],
	['𝞑', 'V'],
	['𝞒', 'G'],
	['𝞓', 'D'],
	['𝞔', 'E'],
	['𝞕', 'Z'],
	['𝞖', 'I'],
	['𝞗', 'TH'],
	['𝞘', 'I'],
	['𝞙', 'K'],
	['𝞚', 'L'],
	['𝞛', 'M'],
	['𝞜', 'N'],
	['𝞝', 'KS'],
	['𝞞', 'O'],
	['𝞟', 'P'],
	['𝞠', 'S'],
	['𝞡', 'TH'],
	['𝞢', 'S'],
	['𝞣', 'T'],
	['𝞤', 'Y'],
	['𝞥', 'F'],
	['𝞦', 'X'],
	['𝞧', 'PS'],
	['𝞨', 'O'],
	['𝞩', 'D'],
	['𝞪', 'av'],
	['𝞫', 'g'],
	['𝞬', 'd'],
	['𝞭', 'e'],
	['𝞮', 'z'],
	['𝞯', 'i'],
	['𝞰', 'i'],
	['𝞱', 'th'],
	['𝞲', 'i'],
	['𝞳', 'k'],
	['𝞴', 'l'],
	['𝞵', 'm'],
	['𝞶', 'n'],
	['𝞷', 'ks'],
	['𝞸', 'o'],
	['𝞹', 'p'],
	['𝞺', 'r'],
	['𝞻', 's'],
	['𝞼', 's'],
	['𝞽', 't'],
	['𝞾', 'y'],
	['𝞿', 'f'],
	['𝟀', 'x'],
	['𝟁', 'ps'],
	['𝟂', 'o'],
	['𝟃', 'a'],
	['𝟄', 'e'],
	['𝟅', 'i'],
	['𝟆', 'k'],
	['𝟇', 'f'],
	['𝟈', 'r'],
	['𝟉', 'p'],
	['𝟊', 'F'],
	['𝟋', 'f'],
	['⒜', '(a)'],
	['⒝', '(b)'],
	['⒞', '(c)'],
	['⒟', '(d)'],
	['⒠', '(e)'],
	['⒡', '(f)'],
	['⒢', '(g)'],
	['⒣', '(h)'],
	['⒤', '(i)'],
	['⒥', '(j)'],
	['⒦', '(k)'],
	['⒧', '(l)'],
	['⒨', '(m)'],
	['⒩', '(n)'],
	['⒪', '(o)'],
	['⒫', '(p)'],
	['⒬', '(q)'],
	['⒭', '(r)'],
	['⒮', '(s)'],
	['⒯', '(t)'],
	['⒰', '(u)'],
	['⒱', '(v)'],
	['⒲', '(w)'],
	['⒳', '(x)'],
	['⒴', '(y)'],
	['⒵', '(z)'],
	['Ⓐ', '(A)'],
	['Ⓑ', '(B)'],
	['Ⓒ', '(C)'],
	['Ⓓ', '(D)'],
	['Ⓔ', '(E)'],
	['Ⓕ', '(F)'],
	['Ⓖ', '(G)'],
	['Ⓗ', '(H)'],
	['Ⓘ', '(I)'],
	['Ⓙ', '(J)'],
	['Ⓚ', '(K)'],
	['Ⓛ', '(L)'],
	['Ⓝ', '(N)'],
	['Ⓞ', '(O)'],
	['Ⓟ', '(P)'],
	['Ⓠ', '(Q)'],
	['Ⓡ', '(R)'],
	['Ⓢ', '(S)'],
	['Ⓣ', '(T)'],
	['Ⓤ', '(U)'],
	['Ⓥ', '(V)'],
	['Ⓦ', '(W)'],
	['Ⓧ', '(X)'],
	['Ⓨ', '(Y)'],
	['Ⓩ', '(Z)'],
	['ⓐ', '(a)'],
	['ⓑ', '(b)'],
	['ⓒ', '(b)'],
	['ⓓ', '(c)'],
	['ⓔ', '(e)'],
	['ⓕ', '(f)'],
	['ⓖ', '(g)'],
	['ⓗ', '(h)'],
	['ⓘ', '(i)'],
	['ⓙ', '(j)'],
	['ⓚ', '(k)'],
	['ⓛ', '(l)'],
	['ⓜ', '(m)'],
	['ⓝ', '(n)'],
	['ⓞ', '(o)'],
	['ⓟ', '(p)'],
	['ⓠ', '(q)'],
	['ⓡ', '(r)'],
	['ⓢ', '(s)'],
	['ⓣ', '(t)'],
	['ⓤ', '(u)'],
	['ⓥ', '(v)'],
	['ⓦ', '(w)'],
	['ⓧ', '(x)'],
	['ⓨ', '(y)'],
	['ⓩ', '(z)'],

	// Maltese
	['Ċ', 'C'],
	['ċ', 'c'],
	['Ġ', 'G'],
	['ġ', 'g'],
	['Ħ', 'H'],
	['ħ', 'h'],
	['Ż', 'Z'],
	['ż', 'z'],

	// Numbers
	['𝟎', '0'],
	['𝟏', '1'],
	['𝟐', '2'],
	['𝟑', '3'],
	['𝟒', '4'],
	['𝟓', '5'],
	['𝟔', '6'],
	['𝟕', '7'],
	['𝟖', '8'],
	['𝟗', '9'],
	['𝟘', '0'],
	['𝟙', '1'],
	['𝟚', '2'],
	['𝟛', '3'],
	['𝟜', '4'],
	['𝟝', '5'],
	['𝟞', '6'],
	['𝟟', '7'],
	['𝟠', '8'],
	['𝟡', '9'],
	['𝟢', '0'],
	['𝟣', '1'],
	['𝟤', '2'],
	['𝟥', '3'],
	['𝟦', '4'],
	['𝟧', '5'],
	['𝟨', '6'],
	['𝟩', '7'],
	['𝟪', '8'],
	['𝟫', '9'],
	['𝟬', '0'],
	['𝟭', '1'],
	['𝟮', '2'],
	['𝟯', '3'],
	['𝟰', '4'],
	['𝟱', '5'],
	['𝟲', '6'],
	['𝟳', '7'],
	['𝟴', '8'],
	['𝟵', '9'],
	['𝟶', '0'],
	['𝟷', '1'],
	['𝟸', '2'],
	['𝟹', '3'],
	['𝟺', '4'],
	['𝟻', '5'],
	['𝟼', '6'],
	['𝟽', '7'],
	['𝟾', '8'],
	['𝟿', '9'],
	['①', '1'],
	['②', '2'],
	['③', '3'],
	['④', '4'],
	['⑤', '5'],
	['⑥', '6'],
	['⑦', '7'],
	['⑧', '8'],
	['⑨', '9'],
	['⑩', '10'],
	['⑪', '11'],
	['⑫', '12'],
	['⑬', '13'],
	['⑭', '14'],
	['⑮', '15'],
	['⑯', '16'],
	['⑰', '17'],
	['⑱', '18'],
	['⑲', '19'],
	['⑳', '20'],
	['⑴', '1'],
	['⑵', '2'],
	['⑶', '3'],
	['⑷', '4'],
	['⑸', '5'],
	['⑹', '6'],
	['⑺', '7'],
	['⑻', '8'],
	['⑼', '9'],
	['⑽', '10'],
	['⑾', '11'],
	['⑿', '12'],
	['⒀', '13'],
	['⒁', '14'],
	['⒂', '15'],
	['⒃', '16'],
	['⒄', '17'],
	['⒅', '18'],
	['⒆', '19'],
	['⒇', '20'],
	['⒈', '1.'],
	['⒉', '2.'],
	['⒊', '3.'],
	['⒋', '4.'],
	['⒌', '5.'],
	['⒍', '6.'],
	['⒎', '7.'],
	['⒏', '8.'],
	['⒐', '9.'],
	['⒑', '10.'],
	['⒒', '11.'],
	['⒓', '12.'],
	['⒔', '13.'],
	['⒕', '14.'],
	['⒖', '15.'],
	['⒗', '16.'],
	['⒘', '17.'],
	['⒙', '18.'],
	['⒚', '19.'],
	['⒛', '20.'],
	['⓪', '0'],
	['⓫', '11'],
	['⓬', '12'],
	['⓭', '13'],
	['⓮', '14'],
	['⓯', '15'],
	['⓰', '16'],
	['⓱', '17'],
	['⓲', '18'],
	['⓳', '19'],
	['⓴', '20'],
	['⓵', '1'],
	['⓶', '2'],
	['⓷', '3'],
	['⓸', '4'],
	['⓹', '5'],
	['⓺', '6'],
	['⓻', '7'],
	['⓼', '8'],
	['⓽', '9'],
	['⓾', '10'],
	['⓿', '0'],

	// Punctuation
	['🙰', '&'],
	['🙱', '&'],
	['🙲', '&'],
	['🙳', '&'],
	['🙴', '&'],
	['🙵', '&'],
	['🙶', '"'],
	['🙷', '"'],
	['🙸', '"'],
	['‽', '?!'],
	['🙹', '?!'],
	['🙺', '?!'],
	['🙻', '?!'],
	['🙼', '/'],
	['🙽', '\\'],

	// Alchemy
	['🜇', 'AR'],
	['🜈', 'V'],
	['🜉', 'V'],
	['🜆', 'VR'],
	['🜅', 'VF'],
	['🜩', '2'],
	['🜪', '5'],
	['🝡', 'f'],
	['🝢', 'W'],
	['🝣', 'U'],
	['🝧', 'V'],
	['🝨', 'T'],
	['🝪', 'V'],
	['🝫', 'MB'],
	['🝬', 'VB'],
	['🝲', '3B'],
	['🝳', '3B'],

	// Emojis
	['💯', '100'],
	['🔙', 'BACK'],
	['🔚', 'END'],
	['🔛', 'ON!'],
	['🔜', 'SOON'],
	['🔝', 'TOP'],
	['🔞', '18'],
	['🔤', 'abc'],
	['🔠', 'ABCD'],
	['🔡', 'abcd'],
	['🔢', '1234'],
	['🔣', 'T&@%'],
	['#️⃣', '#'],
	['*️⃣', '*'],
	['0️⃣', '0'],
	['1️⃣', '1'],
	['2️⃣', '2'],
	['3️⃣', '3'],
	['4️⃣', '4'],
	['5️⃣', '5'],
	['6️⃣', '6'],
	['7️⃣', '7'],
	['8️⃣', '8'],
	['9️⃣', '9'],
	['🔟', '10'],
	['🅰️', 'A'],
	['🅱️', 'B'],
	['🆎', 'AB'],
	['🆑', 'CL'],
	['🅾️', 'O'],
	['🅿', 'P'],
	['🆘', 'SOS'],
	['🅲', 'C'],
	['🅳', 'D'],
	['🅴', 'E'],
	['🅵', 'F'],
	['🅶', 'G'],
	['🅷', 'H'],
	['🅸', 'I'],
	['🅹', 'J'],
	['🅺', 'K'],
	['🅻', 'L'],
	['🅼', 'M'],
	['🅽', 'N'],
	['🆀', 'Q'],
	['🆁', 'R'],
	['🆂', 'S'],
	['🆃', 'T'],
	['🆄', 'U'],
	['🆅', 'V'],
	['🆆', 'W'],
	['🆇', 'X'],
	['🆈', 'Y'],
	['🆉', 'Z']
];

const doCustomReplacements = (string, replacements) => {
	for (const [key, value] of replacements) {
		// TODO: Use `String#replaceAll()` when targeting Node.js 16.
		string = string.replace(new RegExp(escapeStringRegexp(key), 'g'), value);
	}

	return string;
};

function transliterate(string, options) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = {
		customReplacements: [],
		...options
	};

	const customReplacements = new Map([
		...replacements,
		...options.customReplacements
	]);

	string = string.normalize();
	string = doCustomReplacements(string, customReplacements);
	string = string.normalize('NFD').replace(/\p{Diacritic}/gu, '').normalize();

	return string;
}

const overridableReplacements = [
	['&', ' and '],
	['🦄', ' unicorn '],
	['♥', ' love ']
];

const decamelize = string => {
	return string
		// Separate capitalized words.
		.replace(/([A-Z]{2,})(\d+)/g, '$1 $2')
		.replace(/([a-z\d]+)([A-Z]{2,})/g, '$1 $2')

		.replace(/([a-z\d])([A-Z])/g, '$1 $2')
		// `[a-rt-z]` matches all lowercase characters except `s`.
		// This avoids matching plural acronyms like `APIs`.
		.replace(/([A-Z]+)([A-Z][a-rt-z\d]+)/g, '$1 $2');
};

const removeMootSeparators = (string, separator) => {
	const escapedSeparator = escapeStringRegexp(separator);

	return string
		.replace(new RegExp(`${escapedSeparator}{2,}`, 'g'), separator)
		.replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, 'g'), '');
};

const buildPatternSlug = options => {
	let negationSetPattern = 'a-z\\d';
	negationSetPattern += options.lowercase ? '' : 'A-Z';

	if (options.preserveCharacters.length > 0) {
		for (const character of options.preserveCharacters) {
			if (character === options.separator) {
				throw new Error(`The separator character \`${options.separator}\` cannot be included in preserved characters: ${options.preserveCharacters}`);
			}

			negationSetPattern += escapeStringRegexp(character);
		}
	}

	return new RegExp(`[^${negationSetPattern}]+`, 'g');
};

function slugify(string, options) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = {
		separator: '-',
		lowercase: true,
		decamelize: true,
		customReplacements: [],
		preserveLeadingUnderscore: false,
		preserveTrailingDash: false,
		preserveCharacters: [],
		...options
	};

	const shouldPrependUnderscore = options.preserveLeadingUnderscore && string.startsWith('_');
	const shouldAppendDash = options.preserveTrailingDash && string.endsWith('-');

	const customReplacements = new Map([
		...overridableReplacements,
		...options.customReplacements
	]);

	string = transliterate(string, {customReplacements});

	if (options.decamelize) {
		string = decamelize(string);
	}

	const patternSlug = buildPatternSlug(options);

	if (options.lowercase) {
		string = string.toLowerCase();
	}

	// Detect contractions/possessives by looking for any word followed by a `'t`
	// or `'s` in isolation and then remove it.
	string = string.replace(/([a-zA-Z\d]+)'([ts])(\s|$)/g, '$1$2$3');

	string = string.replace(patternSlug, options.separator);
	string = string.replace(/\\/g, '');

	if (options.separator) {
		string = removeMootSeparators(string, options.separator);
	}

	if (shouldPrependUnderscore) {
		string = `_${string}`;
	}

	if (shouldAppendDash) {
		string = `${string}-`;
	}

	return string;
}

const isSymbol = (value) => {
  return !!value && value.constructor === Symbol;
};
const isFunction = (value) => {
  return !!(value && value.constructor && value.call && value.apply);
};
const isNumber = (value) => {
  try {
    return Number(value) === value;
  } catch {
    return false;
  }
};
const isDate = (value) => {
  return Object.prototype.toString.call(value) === "[object Date]";
};
const isEmpty = (value) => {
  if (value === true || value === false)
    return true;
  if (value === null || value === void 0)
    return true;
  if (isNumber(value))
    return value === 0;
  if (isDate(value))
    return isNaN(value.getTime());
  if (isFunction(value))
    return false;
  if (isSymbol(value))
    return false;
  const length = value.length;
  if (isNumber(length))
    return length === 0;
  const size = value.size;
  if (isNumber(size))
    return size === 0;
  const keys = Object.keys(value).length;
  return keys === 0;
};

var require_fast_deep_equal=__commonJS({"../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js"(exports,module){module.exports=function equal(a,b){if(a===b)return true;if(a&&b&&typeof a=="object"&&typeof b=="object"){if(a.constructor!==b.constructor)return false;var length,i,keys;if(Array.isArray(a)){length=a.length;if(length!=b.length)return false;for(i=length;i--!==0;)if(!equal(a[i],b[i]))return false;return true;}if(a.constructor===RegExp)return a.source===b.source&&a.flags===b.flags;if(a.valueOf!==Object.prototype.valueOf)return a.valueOf()===b.valueOf();if(a.toString!==Object.prototype.toString)return a.toString()===b.toString();keys=Object.keys(a);length=keys.length;if(length!==Object.keys(b).length)return false;for(i=length;i--!==0;)if(!Object.prototype.hasOwnProperty.call(b,keys[i]))return false;for(i=length;i--!==0;){var key=keys[i];if(!equal(a[key],b[key]))return false;}return true;}return a!==a&&b!==b;};}});// src/stream/types.ts
var ChunkFrom=/* @__PURE__ */(ChunkFrom2=>{ChunkFrom2["AGENT"]="AGENT";ChunkFrom2["USER"]="USER";ChunkFrom2["SYSTEM"]="SYSTEM";ChunkFrom2["WORKFLOW"]="WORKFLOW";ChunkFrom2["NETWORK"]="NETWORK";return ChunkFrom2;})(ChunkFrom||{});// src/stream/base/output.ts
var noopSpanContext={traceId:"",spanId:"",traceFlags:0};var noopSpan={spanContext(){return noopSpanContext;},setAttribute(){return this;},setAttributes(){return this;},addEvent(){return this;},addLink(){return this;},addLinks(){return this;},setStatus(){return this;},updateName(){return this;},end(){return this;},isRecording(){return false;},recordException(){return this;}};var noopTracer={startSpan(){return noopSpan;},startActiveSpan(name,arg1,arg2,arg3){if(typeof arg1==="function"){return arg1(noopSpan);}if(typeof arg2==="function"){return arg2(noopSpan);}if(typeof arg3==="function"){return arg3(noopSpan);}}};// src/loop/telemetry/index.ts
function getTracer({isEnabled=false,tracer}={}){if(!isEnabled){return noopTracer;}if(tracer){return tracer;}return trace.getTracer("mastra");}function assembleOperationName({operationId,telemetry}){return {"mastra.operationId":operationId,"operation.name":`${operationId}${telemetry?.functionId!=null?` ${telemetry.functionId}`:""}`,...(telemetry?.functionId?{"resource.name":telemetry?.functionId}:{})};}function getTelemetryAttributes({model,settings,telemetry,headers}){return {"aisdk.model.provider":model.provider,"aisdk.model.id":model.modelId,// settings:
...Object.entries(settings).reduce((attributes,[key,value])=>{attributes[`stream.settings.${key}`]=value;return attributes;},{}),// add metadata as attributes:
...Object.entries(telemetry?.metadata??{}).reduce((attributes,[key,value])=>{attributes[`stream.telemetry.metadata.${key}`]=value;return attributes;},{}),// request headers
...Object.entries(headers??{}).reduce((attributes,[key,value])=>{if(value!==void 0){attributes[`stream.request.headers.${key}`]=value;}return attributes;},{})};}function getRootSpan({operationId,model,modelSettings,telemetry_settings,headers}){const tracer=getTracer({isEnabled:telemetry_settings?.isEnabled,tracer:telemetry_settings?.tracer});const baseTelemetryAttributes=getTelemetryAttributes({model:{modelId:model.modelId,provider:model.provider},settings:modelSettings??{maxRetries:2},telemetry:telemetry_settings,headers});const rootSpan=tracer.startSpan(operationId).setAttributes({...assembleOperationName({operationId,telemetry:telemetry_settings}),...baseTelemetryAttributes});return {rootSpan};}// src/agent/trip-wire.ts
var TripWire=class extends Error{constructor(reason){super(reason);Object.setPrototypeOf(this,new.target.prototype);}};var getModelOutputForTripwire=async({tripwireReason,runId,tracingContext,options,model,messageList})=>{const tripwireStream=new ReadableStream$1({start(controller){controller.enqueue({type:"tripwire",runId,from:"AGENT"/* AGENT */,payload:{tripwireReason:tripwireReason||""}});controller.close();}});const{rootSpan}=getRootSpan({operationId:`mastra.stream.tripwire`,model:{modelId:model.modelId||"unknown",provider:model.provider||"unknown"},modelSettings:options.modelSettings,headers:options.modelSettings?.headers,telemetry_settings:options.telemetry});const modelOutput=new MastraModelOutput({model:{modelId:model.modelId,provider:model.provider,version:model.specificationVersion||"v2"},stream:tripwireStream,messageList,options:{runId,rootSpan,telemetry_settings:options.telemetry,structuredOutput:options.structuredOutput,tracingContext,onFinish:options.onFinish,// Fix these types after the types PR is merged
onStepFinish:options.onStepFinish,returnScorerData:options.returnScorerData},messageId:randomUUID()});return modelOutput;};// src/processors/processors/moderation.ts
function getResponseUIMessageId({originalMessages,responseMessageId}){if(originalMessages==null){return void 0;}const lastMessage=originalMessages[originalMessages.length-1];return lastMessage?.role==="assistant"?lastMessage.id:typeof responseMessageId==="function"?responseMessageId():responseMessageId;}function convertFullStreamChunkToUIMessageStream({part,messageMetadataValue,sendReasoning,sendSources,onError,sendStart,sendFinish,responseMessageId}){const partType=part.type;switch(partType){case "text-start":{return {type:"text-start",id:part.id,...(part.providerMetadata!=null?{providerMetadata:part.providerMetadata}:{})};}case "text-delta":{return {type:"text-delta",id:part.id,delta:part.text,...(part.providerMetadata!=null?{providerMetadata:part.providerMetadata}:{})};}case "text-end":{return {type:"text-end",id:part.id,...(part.providerMetadata!=null?{providerMetadata:part.providerMetadata}:{})};}case "reasoning-start":{return {type:"reasoning-start",id:part.id,...(part.providerMetadata!=null?{providerMetadata:part.providerMetadata}:{})};}case "reasoning-delta":{if(sendReasoning){return {type:"reasoning-delta",id:part.id,delta:part.text,...(part.providerMetadata!=null?{providerMetadata:part.providerMetadata}:{})};}return;}case "reasoning-end":{return {type:"reasoning-end",id:part.id,...(part.providerMetadata!=null?{providerMetadata:part.providerMetadata}:{})};}case "file":{return {type:"file",mediaType:part.file.mediaType,url:`data:${part.file.mediaType};base64,${part.file.base64}`};}case "source":{if(sendSources&&part.sourceType==="url"){return {type:"source-url",sourceId:part.id,url:part.url,title:part.title,...(part.providerMetadata!=null?{providerMetadata:part.providerMetadata}:{})};}if(sendSources&&part.sourceType==="document"){return {type:"source-document",sourceId:part.id,mediaType:part.mediaType,title:part.title,filename:part.filename,...(part.providerMetadata!=null?{providerMetadata:part.providerMetadata}:{})};}return;}case "tool-input-start":{return {type:"tool-input-start",toolCallId:part.id,toolName:part.toolName,...(part.providerExecuted!=null?{providerExecuted:part.providerExecuted}:{}),...(part.dynamic!=null?{dynamic:part.dynamic}:{})};}case "tool-input-delta":{return {type:"tool-input-delta",toolCallId:part.id,inputTextDelta:part.delta};}case "tool-call":{return {type:"tool-input-available",toolCallId:part.toolCallId,toolName:part.toolName,input:part.input,...(part.providerExecuted!=null?{providerExecuted:part.providerExecuted}:{}),...(part.providerMetadata!=null?{providerMetadata:part.providerMetadata}:{}),...(part.dynamic!=null?{dynamic:part.dynamic}:{})};}case "tool-result":{return {type:"tool-output-available",toolCallId:part.toolCallId,output:part.output,...(part.providerExecuted!=null?{providerExecuted:part.providerExecuted}:{}),...(part.dynamic!=null?{dynamic:part.dynamic}:{})};}case "tool-output":{return {...part.output};}case "tool-error":{return {type:"tool-output-error",toolCallId:part.toolCallId,errorText:onError(part.error),...(part.providerExecuted!=null?{providerExecuted:part.providerExecuted}:{}),...(part.dynamic!=null?{dynamic:part.dynamic}:{})};}case "error":{return {type:"error",errorText:onError(part.error)};}case "start-step":{return {type:"start-step"};}case "finish-step":{return {type:"finish-step"};}case "start":{if(sendStart){return {type:"start",...(messageMetadataValue!=null?{messageMetadata:messageMetadataValue}:{}),...(responseMessageId!=null?{messageId:responseMessageId}:{})};}return;}case "finish":{if(sendFinish){return {type:"finish",...(messageMetadataValue!=null?{messageMetadata:messageMetadataValue}:{})};}return;}case "abort":{return part;}case "tool-input-end":{return;}case "raw":{return;}default:{const exhaustiveCheck=partType;throw new Error(`Unknown chunk type: ${exhaustiveCheck}`);}}}// src/stream/aisdk/v5/compat/validation.ts
async function safeValidateTypes({value,schema}){try{if(!schema.validate){return {success:true,value};}const result=await schema.validate(value);if(!result.success){return {success:false,error:new TypeValidationError({value,cause:"Validation failed"})};}return {success:true,value:result.value};}catch(error){return {success:false,error:error instanceof Error?error:new Error(String(error))};}}// src/stream/aisdk/v5/compat/delayed-promise.ts
var DelayedPromise=class{status={type:"pending"};_promise;_resolve=void 0;_reject=void 0;get promise(){if(this._promise){return this._promise;}this._promise=new Promise((resolve,reject)=>{if(this.status.type==="resolved"){resolve(this.status.value);}else if(this.status.type==="rejected"){reject(this.status.error);}this._resolve=resolve;this._reject=reject;});return this._promise;}resolve(value){this.status={type:"resolved",value};if(this._promise){this._resolve?.(value);}}reject(error){this.status={type:"rejected",error};if(this._promise){this._reject?.(error);}}};// src/stream/aisdk/v5/compat/prepare-tools.ts
function prepareToolsAndToolChoice({tools,toolChoice,activeTools}){if(Object.keys(tools||{}).length===0){return {tools:void 0,toolChoice:void 0};}const filteredTools=activeTools!=null?Object.entries(tools||{}).filter(([name])=>activeTools.includes(name)):Object.entries(tools||{});return {tools:filteredTools.map(([name,tool$1])=>{try{let inputSchema;if("inputSchema"in tool$1){inputSchema=tool$1.inputSchema;}else if("parameters"in tool$1){inputSchema=tool$1.parameters;}const sdkTool=tool({type:"function",...tool$1,inputSchema});const toolType=sdkTool?.type??"function";switch(toolType){case void 0:case "dynamic":case "function":return {type:"function",name,description:sdkTool.description,inputSchema:asSchema(sdkTool.inputSchema).jsonSchema,providerOptions:sdkTool.providerOptions};case "provider-defined":return {type:"provider-defined",name,// TODO: as any seems wrong here. are there cases where we don't have an id?
id:sdkTool.id,args:sdkTool.args};default:{const exhaustiveCheck=toolType;throw new Error(`Unsupported tool type: ${exhaustiveCheck}`);}}}catch(e){console.error("Error preparing tool",e);return null;}}).filter(tool=>tool!==null),toolChoice:toolChoice==null?{type:"auto"}:typeof toolChoice==="string"?{type:toolChoice}:{type:"tool",toolName:toolChoice.toolName}};}// src/stream/aisdk/v5/compat/consume-stream.ts
async function consumeStream({stream,onError}){const reader=stream.getReader();try{while(true){const{done}=await reader.read();if(done)break;}}catch(error){console.error("consumeStream error",error);onError?.(error);}finally{reader.releaseLock();}}// src/agent/agent.ts
var import_fast_deep_equal2=__toESM(require_fast_deep_equal());async function consumeStream2({stream,onError}){const reader=stream.getReader();try{while(true){const{done}=await reader.read();if(done)break;}}catch(error){onError==null?void 0:onError(error);}finally{reader.releaseLock();}}// src/stream/RunOutput.ts
var WorkflowRunOutput=class{#status="running";#usageCount={inputTokens:0,outputTokens:0,totalTokens:0,cachedInputTokens:0,reasoningTokens:0};#consumptionStarted=false;#baseStream;#emitter=new EventEmitter$1();#bufferedChunks=[];#streamFinished=false;#streamError;#delayedPromises={usage:new DelayedPromise(),result:new DelayedPromise()};/**
   * Unique identifier for this workflow run
   */runId;/**
   * Unique identifier for this workflow
   */workflowId;constructor({runId,workflowId,stream}){const self=this;this.runId=runId;this.workflowId=workflowId;this.#baseStream=stream;stream.pipeTo(new WritableStream({start(){const chunk={type:"workflow-start",runId:self.runId,from:"WORKFLOW"/* WORKFLOW */,payload:{workflowId:self.workflowId}};self.#bufferedChunks.push(chunk);self.#emitter.emit("chunk",chunk);},write(chunk){if(chunk.type!=="workflow-step-finish"){self.#bufferedChunks.push(chunk);self.#emitter.emit("chunk",chunk);}if(chunk.type==="workflow-step-finish"&&chunk.payload.usage){self.#updateUsageCount(chunk.payload.usage);}else if(chunk.type==="workflow-canceled"){self.#status="canceled";}else if(chunk.type==="workflow-step-suspended"){self.#status="suspended";}else if(chunk.type==="workflow-step-result"&&chunk.payload.status==="failed"){self.#status="failed";}},close(){if(self.#status==="running"){self.#status="success";}self.#emitter.emit("chunk",{type:"workflow-finish",runId:self.runId,from:"WORKFLOW"/* WORKFLOW */,payload:{workflowStatus:self.#status,metadata:self.#streamError?{error:self.#streamError,errorMessage:self.#streamError?.message}:{},output:{// @ts-ignore
usage:self.#usageCount}}});self.#delayedPromises.usage.resolve(self.#usageCount);Object.entries(self.#delayedPromises).forEach(([key,promise])=>{if(promise.status.type==="pending"){promise.reject(new Error(`promise '${key}' was not resolved or rejected when stream finished`));}});self.#streamFinished=true;self.#emitter.emit("finish");}})).catch(reason=>{console.log(" something went wrong",reason);});}#getDelayedPromise(promise){if(!this.#consumptionStarted){void this.consumeStream();}return promise.promise;}#updateUsageCount(usage){let totalUsage={inputTokens:0,outputTokens:0,totalTokens:0,reasoningTokens:0,cachedInputTokens:0};if("inputTokens"in usage){totalUsage.inputTokens+=parseInt(usage?.inputTokens?.toString()??"0",10);totalUsage.outputTokens+=parseInt(usage?.outputTokens?.toString()??"0",10);}else if("promptTokens"in usage){totalUsage.inputTokens+=parseInt(usage?.promptTokens?.toString()??"0",10);totalUsage.outputTokens+=parseInt(usage?.completionTokens?.toString()??"0",10);}totalUsage.totalTokens+=parseInt(usage?.totalTokens?.toString()??"0",10);totalUsage.reasoningTokens+=parseInt(usage?.reasoningTokens?.toString()??"0",10);totalUsage.cachedInputTokens+=parseInt(usage?.cachedInputTokens?.toString()??"0",10);this.#usageCount=totalUsage;}/**
   * @internal
   */updateResults(results){this.#delayedPromises.result.resolve(results);}/**
   * @internal
   */rejectResults(error){this.#delayedPromises.result.reject(error);this.#status="failed";this.#streamError=error;}/**
   * @internal
   */resume(stream){this.#baseStream=stream;this.#streamFinished=false;this.#consumptionStarted=false;this.#status="running";this.#delayedPromises={usage:new DelayedPromise(),result:new DelayedPromise()};const self=this;stream.pipeTo(new WritableStream({start(){const chunk={type:"workflow-start",runId:self.runId,from:"WORKFLOW"/* WORKFLOW */,payload:{workflowId:self.workflowId}};self.#bufferedChunks.push(chunk);self.#emitter.emit("chunk",chunk);},write(chunk){if(chunk.type!=="workflow-step-finish"){self.#bufferedChunks.push(chunk);self.#emitter.emit("chunk",chunk);}if(chunk.type==="workflow-step-finish"&&chunk.payload.usage){self.#updateUsageCount(chunk.payload.usage);}else if(chunk.type==="workflow-canceled"){self.#status="canceled";}else if(chunk.type==="workflow-step-suspended"){self.#status="suspended";}else if(chunk.type==="workflow-step-result"&&chunk.payload.status==="failed"){self.#status="failed";}},close(){if(self.#status==="running"){self.#status="success";}self.#emitter.emit("chunk",{type:"workflow-finish",runId:self.runId,from:"WORKFLOW"/* WORKFLOW */,payload:{workflowStatus:self.#status,metadata:self.#streamError?{error:self.#streamError,errorMessage:self.#streamError?.message}:{},output:{// @ts-ignore
usage:self.#usageCount}}});self.#streamFinished=true;self.#emitter.emit("finish");}})).catch(reason=>{console.log(" something went wrong",reason);});}async consumeStream(options){if(this.#consumptionStarted){return;}this.#consumptionStarted=true;try{await consumeStream2({stream:this.#baseStream,onError:options?.onError});}catch(error){options?.onError?.(error);}}get fullStream(){const self=this;return new ReadableStream$1({start(controller){self.#bufferedChunks.forEach(chunk=>{controller.enqueue(chunk);});if(self.#streamFinished){controller.close();return;}const chunkHandler=chunk=>{controller.enqueue(chunk);};const finishHandler=()=>{self.#emitter.off("chunk",chunkHandler);self.#emitter.off("finish",finishHandler);controller.close();};self.#emitter.on("chunk",chunkHandler);self.#emitter.on("finish",finishHandler);},pull(_controller){if(!self.#consumptionStarted){void self.consumeStream();}},cancel(){self.#emitter.removeAllListeners();}});}get status(){return this.#status;}get result(){return this.#getDelayedPromise(this.#delayedPromises.result);}get usage(){return this.#getDelayedPromise(this.#delayedPromises.usage);}/**
   * @deprecated Use `fullStream.locked` instead
   */get locked(){console.warn("WorkflowRunOutput.locked is deprecated. Use fullStream.locked instead.");return this.fullStream.locked;}/**
   * @deprecated Use `fullStream.cancel()` instead
   */cancel(reason){console.warn("WorkflowRunOutput.cancel() is deprecated. Use fullStream.cancel() instead.");return this.fullStream.cancel(reason);}/**
   * @deprecated Use `fullStream.getReader()` instead
   */getReader(options){console.warn("WorkflowRunOutput.getReader() is deprecated. Use fullStream.getReader() instead.");return this.fullStream.getReader(options);}/**
   * @deprecated Use `fullStream.pipeThrough()` instead
   */pipeThrough(transform,options){console.warn("WorkflowRunOutput.pipeThrough() is deprecated. Use fullStream.pipeThrough() instead.");return this.fullStream.pipeThrough(transform,options);}/**
   * @deprecated Use `fullStream.pipeTo()` instead
   */pipeTo(destination,options){console.warn("WorkflowRunOutput.pipeTo() is deprecated. Use fullStream.pipeTo() instead.");return this.fullStream.pipeTo(destination,options);}/**
   * @deprecated Use `fullStream.tee()` instead
   */tee(){console.warn("WorkflowRunOutput.tee() is deprecated. Use fullStream.tee() instead.");return this.fullStream.tee();}/**
   * @deprecated Use `fullStream[Symbol.asyncIterator]()` instead
   */[Symbol.asyncIterator](){console.warn("WorkflowRunOutput[Symbol.asyncIterator]() is deprecated. Use fullStream[Symbol.asyncIterator]() instead.");return this.fullStream[Symbol.asyncIterator]();}/**
   * Helper method to treat this object as a ReadableStream
   * @deprecated Use `fullStream` directly instead
   */toReadableStream(){console.warn("WorkflowRunOutput.toReadableStream() is deprecated. Use fullStream directly instead.");return this.fullStream;}};// src/workflows/default.ts
function runScorer({runId,scorerId,scorerObject,input,output,runtimeContext,entity,structuredOutput,source,entityType,threadId,resourceId,tracingContext}){let shouldExecute=false;if(!scorerObject?.sampling||scorerObject?.sampling?.type==="none"){shouldExecute=true;}if(scorerObject?.sampling?.type){switch(scorerObject?.sampling?.type){case "ratio":shouldExecute=Math.random()<scorerObject?.sampling?.rate;break;default:shouldExecute=true;}}if(!shouldExecute){return;}const payload={scorer:{id:scorerId,name:scorerObject.scorer.name,description:scorerObject.scorer.description},input,output,runtimeContext:Object.fromEntries(runtimeContext.entries()),runId,source,entity,structuredOutput,entityType,threadId,resourceId,tracingContext};executeHook("onScorerRun"/* ON_SCORER_RUN */,payload);}// src/workflows/execution-engine.ts
var ExecutionEngine=class extends MastraBase{mastra;options;constructor({mastra,options}){super({name:"ExecutionEngine",component:RegisteredLogger.WORKFLOW});this.mastra=mastra;this.options=options;}__registerMastra(mastra){this.mastra=mastra;}};// src/workflows/step.ts
var getStepResult=(stepResults,step)=>{let result;if(typeof step==="string"){result=stepResults[step];}else {if(!step?.id){return null;}result=stepResults[step.id];}return result?.status==="success"?result.output:null;};// src/workflows/utils.ts
function getZodErrors(error){const errors=error.issues;return errors;}async function validateStepInput({prevOutput,step,validateInputs}){let inputData=prevOutput;let validationError;if(validateInputs){const inputSchema=step.inputSchema;const validatedInput=await inputSchema.safeParseAsync(prevOutput);if(!validatedInput.success){const errors=getZodErrors(validatedInput.error);const errorMessages=errors.map(e=>`- ${e.path?.join(".")}: ${e.message}`).join("\n");validationError=new Error("Step input validation failed: \n"+errorMessages);}else {inputData=isEmpty(validatedInput.data)?prevOutput:validatedInput.data;}}return {inputData,validationError};}function getResumeLabelsByStepId(resumeLabels,stepId){return Object.entries(resumeLabels).filter(([_,value])=>value.stepId===stepId).reduce((acc,[key,value])=>{acc[key]=value;return acc;},{});}// src/workflows/default.ts
var DefaultExecutionEngine=class extends ExecutionEngine{/**
   * Preprocesses an error caught during workflow execution.
   *
   * - Wraps a non-MastraError exception
   * - Logs error details
   */preprocessExecutionError(e,errorDefinition,logPrefix){const error=e instanceof MastraError?e:new MastraError(errorDefinition,e);if(!(e instanceof MastraError)&&e instanceof Error&&e.stack){error.stack=e.stack;}this.logger?.trackException(error);this.logger?.error(logPrefix+error?.stack);return error;}/**
   * The runCounts map is used to keep track of the run count for each step.
   * The step id is used as the key and the run count is the value.
   */runCounts=/* @__PURE__ */new Map();/**
   * Get or generate the run count for a step.
   * If the step id is not in the map, it will be added and the run count will be 0.
   * If the step id is in the map, it will return the run count.
   *
   * @param stepId - The id of the step.
   * @returns The run count for the step.
   */getOrGenerateRunCount(stepId){if(this.runCounts.has(stepId)){const currentRunCount=this.runCounts.get(stepId);const nextRunCount=currentRunCount+1;this.runCounts.set(stepId,nextRunCount);return nextRunCount;}const runCount=0;this.runCounts.set(stepId,runCount);return runCount;}async fmtReturnValue(executionSpan,emitter,stepResults,lastOutput,error){const base={status:lastOutput.status,steps:stepResults,input:stepResults.input};if(lastOutput.status==="success"){await emitter.emit("watch",{type:"watch",payload:{workflowState:{status:lastOutput.status,steps:stepResults,result:lastOutput.output}},eventTimestamp:Date.now()});base.result=lastOutput.output;}else if(lastOutput.status==="failed"){await emitter.emit("watch",{type:"watch",payload:{workflowState:{status:lastOutput.status,steps:stepResults,result:null,error:lastOutput.error}},eventTimestamp:Date.now()});if(error instanceof Error){base.error=error?.stack??error;}else if(lastOutput.error){base.error=lastOutput.error;}else if(typeof error==="string"){base.error=error;}else {const errorMessage=safeParseErrorObject(error);const errorObj=new Error("Unknown error: "+errorMessage);base.error=errorObj?.stack??errorObj;}}else if(lastOutput.status==="suspended"){const suspendedStepIds=Object.entries(stepResults).flatMap(([stepId,stepResult])=>{if(stepResult?.status==="suspended"){const nestedPath=stepResult?.suspendPayload?.__workflow_meta?.path;return nestedPath?[[stepId,...nestedPath]]:[[stepId]];}return [];});base.suspended=suspendedStepIds;await emitter.emit("watch",{type:"watch",payload:{workflowState:{status:lastOutput.status,steps:stepResults,result:null,error:null}},eventTimestamp:Date.now()});}executionSpan?.end();return base;}/**
   * Executes a workflow run with the provided execution graph and input
   * @param graph The execution graph to execute
   * @param input The input data for the workflow
   * @returns A promise that resolves to the workflow output
   */async execute(params){const{workflowId,runId,resourceId,graph,input,initialState,resume,retryConfig,workflowAISpan,disableScorers}=params;const{attempts=0,delay:delay2=0}=retryConfig??{};const steps=graph.steps;this.runCounts.clear();if(steps.length===0){const empty_graph_error=new MastraError({id:"WORKFLOW_EXECUTE_EMPTY_GRAPH",text:"Workflow must have at least one step",domain:"MASTRA_WORKFLOW"/* MASTRA_WORKFLOW */,category:"USER"/* USER */});workflowAISpan?.error({error:empty_graph_error});throw empty_graph_error;}const executionSpan=this.mastra?.getTelemetry()?.tracer.startSpan(`workflow.${workflowId}.execute`,{attributes:{componentName:workflowId,runId,resourceId}});let startIdx=0;if(resume?.resumePath){startIdx=resume.resumePath[0];resume.resumePath.shift();}const stepResults=resume?.stepResults||{input};let lastOutput;let lastState=initialState??{};for(let i=startIdx;i<steps.length;i++){const entry=steps[i];const executionContext={workflowId,runId,executionPath:[i],suspendedPaths:{},resumeLabels:{},retryConfig:{attempts,delay:delay2},executionSpan,format:params.format,state:lastState??initialState};try{lastOutput=await this.executeEntry({workflowId,runId,resourceId,entry,executionContext,serializedStepGraph:params.serializedStepGraph,prevStep:steps[i-1],stepResults,resume,tracingContext:{currentSpan:workflowAISpan},abortController:params.abortController,emitter:params.emitter,runtimeContext:params.runtimeContext,writableStream:params.writableStream,disableScorers});if(lastOutput.executionContext?.state){lastState=lastOutput.executionContext.state;}if(lastOutput.result.status!=="success"){if(lastOutput.result.status==="bailed"){lastOutput.result.status="success";}const result2=await this.fmtReturnValue(executionSpan,params.emitter,stepResults,lastOutput.result);await this.persistStepUpdate({workflowId,runId,resourceId,stepResults:lastOutput.stepResults,serializedStepGraph:params.serializedStepGraph,executionContext:lastOutput.executionContext,workflowStatus:result2.status,result:result2.result,error:result2.error,runtimeContext:params.runtimeContext});if(result2.error){workflowAISpan?.error({error:result2.error,attributes:{status:result2.status}});}else {workflowAISpan?.end({output:result2.result,attributes:{status:result2.status}});}if(lastOutput.result.status==="suspended"&&params.outputOptions?.includeResumeLabels){return {...result2,resumeLabels:lastOutput.executionContext?.resumeLabels};}return result2;}}catch(e){const error=this.preprocessExecutionError(e,{id:"WORKFLOW_ENGINE_STEP_EXECUTION_FAILED",domain:"MASTRA_WORKFLOW"/* MASTRA_WORKFLOW */,category:"USER"/* USER */,details:{workflowId,runId}},"Error executing step: ");const result2=await this.fmtReturnValue(executionSpan,params.emitter,stepResults,lastOutput.result,e);await this.persistStepUpdate({workflowId,runId,resourceId,stepResults:lastOutput.stepResults,serializedStepGraph:params.serializedStepGraph,executionContext:lastOutput.executionContext,workflowStatus:result2.status,result:result2.result,error:result2.error,runtimeContext:params.runtimeContext});workflowAISpan?.error({error,attributes:{status:result2.status}});return result2;}}const result=await this.fmtReturnValue(executionSpan,params.emitter,stepResults,lastOutput.result);await this.persistStepUpdate({workflowId,runId,resourceId,stepResults:lastOutput.stepResults,serializedStepGraph:params.serializedStepGraph,executionContext:lastOutput.executionContext,workflowStatus:result.status,result:result.result,error:result.error,runtimeContext:params.runtimeContext});workflowAISpan?.end({output:result.result,attributes:{status:result.status}});if(params.outputOptions?.includeState){return {...result,state:lastState};}return result;}getStepOutput(stepResults,step){if(!step){return stepResults.input;}else if(step.type==="step"||step.type==="waitForEvent"){return stepResults[step.step.id]?.output;}else if(step.type==="sleep"||step.type==="sleepUntil"){return stepResults[step.id]?.output;}else if(step.type==="parallel"||step.type==="conditional"){return step.steps.reduce((acc,entry)=>{acc[entry.step.id]=stepResults[entry.step.id]?.output;return acc;},{});}else if(step.type==="loop"){return stepResults[step.step.id]?.output;}else if(step.type==="foreach"){return stepResults[step.step.id]?.output;}}async executeSleep({workflowId,runId,entry,prevOutput,stepResults,emitter,abortController,runtimeContext,executionContext,writableStream,tracingContext}){let{duration,fn}=entry;const sleepSpan=tracingContext.currentSpan?.createChildSpan({type:"workflow_sleep"/* WORKFLOW_SLEEP */,name:`sleep: ${duration?`${duration}ms`:"dynamic"}`,attributes:{durationMs:duration,sleepType:fn?"dynamic":"fixed"},tracingPolicy:this.options?.tracingPolicy});if(fn){const stepCallId=randomUUID();duration=await fn({runId,workflowId,mastra:this.mastra,runtimeContext,inputData:prevOutput,state:executionContext.state,setState:state=>{executionContext.state=state;},runCount:-1,tracingContext:{currentSpan:sleepSpan},getInitData:()=>stepResults?.input,getStepResult:getStepResult.bind(this,stepResults),// TODO: this function shouldn't have suspend probably?
suspend:async _suspendPayload=>{},bail:()=>{},abort:()=>{abortController?.abort();},[EMITTER_SYMBOL]:emitter,[STREAM_FORMAT_SYMBOL]:executionContext.format,engine:{},abortSignal:abortController?.signal,writer:new ToolStream({prefix:"workflow-step",callId:stepCallId,name:"sleep",runId},writableStream)});sleepSpan?.update({attributes:{durationMs:duration}});}try{await new Promise(resolve=>setTimeout(resolve,!duration||duration<0?0:duration));sleepSpan?.end();}catch(e){sleepSpan?.error({error:e});}}async executeSleepUntil({workflowId,runId,entry,prevOutput,stepResults,emitter,abortController,runtimeContext,executionContext,writableStream,tracingContext}){let{date,fn}=entry;const sleepUntilSpan=tracingContext.currentSpan?.createChildSpan({type:"workflow_sleep"/* WORKFLOW_SLEEP */,name:`sleepUntil: ${date?date.toISOString():"dynamic"}`,attributes:{untilDate:date,durationMs:date?Math.max(0,date.getTime()-Date.now()):void 0,sleepType:fn?"dynamic":"fixed"},tracingPolicy:this.options?.tracingPolicy});if(fn){const stepCallId=randomUUID();date=await fn({runId,workflowId,mastra:this.mastra,runtimeContext,inputData:prevOutput,state:executionContext.state,setState:state=>{executionContext.state=state;},runCount:-1,tracingContext:{currentSpan:sleepUntilSpan},getInitData:()=>stepResults?.input,getStepResult:getStepResult.bind(this,stepResults),// TODO: this function shouldn't have suspend probably?
suspend:async _suspendPayload=>{},bail:()=>{},abort:()=>{abortController?.abort();},[EMITTER_SYMBOL]:emitter,[STREAM_FORMAT_SYMBOL]:executionContext.format,engine:{},abortSignal:abortController?.signal,writer:new ToolStream({prefix:"workflow-step",callId:stepCallId,name:"sleepUntil",runId},writableStream)});const time2=!date?0:date.getTime()-Date.now();sleepUntilSpan?.update({attributes:{durationMs:Math.max(0,time2)}});}const time=!date?0:date?.getTime()-Date.now();try{await new Promise(resolve=>setTimeout(resolve,time<0?0:time));sleepUntilSpan?.end();}catch(e){sleepUntilSpan?.error({error:e});}}async executeWaitForEvent({event,emitter,timeout,tracingContext}){const waitSpan=tracingContext?.currentSpan?.createChildSpan({type:"workflow_wait_event"/* WORKFLOW_WAIT_EVENT */,name:`wait: ${event}`,attributes:{eventName:event,timeoutMs:timeout},tracingPolicy:this.options?.tracingPolicy});const startTime=Date.now();return new Promise((resolve,reject)=>{const cb=eventData=>{waitSpan?.end({output:eventData,attributes:{eventReceived:true,waitDurationMs:Date.now()-startTime}});resolve(eventData);};if(timeout){setTimeout(()=>{emitter.off(`user-event-${event}`,cb);const error=new Error("Timeout waiting for event");waitSpan?.error({error,attributes:{eventReceived:false,waitDurationMs:Date.now()-startTime}});reject(error);},timeout);}emitter.once(`user-event-${event}`,cb);});}async executeStep({workflowId,runId,resourceId,step,stepResults,executionContext,resume,prevOutput,emitter,abortController,runtimeContext,skipEmits=false,writableStream,disableScorers,serializedStepGraph,tracingContext,iterationCount}){const startTime=resume?.steps[0]===step.id?void 0:Date.now();const resumeTime=resume?.steps[0]===step.id?Date.now():void 0;const stepCallId=randomUUID();const{inputData,validationError}=await validateStepInput({prevOutput,step,validateInputs:this.options?.validateInputs??false});const stepInfo={...stepResults[step.id],...(resume?.steps[0]===step.id?{resumePayload:resume?.resumePayload}:{payload:inputData}),...(startTime?{startedAt:startTime}:{}),...(resumeTime?{resumedAt:resumeTime}:{}),status:"running",...(iterationCount?{metadata:{iterationCount}}:{})};const stepAISpan=tracingContext.currentSpan?.createChildSpan({name:`workflow step: '${step.id}'`,type:"workflow_step"/* WORKFLOW_STEP */,input:inputData,attributes:{stepId:step.id},tracingPolicy:this.options?.tracingPolicy});if(!skipEmits){await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:step.id,...stepInfo},workflowState:{status:"running",steps:{...stepResults,[step.id]:{...stepInfo}},result:null,error:null}},eventTimestamp:Date.now()});await emitter.emit("watch-v2",{type:"workflow-step-start",payload:{id:step.id,stepCallId,...stepInfo}});}await this.persistStepUpdate({workflowId,runId,resourceId,serializedStepGraph,stepResults:{...stepResults,[step.id]:stepInfo},executionContext,workflowStatus:"running",runtimeContext});const _runStep=(step2,spanName,attributes)=>{return async data=>{const telemetry=this.mastra?.getTelemetry();const span=executionContext.executionSpan;if(!telemetry||!span){return step2.execute(data);}return context.with(trace.setSpan(context.active(),span),async()=>{return telemetry.traceMethod(step2.execute.bind(step2),{spanName,attributes})(data);});};};const runStep=_runStep(step,`workflow.${workflowId}.step.${step.id}`,{componentName:workflowId,runId,resourceId:resourceId??""});let execResults;const retries=step.retries??executionContext.retryConfig.attempts??0;const delay2=executionContext.retryConfig.delay??0;for(let i=0;i<retries+1;i++){if(i>0&&delay2){await new Promise(resolve=>setTimeout(resolve,delay2));}try{let suspended;let bailed;if(validationError){throw validationError;}const result=await runStep({runId,resourceId,workflowId,mastra:this.mastra?wrapMastra(this.mastra,{currentSpan:stepAISpan}):void 0,runtimeContext,inputData,state:executionContext.state,setState:state=>{executionContext.state=state;},runCount:this.getOrGenerateRunCount(step.id),resumeData:resume?.steps[0]===step.id?resume?.resumePayload:void 0,tracingContext:{currentSpan:stepAISpan},getInitData:()=>stepResults?.input,getStepResult:getStepResult.bind(this,stepResults),suspend:async(suspendPayload,suspendOptions)=>{executionContext.suspendedPaths[step.id]=executionContext.executionPath;if(suspendOptions?.resumeLabel){const resumeLabel=Array.isArray(suspendOptions.resumeLabel)?suspendOptions.resumeLabel:[suspendOptions.resumeLabel];for(const label of resumeLabel){executionContext.resumeLabels[label]={stepId:step.id,foreachIndex:executionContext.foreachIndex};}}suspended={payload:suspendPayload};},bail:result2=>{bailed={payload:result2};},abort:()=>{abortController?.abort();},// Only pass resume data if this step was actually suspended before
// This prevents pending nested workflows from trying to resume instead of start
resume:stepResults[step.id]?.status==="suspended"?{steps:resume?.steps?.slice(1)||[],resumePayload:resume?.resumePayload,// @ts-ignore
runId:stepResults[step.id]?.suspendPayload?.__workflow_meta?.runId,label:resume?.label,forEachIndex:resume?.forEachIndex}:void 0,[EMITTER_SYMBOL]:emitter,[STREAM_FORMAT_SYMBOL]:executionContext.format,engine:{},abortSignal:abortController?.signal,writer:new ToolStream({prefix:"workflow-step",callId:stepCallId,name:step.id,runId},writableStream),// Disable scorers must be explicitly set to false they are on by default
scorers:disableScorers===false?void 0:step.scorers,validateInputs:this.options?.validateInputs});if(step.scorers){await this.runScorers({scorers:step.scorers,runId,input:inputData,output:result,workflowId,stepId:step.id,runtimeContext,disableScorers,tracingContext:{currentSpan:stepAISpan}});}if(suspended){execResults={status:"suspended",suspendPayload:suspended.payload,suspendedAt:Date.now()};}else if(bailed){execResults={status:"bailed",output:bailed.payload,endedAt:Date.now()};}else {execResults={status:"success",output:result,endedAt:Date.now()};}break;}catch(e){const error=this.preprocessExecutionError(e,{id:"WORKFLOW_STEP_INVOKE_FAILED",domain:"MASTRA_WORKFLOW"/* MASTRA_WORKFLOW */,category:"USER"/* USER */,details:{workflowId,runId,stepId:step.id}},`Error executing step ${step.id}: `);stepAISpan?.error({error,attributes:{status:"failed"}});execResults={status:"failed",error:error?.stack,endedAt:Date.now()};}}if(!skipEmits){await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:step.id,...stepInfo,...execResults},workflowState:{status:"running",steps:{...stepResults,[step.id]:{...stepInfo,...execResults}},result:null,error:null}},eventTimestamp:Date.now()});if(execResults.status==="suspended"){await emitter.emit("watch-v2",{type:"workflow-step-suspended",payload:{id:step.id,stepCallId,...execResults}});}else {await emitter.emit("watch-v2",{type:"workflow-step-result",payload:{id:step.id,stepCallId,...execResults}});await emitter.emit("watch-v2",{type:"workflow-step-finish",payload:{id:step.id,stepCallId,metadata:{}}});}}if(execResults.status!="failed"){stepAISpan?.end({output:execResults.output,attributes:{status:execResults.status}});}return {...stepInfo,...execResults};}async runScorers({scorers,runId,input,output,workflowId,stepId,runtimeContext,disableScorers,tracingContext}){let scorersToUse=scorers;if(typeof scorersToUse==="function"){try{scorersToUse=await scorersToUse({runtimeContext});}catch(error){this.preprocessExecutionError(error,{id:"WORKFLOW_FAILED_TO_FETCH_SCORERS",domain:"MASTRA_WORKFLOW"/* MASTRA_WORKFLOW */,category:"USER"/* USER */,details:{runId,workflowId,stepId}},"Error fetching scorers: ");}}if(!disableScorers&&scorersToUse&&Object.keys(scorersToUse||{}).length>0){for(const[_id,scorerObject]of Object.entries(scorersToUse||{})){runScorer({scorerId:scorerObject.name,scorerObject,runId,input,output,runtimeContext,entity:{id:workflowId,stepId},structuredOutput:true,source:"LIVE",entityType:"WORKFLOW",tracingContext});}}}async executeParallel({workflowId,runId,resourceId,entry,prevStep,serializedStepGraph,stepResults,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers}){const parallelSpan=tracingContext.currentSpan?.createChildSpan({type:"workflow_parallel"/* WORKFLOW_PARALLEL */,name:`parallel: '${entry.steps.length} branches'`,input:this.getStepOutput(stepResults,prevStep),attributes:{branchCount:entry.steps.length,parallelSteps:entry.steps.map(s=>s.type==="step"?s.step.id:`control-${s.type}`)},tracingPolicy:this.options?.tracingPolicy});const prevOutput=this.getStepOutput(stepResults,prevStep);for(const step of entry.steps){if(step.type==="step"){const startTime=resume?.steps[0]===step.step.id?void 0:Date.now();const resumeTime=resume?.steps[0]===step.step.id?Date.now():void 0;stepResults[step.step.id]={...stepResults[step.step.id],status:"running",...(resumeTime?{resumePayload:resume?.resumePayload}:{payload:prevOutput}),...(startTime?{startedAt:startTime}:{}),...(resumeTime?{resumedAt:resumeTime}:{})};}}let execResults;const results=await Promise.all(entry.steps.map(async(step,i)=>{const result=await this.executeStep({workflowId,runId,resourceId,step:step.step,prevOutput,stepResults,serializedStepGraph,resume,executionContext:{workflowId,runId,executionPath:[...executionContext.executionPath,i],suspendedPaths:executionContext.suspendedPaths,resumeLabels:executionContext.resumeLabels,retryConfig:executionContext.retryConfig,executionSpan:executionContext.executionSpan,state:executionContext.state},tracingContext:{currentSpan:parallelSpan},emitter,abortController,runtimeContext,writableStream,disableScorers});stepResults[step.step.id]=result;return result;}));const hasFailed=results.find(result=>result.status==="failed");const hasSuspended=results.find(result=>result.status==="suspended");if(hasFailed){execResults={status:"failed",error:hasFailed.error};}else if(hasSuspended){execResults={status:"suspended",payload:hasSuspended.suspendPayload};}else if(abortController?.signal?.aborted){execResults={status:"canceled"};}else {execResults={status:"success",output:results.reduce((acc,result,index)=>{if(result.status==="success"){acc[entry.steps[index].step.id]=result.output;}return acc;},{})};}if(execResults.status==="failed"){parallelSpan?.error({error:new Error(execResults.error)});}else {parallelSpan?.end({output:execResults.output||execResults});}return execResults;}async executeConditional({workflowId,runId,resourceId,entry,prevOutput,serializedStepGraph,stepResults,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers}){const conditionalSpan=tracingContext.currentSpan?.createChildSpan({type:"workflow_conditional"/* WORKFLOW_CONDITIONAL */,name:`conditional: '${entry.conditions.length} conditions'`,input:prevOutput,attributes:{conditionCount:entry.conditions.length},tracingPolicy:this.options?.tracingPolicy});let execResults;const truthyIndexes=(await Promise.all(entry.conditions.map(async(cond,index)=>{const evalSpan=conditionalSpan?.createChildSpan({type:"workflow_conditional_eval"/* WORKFLOW_CONDITIONAL_EVAL */,name:`condition '${index}'`,input:prevOutput,attributes:{conditionIndex:index},tracingPolicy:this.options?.tracingPolicy});try{const result=await cond({runId,workflowId,mastra:this.mastra,runtimeContext,inputData:prevOutput,state:executionContext.state,setState:state=>{executionContext.state=state;},runCount:-1,tracingContext:{currentSpan:evalSpan},getInitData:()=>stepResults?.input,getStepResult:getStepResult.bind(this,stepResults),// TODO: this function shouldn't have suspend probably?
suspend:async _suspendPayload=>{},bail:()=>{},abort:()=>{abortController?.abort();},[EMITTER_SYMBOL]:emitter,[STREAM_FORMAT_SYMBOL]:executionContext.format,engine:{},abortSignal:abortController?.signal,writer:new ToolStream({prefix:"workflow-step",callId:randomUUID(),name:"conditional",runId},writableStream)});evalSpan?.end({output:result,attributes:{result:!!result}});return result?index:null;}catch(e){const error=this.preprocessExecutionError(e,{id:"WORKFLOW_CONDITION_EVALUATION_FAILED",domain:"MASTRA_WORKFLOW"/* MASTRA_WORKFLOW */,category:"USER"/* USER */,details:{workflowId,runId}},"Error evaluating condition: ");evalSpan?.error({error,attributes:{result:false}});return null;}}))).filter(index=>index!==null);const stepsToRun=entry.steps.filter((_,index)=>truthyIndexes.includes(index));conditionalSpan?.update({attributes:{truthyIndexes,selectedSteps:stepsToRun.map(s=>s.type==="step"?s.step.id:`control-${s.type}`)}});const results=await Promise.all(stepsToRun.map(async(step,index)=>{const currStepResult=stepResults[step.step.id];if(currStepResult&&currStepResult.status==="success"){return currStepResult;}const result=await this.executeStep({workflowId,runId,resourceId,step:step.step,prevOutput,stepResults,serializedStepGraph,resume,executionContext:{workflowId,runId,executionPath:[...executionContext.executionPath,index],suspendedPaths:executionContext.suspendedPaths,resumeLabels:executionContext.resumeLabels,retryConfig:executionContext.retryConfig,executionSpan:executionContext.executionSpan,state:executionContext.state},tracingContext:{currentSpan:conditionalSpan},emitter,abortController,runtimeContext,writableStream,disableScorers});stepResults[step.step.id]=result;return result;}));const hasFailed=results.find(result=>result.status==="failed");const hasSuspended=results.find(result=>result.status==="suspended");if(hasFailed){execResults={status:"failed",error:hasFailed.error};}else if(hasSuspended){execResults={status:"suspended",payload:hasSuspended.suspendPayload,suspendedAt:Date.now()};}else if(abortController?.signal?.aborted){execResults={status:"canceled"};}else {execResults={status:"success",output:results.reduce((acc,result,index)=>{if(result.status==="success"){acc[stepsToRun[index].step.id]=result.output;}return acc;},{})};}if(execResults.status==="failed"){conditionalSpan?.error({error:new Error(execResults.error)});}else {conditionalSpan?.end({output:execResults.output||execResults});}return execResults;}async executeLoop({workflowId,runId,resourceId,entry,prevOutput,stepResults,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers,serializedStepGraph}){const{step,condition}=entry;const loopSpan=tracingContext.currentSpan?.createChildSpan({type:"workflow_loop"/* WORKFLOW_LOOP */,name:`loop: '${entry.loopType}'`,input:prevOutput,attributes:{loopType:entry.loopType},tracingPolicy:this.options?.tracingPolicy});let isTrue=true;const prevIterationCount=stepResults[step.id]?.metadata?.iterationCount;let iteration=prevIterationCount?prevIterationCount-1:0;const prevPayload=stepResults[step.id]?.payload;let result={status:"success",output:prevPayload??prevOutput};let currentResume=resume;do{result=await this.executeStep({workflowId,runId,resourceId,step,stepResults,executionContext,resume:currentResume,prevOutput:result.output,tracingContext:{currentSpan:loopSpan},emitter,abortController,runtimeContext,writableStream,disableScorers,serializedStepGraph,iterationCount:iteration+1});if(currentResume&&result.status!=="suspended"){currentResume=void 0;}if(result.status!=="success"){loopSpan?.end({attributes:{totalIterations:iteration}});return result;}const evalSpan=loopSpan?.createChildSpan({type:"workflow_conditional_eval"/* WORKFLOW_CONDITIONAL_EVAL */,name:`condition: '${entry.loopType}'`,input:selectFields(result.output,["stepResult","output.text","output.object","messages"]),attributes:{conditionIndex:iteration},tracingPolicy:this.options?.tracingPolicy});isTrue=await condition({workflowId,runId,mastra:this.mastra,runtimeContext,inputData:result.output,state:executionContext.state,setState:state=>{executionContext.state=state;},runCount:-1,tracingContext:{currentSpan:evalSpan},iterationCount:iteration+1,getInitData:()=>stepResults?.input,getStepResult:getStepResult.bind(this,stepResults),suspend:async _suspendPayload=>{},bail:()=>{},abort:()=>{abortController?.abort();},[EMITTER_SYMBOL]:emitter,[STREAM_FORMAT_SYMBOL]:executionContext.format,engine:{},abortSignal:abortController?.signal,writer:new ToolStream({prefix:"workflow-step",callId:randomUUID(),name:"loop",runId},writableStream)});evalSpan?.end({output:isTrue});iteration++;}while(entry.loopType==="dowhile"?isTrue:!isTrue);loopSpan?.end({output:result.output,attributes:{totalIterations:iteration}});return result;}async executeForeach({workflowId,runId,resourceId,entry,prevOutput,stepResults,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers,serializedStepGraph}){const{step,opts}=entry;const results=[];const concurrency=opts.concurrency;const startTime=resume?.steps[0]===step.id?void 0:Date.now();const resumeTime=resume?.steps[0]===step.id?Date.now():void 0;const stepInfo={...stepResults[step.id],...(resume?.steps[0]===step.id?{resumePayload:resume?.resumePayload}:{payload:prevOutput}),...(startTime?{startedAt:startTime}:{}),...(resumeTime?{resumedAt:resumeTime}:{})};const loopSpan=tracingContext.currentSpan?.createChildSpan({type:"workflow_loop"/* WORKFLOW_LOOP */,name:`loop: 'foreach'`,input:prevOutput,attributes:{loopType:"foreach",concurrency},tracingPolicy:this.options?.tracingPolicy});await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:step.id,status:"running",...stepInfo},workflowState:{status:"running",steps:{...stepResults,[step.id]:{status:"running",...stepInfo}},result:null,error:null}},eventTimestamp:Date.now()});await emitter.emit("watch-v2",{type:"workflow-step-start",payload:{id:step.id,...stepInfo,status:"running"}});const prevPayload=stepResults[step.id];const foreachIndexObj={};const resumeIndex=prevPayload?.status==="suspended"?prevPayload?.suspendPayload?.__workflow_meta?.foreachIndex||0:0;const prevForeachOutput=prevPayload?.suspendPayload?.__workflow_meta?.foreachOutput||[];const prevResumeLabels=prevPayload?.suspendPayload?.__workflow_meta?.resumeLabels||{};const resumeLabels=getResumeLabelsByStepId(prevResumeLabels,step.id);for(let i=0;i<prevOutput.length;i+=concurrency){const items=prevOutput.slice(i,i+concurrency);const itemsResults=await Promise.all(items.map((item,j)=>{const k=i+j;const prevItemResult=prevForeachOutput[k];if(prevItemResult?.status==="success"||prevItemResult?.status==="suspended"&&resume?.forEachIndex!==k&&resume?.forEachIndex!==void 0){return prevItemResult;}let resumeToUse=void 0;if(resume?.forEachIndex!==void 0){resumeToUse=resume.forEachIndex===k?resume:void 0;}else {const isIndexSuspended=prevItemResult?.status==="suspended"||resumeIndex===k;if(isIndexSuspended){resumeToUse=resume;}}return this.executeStep({workflowId,runId,resourceId,step,stepResults,executionContext:{...executionContext,foreachIndex:k},resume:resumeToUse,prevOutput:item,tracingContext:{currentSpan:loopSpan},emitter,abortController,runtimeContext,skipEmits:true,writableStream,disableScorers,serializedStepGraph});}));for(const[resultIndex,result]of itemsResults.entries()){if(result.status!=="success"){const{status,error,suspendPayload,suspendedAt,endedAt,output}=result;const execResults={status,error,suspendPayload,suspendedAt,endedAt,output};await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:step.id,...stepInfo,...execResults},workflowState:{status:"running",steps:{...stepResults,[step.id]:{...stepInfo,...execResults}},result:null,error:null}},eventTimestamp:Date.now()});if(execResults.status==="suspended"){foreachIndexObj[i+resultIndex]=execResults;}else {await emitter.emit("watch-v2",{type:"workflow-step-result",payload:{id:step.id,...execResults}});await emitter.emit("watch-v2",{type:"workflow-step-finish",payload:{id:step.id,metadata:{}}});return result;}}else {const indexResumeLabel=Object.keys(resumeLabels).find(key=>resumeLabels[key]?.foreachIndex===i+resultIndex);delete resumeLabels[indexResumeLabel];}if(result?.output){results[i+resultIndex]=result?.output;}prevForeachOutput[i+resultIndex]={...result,suspendPayload:{}};}if(Object.keys(foreachIndexObj).length>0){const suspendedIndices=Object.keys(foreachIndexObj).map(Number);const foreachIndex=suspendedIndices[0];await emitter.emit("watch-v2",{type:"workflow-step-suspended",payload:{id:step.id,...foreachIndexObj[foreachIndex]}});executionContext.suspendedPaths[step.id]=executionContext.executionPath;executionContext.resumeLabels={...resumeLabels,...executionContext.resumeLabels};return {...stepInfo,suspendedAt:Date.now(),status:"suspended",suspendPayload:{...foreachIndexObj[foreachIndex].suspendPayload,__workflow_meta:{...foreachIndexObj[foreachIndex].suspendPayload?.__workflow_meta,foreachIndex,foreachOutput:prevForeachOutput,resumeLabels:executionContext.resumeLabels}}};}}await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:step.id,...stepInfo,status:"success",output:results,endedAt:Date.now()},workflowState:{status:"running",steps:{...stepResults,[step.id]:{...stepInfo,status:"success",output:results,endedAt:Date.now()}},result:null,error:null}},eventTimestamp:Date.now()});await emitter.emit("watch-v2",{type:"workflow-step-result",payload:{id:step.id,status:"success",output:results,endedAt:Date.now()}});await emitter.emit("watch-v2",{type:"workflow-step-finish",payload:{id:step.id,metadata:{}}});loopSpan?.end({output:results});return {...stepInfo,status:"success",output:results,//@ts-ignore
endedAt:Date.now()};}async persistStepUpdate({workflowId,runId,resourceId,stepResults,serializedStepGraph,executionContext,workflowStatus,result,error,runtimeContext}){const shouldPersistSnapshot=this.options?.shouldPersistSnapshot?.({stepResults,workflowStatus});if(!shouldPersistSnapshot){return;}const runtimeContextObj={};runtimeContext.forEach((value,key)=>{runtimeContextObj[key]=value;});await this.mastra?.getStorage()?.persistWorkflowSnapshot({workflowName:workflowId,runId,resourceId,snapshot:{runId,status:workflowStatus,value:executionContext.state,context:stepResults,activePaths:[],serializedStepGraph,suspendedPaths:executionContext.suspendedPaths,waitingPaths:{},resumeLabels:executionContext.resumeLabels,result,error,runtimeContext:runtimeContextObj,// @ts-ignore
timestamp:Date.now()}});}async executeEntry({workflowId,runId,resourceId,entry,prevStep,serializedStepGraph,stepResults,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers}){const prevOutput=this.getStepOutput(stepResults,prevStep);let execResults;if(entry.type==="step"){const{step}=entry;execResults=await this.executeStep({workflowId,runId,resourceId,step,stepResults,executionContext,resume,prevOutput,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers,serializedStepGraph});}else if(resume?.resumePath?.length&&entry.type==="parallel"){const idx=resume.resumePath.shift();const resumedStepResult=await this.executeEntry({workflowId,runId,resourceId,entry:entry.steps[idx],prevStep,serializedStepGraph,stepResults,resume,executionContext:{workflowId,runId,executionPath:[...executionContext.executionPath,idx],suspendedPaths:executionContext.suspendedPaths,resumeLabels:executionContext.resumeLabels,retryConfig:executionContext.retryConfig,executionSpan:executionContext.executionSpan,state:executionContext.state},tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers});if(resumedStepResult.stepResults){Object.assign(stepResults,resumedStepResult.stepResults);}const allParallelStepsComplete=entry.steps.every(parallelStep=>{if(parallelStep.type==="step"){const stepResult=stepResults[parallelStep.step.id];return stepResult&&stepResult.status==="success";}return true;});if(allParallelStepsComplete){execResults={status:"success",output:entry.steps.reduce((acc,parallelStep)=>{if(parallelStep.type==="step"){const stepResult=stepResults[parallelStep.step.id];if(stepResult&&stepResult.status==="success"){acc[parallelStep.step.id]=stepResult.output;}}return acc;},{})};}else {const stillSuspended=entry.steps.find(parallelStep=>{if(parallelStep.type==="step"){const stepResult=stepResults[parallelStep.step.id];return stepResult&&stepResult.status==="suspended";}return false;});execResults={status:"suspended",payload:stillSuspended&&stillSuspended.type==="step"?stepResults[stillSuspended.step.id]?.suspendPayload:{}};}const updatedExecutionContext={...executionContext,...resumedStepResult.executionContext,suspendedPaths:{...executionContext.suspendedPaths,...resumedStepResult.executionContext?.suspendedPaths}};if(execResults.status==="suspended"){entry.steps.forEach((parallelStep,stepIndex)=>{if(parallelStep.type==="step"){const stepResult=stepResults[parallelStep.step.id];if(stepResult&&stepResult.status==="suspended"){updatedExecutionContext.suspendedPaths[parallelStep.step.id]=[...executionContext.executionPath,stepIndex];}}});}return {result:execResults,stepResults:resumedStepResult.stepResults,executionContext:updatedExecutionContext};}else if(entry.type==="parallel"){execResults=await this.executeParallel({workflowId,runId,entry,prevStep,stepResults,serializedStepGraph,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers});}else if(entry.type==="conditional"){execResults=await this.executeConditional({workflowId,runId,entry,prevOutput,stepResults,serializedStepGraph,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers});}else if(entry.type==="loop"){execResults=await this.executeLoop({workflowId,runId,entry,prevStep,prevOutput,stepResults,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers,serializedStepGraph});}else if(entry.type==="foreach"){execResults=await this.executeForeach({workflowId,runId,entry,prevStep,prevOutput,stepResults,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers,serializedStepGraph});}else if(entry.type==="sleep"){const startedAt=Date.now();await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:entry.id,status:"waiting",payload:prevOutput,startedAt},workflowState:{status:"waiting",steps:{...stepResults,[entry.id]:{status:"waiting",payload:prevOutput,startedAt}},result:null,error:null}},eventTimestamp:Date.now()});await emitter.emit("watch-v2",{type:"workflow-step-waiting",payload:{id:entry.id,payload:prevOutput,startedAt,status:"waiting"}});await this.persistStepUpdate({workflowId,runId,resourceId,serializedStepGraph,stepResults,executionContext,workflowStatus:"waiting",runtimeContext});await this.executeSleep({workflowId,runId,entry,prevStep,prevOutput,stepResults,serializedStepGraph,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream});await this.persistStepUpdate({workflowId,runId,resourceId,serializedStepGraph,stepResults,executionContext,workflowStatus:"running",runtimeContext});const endedAt=Date.now();const stepInfo={payload:prevOutput,startedAt,endedAt};execResults={...stepInfo,status:"success",output:prevOutput};stepResults[entry.id]={...stepInfo,status:"success",output:prevOutput};await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:entry.id,...execResults},workflowState:{status:"running",steps:{...stepResults,[entry.id]:{...execResults}},result:null,error:null}},eventTimestamp:Date.now()});await emitter.emit("watch-v2",{type:"workflow-step-result",payload:{id:entry.id,endedAt,status:"success",output:prevOutput}});await emitter.emit("watch-v2",{type:"workflow-step-finish",payload:{id:entry.id,metadata:{}}});}else if(entry.type==="sleepUntil"){const startedAt=Date.now();await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:entry.id,status:"waiting",payload:prevOutput,startedAt},workflowState:{status:"waiting",steps:{...stepResults,[entry.id]:{status:"waiting",payload:prevOutput,startedAt}},result:null,error:null}},eventTimestamp:Date.now()});await emitter.emit("watch-v2",{type:"workflow-step-waiting",payload:{id:entry.id,payload:prevOutput,startedAt,status:"waiting"}});await this.persistStepUpdate({workflowId,runId,resourceId,serializedStepGraph,stepResults,executionContext,workflowStatus:"waiting",runtimeContext});await this.executeSleepUntil({workflowId,runId,entry,prevStep,prevOutput,stepResults,serializedStepGraph,resume,executionContext,tracingContext,emitter,abortController,runtimeContext,writableStream});await this.persistStepUpdate({workflowId,runId,resourceId,serializedStepGraph,stepResults,executionContext,workflowStatus:"running",runtimeContext});const endedAt=Date.now();const stepInfo={payload:prevOutput,startedAt,endedAt};execResults={...stepInfo,status:"success",output:prevOutput};stepResults[entry.id]={...stepInfo,status:"success",output:prevOutput};await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:entry.id,...execResults},workflowState:{status:"running",steps:{...stepResults,[entry.id]:{...execResults}},result:null,error:null}},eventTimestamp:Date.now()});await emitter.emit("watch-v2",{type:"workflow-step-result",payload:{id:entry.id,endedAt,status:"success",output:prevOutput}});await emitter.emit("watch-v2",{type:"workflow-step-finish",payload:{id:entry.id,metadata:{}}});}else if(entry.type==="waitForEvent"){const startedAt=Date.now();let eventData;await emitter.emit("watch",{type:"watch",payload:{currentStep:{id:entry.step.id,status:"waiting",payload:prevOutput,startedAt},workflowState:{status:"waiting",steps:{...stepResults,[entry.step.id]:{status:"waiting",payload:prevOutput,startedAt}},result:null,error:null}},eventTimestamp:Date.now()});await emitter.emit("watch-v2",{type:"workflow-step-waiting",payload:{id:entry.step.id,payload:prevOutput,startedAt,status:"waiting"}});stepResults[entry.step.id]={status:"waiting",payload:prevOutput,startedAt};await this.persistStepUpdate({workflowId,runId,resourceId,serializedStepGraph,stepResults,executionContext,workflowStatus:"waiting",runtimeContext});try{eventData=await this.executeWaitForEvent({event:entry.event,emitter,timeout:entry.timeout,tracingContext});const{step}=entry;execResults=await this.executeStep({workflowId,runId,resourceId,step,stepResults,executionContext,resume:{resumePayload:eventData,steps:[entry.step.id]},prevOutput,tracingContext,emitter,abortController,runtimeContext,writableStream,disableScorers,serializedStepGraph});}catch(error){execResults={status:"failed",error};}const endedAt=Date.now();const stepInfo={payload:prevOutput,startedAt,endedAt};execResults={...execResults,...stepInfo};}if(entry.type==="step"||entry.type==="waitForEvent"||entry.type==="loop"||entry.type==="foreach"){stepResults[entry.step.id]=execResults;}if(abortController?.signal?.aborted){execResults={...execResults,status:"canceled"};}await this.persistStepUpdate({workflowId,runId,resourceId,serializedStepGraph,stepResults,executionContext,workflowStatus:execResults.status==="success"?"running":execResults.status,runtimeContext});if(execResults.status==="canceled"){await emitter.emit("watch-v2",{type:"workflow-canceled",payload:{}});}return {result:execResults,stepResults,executionContext};}};// src/workflows/workflow.ts
function createStep(params,agentOptions){if(params instanceof Agent){return {id:params.name,description:params.getDescription(),// @ts-ignore
inputSchema:objectType({prompt:stringType()// resourceId: z.string().optional(),
// threadId: z.string().optional(),
}),// @ts-ignore
outputSchema:objectType({text:stringType()}),execute:async({inputData,[EMITTER_SYMBOL]:emitter,[STREAM_FORMAT_SYMBOL]:streamFormat,runtimeContext,tracingContext,abortSignal,abort,writer})=>{let streamPromise={};streamPromise.promise=new Promise((resolve,reject)=>{streamPromise.resolve=resolve;streamPromise.reject=reject;});const toolData={name:params.name,args:inputData};let stream;if((await params.getModel()).specificationVersion==="v1"){const{fullStream}=await params.streamLegacy(inputData.prompt,{...(agentOptions??{}),// resourceId: inputData.resourceId,
// threadId: inputData.threadId,
runtimeContext,tracingContext,onFinish:result=>{streamPromise.resolve(result.text);void agentOptions?.onFinish?.(result);},abortSignal});stream=fullStream;}else {const modelOutput=await params.stream(inputData.prompt,{...(agentOptions??{}),runtimeContext,tracingContext,onFinish:result=>{streamPromise.resolve(result.text);void agentOptions?.onFinish?.(result);},abortSignal});stream=modelOutput.fullStream;}if(streamFormat==="legacy"){await emitter.emit("watch-v2",{type:"tool-call-streaming-start",...(toolData??{})});for await(const chunk of stream){if(chunk.type==="text-delta"){await emitter.emit("watch-v2",{type:"tool-call-delta",...(toolData??{}),argsTextDelta:chunk.textDelta});}}await emitter.emit("watch-v2",{type:"tool-call-streaming-finish",...(toolData??{})});}else {for await(const chunk of stream){await writer.write(chunk);}}if(abortSignal.aborted){return abort();}return {text:await streamPromise.promise};},component:params.component};}if(params instanceof Tool){if(!params.inputSchema||!params.outputSchema){throw new Error("Tool must have input and output schemas defined");}return {// TODO: tool probably should have strong id type
// @ts-ignore
id:params.id,description:params.description,inputSchema:params.inputSchema,outputSchema:params.outputSchema,execute:async({inputData,mastra,runtimeContext,tracingContext,suspend,resumeData})=>{return params.execute({context:inputData,mastra,runtimeContext,tracingContext,suspend,resumeData});},component:"TOOL"};}return {id:params.id,description:params.description,inputSchema:params.inputSchema,stateSchema:params.stateSchema,outputSchema:params.outputSchema,resumeSchema:params.resumeSchema,suspendSchema:params.suspendSchema,scorers:params.scorers,retries:params.retries,execute:params.execute.bind(params)};}function createWorkflow(params){return new Workflow(params);}var Workflow=class extends MastraBase{id;description;inputSchema;outputSchema;stateSchema;steps;stepDefs;stepFlow;serializedStepFlow;executionEngine;executionGraph;#options;retryConfig;#mastra;#runs=/* @__PURE__ */new Map();constructor({mastra,id,inputSchema,outputSchema,stateSchema,description,executionEngine,retryConfig,steps,options={}}){super({name:id,component:RegisteredLogger.WORKFLOW});this.id=id;this.description=description;this.inputSchema=inputSchema;this.outputSchema=outputSchema;this.stateSchema=stateSchema;this.retryConfig=retryConfig??{attempts:0,delay:0};this.executionGraph=this.buildExecutionGraph();this.stepFlow=[];this.serializedStepFlow=[];this.#mastra=mastra;this.steps={};this.stepDefs=steps;this.#options={validateInputs:options.validateInputs??false,shouldPersistSnapshot:options.shouldPersistSnapshot??(()=>true),tracingPolicy:options.tracingPolicy};if(!executionEngine){this.executionEngine=new DefaultExecutionEngine({mastra:this.#mastra,options:this.#options});}else {this.executionEngine=executionEngine;}this.#runs=/* @__PURE__ */new Map();}get runs(){return this.#runs;}get mastra(){return this.#mastra;}get options(){return this.#options;}__registerMastra(mastra){this.#mastra=mastra;this.executionEngine.__registerMastra(mastra);}__registerPrimitives(p){if(p.telemetry){this.__setTelemetry(p.telemetry);}if(p.logger){this.__setLogger(p.logger);}}setStepFlow(stepFlow){this.stepFlow=stepFlow;}/**
   * Adds a step to the workflow
   * @param step The step to add to the workflow
   * @returns The workflow instance for chaining
   */then(step){this.stepFlow.push({type:"step",step});this.serializedStepFlow.push({type:"step",step:{id:step.id,description:step.description,component:step.component,serializedStepFlow:step.serializedStepFlow}});this.steps[step.id]=step;return this;}/**
   * Adds a sleep step to the workflow
   * @param duration The duration to sleep for
   * @returns The workflow instance for chaining
   */sleep(duration){const id=`sleep_${this.#mastra?.generateId()||randomUUID()}`;const opts=typeof duration==="function"?{type:"sleep",id,fn:duration}:{type:"sleep",id,duration};const serializedOpts=typeof duration==="function"?{type:"sleep",id,fn:duration.toString()}:{type:"sleep",id,duration};this.stepFlow.push(opts);this.serializedStepFlow.push(serializedOpts);this.steps[id]=createStep({id,inputSchema:objectType({}),outputSchema:objectType({}),execute:async()=>{return {};}});return this;}/**
   * Adds a sleep until step to the workflow
   * @param date The date to sleep until
   * @returns The workflow instance for chaining
   */sleepUntil(date){const id=`sleep_${this.#mastra?.generateId()||randomUUID()}`;const opts=typeof date==="function"?{type:"sleepUntil",id,fn:date}:{type:"sleepUntil",id,date};const serializedOpts=typeof date==="function"?{type:"sleepUntil",id,fn:date.toString()}:{type:"sleepUntil",id,date};this.stepFlow.push(opts);this.serializedStepFlow.push(serializedOpts);this.steps[id]=createStep({id,inputSchema:objectType({}),outputSchema:objectType({}),execute:async()=>{return {};}});return this;}waitForEvent(event,step,opts){this.stepFlow.push({type:"waitForEvent",event,step,timeout:opts?.timeout});this.serializedStepFlow.push({type:"waitForEvent",event,step:{id:step.id,description:step.description,component:step.component,serializedStepFlow:step.serializedStepFlow},timeout:opts?.timeout});this.steps[step.id]=step;return this;}map(mappingConfig,stepOptions){if(typeof mappingConfig==="function"){const mappingStep2=createStep({id:stepOptions?.id||`mapping_${this.#mastra?.generateId()||randomUUID()}`,inputSchema:objectType({}),outputSchema:objectType({}),execute:mappingConfig});this.stepFlow.push({type:"step",step:mappingStep2});this.serializedStepFlow.push({type:"step",step:{id:mappingStep2.id,mapConfig:mappingConfig.toString()}});return this;}const newMappingConfig=Object.entries(mappingConfig).reduce((a,[key,mapping])=>{const m=mapping;if(m.value!==void 0){a[key]=m;}else if(m.fn!==void 0){a[key]={fn:m.fn.toString(),schema:m.schema};}else if(m.runtimeContextPath){a[key]={runtimeContextPath:m.runtimeContextPath,schema:m.schema};}else {a[key]=m;}return a;},{});const mappingStep=createStep({id:stepOptions?.id||`mapping_${this.#mastra?.generateId()||randomUUID()}`,inputSchema:anyType(),outputSchema:anyType(),execute:async ctx=>{const{getStepResult:getStepResult3,getInitData,runtimeContext}=ctx;const result={};for(const[key,mapping]of Object.entries(mappingConfig)){const m=mapping;if(m.value!==void 0){result[key]=m.value;continue;}if(m.fn!==void 0){result[key]=await m.fn(ctx);continue;}if(m.runtimeContextPath){result[key]=runtimeContext.get(m.runtimeContextPath);continue;}const stepResult=m.initData?getInitData():getStepResult3(Array.isArray(m.step)?m.step.find(s=>getStepResult3(s)):m.step);if(m.path==="."){result[key]=stepResult;continue;}const pathParts=m.path.split(".");let value=stepResult;for(const part of pathParts){if(typeof value==="object"&&value!==null){value=value[part];}else {throw new Error(`Invalid path ${m.path} in step ${m?.step?.id??"initData"}`);}}result[key]=value;}return result;}});this.stepFlow.push({type:"step",step:mappingStep});this.serializedStepFlow.push({type:"step",step:{id:mappingStep.id,mapConfig:JSON.stringify(newMappingConfig,null,2)}});return this;}// TODO: make typing better here
parallel(steps){this.stepFlow.push({type:"parallel",steps:steps.map(step=>({type:"step",step}))});this.serializedStepFlow.push({type:"parallel",steps:steps.map(step=>({type:"step",step:{id:step.id,description:step.description,component:step.component,serializedStepFlow:step.serializedStepFlow}}))});steps.forEach(step=>{this.steps[step.id]=step;});return this;}// TODO: make typing better here
// TODO: add state schema to the type, this is currently broken
branch(steps){this.stepFlow.push({type:"conditional",steps:steps.map(([_cond,step])=>({type:"step",step})),// @ts-ignore
conditions:steps.map(([cond])=>cond),serializedConditions:steps.map(([cond,_step])=>({id:`${_step.id}-condition`,fn:cond.toString()}))});this.serializedStepFlow.push({type:"conditional",steps:steps.map(([_cond,step])=>({type:"step",step:{id:step.id,description:step.description,component:step.component,serializedStepFlow:step.serializedStepFlow}})),serializedConditions:steps.map(([cond,_step])=>({id:`${_step.id}-condition`,fn:cond.toString()}))});steps.forEach(([_,step])=>{this.steps[step.id]=step;});return this;}dowhile(step,condition){this.stepFlow.push({type:"loop",step,// @ts-ignore
condition,loopType:"dowhile",serializedCondition:{id:`${step.id}-condition`,fn:condition.toString()}});this.serializedStepFlow.push({type:"loop",step:{id:step.id,description:step.description,component:step.component,serializedStepFlow:step.serializedStepFlow},serializedCondition:{id:`${step.id}-condition`,fn:condition.toString()},loopType:"dowhile"});this.steps[step.id]=step;return this;}dountil(step,condition){this.stepFlow.push({type:"loop",step,// @ts-ignore
condition,loopType:"dountil",serializedCondition:{id:`${step.id}-condition`,fn:condition.toString()}});this.serializedStepFlow.push({type:"loop",step:{id:step.id,description:step.description,component:step.component,serializedStepFlow:step.serializedStepFlow},serializedCondition:{id:`${step.id}-condition`,fn:condition.toString()},loopType:"dountil"});this.steps[step.id]=step;return this;}foreach(step,opts){this.stepFlow.push({type:"foreach",step,opts:opts??{concurrency:1}});this.serializedStepFlow.push({type:"foreach",step:{id:step.id,description:step.description,component:step.component,serializedStepFlow:step.serializedStepFlow},opts:opts??{concurrency:1}});this.steps[step.id]=step;return this;}/**
   * Builds the execution graph for this workflow
   * @returns The execution graph that can be used to execute the workflow
   */buildExecutionGraph(){return {id:this.id,steps:this.stepFlow};}/**
   * Finalizes the workflow definition and prepares it for execution
   * This method should be called after all steps have been added to the workflow
   * @returns A built workflow instance ready for execution
   */commit(){this.executionGraph=this.buildExecutionGraph();return this;}get stepGraph(){return this.stepFlow;}get serializedStepGraph(){return this.serializedStepFlow;}/**
   * @deprecated Use createRunAsync() instead.
   * @throws {Error} Always throws an error directing users to use createRunAsync()
   */createRun(_options){throw new Error("createRun() has been deprecated. Please use createRunAsync() instead.\n\nMigration guide:\n  Before: const run = workflow.createRun();\n  After:  const run = await workflow.createRunAsync();\n\nNote: createRunAsync() is an async method, so make sure your calling function is async.");}/**
   * Creates a new workflow run instance and stores a snapshot of the workflow in the storage
   * @param options Optional configuration for the run
   * @param options.runId Optional custom run ID, defaults to a random UUID
   * @param options.resourceId Optional resource ID to associate with this run
   * @param options.disableScorers Optional flag to disable scorers for this run
   * @returns A Run instance that can be used to execute the workflow
   */async createRunAsync(options){if(this.stepFlow.length===0){throw new Error("Execution flow of workflow is not defined. Add steps to the workflow via .then(), .branch(), etc.");}if(!this.executionGraph.steps){throw new Error("Uncommitted step flow changes detected. Call .commit() to register the steps.");}const runIdToUse=options?.runId||this.#mastra?.generateId()||randomUUID();const run=this.#runs.get(runIdToUse)??new Run({workflowId:this.id,stateSchema:this.stateSchema,runId:runIdToUse,resourceId:options?.resourceId,executionEngine:this.executionEngine,executionGraph:this.executionGraph,mastra:this.#mastra,retryConfig:this.retryConfig,serializedStepGraph:this.serializedStepGraph,disableScorers:options?.disableScorers,cleanup:()=>this.#runs.delete(runIdToUse),tracingPolicy:this.#options?.tracingPolicy,workflowSteps:this.steps,validateInputs:this.#options?.validateInputs});this.#runs.set(runIdToUse,run);const shouldPersistSnapshot=this.#options.shouldPersistSnapshot({workflowStatus:run.workflowRunStatus,stepResults:{}});const workflowSnapshotInStorage=await this.getWorkflowRunExecutionResult(runIdToUse,false);if(!workflowSnapshotInStorage&&shouldPersistSnapshot){await this.mastra?.getStorage()?.persistWorkflowSnapshot({workflowName:this.id,runId:runIdToUse,resourceId:options?.resourceId,snapshot:{runId:runIdToUse,status:"pending",value:{},context:{},activePaths:[],serializedStepGraph:this.serializedStepGraph,suspendedPaths:{},resumeLabels:{},waitingPaths:{},result:void 0,error:void 0,// @ts-ignore
timestamp:Date.now()}});}return run;}async getScorers({runtimeContext=new RuntimeContext()}={}){const steps=this.steps;if(!steps||Object.keys(steps).length===0){return {};}const scorers={};for(const step of Object.values(steps)){if(step.scorers){let scorersToUse=step.scorers;if(typeof scorersToUse==="function"){scorersToUse=await scorersToUse({runtimeContext});}for(const[id,scorer]of Object.entries(scorersToUse)){scorers[id]=scorer;}}}return scorers;}// This method should only be called internally for nested workflow execution, as well as from mastra server handlers
// To run a workflow use `.createRunAsync` and then `.start` or `.resume`
async execute({runId,inputData,resumeData,state,setState,suspend,resume,[EMITTER_SYMBOL]:emitter,mastra,runtimeContext,abort,abortSignal,runCount,tracingContext,writer,validateInputs}){this.__registerMastra(mastra);if(validateInputs){this.#options={...(this.#options||{}),validateInputs};}this.executionEngine.options={...(this.executionEngine.options||{}),validateInputs:validateInputs??false};const isResume=!!(resume?.steps&&resume.steps.length>0)||!!resume?.label||!!(resume?.steps&&resume.steps.length===0&&(!runCount||runCount===0));const run=isResume?await this.createRunAsync({runId:resume.runId}):await this.createRunAsync({runId});const nestedAbortCb=()=>{abort();};run.abortController.signal.addEventListener("abort",nestedAbortCb);abortSignal.addEventListener("abort",async()=>{run.abortController.signal.removeEventListener("abort",nestedAbortCb);await run.cancel();});const unwatchV2=run.watch(event=>{emitter.emit("nested-watch-v2",{event,workflowId:this.id});},"watch-v2");const unwatch=run.watch(event=>{emitter.emit("nested-watch",{event,workflowId:this.id,runId:run.runId,isResume:!!resume?.steps?.length});},"watch");if(runCount&&runCount>0&&isResume&&runtimeContext){runtimeContext.set("__mastraWorflowInputData",inputData);}const res=isResume?await run.resume({resumeData,step:resume.steps?.length>0?resume.steps:void 0,runtimeContext,tracingContext,outputOptions:{includeState:true,includeResumeLabels:true},label:resume.label}):await run.start({inputData,runtimeContext,tracingContext,writableStream:writer,initialState:state,outputOptions:{includeState:true,includeResumeLabels:true}});unwatch();unwatchV2();const suspendedSteps=Object.entries(res.steps).filter(([_stepName,stepResult])=>{const stepRes=stepResult;return stepRes?.status==="suspended";});if(res.state){setState(res.state);}if(suspendedSteps?.length){for(const[stepName,stepResult]of suspendedSteps){const suspendPath=[stepName,...(stepResult?.suspendPayload?.__workflow_meta?.path??[])];await suspend({...stepResult?.suspendPayload,__workflow_meta:{runId:run.runId,path:suspendPath}},{resumeLabel:Object.keys(res.resumeLabels??{})});}}if(res.status==="failed"){throw res.error;}return res.status==="success"?res.result:void 0;}async getWorkflowRuns(args){const storage=this.#mastra?.getStorage();if(!storage){this.logger.debug("Cannot get workflow runs. Mastra storage is not initialized");return {runs:[],total:0};}return storage.getWorkflowRuns({workflowName:this.id,...(args??{})});}async getWorkflowRunById(runId){const storage=this.#mastra?.getStorage();if(!storage){this.logger.debug("Cannot get workflow runs from storage. Mastra storage is not initialized");return this.#runs.get(runId)?{...this.#runs.get(runId),workflowName:this.id}:null;}const run=await storage.getWorkflowRunById({runId,workflowName:this.id});return run??(this.#runs.get(runId)?{...this.#runs.get(runId),workflowName:this.id}:null);}async getWorkflowRunSteps({runId,workflowId}){const storage=this.#mastra?.getStorage();if(!storage){this.logger.debug("Cannot get workflow run steps. Mastra storage is not initialized");return {};}const run=await storage.getWorkflowRunById({runId,workflowName:workflowId});let snapshot=run?.snapshot;if(!snapshot){return {};}if(typeof snapshot==="string"){try{snapshot=JSON.parse(snapshot);}catch(e){this.logger.debug("Cannot get workflow run execution result. Snapshot is not a valid JSON string",e);return {};}}const{serializedStepGraph,context}=snapshot;const{input,...steps}=context;let finalSteps={};for(const step of Object.keys(steps)){const stepGraph=serializedStepGraph.find(stepGraph2=>stepGraph2?.step?.id===step);finalSteps[step]=steps[step];if(stepGraph&&stepGraph?.step?.component==="WORKFLOW"){const nestedSteps=await this.getWorkflowRunSteps({runId,workflowId:step});if(nestedSteps){const updatedNestedSteps=Object.entries(nestedSteps).reduce((acc,[key,value])=>{acc[`${step}.${key}`]=value;return acc;},{});finalSteps={...finalSteps,...updatedNestedSteps};}}}return finalSteps;}async getWorkflowRunExecutionResult(runId,withNestedWorkflows=true){const storage=this.#mastra?.getStorage();if(!storage){this.logger.debug("Cannot get workflow run execution result. Mastra storage is not initialized");return null;}const run=await storage.getWorkflowRunById({runId,workflowName:this.id});let snapshot=run?.snapshot;if(!snapshot){return null;}if(typeof snapshot==="string"){try{snapshot=JSON.parse(snapshot);}catch(e){this.logger.debug("Cannot get workflow run execution result. Snapshot is not a valid JSON string",e);return null;}}const fullSteps=withNestedWorkflows?await this.getWorkflowRunSteps({runId,workflowId:this.id}):snapshot.context;return {status:snapshot.status,result:snapshot.result,error:snapshot.error,payload:snapshot.context?.input,steps:fullSteps};}};var Run=class{#abortController;emitter;/**
   * Unique identifier for this workflow
   */workflowId;/**
   * Unique identifier for this run
   */runId;/**
   * Unique identifier for the resource this run is associated with
   */resourceId;/**
   * Whether to disable scorers for this run
   */disableScorers;/**
   * Options around how to trace this run
   */tracingPolicy;/**
   * Options around how to trace this run
   */validateInputs;/**
   * Internal state of the workflow run
   */state={};/**
   * The execution engine for this run
   */executionEngine;/**
   * The execution graph for this run
   */executionGraph;/**
   * The serialized step graph for this run
   */serializedStepGraph;/**
   * The steps for this workflow
   */workflowSteps;workflowRunStatus;/**
   * The storage for this run
   */#mastra;#observerHandlers=[];get mastra(){return this.#mastra;}#streamOutput;closeStreamAction;executionResults;stateSchema;cleanup;retryConfig;constructor(params){this.workflowId=params.workflowId;this.runId=params.runId;this.resourceId=params.resourceId;this.serializedStepGraph=params.serializedStepGraph;this.executionEngine=params.executionEngine;this.executionGraph=params.executionGraph;this.#mastra=params.mastra;this.emitter=new EventEmitter$1();this.retryConfig=params.retryConfig;this.cleanup=params.cleanup;this.disableScorers=params.disableScorers;this.tracingPolicy=params.tracingPolicy;this.workflowSteps=params.workflowSteps;this.validateInputs=params.validateInputs;this.stateSchema=params.stateSchema;this.workflowRunStatus="pending";}get abortController(){if(!this.#abortController){this.#abortController=new AbortController();}return this.#abortController;}/**
   * Cancels the workflow execution
   */async cancel(){this.abortController?.abort();}async sendEvent(event,data){this.emitter.emit(`user-event-${event}`,data);}async _validateInput(inputData){const firstEntry=this.executionGraph.steps[0];let inputDataToUse=inputData;if(firstEntry&&this.validateInputs){let inputSchema;if(firstEntry.type==="step"||firstEntry.type==="foreach"||firstEntry.type==="loop"){const step=firstEntry.step;inputSchema=step.inputSchema;}else if(firstEntry.type==="conditional"||firstEntry.type==="parallel"){const firstStep=firstEntry.steps[0];if(firstStep&&firstStep.type==="step"){inputSchema=firstStep.step.inputSchema;}}if(inputSchema){const validatedInputData=await inputSchema.safeParseAsync(inputData);if(!validatedInputData.success){const errors=getZodErrors(validatedInputData.error);throw new Error("Invalid input data: \n"+errors.map(e=>`- ${e.path?.join(".")}: ${e.message}`).join("\n"));}inputDataToUse=validatedInputData.data;}}return inputDataToUse;}async _validateInitialState(initialState){let initialStateToUse=initialState;if(this.validateInputs){let inputSchema=this.stateSchema;if(inputSchema){const validatedInputData=await inputSchema.safeParseAsync(initialState);if(!validatedInputData.success){const errors=getZodErrors(validatedInputData.error);throw new Error("Invalid input data: \n"+errors.map(e=>`- ${e.path?.join(".")}: ${e.message}`).join("\n"));}initialStateToUse=validatedInputData.data;}}return initialStateToUse;}async _validateResumeData(resumeData,suspendedStep){let resumeDataToUse=resumeData;if(suspendedStep&&suspendedStep.resumeSchema&&this.validateInputs){const resumeSchema=suspendedStep.resumeSchema;const validatedResumeData=await resumeSchema.safeParseAsync(resumeData);if(!validatedResumeData.success){const errors=getZodErrors(validatedResumeData.error);throw new Error("Invalid resume data: \n"+errors.map(e=>`- ${e.path?.join(".")}: ${e.message}`).join("\n"));}resumeDataToUse=validatedResumeData.data;}return resumeDataToUse;}async _start({inputData,initialState,runtimeContext,writableStream,tracingContext,tracingOptions,format,outputOptions}){const workflowAISpan=getOrCreateSpan({type:"workflow_run"/* WORKFLOW_RUN */,name:`workflow run: '${this.workflowId}'`,input:inputData,attributes:{workflowId:this.workflowId},metadata:{resourceId:this.resourceId,runId:this.runId},tracingPolicy:this.tracingPolicy,tracingOptions,tracingContext,runtimeContext});const traceId=getValidTraceId(workflowAISpan);const inputDataToUse=await this._validateInput(inputData);const initialStateToUse=await this._validateInitialState(initialState??{});const result=await this.executionEngine.execute({workflowId:this.workflowId,runId:this.runId,resourceId:this.resourceId,disableScorers:this.disableScorers,graph:this.executionGraph,serializedStepGraph:this.serializedStepGraph,input:inputDataToUse,initialState:initialStateToUse,emitter:{emit:async(event,data)=>{this.emitter.emit(event,data);},on:(event,callback)=>{this.emitter.on(event,callback);},off:(event,callback)=>{this.emitter.off(event,callback);},once:(event,callback)=>{this.emitter.once(event,callback);}},retryConfig:this.retryConfig,runtimeContext:runtimeContext??new RuntimeContext(),abortController:this.abortController,writableStream,workflowAISpan,format,outputOptions});if(result.status!=="suspended"){this.cleanup?.();}result.traceId=traceId;return result;}/**
   * Starts the workflow execution with the provided input
   * @param input The input data for the workflow
   * @returns A promise that resolves to the workflow output
   */async start(args){return this._start(args);}/**
   * Starts the workflow execution with the provided input as a stream
   * @param input The input data for the workflow
   * @returns A promise that resolves to the workflow output
   */streamLegacy({inputData,runtimeContext,onChunk,tracingContext,tracingOptions}={}){if(this.closeStreamAction){return {stream:this.observeStreamLegacy().stream,getWorkflowState:()=>this.executionResults};}const{readable,writable}=new TransformStream();const writer=writable.getWriter();const unwatch=this.watch(async event=>{try{const e={...event,type:event.type.replace("workflow-","")};await writer.write(e);if(onChunk){await onChunk(e);}}catch{}},"watch-v2");this.closeStreamAction=async()=>{this.emitter.emit("watch-v2",{type:"workflow-finish",payload:{runId:this.runId}});unwatch();await Promise.all(this.#observerHandlers.map(handler=>handler()));this.#observerHandlers=[];try{await writer.close();}catch(err){console.error("Error closing stream:",err);}finally{writer.releaseLock();}};this.emitter.emit("watch-v2",{type:"workflow-start",payload:{runId:this.runId}});this.executionResults=this._start({inputData,runtimeContext,format:"legacy",tracingContext,tracingOptions}).then(result=>{if(result.status!=="suspended"){this.closeStreamAction?.().catch(()=>{});}return result;});return {stream:readable,getWorkflowState:()=>this.executionResults};}/**
   * Starts the workflow execution with the provided input as a stream
   * @param input The input data for the workflow
   * @returns A promise that resolves to the workflow output
   */stream(args={}){return this.streamVNext(args);}/**
   * Observe the workflow stream
   * @returns A readable stream of the workflow events
   */observeStreamLegacy(){const{readable,writable}=new TransformStream();const writer=writable.getWriter();const unwatch=this.watch(async event=>{try{const e={...event,type:event.type.replace("workflow-","")};await writer.write(e);}catch{}},"watch-v2");this.#observerHandlers.push(async()=>{unwatch();try{await writer.close();}catch(err){console.error("Error closing stream:",err);}finally{writer.releaseLock();}});return {stream:readable};}/**
   * Observe the workflow stream
   * @returns A readable stream of the workflow events
   */observeStream(){return this.observeStreamVNext();}/**
   * Observe the workflow stream vnext
   * @returns A readable stream of the workflow events
   */observeStreamVNext(){if(!this.#streamOutput){return new ReadableStream$1({pull(controller){controller.close();},cancel(controller){controller.close();}});}return this.#streamOutput.fullStream;}async streamAsync({inputData,runtimeContext}={}){return this.stream({inputData,runtimeContext});}/**
   * Starts the workflow execution with the provided input as a stream
   * @param input The input data for the workflow
   * @returns A promise that resolves to the workflow output
   */streamVNext({inputData,runtimeContext,tracingContext,tracingOptions,closeOnSuspend=true,initialState}={}){if(this.closeStreamAction&&this.#streamOutput){return this.#streamOutput;}this.closeStreamAction=async()=>{};const self=this;const stream=new ReadableStream$1({async start(controller){const unwatch=self.watch(async({type,from="WORKFLOW"/* WORKFLOW */,payload})=>{controller.enqueue({type,runId:self.runId,from,payload:{stepName:payload?.id,...payload}});},"watch-v2");self.closeStreamAction=async()=>{unwatch();try{await controller.close();}catch(err){console.error("Error closing stream:",err);}};const executionResultsPromise=self._start({inputData,runtimeContext,tracingContext,tracingOptions,initialState,writableStream:new WritableStream$1({write(chunk){controller.enqueue(chunk);}})});let executionResults;try{executionResults=await executionResultsPromise;if(closeOnSuspend){self.closeStreamAction?.().catch(()=>{});}else if(executionResults.status!=="suspended"){self.closeStreamAction?.().catch(()=>{});}if(self.#streamOutput){self.#streamOutput.updateResults(executionResults);}}catch(err){self.#streamOutput?.rejectResults(err);self.closeStreamAction?.().catch(()=>{});}}});this.#streamOutput=new WorkflowRunOutput({runId:this.runId,workflowId:this.workflowId,stream});return this.#streamOutput;}/**
   * Resumes the workflow execution with the provided input as a stream
   * @param input The input data for the workflow
   * @returns A promise that resolves to the workflow output
   */resumeStream({step,resumeData,runtimeContext,tracingContext,tracingOptions}={}){return this.resumeStreamVNext({resumeData,step,runtimeContext,tracingContext,tracingOptions});}/**
   * Resumes the workflow execution with the provided input as a stream
   * @param input The input data for the workflow
   * @returns A promise that resolves to the workflow output
   */resumeStreamVNext({step,resumeData,runtimeContext,tracingContext,tracingOptions,forEachIndex}={}){this.closeStreamAction=async()=>{};const self=this;const stream=new ReadableStream$1({async start(controller){const unwatch=self.watch(async({type,from="WORKFLOW"/* WORKFLOW */,payload})=>{controller.enqueue({type,runId:self.runId,from,payload:{stepName:payload.id,...payload}});},"watch-v2");self.closeStreamAction=async()=>{unwatch();try{await controller.close();}catch(err){console.error("Error closing stream:",err);}};const executionResultsPromise=self._resume({resumeData,step,runtimeContext,tracingContext,tracingOptions,writableStream:new WritableStream$1({write(chunk){controller.enqueue(chunk);}}),isVNext:true,forEachIndex});self.executionResults=executionResultsPromise;let executionResults;try{executionResults=await executionResultsPromise;self.closeStreamAction?.().catch(()=>{});if(self.#streamOutput){self.#streamOutput.updateResults(executionResults);}}catch(err){self.#streamOutput?.rejectResults(err);self.closeStreamAction?.().catch(()=>{});}}});this.#streamOutput=new WorkflowRunOutput({runId:this.runId,workflowId:this.workflowId,stream});return this.#streamOutput;}watch(cb,type="watch"){const watchCb=event=>{this.updateState(event.payload);cb({type:event.type,payload:this.getState(),eventTimestamp:event.eventTimestamp});};const nestedWatchCb=({event,workflowId})=>{try{const{type:type2,payload,eventTimestamp}=event;const prefixedSteps=Object.fromEntries(Object.entries(payload?.workflowState?.steps??{}).map(([stepId,step])=>[`${workflowId}.${stepId}`,step]));const newPayload={currentStep:{...payload?.currentStep,id:`${workflowId}.${payload?.currentStep?.id}`},workflowState:{steps:prefixedSteps}};this.updateState(newPayload);cb({type:type2,payload:this.getState(),eventTimestamp});}catch(e){console.error(e);}};const nestedWatchV2Cb=({event,workflowId})=>{this.emitter.emit("watch-v2",{...event,...(event.payload?.id?{payload:{...event.payload,id:`${workflowId}.${event.payload.id}`}}:{})});};if(type==="watch"){this.emitter.on("watch",watchCb);this.emitter.on("nested-watch",nestedWatchCb);}else if(type==="watch-v2"){this.emitter.on("watch-v2",cb);this.emitter.on("nested-watch-v2",nestedWatchV2Cb);}return ()=>{if(type==="watch-v2"){this.emitter.off("watch-v2",cb);this.emitter.off("nested-watch-v2",nestedWatchV2Cb);}else {this.emitter.off("watch",watchCb);this.emitter.off("nested-watch",nestedWatchCb);}};}async watchAsync(cb,type="watch"){return this.watch(cb,type);}async resume(params){return this._resume(params);}async _resume(params){const snapshot=await this.#mastra?.getStorage()?.loadWorkflowSnapshot({workflowName:this.workflowId,runId:this.runId});if(!snapshot){throw new Error("No snapshot found for this workflow run: "+this.workflowId+" "+this.runId);}if(snapshot.status!=="suspended"){throw new Error("This workflow run was not suspended");}const snapshotResumeLabel=params.label?snapshot?.resumeLabels?.[params.label]:void 0;const stepParam=snapshotResumeLabel?.stepId??params.step;let steps;if(stepParam){let newStepParam=stepParam;if(typeof stepParam==="string"){newStepParam=stepParam.split(".");}steps=(Array.isArray(newStepParam)?newStepParam:[newStepParam]).map(step=>typeof step==="string"?step:step?.id);}else {const suspendedStepPaths=[];Object.entries(snapshot?.suspendedPaths??{}).forEach(([stepId,_executionPath])=>{const stepResult=snapshot?.context?.[stepId];if(stepResult&&typeof stepResult==="object"&&"status"in stepResult){const stepRes=stepResult;if(stepRes.status==="suspended"){const nestedPath=stepRes.suspendPayload?.__workflow_meta?.path;if(nestedPath&&Array.isArray(nestedPath)){suspendedStepPaths.push([stepId,...nestedPath]);}else {suspendedStepPaths.push([stepId]);}}}});if(suspendedStepPaths.length===0){throw new Error("No suspended steps found in this workflow run");}if(suspendedStepPaths.length===1){steps=suspendedStepPaths[0];}else {const pathStrings=suspendedStepPaths.map(path=>`[${path.join(", ")}]`);throw new Error(`Multiple suspended steps found: ${pathStrings.join(", ")}. Please specify which step to resume using the "step" parameter.`);}}if(!params.runCount){const suspendedStepIds=Object.keys(snapshot?.suspendedPaths??{});const isStepSuspended=suspendedStepIds.includes(steps?.[0]??"");if(!isStepSuspended){throw new Error(`This workflow step "${steps?.[0]}" was not suspended. Available suspended steps: [${suspendedStepIds.join(", ")}]`);}}const suspendedStep=this.workflowSteps[steps?.[0]??""];const resumeDataToUse=await this._validateResumeData(params.resumeData,suspendedStep);let runtimeContextInput;if(params.runCount&&params.runCount>0&&params.runtimeContext){runtimeContextInput=params.runtimeContext.get("__mastraWorflowInputData");params.runtimeContext.delete("__mastraWorflowInputData");}const stepResults={...(snapshot?.context??{}),input:runtimeContextInput??snapshot?.context?.input};let runtimeContextToUse=params.runtimeContext??new RuntimeContext();Object.entries(snapshot?.runtimeContext??{}).forEach(([key,value])=>{if(!runtimeContextToUse.has(key)){runtimeContextToUse.set(key,value);}});const workflowAISpan=getOrCreateSpan({type:"workflow_run"/* WORKFLOW_RUN */,name:`workflow run: '${this.workflowId}'`,input:resumeDataToUse,attributes:{workflowId:this.workflowId},metadata:{resourceId:this.resourceId,runId:this.runId},tracingPolicy:this.tracingPolicy,tracingOptions:params.tracingOptions,tracingContext:params.tracingContext,runtimeContext:runtimeContextToUse});const traceId=getValidTraceId(workflowAISpan);const executionResultPromise=this.executionEngine.execute({workflowId:this.workflowId,runId:this.runId,resourceId:this.resourceId,graph:this.executionGraph,serializedStepGraph:this.serializedStepGraph,input:snapshot?.context?.input,initialState:snapshot?.value??{},resume:{steps,stepResults,resumePayload:resumeDataToUse,// @ts-ignore
resumePath:snapshot?.suspendedPaths?.[steps?.[0]],forEachIndex:params.forEachIndex??snapshotResumeLabel?.foreachIndex,label:params.label},format:params.format,emitter:{emit:(event,data)=>{this.emitter.emit(event,data);return Promise.resolve();},on:(event,callback)=>{this.emitter.on(event,callback);},off:(event,callback)=>{this.emitter.off(event,callback);},once:(event,callback)=>{this.emitter.once(event,callback);}},runtimeContext:runtimeContextToUse,abortController:this.abortController,workflowAISpan,outputOptions:params.outputOptions,writableStream:params.writableStream}).then(result=>{if(!params.isVNext&&result.status!=="suspended"){this.closeStreamAction?.().catch(()=>{});}result.traceId=traceId;return result;});this.executionResults=executionResultPromise;return executionResultPromise.then(result=>{this.#streamOutput?.updateResults(result);return result;});}/**
   * Returns the current state of the workflow run
   * @returns The current state of the workflow run
   */getState(){return this.state;}updateState(state){if(state.currentStep){this.state.currentStep=state.currentStep;}else if(state.workflowState?.status!=="running"){delete this.state.currentStep;}if(state.workflowState){this.state.workflowState=deepMergeWorkflowState(this.state.workflowState??{},state.workflowState??{});}}/**
   * @access private
   * @returns The execution results of the workflow run
   */_getExecutionResults(){return this.executionResults??this.#streamOutput?.result;}};function deepMergeWorkflowState(a,b){if(!a||typeof a!=="object")return b;if(!b||typeof b!=="object")return a;const result={...a};for(const key in b){if(b[key]===void 0)continue;if(b[key]!==null&&typeof b[key]==="object"){const aVal=result[key];const bVal=b[key];if(Array.isArray(bVal)){result[key]=bVal.filter(item=>item!==void 0);}else if(typeof aVal==="object"&&aVal!==null){result[key]=deepMergeWorkflowState(aVal,bVal);}else {result[key]=bVal;}}else {result[key]=b[key];}}return result;}// src/loop/workflows/schema.ts
var languageModelUsageSchema=z.object({inputTokens:z.number(),outputTokens:z.number(),totalTokens:z.number(),reasoningTokens:z.number().optional(),cachedInputTokens:z.number().optional()});var llmIterationStepResultSchema=z.object({reason:z.string(),warnings:z.array(z.any()),isContinued:z.boolean(),logprobs:z.any().optional(),totalUsage:languageModelUsageSchema.optional(),headers:z.record(z.string()).optional(),messageId:z.string().optional(),request:z.record(z.any()).optional()});var llmIterationOutputSchema=z.object({messageId:z.string(),messages:z.object({all:z.array(z.any()),// ModelMessage[] but too complex to validate at runtime
user:z.array(z.any()),nonUser:z.array(z.any())}),output:z.object({text:z.string().optional(),reasoning:z.array(z.any()).optional(),reasoningText:z.string().optional(),files:z.array(z.any()).optional(),// GeneratedFile[]
toolCalls:z.array(z.any()).optional(),// TypedToolCall[]
toolResults:z.array(z.any()).optional(),// TypedToolResult[]
sources:z.array(z.any()).optional(),// LanguageModelV2Source[]
staticToolCalls:z.array(z.any()).optional(),dynamicToolCalls:z.array(z.any()).optional(),staticToolResults:z.array(z.any()).optional(),dynamicToolResults:z.array(z.any()).optional(),usage:languageModelUsageSchema,steps:z.array(z.any())// StepResult[]
}),metadata:z.object({id:z.string().optional(),model:z.string().optional(),modelId:z.string().optional(),modelMetadata:z.object({modelId:z.string(),modelVersion:z.string(),modelProvider:z.string()}).optional(),timestamp:z.date().optional(),providerMetadata:z.record(z.any()).optional(),headers:z.record(z.string()).optional(),request:z.record(z.any()).optional()}),stepResult:llmIterationStepResultSchema});var toolCallInputSchema=z.object({toolCallId:z.string(),toolName:z.string(),args:z.record(z.any()),providerMetadata:z.record(z.any()).optional(),providerExecuted:z.boolean().optional(),output:z.any().optional()});var toolCallOutputSchema=toolCallInputSchema.extend({result:z.any(),error:z.any().optional()});// src/loop/workflows/agentic-execution/llm-execution-step.ts
function asJsonSchema(schema){if(!schema){return void 0;}if(schema&&typeof schema==="object"&&!schema.safeParse&&!schema.jsonSchema){return schema;}return asSchema(schema).jsonSchema;}function getTransformedSchema(schema){let jsonSchema2;jsonSchema2=asJsonSchema(schema);if(!jsonSchema2){return void 0;}const{$schema,...itemSchema}=jsonSchema2;if(itemSchema.type==="array"){const innerElement=itemSchema.items;const arrayOutputSchema={$schema,type:"object",properties:{elements:{type:"array",items:innerElement}},required:["elements"],additionalProperties:false};return {jsonSchema:arrayOutputSchema,outputFormat:"array"};}if(itemSchema.enum&&Array.isArray(itemSchema.enum)){const enumOutputSchema={$schema,type:"object",properties:{result:{type:itemSchema.type||"string",enum:itemSchema.enum}},required:["result"],additionalProperties:false};return {jsonSchema:enumOutputSchema,outputFormat:"enum"};}return {jsonSchema:jsonSchema2,outputFormat:jsonSchema2.type// 'object'
};}function getResponseFormat(schema){if(schema){const transformedSchema=getTransformedSchema(schema);return {type:"json",schema:transformedSchema?.jsonSchema};}return {type:"text"};}// src/stream/base/input.ts
var MastraModelInput=class extends MastraBase{initialize({runId,createStream,onResult}){const self=this;const stream=new ReadableStream({async start(controller){try{const stream2=await createStream();onResult({warnings:stream2.warnings,request:stream2.request,rawResponse:stream2.rawResponse||stream2.response||{}});await self.transform({runId,stream:stream2.stream,controller});controller.close();}catch(error){controller.error(error);}}});return stream;}};// src/stream/aisdk/v5/transform.ts
function convertFullStreamChunkToMastra(value,ctx){switch(value.type){case "response-metadata":return {type:"response-metadata",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{...value}};case "text-start":return {type:"text-start",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{id:value.id,providerMetadata:value.providerMetadata}};case "text-delta":if(value.delta){return {type:"text-delta",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{id:value.id,providerMetadata:value.providerMetadata,text:value.delta}};}return;case "text-end":return {type:"text-end",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:value};case "reasoning-start":return {type:"reasoning-start",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{id:value.id,providerMetadata:value.providerMetadata}};case "reasoning-delta":return {type:"reasoning-delta",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{id:value.id,providerMetadata:value.providerMetadata,text:value.delta}};case "reasoning-end":return {type:"reasoning-end",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{id:value.id,providerMetadata:value.providerMetadata}};case "source":return {type:"source",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{id:value.id,sourceType:value.sourceType,title:value.title||"",mimeType:value.sourceType==="document"?value.mediaType:void 0,filename:value.sourceType==="document"?value.filename:void 0,url:value.sourceType==="url"?value.url:void 0,providerMetadata:value.providerMetadata}};case "file":return {type:"file",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{data:value.data,base64:typeof value.data==="string"?value.data:void 0,mimeType:value.mediaType}};case "tool-call":return {type:"tool-call",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{toolCallId:value.toolCallId,toolName:value.toolName,args:value.input?JSON.parse(value.input):void 0,providerExecuted:value.providerExecuted,providerMetadata:value.providerMetadata}};case "tool-result":return {type:"tool-result",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{toolCallId:value.toolCallId,toolName:value.toolName,result:value.result,isError:value.isError,providerExecuted:value.providerExecuted,providerMetadata:value.providerMetadata}};case "tool-input-start":return {type:"tool-call-input-streaming-start",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{toolCallId:value.id,toolName:value.toolName,providerExecuted:value.providerExecuted,providerMetadata:value.providerMetadata}};case "tool-input-delta":if(value.delta){return {type:"tool-call-delta",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{argsTextDelta:value.delta,toolCallId:value.id,providerMetadata:value.providerMetadata}};}return;case "tool-input-end":return {type:"tool-call-input-streaming-end",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{toolCallId:value.id,providerMetadata:value.providerMetadata}};case "finish":const{finishReason,usage,providerMetadata,messages,...rest}=value;return {type:"finish",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:{stepResult:{reason:value.finishReason},output:{usage:{...(value.usage??{}),totalTokens:value?.usage?.totalTokens??(value.usage?.inputTokens??0)+(value.usage?.outputTokens??0)}},metadata:{providerMetadata:value.providerMetadata},messages,...rest}};case "error":return {type:"error",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:value};case "raw":return {type:"raw",runId:ctx.runId,from:"AGENT"/* AGENT */,payload:value.rawValue};}return;}function convertMastraChunkToAISDKv5({chunk,mode="stream"}){switch(chunk.type){case "start":return {type:"start"};case "step-start":const{messageId:_messageId,...rest}=chunk.payload;return {type:"start-step",request:rest.request,warnings:rest.warnings||[]};case "raw":return {type:"raw",rawValue:chunk.payload};case "finish":{return {type:"finish",finishReason:chunk.payload.stepResult.reason,totalUsage:chunk.payload.output.usage};}case "reasoning-start":return {type:"reasoning-start",id:chunk.payload.id,providerMetadata:chunk.payload.providerMetadata};case "reasoning-delta":return {type:"reasoning-delta",id:chunk.payload.id,text:chunk.payload.text,providerMetadata:chunk.payload.providerMetadata};case "reasoning-signature":throw new Error('AISDKv5 chunk type "reasoning-signature" not supported');// return {
//   type: 'reasoning-signature' as const,
//   id: chunk.payload.id,
//   signature: chunk.payload.signature,
// };
case "redacted-reasoning":throw new Error('AISDKv5 chunk type "redacted-reasoning" not supported');// return {
//   type: 'redacted-reasoning',
//   id: chunk.payload.id,
//   data: chunk.payload.data,
// };
case "reasoning-end":return {type:"reasoning-end",id:chunk.payload.id,providerMetadata:chunk.payload.providerMetadata};case "source":if(chunk.payload.sourceType==="url"){return {type:"source",sourceType:"url",id:chunk.payload.id,url:chunk.payload.url,title:chunk.payload.title,providerMetadata:chunk.payload.providerMetadata};}else {return {type:"source",sourceType:"document",id:chunk.payload.id,mediaType:chunk.payload.mimeType,title:chunk.payload.title,filename:chunk.payload.filename,providerMetadata:chunk.payload.providerMetadata};}case "file":if(mode==="generate"){return {type:"file",file:new DefaultGeneratedFile({data:chunk.payload.data,mediaType:chunk.payload.mimeType})};}return {type:"file",file:new DefaultGeneratedFileWithType({data:chunk.payload.data,mediaType:chunk.payload.mimeType})};case "tool-call":return {type:"tool-call",toolCallId:chunk.payload.toolCallId,providerMetadata:chunk.payload.providerMetadata,providerExecuted:chunk.payload.providerExecuted,toolName:chunk.payload.toolName,input:chunk.payload.args};case "tool-call-input-streaming-start":return {type:"tool-input-start",id:chunk.payload.toolCallId,toolName:chunk.payload.toolName,dynamic:!!chunk.payload.dynamic,providerMetadata:chunk.payload.providerMetadata,providerExecuted:chunk.payload.providerExecuted};case "tool-call-input-streaming-end":return {type:"tool-input-end",id:chunk.payload.toolCallId,providerMetadata:chunk.payload.providerMetadata};case "tool-call-delta":return {type:"tool-input-delta",id:chunk.payload.toolCallId,delta:chunk.payload.argsTextDelta,providerMetadata:chunk.payload.providerMetadata};case "step-finish":{const{request:_request,providerMetadata,...rest2}=chunk.payload.metadata;return {type:"finish-step",response:{id:chunk.payload.id||"",timestamp:/* @__PURE__ */new Date(),modelId:rest2.modelId||"",...rest2},usage:chunk.payload.output.usage,finishReason:chunk.payload.stepResult.reason,providerMetadata};}case "text-delta":return {type:"text-delta",id:chunk.payload.id,text:chunk.payload.text,providerMetadata:chunk.payload.providerMetadata};case "text-end":return {type:"text-end",id:chunk.payload.id,providerMetadata:chunk.payload.providerMetadata};case "text-start":return {type:"text-start",id:chunk.payload.id,providerMetadata:chunk.payload.providerMetadata};case "tool-result":return {type:"tool-result",input:chunk.payload.args,toolCallId:chunk.payload.toolCallId,providerExecuted:chunk.payload.providerExecuted,toolName:chunk.payload.toolName,output:chunk.payload.result// providerMetadata: chunk.payload.providerMetadata, // AI v5 types don't show this?
};case "tool-error":return {type:"tool-error",error:chunk.payload.error,input:chunk.payload.args,toolCallId:chunk.payload.toolCallId,providerExecuted:chunk.payload.providerExecuted,toolName:chunk.payload.toolName// providerMetadata: chunk.payload.providerMetadata, // AI v5 types don't show this?
};case "abort":return {type:"abort"};case "error":return {type:"error",error:chunk.payload.error};case "object":return {type:"object",object:chunk.object};default:if(chunk.type&&"payload"in chunk&&chunk.payload){return {type:chunk.type,...(chunk.payload||{})};}return;}}// src/stream/aisdk/v5/input.ts
var AISDKV5InputStream=class extends MastraModelInput{constructor({component,name}){super({component,name});}async transform({runId,stream,controller}){for await(const chunk of stream){const transformedChunk=convertFullStreamChunkToMastra(chunk,{runId});if(transformedChunk){controller.enqueue(transformedChunk);}}}};// src/stream/aisdk/v5/execute.ts
function omit(obj,keys){const newObj={...obj};for(const key of keys){delete newObj[key];}return newObj;}var hasLoggedModelSettingsAbortSignalDeprecation=false;function execute({runId,model,providerOptions,inputMessages,tools,toolChoice,options,onResult,modelStreamSpan,telemetry_settings,includeRawChunks,modelSettings,structuredOutput,headers,shouldThrowError}){if(modelSettings?.abortSignal&&!hasLoggedModelSettingsAbortSignalDeprecation){console.warn("[Deprecation Warning] Using `modelSettings.abortSignal` is deprecated. Please use top-level `abortSignal` instead. The `modelSettings.abortSignal` option will be removed in a future version.");hasLoggedModelSettingsAbortSignalDeprecation=true;}const v5=new AISDKV5InputStream({component:"LLM",name:model.modelId});const toolsAndToolChoice=prepareToolsAndToolChoice({tools,toolChoice,activeTools:options?.activeTools});if(modelStreamSpan&&toolsAndToolChoice?.tools?.length&&telemetry_settings?.recordOutputs!==false){modelStreamSpan.setAttributes({"stream.prompt.tools":toolsAndToolChoice?.tools?.map(tool=>JSON.stringify(tool))});}const structuredOutputMode=structuredOutput?.schema?structuredOutput?.model?"processor":"direct":void 0;const responseFormat=structuredOutput?.schema?getResponseFormat(structuredOutput?.schema):void 0;let prompt=inputMessages;if(structuredOutputMode==="direct"&&responseFormat?.type==="json"&&structuredOutput?.jsonPromptInjection){prompt=injectJsonInstructionIntoMessages({messages:inputMessages,schema:responseFormat.schema});}if(structuredOutputMode==="processor"&&responseFormat?.type==="json"&&responseFormat?.schema){prompt=injectJsonInstructionIntoMessages({messages:inputMessages,schema:responseFormat.schema,schemaPrefix:`Your response will be processed by another agent to extract structured data. Please ensure your response contains comprehensive information for all the following fields that will be extracted:
`,schemaSuffix:`

You don't need to format your response as JSON unless the user asks you to. Just ensure your natural language response includes relevant information for each field in the schema above.`});}const providerOptionsToUse=model.provider.startsWith("openai")&&responseFormat?.type==="json"&&!structuredOutput?.jsonPromptInjection?{...(providerOptions??{}),openai:{strictJsonSchema:true,...(providerOptions?.openai??{})}}:providerOptions;const stream=v5.initialize({runId,onResult,createStream:async()=>{try{const filteredModelSettings=omit(modelSettings||{},["maxRetries","headers","abortSignal"]);const abortSignal=options?.abortSignal||modelSettings?.abortSignal;const pRetry=await import('./index2.mjs');return await pRetry.default(async()=>{const streamResult=await model.doStream({...toolsAndToolChoice,prompt,providerOptions:providerOptionsToUse,abortSignal,includeRawChunks,responseFormat:structuredOutputMode==="direct"&&!structuredOutput?.jsonPromptInjection?responseFormat:void 0,...filteredModelSettings,headers});return streamResult;},{retries:modelSettings?.maxRetries??2,signal:abortSignal,shouldRetry(context){if(APICallError.isInstance(context.error)){return context.error.isRetryable;}return true;}});}catch(error){const abortSignal=options?.abortSignal||modelSettings?.abortSignal;if(isAbortError(error)&&abortSignal?.aborted){console.error("Abort error",error);}if(shouldThrowError){throw error;}return {stream:new ReadableStream({start:async controller=>{controller.enqueue({type:"error",error});controller.close();}}),warnings:[],request:{},rawResponse:{}};}}});return stream;}// src/stream/aisdk/v5/output-helpers.ts
var DefaultStepResult=class{content;finishReason;usage;warnings;request;response;providerMetadata;constructor({content,finishReason,usage,warnings,request,response,providerMetadata}){this.content=content;this.finishReason=finishReason;this.usage=usage;this.warnings=warnings;this.request=request;this.response=response;this.providerMetadata=providerMetadata;}get text(){return this.content.filter(part=>part.type==="text").map(part=>part.text).join("");}get reasoning(){return this.content.filter(part=>part.type==="reasoning");}get reasoningText(){return this.reasoning.length===0?void 0:this.reasoning.map(part=>part.text).join("");}get files(){return this.content.filter(part=>part.type==="file").map(part=>part.file);}get sources(){return this.content.filter(part=>part.type==="source");}get toolCalls(){return this.content.filter(part=>part.type==="tool-call");}get staticToolCalls(){return this.toolCalls.filter(toolCall=>toolCall.dynamic===false);}get dynamicToolCalls(){return this.toolCalls.filter(toolCall=>toolCall.dynamic===true);}get toolResults(){return this.content.filter(part=>part.type==="tool-result");}get staticToolResults(){return this.toolResults.filter(toolResult=>toolResult.dynamic===false);}get dynamicToolResults(){return this.toolResults.filter(toolResult=>toolResult.dynamic===true);}};// src/loop/workflows/run-state.ts
var AgenticRunState=class{#state;constructor({_internal,model}){this.#state={responseMetadata:{id:_internal?.generateId?.(),timestamp:_internal?.currentDate?.(),modelId:model.modelId,modelVersion:model.specificationVersion,modelProvider:model.provider,headers:void 0},modelMetadata:{modelId:model.modelId,modelVersion:model.specificationVersion,modelProvider:model.provider},isReasoning:false,isStreaming:false,providerOptions:void 0,hasToolCallStreaming:false,hasErrored:false,reasoningDeltas:[],textDeltas:[],stepResult:void 0};}setState(state){this.#state={...this.#state,...state};}get state(){return this.#state;}};// src/loop/workflows/agentic-execution/llm-execution-step.ts
async function processOutputStream({tools,messageId,messageList,outputStream,runState,options,controller,responseFromModel,includeRawChunks}){for await(const chunk of outputStream._getBaseStream()){if(!chunk){continue;}if(chunk.type=="object"||chunk.type=="object-result"){controller.enqueue(chunk);continue;}if(chunk.type!=="text-delta"&&chunk.type!=="tool-call"&&// not 100% sure about this being the right fix.
// basically for some llm providers they add response-metadata after each text-delta
// we then flush the chunks by calling messageList.add (a few lines down)
// this results in a bunch of weird separated text chunks on the message instead of combined chunks
// easiest solution here is to just not flush for response-metadata
// BUT does this cause other issues?
// Alternative solution: in message list allow combining text deltas together when the message source is "response" and the text parts are directly next to each other
// simple solution for now is to not flush text deltas on response-metadata
chunk.type!=="response-metadata"&&runState.state.isStreaming){if(runState.state.textDeltas.length){const textStartPayload=chunk.payload;const providerMetadata=textStartPayload.providerMetadata??runState.state.providerOptions;messageList.add({id:messageId,role:"assistant",content:[providerMetadata?{type:"text",text:runState.state.textDeltas.join(""),providerOptions:providerMetadata}:{type:"text",text:runState.state.textDeltas.join("")}]},"response");}runState.setState({isStreaming:false,textDeltas:[]});}if(chunk.type!=="reasoning-start"&&chunk.type!=="reasoning-delta"&&chunk.type!=="reasoning-end"&&chunk.type!=="redacted-reasoning"&&chunk.type!=="reasoning-signature"&&chunk.type!=="response-metadata"&&runState.state.isReasoning){runState.setState({isReasoning:false,reasoningDeltas:[]});}switch(chunk.type){case "response-metadata":runState.setState({responseMetadata:{id:chunk.payload.id,timestamp:chunk.payload.timestamp,modelId:chunk.payload.modelId,headers:chunk.payload.headers}});break;case "text-delta":{const textDeltasFromState=runState.state.textDeltas;textDeltasFromState.push(chunk.payload.text);runState.setState({textDeltas:textDeltasFromState,isStreaming:true});if(isControllerOpen(controller)){controller.enqueue(chunk);}break;}case "tool-call-input-streaming-start":{const tool=tools?.[chunk.payload.toolName]||Object.values(tools||{})?.find(tool2=>`id`in tool2&&tool2.id===chunk.payload.toolName);if(tool&&"onInputStart"in tool){try{await tool?.onInputStart?.({toolCallId:chunk.payload.toolCallId,messages:messageList.get.input.aiV5.model(),abortSignal:options?.abortSignal});}catch(error2){console.error("Error calling onInputStart",error2);}}if(isControllerOpen(controller)){controller.enqueue(chunk);}break;}case "tool-call-delta":{const tool=tools?.[chunk.payload.toolName||""]||Object.values(tools||{})?.find(tool2=>`id`in tool2&&tool2.id===chunk.payload.toolName);if(tool&&"onInputDelta"in tool){try{await tool?.onInputDelta?.({inputTextDelta:chunk.payload.argsTextDelta,toolCallId:chunk.payload.toolCallId,messages:messageList.get.input.aiV5.model(),abortSignal:options?.abortSignal});}catch(error2){console.error("Error calling onInputDelta",error2);}}if(isControllerOpen(controller)){controller.enqueue(chunk);}break;}case "reasoning-start":{runState.setState({isReasoning:true,reasoningDeltas:[],providerOptions:chunk.payload.providerMetadata??runState.state.providerOptions});if(Object.values(chunk.payload.providerMetadata||{}).find(v=>v?.redactedData)){messageList.add({id:messageId,role:"assistant",content:[{type:"reasoning",text:"",providerOptions:chunk.payload.providerMetadata??runState.state.providerOptions}]},"response");if(isControllerOpen(controller)){controller.enqueue(chunk);}break;}if(isControllerOpen(controller)){controller.enqueue(chunk);}break;}case "reasoning-delta":{const reasoningDeltasFromState=runState.state.reasoningDeltas;reasoningDeltasFromState.push(chunk.payload.text);runState.setState({isReasoning:true,reasoningDeltas:reasoningDeltasFromState,providerOptions:chunk.payload.providerMetadata??runState.state.providerOptions});if(isControllerOpen(controller)){controller.enqueue(chunk);}break;}case "reasoning-end":{if(runState.state.reasoningDeltas.length>0){messageList.add({id:messageId,role:"assistant",content:[{type:"reasoning",text:runState.state.reasoningDeltas.join(""),providerOptions:chunk.payload.providerMetadata??runState.state.providerOptions}]},"response");}runState.setState({isReasoning:false,reasoningDeltas:[]});if(isControllerOpen(controller)){controller.enqueue(chunk);}break;}case "file":messageList.add({id:messageId,role:"assistant",content:[{type:"file",data:chunk.payload.data,mimeType:chunk.payload.mimeType}]},"response");controller.enqueue(chunk);break;case "source":messageList.add({id:messageId,role:"assistant",content:{format:2,parts:[{type:"source",source:{sourceType:"url",id:chunk.payload.id,url:chunk.payload.url||"",title:chunk.payload.title,providerMetadata:chunk.payload.providerMetadata}}]},createdAt:/* @__PURE__ */new Date()},"response");controller.enqueue(chunk);break;case "finish":runState.setState({providerOptions:chunk.payload.metadata.providerMetadata,stepResult:{reason:chunk.payload.reason,logprobs:chunk.payload.logprobs,warnings:responseFromModel.warnings,totalUsage:chunk.payload.totalUsage,headers:responseFromModel.rawResponse?.headers,messageId,isContinued:!["stop","error"].includes(chunk.payload.stepResult.reason),request:responseFromModel.request}});break;case "error":if(isAbortError(chunk.payload.error)&&options?.abortSignal?.aborted){break;}runState.setState({hasErrored:true});runState.setState({stepResult:{isContinued:false,reason:"error"}});const error=getErrorFromUnknown(chunk.payload.error,{fallbackMessage:"Unknown error in agent stream"});controller.enqueue({...chunk,payload:{...chunk.payload,error}});await options?.onError?.({error});break;default:if(isControllerOpen(controller)){controller.enqueue(chunk);}}if(["text-delta","reasoning-delta","source","tool-call","tool-call-input-streaming-start","tool-call-delta","raw"].includes(chunk.type)){if(chunk.type==="raw"&&!includeRawChunks){continue;}await options?.onChunk?.(chunk);}if(runState.state.hasErrored){break;}}}function executeStreamWithFallbackModels(models){return async callback=>{let index=0;let finalResult;let done=false;for(const modelConfig of models){index++;const maxRetries=modelConfig.maxRetries||0;let attempt=0;if(done){break;}while(attempt<=maxRetries){try{const isLastModel=attempt===maxRetries&&index===models.length;const result=await callback(modelConfig.model,isLastModel);finalResult=result;done=true;break;}catch(err){attempt++;console.error(`Error executing model ${modelConfig.model.modelId}, attempt ${attempt}====`,err);if(attempt>maxRetries){break;}}}}if(typeof finalResult==="undefined"){console.error("Exhausted all fallback models and reached the maximum number of retries.");throw new Error("Exhausted all fallback models and reached the maximum number of retries.");}return finalResult;};}function createLLMExecutionStep({models,_internal,messageId,runId,modelStreamSpan,telemetry_settings,tools,toolChoice,messageList,includeRawChunks,modelSettings,providerOptions,options,toolCallStreaming,controller,structuredOutput,outputProcessors,headers,downloadRetries,downloadConcurrency,processorStates}){return createStep({id:"llm-execution",inputSchema:llmIterationOutputSchema,outputSchema:llmIterationOutputSchema,execute:async({inputData,bail,tracingContext})=>{let modelResult;let warnings;let request;let rawResponse;const{outputStream,callBail,runState}=await executeStreamWithFallbackModels(models)(async(model,isLastModel)=>{const runState2=new AgenticRunState({_internal,model});switch(model.specificationVersion){case "v2":{const messageListPromptArgs={downloadRetries,downloadConcurrency,supportedUrls:model?.supportedUrls};let inputMessages=await messageList.get.all.aiV5.llmPrompt(messageListPromptArgs);let stepModel=model;let stepToolChoice=toolChoice;let stepTools=tools;if(options?.prepareStep){try{const prepareStepResult=await options.prepareStep({stepNumber:inputData.output?.steps?.length||0,steps:inputData.output?.steps||[],model,messages:messageList.get.all.aiV5.model()});if(prepareStepResult){if(prepareStepResult.model){stepModel=prepareStepResult.model;}if(prepareStepResult.toolChoice){stepToolChoice=prepareStepResult.toolChoice;}if(prepareStepResult.activeTools&&stepTools){const activeToolsSet=new Set(prepareStepResult.activeTools);stepTools=Object.fromEntries(Object.entries(stepTools).filter(([toolName])=>activeToolsSet.has(toolName)));}if(prepareStepResult.messages){const newMessages=prepareStepResult.messages;const newMessageList=new MessageList();for(const message of newMessages){if(message.role==="system"){newMessageList.addSystem(message);}else if(message.role==="user"){newMessageList.add(message,"input");}else if(message.role==="assistant"||message.role==="tool"){newMessageList.add(message,"response");}}inputMessages=await newMessageList.get.all.aiV5.llmPrompt(messageListPromptArgs);}}}catch(error){console.error("Error in prepareStep callback:",error);}}modelResult=execute({runId,model:stepModel,providerOptions,inputMessages,tools:stepTools,toolChoice:stepToolChoice,options,modelSettings,telemetry_settings,includeRawChunks,structuredOutput,headers,onResult:({warnings:warningsFromStream,request:requestFromStream,rawResponse:rawResponseFromStream})=>{warnings=warningsFromStream;request=requestFromStream||{};rawResponse=rawResponseFromStream;if(!isControllerOpen(controller)){return;}controller.enqueue({runId,from:"AGENT"/* AGENT */,type:"step-start",payload:{request:request||{},warnings:warnings||[],messageId}});},modelStreamSpan,shouldThrowError:!isLastModel});break;}default:{throw new Error(`Unsupported model version: ${model.specificationVersion}`);}}const outputStream2=new MastraModelOutput({model:{modelId:model.modelId,provider:model.provider,version:model.specificationVersion},stream:modelResult,messageList,messageId,options:{runId,rootSpan:modelStreamSpan,toolCallStreaming,telemetry_settings,includeRawChunks,structuredOutput,outputProcessors,isLLMExecutionStep:true,tracingContext,processorStates}});try{await processOutputStream({outputStream:outputStream2,includeRawChunks,tools,messageId,messageList,runState:runState2,options,controller,responseFromModel:{warnings,request,rawResponse}});}catch(error){console.error("Error in LLM Execution Step",error);if(isAbortError(error)&&options?.abortSignal?.aborted){await options?.onAbort?.({steps:inputData?.output?.steps??[]});if(isControllerOpen(controller)){controller.enqueue({type:"abort",runId,from:"AGENT"/* AGENT */,payload:{}});}return {callBail:true,outputStream:outputStream2,runState:runState2};}if(isLastModel){if(isControllerOpen(controller)){controller.enqueue({type:"error",runId,from:"AGENT"/* AGENT */,payload:{error}});}runState2.setState({hasErrored:true,stepResult:{isContinued:false,reason:"error"}});}else {throw error;}}return {outputStream:outputStream2,callBail:false,runState:runState2};});if(callBail){const usage2=outputStream._getImmediateUsage();const responseMetadata2=runState.state.responseMetadata;const text2=outputStream._getImmediateText();return bail({messageId,stepResult:{reason:"abort",warnings,isContinued:false},metadata:{providerMetadata:runState.state.providerOptions,...responseMetadata2,modelMetadata:runState.state.modelMetadata,headers:rawResponse?.headers,request},output:{text:text2,toolCalls:[],usage:usage2??inputData.output?.usage,steps:[]},messages:{all:messageList.get.all.aiV5.model(),user:messageList.get.input.aiV5.model(),nonUser:messageList.get.response.aiV5.model()}});}if(outputStream.tripwire){runState.setState({stepResult:{isContinued:false,reason:"abort"}});}const toolCalls=outputStream._getImmediateToolCalls()?.map(chunk=>{return chunk.payload;});if(toolCalls.length>0){const assistantContent=[...toolCalls.map(toolCall=>{return {type:"tool-call",toolCallId:toolCall.toolCallId,toolName:toolCall.toolName,args:toolCall.args};})];messageList.add({id:messageId,role:"assistant",content:assistantContent},"response");}const finishReason=runState?.state?.stepResult?.reason??outputStream._getImmediateFinishReason();const hasErrored=runState.state.hasErrored;const usage=outputStream._getImmediateUsage();const responseMetadata=runState.state.responseMetadata;const text=outputStream._getImmediateText();const object=outputStream._getImmediateObject();const tripwireTriggered=outputStream.tripwire;const steps=inputData.output?.steps||[];const existingResponseCount=inputData.messages?.nonUser?.length||0;const allResponseContent=messageList.get.response.aiV5.modelContent(steps.length);const currentIterationContent=allResponseContent.slice(existingResponseCount);steps.push(new DefaultStepResult({warnings:outputStream._getImmediateWarnings(),providerMetadata:runState.state.providerOptions,finishReason:runState.state.stepResult?.reason,content:currentIterationContent,response:{...responseMetadata,...rawResponse,messages:messageList.get.response.aiV5.model()},request,usage:outputStream._getImmediateUsage()}));const messages={all:messageList.get.all.aiV5.model(),user:messageList.get.input.aiV5.model(),nonUser:messageList.get.response.aiV5.model()};return {messageId,stepResult:{reason:tripwireTriggered?"abort":hasErrored?"error":finishReason,warnings,isContinued:tripwireTriggered?false:!["stop","error"].includes(finishReason)},metadata:{providerMetadata:runState.state.providerOptions,...responseMetadata,...rawResponse,modelMetadata:runState.state.modelMetadata,headers:rawResponse?.headers,request},output:{text,toolCalls,usage:usage??inputData.output?.usage,steps,...(object?{object}:{})},messages};}});}// src/loop/workflows/agentic-execution/llm-mapping-step.ts
function createLLMMappingStep({models,telemetry_settings,_internal,modelStreamSpan,...rest},llmExecutionStep){return createStep({id:"llmExecutionMappingStep",inputSchema:z.array(toolCallOutputSchema),outputSchema:llmIterationOutputSchema,execute:async({inputData,getStepResult:getStepResult3,bail})=>{const initialResult=getStepResult3(llmExecutionStep);if(inputData?.every(toolCall=>toolCall?.result===void 0)){const errorResults=inputData.filter(toolCall=>toolCall?.error);const toolResultMessageId=rest.experimental_generateMessageId?.()||_internal?.generateId?.();if(errorResults?.length){errorResults.forEach(toolCall=>{const chunk={type:"tool-error",runId:rest.runId,from:"AGENT"/* AGENT */,payload:{error:toolCall.error,args:toolCall.args,toolCallId:toolCall.toolCallId,toolName:toolCall.toolName,providerMetadata:toolCall.providerMetadata}};rest.controller.enqueue(chunk);});rest.messageList.add({id:toolResultMessageId,role:"tool",content:errorResults.map(toolCall=>{return {type:"tool-result",args:toolCall.args,toolCallId:toolCall.toolCallId,toolName:toolCall.toolName,result:{tool_execution_error:toolCall.error?.message??toolCall.error}};})},"response");}initialResult.stepResult.isContinued=false;return bail(initialResult);}if(inputData?.length){for(const toolCall of inputData){const chunk={type:"tool-result",runId:rest.runId,from:"AGENT"/* AGENT */,payload:{args:toolCall.args,toolCallId:toolCall.toolCallId,toolName:toolCall.toolName,result:toolCall.result,providerMetadata:toolCall.providerMetadata,providerExecuted:toolCall.providerExecuted}};rest.controller.enqueue(chunk);if(initialResult?.metadata?.modelVersion==="v2"){await rest.options?.onChunk?.({chunk:convertMastraChunkToAISDKv5({chunk})});}const toolResultMessageId=rest.experimental_generateMessageId?.()||_internal?.generateId?.();rest.messageList.add({id:toolResultMessageId,role:"tool",content:inputData.map(toolCall2=>{return {type:"tool-result",args:toolCall2.args,toolCallId:toolCall2.toolCallId,toolName:toolCall2.toolName,result:toolCall2.result};})},"response");}return {...initialResult,messages:{all:rest.messageList.get.all.aiV5.model(),user:rest.messageList.get.input.aiV5.model(),nonUser:rest.messageList.get.response.aiV5.model()}};}}});}// src/loop/workflows/agentic-execution/tool-call-step.ts
function createToolCallStep({tools,messageList,options,telemetry_settings,writer,controller,runId,streamState,modelSpanTracker}){return createStep({id:"toolCallStep",inputSchema:toolCallInputSchema,outputSchema:toolCallOutputSchema,execute:async({inputData,suspend,resumeData,runtimeContext})=>{if(inputData.providerExecuted){const tracer2=getTracer({isEnabled:telemetry_settings?.isEnabled,tracer:telemetry_settings?.tracer});const span2=tracer2.startSpan("mastra.stream.toolCall").setAttributes({...assembleOperationName({operationId:"mastra.stream.toolCall",telemetry:telemetry_settings}),"stream.toolCall.toolName":inputData.toolName,"stream.toolCall.toolCallId":inputData.toolCallId,"stream.toolCall.args":JSON.stringify(inputData.args),"stream.toolCall.providerExecuted":true});if(inputData.output){span2.setAttributes({"stream.toolCall.result":JSON.stringify(inputData.output)});}span2.end();return {...inputData,result:inputData.output};}const tool=tools?.[inputData.toolName]||Object.values(tools||{})?.find(tool2=>`id`in tool2&&tool2.id===inputData.toolName);if(!tool){throw new Error(`Tool ${inputData.toolName} not found`);}if(tool&&"onInputAvailable"in tool){try{await tool?.onInputAvailable?.({toolCallId:inputData.toolCallId,input:inputData.args,messages:messageList.get.input.aiV5.model(),abortSignal:options?.abortSignal});}catch(error){console.error("Error calling onInputAvailable",error);}}if(!tool.execute){return inputData;}const tracer=getTracer({isEnabled:telemetry_settings?.isEnabled,tracer:telemetry_settings?.tracer});const span=tracer.startSpan("mastra.stream.toolCall").setAttributes({...assembleOperationName({operationId:"mastra.stream.toolCall",telemetry:telemetry_settings}),"stream.toolCall.toolName":inputData.toolName,"stream.toolCall.toolCallId":inputData.toolCallId,"stream.toolCall.args":JSON.stringify(inputData.args)});try{const requireToolApproval=runtimeContext.get("__mastra_requireToolApproval");if(requireToolApproval||tool.requireApproval){if(!resumeData){controller.enqueue({type:"tool-call-approval",runId,from:"AGENT"/* AGENT */,payload:{toolCallId:inputData.toolCallId,toolName:inputData.toolName,args:inputData.args}});return suspend({requireToolApproval:{toolCallId:inputData.toolCallId,toolName:inputData.toolName,args:inputData.args},__streamState:streamState.serialize()},{resumeLabel:inputData.toolCallId});}else {if(!resumeData.approved){span.end();span.setAttributes({"stream.toolCall.result":"Tool call was not approved by the user"});return {result:"Tool call was not approved by the user",...inputData};}}}const toolOptions={abortSignal:options?.abortSignal,toolCallId:inputData.toolCallId,messages:messageList.get.input.aiV5.model(),writableStream:writer,// Pass current step span as parent for tool call spans
tracingContext:modelSpanTracker?.getTracingContext(),suspend:async suspendPayload=>{controller.enqueue({type:"tool-call-suspended",runId,from:"AGENT"/* AGENT */,payload:{toolCallId:inputData.toolCallId,toolName:inputData.toolName,suspendPayload}});return await suspend({toolCallSuspended:suspendPayload,__streamState:streamState.serialize()},{resumeLabel:inputData.toolCallId});},resumeData};const result=await tool.execute(inputData.args,toolOptions);span.setAttributes({"stream.toolCall.result":JSON.stringify(result)});span.end();return {result,...inputData};}catch(error){span.setStatus({code:2,message:error?.message??error});span.recordException(error);return {error,...inputData};}}});}// src/loop/workflows/agentic-execution/index.ts
function createAgenticExecutionWorkflow({models,telemetry_settings,_internal,modelStreamSpan,...rest}){const llmExecutionStep=createLLMExecutionStep({models,_internal,modelStreamSpan,telemetry_settings,...rest});const toolCallStep=createToolCallStep({telemetry_settings,...rest});const llmMappingStep=createLLMMappingStep({models,telemetry_settings,_internal,modelStreamSpan,...rest},llmExecutionStep);return createWorkflow({id:"executionWorkflow",inputSchema:llmIterationOutputSchema,outputSchema:llmIterationOutputSchema,options:{tracingPolicy:{// mark all workflow spans related to the
// VNext execution as internal
internal:1/* WORKFLOW */},shouldPersistSnapshot:({workflowStatus})=>workflowStatus==="suspended"}}).then(llmExecutionStep).map(async({inputData})=>{const typedInputData=inputData;if(modelStreamSpan&&telemetry_settings?.recordOutputs!==false&&typedInputData.output.toolCalls?.length){modelStreamSpan.setAttribute("stream.response.toolCalls",JSON.stringify(typedInputData.output.toolCalls?.map(toolCall=>{return {toolCallId:toolCall.toolCallId,// @ts-ignore TODO: look into the type here
args:toolCall.args,toolName:toolCall.toolName};})));}return typedInputData.output.toolCalls||[];},{id:"map-tool-calls"}).foreach(toolCallStep,{concurrency:10}).then(llmMappingStep).commit();}// src/loop/workflows/agentic-loop/index.ts
function createAgenticLoopWorkflow(params){const{models,_internal,messageId,runId,modelStreamSpan,telemetry_settings,toolChoice,messageList,modelSettings,controller,writer,...rest}=params;const accumulatedSteps=[];let previousContentLength=0;const agenticExecutionWorkflow=createAgenticExecutionWorkflow({messageId,models,telemetry_settings,_internal,modelSettings,toolChoice,modelStreamSpan,controller,writer,messageList,runId,...rest});return createWorkflow({id:"agentic-loop",inputSchema:llmIterationOutputSchema,outputSchema:llmIterationOutputSchema,options:{tracingPolicy:{// mark all workflow spans related to the
// VNext execution as internal
internal:1/* WORKFLOW */},shouldPersistSnapshot:params2=>{return params2.workflowStatus==="suspended";}}}).dowhile(agenticExecutionWorkflow,async({inputData})=>{const typedInputData=inputData;let hasFinishedSteps=false;const allContent=typedInputData.messages.nonUser.flatMap(message=>message.content);const currentContent=allContent.slice(previousContentLength);previousContentLength=allContent.length;const currentStep={content:currentContent,usage:typedInputData.output.usage||{inputTokens:0,outputTokens:0,totalTokens:0},// we need to cast this because we add 'abort' for tripwires
finishReason:typedInputData.stepResult?.reason||"unknown",warnings:typedInputData.stepResult?.warnings||[],request:typedInputData.metadata?.request||{},response:{...typedInputData.metadata,modelId:typedInputData.metadata?.modelId||typedInputData.metadata?.model||"",messages:[]},text:typedInputData.output.text||"",reasoning:typedInputData.output.reasoning||[],reasoningText:typedInputData.output.reasoningText||"",files:typedInputData.output.files||[],toolCalls:typedInputData.output.toolCalls||[],toolResults:typedInputData.output.toolResults||[],sources:typedInputData.output.sources||[],staticToolCalls:typedInputData.output.staticToolCalls||[],dynamicToolCalls:typedInputData.output.dynamicToolCalls||[],staticToolResults:typedInputData.output.staticToolResults||[],dynamicToolResults:typedInputData.output.dynamicToolResults||[],providerMetadata:typedInputData.metadata?.providerMetadata};accumulatedSteps.push(currentStep);if(rest.stopWhen&&typedInputData.stepResult?.isContinued&&accumulatedSteps.length>0){const conditions=await Promise.all((Array.isArray(rest.stopWhen)?rest.stopWhen:[rest.stopWhen]).map(condition=>{return condition({steps:accumulatedSteps});}));const hasStopped=conditions.some(condition=>condition);hasFinishedSteps=hasStopped;}if(typedInputData.stepResult){typedInputData.stepResult.isContinued=hasFinishedSteps?false:typedInputData.stepResult.isContinued;}if(typedInputData.stepResult?.reason!=="abort"){if(isControllerOpen(controller)){controller.enqueue({type:"step-finish",runId,from:"AGENT"/* AGENT */,// @ts-ignore TODO: Look into the proper types for this
payload:typedInputData});}}modelStreamSpan.setAttributes({"stream.response.id":typedInputData.metadata?.id,"stream.response.model":typedInputData.metadata?.modelId,...(typedInputData.metadata?.providerMetadata?{"stream.response.providerMetadata":JSON.stringify(typedInputData.metadata.providerMetadata)}:{}),"stream.response.finishReason":typedInputData.stepResult?.reason,"stream.usage.inputTokens":typedInputData.output.usage?.inputTokens,"stream.usage.outputTokens":typedInputData.output.usage?.outputTokens,"stream.usage.totalTokens":typedInputData.output.usage?.totalTokens,...(telemetry_settings?.recordOutputs!==false?{"stream.response.text":typedInputData.output.text,"stream.prompt.messages":JSON.stringify(messageList.get.input.aiV5.model())}:{})});modelStreamSpan.end();const reason=typedInputData.stepResult?.reason;if(reason===void 0){return false;}return typedInputData.stepResult?.isContinued??false;}).commit();}// src/loop/workflows/stream.ts
function isControllerOpen(controller){return controller.desiredSize!==0&&controller.desiredSize!==null;}function workflowLoopStream({resumeContext,requireToolApproval,telemetry_settings,models,toolChoice,modelSettings,_internal,modelStreamSpan,messageId,runId,messageList,startTimestamp,streamState,agentId,toolCallId,...rest}){return new ReadableStream$1({start:async controller=>{const writer=new WritableStream({write:chunk=>{controller.enqueue(chunk);}});modelStreamSpan.setAttributes({...(telemetry_settings?.recordInputs!==false?{"stream.prompt.toolChoice":toolChoice?JSON.stringify(toolChoice):"auto"}:{})});const agenticLoopWorkflow=createAgenticLoopWorkflow({resumeContext,messageId,models,telemetry_settings,_internal,modelSettings,toolChoice,modelStreamSpan,controller,writer,runId,messageList,startTimestamp,streamState,agentId,...rest});if(rest.mastra){agenticLoopWorkflow.__registerMastra(rest.mastra);}const initialData={messageId,messages:{all:messageList.get.all.aiV5.model(),user:messageList.get.input.aiV5.model(),nonUser:[]},output:{steps:[],usage:{inputTokens:0,outputTokens:0,totalTokens:0}},metadata:{},stepResult:{reason:"undefined",warnings:[],isContinued:true,totalUsage:{inputTokens:0,outputTokens:0,totalTokens:0}}};const msToFirstChunk=_internal?.now?.()-startTimestamp;modelStreamSpan.addEvent("ai.stream.firstChunk",{"ai.response.msToFirstChunk":msToFirstChunk});modelStreamSpan.setAttributes({"stream.response.timestamp":new Date(startTimestamp).toISOString(),"stream.response.msToFirstChunk":msToFirstChunk});if(!resumeContext){controller.enqueue({type:"start",runId,from:"AGENT"/* AGENT */,payload:{id:agentId}});}const run=await agenticLoopWorkflow.createRunAsync({runId});const runtimeContext=new RuntimeContext();if(requireToolApproval){runtimeContext.set("__mastra_requireToolApproval",true);}const executionResult=resumeContext?await run.resume({resumeData:resumeContext.resumeData,tracingContext:rest.modelSpanTracker?.getTracingContext(),label:toolCallId}):await run.start({inputData:initialData,tracingContext:rest.modelSpanTracker?.getTracingContext(),runtimeContext});if(executionResult.status!=="success"){controller.close();return;}if(executionResult.result.stepResult?.reason==="abort"){controller.close();return;}controller.enqueue({type:"finish",runId,from:"AGENT"/* AGENT */,payload:{...executionResult.result,stepResult:{...executionResult.result.stepResult,// @ts-ignore we add 'abort' for tripwires so the type is not compatible
reason:executionResult.result.stepResult.reason}}});const msToFinish=(_internal?.now?.()??Date.now())-startTimestamp;modelStreamSpan.addEvent("ai.stream.finish");modelStreamSpan.setAttributes({"stream.response.msToFinish":msToFinish,"stream.response.avgOutputTokensPerSecond":1e3*(executionResult?.result?.output?.usage?.outputTokens??0)/msToFinish});controller.close();}});}// src/loop/loop.ts
function loop({resumeContext,models,logger,runId,idGenerator,telemetry_settings,messageList,includeRawChunks,modelSettings,tools,_internal,mode="stream",outputProcessors,returnScorerData,requireToolApproval,agentId,...rest}){let loggerToUse=logger||new ConsoleLogger({level:"debug"});if(models.length===0||!models[0]){const mastraError=new MastraError({id:"LOOP_MODELS_EMPTY",domain:"LLM"/* LLM */,category:"USER"/* USER */});loggerToUse.trackException(mastraError);loggerToUse.error(mastraError.toString());throw mastraError;}const firstModel=models[0];let runIdToUse=runId;if(!runIdToUse){runIdToUse=idGenerator?.()||crypto.randomUUID();}const internalToUse={now:_internal?.now||(()=>Date.now()),generateId:_internal?.generateId||(()=>generateId()),currentDate:_internal?.currentDate||(()=>/* @__PURE__ */new Date())};let startTimestamp=internalToUse.now?.();const{rootSpan}=getRootSpan({operationId:mode==="stream"?`mastra.stream`:`mastra.generate`,model:{modelId:firstModel.model.modelId,provider:firstModel.model.provider},modelSettings,headers:modelSettings?.headers??rest.headers,telemetry_settings});rootSpan.setAttributes({...(telemetry_settings?.recordOutputs!==false?{"stream.prompt.messages":JSON.stringify(messageList.get.input.aiV5.model())}:{})});const{rootSpan:modelStreamSpan}=getRootSpan({operationId:`mastra.${mode}.aisdk.doStream`,model:{modelId:firstModel.model.modelId,provider:firstModel.model.provider},modelSettings,headers:modelSettings?.headers??rest.headers,telemetry_settings});const messageId=rest.experimental_generateMessageId?.()||internalToUse.generateId?.();let modelOutput;const serializeStreamState=()=>{return modelOutput?.serializeState();};const deserializeStreamState=state=>{modelOutput?.deserializeState(state);};const processorStates=outputProcessors&&outputProcessors.length>0?/* @__PURE__ */new Map():void 0;const workflowLoopProps={resumeContext,models,runId:runIdToUse,logger:loggerToUse,startTimestamp,messageList,includeRawChunks:!!includeRawChunks,_internal:internalToUse,tools,modelStreamSpan,telemetry_settings,modelSettings,outputProcessors,messageId,agentId,requireToolApproval,streamState:{serialize:serializeStreamState,deserialize:deserializeStreamState},processorStates,...rest};const existingSnapshot=resumeContext?.snapshot;let initialStreamState;if(existingSnapshot){for(const key in existingSnapshot?.context){const step=existingSnapshot?.context[key];if(step&&step.status==="suspended"&&step.suspendPayload?.__streamState){initialStreamState=step.suspendPayload?.__streamState;break;}}}const baseStream=workflowLoopStream(workflowLoopProps);const stream=rest.modelSpanTracker?.wrapStream(baseStream)??baseStream;modelOutput=new MastraModelOutput({model:{modelId:firstModel.model.modelId,provider:firstModel.model.provider,version:firstModel.model.specificationVersion},stream,messageList,messageId,options:{runId:runIdToUse,telemetry_settings,rootSpan,toolCallStreaming:rest.toolCallStreaming,onFinish:rest.options?.onFinish,onStepFinish:rest.options?.onStepFinish,includeRawChunks:!!includeRawChunks,structuredOutput:rest.structuredOutput,outputProcessors,returnScorerData,tracingContext:rest.modelSpanTracker?.getTracingContext()},initialState:initialStreamState});return createDestructurableOutput(modelOutput);}// src/llm/model/model.loop.ts
var MastraLLMVNext=class extends MastraBase{#models;#mastra;#options;#firstModel;constructor({mastra,models,options}){super({name:"aisdk"});this.#options=options;if(mastra){this.#mastra=mastra;if(mastra.getLogger()){this.__setLogger(this.#mastra.getLogger());}}if(models.length===0||!models[0]){const mastraError=new MastraError({id:"LLM_LOOP_MODELS_EMPTY",domain:"LLM"/* LLM */,category:"USER"/* USER */});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}else {this.#models=models;this.#firstModel=models[0];}}__registerPrimitives(p){if(p.telemetry){this.__setTelemetry(p.telemetry);}if(p.logger){this.__setLogger(p.logger);}}__registerMastra(p){this.#mastra=p;}getProvider(){return this.#firstModel.model.provider;}getModelId(){return this.#firstModel.model.modelId;}getModel(){return this.#firstModel.model;}_applySchemaCompat(schema){const model=this.#firstModel.model;const schemaCompatLayers=[];if(model){const modelInfo={modelId:model.modelId,supportsStructuredOutputs:true,provider:model.provider};schemaCompatLayers.push(new OpenAIReasoningSchemaCompatLayer(modelInfo),new OpenAISchemaCompatLayer(modelInfo),new GoogleSchemaCompatLayer(modelInfo),new AnthropicSchemaCompatLayer(modelInfo),new DeepSeekSchemaCompatLayer(modelInfo),new MetaSchemaCompatLayer(modelInfo));}return applyCompatLayer({schema,compatLayers:schemaCompatLayers,mode:"aiSdkSchema"});}convertToMessages(messages){if(Array.isArray(messages)){return messages.map(m=>{if(typeof m==="string"){return {role:"user",content:m};}return m;});}return [{role:"user",content:messages}];}stream({resumeContext,runId,stopWhen=stepCountIs(5),maxSteps,tools={},modelSettings,toolChoice="auto",telemetry_settings,threadId,resourceId,structuredOutput,options,outputProcessors,returnScorerData,providerOptions,tracingContext,messageList,requireToolApproval,_internal,agentId,toolCallId}){let stopWhenToUse;if(maxSteps&&typeof maxSteps==="number"){stopWhenToUse=stepCountIs(maxSteps);}else {stopWhenToUse=stopWhen;}const messages=messageList.get.all.aiV5.model();const firstModel=this.#firstModel.model;this.logger.debug(`[LLM] - Streaming text`,{runId,threadId,resourceId,messages,tools:Object.keys(tools||{})});const llmAISpan=tracingContext?.currentSpan?.createChildSpan({name:`llm: '${firstModel.modelId}'`,type:"model_generation"/* MODEL_GENERATION */,input:{messages:[...messageList.getSystemMessages(),...messages]},attributes:{model:firstModel.modelId,provider:firstModel.provider,streaming:true,parameters:modelSettings},metadata:{runId,threadId,resourceId},tracingPolicy:this.#options?.tracingPolicy});const modelSpanTracker=new ModelSpanTracker(llmAISpan);try{const loopOptions={mastra:this.#mastra,resumeContext,runId,toolCallId,messageList,models:this.#models,tools,stopWhen:stopWhenToUse,toolChoice,modelSettings,providerOptions,telemetry_settings:{...this.experimental_telemetry,...telemetry_settings},_internal,structuredOutput,outputProcessors,returnScorerData,modelSpanTracker,requireToolApproval,agentId,options:{...options,onStepFinish:async props=>{try{await options?.onStepFinish?.({...props,runId});}catch(e){const mastraError=new MastraError({id:"LLM_STREAM_ON_STEP_FINISH_CALLBACK_EXECUTION_FAILED",domain:"LLM"/* LLM */,category:"USER"/* USER */,details:{modelId:props.model?.modelId,modelProvider:props.model?.provider,runId:runId??"unknown",threadId:threadId??"unknown",resourceId:resourceId??"unknown",finishReason:props?.finishReason,toolCalls:props?.toolCalls?JSON.stringify(props.toolCalls):"",toolResults:props?.toolResults?JSON.stringify(props.toolResults):"",usage:props?.usage?JSON.stringify(props.usage):""}},e);modelSpanTracker?.reportGenerationError({error:mastraError});this.logger.trackException(mastraError);throw mastraError;}this.logger.debug("[LLM] - Stream Step Change:",{text:props?.text,toolCalls:props?.toolCalls,toolResults:props?.toolResults,finishReason:props?.finishReason,usage:props?.usage,runId});if(props?.response?.headers?.["x-ratelimit-remaining-tokens"]&&parseInt(props?.response?.headers?.["x-ratelimit-remaining-tokens"],10)<2e3){this.logger.warn("Rate limit approaching, waiting 10 seconds",{runId});await delay(10*1e3);}},onFinish:async props=>{modelSpanTracker?.endGeneration({output:{files:props?.files,object:props?.object,reasoning:props?.reasoning,reasoningText:props?.reasoningText,sources:props?.sources,text:props?.text,warnings:props?.warnings},attributes:{finishReason:props?.finishReason,usage:{inputTokens:props?.totalUsage?.inputTokens,outputTokens:props?.totalUsage?.outputTokens,totalTokens:props?.totalUsage?.totalTokens,reasoningTokens:props?.totalUsage?.reasoningTokens,cachedInputTokens:props?.totalUsage?.cachedInputTokens}}});try{await options?.onFinish?.({...props,runId});}catch(e){const mastraError=new MastraError({id:"LLM_STREAM_ON_FINISH_CALLBACK_EXECUTION_FAILED",domain:"LLM"/* LLM */,category:"USER"/* USER */,details:{modelId:props.model?.modelId,modelProvider:props.model?.provider,runId:runId??"unknown",threadId:threadId??"unknown",resourceId:resourceId??"unknown",finishReason:props?.finishReason,toolCalls:props?.toolCalls?JSON.stringify(props.toolCalls):"",toolResults:props?.toolResults?JSON.stringify(props.toolResults):"",usage:props?.usage?JSON.stringify(props.usage):""}},e);modelSpanTracker?.reportGenerationError({error:mastraError});this.logger.trackException(mastraError);throw mastraError;}this.logger.debug("[LLM] - Stream Finished:",{text:props?.text,toolCalls:props?.toolCalls,toolResults:props?.toolResults,finishReason:props?.finishReason,usage:props?.usage,runId,threadId,resourceId});}}};return loop(loopOptions);}catch(e){const mastraError=new MastraError({id:"LLM_STREAM_TEXT_AI_SDK_EXECUTION_FAILED",domain:"LLM"/* LLM */,category:"THIRD_PARTY"/* THIRD_PARTY */,details:{modelId:firstModel.modelId,modelProvider:firstModel.provider,runId:runId??"unknown",threadId:threadId??"unknown",resourceId:resourceId??"unknown"}},e);modelSpanTracker?.reportGenerationError({error:mastraError});throw mastraError;}}};// src/loop/network/index.ts
var MastraAgentNetworkStream=class extends ReadableStream$1{#usageCount={inputTokens:0,outputTokens:0,totalTokens:0};#streamPromise;#run;constructor({createStream,run}){const deferredPromise={promise:null,resolve:null,reject:null};deferredPromise.promise=new Promise((resolve,reject)=>{deferredPromise.resolve=resolve;deferredPromise.reject=reject;});const updateUsageCount=usage=>{this.#usageCount.inputTokens+=parseInt(usage?.inputTokens?.toString()??"0",10);this.#usageCount.outputTokens+=parseInt(usage?.outputTokens?.toString()??"0",10);this.#usageCount.totalTokens+=parseInt(usage?.totalTokens?.toString()??"0",10);};super({start:async controller=>{const writer=new WritableStream({write:chunk=>{if(chunk.type==="step-output"&&chunk.payload?.output?.from==="AGENT"&&chunk.payload?.output?.type==="finish"||chunk.type==="step-output"&&chunk.payload?.output?.from==="WORKFLOW"&&chunk.payload?.output?.type==="finish"){const output=chunk.payload?.output;if(output&&"payload"in output&&output.payload){const finishPayload=output.payload;if("usage"in finishPayload&&finishPayload.usage){updateUsageCount(finishPayload.usage);}}}controller.enqueue(chunk);}});const stream=await createStream(writer);const getInnerChunk=chunk=>{if(chunk.type==="workflow-step-output"){return getInnerChunk(chunk.payload.output);}return chunk;};for await(const chunk of stream){if(chunk.type==="workflow-step-output"){const innerChunk=getInnerChunk(chunk);if(innerChunk.type==="routing-agent-end"||innerChunk.type==="agent-execution-end"||innerChunk.type==="workflow-execution-end"){if(innerChunk.payload?.usage){updateUsageCount(innerChunk.payload.usage);}}if(innerChunk.type==="network-execution-event-step-finish"){const finishPayload={...innerChunk.payload,usage:this.#usageCount};controller.enqueue({...innerChunk,payload:finishPayload});}else {controller.enqueue(innerChunk);}}}controller.close();deferredPromise.resolve();}});this.#run=run;this.#streamPromise=deferredPromise;}get status(){return this.#streamPromise.promise.then(()=>this.#run._getExecutionResults()).then(res=>res.status);}get result(){return this.#streamPromise.promise.then(()=>this.#run._getExecutionResults());}get usage(){return this.#streamPromise.promise.then(()=>this.#usageCount);}};// src/loop/types.ts
var PRIMITIVE_TYPES=z.enum(["agent","workflow","none","tool"]);// src/loop/network/index.ts
async function getRoutingAgent({runtimeContext,agent}){const instructionsToUse=await agent.getInstructions({runtimeContext});const agentsToUse=await agent.listAgents({runtimeContext});const workflowsToUse=await agent.getWorkflows({runtimeContext});const toolsToUse=await agent.getTools({runtimeContext});const model=await agent.getModel({runtimeContext});const memoryToUse=await agent.getMemory({runtimeContext});const agentList=Object.entries(agentsToUse).map(([name,agent2])=>{return ` - **${name}**: ${agent2.getDescription()}`;}).join("\n");const workflowList=Object.entries(workflowsToUse).map(([name,workflow])=>{return ` - **${name}**: ${workflow.description}, input schema: ${JSON.stringify(zodToJsonSchema(workflow.inputSchema))}`;}).join("\n");const memoryTools=await memoryToUse?.getTools?.();const toolList=Object.entries({...toolsToUse,...memoryTools}).map(([name,tool])=>{return ` - **${name}**: ${tool.description}, input schema: ${JSON.stringify(zodToJsonSchema(tool.inputSchema||z.object({})))}`;}).join("\n");const instructions=`
          You are a router in a network of specialized AI agents. 
          Your job is to decide which agent should handle each step of a task.
          If asking for completion of a task, make sure to follow system instructions closely.

          Every step will result in a prompt message. It will be a JSON object with a "selectionReason" and "finalResult" property. Make your decision based on previous decision history, as well as the overall task criteria. If you already called a primitive, you shouldn't need to call it again, unless you strongly believe it adds something to the task completion criteria. Make sure to call enough primitives to complete the task. 
            
          ## System Instructions
          ${instructionsToUse}
          You can only pick agents and workflows that are available in the lists below. Never call any agents or workflows that are not available in the lists below.
          ## Available Agents in Network
          ${agentList}
          ## Available Workflows in Network (make sure to use inputs corresponding to the input schema when calling a workflow)
          ${workflowList}
          ## Available Tools in Network (make sure to use inputs corresponding to the input schema when calling a tool)
          ${toolList}
          If you have multiple entries that need to be called with a workflow or agent, call them separately with each input.
          When calling a workflow, the prompt should be a JSON value that corresponds to the input schema of the workflow. The JSON value is stringified.
          When calling a tool, the prompt should be a JSON value that corresponds to the input schema of the tool. The JSON value is stringified.
          When calling an agent, the prompt should be a text value, like you would call an LLM in a chat interface.
          Keep in mind that the user only sees the final result of the task. When reviewing completion, you should know that the user will not see the intermediate results.
        `;return new Agent({name:"routing-agent",instructions,model,memory:memoryToUse,// @ts-ignore
_agentNetworkAppend:true});}function getLastMessage(messages){let message="";if(typeof messages==="string"){message=messages;}else {const lastMessage=Array.isArray(messages)?messages[messages.length-1]:messages;if(typeof lastMessage==="string"){message=lastMessage;}else if(lastMessage&&`content`in lastMessage&&lastMessage?.content){const lastMessageContent=lastMessage.content;if(typeof lastMessageContent==="string"){message=lastMessageContent;}else if(Array.isArray(lastMessageContent)){const lastPart=lastMessageContent[lastMessageContent.length-1];if(lastPart?.type==="text"){message=lastPart.text;}}}}return message;}async function prepareMemoryStep({threadId,resourceId,messages,routingAgent,runtimeContext,generateId:generateId3,tracingContext,memoryConfig}){const memory=await routingAgent.getMemory({runtimeContext});let thread=await memory?.getThreadById({threadId});if(!thread){thread=await memory?.createThread({threadId,title:`New Thread ${(/* @__PURE__ */new Date()).toISOString()}`,resourceId});}let userMessage;const promises=[];if(typeof messages==="string"){userMessage=messages;if(memory){promises.push(memory.saveMessages({messages:[{id:generateId3(),type:"text",role:"user",content:{parts:[{type:"text",text:messages}],format:2},createdAt:/* @__PURE__ */new Date(),threadId:thread?.id,resourceId:thread?.resourceId}],format:"v2"}));}}else {const messageList=new MessageList({threadId:thread?.id,resourceId:thread?.resourceId});messageList.add(messages,"user");const messagesToSave=messageList.get.all.v2();if(memory){promises.push(memory.saveMessages({messages:messagesToSave,format:"v2"}));}const uiMessages=messageList.get.all.ui();const mostRecentUserMessage=routingAgent.getMostRecentUserMessage(uiMessages);userMessage=mostRecentUserMessage?.content;}if(thread?.title?.startsWith("New Thread")&&memory){const config=memory.getMergedThreadConfig(memoryConfig||{});const{shouldGenerate,model:titleModel,instructions:titleInstructions}=routingAgent.resolveTitleGenerationConfig(config?.threads?.generateTitle);if(shouldGenerate&&userMessage){promises.push(routingAgent.genTitle(userMessage,runtimeContext,tracingContext||{currentSpan:void 0},titleModel,titleInstructions).then(title=>{if(title){return memory.createThread({threadId:thread.id,resourceId:thread.resourceId,memoryConfig,title,metadata:thread.metadata});}}));}}await Promise.all(promises);return {thread};}async function createNetworkLoop({networkName,runtimeContext,runId,agent,generateId:generateId3,routingAgentOptions}){const routingStep=createStep({id:"routing-agent-step",inputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,result:z.string().optional(),iteration:z.number(),threadId:z.string().optional(),threadResourceId:z.string().optional(),isOneOff:z.boolean(),verboseIntrospection:z.boolean()}),outputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,prompt:z.string(),result:z.string(),isComplete:z.boolean().optional(),selectionReason:z.string(),iteration:z.number()}),execute:async({inputData,getInitData,writer})=>{const initData=await getInitData();const completionSchema=z.object({isComplete:z.boolean(),finalResult:z.string(),completionReason:z.string()});const routingAgent=await getRoutingAgent({runtimeContext,agent});let completionResult;let iterationCount=(inputData.iteration??-1)+1;await writer.write({type:"routing-agent-start",payload:{agentId:routingAgent.id,runId,inputData:{...inputData,iteration:iterationCount}},runId,from:"NETWORK"/* NETWORK */});if(inputData.primitiveType!=="none"&&inputData?.result){const completionPrompt=`
                          The ${inputData.primitiveType} ${inputData.primitiveId} has contributed to the task.
                          This is the result from the agent: ${typeof inputData.result==="object"?JSON.stringify(inputData.result):inputData.result}
  
                          You need to evaluate that our task is complete. Pay very close attention to the SYSTEM INSTRUCTIONS for when the task is considered complete. Only return true if the task is complete according to the system instructions. Pay close attention to the finalResult and completionReason.
                          Original task: ${inputData.task}.

                          When generating the final result, make sure to take into account previous decision making history and results of all the previous iterations from conversation history. These are messages whose text is a JSON structure with "isNetwork" true.

                          You must return this JSON shape.
  
                          {
                              "isComplete": boolean,
                              "completionReason": string,
                              "finalResult": string
                          }
                      `;const completionStream=await tryStreamWithJsonFallback(routingAgent,completionPrompt,{structuredOutput:{schema:completionSchema},runtimeContext,maxSteps:1,memory:{thread:initData?.threadId??runId,resource:initData?.threadResourceId??networkName,readOnly:true},...routingAgentOptions});let currentText="";let currentTextIdx=0;await writer.write({type:"routing-agent-text-start",payload:{runId},from:"NETWORK"/* NETWORK */,runId});for await(const chunk of completionStream.objectStream){if(chunk?.finalResult){currentText=chunk.finalResult;}const currentSlice=currentText.slice(currentTextIdx);if(chunk?.isComplete&&currentSlice.length){await writer.write({type:"routing-agent-text-delta",payload:{text:currentSlice},from:"NETWORK"/* NETWORK */,runId});currentTextIdx=currentText.length;}}completionResult=await completionStream.getFullOutput();if(completionResult?.object?.isComplete){const endPayload2={task:inputData.task,primitiveId:"",primitiveType:"none",prompt:"",result:completionResult.object.finalResult,isComplete:true,selectionReason:completionResult.object.completionReason||"",iteration:iterationCount,runId};await writer.write({type:"routing-agent-end",payload:{...endPayload2,usage:await completionStream.usage},from:"NETWORK"/* NETWORK */,runId});const memory=await agent.getMemory({runtimeContext});await memory?.saveMessages({messages:[{id:generateId3(),type:"text",role:"assistant",content:{parts:[{type:"text",text:completionResult?.object?.finalResult||""}],format:2},createdAt:/* @__PURE__ */new Date(),threadId:initData?.threadId||runId,resourceId:initData?.threadResourceId||networkName}],format:"v2"});return endPayload2;}}const prompt=[{role:"assistant",content:`
                    ${inputData.isOneOff?"You are executing just one primitive based on the user task. Make sure to pick the primitive that is the best suited to accomplish the whole task. Primitives that execute only part of the task should be avoided.":"You will be calling just *one* primitive at a time to accomplish the user task, every call to you is one decision in the process of accomplishing the user task. Make sure to pick primitives that are the best suited to accomplish the whole task. Completeness is the highest priority."}
  
                    The user has given you the following task: 
                    ${inputData.task}
                    ${completionResult?`

${completionResult?.object?.finalResult}`:""}

                    # Rules:

                    ## Agent:
                    - prompt should be a text value, like you would call an LLM in a chat interface.
                    - If you are calling the same agent again, make sure to adjust the prompt to be more specific.

                    ## Workflow/Tool:
                    - prompt should be a JSON value that corresponds to the input schema of the workflow or tool. The JSON value is stringified.
                    - Make sure to use inputs corresponding to the input schema when calling a workflow or tool.

                    DO NOT CALL THE PRIMITIVE YOURSELF. Make sure to not call the same primitive twice, unless you call it with different arguments and believe it adds something to the task completion criteria. Take into account previous decision making history and results in your decision making and final result. These are messages whose text is a JSON structure with "isNetwork" true.
  
                    Please select the most appropriate primitive to handle this task and the prompt to be sent to the primitive. If no primitive is appropriate, return "none" for the primitiveId and "none" for the primitiveType.
                    
                    {
                        "primitiveId": string,
                        "primitiveType": "agent" | "workflow" | "tool",
                        "prompt": string,
                        "selectionReason": string
                    }
  
                    The 'selectionReason' property should explain why you picked the primitive${inputData.verboseIntrospection?", as well as why the other primitives were not picked.":"."}
                    `}];const options={structuredOutput:{schema:z.object({primitiveId:z.string().describe("The id of the primitive to be called"),primitiveType:PRIMITIVE_TYPES.describe("The type of the primitive to be called"),prompt:z.string().describe("The json string or text value to be sent to the primitive"),selectionReason:z.string().describe("The reason you picked the primitive")})},runtimeContext,maxSteps:1,memory:{thread:initData?.threadId??runId,resource:initData?.threadResourceId??networkName,readOnly:true},...routingAgentOptions};const result=await tryGenerateWithJsonFallback(routingAgent,prompt,options);const object=result.object;const endPayload={task:inputData.task,result:"",primitiveId:object.primitiveId,primitiveType:object.primitiveType,prompt:object.prompt,isComplete:object.primitiveId==="none"&&object.primitiveType==="none",selectionReason:object.selectionReason,iteration:iterationCount,runId};await writer.write({type:"routing-agent-end",payload:{...endPayload,usage:result.usage},from:"NETWORK"/* NETWORK */,runId});return endPayload;}});const agentStep=createStep({id:"agent-execution-step",inputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,prompt:z.string(),result:z.string(),isComplete:z.boolean().optional(),selectionReason:z.string(),iteration:z.number()}),outputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,result:z.string(),isComplete:z.boolean().optional(),iteration:z.number()}),execute:async({inputData,writer,getInitData})=>{const agentsMap=await agent.listAgents({runtimeContext});const agentId=inputData.primitiveId;const agentForStep=agentsMap[agentId];if(!agentForStep){const mastraError=new MastraError({id:"AGENT_NETWORK_AGENT_EXECUTION_STEP_INVALID_TASK_INPUT",domain:"AGENT_NETWORK"/* AGENT_NETWORK */,category:"USER"/* USER */,text:`Agent ${agentId} not found`});throw mastraError;}await writer.write({type:"agent-execution-start",payload:{agentId:inputData.primitiveId,args:inputData,runId},from:"NETWORK"/* NETWORK */,runId});const result=await agentForStep.stream(inputData.prompt,{// resourceId: inputData.resourceId,
// threadId: inputData.threadId,
runtimeContext,runId});for await(const chunk of result.fullStream){await writer.write({type:`agent-execution-event-${chunk.type}`,payload:chunk,runId:chunk.runId,from:"NETWORK"/* NETWORK */});}const memory=await agent.getMemory({runtimeContext});const initData=await getInitData();const messages=result.messageList.get.all.v1();await memory?.saveMessages({messages:[{id:generateId3(),type:"text",role:"assistant",content:{parts:[{type:"text",text:JSON.stringify({isNetwork:true,selectionReason:inputData.selectionReason,primitiveType:inputData.primitiveType,primitiveId:inputData.primitiveId,input:inputData.prompt,finalResult:{text:await result.text,toolCalls:await result.toolCalls,messages}})}],format:2},createdAt:/* @__PURE__ */new Date(),threadId:initData?.threadId||runId,resourceId:initData?.threadResourceId||networkName}],format:"v2"});const endPayload={task:inputData.task,agentId:inputData.primitiveId,result:await result.text,isComplete:false,iteration:inputData.iteration};await writer.write({type:"agent-execution-end",payload:{...endPayload,usage:await result.usage},from:"NETWORK"/* NETWORK */,runId});return {task:inputData.task,primitiveId:inputData.primitiveId,primitiveType:inputData.primitiveType,result:await result.text,isComplete:false,iteration:inputData.iteration};}});const workflowStep=createStep({id:"workflow-execution-step",inputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,prompt:z.string(),result:z.string(),isComplete:z.boolean().optional(),selectionReason:z.string(),iteration:z.number()}),outputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,result:z.string(),isComplete:z.boolean().optional(),iteration:z.number()}),execute:async({inputData,writer,getInitData})=>{const workflowsMap=await agent.getWorkflows({runtimeContext});const workflowId=inputData.primitiveId;const wf=workflowsMap[workflowId];if(!wf){const mastraError=new MastraError({id:"AGENT_NETWORK_WORKFLOW_EXECUTION_STEP_INVALID_TASK_INPUT",domain:"AGENT_NETWORK"/* AGENT_NETWORK */,category:"USER"/* USER */,text:`Workflow ${workflowId} not found`});throw mastraError;}let input;try{input=JSON.parse(inputData.prompt);}catch(e){const mastraError=new MastraError({id:"WORKFLOW_EXECUTION_STEP_INVALID_TASK_INPUT",domain:"AGENT_NETWORK"/* AGENT_NETWORK */,category:"USER"/* USER */,text:`Invalid task input: ${inputData.task}`},e);throw mastraError;}const run=await wf.createRunAsync({runId});const toolData={name:wf.name,args:inputData,runId};await writer?.write({type:"workflow-execution-start",payload:toolData,from:"NETWORK"/* NETWORK */,runId});const stream=run.streamVNext({inputData:input,runtimeContext});let chunks=[];for await(const chunk of stream){chunks.push(chunk);await writer?.write({type:`workflow-execution-event-${chunk.type}`,payload:chunk,runId:chunk.runId,from:"NETWORK"/* NETWORK */});}let runSuccess=true;const workflowState=await stream.result;if(!workflowState?.status||workflowState?.status==="failed"){runSuccess=false;}const finalResult=JSON.stringify({isNetwork:true,primitiveType:inputData.primitiveType,primitiveId:inputData.primitiveId,selectionReason:inputData.selectionReason,input,finalResult:{runId:run.runId,runResult:workflowState,chunks,runSuccess}});const memory=await agent.getMemory({runtimeContext});const initData=await getInitData();await memory?.saveMessages({messages:[{id:generateId3(),type:"text",role:"assistant",content:{parts:[{type:"text",text:finalResult}],format:2},createdAt:/* @__PURE__ */new Date(),threadId:initData?.threadId||runId,resourceId:initData?.threadResourceId||networkName}],format:"v2"});const endPayload={task:inputData.task,primitiveId:inputData.primitiveId,primitiveType:inputData.primitiveType,result:finalResult,isComplete:false,iteration:inputData.iteration,name:wf.name};await writer?.write({type:"workflow-execution-end",payload:{...endPayload,usage:await stream.usage},from:"NETWORK"/* NETWORK */,runId});return endPayload;}});const toolStep=createStep({id:"tool-execution-step",inputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,prompt:z.string(),result:z.string(),isComplete:z.boolean().optional(),selectionReason:z.string(),iteration:z.number()}),outputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,result:z.string(),isComplete:z.boolean().optional(),iteration:z.number()}),execute:async({inputData,getInitData,writer})=>{const initData=await getInitData();const agentTools=await agent.getTools({runtimeContext});const memory=await agent.getMemory({runtimeContext});const memoryTools=await memory?.getTools?.();const toolsMap={...agentTools,...memoryTools};const toolId=inputData.primitiveId;let tool=toolsMap[toolId];if(!tool){const mastraError=new MastraError({id:"AGENT_NETWORK_TOOL_EXECUTION_STEP_INVALID_TASK_INPUT",domain:"AGENT_NETWORK"/* AGENT_NETWORK */,category:"USER"/* USER */,text:`Tool ${toolId} not found`});throw mastraError;}if(!tool.execute){const mastraError=new MastraError({id:"AGENT_NETWORK_TOOL_EXECUTION_STEP_INVALID_TASK_INPUT",domain:"AGENT_NETWORK"/* AGENT_NETWORK */,category:"USER"/* USER */,text:`Tool ${toolId} does not have an execute function`});throw mastraError;}let inputDataToUse;try{inputDataToUse=JSON.parse(inputData.prompt);}catch(e){const mastraError=new MastraError({id:"AGENT_NETWORK_TOOL_EXECUTION_STEP_INVALID_TASK_INPUT",domain:"AGENT_NETWORK"/* AGENT_NETWORK */,category:"USER"/* USER */,text:`Invalid task input: ${inputData.task}`},e);throw mastraError;}const toolCallId=generateId3();await writer?.write({type:"tool-execution-start",payload:{args:{...inputData,args:inputDataToUse,toolName:toolId,toolCallId},runId},from:"NETWORK"/* NETWORK */,runId});const finalResult=await tool.execute({runtimeContext,mastra:agent.getMastraInstance(),resourceId:initData.threadResourceId||networkName,threadId:initData.threadId,runId,memory,context:inputDataToUse,// TODO: Pass proper tracing context when network supports tracing
tracingContext:{currentSpan:void 0},writer},{toolCallId,messages:[]});await memory?.saveMessages({messages:[{id:generateId3(),type:"text",role:"assistant",content:{parts:[{type:"text",text:JSON.stringify({isNetwork:true,selectionReason:inputData.selectionReason,primitiveType:inputData.primitiveType,primitiveId:toolId,finalResult:{result:finalResult,toolCallId},input:inputDataToUse})}],format:2},createdAt:/* @__PURE__ */new Date(),threadId:initData.threadId||runId,resourceId:initData.threadResourceId||networkName}],format:"v2"});const endPayload={task:inputData.task,primitiveId:toolId,primitiveType:inputData.primitiveType,result:finalResult,isComplete:false,iteration:inputData.iteration,toolCallId,toolName:toolId};await writer?.write({type:"tool-execution-end",payload:endPayload,from:"NETWORK"/* NETWORK */,runId});return endPayload;}});const finishStep=createStep({id:"finish-step",inputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,prompt:z.string(),result:z.string(),isComplete:z.boolean().optional(),selectionReason:z.string(),iteration:z.number()}),outputSchema:z.object({task:z.string(),result:z.string(),isComplete:z.boolean(),iteration:z.number()}),execute:async({inputData,writer})=>{let endResult=inputData.result;if(inputData.primitiveId==="none"&&inputData.primitiveType==="none"&&!inputData.result){endResult=inputData.selectionReason;}const endPayload={task:inputData.task,result:endResult,isComplete:!!inputData.isComplete,iteration:inputData.iteration,runId};await writer?.write({type:"network-execution-event-step-finish",payload:endPayload,from:"NETWORK"/* NETWORK */,runId});return endPayload;}});const networkWorkflow=createWorkflow({id:"Agent-Network-Outer-Workflow",inputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,result:z.string().optional(),iteration:z.number(),threadId:z.string().optional(),threadResourceId:z.string().optional(),isOneOff:z.boolean(),verboseIntrospection:z.boolean()}),outputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,prompt:z.string(),result:z.string(),isComplete:z.boolean().optional(),completionReason:z.string().optional(),iteration:z.number(),threadId:z.string().optional(),threadResourceId:z.string().optional(),isOneOff:z.boolean()}),options:{shouldPersistSnapshot:({workflowStatus})=>workflowStatus==="suspended"}});networkWorkflow.then(routingStep).branch([[async({inputData})=>!inputData.isComplete&&inputData.primitiveType==="agent",agentStep],[async({inputData})=>!inputData.isComplete&&inputData.primitiveType==="workflow",workflowStep],[async({inputData})=>!inputData.isComplete&&inputData.primitiveType==="tool",toolStep],[async({inputData})=>!!inputData.isComplete,finishStep]]).map({task:{step:[routingStep,agentStep,workflowStep,toolStep],path:"task"},isComplete:{step:[agentStep,workflowStep,toolStep,finishStep],path:"isComplete"},completionReason:{step:[routingStep,agentStep,workflowStep,toolStep,finishStep],path:"completionReason"},result:{step:[agentStep,workflowStep,toolStep,finishStep],path:"result"},primitiveId:{step:[routingStep,agentStep,workflowStep,toolStep],path:"primitiveId"},primitiveType:{step:[routingStep,agentStep,workflowStep,toolStep],path:"primitiveType"},iteration:{step:[routingStep,agentStep,workflowStep,toolStep],path:"iteration"},isOneOff:{initData:networkWorkflow,path:"isOneOff"},threadId:{initData:networkWorkflow,path:"threadId"},threadResourceId:{initData:networkWorkflow,path:"threadResourceId"}}).commit();return {networkWorkflow};}async function networkLoop({networkName,runtimeContext,runId,routingAgent,routingAgentOptions,generateId:generateId3,maxIterations,threadId,resourceId,messages}){const memoryToUse=await routingAgent.getMemory({runtimeContext});if(!memoryToUse){throw new MastraError({id:"AGENT_NETWORK_MEMORY_REQUIRED",domain:"AGENT_NETWORK"/* AGENT_NETWORK */,category:"USER"/* USER */,text:"Memory is required for the agent network to function properly. Please configure memory for the agent.",details:{status:400}});}const{memory:routingAgentMemoryOptions,...routingAgentOptionsWithoutMemory}=routingAgentOptions||{};const{networkWorkflow}=await createNetworkLoop({networkName,runtimeContext,runId,agent:routingAgent,routingAgentOptions:routingAgentOptionsWithoutMemory,generateId:generateId3});const finalStep=createStep({id:"final-step",inputSchema:networkWorkflow.outputSchema,outputSchema:networkWorkflow.outputSchema,execute:async({inputData,writer})=>{if(inputData.iteration>=maxIterations){await writer?.write({type:"network-execution-event-finish",payload:{...inputData,completionReason:`Max iterations reached: ${maxIterations}`}});return {...inputData,completionReason:`Max iterations reached: ${maxIterations}`};}return inputData;}});const mainWorkflow=createWorkflow({id:"agent-loop-main-workflow",inputSchema:z.object({iteration:z.number(),task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,result:z.string().optional(),threadId:z.string().optional(),threadResourceId:z.string().optional(),isOneOff:z.boolean(),verboseIntrospection:z.boolean()}),outputSchema:z.object({task:z.string(),primitiveId:z.string(),primitiveType:PRIMITIVE_TYPES,prompt:z.string(),result:z.string(),isComplete:z.boolean().optional(),completionReason:z.string().optional(),iteration:z.number()}),options:{shouldPersistSnapshot:({workflowStatus})=>workflowStatus==="suspended"}}).dountil(networkWorkflow,async({inputData})=>{return inputData.isComplete||inputData.iteration>=maxIterations;}).then(finalStep).commit();const run=await mainWorkflow.createRunAsync({runId});const{thread}=await prepareMemoryStep({runtimeContext,threadId:threadId||run.runId,resourceId:resourceId||networkName,messages,routingAgent,generateId:generateId3,tracingContext:routingAgentOptions?.tracingContext,memoryConfig:routingAgentMemoryOptions?.options});const task=getLastMessage(messages);return new MastraAgentNetworkStream({run,createStream:()=>{return run.streamVNext({inputData:{task,primitiveId:"",primitiveType:"none",iteration:0,threadResourceId:thread?.resourceId,threadId:thread?.id,isOneOff:false,verboseIntrospection:true}}).fullStream;}});}// src/processors/runner.ts
var ProcessorState=class{accumulatedText="";customState={};streamParts=[];span;constructor(options){const{processorName,tracingContext,processorIndex}=options;const currentSpan=tracingContext?.currentSpan;const parentSpan=currentSpan?.findParent("agent_run"/* AGENT_RUN */)||currentSpan?.parent||currentSpan;this.span=parentSpan?.createChildSpan({type:"processor_run"/* PROCESSOR_RUN */,name:`output processor: ${processorName}`,attributes:{processorName,processorType:"output",processorIndex:processorIndex??0},input:{streamParts:[],state:{},totalChunks:0}});}// Internal methods for the runner
addPart(part){if(part.type==="text-delta"){this.accumulatedText+=part.payload.text;}this.streamParts.push(part);if(this.span){this.span.input={streamParts:this.streamParts,state:this.customState,totalChunks:this.streamParts.length,accumulatedText:this.accumulatedText};}}};var ProcessorRunner=class{inputProcessors;outputProcessors;logger;agentName;constructor({inputProcessors,outputProcessors,logger,agentName}){this.inputProcessors=inputProcessors??[];this.outputProcessors=outputProcessors??[];this.logger=logger;this.agentName=agentName;}async runOutputProcessors(messageList,tracingContext,telemetry){const responseMessages=messageList.clear.response.v2();let processableMessages=[...responseMessages];const ctx={abort:()=>{throw new TripWire("Tripwire triggered");}};for(const[index,processor]of this.outputProcessors.entries()){const abort=reason=>{throw new TripWire(reason||`Tripwire triggered by ${processor.name}`);};ctx.abort=abort;const processMethod=processor.processOutputResult?.bind(processor);if(!processMethod){continue;}const currentSpan=tracingContext?.currentSpan;const parentSpan=currentSpan?.findParent("agent_run"/* AGENT_RUN */)||currentSpan?.parent||currentSpan;const processorSpan=parentSpan?.createChildSpan({type:"processor_run"/* PROCESSOR_RUN */,name:`output processor: ${processor.name}`,attributes:{processorName:processor.name,processorType:"output",processorIndex:index},input:processableMessages});if(!telemetry){processableMessages=await processMethod({messages:processableMessages,abort:ctx.abort,tracingContext:{currentSpan:processorSpan}});}else {await telemetry.traceMethod(async()=>{processableMessages=await processMethod({messages:processableMessages,abort:ctx.abort,tracingContext:{currentSpan:processorSpan}});return processableMessages;},{spanName:`agent.outputProcessor.${processor.name}`,attributes:{"processor.name":processor.name,"processor.index":index.toString(),"processor.total":this.outputProcessors.length.toString()}})();}processorSpan?.end({output:processableMessages});}if(processableMessages.length>0){messageList.add(processableMessages,"response");}return messageList;}/**
   * Process a stream part through all output processors with state management
   */async processPart(part,processorStates,tracingContext){if(!this.outputProcessors.length){return {part,blocked:false};}try{let processedPart=part;const isFinishChunk=part.type==="finish";for(const[index,processor]of this.outputProcessors.entries()){try{if(processor.processOutputStream&&processedPart){let state=processorStates.get(processor.name);if(!state){state=new ProcessorState({processorName:processor.name,tracingContext,processorIndex:index});processorStates.set(processor.name,state);}state.addPart(processedPart);const result=await processor.processOutputStream({part:processedPart,streamParts:state.streamParts,state:state.customState,abort:reason=>{throw new TripWire(reason||`Stream part blocked by ${processor.name}`);},tracingContext:{currentSpan:state.span}});if(state.span&&!state.span.isEvent){state.span.output=result;}processedPart=result;}}catch(error){if(error instanceof TripWire){const state2=processorStates.get(processor.name);state2?.span?.end({metadata:{blocked:true,reason:error.message}});return {part:null,blocked:true,reason:error.message};}const state=processorStates.get(processor.name);state?.span?.error({error,endSpan:true});this.logger.error(`[Agent:${this.agentName}] - Output processor ${processor.name} failed:`,error);}}if(isFinishChunk){for(const state of processorStates.values()){if(state.span){const finalOutput={...state.span.output,totalChunks:state.streamParts.length,finalState:state.customState};state.span.end({output:finalOutput});}}}return {part:processedPart,blocked:false};}catch(error){this.logger.error(`[Agent:${this.agentName}] - Stream part processing failed:`,error);for(const state of processorStates.values()){state.span?.error({error,endSpan:true});}return {part,blocked:false};}}async runOutputProcessorsForStream(streamResult,tracingContext){return new ReadableStream({start:async controller=>{const reader=streamResult.fullStream.getReader();const processorStates=/* @__PURE__ */new Map();try{while(true){const{done,value}=await reader.read();if(done){controller.close();break;}const{part:processedPart,blocked,reason}=await this.processPart(value,processorStates,tracingContext);if(blocked){void this.logger.debug(`[Agent:${this.agentName}] - Stream part blocked by output processor`,{reason,originalPart:value});controller.enqueue({type:"tripwire",tripwireReason:reason||"Output processor blocked content"});controller.close();break;}else if(processedPart!==null){controller.enqueue(processedPart);}}}catch(error){controller.error(error);}}});}async runInputProcessors(messageList,tracingContext,telemetry){const userMessages=messageList.clear.input.v2();let processableMessages=[...userMessages];const ctx={abort:()=>{throw new TripWire("Tripwire triggered");}};for(const[index,processor]of this.inputProcessors.entries()){const abort=reason=>{throw new TripWire(reason||`Tripwire triggered by ${processor.name}`);};ctx.abort=abort;const processMethod=processor.processInput?.bind(processor);if(!processMethod){continue;}const currentSpan=tracingContext?.currentSpan;const parentSpan=currentSpan?.findParent("agent_run"/* AGENT_RUN */)||currentSpan?.parent||currentSpan;const processorSpan=parentSpan?.createChildSpan({type:"processor_run"/* PROCESSOR_RUN */,name:`input processor: ${processor.name}`,attributes:{processorName:processor.name,processorType:"input",processorIndex:index},input:processableMessages});if(!telemetry){processableMessages=await processMethod({messages:processableMessages,abort:ctx.abort,tracingContext:{currentSpan:processorSpan}});}else {await telemetry.traceMethod(async()=>{processableMessages=await processMethod({messages:processableMessages,abort:ctx.abort,tracingContext:{currentSpan:processorSpan}});return processableMessages;},{spanName:`agent.inputProcessor.${processor.name}`,attributes:{"processor.name":processor.name,"processor.index":index.toString(),"processor.total":this.inputProcessors.length.toString()}})();}processorSpan?.end({output:processableMessages});}if(processableMessages.length>0){const systemMessages=processableMessages.filter(m=>m.role==="system");const nonSystemMessages=processableMessages.filter(m=>m.role!=="system");for(const sysMsg of systemMessages){messageList.addSystem(sysMsg.content.content||sysMsg.content.parts.map(p=>p.type==="text"?p.text:"").join("\n"));}if(nonSystemMessages.length>0){messageList.add(nonSystemMessages,"input");}}return messageList;}};// src/workflows/legacy/workflow.ts
var LegacyStep=class{id;description;inputSchema;outputSchema;payload;execute;retryConfig;mastra;constructor({id,description,execute:execute2,payload,outputSchema,inputSchema,retryConfig}){this.id=id;this.description=description??"";this.inputSchema=inputSchema;this.payload=payload;this.outputSchema=outputSchema;this.execute=execute2;this.retryConfig=retryConfig;}};// src/workflows/legacy/types.ts
function agentToStep(agent,{mastra}={}){return {id:agent.name,inputSchema:objectType({prompt:stringType(),resourceId:stringType().optional(),threadId:stringType().optional()}),outputSchema:objectType({text:stringType()}),execute:async({context,runId,mastra:mastraFromExecute})=>{const realMastra=mastraFromExecute??mastra;if(!realMastra){throw new Error("Mastra instance not found");}agent.__registerMastra(realMastra);agent.__registerPrimitives({logger:realMastra.getLogger(),telemetry:realMastra.getTelemetry()});const result=await agent.generateLegacy(context.inputData.prompt,{runId,resourceId:context.inputData.resourceId,threadId:context.inputData.threadId});return {text:result.text};}};}var SaveQueueManager=class _SaveQueueManager{logger;debounceMs;memory;static MAX_STALENESS_MS=1e3;constructor({logger,debounceMs,memory}){this.logger=logger;this.debounceMs=debounceMs||100;this.memory=memory;}saveQueues=/* @__PURE__ */new Map();saveDebounceTimers=/* @__PURE__ */new Map();/**
   * Debounces save operations for a thread, ensuring that consecutive save requests
   * are batched and only the latest is executed after a short delay.
   * @param threadId - The ID of the thread to debounce saves for.
   * @param saveFn - The save function to debounce.
   */debounceSave(threadId,messageList,memoryConfig){if(this.saveDebounceTimers.has(threadId)){clearTimeout(this.saveDebounceTimers.get(threadId));}this.saveDebounceTimers.set(threadId,setTimeout(()=>{this.enqueueSave(threadId,messageList,memoryConfig).catch(err=>{this.logger?.error?.("Error in debounceSave",{err,threadId});});this.saveDebounceTimers.delete(threadId);},this.debounceMs));}/**
   * Enqueues a save operation for a thread, ensuring that saves are executed in order and
   * only one save runs at a time per thread. If a save is already in progress for the thread,
   * the new save is queued to run after the previous completes.
   *
   * @param threadId - The ID of the thread whose messages should be saved.
   * @param messageList - The MessageList instance containing unsaved messages.
   * @param memoryConfig - Optional memory configuration to use for saving.
   */enqueueSave(threadId,messageList,memoryConfig){const prev=this.saveQueues.get(threadId)||Promise.resolve();const next=prev.then(()=>this.persistUnsavedMessages(messageList,memoryConfig)).catch(err=>{this.logger?.error?.("Error in enqueueSave",{err,threadId});}).then(()=>{if(this.saveQueues.get(threadId)===next){this.saveQueues.delete(threadId);}});this.saveQueues.set(threadId,next);return next;}/**
   * Clears any pending debounced save for a thread, preventing the scheduled save
   * from executing if it hasn't already fired.
   *
   * @param threadId - The ID of the thread whose debounced save should be cleared.
   */clearDebounce(threadId){if(this.saveDebounceTimers.has(threadId)){clearTimeout(this.saveDebounceTimers.get(threadId));this.saveDebounceTimers.delete(threadId);}}/**
   * Persists any unsaved messages from the MessageList to memory storage.
   * Drains the list of unsaved messages and writes them using the memory backend.
   * @param messageList - The MessageList instance for the current thread.
   * @param memoryConfig - The memory configuration for saving.
   */async persistUnsavedMessages(messageList,memoryConfig){const newMessages=messageList.drainUnsavedMessages();if(newMessages.length>0&&this.memory){await this.memory.saveMessages({messages:newMessages,memoryConfig});}}/**
   * Batches a save of unsaved messages for a thread, using debouncing to batch rapid updates.
   * If the oldest unsaved message is stale (older than MAX_STALENESS_MS), the save is performed immediately.
   * Otherwise, the save is delayed to batch multiple updates and reduce redundant writes.
   *
   * @param messageList - The MessageList instance containing unsaved messages.
   * @param threadId - The ID of the thread whose messages are being saved.
   * @param memoryConfig - Optional memory configuration for saving.
   */async batchMessages(messageList,threadId,memoryConfig){if(!threadId)return;const earliest=messageList.getEarliestUnsavedMessageTimestamp();const now=Date.now();if(earliest&&now-earliest>_SaveQueueManager.MAX_STALENESS_MS){return this.flushMessages(messageList,threadId,memoryConfig);}else {return this.debounceSave(threadId,messageList,memoryConfig);}}/**
   * Forces an immediate save of unsaved messages for a thread, bypassing any debounce delay.
   * This is used when a flush to persistent storage is required (e.g., on shutdown or critical transitions).
   *
   * @param messageList - The MessageList instance containing unsaved messages.
   * @param threadId - The ID of the thread whose messages are being saved.
   * @param memoryConfig - Optional memory configuration for saving.
   */async flushMessages(messageList,threadId,memoryConfig){if(!threadId)return;this.clearDebounce(threadId);return this.enqueueSave(threadId,messageList,memoryConfig);}};// src/agent/workflows/prepare-stream/index.ts
var STRUCTURED_OUTPUT_PROCESSOR_NAME="structured-output";var StructuredOutputProcessor=class{name=STRUCTURED_OUTPUT_PROCESSOR_NAME;schema;structuringAgent;errorStrategy;fallbackValue;isStructuringAgentStreamStarted=false;jsonPromptInjection;constructor(options){if(!options.schema){throw new MastraError({id:"STRUCTURED_OUTPUT_PROCESSOR_SCHEMA_REQUIRED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"StructuredOutputProcessor requires a schema to be provided"});}if(!options.model){throw new MastraError({id:"STRUCTURED_OUTPUT_PROCESSOR_MODEL_REQUIRED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"StructuredOutputProcessor requires a model to be provided either in options or as fallback"});}this.schema=options.schema;this.errorStrategy=options.errorStrategy??"strict";this.fallbackValue=options.fallbackValue;this.jsonPromptInjection=options.jsonPromptInjection;this.structuringAgent=new Agent({name:"structured-output-structurer",instructions:options.instructions||this.generateInstructions(),model:options.model});}async processOutputStream(args){const{part,state,streamParts,abort,tracingContext}=args;const controller=state.controller;switch(part.type){case "finish":await this.processAndEmitStructuredOutput(streamParts,controller,abort,tracingContext);return part;default:return part;}}async processAndEmitStructuredOutput(streamParts,controller,abort,tracingContext){if(this.isStructuringAgentStreamStarted)return;this.isStructuringAgentStreamStarted=true;try{const structuringPrompt=this.buildStructuringPrompt(streamParts);const prompt=`Extract and structure the key information from the following text according to the specified schema. Keep the original meaning and details:

${structuringPrompt}`;const structuringAgentStream=await this.structuringAgent.stream(prompt,{structuredOutput:{schema:this.schema,jsonPromptInjection:this.jsonPromptInjection},tracingContext});const excludedChunkTypes=["start","finish","text-start","text-delta","text-end","step-start","step-finish"];for await(const chunk of structuringAgentStream.fullStream){if(excludedChunkTypes.includes(chunk.type)||chunk.type.startsWith("data-")){continue;}if(chunk.type==="error"){this.handleError("Structuring failed","Internal agent did not generate structured output",abort);if(this.errorStrategy==="warn"){break;}if(this.errorStrategy==="fallback"&&this.fallbackValue!==void 0){const fallbackChunk={runId:chunk.runId,from:"AGENT"/* AGENT */,type:"object-result",object:this.fallbackValue,metadata:{from:"structured-output",fallback:true}};controller.enqueue(fallbackChunk);break;}}const newChunk={...chunk,metadata:{from:"structured-output"}};controller.enqueue(newChunk);}}catch(error){this.handleError("Structured output processing failed",error instanceof Error?error.message:"Unknown error",abort);}}/**
   * Build a structured markdown prompt from stream parts
   * Collects chunks by type and formats them in a consistent structure
   */buildStructuringPrompt(streamParts){const textChunks=[];const reasoningChunks=[];const toolCalls=[];const toolResults=[];for(const part of streamParts){switch(part.type){case "text-delta":textChunks.push(part.payload.text);break;case "reasoning-delta":reasoningChunks.push(part.payload.text);break;case "tool-call":toolCalls.push(part);break;case "tool-result":toolResults.push(part);break;}}const sections=[];if(reasoningChunks.length>0){sections.push(`# Assistant Reasoning
${reasoningChunks.join("")}`);}if(toolCalls.length>0){const toolCallsText=toolCalls.map(tc=>{const args=typeof tc.payload.args==="object"?JSON.stringify(tc.payload.args,null):tc.payload.args;const output=tc.payload.output!==void 0?`${typeof tc.payload.output==="object"?JSON.stringify(tc.payload.output,null):tc.payload.output}`:"";return `## ${tc.payload.toolName}
### Input: ${args}
### Output: ${output}`;}).join("\n");sections.push(`# Tool Calls
${toolCallsText}`);}if(toolResults.length>0){const resultsText=toolResults.map(tr=>{const result=tr.payload.result;if(result===void 0||result===null){return `${tr.payload.toolName}: null`;}return `${tr.payload.toolName}: ${typeof result==="object"?JSON.stringify(result,null,2):result}`;}).join("\n");sections.push(`# Tool Results
${resultsText}`);}if(textChunks.length>0){sections.push(`# Assistant Response
${textChunks.join("")}`);}return sections.join("\n\n");}/**
   * Generate instructions for the structuring agent based on the schema
   */generateInstructions(){return `You are a data structuring specialist. Your job is to convert unstructured text into a specific JSON format.

TASK: Convert the provided unstructured text into valid JSON that matches the following schema:

REQUIREMENTS:
- Return ONLY valid JSON, no additional text or explanation
- Extract relevant information from the input text
- If information is missing, use reasonable defaults or null values
- Maintain data types as specified in the schema
- Be consistent and accurate in your conversions

The input text may be in any format (sentences, bullet points, paragraphs, etc.). Extract the relevant data and structure it according to the schema.`;}/**
   * Handle errors based on the configured strategy
   */handleError(context,error,abort){const message=`[StructuredOutputProcessor] ${context}: ${error}`;switch(this.errorStrategy){case "strict":console.error(message);abort(message);break;case "warn":console.warn(message);break;case "fallback":console.info(`${message} (using fallback)`);break;}}};// src/processors/processors/batch-parts.ts
function createMapResultsStep({capabilities,options,resourceId,runId,runtimeContext,memory,memoryConfig,saveQueueManager,agentAISpan,instructions,agentId}){return async({inputData,bail,tracingContext})=>{const toolsData=inputData["prepare-tools-step"];const memoryData=inputData["prepare-memory-step"];const result={...options,tools:toolsData.convertedTools,toolChoice:options.toolChoice,thread:memoryData.thread,threadId:memoryData.thread?.id,resourceId,runtimeContext,onStepFinish:async props=>{if(options.savePerStep){if(!memoryData.threadExists&&memory&&memoryData.thread){await memory.createThread({threadId:memoryData.thread?.id,title:memoryData.thread?.title,metadata:memoryData.thread?.metadata,resourceId:memoryData.thread?.resourceId,memoryConfig});memoryData.threadExists=true;}await capabilities.saveStepMessages({saveQueueManager,result:props,messageList:memoryData.messageList,threadId:memoryData.thread?.id,memoryConfig,runId});}return options.onStepFinish?.({...props,runId});},...(memoryData.tripwire&&{tripwire:memoryData.tripwire,tripwireReason:memoryData.tripwireReason})};if(result.tripwire){const agentModel=await capabilities.getModel({runtimeContext:result.runtimeContext});const modelOutput=await getModelOutputForTripwire({tripwireReason:result.tripwireReason,runId,tracingContext,options,model:agentModel,messageList:memoryData.messageList});return bail(modelOutput);}let effectiveOutputProcessors=options.outputProcessors||(capabilities.outputProcessors?typeof capabilities.outputProcessors==="function"?await capabilities.outputProcessors({runtimeContext:result.runtimeContext}):capabilities.outputProcessors:[]);if(options.structuredOutput?.model){const structuredProcessor=new StructuredOutputProcessor(options.structuredOutput);effectiveOutputProcessors=effectiveOutputProcessors?[...effectiveOutputProcessors,structuredProcessor]:[structuredProcessor];}const messageList=memoryData.messageList;const loopOptions={agentId,runtimeContext:result.runtimeContext,tracingContext:{currentSpan:agentAISpan},runId,toolChoice:result.toolChoice,tools:result.tools,resourceId:result.resourceId,threadId:result.threadId,stopWhen:result.stopWhen,maxSteps:result.maxSteps,providerOptions:result.providerOptions,options:{...(options.prepareStep&&{prepareStep:options.prepareStep}),onFinish:async payload=>{if(payload.finishReason==="error"){capabilities.logger.error("Error in agent stream",{error:payload.error,runId});return;}try{const outputText=messageList.get.all.core().map(m=>m.content).join("\n");await capabilities.executeOnFinish({result:payload,outputText,instructions,thread:result.thread,threadId:result.threadId,readOnlyMemory:options.memory?.readOnly,resourceId,memoryConfig,runtimeContext,agentAISpan,runId,messageList,threadExists:memoryData.threadExists,structuredOutput:!!options.structuredOutput?.schema,saveQueueManager,overrideScorers:options.scorers});}catch(e){capabilities.logger.error("Error saving memory on finish",{error:e,runId});}await options?.onFinish?.({...payload,runId,messages:messageList.get.response.aiV5.model(),usage:payload.usage,totalUsage:payload.totalUsage});},onStepFinish:result.onStepFinish,onChunk:options.onChunk,onError:options.onError,onAbort:options.onAbort,activeTools:options.activeTools,abortSignal:options.abortSignal},structuredOutput:options.structuredOutput,outputProcessors:effectiveOutputProcessors,modelSettings:{temperature:0,...(options.modelSettings||{})},messageList:memoryData.messageList};return loopOptions;};}// src/agent/workflows/prepare-stream/prepare-memory-step.ts
var import_fast_deep_equal=__toESM(require_fast_deep_equal());var coreToolSchema=objectType({id:stringType().optional(),description:stringType().optional(),parameters:unionType([recordType(stringType(),anyType()),// JSON Schema as object
anyType()// Zod schema or other schema types - validated at tool execution
]),outputSchema:unionType([recordType(stringType(),anyType()),anyType()]).optional(),execute:functionType(tupleType([anyType(),anyType()]),promiseType(anyType())).optional(),type:unionType([literalType("function"),literalType("provider-defined"),undefinedType()]).optional(),args:recordType(stringType(),anyType()).optional()});var storageThreadSchema=objectType({id:stringType(),title:stringType().optional(),resourceId:stringType(),createdAt:dateType(),updatedAt:dateType(),metadata:recordType(stringType(),anyType()).optional()});var prepareToolsStepOutputSchema=objectType({convertedTools:recordType(stringType(),coreToolSchema)});var prepareMemoryStepOutputSchema=objectType({threadExists:booleanType(),thread:storageThreadSchema.optional(),messageList:instanceOfType(MessageList),tripwire:booleanType().optional(),tripwireReason:stringType().optional()});// src/agent/workflows/prepare-stream/prepare-memory-step.ts
function addSystemMessage(messageList,content,tag){if(!content)return;if(Array.isArray(content)){for(const msg of content){messageList.addSystem(msg,tag);}}else {messageList.addSystem(content,tag);}}function createPrepareMemoryStep({capabilities,options,threadFromArgs,resourceId,runId,runtimeContext,instructions,memoryConfig,memory}){return createStep({id:"prepare-memory-step",inputSchema:objectType({}),outputSchema:prepareMemoryStepOutputSchema,execute:async({tracingContext})=>{const thread=threadFromArgs;const messageList=new MessageList({threadId:thread?.id,resourceId,generateMessageId:capabilities.generateMessageId,// @ts-ignore Flag for agent network messages
_agentNetworkAppend:capabilities._agentNetworkAppend});addSystemMessage(messageList,instructions);messageList.add(options.context||[],"context");addSystemMessage(messageList,options.system,"user-provided");if(!memory||!thread?.id&&!resourceId){messageList.add(options.messages,"user");const{tripwireTriggered:tripwireTriggered2,tripwireReason:tripwireReason2}=await capabilities.runInputProcessors({runtimeContext,tracingContext,messageList,inputProcessorOverrides:options.inputProcessors});return {threadExists:false,thread:void 0,messageList,...(tripwireTriggered2&&{tripwire:true,tripwireReason:tripwireReason2})};}if(!thread?.id||!resourceId){const mastraError=new MastraError({id:"AGENT_MEMORY_MISSING_RESOURCE_ID",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:capabilities.agentName,threadId:thread?.id||"",resourceId:resourceId||""},text:`A resourceId and a threadId must be provided when using Memory. Saw threadId "${thread?.id}" and resourceId "${resourceId}"`});capabilities.logger.error(mastraError.toString());capabilities.logger.trackException(mastraError);throw mastraError;}const store=memory.constructor.name;capabilities.logger.debug(`[Agent:${capabilities.agentName}] - Memory persistence enabled: store=${store}, resourceId=${resourceId}`,{runId,resourceId,threadId:thread?.id,memoryStore:store});let threadObject=void 0;const existingThread=await memory.getThreadById({threadId:thread?.id});if(existingThread){if(!existingThread.metadata&&thread.metadata||thread.metadata&&!(0, import_fast_deep_equal.default)(existingThread.metadata,thread.metadata)){threadObject=await memory.saveThread({thread:{...existingThread,metadata:thread.metadata},memoryConfig});}else {threadObject=existingThread;}}else {threadObject=await memory.createThread({threadId:thread?.id,metadata:thread.metadata,title:thread.title,memoryConfig,resourceId,saveThread:false});}const config=memory.getMergedThreadConfig(memoryConfig||{});const hasResourceScopeSemanticRecall=typeof config?.semanticRecall==="object"&&config?.semanticRecall?.scope==="resource";let[memoryMessages,memorySystemMessage]=await Promise.all([existingThread||hasResourceScopeSemanticRecall?capabilities.getMemoryMessages({resourceId,threadId:threadObject.id,vectorMessageSearch:new MessageList().add(options.messages,`user`).getLatestUserContent()||"",memoryConfig,runtimeContext}):[],memory.getSystemMessage({threadId:threadObject.id,resourceId,memoryConfig})]);capabilities.logger.debug("Fetched messages from memory",{threadId:threadObject.id,runId,fetchedCount:memoryMessages.length});const resultsFromOtherThreads=memoryMessages.filter(m=>m.threadId!==threadObject.id);if(resultsFromOtherThreads.length&&!memorySystemMessage){memorySystemMessage=``;}if(resultsFromOtherThreads.length){memorySystemMessage+=`
The following messages were remembered from a different conversation:
<remembered_from_other_conversation>
${(()=>{let result=``;const messages=new MessageList().add(resultsFromOtherThreads,"memory").get.all.v1();let lastYmd=null;for(const msg of messages){const date=msg.createdAt;const year=date.getUTCFullYear();const month=date.toLocaleString("default",{month:"short"});const day=date.getUTCDate();const ymd=`${year}, ${month}, ${day}`;const utcHour=date.getUTCHours();const utcMinute=date.getUTCMinutes();const hour12=utcHour%12||12;const ampm=utcHour<12?"AM":"PM";const timeofday=`${hour12}:${utcMinute<10?"0":""}${utcMinute} ${ampm}`;if(!lastYmd||lastYmd!==ymd){result+=`
the following messages are from ${ymd}
`;}result+=`Message ${msg.threadId&&msg.threadId!==threadObject.id?"from previous conversation":""} at ${timeofday}: ${JSON.stringify(msg)}`;lastYmd=ymd;}return result;})()}
<end_remembered_from_other_conversation>`;}if(memorySystemMessage){messageList.addSystem(memorySystemMessage,"memory");}messageList.add(memoryMessages.filter(m=>m.threadId===threadObject.id),"memory").add(options.messages,"user");const{tripwireTriggered,tripwireReason}=await capabilities.runInputProcessors({runtimeContext,tracingContext,messageList,inputProcessorOverrides:options.inputProcessors});const systemMessages=messageList.getSystemMessages();const systemMessage=[...systemMessages,...messageList.getSystemMessages("memory")]?.map(m=>m.content)?.join(`
`)??void 0;const processedMemoryMessages=await memory.processMessages({messages:messageList.get.remembered.v1(),newMessages:messageList.get.input.v1(),systemMessage,memorySystemMessage:memorySystemMessage||void 0});const processedList=new MessageList({threadId:threadObject.id,resourceId,generateMessageId:capabilities.generateMessageId,// @ts-ignore Flag for agent network messages
_agentNetworkAppend:capabilities._agentNetworkAppend});addSystemMessage(processedList,instructions);processedList.addSystem(memorySystemMessage).addSystem(systemMessages).add(options.context||[],"context");addSystemMessage(processedList,options.system,"user-provided");processedList.add(processedMemoryMessages,"memory").add(messageList.get.input.v2(),"user");return {thread:threadObject,messageList:processedList,...(tripwireTriggered&&{tripwire:true,tripwireReason}),threadExists:!!existingThread};}});}// src/agent/workflows/prepare-stream/prepare-tools-step.ts
function createPrepareToolsStep({capabilities,options,threadFromArgs,resourceId,runId,runtimeContext,agentAISpan,methodType,memory}){return createStep({id:"prepare-tools-step",inputSchema:objectType({}),outputSchema:prepareToolsStepOutputSchema,execute:async()=>{const toolEnhancements=[options?.toolsets&&Object.keys(options?.toolsets||{}).length>0?`toolsets present (${Object.keys(options?.toolsets||{}).length} tools)`:void 0,memory&&resourceId?"memory and resourceId available":void 0].filter(Boolean).join(", ");capabilities.logger.debug(`[Agent:${capabilities.agentName}] - Enhancing tools: ${toolEnhancements}`,{runId,toolsets:options?.toolsets?Object.keys(options?.toolsets):void 0,clientTools:options?.clientTools?Object.keys(options?.clientTools):void 0,hasMemory:!!memory,hasResourceId:!!resourceId});const threadId=threadFromArgs?.id;const convertedTools=await capabilities.convertTools({toolsets:options?.toolsets,clientTools:options?.clientTools,threadId,resourceId,runId,runtimeContext,tracingContext:{currentSpan:agentAISpan},writableStream:options.writableStream,methodType});return {convertedTools};}});}// src/agent/workflows/prepare-stream/stream-step.ts
function createStreamStep({capabilities,runId,returnScorerData,format="mastra",requireToolApproval,resumeContext,agentId,toolCallId}){return createStep({id:"stream-text-step",inputSchema:anyType(),// tried to type this in various ways but it's too complex
outputSchema:unionType([instanceOfType(MastraModelOutput),instanceOfType(AISDKV5OutputStream)]),execute:async({inputData,tracingContext})=>{const validatedInputData=inputData;capabilities.logger.debug(`Starting agent ${capabilities.agentName} llm stream call`,{runId});const processors=validatedInputData.outputProcessors||(capabilities.outputProcessors?typeof capabilities.outputProcessors==="function"?await capabilities.outputProcessors({runtimeContext:validatedInputData.runtimeContext||new RuntimeContext()}):capabilities.outputProcessors:[]);const streamResult=capabilities.llm.stream({...validatedInputData,outputProcessors:processors,returnScorerData,tracingContext,requireToolApproval,resumeContext,_internal:{generateId:capabilities.generateMessageId},agentId,toolCallId});if(format==="aisdk"){return streamResult.aisdk.v5;}return streamResult;}});}// src/agent/workflows/prepare-stream/index.ts
function createPrepareStreamWorkflow({capabilities,options,threadFromArgs,resourceId,runId,runtimeContext,agentAISpan,methodType,format,instructions,memoryConfig,memory,saveQueueManager,returnScorerData,requireToolApproval,resumeContext,agentId,toolCallId}){const prepareToolsStep=createPrepareToolsStep({capabilities,options,threadFromArgs,resourceId,runId,runtimeContext,agentAISpan,methodType,memory});const prepareMemoryStep2=createPrepareMemoryStep({capabilities,options,threadFromArgs,resourceId,runId,runtimeContext,instructions,memoryConfig,memory});const streamStep=createStreamStep({capabilities,runId,returnScorerData,format,requireToolApproval,resumeContext,agentId,toolCallId});const mapResultsStep=createMapResultsStep({capabilities,options,resourceId,runId,runtimeContext,memory,memoryConfig,saveQueueManager,agentAISpan,instructions,agentId});return createWorkflow({id:"execution-workflow",inputSchema:objectType({}),outputSchema:unionType([instanceOfType(MastraModelOutput),instanceOfType(AISDKV5OutputStream)]),steps:[prepareToolsStep,prepareMemoryStep2,streamStep],options:{tracingPolicy:{internal:1/* WORKFLOW */}}}).parallel([prepareToolsStep,prepareMemoryStep2]).map(mapResultsStep).then(streamStep).commit();}// src/agent/agent.ts
function resolveMaybePromise(value,cb){if(value instanceof Promise||value!=null&&typeof value.then==="function"){return Promise.resolve(value).then(cb);}return cb(value);}function resolveThreadIdFromArgs(args){if(args?.memory?.thread){if(typeof args.memory.thread==="string")return {id:args.memory.thread};if(typeof args.memory.thread==="object"&&args.memory.thread.id)return args.memory.thread;}if(args?.threadId)return {id:args.threadId};return void 0;}var _Agent_decorators,_init,_a;_Agent_decorators=[InstrumentClass({prefix:"agent",excludeMethods:["hasOwnMemory","getMemory","__primitive","__registerMastra","__registerPrimitives","__runInputProcessors","__runOutputProcessors","_wrapToolsWithAITracing","getProcessorRunner","__setTools","__setLogger","__setTelemetry","log","listAgents","getModel","getInstructions","getTools","getLLM","getWorkflows","getDefaultGenerateOptions","getDefaultStreamOptions","getDescription","getScorers","getVoice"]})];var Agent=class extends(_a=MastraBase){id;name;#instructions;#description;model;maxRetries;#mastra;#memory;#workflows;#defaultGenerateOptions;#defaultStreamOptions;#defaultVNextStreamOptions;#tools;evals;#scorers;#agents;#voice;#inputProcessors;#outputProcessors;#options;// This flag is for agent network messages. We should change the agent network formatting and remove this flag after.
_agentNetworkAppend=false;/**
   * Creates a new Agent instance with the specified configuration.
   *
   * @example
   * ```typescript
   * import { Agent } from '@mastra/core/agent';
   * import { Memory } from '@mastra/memory';
   *
   * const agent = new Agent({
   *   name: 'weatherAgent',
   *   instructions: 'You help users with weather information',
   *   model: 'openai/gpt-5',
   *   tools: { getWeather },
   *   memory: new Memory(),
   *   maxRetries: 2,
   * });
   * ```
   */constructor(config){super({component:RegisteredLogger.AGENT});this.name=config.name;this.id=config.id??config.name;this.#instructions=config.instructions;this.#description=config.description;this.#options=config.options;if(!config.model){const mastraError=new MastraError({id:"AGENT_CONSTRUCTOR_MODEL_REQUIRED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:config.name},text:`LanguageModel is required to create an Agent. Please provide the 'model'.`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}if(Array.isArray(config.model)){if(config.model.length===0){const mastraError=new MastraError({id:"AGENT_CONSTRUCTOR_MODEL_ARRAY_EMPTY",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:config.name},text:`Model array is empty. Please provide at least one model.`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}this.model=config.model.map(mdl=>({id:randomUUID(),model:mdl.model,maxRetries:mdl.maxRetries??config?.maxRetries??0,enabled:mdl.enabled??true}));}else {this.model=config.model;}this.maxRetries=config.maxRetries??0;if(config.workflows){this.#workflows=config.workflows;}this.#defaultGenerateOptions=config.defaultGenerateOptions||{};this.#defaultStreamOptions=config.defaultStreamOptions||{};this.#defaultVNextStreamOptions=config.defaultVNextStreamOptions||{};this.#tools=config.tools||{};this.evals={};if(config.mastra){this.__registerMastra(config.mastra);this.__registerPrimitives({telemetry:config.mastra.getTelemetry(),logger:config.mastra.getLogger()});}this.#scorers=config.scorers||{};this.#agents=config.agents||{};if(config.evals){this.evals=config.evals;}if(config.memory){this.#memory=config.memory;}if(config.voice){this.#voice=config.voice;if(typeof config.tools!=="function"){this.#voice?.addTools(this.tools);}if(typeof config.instructions==="string"){this.#voice?.addInstructions(config.instructions);}}else {this.#voice=new DefaultVoice();}if(config.inputProcessors){this.#inputProcessors=config.inputProcessors;}if(config.outputProcessors){this.#outputProcessors=config.outputProcessors;}this._agentNetworkAppend=config._agentNetworkAppend||false;}getMastraInstance(){return this.#mastra;}/**
   * Returns the agents configured for this agent, resolving function-based agents if necessary.
   * Used in multi-agent collaboration scenarios where this agent can delegate to other agents.
   *
   * @example
   * ```typescript
   * const agents = await agent.listAgents();
   * console.log(Object.keys(agents)); // ['agent1', 'agent2']
   * ```
   */listAgents({runtimeContext=new RuntimeContext()}={}){const agentsToUse=this.#agents?typeof this.#agents==="function"?this.#agents({runtimeContext}):this.#agents:{};return resolveMaybePromise(agentsToUse,agents=>{if(!agents){const mastraError=new MastraError({id:"AGENT_GET_AGENTS_FUNCTION_EMPTY_RETURN",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Function-based agents returned empty value`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return agents;});}/**
   * Creates and returns a ProcessorRunner with resolved input/output processors.
   * @internal
   */async getProcessorRunner({runtimeContext,inputProcessorOverrides,outputProcessorOverrides}){const inputProcessors=inputProcessorOverrides??(this.#inputProcessors?typeof this.#inputProcessors==="function"?await this.#inputProcessors({runtimeContext}):this.#inputProcessors:[]);const outputProcessors=outputProcessorOverrides??(this.#outputProcessors?typeof this.#outputProcessors==="function"?await this.#outputProcessors({runtimeContext}):this.#outputProcessors:[]);this.logger.debug("outputProcessors",outputProcessors);return new ProcessorRunner({inputProcessors,outputProcessors,logger:this.logger,agentName:this.name});}/**
   * Resolves and returns output processors from agent configuration.
   * @internal
   */async getResolvedOutputProcessors(runtimeContext){if(!this.#outputProcessors){return [];}if(typeof this.#outputProcessors==="function"){return await this.#outputProcessors({runtimeContext:runtimeContext||new RuntimeContext()});}return this.#outputProcessors;}/**
   * Resolves and returns input processors from agent configuration.
   * @internal
   */async getResolvedInputProcessors(runtimeContext){if(!this.#inputProcessors){return [];}if(typeof this.#inputProcessors==="function"){return await this.#inputProcessors({runtimeContext:runtimeContext||new RuntimeContext()});}return this.#inputProcessors;}/**
   * Returns the input processors for this agent, resolving function-based processors if necessary.
   */async getInputProcessors(runtimeContext){return this.getResolvedInputProcessors(runtimeContext);}/**
   * Returns the output processors for this agent, resolving function-based processors if necessary.
   */async getOutputProcessors(runtimeContext){return this.getResolvedOutputProcessors(runtimeContext);}/**
   * Returns whether this agent has its own memory configured.
   *
   * @example
   * ```typescript
   * if (agent.hasOwnMemory()) {
   *   const memory = await agent.getMemory();
   * }
   * ```
   */hasOwnMemory(){return Boolean(this.#memory);}/**
   * Gets the memory instance for this agent, resolving function-based memory if necessary.
   * The memory system enables conversation persistence, semantic recall, and working memory.
   *
   * @example
   * ```typescript
   * const memory = await agent.getMemory();
   * if (memory) {
   *   // Memory is configured
   * }
   * ```
   */async getMemory({runtimeContext=new RuntimeContext()}={}){if(!this.#memory){return void 0;}let resolvedMemory;if(typeof this.#memory!=="function"){resolvedMemory=this.#memory;}else {const result=this.#memory({runtimeContext,mastra:this.#mastra});resolvedMemory=await Promise.resolve(result);if(!resolvedMemory){const mastraError=new MastraError({id:"AGENT_GET_MEMORY_FUNCTION_EMPTY_RETURN",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Function-based memory returned empty value`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}}if(this.#mastra&&resolvedMemory){resolvedMemory.__registerMastra(this.#mastra);if(!resolvedMemory.hasOwnStorage){const storage=this.#mastra.getStorage();if(storage){resolvedMemory.setStorage(storage);}}}return resolvedMemory;}get voice(){if(typeof this.#instructions==="function"){const mastraError=new MastraError({id:"AGENT_VOICE_INCOMPATIBLE_WITH_FUNCTION_INSTRUCTIONS",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:"Voice is not compatible when instructions are a function. Please use getVoice() instead."});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return this.#voice;}/**
   * Gets the workflows configured for this agent, resolving function-based workflows if necessary.
   * Workflows are step-based execution flows that can be triggered by the agent.
   *
   * @example
   * ```typescript
   * const workflows = await agent.getWorkflows();
   * const workflow = workflows['myWorkflow'];
   * ```
   */async getWorkflows({runtimeContext=new RuntimeContext()}={}){let workflowRecord;if(typeof this.#workflows==="function"){workflowRecord=await Promise.resolve(this.#workflows({runtimeContext,mastra:this.#mastra}));}else {workflowRecord=this.#workflows??{};}Object.entries(workflowRecord||{}).forEach(([_workflowName,workflow])=>{if(this.#mastra){workflow.__registerMastra(this.#mastra);}});return workflowRecord;}async getScorers({runtimeContext=new RuntimeContext()}={}){if(typeof this.#scorers!=="function"){return this.#scorers;}const result=this.#scorers({runtimeContext,mastra:this.#mastra});return resolveMaybePromise(result,scorers=>{if(!scorers){const mastraError=new MastraError({id:"AGENT_GET_SCORERS_FUNCTION_EMPTY_RETURN",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Function-based scorers returned empty value`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return scorers;});}/**
   * Gets the voice instance for this agent with tools and instructions configured.
   * The voice instance enables text-to-speech and speech-to-text capabilities.
   *
   * @example
   * ```typescript
   * const voice = await agent.getVoice();
   * const audioStream = await voice.speak('Hello world');
   * ```
   */async getVoice({runtimeContext}={}){if(this.#voice){const voice=this.#voice;voice?.addTools(await this.getTools({runtimeContext}));const instructions=await this.getInstructions({runtimeContext});voice?.addInstructions(this.#convertInstructionsToString(instructions));return voice;}else {return new DefaultVoice();}}get instructions(){this.logger.warn("The instructions property is deprecated. Please use getInstructions() instead.");if(typeof this.#instructions==="function"){const mastraError=new MastraError({id:"AGENT_INSTRUCTIONS_INCOMPATIBLE_WITH_FUNCTION_INSTRUCTIONS",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:"Instructions are not compatible when instructions are a function. Please use getInstructions() instead."});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}if(typeof this.#instructions!=="string"){const mastraError=new MastraError({id:"AGENT_INSTRUCTIONS_MUST_BE_STRING_FOR_DEPRECATED_GETTER",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name,instructionsType:Array.isArray(this.#instructions)?"array":"object"},text:"The instructions getter is deprecated and only supports string instructions. For non-string instructions, please use getInstructions() instead."});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return this.#instructions;}/**
   * Gets the instructions for this agent, resolving function-based instructions if necessary.
   * Instructions define the agent's behavior and capabilities.
   *
   * @example
   * ```typescript
   * const instructions = await agent.getInstructions();
   * console.log(instructions); // 'You are a helpful assistant'
   * ```
   */getInstructions({runtimeContext=new RuntimeContext()}={}){if(typeof this.#instructions==="function"){const result=this.#instructions({runtimeContext,mastra:this.#mastra});return resolveMaybePromise(result,instructions=>{if(!instructions){const mastraError=new MastraError({id:"AGENT_GET_INSTRUCTIONS_FUNCTION_EMPTY_RETURN",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:"Instructions are required to use an Agent. The function-based instructions returned an empty value."});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return instructions;});}return this.#instructions;}/**
   * Helper function to convert agent instructions to string for backward compatibility
   * Used for legacy methods that expect string instructions (e.g., voice, telemetry)
   * @internal
   */#convertInstructionsToString(instructions){if(typeof instructions==="string"){return instructions;}if(Array.isArray(instructions)){return instructions.map(msg=>{if(typeof msg==="string"){return msg;}return typeof msg.content==="string"?msg.content:"";}).filter(content=>content).join("\n\n");}return typeof instructions.content==="string"?instructions.content:"";}/**
   * Returns the description of the agent.
   *
   * @example
   * ```typescript
   * const description = agent.getDescription();
   * console.log(description); // 'A helpful weather assistant'
   * ```
   */getDescription(){return this.#description??"";}/**
   * Gets the default generate options for this agent, resolving function-based options if necessary.
   * These options are used as defaults when calling `generate()` without explicit options.
   *
   * @example
   * ```typescript
   * const options = await agent.getDefaultGenerateOptions();
   * console.log(options.maxSteps); // 5
   * ```
   */getDefaultGenerateOptions({runtimeContext=new RuntimeContext()}={}){if(typeof this.#defaultGenerateOptions!=="function"){return this.#defaultGenerateOptions;}const result=this.#defaultGenerateOptions({runtimeContext,mastra:this.#mastra});return resolveMaybePromise(result,options=>{if(!options){const mastraError=new MastraError({id:"AGENT_GET_DEFAULT_GENERATE_OPTIONS_FUNCTION_EMPTY_RETURN",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Function-based default generate options returned empty value`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return options;});}/**
   * Gets the default stream options for this agent, resolving function-based options if necessary.
   * These options are used as defaults when calling `stream()` without explicit options.
   *
   * @example
   * ```typescript
   * const options = await agent.getDefaultStreamOptions();
   * console.log(options.temperature); // 0.7
   * ```
   */getDefaultStreamOptions({runtimeContext=new RuntimeContext()}={}){if(typeof this.#defaultStreamOptions!=="function"){return this.#defaultStreamOptions;}const result=this.#defaultStreamOptions({runtimeContext,mastra:this.#mastra});return resolveMaybePromise(result,options=>{if(!options){const mastraError=new MastraError({id:"AGENT_GET_DEFAULT_STREAM_OPTIONS_FUNCTION_EMPTY_RETURN",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Function-based default stream options returned empty value`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return options;});}/**
   * Gets the default VNext stream options for this agent, resolving function-based options if necessary.
   * These options are used as defaults when calling `streamVNext()` or `generateVNext()` without explicit options.
   *
   * @example
   * ```typescript
   * const options = await agent.getDefaultVNextStreamOptions();
   * console.log(options.maxSteps); // 5
   * ```
   */getDefaultVNextStreamOptions({runtimeContext=new RuntimeContext()}={}){if(typeof this.#defaultVNextStreamOptions!=="function"){if(this.#defaultVNextStreamOptions.output&&this.#defaultVNextStreamOptions.structuredOutput){throw new MastraError({id:"AGENT_GET_DEFAULT_VNEXT_STREAM_OPTIONS_OUTPUT_AND_STRUCTURED_OUTPUT_PROVIDED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"output and structuredOutput cannot be provided at the same time"});}const{output,...defaultVNextStreamOptions}=this.#defaultVNextStreamOptions;return {...(output?{structuredOutput:{schema:output}}:{}),...defaultVNextStreamOptions};}const result=this.#defaultVNextStreamOptions({runtimeContext,mastra:this.#mastra});return resolveMaybePromise(result,options=>{if(!options){const mastraError=new MastraError({id:"AGENT_GET_DEFAULT_VNEXT_STREAM_OPTIONS_FUNCTION_EMPTY_RETURN",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Function-based default vnext stream options returned empty value`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}if(options.output&&options.structuredOutput){throw new MastraError({id:"AGENT_GET_DEFAULT_VNEXT_STREAM_OPTIONS_OUTPUT_AND_STRUCTURED_OUTPUT_PROVIDED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"output and structuredOutput cannot be provided at the same time"});}const{output,...restOptions}=options;return {...(output?{structuredOutput:{schema:output}}:{}),...restOptions};});}get tools(){this.logger.warn("The tools property is deprecated. Please use getTools() instead.");if(typeof this.#tools==="function"){const mastraError=new MastraError({id:"AGENT_GET_TOOLS_FUNCTION_INCOMPATIBLE_WITH_TOOL_FUNCTION_TYPE",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:"Tools are not compatible when tools are a function. Please use getTools() instead."});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return ensureToolProperties(this.#tools);}/**
   * Gets the tools configured for this agent, resolving function-based tools if necessary.
   * Tools extend the agent's capabilities, allowing it to perform specific actions or access external systems.
   *
   * @example
   * ```typescript
   * const tools = await agent.getTools();
   * console.log(Object.keys(tools)); // ['calculator', 'weather']
   * ```
   */getTools({runtimeContext=new RuntimeContext()}={}){if(typeof this.#tools!=="function"){return ensureToolProperties(this.#tools);}const result=this.#tools({runtimeContext,mastra:this.#mastra});return resolveMaybePromise(result,tools=>{if(!tools){const mastraError=new MastraError({id:"AGENT_GET_TOOLS_FUNCTION_EMPTY_RETURN",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Function-based tools returned empty value`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return ensureToolProperties(tools);});}get llm(){this.logger.warn("The llm property is deprecated. Please use getLLM() instead.");if(typeof this.model==="function"){const mastraError=new MastraError({id:"AGENT_LLM_GETTER_INCOMPATIBLE_WITH_FUNCTION_MODEL",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:"LLM is not compatible when model is a function. Please use getLLM() instead."});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return this.getLLM();}/**
   * Gets or creates an LLM instance based on the provided or configured model.
   * The LLM wraps the language model with additional capabilities like telemetry and error handling.
   *
   * @example
   * ```typescript
   * const llm = await agent.getLLM();
   * // Use with custom model
   * const customLlm = await agent.getLLM({ model: 'openai/gpt-5' });
   * ```
   */getLLM({runtimeContext=new RuntimeContext(),model}={}){const modelToUse=this.getModel({modelConfig:model,runtimeContext});return resolveMaybePromise(modelToUse,resolvedModel=>{let llm;if(resolvedModel.specificationVersion==="v2"){const modelsPromise=Array.isArray(this.model)&&!model?this.prepareModels(runtimeContext):this.prepareModels(runtimeContext,resolvedModel);llm=modelsPromise.then(models=>{const enabledModels=models.filter(model2=>model2.enabled);return new MastraLLMVNext({models:enabledModels,mastra:this.#mastra,options:{tracingPolicy:this.#options?.tracingPolicy}});});}else {llm=new MastraLLMV1({model:resolvedModel,mastra:this.#mastra,options:{tracingPolicy:this.#options?.tracingPolicy}});}return resolveMaybePromise(llm,resolvedLLM=>{if(this.#primitives){resolvedLLM.__registerPrimitives(this.#primitives);}if(this.#mastra){resolvedLLM.__registerMastra(this.#mastra);}return resolvedLLM;});});}/**
   * Resolves a model configuration to a LanguageModel instance
   * @param modelConfig The model configuration (magic string, config object, or LanguageModel)
   * @returns A LanguageModel instance
   * @internal
   */async resolveModelConfig(modelConfig,runtimeContext){try{return await resolveModelConfig(modelConfig,runtimeContext,this.#mastra);}catch(error){const mastraError=new MastraError({id:"AGENT_GET_MODEL_MISSING_MODEL_INSTANCE",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name,originalError:error instanceof Error?error.message:String(error)},text:`[Agent:${this.name}] - Failed to resolve model configuration`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}}/**
   * Gets the model instance, resolving it if it's a function or model configuration.
   * When the agent has multiple models configured, returns the first enabled model.
   *
   * @example
   * ```typescript
   * const model = await agent.getModel();
   * // Get with custom model config
   * const customModel = await agent.getModel({
   *   modelConfig: 'openai/gpt-5'
   * });
   * ```
   */getModel({runtimeContext=new RuntimeContext(),modelConfig=this.model}={}){if(!Array.isArray(modelConfig))return this.resolveModelConfig(modelConfig,runtimeContext);if(modelConfig.length===0||!modelConfig[0]){const mastraError=new MastraError({id:"AGENT_GET_MODEL_MISSING_MODEL_INSTANCE",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Empty model list provided`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return this.resolveModelConfig(modelConfig[0].model,runtimeContext);}/**
   * Gets the list of configured models if the agent has multiple models, otherwise returns null.
   * Used for model fallback and load balancing scenarios.
   *
   * @example
   * ```typescript
   * const models = await agent.getModelList();
   * if (models) {
   *   console.log(models.map(m => m.id));
   * }
   * ```
   */async getModelList(runtimeContext=new RuntimeContext()){if(!Array.isArray(this.model)){return null;}return this.prepareModels(runtimeContext);}/**
   * Updates the agent's instructions.
   * @internal
   */__updateInstructions(newInstructions){this.#instructions=newInstructions;this.logger.debug(`[Agents:${this.name}] Instructions updated.`,{model:this.model,name:this.name});}/**
   * Updates the agent's model configuration.
   * @internal
   */__updateModel({model}){this.model=model;this.logger.debug(`[Agents:${this.name}] Model updated.`,{model:this.model,name:this.name});}reorderModels(modelIds){if(!Array.isArray(this.model)){this.logger.warn(`[Agents:${this.name}] model is not an array`);return;}this.model=this.model.sort((a,b)=>{const aIndex=modelIds.indexOf(a.id);const bIndex=modelIds.indexOf(b.id);return aIndex-bIndex;});this.logger.debug(`[Agents:${this.name}] Models reordered`);}updateModelInModelList({id,model,enabled,maxRetries}){if(!Array.isArray(this.model)){this.logger.warn(`[Agents:${this.name}] model is not an array`);return;}const modelToUpdate=this.model.find(m=>m.id===id);if(!modelToUpdate){this.logger.warn(`[Agents:${this.name}] model ${id} not found`);return;}this.model=this.model.map(mdl=>{if(mdl.id===id){return {...mdl,model:model??mdl.model,enabled:enabled??mdl.enabled,maxRetries:maxRetries??mdl.maxRetries};}return mdl;});this.logger.debug(`[Agents:${this.name}] model ${id} updated`);}#primitives;/**
   * Registers telemetry and logger primitives with the agent.
   * @internal
   */__registerPrimitives(p){if(p.telemetry){this.__setTelemetry(p.telemetry);}if(p.logger){this.__setLogger(p.logger);}this.#primitives=p;this.logger.debug(`[Agents:${this.name}] initialized.`,{model:this.model,name:this.name});}/**
   * Registers the Mastra instance with the agent.
   * @internal
   */__registerMastra(mastra){this.#mastra=mastra;}/**
   * Set the concrete tools for the agent
   * @param tools
   * @internal
   */__setTools(tools){this.#tools=tools;this.logger.debug(`[Agents:${this.name}] Tools set for agent ${this.name}`,{model:this.model,name:this.name});}async generateTitleFromUserMessage({message,runtimeContext=new RuntimeContext(),tracingContext,model,instructions}){const llm=await this.getLLM({runtimeContext,model});const normMessage=new MessageList().add(message,"user").get.all.ui().at(-1);if(!normMessage){throw new Error(`Could not generate title from input ${JSON.stringify(message)}`);}const partsToGen=[];for(const part of normMessage.parts){if(part.type===`text`){partsToGen.push(part);}else if(part.type===`source`){partsToGen.push({type:"text",text:`User added URL: ${part.source.url.substring(0,100)}`});}else if(part.type===`file`){partsToGen.push({type:"text",text:`User added ${part.mimeType} file: ${part.data.substring(0,100)}`});}}const systemInstructions=await this.resolveTitleInstructions(runtimeContext,instructions);let text="";if(llm.getModel().specificationVersion==="v2"){const messageList=new MessageList().add([{role:"system",content:systemInstructions}],"system").add([{role:"user",content:JSON.stringify(partsToGen)}],"input");const result=llm.stream({runtimeContext,tracingContext,messageList,agentId:this.id});text=await result.text;}else {const result=await llm.__text({runtimeContext,tracingContext,messages:[{role:"system",content:systemInstructions},{role:"user",content:JSON.stringify(partsToGen)}]});text=result.text;}const cleanedText=text.replace(/<think>[\s\S]*?<\/think>/g,"").trim();return cleanedText;}getMostRecentUserMessage(messages){const userMessages=messages.filter(message=>message.role==="user");return userMessages.at(-1);}async genTitle(userMessage,runtimeContext,tracingContext,model,instructions){try{if(userMessage){const normMessage=new MessageList().add(userMessage,"user").get.all.ui().at(-1);if(normMessage){return await this.generateTitleFromUserMessage({message:normMessage,runtimeContext,tracingContext,model,instructions});}}return `New Thread ${(/* @__PURE__ */new Date()).toISOString()}`;}catch(e){this.logger.error("Error generating title:",e);return void 0;}}__setMemory(memory){this.#memory=memory;}/* @deprecated use agent.getMemory() and query memory directly */async fetchMemory({threadId,thread:passedThread,memoryConfig,resourceId,runId,userMessages,systemMessage,messageList=new MessageList({threadId,resourceId}),runtimeContext=new RuntimeContext()}){const memory=await this.getMemory({runtimeContext});if(memory){const thread=passedThread??(await memory.getThreadById({threadId}));if(!thread){return {threadId:threadId||"",messages:userMessages||[]};}if(userMessages&&userMessages.length>0){messageList.add(userMessages,"memory");}if(systemMessage?.role==="system"){messageList.addSystem(systemMessage,"memory");}const[memoryMessages,memorySystemMessage]=threadId&&memory?await Promise.all([memory.rememberMessages({threadId,resourceId,config:memoryConfig,vectorMessageSearch:messageList.getLatestUserContent()||""}).then(r=>r.messagesV2),memory.getSystemMessage({threadId,memoryConfig})]):[[],null];this.logger.debug("Fetched messages from memory",{threadId,runId,fetchedCount:memoryMessages.length});if(memorySystemMessage){messageList.addSystem(memorySystemMessage,"memory");}messageList.add(memoryMessages,"memory");const systemMessages=messageList.getSystemMessages()?.map(m=>m.content)?.join(`
`)??void 0;const newMessages=messageList.get.input.v1();const processedMemoryMessages=await memory.processMessages({// these will be processed
messages:messageList.get.remembered.v1(),// these are here for inspecting but shouldn't be returned by the processor
// - ex TokenLimiter needs to measure all tokens even though it's only processing remembered messages
newMessages,systemMessage:systemMessages,memorySystemMessage:memorySystemMessage||void 0});const returnList=new MessageList().addSystem(systemMessages).add(processedMemoryMessages,"memory").add(newMessages,"user");return {threadId:thread.id,messages:returnList.get.all.prompt()};}return {threadId:threadId||"",messages:userMessages||[]};}/**
   * Retrieves and converts memory tools to CoreTool format.
   * @internal
   */async getMemoryTools({runId,resourceId,threadId,runtimeContext,tracingContext,mastraProxy}){let convertedMemoryTools={};const memory=await this.getMemory({runtimeContext});const memoryTools=memory?.getTools?.();if(memoryTools){this.logger.debug(`[Agent:${this.name}] - Adding tools from memory ${Object.keys(memoryTools||{}).join(", ")}`,{runId});for(const[toolName,tool]of Object.entries(memoryTools)){const toolObj=tool;const options={name:toolName,runId,threadId,resourceId,logger:this.logger,mastra:mastraProxy,memory,agentName:this.name,runtimeContext,tracingContext,model:await this.getModel({runtimeContext}),tracingPolicy:this.#options?.tracingPolicy};const convertedToCoreTool=makeCoreTool(toolObj,options);convertedMemoryTools[toolName]=convertedToCoreTool;}}return convertedMemoryTools;}/**
   * Executes input processors on the message list before LLM processing.
   * @internal
   */async __runInputProcessors({runtimeContext,tracingContext,messageList,inputProcessorOverrides}){let tripwireTriggered=false;let tripwireReason="";if(inputProcessorOverrides?.length||this.#inputProcessors){const runner=await this.getProcessorRunner({runtimeContext,inputProcessorOverrides});const tracedRunInputProcessors=(messageList2,tracingContext2)=>{const telemetry=this.#mastra?.getTelemetry();if(!telemetry){return runner.runInputProcessors(messageList2,tracingContext2,void 0);}return telemetry.traceMethod(async data=>{return runner.runInputProcessors(data.messageList,tracingContext2,telemetry);},{spanName:`agent.${this.name}.inputProcessors`,attributes:{"agent.name":this.name,"inputProcessors.count":runner.inputProcessors.length.toString(),"inputProcessors.names":runner.inputProcessors.map(p=>p.name).join(",")}})({messageList:messageList2});};try{messageList=await tracedRunInputProcessors(messageList,tracingContext);}catch(error){if(error instanceof TripWire){tripwireTriggered=true;tripwireReason=error.message;}else {throw new MastraError({id:"AGENT_INPUT_PROCESSOR_ERROR",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:`[Agent:${this.name}] - Input processor error`},error);}}}return {messageList,tripwireTriggered,tripwireReason};}/**
   * Executes output processors on the message list after LLM processing.
   * @internal
   */async __runOutputProcessors({runtimeContext,tracingContext,messageList,outputProcessorOverrides}){let tripwireTriggered=false;let tripwireReason="";if(outputProcessorOverrides?.length||this.#outputProcessors){const runner=await this.getProcessorRunner({runtimeContext,outputProcessorOverrides});const tracedRunOutputProcessors=(messageList2,tracingContext2)=>{const telemetry=this.#mastra?.getTelemetry();if(!telemetry){return runner.runOutputProcessors(messageList2,tracingContext2,void 0);}return telemetry.traceMethod(async data=>{return runner.runOutputProcessors(data.messageList,tracingContext2,telemetry);},{spanName:`agent.${this.name}.outputProcessors`,attributes:{"agent.name":this.name,"outputProcessors.count":runner.outputProcessors.length.toString(),"outputProcessors.names":runner.outputProcessors.map(p=>p.name).join(",")}})({messageList:messageList2});};try{messageList=await tracedRunOutputProcessors(messageList,tracingContext);}catch(e){if(e instanceof TripWire){tripwireTriggered=true;tripwireReason=e.message;this.logger.debug(`[Agent:${this.name}] - Output processor tripwire triggered: ${e.message}`);}else {throw e;}}}return {messageList,tripwireTriggered,tripwireReason};}/**
   * Fetches remembered messages from memory for the current thread.
   * @internal
   */async getMemoryMessages({resourceId,threadId,vectorMessageSearch,memoryConfig,runtimeContext}){const memory=await this.getMemory({runtimeContext});if(!memory){return [];}return memory.rememberMessages({threadId,resourceId,config:memoryConfig,// The new user messages aren't in the list yet cause we add memory messages first to try to make sure ordering is correct (memory comes before new user messages)
vectorMessageSearch}).then(r=>r.messagesV2);}/**
   * Retrieves and converts assigned tools to CoreTool format.
   * @internal
   */async getAssignedTools({runId,resourceId,threadId,runtimeContext,tracingContext,mastraProxy,writableStream}){let toolsForRequest={};this.logger.debug(`[Agents:${this.name}] - Assembling assigned tools`,{runId,threadId,resourceId});const memory=await this.getMemory({runtimeContext});const assignedTools=await this.getTools({runtimeContext});const assignedToolEntries=Object.entries(assignedTools||{});const assignedCoreToolEntries=await Promise.all(assignedToolEntries.map(async([k,tool])=>{if(!tool){return;}const options={name:k,runId,threadId,resourceId,logger:this.logger,mastra:mastraProxy,memory,agentName:this.name,runtimeContext,tracingContext,model:await this.getModel({runtimeContext}),writableStream,tracingPolicy:this.#options?.tracingPolicy,requireApproval:tool.requireApproval};return [k,makeCoreTool(tool,options)];}));const assignedToolEntriesConverted=Object.fromEntries(assignedCoreToolEntries.filter(entry=>Boolean(entry)));toolsForRequest={...assignedToolEntriesConverted};return toolsForRequest;}/**
   * Retrieves and converts toolset tools to CoreTool format.
   * @internal
   */async getToolsets({runId,threadId,resourceId,toolsets,runtimeContext,tracingContext,mastraProxy}){let toolsForRequest={};const memory=await this.getMemory({runtimeContext});const toolsFromToolsets=Object.values(toolsets||{});if(toolsFromToolsets.length>0){this.logger.debug(`[Agent:${this.name}] - Adding tools from toolsets ${Object.keys(toolsets||{}).join(", ")}`,{runId});for(const toolset of toolsFromToolsets){for(const[toolName,tool]of Object.entries(toolset)){const toolObj=tool;const options={name:toolName,runId,threadId,resourceId,logger:this.logger,mastra:mastraProxy,memory,agentName:this.name,runtimeContext,tracingContext,model:await this.getModel({runtimeContext}),tracingPolicy:this.#options?.tracingPolicy};const convertedToCoreTool=makeCoreTool(toolObj,options,"toolset");toolsForRequest[toolName]=convertedToCoreTool;}}}return toolsForRequest;}/**
   * Retrieves and converts client-side tools to CoreTool format.
   * @internal
   */async getClientTools({runId,threadId,resourceId,runtimeContext,tracingContext,mastraProxy,clientTools}){let toolsForRequest={};const memory=await this.getMemory({runtimeContext});const clientToolsForInput=Object.entries(clientTools||{});if(clientToolsForInput.length>0){this.logger.debug(`[Agent:${this.name}] - Adding client tools ${Object.keys(clientTools||{}).join(", ")}`,{runId});for(const[toolName,tool]of clientToolsForInput){const{execute:execute2,...rest}=tool;const options={name:toolName,runId,threadId,resourceId,logger:this.logger,mastra:mastraProxy,memory,agentName:this.name,runtimeContext,tracingContext,model:await this.getModel({runtimeContext}),tracingPolicy:this.#options?.tracingPolicy};const convertedToCoreTool=makeCoreTool(rest,options,"client-tool");toolsForRequest[toolName]=convertedToCoreTool;}}return toolsForRequest;}/**
   * Retrieves and converts agent tools to CoreTool format.
   * @internal
   */async getAgentTools({runId,threadId,resourceId,runtimeContext,tracingContext,methodType}){const convertedAgentTools={};const agents=await this.listAgents({runtimeContext});if(Object.keys(agents).length>0){for(const[agentName,agent]of Object.entries(agents)){const agentInputSchema=objectType({prompt:stringType().describe("The prompt to send to the agent")});const agentOutputSchema=objectType({text:stringType().describe("The response from the agent"),subAgentThreadId:stringType().describe("The thread ID of the agent").optional(),subAgentResourceId:stringType().describe("The resource ID of the agent").optional()});const modelVersion=(await agent.getModel()).specificationVersion;const toolObj=createTool({id:`agent-${agentName}`,description:`Agent: ${agentName}`,inputSchema:agentInputSchema,outputSchema:agentOutputSchema,mastra:this.#mastra,// manually wrap agent tools with ai tracing, so that we can pass the
// current tool span onto the agent to maintain continuity of the trace
execute:async({context,writer,tracingContext:innerTracingContext})=>{try{this.logger.debug(`[Agent:${this.name}] - Executing agent as tool ${agentName}`,{name:agentName,args:context,runId,threadId,resourceId});let result;if((methodType==="generate"||methodType==="generateLegacy")&&modelVersion==="v2"){const generateResult=await agent.generate(context.prompt,{runtimeContext,tracingContext:innerTracingContext});result={text:generateResult.text};}else if((methodType==="generate"||methodType==="generateLegacy")&&modelVersion==="v1"){const generateResult=await agent.generateLegacy(context.prompt,{runtimeContext,tracingContext:innerTracingContext});result={text:generateResult.text};}else if((methodType==="stream"||methodType==="streamLegacy")&&modelVersion==="v2"){if(!agent.hasOwnMemory()&&this.#memory){agent.__setMemory(this.#memory);}const subAgentThreadId=randomUUID();const subAgentResourceId=`${slugify(this.id)}-${agentName}`;const streamResult=await agent.stream(context.prompt,{runtimeContext,tracingContext:innerTracingContext,...(resourceId&&threadId?{memory:{resource:subAgentResourceId,thread:subAgentThreadId}}:{})});let fullText="";for await(const chunk of streamResult.fullStream){if(writer){await writer.write(chunk);}if(chunk.type==="text-delta"){fullText+=chunk.payload.text;}}result={text:fullText,subAgentThreadId,subAgentResourceId};}else {const streamResult=await agent.streamLegacy(context.prompt,{runtimeContext,tracingContext:innerTracingContext});let fullText="";for await(const chunk of streamResult.fullStream){if(writer){await writer.write(chunk);}if(chunk.type==="text-delta"){fullText+=chunk.textDelta;}}result={text:fullText};}return result;}catch(err){const mastraError=new MastraError({id:"AGENT_AGENT_TOOL_EXECUTION_FAILED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name,subAgentName:agentName,runId:runId||"",threadId:threadId||"",resourceId:resourceId||""},text:`[Agent:${this.name}] - Failed agent tool execution for ${agentName}`},err);this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}}});const options={name:`agent-${agentName}`,runId,threadId,resourceId,logger:this.logger,mastra:this.#mastra,memory:await this.getMemory({runtimeContext}),agentName:this.name,runtimeContext,model:await this.getModel({runtimeContext}),tracingContext,tracingPolicy:this.#options?.tracingPolicy};convertedAgentTools[`agent-${agentName}`]=makeCoreTool(toolObj,options);}}return convertedAgentTools;}/**
   * Retrieves and converts workflow tools to CoreTool format.
   * @internal
   */async getWorkflowTools({runId,threadId,resourceId,runtimeContext,tracingContext,methodType}){const convertedWorkflowTools={};const workflows=await this.getWorkflows({runtimeContext});if(Object.keys(workflows).length>0){for(const[workflowName,workflow]of Object.entries(workflows)){const toolObj=createTool({id:`workflow-${workflowName}`,description:workflow.description||`Workflow: ${workflowName}`,inputSchema:workflow.inputSchema,outputSchema:workflow.outputSchema,mastra:this.#mastra,// manually wrap workflow tools with ai tracing, so that we can pass the
// current tool span onto the workflow to maintain continuity of the trace
execute:async({context,writer,tracingContext:innerTracingContext})=>{try{this.logger.debug(`[Agent:${this.name}] - Executing workflow as tool ${workflowName}`,{name:workflowName,description:workflow.description,args:context,runId,threadId,resourceId});const run=await workflow.createRunAsync();let result;if(methodType==="generate"||methodType==="generateLegacy"){result=await run.start({inputData:context,runtimeContext,tracingContext:innerTracingContext});}else if(methodType==="streamLegacy"){const streamResult=run.streamLegacy({inputData:context,runtimeContext,tracingContext:innerTracingContext});if(writer){await streamResult.stream.pipeTo(writer);}else {for await(const _chunk of streamResult.stream){}}result=await streamResult.getWorkflowState();}else if(methodType==="stream"){const streamResult=run.stream({inputData:context,runtimeContext,tracingContext:innerTracingContext});if(writer){await streamResult.fullStream.pipeTo(writer);}result=await streamResult.result;}return {result,runId:run.runId};}catch(err){const mastraError=new MastraError({id:"AGENT_WORKFLOW_TOOL_EXECUTION_FAILED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name,runId:runId||"",threadId:threadId||"",resourceId:resourceId||""},text:`[Agent:${this.name}] - Failed workflow tool execution`},err);this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}}});const options={name:`workflow-${workflowName}`,runId,threadId,resourceId,logger:this.logger,mastra:this.#mastra,memory:await this.getMemory({runtimeContext}),agentName:this.name,runtimeContext,model:await this.getModel({runtimeContext}),tracingContext,tracingPolicy:this.#options?.tracingPolicy};convertedWorkflowTools[`workflow-${workflowName}`]=makeCoreTool(toolObj,options);}}return convertedWorkflowTools;}/**
   * Assembles all tools from various sources into a unified CoreTool dictionary.
   * @internal
   */async convertTools({toolsets,clientTools,threadId,resourceId,runId,runtimeContext,tracingContext,writableStream,methodType}){let mastraProxy=void 0;const logger=this.logger;if(this.#mastra){mastraProxy=createMastraProxy({mastra:this.#mastra,logger});}const assignedTools=await this.getAssignedTools({runId,resourceId,threadId,runtimeContext,tracingContext,mastraProxy,writableStream});const memoryTools=await this.getMemoryTools({runId,resourceId,threadId,runtimeContext,tracingContext,mastraProxy});const toolsetTools=await this.getToolsets({runId,resourceId,threadId,runtimeContext,tracingContext,mastraProxy,toolsets});const clientSideTools=await this.getClientTools({runId,resourceId,threadId,runtimeContext,tracingContext,mastraProxy,clientTools});const agentTools=await this.getAgentTools({runId,resourceId,threadId,runtimeContext,methodType,tracingContext});const workflowTools=await this.getWorkflowTools({runId,resourceId,threadId,runtimeContext,methodType,tracingContext});return this.formatTools({...assignedTools,...memoryTools,...toolsetTools,...clientSideTools,...agentTools,...workflowTools});}/**
   * Formats and validates tool names to comply with naming restrictions.
   * @internal
   */formatTools(tools){const INVALID_CHAR_REGEX=/[^a-zA-Z0-9_\-]/g;const STARTING_CHAR_REGEX=/[a-zA-Z_]/;for(const key of Object.keys(tools)){if(tools[key]&&(key.length>63||key.match(INVALID_CHAR_REGEX)||!key[0].match(STARTING_CHAR_REGEX))){let newKey=key.replace(INVALID_CHAR_REGEX,"_");if(!newKey[0].match(STARTING_CHAR_REGEX)){newKey="_"+newKey;}newKey=newKey.slice(0,63);if(tools[newKey]){const mastraError=new MastraError({id:"AGENT_TOOL_NAME_COLLISION",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name,toolName:newKey},text:`Two or more tools resolve to the same name "${newKey}". Please rename one of the tools to avoid this collision.`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}tools[newKey]=tools[key];delete tools[key];}}return tools;}/**
   * Adds response messages from a step to the MessageList and schedules persistence.
   * This is used for incremental saving: after each agent step, messages are added to a save queue
   * and a debounced save operation is triggered to avoid redundant writes.
   *
   * @param result - The step result containing response messages.
   * @param messageList - The MessageList instance for the current thread.
   * @param threadId - The thread ID.
   * @param memoryConfig - The memory configuration for saving.
   * @param runId - (Optional) The run ID for logging.
   * @internal
   */async saveStepMessages({saveQueueManager,result,messageList,threadId,memoryConfig,runId}){try{messageList.add(result.response.messages,"response");await saveQueueManager.batchMessages(messageList,threadId,memoryConfig);}catch(e){await saveQueueManager.flushMessages(messageList,threadId,memoryConfig);this.logger.error("Error saving memory on step finish",{error:e,runId});throw e;}}/**
   * Prepares message list and tools before LLM execution and handles memory persistence after.
   * @internal
   */__primitive({instructions,messages,context,thread,memoryConfig,resourceId,runId,toolsets,clientTools,runtimeContext,saveQueueManager,writableStream,methodType,tracingContext,tracingOptions}){return {before:async()=>{if(process.env.NODE_ENV!=="test"){this.logger.debug(`[Agents:${this.name}] - Starting generation`,{runId});}const agentAISpan=getOrCreateSpan({type:"agent_run"/* AGENT_RUN */,name:`agent run: '${this.id}'`,input:{messages},attributes:{agentId:this.id,instructions:this.#convertInstructionsToString(instructions),availableTools:[...(toolsets?Object.keys(toolsets):[]),...(clientTools?Object.keys(clientTools):[])]},metadata:{runId,resourceId,threadId:thread?thread.id:void 0},tracingPolicy:this.#options?.tracingPolicy,tracingOptions,tracingContext,runtimeContext});const innerTracingContext={currentSpan:agentAISpan};const memory=await this.getMemory({runtimeContext});const toolEnhancements=[// toolsets
toolsets&&Object.keys(toolsets||{}).length>0?`toolsets present (${Object.keys(toolsets||{}).length} tools)`:void 0,// memory tools
memory&&resourceId?"memory and resourceId available":void 0].filter(Boolean).join(", ");this.logger.debug(`[Agent:${this.name}] - Enhancing tools: ${toolEnhancements}`,{runId,toolsets:toolsets?Object.keys(toolsets):void 0,clientTools:clientTools?Object.keys(clientTools):void 0,hasMemory:!!memory,hasResourceId:!!resourceId});const threadId=thread?.id;const convertedTools=await this.convertTools({toolsets,clientTools,threadId,resourceId,runId,runtimeContext,tracingContext:innerTracingContext,writableStream,methodType});const messageList=new MessageList({threadId,resourceId,generateMessageId:this.#mastra?.generateId?.bind(this.#mastra),// @ts-ignore Flag for agent network messages
_agentNetworkAppend:this._agentNetworkAppend}).addSystem(instructions||(await this.getInstructions({runtimeContext}))).add(context||[],"context");if(!memory||!threadId&&!resourceId){messageList.add(messages,"user");const{tripwireTriggered:tripwireTriggered2,tripwireReason:tripwireReason2}=await this.__runInputProcessors({runtimeContext,tracingContext:innerTracingContext,messageList});return {messageObjects:tripwireTriggered2?[]:messageList.get.all.prompt(),convertedTools,threadExists:false,thread:void 0,messageList,agentAISpan,...(tripwireTriggered2&&{tripwire:true,tripwireReason:tripwireReason2})};}if(!threadId||!resourceId){const mastraError=new MastraError({id:"AGENT_MEMORY_MISSING_RESOURCE_ID",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name,threadId:threadId||"",resourceId:resourceId||""},text:`A resourceId and a threadId must be provided when using Memory. Saw threadId "${threadId}" and resourceId "${resourceId}"`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());agentAISpan?.error({error:mastraError});throw mastraError;}const store=memory.constructor.name;this.logger.debug(`[Agent:${this.name}] - Memory persistence enabled: store=${store}, resourceId=${resourceId}`,{runId,resourceId,threadId,memoryStore:store});let threadObject=void 0;const existingThread=await memory.getThreadById({threadId});if(existingThread){if(!existingThread.metadata&&thread.metadata||thread.metadata&&!(0, import_fast_deep_equal2.default)(existingThread.metadata,thread.metadata)){threadObject=await memory.saveThread({thread:{...existingThread,metadata:thread.metadata},memoryConfig});}else {threadObject=existingThread;}}else {threadObject=await memory.createThread({threadId,metadata:thread.metadata,title:thread.title,memoryConfig,resourceId,saveThread:false});}const config=memory.getMergedThreadConfig(memoryConfig||{});const hasResourceScopeSemanticRecall=typeof config?.semanticRecall==="object"&&config?.semanticRecall?.scope==="resource";let[memoryMessages,memorySystemMessage]=await Promise.all([existingThread||hasResourceScopeSemanticRecall?this.getMemoryMessages({resourceId,threadId:threadObject.id,vectorMessageSearch:new MessageList().add(messages,`user`).getLatestUserContent()||"",memoryConfig,runtimeContext}):[],memory.getSystemMessage({threadId:threadObject.id,resourceId,memoryConfig})]);this.logger.debug("Fetched messages from memory",{threadId:threadObject.id,runId,fetchedCount:memoryMessages.length});const resultsFromOtherThreads=memoryMessages.filter(m=>m.threadId!==threadObject.id);if(resultsFromOtherThreads.length&&!memorySystemMessage){memorySystemMessage=``;}if(resultsFromOtherThreads.length){memorySystemMessage+=`
The following messages were remembered from a different conversation:
<remembered_from_other_conversation>
${(()=>{let result=``;const messages2=new MessageList().add(resultsFromOtherThreads,"memory").get.all.v1();let lastYmd=null;for(const msg of messages2){const date=msg.createdAt;const year=date.getUTCFullYear();const month=date.toLocaleString("default",{month:"short"});const day=date.getUTCDate();const ymd=`${year}, ${month}, ${day}`;const utcHour=date.getUTCHours();const utcMinute=date.getUTCMinutes();const hour12=utcHour%12||12;const ampm=utcHour<12?"AM":"PM";const timeofday=`${hour12}:${utcMinute<10?"0":""}${utcMinute} ${ampm}`;if(!lastYmd||lastYmd!==ymd){result+=`
the following messages are from ${ymd}
`;}result+=`
  Message ${msg.threadId&&msg.threadId!==threadObject.id?"from previous conversation":""} at ${timeofday}: ${JSON.stringify(msg)}`;lastYmd=ymd;}return result;})()}
<end_remembered_from_other_conversation>`;}if(memorySystemMessage){messageList.addSystem(memorySystemMessage,"memory");}messageList.add(memoryMessages.filter(m=>m.threadId===threadObject.id),// filter out messages from other threads. those are added to system message above
"memory").add(messages,"user");const{tripwireTriggered,tripwireReason}=await this.__runInputProcessors({runtimeContext,tracingContext:innerTracingContext,messageList});const systemMessages=messageList.getSystemMessages();const systemMessage=[...systemMessages,...messageList.getSystemMessages("memory")]?.map(m=>m.content)?.join(`
`)??void 0;const processedMemoryMessages=await memory.processMessages({// these will be processed
messages:messageList.get.remembered.v1(),// these are here for inspecting but shouldn't be returned by the processor
// - ex TokenLimiter needs to measure all tokens even though it's only processing remembered messages
newMessages:messageList.get.input.v1(),systemMessage,memorySystemMessage:memorySystemMessage||void 0});const processedList=new MessageList({threadId:threadObject.id,resourceId,generateMessageId:this.#mastra?.generateId?.bind(this.#mastra),// @ts-ignore Flag for agent network messages
_agentNetworkAppend:this._agentNetworkAppend}).addSystem(instructions||(await this.getInstructions({runtimeContext}))).addSystem(memorySystemMessage).addSystem(systemMessages).add(context||[],"context").add(processedMemoryMessages,"memory").add(messageList.get.input.v2(),"user").get.all.prompt();return {convertedTools,thread:threadObject,messageList,// add old processed messages + new input messages
messageObjects:processedList,agentAISpan,...(tripwireTriggered&&{tripwire:true,tripwireReason}),threadExists:!!existingThread};},after:async({result,thread:threadAfter,threadId,memoryConfig:memoryConfig2,outputText,runId:runId2,messageList,threadExists,structuredOutput=false,overrideScorers,agentAISpan})=>{const resToLog={text:result?.text,object:result?.object,toolResults:result?.toolResults,toolCalls:result?.toolCalls,usage:result?.usage,steps:result?.steps?.map(s=>{return {stepType:s?.stepType,text:result?.text,object:result?.object,toolResults:result?.toolResults,toolCalls:result?.toolCalls,usage:result?.usage};})};this.logger.debug(`[Agent:${this.name}] - Post processing LLM response`,{runId:runId2,result:resToLog,threadId});const messageListResponses=new MessageList({threadId,resourceId,generateMessageId:this.#mastra?.generateId?.bind(this.#mastra),// @ts-ignore Flag for agent network messages
_agentNetworkAppend:this._agentNetworkAppend}).add(result.response.messages,"response").get.all.core();const usedWorkingMemory=messageListResponses?.some(m=>m.role==="tool"&&m?.content?.some(c=>c?.toolName==="updateWorkingMemory"));const memory=await this.getMemory({runtimeContext});const thread2=usedWorkingMemory?threadId?await memory?.getThreadById({threadId}):void 0:threadAfter;if(memory&&resourceId&&thread2){try{let responseMessages=result.response.messages;if(!responseMessages&&result.object){responseMessages=[{role:"assistant",content:[{type:"text",text:outputText// outputText contains the stringified object
}]}];}if(responseMessages){messageList.add(responseMessages,"response");}if(!threadExists){await memory.createThread({threadId:thread2.id,metadata:thread2.metadata,title:thread2.title,memoryConfig:memoryConfig2,resourceId:thread2.resourceId});}const promises=[saveQueueManager.flushMessages(messageList,threadId,memoryConfig2)];if(thread2.title?.startsWith("New Thread")){const config=memory.getMergedThreadConfig(memoryConfig2);const userMessage=this.getMostRecentUserMessage(messageList.get.all.ui());const{shouldGenerate,model:titleModel,instructions:titleInstructions}=this.resolveTitleGenerationConfig(config?.threads?.generateTitle);if(shouldGenerate&&userMessage){promises.push(this.genTitle(userMessage,runtimeContext,{currentSpan:agentAISpan},titleModel,titleInstructions).then(title=>{if(title){return memory.createThread({threadId:thread2.id,resourceId,memoryConfig:memoryConfig2,title,metadata:thread2.metadata});}}));}}await Promise.all(promises);}catch(e){await saveQueueManager.flushMessages(messageList,threadId,memoryConfig2);if(e instanceof MastraError){agentAISpan?.error({error:e});throw e;}const mastraError=new MastraError({id:"AGENT_MEMORY_PERSIST_RESPONSE_MESSAGES_FAILED",domain:"AGENT"/* AGENT */,category:"SYSTEM"/* SYSTEM */,details:{agentName:this.name,runId:runId2||"",threadId:threadId||"",result:JSON.stringify(resToLog)}},e);this.logger.trackException(mastraError);this.logger.error(mastraError.toString());agentAISpan?.error({error:mastraError});throw mastraError;}}else {let responseMessages=result.response.messages;if(!responseMessages&&result.object){responseMessages=[{role:"assistant",content:[{type:"text",text:outputText// outputText contains the stringified object
}]}];}if(responseMessages){messageList.add(responseMessages,"response");}}await this.#runScorers({messageList,runId:runId2,outputText,instructions,runtimeContext,structuredOutput,overrideScorers,threadId,resourceId,tracingContext:{currentSpan:agentAISpan}});const scoringData={input:{inputMessages:messageList.getPersisted.input.ui(),rememberedMessages:messageList.getPersisted.remembered.ui(),systemMessages:messageList.getSystemMessages(),taggedSystemMessages:messageList.getPersisted.taggedSystemMessages},output:messageList.getPersisted.response.ui()};agentAISpan?.end({output:{text:result?.text,object:result?.object,files:result?.files}});return {scoringData};}};}async#runScorers({messageList,runId,outputText,instructions,runtimeContext,structuredOutput,overrideScorers,threadId,resourceId,tracingContext}){const agentName=this.name;const userInputMessages=messageList.get.all.ui().filter(m=>m.role==="user");const input=userInputMessages.map(message=>typeof message.content==="string"?message.content:"").join("\n");const runIdToUse=runId||this.#mastra?.generateId()||randomUUID();if(Object.keys(this.evals||{}).length>0){for(const metric of Object.values(this.evals||{})){executeHook("onGeneration"/* ON_GENERATION */,{input,output:outputText,runId:runIdToUse,metric,agentName,instructions:this.#convertInstructionsToString(instructions)});}}let scorers={};try{scorers=overrideScorers?this.resolveOverrideScorerReferences(overrideScorers):await this.getScorers({runtimeContext});}catch(e){this.logger.warn(`[Agent:${this.name}] - Failed to get scorers: ${e}`);return;}const scorerInput={inputMessages:messageList.getPersisted.input.ui(),rememberedMessages:messageList.getPersisted.remembered.ui(),systemMessages:messageList.getSystemMessages(),taggedSystemMessages:messageList.getPersisted.taggedSystemMessages};const scorerOutput=messageList.getPersisted.response.ui();if(Object.keys(scorers||{}).length>0){for(const[_id,scorerObject]of Object.entries(scorers)){runScorer({scorerId:overrideScorers?scorerObject.scorer.name:scorerObject.scorer.name,scorerObject,runId,input:scorerInput,output:scorerOutput,runtimeContext,entity:{id:this.id,name:this.name},source:"LIVE",entityType:"AGENT",structuredOutput:!!structuredOutput,threadId,resourceId,tracingContext});}}}/**
   * Resolves scorer name references to actual scorer instances from Mastra.
   * @internal
   */resolveOverrideScorerReferences(overrideScorers){const result={};for(const[id,scorerObject]of Object.entries(overrideScorers)){if(typeof scorerObject.scorer==="string"){try{if(!this.#mastra){throw new MastraError({id:"AGENT_GENEREATE_SCORER_NOT_FOUND",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:`Mastra not found when fetching scorer. Make sure to fetch agent from mastra.getAgent()`});}const scorer=this.#mastra.getScorerByName(scorerObject.scorer);result[id]={scorer,sampling:scorerObject.sampling};}catch(error){this.logger.warn(`[Agent:${this.name}] - Failed to get scorer ${scorerObject.scorer}: ${error}`);}}else {result[id]=scorerObject;}}if(Object.keys(result).length===0){throw new MastraError({id:"AGENT_GENEREATE_SCORER_NOT_FOUND",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:`No scorers found in overrideScorers`});}return result;}/**
   * @internal
   */async prepareLLMOptions(messages,options,methodType){const{context,memoryOptions:memoryConfigFromArgs,resourceId:resourceIdFromArgs,maxSteps,onStepFinish,toolsets,clientTools,temperature,toolChoice="auto",runtimeContext=new RuntimeContext(),tracingContext,tracingOptions,savePerStep,writableStream,...args}=options;const threadFromArgs=resolveThreadIdFromArgs({threadId:args.threadId,memory:args.memory});const resourceId=args.memory?.resource||resourceIdFromArgs;const memoryConfig=args.memory?.options||memoryConfigFromArgs;if(resourceId&&threadFromArgs&&!this.hasOwnMemory()){this.logger.warn(`[Agent:${this.name}] - No memory is configured but resourceId and threadId were passed in args. This will not work.`);}const runId=args.runId||this.#mastra?.generateId()||randomUUID();const instructions=args.instructions||(await this.getInstructions({runtimeContext}));const llm=await this.getLLM({runtimeContext});const activeSpan=Telemetry.getActiveSpan();const baggageEntries={};if(threadFromArgs?.id){if(activeSpan){activeSpan.setAttribute("threadId",threadFromArgs.id);}baggageEntries.threadId={value:threadFromArgs.id};}if(resourceId){if(activeSpan){activeSpan.setAttribute("resourceId",resourceId);}baggageEntries.resourceId={value:resourceId};}if(Object.keys(baggageEntries).length>0){Telemetry.setBaggage(baggageEntries);}const memory=await this.getMemory({runtimeContext});const saveQueueManager=new SaveQueueManager({logger:this.logger,memory});const{before,after}=this.__primitive({messages,instructions,context,thread:threadFromArgs,memoryConfig,resourceId,runId,toolsets,clientTools,runtimeContext,saveQueueManager,writableStream,methodType,tracingContext,tracingOptions});let messageList;let thread;let threadExists;return {llm,before:async()=>{const beforeResult=await before();const{messageObjects,convertedTools,agentAISpan}=beforeResult;threadExists=beforeResult.threadExists||false;messageList=beforeResult.messageList;thread=beforeResult.thread;const threadId=thread?.id;const result={...options,messages:messageObjects,tools:convertedTools,runId,temperature,toolChoice,threadId,resourceId,runtimeContext,onStepFinish:async props=>{if(savePerStep){if(!threadExists&&memory&&thread){await memory.createThread({threadId,title:thread.title,metadata:thread.metadata,resourceId:thread.resourceId,memoryConfig});threadExists=true;}await this.saveStepMessages({saveQueueManager,result:props,messageList,threadId,memoryConfig,runId});}return onStepFinish?.({...props,runId});},...(beforeResult.tripwire&&{tripwire:beforeResult.tripwire,tripwireReason:beforeResult.tripwireReason}),...args,agentAISpan};return result;},after:async({result,outputText,structuredOutput=false,agentAISpan,overrideScorers})=>{const afterResult=await after({result,outputText,threadId:thread?.id,thread,memoryConfig,runId,messageList,structuredOutput,threadExists,agentAISpan,overrideScorers});return afterResult;}};}/**
   * Resolves and prepares model configurations for the LLM.
   * @internal
   */async prepareModels(runtimeContext,model){if(model||!Array.isArray(this.model)){const modelToUse=model??this.model;const resolvedModel=typeof modelToUse==="function"?await modelToUse({runtimeContext,mastra:this.#mastra}):modelToUse;if(resolvedModel.specificationVersion!=="v2"){const mastraError=new MastraError({id:"AGENT_PREPARE_MODELS_INCOMPATIBLE_WITH_MODEL_ARRAY_V1",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Only v2 models are allowed when an array of models is provided`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return [{id:"main",model:resolvedModel,maxRetries:this.maxRetries??0,enabled:true}];}const models=await Promise.all(this.model.map(async modelConfig=>{const model2=await this.resolveModelConfig(modelConfig.model,runtimeContext);if(model2.specificationVersion!=="v2"){const mastraError=new MastraError({id:"AGENT_PREPARE_MODELS_INCOMPATIBLE_WITH_MODEL_ARRAY_V1",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Only v2 models are allowed when an array of models is provided`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}const modelId=modelConfig.id||model2.modelId;if(!modelId){const mastraError=new MastraError({id:"AGENT_PREPARE_MODELS_MISSING_MODEL_ID",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:`[Agent:${this.name}] - Unable to determine model ID. Please provide an explicit ID in the model configuration.`});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}return {id:modelId,model:model2,maxRetries:modelConfig.maxRetries??0,enabled:modelConfig.enabled??true};}));return models;}/**
   * Merges telemetry wrapper with default onFinish callback when needed
   * @internal
   */#mergeOnFinishWithTelemetry(streamOptions,defaultStreamOptions){let finalOnFinish=streamOptions?.onFinish||defaultStreamOptions.onFinish;if(streamOptions?.onFinish&&streamOptions.onFinish.__hasOriginalOnFinish===false&&defaultStreamOptions.onFinish){const telemetryWrapper=streamOptions.onFinish;const defaultCallback=defaultStreamOptions.onFinish;finalOnFinish=async data=>{await telemetryWrapper(data);await defaultCallback(data);};}return finalOnFinish;}/**
   * Executes the agent with VNext execution model, handling tools, memory, and streaming.
   * @internal
   */async#execute({methodType,format="mastra",resumeContext,...options}){const existingSnapshot=resumeContext?.snapshot;let snapshotMemoryInfo;if(existingSnapshot){for(const key in existingSnapshot?.context){const step=existingSnapshot?.context[key];if(step&&step.status==="suspended"&&step.suspendPayload?.__streamState){snapshotMemoryInfo=step.suspendPayload?.__streamState?.messageList?.memoryInfo;break;}}}const runtimeContext=options.runtimeContext||new RuntimeContext();const threadFromArgs=resolveThreadIdFromArgs({threadId:options.threadId||snapshotMemoryInfo?.threadId,memory:options.memory});const resourceId=options.memory?.resource||options.resourceId||snapshotMemoryInfo?.resourceId;const memoryConfig=options.memory?.options;if(resourceId&&threadFromArgs&&!this.hasOwnMemory()){this.logger.warn(`[Agent:${this.name}] - No memory is configured but resourceId and threadId were passed in args. This will not work.`);}const llm=await this.getLLM({runtimeContext,model:options.model});const runId=options.runId||this.#mastra?.generateId()||randomUUID();const instructions=options.instructions||(await this.getInstructions({runtimeContext}));const agentAISpan=getOrCreateSpan({type:"agent_run"/* AGENT_RUN */,name:`agent run: '${this.id}'`,input:options.messages,attributes:{agentId:this.id,instructions:this.#convertInstructionsToString(instructions)},metadata:{runId,resourceId,threadId:threadFromArgs?.id},tracingPolicy:this.#options?.tracingPolicy,tracingOptions:options.tracingOptions,tracingContext:options.tracingContext,runtimeContext});const activeSpan=Telemetry.getActiveSpan();const baggageEntries={};if(threadFromArgs?.id){if(activeSpan){activeSpan.setAttribute("threadId",threadFromArgs.id);}baggageEntries.threadId={value:threadFromArgs.id};}if(resourceId){if(activeSpan){activeSpan.setAttribute("resourceId",resourceId);}baggageEntries.resourceId={value:resourceId};}if(Object.keys(baggageEntries).length>0){Telemetry.setBaggage(baggageEntries);}const memory=await this.getMemory({runtimeContext});const saveQueueManager=new SaveQueueManager({logger:this.logger,memory});if(process.env.NODE_ENV!=="test"){this.logger.debug(`[Agents:${this.name}] - Starting generation`,{runId});}const capabilities={agentName:this.name,logger:this.logger,getMemory:this.getMemory.bind(this),getModel:this.getModel.bind(this),generateMessageId:this.#mastra?.generateId?.bind(this.#mastra)||(()=>randomUUID()),_agentNetworkAppend:"_agentNetworkAppend"in this?Boolean(this._agentNetworkAppend):void 0,saveStepMessages:this.saveStepMessages.bind(this),convertTools:this.convertTools.bind(this),getMemoryMessages:this.getMemoryMessages.bind(this),runInputProcessors:this.__runInputProcessors.bind(this),executeOnFinish:this.#executeOnFinish.bind(this),outputProcessors:this.#outputProcessors,llm,getTelemetry:this.#mastra?.getTelemetry?.bind(this.#mastra)};const executionWorkflow=createPrepareStreamWorkflow({capabilities,options:{...options,methodType},threadFromArgs,resourceId,runId,runtimeContext,agentAISpan,methodType,format,instructions,memoryConfig,memory,saveQueueManager,returnScorerData:options.returnScorerData,requireToolApproval:options.requireToolApproval,resumeContext,agentId:this.id,toolCallId:options.toolCallId});const run=await executionWorkflow.createRunAsync();const result=await run.start({tracingContext:{currentSpan:agentAISpan}});return result;}/**
   * Handles post-execution tasks including memory persistence and title generation.
   * @internal
   */async#executeOnFinish({result,instructions,readOnlyMemory,thread:threadAfter,threadId,resourceId,memoryConfig,outputText,runtimeContext,agentAISpan,runId,messageList,threadExists,structuredOutput=false,saveQueueManager,overrideScorers}){const resToLog={text:result.text,object:result.object,toolResults:result.toolResults,toolCalls:result.toolCalls,usage:result.usage,steps:result.steps.map(s=>{return {stepType:s.stepType,text:s.text,toolResults:s.toolResults,toolCalls:s.toolCalls,usage:s.usage};})};this.logger.debug(`[Agent:${this.name}] - Post processing LLM response`,{runId,result:resToLog,threadId,resourceId});const messageListResponses=messageList.get.response.aiV4.core();const usedWorkingMemory=messageListResponses.some(m=>m.role==="tool"&&m.content.some(c=>c.toolName==="updateWorkingMemory"));const memory=await this.getMemory({runtimeContext});const thread=usedWorkingMemory?threadId?await memory?.getThreadById({threadId}):void 0:threadAfter;if(memory&&resourceId&&thread&&!readOnlyMemory){try{let responseMessages=result.response.messages;if(!responseMessages&&result.object){responseMessages=[{id:result.response.id,role:"assistant",content:[{type:"text",text:outputText// outputText contains the stringified object
}]}];}if(responseMessages){messageList.add(responseMessages,"response");}if(!threadExists){await memory.createThread({threadId:thread.id,metadata:thread.metadata,title:thread.title,memoryConfig,resourceId:thread.resourceId});}const promises=[saveQueueManager.flushMessages(messageList,threadId,memoryConfig)];if(thread.title?.startsWith("New Thread")){const config=memory.getMergedThreadConfig(memoryConfig);const userMessage=this.getMostRecentUserMessage(messageList.get.all.ui());const{shouldGenerate,model:titleModel,instructions:titleInstructions}=this.resolveTitleGenerationConfig(config.threads?.generateTitle);if(shouldGenerate&&userMessage){promises.push(this.genTitle(userMessage,runtimeContext,{currentSpan:agentAISpan},titleModel,titleInstructions).then(title=>{if(title){return memory.createThread({threadId:thread.id,resourceId,memoryConfig,title,metadata:thread.metadata});}}));}}await Promise.all(promises);}catch(e){await saveQueueManager.flushMessages(messageList,threadId,memoryConfig);if(e instanceof MastraError){throw e;}const mastraError=new MastraError({id:"AGENT_MEMORY_PERSIST_RESPONSE_MESSAGES_FAILED",domain:"AGENT"/* AGENT */,category:"SYSTEM"/* SYSTEM */,details:{agentName:this.name,runId:runId||"",threadId:threadId||"",result:JSON.stringify(resToLog)}},e);this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}}else {let responseMessages=result.response.messages;if(!responseMessages&&result.object){responseMessages=[{id:result.response.id,role:"assistant",content:[{type:"text",text:outputText// outputText contains the stringified object
}]}];}if(responseMessages){messageList.add(responseMessages,"response");}}await this.#runScorers({messageList,runId,outputText,instructions,runtimeContext,structuredOutput,overrideScorers,tracingContext:{currentSpan:agentAISpan}});agentAISpan?.end({output:{text:result.text,object:result.object,files:result.files}});}/**
   * Executes a network loop where multiple agents can collaborate to handle messages.
   * The routing agent delegates tasks to appropriate sub-agents based on the conversation.
   *
   * @experimental
   *
   * @example
   * ```typescript
   * const result = await agent.network('Find the weather in Tokyo and plan an activity', {
   *   memory: {
   *     thread: 'user-123',
   *     resource: 'my-app'
   *   },
   *   maxSteps: 10
   * });
   *
   * for await (const chunk of result.stream) {
   *   console.log(chunk);
   * }
   * ```
   */async network(messages,options){const runId=options?.runId||this.#mastra?.generateId()||randomUUID();const runtimeContextToUse=options?.runtimeContext||new RuntimeContext();return await networkLoop({networkName:this.name,runtimeContext:runtimeContextToUse,runId,routingAgent:this,routingAgentOptions:{telemetry:options?.telemetry,modelSettings:options?.modelSettings,memory:options?.memory},generateId:()=>this.#mastra?.generateId()||randomUUID(),maxIterations:options?.maxSteps||1,messages,threadId:typeof options?.memory?.thread==="string"?options?.memory?.thread:options?.memory?.thread?.id,resourceId:options?.memory?.resource});}/**
   * @deprecated `generateVNext()` has been renamed to `generate()`. Please use `generate()` instead.
   */async generateVNext(_messages,_options){throw new MastraError({id:"AGENT_GENERATE_VNEXT_DEPRECATED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"generateVNext has been renamed to generate. Please use generate instead."});}async generate(messages,options){if(options?.structuredOutput?.schema&&options?.output){throw new MastraError({id:"AGENT_GENERATE_STRUCTURED_OUTPUT_AND_OUTPUT_PROVIDED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"structuredOutput and output cannot be provided at the same time to agent.generate"});}const normalizedOptions=options?.output?{structuredOutput:{schema:options.output,...options.structuredOutput},...options,output:void 0}:options;const result=await this.stream(messages,normalizedOptions);const fullOutput=await result.getFullOutput();const error=fullOutput.error;if(fullOutput.finishReason==="error"&&error){throw error;}return fullOutput;}/**
   * @deprecated `streamVNext()` has been renamed to `stream()`. Please use `stream()` instead.
   */async streamVNext(_messages,_streamOptions){throw new MastraError({id:"AGENT_STREAM_VNEXT_DEPRECATED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"streamVNext has been renamed to stream. Please use stream instead."});}async stream(messages,streamOptions){const defaultStreamOptions=await this.getDefaultVNextStreamOptions({runtimeContext:streamOptions?.runtimeContext});if(streamOptions?.structuredOutput?.schema&&streamOptions?.output){throw new MastraError({id:"AGENT_STREAM_STRUCTURED_OUTPUT_AND_OUTPUT_PROVIDED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"structuredOutput and output cannot be provided at the same time to agent.stream"});}const baseStreamOptions={...defaultStreamOptions,...(streamOptions??{}),onFinish:this.#mergeOnFinishWithTelemetry(streamOptions,defaultStreamOptions)};const mergedStreamOptions=baseStreamOptions.output?{structuredOutput:{schema:baseStreamOptions.output,...baseStreamOptions.structuredOutput},...baseStreamOptions,output:void 0}:baseStreamOptions;const llm=await this.getLLM({runtimeContext:mergedStreamOptions.runtimeContext});const modelInfo=llm.getModel();if(modelInfo.specificationVersion!=="v2"){const modelId=modelInfo.modelId||"unknown";const provider=modelInfo.provider||"unknown";throw new MastraError({id:"AGENT_STREAM_V1_MODEL_NOT_SUPPORTED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:`Agent "${this.name}" is using AI SDK v4 model (${provider}:${modelId}) which is not compatible with stream(). Please use AI SDK v5 models or call the streamLegacy() method instead. See https://mastra.ai/en/docs/streaming/overview for more information.`,details:{agentName:this.name,modelId,provider,specificationVersion:modelInfo.specificationVersion}});}const executeOptions={...mergedStreamOptions,messages,methodType:"stream"};const result=await this.#execute(executeOptions);if(result.status!=="success"){if(result.status==="failed"){throw new MastraError({id:"AGENT_STREAM_FAILED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */},// pass original error to preserve stack trace
result.error);}throw new MastraError({id:"AGENT_STREAM_UNKNOWN_ERROR",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"An unknown error occurred while streaming"});}if(streamOptions?.format==="aisdk"){this.logger.warn('The `format: "aisdk"` is deprecated in stream/generate options. Use the @mastra/ai-sdk package instead. See https://mastra.ai/en/docs/frameworks/agentic-uis/ai-sdk#streaming');}return result.result;}/**
   * Resumes a previously suspended VNext stream execution.
   * Used to continue execution after a suspension point (e.g., tool approval, workflow suspend).
   *
   * @example
   * ```typescript
   * // Resume after suspension
   * const stream = await agent.resumeStreamVNext(
   *   { approved: true },
   *   { runId: 'previous-run-id' }
   * );
   * ```
   */async resumeStream(resumeData,streamOptions){const defaultStreamOptions=await this.getDefaultVNextStreamOptions({runtimeContext:streamOptions?.runtimeContext});let mergedStreamOptions={...defaultStreamOptions,...streamOptions,onFinish:this.#mergeOnFinishWithTelemetry(streamOptions,defaultStreamOptions)};const llm=await this.getLLM({runtimeContext:mergedStreamOptions.runtimeContext});if(llm.getModel().specificationVersion!=="v2"){throw new MastraError({id:"AGENT_STREAM_VNEXT_V1_MODEL_NOT_SUPPORTED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"V1 models are not supported for stream. Please use streamLegacy instead."});}const existingSnapshot=await this.#mastra?.getStorage()?.loadWorkflowSnapshot({workflowName:"agentic-loop",runId:streamOptions?.runId??""});const result=await this.#execute({...mergedStreamOptions,messages:[],resumeContext:{resumeData,snapshot:existingSnapshot},methodType:"stream"});if(result.status!=="success"){if(result.status==="failed"){throw new MastraError({id:"AGENT_STREAM_VNEXT_FAILED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */},// pass original error to preserve stack trace
result.error);}throw new MastraError({id:"AGENT_STREAM_VNEXT_UNKNOWN_ERROR",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"An unknown error occurred while streaming"});}return result.result;}/**
   * Approves a pending tool call and resumes execution.
   * Used when `requireToolApproval` is enabled to allow the agent to proceed with a tool call.
   *
   * @example
   * ```typescript
   * const stream = await agent.approveToolCall({
   *   runId: 'pending-run-id'
   * });
   *
   * for await (const chunk of stream) {
   *   console.log(chunk);
   * }
   * ```
   */async approveToolCall(options){return this.resumeStream({approved:true},options);}/**
   * Declines a pending tool call and resumes execution.
   * Used when `requireToolApproval` is enabled to prevent the agent from executing a tool call.
   *
   * @example
   * ```typescript
   * const stream = await agent.declineToolCall({
   *   runId: 'pending-run-id'
   * });
   *
   * for await (const chunk of stream) {
   *   console.log(chunk);
   * }
   * ```
   */async declineToolCall(options){return this.resumeStream({approved:false},options);}async generateLegacy(messages,generateOptions={}){if("structuredOutput"in generateOptions&&generateOptions.structuredOutput){throw new MastraError({id:"AGENT_GENERATE_LEGACY_STRUCTURED_OUTPUT_NOT_SUPPORTED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"This method does not support structured output. Please use generateVNext instead."});}const defaultGenerateOptions=await this.getDefaultGenerateOptions({runtimeContext:generateOptions.runtimeContext});const mergedGenerateOptions={...defaultGenerateOptions,...generateOptions,experimental_generateMessageId:defaultGenerateOptions.experimental_generateMessageId||this.#mastra?.generateId?.bind(this.#mastra)};const{llm,before,after}=await this.prepareLLMOptions(messages,mergedGenerateOptions,"generate");if(llm.getModel().specificationVersion!=="v1"){this.logger.error("V2 models are not supported for generateLegacy. Please use generate instead.",{modelId:llm.getModel().modelId});throw new MastraError({id:"AGENT_GENERATE_V2_MODEL_NOT_SUPPORTED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{modelId:llm.getModel().modelId},text:"V2 models are not supported for generateLegacy. Please use generate instead."});}let llmToUse=llm;const beforeResult=await before();const traceId=getValidTraceId(beforeResult.agentAISpan);if(beforeResult.tripwire){const tripwireResult={text:"",object:void 0,usage:{totalTokens:0,promptTokens:0,completionTokens:0},finishReason:"other",response:{id:randomUUID(),timestamp:/* @__PURE__ */new Date(),modelId:"tripwire",messages:[]},responseMessages:[],toolCalls:[],toolResults:[],warnings:void 0,request:{body:JSON.stringify({messages:[]})},experimental_output:void 0,steps:void 0,experimental_providerMetadata:void 0,tripwire:true,tripwireReason:beforeResult.tripwireReason,traceId};return tripwireResult;}const{experimental_output,output,agentAISpan,...llmOptions}=beforeResult;const tracingContext={currentSpan:agentAISpan};let finalOutputProcessors=mergedGenerateOptions.outputProcessors;if(!output||experimental_output){const result2=await llmToUse.__text({...llmOptions,tracingContext,experimental_output});const outputProcessorResult2=await this.__runOutputProcessors({runtimeContext:mergedGenerateOptions.runtimeContext||new RuntimeContext(),tracingContext,outputProcessorOverrides:finalOutputProcessors,messageList:new MessageList({threadId:llmOptions.threadId||"",resourceId:llmOptions.resourceId||""}).add({role:"assistant",content:[{type:"text",text:result2.text}]},"response")});if(outputProcessorResult2.tripwireTriggered){const tripwireResult={text:"",object:void 0,usage:{totalTokens:0,promptTokens:0,completionTokens:0},finishReason:"other",response:{id:randomUUID(),timestamp:/* @__PURE__ */new Date(),modelId:"tripwire",messages:[]},responseMessages:[],toolCalls:[],toolResults:[],warnings:void 0,request:{body:JSON.stringify({messages:[]})},experimental_output:void 0,steps:void 0,experimental_providerMetadata:void 0,tripwire:true,tripwireReason:outputProcessorResult2.tripwireReason,traceId};return tripwireResult;}const newText2=outputProcessorResult2.messageList.get.response.v2().map(msg=>msg.content.parts.map(part=>part.type==="text"?part.text:"").join("")).join("");result2.text=newText2;if(finalOutputProcessors&&finalOutputProcessors.length>0){const messages2=outputProcessorResult2.messageList.get.response.v2();this.logger.debug("Checking messages for experimentalOutput metadata:",messages2.map(m=>({role:m.role,hasContentMetadata:!!m.content.metadata,contentMetadata:m.content.metadata})));const messagesWithStructuredData=messages2.filter(msg=>msg.content.metadata&&msg.content.metadata.structuredOutput);this.logger.debug("Messages with structured data:",messagesWithStructuredData.length);if(messagesWithStructuredData[0]&&messagesWithStructuredData[0].content.metadata?.structuredOutput){result2.object=messagesWithStructuredData[0].content.metadata.structuredOutput;this.logger.debug("Using structured data from processor metadata for result.object");}else {try{const processedOutput=JSON.parse(newText2);result2.object=processedOutput;this.logger.debug("Using fallback JSON parsing for result.object");}catch(error){this.logger.warn("Failed to parse processed output as JSON, updating text only",{error});}}}const overrideScorers=mergedGenerateOptions.scorers;const afterResult2=await after({result:result2,outputText:newText2,agentAISpan,...(overrideScorers?{overrideScorers}:{})});if(generateOptions.returnScorerData){result2.scoringData=afterResult2.scoringData;}result2.traceId=traceId;return result2;}const result=await llmToUse.__textObject({...llmOptions,tracingContext,structuredOutput:output});const outputText=JSON.stringify(result.object);const outputProcessorResult=await this.__runOutputProcessors({runtimeContext:mergedGenerateOptions.runtimeContext||new RuntimeContext(),tracingContext,messageList:new MessageList({threadId:llmOptions.threadId||"",resourceId:llmOptions.resourceId||""}).add({role:"assistant",content:[{type:"text",text:outputText}]},"response")});if(outputProcessorResult.tripwireTriggered){const tripwireResult={text:"",object:void 0,usage:{totalTokens:0,promptTokens:0,completionTokens:0},finishReason:"other",response:{id:randomUUID(),timestamp:/* @__PURE__ */new Date(),modelId:"tripwire",messages:[]},responseMessages:[],toolCalls:[],toolResults:[],warnings:void 0,request:{body:JSON.stringify({messages:[]})},experimental_output:void 0,steps:void 0,experimental_providerMetadata:void 0,tripwire:true,tripwireReason:outputProcessorResult.tripwireReason,traceId};return tripwireResult;}const newText=outputProcessorResult.messageList.get.response.v2().map(msg=>msg.content.parts.map(part=>part.type==="text"?part.text:"").join("")).join("");try{const processedObject=JSON.parse(newText);result.object=processedObject;}catch(error){this.logger.warn("Failed to parse processed output as JSON, keeping original result",{error});}const afterResult=await after({result,outputText:newText,...(generateOptions.scorers?{overrideScorers:generateOptions.scorers}:{}),structuredOutput:true,agentAISpan});if(generateOptions.returnScorerData){result.scoringData=afterResult.scoringData;}result.traceId=traceId;return result;}async streamLegacy(messages,streamOptions={}){const defaultStreamOptions=await this.getDefaultStreamOptions({runtimeContext:streamOptions.runtimeContext});const mergedStreamOptions={...defaultStreamOptions,...streamOptions,onFinish:this.#mergeOnFinishWithTelemetry(streamOptions,defaultStreamOptions),experimental_generateMessageId:defaultStreamOptions.experimental_generateMessageId||this.#mastra?.generateId?.bind(this.#mastra)};const{llm,before,after}=await this.prepareLLMOptions(messages,mergedStreamOptions,"stream");if(llm.getModel().specificationVersion!=="v1"){this.logger.error("V2 models are not supported for streamLegacy. Please use stream instead.",{modelId:llm.getModel().modelId});throw new MastraError({id:"AGENT_STREAM_V2_MODEL_NOT_SUPPORTED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{modelId:llm.getModel().modelId},text:"V2 models are not supported for streamLegacy. Please use stream instead."});}const beforeResult=await before();const traceId=getValidTraceId(beforeResult.agentAISpan);if(beforeResult.tripwire){const emptyResult={textStream:async function*(){}(),fullStream:Promise.resolve("").then(()=>{const emptyStream=new globalThis.ReadableStream({start(controller){controller.close();}});return emptyStream;}),text:Promise.resolve(""),usage:Promise.resolve({totalTokens:0,promptTokens:0,completionTokens:0}),finishReason:Promise.resolve("other"),tripwire:true,tripwireReason:beforeResult.tripwireReason,response:{id:randomUUID(),timestamp:/* @__PURE__ */new Date(),modelId:"tripwire",messages:[]},toolCalls:Promise.resolve([]),toolResults:Promise.resolve([]),warnings:Promise.resolve(void 0),request:{body:JSON.stringify({messages:[]})},experimental_output:void 0,steps:void 0,experimental_providerMetadata:void 0,traceId,toAIStream:()=>Promise.resolve("").then(()=>{const emptyStream=new globalThis.ReadableStream({start(controller){controller.close();}});return emptyStream;}),get experimental_partialOutputStream(){return async function*(){}();},pipeDataStreamToResponse:()=>Promise.resolve(),pipeTextStreamToResponse:()=>Promise.resolve(),toDataStreamResponse:()=>new Response("",{status:200,headers:{"Content-Type":"text/plain"}}),toTextStreamResponse:()=>new Response("",{status:200,headers:{"Content-Type":"text/plain"}})};return emptyResult;}const{onFinish,runId,output,experimental_output,agentAISpan,...llmOptions}=beforeResult;const overrideScorers=mergedStreamOptions.scorers;const tracingContext={currentSpan:agentAISpan};if(!output||experimental_output){this.logger.debug(`Starting agent ${this.name} llm stream call`,{runId});const streamResult=llm.__stream({...llmOptions,experimental_output,tracingContext,outputProcessors:await this.getResolvedOutputProcessors(mergedStreamOptions.runtimeContext),onFinish:async result=>{try{const outputText=result.text;await after({result,outputText,agentAISpan,...(overrideScorers?{overrideScorers}:{})});}catch(e){this.logger.error("Error saving memory on finish",{error:e,runId});}await onFinish?.({...result,runId});},runId});streamResult.traceId=traceId;return streamResult;}this.logger.debug(`Starting agent ${this.name} llm streamObject call`,{runId});const streamObjectResult=llm.__streamObject({...llmOptions,tracingContext,onFinish:async result=>{try{const outputText=JSON.stringify(result.object);await after({result,outputText,structuredOutput:true,agentAISpan,...(overrideScorers?{overrideScorers}:{})});}catch(e){this.logger.error("Error saving memory on finish",{error:e,runId});}await onFinish?.({...result,runId});},runId,structuredOutput:output});streamObjectResult.traceId=traceId;return streamObjectResult;}/**
   * Convert text to speech using the configured voice provider
   * @param input Text or text stream to convert to speech
   * @param options Speech options including speaker and provider-specific options
   * @returns Audio stream
   * @deprecated Use agent.voice.speak() instead
   */async speak(input,options){if(!this.voice){const mastraError=new MastraError({id:"AGENT_SPEAK_METHOD_VOICE_NOT_CONFIGURED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:"No voice provider configured"});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}this.logger.warn("Warning: agent.speak() is deprecated. Please use agent.voice.speak() instead.");try{return this.voice.speak(input,options);}catch(e){let err;if(e instanceof MastraError){err=e;}else {err=new MastraError({id:"AGENT_SPEAK_METHOD_ERROR",domain:"AGENT"/* AGENT */,category:"UNKNOWN"/* UNKNOWN */,details:{agentName:this.name},text:"Error during agent speak"},e);}this.logger.trackException(err);this.logger.error(err.toString());throw err;}}/**
   * Convert speech to text using the configured voice provider
   * @param audioStream Audio stream to transcribe
   * @param options Provider-specific transcription options
   * @returns Text or text stream
   * @deprecated Use agent.voice.listen() instead
   */async listen(audioStream,options){if(!this.voice){const mastraError=new MastraError({id:"AGENT_LISTEN_METHOD_VOICE_NOT_CONFIGURED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:"No voice provider configured"});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}this.logger.warn("Warning: agent.listen() is deprecated. Please use agent.voice.listen() instead");try{return this.voice.listen(audioStream,options);}catch(e){let err;if(e instanceof MastraError){err=e;}else {err=new MastraError({id:"AGENT_LISTEN_METHOD_ERROR",domain:"AGENT"/* AGENT */,category:"UNKNOWN"/* UNKNOWN */,details:{agentName:this.name},text:"Error during agent listen"},e);}this.logger.trackException(err);this.logger.error(err.toString());throw err;}}/**
   * Get a list of available speakers from the configured voice provider
   * @throws {Error} If no voice provider is configured
   * @returns {Promise<Array<{voiceId: string}>>} List of available speakers
   * @deprecated Use agent.voice.getSpeakers() instead
   */async getSpeakers(){if(!this.voice){const mastraError=new MastraError({id:"AGENT_SPEAKERS_METHOD_VOICE_NOT_CONFIGURED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,details:{agentName:this.name},text:"No voice provider configured"});this.logger.trackException(mastraError);this.logger.error(mastraError.toString());throw mastraError;}this.logger.warn("Warning: agent.getSpeakers() is deprecated. Please use agent.voice.getSpeakers() instead.");try{return await this.voice.getSpeakers();}catch(e){let err;if(e instanceof MastraError){err=e;}else {err=new MastraError({id:"AGENT_GET_SPEAKERS_METHOD_ERROR",domain:"AGENT"/* AGENT */,category:"UNKNOWN"/* UNKNOWN */,details:{agentName:this.name},text:"Error during agent getSpeakers"},e);}this.logger.trackException(err);this.logger.error(err.toString());throw err;}}/**
   * Converts the agent to a workflow step for use in legacy workflows.
   * The step accepts a prompt and returns text output.
   *
   * @deprecated Use agent directly in workflows instead
   *
   * @example
   * ```typescript
   * const agentStep = agent.toStep();
   * const workflow = new Workflow({
   *   steps: {
   *     analyze: agentStep
   *   }
   * });
   * ```
   */toStep(){const x=agentToStep(this);return new LegacyStep(x);}/**
   * Resolves the configuration for title generation.
   * @internal
   */resolveTitleGenerationConfig(generateTitleConfig){if(typeof generateTitleConfig==="boolean"){return {shouldGenerate:generateTitleConfig};}if(typeof generateTitleConfig==="object"&&generateTitleConfig!==null){return {shouldGenerate:true,model:generateTitleConfig.model,instructions:generateTitleConfig.instructions};}return {shouldGenerate:false};}/**
   * Resolves title generation instructions, handling both static strings and dynamic functions
   * @internal
   */async resolveTitleInstructions(runtimeContext,instructions){const DEFAULT_TITLE_INSTRUCTIONS=`
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons
      - the entire text you return will be used as the title`;if(!instructions){return DEFAULT_TITLE_INSTRUCTIONS;}if(typeof instructions==="string"){return instructions;}else {const result=instructions({runtimeContext,mastra:this.#mastra});return resolveMaybePromise(result,resolvedInstructions=>{return resolvedInstructions||DEFAULT_TITLE_INSTRUCTIONS;});}}};Agent=/*@__PURE__*/(_=>{_init=__decoratorStart(_a);Agent=__decorateElement(_init,0,"Agent",_Agent_decorators,Agent);__runInitializers(_init,1,Agent);// src/agent/utils.ts
return Agent;})();// src/agent/utils.ts
async function tryGenerateWithJsonFallback(agent,prompt,options){if(!options.structuredOutput?.schema){throw new MastraError({id:"STRUCTURED_OUTPUT_OPTIONS_REQUIRED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"structuredOutput is required to use tryGenerateWithJsonFallback"});}try{return await agent.generate(prompt,options);}catch(error){console.warn("Error in tryGenerateWithJsonFallback. Attempting fallback.",error);return await agent.generate(prompt,{...options,structuredOutput:{...options.structuredOutput,jsonPromptInjection:true}});}}async function tryStreamWithJsonFallback(agent,prompt,options){if(!options.structuredOutput?.schema){throw new MastraError({id:"STRUCTURED_OUTPUT_OPTIONS_REQUIRED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"structuredOutput is required to use tryStreamWithJsonFallback"});}try{const result=await agent.stream(prompt,options);const object=await result.object;if(!object){throw new MastraError({id:"STRUCTURED_OUTPUT_OBJECT_UNDEFINED",domain:"AGENT"/* AGENT */,category:"USER"/* USER */,text:"structuredOutput object is undefined"});}return result;}catch(error){console.warn("Error in tryStreamWithJsonFallback. Attempting fallback.",error);return await agent.stream(prompt,{...options,structuredOutput:{...options.structuredOutput,jsonPromptInjection:true}});}}// src/stream/aisdk/v5/output.ts
var AISDKV5OutputStream=class{#modelOutput;#options;#messageList;/**
   * Trace ID used on the execution (if the execution was traced).
   */traceId;constructor({modelOutput,options,messageList}){this.#modelOutput=modelOutput;this.#options=options;this.#messageList=messageList;this.traceId=getValidTraceId(options.tracingContext?.currentSpan);}toTextStreamResponse(init){return createTextStreamResponse({// Type assertion needed due to ReadableStream type mismatch between Node.js (stream/web) and DOM types
// Both have the same interface but TypeScript treats them as incompatible
textStream:this.#modelOutput.textStream,...init});}toUIMessageStreamResponse({generateMessageId,originalMessages,sendFinish,sendReasoning,sendSources,onError,sendStart,messageMetadata,onFinish,...init}={}){return createUIMessageStreamResponse({stream:this.toUIMessageStream({generateMessageId,originalMessages,sendFinish,sendReasoning,sendSources,onError,sendStart,messageMetadata,onFinish}),...init});}toUIMessageStream({generateMessageId,originalMessages,sendFinish=true,sendReasoning=true,sendSources=false,onError=getErrorMessage,sendStart=true,messageMetadata,onFinish}={}){let responseMessageId=generateMessageId!=null?getResponseUIMessageId({originalMessages,responseMessageId:generateMessageId}):void 0;return createUIMessageStream({onError,onFinish,generateId:()=>responseMessageId??generateMessageId?.()??generateId(),execute:async({writer})=>{for await(const part of this.fullStream){const messageMetadataValue=messageMetadata?.({part});const partType=part.type;responseMessageId=this.#modelOutput.messageId;const transformedChunk=convertFullStreamChunkToUIMessageStream({part,sendReasoning,messageMetadataValue,sendSources,sendStart,sendFinish,responseMessageId,onError});if(transformedChunk){writer.write(transformedChunk);}if(messageMetadataValue!=null&&partType!=="start"&&partType!=="finish"){writer.write({type:"message-metadata",messageMetadata:messageMetadataValue});}}}});}async consumeStream(options){await this.#modelOutput.consumeStream(options);}get sources(){return this.#modelOutput.sources.then(sources=>sources.map(source=>{return convertMastraChunkToAISDKv5({chunk:source});}));}get files(){return this.#modelOutput.files.then(files=>files.map(file=>{if(file.type==="file"){const result=convertMastraChunkToAISDKv5({chunk:file});return result&&"file"in result?result.file:void 0;}return;}).filter(Boolean));}get text(){return this.#modelOutput.text;}/**
   * Stream of valid JSON chunks. The final JSON result is validated against the output schema when the stream ends.
   */get objectStream(){return this.#modelOutput.objectStream;}get toolCalls(){return this.#modelOutput.toolCalls.then(toolCalls=>toolCalls.map(toolCall=>{return convertMastraChunkToAISDKv5({chunk:toolCall});}));}get toolResults(){return this.#modelOutput.toolResults.then(toolResults=>toolResults.map(toolResult=>{return convertMastraChunkToAISDKv5({chunk:toolResult});}));}get reasoningText(){return this.#modelOutput.reasoningText;}get reasoning(){return this.#modelOutput.reasoning.then(reasoningChunk=>{return reasoningChunk.map(reasoningPart=>{return {providerMetadata:reasoningPart.payload.providerMetadata,text:reasoningPart.payload.text,type:"reasoning"};});});}get warnings(){return this.#modelOutput.warnings;}get usage(){return this.#modelOutput.usage;}get finishReason(){return this.#modelOutput.finishReason;}get providerMetadata(){return this.#modelOutput.providerMetadata;}get request(){return this.#modelOutput.request;}get totalUsage(){return this.#modelOutput.totalUsage;}get response(){return this.#modelOutput.response.then(response=>({...response}));}get steps(){return this.#modelOutput.steps.then(steps=>steps);}get content(){return this.#messageList.get.response.aiV5.modelContent();}/**
   * Stream of only text content, compatible with streaming text responses.
   */get textStream(){return this.#modelOutput.textStream;}/**
   * Stream of individual array elements when output schema is an array type.
   */get elementStream(){return this.#modelOutput.elementStream;}/**
   * Stream of all chunks in AI SDK v5 format.
   */get fullStream(){let startEvent;let hasStarted=false;return this.#modelOutput.fullStream.pipeThrough(new TransformStream({transform(chunk,controller){if(chunk.type==="object"){controller.enqueue(chunk);return;}if(chunk.type==="step-start"&&!startEvent){startEvent=convertMastraChunkToAISDKv5({chunk});return;}else if(chunk.type!=="error"){hasStarted=true;}if(startEvent&&hasStarted){controller.enqueue(startEvent);startEvent=void 0;}if("payload"in chunk){const transformedChunk=convertMastraChunkToAISDKv5({chunk});if(transformedChunk){controller.enqueue(transformedChunk);}}}}));}async getFullOutput(){await this.consumeStream({onError:error=>{console.error(error);throw error;}});const object=await this.object;const fullOutput={text:await this.#modelOutput.text,usage:await this.#modelOutput.usage,steps:await this.steps,finishReason:await this.#modelOutput.finishReason,warnings:await this.#modelOutput.warnings,providerMetadata:await this.#modelOutput.providerMetadata,request:await this.#modelOutput.request,reasoning:await this.reasoning,reasoningText:await this.reasoningText,toolCalls:await this.toolCalls,toolResults:await this.toolResults,sources:await this.sources,files:await this.files,response:await this.response,content:this.content,totalUsage:await this.#modelOutput.totalUsage,error:this.error,tripwire:this.#modelOutput.tripwire,tripwireReason:this.#modelOutput.tripwireReason,traceId:this.traceId,...(object?{object}:{})};fullOutput.response.messages=this.#modelOutput.messageList.get.response.aiV5.model();return fullOutput;}get tripwire(){return this.#modelOutput.tripwire;}get tripwireReason(){return this.#modelOutput.tripwireReason;}get error(){return this.#modelOutput.error;}get object(){return this.#modelOutput.object;}};// src/stream/base/output-format-handlers.ts
var BaseFormatHandler=class{/**
   * The original user-provided schema (Zod, JSON Schema, or AI SDK Schema).
   */schema;/**
   * Validate partial chunks as they are streamed. @planned
   */validatePartialChunks=false;partialSchema;constructor(schema,options={}){this.schema=schema;if(options.validatePartialChunks&&this.isZodSchema(schema)&&"partial"in schema&&typeof schema.partial==="function"){this.partialSchema=schema.partial();this.validatePartialChunks=true;}}/**
   * Checks if the original schema is a Zod schema with safeParse method.
   */isZodSchema(schema){return schema!==void 0&&schema!==null&&typeof schema==="object"&&"safeParse"in schema&&typeof schema.safeParse==="function";}/**
   * Validates a value against the schema, preferring Zod's safeParse.
   */async validateValue(value){if(!this.schema){return {success:true,value};}if(this.isZodSchema(this.schema)){try{const result=this.schema.safeParse(value);if(result.success){return {success:true,value:result.data};}else {return {success:false,error:new MastraError({domain:"AGENT"/* AGENT */,category:"SYSTEM"/* SYSTEM */,id:"STRUCTURED_OUTPUT_SCHEMA_VALIDATION_FAILED",text:`Structured output validation failed
${z$1.prettifyError(result.error)}
`,details:{value:typeof value==="object"?JSON.stringify(value):String(value)}},result.error)};}}catch(error){return {success:false,error:error instanceof Error?error:new Error("Zod validation failed",{cause:error})};}}try{if(typeof this.schema==="object"&&!this.schema.jsonSchema){const result=await safeValidateTypes({value,schema:jsonSchema$1(this.schema)});return result;}else if(this.schema.jsonSchema){const result=await safeValidateTypes({value,schema:this.schema});return result;}else {return {success:true,value};}}catch(error){return {success:false,error:error instanceof Error?error:new Error("Validation failed",{cause:error})};}}/**
   * Preprocesses accumulated text to handle LLMs that wrap JSON in code blocks.
   * Extracts content from the first complete valid ```json...``` code block or removes opening ```json prefix if no complete code block is found (streaming chunks).
   * @param accumulatedText - Raw accumulated text from streaming
   * @returns Processed text ready for JSON parsing
   */preprocessText(accumulatedText){let processedText=accumulatedText;if(processedText.includes("<|message|>")){const match=processedText.match(/<\|message\|>([\s\S]+)$/);if(match&&match[1]){processedText=match[1];}}if(processedText.includes("```json")){const match=processedText.match(/```json\s*\n?([\s\S]*?)\n?\s*```/);if(match&&match[1]){processedText=match[1].trim();}else {processedText=processedText.replace(/^```json\s*\n?/,"");}}return processedText;}};var ObjectFormatHandler=class extends BaseFormatHandler{type="object";async processPartialChunk({accumulatedText,previousObject}){const processedAccumulatedText=this.preprocessText(accumulatedText);const{value:currentObjectJson,state}=await parsePartialJson(processedAccumulatedText);if(this.validatePartialChunks&&this.partialSchema){const result=this.partialSchema?.safeParse(currentObjectJson);if(result.success&&result.data&&result.data!==void 0&&!isDeepEqualData(previousObject,result.data)){return {shouldEmit:true,emitValue:result.data,newPreviousResult:result.data};}return {shouldEmit:false};}if(currentObjectJson!==void 0&&currentObjectJson!==null&&typeof currentObjectJson==="object"&&!isDeepEqualData(previousObject,currentObjectJson)){return {shouldEmit:["successful-parse","repaired-parse"].includes(state),emitValue:currentObjectJson,newPreviousResult:currentObjectJson};}return {shouldEmit:false};}async validateAndTransformFinal(finalRawValue){if(!finalRawValue){return {success:false,error:new Error("No object generated: could not parse the response.")};}const rawValue=this.preprocessText(finalRawValue);const{value}=await parsePartialJson(rawValue);return this.validateValue(value);}};var ArrayFormatHandler=class extends BaseFormatHandler{type="array";/** Previously filtered array to track changes */textPreviousFilteredArray=[];/** Whether we've emitted the initial empty array */hasEmittedInitialArray=false;async processPartialChunk({accumulatedText,previousObject}){const processedAccumulatedText=this.preprocessText(accumulatedText);const{value:currentObjectJson,state:parseState}=await parsePartialJson(processedAccumulatedText);if(currentObjectJson!==void 0&&!isDeepEqualData(previousObject,currentObjectJson)){const rawElements=currentObjectJson?.elements||[];const filteredElements=[];for(let i=0;i<rawElements.length;i++){const element=rawElements[i];if(i===rawElements.length-1&&parseState!=="successful-parse"){if(element&&typeof element==="object"&&Object.keys(element).length>0){filteredElements.push(element);}}else {if(element&&typeof element==="object"&&Object.keys(element).length>0){filteredElements.push(element);}}}if(!this.hasEmittedInitialArray){this.hasEmittedInitialArray=true;if(filteredElements.length===0){this.textPreviousFilteredArray=[];return {shouldEmit:true,emitValue:[],newPreviousResult:currentObjectJson};}}if(!isDeepEqualData(this.textPreviousFilteredArray,filteredElements)){this.textPreviousFilteredArray=[...filteredElements];return {shouldEmit:true,emitValue:filteredElements,newPreviousResult:currentObjectJson};}}return {shouldEmit:false};}async validateAndTransformFinal(_finalValue){const resultValue=this.textPreviousFilteredArray;if(!resultValue){return {success:false,error:new Error("No object generated: could not parse the response.")};}return this.validateValue(resultValue);}};var EnumFormatHandler=class extends BaseFormatHandler{type="enum";/** Previously emitted enum result to avoid duplicate emissions */textPreviousEnumResult;/**
   * Finds the best matching enum value for a partial result string.
   * If multiple values match, returns the partial string. If only one matches, returns that value.
   * @param partialResult - Partial enum string from streaming
   * @returns Best matching enum value or undefined if no matches
   */findBestEnumMatch(partialResult){if(!this.schema){return void 0;}let enumValues;if(this.isZodSchema(this.schema)){const wrappedSchema=asSchema(this.schema);enumValues=wrappedSchema.jsonSchema?.enum;}else if(typeof this.schema==="object"&&!this.schema.jsonSchema){const wrappedSchema=jsonSchema$1(this.schema);enumValues=wrappedSchema.jsonSchema?.enum;}else {enumValues=this.schema.jsonSchema?.enum;}if(!enumValues){return void 0;}const possibleEnumValues=enumValues.filter(value=>typeof value==="string").filter(enumValue=>enumValue.startsWith(partialResult));if(possibleEnumValues.length===0){return void 0;}const firstMatch=possibleEnumValues[0];return possibleEnumValues.length===1&&firstMatch!==void 0?firstMatch:partialResult;}async processPartialChunk({accumulatedText,previousObject}){const processedAccumulatedText=this.preprocessText(accumulatedText);const{value:currentObjectJson}=await parsePartialJson(processedAccumulatedText);if(currentObjectJson!==void 0&&currentObjectJson!==null&&typeof currentObjectJson==="object"&&!Array.isArray(currentObjectJson)&&"result"in currentObjectJson&&typeof currentObjectJson.result==="string"&&!isDeepEqualData(previousObject,currentObjectJson)){const partialResult=currentObjectJson.result;const bestMatch=this.findBestEnumMatch(partialResult);if(partialResult.length>0&&bestMatch&&bestMatch!==this.textPreviousEnumResult){this.textPreviousEnumResult=bestMatch;return {shouldEmit:true,emitValue:bestMatch,newPreviousResult:currentObjectJson};}}return {shouldEmit:false};}async validateAndTransformFinal(rawFinalValue){const processedValue=this.preprocessText(rawFinalValue);const{value}=await parsePartialJson(processedValue);if(!(typeof value==="object"&&value!==null&&"result"in value)){return {success:false,error:new Error("Invalid enum format: expected object with result property")};}const finalValue=value;if(!finalValue||typeof finalValue!=="object"||typeof finalValue.result!=="string"){return {success:false,error:new Error("Invalid enum format: expected object with result property")};}return this.validateValue(finalValue.result);}};function createOutputHandler({schema}){const transformedSchema=getTransformedSchema(schema);switch(transformedSchema?.outputFormat){case "array":return new ArrayFormatHandler(schema);case "enum":return new EnumFormatHandler(schema);case "object":default:return new ObjectFormatHandler(schema);}}function createObjectStreamTransformer({structuredOutput,logger}){const handler=createOutputHandler({schema:structuredOutput?.schema});let accumulatedText="";let previousObject=void 0;let currentRunId;let finalResult;return new TransformStream({async transform(chunk,controller){if(chunk.runId){currentRunId=chunk.runId;}if(chunk.type==="text-delta"&&typeof chunk.payload?.text==="string"){accumulatedText+=chunk.payload.text;const result=await handler.processPartialChunk({accumulatedText,previousObject});if(result.shouldEmit){previousObject=result.newPreviousResult??previousObject;const chunkData={from:chunk.from,runId:chunk.runId,type:"object",object:result.emitValue// TODO: handle partial runtime type validation of json chunks
};controller.enqueue(chunkData);}}if(chunk.type==="text-end"){controller.enqueue(chunk);if(accumulatedText?.trim()&&!finalResult){finalResult=await handler.validateAndTransformFinal(accumulatedText);if(finalResult.success){controller.enqueue({from:"AGENT"/* AGENT */,runId:currentRunId??"",type:"object-result",object:finalResult.value});}}return;}controller.enqueue(chunk);},async flush(controller){if(finalResult&&!finalResult.success){handleValidationError(finalResult.error,controller);}if(accumulatedText?.trim()&&!finalResult){finalResult=await handler.validateAndTransformFinal(accumulatedText);if(finalResult.success){controller.enqueue({from:"AGENT"/* AGENT */,runId:currentRunId??"",type:"object-result",object:finalResult.value});}else {handleValidationError(finalResult.error,controller);}}}});function handleValidationError(error,controller){if(structuredOutput?.errorStrategy==="warn"){logger?.warn(error.message);}else if(structuredOutput?.errorStrategy==="fallback"){controller.enqueue({from:"AGENT"/* AGENT */,runId:currentRunId??"",type:"object-result",object:structuredOutput?.fallbackValue});}else {controller.enqueue({from:"AGENT"/* AGENT */,runId:currentRunId??"",type:"error",payload:{error}});}}}function createJsonTextStreamTransformer(schema){let previousArrayLength=0;let hasStartedArray=false;let chunkCount=0;const outputSchema=getTransformedSchema(schema);return new TransformStream({transform(chunk,controller){if(chunk.type!=="object"||!chunk.object){return;}if(outputSchema?.outputFormat==="array"){chunkCount++;if(chunkCount===1){if(chunk.object.length>0){controller.enqueue(JSON.stringify(chunk.object));previousArrayLength=chunk.object.length;hasStartedArray=true;return;}}if(!hasStartedArray){controller.enqueue("[");hasStartedArray=true;}for(let i=previousArrayLength;i<chunk.object.length;i++){const elementJson=JSON.stringify(chunk.object[i]);if(i>0){controller.enqueue(","+elementJson);}else {controller.enqueue(elementJson);}}previousArrayLength=chunk.object.length;}else {controller.enqueue(JSON.stringify(chunk.object));}},flush(controller){if(hasStartedArray&&outputSchema?.outputFormat==="array"&&chunkCount>1){controller.enqueue("]");}}});}// src/stream/base/output.ts
function createDestructurableOutput(output){return new Proxy(output,{get(target,prop,_receiver){const originalValue=Reflect.get(target,prop,target);if(typeof originalValue==="function"){return originalValue.bind(target);}return originalValue;}});}var MastraModelOutput=class extends MastraBase{#status="running";#aisdkv5;#error;#baseStream;#bufferedChunks=[];#streamFinished=false;#emitter=new EventEmitter();#bufferedSteps=[];#bufferedReasoningDetails={};#bufferedByStep={text:"",reasoning:[],sources:[],files:[],toolCalls:[],toolResults:[],dynamicToolCalls:[],dynamicToolResults:[],staticToolCalls:[],staticToolResults:[],content:[],usage:{inputTokens:void 0,outputTokens:void 0,totalTokens:void 0},warnings:[],request:{},response:{id:"",timestamp:/* @__PURE__ */new Date(),modelId:"",messages:[],uiMessages:[]},reasoningText:"",providerMetadata:void 0,finishReason:void 0};#bufferedText=[];#bufferedObject;#bufferedTextChunks={};#bufferedSources=[];#bufferedReasoning=[];#bufferedFiles=[];#toolCallArgsDeltas={};#toolCallDeltaIdNameMap={};#toolCalls=[];#toolResults=[];#warnings=[];#finishReason=void 0;#request={};#usageCount={inputTokens:void 0,outputTokens:void 0,totalTokens:void 0};#tripwire=false;#tripwireReason="";#delayedPromises={suspendPayload:new DelayedPromise(),object:new DelayedPromise(),finishReason:new DelayedPromise(),usage:new DelayedPromise(),warnings:new DelayedPromise(),providerMetadata:new DelayedPromise(),response:new DelayedPromise(),request:new DelayedPromise(),text:new DelayedPromise(),reasoning:new DelayedPromise(),reasoningText:new DelayedPromise(),sources:new DelayedPromise(),files:new DelayedPromise(),toolCalls:new DelayedPromise(),toolResults:new DelayedPromise(),steps:new DelayedPromise(),totalUsage:new DelayedPromise(),content:new DelayedPromise()};#consumptionStarted=false;#returnScorerData=false;#structuredOutputMode=void 0;#model;/**
   * Unique identifier for this execution run.
   */runId;#options;/**
   * The processor runner for this stream.
   */processorRunner;/**
   * The message list for this stream.
   */messageList;/**
   * Trace ID used on the execution (if the execution was traced).
   */traceId;messageId;constructor({model:_model,stream,messageList,options,messageId,initialState}){super({component:"LLM",name:"MastraModelOutput"});this.#options=options;this.#returnScorerData=!!options.returnScorerData;this.runId=options.runId;this.traceId=getValidTraceId(options.tracingContext?.currentSpan);this.#model=_model;this.messageId=messageId;if(options.structuredOutput?.schema){this.#structuredOutputMode=options.structuredOutput.model?"processor":"direct";}if(options.outputProcessors?.length){this.processorRunner=new ProcessorRunner({inputProcessors:[],outputProcessors:options.outputProcessors,logger:this.logger,agentName:"MastraModelOutput"});}this.messageList=messageList;const self=this;let processedStream=stream;const processorRunner=this.processorRunner;if(processorRunner&&options.isLLMExecutionStep){const processorStates=options.processorStates||/* @__PURE__ */new Map();processedStream=stream.pipeThrough(new TransformStream({async transform(chunk,controller){if(chunk.type==="finish"&&chunk.payload?.stepResult?.reason==="tool-calls"){controller.enqueue(chunk);return;}else {if(!processorStates.has(STRUCTURED_OUTPUT_PROCESSOR_NAME)){const processorIndex=processorRunner.outputProcessors.findIndex(p=>p.name===STRUCTURED_OUTPUT_PROCESSOR_NAME);if(processorIndex!==-1){const structuredOutputProcessorState=new ProcessorState({processorName:STRUCTURED_OUTPUT_PROCESSOR_NAME,tracingContext:options.tracingContext,processorIndex});structuredOutputProcessorState.customState={controller};processorStates.set(STRUCTURED_OUTPUT_PROCESSOR_NAME,structuredOutputProcessorState);}}else {const structuredOutputProcessorState=processorStates.get(STRUCTURED_OUTPUT_PROCESSOR_NAME);if(structuredOutputProcessorState){structuredOutputProcessorState.customState.controller=controller;}}const{part:processed,blocked,reason}=await processorRunner.processPart(chunk,processorStates,options.tracingContext);if(blocked){controller.enqueue({type:"tripwire",payload:{tripwireReason:reason||"Output processor blocked content"}});return;}if(processed){controller.enqueue(processed);}}}}));}if(self.#structuredOutputMode==="direct"&&self.#options.isLLMExecutionStep){processedStream=processedStream.pipeThrough(createObjectStreamTransformer({structuredOutput:self.#options.structuredOutput,logger:self.logger}));}this.#baseStream=processedStream.pipeThrough(new TransformStream({transform:async(chunk,controller)=>{switch(chunk.type){case "tool-call-suspended":case "tool-call-approval":self.#status="suspended";self.#delayedPromises.suspendPayload.resolve(chunk.payload);break;case "raw":if(!self.#options.includeRawChunks){return;}break;case "object-result":self.#bufferedObject=chunk.object;if(self.#delayedPromises.object.status.type==="pending"){self.#delayedPromises.object.resolve(chunk.object);}break;case "source":self.#bufferedSources.push(chunk);self.#bufferedByStep.sources.push(chunk);break;case "text-delta":self.#bufferedText.push(chunk.payload.text);self.#bufferedByStep.text+=chunk.payload.text;if(chunk.payload.id){const ary=self.#bufferedTextChunks[chunk.payload.id]??[];ary.push(chunk.payload.text);self.#bufferedTextChunks[chunk.payload.id]=ary;}break;case "tool-call-input-streaming-start":self.#toolCallDeltaIdNameMap[chunk.payload.toolCallId]=chunk.payload.toolName;break;case "tool-call-delta":if(!self.#toolCallArgsDeltas[chunk.payload.toolCallId]){self.#toolCallArgsDeltas[chunk.payload.toolCallId]=[];}self.#toolCallArgsDeltas?.[chunk.payload.toolCallId]?.push(chunk.payload.argsTextDelta);chunk.payload.toolName||=self.#toolCallDeltaIdNameMap[chunk.payload.toolCallId];break;case "file":self.#bufferedFiles.push(chunk);self.#bufferedByStep.files.push(chunk);break;case "reasoning-start":self.#bufferedReasoningDetails[chunk.payload.id]={type:"reasoning",runId:chunk.runId,from:chunk.from,payload:{id:chunk.payload.id,providerMetadata:chunk.payload.providerMetadata,text:""}};break;case "reasoning-delta":{self.#bufferedReasoning.push({type:"reasoning",runId:chunk.runId,from:chunk.from,payload:chunk.payload});self.#bufferedByStep.reasoning.push({type:"reasoning",runId:chunk.runId,from:chunk.from,payload:chunk.payload});const bufferedReasoning=self.#bufferedReasoningDetails[chunk.payload.id];if(bufferedReasoning){bufferedReasoning.payload.text+=chunk.payload.text;if(chunk.payload.providerMetadata){bufferedReasoning.payload.providerMetadata=chunk.payload.providerMetadata;}}break;}case "reasoning-end":{const bufferedReasoning=self.#bufferedReasoningDetails[chunk.payload.id];if(chunk.payload.providerMetadata&&bufferedReasoning){bufferedReasoning.payload.providerMetadata=chunk.payload.providerMetadata;}break;}case "tool-call":self.#toolCalls.push(chunk);self.#bufferedByStep.toolCalls.push(chunk);const toolCallPayload=chunk.payload;if(toolCallPayload?.output?.from==="AGENT"&&toolCallPayload?.output?.type==="finish"){const finishPayload=toolCallPayload.output.payload;if(finishPayload?.usage){self.updateUsageCount(finishPayload.usage);}}break;case "tool-result":self.#toolResults.push(chunk);self.#bufferedByStep.toolResults.push(chunk);break;case "step-finish":{self.updateUsageCount(chunk.payload.output.usage);self.#warnings=chunk.payload.stepResult.warnings||[];if(chunk.payload.metadata.request){self.#request=chunk.payload.metadata.request;}const{providerMetadata,request,...otherMetadata}=chunk.payload.metadata;const stepResult={stepType:self.#bufferedSteps.length===0?"initial":"tool-result",sources:self.#bufferedByStep.sources,files:self.#bufferedByStep.files,toolCalls:self.#bufferedByStep.toolCalls,toolResults:self.#bufferedByStep.toolResults,content:messageList.get.response.aiV5.modelContent(-1),text:self.#bufferedByStep.text,reasoningText:self.#bufferedReasoning.map(reasoningPart=>reasoningPart.payload.text).join(""),reasoning:Object.values(self.#bufferedReasoningDetails),get staticToolCalls(){return self.#bufferedByStep.toolCalls.filter(part=>part.type==="tool-call"&&part.payload?.dynamic===false);},get dynamicToolCalls(){return self.#bufferedByStep.toolCalls.filter(part=>part.type==="tool-call"&&part.payload?.dynamic===true);},get staticToolResults(){return self.#bufferedByStep.toolResults.filter(part=>part.type==="tool-result"&&part.payload?.dynamic===false);},get dynamicToolResults(){return self.#bufferedByStep.toolResults.filter(part=>part.type==="tool-result"&&part.payload?.dynamic===true);},finishReason:chunk.payload.stepResult.reason,usage:chunk.payload.output.usage,warnings:self.#warnings,request:request||{},response:{id:chunk.payload.id||"",timestamp:chunk.payload.metadata?.timestamp||/* @__PURE__ */new Date(),modelId:chunk.payload.metadata?.modelId||chunk.payload.metadata?.model||"",...otherMetadata,messages:chunk.payload.messages?.nonUser||[],// We have to cast this until messageList can take generics also and type metadata, it was too
// complicated to do this in this PR, it will require a much bigger change.
uiMessages:messageList.get.response.aiV5.ui()},providerMetadata};await options?.onStepFinish?.({...(self.#model.modelId&&self.#model.provider&&self.#model.version?{model:self.#model}:{}),...stepResult});self.#bufferedSteps.push(stepResult);self.#bufferedByStep={text:"",reasoning:[],sources:[],files:[],toolCalls:[],toolResults:[],dynamicToolCalls:[],dynamicToolResults:[],staticToolCalls:[],staticToolResults:[],content:[],usage:{inputTokens:void 0,outputTokens:void 0,totalTokens:void 0},warnings:[],request:{},response:{id:"",timestamp:/* @__PURE__ */new Date(),modelId:"",messages:[],uiMessages:[]},reasoningText:"",providerMetadata:void 0,finishReason:void 0};break;}case "tripwire":self.#tripwire=true;self.#tripwireReason=chunk.payload?.tripwireReason||"Content blocked";self.#finishReason="other";self.#streamFinished=true;self.#delayedPromises.text.resolve(self.#bufferedText.join(""));self.#delayedPromises.finishReason.resolve("other");self.#delayedPromises.object.resolve(void 0);self.#delayedPromises.usage.resolve(self.#usageCount);self.#delayedPromises.warnings.resolve(self.#warnings);self.#delayedPromises.providerMetadata.resolve(void 0);self.#delayedPromises.response.resolve({});self.#delayedPromises.request.resolve({});self.#delayedPromises.reasoning.resolve([]);self.#delayedPromises.reasoningText.resolve(void 0);self.#delayedPromises.sources.resolve([]);self.#delayedPromises.files.resolve([]);self.#delayedPromises.toolCalls.resolve([]);self.#delayedPromises.toolResults.resolve([]);self.#delayedPromises.steps.resolve(self.#bufferedSteps);self.#delayedPromises.totalUsage.resolve(self.#usageCount);self.#delayedPromises.content.resolve([]);self.#emitChunk(chunk);controller.enqueue(chunk);self.#emitter.emit("finish");controller.terminate();return;case "finish":self.#status="success";if(chunk.payload.stepResult.reason){self.#finishReason=chunk.payload.stepResult.reason;}if(self.#bufferedObject!==void 0){const responseMessages=messageList.get.response.v2();const lastAssistantMessage=[...responseMessages].reverse().find(m=>m.role==="assistant");if(lastAssistantMessage){if(!lastAssistantMessage.content.metadata){lastAssistantMessage.content.metadata={};}lastAssistantMessage.content.metadata.structuredOutput=self.#bufferedObject;}}let response={};if(chunk.payload.metadata){const{providerMetadata,request,...otherMetadata}=chunk.payload.metadata;response={...otherMetadata,messages:messageList.get.response.aiV5.model(),uiMessages:messageList.get.response.aiV5.ui()};}this.populateUsageCount(chunk.payload.output.usage);chunk.payload.output.usage={inputTokens:self.#usageCount.inputTokens??0,outputTokens:self.#usageCount.outputTokens??0,totalTokens:self.#usageCount.totalTokens??0,...(self.#usageCount.reasoningTokens!==void 0&&{reasoningTokens:self.#usageCount.reasoningTokens}),...(self.#usageCount.cachedInputTokens!==void 0&&{cachedInputTokens:self.#usageCount.cachedInputTokens})};try{if(self.processorRunner&&!self.#options.isLLMExecutionStep){self.messageList=await self.processorRunner.runOutputProcessors(self.messageList,options.tracingContext);const outputText=self.messageList.get.response.aiV4.core().map(m=>MessageList.coreContentToString(m.content)).join("\n");self.#delayedPromises.text.resolve(outputText);self.#delayedPromises.finishReason.resolve(self.#finishReason);if(chunk.payload.metadata){const{providerMetadata,request,...otherMetadata}=chunk.payload.metadata;response={...otherMetadata,messages:messageList.get.response.aiV5.model(),uiMessages:messageList.get.response.aiV5.ui()};}}else {const textContent=self.#bufferedText.join("");self.#delayedPromises.text.resolve(textContent);self.#delayedPromises.finishReason.resolve(self.#finishReason);}}catch(error2){if(error2 instanceof TripWire){self.#tripwire=true;self.#tripwireReason=error2.message;self.#delayedPromises.finishReason.resolve("other");self.#delayedPromises.text.resolve("");}else {self.#error=getErrorFromUnknown(error2,{fallbackMessage:"Unknown error in stream"});self.#delayedPromises.finishReason.resolve("error");self.#delayedPromises.text.resolve("");}if(self.#delayedPromises.object.status.type!=="resolved"){self.#delayedPromises.object.resolve(void 0);}}self.#delayedPromises.usage.resolve(self.#usageCount);self.#delayedPromises.warnings.resolve(self.#warnings);self.#delayedPromises.providerMetadata.resolve(chunk.payload.metadata?.providerMetadata);self.#delayedPromises.response.resolve(response);self.#delayedPromises.request.resolve(self.#request||{});self.#delayedPromises.text.resolve(self.#bufferedText.join(""));const reasoningText=self.#bufferedReasoning.length>0?self.#bufferedReasoning.map(reasoningPart=>reasoningPart.payload.text).join(""):void 0;self.#delayedPromises.reasoningText.resolve(reasoningText);self.#delayedPromises.reasoning.resolve(Object.values(self.#bufferedReasoningDetails||{}));self.#delayedPromises.sources.resolve(self.#bufferedSources);self.#delayedPromises.files.resolve(self.#bufferedFiles);self.#delayedPromises.toolCalls.resolve(self.#toolCalls);self.#delayedPromises.toolResults.resolve(self.#toolResults);self.#delayedPromises.steps.resolve(self.#bufferedSteps);self.#delayedPromises.totalUsage.resolve(self.#getTotalUsage());self.#delayedPromises.content.resolve(messageList.get.response.aiV5.stepContent());self.#delayedPromises.suspendPayload.resolve(void 0);const baseFinishStep=self.#bufferedSteps[self.#bufferedSteps.length-1];if(baseFinishStep){const onFinishPayload={// StepResult properties from baseFinishStep
providerMetadata:baseFinishStep.providerMetadata,text:baseFinishStep.text,warnings:baseFinishStep.warnings??[],finishReason:chunk.payload.stepResult.reason,content:messageList.get.response.aiV5.stepContent(),request:await self.request,error:self.error,reasoning:await self.reasoning,reasoningText:await self.reasoningText,sources:await self.sources,files:await self.files,steps:self.#bufferedSteps,response:{...(await self.response),...baseFinishStep.response,messages:messageList.get.response.aiV5.model()},usage:chunk.payload.output.usage,totalUsage:self.#getTotalUsage(),toolCalls:await self.toolCalls,toolResults:await self.toolResults,staticToolCalls:(await self.toolCalls).filter(toolCall=>toolCall?.payload?.dynamic===false),staticToolResults:(await self.toolResults).filter(toolResult=>toolResult?.payload?.dynamic===false),dynamicToolCalls:(await self.toolCalls).filter(toolCall=>toolCall?.payload?.dynamic===true),dynamicToolResults:(await self.toolResults).filter(toolResult=>toolResult?.payload?.dynamic===true),// Custom properties (not part of standard callback)
...(self.#model.modelId&&self.#model.provider&&self.#model.version?{model:self.#model}:{}),object:self.#delayedPromises.object.status.type==="rejected"?void 0:self.#delayedPromises.object.status.type==="resolved"?self.#delayedPromises.object.status.value:self.#structuredOutputMode==="direct"&&baseFinishStep.text?(()=>{try{return JSON.parse(baseFinishStep.text);}catch{return void 0;}})():void 0};await options?.onFinish?.(onFinishPayload);}if(options?.rootSpan){options.rootSpan.setAttributes({...(self.#model.modelId?{"aisdk.model.id":self.#model.modelId}:{}),...(self.#model.provider?{"aisdk.model.provider":self.#model.provider}:{}),...(baseFinishStep?.usage?.reasoningTokens?{"stream.usage.reasoningTokens":baseFinishStep.usage.reasoningTokens}:{}),...(baseFinishStep?.usage?.totalTokens?{"stream.usage.totalTokens":baseFinishStep.usage.totalTokens}:{}),...(baseFinishStep?.usage?.inputTokens?{"stream.usage.inputTokens":baseFinishStep.usage.inputTokens}:{}),...(baseFinishStep?.usage?.outputTokens?{"stream.usage.outputTokens":baseFinishStep.usage.outputTokens}:{}),...(baseFinishStep?.usage?.cachedInputTokens?{"stream.usage.cachedInputTokens":baseFinishStep.usage.cachedInputTokens}:{}),...(baseFinishStep?.providerMetadata?{"stream.response.providerMetadata":JSON.stringify(baseFinishStep?.providerMetadata)}:{}),...(baseFinishStep?.finishReason?{"stream.response.finishReason":baseFinishStep?.finishReason}:{}),...(options?.telemetry_settings?.recordOutputs!==false?{"stream.response.text":baseFinishStep?.text}:{}),...(baseFinishStep?.toolCalls&&options?.telemetry_settings?.recordOutputs!==false?{"stream.response.toolCalls":JSON.stringify(baseFinishStep?.toolCalls?.map(toolCall=>{return {type:"tool-call",toolCallId:toolCall.payload?.toolCallId,args:toolCall.payload?.args,toolName:toolCall.payload?.toolName};}).filter(Boolean))}:{})});options.rootSpan.end();}break;case "error":const error=getErrorFromUnknown(chunk.payload.error,{fallbackMessage:"Unknown error chunk in stream"});self.#error=error;self.#status="failed";self.#streamFinished=true;Object.values(self.#delayedPromises).forEach(promise=>{if(promise.status.type==="pending"){promise.reject(self.#error);}});break;}self.#emitChunk(chunk);controller.enqueue(chunk);},flush:()=>{if(self.#delayedPromises.object.status.type==="pending"){self.#delayedPromises.object.resolve(void 0);}Object.entries(self.#delayedPromises).forEach(([key,promise])=>{if(promise.status.type==="pending"){promise.reject(new Error(`promise '${key}' was not resolved or rejected when stream finished`));}});self.#streamFinished=true;self.#emitter.emit("finish");}}));this.#aisdkv5=new AISDKV5OutputStream({modelOutput:this,messageList,options:{toolCallStreaming:options?.toolCallStreaming,structuredOutput:options?.structuredOutput,tracingContext:options?.tracingContext}});if(initialState){this.deserializeState(initialState);}}#getDelayedPromise(promise){if(!this.#consumptionStarted){void this.consumeStream();}return promise.promise;}/**
   * Resolves to the complete text response after streaming completes.
   */get text(){return this.#getDelayedPromise(this.#delayedPromises.text);}/**
   * Resolves to reasoning parts array for models that support reasoning.
   */get reasoning(){return this.#getDelayedPromise(this.#delayedPromises.reasoning);}/**
   * Resolves to complete reasoning text for models that support reasoning.
   */get reasoningText(){return this.#getDelayedPromise(this.#delayedPromises.reasoningText);}get sources(){return this.#getDelayedPromise(this.#delayedPromises.sources);}get files(){return this.#getDelayedPromise(this.#delayedPromises.files);}get steps(){return this.#getDelayedPromise(this.#delayedPromises.steps);}get suspendPayload(){return this.#getDelayedPromise(this.#delayedPromises.suspendPayload);}/**
   * Stream of all chunks. Provides complete control over stream processing.
   */get fullStream(){return this.#createEventedStream();}/**
   * Resolves to the reason generation finished.
   */get finishReason(){return this.#getDelayedPromise(this.#delayedPromises.finishReason);}/**
   * Resolves to array of all tool calls made during execution.
   */get toolCalls(){return this.#getDelayedPromise(this.#delayedPromises.toolCalls);}/**
   * Resolves to array of all tool execution results.
   */get toolResults(){return this.#getDelayedPromise(this.#delayedPromises.toolResults);}/**
   * Resolves to token usage statistics including inputTokens, outputTokens, and totalTokens.
   */get usage(){return this.#getDelayedPromise(this.#delayedPromises.usage);}/**
   * Resolves to array of all warnings generated during execution.
   */get warnings(){return this.#getDelayedPromise(this.#delayedPromises.warnings);}/**
   * Resolves to provider metadata generated during execution.
   */get providerMetadata(){return this.#getDelayedPromise(this.#delayedPromises.providerMetadata);}/**
   * Resolves to the complete response from the model.
   */get response(){return this.#getDelayedPromise(this.#delayedPromises.response);}/**
   * Resolves to the complete request sent to the model.
   */get request(){return this.#getDelayedPromise(this.#delayedPromises.request);}/**
   * Resolves to an error if an error occurred during streaming.
   */get error(){return this.#error;}updateUsageCount(usage){if(!usage){return;}if(usage.inputTokens!==void 0){this.#usageCount.inputTokens=(this.#usageCount.inputTokens??0)+usage.inputTokens;}if(usage.outputTokens!==void 0){this.#usageCount.outputTokens=(this.#usageCount.outputTokens??0)+usage.outputTokens;}if(usage.totalTokens!==void 0){this.#usageCount.totalTokens=(this.#usageCount.totalTokens??0)+usage.totalTokens;}if(usage.reasoningTokens!==void 0){this.#usageCount.reasoningTokens=(this.#usageCount.reasoningTokens??0)+usage.reasoningTokens;}if(usage.cachedInputTokens!==void 0){this.#usageCount.cachedInputTokens=(this.#usageCount.cachedInputTokens??0)+usage.cachedInputTokens;}}populateUsageCount(usage){if(!usage){return;}if(usage.inputTokens!==void 0&&this.#usageCount.inputTokens===void 0){this.#usageCount.inputTokens=usage.inputTokens;}if(usage.outputTokens!==void 0&&this.#usageCount.outputTokens===void 0){this.#usageCount.outputTokens=usage.outputTokens;}if(usage.totalTokens!==void 0&&this.#usageCount.totalTokens===void 0){this.#usageCount.totalTokens=usage.totalTokens;}if(usage.reasoningTokens!==void 0&&this.#usageCount.reasoningTokens===void 0){this.#usageCount.reasoningTokens=usage.reasoningTokens;}if(usage.cachedInputTokens!==void 0&&this.#usageCount.cachedInputTokens===void 0){this.#usageCount.cachedInputTokens=usage.cachedInputTokens;}}async consumeStream(options){if(this.#consumptionStarted){return;}this.#consumptionStarted=true;try{await consumeStream({stream:this.#baseStream,onError:options?.onError});}catch(error){options?.onError?.(error);}}/**
   * Returns complete output including text, usage, tool calls, and all metadata.
   */async getFullOutput(){await this.consumeStream({onError:error=>{console.error(error);throw error;}});let scoringData;if(this.#returnScorerData){scoringData={input:{inputMessages:this.messageList.getPersisted.input.ui(),rememberedMessages:this.messageList.getPersisted.remembered.ui(),systemMessages:this.messageList.getSystemMessages(),taggedSystemMessages:this.messageList.getPersisted.taggedSystemMessages},output:this.messageList.getPersisted.response.ui()};}const fullOutput={text:await this.text,usage:await this.usage,steps:await this.steps,finishReason:await this.finishReason,warnings:await this.warnings,providerMetadata:await this.providerMetadata,request:await this.request,reasoning:await this.reasoning,reasoningText:await this.reasoningText,toolCalls:await this.toolCalls,toolResults:await this.toolResults,sources:await this.sources,files:await this.files,response:await this.response,totalUsage:await this.totalUsage,object:await this.object,error:this.error,tripwire:this.#tripwire,tripwireReason:this.#tripwireReason,...(scoringData?{scoringData}:{}),traceId:this.traceId};return fullOutput;}/**
   * The tripwire flag is set when the stream is aborted due to an output processor blocking the content.
   */get tripwire(){return this.#tripwire;}/**
   * The reason for the tripwire.
   */get tripwireReason(){return this.#tripwireReason;}/**
   * The total usage of the stream.
   */get totalUsage(){return this.#getDelayedPromise(this.#delayedPromises.totalUsage);}get content(){return this.#getDelayedPromise(this.#delayedPromises.content);}/**
   * Other output stream formats.
   */get aisdk(){return {/**
       * The AI SDK v5 output stream format.
       */v5:this.#aisdkv5};}/**
   * Stream of valid JSON chunks. The final JSON result is validated against the output schema when the stream ends.
   *
   * @example
   * ```typescript
   * const stream = await agent.stream("Extract data", {
   *   structuredOutput: {
   *     schema: z.object({ name: z.string(), age: z.number() }),
   *     model: 'gpt-4o-mini' // optional to use a model for structuring json output
   *   }
   * });
   * // partial json chunks
   * for await (const data of stream.objectStream) {
   *   console.log(data); // { name: 'John' }, { name: 'John', age: 30 }
   * }
   * ```
   */get objectStream(){return this.#createEventedStream().pipeThrough(new TransformStream({transform(chunk,controller){if(chunk.type==="object"){controller.enqueue(chunk.object);}}}));}/**
   * Stream of individual array elements when output schema is an array type.
   */get elementStream(){let publishedElements=0;return this.#createEventedStream().pipeThrough(new TransformStream({transform(chunk,controller){if(chunk.type==="object"){if(Array.isArray(chunk.object)){for(;publishedElements<chunk.object.length;publishedElements++){controller.enqueue(chunk.object[publishedElements]);}}}}}));}/**
   * Stream of only text content, filtering out metadata and other chunk types.
   */get textStream(){if(this.#structuredOutputMode==="direct"){const outputSchema=getTransformedSchema(this.#options.structuredOutput?.schema);if(outputSchema?.outputFormat==="array"){return this.#createEventedStream().pipeThrough(createJsonTextStreamTransformer(this.#options.structuredOutput?.schema));}}return this.#createEventedStream().pipeThrough(new TransformStream({transform(chunk,controller){if(chunk.type==="text-delta"){controller.enqueue(chunk.payload.text);}}}));}/**
   * Resolves to the complete object response from the model. Validated against the 'output' schema when the stream ends.
   *
   * @example
   * ```typescript
   * const stream = await agent.stream("Extract data", {
   *   structuredOutput: {
   *     schema: z.object({ name: z.string(), age: z.number() }),
   *     model: 'gpt-4o-mini' // optionally use a model for structuring json output
   *   }
   * });
   * // final validated json
   * const data = await stream.object // { name: 'John', age: 30 }
   * ```
   */get object(){if(!this.processorRunner&&!this.#options.structuredOutput?.schema&&this.#delayedPromises.object.status.type==="pending"){this.#delayedPromises.object.resolve(void 0);}return this.#getDelayedPromise(this.#delayedPromises.object);}// Internal methods for immediate values - used internally by Mastra (llm-execution.ts bailing on errors/abort signals with current state)
// These are not part of the public API
/** @internal */_getImmediateToolCalls(){return this.#toolCalls;}/** @internal */_getImmediateToolResults(){return this.#toolResults;}/** @internal */_getImmediateText(){return this.#bufferedText.join("");}/** @internal */_getImmediateObject(){return this.#bufferedObject;}/** @internal */_getImmediateUsage(){return this.#usageCount;}/** @internal */_getImmediateWarnings(){return this.#warnings;}/** @internal */_getImmediateFinishReason(){return this.#finishReason;}/** @internal  */_getBaseStream(){return this.#baseStream;}#getTotalUsage(){let total=this.#usageCount.totalTokens;if(total===void 0){const input=this.#usageCount.inputTokens??0;const output=this.#usageCount.outputTokens??0;const reasoning=this.#usageCount.reasoningTokens??0;total=input+output+reasoning;}return {inputTokens:this.#usageCount.inputTokens,outputTokens:this.#usageCount.outputTokens,totalTokens:total,reasoningTokens:this.#usageCount.reasoningTokens,cachedInputTokens:this.#usageCount.cachedInputTokens};}#emitChunk(chunk){this.#bufferedChunks.push(chunk);this.#emitter.emit("chunk",chunk);}#createEventedStream(){const self=this;return new ReadableStream$1({start(controller){self.#bufferedChunks.forEach(chunk=>{controller.enqueue(chunk);});if(self.#streamFinished){controller.close();return;}const chunkHandler=chunk=>{controller.enqueue(chunk);};const finishHandler=()=>{self.#emitter.off("chunk",chunkHandler);self.#emitter.off("finish",finishHandler);controller.close();};self.#emitter.on("chunk",chunkHandler);self.#emitter.on("finish",finishHandler);},pull(_controller){if(!self.#consumptionStarted){void self.consumeStream();}},cancel(){self.#emitter.removeAllListeners();}});}get status(){return this.#status;}serializeState(){return {status:this.#status,bufferedSteps:this.#bufferedSteps,bufferedReasoningDetails:this.#bufferedReasoningDetails,bufferedByStep:this.#bufferedByStep,bufferedText:this.#bufferedText,bufferedTextChunks:this.#bufferedTextChunks,bufferedSources:this.#bufferedSources,bufferedReasoning:this.#bufferedReasoning,bufferedFiles:this.#bufferedFiles,toolCallArgsDeltas:this.#toolCallArgsDeltas,toolCallDeltaIdNameMap:this.#toolCallDeltaIdNameMap,toolCalls:this.#toolCalls,toolResults:this.#toolResults,warnings:this.#warnings,finishReason:this.#finishReason,request:this.#request,usageCount:this.#usageCount,tripwire:this.#tripwire,tripwireReason:this.#tripwireReason,messageList:this.messageList.serialize()};}deserializeState(state){this.#status=state.status;this.#bufferedSteps=state.bufferedSteps;this.#bufferedReasoningDetails=state.bufferedReasoningDetails;this.#bufferedByStep=state.bufferedByStep;this.#bufferedText=state.bufferedText;this.#bufferedTextChunks=state.bufferedTextChunks;this.#bufferedSources=state.bufferedSources;this.#bufferedReasoning=state.bufferedReasoning;this.#bufferedFiles=state.bufferedFiles;this.#toolCallArgsDeltas=state.toolCallArgsDeltas;this.#toolCallDeltaIdNameMap=state.toolCallDeltaIdNameMap;this.#toolCalls=state.toolCalls;this.#toolResults=state.toolResults;this.#warnings=state.warnings;this.#finishReason=state.finishReason;this.#request=state.request;this.#usageCount=state.usageCount;this.#tripwire=state.tripwire;this.#tripwireReason=state.tripwireReason;this.messageList=this.messageList.deserialize(state.messageList);}};

export { Agent as A, ChunkFrom as C, ExecutionEngine as E, Run as R, STREAM_FORMAT_SYMBOL as S, Workflow as W, __decoratorStart as _, EMITTER_SYMBOL as a, __decorateElement as b, __runInitializers as c, tryStreamWithJsonFallback as d, createWorkflow as e, createStep as f, getStepResult as g, tryGenerateWithJsonFallback as t, validateStepInput as v };
