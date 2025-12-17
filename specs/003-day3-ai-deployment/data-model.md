# Data Model: Day 3 - AI Deployment & Spec-Driven Development

**Feature**: 003-day3-ai-deployment
**Date**: 2025-12-18

## Overview

Day 3 focuses on deploying AI solutions. The data model covers AI agent configuration, chat widget structure, and specification documents.

## Training Content Entities

### 1. Module

Same structure as Day 1/Day 2 (see Day 1 data-model.md).

## AI Solution Entities

### 2. AIAgent (OpenAI Assistant)

Configuration for an AI agent.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | OpenAI assistant ID | Required after creation |
| name | string | Agent display name | Required, max 60 chars |
| description | string | Purpose description | Required, max 200 chars |
| instructions | string | System prompt/behavior | Required, max 32768 chars |
| model | string | GPT model to use | Enum: gpt-3.5-turbo, gpt-4, gpt-4-turbo |
| tools | Tool[] | Enabled capabilities | Optional |
| files | FileRef[] | Knowledge base files | Optional |
| metadata | object | Custom metadata | Optional |

### 3. AgentInstructions

Structured system prompt for SIEHS agent.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| role | string | Who the agent is | Required |
| guidelines | string[] | Behavior rules | Min 3 items |
| services | string[] | What agent can help with | Min 2 items |
| boundaries | string[] | What agent cannot do | Min 2 items |
| escalation | string | When to direct to humans | Required |
| tone | string | Communication style | Required |

**SIEHS Agent Template**:
```yaml
role: "SIEHS AI Assistant for public inquiries"
guidelines:
  - "Only answer questions about SIEHS services"
  - "For medical emergencies, direct to call 1122"
  - "Never provide medical diagnoses"
  - "Be compassionate and professional"
services:
  - "Emergency ambulance (1122)"
  - "Telemedicine helpline (1123)"
  - "Training programs (RDE)"
  - "General SIEHS inquiries"
boundaries:
  - "No medical advice or diagnoses"
  - "No topics outside SIEHS scope"
escalation: "For complex issues, suggest visiting siehs.org or calling helpline"
tone: "Helpful, professional, empathetic"
```

### 4. ChatWidget

Deployable chat interface configuration.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Widget identifier | Required |
| name | string | Display name | Required |
| agentId | string | Connected AI agent | Required |
| branding | BrandingConfig | Visual customization | Required |
| greeting | string | Initial message | Required, max 200 chars |
| placeholder | string | Input placeholder text | Optional |
| position | string | Widget position | Enum: bottom-right, bottom-left |

### 5. BrandingConfig

Visual customization for chat widget.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| primaryColor | string | Main brand color | Hex color |
| headerTitle | string | Widget header text | Max 30 chars |
| logoUrl | string | Logo image URL | Valid URL |
| fontFamily | string | Font family | Optional |
| borderRadius | string | Corner rounding | CSS value |

**SIEHS Branding**:
```json
{
  "primaryColor": "#006B3F",
  "headerTitle": "SIEHS Assistant",
  "logoUrl": "/siehs-logo.svg",
  "fontFamily": "Inter, sans-serif",
  "borderRadius": "12px"
}
```

### 6. Deployment

Vercel deployment record.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Deployment ID | Vercel-generated |
| projectName | string | Vercel project name | Required |
| url | string | Public URL | Generated |
| status | string | Deployment state | Enum: building, ready, error |
| createdAt | datetime | Deploy timestamp | Auto |
| environment | EnvConfig | Environment variables | Required |

### 7. EnvConfig

Environment variables for deployment.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| OPENAI_API_KEY | string | OpenAI API key | Required, secret |
| AGENT_ID | string | OpenAI Assistant ID | Optional |
| ALLOWED_ORIGINS | string | CORS origins | Optional |

## Specification Entities (SDD)

### 8. Specification

Basic spec structure for SDD introduction.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Spec identifier | Required |
| title | string | Feature name | Required, max 80 chars |
| description | string | What it does | Required, max 500 chars |
| userStories | UserStory[] | User scenarios | Min 1 story |
| requirements | Requirement[] | Functional requirements | Min 3 items |
| successCriteria | string[] | Measurable outcomes | Min 2 items |

### 9. UserStory

