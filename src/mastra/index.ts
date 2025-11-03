import { Mastra } from '@mastra/core';
import { PinoLogger } from '@mastra/loggers';

// Mastra Cloud requires a named export `mastra`
export const mastra = new Mastra({
  name: 'Code Review Assistant',
  description: 'Telex coworker that reviews code snippets and provides feedback',
  logger: new PinoLogger(),
} as any);

export default mastra;