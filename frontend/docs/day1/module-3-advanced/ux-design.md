---
sidebar_position: 4
title: UX Design with AI
---

# UX Design by Prompting: AI-Assisted Interface Design

Learn to create professional user experience designs using AI tools like UXPilot. This guide teaches healthcare leaders how to transform ideas into production-ready interfaces through structured prompting.

## Core Principle

> **"The quality of your prompt directly influences the quality of your design."**

Structured instructions yield brand-consistent results requiring minimal revision. AI accelerates design workflows when given clear specifications.

---

## What is AI-Assisted UX Design?

Traditional UX design requires:
- Learning complex tools (Figma, Sketch, Adobe XD)
- Understanding design principles
- Creating wireframes, mockups, prototypes
- Iterating through multiple revisions

**AI-assisted UX design** lets you:
- Describe interfaces in plain language
- Generate professional designs instantly
- Iterate through conversation
- Export production-ready assets

### Popular Tools

| Tool | Best For | Integration |
|------|----------|-------------|
| **UXPilot** | Full design workflow | Figma, FigJam |
| **Galileo AI** | UI generation | Figma export |
| **Uizard** | Wireframes to designs | Standalone |
| **Framer AI** | Interactive prototypes | Web publishing |

---

## The UXPilot Workflow

UXPilot transforms ideas into production-ready interfaces through **12 phases**:

### Phase Overview

| Phase | Tool | Output |
|-------|------|--------|
| 1. Ideation | FigJam | Concept sticky notes |
| 2. Features | FigJam | Feature list |
| 3. User Stories | FigJam | User-centric descriptions |
| 4. Flowchart | FigJam | User flow diagram |
| 5. Workshop | FigJam | Session planning |
| 6. Wireframes | FigJam | Low-fidelity layouts |
| 7. Project Brief | FigJam | Requirements document |
| 8. High-Fidelity | UXPilot Web | Final designs |
| 9. Documentation | - | Prompt history |
| 10. Editing | UXPilot | Natural language refinements |
| 11. Handoff | UXPilot | Code + specs |
| 12. Governance | - | Design records |

---

## Phase-by-Phase Guide

### Phase 1: Ideation (No Token Cost)

Use FigJam's Custom Prompt feature to brainstorm without consuming tokens:

```
Generate 10 innovative features for a SIEHS emergency
dispatch dashboard that would improve response times
and dispatcher efficiency.
```

**Output**: Sticky notes with feature ideas

### Phase 2: Feature Development

Generate a structured feature list:

```
Platform: Web application for desktop
User: SIEHS emergency dispatchers
Goal: Manage incoming emergency calls and dispatch ambulances

Generate a comprehensive feature list organized by priority:
- Must Have (MVP)
- Should Have
- Nice to Have
```

### Phase 3: User Stories

Convert features to user-centric descriptions:

```
For each feature in the dispatch dashboard, write a user story
following this format:

"As a [dispatcher role], I want to [action] so that [benefit]"

Include acceptance criteria for each story.
```

### Phase 4: User Flow Diagram

Create visual flow of user interactions:

```
Create a flowchart showing the complete user journey for:
- Receiving emergency call
- Assessing priority
- Selecting available ambulance
- Dispatching and tracking response

Show decision points and alternative paths.
```

### Phase 5: Project Brief

Synthesize everything into a single specification:

```
Compile a project brief for the SIEHS Dispatch Dashboard:

1. Project Overview
2. Target Users
3. Core Features (prioritized)
4. User Flows
5. Technical Requirements
6. Brand Guidelines (colors, typography)
7. Success Metrics
```

### Phase 6: High-Fidelity Design Generation

In UXPilot Web, use your brief to generate complete screen designs:

```
Design a SIEHS Emergency Dispatch Dashboard

Theme: Professional healthcare
Primary Color: #1e88e5 (SIEHS Blue)
Secondary: #ffffff (White)
Accent: #e53935 (Emergency Red)
Typography: Inter or system fonts

Screens needed:
1. Main dashboard with live call queue
2. Ambulance fleet status view
3. Active incident detail panel
4. Shift handover summary

Style: Clean, high-contrast for visibility, minimal decoration,
focus on information density without clutter
```

