import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { codeReviewAgent } from './agent/agent.js';
import { telexRouter } from './routes/telex.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/telex', telexRouter);


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Telex AI Agent server running on port ${PORT}`);
  console.log(`📝 Agent ready to receive messages from Telex.im`);
});

export default app;

