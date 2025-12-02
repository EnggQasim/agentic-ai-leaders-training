# Agent Specification: Spec-Driven Development (SDD) Planning Agent

**Version**: 1.0.0
**Created**: 2025-12-02
**Status**: Production-Ready Specification
**Source**: Physical AI Textbook Project Experience + SpecKit Plus Framework

## Overview

An AI agent specialized in structured software development workflows: specifications, planning, task generation, and implementation tracking. Enforces consistent development practices through templates, traceability (PHR/ADR), and quality gates.

## Agent Identity

```yaml
name: sdd-planning-agent
type: orchestrator
framework: claude-agent-sdk  # or langchain/crewai
role: Development Workflow Orchestrator
goal: Guide projects from requirements to implementation with full traceability
backstory: |
  Expert in software architecture, agile methodologies, and structured development.
  Ensures consistent, traceable, and high-quality software delivery through
  spec-driven workflows and automated documentation.
```

## Core Capabilities

### 1. Feature Specification (`/sp.specify`)

- Transform natural language requirements into structured specs
- Define user stories with acceptance scenarios
- Identify edge cases and constraints
- Set success criteria and measurable outcomes

### 2. Architecture Planning (`/sp.plan`)

- Generate architectural plans with trade-off analysis
- Consider multiple approaches with rationale
- Define interfaces and API contracts
- Address non-functional requirements (NFRs)

### 3. Task Generation (`/sp.tasks`)

- Create dependency-ordered task lists
- Include test cases for each task
- Assign priorities and estimates
- Track implementation progress

### 4. Architecture Decision Records (`/sp.adr`)

- Detect architecturally significant decisions
- Document context, decision, and consequences
- Track alternatives considered
- Link to related specs and implementations

### 5. Prompt History Records (`/sp.phr`)

- Record every significant interaction
- Preserve full context for traceability
- Route to appropriate directories
- Enable knowledge capture and audit

## Workflow Stages

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   SPECIFY   │────▶│    PLAN     │────▶│   TASKS     │
│   spec.md   │     │   plan.md   │     │  tasks.md   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   ▼                   │
       │            ┌─────────────┐            │
       │            │    ADRs     │            │
       │            │  (optional) │            │
       │            └─────────────┘            │
       │                                       │
       ▼                                       ▼
┌─────────────┐                         ┌─────────────┐
│ CLARIFY     │                         │  IMPLEMENT  │
│ (if needed) │                         │  red→green  │
└─────────────┘                         └─────────────┘
       │                                       │
       ▼                                       ▼
┌─────────────┐                         ┌─────────────┐
│    PHR      │◀────────────────────────│    PHR      │
│  (always)   │                         │  (always)   │
└─────────────┘                         └─────────────┘
```

## Tools & Commands

### Slash Commands

```yaml
commands:
  - /sp.specify:
      description: Create or update feature specification from natural language
      input: Feature description
      output: specs/{feature}/spec.md
      template: .specify/templates/spec-template.md

  - /sp.plan:
      description: Generate implementation plan with architecture decisions
      input: spec.md reference
      output: specs/{feature}/plan.md
      template: .specify/templates/plan-template.md

  - /sp.tasks:
      description: Generate dependency-ordered tasks with test cases
      input: spec.md + plan.md
      output: specs/{feature}/tasks.md
      template: .specify/templates/tasks-template.md

  - /sp.adr:
      description: Create Architecture Decision Record
      input: Decision title and context
      output: history/adr/{sequence}-{slug}.md
      template: .specify/templates/adr-template.md

  - /sp.phr:
      description: Create Prompt History Record
      input: Interaction context
      output: history/prompts/{route}/{id}-{slug}.prompt.md
      template: .specify/templates/phr-template.prompt.md

  - /sp.clarify:
      description: Ask targeted clarification questions
      input: spec.md
      output: Encoded answers back into spec

  - /sp.analyze:
      description: Cross-artifact consistency analysis
      input: spec.md, plan.md, tasks.md
      output: Analysis report

  - /sp.implement:
      description: Execute tasks from tasks.md
      input: tasks.md
      output: Code implementation + PHRs

  - /sp.git.commit_pr:
      description: Autonomous git workflow for commits and PRs
      input: Changes context
      output: Commit + optional PR
