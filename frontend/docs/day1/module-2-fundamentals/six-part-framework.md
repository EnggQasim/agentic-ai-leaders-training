---
sidebar_position: 1
title: Six-Part Prompting Framework
---

# The Complete AI Prompting Framework

## 6-Step Formula for 10x Better Results

This framework teaches professionals to interact with AI tools effectively through six structured components. It works across ChatGPT, Gemini, Claude, and other LLMs.

## The 6-Part Framework

### 1. Command: Start Strong

Use direct action verbs rather than weak requests.

| Weak Commands | Strong Commands |
|---------------|-----------------|
| "Help me with..." | "Analyze..." |
| "Give me..." | "Create..." |
| "Can you..." | "Design..." |
| "I need..." | "Recommend..." |

**SIEHS Example:**
```
❌ "Help me write an emergency response report"
✅ "Analyze the incident data and create a structured emergency response report"
```

### 2. Context: More is Always Better

Apply the **"Rule of Three"**:

- **WHO**: Age, profession, experience level, role
- **WHAT**: Specific goals, constraints, requirements
- **WHEN**: Timeline, urgency, deadline

**Context Scaling by Stakes:**

| Task Type | Context Level | Example |
|-----------|---------------|---------|
| Simple Query | Minimal | "What does EMT stand for?" |
| Routine Task | Moderate | Department, role, purpose |
| Critical Decision | Extensive | Full background, constraints, stakeholders |

**SIEHS Example:**
```
Context: I am a Senior Manager at SIEHS Emergency Services (1122).
I manage a team of 50 emergency responders in Karachi.
We handle approximately 500 calls daily.
I need to improve our average response time from 12 to 8 minutes.
```

### 3. Logic: Define Output Structure

Specify exactly how AI should respond:

- **Table format** for comparisons
- **Numbered lists** for procedures
- **Sections with headers** for reports
- **Bullet points** for quick summaries
- **Step-by-step** for processes

**SIEHS Example:**
```
Provide your analysis in this structure:
1. Executive Summary (3 sentences max)
2. Key Findings (bullet points)
3. Recommendations Table (Priority | Action | Timeline | Owner)
4. Implementation Steps (numbered)
5. Risk Assessment (High/Medium/Low matrix)
```

### 4. Roleplay: Transform Generic into Expert-Level

Assign specific professional roles:

```
Act as a healthcare operations consultant with 15 years of experience
in emergency medical services optimization in South Asia.
```

**Effective Roles for SIEHS:**
- Emergency Medical Services Director
- Healthcare Operations Consultant
- Patient Communication Specialist
- Crisis Management Expert
- Training Program Developer

### 5. Formatting: Structure for Success

Organize information for immediate usefulness:

```
Format Requirements:
- Use markdown headers (##, ###)
- Include a table of contents for long documents
- Highlight key terms in **bold**
- Use > blockquotes for important warnings
- Add --- dividers between major sections
```

### 6. Questions: The Secret Sauce

End your prompt with:

```
Ask me 10 questions to tailor this response better to my specific situation.
```

**Why This Works:**
- Uncovers gaps you didn't think about
- Provides context you forgot to mention
- Results in highly personalized output
- Creates a dialogue, not a monologue

---

## Complete Example: SIEHS Prompt

Here's a full prompt using all six elements:

```
[COMMAND]
Analyze our emergency response data and create a comprehensive
improvement plan for reducing response times.

[CONTEXT]
- Organization: SIEHS (Sindh Integrated Emergency & Health Services)
- My Role: Operations Director, 1122 Emergency Services
- Team Size: 200+ emergency responders
- Coverage: Karachi metropolitan area
- Current Performance: 12-minute average response time
- Target: 8-minute average response time
- Timeline: 6-month improvement program
- Budget: Limited, focus on process improvements

[LOGIC]
Structure your response as:
1. Current State Assessment
2. Gap Analysis (what's causing delays)
3. Quick Wins (implementable in 30 days)
4. Medium-term Improvements (30-90 days)
5. Long-term Strategic Changes (90-180 days)
6. Success Metrics and KPIs
7. Risk Mitigation Plan

[ROLEPLAY]
Act as an emergency medical services optimization consultant
with 20 years of experience implementing EMS improvements
in developing countries with resource constraints.

[FORMATTING]
- Use tables for comparisons
- Include priority ratings (High/Medium/Low)
- Add estimated impact percentages
- Use bullet points for action items
- Bold the most critical recommendations

[QUESTIONS]
Before providing your analysis, ask me 10 clarifying questions
to ensure your recommendations are specifically tailored to
SIEHS's unique operational environment.
```

---

## Best Practices

### Model Selection
- **ChatGPT** and **Gemini**: Work best with this framework
- **Claude**: May require slight modifications to roleplay section

### Context Investment
| Situation | Context Investment |
|-----------|-------------------|
| Quick answer | 1-2 sentences |
| Daily tasks | 1 paragraph |
| Important decisions | Full background |
| Critical/high-stakes | Maximum detail |

### Iteration Strategy
1. Start with a basic prompt
2. Review AI's response
3. Add more context based on gaps
4. Continue until questions plateau
5. Save effective prompts as templates

---

## Common Mistakes to Avoid

| Mistake | Problem | Solution |
|---------|---------|----------|
| Skipping Command | Unclear intent | Start with action verb |
| Generic Context | Irrelevant response | Apply Rule of Three |
| No Format Spec | Disorganized output | Define structure |
| Vague Roles | Surface-level answers | Specify expertise |
| Stopping Early | Missed insights | Complete question rounds |

---

## Practice Exercise

**Task**: Create a prompt using all 6 parts for this SIEHS scenario:

> You need to develop a training program for new 1122 dispatchers
> who will handle emergency calls. The program should prepare them
> to handle 200+ calls per shift while maintaining quality and empathy.

Try writing your prompt using:
1. Strong Command
2. Detailed Context (WHO, WHAT, WHEN)
3. Output Structure
4. Expert Role
5. Formatting Requirements
6. Clarifying Questions Request

---

*Source: Adapted from [Panaversity Learn Low-Code Agentic AI](https://github.com/panaversity/learn-low-code-agentic-ai)*