---

## Prompt Engineering for UX Design

### Effective Design Prompts

A complete UX prompt includes:

```
1. Platform (web, mobile, tablet)
2. User role and context
3. Primary task/goal
4. Layout requirements
5. Visual style specification
6. Brand elements (colors, fonts)
7. Specific components needed
```

### SIEHS Design Prompt Examples

#### Dashboard Design

```
Design a real-time ambulance tracking dashboard for SIEHS dispatch.

Platform: Desktop web application (1920x1080 minimum)
User: Emergency dispatch operators working 12-hour shifts
Primary Goal: Monitor all ambulances and respond to emergencies quickly

Layout:
- Left sidebar (20%): Navigation and filters
- Main area (60%): Interactive map showing all ambulance positions
- Right panel (20%): Active incidents queue

Components:
- Map with vehicle markers (color-coded by status)
- Incident cards showing: priority level, location, time elapsed
- Ambulance status indicators: Available (green), En Route (yellow), On Scene (red)
- Quick action buttons: Dispatch, Reassign, Mark Complete

Style: Dark theme to reduce eye strain, high contrast text,
large click targets, SIEHS blue (#1e88e5) for interactive elements,
red (#e53935) for urgent/critical items
```

#### Mobile App Design

```
Design a mobile app for SIEHS paramedics to receive dispatch information.

Platform: iOS and Android (design for iPhone 14 Pro dimensions)
User: Paramedics in the field, often moving, variable lighting
Primary Goal: Receive and acknowledge dispatch assignments quickly

Screens:
1. Home: Current assignment details and navigation
2. Patient info: Pre-arrival information, medical history
3. Status update: Quick buttons to update dispatch
4. Handoff: Transfer patient to hospital with report

Design Requirements:
- Large touch targets (minimum 48px)
- High contrast for outdoor visibility
- One-hand operation possible
- Critical info visible without scrolling
- SIEHS branding with blue header

Include: Loading states, empty states, error states
```

#### Form Design

```
Design an incident report form for SIEHS emergency responders.

Platform: Tablet-optimized web form
User: Paramedics completing reports after calls
Context: Often tired, may be completing during downtime

Form Sections:
1. Incident Details: Date/time, location, type
2. Patient Information: Demographics, chief complaint
3. Assessment: Vitals, observations, interventions
4. Outcome: Disposition, receiving facility

UX Requirements:
- Auto-save every 30 seconds
- Progress indicator showing completion
- Required fields clearly marked
- Voice-to-text option for long text fields
- Offline capable with sync indicator

Style: Clean, form-focused, generous spacing between fields,
clear section headers, SIEHS brand colors
```

---

## Natural Language Editing

After generating designs, refine using conversational edits:

### Global Edits (Screen-Level)

```
"Make the header 20% taller and add the SIEHS logo on the left"
"Change all buttons from rounded to slightly rounded (8px radius)"
"Increase font size throughout by 2px for better readability"
```

### Section Edits

```
"In the sidebar, make the active navigation item have a blue background"
"Add an emergency alert banner at the top that can be dismissed"
"The incident cards need more padding - increase to 16px all around"
```

### Component Edits

```
"The status badges should have icons: checkmark for Available,
 arrow for En Route, location pin for On Scene"
"Add a subtle shadow to the cards to create depth"
"The search field needs a clear button when there's text entered"
```

---

## Design Best Practices for Healthcare

### Accessibility Requirements

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Color Contrast | WCAG AA (4.5:1) | Dark text on light backgrounds |
| Touch Targets | 48x48px minimum | Large buttons and links |
| Text Size | 16px minimum body | Scalable fonts |
| Color Independence | Don't rely on color alone | Icons + color for status |

### Healthcare-Specific Considerations

