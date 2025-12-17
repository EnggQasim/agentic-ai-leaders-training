# Quickstart: Day 3 - AI Deployment & Spec-Driven Development

**Feature**: 003-day3-ai-deployment
**Date**: 2025-12-18

## Prerequisites

### For Content Development
- [ ] Docusaurus project from Day 1/2
- [ ] OpenAI API account with credits
- [ ] Vercel account
- [ ] GitHub account

### For Training Participants
- [ ] Completed Day 1 (Prompt Engineering)
- [ ] Completed Day 2 (n8n Automation)
- [ ] GitHub account (free)
- [ ] OpenAI API key (provided for training)

## Quick Setup

### 1. Create Day 3 Content Structure

```bash
# From frontend directory
mkdir -p docs/day3/module-1-auto-responder
mkdir -p docs/day3/module-2-agentkit
mkdir -p docs/day3/module-3-chatkit
mkdir -p docs/day3/module-4-deployment
mkdir -p docs/day3/module-5-sdd
mkdir -p docs/day3/module-6-strategy
mkdir -p docs/day3/resources
mkdir -p static/templates/chatkit-starter
```

### 2. Create Day 3 Index Page

Create `docs/day3/index.md`:

```markdown
---
sidebar_position: 3
title: Day 3 - AI Deployment
---

# Day 3: AI Deployment & Spec-Driven Development

**Duration**: 8 hours | **Prerequisites**: Day 1 & Day 2 Complete

## Learning Objectives

By the end of Day 3, you will:
- Build an AI-powered email auto-responder
- Configure an AI agent with custom instructions
- Create and customize a chat widget
- Deploy your chatbot to a live URL
- Understand Spec-Driven Development methodology
- Create an AI adoption roadmap for your department

## Modules

| Module | Topic | Duration |
|--------|-------|----------|
| 1 | [n8n Auto Email Responder](./module-1-auto-responder/) | 2 hours |
| 2 | [OpenAI AgentKit](./module-2-agentkit/) | 1.5 hours |
| 3 | [ChatKit Widget Development](./module-3-chatkit/) | 1.5 hours |
| 4 | [Vercel Deployment](./module-4-deployment/) | 1 hour |
| 5 | [Spec-Driven Development](./module-5-sdd/) | 1 hour |
| 6 | [SIEHS AI Strategy Workshop](./module-6-strategy/) | 1 hour |

## What You'll Build

A **Live SIEHS Chatbot** with:
- Custom AI agent trained on SIEHS information
- Branded chat interface
- Public URL accessible from any device
- Auto email responder (in n8n)

## Your Deliverables

1. ✅ Working n8n auto-responder workflow
2. ✅ Configured SIEHS AI agent
3. ✅ Customized chat widget
4. ✅ **Live deployed chatbot (public URL)**
5. ✅ 3-initiative AI roadmap for your department
```

### 3. OpenAI Setup Guide

Create `docs/day3/module-2-agentkit/openai-setup.md`:

```markdown
---
sidebar_position: 1
title: OpenAI Setup
---

# Setting Up OpenAI for AI Development

## Step 1: Create OpenAI Account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section

## Step 2: Create API Key

1. Click "Create new secret key"
2. Name it "SIEHS Training"
3. **Copy and save immediately** (you won't see it again)

⚠️ **Security**: Never share your API key publicly

## Step 3: Set Up Billing (if needed)

1. Go to Settings → Billing
2. Add payment method
3. Set usage limits to prevent surprises

For training, we'll use GPT-3.5-turbo to keep costs low.

## Step 4: Test Your Key

Try this in a terminal:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

✅ If you see a response, you're ready!
```

### 4. Chat Widget Starter Template

Create `static/templates/chatkit-starter/package.json`:

```json
{
  "name": "siehs-chatbot",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "ai": "^2.2.0",
    "next": "^14.0.0",
    "openai": "^4.20.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.2.0"
  }
}
```

