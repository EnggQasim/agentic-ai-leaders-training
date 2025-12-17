# Data Model: Day 2 - n8n Workflow Automation

**Feature**: 002-day2-n8n-automation
**Date**: 2025-12-18

## Overview

Day 2 focuses on building automation workflows in n8n. The data model covers both training content structure and the workflow data participants will work with.

## Training Content Entities

### 1. Module

Same structure as Day 1 (see Day 1 data-model.md).

### 2. WorkflowTutorial

Step-by-step guide for building a workflow.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier | Required |
| title | string | Tutorial title | Required, max 80 chars |
| description | string | What will be built | Required |
| estimatedTime | integer | Minutes to complete | 10-60 |
| difficulty | string | Skill level | Enum: beginner, intermediate |
| prerequisites | string[] | Required knowledge | Optional |
| steps | TutorialStep[] | Building steps | Min 3 steps |
| workflowJson | string | Exported workflow JSON | Required |

### 3. TutorialStep

Individual step in a workflow tutorial.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| number | integer | Step sequence | 1-20 |
| title | string | Step title | Required, max 60 chars |
| instruction | string | What to do | Required |
| screenshot | string | Screenshot path | Optional |
| node | string | n8n node being configured | Optional |
| tip | string | Helpful tip | Optional |
| warning | string | Common mistake to avoid | Optional |

## Workflow Data Entities

### 4. ContactRecord

Data structure for Google Sheets contact list.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| name | string | Contact full name | Required |
| email | string | Email address | Valid email format |
| phone | string | Phone number | Optional |
| status | string | Communication status | Enum: pending, sent, failed |
| lastContacted | date | Last email sent | ISO date or empty |
| department | string | SIEHS department | Optional |
| notes | string | Additional info | Max 500 chars |

**Sample Data for Training**:
```csv
name,email,phone,status,lastContacted,department,notes
Ali Ahmed,ali.test@example.com,+92-300-1234567,pending,,Emergency,Test patient follow-up
Sara Khan,sara.test@example.com,+92-321-7654321,pending,,Telemedicine,Appointment reminder
Hassan Raza,hassan.test@example.com,+92-333-9876543,sent,2025-12-17,Operations,
```

### 5. EmailTemplate

Structure for dynamic email content.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Template identifier | Required |
| name | string | Template name | Required |
| subject | string | Email subject line | Required, supports variables |
| bodyHtml | string | HTML email body | Required, supports variables |
| bodyText | string | Plain text fallback | Optional |
| variables | string[] | Expected placeholder names | Required |

**n8n Expression Syntax**:
- `{{ $json.name }}` - Access field from current item
- `{{ $now.toFormat('yyyy-MM-dd') }}` - Current date
- `{{ $json.name.split(' ')[0] }}` - First name only

### 6. WorkflowExecution

Record of a workflow run (conceptual for teaching).

| Field | Type | Description |
|-------|------|-------------|
| id | string | Execution ID |
| workflowId | string | Parent workflow |
| status | string | success, error, running |
| startTime | datetime | When execution started |
| endTime | datetime | When execution completed |
| itemsProcessed | integer | Number of items |
| errors | Error[] | Any errors encountered |

### 7. n8nCredential

Credential configuration (conceptual).

| Field | Type | Description |
|-------|------|-------------|
| id | string | Credential ID |
| name | string | Display name |
| type | string | google-sheets, gmail, etc. |
| scope | string[] | API permissions |
| expiresAt | datetime | Token expiration |

## Content Structure (Docusaurus)

```
docs/
├── day2/
│   ├── _category_.json
│   ├── index.md                    # Day 2 overview
│   ├── module-1-intro/
│   │   ├── index.md
│   │   ├── what-is-automation.md
│   │   ├── n8n-overview.md
│   │   ├── self-hosted-vs-cloud.md
│   │   └── siehs-opportunities.md
│   ├── module-2-interface/
│   │   ├── index.md
│   │   ├── workspace-tour.md
│   │   ├── nodes-explained.md
│   │   ├── connections-dataflow.md
│   │   ├── credentials.md
│   │   ├── execution-history.md
│   │   └── exercise-first-workflow.md
│   ├── module-3-google-sheets/
│   │   ├── index.md
│   │   ├── google-cloud-setup.md
│   │   ├── oauth-configuration.md
│   │   ├── sheets-node-operations.md
│   │   ├── filtering-data.md
│   │   └── exercise-sheet-reader.md
│   ├── module-4-gmail/
│   │   ├── index.md
│   │   ├── gmail-api-setup.md
│   │   ├── composing-emails.md
│   │   ├── variables-expressions.md
│   │   ├── html-formatting.md
│   │   └── project-email-automation.md
│   ├── module-5-production/
│   │   ├── index.md
│   │   ├── error-handling.md
│   │   ├── notifications.md
│   │   ├── scheduling.md
│   │   ├── monitoring.md
│   │   ├── security.md
│   │   └── exercise-error-handling.md
│   ├── module-6-workshop/
│   │   ├── index.md
│   │   └── brainstorm-use-cases.md
│   └── resources/
│       ├── n8n-cheat-sheet.md
│       ├── expression-reference.md
│       ├── troubleshooting.md
│       └── workflow-templates/
│           ├── patient-followup.json
│           ├── incident-alert.json
│           └── shift-reminder.json
```

## Workflow JSON Structure

Participants will export their workflows. Example structure:

```json
{
  "name": "SIEHS Patient Follow-up",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300],
      "parameters": {
        "rule": {
          "interval": [{ "field": "hours", "hoursInterval": 1 }]
        }
      }
    },
    {
      "name": "Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "position": [450, 300],
      "parameters": {
        "operation": "read",
        "sheetId": "{{SHEET_ID}}",
        "range": "Contacts!A:G"
      }
    },
    {
      "name": "Gmail",
      "type": "n8n-nodes-base.gmail",
      "position": [650, 300],
      "parameters": {
        "operation": "send",
        "sendTo": "={{ $json.email }}",
        "subject": "Follow-up from SIEHS",
        "message": "Dear {{ $json.name }},..."
      }
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [[{ "node": "Google Sheets", "type": "main", "index": 0 }]]
    },
    "Google Sheets": {
      "main": [[{ "node": "Gmail", "type": "main", "index": 0 }]]
    }
  }
}
```

## State Transitions

### Workflow Status

```
[Inactive] ←→ [Active]
     ↓            ↓
[Draft]    [Executing] → [Success]
                ↓
            [Error] → [Retry]
```

### Contact Record Status

```
[pending] → [sent] → [responded]
     ↓          ↓
 [failed]   [bounced]
```
