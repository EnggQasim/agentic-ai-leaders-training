# Tasks: Day 1 - Prompt Engineering Fundamentals

**Input**: Design documents from `/specs/001-day1-prompt-engineering/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not applicable (content-focused feature, manual verification)

**Organization**: Tasks are grouped by user story to enable independent content development.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- Include exact file paths in descriptions

## Path Conventions

**Single Docusaurus project**:
- Content: `frontend/docs/day1/`
- Components: `frontend/src/components/`
- Static assets: `frontend/static/img/day1/`
- Config: `frontend/` (docusaurus.config.ts, sidebars.ts)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Docusaurus project and configure for training content

- [ ] T001 Initialize Docusaurus project in `frontend/` with TypeScript template
- [ ] T002 Configure `frontend/docusaurus.config.ts` for SIEHS training site structure
- [ ] T003 [P] Configure `frontend/sidebars.ts` for 3-day training navigation
- [ ] T004 [P] Set up Tailwind CSS in `frontend/` for custom styling
- [ ] T005 [P] Create SIEHS branding styles in `frontend/src/css/custom.css`
- [ ] T006 Create training homepage at `frontend/docs/index.md`

---

## Phase 2: Foundational (Shared Components)

**Purpose**: Create reusable components used across all modules

**⚠️ CRITICAL**: Component development must complete before content creation

- [ ] T007 Create PromptExample component in `frontend/src/components/PromptExample.tsx`
- [ ] T008 [P] Create Exercise component in `frontend/src/components/Exercise.tsx`
- [ ] T009 [P] Create CopyButton component in `frontend/src/components/CopyButton.tsx`
- [ ] T010 [P] Create TipBox component in `frontend/src/components/TipBox.tsx`
- [ ] T011 Create Day 1 index page at `frontend/docs/day1/index.md`
- [ ] T012 Create Day 1 category config at `frontend/docs/day1/_category_.json`

**Checkpoint**: Foundation ready - module content can now be developed in parallel

---

## Phase 3: User Story 1 - Understanding AI Communication Basics (Priority: P1) 🎯 MVP

**Goal**: Participants understand LLM fundamentals and why prompting matters

**Independent Test**: Participant can explain what an LLM is and why prompt structure matters using SIEHS examples

### Implementation for User Story 1

- [ ] T013 [US1] Create Module 1 index at `frontend/docs/day1/module-1-intro/index.md`
- [ ] T014 [P] [US1] Write "What is Generative AI?" in `frontend/docs/day1/module-1-intro/what-is-ai.md`
- [ ] T015 [P] [US1] Write "How LLMs Work" (prediction engine) in `frontend/docs/day1/module-1-intro/how-llms-work.md`
- [ ] T016 [P] [US1] Write "Prompt vs Response Cycle" in `frontend/docs/day1/module-1-intro/prompt-response-cycle.md`
- [ ] T017 [US1] Write "SIEHS AI Opportunity Landscape" in `frontend/docs/day1/module-1-intro/siehs-opportunities.md`
- [ ] T018 [US1] Add SIEHS examples: emergency services (1122), telemedicine (1123), training (RDE)
- [ ] T019 [US1] Create Module 1 quiz/self-check questions

**Checkpoint**: Module 1 complete - participants understand AI fundamentals

---

## Phase 4: User Story 2 - Mastering Core Prompting Techniques (Priority: P1)

**Goal**: Participants can use zero-shot, few-shot, and role-based prompting

**Independent Test**: Participant creates 3 different prompts using different techniques for SIEHS use case

### Implementation for User Story 2

- [ ] T020 [US2] Create Module 2 index at `frontend/docs/day1/module-2-fundamentals/index.md`
- [ ] T021 [P] [US2] Write "Zero-Shot Prompting" in `frontend/docs/day1/module-2-fundamentals/zero-shot.md`
- [ ] T022 [P] [US2] Write "One-Shot and Few-Shot Prompting" in `frontend/docs/day1/module-2-fundamentals/few-shot.md`
- [ ] T023 [P] [US2] Write "System Prompts and Context" in `frontend/docs/day1/module-2-fundamentals/system-prompts.md`
- [ ] T024 [P] [US2] Write "Role-Based Prompting" in `frontend/docs/day1/module-2-fundamentals/role-based.md`
- [ ] T025 [US2] Create Exercise: Emergency SMS Templates in `frontend/docs/day1/module-2-fundamentals/exercise-sms.md`
- [ ] T026 [US2] Add SIEHS examples for each technique (patient communication, incident categorization)
- [ ] T027 [US2] Create prompt templates for Module 2 exercises

**Checkpoint**: Module 2 complete - participants can write basic prompts

---

## Phase 5: User Story 3 - Applying Advanced Reasoning Techniques (Priority: P2)

**Goal**: Participants understand CoT, Step-Back, and ReAct for complex scenarios

**Independent Test**: Participant applies CoT prompting to break down complex emergency resource allocation

### Implementation for User Story 3

- [ ] T028 [US3] Create Module 3 index at `frontend/docs/day1/module-3-advanced/index.md`
- [ ] T029 [P] [US3] Write "Chain of Thought (CoT)" in `frontend/docs/day1/module-3-advanced/chain-of-thought.md`
- [ ] T030 [P] [US3] Write "Self-Consistency" in `frontend/docs/day1/module-3-advanced/self-consistency.md`
- [ ] T031 [P] [US3] Write "Step-Back Prompting" in `frontend/docs/day1/module-3-advanced/step-back.md`
- [ ] T032 [P] [US3] Write "ReAct Framework" in `frontend/docs/day1/module-3-advanced/react-framework.md`
- [ ] T033 [US3] Create Exercise: Complex Decision Scenarios in `frontend/docs/day1/module-3-advanced/exercise-decisions.md`
- [ ] T034 [US3] Add SIEHS examples (multi-casualty triage, resource allocation)

**Checkpoint**: Module 3 complete - participants understand advanced techniques

---

## Phase 6: User Story 4 - Hands-on Practice with SIEHS Use Cases (Priority: P1)

**Goal**: Participants create prompts for real SIEHS scenarios and build prompt library

**Independent Test**: Participant produces 5+ working prompts for their SIEHS department

### Implementation for User Story 4

- [ ] T035 [US4] Create Module 5 index at `frontend/docs/day1/module-5-workshop/index.md`
- [ ] T036 [P] [US4] Write "Triage Communication Prompts" in `frontend/docs/day1/module-5-workshop/triage-communication.md`
- [ ] T037 [P] [US4] Write "Incident Report Summarization" in `frontend/docs/day1/module-5-workshop/incident-summarization.md`
- [ ] T038 [P] [US4] Write "Patient FAQ Automation" in `frontend/docs/day1/module-5-workshop/patient-faq.md`
- [ ] T039 [P] [US4] Write "Training Content Generation" in `frontend/docs/day1/module-5-workshop/training-content.md`
- [ ] T040 [US4] Create "Build Your Prompt Library" guide in `frontend/docs/day1/module-5-workshop/build-library.md`
- [ ] T041 [US4] Create 5 downloadable prompt templates for SIEHS scenarios

**Checkpoint**: Module 5 complete - participants have working prompt library

---

## Phase 7: User Story 5 - Understanding AI Configuration & Safety (Priority: P2)

**Goal**: Participants understand LLM parameters and safety for healthcare

**Independent Test**: Participant can configure AI parameters appropriately for different task types

### Implementation for User Story 5

- [ ] T042 [US5] Create Module 4 index at `frontend/docs/day1/module-4-configuration/index.md`
- [ ] T043 [P] [US5] Write "Temperature and Creativity Control" in `frontend/docs/day1/module-4-configuration/temperature.md`
- [ ] T044 [P] [US5] Write "Token Limits and Context Windows" in `frontend/docs/day1/module-4-configuration/tokens-context.md`
- [ ] T045 [P] [US5] Write "Top-K and Top-P Sampling" in `frontend/docs/day1/module-4-configuration/sampling.md`
- [ ] T046 [P] [US5] Write "Output Formatting" in `frontend/docs/day1/module-4-configuration/output-formatting.md`
- [ ] T047 [US5] Create Exercise: Parameter Experimentation in `frontend/docs/day1/module-4-configuration/exercise-parameters.md`
- [ ] T048 [US5] Add healthcare safety guidelines and responsible AI content

**Checkpoint**: Module 4 complete - participants understand configuration and safety

---

## Phase 8: Polish & Resources

**Purpose**: Reference materials and final polish

- [ ] T049 [P] Create glossary with Urdu translations in `frontend/docs/day1/resources/glossary.md`
- [ ] T050 [P] Create printable cheat sheet in `frontend/docs/day1/resources/cheat-sheet.md`
- [ ] T051 [P] Create prompt templates reference in `frontend/docs/day1/resources/prompt-templates.md`
- [ ] T052 Run Lighthouse accessibility audit on all Day 1 pages
- [ ] T053 Test mobile responsiveness (375px viewport)
- [ ] T054 Review all SIEHS examples for accuracy and relevance
- [ ] T055 Verify all internal links work correctly
- [ ] T056 Run build and fix any errors: `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on T001-T002 completion
- **Phases 3-7 (User Stories)**: All depend on Phase 2 completion
- **Phase 8 (Polish)**: Depends on all content phases