Create `static/templates/chatkit-starter/app/api/chat/route.ts`:

```typescript
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are the SIEHS AI Assistant, helping with questions about Sindh Integrated Emergency & Health Services.

GUIDELINES:
- Only answer questions about SIEHS services
- For emergencies, direct users to call 1122
- Never provide medical diagnoses
- Be helpful, professional, and compassionate

SERVICES:
- Emergency Ambulance: 1122
- Telemedicine: 1123 (Tele Tabeeb)
- Training Programs: RDE Department
- Website: www.siehs.org

If asked about topics outside SIEHS, politely explain your scope.`
      },
      ...messages
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

Create `static/templates/chatkit-starter/app/page.tsx`:

```typescript
'use client'

import { useChat } from 'ai/react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <header className="text-center py-4 border-b">
        <h1 className="text-2xl font-bold text-green-700">SIEHS Assistant</h1>
        <p className="text-gray-600">How can I help you today?</p>
      </header>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg ${
              m.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-[80%]'
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about SIEHS services..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Send
        </button>
      </form>
    </div>
  )
}
```

Create `static/templates/chatkit-starter/.env.example`:

```env
# OpenAI API Key - Get from platform.openai.com
OPENAI_API_KEY=sk-your-api-key-here
```

### 5. Vercel Deployment Guide

Create `docs/day3/module-4-deployment/vercel-deploy.md`:

```markdown
---
sidebar_position: 1
title: Deploy to Vercel
---

# Deploying Your Chatbot to Vercel

## Step 1: Push to GitHub

1. Create new repository on GitHub
2. Push your chatbot code:
```bash
git init
git add .
git commit -m "SIEHS Chatbot"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your chatbot repository

## Step 3: Configure Environment Variables

1. In Vercel project settings
2. Go to Environment Variables
3. Add: `OPENAI_API_KEY` = your API key

## Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2 minutes)
3. Get your live URL: `your-project.vercel.app`

## Step 5: Test Your Live Chatbot

1. Open your Vercel URL
2. Ask: "What is SIEHS?"
3. Verify response matches your agent configuration

🎉 **Congratulations!** You have a live AI chatbot!

## Share Your URL

Your chatbot is now accessible to anyone with the link.
Share with colleagues to test!
```

### 6. SDD Template

Create `static/templates/spec-template.md`:

```markdown
# Feature Specification: [Feature Name]

## Overview
[Brief description of what this feature does]

## User Stories

### User Story 1: [Title]
**As a** [type of user]
**I want** [what they want]
**So that** [why they want it]

**Acceptance Criteria:**
- Given [context], When [action], Then [result]
- Given [context], When [action], Then [result]

## Requirements

### Functional Requirements
- FR-001: System MUST [requirement]
- FR-002: System MUST [requirement]

### Non-Functional Requirements
- NFR-001: System SHOULD [requirement]

## Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
```

## Verification Checklist

- [ ] Day 3 content structure created
- [ ] OpenAI account working
- [ ] Chat starter template functional locally
- [ ] Can deploy to Vercel successfully
- [ ] n8n OpenAI node tested
- [ ] SDD template created

## n8n OpenAI Node Setup

For the auto-responder in Module 1:

1. In n8n, search for "OpenAI" node
2. Add credential with your API key
3. Configure:
   - Model: gpt-3.5-turbo
   - Operation: Chat Completion
   - Messages: Include system prompt + email content

## Troubleshooting

### Common Issues

**"Invalid API Key" in OpenAI**
- Check key is correctly copied
- Ensure no extra spaces
- Verify billing is set up

**Vercel build fails**
- Check package.json for errors
- Ensure all dependencies listed
- Check environment variables set

**Chatbot not responding**
- Check browser console for errors
- Verify API route is correct
- Check OpenAI API status

## Next Steps

1. Develop Module 1 (Auto-responder) content
2. Create OpenAI Playground walkthrough
3. Record deployment process
4. Test full flow end-to-end
5. Create SDD exercise worksheet
