# Implementation Plan: Day 2 - n8n Workflow Automation

**Branch**: `002-day2-n8n-automation` | **Date**: 2025-12-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-day2-n8n-automation/spec.md`

## Summary

Build Day 2 training content covering n8n workflow automation for SIEHS leaders. Content progresses from automation concepts through interface mastery to building a complete Google Sheets → Gmail workflow. The primary deliverable is a working, exportable email automation that participants can use at SIEHS.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+
**Primary Dependencies**: Docusaurus 3.x, React 18, MDX 2.x
**Storage**: Static files (Markdown/MDX), workflow JSON templates
**Testing**: Manual workflow testing, screenshot verification
**Target Platform**: Web (Docusaurus) + n8n Cloud
**Project Type**: Documentation/Training site (extends Day 1 project)
**Performance Goals**: Page load < 3 seconds, workflows execute < 30 seconds
**Constraints**: n8n Cloud free tier limits, Google API quotas
**Scale/Scope**: 6 modules, ~18 content pages, ~10 tutorials, 3 workflow templates

## Constitution Check

*GATE: Passed - All principles satisfied*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Learner-First Design | ✅ | Visual no-code platform for non-technical users |
| II. Progressive Skill Building | ✅ | Builds on Day 1, progresses to deployment |
| III. Hands-On Deliverables | ✅ | Working email automation as deliverable |
| IV. Healthcare/Emergency Context | ✅ | Patient communication workflow example |
| V. Testable Learning Outcomes | ✅ | Workflow execution as verification |
| VI. Accessibility & Inclusion | ✅ | Visual interface, step-by-step guides |
| VII. Security & Responsible AI | ✅ | Credential security, data privacy addressed |
| VIII. Spec-Driven Development | ✅ | Spec complete before planning |

## Project Structure

### Documentation (this feature)

```text
specs/002-day2-n8n-automation/
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # Content & workflow structure
├── quickstart.md        # Setup guide
└── tasks.md             # Implementation tasks (via /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── docs/
│   └── day2/
│       ├── _category_.json
│       ├── index.md                    # Day 2 overview
│       ├── module-1-intro/
│       │   ├── index.md
│       │   ├── what-is-automation.md
│       │   ├── n8n-overview.md
│       │   ├── cloud-vs-selfhosted.md
│       │   └── siehs-opportunities.md
│       ├── module-2-interface/
│       │   ├── index.md
│       │   ├── n8n-setup.md
│       │   ├── workspace-tour.md
│       │   ├── nodes-explained.md
│       │   ├── connections-dataflow.md
│       │   ├── credentials.md
│       │   ├── execution-history.md
│       │   └── exercise-first-workflow.md
│       ├── module-3-google-sheets/
│       │   ├── index.md
│       │   ├── google-cloud-setup.md
│       │   ├── oauth-configuration.md
│       │   ├── sheets-read.md
│       │   ├── sheets-write.md
│       │   ├── filtering-data.md
│       │   └── exercise-sheet-reader.md
│       ├── module-4-gmail/
│       │   ├── index.md
│       │   ├── gmail-setup.md
│       │   ├── send-email-node.md
│       │   ├── variables-expressions.md
│       │   ├── html-templates.md
│       │   └── project-email-automation.md
│       ├── module-5-production/
│       │   ├── index.md
│       │   ├── error-handling.md
│       │   ├── notifications.md
│       │   ├── scheduling.md
│       │   ├── monitoring.md
│       │   ├── security.md
│       │   └── exercise-add-error-handling.md
│       ├── module-6-workshop/
│       │   ├── index.md
│       │   └── brainstorm-use-cases.md
│       └── resources/
│           ├── n8n-cheat-sheet.md
│           ├── expression-reference.md
│           ├── troubleshooting.md
│           └── workflow-templates/
│               ├── patient-followup.json
│               ├── incident-alert.json
│               └── error-notification.json
├── src/
│   └── components/
│       ├── WorkflowDiagram.tsx      # Visual workflow representation
│       ├── NodeConfig.tsx           # Node configuration display
│       └── n8nEmbed.tsx            # Embed n8n screenshots
├── static/
│   └── img/
│       └── day2/
│           ├── n8n-workspace.png
│           ├── google-cloud-*.png
│           └── workflow-*.png
└── static/
    └── workflows/
        └── *.json                   # Downloadable workflow files
