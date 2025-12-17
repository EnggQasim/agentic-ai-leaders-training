# Quickstart: Day 2 - n8n Workflow Automation

**Feature**: 002-day2-n8n-automation
**Date**: 2025-12-18

## Prerequisites

### For Content Development
- [ ] Docusaurus project from Day 1 setup
- [ ] n8n Cloud account (for screenshots)
- [ ] Google Cloud Console access

### For Training Participants
- [ ] Completed Day 1 training
- [ ] Google account
- [ ] Modern web browser
- [ ] Stable internet connection

## Quick Setup

### 1. Create Day 2 Content Structure

```bash
# From frontend directory
mkdir -p docs/day2/module-1-intro
mkdir -p docs/day2/module-2-interface
mkdir -p docs/day2/module-3-google-sheets
mkdir -p docs/day2/module-4-gmail
mkdir -p docs/day2/module-5-production
mkdir -p docs/day2/module-6-workshop
mkdir -p docs/day2/resources/workflow-templates
```

### 2. Create Day 2 Index Page

Create `docs/day2/index.md`:

```markdown
---
sidebar_position: 2
title: Day 2 - n8n Automation
---

# Day 2: n8n Workflow Automation

**Duration**: 8 hours | **Prerequisites**: Day 1 Complete

## Learning Objectives

By the end of Day 2, you will:
- Understand workflow automation concepts
- Navigate and use the n8n interface confidently
- Connect Google Sheets and Gmail to n8n
- Build a complete email automation workflow
- Handle errors and monitor workflow execution

## Modules

| Module | Topic | Duration |
|--------|-------|----------|
| 1 | [Introduction to Automation](./module-1-intro/) | 1 hour |
| 2 | [n8n Interface Deep Dive](./module-2-interface/) | 1.5 hours |
| 3 | [Google Sheets Integration](./module-3-google-sheets/) | 1.5 hours |
| 4 | [Gmail & Email Workflow](./module-4-gmail/) | 2 hours |
| 5 | [Production Readiness](./module-5-production/) | 1.5 hours |
| 6 | [SIEHS Use Case Workshop](./module-6-workshop/) | 0.5 hours |

## What You'll Build

A complete **Google Sheets → Gmail Automation** that:
- Reads contact data from a spreadsheet
- Sends personalized follow-up emails
- Updates the spreadsheet with send status
- Notifies you if errors occur

## Setup Requirements

Before starting, ensure you have:
1. Google account (personal or SIEHS)
2. Access to n8n (we'll set this up together)
3. Test spreadsheet with sample data
```

### 3. n8n Account Setup Guide

Create `docs/day2/module-2-interface/n8n-setup.md`:

```markdown
---
sidebar_position: 0
title: n8n Account Setup
---

# Setting Up Your n8n Account

## Step 1: Create n8n Cloud Account

1. Go to [n8n.cloud](https://n8n.cloud)
2. Click "Start Free Trial"
3. Sign up with email or Google account
4. Verify your email address

## Step 2: Access Your Workspace

After signup, you'll see the n8n editor:

![n8n Workspace](/img/day2/n8n-workspace.png)

Key areas:
- **Canvas**: Where you build workflows
- **Node Panel**: Available integrations (left side)
- **Execution Panel**: Run history (bottom)

## Step 3: Verify Setup

Create a test workflow:
1. Click "Add first step"
2. Search for "Manual Trigger"
3. Click "Execute Workflow"
4. See "Execution successful"

✅ You're ready to build automations!
```

### 4. Google Cloud Setup Guide

Create `docs/day2/module-3-google-sheets/google-cloud-setup.md`:

```markdown
---
sidebar_position: 1
title: Google Cloud Setup
---

# Setting Up Google Cloud for n8n

## Why This Is Needed

n8n needs permission to access your Google Sheets and Gmail.
We set this up once using Google Cloud Console.

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown → "New Project"
3. Name: "SIEHS n8n Integration"
4. Click "Create"

### 2. Enable APIs

1. Go to "APIs & Services" → "Library"
2. Search "Google Sheets API" → Enable
3. Search "Gmail API" → Enable

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" → Create
3. Fill in:
   - App name: "SIEHS Automation"
   - User support email: Your email
   - Developer contact: Your email
4. Save and Continue (skip Scopes)
5. Add your email as Test User

### 4. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "n8n"
5. Authorized redirect URIs: Add from n8n credential screen
6. Click "Create"
7. **Save** the Client ID and Client Secret

### 5. Add to n8n

1. In n8n, click Credentials → New
2. Search "Google Sheets"
3. Enter Client ID and Client Secret
4. Click "Sign in with Google"
5. Authorize the app

✅ Google connection ready!
```

### 5. Sample Test Data

Create a Google Sheet template for training:

**Sheet Name**: "SIEHS Training - Patient Follow-up"

| name | email | phone | status | lastContacted | department | notes |
|------|-------|-------|--------|---------------|------------|-------|
| Ali Ahmed | ali.test@example.com | +92-300-1234567 | pending | | Emergency | Test record |
| Sara Khan | sara.test@example.com | +92-321-7654321 | pending | | Telemedicine | Appointment |
| Hassan Raza | hassan.test@example.com | +92-333-9876543 | pending | | Operations | Follow-up |

### 6. Email Template for Exercise

```html
Subject: Follow-up from SIEHS Emergency Services

Dear {{ $json.name }},

Thank you for using SIEHS emergency services. We hope you are
recovering well.

This is a courtesy follow-up from our {{ $json.department }} team.

If you have any questions or need further assistance, please:
- Call our helpline: 1122
- Visit: www.siehs.org

Best regards,
SIEHS Team

---
This is an automated message. Please do not reply directly.
```

## Verification Checklist

- [ ] Day 2 content structure created
- [ ] n8n Cloud account working
- [ ] Google Cloud project created
- [ ] Sheets and Gmail APIs enabled
- [ ] OAuth credentials created
- [ ] Test spreadsheet ready with sample data
- [ ] Can read sheet data in n8n
- [ ] Can send test email via n8n

## Troubleshooting

### Common Issues

**"Access Denied" when connecting Google**
- Check OAuth consent screen is configured
- Verify your email is added as Test User
- Ensure redirect URI matches exactly

**"Quota exceeded" errors**
- Add 1-second delay between operations
- Process in smaller batches

**Emails going to spam**
- Use proper sender name
- Include unsubscribe option
- Test with different email providers

## Next Steps

1. Develop Module 1 content (Introduction)
2. Create step-by-step screenshots for n8n interface
3. Build sample workflows for export
4. Create troubleshooting guide
