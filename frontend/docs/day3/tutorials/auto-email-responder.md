---
sidebar_position: 1
title: "Tutorial: AI Auto Email Responder"
---

# Tutorial: Building an AI-Powered Auto Email Responder

In this tutorial, you'll build an intelligent email auto-responder using n8n that automatically reads incoming emails, generates AI-powered responses, and sends personalized replies. This is a key Day 3 deliverable that combines your Day 2 n8n skills with AI.

:::tip Two Approaches Available
This tutorial covers **two approaches**:
1. **Basic Approach**: OpenAI Chat node (simpler, paid API)
2. **Advanced Approach**: AI Agent with Google Gemini + Structured Output (more powerful, free tier available)

Choose based on your needs and budget!
:::

## What You'll Build

An automated workflow that:
1. Triggers when new emails arrive in Gmail
2. Reads and analyzes the email content
3. Uses AI to generate a contextual response with sentiment analysis
4. Sends the AI-generated reply automatically
5. Tracks follow-up requirements

```
[Gmail Trigger] → [AI Agent] → [Gmail Send]
```

## Prerequisites

- Completed Day 2 tutorials (n8n basics, Gmail integration)
- n8n account with Gmail credentials configured
- **Option A**: OpenAI API key (paid)
- **Option B**: Google Gemini API key (free tier available)

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

## Part 1B: Google Gemini Setup (Alternative - Free Tier)

Google Gemini offers a **free tier** that's perfect for testing and low-volume use.

### Step 1B.1: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **"Get API Key"** in the left sidebar
4. Click **"Create API Key"**
5. Select a Google Cloud project or create a new one
6. **Copy the API key immediately**

### Step 1B.2: Free Tier Limits

| Feature | Free Tier Limit |
|---------|-----------------|
| **Requests per minute** | 60 |
| **Requests per day** | 1,500 |
| **Tokens per minute** | 32,000 |

:::tip Cost Comparison
| Provider | Free Tier | Paid Rate |
|----------|-----------|-----------|
| Google Gemini | 1,500 requests/day FREE | $0.075/1M tokens |
| OpenAI GPT-4o-mini | None | $0.15/1M input tokens |
| OpenAI GPT-4o | None | $5/1M input tokens |

**Recommendation**: Start with Gemini's free tier for development and testing!
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

## Part 2B: Advanced AI Agent Approach (Recommended)

This approach uses n8n's **AI Agent** node with **Google Gemini** and **Structured Output Parser** for more intelligent responses with sentiment analysis.

### Why Use AI Agent?

| Feature | Basic OpenAI | AI Agent + Gemini |
|---------|--------------|-------------------|
| **Cost** | Paid only | Free tier available |
| **Output Format** | Plain text | Structured JSON |
| **Sentiment Analysis** | Manual | Automatic |
| **Follow-up Detection** | Manual | Built-in |
| **Flexibility** | Limited | Highly customizable |

### Step 2B.1: Add Gmail Trigger (Same as Basic)

Follow Step 2.2 above to add the Gmail Trigger with:
- **Poll Times**: Every Minute
- **Credential**: Your Gmail OAuth2

### Step 2B.2: Add AI Agent Node

The AI Agent node is a LangChain-powered node for advanced AI workflows.

#### Instructions:

1. Click **"+"** to the right of Gmail Trigger
2. Search for **"AI Agent"**
3. Click to add it

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Prompt Type** | Define |
| **Text** | See below |
| **Has Output Parser** | ON ✓ |

#### Input Text (Expression):

```
email title: {{ $json.Subject }}
email body: {{ $json.snippet }}
sender email: {{ $json.From }}
```

#### System Message:

```
You are an AI email auto-reply assistant.

Your task is to:
1. Read the incoming email carefully
2. Analyze the sentiment and content
3. Generate an appropriate professional reply
4. Determine if follow-up action is needed

Provide your response in the structured format with:
- reply_subject: A suitable subject line for the reply
- reply_body: A professional, contextually appropriate email response
- sentiment: The sentiment of the original email (positive, neutral, or negative)
- requires_followup: Boolean indicating if this email needs further action
- from_email: sender email address
```

### Step 2B.3: Add Google Gemini Chat Model

Connect the language model to the AI Agent.

#### Instructions:

1. Hover over AI Agent node
2. Click the **"+"** below the node (sub-nodes area)
3. Search for **"Google Gemini Chat Model"**
4. Click to add it

#### Create Gemini Credentials:

1. Click **"Create New Credential"**
2. Select **"Google Gemini (PaLM) API"**
3. Paste your Gemini API key from Part 1B
4. Click **Save**

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Model** | gemini-1.5-flash (fast) or gemini-1.5-pro (better) |
| **Options** | Leave defaults |

### Step 2B.4: Add Structured Output Parser

This ensures consistent JSON responses from the AI.

