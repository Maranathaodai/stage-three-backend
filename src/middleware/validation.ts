import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';


const TelexMessageSchema = z.object({
  message: z.string().min(1),
  channelId: z.string().optional(),
  userId: z.string().optional(),
  messageId: z.string().optional(),
  timestamp: z.string().optional(),
});

export type TelexMessage = z.infer<typeof TelexMessageSchema>;


export function validateTelexMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validated = TelexMessageSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    next(error);
  }
}

