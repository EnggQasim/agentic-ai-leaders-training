---
sidebar_position: 1
title: "Tutorial: AI Auto Email Responder"
---

# Tutorial: Building an AI-Powered Auto Email Responder

In this tutorial, you'll build an intelligent email auto-responder using n8n that automatically reads incoming emails, generates AI-powered responses using OpenAI, and sends personalized replies. This is a key Day 3 deliverable that combines your Day 2 n8n skills with AI.

## What You'll Build

An automated workflow that:
1. Triggers when new emails arrive in Gmail
2. Reads and analyzes the email content
3. Uses OpenAI to generate a contextual response
4. Sends the AI-generated reply automatically
5. Logs the interaction for monitoring

```
[Gmail Trigger] → [OpenAI] → [Gmail Send] → [Google Sheets Log]
```

## Prerequisites

- Completed Day 2 tutorials (n8n basics, Gmail integration)
- n8n account with Gmail credentials configured
- OpenAI API key (we'll set this up)
- Google Sheet for logging (optional but recommended)

---

## Part 1: OpenAI Setup

### Step 1.1: Create OpenAI Account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys** section

### Step 1.2: Generate API Key

1. Click **"Create new secret key"**
2. Name it: `SIEHS n8n Integration`
3. **Copy the key immediately** - you won't see it again!
4. Store it securely

### Step 1.3: Add Credits (if needed)

1. Go to **Billing** section
2. Add payment method
3. Add credits ($5-10 is sufficient for testing)

:::warning Important
Keep your API key secret! Never share it or commit it to code repositories.
:::

---

## Part 2: Build the Workflow

### Step 2.1: Create New Workflow

1. In n8n, click **"New Workflow"**
2. Name it: `SIEHS AI Email Auto-Responder`
3. Click **Save**

---

### Step 2.2: Add Gmail Trigger

This node monitors your inbox for new emails.

#### Instructions:

1. Click **"+"** to add a node
2. Search for **"Gmail Trigger"**
3. Click to add it

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Credential** | Select your Gmail OAuth2 |
| **Poll Times** | Every 5 Minutes |
| **Simple** | Off (to get full email data) |
| **Filters** | See below |

#### Recommended Filters:

| Filter | Value | Purpose |
|--------|-------|---------|
| **Label** | INBOX | Only process inbox emails |
| **Read Status** | Unread | Only new emails |

#### What This Returns:

```json
{
  "id": "18c9a1b2c3d4e5f6",
  "threadId": "18c9a1b2c3d4e5f6",
  "from": "citizen@example.com",
  "to": "info@siehs.org",
  "subject": "Emergency Services Inquiry",
  "textPlain": "Hello, I need information about 1122 emergency services...",
  "date": "2024-01-15T10:30:00Z"
}
```

---

### Step 2.3: Add OpenAI Node

Generate intelligent responses using GPT.

#### Instructions:

1. Click **"+"** to the right of Gmail Trigger
2. Search for **"OpenAI"**
3. Click to add it

#### Create OpenAI Credentials:

1. Click **"Create New Credential"**
2. Select **"OpenAI API"**
3. Paste your API key
4. Click **Save**

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Resource** | Chat |
| **Operation** | Complete |
| **Model** | gpt-4o-mini (cost-effective) or gpt-4o |

#### System Message (Prompt):

```
You are the AI assistant for SIEHS (Sindh Integrated Emergency & Health Services).
Your role is to respond to emails professionally and helpfully.

Guidelines:
1. Be professional, empathetic, and concise
2. For emergency inquiries, always direct to dial 1122
3. For Tele Tabeeb inquiries, provide 1123 number
4. For general inquiries, provide helpful information
5. If unsure, offer to connect them with a human representative
6. Always end with contact information

SIEHS Services:
- 1122: 24/7 Emergency Rescue Services
- 1123: Tele Tabeeb (Remote Healthcare)
- Training: RDE (Rescue & Disaster Emergency) programs

Keep responses under 200 words unless more detail is needed.
```

#### User Message:

```
Please respond to this email:

From: {{ $json.from }}
Subject: {{ $json.subject }}

Message:
{{ $json.textPlain }}

Generate a professional, helpful response.
```

#### What This Returns:

```json
{
  "message": {
    "content": "Dear Citizen,\n\nThank you for contacting SIEHS...",
    "role": "assistant"
  },
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 120,
    "total_tokens": 270
  }
}
```

---

### Step 2.4: Add Gmail Send Node

Send the AI-generated response.

#### Instructions:

1. Click **"+"** to the right of OpenAI
2. Search for **"Gmail"**
3. Click to add it

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Resource** | Message |
| **Operation** | Send |
| **To** | `{{ $('Gmail Trigger').item.json.from }}` |
| **Subject** | `Re: {{ $('Gmail Trigger').item.json.subject }}` |
| **Message** | See below |

#### Email Message:

```
{{ $json.message.content }}

---
This is an automated response from SIEHS AI Assistant.
For emergencies, please dial 1122 immediately.

SIEHS - Sindh Integrated Emergency & Health Services
Website: www.siehs.org
```

:::tip Expression Reference
Use `$('Node Name')` to reference data from specific nodes in the workflow.
:::

---

### Step 2.5: Add Google Sheets Logging (Optional)

Track all auto-responses for monitoring and improvement.

#### Instructions:

1. Click **"+"** to the right of Gmail Send
2. Search for **"Google Sheets"**
3. Click to add it

#### Create Log Sheet:

First, create a Google Sheet with these columns:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **timestamp** | **from** | **subject** | **original_message** | **ai_response** | **tokens_used** |

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Operation** | Append Row |
| **Document** | Select your log sheet |
| **Sheet** | Sheet1 |

#### Mapping Values:

| Column | Value |
|--------|-------|
| timestamp | `{{ $now.toISO() }}` |
| from | `{{ $('Gmail Trigger').item.json.from }}` |
| subject | `{{ $('Gmail Trigger').item.json.subject }}` |
| original_message | `{{ $('Gmail Trigger').item.json.textPlain.slice(0, 500) }}` |
| ai_response | `{{ $('OpenAI').item.json.message.content.slice(0, 500) }}` |
| tokens_used | `{{ $('OpenAI').item.json.usage.total_tokens }}` |

---

### Step 2.6: Connect All Nodes

Ensure the flow is:

```
Gmail Trigger → OpenAI → Gmail Send → Google Sheets
```

---

## Part 3: Add Emergency Detection

Enhance the workflow to handle emergencies differently.

### Step 3.1: Add IF Node for Emergency Detection

#### Instructions:

1. Insert an **"IF"** node between Gmail Trigger and OpenAI
2. Configure conditions:

#### Condition Configuration:

| Setting | Value |
|---------|-------|
| **Value 1** | `{{ $json.textPlain.toLowerCase() }}` |
| **Operation** | Contains |
| **Value 2** | `emergency` |

Add more conditions (OR logic):
- Contains: `urgent`
- Contains: `accident`
- Contains: `fire`
- Contains: `medical`
- Contains: `critical`

### Step 3.2: Create Emergency Branch

For emails matching emergency keywords:

1. **True branch**: Send to human operator + auto-acknowledge
2. **False branch**: Continue to AI response

#### Emergency Auto-Acknowledge Template:

```
Dear {{ $json.from.split('<')[0] }},

Your message has been flagged as URGENT and forwarded to our emergency response team.

If this is a life-threatening emergency, please CALL 1122 IMMEDIATELY.

Do not wait for email response in emergencies.

Your Reference: {{ $json.id }}

SIEHS Emergency Response Team
```

---

## Part 4: Test Your Workflow

### Step 4.1: Manual Test

1. Click **"Execute Workflow"**
2. If no emails pending, send a test email to yourself
3. Watch each node execute

### Step 4.2: Test Different Scenarios

| Scenario | Test Email Subject/Content |
|----------|---------------------------|
| General inquiry | "What services does SIEHS provide?" |
| Emergency | "URGENT: Need ambulance information" |
| Tele Tabeeb | "How do I access telemedicine services?" |
| Training | "Information about RDE training programs" |

### Step 4.3: Review AI Responses

Check that responses are:
- Professional and appropriate
- Accurate about SIEHS services
- Directing emergencies to 1122
- Not too long or too short

---

## Part 5: Production Deployment

### Step 5.1: Refine the System Prompt

Based on test results, adjust the system prompt:

```
You are the AI assistant for SIEHS (Sindh Integrated Emergency & Health Services),
Pakistan's leading emergency healthcare provider.

CRITICAL RULES:
1. For ANY emergency: Direct to dial 1122 FIRST
2. Never provide medical advice - always recommend professional consultation
3. Be empathetic but professional
4. Keep responses concise (under 150 words)

SERVICES INFORMATION:
- 1122 Emergency: 24/7 ambulance, rescue, fire services
- 1123 Tele Tabeeb: Remote doctor consultations
- Training: First aid, CPR, disaster response courses

RESPONSE STRUCTURE:
1. Acknowledge their inquiry
2. Provide relevant information
3. Offer next steps
4. Include appropriate contact numbers

If the inquiry is unclear, ask ONE clarifying question.
```

### Step 5.2: Activate the Workflow

1. Click **Save**
2. Toggle **"Active"** to ON
3. Monitor first few executions

### Step 5.3: Set Up Monitoring

Create alerts for:
- High token usage (cost monitoring)
- Failed executions
- Emergency keyword detections

---

## Complete Workflow Structure

```
┌─────────────────┐
│  Gmail Trigger  │
│  (New Email)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   IF: Emergency │
│   Detection     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────────┐
│ True  │ │   False   │
│(Alert)│ │(AI Reply) │
└───┬───┘ └─────┬─────┘
    │           │
    ▼           ▼
┌───────┐ ┌───────────┐
│Forward│ │  OpenAI   │
│to Team│ │ Generate  │
└───┬───┘ └─────┬─────┘
    │           │
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │Gmail Send │
    │  Reply    │
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │  Sheets   │
    │   Log     │
    └───────────┘
```

---

## Key Concepts Learned

| Concept | Description |
|---------|-------------|
| **Gmail Trigger** | Monitor inbox for new messages |
| **OpenAI Integration** | Generate AI responses |
| **System Prompts** | Control AI behavior and tone |
| **Conditional Logic** | Route emails based on content |
| **Expression References** | Access data from other nodes |
| **Logging** | Track all automated interactions |

---

## SIEHS Applications

| Use Case | Trigger | AI Task | Action |
|----------|---------|---------|--------|
| General inquiries | New email | Answer FAQs | Auto-reply |
| Service requests | Contains "request" | Extract details | Create ticket + reply |
| Complaints | Contains "complaint" | Acknowledge + categorize | Forward + reply |
| Emergencies | Emergency keywords | Alert team | Forward + auto-acknowledge |
| Training inquiries | Contains "training" | Provide schedule | Reply with info |

---

## Cost Estimation

| Model | Cost per 1K tokens | Avg email (300 tokens) | 100 emails/day |
|-------|-------------------|----------------------|----------------|
| gpt-4o-mini | $0.00015 input / $0.0006 output | ~$0.0002 | ~$0.60/month |
| gpt-4o | $0.005 input / $0.015 output | ~$0.006 | ~$18/month |

**Recommendation**: Start with `gpt-4o-mini` for cost efficiency.

---

## Troubleshooting

### Workflow not triggering?
- Check Gmail Trigger poll interval
- Verify email meets filter criteria (unread, in inbox)
- Check OAuth permissions

### AI responses inappropriate?
- Refine system prompt with clearer guidelines
- Add example responses in the prompt
- Lower temperature for more consistent outputs

### High costs?
- Switch to gpt-4o-mini
- Add character limits in responses
- Filter out spam/automated emails

### Emails not sending?
- Check Gmail send permissions
- Verify "To" address expression is correct
- Check for sending limits

---

## Security Considerations

1. **API Key Security**: Store OpenAI key in n8n credentials, never in workflow
2. **Email Filtering**: Exclude automated/system emails to prevent loops
3. **Rate Limiting**: Set maximum executions per hour
4. **Data Privacy**: Don't log sensitive personal information
5. **Human Oversight**: Review AI responses regularly

---

## Next Steps

1. **Test thoroughly** with various email types
2. **Refine prompts** based on response quality
3. **Add more categories** for specialized responses
4. **Integrate with ticketing** system if available
5. Proceed to **OpenAI AgentKit** tutorial for more advanced AI

---

## Congratulations!

You've built an AI-powered email auto-responder that:
- Monitors incoming emails automatically
- Generates intelligent, contextual responses
- Handles emergencies appropriately
- Logs all interactions for review

This is your **Day 3 Module 1 Deliverable** - a production-ready AI automation!
