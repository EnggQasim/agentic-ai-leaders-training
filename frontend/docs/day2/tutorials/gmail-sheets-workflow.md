---
sidebar_position: 2
title: "Tutorial 2: Gmail + Sheets Automation"
---

# Tutorial 2: Automated Email from Google Sheets

In this tutorial, you'll build a production-ready workflow that automatically reads data from Google Sheets and sends personalized emails via Gmail on a schedule. This is the **main deliverable** for Day 2.

## What You'll Build

An automated workflow that:
1. Runs on a schedule (daily at a specific time)
2. Reads participant data from Google Sheets
3. Transforms the data fields
4. Sends personalized emails via Gmail

```
[Schedule Trigger] → [Google Sheets] → [Edit Fields] → [Gmail]
```

## Prerequisites

- n8n account (cloud.n8n.io or self-hosted)
- Google account with Gmail and Sheets access
- Google Cloud Console project (we'll set this up)

---

## Part 1: Google Cloud Setup

Before connecting Google services to n8n, you need to create OAuth credentials.

### Step 1.1: Access Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. Create a new project or select existing one

### Step 1.2: Enable APIs

1. Go to **APIs & Services → Library**
2. Search and enable:
   - **Google Sheets API**
   - **Gmail API**

### Step 1.3: Configure OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Select **External** user type
3. Fill in:
   - App name: `SIEHS n8n Integration`
   - User support email: Your email
   - Developer contact: Your email
4. Click **Save and Continue**
5. Add scopes (optional for testing)
6. Add test users (your email)
7. Complete the wizard

### Step 1.4: Create OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Select **Web application**
4. Name: `n8n Integration`
5. Add Authorized redirect URI:
   ```
   https://app.n8n.cloud/rest/oauth2-credential/callback
   ```
   (For self-hosted, use your n8n URL)
6. Click **Create**
7. **Copy the Client ID and Client Secret** - you'll need these!

---

## Part 2: Prepare Your Google Sheet

### Step 2.1: Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: `SIEHS Training Participants`

### Step 2.2: Set Up Columns

Create these column headers in Row 1:

| A | B | C | D |
|---|---|---|---|
| **id** | **name** | **email** | **designation** |

### Step 2.3: Add Sample Data

Add some test data:

| id | name | email | designation |
|----|------|-------|-------------|
| 1 | Haji Khan Rahu | haji@example.com | Senior Manager - Commercial |
| 2 | Muhammad Amman Hassan | amman@example.com | Analyst - Commercial |
| 3 | Kamran Zulfiqar | kamran@example.com | General Manager - Communications |

### Step 2.4: Copy the Sheet ID

From the URL `https://docs.google.com/spreadsheets/d/1zppcLNd-ClDtz63E2hlAwhSPobOMaiXFEXF4eiJIDRs/edit`

The Sheet ID is: `1zppcLNd-ClDtz63E2hlAwhSPobOMaiXFEXF4eiJIDRs`

---

## Part 3: Build the Workflow

### Step 3.1: Create New Workflow

1. In n8n, click **"New Workflow"**
2. Name it: `SIEHS Training Email Automation`
3. Click **Save**

---

### Step 3.2: Add Schedule Trigger

This makes the workflow run automatically at a specific time.

#### Instructions:

1. Click **"+"** to add a node
2. Search for **"Schedule Trigger"**
3. Click to add it

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Trigger Times** | Add interval |
| **Mode** | Every Day |
| **Hour** | 15 (3 PM) |
| **Minute** | 58 |

:::tip SIEHS Use Case
For daily staff notifications, set this to run early morning (e.g., 7:00 AM). For weekly reports, use "Every Week" mode.
:::

---

### Step 3.3: Add Google Sheets Node

#### Instructions:

1. Click **"+"** to the right of Schedule Trigger
2. Search for **"Google Sheets"**
3. Click to add it

#### Create Credentials:

1. Click **"Create New Credential"**
2. Select **"Google Sheets OAuth2"**
3. Enter:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
4. Click **"Sign in with Google"**
5. Select your Google account
6. Grant permissions
7. Click **"Save"**

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Resource** | Sheet Within Document |
| **Operation** | Get Many |
| **Document** | Select your spreadsheet |
| **Sheet** | Sheet1 |

#### What This Returns:

```json
[
  {
    "id": "1",
    "name": "Haji Khan Rahu",
    "email": "haji@example.com",
    "designation": "Senior Manager - Commercial"
  },
  {
    "id": "2",
    "name": "Muhammad Amman Hassan",
    "email": "amman@example.com",
    "designation": "Analyst - Commercial"
  }
]
```

---

### Step 3.4: Add Edit Fields Node

Transform the data to prepare for email sending.

#### Instructions:

1. Click **"+"** to the right of Google Sheets
2. Search for **"Edit Fields"** (Set node)
3. Click to add it

#### Node Configuration:

Click **"Add Field"** four times:

| Field Name | Value | Type |
|------------|-------|------|
| `email` | `{{ $json.email }}` | String |
| `customer_name` | `{{ $json.name }}` | String |
| `id` | `{{ $json.id }}` | Number |
| `designation` | `{{ $json.designation }}` | String |

#### Why Edit Fields?

1. **Standardize naming**: Use consistent field names
2. **Type conversion**: Ensure `id` is a number
3. **Future proofing**: Easy to add computed fields

---

### Step 3.5: Add Gmail Node

Send personalized emails to each person.

#### Instructions:

1. Click **"+"** to the right of Edit Fields
2. Search for **"Gmail"**
3. Click to add it

#### Create Gmail Credentials:

1. Click **"Create New Credential"**
2. Select **"Gmail OAuth2"**
3. Enter your Client ID and Secret
4. Click **"Sign in with Google"**
5. Grant Gmail permissions
6. Click **"Save"**

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Resource** | Message |
| **Operation** | Send |
| **To** | `{{ $json.email }}` |
| **Subject** | `SIEHS Agentic AI Training Invitation` |
| **Message** | See below |

#### Email Message Template:

```
Hello {{ $json.customer_name }},

Honorable {{ $json.designation }}, you are invited to take the Agentic AI workshop at Head Office.

Training Details:
- Duration: 3 Days
- Topics: Prompt Engineering, n8n Automation, AI Deployment
- Venue: SIEHS Head Office

Please confirm your attendance.

Regards,
Muhammad Qasim
CGAIO
PIAIC | GIAIC | Cancer Clarity | Ranea.ai
```

---

### Step 3.6: Connect All Nodes

Ensure the flow is:

```
Schedule Trigger → Google Sheets → Edit Fields → Gmail
```

---

## Part 4: Test Your Workflow

### Step 4.1: Manual Test

1. Click **"Execute Workflow"** button
2. Watch each node execute (turns green)
3. Click **Gmail node** to verify emails were sent

### Step 4.2: Check Your Sent Folder

1. Open Gmail
2. Go to **Sent** folder
3. Verify emails were sent to each address

### Step 4.3: Check Execution Log

1. In n8n, go to **Executions** (left sidebar)
2. See all past executions
3. Click to view details and debug issues

---

## Part 5: Activate for Production

### Step 5.1: Save the Workflow

Click **"Save"** to save all changes.

### Step 5.2: Activate the Workflow

1. Toggle the **"Active"** switch (top right)
2. Workflow will now run automatically at scheduled time

:::warning Important
Once activated, the workflow runs automatically. Make sure your email content is correct before activating!
:::

### Step 5.3: Monitor Executions

Check **Executions** regularly to ensure:
- Workflow runs on schedule
- No errors occur
- Emails are being sent

---

## Complete Workflow JSON

Here's the complete workflow structure:

```json
{
  "name": "SIEHS Training Email Automation",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [
            {
              "triggerAtHour": 15,
              "triggerAtMinute": 58
            }
          ]
        }
      }
    },
    {
      "name": "Get row(s) in sheet",
      "type": "n8n-nodes-base.googleSheets",
      "parameters": {
        "documentId": "YOUR_SHEET_ID",
        "sheetName": "Sheet1"
      }
    },
    {
      "name": "Edit Fields",
      "type": "n8n-nodes-base.set",
      "parameters": {
        "assignments": {
          "assignments": [
            {"name": "email", "value": "={{ $json.email }}", "type": "string"},
            {"name": "customer_name", "value": "={{ $json.name }}", "type": "string"},
            {"name": "id", "value": "={{ $json.id }}", "type": "number"},
            {"name": "designation", "value": "={{ $json.designation }}", "type": "string"}
          ]
        }
      }
    },
    {
      "name": "Send a message",
      "type": "n8n-nodes-base.gmail",
      "parameters": {
        "sendTo": "={{ $json.email }}",
        "subject": "SIEHS Agentic AI Training Invitation",
        "message": "Hello {{ $json.customer_name }},\n\nHonorable {{ $json.designation }}, you are invited to take the Agentic AI workshop at Head Office.\n\nRegards,\nMuhammad Qasim"
      }
    }
  ],
  "connections": {
    "Schedule Trigger": {"main": [[{"node": "Get row(s) in sheet"}]]},
    "Get row(s) in sheet": {"main": [[{"node": "Edit Fields"}]]},
    "Edit Fields": {"main": [[{"node": "Send a message"}]]}
  },
  "active": true
}
```

---

## Key Concepts Learned

| Concept | Description |
|---------|-------------|
| **Schedule Trigger** | Run workflows automatically on time |
| **Google Sheets** | Read/write spreadsheet data |
| **OAuth2** | Secure authentication with Google |
| **Gmail** | Send automated emails |
| **Expressions** | Dynamic content with `{{ }}` |
| **Activation** | Make workflows run automatically |

---

## SIEHS Applications

| Use Case | Trigger | Data Source | Action |
|----------|---------|-------------|--------|
| Daily shift reminders | 6:00 AM daily | Shift schedule sheet | Email staff |
| Training notifications | Weekly | Training roster | Invite participants |
| Equipment maintenance | Monthly | Inventory sheet | Alert technicians |
| Incident reports | On update | Incident log | Email supervisors |
| Birthday wishes | Daily | HR sheet | Send greetings |

---

## Advanced Enhancements

### Add Error Handling

1. Add **"Error Trigger"** node to catch failures
2. Connect to notification (Slack, Email) to alert admins

### Add Filtering

1. Insert **"Filter"** node after Google Sheets
2. Only process rows where `status = "pending"`

### Add HTML Emails

1. In Gmail node, enable **HTML** option
2. Use HTML template for professional formatting

---

## Troubleshooting

### OAuth Error?
- Verify Client ID and Secret are correct
- Check redirect URI matches exactly
- Ensure APIs are enabled in Google Cloud

### Sheet not found?
- Verify you have access to the sheet
- Check the Sheet ID is correct
- Try re-authenticating credentials

### Emails not sending?
- Check Gmail quota limits
- Verify "To" address expression is correct
- Look at execution logs for errors

### Schedule not running?
- Make sure workflow is **Active**
- Check timezone settings
- Verify schedule configuration

---

## Congratulations!

You've built a production-ready automated email system that:

- Runs automatically on schedule
- Reads data from Google Sheets
- Sends personalized emails via Gmail
- Can be monitored and managed

This is your **Day 2 Deliverable** - a working automation that demonstrates real SIEHS value!

---

## Next Steps

1. **Customize** the email content for your department
2. **Add** your actual participant data to the sheet
3. **Experiment** with different schedules
4. **Explore** adding error handling
5. Proceed to **Day 3** for AI-powered automation!