```

## File Structure

```
project/
├── .specify/
│   ├── memory/
│   │   └── constitution.md      # Project principles
│   ├── templates/
│   │   ├── spec-template.md
│   │   ├── plan-template.md
│   │   ├── tasks-template.md
│   │   ├── adr-template.md
│   │   └── phr-template.prompt.md
│   └── scripts/
│       └── bash/
│           ├── create-phr.sh
│           └── create-new-feature.sh
├── specs/
│   └── {feature-name}/
│       ├── spec.md              # Requirements
│       ├── plan.md              # Architecture
│       ├── tasks.md             # Implementation tasks
│       ├── research.md          # (optional)
│       ├── data-model.md        # (optional)
│       └── checklists/
│           └── requirements.md
├── history/
│   ├── adr/
│   │   ├── 001-{decision}.md
│   │   └── 002-{decision}.md
│   └── prompts/
│       ├── constitution/        # Constitution changes
│       ├── {feature-name}/      # Feature-specific PHRs
│       └── general/             # General interactions
└── CLAUDE.md                    # Agent instructions
```

## Specification Template

```markdown
# Feature Specification: {Feature Name}

**Feature Branch**: `{feature-branch}`
**Created**: {YYYY-MM-DD}
**Status**: Draft | In Progress | Complete

## User Scenarios & Testing *(mandatory)*

### User Story 1 - {Title} (Priority: P1)

{User story description}

**Why this priority**: {Rationale}

**Independent Test**: {How to test in isolation}

**Acceptance Scenarios**:
1. **Given** {context}, **When** {action}, **Then** {result}
2. ...

---

### Edge Cases

- {Edge case 1}: {Handling}
- {Edge case 2}: {Handling}

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST {requirement}
- **FR-002**: System SHOULD {requirement}

### Non-Functional Requirements
- **NFR-001**: {Performance/Security/etc.}

### Key Entities
- **Entity**: {Description with fields}

## Assumptions
- {Assumption 1}

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: {Metric} {Target} ({Measurement method})
```

## Plan Template

```markdown
# Implementation Plan: {Feature Name}

**Feature**: `{feature-branch}`
**Spec**: specs/{feature}/spec.md
**Created**: {YYYY-MM-DD}

## Architecture Decisions

### Decision 1: {Title}

**Context**: {Why this decision is needed}

**Options Considered**:
| Option | Pros | Cons |
|--------|------|------|
| A | ... | ... |
| B | ... | ... |

**Decision**: {Chosen option}

**Rationale**: {Why this option}

**Consequences**:
- Positive: {...}
- Negative: {...}

---

## Technical Design

### Components
- {Component 1}: {Responsibility}

### Interfaces
```
POST /api/endpoint
Input: { field: type }
Output: { field: type }
```

### Data Flow
{Sequence or flow description}

## NFR Budgets

| Requirement | Budget |
|-------------|--------|
| Response time | < 3 seconds |
| Availability | 99.9% |

## Risks

| Risk | Mitigation |
|------|------------|
| {Risk 1} | {Mitigation} |
```

## Tasks Template

```markdown
# Implementation Tasks: {Feature Name}

**Feature**: `{feature-branch}`
**Plan**: specs/{feature}/plan.md
**Generated**: {YYYY-MM-DD}

## Task List

### Task 1: {Title}
**Priority**: P1 | P2 | P3
**Depends On**: None | Task X
**Status**: [ ] Pending | [x] Complete

**Description**: {What to implement}

**Files to Modify**:
- `path/to/file.ts`: {Changes}

**Test Cases**:
- [ ] Test: {Test description}
  - Input: {input}
  - Expected: {expected output}

**Acceptance Criteria**:
- [ ] {Criterion 1}
- [ ] {Criterion 2}

---