User scenario in specification.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| title | string | Story title | Required |
| description | string | User journey | Required |
| acceptanceCriteria | string[] | Given/When/Then | Min 1 criterion |
| priority | string | Importance | Enum: P1, P2, P3 |

### 10. Requirement

Functional requirement.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Requirement ID | Format: FR-XXX |
| description | string | What system must do | Required |
| type | string | Requirement type | Enum: functional, non-functional |

## Auto-Responder Workflow Data

### 11. IncomingEmail

Structure for email trigger data.

| Field | Type | Description |
|-------|------|-------------|
| from | string | Sender email |
| subject | string | Email subject |
| body | string | Email content (text) |
| receivedAt | datetime | When received |
| threadId | string | Gmail thread ID |

### 12. AutoResponse

Generated response record.

| Field | Type | Description |
|-------|------|-------------|
| originalEmailId | string | Reference to incoming |
| responseText | string | AI-generated response |
| escalated | boolean | Flagged for human review |
| sentAt | datetime | When reply sent |
| model | string | GPT model used |
| tokensUsed | integer | API usage |

## Content Structure (Docusaurus)

```
docs/
├── day3/
│   ├── _category_.json
│   ├── index.md                      # Day 3 overview
│   ├── module-1-auto-responder/
│   │   ├── index.md
│   │   ├── email-trigger-setup.md
│   │   ├── openai-node.md
│   │   ├── prompt-engineering.md
│   │   ├── escalation-logic.md
│   │   └── project-auto-responder.md
│   ├── module-2-agentkit/
│   │   ├── index.md
│   │   ├── what-are-agents.md
│   │   ├── openai-playground.md
│   │   ├── configure-instructions.md
│   │   ├── add-knowledge.md
│   │   └── exercise-siehs-agent.md
│   ├── module-3-chatkit/
│   │   ├── index.md
│   │   ├── chat-ui-overview.md
│   │   ├── vercel-ai-sdk.md
│   │   ├── customization.md
│   │   ├── connect-to-agent.md
│   │   └── exercise-build-widget.md
│   ├── module-4-deployment/
│   │   ├── index.md
│   │   ├── vercel-setup.md
│   │   ├── github-connect.md
│   │   ├── environment-vars.md
│   │   ├── custom-domain.md
│   │   └── project-deploy-chatbot.md
│   ├── module-5-sdd/
│   │   ├── index.md
│   │   ├── why-specs-matter.md
│   │   ├── sdd-principles.md
│   │   ├── writing-specs.md
│   │   └── exercise-write-spec.md
│   ├── module-6-strategy/
│   │   ├── index.md
│   │   ├── synthesis.md
│   │   ├── prioritization.md
│   │   ├── roadmap-template.md
│   │   └── governance.md
│   └── resources/
│       ├── api-reference.md
│       ├── prompt-templates.md
│       ├── deployment-checklist.md
│       └── sdd-template.md
├── static/
│   └── templates/
│       ├── chatkit-starter/          # Starter project for deployment
│       │   ├── app/
│       │   ├── package.json
│       │   └── README.md
│       └── spec-template.md
```

## Chat Widget Project Structure

```
chatkit-starter/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # OpenAI API route
│   ├── page.tsx                # Chat UI page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Styles
├── components/
│   └── chat/
│       ├── ChatWidget.tsx      # Main chat component
│       ├── Message.tsx         # Message bubble
│       └── InputArea.tsx       # Message input
├── lib/
│   └── config.ts               # Configuration
├── public/
│   └── siehs-logo.svg
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── .env.example
```

## State Transitions

### Deployment Status

```
[Not Started] → [Code Ready] → [Pushed to GitHub]
                                      ↓
                           [Connected to Vercel]
                                      ↓
                              [Building] → [Error]
                                      ↓
                                 [Ready/Live]
                                      ↓
                            [Custom Domain Added]
```

### Auto-Responder Email Flow

```
[Received] → [Parsed] → [AI Processing]
                              ↓
               ┌──────────────┴──────────────┐
               ↓                              ↓
        [Emergency Detected]          [Normal Response]
               ↓                              ↓
     [Escalate + Acknowledge]          [Send AI Reply]
               ↓                              ↓
          [Logged]                        [Logged]
```
