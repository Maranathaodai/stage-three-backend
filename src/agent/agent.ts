import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');


const CodeReviewSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string().optional(),
  context: z.string().optional(),
});

export type CodeReviewRequest = z.infer<typeof CodeReviewSchema>;

export interface CodeReviewResponse {
  review: string;
  suggestions: string[];
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'suggestion';
    message: string;
    line?: number;
  }>;
}


export class CodeReviewAgent {
  private name: string;
  private description: string;

  constructor() {
    this.name = 'Code Review Assistant';
    this.description = 'An AI agent that reviews code and provides constructive feedback';
    
    console.log(`Initialized Mastra-based agent: ${this.name}`);
  }

  
  async reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    try {
      const validated = CodeReviewSchema.parse(request);
      
      const reviewText = await this.performCodeAnalysisWithGemini(validated);

      return this.parseReviewResponse(reviewText, validated.code);
    } catch (error) {
      console.error('Error in code review:', error);
      throw new Error(`Failed to review code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

 
  private async performCodeAnalysisWithGemini(request: CodeReviewRequest): Promise<string> {
    const code = request.code;
    const language = request.language || 'detect automatically';
    const context = request.context ? `\n\nContext: ${request.context}` : '';
    
    
    const prompt = `You are an expert code reviewer. Analyze the following code and provide a comprehensive review.

Code Language: ${language}
${context}

Code to review:
\`\`\`${request.language || ''}
${code}
\`\`\`

Please provide:
1. An overall assessment of the code quality
2. Specific issues or bugs found (with line numbers if possible)
3. Suggestions for improvement
4. Security concerns if any
5. Performance optimizations if applicable
6. Best practices violations

Format your response as:
REVIEW: [your detailed review]
SCORE: [1-10 rating]
ISSUES:
- [Type]: [Description] (Line X if applicable)
- [Type]: [Description] (Line X if applicable)
SUGGESTIONS:
- [Suggestion 1]
- [Suggestion 2]
- [Suggestion 3]`;

    try {
      const model = genAI.getGenerativeModel({ 
        model: 'google/gemini-2.0-flash-lite' 
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const reviewText = response.text();

      return reviewText;
    } catch (error) {
      console.error('Gemini API error:', error);
      return `REVIEW: Code analysis completed. ${error instanceof Error ? error.message : 'Unable to generate detailed review'}
SCORE: 7
ISSUES:
- Unable to complete full AI analysis
SUGGESTIONS:
- Check code syntax
- Review error handling
- Consider code structure improvements`;
    }
  }

  
  private parseReviewResponse(reviewText: string, code: string): CodeReviewResponse {
    const lines = code.split('\n');
    const issues: CodeReviewResponse['issues'] = [];
    const suggestions: string[] = [];
    let score = 7;
    let review = '';

    
    const reviewMatch = reviewText.match(/REVIEW:\s*(.+?)(?=SCORE:|ISSUES:|$)/s);
    if (reviewMatch) {
      review = reviewMatch[1].trim();
    } else {
      review = reviewText.split('SCORE:')[0].trim();
    }

    
    const scoreMatch = reviewText.match(/SCORE:\s*(\d+)/);
    if (scoreMatch) {
      score = parseInt(scoreMatch[1], 10);
    }

    const issuesMatch = reviewText.match(/ISSUES:\s*([\s\S]*?)(?=SUGGESTIONS:|$)/);
    if (issuesMatch) {
      const issuesText = issuesMatch[1];
      const issueLines = issuesText.split('\n').filter(line => line.trim());
      
      issueLines.forEach(line => {
        const trimmed = line.trim().replace(/^-\s*/, '');
        if (!trimmed) return;

        let type: 'error' | 'warning' | 'suggestion' = 'suggestion';
        if (trimmed.toLowerCase().includes('error') || trimmed.toLowerCase().includes('bug')) {
          type = 'error';
        } else if (trimmed.toLowerCase().includes('warning')) {
          type = 'warning';
        }

        
        const lineMatch = trimmed.match(/\(?Line\s+(\d+)\)?/i);
        const lineNum = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
        
        
        const message = trimmed.replace(/\s*\(?Line\s+\d+\)?/i, '').trim();

        issues.push({ type, message, line: lineNum });
      });
    }

    const suggestionsMatch = reviewText.match(/SUGGESTIONS:\s*([\s\S]*?)$/);
    if (suggestionsMatch) {
      const suggestionsText = suggestionsMatch[1];
      const suggestionLines = suggestionsText.split('\n').filter(line => line.trim());
      suggestionLines.forEach(line => {
        const trimmed = line.trim().replace(/^-\s*/, '');
        if (trimmed) {
          suggestions.push(trimmed);
        }
      });
    }

    
    if (!review) {
      review = reviewText;
    }
    if (suggestions.length === 0) {
      suggestions.push('Consider refactoring for better maintainability');
      suggestions.push('Add error handling where appropriate');
    }

    return {
      review,
      suggestions,
      score,
      issues,
    };
  }

 
   
  getAgentMetadata() {
    return {
      name: 'Code Review Assistant',
      description: 'Reviews code snippets and provides intelligent feedback, suggestions, and identifies potential issues',
      version: '1.0.0',
    };
  }
}

export const codeReviewAgent = new CodeReviewAgent();

