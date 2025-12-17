# Quickstart: Day 1 - Prompt Engineering Fundamentals

**Feature**: 001-day1-prompt-engineering
**Date**: 2025-12-18

## Prerequisites

Before starting Day 1 content development:

### Required
- [ ] Node.js 18+ installed
- [ ] Docusaurus project initialized (see below)
- [ ] Text editor (VS Code recommended)

### For Participants (Training Day)
- [ ] Modern web browser (Chrome, Firefox, Edge, Safari)
- [ ] Internet connection
- [ ] ChatGPT or Claude account (free tier sufficient)

## Quick Setup

### 1. Initialize Docusaurus Project

```bash
# From repository root
npx create-docusaurus@latest frontend classic --typescript

cd frontend
npm install

# Install additional dependencies
npm install @docusaurus/theme-search-algolia
npm install tailwindcss postcss autoprefixer
```

### 2. Configure for Training Structure

Edit `docusaurus.config.ts`:

```typescript
const config: Config = {
  title: 'SIEHS Agentic AI Training',
  tagline: 'Architecting an AI-Enabled Organization',
  url: 'https://siehs-ai-training.vercel.app',
  baseUrl: '/',

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Docs at root
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'SIEHS AI Training',
      items: [
        { to: '/day1', label: 'Day 1: Prompts', position: 'left' },
        { to: '/day2', label: 'Day 2: Automation', position: 'left' },
        { to: '/day3', label: 'Day 3: Deployment', position: 'left' },
      ],
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
  },
};
```

### 3. Create Day 1 Content Structure

```bash
# Create directory structure
mkdir -p docs/day1/module-1-intro
mkdir -p docs/day1/module-2-fundamentals
mkdir -p docs/day1/module-3-advanced
mkdir -p docs/day1/module-4-configuration
mkdir -p docs/day1/module-5-workshop
mkdir -p docs/day1/resources
```

### 4. Create Day 1 Index Page

Create `docs/day1/index.md`:

```markdown
---
sidebar_position: 1
title: Day 1 - Prompt Engineering
---

# Day 1: Prompt Engineering Fundamentals

**Duration**: 8 hours | **Difficulty**: Beginner

## Learning Objectives

By the end of Day 1, you will:
- Understand how Large Language Models work
- Master zero-shot, few-shot, and role-based prompting
- Apply Chain of Thought reasoning techniques
- Configure AI parameters for different tasks
- Build a personal prompt library for SIEHS work

## Modules

| Module | Topic | Duration |
|--------|-------|----------|
| 1 | [Introduction to AI & LLMs](./module-1-intro/) | 1 hour |
| 2 | [Prompt Engineering Fundamentals](./module-2-fundamentals/) | 2 hours |
| 3 | [Advanced Prompting Techniques](./module-3-advanced/) | 2 hours |
| 4 | [Configuration & Best Practices](./module-4-configuration/) | 1.5 hours |
| 5 | [SIEHS Applied Workshop](./module-5-workshop/) | 1.5 hours |

## What You'll Build

A personal **Prompt Library** with 5+ tested templates for:
- Patient communication
- Incident report summarization
- Training content generation
- FAQ automation
- Your department-specific use cases

## Prerequisites

- Basic computer literacy
- Access to ChatGPT or Claude (free tier works)
- No programming experience required!
```

### 5. Start Development Server

```bash
npm run start
# Opens http://localhost:3000
```

## Content Development Workflow

### For Each Module:

1. **Create index.md** with module overview
2. **Create section files** for each topic
3. **Add examples** with SIEHS context
4. **Include exercises** with clear instructions
5. **Add self-check quiz** (optional)

### Example Section Template:

```markdown
---
sidebar_position: 1
title: Zero-Shot Prompting
---

# Zero-Shot Prompting

## What You'll Learn
- What zero-shot prompting means
- When to use it at SIEHS
- How to write effective zero-shot prompts

## Concept

[Explanation with SIEHS example]

## SIEHS Example

**Scenario**: You need to draft an emergency SMS to notify patients.

**Poor Prompt** ❌
```
write sms
```

**Effective Prompt** ✅
```
Write a brief SMS (max 160 characters) to notify a patient that
their ambulance is en route. Include: estimated arrival time of
10 minutes, advice to stay calm, and the SIEHS helpline number 1122.
```

## Try It Yourself

1. Open ChatGPT or Claude
2. Copy the effective prompt above
3. Compare the outputs from both prompts
4. Modify for your department's needs

## Key Takeaways

- Be specific about format and length
- Include all required information
- Specify the context and audience
```

## Verification Checklist

After setup, verify:

- [ ] `npm run start` serves the site
- [ ] Day 1 navigation appears in sidebar
- [ ] Module pages load correctly
- [ ] Examples render with proper formatting
- [ ] Mobile view works (check at 375px width)

## Next Steps

1. Develop Module 1 content (Introduction to AI)
2. Create SIEHS examples for each technique
3. Build exercise templates
4. Add prompt library templates
5. Create reference cheat sheet