```

**Structure Decision**: Extends Day 1 Docusaurus project. Day 2 content in `docs/day2/` with heavy use of screenshots for n8n interface.

## Implementation Phases

### Phase 1: Environment Setup

1. Set up n8n Cloud account for screenshots
2. Create Google Cloud project for training
3. Configure OAuth credentials
4. Create test Google Sheet with sample data
5. Build and export sample workflows as JSON

### Phase 2: Module 1 - Introduction to Automation

1. Write "What is Workflow Automation?" section
2. Write "n8n Overview and Philosophy" section
3. Write "Cloud vs Self-Hosted" comparison
4. Write "SIEHS Automation Opportunities" mapping
5. Create demo workflow screenshot/video

**Content Points**:
- ROI of automation (time saved)
- Why n8n for SIEHS (privacy, flexibility)
- Visual programming benefits for non-coders

### Phase 3: Module 2 - n8n Interface Deep Dive

1. Create n8n account setup guide with screenshots
2. Write workspace tour with annotated screenshots
3. Write nodes explanation (triggers, actions, logic)
4. Write connections and data flow section
5. Write credentials management section
6. Write execution history and debugging guide
7. Create Exercise: Build first simple workflow

**Key Screenshots Needed**:
- n8n workspace overview (annotated)
- Node panel with categories
- Node configuration panel
- Execution log view
- Credential storage view

### Phase 4: Module 3 - Google Sheets Integration

1. Create Google Cloud Console setup guide
2. Write OAuth configuration walkthrough
3. Write Google Sheets read operations
4. Write Google Sheets write/update operations
5. Write data filtering and searching
6. Create Exercise: Build sheet reader workflow

**Step-by-Step Coverage**:
1. Create Google Cloud project
2. Enable Sheets API
3. Configure OAuth consent
4. Create credentials
5. Connect in n8n
6. Test read operation

### Phase 5: Module 4 - Gmail & Email Workflow

1. Write Gmail API setup (extends Sheets auth)
2. Write Send Email node configuration
3. Write variables and expressions tutorial
4. Write HTML email formatting guide
5. Create complete project: Google Sheets → Gmail Automation
6. Include testing and debugging steps

**Project Workflow Steps**:
1. Schedule/Manual trigger
2. Read pending contacts from Sheet
3. Loop over each contact
4. Send personalized email
5. Update Sheet status to "sent"
6. Handle any errors

### Phase 6: Module 5 - Production Readiness

1. Write error handling with Error Trigger node
2. Write notification setup (Slack/Email alerts)
3. Write scheduling with Cron expressions
4. Write execution monitoring best practices
5. Write security considerations for SIEHS
6. Create Exercise: Add error handling to workflow

**Error Handling Pattern**:
```
Main Workflow → Error Trigger → Send Alert + Log Error
```

### Phase 7: Module 6 - Workshop & Resources

1. Create brainstorming exercise for SIEHS use cases
2. Create n8n cheat sheet
3. Create expression reference guide
4. Create troubleshooting guide
5. Package workflow JSON templates for download
6. Final review and polish

## Key Components

### WorkflowDiagram Component

```tsx
interface WorkflowDiagramProps {
  nodes: {
    id: string;
    type: string;
    label: string;
    position: { x: number; y: number };
  }[];
  connections: {
    from: string;
    to: string;
  }[];
  highlightNode?: string;
}
```

### NodeConfig Component

```tsx
interface NodeConfigProps {
  nodeType: string;
  nodeName: string;
  parameters: Record<string, any>;
  description: string;
}
```

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| n8n Cloud | Latest | Workflow automation platform |
| Google Cloud | N/A | API access for Sheets/Gmail |
| mermaid | ^10.0 | Workflow diagrams in docs |

## External Services Required

| Service | Purpose | Setup |
|---------|---------|-------|
| n8n Cloud | Workflow building | Free tier account |
| Google Cloud Console | OAuth credentials | Project creation |
| Google Sheets | Data source | Shared training sheet |
| Gmail | Email sending | Connected via OAuth |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| n8n UI changes | High | Date screenshots, note version |
| Google API quota exceeded | Medium | Pre-test with limited data |
| OAuth setup complexity | High | Detailed screenshots, video backup |
| Workflow not saving | Medium | Frequent exports, JSON backups |
| Email deliverability issues | Medium | Use test emails, check spam |

## Success Metrics

From spec, verified by:

- **SC-001**: Screenshot of successful Google auth in n8n
- **SC-002**: Workflow execution screenshot showing success
- **SC-003**: Gmail showing 3+ sent test emails
- **SC-004**: Quiz on node types and data flow
- **SC-005**: JSON export download link working
- **SC-006**: Brainstorm exercise completion
- **SC-007**: Error handling node present in final workflow

## Screenshot Requirements

| Module | Screenshots Needed |
|--------|-------------------|
| Setup | n8n signup, workspace first view |
| Interface | Canvas, node panel, execution log, credentials |
| Google | Cloud Console, API enable, OAuth config, consent screen |
| Workflow | Each step of building, execution results |
| Errors | Error trigger setup, alert configuration |

Estimated total: 25-30 unique screenshots

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Set up n8n Cloud account and take screenshots
3. Create Google Cloud project for training
4. Develop content with real workflow examples
5. Test all workflows end-to-end before publishing
