# Data Model: Day 1 - Prompt Engineering Fundamentals

**Feature**: 001-day1-prompt-engineering
**Date**: 2025-12-18

## Overview

Day 1 focuses on educational content delivery. The data model represents training content structure, not application data.

## Entities

### 1. Module

Represents a training module within Day 1.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier (e.g., "module-1") | Required, kebab-case |
| number | integer | Module sequence number | 1-5 |
| title | string | Display title | Required, max 100 chars |
| duration | string | Expected duration | Format: "X hours" or "X.5 hours" |
| objectives | string[] | Learning objectives | Min 2, max 5 items |
| sections | Section[] | Content sections | Min 1 section |

### 2. Section

Represents a section within a module.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier | Required, kebab-case |
| title | string | Section heading | Required, max 80 chars |
| content | string | Markdown content | Required |
| examples | Example[] | Prompt examples | Optional |
| exercise | Exercise | Hands-on exercise | Optional |

### 3. Example

Represents a prompt example with before/after.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier | Required |
| title | string | Example title | Required, max 60 chars |
| context | string | SIEHS context description | Required |
| badPrompt | string | Example of poor prompt | Optional |
| goodPrompt | string | Example of effective prompt | Required |
| systemPrompt | string | System prompt if applicable | Optional |
| expectedOutput | string | What good output looks like | Optional |
| technique | string | Prompting technique demonstrated | Enum: see below |

**Technique Enum Values**:
- `zero-shot`
- `one-shot`
- `few-shot`
- `role-based`
- `chain-of-thought`
- `step-back`
- `react`
- `self-consistency`

### 4. Exercise

Represents a hands-on exercise.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier | Required |
| title | string | Exercise title | Required, max 80 chars |
| description | string | What participant will do | Required |
| scenario | string | SIEHS scenario description | Required |
| starterPrompt | string | Template to start with | Optional |
| successCriteria | string[] | How to know it works | Min 1 criterion |
| duration | integer | Minutes allocated | 5-30 |
| difficulty | string | Skill level | Enum: beginner, intermediate, advanced |

### 5. PromptTemplate

Reusable template for SIEHS scenarios (deliverable).

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier | Required |
| name | string | Template name | Required, max 60 chars |
| category | string | Template category | Enum: see below |
| department | string | Target department | "All" or specific dept |
| useCase | string | Brief description | Required, max 200 chars |
| systemPrompt | string | Role/context setting | Required |
| userPromptTemplate | string | Main prompt with placeholders | Required |
| placeholders | Placeholder[] | Variables in template | Optional |
| exampleInput | object | Sample data | Optional |
| expectedOutput | string | Sample output | Optional |
| configuration | ConfigProfile | AI settings | Required |

**Category Enum Values**:
- `communication` - Patient/public communication
- `reporting` - Incident reports, summaries
- `analysis` - Data analysis, decision support
- `training` - Educational content creation
- `automation` - Routine task automation

### 6. Placeholder

Variable placeholder in a template.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| name | string | Variable name | Required, camelCase |
| description | string | What to fill in | Required |
| example | string | Example value | Required |
| required | boolean | Must be filled | Default: true |

### 7. ConfigProfile

AI configuration settings for a template.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| temperature | number | Creativity control | 0.0-2.0, default 0.7 |
| maxTokens | integer | Output limit | 100-4096 |
| topP | number | Nucleus sampling | 0.0-1.0, optional |
| purpose | string | Why these settings | Required |

### 8. Quiz

Self-assessment quiz for module.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier | Required |
| moduleId | string | Parent module | Required |
| questions | Question[] | Quiz questions | Min 3, max 10 |

### 9. Question

Individual quiz question.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier | Required |
| text | string | Question text | Required |
| type | string | Question type | Enum: multiple-choice, true-false |
| options | string[] | Answer options | 2-4 for MC |
| correctIndex | integer | Correct answer index | Valid index |
| explanation | string | Why answer is correct | Required |

## Relationships

```
Module (1) ──────── (*) Section
Section (1) ──────── (*) Example
Section (1) ──────── (0..1) Exercise
Module (1) ──────── (0..1) Quiz
Quiz (1) ──────── (*) Question
PromptTemplate (1) ── (*) Placeholder
PromptTemplate (1) ── (1) ConfigProfile
```

## Content Structure (Docusaurus)

```
docs/
├── day1/
│   ├── _category_.json          # Day 1 sidebar config
│   ├── index.md                  # Day 1 overview
│   ├── module-1-intro/
│   │   ├── index.md             # Module 1 overview
│   │   ├── what-is-ai.md        # Section
│   │   ├── how-llms-work.md     # Section
│   │   └── siehs-opportunities.md
│   ├── module-2-fundamentals/
│   │   ├── index.md
│   │   ├── zero-shot.md
│   │   ├── few-shot.md
│   │   ├── role-based.md
│   │   └── exercise-sms-templates.md
│   ├── module-3-advanced/
│   │   ├── index.md
│   │   ├── chain-of-thought.md
│   │   ├── step-back.md
│   │   ├── react-framework.md
│   │   └── exercise-decision-scenarios.md
│   ├── module-4-configuration/
│   │   ├── index.md
│   │   ├── temperature.md
│   │   ├── tokens-context.md
│   │   ├── output-formatting.md
│   │   └── exercise-parameters.md
│   ├── module-5-workshop/
│   │   ├── index.md
│   │   ├── triage-prompts.md
│   │   ├── incident-summarization.md
│   │   ├── patient-faq.md
│   │   └── prompt-library.md
│   └── resources/
│       ├── glossary.md           # Terms with Urdu translations
│       ├── cheat-sheet.md        # Quick reference
│       └── templates/            # Downloadable templates
```

## State Transitions

### Participant Progress (conceptual)

```
[Not Started] → [Module 1 Complete] → [Module 2 Complete] → ... → [Day 1 Complete]
                      ↓                       ↓
                 [Quiz Passed]           [Exercise Done]
```

Note: Progress tracking is optional for v1. Content is designed to be consumed linearly but accessible non-linearly.
