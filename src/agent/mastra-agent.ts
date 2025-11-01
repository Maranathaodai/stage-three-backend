

import { codeReviewAgent } from './agent.js';

export const mastraAgentWorkflow = {
  name: 'Code Review Assistant',
  description: 'AI agent that reviews code snippets and provides intelligent feedback',
  version: '1.0.0',
  nodes: [
    {
      id: 'message-receiver',
      type: 'input',
      position: [100, 200],
      data: {
        handler: 'receiveMessage',
      },
    },
    {
      id: 'code-extractor',
      type: 'processor',
      position: [300, 200],
      data: {
        function: 'extractCode',
        input: 'message',
        output: 'codeBlock',
      },
    },
    {
      id: 'review-processor',
      type: 'agent',
      position: [500, 200],
      data: {
        agent: 'code-review-agent',
        input: 'codeBlock',
        output: 'reviewResult',
      },
    },
    {
      id: 'response-formatter',
      type: 'processor',
      position: [700, 200],
      data: {
        function: 'formatResponse',
        input: 'reviewResult',
        output: 'formattedResponse',
      },
    },
    {
      id: 'message-sender',
      type: 'output',
      position: [900, 200],
      data: {
        handler: 'sendResponse',
        input: 'formattedResponse',
      },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'message-receiver',
      target: 'code-extractor',
    },
    {
    id: 'e2',
      source: 'code-extractor',
      target: 'review-processor',
    },
    {
      id: 'e3',
      source: 'review-processor',
      target: 'response-formatter',
    },
    {
      id: 'e4',
      source: 'response-formatter',
      target: 'message-sender',
    },
  ],
};

export const mastraHandlers = {

  receiveMessage: async (input: any) => {
    const { message, channelId, userId } = input;
    
    if (!message) {
      throw new Error('No message provided');
    }

    return {
      message,
      channelId,
      userId,
      timestamp: new Date().toISOString(),
    };
  },

  
  extractCode: async (input: any) => {
    const { message } = input;
    
    const codeMatch = message.match(/```(\w+)?\n?([\s\S]*?)```/);
    
    if (!codeMatch) {
      return {
        hasCode: false,
        code: '',
        language: '',
      };
    }

    return {
      hasCode: true,
      code: codeMatch[2].trim(),
      language: codeMatch[1] || '',
    };
  },

  reviewProcessor: async (input: any) => {
    const { code, language, context } = input;
    
    const reviewResult = await codeReviewAgent.reviewCode({
      code,
      language,
      context,
    });

    return reviewResult;
  },

  formatResponse: async (input: any) => {
    const { review, suggestions, score, issues } = input;
    
    let formatted = `🔍 **Code Review Results**\n\n`;
    formatted += `**Score:** ${score}/10\n\n`;
    formatted += `**Review:**\n${review}\n\n`;

    if (issues && issues.length > 0) {
      formatted += `**Issues Found:**\n`;
      issues.forEach((issue: any) => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '💡';
        const lineInfo = issue.line ? ` (Line ${issue.line})` : '';
        formatted += `${icon} ${issue.message}${lineInfo}\n`;
      });
      formatted += `\n`;
    }

    if (suggestions && suggestions.length > 0) {
      formatted += `**Suggestions:**\n`;
      suggestions.slice(0, 5).forEach((suggestion: string, idx: number) => {
        formatted += `${idx + 1}. ${suggestion}\n`;
      });
    }

    return formatted;
  },

  
  sendResponse: async (input: any) => {
    const { formattedResponse, channelId, messageId } = input;
    
    return {
      success: true,
      response: {
        type: 'message',
        content: formattedResponse,
        metadata: {
          channelId,
          messageId,
        },
      },
    };
  },
};


export async function executeMastraWorkflow(input: any) {
  try {
    const received = await mastraHandlers.receiveMessage(input);
  
    const extracted = await mastraHandlers.extractCode(received);
    
    if (!extracted.hasCode) {
      return {
        success: true,
        response: {
          type: 'message',
          content: `👋 Hi! I'm a Code Review Assistant. Share a code snippet wrapped in \`\`\`backticks\`\`\` and I'll review it for you.`,
          metadata: {
            channelId: received.channelId,
            messageId: input.messageId,
          },
        },
      };
    }

    
    const reviewResult = await mastraHandlers.reviewProcessor({
      code: extracted.code,
      language: extracted.language,
      context: received.message,
    });

   
    const formatted = await mastraHandlers.formatResponse(reviewResult);

    return await mastraHandlers.sendResponse({
      formattedResponse: formatted,
      channelId: received.channelId,
      messageId: input.messageId,
    });
  } catch (error) {
    console.error('Mastra workflow error:', error);
    throw error;
  }
}