#### Instructions:

1. Click **"+"** in the AI Agent sub-nodes area
2. Search for **"Structured Output Parser"**
3. Click to add it

#### JSON Schema Example:

```json
{
  "reply_subject": "Re: Original Subject",
  "reply_body": "Professional email reply text here",
  "sentiment": "positive",
  "requires_followup": false,
  "sender_email": "sender@example.com"
}
```

#### What the AI Agent Returns:

```json
{
  "output": {
    "reply_subject": "Re: Your Inquiry About SIEHS Services",
    "reply_body": "Dear Citizen,\n\nThank you for reaching out to SIEHS...",
    "sentiment": "neutral",
    "requires_followup": false,
    "sender_email": "citizen@example.com"
  }
}
```

### Step 2B.5: Add Gmail Send Node (Structured Output)

Send the AI-generated reply using structured output fields.

#### Node Configuration:

| Setting | Value |
|---------|-------|
| **Resource** | Message |
| **Operation** | Send |
| **To** | `{{ $json.output.sender_email }}` |
| **Subject** | `{{ $json.output.reply_subject }}` |
| **Message** | `{{ $json.output.reply_body }}` |

### Step 2B.6: Complete AI Agent Workflow

Your workflow should look like this:

```
┌─────────────────┐
│  Gmail Trigger  │
│ (Every Minute)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│           AI Agent                   │
│  ┌─────────────┐ ┌────────────────┐ │
│  │Google Gemini│ │Structured Parser│ │
│  │ Chat Model  │ │   (JSON out)    │ │
│  └─────────────┘ └────────────────┘ │
└────────────────┬────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │  Gmail Send   │
         │ (Auto Reply)  │
         └───────────────┘
```

### Step 2B.7: Using Sentiment Data

The structured output includes sentiment analysis you can use for:

#### Example: Route Negative Emails to Human

Add an **IF** node after AI Agent:

| Condition | Action |
|-----------|--------|
| `{{ $json.output.sentiment }}` equals "negative" | Forward to supervisor |
| `{{ $json.output.requires_followup }}` equals true | Add to follow-up queue |

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
| **AI Agent Node** | LangChain-powered advanced AI processing |
| **Google Gemini** | Free-tier language model alternative |
| **Structured Output Parser** | Ensure consistent JSON responses |
| **Sentiment Analysis** | Automatic email tone detection |
| **System Prompts** | Control AI behavior and tone |
| **Conditional Logic** | Route emails based on content/sentiment |
| **Expression References** | Access data from other nodes |

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

| Model | Cost | Avg email (300 tokens) | 100 emails/day |
|-------|------|----------------------|----------------|
| **Google Gemini 1.5 Flash** | FREE (1,500/day) | $0.00 | **$0/month** |
| **Google Gemini 1.5 Pro** | FREE (50/day) | $0.00 | $0/month (paid beyond) |
| gpt-4o-mini | $0.15/1M input, $0.60/1M output | ~$0.0002 | ~$0.60/month |
| gpt-4o | $5/1M input, $15/1M output | ~$0.006 | ~$18/month |

:::tip Recommendation
**Start with Google Gemini 1.5 Flash** - it's FREE and handles 1,500 emails/day!
Only consider OpenAI if you need specific GPT features.
:::

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

### AI Agent not returning structured output?
- Verify the Structured Output Parser is connected to the AI Agent
- Check that the JSON schema example matches expected fields
- Ensure "Has Output Parser" is ON in AI Agent settings

### Google Gemini API errors?
- Verify API key is correct in credentials
- Check if you've exceeded free tier limits (1,500/day for Flash)
- Try switching between gemini-1.5-flash and gemini-1.5-pro

### High costs?
- **Switch to Google Gemini** - it's FREE for most use cases!
- Add character limits in responses
- Filter out spam/automated emails

### Emails not sending?
- Check Gmail send permissions
- For AI Agent: verify expression is `{{ $json.output.sender_email }}` not `{{ $json.sender_email }}`
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
- Uses **AI Agent** with **Google Gemini** (FREE!) or OpenAI
- Generates **structured responses** with sentiment analysis
- Detects follow-up requirements automatically
- Handles emergencies appropriately
- Routes emails based on content and sentiment

This is your **Day 3 Module 1 Deliverable** - a production-ready AI automation!

---

## Quick Reference: Which Approach?

| Scenario | Recommended Approach |
|----------|---------------------|
| **Learning/Testing** | AI Agent + Gemini (FREE) |
| **Production (< 1,500 emails/day)** | AI Agent + Gemini Flash (FREE) |
| **Production (high volume)** | AI Agent + Gemini Pro (paid) or OpenAI |
| **Need GPT-specific features** | Basic OpenAI approach |
| **Need sentiment analysis** | AI Agent + Structured Output |
| **Simple auto-replies only** | Basic OpenAI approach |
