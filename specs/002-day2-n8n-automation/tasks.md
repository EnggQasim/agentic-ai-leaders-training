# Tasks: Day 2 - n8n Workflow Automation

**Input**: Design documents from `/specs/002-day2-n8n-automation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not applicable (content-focused feature, manual workflow verification)

**Organization**: Tasks are grouped by user story to enable independent content development.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Include exact file paths in descriptions

## Path Conventions

**Extends Day 1 Docusaurus project**:
- Content: `frontend/docs/day2/`
- Screenshots: `frontend/static/img/day2/`
- Workflow templates: `frontend/static/workflows/`

---

## Phase 1: Setup (Day 2 Structure)

**Purpose**: Create Day 2 content structure and prepare n8n environment

- [ ] T001 Create Day 2 directory structure in `frontend/docs/day2/`
- [ ] T002 Create Day 2 index page at `frontend/docs/day2/index.md`
- [ ] T003 Create Day 2 category config at `frontend/docs/day2/_category_.json`
- [ ] T004 [P] Create screenshots directory at `frontend/static/img/day2/`
- [ ] T005 [P] Create workflow templates directory at `frontend/static/workflows/`
- [ ] T006 Set up n8n Cloud account for screenshots and testing
- [ ] T007 Create Google Cloud project for OAuth credentials

---

## Phase 2: Foundational (n8n Environment & Test Data)

**Purpose**: Prepare n8n environment and test data for all modules

**⚠️ CRITICAL**: Environment setup must complete before screenshot capture

- [ ] T008 Configure n8n Cloud workspace for training
- [ ] T009 Create Google Sheets test data template with sample contacts
- [ ] T010 Set up Gmail test account for exercises
- [ ] T011 Configure Google OAuth credentials in n8n
- [ ] T012 [P] Capture n8n workspace overview screenshot
- [ ] T013 [P] Capture node panel screenshot
- [ ] T014 [P] Capture execution log screenshot

**Checkpoint**: n8n environment ready - content can now be developed with real screenshots

---

## Phase 3: User Story 1 - Understanding No-Code Automation (Priority: P1) 🎯 MVP

**Goal**: Participants understand automation value and n8n's capabilities

**Independent Test**: Participant can explain how automation could save hours and list 3+ SIEHS automation opportunities

### Implementation for User Story 1

- [ ] T015 [US1] Create Module 1 index at `frontend/docs/day2/module-1-intro/index.md`
- [ ] T016 [P] [US1] Write "What is Workflow Automation?" in `frontend/docs/day2/module-1-intro/what-is-automation.md`
- [ ] T017 [P] [US1] Write "n8n Overview and Philosophy" in `frontend/docs/day2/module-1-intro/n8n-overview.md`
- [ ] T018 [P] [US1] Write "Cloud vs Self-Hosted" in `frontend/docs/day2/module-1-intro/cloud-vs-selfhosted.md`
- [ ] T019 [US1] Write "SIEHS Automation Opportunities" in `frontend/docs/day2/module-1-intro/siehs-opportunities.md`
- [ ] T020 [US1] Create demo workflow and capture screenshots
- [ ] T021 [US1] Add ROI examples (time saved per workflow)

**Checkpoint**: Module 1 complete - participants understand automation value

---

## Phase 4: User Story 2 - Mastering the n8n Interface (Priority: P1)

**Goal**: Participants can navigate n8n, understand nodes, and create basic workflows

**Independent Test**: Participant creates a simple 3-node workflow independently

### Implementation for User Story 2

- [ ] T022 [US2] Create Module 2 index at `frontend/docs/day2/module-2-interface/index.md`
- [ ] T023 [P] [US2] Write "n8n Account Setup" with screenshots in `frontend/docs/day2/module-2-interface/n8n-setup.md`
- [ ] T024 [P] [US2] Write "Workspace Tour" with annotated screenshots in `frontend/docs/day2/module-2-interface/workspace-tour.md`
- [ ] T025 [P] [US2] Write "Nodes Explained" in `frontend/docs/day2/module-2-interface/nodes-explained.md`
- [ ] T026 [P] [US2] Write "Connections and Data Flow" in `frontend/docs/day2/module-2-interface/connections-dataflow.md`
- [ ] T027 [P] [US2] Write "Credentials Management" in `frontend/docs/day2/module-2-interface/credentials.md`
- [ ] T028 [P] [US2] Write "Execution History and Debugging" in `frontend/docs/day2/module-2-interface/execution-history.md`
- [ ] T029 [US2] Create Exercise: First Simple Workflow in `frontend/docs/day2/module-2-interface/exercise-first-workflow.md`
- [ ] T030 [US2] Capture all interface screenshots (workspace, nodes, execution)

**Checkpoint**: Module 2 complete - participants can navigate n8n confidently

---

## Phase 5: User Story 3 - Building Google Sheets to Gmail Workflow (Priority: P1)

**Goal**: Participants build complete email automation from spreadsheet data

**Independent Test**: Participant's workflow successfully sends automated emails from spreadsheet data

### Implementation for User Story 3

- [ ] T031 [US3] Create Module 3 index at `frontend/docs/day2/module-3-google-sheets/index.md`
- [ ] T032 [P] [US3] Write "Google Cloud Console Setup" with screenshots in `frontend/docs/day2/module-3-google-sheets/google-cloud-setup.md`
- [ ] T033 [P] [US3] Write "OAuth Configuration" in `frontend/docs/day2/module-3-google-sheets/oauth-configuration.md`
- [ ] T034 [P] [US3] Write "Google Sheets Read Operations" in `frontend/docs/day2/module-3-google-sheets/sheets-read.md`
- [ ] T035 [P] [US3] Write "Google Sheets Write/Update" in `frontend/docs/day2/module-3-google-sheets/sheets-write.md`
- [ ] T036 [US3] Write "Filtering and Searching Data" in `frontend/docs/day2/module-3-google-sheets/filtering-data.md`
- [ ] T037 [US3] Create Exercise: Sheet Reader Workflow in `frontend/docs/day2/module-3-google-sheets/exercise-sheet-reader.md`
- [ ] T038 [US3] Capture Google Cloud Console screenshots (project, APIs, OAuth)
- [ ] T039 [US3] Create Module 4 index at `frontend/docs/day2/module-4-gmail/index.md`
- [ ] T040 [P] [US3] Write "Gmail Setup" in `frontend/docs/day2/module-4-gmail/gmail-setup.md`
- [ ] T041 [P] [US3] Write "Send Email Node" in `frontend/docs/day2/module-4-gmail/send-email-node.md`
- [ ] T042 [P] [US3] Write "Variables and Expressions" in `frontend/docs/day2/module-4-gmail/variables-expressions.md`
- [ ] T043 [P] [US3] Write "HTML Email Templates" in `frontend/docs/day2/module-4-gmail/html-templates.md`
- [ ] T044 [US3] Create Complete Project: Google Sheets → Gmail in `frontend/docs/day2/module-4-gmail/project-email-automation.md`
- [ ] T045 [US3] Build and export workflow JSON to `frontend/static/workflows/patient-followup.json`
- [ ] T046 [US3] Capture workflow building screenshots (each step)

**Checkpoint**: Modules 3-4 complete - participants have working email automation

---

## Phase 6: User Story 4 - Customizing Email Templates (Priority: P2)

**Goal**: Participants create dynamic, personalized email content

**Independent Test**: Participant creates email template with 3+ dynamic fields from spreadsheet

### Implementation for User Story 4

- [ ] T047 [US4] Add advanced expressions section to `frontend/docs/day2/module-4-gmail/variables-expressions.md`
- [ ] T048 [P] [US4] Create expression examples with SIEHS data fields
- [ ] T049 [P] [US4] Add date/time formatting examples
- [ ] T050 [US4] Create email template examples (patient follow-up, appointment reminder)

**Checkpoint**: Email customization content complete

---

## Phase 7: User Story 5 - Error Handling and Monitoring (Priority: P2)

**Goal**: Participants add error handling and monitoring to workflows

**Independent Test**: Participant's workflow includes error notification and handles failures gracefully

### Implementation for User Story 5

- [ ] T051 [US5] Create Module 5 index at `frontend/docs/day2/module-5-production/index.md`
- [ ] T052 [P] [US5] Write "Error Handling with Error Trigger" in `frontend/docs/day2/module-5-production/error-handling.md`
- [ ] T053 [P] [US5] Write "Notifications and Alerts" in `frontend/docs/day2/module-5-production/notifications.md`
- [ ] T054 [P] [US5] Write "Scheduling Workflows (Cron)" in `frontend/docs/day2/module-5-production/scheduling.md`
- [ ] T055 [P] [US5] Write "Execution Monitoring" in `frontend/docs/day2/module-5-production/monitoring.md`
- [ ] T056 [US5] Write "Security Considerations for SIEHS" in `frontend/docs/day2/module-5-production/security.md`
- [ ] T057 [US5] Create Exercise: Add Error Handling in `frontend/docs/day2/module-5-production/exercise-error-handling.md`
- [ ] T058 [US5] Build and export error notification workflow to `frontend/static/workflows/error-notification.json`

**Checkpoint**: Module 5 complete - workflows are production-ready

---

## Phase 8: User Story 6 - SIEHS Automation Opportunities (Priority: P2)

**Goal**: Participants identify additional automation opportunities for their department

**Independent Test**: Participant documents 3 additional workflow ideas with required nodes

### Implementation for User Story 6

- [ ] T059 [US6] Create Module 6 index at `frontend/docs/day2/module-6-workshop/index.md`
- [ ] T060 [US6] Write "Brainstorm Use Cases" in `frontend/docs/day2/module-6-workshop/brainstorm-use-cases.md`
- [ ] T061 [US6] Create SIEHS workflow ideas template
- [ ] T062 [US6] Add example workflows: incident alert, shift reminder

**Checkpoint**: Workshop content complete - participants have automation roadmap

---

## Phase 9: Polish & Resources

**Purpose**: Reference materials and final polish

- [ ] T063 [P] Create n8n cheat sheet in `frontend/docs/day2/resources/n8n-cheat-sheet.md`
- [ ] T064 [P] Create expression reference in `frontend/docs/day2/resources/expression-reference.md`
- [ ] T065 [P] Create troubleshooting guide in `frontend/docs/day2/resources/troubleshooting.md`
- [ ] T066 Build and export incident alert workflow to `frontend/static/workflows/incident-alert.json`
- [ ] T067 Verify all screenshots are current and accurate
- [ ] T068 Run Lighthouse accessibility audit on all Day 2 pages
- [ ] T069 Test mobile responsiveness
- [ ] T070 Verify all workflow JSON files are valid and importable
- [ ] T071 Run build and fix any errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on T006, T007 (n8n and Google setup)
- **Phases 3-8 (User Stories)**: All depend on Phase 2 completion
- **Phase 9 (Polish)**: Depends on all content phases

### User Story Dependencies

- **US1 (Module 1)**: No dependencies - can start after Phase 2
- **US2 (Module 2)**: No dependencies - can start after Phase 2
- **US3 (Module 3-4)**: Requires Google OAuth setup from Phase 2
- **US4 (Templates)**: Ideally after US3 (builds on email workflow)
- **US5 (Module 5)**: Ideally after US3 (adds error handling to workflow)
- **US6 (Module 6)**: Ideally after US3-US5 (uses learned concepts)

### Parallel Opportunities

- T004, T005 can run in parallel (different directories)
- T012, T013, T014 can run in parallel (different screenshots)
- All content files within a module marked [P] can run in parallel
- Modules 1-2 can be developed in parallel with Google setup

---

## Parallel Example: User Story 3

```bash
# Launch all Google Sheets content together:
Task: "Write Google Cloud Console Setup in frontend/docs/day2/module-3-google-sheets/google-cloud-setup.md"
Task: "Write OAuth Configuration in frontend/docs/day2/module-3-google-sheets/oauth-configuration.md"
Task: "Write Sheets Read Operations in frontend/docs/day2/module-3-google-sheets/sheets-read.md"
Task: "Write Sheets Write/Update in frontend/docs/day2/module-3-google-sheets/sheets-write.md"
```

---

## Implementation Strategy

### MVP First (Modules 1-4 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: n8n environment
3. Complete US1: Module 1 (Automation intro)
4. Complete US2: Module 2 (n8n interface)
5. Complete US3: Modules 3-4 (Google Sheets → Gmail)
6. **STOP and VALIDATE**: Test complete workflow works
7. Deploy/preview if ready

### Incremental Delivery

1. Setup + Foundational → n8n environment ready
2. Add Module 1 → Automation understanding
3. Add Module 2 → Interface proficiency
4. Add Modules 3-4 → Working email workflow (MVP!)
5. Add Module 5 → Production readiness
6. Add Module 6 → Workshop and planning
7. Polish → Final review

---

## Summary

- **Total Tasks**: 71
- **Phase 1 (Setup)**: 7 tasks
- **Phase 2 (Foundational)**: 7 tasks
- **US1 (Module 1)**: 7 tasks
- **US2 (Module 2)**: 9 tasks
- **US3 (Module 3-4)**: 16 tasks
- **US4 (Templates)**: 4 tasks
- **US5 (Module 5)**: 8 tasks
- **US6 (Module 6)**: 4 tasks
- **Polish**: 9 tasks

**Suggested MVP**: Phase 1 + Phase 2 + US1 + US2 + US3 (46 tasks)
