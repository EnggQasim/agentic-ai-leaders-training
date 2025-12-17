---
id: 0002
title: Create SIEHS 3-Day Agentic AI Training Specs
stage: spec
date: 2025-12-18
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: m.qasim
command: direct-prompt
labels: ["siehs", "training", "prompt-engineering", "n8n", "ai-deployment", "spec"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-day1-prompt-engineering/spec.md
  - specs/002-day2-n8n-automation/spec.md
  - specs/003-day3-ai-deployment/spec.md
  - CLAUDE.md
tests:
  - none
---

## Prompt

now i'm writing new book for 3 days training of SIEHS emergency service: https://www.siehs.org/

training name: Agentic AI for Leaders: Architecting SIEHS's AI-Enabled Organization

# day one content:
https://github.com/panaversity/learn-low-code-agentic-ai/tree/main/00_prompt_engineering

# day two content:
n8n introduction
n8n complete interface
create auto email sender workflow using Google sheet->gmail send

# day three
n8n auto email responser
Agentkit openai
Chatkit openai
chatkit wadget
chatkit deploy on vercel
SDD: https://ai-native.panaversity.org/docs/SDD-RI-Fundamentals

now remove all previouse contents make new specs for this

## Response snapshot

Created comprehensive specifications for a 3-day SIEHS Agentic AI training program:

**Day 1 - Prompt Engineering Fundamentals** (001-day1-prompt-engineering/spec.md)
- 5 modules covering LLM fundamentals, prompting techniques (zero-shot, few-shot, role-based), advanced reasoning (CoT, ReAct), configuration, and hands-on SIEHS workshops
- 5 user stories with acceptance scenarios
- SIEHS-specific use cases: triage, patient communication, incident reporting

**Day 2 - n8n Workflow Automation** (002-day2-n8n-automation/spec.md)
- 6 modules: automation intro, n8n interface, Google Sheets integration, Gmail automation, production readiness, use case workshop
- Core deliverable: Working Google Sheets → Gmail auto email sender workflow
- 6 user stories covering interface mastery to error handling

**Day 3 - AI Deployment & SDD** (003-day3-ai-deployment/spec.md)
- 6 modules: n8n auto responder, AgentKit, ChatKit, Vercel deployment, SDD intro, strategy workshop
- Core deliverable: Live deployed SIEHS chatbot
- SDD introduction for organizational AI strategy

Updated CLAUDE.md with new project context for SIEHS training.

## Outcome

- Impact: Replaced 8 previous specs with 3 new comprehensive training day specifications
- Tests: None (spec creation phase)
- Files: 4 files modified/created (3 specs + CLAUDE.md)
- Next prompts: Create plans for each day, generate tasks, implement Docusaurus training book
- Reflection: Successfully restructured project from Physical AI textbook to SIEHS leadership training

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A - spec creation
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with /sp.plan for each training day
