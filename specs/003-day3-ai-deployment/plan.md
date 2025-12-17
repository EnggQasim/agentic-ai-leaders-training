# Implementation Plan: Day 3 - AI Deployment & Spec-Driven Development

**Branch**: `003-day3-ai-deployment` | **Date**: 2025-12-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-day3-ai-deployment/spec.md`

## Summary

Build Day 3 training content covering AI deployment and strategic planning. Content progresses from n8n AI integration through agent configuration to live chatbot deployment, culminating in SDD methodology and AI strategy workshop. The primary deliverable is a deployed, accessible SIEHS chatbot with a department AI roadmap.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+
**Primary Dependencies**: Docusaurus 3.x, Next.js 14, Vercel AI SDK, OpenAI SDK
**Storage**: Static files (Markdown/MDX), deployed chatbot on Vercel
**Testing**: Live deployment verification, API integration tests
**Target Platform**: Web (Docusaurus docs) + Vercel (chatbot deployment)
**Project Type**: Documentation + Deployable application template
**Performance Goals**: Page load < 3 seconds, chatbot response < 5 seconds
**Constraints**: OpenAI API costs, Vercel free tier, non-technical audience
**Scale/Scope**: 6 modules, ~20 content pages, 1 deployable template, workflow JSON

## Constitution Check

*GATE: Passed - All principles satisfied*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Learner-First Design | ✅ | Step-by-step deployment for non-technical users |
| II. Progressive Skill Building | ✅ | Builds on Day 1 prompting + Day 2 n8n |
| III. Hands-On Deliverables | ✅ | Live deployed chatbot as deliverable |
| IV. Healthcare/Emergency Context | ✅ | SIEHS agent configuration |
| V. Testable Learning Outcomes | ✅ | Live URL as verification |
| VI. Accessibility & Inclusion | ✅ | Public chatbot accessible to all |
| VII. Security & Responsible AI | ✅ | API key security, appropriate disclaimers |
| VIII. Spec-Driven Development | ✅ | SDD module teaches the methodology |

## Project Structure

### Documentation (this feature)

```text
specs/003-day3-ai-deployment/
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # Content & application structure
├── quickstart.md        # Setup guide
└── tasks.md             # Implementation tasks (via /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── docs/
│   └── day3/
│       ├── _category_.json
│       ├── index.md                        # Day 3 overview
│       ├── module-1-auto-responder/
│       │   ├── index.md
│       │   ├── email-trigger.md
│       │   ├── openai-node.md
│       │   ├── response-prompting.md
│       │   ├── escalation-logic.md
│       │   └── project-auto-responder.md
│       ├── module-2-agentkit/
│       │   ├── index.md
│       │   ├── what-are-agents.md
│       │   ├── openai-setup.md
│       │   ├── playground-tour.md
│       │   ├── configure-instructions.md
│       │   ├── knowledge-bases.md
│       │   └── exercise-siehs-agent.md
│       ├── module-3-chatkit/
│       │   ├── index.md
│       │   ├── chat-ui-overview.md
│       │   ├── vercel-ai-sdk.md
│       │   ├── project-setup.md
│       │   ├── customization.md
│       │   └── exercise-build-widget.md
│       ├── module-4-deployment/
│       │   ├── index.md
│       │   ├── github-basics.md
│       │   ├── vercel-setup.md
│       │   ├── environment-vars.md
│       │   ├── deploy-process.md
│       │   └── project-go-live.md
│       ├── module-5-sdd/
│       │   ├── index.md
│       │   ├── why-specs-matter.md
│       │   ├── sdd-principles.md
│       │   ├── writing-specs.md
│       │   └── exercise-write-spec.md
│       ├── module-6-strategy/
│       │   ├── index.md
│       │   ├── three-day-synthesis.md
│       │   ├── prioritization-framework.md
│       │   ├── roadmap-template.md
│       │   ├── governance.md
│       │   └── exercise-ai-roadmap.md
│       └── resources/
│           ├── api-costs.md
│           ├── security-checklist.md
│           ├── troubleshooting.md
│           └── next-steps.md
├── static/
│   └── templates/
│       ├── chatkit-starter/               # Downloadable starter project
│       │   ├── app/
│       │   │   ├── api/chat/route.ts
│       │   │   ├── page.tsx
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   ├── components/
│       │   │   └── Chat.tsx
│       │   ├── package.json
│       │   ├── tailwind.config.js
│       │   ├── tsconfig.json
│       │   ├── .env.example
│       │   └── README.md
│       ├── spec-template.md               # SDD template
│       └── roadmap-template.md            # AI roadmap template
```

**Structure Decision**: Extends Day 1/2 Docusaurus project. Includes downloadable chatbot starter template that participants deploy to Vercel.

## Implementation Phases

### Phase 1: Environment & Templates Setup

1. Create OpenAI account for training API keys
2. Set up Vercel team/project for demonstration
3. Build chatkit-starter template project
4. Test deployment flow end-to-end
5. Create n8n auto-responder workflow template

### Phase 2: Module 1 - n8n Auto Email Responder

1. Write email trigger (IMAP/Gmail) setup guide
2. Write OpenAI node configuration
3. Write response prompting for email context
4. Write escalation logic (emergency detection)
5. Create complete project walkthrough
6. Export workflow JSON for participants

**Auto-Responder Workflow**:
```
Gmail Trigger → Extract Content → OpenAI → Check Emergency → Branch:
                                                    ├─ Yes → Notify + Acknowledge
                                                    └─ No → Send AI Reply → Log
