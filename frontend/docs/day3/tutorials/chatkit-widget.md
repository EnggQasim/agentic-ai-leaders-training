---
sidebar_position: 3
title: "Tutorial: ChatKit Widget Deployment"
---

# Tutorial: Deploying ChatKit Widget with Your AI Agent

In this tutorial, you'll connect your Weather Agent (from the previous tutorial) to a beautiful chat interface using ChatKit, and deploy it to Vercel for public access.

## What You'll Build

A production-ready chat widget that:
1. Connects to your deployed AI Agent
2. Provides a modern chat interface
3. Is customizable with SIEHS branding
4. Runs on Vercel with a public URL

```
[Your Agent] ← Workflow ID → [ChatKit App] → [Vercel] → [Public URL]
```

## Prerequisites

- Completed [AgentKit Weather Agent Tutorial](./agentkit-weather-agent) (you have a Workflow ID)
- Node.js v20+ installed
- npm or pnpm installed
- GitHub account (free)
- Vercel account (free)
- Code editor (VS Code recommended)

---

## Part 1: Understanding the Architecture

### How ChatKit Works

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR DEPLOYMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐         ┌──────────────┐                 │
│   │    User      │ ──────▶ │   ChatKit    │                 │
│   │  (Browser)   │ ◀────── │   (Vercel)   │                 │
│   └──────────────┘         └──────┬───────┘                 │
│                                   │                          │
│                         Workflow ID                          │
│                                   │                          │
│                            ┌──────▼───────┐                 │
│                            │   OpenAI     │                 │
│                            │ Responses API│                 │
│                            └──────┬───────┘                 │
│                                   │                          │
│                            ┌──────▼───────┐                 │
│                            │  Your Agent  │                 │
│                            │  (Weather)   │                 │
│                            └──────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Components Overview

| Component | Hosted On | Purpose |
|-----------|-----------|---------|
| **ChatKit Frontend** | Vercel | User interface |
| **OpenAI Responses API** | OpenAI | Routes requests |
| **Your Agent** | OpenAI | AI logic |

---

## Part 2: Clone ChatKit Starter App

### Step 2.1: Open Terminal

Open your terminal (Command Prompt, PowerShell, or Terminal on Mac).

### Step 2.2: Clone the Repository

```bash
git clone https://github.com/openai/openai-chatkit-starter-app.git
```

### Step 2.3: Navigate to Project

```bash
cd openai-chatkit-starter-app
```

### Step 2.4: Install Dependencies

```bash
npm install
```

Wait for installation to complete (1-2 minutes).

:::tip Using pnpm?
If you prefer pnpm:
```bash
pnpm install
```
:::

---

## Part 3: Configure Environment Variables

### Step 3.1: Create Environment File

Create a file named `.env.local` in the project root:

```bash
# On Mac/Linux
touch .env.local

# On Windows (PowerShell)
New-Item .env.local
```

### Step 3.2: Add Your Credentials

Open `.env.local` in your editor and add:

```env
# Your Workflow ID from Agent Builder
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_your_workflow_id_here

# Your OpenAI API Key
OPENAI_API_KEY=sk-proj-your_api_key_here
```

:::warning Security Alert!
- **NEVER** commit `.env.local` to Git
- **NEVER** share your API key publicly
- The `.gitignore` file should already exclude `.env.local`
:::

### Step 3.3: Verify .gitignore

Check that `.gitignore` contains:

```
.env.local
.env*.local
```

---

## Part 4: Customize for SIEHS

### Step 4.1: Open Configuration File

Open `lib/config.ts` in your editor.

### Step 4.2: Update Greeting Message

Find and modify the `GREETING` constant:

```typescript
export const GREETING = "Hello! I'm the SIEHS Weather Assistant. How can I help you today?";
```

### Step 4.3: Update Input Placeholder

```typescript
export const PLACEHOLDER_INPUT = "Ask about weather in Sindh...";
```

