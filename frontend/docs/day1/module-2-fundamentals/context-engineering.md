---
sidebar_position: 2
title: Context Engineering
---

# Context Engineering for AI Systems

## Beyond Prompt Engineering

**Context Engineering** is the practice of designing and building dynamic systems that provide a Large Language Model (LLM) with the right information, in the right format, at the right time to accomplish a specific task.

### Prompt Engineering vs Context Engineering

| Aspect | Prompt Engineering | Context Engineering |
|--------|-------------------|---------------------|
| **Scope** | Single prompts | Entire systems |
| **Use Case** | Interactive conversations | Autonomous AI applications |
| **Format** | Natural language | Code-like with XML/markdown |
| **Complexity** | Low to medium | Medium to high |
| **Iteration** | Manual refinement | Programmatic design |

---

## The Six Essential Components

### 1. Model (The AI Engine)

The LLM that processes your context and generates responses.

**Considerations for SIEHS:**
- **GPT-4/GPT-3.5**: Best for general tasks, widely available
- **Claude**: Excellent for long documents, safety-focused
- **Gemini**: Good for multimodal (text + images)

### 2. Tools (External System Integration)

APIs and functions the AI can call to get real-time information.

**SIEHS Tool Examples:**
```
Tools Available:
- get_incident_status(incident_id): Check current incident status
- lookup_patient_record(patient_id): Retrieve patient information
- check_ambulance_availability(zone): Get available units
- send_notification(recipient, message): Alert team members
```

### 3. Knowledge and Memory

**Static Knowledge**: Pre-loaded information
- Emergency protocols
- Medical guidelines
- SIEHS policies

**Dynamic Memory**: Information from current session
- Conversation history
- User preferences
- Recent decisions

### 4. Audio/Speech Capabilities

Voice input/output for hands-free operation.

**SIEHS Applications:**
- Voice-activated emergency logging
- Audio reports during field operations
- Multilingual patient communication (Urdu/English)

### 5. Guardrails (Safety Mechanisms)

Rules that prevent harmful or inappropriate outputs.

**SIEHS Guardrails:**
```
Safety Rules:
- Never provide medical diagnoses
- Always recommend professional consultation
- Flag life-threatening situations for human review
- Protect patient confidentiality (HIPAA-equivalent)
- Escalate uncertain cases to supervisors
```

### 6. Orchestration (Deployment & Monitoring)

How the system is deployed, monitored, and improved.

---

## Building an AI System Prompt

### Structure Template

```xml
<system_prompt>
  <role>
    Define who the AI is and its expertise level
  </role>

  <task>
    Clearly describe what the AI should accomplish
  </task>

  <context>
    Provide background information and constraints
  </context>

  <input_format>
    Describe how user input will be structured
  </input_format>

  <output_format>
    Define exactly how responses should be formatted
  </output_format>

  <constraints>
    List limitations and rules
  </constraints>

  <capabilities>
    Describe available tools and knowledge
  </capabilities>
</system_prompt>
```

---

## SIEHS Example: Emergency Triage Assistant

Here's a complete context-engineered system prompt:

