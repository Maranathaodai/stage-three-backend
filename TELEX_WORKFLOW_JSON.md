# Telex Workflow JSON - Copy & Paste

## 📋 Workflow JSON for Telex Agent Board

Copy this JSON and paste it into the Telex workflow editor:

```json
{
  "name": "Code Review Assistant",
  "short_description": "AI-powered code review assistant",
  "long_description": "An intelligent AI agent that analyzes code snippets shared in Telex.im and provides comprehensive code reviews. Detects bugs, security vulnerabilities, performance issues, and suggests improvements with actionable feedback and quality scores.",
  "category": "code-review",
  "description": "Provide instant intelligent code reviews on snippets shared",
  "version": "1.0.0",
  "nodes": [
    {
      "id": "message-receiver",
      "type": "input",
      "position": [100, 200],
      "data": {
        "handler": "receiveMessage"
      }
    },
    {
      "id": "code-extractor",
      "type": "processor",
      "position": [300, 200],
      "data": {
        "function": "extractCode",
        "input": "message",
        "output": "codeBlock"
      }
    },
    {
      "id": "review-processor",
      "type": "agent",
      "position": [500, 200],
      "data": {
        "agent": "code-review-assistant",
        "input": "codeBlock",
        "output": "reviewResult"
      }
    },
    {
      "id": "response-formatter",
      "type": "processor",
      "position": [700, 200],
      "data": {
        "function": "formatResponse",
        "input": "reviewResult",
        "output": "formattedResponse"
      }
    },
    {
      "id": "message-sender",
      "type": "output",
      "position": [900, 200],
      "data": {
        "handler": "sendResponse",
        "input": "formattedResponse"
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "message-receiver",
      "target": "code-extractor"
    },
    {
      "id": "e2",
      "source": "code-extractor",
      "target": "review-processor"
    },
    {
      "id": "e3",
      "source": "review-processor",
      "target": "response-formatter"
    },
    {
      "id": "e4",
      "source": "response-formatter",
      "target": "message-sender"
    }
  ]
}
```

---

## 🎯 How to Use

1. **Copy the JSON above** (everything between the ```json markers)

2. **Paste it** into the Telex workflow editor

3. **Click "Prettify"** to format it nicely (optional)

4. **Click "Save"** to save the workflow

---

## ✅ Expected Result

After pasting, you should see:
- ✅ "Valid JSON" indicator (green)
- Formatted workflow with nodes and edges
- All nodes connected properly

---

## 🔍 What This Workflow Does

1. **message-receiver** - Receives incoming messages from Telex
2. **code-extractor** - Extracts code blocks from messages
3. **review-processor** - Processes code review (connects to your backend)
4. **response-formatter** - Formats the review response
5. **message-sender** - Sends response back to Telex

---

## ⚠️ Important Note

Even if you paste this workflow:
- You'll still need to deploy your backend for it to actually work
- The workflow defines the structure, but needs your server to process requests
- Deploy first, then configure the webhook URL in Telex

---

**Your Agent:** https://telex.im/ai-coworkers/maranatha-64511757098e