```
1. Information Hierarchy
   - Critical info most prominent
   - Patient safety warnings unmissable
   - Time-sensitive data always visible

2. Error Prevention
   - Confirmation for irreversible actions
   - Clear distinction between similar actions
   - Undo capability where possible

3. Cognitive Load
   - Minimize information per screen
   - Group related information
   - Progressive disclosure for details

4. Stress Conditions
   - Design for tired users
   - Design for urgent situations
   - Large, clear interactive elements
```

### SIEHS Brand Guidelines

```
Primary Colors:
- SIEHS Blue: #1e88e5
- White: #ffffff
- Dark Text: #1a1a1a

Status Colors:
- Available/Success: #43a047
- Warning/In Progress: #fb8c00
- Critical/Emergency: #e53935

Typography:
- Headings: Bold, clear sans-serif
- Body: Regular weight, highly readable
- Data: Monospace for numbers/codes

Spacing:
- Generous padding (16-24px)
- Clear section separation
- Breathing room around interactive elements
```

---

## From Design to Development

### Developer Handoff

UXPilot provides:

1. **Source Code**: React/HTML/CSS exports
2. **Design Specs**: Exact measurements, colors, fonts
3. **Assets**: Icons, images, logos
4. **Design Tokens**: Variables for consistent styling

### Handoff Prompt

```
Prepare developer handoff for the Dispatch Dashboard:

1. Export React components with Tailwind CSS
2. Generate design tokens (colors, spacing, typography)
3. Create component documentation with props
4. List all required assets and their dimensions
5. Provide responsive breakpoints
```

---

## Documentation and Governance

### Maintaining Prompt History

Create a `Prompts.md` file tracking all design prompts:

```markdown
# SIEHS Dispatch Dashboard - Design Prompts

## Screen: Main Dashboard
**Date**: 2024-01-15
**Prompt**: [Full prompt text]
**Iterations**: 3
**Final Version**: v1.3

## Screen: Incident Detail
**Date**: 2024-01-16
**Prompt**: [Full prompt text]
**Iterations**: 2
**Final Version**: v1.2
```

### Design Decision Records

Document significant design choices:

```markdown
# Design Decision: Dark Theme for Dispatch

**Date**: 2024-01-15
**Decision**: Use dark theme as default for dispatch dashboard

**Context**: Dispatchers work 12-hour shifts in low-light control room

**Options Considered**:
1. Light theme (standard)
2. Dark theme (reduced eye strain)
3. Auto-switching based on time

**Decision**: Dark theme default with light mode option

**Rationale**: Reduces eye strain during long shifts, matches
control room lighting, emergency red more visible on dark background
```

---

## Exercise: Design Your SIEHS Interface

**Task**: Create a design prompt for a SIEHS training portal

**Requirements**:
- Staff can view available training modules
- Track progress through courses
- Download certificates
- Mobile-friendly for on-the-go learning

**Starter Prompt**:

```
Design a SIEHS Staff Training Portal

Platform: Responsive web (desktop and mobile)
Users: SIEHS staff completing mandatory and optional training
Goal: Make training progress visible and certificates accessible

Screens:
1. Dashboard: Overall progress, upcoming deadlines, recent activity
2. Course Catalog: Browse and search available training
3. Course View: Video/content player with progress tracking
4. My Certificates: Download completed course certificates

Style:
- Professional but encouraging
- SIEHS blue (#1e88e5) primary
- Progress celebrations/gamification elements
- Clean, scannable layout

Include: Empty states, loading states, mobile navigation
```

---

## Key Takeaways

1. **Prompt quality = design quality**: Detailed, structured prompts produce better designs
2. **Start with planning**: Features → flows → brief → design
3. **Include context**: Platform, user, task, constraints
4. **Be specific about style**: Colors, spacing, typography
5. **Iterate conversationally**: Use natural language to refine
6. **Document everything**: Maintain prompt history for reproducibility
7. **Design for healthcare**: Accessibility, stress conditions, safety-critical UX
