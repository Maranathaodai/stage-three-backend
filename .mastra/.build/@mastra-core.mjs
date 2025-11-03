import { W as WorkflowEventProcessor, s as saveScorePayloadSchema } from './chunk-KAEQISOW.mjs';
import { a as augmentWithInit } from './chunk-436FFEF6.mjs';
import { T as Telemetry, I as InstrumentClass } from './telemetry.mjs';
import { I as InMemoryServerCache } from './netlify-VJXBII33.mjs';
import { r as registerHook } from './hooks.mjs';
import { s as setupAITracing, g as getAllAITracing, a as shutdownAITracingRegistry } from './ai-tracing.mjs';
import { M as MastraError } from './error.mjs';
import { C as ConsoleLogger, L as LogLevel } from './_commonjsHelpers.mjs';
import { _ as __decoratorStart, b as __decorateElement, c as __runInitializers } from './workflows.mjs';
import { randomUUID } from 'crypto';
import EventEmitter from 'events';
import pMap from './index.mjs';

// src/events/pubsub.ts
var PubSub = class {
};

// src/logger/noop-logger.ts
var noopLogger = {
  debug: () => {
  },
  info: () => {
  },
  warn: () => {
  },
  error: () => {
  },
  cleanup: async () => {
  },
  getTransports: () => /* @__PURE__ */ new Map(),
  trackException: () => {
  },
  getLogs: async () => ({ logs: [], total: 0, page: 1, perPage: 100, hasMore: false }),
  getLogsByRunId: async () => ({ logs: [], total: 0, page: 1, perPage: 100, hasMore: false })
};

var EventEmitterPubSub = class extends PubSub {
  emitter;
  constructor() {
    super();
    this.emitter = new EventEmitter();
  }
  async publish(topic, event) {
    const id = crypto.randomUUID();
    const createdAt = /* @__PURE__ */new Date();
    this.emitter.emit(topic, {
      ...event,
      id,
      createdAt
    });
  }
  async subscribe(topic, cb) {
    this.emitter.on(topic, cb);
  }
  async unsubscribe(topic, cb) {
    this.emitter.off(topic, cb);
  }
  async flush() {}
};
function createOnScorerHook(mastra) {
  return async hookData => {
    const storage = mastra.getStorage();
    if (!storage) {
      mastra.getLogger()?.warn("Storage not found, skipping score validation and saving");
      return;
    }
    const entityId = hookData.entity.id;
    const entityType = hookData.entityType;
    const scorer = hookData.scorer;
    try {
      const scorerToUse = await findScorer(mastra, entityId, entityType, scorer.name);
      if (!scorerToUse) {
        throw new MastraError({
          id: "MASTRA_SCORER_NOT_FOUND",
          domain: "MASTRA" /* MASTRA */,
          category: "USER" /* USER */,
          text: `Scorer with ID ${hookData.scorer.id} not found`
        });
      }
      let input = hookData.input;
      let output = hookData.output;
      const {
        structuredOutput,
        ...rest
      } = hookData;
      const runResult = await scorerToUse.scorer.run({
        ...rest,
        input,
        output
      });
      let spanId;
      let traceId;
      const currentSpan = hookData.tracingContext?.currentSpan;
      if (currentSpan && currentSpan.isValid) {
        spanId = currentSpan.id;
        traceId = currentSpan.traceId;
      }
      const payload = {
        ...rest,
        ...runResult,
        entityId,
        scorerId: hookData.scorer.name,
        spanId,
        traceId,
        metadata: {
          structuredOutput: !!structuredOutput
        }
      };
      await validateAndSaveScore(storage, payload);
      if (currentSpan && spanId && traceId) {
        await pMap(currentSpan.aiTracing.getExporters(), async exporter => {
          if (exporter.addScoreToTrace) {
            await exporter.addScoreToTrace({
              traceId,
              spanId,
              score: runResult.score,
              reason: runResult.reason,
              scorerName: scorerToUse.scorer.name,
              metadata: {
                ...(currentSpan.metadata ?? {})
              }
            });
          }
        }, {
          concurrency: 3
        });
      }
    } catch (error) {
      const mastraError = new MastraError({
        id: "MASTRA_SCORER_FAILED_TO_RUN_HOOK",
        domain: "SCORER" /* SCORER */,
        category: "USER" /* USER */,
        details: {
          scorerId: scorer.id,
          entityId,
          entityType
        }
      }, error);
      mastra.getLogger()?.trackException(mastraError);
      mastra.getLogger()?.error(mastraError.toString());
    }
  };
}
async function validateAndSaveScore(storage, payload) {
  const payloadToSave = saveScorePayloadSchema.parse(payload);
  await storage?.saveScore(payloadToSave);
}
async function findScorer(mastra, entityId, entityType, scorerName) {
  let scorerToUse;
  if (entityType === "AGENT") {
    const scorers = await mastra.getAgentById(entityId).getScorers();
    for (const [_, scorer] of Object.entries(scorers)) {
      if (scorer.scorer.name === scorerName) {
        scorerToUse = scorer;
        break;
      }
    }
  } else if (entityType === "WORKFLOW") {
    const scorers = await mastra.getWorkflowById(entityId).getScorers();
    for (const [_, scorer] of Object.entries(scorers)) {
      if (scorer.scorer.name === scorerName) {
        scorerToUse = scorer;
        break;
      }
    }
  }
  if (!scorerToUse) {
    const mastraRegisteredScorer = mastra.getScorerByName(scorerName);
    scorerToUse = mastraRegisteredScorer ? {
      scorer: mastraRegisteredScorer
    } : void 0;
  }
  return scorerToUse;
}