### User Story Dependencies

- **US1 (Module 1)**: No dependencies - can start after Phase 2
- **US2 (Module 2)**: No dependencies - can start after Phase 2
- **US3 (Module 3)**: No dependencies - can start after Phase 2
- **US4 (Module 5)**: Ideally after US1-US3 for consistent examples
- **US5 (Module 4)**: No dependencies - can start after Phase 2

### Parallel Opportunities

- T003, T004, T005 can run in parallel (different config files)
- T007, T008, T009, T010 can run in parallel (different components)
- All content files within a module marked [P] can run in parallel
- Different modules (US1-US5) can be developed in parallel by different writers

---

## Parallel Example: User Story 2

```bash
# Launch all content sections together:
Task: "Write Zero-Shot Prompting in frontend/docs/day1/module-2-fundamentals/zero-shot.md"
Task: "Write Few-Shot Prompting in frontend/docs/day1/module-2-fundamentals/few-shot.md"
Task: "Write System Prompts in frontend/docs/day1/module-2-fundamentals/system-prompts.md"
Task: "Write Role-Based Prompting in frontend/docs/day1/module-2-fundamentals/role-based.md"
```

---

## Implementation Strategy

### MVP First (Module 1 + Module 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational components
3. Complete Phase 3: User Story 1 (Module 1 - AI Basics)
4. Complete Phase 4: User Story 2 (Module 2 - Core Techniques)
5. **STOP and VALIDATE**: Test content flow and accessibility
6. Deploy/preview if ready

### Incremental Delivery

1. Setup + Foundational → Site structure ready
2. Add Module 1 → Basic understanding
3. Add Module 2 → Core prompting skills
4. Add Module 4 → Configuration knowledge
5. Add Module 3 → Advanced techniques
6. Add Module 5 → Workshop & prompt library
7. Polish → Final review

---

## Summary

- **Total Tasks**: 56
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 6 tasks
- **US1 (Module 1)**: 7 tasks
- **US2 (Module 2)**: 8 tasks
- **US3 (Module 3)**: 7 tasks
- **US4 (Module 5)**: 7 tasks
- **US5 (Module 4)**: 7 tasks
- **Polish**: 8 tasks

**Suggested MVP**: Phase 1 + Phase 2 + US1 + US2 (27 tasks)
