import { Router, Request, Response, NextFunction } from 'express';
import { codeReviewAgent } from '../agent/agent.js';
import { validateTelexMessage } from '../middleware/validation.js';
import { executeMastraWorkflow, mastraAgentWorkflow } from '../agent/mastra-agent.js';

const router = Router();

function validateTelexApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-agent-api-key'] || req.headers['x-telex-api-key'];
  const expectedKey = process.env.TELEX_API_KEY;
  

  if (expectedKey && apiKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid Telex API key',
    });
  }
  
  next();
}

router.post('/webhook', validateTelexApiKey, validateTelexMessage, async (req: Request, res: Response) => {
  try {
    const { message, channelId, userId, messageId } = req.body;

    console.log(`📨 Received message from Telex.im - Channel: ${channelId}, User: ${userId}`);

    
    const result = await executeMastraWorkflow({
      message,
      channelId,
      userId,
      messageId,
    });

    res.json(result);

  } catch (error) {
    console.error('Error processing Telex message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process code review',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});


router.get('/agent', (req: Request, res: Response) => {
  const metadata = codeReviewAgent.getAgentMetadata();
  
  res.json({
    success: true,
    agent: metadata,
    capabilities: [
      'code-review',
      'code-analysis',
      'suggestions',
      'bug-detection',
      'best-practices',
    ],
    endpoints: {
      webhook: '/api/telex/webhook',
      health: '/health',
    },
  });
});


function formatReviewResponse(review: {
  review: string;
  suggestions: string[];
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'suggestion';
    message: string;
    line?: number;
  }>;
}): string {
  let response = `🔍 **Code Review Results**\n\n`;
  response += `**Score:** ${review.score}/10\n\n`;
  response += `**Review:**\n${review.review}\n\n`;

  if (review.issues.length > 0) {
    response += `**Issues Found:**\n`;
    review.issues.forEach((issue, idx) => {
      const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '💡';
      const lineInfo = issue.line ? ` (Line ${issue.line})` : '';
      response += `${icon} ${issue.message}${lineInfo}\n`;
    });
    response += `\n`;
  }

  if (review.suggestions.length > 0) {
    response += `**Suggestions:**\n`;
    review.suggestions.slice(0, 5).forEach((suggestion, idx) => {
      response += `${idx + 1}. ${suggestion}\n`;
    });
  }

  return response;
}


router.get('/workflow', (req: Request, res: Response) => {
  res.json({
    success: true,
    workflow: mastraAgentWorkflow,
  });
});

export { router as telexRouter };