// src/mastra/index.ts
var _Mastra_decorators, _init;
_Mastra_decorators = [InstrumentClass({
  prefix: "mastra",
  excludeMethods: ["getLogger", "getTelemetry"]
})];
var Mastra = class {
  #vectors;
  #agents;
  #logger;
  #legacy_workflows;
  #workflows;
  #tts;
  #deployer;
  #serverMiddleware = [];
  /**
   * @deprecated Use {@link getAITracing()} instead.
   */
  #telemetry;
  #storage;
  #memory;
  #scorers;
  #server;
  #mcpServers;
  #bundler;
  #idGenerator;
  #pubsub;
  #events = {};
  #internalMastraWorkflows = {};
  // This is only used internally for server handlers that require temporary persistence
  #serverCache;
  /**
   * @deprecated use {@link getAITracing()} instead
   */
  get telemetry() {
    return this.#telemetry;
  }
  /**
   * @deprecated use getStorage() instead
   */
  get storage() {
    return this.#storage;
  }
  /**
   * @deprecated use getMemory() instead
   */
  get memory() {
    return this.#memory;
  }
  get pubsub() {
    return this.#pubsub;
  }
  /**
   * Gets the currently configured ID generator function.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   idGenerator: () => `custom-${Date.now()}`
   * });
   * const generator = mastra.getIdGenerator();
   * console.log(generator?.()); // "custom-1234567890"
   * ```
   */
  getIdGenerator() {
    return this.#idGenerator;
  }
  /**
   * Generates a unique identifier using the configured generator or defaults to `crypto.randomUUID()`.
   *
   * This method is used internally by Mastra for creating unique IDs for various entities
   * like workflow runs, agent conversations, and other resources that need unique identification.
   *
   * @throws {MastraError} When the custom ID generator returns an empty string
   *
   * @example
   * ```typescript
   * const mastra = new Mastra();
   * const id = mastra.generateId();
   * console.log(id); // "550e8400-e29b-41d4-a716-446655440000"
   * ```
   */
  generateId() {
    if (this.#idGenerator) {
      const id = this.#idGenerator();
      if (!id) {
        const error = new MastraError({
          id: "MASTRA_ID_GENERATOR_RETURNED_EMPTY_STRING",
          domain: "MASTRA" /* MASTRA */,
          category: "USER" /* USER */,
          text: "ID generator returned an empty string, which is not allowed"
        });
        this.#logger?.trackException(error);
        throw error;
      }
      return id;
    }
    return randomUUID();
  }
  /**
   * Sets a custom ID generator function for creating unique identifiers.
   *
   * The ID generator function will be used by `generateId()` instead of the default
   * `crypto.randomUUID()`. This is useful for creating application-specific ID formats
   * or integrating with existing ID generation systems.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra();
   * mastra.setIdGenerator(() => `custom-${Date.now()}`);
   * const id = mastra.generateId();
   * console.log(id); // "custom-1234567890"
   * ```
   */
  setIdGenerator(idGenerator) {
    this.#idGenerator = idGenerator;
  }
  /**
   * Creates a new Mastra instance with the provided configuration.
   *
   * The constructor initializes all the components specified in the config, sets up
   * internal systems like logging and telemetry, and registers components with each other.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   agents: {
   *     assistant: new Agent({
   *       name: 'assistant',
   *       instructions: 'You are a helpful assistant',
   *       model: 'openai/gpt-5'
   *     })
   *   },
   *   storage: new PostgresStore({
   *     connectionString: process.env.DATABASE_URL
   *   }),
   *   logger: new PinoLogger({ name: 'MyApp' })
   * });
   * ```
   */
  constructor(config) {
    if (config?.serverMiddleware) {
      this.#serverMiddleware = config.serverMiddleware.map(m => ({
        handler: m.handler,
        path: m.path || "/api/*"
      }));
    }
    this.#serverCache = new InMemoryServerCache();
    if (config?.pubsub) {
      this.#pubsub = config.pubsub;
    } else {
      this.#pubsub = new EventEmitterPubSub();
    }
    this.#events = {};
    for (const topic in config?.events ?? {}) {
      if (!Array.isArray(config?.events?.[topic])) {
        this.#events[topic] = [config?.events?.[topic]];
      } else {
        this.#events[topic] = config?.events?.[topic] ?? [];
      }
    }
    const workflowEventProcessor = new WorkflowEventProcessor({
      mastra: this
    });
    const workflowEventCb = async (event, cb) => {
      try {
        await workflowEventProcessor.process(event, cb);
      } catch (e) {
        console.error("Error processing event", e);
      }
    };
    if (this.#events.workflows) {
      this.#events.workflows.push(workflowEventCb);
    } else {
      this.#events.workflows = [workflowEventCb];
    }
    let logger;
    if (config?.logger === false) {
      logger = noopLogger;
    } else {
      if (config?.logger) {
        logger = config.logger;
      } else {
        const levelOnEnv = process.env.NODE_ENV === "production" && process.env.MASTRA_DEV !== "true" ? LogLevel.WARN : LogLevel.INFO;
        logger = new ConsoleLogger({
          name: "Mastra",
          level: levelOnEnv
        });
      }
    }
    this.#logger = logger;
    this.#idGenerator = config?.idGenerator;
    let storage = config?.storage;
    if (storage) {
      storage = augmentWithInit(storage);
    }
    this.#telemetry = Telemetry.init(config?.telemetry);
    if (config?.telemetry?.enabled !== false && typeof globalThis !== "undefined" && globalThis.___MASTRA_TELEMETRY___ !== true) {
      this.#logger?.warn(`Mastra telemetry is enabled, but the required instrumentation file was not loaded. If you are using Mastra outside of the mastra server environment, see: https://mastra.ai/en/docs/observability/tracing#tracing-outside-mastra-server-environment`, `If you are using a custom instrumentation file or want to disable this warning, set the globalThis.___MASTRA_TELEMETRY___ variable to true in your instrumentation file.`);
    }
    if (config?.telemetry?.enabled !== false) {
      this.#logger?.warn(`Mastra telemetry is deprecated and will be removed on the Nov 4th release. Instead use AI Tracing. More info can be found here: https://github.com/mastra-ai/mastra/issues/8577 and here: https://mastra.ai/en/docs/observability/ai-tracing/overview`);
    }
    if (config?.observability) {
      setupAITracing(config.observability);
    }
    if (this.#telemetry && storage) {
      this.#storage = this.#telemetry.traceClass(storage, {
        excludeMethods: ["__setTelemetry", "__getTelemetry", "batchTraceInsert", "getTraces", "getEvalsByAgentName"]
      });
      this.#storage.__setTelemetry(this.#telemetry);
    } else {
      this.#storage = storage;
    }
    if (config?.vectors) {
      let vectors = {};
      Object.entries(config.vectors).forEach(([key, vector]) => {
        if (this.#telemetry) {
          vectors[key] = this.#telemetry.traceClass(vector, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          vectors[key].__setTelemetry(this.#telemetry);
        } else {
          vectors[key] = vector;
        }
      });
      this.#vectors = vectors;
    }
    if (config?.mcpServers) {
      this.#mcpServers = config.mcpServers;
      Object.entries(this.#mcpServers).forEach(([key, server]) => {
        server.setId(key);
        if (this.#telemetry) {
          server.__setTelemetry(this.#telemetry);
        }
        server.__registerMastra(this);
        server.__setLogger(this.getLogger());
      });
    }
    if (config && `memory` in config) {
      const error = new MastraError({
        id: "MASTRA_CONSTRUCTOR_INVALID_MEMORY_CONFIG",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: `
  Memory should be added to Agents, not to Mastra.

Instead of:
  new Mastra({ memory: new Memory() })

do:
  new Agent({ memory: new Memory() })
`
      });
      this.#logger?.trackException(error);
      throw error;
    }
    if (config?.tts) {
      this.#tts = config.tts;
      Object.entries(this.#tts).forEach(([key, ttsCl]) => {
        if (this.#tts?.[key]) {
          if (this.#telemetry) {
            this.#tts[key] = this.#telemetry.traceClass(ttsCl, {
              excludeMethods: ["__setTelemetry", "__getTelemetry"]
            });
            this.#tts[key].__setTelemetry(this.#telemetry);
          }
        }
      });
    }
    const agents = {};
    if (config?.agents) {
      Object.entries(config.agents).forEach(([key, agent]) => {
        if (agents[key]) {
          const error = new MastraError({
            id: "MASTRA_AGENT_REGISTRATION_DUPLICATE_ID",
            domain: "MASTRA" /* MASTRA */,
            category: "USER" /* USER */,
            text: `Agent with name ID:${key} already exists`,
            details: {
              agentId: key
            }
          });
          this.#logger?.trackException(error);
          throw error;
        }
        agent.__registerMastra(this);
        agent.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: this.#telemetry,
          storage: this.storage,
          memory: this.memory,
          agents,
          tts: this.#tts,
          vectors: this.#vectors
        });
        agents[key] = agent;
      });
    }
    this.#agents = agents;
    const scorers = {};
    if (config?.scorers) {
      Object.entries(config.scorers).forEach(([key, scorer]) => {
        scorers[key] = scorer;
      });
    }
    this.#scorers = scorers;
    this.#legacy_workflows = {};
    if (config?.legacy_workflows) {
      Object.entries(config.legacy_workflows).forEach(([key, workflow]) => {
        workflow.__registerMastra(this);
        workflow.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: this.#telemetry,
          storage: this.storage,
          memory: this.memory,
          agents,
          tts: this.#tts,
          vectors: this.#vectors
        });
        this.#legacy_workflows[key] = workflow;
        const workflowSteps = Object.values(workflow.steps).filter(step => !!step.workflowId && !!step.workflow);
        if (workflowSteps.length > 0) {
          workflowSteps.forEach(step => {
            this.#legacy_workflows[step.workflowId] = step.workflow;
          });
        }
      });
    }
    this.#workflows = {};
    if (config?.workflows) {
      Object.entries(config.workflows).forEach(([key, workflow]) => {
        workflow.__registerMastra(this);
        workflow.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: this.#telemetry,
          storage: this.storage,
          memory: this.memory,
          agents,
          tts: this.#tts,
          vectors: this.#vectors
        });
        this.#workflows[key] = workflow;
      });
    }
    if (config?.server) {
      this.#server = config.server;
    }
    registerHook("onScorerRun" /* ON_SCORER_RUN */, createOnScorerHook(this));
    if (config?.observability) {
      this.registerAITracingExporters();
      this.initAITracingExporters();
    }
    this.setLogger({
      logger
    });
  }
  /**
   * Register this Mastra instance with AI tracing exporters that need it
   */
  registerAITracingExporters() {
    const allTracingInstances = getAllAITracing();
    allTracingInstances.forEach(tracing => {
      const exporters = tracing.getExporters();
      exporters.forEach(exporter => {
        if ("__registerMastra" in exporter && typeof exporter.__registerMastra === "function") {
          exporter.__registerMastra(this);
        }
      });
    });
  }
  /**
   * Initialize all AI tracing exporters after registration is complete
   */
  initAITracingExporters() {
    const allTracingInstances = getAllAITracing();
    allTracingInstances.forEach(tracing => {
      const config = tracing.getConfig();
      const exporters = tracing.getExporters();
      exporters.forEach(exporter => {
        if ("init" in exporter && typeof exporter.init === "function") {
          try {
            exporter.init(config);
          } catch (error) {
            this.#logger?.warn("Failed to initialize AI tracing exporter", {
              exporterName: exporter.name,
              error: error instanceof Error ? error.message : String(error)
            });
          }
        }
      });
    });
  }
  /**
   * Retrieves a registered agent by its name.
   *
   * @template TAgentName - The specific agent name type from the registered agents
   * @throws {MastraError} When the agent with the specified name is not found
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   agents: {
   *     weatherAgent: new Agent({
   *       name: 'weather-agent',
   *       instructions: 'You provide weather information',
   *       model: 'openai/gpt-5'
   *     })
   *   }
   * });
   * const agent = mastra.getAgent('weatherAgent');
   * const response = await agent.generate('What is the weather?');
   * ```
   */
  getAgent(name) {
    const agent = this.#agents?.[name];
    if (!agent) {
      const error = new MastraError({
        id: "MASTRA_GET_AGENT_BY_NAME_NOT_FOUND",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: `Agent with name ${String(name)} not found`,
        details: {
          status: 404,
          agentName: String(name),
          agents: Object.keys(this.#agents ?? {}).join(", ")
        }
      });
      this.#logger?.trackException(error);
      throw error;
    }
    return this.#agents[name];
  }
  /**
   * Retrieves a registered agent by its unique ID.
   *
   * This method searches for an agent using its internal ID property. If no agent
   * is found with the given ID, it also attempts to find an agent using the ID as
   * a name (for backward compatibility).
   *
   * @throws {MastraError} When no agent is found with the specified ID
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   agents: {
   *     assistant: new Agent({
   *       name: 'assistant',
   *       instructions: 'You are a helpful assistant',
   *       model: 'openai/gpt-5'
   *     })
   *   }
   * });
   *
   * const assistant = mastra.getAgent('assistant');
   * const sameAgent = mastra.getAgentById(assistant.id);
   * ```
   */
  getAgentById(id) {
    let agent = Object.values(this.#agents).find(a => a.id === id);
    if (!agent) {
      try {
        agent = this.getAgent(id);
      } catch {}
    }
    if (!agent) {
      const error = new MastraError({
        id: "MASTRA_GET_AGENT_BY_AGENT_ID_NOT_FOUND",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: `Agent with id ${String(id)} not found`,
        details: {
          status: 404,
          agentId: String(id),
          agents: Object.keys(this.#agents ?? {}).join(", ")
        }
      });
      this.#logger?.trackException(error);
      throw error;
    }
    return agent;
  }
  /**
   * Returns all registered agents as a record keyed by their names.
   *
   * This method provides access to the complete registry of agents, allowing you to
   * iterate over them, check what agents are available, or perform bulk operations.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   agents: {
   *     weatherAgent: new Agent({ name: 'weather', model: openai('gpt-4o') }),
   *     supportAgent: new Agent({ name: 'support', model: openai('gpt-4o') })
   *   }
   * });
   *
   * const allAgents = mastra.getAgents();
   * console.log(Object.keys(allAgents)); // ['weatherAgent', 'supportAgent']
   * ```
   */
  getAgents() {
    return this.#agents;
  }
  /**
   * Retrieves a registered vector store by its name.
   *
   * @template TVectorName - The specific vector store name type from the registered vectors
   * @throws {MastraError} When the vector store with the specified name is not found
   *
   * @example Using a vector store for semantic search
   * ```typescript
   * import { PineconeVector } from '@mastra/pinecone';
   * import { OpenAIEmbedder } from '@mastra/embedders';
   *
   * const mastra = new Mastra({
   *   vectors: {
   *     knowledge: new PineconeVector({
   *       apiKey: process.env.PINECONE_API_KEY,
   *       indexName: 'knowledge-base',
   *       embedder: new OpenAIEmbedder({
   *         apiKey: process.env.OPENAI_API_KEY,
   *         model: 'text-embedding-3-small'
   *       })
   *     }),
   *     products: new PineconeVector({
   *       apiKey: process.env.PINECONE_API_KEY,
   *       indexName: 'product-catalog'
   *     })
   *   }
   * });
   *
   * // Get a vector store and perform semantic search
   * const knowledgeBase = mastra.getVector('knowledge');
   * const results = await knowledgeBase.query({
   *   query: 'How to reset password?',
   *   topK: 5
   * });
   *
   * console.log('Relevant documents:', results);
   * ```
   */
  getVector(name) {
    const vector = this.#vectors?.[name];
    if (!vector) {
      const error = new MastraError({
        id: "MASTRA_GET_VECTOR_BY_NAME_NOT_FOUND",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: `Vector with name ${String(name)} not found`,
        details: {
          status: 404,
          vectorName: String(name),
          vectors: Object.keys(this.#vectors ?? {}).join(", ")
        }
      });
      this.#logger?.trackException(error);
      throw error;
    }
    return vector;
  }
  /**
   * Returns all registered vector stores as a record keyed by their names.
   *
   * @example Listing all vector stores
   * ```typescript
   * const mastra = new Mastra({
   *   vectors: {
   *     documents: new PineconeVector({ indexName: 'docs' }),
   *     images: new PineconeVector({ indexName: 'images' }),
   *     products: new ChromaVector({ collectionName: 'products' })
   *   }
   * });
   *
   * const allVectors = mastra.getVectors();
   * console.log(Object.keys(allVectors)); // ['documents', 'images', 'products']
   *
   * // Check vector store types and configurations
   * for (const [name, vectorStore] of Object.entries(allVectors)) {
   *   console.log(`Vector store ${name}:`, vectorStore.constructor.name);
   * }
   * ```
   */
  getVectors() {
    return this.#vectors;
  }
  /**
   * Gets the currently configured deployment provider.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   deployer: new VercelDeployer({
   *     token: process.env.VERCEL_TOKEN,
   *     projectId: process.env.VERCEL_PROJECT_ID
   *   })
   * });
   *
   * const deployer = mastra.getDeployer();
   * if (deployer) {
   *   await deployer.deploy({
   *     name: 'my-mastra-app',
   *     environment: 'production'
   *   });
   * }
   * ```
   */
  getDeployer() {
    return this.#deployer;
  }
  /**
   * Retrieves a registered legacy workflow by its ID.
   *
   * Legacy workflows are the previous generation of workflow system in Mastra,
   * maintained for backward compatibility. For new implementations, use the
   * modern workflow system accessed via `getWorkflow()`.
   *
   * @template TWorkflowId - The specific workflow ID type from the registered legacy workflows
   * @throws {MastraError} When the legacy workflow with the specified ID is not found
   * @deprecated Use `getWorkflow()` for new implementations
   *
   * @example Getting a legacy workflow
   * ```typescript
   * const mastra = new Mastra({
   *   legacy_workflows: {
   *     oldDataFlow: legacyWorkflowInstance
   *   }
   * });
   *
   * const workflow = mastra.legacy_getWorkflow('oldDataFlow');
   * const result = await workflow.execute({ input: 'data' });
   * ```
   */
  legacy_getWorkflow(id, {
    serialized
  } = {}) {
    const workflow = this.#legacy_workflows?.[id];
    if (!workflow) {
      const error = new MastraError({
        id: "MASTRA_GET_LEGACY_WORKFLOW_BY_ID_NOT_FOUND",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: `Workflow with ID ${String(id)} not found`,
        details: {
          status: 404,
          workflowId: String(id),
          workflows: Object.keys(this.#legacy_workflows ?? {}).join(", ")
        }
      });
      this.#logger?.trackException(error);
      throw error;
    }
    if (serialized) {
      return {
        name: workflow.name
      };
    }
    return workflow;
  }
  /**
   * Retrieves a registered workflow by its ID.
   *
   * @template TWorkflowId - The specific workflow ID type from the registered workflows
   * @throws {MastraError} When the workflow with the specified ID is not found
   *
   * @example Getting and executing a workflow
   * ```typescript
   * import { createWorkflow, createStep } from '@mastra/core/workflows';
   * import { z } from 'zod';
   *
   * const processDataWorkflow = createWorkflow({
   *   name: 'process-data',
   *   triggerSchema: z.object({ input: z.string() })
   * })
   *   .then(validateStep)
   *   .then(transformStep)
   *   .then(saveStep)
   *   .commit();
   *
   * const mastra = new Mastra({
   *   workflows: {
   *     dataProcessor: processDataWorkflow
   *   }
   * });
   * ```
   */
  getWorkflow(id, {
    serialized
  } = {}) {
    const workflow = this.#workflows?.[id];
    if (!workflow) {
      const error = new MastraError({
        id: "MASTRA_GET_WORKFLOW_BY_ID_NOT_FOUND",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: `Workflow with ID ${String(id)} not found`,
        details: {
          status: 404,
          workflowId: String(id),
          workflows: Object.keys(this.#workflows ?? {}).join(", ")
        }
      });
      this.#logger?.trackException(error);
      throw error;
    }
    if (serialized) {
      return {
        name: workflow.name
      };
    }
    return workflow;
  }
  __registerInternalWorkflow(workflow) {
    workflow.__registerMastra(this);
    workflow.__registerPrimitives({
      logger: this.getLogger(),
      storage: this.storage
    });
    this.#internalMastraWorkflows[workflow.id] = workflow;
  }
  __hasInternalWorkflow(id) {
    return Object.values(this.#internalMastraWorkflows).some(workflow => workflow.id === id);
  }
  __getInternalWorkflow(id) {
    const workflow = Object.values(this.#internalMastraWorkflows).find(a => a.id === id);
    if (!workflow) {
      throw new MastraError({
        id: "MASTRA_GET_INTERNAL_WORKFLOW_BY_ID_NOT_FOUND",
        domain: "MASTRA" /* MASTRA */,
        category: "SYSTEM" /* SYSTEM */,
        text: `Workflow with id ${String(id)} not found`,
        details: {
          status: 404,
          workflowId: String(id)
        }
      });
    }
    return workflow;
  }
  /**
   * Retrieves a registered workflow by its unique ID.
   *
   * This method searches for a workflow using its internal ID property. If no workflow
   * is found with the given ID, it also attempts to find a workflow using the ID as
   * a name (for backward compatibility).
   *
   * @throws {MastraError} When no workflow is found with the specified ID
   *
   * @example Finding a workflow by ID
   * ```typescript
   * const mastra = new Mastra({
   *   workflows: {
   *     dataProcessor: createWorkflow({
   *       name: 'process-data',
   *       triggerSchema: z.object({ input: z.string() })
   *     }).commit()
   *   }
   * });
   *
   * // Get the workflow's ID
   * const workflow = mastra.getWorkflow('dataProcessor');
   * const workflowId = workflow.id;
   *
   * // Later, retrieve the workflow by ID
   * const sameWorkflow = mastra.getWorkflowById(workflowId);
   * console.log(sameWorkflow.name); // "process-data"
   * ```
   */
  getWorkflowById(id) {
    let workflow = Object.values(this.#workflows).find(a => a.id === id);
    if (!workflow) {
      try {
        workflow = this.getWorkflow(id);
      } catch {}
    }
    if (!workflow) {
      const error = new MastraError({
        id: "MASTRA_GET_WORKFLOW_BY_ID_NOT_FOUND",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: `Workflow with id ${String(id)} not found`,
        details: {
          status: 404,
          workflowId: String(id),
          workflows: Object.keys(this.#workflows ?? {}).join(", ")
        }
      });
      this.#logger?.trackException(error);
      throw error;
    }
    return workflow;
  }
  /**
   * Returns all registered legacy workflows as a record keyed by their IDs.
   *
   * Legacy workflows are the previous generation of workflow system in Mastra,
   * maintained for backward compatibility. For new implementations, use `getWorkflows()`.
   *
   * @deprecated Use `getWorkflows()` for new implementations
   *
   * @example Listing all legacy workflows
   * ```typescript
   * const mastra = new Mastra({
   *   legacy_workflows: {
   *     oldFlow1: legacyWorkflow1,
   *     oldFlow2: legacyWorkflow2
   *   }
   * });
   *
   * const allLegacyWorkflows = mastra.legacy_getWorkflows();
   * console.log(Object.keys(allLegacyWorkflows)); // ['oldFlow1', 'oldFlow2']
   *
   * // Execute all legacy workflows
   * for (const [id, workflow] of Object.entries(allLegacyWorkflows)) {
   *   console.log(`Legacy workflow ${id}:`, workflow.name);
   * }
   * ```
   */
  legacy_getWorkflows(props = {}) {
    if (props.serialized) {
      return Object.entries(this.#legacy_workflows).reduce((acc, [k, v]) => {
        return {
          ...acc,
          [k]: {
            name: v.name
          }
        };
      }, {});
    }
    return this.#legacy_workflows;
  }
  /**
   * Returns all registered scorers as a record keyed by their IDs.
   *
   * @example Listing all scorers
   * ```typescript
   * import { HelpfulnessScorer, AccuracyScorer, RelevanceScorer } from '@mastra/scorers';
   *
   * const mastra = new Mastra({
   *   scorers: {
   *     helpfulness: new HelpfulnessScorer(),
   *     accuracy: new AccuracyScorer(),
   *     relevance: new RelevanceScorer()
   *   }
   * });
   *
   * const allScorers = mastra.getScorers();
   * console.log(Object.keys(allScorers)); // ['helpfulness', 'accuracy', 'relevance']
   *
   * // Check scorer configurations
   * for (const [id, scorer] of Object.entries(allScorers)) {
   *   console.log(`Scorer ${id}:`, scorer.name, scorer.description);
   * }
   * ```
   */
  getScorers() {
    return this.#scorers;
  }
  /**
   * Retrieves a registered scorer by its key.
   *
   * @template TScorerKey - The specific scorer key type from the registered scorers
   * @throws {MastraError} When the scorer with the specified key is not found
   *
   * @example Getting and using a scorer
   * ```typescript
   * import { HelpfulnessScorer, AccuracyScorer } from '@mastra/scorers';
   *
   * const mastra = new Mastra({
   *   scorers: {
   *     helpfulness: new HelpfulnessScorer({
   *       model: openai('gpt-4o'),
   *       criteria: 'Rate how helpful this response is'
   *     }),
   *     accuracy: new AccuracyScorer({
   *       model: 'openai/gpt-5'
   *     })
   *   }
   * });
   *
   * // Get a specific scorer
   * const helpfulnessScorer = mastra.getScorer('helpfulness');
   * const score = await helpfulnessScorer.score({
   *   input: 'How do I reset my password?',
   *   output: 'You can reset your password by clicking the forgot password link.',
   *   expected: 'Detailed password reset instructions'
   * });
   *
   * console.log('Helpfulness score:', score);
   * ```
   */
  getScorer(key) {
    const scorer = this.#scorers?.[key];
    if (!scorer) {
      const error = new MastraError({
        id: "MASTRA_GET_SCORER_NOT_FOUND",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: `Scorer with ${String(key)} not found`
      });
      this.#logger?.trackException(error);
      throw error;
    }
    return scorer;
  }
  /**
   * Retrieves a registered scorer by its name.
   *
   * This method searches through all registered scorers to find one with the specified name.
   * Unlike `getScorer()` which uses the registration key, this method uses the scorer's
   * internal name property.
   *
   * @throws {MastraError} When no scorer is found with the specified name
   *
   * @example Finding a scorer by name
   * ```typescript
   * import { HelpfulnessScorer } from '@mastra/scorers';
   *
   * const mastra = new Mastra({
   *   scorers: {
   *     myHelpfulnessScorer: new HelpfulnessScorer({
   *       name: 'helpfulness-evaluator',
   *       model: 'openai/gpt-5'
   *     })
   *   }
   * });
   *
   * // Find scorer by its internal name, not the registration key
   * const scorer = mastra.getScorerByName('helpfulness-evaluator');
   * const score = await scorer.score({
   *   input: 'question',
   *   output: 'answer'
   * });
   * ```
   */
  getScorerByName(name) {
    for (const [_key, value] of Object.entries(this.#scorers ?? {})) {
      if (value.name === name) {
        return value;
      }
    }
    const error = new MastraError({
      id: "MASTRA_GET_SCORER_BY_NAME_NOT_FOUND",
      domain: "MASTRA" /* MASTRA */,
      category: "USER" /* USER */,
      text: `Scorer with name ${String(name)} not found`
    });
    this.#logger?.trackException(error);
    throw error;
  }
  /**
   * Returns all registered workflows as a record keyed by their IDs.
   *
   * @example Listing all workflows
   * ```typescript
   * const mastra = new Mastra({
   *   workflows: {
   *     dataProcessor: createWorkflow({...}).commit(),
   *     emailSender: createWorkflow({...}).commit(),
   *     reportGenerator: createWorkflow({...}).commit()
   *   }
   * });
   *
   * const allWorkflows = mastra.getWorkflows();
   * console.log(Object.keys(allWorkflows)); // ['dataProcessor', 'emailSender', 'reportGenerator']
   *
   * // Execute all workflows with sample data
   * for (const [id, workflow] of Object.entries(allWorkflows)) {
   *   console.log(`Workflow ${id}:`, workflow.name);
   *   // const result = await workflow.execute(sampleData);
   * }
   * ```
   */
  getWorkflows(props = {}) {
    if (props.serialized) {
      return Object.entries(this.#workflows).reduce((acc, [k, v]) => {
        return {
          ...acc,
          [k]: {
            name: v.name
          }
        };
      }, {});
    }
    return this.#workflows;
  }
  /**
   * Sets the storage provider for the Mastra instance.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra();
   *
   * // Set PostgreSQL storage
   * mastra.setStorage(new PostgresStore({
   *   connectionString: process.env.DATABASE_URL
   * }));
   *
   * // Now agents can use memory with the storage
   * const agent = new Agent({
   *   name: 'assistant',
   *   memory: new Memory({ storage: mastra.getStorage() })
   * });
   * ```
   */
  setStorage(storage) {
    this.#storage = augmentWithInit(storage);
  }
  setLogger({
    logger
  }) {
    this.#logger = logger;
    if (this.#agents) {
      Object.keys(this.#agents).forEach(key => {
        this.#agents?.[key]?.__setLogger(this.#logger);
      });
    }
    if (this.#memory) {
      this.#memory.__setLogger(this.#logger);
    }
    if (this.#deployer) {
      this.#deployer.__setLogger(this.#logger);
    }
    if (this.#tts) {
      Object.keys(this.#tts).forEach(key => {
        this.#tts?.[key]?.__setLogger(this.#logger);
      });
    }
    if (this.#storage) {
      this.#storage.__setLogger(this.#logger);
    }
    if (this.#vectors) {
      Object.keys(this.#vectors).forEach(key => {
        this.#vectors?.[key]?.__setLogger(this.#logger);
      });
    }
    if (this.#mcpServers) {
      Object.keys(this.#mcpServers).forEach(key => {
        this.#mcpServers?.[key]?.__setLogger(this.#logger);
      });
    }
    const allTracingInstances = getAllAITracing();
    allTracingInstances.forEach(instance => {
      instance.__setLogger(this.#logger);
    });
  }
  setTelemetry(telemetry) {
    this.#telemetry = Telemetry.init(telemetry);
    if (this.#agents) {
      Object.keys(this.#agents).forEach(key => {
        if (this.#telemetry) {
          this.#agents?.[key]?.__setTelemetry(this.#telemetry);
        }
      });
    }
    if (this.#memory) {
      this.#memory = this.#telemetry.traceClass(this.#memory, {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      });
      this.#memory.__setTelemetry(this.#telemetry);
    }
    if (this.#deployer) {
      this.#deployer = this.#telemetry.traceClass(this.#deployer, {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      });
      this.#deployer.__setTelemetry(this.#telemetry);
    }
    if (this.#tts) {
      let tts = {};
      Object.entries(this.#tts).forEach(([key, ttsCl]) => {
        if (this.#telemetry) {
          tts[key] = this.#telemetry.traceClass(ttsCl, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          tts[key].__setTelemetry(this.#telemetry);
        }
      });
      this.#tts = tts;
    }
    if (this.#storage) {
      this.#storage = this.#telemetry.traceClass(this.#storage, {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      });
      this.#storage.__setTelemetry(this.#telemetry);
    }
    if (this.#vectors) {
      let vectors = {};
      Object.entries(this.#vectors).forEach(([key, vector]) => {
        if (this.#telemetry) {
          vectors[key] = this.#telemetry.traceClass(vector, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          vectors[key].__setTelemetry(this.#telemetry);
        }
      });
      this.#vectors = vectors;
    }
  }
  /**
   * Gets all registered text-to-speech (TTS) providers.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   tts: {
   *     openai: new OpenAITTS({
   *       apiKey: process.env.OPENAI_API_KEY,
   *       voice: 'alloy'
   *     })
   *   }
   * });
   *
   * const ttsProviders = mastra.getTTS();
   * const openaiTTS = ttsProviders?.openai;
   * if (openaiTTS) {
   *   const audioBuffer = await openaiTTS.synthesize('Hello, world!');
   * }
   * ```
   */
  getTTS() {
    return this.#tts;
  }
  /**
   * Gets the currently configured logger instance.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   logger: new PinoLogger({
   *     name: 'MyApp',
   *     level: 'info'
   *   })
   * });
   *
   * const logger = mastra.getLogger();
   * logger.info('Application started');
   * logger.error('An error occurred', { error: 'details' });
   * ```
   */
  getLogger() {
    return this.#logger;
  }
  /**
   * Gets the currently configured telemetry instance.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   telemetry: {
   *     enabled: true,
   *     serviceName: 'my-mastra-app'
   *   }
   * });
   *
   * const telemetry = mastra.getTelemetry();
   * if (telemetry) {
   *   const span = telemetry.startSpan('custom-operation');
   *   span.setAttributes({ operation: 'data-processing' });
   *   span.end();
   * }
   * ```
   *
   * @deprecated use {@link getAITracing()} instead
   */
  getTelemetry() {
    return this.#telemetry;
  }
  /**
   * Gets the currently configured memory instance.
   *
   * @deprecated Memory should be configured directly on agents instead of on the Mastra instance.
   * Use `new Agent({ memory: new Memory() })` instead.
   *
   * @example Legacy memory usage (deprecated)
   * ```typescript
   * // This approach is deprecated
   * const mastra = new Mastra({
   *   // memory: new Memory() // This is no longer supported
   * });
   *
   * // Use this instead:
   * const agent = new Agent({
   *   name: 'assistant',
   *   memory: new Memory({
   *     storage: new LibSQLStore({ url: ':memory:' })
   *   })
   * });
   * ```
   */
  getMemory() {
    return this.#memory;
  }
  /**
   * Gets the currently configured storage provider.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   storage: new LibSQLStore({ url: 'file:./data.db' })
   * });
   *
   * // Use the storage in agent memory
   * const agent = new Agent({
   *   name: 'assistant',
   *   memory: new Memory({
   *     storage: mastra.getStorage()
   *   })
   * });
   * ```
   */
  getStorage() {
    return this.#storage;
  }
  getServerMiddleware() {
    return this.#serverMiddleware;
  }
  getServerCache() {
    return this.#serverCache;
  }
  setServerMiddleware(serverMiddleware) {
    if (typeof serverMiddleware === "function") {
      this.#serverMiddleware = [{
        handler: serverMiddleware,
        path: "/api/*"
      }];
      return;
    }
    if (!Array.isArray(serverMiddleware)) {
      const error = new MastraError({
        id: "MASTRA_SET_SERVER_MIDDLEWARE_INVALID_TYPE",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: `Invalid middleware: expected a function or array, received ${typeof serverMiddleware}`
      });
      this.#logger?.trackException(error);
      throw error;
    }
    this.#serverMiddleware = serverMiddleware.map(m => {
      if (typeof m === "function") {
        return {
          handler: m,
          path: "/api/*"
        };
      }
      return {
        handler: m.handler,
        path: m.path || "/api/*"
      };
    });
  }
  getServer() {
    return this.#server;
  }
  getBundlerConfig() {
    return this.#bundler;
  }
  async getLogsByRunId({
    runId,
    transportId,
    fromDate,
    toDate,
    logLevel,
    filters,
    page,
    perPage
  }) {
    if (!transportId) {
      const error = new MastraError({
        id: "MASTRA_GET_LOGS_BY_RUN_ID_MISSING_TRANSPORT",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: "Transport ID is required",
        details: {
          runId,
          transportId
        }
      });
      this.#logger?.trackException(error);
      throw error;
    }
    if (!this.#logger?.getLogsByRunId) {
      const error = new MastraError({
        id: "MASTRA_GET_LOGS_BY_RUN_ID_LOGGER_NOT_CONFIGURED",
        domain: "MASTRA" /* MASTRA */,
        category: "SYSTEM" /* SYSTEM */,
        text: "Logger is not configured or does not support getLogsByRunId operation",
        details: {
          runId,
          transportId
        }
      });
      this.#logger?.trackException(error);
      throw error;
    }
    return await this.#logger.getLogsByRunId({
      runId,
      transportId,
      fromDate,
      toDate,
      logLevel,
      filters,
      page,
      perPage
    });
  }
  async getLogs(transportId, params) {
    if (!transportId) {
      const error = new MastraError({
        id: "MASTRA_GET_LOGS_MISSING_TRANSPORT",
        domain: "MASTRA" /* MASTRA */,
        category: "USER" /* USER */,
        text: "Transport ID is required",
        details: {
          transportId
        }
      });
      this.#logger?.trackException(error);
      throw error;
    }
    if (!this.#logger) {
      const error = new MastraError({
        id: "MASTRA_GET_LOGS_LOGGER_NOT_CONFIGURED",
        domain: "MASTRA" /* MASTRA */,
        category: "SYSTEM" /* SYSTEM */,
        text: "Logger is not set",
        details: {
          transportId
        }
      });
      throw error;
    }
    return await this.#logger.getLogs(transportId, params);
  }
  /**
   * Gets all registered Model Context Protocol (MCP) server instances.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   mcpServers: {
   *     filesystem: new FileSystemMCPServer({
   *       rootPath: '/app/data'
   *     })
   *   }
   * });
   *
   * const mcpServers = mastra.getMCPServers();
   * if (mcpServers) {
   *   const fsServer = mcpServers.filesystem;
   *   const tools = await fsServer.getTools();
   * }
   * ```
   */
  getMCPServers() {
    return this.#mcpServers;
  }
  /**
   * Retrieves a specific Model Context Protocol (MCP) server instance by its logical ID.
   *
   * This method searches for an MCP server using its logical ID. If a version is specified,
   * it returns the exact version match. If no version is provided, it returns the server
   * with the most recent release date.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   mcpServers: {
   *     filesystem: new FileSystemMCPServer({
   *       id: 'fs-server',
   *       version: '1.0.0',
   *       rootPath: '/app/data'
   *     })
   *   }
   * });
   *
   * const fsServer = mastra.getMCPServer('fs-server');
   * if (fsServer) {
   *   const tools = await fsServer.getTools();
   * }
   * ```
   */
  getMCPServer(serverId, version) {
    if (!this.#mcpServers) {
      return void 0;
    }
    const allRegisteredServers = Object.values(this.#mcpServers || {});
    const matchingLogicalIdServers = allRegisteredServers.filter(server => server.id === serverId);
    if (matchingLogicalIdServers.length === 0) {
      this.#logger?.debug(`No MCP servers found with logical ID: ${serverId}`);
      return void 0;
    }
    if (version) {
      const specificVersionServer = matchingLogicalIdServers.find(server => server.version === version);
      if (!specificVersionServer) {
        this.#logger?.debug(`MCP server with logical ID '${serverId}' found, but not version '${version}'.`);
      }
      return specificVersionServer;
    } else {
      if (matchingLogicalIdServers.length === 1) {
        return matchingLogicalIdServers[0];
      }
      matchingLogicalIdServers.sort((a, b) => {
        const dateAVal = a.releaseDate && typeof a.releaseDate === "string" ? new Date(a.releaseDate).getTime() : NaN;
        const dateBVal = b.releaseDate && typeof b.releaseDate === "string" ? new Date(b.releaseDate).getTime() : NaN;
        if (isNaN(dateAVal) && isNaN(dateBVal)) return 0;
        if (isNaN(dateAVal)) return 1;
        if (isNaN(dateBVal)) return -1;
        return dateBVal - dateAVal;
      });
      if (matchingLogicalIdServers.length > 0) {
        const latestServer = matchingLogicalIdServers[0];
        if (latestServer && latestServer.releaseDate && typeof latestServer.releaseDate === "string" && !isNaN(new Date(latestServer.releaseDate).getTime())) {
          return latestServer;
        }
      }
      this.#logger?.warn(`Could not determine the latest server for logical ID '${serverId}' due to invalid or missing release dates, or no servers left after filtering.`);
      return void 0;
    }
  }
  async addTopicListener(topic, listener) {
    await this.#pubsub.subscribe(topic, listener);
  }
  async removeTopicListener(topic, listener) {
    await this.#pubsub.unsubscribe(topic, listener);
  }
  async startEventEngine() {
    for (const topic in this.#events) {
      if (!this.#events[topic]) {
        continue;
      }
      const listeners = Array.isArray(this.#events[topic]) ? this.#events[topic] : [this.#events[topic]];
      for (const listener of listeners) {
        await this.#pubsub.subscribe(topic, listener);
      }
    }
  }
  async stopEventEngine() {
    for (const topic in this.#events) {
      if (!this.#events[topic]) {
        continue;
      }
      const listeners = Array.isArray(this.#events[topic]) ? this.#events[topic] : [this.#events[topic]];
      for (const listener of listeners) {
        await this.#pubsub.unsubscribe(topic, listener);
      }
    }
    await this.#pubsub.flush();
  }
  /**
   * Gracefully shuts down the Mastra instance and cleans up all resources.
   *
   * This method performs a clean shutdown of all Mastra components, including:
   * - AI tracing registry and all tracing instances
   * - Event engine and pub/sub system
   * - All registered components and their resources
   *
   * It's important to call this method when your application is shutting down
   * to ensure proper cleanup and prevent resource leaks.
   *
   * @example
   * ```typescript
   * const mastra = new Mastra({
   *   agents: { myAgent },
   *   workflows: { myWorkflow }
   * });
   *
   * // Graceful shutdown on SIGINT
   * process.on('SIGINT', async () => {
   *   await mastra.shutdown();
   *   process.exit(0);
   * });
   * ```
   */
  async shutdown() {
    await shutdownAITracingRegistry();
    await this.stopEventEngine();
    this.#logger?.info("Mastra shutdown completed");
  }
  // This method is only used internally for server hnadlers that require temporary persistence
  get serverCache() {
    return this.#serverCache;
  }
};
Mastra = /*@__PURE__*/(_ => {
  _init = __decoratorStart(null);
  Mastra = __decorateElement(_init, 0, "Mastra", _Mastra_decorators, Mastra);
  __runInitializers(_init, 1, Mastra);
  return Mastra;
})();

export { Mastra };
