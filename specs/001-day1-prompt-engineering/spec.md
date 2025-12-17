# Feature Specification: Day 1 - Prompt Engineering Fundamentals

**Feature Branch**: `001-day1-prompt-engineering`
**Created**: 2025-12-18
**Status**: Draft
**Input**: User description: "Day 1 of SIEHS Agentic AI Training - Prompt Engineering based on Panaversity curriculum"

## Training Context

**Organization**: SIEHS (Sindh Integrated Emergency & Health Services)
**Training Title**: Agentic AI for Leaders: Architecting SIEHS's AI-Enabled Organization
**Target Audience**: SIEHS Leadership, Emergency Response Managers, Healthcare Administrators
**Duration**: Full Day (8 hours)
**Source Material**: https://github.com/panaversity/learn-low-code-agentic-ai/tree/main/00_prompt_engineering

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understanding AI Communication Basics (Priority: P1)

A SIEHS leader with no prior AI experience learns the fundamentals of how Large Language Models work and why effective prompting matters. They understand that AI is a "prediction engine" and how to structure requests for optimal responses.

**Why this priority**: Foundation knowledge is essential before any practical application. Leaders must understand *why* before *how*.

**Independent Test**: Participant can explain to a colleague what an LLM is and why prompt structure matters, using emergency services examples.

**Acceptance Scenarios**:

1. **Given** a participant has completed Module 1, **When** asked "What is a prompt?", **Then** they can explain it's an instruction to an AI system with examples
2. **Given** a participant understands LLM basics, **When** presented with a poor prompt, **Then** they can identify why it might produce inconsistent results
3. **Given** a participant learned about temperature settings, **When** asked about use cases, **Then** they can explain when to use low vs high temperature for SIEHS scenarios

---

### User Story 2 - Mastering Core Prompting Techniques (Priority: P1)

A SIEHS manager learns and practices zero-shot, few-shot, and role-based prompting techniques. They apply these techniques to create effective prompts for emergency response scenarios like patient triage communication or incident reporting.

**Why this priority**: These techniques are immediately applicable to daily SIEHS operations and form the backbone of all AI interactions.

**Independent Test**: Participant creates three different prompts using zero-shot, one-shot, and role-based techniques for a SIEHS use case.

**Acceptance Scenarios**:

1. **Given** training on zero-shot prompting, **When** participant needs to draft an emergency SMS template, **Then** they write a direct, clear prompt without examples
2. **Given** training on few-shot prompting, **When** participant needs consistent incident categorization, **Then** they provide 2-3 examples in the prompt
3. **Given** training on role prompting, **When** participant needs medical advice formatting, **Then** they assign an appropriate expert role to the AI

---

### User Story 3 - Applying Advanced Reasoning Techniques (Priority: P2)

A SIEHS team lead learns Chain of Thought (CoT), Step-Back, and ReAct prompting strategies. They understand when to use each technique for complex decision-making scenarios like resource allocation or multi-incident coordination.

**Why this priority**: Advanced techniques enable handling complex scenarios but require foundational understanding first.

**Independent Test**: Participant applies CoT prompting to break down a complex emergency resource allocation problem.

**Acceptance Scenarios**:

1. **Given** training on CoT prompting, **When** facing a multi-step triage decision, **Then** participant structures prompt to show reasoning steps
2. **Given** training on Step-Back prompting, **When** analyzing system-wide issues, **Then** participant prompts AI to consider broader principles first
3. **Given** training on ReAct framework, **When** needing real-time data integration, **Then** participant understands reasoning + action cycles

---

### User Story 4 - Hands-on Practice with SIEHS Use Cases (Priority: P1)

Participants engage in practical exercises creating prompts for real SIEHS scenarios: drafting patient communication, summarizing incident reports, creating training materials, and automating routine responses.

**Why this priority**: Applied practice cements learning and provides immediately useful templates.

**Independent Test**: Participant produces a library of 5+ working prompts for their specific SIEHS department.

**Acceptance Scenarios**:

1. **Given** a patient communication scenario, **When** participant completes the exercise, **Then** they have a tested prompt for empathetic response generation
2. **Given** an incident summarization task, **When** participant applies techniques, **Then** they create a prompt that extracts key data points consistently
3. **Given** a training content need, **When** participant uses role + CoT, **Then** they generate structured educational material

---