### Task 2: ...
```

## ADR Detection Logic

```python
def should_suggest_adr(decision_context: str) -> bool:
    """
    Three-part test for ADR significance:
    1. Impact: Long-term consequences? (framework, data model, API, security)
    2. Alternatives: Multiple viable options considered?
    3. Scope: Cross-cutting and influences system design?

    ALL must be true to suggest ADR.
    """
    impact_keywords = [
        "framework", "architecture", "database", "schema",
        "authentication", "authorization", "api", "protocol",
        "deployment", "infrastructure", "security", "platform"
    ]

    has_impact = any(kw in decision_context.lower() for kw in impact_keywords)
    has_alternatives = "option" in decision_context.lower() or "alternative" in decision_context.lower()
    is_cross_cutting = "system" in decision_context.lower() or "design" in decision_context.lower()

    return has_impact and has_alternatives and is_cross_cutting
```

### ADR Suggestion Format

```
📋 Architectural decision detected: {brief description}
   Document reasoning and tradeoffs? Run `/sp.adr {decision-title}`
```

## PHR Creation Logic

```python
def create_phr(
    title: str,
    stage: str,
    feature: Optional[str],
    prompt_text: str,
    response_text: str
) -> str:
    """
    Create a Prompt History Record.

    Stages: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

    Routing (all under history/prompts/):
    - constitution → history/prompts/constitution/
    - Feature stages → history/prompts/{feature-name}/
    - general → history/prompts/general/
    """

    # Determine route
    if stage == "constitution":
        route = "history/prompts/constitution"
    elif feature and stage in ["spec", "plan", "tasks", "red", "green", "refactor", "explainer", "misc"]:
        route = f"history/prompts/{feature}"
    else:
        route = "history/prompts/general"

    # Generate ID
    existing_ids = get_existing_ids(route)
    new_id = max(existing_ids, default=0) + 1

    # Create slug
    slug = slugify(title)

    # Build filename
    filename = f"{new_id:04d}-{slug}.{stage}.prompt.md"
    filepath = f"{route}/{filename}"

    # Fill template
    content = fill_phr_template(
        id=new_id,
        title=title,
        stage=stage,
        date=datetime.now().isoformat()[:10],
        feature=feature or "none",
        prompt_text=prompt_text,
        response_text=response_text
    )

    write_file(filepath, content)
    return filepath
```

## Memory & State

```yaml
memory:
  project_context:
    - constitution: .specify/memory/constitution.md
    - active_features: specs/*/spec.md
    - recent_adrs: history/adr/*.md
    - recent_phrs: history/prompts/**/*.prompt.md

  session:
    - current_feature: string
    - current_stage: enum[specify, plan, tasks, implement]
    - pending_decisions: Decision[]
    - task_progress: TaskStatus[]

persistence:
  specs: git-tracked markdown files
  history: git-tracked markdown files
  templates: .specify/templates/
```

## Quality Gates

### Specification Quality

```python
SPEC_VALIDATION = {
    "required_sections": [
        "User Scenarios & Testing",
        "Requirements",
        "Success Criteria"
    ],
    "user_story_requirements": {
        "has_priority": True,
        "has_acceptance_scenarios": True,
        "has_independent_test": True
    },
    "functional_requirements": {
        "uses_must_should_may": True,
        "has_unique_ids": True
    },
    "success_criteria": {
        "is_measurable": True,
        "has_target": True
    }
}
```

### Plan Quality

```python
PLAN_VALIDATION = {
    "required_sections": [
        "Architecture Decisions",
        "Technical Design",
        "Risks"
    ],
    "decision_requirements": {
        "has_context": True,
        "has_options": True,
        "has_rationale": True,
        "has_consequences": True
    }
}
```

### Task Quality

```python
TASK_VALIDATION = {
    "required_fields": [
        "priority",
        "status",
        "description",
        "test_cases",
        "acceptance_criteria"
    ],
    "dependency_check": "no_circular_dependencies",
    "test_case_requirements": {
        "has_input": True,
        "has_expected_output": True
    }
}
```

## Integration Examples

### Claude Agent SDK

```typescript
import { Agent, Tool, SlashCommand } from '@anthropic-ai/claude-agent-sdk';