### Step 4.4: Add Conversation Starters

```typescript
export const STARTER_PROMPTS = [
  "What's the weather in Karachi?",
  "Is it safe to travel to Hyderabad today?",
  "Will it rain this week?",
  "Any severe weather alerts?",
];
```

### Step 4.5: Complete Configuration Example

```typescript
// lib/config.ts

export const GREETING = "Hello! I'm the SIEHS Weather Assistant. I can help you with weather information across Sindh. How can I assist you?";

export const PLACEHOLDER_INPUT = "Ask about weather in Sindh...";

export const STARTER_PROMPTS = [
  "What's the weather in Karachi?",
  "Is it safe to travel today?",
  "Any weather alerts for Sindh?",
  "What should I wear outside?",
];

export const APP_TITLE = "SIEHS Weather Assistant";
```

---

## Part 5: Customize Theme (Optional)

### Step 5.1: Use ChatKit Studio

1. Go to [ChatKit Studio](https://chatkit.openai.com/studio) (if available)
2. Customize:
   - **Theme**: Light or Dark mode
   - **Colors**: Use SIEHS blue (#1e88e5)
   - **Typography**: Professional fonts
   - **Border Radius**: Rounded or square

### Step 5.2: Export Configuration

ChatKit Studio provides a JSON configuration. Copy it.

### Step 5.3: Apply to Component

Open `components/ChatKitPanel.tsx` and update the `useChatKit()` hook:

```typescript
const chatkit = useChatKit({
  theme: {
    mode: 'light',
    accentColor: '#1e88e5', // SIEHS Blue
    borderRadius: 'rounded',
  },
  startScreen: {
    greeting: GREETING,
    starterPrompts: STARTER_PROMPTS,
  },
  composer: {
    placeholder: PLACEHOLDER_INPUT,
  },
});
```

---

## Part 6: Test Locally

### Step 6.1: Start Development Server

```bash
npm run dev
```

### Step 6.2: Open in Browser

Go to: [http://localhost:3000](http://localhost:3000)

### Step 6.3: Test Functionality

| Test | Expected Result |
|------|-----------------|
| Page loads | Chat interface visible |
| Greeting shows | "Hello! I'm the SIEHS Weather Assistant..." |
| Starter prompts | 4 clickable suggestions |
| Send message | Agent responds with weather |
| Mobile view | Responsive design works |

### Step 6.4: Test Queries

Try these in the chat:

1. "What's the weather in Karachi?"
2. "Will it rain tomorrow in Hyderabad?"
3. "Is it too hot to go outside?"
4. Click a starter prompt

### Step 6.5: Stop Server

Press `Ctrl + C` to stop the development server.

---

## Part 7: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended for Beginners)

#### Step A.1: Push to GitHub

First, create a new repository on GitHub:

1. Go to [github.com/new](https://github.com/new)
2. Name it: `siehs-weather-chatbot`
3. Keep it **Private** (recommended)
4. Click **Create repository**

Then push your code:

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial SIEHS Weather ChatKit setup"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/siehs-weather-chatbot.git

# Push
git push -u origin main
```

#### Step A.2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Log in with GitHub
3. Click **"Add New Project"**
4. Select your `siehs-weather-chatbot` repository
5. Click **Import**

#### Step A.3: Configure Environment Variables

Before deploying, add environment variables in Vercel:

1. Expand **Environment Variables** section
2. Add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` | `wf_your_workflow_id` |
| `OPENAI_API_KEY` | `sk-proj-your_key` |

3. Click **Deploy**

#### Step A.4: Wait for Deployment

Deployment takes 1-3 minutes. You'll get a URL like:
`https://siehs-weather-chatbot.vercel.app`

---

### Option B: Vercel CLI (For Advanced Users)

#### Step B.1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step B.2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### Step B.3: Deploy

```bash
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **siehs-weather-chatbot**
- Directory? **./** (current)
- Override settings? **N**

#### Step B.4: Set Environment Variables

```bash
vercel env add NEXT_PUBLIC_CHATKIT_WORKFLOW_ID
# Enter your workflow ID when prompted

vercel env add OPENAI_API_KEY
# Enter your API key when prompted
```

#### Step B.5: Redeploy with Variables

```bash
vercel --prod
```

---

## Part 8: Configure Security

### Step 8.1: Add Domain Allowlist

Protect your Workflow ID by restricting which domains can use it:

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to **Settings** → **Security**
3. Find **Domain Allowlist**
4. Add your Vercel domain: `siehs-weather-chatbot.vercel.app`

### Step 8.2: Set Usage Limits

1. In OpenAI Dashboard, go to **Usage Limits**
2. Set monthly budget limit
3. Configure alert thresholds

---

## Part 9: Test Production Deployment

### Step 9.1: Access Your URL

Open your Vercel URL in a browser.

### Step 9.2: Run Test Scenarios

| Scenario | Expected |
|----------|----------|
| Load page | Chat interface appears |
| Ask weather | Accurate response with SIEHS context |
| Mobile access | Responsive and functional |
| Share URL | Others can access and use |

### Step 9.3: Share with Testers

Share the URL with colleagues for feedback:
```
https://siehs-weather-chatbot.vercel.app
```

---

## Complete Project Structure

```
siehs-weather-chatbot/
├── .env.local              ← Your credentials (not in Git!)
├── .gitignore              ← Ignores .env.local
├── package.json            ← Dependencies
├── lib/
│   └── config.ts           ← Customized settings
├── components/
│   └── ChatKitPanel.tsx    ← Theme configuration
├── app/
│   └── page.tsx            ← Main page
└── public/
    └── logo.svg            ← SIEHS logo (optional)
```

---

## What You've Accomplished

You've successfully:
- Cloned and configured the ChatKit starter app
- Connected your Weather Agent via Workflow ID
- Customized branding for SIEHS
- Deployed to Vercel with a public URL
- Configured security settings

---

## Key Commands Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Run locally | `npm run dev` |
| Deploy to Vercel | `vercel` |
| Deploy to production | `vercel --prod` |

---

## Troubleshooting

### Chat not loading?
- Verify `.env.local` has correct Workflow ID
- Check browser console for errors
- Ensure Vercel has environment variables set

### Agent not responding?
- Confirm agent is deployed and active
- Check API key has credits
- Verify Workflow ID is correct

### Deployment failed?
- Check Vercel build logs
- Verify Node.js version compatibility
- Ensure all dependencies installed

### CORS errors?
- Add your domain to OpenAI allowlist
- Wait a few minutes for settings to propagate

---

## Next Steps

Congratulations! You've deployed your first AI chatbot!

Consider:
1. **Custom Domain**: Add a professional domain
2. **Analytics**: Track usage in Vercel Analytics
3. **More Agents**: Create additional SIEHS agents (FAQ, Emergency, Training)
4. **Embed Widget**: Add chat to existing SIEHS websites

---

## Quick Reference Card

| Item | Value |
|------|-------|
| **Your Vercel URL** | `https://_______________.vercel.app` |
| **Your Workflow ID** | `wf___________________` |
| **GitHub Repo** | `https://github.com/___/___` |
| **OpenAI Dashboard** | [platform.openai.com](https://platform.openai.com) |
| **Vercel Dashboard** | [vercel.com/dashboard](https://vercel.com/dashboard) |

---

## Cost Estimation

| Resource | Free Tier | Paid |
|----------|-----------|------|
| **Vercel Hosting** | 100GB bandwidth/month | $20/month |
| **OpenAI API** | None (pay per use) | ~$0.002/query |
| **Custom Domain** | Included | Included |

For 1,000 queries/month: **~$2-5/month** total

This is your **Day 3 Deliverable** - a live, deployed AI chatbot!
