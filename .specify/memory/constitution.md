<!-- Sync Impact Report
Version change: 2.2.0 → 3.0.0
Modified principles: Complete rewrite for new project scope
Added sections: Training-specific principles, Day-based structure
Removed sections: Physical AI/Robotics content, hackathon deadlines
Rationale: Project pivot from Physical AI textbook to SIEHS 3-day Agentic AI Leadership Training
-->

# SIEHS Agentic AI Training Constitution

## Project Overview

**Training Title**: Agentic AI for Leaders: Architecting SIEHS's AI-Enabled Organization
**Organization**: Sindh Integrated Emergency & Health Services (SIEHS)
**Duration**: 3 Days (8 hours each)
**Target Audience**: SIEHS Leadership, Emergency Response Managers, Healthcare Administrators
**Delivery Format**: Docusaurus-based training book with hands-on exercises

## Core Principles

### I. Learner-First Design (NON-NEGOTIABLE)
All content MUST be designed for non-technical healthcare/emergency service leaders.
- No prior AI or programming experience MUST be assumed
- Technical jargon MUST be explained in plain language with healthcare analogies
- Every concept MUST include a SIEHS-relevant example or use case
- Content MUST be immediately actionable - participants leave with working tools

### II. Progressive Skill Building
Training MUST follow a logical progression from foundations to deployment.
- **Day 1**: Understand AI → Communicate with AI → Apply to SIEHS scenarios
- **Day 2**: Understand automation → Build workflows → Deploy email automation
- **Day 3**: Integrate AI + automation → Deploy chatbots → Strategic planning
- Each day MUST build on previous day's skills
- Each module MUST have hands-on exercises that reinforce theory

### III. Hands-On Deliverables
Every training day MUST produce tangible, usable outputs.
- **Day 1 Deliverable**: Personal library of 5+ tested prompt templates for SIEHS work
- **Day 2 Deliverable**: Working Google Sheets → Gmail automation workflow
- **Day 3 Deliverable**: Live deployed SIEHS FAQ chatbot accessible via public URL
- Participants MUST NOT leave empty-handed from any session

### IV. Healthcare/Emergency Context
All examples, exercises, and content MUST be relevant to SIEHS operations.
- Use cases MUST reflect real SIEHS workflows: triage, patient communication, incident reporting
- Safety considerations MUST address healthcare data sensitivity (HIPAA-like awareness)
- AI responses MUST include appropriate disclaimers for medical/emergency content
- Prompts MUST never encourage AI to provide actual medical diagnoses

### V. Testable Learning Outcomes
Every module MUST have measurable success criteria.
- Each user story MUST include Given/When/Then acceptance scenarios
- Success metrics MUST use quantifiable measures (percentage completion, working outputs)
- Skill verification MUST be observable (participant demonstrates capability)
- Post-training surveys MUST assess confidence and readiness

### VI. Accessibility & Inclusion
Training materials MUST be accessible to all SIEHS staff.
- Content MUST work on mobile devices (many field staff use phones)
- Key terms MUST include Urdu translations where helpful
- Pages MUST pass Lighthouse accessibility score of 85+
- All images and diagrams MUST have descriptive alt text
- Color contrast MUST meet WCAG AA standards

### VII. Security & Responsible AI
Training MUST emphasize safe and ethical AI use in healthcare.
- API keys and credentials MUST NEVER be shared or displayed in screenshots
- Patient data MUST NEVER be used in training exercises (use synthetic data only)
- AI limitations MUST be clearly communicated (hallucination risks, not a replacement for medical professionals)
- Human-in-the-loop requirements MUST be emphasized for critical decisions
- Data privacy considerations MUST be addressed for any cloud-based tools

### VIII. Spec-Driven Development
All training features MUST follow the Spec-Kit Plus workflow.
- Every training day MUST have a specification before content creation begins
- Every plan MUST be approved before implementation begins
- Every significant decision MUST be recorded as PHR or ADR
- Constitution MUST be consulted when resolving conflicts between requirements

## Training Structure

### Day 1: Prompt Engineering Fundamentals (8 hours)
**Goal**: Participants understand AI and can write effective prompts for SIEHS work

| Module | Duration | Topic | Deliverable |
|--------|----------|-------|-------------|
| 1 | 1 hour | Introduction to AI & LLMs | Understanding quiz |
| 2 | 2 hours | Prompting Fundamentals | 3 working prompts |
| 3 | 2 hours | Advanced Techniques | CoT prompt for complex scenario |
| 4 | 1.5 hours | Configuration & Safety | Parameter cheat sheet |
| 5 | 1.5 hours | SIEHS Workshop | Personal prompt library (5+) |

**Source Material**: https://github.com/panaversity/learn-low-code-agentic-ai/tree/main/00_prompt_engineering