```xml
<system_prompt>
  <role>
    You are SIEHS Emergency Triage Assistant, an AI system supporting
    1122 emergency dispatchers in Sindh, Pakistan. You have expertise
    in emergency medical services protocols, triage classification,
    and resource allocation.
  </role>

  <task>
    Help dispatchers quickly assess incoming emergency calls,
    determine appropriate triage levels, and recommend resource
    allocation while maintaining accurate documentation.
  </task>

  <context>
    - Organization: SIEHS (Sindh Integrated Emergency & Health Services)
    - Service Area: Sindh Province, Pakistan
    - Languages: English and Urdu
    - Call Volume: 500+ daily calls in Karachi zone
    - Available Resources: 50 ambulances, 200 responders
    - Average Target Response: 8 minutes
  </context>

  <input_format>
    Dispatcher will provide:
    - Caller description of emergency
    - Location (address or landmarks)
    - Patient information (if available)
    - Current scene conditions
  </input_format>

  <output_format>
    Respond with:
    1. TRIAGE LEVEL: [RED/YELLOW/GREEN]
    2. CATEGORY: [Medical/Trauma/Cardiac/Other]
    3. RECOMMENDED RESOURCES: [Ambulance type, personnel]
    4. KEY QUESTIONS: [3-5 critical questions for dispatcher to ask]
    5. SAFETY ALERTS: [Any scene safety concerns]
    6. DOCUMENTATION: [Structured incident summary]
  </output_format>

  <constraints>
    - Never provide medical diagnosis
    - Always recommend professional medical evaluation
    - Flag life-threatening situations immediately
    - Maintain patient confidentiality
    - When uncertain, recommend higher triage level
    - All critical decisions require human confirmation
  </constraints>

  <capabilities>
    Available Tools:
    - check_ambulance_status(): Get real-time ambulance locations
    - get_hospital_capacity(): Check nearby hospital availability
    - lookup_protocol(condition): Retrieve emergency protocols
    - log_incident(details): Create incident record
  </capabilities>
</system_prompt>
```

---

## Context Engineering Strategies

### 1. Writing Context

**Be Specific and Structured:**
```
❌ "Help with emergencies"
✅ "Assess emergency calls using RED/YELLOW/GREEN triage system,
    prioritizing life-threatening conditions"
```

**Include Edge Cases:**
```
<edge_cases>
  - If caller is unresponsive: Assume RED triage, dispatch immediately
  - If location unclear: Ask for landmarks, nearby businesses
  - If language barrier: Offer Urdu translation support
  - If multiple casualties: Request additional units automatically
</edge_cases>
```

### 2. Selecting Context

Choose what information to include based on:

| Factor | Include More Context | Include Less Context |
|--------|---------------------|---------------------|
| Task Complexity | High | Low |
| Stakes | High | Low |
| Ambiguity | High | Low |
| User Expertise | Low | High |

### 3. Compressing Context

For large documents, summarize key points:

```
<knowledge_summary>
Emergency Protocols Summary:
- RED (Immediate): Cardiac arrest, severe trauma, respiratory failure
- YELLOW (Urgent): Fractures, moderate bleeding, chest pain
- GREEN (Non-urgent): Minor injuries, stable conditions
</knowledge_summary>
```

### 4. Isolating Context

In multi-agent systems, give each agent only relevant context:

```
Triage Agent: Receives patient symptoms only
Dispatch Agent: Receives location and resource data only
Documentation Agent: Receives full incident details
```

---

## Best Practices

### 1. Structure First
Use XML tags, markdown, or clear sections to organize context.

### 2. Be Comprehensive
Include all relevant information—AI can ignore extras, but can't guess missing details.

### 3. Test Thoroughly
Try edge cases and unusual inputs to identify gaps.

### 4. Iterate Continuously
Review outputs and refine context based on failures.

### 5. Security Aware
Never include sensitive data (passwords, keys) in prompts.

---

## Practice Exercise

**Task**: Design a context-engineered system prompt for a SIEHS Patient Follow-up Assistant.

The system should:
- Call patients 24 hours after emergency treatment
- Check on their recovery status
- Schedule follow-up appointments if needed
- Escalate concerns to medical staff

Use the XML template structure and include:
1. Role definition
2. Task description
3. Input/output formats
4. Constraints and guardrails
5. Available capabilities

---

## Key Takeaways

1. **Context Engineering** is about building systems, not just writing prompts
2. **Six components** work together: Model, Tools, Knowledge, Audio, Guardrails, Orchestration
3. **Structure matters**: Use XML tags and clear formatting
4. **Safety first**: Always include guardrails for healthcare applications
5. **Iterate**: Context engineering is an ongoing refinement process

---

*Source: Adapted from [Panaversity Learn Low-Code Agentic AI](https://github.com/panaversity/learn-low-code-agentic-ai)*
