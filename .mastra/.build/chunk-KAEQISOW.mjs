import { E as ExecutionEngine, W as Workflow, v as validateStepInput, g as getStepResult, S as STREAM_FORMAT_SYMBOL, a as EMITTER_SYMBOL, R as Run } from './workflows.mjs';
import { RuntimeContext } from './@mastra-core-runtime-context.mjs';
import { M as MastraError } from './error.mjs';
import { T as Tool } from './tools.mjs';
import { M as MastraBase, R as RegisteredLogger } from './_commonjsHelpers.mjs';
import EventEmitter from 'events';
import { randomUUID } from 'crypto';
import { z } from './zod.mjs';
import { A as AISpanType } from './ai-tracing.mjs';
import { o as objectType, s as stringType, r as recordType, e as enumType, a as anyType, n as numberType } from './v3.mjs';

var StepExecutor = class extends MastraBase {
  mastra;
  constructor({ mastra }) {
    super({ name: "StepExecutor", component: RegisteredLogger.WORKFLOW });
    this.mastra = mastra;
  }
  __registerMastra(mastra) {
    this.mastra = mastra;
  }
  async execute(params) {
    const { step, stepResults, runId, runtimeContext, runCount = 0 } = params;
    const abortController = new AbortController();
    let suspended;
    let bailed;
    const startedAt = Date.now();
    const { inputData, validationError } = await validateStepInput({
      prevOutput: typeof params.foreachIdx === "number" ? params.input?.[params.foreachIdx] : params.input,
      step,
      validateInputs: params.validateInputs ?? false
    });
    let stepInfo = {
      ...stepResults[step.id],
      startedAt,
      payload: (typeof params.foreachIdx === "number" ? params.input : inputData) ?? {}
    };
    if (params.resumeData) {
      delete stepInfo.suspendPayload?.["__workflow_meta"];
      stepInfo.resumePayload = params.resumeData;
      stepInfo.resumedAt = Date.now();
    }
    try {
      if (validationError) {
        throw validationError;
      }
      const stepResult = await step.execute({
        workflowId: params.workflowId,
        runId,
        mastra: this.mastra,
        runtimeContext,
        inputData,
        state: params.state,
        setState: (state) => {
          params.state = state;
        },
        runCount,
        resumeData: params.resumeData,
        getInitData: () => stepResults?.input,
        getStepResult: getStepResult.bind(this, stepResults),
        suspend: async (suspendPayload) => {
          suspended = { payload: { ...suspendPayload, __workflow_meta: { runId, path: [step.id] } } };
        },
        bail: (result) => {
          bailed = { payload: result };
        },
        // TODO
        writer: void 0,
        abort: () => {
          abortController?.abort();
        },
        [EMITTER_SYMBOL]: params.emitter,
        // TODO: refactor this to use our PubSub actually
        [STREAM_FORMAT_SYMBOL]: void 0,
        // TODO
        engine: {},
        abortSignal: abortController?.signal,
        // TODO
        tracingContext: {}
      });
      const endedAt = Date.now();
      let finalResult;
      if (suspended) {
        finalResult = {
          ...stepInfo,
          status: "suspended",
          suspendedAt: endedAt
        };
        if (suspended.payload) {
          finalResult.suspendPayload = suspended.payload;
        }
      } else if (bailed) {
        finalResult = {
          ...stepInfo,
          // @ts-ignore
          status: "bailed",
          endedAt,
          output: bailed.payload
        };
      } else {
        finalResult = {
          ...stepInfo,
          status: "success",
          endedAt,
          output: stepResult
        };
      }
      return finalResult;
    } catch (error) {
      const endedAt = Date.now();
      return {
        ...stepInfo,
        status: "failed",
        endedAt,
        error: error instanceof Error ? error?.stack ?? error.message : error
      };
    }
  }
  async evaluateConditions(params) {
    const { step, stepResults, runId, runtimeContext, runCount = 0 } = params;
    const abortController = new AbortController();
    const ee = new EventEmitter();
    const results = await Promise.all(
      step.conditions.map((condition) => {
        try {
          return this.evaluateCondition({
            workflowId: params.workflowId,
            condition,
            runId,
            runtimeContext,
            inputData: params.input,
            state: params.state,
            runCount,
            resumeData: params.resumeData,
            abortController,
            stepResults,
            emitter: ee,
            iterationCount: 0
          });
        } catch (e) {
          console.error("error evaluating condition", e);
          return false;
        }
      })
    );
    const idxs = results.reduce((acc, result, idx) => {
      if (result) {
        acc.push(idx);
      }
      return acc;
    }, []);
    return idxs;
  }
  async evaluateCondition({
    workflowId,
    condition,
    runId,
    inputData,
    resumeData,
    stepResults,
    state,
    runtimeContext,
    emitter,
    abortController,
    runCount = 0,
    iterationCount
  }) {
    return condition({
      workflowId,
      runId,
      mastra: this.mastra,
      runtimeContext,
      inputData,
      state,
      setState: (_state) => {
      },
      runCount,
      resumeData,
      getInitData: () => stepResults?.input,
      getStepResult: getStepResult.bind(this, stepResults),
      suspend: async (_suspendPayload) => {
        throw new Error("Not implemented");
      },
      bail: (_result) => {
        throw new Error("Not implemented");
      },
      // TODO
      writer: void 0,
      abort: () => {
        abortController?.abort();
      },
      [EMITTER_SYMBOL]: emitter,
      // TODO: refactor this to use our PubSub actually
      [STREAM_FORMAT_SYMBOL]: void 0,
      // TODO
      engine: {},
      abortSignal: abortController?.signal,
      // TODO
      tracingContext: {},
      iterationCount
    });
  }
  async resolveSleep(params) {
    const { step, stepResults, runId, runtimeContext, runCount = 0 } = params;
    const abortController = new AbortController();
    const ee = new EventEmitter();
    if (step.duration) {
      return step.duration;
    }
    if (!step.fn) {
      return 0;
    }
    try {
      return await step.fn({
        workflowId: params.workflowId,
        runId,
        mastra: this.mastra,
        runtimeContext,
        inputData: params.input,
        // TODO: implement state
        state: {},
        setState: (_state) => {
        },
        runCount,
        resumeData: params.resumeData,
        getInitData: () => stepResults?.input,
        getStepResult: getStepResult.bind(this, stepResults),
        suspend: async (_suspendPayload) => {
          throw new Error("Not implemented");
        },
        bail: (_result) => {
          throw new Error("Not implemented");
        },
        abort: () => {
          abortController?.abort();
        },
        // TODO
        writer: void 0,
        [EMITTER_SYMBOL]: ee,
        // TODO: refactor this to use our PubSub actually
        [STREAM_FORMAT_SYMBOL]: void 0,
        // TODO
        engine: {},
        abortSignal: abortController?.signal,
        // TODO
        tracingContext: {}
      });
    } catch (e) {
      console.error("error evaluating condition", e);
      return 0;
    }
  }
  async resolveSleepUntil(params) {
    const { step, stepResults, runId, runtimeContext, runCount = 0 } = params;
    const abortController = new AbortController();
    const ee = new EventEmitter();
    if (step.date) {
      return step.date.getTime() - Date.now();
    }
    if (!step.fn) {
      return 0;
    }
    try {
      const result = await step.fn({
        workflowId: params.workflowId,
        runId,
        mastra: this.mastra,
        runtimeContext,
        inputData: params.input,
        // TODO: implement state
        state: {},
        setState: (_state) => {
        },
        runCount,
        resumeData: params.resumeData,
        getInitData: () => stepResults?.input,
        getStepResult: getStepResult.bind(this, stepResults),
        suspend: async (_suspendPayload) => {
          throw new Error("Not implemented");
        },
        bail: (_result) => {
          throw new Error("Not implemented");
        },
        abort: () => {
          abortController?.abort();
        },
        // TODO
        writer: void 0,
        [EMITTER_SYMBOL]: ee,
        // TODO: refactor this to use our PubSub actually
        [STREAM_FORMAT_SYMBOL]: void 0,
        // TODO
        engine: {},
        abortSignal: abortController?.signal,
        // TODO
        tracingContext: {}
      });
      return result.getTime() - Date.now();
    } catch (e) {
      console.error("error evaluating condition", e);
      return 0;
    }
  }
};

