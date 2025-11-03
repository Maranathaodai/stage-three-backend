import { Mastra } from '@mastra/core';

// Mastra Cloud requires a named export `mastra`
export const mastra = new Mastra({
  name: 'Code Review Assistant',
  description: 'Telex coworker that reviews code snippets and provides feedback',
} as any);


export default mastra;