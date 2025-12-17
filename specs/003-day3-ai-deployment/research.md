# Research: Day 3 - AI Deployment & Spec-Driven Development

**Feature**: 003-day3-ai-deployment
**Date**: 2025-12-18
**Status**: Complete

## Research Tasks Completed

### 1. OpenAI Integration in n8n

**Decision**: Use n8n's built-in OpenAI node for AI-powered auto-responder
**Rationale**:
- Native integration, no custom code needed
- Supports chat completions (GPT-4, GPT-3.5)
- Easy prompt configuration in visual interface
- Builds on Day 2 n8n skills
**Implementation**:
- OpenAI API key stored in n8n credentials
- Chat Completions endpoint for responses
- System prompt defines SIEHS context and behavior

### 2. OpenAI AgentKit Research

**Decision**: Use OpenAI Assistants API for agent configuration
**Rationale**:
- No-code agent creation via OpenAI Playground
- Built-in knowledge base support
- Tool/function calling capabilities
- Persistent conversation threads
**Key Features**:
- Custom instructions defining SIEHS context
- File upload for knowledge base
- Conversation memory
- API access for integration

**Note**: "AgentKit" refers to OpenAI's Assistants feature. For training, we'll use the Playground UI for configuration and demonstrate API access.

### 3. ChatKit / Chat Widget Options

**Decision**: Use Vercel AI SDK + OpenAI for deployable chat widget
**Rationale**:
- Clean, customizable chat UI
- Easy Vercel deployment
- OpenAI streaming support
- React-based (familiar from Docusaurus)
**Alternatives Considered**:
- Chatbase: Good but limited customization on free tier
- Botpress: More complex than needed
- Custom from scratch: Too much for training scope
- Flowise: Good but requires self-hosting

**Implementation Stack**:
```
Next.js + Vercel AI SDK + OpenAI API + Vercel Hosting
```

### 4. Vercel Deployment Process

**Decision**: Use Vercel's GitHub integration for one-click deploy
**Rationale**:
- Free tier includes custom domains
- Automatic SSL
- No server management
- Instant deploys on push
- Environment variable support for API keys

**Deployment Flow**:
1. Push code to GitHub
2. Connect repo to Vercel
3. Set OPENAI_API_KEY env var
4. Deploy automatically
5. Get public URL

### 5. SDD (Spec-Driven Development) Source

**Decision**: Use Panaversity SDD documentation as reference
**Source**: https://ai-native.panaversity.org/docs/SDD-RI-Fundamentals
**Key Concepts to Cover**:
- Explicit over implicit specifications
- Specifications as AI instructions
- Parallelization through clarity
- Writing testable requirements

**Training Focus**:
- Why specs matter for AI
- Basic spec structure
- Hands-on: Write simple spec for SIEHS feature

### 6. Email Auto-Responder Architecture

**Decision**: n8n workflow with Gmail trigger + OpenAI + Gmail send
**Architecture**:

```
Gmail Trigger (IMAP)
     ↓
Extract Email Content
     ↓
OpenAI Chat Completion
  - System: SIEHS context
  - User: Email content
     ↓
Check for Emergency Keywords
     ↓ (if emergency)
Escalate to Human + Auto-acknowledge
     ↓ (else)
Gmail Send Reply
     ↓
Log to Sheet
```

**Emergency Keywords**: "urgent", "emergency", "critical", "dying", "accident"

### 7. ChatKit Implementation Details

**Decision**: Minimal Next.js app with Vercel AI SDK
**Template Structure**:

```typescript
// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are SIEHS AI Assistant...`
      },
      ...messages
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

### 8. SIEHS Agent Configuration

**Decision**: Create specialized SIEHS FAQ agent
**System Prompt**:
```
You are the SIEHS AI Assistant, helping with questions about
Sindh Integrated Emergency & Health Services.

IMPORTANT GUIDELINES:
- Only answer questions about SIEHS services
- For medical emergencies, always direct to call 1122
- Never provide medical diagnoses
- Be helpful, compassionate, and professional
- If unsure, suggest visiting www.siehs.org

SERVICES YOU CAN HELP WITH:
- Emergency ambulance services (1122)
- Telemedicine helpline (1123 - Tele Tabeeb)
- Training programs (RDE)
- General inquiries about SIEHS

For topics outside SIEHS scope, politely explain you can
only help with SIEHS-related questions.
```

### 9. Cost Considerations

**OpenAI API Costs** (as of Dec 2024):

| Model | Input | Output | Recommended Use |
|-------|-------|--------|-----------------|
| GPT-3.5-turbo | $0.0015/1K | $0.002/1K | Training exercises |
| GPT-4 | $0.03/1K | $0.06/1K | Production (if budget allows) |
| GPT-4-turbo | $0.01/1K | $0.03/1K | Good balance |

**Estimated Training Cost**:
- 20 participants × 50 messages × 500 tokens avg = 500K tokens
- GPT-3.5: ~$1.50 total
- GPT-4-turbo: ~$15 total

**Mitigation**: Use GPT-3.5 for training, upgrade for production

### 10. Security & Privacy

**Key Points for Training**:
1. Never expose API keys in frontend code
2. Use environment variables
3. Rate limiting to prevent abuse
4. No patient data in training exercises
5. Audit logging for production use
6. Consider Azure OpenAI for enterprise (data residency)

## Technical Requirements Resolved

| Requirement | Resolution |
|-------------|------------|
| Email auto-responder | n8n + OpenAI node |
| Agent configuration | OpenAI Assistants Playground |
| Chat widget | Next.js + Vercel AI SDK |
| Deployment | Vercel with GitHub integration |
| SDD introduction | Panaversity docs adaptation |
| API security | Environment variables in Vercel |

## Dependencies Identified

1. **OpenAI API Key**: For auto-responder and chat widget
2. **GitHub Account**: For Vercel deployment
3. **Vercel Account**: Free tier sufficient
4. **n8n from Day 2**: Auto-responder builds on existing workflow

## Risk Analysis

| Risk | Mitigation |
|------|------------|
| OpenAI API costs exceed budget | Use GPT-3.5, set spending limits |
| API key exposure | Environment variables, clear instructions |
| Vercel build failures | Test deployment before training |
| OpenAI rate limits | Add delays, use lower concurrency |
| Complex setup for non-tech users | Step-by-step with screenshots |
