---
id: 0007
title: Day 2 n8n Workflow Tutorials
stage: green
date: 2025-12-18
surface: agent
model: claude-opus-4-5-20251101
feature: 001-docusaurus-book
branch: master
user: m.qasim
command: /sp.implement
labels: ["n8n", "automation", "gmail", "google-sheets", "day2", "tutorials"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/docs/day2/tutorials/_category_.json
  - frontend/docs/day2/tutorials/basic-workflow.md
  - frontend/docs/day2/tutorials/gmail-sheets-workflow.md
  - frontend/docs/day2/index.md
  - Basic_workflow.json
  - gmail_google_sheet_sent.json
tests:
  - npm run build (passed)
---

## Prompt

@Basic_workflow.json @gmail_google_sheet_sent.json

day 2 training we will teach both workflow of n8n now add step-by-step tutorials for it in day2

## Response snapshot

Created two comprehensive n8n workflow tutorials for Day 2 training:

**Tutorial 1: Basic Customer Workflow** (`basic-workflow.md`)
Based on `Basic_workflow.json`:
- Manual Trigger → Customer Datastore → Edit Fields → Customer Messenger
- Step-by-step instructions for each node
- Expression syntax explanation (`{{ $json.field }}`)
- Data flow and transformation concepts
- SIEHS use case applications

**Tutorial 2: Gmail + Sheets Automation** (`gmail-sheets-workflow.md`)
Based on `gmail_google_sheet_sent.json`:
- Schedule Trigger → Google Sheets → Edit Fields → Gmail
- Complete Google Cloud OAuth setup guide
- Google Sheets data structure setup
- Gmail node configuration with personalized templates
- Production activation instructions
- Troubleshooting section

Both tutorials include:
- Complete workflow JSON for reference
- Key concepts learned summary
- SIEHS-specific applications table
- Next steps guidance

## Outcome

- ✅ Impact: Added comprehensive hands-on tutorials for Day 2 n8n training
- 🧪 Tests: Build passed, deployment successful
- 📁 Files: 6 files created/modified (~1200 lines)
- 🔁 Next prompts: Add error handling tutorial, HTML email templates
- 🧠 Reflection: JSON workflow files provided excellent structure for tutorials

## Evaluation notes (flywheel)

- Failure modes observed: Initial build failed due to placeholder image reference - fixed by replacing with note admonition
- Graders run and results (PASS/FAIL): Build PASS, Deploy PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add screenshots/diagrams for visual learners