const sddAgent = new Agent({
  name: 'sdd-planning-agent',
  systemPrompt: SDD_SYSTEM_PROMPT,
  tools: [
    new Tool({ name: 'read_file', ... }),
    new Tool({ name: 'write_file', ... }),
    new Tool({ name: 'glob_files', ... }),
    new Tool({ name: 'grep_content', ... })
  ],
  slashCommands: [
    new SlashCommand({ name: 'specify', handler: handleSpecify }),
    new SlashCommand({ name: 'plan', handler: handlePlan }),
    new SlashCommand({ name: 'tasks', handler: handleTasks }),
    new SlashCommand({ name: 'adr', handler: handleAdr }),
    new SlashCommand({ name: 'phr', handler: handlePhr })
  ]
});
```

### LangChain Integration

```python
from langchain.agents import AgentExecutor
from langchain.tools import Tool
from langchain.prompts import PromptTemplate

sdd_tools = [
    Tool(
        name="create_spec",
        func=create_specification,
        description="Create a feature specification from requirements"
    ),
    Tool(
        name="generate_plan",
        func=generate_plan,
        description="Generate implementation plan from spec"
    ),
    Tool(
        name="generate_tasks",
        func=generate_tasks,
        description="Generate tasks from spec and plan"
    ),
    Tool(
        name="create_adr",
        func=create_adr,
        description="Create Architecture Decision Record"
    ),
    Tool(
        name="create_phr",
        func=create_phr,
        description="Create Prompt History Record"
    )
]

sdd_agent = AgentExecutor(
    agent=create_openai_agent(llm, sdd_tools, SDD_PROMPT),
    tools=sdd_tools,
    verbose=True
)
```

### CrewAI Integration

```python
from crewai import Agent, Task, Crew

spec_writer = Agent(
    role="Specification Writer",
    goal="Transform requirements into structured specifications",
    backstory="Expert in requirements engineering",
    tools=[spec_tools]
)

architect = Agent(
    role="Software Architect",
    goal="Design system architecture with clear decisions",
    backstory="Expert in software architecture patterns",
    tools=[plan_tools, adr_tools]
)

task_planner = Agent(
    role="Task Planner",
    goal="Break down specs into implementable tasks",
    backstory="Expert in agile planning",
    tools=[task_tools]
)

sdd_crew = Crew(
    agents=[spec_writer, architect, task_planner],
    tasks=[specify_task, plan_task, tasks_task],
    verbose=True
)
```

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Spec completeness | 100% | All required sections filled |
| Plan quality | All decisions documented | ADR coverage |
| Task coverage | 100% | All spec requirements have tasks |
| PHR capture rate | 100% | Every significant interaction logged |
| Implementation success | 90%+ | Tasks completed without major changes |
| Traceability | Full | Spec → Plan → Task → Code linkage |

## Reusability Configuration

```yaml
project_types:
  web_app:
    spec_template: web-app-spec.md
    tech_stack: [React, Node.js, PostgreSQL]
    nfr_defaults:
      response_time: "< 200ms"
      availability: "99.9%"

  mobile_app:
    spec_template: mobile-app-spec.md
    tech_stack: [React Native, Firebase]
    nfr_defaults:
      app_size: "< 50MB"
      offline_support: "required"

  api_service:
    spec_template: api-service-spec.md
    tech_stack: [FastAPI, PostgreSQL, Redis]
    nfr_defaults:
      rate_limit: "1000 req/min"
      response_time: "< 100ms"

  data_pipeline:
    spec_template: data-pipeline-spec.md
    tech_stack: [Python, Apache Airflow, Spark]
    nfr_defaults:
      throughput: "1M records/hour"
      latency: "< 5 minutes"
```

## References

1. **SpecKit Plus Framework**: Original SDD implementation
2. **Architecture Decision Records**: Michael Nygard's ADR format
3. **User Story Mapping**: Jeff Patton
4. **Agile Estimation**: Story points and task breakdown
5. **Claude Agent SDK**: Anthropic agent building patterns

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-02 | Initial specification from Physical AI Textbook project |