```

### Phase 3: Module 2 - OpenAI AgentKit

1. Write "What are AI Agents?" introduction
2. Create OpenAI account setup guide
3. Write Assistants Playground tour with screenshots
4. Write instruction configuration guide
5. Write knowledge base addition (optional advanced)
6. Create Exercise: Configure SIEHS FAQ Agent

**Agent System Prompt Template**:
```
You are the SIEHS AI Assistant...
[Role + Guidelines + Services + Boundaries + Tone]
```

### Phase 4: Module 3 - ChatKit Widget Development

1. Write chat UI concepts overview
2. Write Vercel AI SDK introduction
3. Write project setup from template
4. Write customization guide (branding, messages)
5. Create Exercise: Build SIEHS Chat Widget

**Key Components**:
- Chat container
- Message bubbles (user/assistant)
- Input area with send button
- Header with branding

### Phase 5: Module 4 - Vercel Deployment

1. Write GitHub basics (for non-technical users)
2. Write Vercel account setup
3. Write environment variables guide
4. Write deployment process step-by-step
5. Create Project: Deploy Live Chatbot

**Deployment Steps**:
1. Download starter template
2. Push to GitHub
3. Connect Vercel
4. Add OPENAI_API_KEY
5. Deploy → Get URL

### Phase 6: Module 5 - Spec-Driven Development

1. Write "Why Specifications Matter for AI"
2. Write SDD principles (explicit, parallelization)
3. Write specification structure guide
4. Create Exercise: Write spec for SIEHS feature
5. Link to Panaversity SDD documentation

**SDD Key Points**:
- Specifications as AI instructions
- Explicit > implicit
- Parallelization through clarity
- Test-first thinking

### Phase 7: Module 6 - SIEHS AI Strategy Workshop

1. Write three-day synthesis guide
2. Write prioritization framework (impact vs effort)
3. Create roadmap template
4. Write governance considerations
5. Create Exercise: 3-Initiative AI Roadmap

**Roadmap Template**:
| Initiative | Description | Day Skills Used | Priority | Effort |
|------------|-------------|-----------------|----------|--------|
| 1. [Name] | [What] | Day 1/2/3 | P1/P2/P3 | Low/Med/High |

### Phase 8: Resources & Polish

1. Create API costs reference
2. Create security checklist
3. Create troubleshooting guide
4. Create "next steps" resources
5. Test all code examples
6. Accessibility audit

## Key Components (Chatbot Template)

### API Route

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json()
  // OpenAI streaming response
}
```

### Chat Component

```typescript
// components/Chat.tsx
export function Chat() {
  const { messages, input, handleSubmit } = useChat()
  // Chat UI rendering
}
```

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| next | ^14.0 | React framework for chatbot |
| ai | ^2.2 | Vercel AI SDK for streaming |
| openai | ^4.20 | OpenAI API client |
| tailwindcss | ^3.3 | Styling |

## External Services Required

| Service | Purpose | Cost |
|---------|---------|------|
| OpenAI API | Chat completions | ~$0.002/1K tokens |
| Vercel | Chatbot hosting | Free tier |
| GitHub | Code repository | Free |
| n8n Cloud | Auto-responder | Free tier |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI API costs | Medium | Use GPT-3.5, set spending limits |
| Deployment complexity | High | Detailed screenshots, video backup |
| API key exposure | Critical | Clear security instructions |
| Vercel build failures | Medium | Pre-tested template |
| Non-technical overwhelm | High | Simple starter template |

## Success Metrics

From spec, verified by:

- **SC-001**: n8n workflow execution log showing success
- **SC-002**: OpenAI Playground agent responding correctly
- **SC-003**: Chat widget screenshot showing customization
- **SC-004**: Live Vercel URL accessible from phone
- **SC-005**: Quiz/discussion on SDD principles
- **SC-006**: Completed roadmap document
- **SC-007**: Post-training survey results
- **SC-008**: Chatbot still working 24hr post-training

## Screenshot Requirements

| Module | Screenshots Needed |
|--------|-------------------|
| Auto-responder | n8n workflow, OpenAI node config, test execution |
| AgentKit | OpenAI platform, Playground, instruction config |
| ChatKit | Template code, local dev, chat UI |
| Deployment | GitHub, Vercel dashboard, deployed site |
| SDD | Spec template, example filled spec |
| Strategy | Roadmap template, prioritization matrix |

Estimated total: 20-25 unique screenshots

## Downloadable Resources

1. `chatkit-starter.zip` - Complete chatbot project
2. `auto-responder.json` - n8n workflow export
3. `spec-template.md` - SDD specification template
4. `roadmap-template.md` - AI roadmap template
5. `siehs-agent-instructions.txt` - Agent system prompt

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Create and test chatkit-starter template
3. Build n8n auto-responder workflow
4. Take all screenshots
5. Develop content with step-by-step guides
6. Test deployment flow with test users