// src/events/processor.ts
var EventProcessor = class {
  mastra;
  __registerMastra(mastra) {
    this.mastra = mastra;
  }
  constructor({ mastra }) {
    this.mastra = mastra;
  }
};
async function processWorkflowLoop({
  workflowId,
  prevResult,
  runId,
  executionPath,
  stepResults,
  activeSteps,
  resumeSteps,
  resumeData,
  parentWorkflow,
  runtimeContext,
  runCount = 0
}, {
  pubsub,
  stepExecutor,
  step,
  stepResult
}) {
  const loopCondition = await stepExecutor.evaluateCondition({
    workflowId,
    condition: step.condition,
    runId,
    stepResults,
    // TODO: implement state
    state: {},
    emitter: new EventEmitter(),
    // TODO
    runtimeContext: new RuntimeContext(),
    // TODO
    inputData: prevResult?.status === "success" ? prevResult.output : void 0,
    resumeData,
    abortController: new AbortController(),
    runCount,
    iterationCount: 0
    //TODO: implement
  });
  if (step.loopType === "dountil") {
    if (loopCondition) {
      await pubsub.publish("workflows", {
        type: "workflow.step.end",
        runId,
        data: {
          parentWorkflow,
          workflowId,
          runId,
          executionPath,
          resumeSteps,
          stepResults,
          prevResult: stepResult,
          resumeData,
          activeSteps,
          runtimeContext
        }
      });
    } else {
      await pubsub.publish("workflows", {
        type: "workflow.step.run",
        runId,
        data: {
          parentWorkflow,
          workflowId,
          runId,
          executionPath,
          resumeSteps,
          stepResults,
          prevResult: stepResult,
          resumeData,
          activeSteps,
          runtimeContext,
          runCount
        }
      });
    }
  } else {
    if (loopCondition) {
      await pubsub.publish("workflows", {
        type: "workflow.step.run",
        runId,
        data: {
          parentWorkflow,
          workflowId,
          runId,
          executionPath,
          resumeSteps,
          stepResults,
          prevResult: stepResult,
          resumeData,
          activeSteps,
          runtimeContext,
          runCount
        }
      });
    } else {
      await pubsub.publish("workflows", {
        type: "workflow.step.end",
        runId,
        data: {
          parentWorkflow,
          workflowId,
          runId,
          executionPath,
          resumeSteps,
          stepResults,
          prevResult: stepResult,
          resumeData,
          activeSteps,
          runtimeContext
        }
      });
    }
  }
}
async function processWorkflowForEach({
  workflowId,
  prevResult,
  runId,
  executionPath,
  stepResults,
  activeSteps,
  resumeSteps,
  resumeData,
  parentWorkflow,
  runtimeContext
}, {
  pubsub,
  mastra,
  step
}) {
  const currentResult = stepResults[step.step.id];
  const idx = currentResult?.output?.length ?? 0;
  const targetLen = prevResult?.output?.length ?? 0;
  if (idx >= targetLen && currentResult.output.filter((r) => r !== null).length >= targetLen) {
    await pubsub.publish("workflows", {
      type: "workflow.step.run",
      runId,
      data: {
        parentWorkflow,
        workflowId,
        runId,
        executionPath: executionPath.slice(0, -1).concat([executionPath[executionPath.length - 1] + 1]),
        resumeSteps,
        stepResults,
        prevResult: currentResult,
        resumeData,
        activeSteps,
        runtimeContext
      }
    });
    return;
  } else if (idx >= targetLen) {
    return;
  }
  if (executionPath.length === 1 && idx === 0) {
    const concurrency = Math.min(step.opts.concurrency ?? 1, targetLen);
    const dummyResult = Array.from({ length: concurrency }, () => null);
    await mastra.getStorage()?.updateWorkflowResults({
      workflowName: workflowId,
      runId,
      stepId: step.step.id,
      result: {
        status: "succcess",
        output: dummyResult,
        startedAt: Date.now(),
        payload: prevResult?.output
      },
      runtimeContext
    });
    for (let i = 0; i < concurrency; i++) {
      await pubsub.publish("workflows", {
        type: "workflow.step.run",
        runId,
        data: {
          parentWorkflow,
          workflowId,
          runId,
          executionPath: [executionPath[0], i],
          resumeSteps,
          stepResults,
          prevResult,
          resumeData,
          activeSteps,
          runtimeContext
        }
      });
    }
    return;
  }
  currentResult.output.push(null);
  await mastra.getStorage()?.updateWorkflowResults({
    workflowName: workflowId,
    runId,
    stepId: step.step.id,
    result: {
      status: "succcess",
      output: currentResult.output,
      startedAt: Date.now(),
      payload: prevResult?.output
    },
    runtimeContext
  });
  await pubsub.publish("workflows", {
    type: "workflow.step.run",
    runId,
    data: {
      parentWorkflow,
      workflowId,
      runId,
      executionPath: [executionPath[0], idx],
      resumeSteps,
      stepResults,
      prevResult,
      resumeData,
      activeSteps,
      runtimeContext
    }
  });
}
async function processWorkflowParallel({
  workflowId,
  runId,
  executionPath,
  stepResults,
  activeSteps,
  resumeSteps,
  prevResult,
  resumeData,
  parentWorkflow,
  runtimeContext
}, {
  pubsub,
  step
}) {
  for (let i = 0; i < step.steps.length; i++) {
    const nestedStep = step.steps[i];
    if (nestedStep?.type === "step") {
      activeSteps[nestedStep.step.id] = true;
    }
  }
  await Promise.all(
    step.steps.map(async (_step, idx) => {
      return pubsub.publish("workflows", {
        type: "workflow.step.run",
        runId,
        data: {
          workflowId,
          runId,
          executionPath: executionPath.concat([idx]),
          resumeSteps,
          stepResults,
          prevResult,
          resumeData,
          parentWorkflow,
          activeSteps,
          runtimeContext
        }
      });
    })
  );
}
async function processWorkflowConditional({
  workflowId,
  runId,
  executionPath,
  stepResults,
  activeSteps,
  resumeSteps,
  prevResult,
  resumeData,
  parentWorkflow,
  runtimeContext
}, {
  pubsub,
  stepExecutor,
  step
}) {
  const idxs = await stepExecutor.evaluateConditions({
    workflowId,
    step,
    runId,
    stepResults,
    // TODO: implement state
    state: {},
    emitter: new EventEmitter(),
    // TODO
    runtimeContext: new RuntimeContext(),
    // TODO
    input: prevResult?.status === "success" ? prevResult.output : void 0,
    resumeData
  });
  const truthyIdxs = {};
  for (let i = 0; i < idxs.length; i++) {
    truthyIdxs[idxs[i]] = true;
  }
  await Promise.all(
    step.steps.map(async (step2, idx) => {
      if (truthyIdxs[idx]) {
        if (step2?.type === "step") {
          activeSteps[step2.step.id] = true;
        }
        return pubsub.publish("workflows", {
          type: "workflow.step.run",
          runId,
          data: {
            workflowId,
            runId,
            executionPath: executionPath.concat([idx]),
            resumeSteps,
            stepResults,
            prevResult,
            resumeData,
            parentWorkflow,
            activeSteps,
            runtimeContext
          }
        });
      } else {
        return pubsub.publish("workflows", {
          type: "workflow.step.end",
          runId,
          data: {
            workflowId,
            runId,
            executionPath: executionPath.concat([idx]),
            resumeSteps,
            stepResults,
            prevResult: { status: "skipped" },
            resumeData,
            parentWorkflow,
            activeSteps,
            runtimeContext
          }
        });
      }
    })
  );
}
async function processWorkflowWaitForEvent(workflowData, {
  pubsub,
  eventName,
  currentState
}) {
  const executionPath = currentState?.waitingPaths[eventName];
  if (!executionPath) {
    return;
  }
  const currentStep = getStep(workflowData.workflow, executionPath);
  const prevResult = {
    status: "success",
    output: currentState?.context[currentStep?.id ?? "input"]?.payload
  };
  await pubsub.publish("workflows", {
    type: "workflow.step.run",
    runId: workflowData.runId,
    data: {
      workflowId: workflowData.workflowId,
      runId: workflowData.runId,
      executionPath,
      resumeSteps: [],
      resumeData: workflowData.resumeData,
      parentWorkflow: workflowData.parentWorkflow,
      stepResults: currentState?.context,
      prevResult,
      activeSteps: [],
      runtimeContext: currentState?.runtimeContext
    }
  });
}
async function processWorkflowSleep({
  workflowId,
  runId,
  executionPath,
  stepResults,
  activeSteps,
  resumeSteps,
  prevResult,
  resumeData,
  parentWorkflow,
  runtimeContext
}, {
  pubsub,
  stepExecutor,
  step
}) {
  const startedAt = Date.now();
  await pubsub.publish(`workflow.events.v2.${runId}`, {
    type: "watch",
    runId,
    data: {
      type: "workflow-step-waiting",
      payload: {
        id: step.id,
        status: "waiting",
        payload: prevResult.status === "success" ? prevResult.output : void 0,
        startedAt
      }
    }
  });
  const duration = await stepExecutor.resolveSleep({
    workflowId,
    step,
    runId,
    stepResults,
    emitter: new EventEmitter(),
    // TODO
    runtimeContext: new RuntimeContext(),
    // TODO
    input: prevResult?.status === "success" ? prevResult.output : void 0,
    resumeData
  });
  setTimeout(
    async () => {
      await pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "workflow-step-result",
          payload: {
            id: step.id,
            status: "success",
            payload: prevResult.status === "success" ? prevResult.output : void 0,
            output: prevResult.status === "success" ? prevResult.output : void 0,
            startedAt,
            endedAt: Date.now()
          }
        }
      });
      await pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "workflow-step-finish",
          payload: {
            id: step.id,
            metadata: {}
          }
        }
      });
      await pubsub.publish("workflows", {
        type: "workflow.step.run",
        runId,
        data: {
          workflowId,
          runId,
          executionPath: executionPath.slice(0, -1).concat([executionPath[executionPath.length - 1] + 1]),
          resumeSteps,
          stepResults,
          prevResult,
          resumeData,
          parentWorkflow,
          activeSteps,
          runtimeContext
        }
      });
    },
    duration < 0 ? 0 : duration
  );
}
async function processWorkflowSleepUntil({
  workflowId,
  runId,
  executionPath,
  stepResults,
  activeSteps,
  resumeSteps,
  prevResult,
  resumeData,
  parentWorkflow,
  runtimeContext
}, {
  pubsub,
  stepExecutor,
  step
}) {
  const startedAt = Date.now();
  const duration = await stepExecutor.resolveSleepUntil({
    workflowId,
    step,
    runId,
    stepResults,
    emitter: new EventEmitter(),
    // TODO
    runtimeContext: new RuntimeContext(),
    // TODO
    input: prevResult?.status === "success" ? prevResult.output : void 0,
    resumeData
  });
  await pubsub.publish(`workflow.events.v2.${runId}`, {
    type: "watch",
    runId,
    data: {
      type: "workflow-step-waiting",
      payload: {
        id: step.id,
        status: "waiting",
        payload: prevResult.status === "success" ? prevResult.output : void 0,
        startedAt
      }
    }
  });
  setTimeout(
    async () => {
      await pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "workflow-step-result",
          payload: {
            id: step.id,
            status: "success",
            payload: prevResult.status === "success" ? prevResult.output : void 0,
            output: prevResult.status === "success" ? prevResult.output : void 0,
            startedAt,
            endedAt: Date.now()
          }
        }
      });
      await pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "workflow-step-finish",
          payload: {
            id: step.id,
            metadata: {}
          }
        }
      });
      await pubsub.publish("workflows", {
        type: "workflow.step.run",
        runId,
        data: {
          workflowId,
          runId,
          executionPath: executionPath.slice(0, -1).concat([executionPath[executionPath.length - 1] + 1]),
          resumeSteps,
          stepResults,
          prevResult,
          resumeData,
          parentWorkflow,
          activeSteps,
          runtimeContext
        }
      });
    },
    duration < 0 ? 0 : duration
  );
}

