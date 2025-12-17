# Implementation Plan: Day 1 - Prompt Engineering Fundamentals

**Branch**: `001-day1-prompt-engineering` | **Date**: 2025-12-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-day1-prompt-engineering/spec.md`

## Summary

Build Day 1 training content covering prompt engineering fundamentals for SIEHS leaders. Content is delivered as a Docusaurus static site with 5 modules progressing from LLM basics to SIEHS-specific applications. The primary deliverable is participant ability to create effective prompts and build a personal prompt library.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+
**Primary Dependencies**: Docusaurus 3.x, React 18, MDX 2.x
**Storage**: Static files (Markdown/MDX), no database
**Testing**: Manual content review, Lighthouse accessibility audits
**Target Platform**: Web (static site deployable to Vercel/GitHub Pages)
**Project Type**: Documentation/Training site (single project)
**Performance Goals**: Page load < 3 seconds, mobile-responsive
**Constraints**: No backend required, free tier hosting
**Scale/Scope**: 5 modules, ~20 content pages, ~15 examples, ~10 exercises

## Constitution Check

*GATE: Passed - All principles satisfied*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Learner-First Design | ✅ | Content designed for non-technical leaders |
| II. Progressive Skill Building | ✅ | Module 1→5 builds progressively |
| III. Hands-On Deliverables | ✅ | Prompt library as Day 1 deliverable |
| IV. Healthcare/Emergency Context | ✅ | All examples use SIEHS scenarios |
| V. Testable Learning Outcomes | ✅ | Success criteria defined in spec |
| VI. Accessibility & Inclusion | ✅ | Lighthouse 85+, Urdu glossary planned |
| VII. Security & Responsible AI | ✅ | Safety module included, disclaimers |
| VIII. Spec-Driven Development | ✅ | Spec complete before planning |

## Project Structure

### Documentation (this feature)

```text
specs/001-day1-prompt-engineering/
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # Content structure
├── quickstart.md        # Setup guide
└── tasks.md             # Implementation tasks (via /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── docs/
│   ├── index.md                    # Training home
│   └── day1/
│       ├── _category_.json         # Sidebar config
│       ├── index.md                # Day 1 overview
│       ├── module-1-intro/
│       │   ├── index.md            # Module overview
│       │   ├── what-is-ai.md
│       │   ├── how-llms-work.md
│       │   ├── prompt-response-cycle.md
│       │   └── siehs-opportunities.md
│       ├── module-2-fundamentals/
│       │   ├── index.md
│       │   ├── zero-shot.md
│       │   ├── one-shot-few-shot.md
│       │   ├── system-prompts.md
│       │   ├── role-based.md
│       │   └── exercise-sms-templates.md
│       ├── module-3-advanced/
│       │   ├── index.md
│       │   ├── chain-of-thought.md
│       │   ├── self-consistency.md
│       │   ├── step-back.md
│       │   ├── react-framework.md
│       │   └── exercise-decision-scenarios.md
│       ├── module-4-configuration/
│       │   ├── index.md
│       │   ├── temperature.md
│       │   ├── tokens-context.md
│       │   ├── top-k-top-p.md
│       │   ├── output-formatting.md
│       │   └── exercise-parameters.md
│       ├── module-5-workshop/
│       │   ├── index.md
│       │   ├── triage-communication.md
│       │   ├── incident-summarization.md
│       │   ├── patient-faq.md
│       │   ├── training-content.md
│       │   └── build-prompt-library.md
│       └── resources/
│           ├── glossary.md
│           ├── cheat-sheet.md
│           └── prompt-templates.md
├── src/
│   ├── components/
│   │   ├── PromptExample.tsx       # Before/after prompt display
│   │   ├── Exercise.tsx            # Hands-on exercise component
│   │   └── CopyButton.tsx          # Copy to clipboard
│   └── css/
│       └── custom.css              # SIEHS branding
├── static/
│   └── img/
│       ├── siehs-logo.svg
│       └── diagrams/
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

**Structure Decision**: Single Docusaurus project for all 3 training days. Day 1 content in `docs/day1/` directory with module-based subdirectories.

## Implementation Phases

### Phase 1: Project Setup (Foundation)

1. Initialize Docusaurus project with TypeScript
2. Configure for training site structure (docs at root, no blog)
3. Set up SIEHS branding (colors, logo)
4. Create navigation structure for 3 days
5. Implement base components (PromptExample, Exercise, CopyButton)

### Phase 2: Module 1 - Introduction to AI & LLMs

