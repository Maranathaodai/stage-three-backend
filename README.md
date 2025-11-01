# Telex.im AI Agent - Code Review Assistant

An intelligent AI agent built with Mastra that integrates with Telex.im to provide automated code reviews and feedback.

## 🚀 Features

- **AI-Powered Code Review**: Analyzes code snippets and provides comprehensive feedback
- **Telex.im Integration**: Seamlessly integrates with Telex.im using the A2A protocol
- **Smart Analysis**: Detects bugs, security issues, performance problems, and best practice violations
- **Actionable Suggestions**: Provides specific, actionable improvement suggestions
- **Score Rating**: Gives code quality scores (1-10) for quick assessment

## 📋 Prerequisites

- Node.js 18+ and npm
- Telex.im account and organization access
- Telex API key (get from Telex.im developer dashboard)
- Google Gemini API key (get from https://aistudio.google.com/app/apikey)

## 🔧 Setup

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
TELEX_API_KEY=your_telex_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

- Get your Telex API key from your Telex.im developer dashboard
- Get your Gemini API key from https://aistudio.google.com/app/apikey
- The agent uses `X-AGENT-API-KEY` header for Telex authentication
- Uses `google/gemini-2.0-flash-lite` model for AI-powered code reviews

3. **Build the project:**

```bash
npm run build
```

4. **Start the server:**

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

## 🔌 Telex.im Integration

### Agent Endpoints

- **Health Check**: `GET /health`
- **Agent Info**: `GET /api/telex/agent`
- **Webhook**: `POST /api/telex/webhook`
- **Workflow**: `GET /api/telex/workflow`

### Webhook Payload Format

Telex.im should send POST requests to `/api/telex/webhook` with:

```json
{
  "message": "review this code:\n```javascript\nconst x = 5;\n```",
  "channelId": "channel-uuid",
  "userId": "user-uuid",
  "messageId": "message-uuid"
}
```

### Response Format

The agent responds with:

```json
{
  "success": true,
  "response": {
    "type": "message",
    "content": "Formatted review response...",
    "metadata": {
      "channelId": "channel-uuid",
      "messageId": "message-uuid",
      "reviewScore": 8,
      "issuesCount": 3
    }
  }
}
```

## 💬 Usage

Once integrated with Telex.im, users can interact with the agent by:

1. **Sharing code in a message:**
   ```
   Please review this code:
   ```javascript
   function add(a, b) {
     return a + b;
   }
   ```
   ```

2. **Mentioning review keywords:**
   - "review this code"
   - "check this"
   - "analyze this code"

The agent will automatically detect code blocks and provide comprehensive feedback.

## 🏗️ Architecture

- **Agent Layer**: Mastra-powered agent for code review logic
- **API Layer**: Express.js REST API for Telex.im integration
- **AI Layer**: Google Gemini 2.0 Flash Lite for intelligent code analysis
- **Validation**: Zod schemas for request validation

## 📝 Project Structure

```
├── src/
│   ├── agent/
│   │   ├── agent.ts          # Core agent implementation
│   │   └── mastra-agent.ts   # Mastra workflow configuration
│   ├── routes/
│   │   └── telex.ts          # Telex.im API routes
│   ├── middleware/
│   │   ├── validation.ts     # Request validation
│   │   └── errorHandler.ts   # Error handling
│   └── index.ts              # Express server setup
├── package.json
├── tsconfig.json
├── README.md
├── API.md                    # API documentation
└── DEPLOYMENT.md             # Deployment guide
```

## 🧪 Testing

View agent interactions at:
```
https://api.telex.im/agent-logs/{channel-id}.txt
```

Replace `{channel-id}` with your Telex.im channel UUID.

## 🔗 Telex.im Agent

**Your Agent URL:** https://telex.im/ai-coworkers/maranatha-64511757098e

After deploying, configure this agent's webhook to point to your deployed endpoint: `https://your-url.com/api/telex/webhook`

See `TELEX_INTEGRATION.md` for detailed integration steps.

## 🚢 Deployment

1. Set environment variables on your hosting platform
2. Build the project: `npm run build`
3. Start the server: `npm start`
4. Configure Telex.im webhook to point to your public endpoint

## 📚 Technologies

- **TypeScript**: Type-safe development
- **Mastra**: AI agent framework
- **Express.js**: REST API server
- **Google Gemini 2.0 Flash Lite**: AI code analysis
- **Zod**: Schema validation

## 📄 License

MIT

## 🤝 Contributing

This is a Stage 3 Backend Task submission for HNG Internship.

## 📞 Support

For issues or questions, check the agent logs at the Telex.im API endpoint.

