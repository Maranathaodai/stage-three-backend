// src/tools/validation.ts
function validateToolInput(schema, input, toolId) {
  if (!schema || !("safeParse" in schema)) {
    return { data: input };
  }
  const validationAttempts = [];
  const directValidation = schema.safeParse(input);
  validationAttempts.push({
    result: directValidation,
    data: input,
    structure: "direct"
  });
  if (directValidation.success) {
    return { data: input };
  }
  if (input && typeof input === "object" && "context" in input) {
    const contextData = input.context;
    const contextValidation = schema.safeParse(contextData);
    validationAttempts.push({
      result: contextValidation,
      data: contextData,
      structure: "context"
    });
    if (contextValidation.success) {
      return { data: { ...input, context: contextValidation.data } };
    }
    if (contextData && typeof contextData === "object" && "inputData" in contextData) {
      const inputDataValue = contextData.inputData;
      const inputDataValidation = schema.safeParse(inputDataValue);
      validationAttempts.push({
        result: inputDataValidation,
        data: inputDataValue,
        structure: "inputData"
      });
      if (inputDataValidation.success) {
        const contextKeys = Object.keys(contextData);
        if (contextKeys.length === 1 && contextKeys[0] === "inputData") {
          return { data: { ...input, context: { inputData: inputDataValidation.data } } };
        } else {
          return { data: inputDataValidation.data };
        }
      }
    }
  }
  let bestAttempt = validationAttempts[0];
  for (const attempt of validationAttempts) {
    if (!attempt.result.success && attempt.result.error.issues.length > 0) {
      bestAttempt = attempt;
    }
  }
  if (bestAttempt && !bestAttempt.result.success) {
    const errorMessages = bestAttempt.result.error.issues.map((e) => `- ${e.path?.join(".") || "root"}: ${e.message}`).join("\n");
    const error = {
      error: true,
      message: `Tool validation failed${toolId ? ` for ${toolId}` : ""}. Please fix the following errors and try again:
${errorMessages}

Provided arguments: ${JSON.stringify(bestAttempt.data, null, 2)}`,
      validationErrors: bestAttempt.result.error.format()
    };
    return { data: input, error };
  }
  return { data: input };
}

// src/tools/tool.ts
var Tool = class {
  /** Unique identifier for the tool */
  id;
  /** Description of what the tool does */
  description;
  /** Schema for validating input parameters */
  inputSchema;
  /** Schema for validating output structure */
  outputSchema;
  /** Schema for suspend operation data */
  suspendSchema;
  /** Schema for resume operation data */
  resumeSchema;
  /**
   * Function that performs the tool's action
   * @param context - Execution context with validated input
   * @param options - Invocation options including suspend/resume data
   * @returns Promise resolving to tool output
   */
  execute;
  /** Parent Mastra instance for accessing shared resources */
  mastra;
  /**
   * Whether the tool requires explicit user approval before execution
   * @example
   * ```typescript
   * // For destructive operations
   * requireApproval: true
   * ```
   */
  requireApproval;
  /**
   * Creates a new Tool instance with input validation wrapper.
   *
   * @param opts - Tool configuration and execute function
   * @example
   * ```typescript
   * const tool = new Tool({
   *   id: 'my-tool',
   *   description: 'Does something useful',
   *   inputSchema: z.object({ name: z.string() }),
   *   execute: async ({ context }) => ({ greeting: `Hello ${context.name}` })
   * });
   * ```
   */
  constructor(opts) {
    this.id = opts.id;
    this.description = opts.description;
    this.inputSchema = opts.inputSchema;
    this.outputSchema = opts.outputSchema;
    this.suspendSchema = opts.suspendSchema;
    this.resumeSchema = opts.resumeSchema;
    this.mastra = opts.mastra;
    this.requireApproval = opts.requireApproval || false;
    if (opts.execute) {
      const originalExecute = opts.execute;
      this.execute = async (context, options) => {
        const { resumeData, suspend } = options ?? {};
        const { data, error } = validateToolInput(this.inputSchema, context, this.id);
        if (error) {
          return error;
        }
        return originalExecute({ ...data, suspend, resumeData }, options);
      };
    }
  }
};
function createTool(opts) {
  return new Tool(opts);
}

// src/tools/toolchecks.ts
function isVercelTool(tool) {
  return !!(tool && !(tool instanceof Tool) && "parameters" in tool);
}

export { Tool as T, createTool as c, isVercelTool as i, validateToolInput as v };