// src/workflows/evented/workflow-event-processor/index.ts
var WorkflowEventProcessor = class extends EventProcessor {
  stepExecutor;
  constructor({ mastra }) {
    super({ mastra });
    this.stepExecutor = new StepExecutor({ mastra });
  }
  __registerMastra(mastra) {
    super.__registerMastra(mastra);
    this.stepExecutor.__registerMastra(mastra);
  }
  async errorWorkflow({
    parentWorkflow,
    workflowId,
    runId,
    resumeSteps,
    stepResults,
    resumeData,
    runtimeContext
  }, e) {
    await this.mastra.pubsub.publish("workflows", {
      type: "workflow.fail",
      runId,
      data: {
        workflowId,
        runId,
        executionPath: [],
        resumeSteps,
        stepResults,
        prevResult: { status: "failed", error: e.stack ?? e.message },
        runtimeContext,
        resumeData,
        activeSteps: {},
        parentWorkflow
      }
    });
  }
  async processWorkflowCancel({ workflowId, runId }) {
    const currentState = await this.mastra.getStorage()?.updateWorkflowState({
      workflowName: workflowId,
      runId,
      opts: {
        status: "canceled"
      }
    });
    await this.endWorkflow({
      workflow: void 0,
      workflowId,
      runId,
      stepResults: currentState?.context,
      prevResult: { status: "canceled" },
      runtimeContext: currentState?.runtimeContext,
      executionPath: [],
      activeSteps: {},
      resumeSteps: [],
      resumeData: void 0,
      parentWorkflow: void 0
    });
  }
  async processWorkflowStart({
    workflow,
    parentWorkflow,
    workflowId,
    runId,
    resumeSteps,
    prevResult,
    resumeData,
    executionPath,
    stepResults,
    runtimeContext
  }) {
    await this.mastra.getStorage()?.persistWorkflowSnapshot({
      workflowName: workflow.id,
      runId,
      snapshot: {
        activePaths: [],
        suspendedPaths: {},
        resumeLabels: {},
        waitingPaths: {},
        serializedStepGraph: workflow.serializedStepGraph,
        timestamp: Date.now(),
        runId,
        status: "running",
        context: stepResults ?? {
          input: prevResult?.status === "success" ? prevResult.output : void 0
        },
        value: {}
      }
    });
    await this.mastra.pubsub.publish("workflows", {
      type: "workflow.step.run",
      runId,
      data: {
        parentWorkflow,
        workflowId,
        runId,
        executionPath: executionPath ?? [0],
        resumeSteps,
        stepResults: stepResults ?? {
          input: prevResult?.status === "success" ? prevResult.output : void 0
        },
        prevResult,
        runtimeContext,
        resumeData,
        activeSteps: {}
      }
    });
  }
  async endWorkflow(args) {
    const { stepResults, workflowId, runId, prevResult } = args;
    await this.mastra.getStorage()?.updateWorkflowState({
      workflowName: workflowId,
      runId,
      opts: {
        status: "success",
        result: prevResult
      }
    });
    await this.mastra.pubsub.publish(`workflow.events.${runId}`, {
      type: "watch",
      runId,
      data: {
        type: "watch",
        payload: {
          currentStep: void 0,
          workflowState: {
            status: prevResult.status,
            steps: stepResults,
            result: prevResult.status === "success" ? prevResult.output : null,
            error: prevResult.error ?? null
          }
        },
        eventTimestamp: Date.now()
      }
    });
    await this.mastra.pubsub.publish(`workflow.events.v2.${runId}`, {
      type: "watch",
      runId,
      data: {
        type: "workflow-finish",
        payload: {
          runId
        }
      }
    });
    await this.mastra.pubsub.publish("workflows", {
      type: "workflow.end",
      runId,
      data: { ...args, workflow: void 0 }
    });
  }
  async processWorkflowEnd(args) {
    const { resumeSteps, prevResult, resumeData, parentWorkflow, activeSteps, runtimeContext, runId } = args;
    if (parentWorkflow) {
      await this.mastra.pubsub.publish("workflows", {
        type: "workflow.step.end",
        runId,
        data: {
          workflowId: parentWorkflow.workflowId,
          runId: parentWorkflow.runId,
          executionPath: parentWorkflow.executionPath,
          resumeSteps,
          stepResults: parentWorkflow.stepResults,
          prevResult,
          resumeData,
          activeSteps,
          parentWorkflow: parentWorkflow.parentWorkflow,
          parentContext: parentWorkflow,
          runtimeContext
        }
      });
    }
    await this.mastra.pubsub.publish("workflows-finish", {
      type: "workflow.end",
      runId,
      data: { ...args, workflow: void 0 }
    });
  }
  async processWorkflowSuspend(args) {
    const { resumeSteps, prevResult, resumeData, parentWorkflow, activeSteps, runId, runtimeContext } = args;
    if (parentWorkflow) {
      await this.mastra.pubsub.publish("workflows", {
        type: "workflow.step.end",
        runId,
        data: {
          workflowId: parentWorkflow.workflowId,
          runId: parentWorkflow.runId,
          executionPath: parentWorkflow.executionPath,
          resumeSteps,
          stepResults: parentWorkflow.stepResults,
          prevResult: {
            ...prevResult,
            suspendPayload: {
              ...prevResult.suspendPayload,
              __workflow_meta: {
                runId,
                path: parentWorkflow?.stepId ? [parentWorkflow.stepId].concat(prevResult.suspendPayload?.__workflow_meta?.path ?? []) : prevResult.suspendPayload?.__workflow_meta?.path ?? []
              }
            }
          },
          resumeData,
          activeSteps,
          runtimeContext,
          parentWorkflow: parentWorkflow.parentWorkflow,
          parentContext: parentWorkflow
        }
      });
    }
    await this.mastra.pubsub.publish("workflows-finish", {
      type: "workflow.suspend",
      runId,
      data: { ...args, workflow: void 0 }
    });
  }
  async processWorkflowFail(args) {
    const { workflowId, runId, resumeSteps, prevResult, resumeData, parentWorkflow, activeSteps, runtimeContext } = args;
    await this.mastra.getStorage()?.updateWorkflowState({
      workflowName: workflowId,
      runId,
      opts: {
        status: "failed",
        error: prevResult.error
      }
    });
    if (parentWorkflow) {
      await this.mastra.pubsub.publish("workflows", {
        type: "workflow.step.end",
        runId,
        data: {
          workflowId: parentWorkflow.workflowId,
          runId: parentWorkflow.runId,
          executionPath: parentWorkflow.executionPath,
          resumeSteps,
          stepResults: parentWorkflow.stepResults,
          prevResult,
          resumeData,
          activeSteps,
          runtimeContext,
          parentWorkflow: parentWorkflow.parentWorkflow,
          parentContext: parentWorkflow
        }
      });
    }
    await this.mastra.pubsub.publish("workflows-finish", {
      type: "workflow.fail",
      runId,
      data: { ...args, workflow: void 0 }
    });
  }
  async processWorkflowStepRun({
    workflow,
    workflowId,
    runId,
    executionPath,
    stepResults,
    activeSteps,
    resumeSteps,
    prevResult,
    resumeData,
    parentWorkflow,
    runtimeContext,
    runCount = 0
  }) {
    let stepGraph = workflow.stepGraph;
    if (!executionPath?.length) {
      return this.errorWorkflow(
        {
          workflowId,
          runId,
          executionPath,
          stepResults,
          activeSteps,
          resumeSteps,
          prevResult,
          resumeData,
          parentWorkflow,
          runtimeContext
        },
        new MastraError({
          id: "MASTRA_WORKFLOW",
          text: `Execution path is empty: ${JSON.stringify(executionPath)}`,
          domain: "MASTRA_WORKFLOW" /* MASTRA_WORKFLOW */,
          category: "SYSTEM" /* SYSTEM */
        })
      );
    }
    let step = stepGraph[executionPath[0]];
    if (!step) {
      return this.errorWorkflow(
        {
          workflowId,
          runId,
          executionPath,
          stepResults,
          activeSteps,
          resumeSteps,
          prevResult,
          resumeData,
          parentWorkflow,
          runtimeContext
        },
        new MastraError({
          id: "MASTRA_WORKFLOW",
          text: `Step not found in step graph: ${JSON.stringify(executionPath)}`,
          domain: "MASTRA_WORKFLOW" /* MASTRA_WORKFLOW */,
          category: "SYSTEM" /* SYSTEM */
        })
      );
    }
    if ((step.type === "parallel" || step.type === "conditional") && executionPath.length > 1) {
      step = step.steps[executionPath[1]];
    } else if (step.type === "parallel") {
      return processWorkflowParallel(
        {
          workflowId,
          runId,
          executionPath,
          stepResults,
          activeSteps,
          resumeSteps,
          prevResult,
          resumeData,
          parentWorkflow,
          runtimeContext
        },
        {
          pubsub: this.mastra.pubsub,
          step
        }
      );
    } else if (step?.type === "conditional") {
      return processWorkflowConditional(
        {
          workflowId,
          runId,
          executionPath,
          stepResults,
          activeSteps,
          resumeSteps,
          prevResult,
          resumeData,
          parentWorkflow,
          runtimeContext
        },
        {
          pubsub: this.mastra.pubsub,
          stepExecutor: this.stepExecutor,
          step
        }
      );
    } else if (step?.type === "sleep") {
      return processWorkflowSleep(
        {
          workflowId,
          runId,
          executionPath,
          stepResults,
          activeSteps,
          resumeSteps,
          prevResult,
          resumeData,
          parentWorkflow,
          runtimeContext
        },
        {
          pubsub: this.mastra.pubsub,
          stepExecutor: this.stepExecutor,
          step
        }
      );
    } else if (step?.type === "sleepUntil") {
      return processWorkflowSleepUntil(
        {
          workflowId,
          runId,
          executionPath,
          stepResults,
          activeSteps,
          resumeSteps,
          prevResult,
          resumeData,
          parentWorkflow,
          runtimeContext
        },
        {
          pubsub: this.mastra.pubsub,
          stepExecutor: this.stepExecutor,
          step
        }
      );
    } else if (step?.type === "waitForEvent" && !resumeData) {
      await this.mastra.getStorage()?.updateWorkflowResults({
        workflowName: workflowId,
        runId,
        stepId: step.step.id,
        result: {
          startedAt: Date.now(),
          status: "waiting",
          payload: prevResult.status === "success" ? prevResult.output : void 0
        },
        runtimeContext
      });
      await this.mastra.getStorage()?.updateWorkflowState({
        workflowName: workflowId,
        runId,
        opts: {
          status: "waiting",
          waitingPaths: {
            [step.event]: executionPath
          }
        }
      });
      await this.mastra.pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "workflow-step-waiting",
          payload: {
            id: step.step.id,
            status: "waiting",
            payload: prevResult.status === "success" ? prevResult.output : void 0,
            startedAt: Date.now()
          }
        }
      });
      return;
    } else if (step?.type === "foreach" && executionPath.length === 1) {
      return processWorkflowForEach(
        {
          workflowId,
          runId,
          executionPath,
          stepResults,
          activeSteps,
          resumeSteps,
          prevResult,
          resumeData,
          parentWorkflow,
          runtimeContext
        },
        {
          pubsub: this.mastra.pubsub,
          mastra: this.mastra,
          step
        }
      );
    }
    if (!isExecutableStep(step)) {
      return this.errorWorkflow(
        {
          workflowId,
          runId,
          executionPath,
          stepResults,
          activeSteps,
          resumeSteps,
          prevResult,
          resumeData,
          parentWorkflow,
          runtimeContext
        },
        new MastraError({
          id: "MASTRA_WORKFLOW",
          text: `Step is not executable: ${step?.type} -- ${JSON.stringify(executionPath)}`,
          domain: "MASTRA_WORKFLOW" /* MASTRA_WORKFLOW */,
          category: "SYSTEM" /* SYSTEM */
        })
      );
    }
    activeSteps[step.step.id] = true;
    if (step.step instanceof EventedWorkflow) {
      if (resumeSteps?.length > 1) {
        const stepData = stepResults[step.step.id];
        const nestedRunId = stepData?.suspendPayload?.__workflow_meta?.runId;
        if (!nestedRunId) {
          return this.errorWorkflow(
            {
              workflowId,
              runId,
              executionPath,
              stepResults,
              activeSteps,
              resumeSteps,
              prevResult,
              resumeData,
              parentWorkflow,
              runtimeContext
            },
            new MastraError({
              id: "MASTRA_WORKFLOW",
              text: `Nested workflow run id not found: ${JSON.stringify(stepResults)}`,
              domain: "MASTRA_WORKFLOW" /* MASTRA_WORKFLOW */,
              category: "SYSTEM" /* SYSTEM */
            })
          );
        }
        const snapshot = await this.mastra?.getStorage()?.loadWorkflowSnapshot({
          workflowName: step.step.id,
          runId: nestedRunId
        });
        const nestedStepResults = snapshot?.context;
        const nestedSteps = resumeSteps.slice(1);
        await this.mastra.pubsub.publish("workflows", {
          type: "workflow.resume",
          runId,
          data: {
            workflowId: step.step.id,
            parentWorkflow: {
              stepId: step.step.id,
              workflowId,
              runId,
              executionPath,
              resumeSteps,
              stepResults,
              input: prevResult,
              parentWorkflow
            },
            executionPath: snapshot?.suspendedPaths?.[nestedSteps[0]],
            runId: nestedRunId,
            resumeSteps: nestedSteps,
            stepResults: nestedStepResults,
            prevResult,
            resumeData,
            activeSteps,
            runtimeContext
          }
        });
      } else {
        await this.mastra.pubsub.publish("workflows", {
          type: "workflow.start",
          runId,
          data: {
            workflowId: step.step.id,
            parentWorkflow: {
              stepId: step.step.id,
              workflowId,
              runId,
              executionPath,
              resumeSteps,
              stepResults,
              input: prevResult,
              parentWorkflow
            },
            executionPath: [0],
            runId: randomUUID(),
            resumeSteps,
            prevResult,
            resumeData,
            activeSteps,
            runtimeContext
          }
        });
      }
      return;
    }
    if (step.type === "step" || step.type === "waitForEvent") {
      await this.mastra.pubsub.publish(`workflow.events.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "watch",
          payload: {
            currentStep: { id: step.step.id, status: "running" },
            workflowState: {
              status: "running",
              steps: stepResults,
              error: null,
              result: null
            }
          },
          eventTimestamp: Date.now()
        }
      });
      await this.mastra.pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "workflow-step-start",
          payload: {
            id: step.step.id,
            startedAt: Date.now(),
            payload: prevResult.status === "success" ? prevResult.output : void 0,
            status: "running"
          }
        }
      });
    }
    const ee = new EventEmitter();
    ee.on("watch-v2", async (event) => {
      await this.mastra.pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: event
      });
    });
    const rc = new RuntimeContext();
    for (const [key, value] of Object.entries(runtimeContext)) {
      rc.set(key, value);
    }
    const stepResult = await this.stepExecutor.execute({
      workflowId,
      step: step.step,
      runId,
      stepResults,
      // TODO: implement state
      state: {},
      emitter: ee,
      runtimeContext: rc,
      input: prevResult?.output,
      resumeData: step.type === "waitForEvent" || resumeSteps?.length === 1 && resumeSteps?.[0] === step.step.id ? resumeData : void 0,
      runCount,
      foreachIdx: step.type === "foreach" ? executionPath[1] : void 0,
      validateInputs: workflow.options.validateInputs
    });
    runtimeContext = Object.fromEntries(rc.entries());
    if (stepResult.status === "bailed") {
      stepResult.status = "success";
      await this.endWorkflow({
        workflow,
        resumeData,
        parentWorkflow,
        workflowId,
        runId,
        executionPath,
        resumeSteps,
        stepResults: {
          ...stepResults,
          [step.step.id]: stepResult
        },
        prevResult: stepResult,
        activeSteps,
        runtimeContext
      });
      return;
    }
    if (stepResult.status === "failed") {
      if (runCount >= (workflow.retryConfig.attempts ?? 0)) {
        await this.mastra.pubsub.publish("workflows", {
          type: "workflow.step.end",
          runId,
          data: {
            parentWorkflow,
            workflowId,
            runId,
            executionPath,
            resumeSteps,
            stepResults,
            prevResult: stepResult,
            activeSteps,
            runtimeContext
          }
        });
      } else {
        return this.mastra.pubsub.publish("workflows", {
          type: "workflow.step.run",
          runId,
          data: {
            parentWorkflow,
            workflowId,
            runId,
            executionPath,
            resumeSteps,
            stepResults,
            prevResult,
            activeSteps,
            runtimeContext,
            runCount: runCount + 1
          }
        });
      }
    }
    if (step.type === "loop") {
      await processWorkflowLoop(
        {
          workflowId,
          prevResult: stepResult,
          runId,
          executionPath,
          stepResults,
          activeSteps,
          resumeSteps,
          resumeData,
          parentWorkflow,
          runtimeContext,
          runCount: runCount + 1
        },
        {
          pubsub: this.mastra.pubsub,
          stepExecutor: this.stepExecutor,
          step,
          stepResult
        }
      );
    } else {
      await this.mastra.pubsub.publish("workflows", {
        type: "workflow.step.end",
        runId,
        data: {
          parentWorkflow,
          workflowId,
          runId,
          executionPath,
          resumeSteps,
          stepResults,
          prevResult: stepResult,
          activeSteps,
          runtimeContext
        }
      });
    }
  }
  async processWorkflowStepEnd({
    workflow,
    workflowId,
    runId,
    executionPath,
    resumeSteps,
    prevResult,
    parentWorkflow,
    stepResults,
    activeSteps,
    parentContext,
    runtimeContext
  }) {
    let step = workflow.stepGraph[executionPath[0]];
    if ((step?.type === "parallel" || step?.type === "conditional") && executionPath.length > 1) {
      step = step.steps[executionPath[1]];
    }
    if (!step) {
      return this.errorWorkflow(
        {
          workflowId,
          runId,
          executionPath,
          resumeSteps,
          prevResult,
          stepResults,
          activeSteps,
          runtimeContext
        },
        new MastraError({
          id: "MASTRA_WORKFLOW",
          text: `Step not found: ${JSON.stringify(executionPath)}`,
          domain: "MASTRA_WORKFLOW" /* MASTRA_WORKFLOW */,
          category: "SYSTEM" /* SYSTEM */
        })
      );
    }
    if (step.type === "foreach") {
      const snapshot = await this.mastra.getStorage()?.loadWorkflowSnapshot({
        workflowName: workflowId,
        runId
      });
      const currentIdx = executionPath[1];
      const currentResult = snapshot?.context?.[step.step.id]?.output;
      let newResult = prevResult;
      if (currentIdx !== void 0) {
        if (currentResult) {
          currentResult[currentIdx] = prevResult.output;
          newResult = { ...prevResult, output: currentResult };
        } else {
          newResult = { ...prevResult, output: [prevResult.output] };
        }
      }
      const newStepResults = await this.mastra.getStorage()?.updateWorkflowResults({
        workflowName: workflow.id,
        runId,
        stepId: step.step.id,
        result: newResult,
        runtimeContext
      });
      if (!newStepResults) {
        return;
      }
      stepResults = newStepResults;
    } else if (isExecutableStep(step)) {
      delete activeSteps[step.step.id];
      if (parentContext) {
        prevResult = stepResults[step.step.id] = {
          ...prevResult,
          payload: parentContext.input?.output ?? {}
        };
      }
      const newStepResults = await this.mastra.getStorage()?.updateWorkflowResults({
        workflowName: workflow.id,
        runId,
        stepId: step.step.id,
        result: prevResult,
        runtimeContext
      });
      if (!newStepResults) {
        return;
      }
      stepResults = newStepResults;
    }
    if (!prevResult?.status || prevResult.status === "failed") {
      await this.mastra.pubsub.publish("workflows", {
        type: "workflow.fail",
        runId,
        data: {
          workflowId,
          runId,
          executionPath,
          resumeSteps,
          parentWorkflow,
          stepResults,
          prevResult,
          activeSteps,
          runtimeContext
        }
      });
      return;
    } else if (prevResult.status === "suspended") {
      const suspendedPaths = {};
      const suspendedStep = getStep(workflow, executionPath);
      if (suspendedStep) {
        suspendedPaths[suspendedStep.id] = executionPath;
      }
      await this.mastra.getStorage()?.updateWorkflowState({
        workflowName: workflowId,
        runId,
        opts: {
          status: "suspended",
          result: prevResult,
          suspendedPaths
        }
      });
      await this.mastra.pubsub.publish("workflows", {
        type: "workflow.suspend",
        runId,
        data: {
          workflowId,
          runId,
          executionPath,
          resumeSteps,
          parentWorkflow,
          stepResults,
          prevResult,
          activeSteps,
          runtimeContext
        }
      });
      await this.mastra.pubsub.publish(`workflow.events.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "watch",
          payload: {
            currentStep: { ...prevResult, id: step?.step?.id },
            workflowState: {
              status: "suspended",
              steps: stepResults,
              suspendPayload: prevResult.suspendPayload
            }
          }
        }
      });
      await this.mastra.pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "workflow-step-suspended",
          payload: {
            id: step?.step?.id,
            ...prevResult,
            suspendedAt: Date.now(),
            suspendPayload: prevResult.suspendPayload
          }
        }
      });
      return;
    }
    if (step?.type === "step" || step?.type === "waitForEvent") {
      await this.mastra.pubsub.publish(`workflow.events.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "watch",
          payload: {
            currentStep: { ...prevResult, id: step.step.id },
            workflowState: {
              status: "running",
              steps: stepResults,
              error: null,
              result: null
            }
          },
          eventTimestamp: Date.now()
        }
      });
      await this.mastra.pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "workflow-step-result",
          payload: {
            id: step.step.id,
            ...prevResult
          }
        }
      });
      if (prevResult.status === "success") {
        await this.mastra.pubsub.publish(`workflow.events.v2.${runId}`, {
          type: "watch",
          runId,
          data: {
            type: "workflow-step-finish",
            payload: {
              id: step.step.id,
              metadata: {}
            }
          }
        });
      }
    }
    step = workflow.stepGraph[executionPath[0]];
    if ((step?.type === "parallel" || step?.type === "conditional") && executionPath.length > 1) {
      let skippedCount = 0;
      const allResults = step.steps.reduce(
        (acc, step2) => {
          if (isExecutableStep(step2)) {
            const res = stepResults?.[step2.step.id];
            if (res && res.status === "success") {
              acc[step2.step.id] = res?.output;
            } else if (res?.status === "skipped") {
              skippedCount++;
            }
          }
          return acc;
        },
        {}
      );
      const keys = Object.keys(allResults);
      if (keys.length + skippedCount < step.steps.length) {
        return;
      }
      await this.mastra.pubsub.publish("workflows", {
        type: "workflow.step.end",
        runId,
        data: {
          parentWorkflow,
          workflowId,
          runId,
          executionPath: executionPath.slice(0, -1),
          resumeSteps,
          stepResults,
          prevResult: { status: "success", output: allResults },
          activeSteps,
          runtimeContext
        }
      });
    } else if (step?.type === "foreach") {
      await this.mastra.pubsub.publish("workflows", {
        type: "workflow.step.run",
        runId,
        data: {
          workflowId,
          runId,
          executionPath: executionPath.slice(0, -1),
          resumeSteps,
          parentWorkflow,
          stepResults,
          prevResult: { ...prevResult, output: prevResult?.payload },
          activeSteps,
          runtimeContext
        }
      });
    } else if (executionPath[0] >= workflow.stepGraph.length - 1) {
      await this.endWorkflow({
        workflow,
        parentWorkflow,
        workflowId,
        runId,
        executionPath,
        resumeSteps,
        stepResults,
        prevResult,
        activeSteps,
        runtimeContext
      });
    } else {
      await this.mastra.pubsub.publish("workflows", {
        type: "workflow.step.run",
        runId,
        data: {
          workflowId,
          runId,
          executionPath: executionPath.slice(0, -1).concat([executionPath[executionPath.length - 1] + 1]),
          resumeSteps,
          parentWorkflow,
          stepResults,
          prevResult,
          activeSteps,
          runtimeContext
        }
      });
    }
  }
  async loadData({
    workflowId,
    runId
  }) {
    const snapshot = await this.mastra.getStorage()?.loadWorkflowSnapshot({
      workflowName: workflowId,
      runId
    });
    return snapshot;
  }
  async process(event, ack) {
    const { type, data } = event;
    const workflowData = data;
    const currentState = await this.loadData({
      workflowId: workflowData.workflowId,
      runId: workflowData.runId
    });
    if (currentState?.status === "canceled" && type !== "workflow.end") {
      return;
    }
    if (type.startsWith("workflow.user-event.")) {
      await processWorkflowWaitForEvent(
        {
          ...workflowData,
          workflow: this.mastra.getWorkflow(workflowData.workflowId)
        },
        {
          pubsub: this.mastra.pubsub,
          eventName: type.split(".").slice(2).join("."),
          currentState
        }
      );
      return;
    }
    let workflow;
    if (this.mastra.__hasInternalWorkflow(workflowData.workflowId)) {
      workflow = this.mastra.__getInternalWorkflow(workflowData.workflowId);
    } else if (workflowData.parentWorkflow) {
      workflow = getNestedWorkflow(this.mastra, workflowData.parentWorkflow);
    } else {
      workflow = this.mastra.getWorkflow(workflowData.workflowId);
    }
    if (!workflow) {
      return this.errorWorkflow(
        workflowData,
        new MastraError({
          id: "MASTRA_WORKFLOW",
          text: `Workflow not found: ${workflowData.workflowId}`,
          domain: "MASTRA_WORKFLOW" /* MASTRA_WORKFLOW */,
          category: "SYSTEM" /* SYSTEM */
        })
      );
    }
    if (type === "workflow.start" || type === "workflow.resume") {
      const { runId } = workflowData;
      await this.mastra.pubsub.publish(`workflow.events.v2.${runId}`, {
        type: "watch",
        runId,
        data: {
          type: "workflow-start",
          payload: {
            runId
          }
        }
      });
    }
    switch (type) {
      case "workflow.cancel":
        await this.processWorkflowCancel({
          workflow,
          ...workflowData
        });
        break;
      case "workflow.start":
        await this.processWorkflowStart({
          workflow,
          ...workflowData
        });
        break;
      case "workflow.resume":
        await this.processWorkflowStart({
          workflow,
          ...workflowData
        });
        break;
      case "workflow.end":
        await this.processWorkflowEnd({
          workflow,
          ...workflowData
        });
        break;
      case "workflow.step.end":
        await this.processWorkflowStepEnd({
          workflow,
          ...workflowData
        });
        break;
      case "workflow.step.run":
        await this.processWorkflowStepRun({
          workflow,
          ...workflowData
        });
        break;
      case "workflow.suspend":
        await this.processWorkflowSuspend({
          workflow,
          ...workflowData
        });
        break;
      case "workflow.fail":
        await this.processWorkflowFail({
          workflow,
          ...workflowData
        });
        break;
    }
    try {
      await ack?.();
    } catch (e) {
      console.error("Error acking event", e);
    }
  }
};
function isAgent(params) {
  return params?.component === "AGENT";
}
function isTool(params) {
  return params instanceof Tool;
}
function createStep(params) {
  if (isAgent(params)) {
    return {
      id: params.name,
      description: params.getDescription(),
      // @ts-ignore
      inputSchema: z.object({
        prompt: z.string()
        // resourceId: z.string().optional(),
        // threadId: z.string().optional(),
      }),
      // @ts-ignore
      outputSchema: z.object({
        text: z.string()
      }),
      execute: async ({ inputData, [EMITTER_SYMBOL]: emitter, runtimeContext, abortSignal, abort }) => {
        let streamPromise = {};
        streamPromise.promise = new Promise((resolve, reject) => {
          streamPromise.resolve = resolve;
          streamPromise.reject = reject;
        });
        const { fullStream } = await params.streamLegacy(inputData.prompt, {
          // resourceId: inputData.resourceId,
          // threadId: inputData.threadId,
          runtimeContext,
          onFinish: (result) => {
            streamPromise.resolve(result.text);
          },
          abortSignal
        });
        if (abortSignal.aborted) {
          return abort();
        }
        const toolData = {
          name: params.name,
          args: inputData
        };
        await emitter.emit("watch-v2", {
          type: "tool-call-streaming-start",
          ...toolData ?? {}
        });
        for await (const chunk of fullStream) {
          if (chunk.type === "text-delta") {
            await emitter.emit("watch-v2", {
              type: "tool-call-delta",
              ...toolData ?? {},
              argsTextDelta: chunk.textDelta
            });
          }
        }
        await emitter.emit("watch-v2", {
          type: "tool-call-streaming-finish",
          ...toolData ?? {}
        });
        return {
          text: await streamPromise.promise
        };
      },
      component: params.component
    };
  }
  if (isTool(params)) {
    if (!params.inputSchema || !params.outputSchema) {
      throw new Error("Tool must have input and output schemas defined");
    }
    return {
      // TODO: tool probably should have strong id type
      // @ts-ignore
      id: params.id,
      description: params.description,
      inputSchema: params.inputSchema,
      outputSchema: params.outputSchema,
      suspendSchema: params.suspendSchema,
      resumeSchema: params.resumeSchema,
      execute: async ({ inputData, mastra, runtimeContext, suspend, resumeData }) => {
        return params.execute({
          context: inputData,
          mastra,
          runtimeContext,
          // TODO: Pass proper tracing context when evented workflows support tracing
          tracingContext: { currentSpan: void 0 },
          suspend,
          resumeData
        });
      },
      component: "TOOL"
    };
  }
  return {
    id: params.id,
    description: params.description,
    inputSchema: params.inputSchema,
    outputSchema: params.outputSchema,
    resumeSchema: params.resumeSchema,
    suspendSchema: params.suspendSchema,
    execute: params.execute
  };
}
function createWorkflow(params) {
  const eventProcessor = new WorkflowEventProcessor({ mastra: params.mastra });
  const executionEngine = new EventedExecutionEngine({
    mastra: params.mastra,
    eventProcessor,
    options: {
      validateInputs: params.options?.validateInputs ?? false,
      shouldPersistSnapshot: params.options?.shouldPersistSnapshot ?? (() => true),
      tracingPolicy: params.options?.tracingPolicy
    }
  });
  return new EventedWorkflow({
    ...params,
    executionEngine
  });
}
var EventedWorkflow = class extends Workflow {
  constructor(params) {
    super(params);
  }
  __registerMastra(mastra) {
    super.__registerMastra(mastra);
    this.executionEngine.__registerMastra(mastra);
  }
  async createRunAsync(options) {
    const runIdToUse = options?.runId || randomUUID();
    const run = this.runs.get(runIdToUse) ?? new EventedRun({
      workflowId: this.id,
      runId: runIdToUse,
      executionEngine: this.executionEngine,
      executionGraph: this.executionGraph,
      serializedStepGraph: this.serializedStepGraph,
      mastra: this.mastra,
      retryConfig: this.retryConfig,
      cleanup: () => this.runs.delete(runIdToUse),
      workflowSteps: this.steps
    });
    this.runs.set(runIdToUse, run);
    const shouldPersistSnapshot = this.options?.shouldPersistSnapshot?.({
      workflowStatus: run.workflowRunStatus,
      stepResults: {}
    });
    const workflowSnapshotInStorage = await this.getWorkflowRunExecutionResult(runIdToUse, false);
    if (!workflowSnapshotInStorage && shouldPersistSnapshot) {
      await this.mastra?.getStorage()?.persistWorkflowSnapshot({
        workflowName: this.id,
        runId: runIdToUse,
        snapshot: {
          runId: runIdToUse,
          status: "pending",
          value: {},
          context: {},
          activePaths: [],
          serializedStepGraph: this.serializedStepGraph,
          suspendedPaths: {},
          resumeLabels: {},
          waitingPaths: {},
          result: void 0,
          error: void 0,
          // @ts-ignore
          timestamp: Date.now()
        }
      });
    }
    return run;
  }
};
var EventedRun = class extends Run {
  constructor(params) {
    super(params);
    this.serializedStepGraph = params.serializedStepGraph;
  }
  async start({
    inputData,
    initialState,
    runtimeContext
  }) {
    if (this.serializedStepGraph.length === 0) {
      throw new Error(
        "Execution flow of workflow is not defined. Add steps to the workflow via .then(), .branch(), etc."
      );
    }
    if (!this.executionGraph.steps) {
      throw new Error("Uncommitted step flow changes detected. Call .commit() to register the steps.");
    }
    runtimeContext = runtimeContext ?? new RuntimeContext();
    await this.mastra?.getStorage()?.persistWorkflowSnapshot({
      workflowName: this.workflowId,
      runId: this.runId,
      snapshot: {
        runId: this.runId,
        serializedStepGraph: this.serializedStepGraph,
        value: {},
        context: {},
        runtimeContext: Object.fromEntries(runtimeContext.entries()),
        activePaths: [],
        suspendedPaths: {},
        resumeLabels: {},
        waitingPaths: {},
        timestamp: Date.now(),
        status: "running"
      }
    });
    const inputDataToUse = await this._validateInput(inputData);
    const initialStateToUse = await this._validateInitialState(initialState ?? {});
    const result = await this.executionEngine.execute({
      workflowId: this.workflowId,
      runId: this.runId,
      graph: this.executionGraph,
      serializedStepGraph: this.serializedStepGraph,
      input: inputDataToUse,
      initialState: initialStateToUse,
      emitter: {
        emit: async (event, data) => {
          this.emitter.emit(event, data);
        },
        on: (event, callback) => {
          this.emitter.on(event, callback);
        },
        off: (event, callback) => {
          this.emitter.off(event, callback);
        },
        once: (event, callback) => {
          this.emitter.once(event, callback);
        }
      },
      retryConfig: this.retryConfig,
      runtimeContext,
      abortController: this.abortController
    });
    console.dir({ startResult: result }, { depth: null });
    if (result.status !== "suspended") {
      this.cleanup?.();
    }
    return result;
  }
  // TODO: stream
  async resume(params) {
    const steps = (Array.isArray(params.step) ? params.step : [params.step]).map(
      (step) => typeof step === "string" ? step : step?.id
    );
    if (steps.length === 0) {
      throw new Error("No steps provided to resume");
    }
    const snapshot = await this.mastra?.getStorage()?.loadWorkflowSnapshot({
      workflowName: this.workflowId,
      runId: this.runId
    });
    const resumePath = snapshot?.suspendedPaths?.[steps[0]];
    if (!resumePath) {
      throw new Error(
        `No resume path found for step ${JSON.stringify(steps)}, currently suspended paths are ${JSON.stringify(snapshot?.suspendedPaths)}`
      );
    }
    console.dir(
      { resume: { runtimeContextObj: snapshot?.runtimeContext, runtimeContext: params.runtimeContext } },
      { depth: null }
    );
    const runtimeContextObj = snapshot?.runtimeContext ?? {};
    const runtimeContext = new RuntimeContext();
    for (const [key, value] of Object.entries(runtimeContextObj)) {
      runtimeContext.set(key, value);
    }
    if (params.runtimeContext) {
      for (const [key, value] of params.runtimeContext.entries()) {
        runtimeContext.set(key, value);
      }
    }
    const suspendedStep = this.workflowSteps[steps?.[0] ?? ""];
    const resumeDataToUse = await this._validateResumeData(params.resumeData, suspendedStep);
    const executionResultPromise = this.executionEngine.execute({
      workflowId: this.workflowId,
      runId: this.runId,
      graph: this.executionGraph,
      serializedStepGraph: this.serializedStepGraph,
      input: resumeDataToUse,
      resume: {
        steps,
        stepResults: snapshot?.context,
        resumePayload: resumeDataToUse,
        resumePath
      },
      emitter: {
        emit: (event, data) => {
          this.emitter.emit(event, data);
          return Promise.resolve();
        },
        on: (event, callback) => {
          this.emitter.on(event, callback);
        },
        off: (event, callback) => {
          this.emitter.off(event, callback);
        },
        once: (event, callback) => {
          this.emitter.once(event, callback);
        }
      },
      runtimeContext,
      abortController: this.abortController
    }).then((result) => {
      if (result.status !== "suspended") {
        this.closeStreamAction?.().catch(() => {
        });
      }
      return result;
    });
    this.executionResults = executionResultPromise;
    return executionResultPromise;
  }
  watch(cb, type = "watch") {
    const watchCb = async (event, ack) => {
      if (event.runId !== this.runId) {
        return;
      }
      cb(event.data);
      await ack?.();
    };
    if (type === "watch-v2") {
      this.mastra?.pubsub.subscribe(`workflow.events.v2.${this.runId}`, watchCb).catch(() => {
      });
    } else {
      this.mastra?.pubsub.subscribe(`workflow.events.${this.runId}`, watchCb).catch(() => {
      });
    }
    return () => {
      if (type === "watch-v2") {
        this.mastra?.pubsub.unsubscribe(`workflow.events.v2.${this.runId}`, watchCb).catch(() => {
        });
      } else {
        this.mastra?.pubsub.unsubscribe(`workflow.events.${this.runId}`, watchCb).catch(() => {
        });
      }
    };
  }
  async watchAsync(cb, type = "watch") {
    const watchCb = async (event, ack) => {
      if (event.runId !== this.runId) {
        return;
      }
      cb(event.data);
      await ack?.();
    };
    if (type === "watch-v2") {
      await this.mastra?.pubsub.subscribe(`workflow.events.v2.${this.runId}`, watchCb).catch(() => {
      });
    } else {
      await this.mastra?.pubsub.subscribe(`workflow.events.${this.runId}`, watchCb).catch(() => {
      });
    }
    return async () => {
      if (type === "watch-v2") {
        await this.mastra?.pubsub.unsubscribe(`workflow.events.v2.${this.runId}`, watchCb).catch(() => {
        });
      } else {
        await this.mastra?.pubsub.unsubscribe(`workflow.events.${this.runId}`, watchCb).catch(() => {
        });
      }
    };
  }
  async cancel() {
    await this.mastra?.pubsub.publish("workflows", {
      type: "workflow.cancel",
      runId: this.runId,
      data: {
        workflowId: this.workflowId,
        runId: this.runId
      }
    });
  }
  async sendEvent(eventName, data) {
    await this.mastra?.pubsub.publish("workflows", {
      type: `workflow.user-event.${eventName}`,
      runId: this.runId,
      data: {
        workflowId: this.workflowId,
        runId: this.runId,
        resumeData: data
      }
    });
  }
};

// src/workflows/evented/workflow-event-processor/utils.ts
function getNestedWorkflow(mastra, { workflowId, executionPath, parentWorkflow }) {
  let workflow = null;
  if (parentWorkflow) {
    const nestedWorkflow = getNestedWorkflow(mastra, parentWorkflow);
    if (!nestedWorkflow) {
      return null;
    }
    workflow = nestedWorkflow;
  }
  workflow = workflow ?? mastra.getWorkflow(workflowId);
  const stepGraph = workflow.stepGraph;
  let parentStep = stepGraph[executionPath[0]];
  if (parentStep?.type === "parallel" || parentStep?.type === "conditional") {
    parentStep = parentStep.steps[executionPath[1]];
  }
  if (parentStep?.type === "step" || parentStep?.type === "loop") {
    return parentStep.step;
  }
  return null;
}
function getStep(workflow, executionPath) {
  let idx = 0;
  const stepGraph = workflow.stepGraph;
  let parentStep = stepGraph[executionPath[0]];
  if (parentStep?.type === "parallel" || parentStep?.type === "conditional") {
    parentStep = parentStep.steps[executionPath[1]];
    idx++;
  } else if (parentStep?.type === "foreach") {
    return parentStep.step;
  }
  if (!(parentStep?.type === "step" || parentStep?.type === "loop" || parentStep?.type === "waitForEvent")) {
    return null;
  }
  if (parentStep instanceof EventedWorkflow) {
    return getStep(parentStep, executionPath.slice(idx + 1));
  }
  return parentStep.step;
}
function isExecutableStep(step) {
  return step.type === "step" || step.type === "loop" || step.type === "waitForEvent" || step.type === "foreach";
}

// src/workflows/evented/execution-engine.ts
var EventedExecutionEngine = class extends ExecutionEngine {
  eventProcessor;
  constructor({
    mastra,
    eventProcessor,
    options
  }) {
    super({ mastra, options });
    this.eventProcessor = eventProcessor;
  }
  __registerMastra(mastra) {
    this.mastra = mastra;
    this.eventProcessor.__registerMastra(mastra);
  }
  /**
   * Executes a workflow run with the provided execution graph and input
   * @param graph The execution graph to execute
   * @param input The input data for the workflow
   * @returns A promise that resolves to the workflow output
   */
  async execute(params) {
    const pubsub = this.mastra?.pubsub;
    if (!pubsub) {
      throw new Error("No Pubsub adapter configured on the Mastra instance");
    }
    if (params.resume) {
      const prevStep = getStep(this.mastra.getWorkflow(params.workflowId), params.resume.resumePath);
      const prevResult = params.resume.stepResults[prevStep?.id ?? "input"];
      await pubsub.publish("workflows", {
        type: "workflow.resume",
        runId: params.runId,
        data: {
          workflowId: params.workflowId,
          runId: params.runId,
          executionPath: params.resume.resumePath,
          stepResults: params.resume.stepResults,
          resumeSteps: params.resume.steps,
          prevResult: { status: "success", output: prevResult?.payload },
          resumeData: params.resume.resumePayload,
          runtimeContext: Object.fromEntries(params.runtimeContext.entries()),
          format: params.format
        }
      });
    } else {
      await pubsub.publish("workflows", {
        type: "workflow.start",
        runId: params.runId,
        data: {
          workflowId: params.workflowId,
          runId: params.runId,
          prevResult: { status: "success", output: params.input },
          runtimeContext: Object.fromEntries(params.runtimeContext.entries()),
          format: params.format
        }
      });
    }
    const resultData = await new Promise((resolve) => {
      const finishCb = async (event, ack) => {
        if (event.runId !== params.runId) {
          await ack?.();
          return;
        }
        if (["workflow.end", "workflow.fail", "workflow.suspend"].includes(event.type)) {
          await ack?.();
          await pubsub.unsubscribe("workflows-finish", finishCb);
          resolve(event.data);
          return;
        }
        await ack?.();
      };
      pubsub.subscribe("workflows-finish", finishCb).catch(() => {
      });
    });
    if (resultData.prevResult.status === "failed") {
      return {
        status: "failed",
        error: resultData.prevResult.error,
        steps: resultData.stepResults
      };
    } else if (resultData.prevResult.status === "suspended") {
      const suspendedSteps = Object.entries(resultData.stepResults).map(([_stepId, stepResult]) => {
        if (stepResult.status === "suspended") {
          return stepResult.suspendPayload?.__workflow_meta?.path ?? [];
        }
        return null;
      }).filter(Boolean);
      return {
        status: "suspended",
        steps: resultData.stepResults,
        suspended: suspendedSteps
      };
    }
    return {
      status: resultData.prevResult.status,
      result: resultData.prevResult?.output,
      steps: resultData.stepResults
    };
  }
};

recordType(stringType(), anyType()).optional();
var scoringValueSchema = numberType();
objectType({
  result: recordType(stringType(), anyType()).optional(),
  score: scoringValueSchema,
  prompt: stringType().optional()
});
var saveScorePayloadSchema = objectType({
  runId: stringType(),
  scorerId: stringType(),
  entityId: stringType(),
  score: numberType(),
  input: anyType().optional(),
  output: anyType(),
  source: enumType(["LIVE", "TEST"]),
  entityType: enumType(["AGENT", "WORKFLOW", ...Object.values(AISpanType)]).optional(),
  scorer: recordType(stringType(), anyType()),
  traceId: stringType().optional(),
  spanId: stringType().optional(),
  preprocessStepResult: recordType(stringType(), anyType()).optional(),
  extractStepResult: recordType(stringType(), anyType()).optional(),
  analyzeStepResult: recordType(stringType(), anyType()).optional(),
  reason: stringType().optional(),
  metadata: recordType(stringType(), anyType()).optional(),
  preprocessPrompt: stringType().optional(),
  extractPrompt: stringType().optional(),
  generateScorePrompt: stringType().optional(),
  generateReasonPrompt: stringType().optional(),
  analyzePrompt: stringType().optional(),
  additionalContext: recordType(stringType(), anyType()).optional(),
  runtimeContext: recordType(stringType(), anyType()).optional(),
  entity: recordType(stringType(), anyType()).optional(),
  resourceId: stringType().optional(),
  threadId: stringType().optional()
});

export { WorkflowEventProcessor as W, createStep as a, createWorkflow as c, saveScorePayloadSchema as s };