1. Create module structure and index
2. Write "What is Generative AI?" section
3. Write "How LLMs Work" with prediction engine explanation
4. Write "Prompt vs Response Cycle" with diagram
5. Write "SIEHS AI Opportunity Landscape" overview

**SIEHS Examples Required**:
- AI applications in emergency services (1122)
- AI in telemedicine (Tele Tabeeb 1123)
- Training automation potential (RDE)

### Phase 3: Module 2 - Prompt Engineering Fundamentals

1. Write zero-shot prompting section with SIEHS examples
2. Write one-shot/few-shot with incident categorization example
3. Write system prompts section
4. Write role-based prompting with medical expert example
5. Create Exercise: Emergency SMS Templates

**SIEHS Examples Required**:
- Zero-shot: Draft patient follow-up message
- Few-shot: Categorize incident reports (accident, medical, fire)
- Role-based: Medical advisor formatting response

### Phase 4: Module 3 - Advanced Prompting Techniques

1. Write Chain of Thought with triage decision example
2. Write Self-Consistency section
3. Write Step-Back prompting with system analysis example
4. Write ReAct framework overview (prep for Day 3)
5. Create Exercise: Complex Decision Scenarios

**SIEHS Examples Required**:
- CoT: Multi-casualty incident resource allocation
- Step-Back: Analyzing response time patterns
- ReAct: Combining reasoning with data lookup (conceptual)

### Phase 5: Module 4 - Configuration & Best Practices

1. Write temperature control section (low for medical, high for creative)
2. Write tokens and context windows explanation
3. Write Top-K/Top-P sampling (optional advanced)
4. Write output formatting (JSON, Markdown, structured)
5. Create Exercise: Parameter Experimentation

**Configuration Profiles**:
| Use Case | Temperature | Max Tokens | Rationale |
|----------|-------------|------------|-----------|
| Medical info | 0.2-0.3 | 500 | Accuracy critical |
| Patient communication | 0.5-0.7 | 300 | Balanced warmth |
| Creative content | 0.8-1.0 | 1000 | More variation |
| Data extraction | 0.0 | 200 | Deterministic |

### Phase 6: Module 5 - SIEHS Applied Workshop

1. Write triage communication prompts section
2. Write incident report summarization section
3. Write patient FAQ automation section
4. Write training content generation section
5. Create "Build Your Prompt Library" guide

**Deliverable Templates**:
1. Patient acknowledgment message
2. Incident summary extractor
3. FAQ response generator
4. Training module outline creator
5. Shift handover report formatter

### Phase 7: Resources & Polish

1. Create glossary with Urdu translations
2. Create printable cheat sheet (PDF-friendly)
3. Create downloadable prompt templates
4. Run Lighthouse accessibility audit
5. Test mobile responsiveness
6. Review all SIEHS examples for accuracy

## Key Components

### PromptExample Component

```tsx
interface PromptExampleProps {
  title: string;
  context: string;
  badPrompt?: string;
  goodPrompt: string;
  systemPrompt?: string;
  expectedOutput?: string;
  technique: 'zero-shot' | 'few-shot' | 'role-based' | 'cot' | 'step-back';
}
```

### Exercise Component

```tsx
interface ExerciseProps {
  title: string;
  description: string;
  scenario: string;
  starterPrompt?: string;
  successCriteria: string[];
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
```

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| @docusaurus/core | ^3.0 | Static site generator |
| @docusaurus/preset-classic | ^3.0 | Default theme/plugins |
| react | ^18.0 | UI components |
| typescript | ^5.0 | Type safety |
| tailwindcss | ^3.0 | Styling (optional) |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI platforms change UI | Medium | Use generic instructions, update screenshots periodically |
| Participants struggle with exercises | High | Provide multiple difficulty levels, detailed walkthrough |
| Time overrun during training | Medium | Strict timeboxing, take-home exercises option |
| Medical misinformation | High | Clear disclaimers, validation emphasis, human-in-the-loop |

## Success Metrics

From spec, verified by:

- **SC-001**: Zero-shot prompt quiz/exercise at Module 2 end
- **SC-002**: Exercise completion tracking (self-reported)
- **SC-003**: Prompt library template with 5 slots
- **SC-004**: Post-training survey link
- **SC-005**: Content coverage checklist vs source curriculum
- **SC-006**: SIEHS context in every example (review checklist)

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Initialize Docusaurus project
3. Begin Phase 1 (Project Setup)
4. Develop content iteratively with SIEHS examples