### User Story 5 - Understanding AI Configuration & Safety (Priority: P2)

Participants learn about LLM configuration parameters (temperature, tokens, top-K/P) and safety considerations for healthcare contexts. They understand HIPAA-like considerations and responsible AI use in emergency services.

**Why this priority**: Critical for production use but secondary to core prompting skills for initial training.

**Independent Test**: Participant can configure AI parameters appropriately for sensitive vs creative tasks.

**Acceptance Scenarios**:

1. **Given** knowledge of temperature settings, **When** generating patient-facing content, **Then** participant uses low temperature for accuracy
2. **Given** understanding of token limits, **When** designing prompts, **Then** participant structures within practical limits
3. **Given** safety training, **When** creating SIEHS prompts, **Then** participant includes appropriate guardrails for medical/emergency content

---

### Edge Cases

- What happens when AI generates medically incorrect information? Training includes validation protocols and human-in-the-loop requirements
- How to handle prompts for non-English speaking patients? Include multilingual prompt patterns with Urdu/Sindhi considerations
- What if AI refuses to answer emergency-related queries? Understand content policies and appropriate framing techniques
- How to maintain consistency across team members? Create shared prompt libraries and templates

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Training MUST cover LLM fundamentals including token prediction, autocompletion, and probability
- **FR-002**: Training MUST teach zero-shot, one-shot, and few-shot prompting with SIEHS examples
- **FR-003**: Training MUST include role-based and system prompting techniques
- **FR-004**: Training MUST cover Chain of Thought and structured reasoning approaches
- **FR-005**: Training MUST provide hands-on exercises using ChatGPT or Claude
- **FR-006**: Training MUST include SIEHS-specific use cases: triage, communication, reporting
- **FR-007**: Training MUST address AI safety and responsible use in healthcare/emergency contexts
- **FR-008**: Training MUST provide configuration guidance (temperature, tokens, sampling)
- **FR-009**: Training MUST include prompt templates participants can take and use immediately
- **FR-010**: Training MUST cover common prompting mistakes and how to avoid them

### Content Modules

- **Module 1**: Introduction to AI & LLMs (1 hour)
  - What is Generative AI?
  - How LLMs work (prediction engines)
  - Prompt vs Response cycle
  - SIEHS AI opportunity landscape

- **Module 2**: Prompt Engineering Fundamentals (2 hours)
  - Zero-shot prompting
  - One-shot and Few-shot prompting
  - System prompts and context setting
  - Role-based prompting
  - Hands-on: Emergency SMS templates

- **Module 3**: Advanced Prompting Techniques (2 hours)
  - Chain of Thought (CoT)
  - Self-Consistency
  - Step-Back Prompting
  - ReAct Framework
  - Tree of Thoughts (overview)
  - Hands-on: Complex decision scenarios

- **Module 4**: Configuration & Best Practices (1.5 hours)
  - Temperature and creativity control
  - Token limits and context windows
  - Top-K and Top-P sampling
  - Output formatting (JSON, Markdown, structured)
  - Hands-on: Parameter experimentation

- **Module 5**: SIEHS Applied Workshop (1.5 hours)
  - Triage communication prompts
  - Incident report summarization
  - Patient FAQ automation
  - Training content generation
  - Building your prompt library

### Key Entities

- **Prompt Template**: Reusable structure with placeholders for SIEHS scenarios (name, category, template text, example output)
- **Use Case**: SIEHS-specific application of AI (department, workflow, input type, expected output)
- **Configuration Profile**: Recommended AI settings for different tasks (temperature, max tokens, purpose)

## Assumptions

- Participants have basic computer literacy and email/typing proficiency
- Organization will provide access to ChatGPT or Claude for hands-on exercises
- Exercises will use SIEHS-relevant but non-sensitive example data
- Training materials will be available in English with key terms in Urdu
- Internet connectivity available for all participants
- No prior AI or programming experience required

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of participants can write a functional zero-shot prompt by end of Module 2
- **SC-002**: 90% of participants create at least 3 working prompts during hands-on exercises
- **SC-003**: Each participant leaves with 5+ documented prompt templates for their work
- **SC-004**: 85% of participants report confidence in using AI tools independently (post-training survey)
- **SC-005**: Training content covers all topics from source curriculum adapted for SIEHS context
- **SC-006**: All hands-on exercises use healthcare/emergency service relevant scenarios