### Day 2: n8n Workflow Automation (8 hours)
**Goal**: Participants can build and deploy automated workflows

| Module | Duration | Topic | Deliverable |
|--------|----------|-------|-------------|
| 1 | 1 hour | Automation Introduction | Opportunity mapping |
| 2 | 1.5 hours | n8n Interface | Simple test workflow |
| 3 | 1.5 hours | Google Sheets Integration | Sheet reader workflow |
| 4 | 2 hours | Gmail Integration | Complete email sender |
| 5 | 1.5 hours | Production Readiness | Error-handled workflow |
| 6 | 0.5 hours | Use Case Workshop | Implementation roadmap |

**Core Deliverable**: Working Google Sheets → Gmail automation

### Day 3: AI Deployment & Strategy (8 hours)
**Goal**: Participants deploy AI solutions and plan organizational adoption

| Module | Duration | Topic | Deliverable |
|--------|----------|-------|-------------|
| 1 | 2 hours | n8n Auto Email Responder | AI-powered responder |
| 2 | 1.5 hours | OpenAI AgentKit | Configured SIEHS agent |
| 3 | 1.5 hours | ChatKit Development | Custom chat widget |
| 4 | 1 hour | Vercel Deployment | Live public URL |
| 5 | 1 hour | SDD Introduction | Sample specification |
| 6 | 1 hour | Strategy Workshop | 3-initiative AI roadmap |

**Core Deliverable**: Live deployed SIEHS chatbot
**SDD Source**: https://ai-native.panaversity.org/docs/SDD-RI-Fundamentals

## Quality Standards

### Content Quality Requirements
- Each module: clear learning objectives stated upfront
- Every concept: at least one SIEHS-relevant example
- Code/workflow examples: must be copy-paste ready and tested
- Screenshots: must reflect current UI versions of tools
- Technical accuracy: all AI/automation concepts must be factually correct

### Training Delivery Requirements
| Metric | Target |
|--------|--------|
| Hands-on exercise completion rate | 90%+ |
| Participant satisfaction (survey) | 4.0/5.0+ |
| Working deliverable completion | 95%+ |
| Post-training confidence score | 85%+ report "confident" |

### Technical Requirements
| Operation | Maximum Time |
|-----------|--------------|
| Training page load | 3 seconds |
| Exercise environment setup | 5 minutes |
| Workflow execution (n8n) | 30 seconds |
| Chatbot response | 5 seconds |

## Constraints

### Hard Constraints (Cannot Be Violated)
- Training duration: 3 days × 8 hours = 24 total hours
- Target audience: Non-technical healthcare/emergency leaders
- No patient data: All exercises use synthetic/example data only
- Tool availability: Must use free tiers (n8n cloud, OpenAI, Vercel)
- Accessibility: Mobile-friendly, Urdu considerations

### Soft Constraints (May Be Adjusted with Justification)
- Module timing: Can flex ±30 minutes based on group pace
- Exercise complexity: Can simplify if group needs more support
- Tool alternatives: Can substitute equivalent tools if needed

## Development Workflow

### Feature Implementation Order
1. **P1 - Core Training Content**
   - Day 1: Prompt Engineering modules and exercises
   - Day 2: n8n automation modules and workflows
   - Day 3: AI deployment modules and chatbot

2. **P2 - Supporting Materials**
   - Exercise templates and starter files
   - Reference cheat sheets
   - Troubleshooting guides

3. **P3 - Enhancement Features**
   - Interactive quizzes
   - Video walkthroughs
   - Urdu translations

### Definition of Done
A training module is "done" when:
- [ ] Learning objectives clearly stated
- [ ] All concepts have SIEHS-relevant examples
- [ ] Hands-on exercise tested and working
- [ ] Screenshots current and accurate
- [ ] Accessibility score ≥ 85
- [ ] Mobile responsive
- [ ] Reviewed for healthcare sensitivity

## Governance

### Constitution Authority
- This Constitution supersedes all other project documentation when conflicts arise
- Feature specifications MUST NOT contradict Constitutional principles
- When in doubt, learner-first principle takes precedence

### Amendment Process
1. Document proposed change with rationale
2. Assess impact on training content and flow
3. Update version number following semver:
   - MAJOR: Principle removed or fundamentally changed
   - MINOR: New principle or section added
   - PATCH: Clarification or wording improvement
4. Update LAST_AMENDED_DATE
5. Commit with message: `docs(constitution): <change summary>`

### Compliance Verification
- All content MUST be reviewed against Constitutional principles
- Spec reviews MUST verify testability of learning outcomes
- Final training materials MUST pass all Quality Standards

**Version**: 3.0.0 | **Ratified**: 2025-12-18 | **Last Amended**: 2025-12-18
