---
sidebar_position: 2
title: "Tutorial: OpenAI AgentKit - Weather Agent"
---

# Tutorial: Building a Weather Agent with OpenAI AgentKit

In this tutorial, you'll create an AI Agent using OpenAI's Agent Builder (AgentKit) that can provide weather information. This is your first step toward deploying a production-ready chatbot.

## What You'll Build

A Weather Agent that:
1. Accepts natural language weather queries
2. Uses built-in tools to fetch weather data
3. Provides conversational weather responses
4. Can be deployed to production with ChatKit

```
User Query → Agent Builder → Weather Tool → AI Response
```

## Prerequisites

- OpenAI account with API access
- Web browser
- Basic understanding of AI prompts (from Day 1)

---

## Part 1: Understanding AgentKit

### What is AgentKit?

AgentKit is OpenAI's toolkit for building AI agents without writing code. It consists of three main components:

| Component | Purpose | What It Does |
|-----------|---------|--------------|
| **Agent Builder** | Design agents | No-code interface to create AI agents |
| **ChatKit** | Frontend UI | Ready-made chat widget for your website |
| **Connector Registry** | Tools & APIs | Pre-built connections to external services |

### Why Use AgentKit for SIEHS?

| Use Case | Example |
|----------|---------|
| **Public Information** | Citizens asking about 1122 services |
| **Weather Alerts** | Emergency weather notifications |
| **FAQ Automation** | Common questions about Tele Tabeeb |
| **Training Info** | RDE program inquiries |

---

## Part 2: Access Agent Builder

### Step 2.1: Navigate to Agent Builder

1. Go to [platform.openai.com](https://platform.openai.com)
2. Log in to your OpenAI account
3. Click **"Agent Builder"** in the sidebar (or go to [platform.openai.com/agent-builder](https://platform.openai.com/agent-builder))

:::tip Beta Access
Agent Builder may be in beta. If you don't see it, check if you need to enable beta features in your account settings.
:::

### Step 2.2: Create New Agent

1. Click **"Create Agent"** or **"New Agent"**
2. You'll see the Agent Builder interface with:
   - **System Instructions** panel (left)
   - **Preview Chat** panel (right)
   - **Tools** section (bottom)

---

## Part 3: Configure Weather Agent

### Step 3.1: Set Agent Name

In the configuration panel:

| Setting | Value |
|---------|-------|
| **Name** | SIEHS Weather Assistant |
| **Description** | Provides weather information for emergency planning |

### Step 3.2: Write System Instructions

The system instructions define your agent's personality and capabilities.

#### Basic Instructions:

```
You are the SIEHS Weather Assistant, helping citizens and emergency responders
with weather information for Sindh, Pakistan.

Your responsibilities:
1. Provide current weather conditions for cities in Sindh
2. Alert users about severe weather (storms, heat waves, floods)
3. Recommend safety precautions during extreme weather
4. Connect weather to emergency services when relevant

Guidelines:
- Always mention relevant SIEHS services (1122 for emergencies, 1123 for health)
- Be concise but informative
- If weather is severe, emphasize safety first
- Default to Karachi if no city is specified
- Use Celsius for temperature

Example responses:
- "The current temperature in Karachi is 32°C with high humidity. Stay hydrated and call 1123 for any heat-related health concerns."
- "A monsoon system is approaching. If you experience flooding, dial 1122 immediately for rescue services."
```

### Step 3.3: Add Weather Tool

Agent Builder provides built-in tools for common tasks.

#### Enable Weather Tool:

1. Scroll to the **Tools** section
2. Look for **"Weather"** or **"Web Search"** tool
3. Toggle it **ON**

:::note Tool Availability
Tool availability depends on your OpenAI plan. If Weather isn't available, you can use:
- **Web Search** tool (searches for weather info)
- **Custom function** (for advanced users)
:::

### Step 3.4: Configure Tool Settings

If using a custom weather function, define:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "City name (e.g., Karachi, Hyderabad)"
      },
      "country": {
        "type": "string",
        "description": "Country code",
        "default": "PK"
      }
    },
    "required": ["city"]
  }
}
```

---

## Part 4: Test Your Agent

### Step 4.1: Use Preview Panel

The right side of Agent Builder has a preview chat. Test with these queries:

| Test Query | Expected Behavior |
|------------|-------------------|
| "What's the weather in Karachi?" | Returns current weather with SIEHS context |
| "Is it safe to travel to Hyderabad today?" | Weather + safety recommendations |
| "Will it rain tomorrow?" | Forecast with flood awareness |
| "It's very hot outside" | Heat safety tips + 1123 mention |
| "There's flooding in my area" | Emergency guidance + 1122 number |

### Step 4.2: Refine Instructions

Based on testing, improve your instructions:

#### Enhanced Instructions:

```
You are the SIEHS Weather Assistant for Sindh, Pakistan.

CORE FUNCTION:
Provide weather information with emergency context for citizens and responders.

RESPONSE FORMAT:
1. Weather Data: Temperature, conditions, humidity
2. Safety Advisory: Relevant warnings if applicable
3. SIEHS Resource: Appropriate service number

SIEHS SERVICES:
- 1122: Emergency Rescue (floods, accidents, fires)
- 1123: Tele Tabeeb (heat stroke, weather-related illness)

CITIES IN SINDH:
Karachi, Hyderabad, Sukkur, Larkana, Nawabshah, Mirpur Khas, Thatta, Badin

SAFETY TRIGGERS:
- Temperature > 40°C → Heat advisory + hydration tips
- Heavy rain/monsoon → Flood awareness + 1122 ready
- Dust storm → Stay indoors + respiratory precautions
- Fog → Travel advisory + slow driving tips

TONE:
- Professional but caring
- Concise (under 100 words unless safety critical)
- Always positive and reassuring

DEFAULT BEHAVIOR:
- If no city specified, assume Karachi
- If query is vague, ask one clarifying question
- Always end with relevant SIEHS contact if applicable
```

### Step 4.3: Verify Tool Usage

Watch the preview to confirm:
- Agent calls the weather tool when asked about weather
- Responses include actual weather data (not made up)
- SIEHS context is naturally integrated

---

## Part 5: Deploy Your Agent

### Step 5.1: Click Deploy

1. Once testing is complete, click **"Deploy"** button
2. Wait for deployment to complete (30-60 seconds)
3. You'll receive a **Workflow ID**

### Step 5.2: Save Your Workflow ID

The Workflow ID looks like: `wf_abc123xyz789`

:::warning Critical!
Copy and save your Workflow ID immediately! You'll need it to connect ChatKit.
Example: `wf_siehs_weather_agent_001`
:::

### Step 5.3: Note API Details

After deployment, you'll have:

| Item | Example | Purpose |
|------|---------|---------|
| **Workflow ID** | `wf_abc123...` | Identifies your agent |
| **API Endpoint** | Auto-provisioned | Handles requests |
| **Status** | Active | Agent is live |

---

## Part 6: Test Deployed Agent

### Step 6.1: API Test (Optional)

Test your deployed agent via API:

```bash
curl -X POST "https://api.openai.com/v1/responses" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": "YOUR_WORKFLOW_ID",
    "input": "What is the weather in Karachi?"
  }'
```

### Step 6.2: Verify Response

Expected response structure:

```json
{
  "response": "The current weather in Karachi is 34°C with partly cloudy skies and 65% humidity. It's warm today—stay hydrated! For any heat-related health concerns, you can call Tele Tabeeb at 1123.",
  "tool_calls": [
    {
      "name": "get_weather",
      "arguments": {"city": "Karachi"}
    }
  ]
}
```

---

## Part 7: Agent Best Practices

### Prompt Engineering Tips

| Tip | Example |
|-----|---------|
| **Be Specific** | "Respond in under 100 words" |
| **Provide Examples** | Include sample responses in instructions |
| **Set Boundaries** | "Only answer weather-related questions" |
| **Define Tone** | "Be professional but friendly" |
| **Include Context** | Add SIEHS service information |

### Security Considerations

1. **Workflow ID**: Treat like a password - don't share publicly
2. **Domain Restriction**: Configure in OpenAI settings after ChatKit deployment
3. **Cost Monitoring**: Set usage limits in OpenAI dashboard
4. **Content Filtering**: Enable safety filters for public-facing agents

---

## What You've Accomplished

You've successfully:
- Created an AI Weather Agent in OpenAI Agent Builder
- Configured system instructions for SIEHS context
- Enabled and tested weather tools
- Deployed the agent and obtained a Workflow ID

---

## Next Steps

Your Weather Agent is deployed! Now connect it to a user interface:

**[Continue to: ChatKit Widget Tutorial →](./chatkit-widget)**

In the next tutorial, you'll:
1. Clone the ChatKit starter app
2. Connect your Weather Agent
3. Customize the chat interface
4. Deploy to Vercel for public access

---

## Quick Reference

| Item | Value |
|------|-------|
| **Agent Builder URL** | [platform.openai.com/agent-builder](https://platform.openai.com/agent-builder) |
| **Workflow ID Format** | `wf_xxxxxxxxxx` |
| **Your Workflow ID** | _________________ (fill in after deployment) |
| **Status** | Active |

---

## Troubleshooting

### Agent not responding correctly?
- Review system instructions for clarity
- Check if tools are enabled
- Test with simple queries first

### Weather tool not working?
- Verify tool is toggled ON
- Check your OpenAI plan supports tools
- Use Web Search as alternative

### Deployment failed?
- Check API credits in your account
- Try redeploying after a few minutes
- Contact OpenAI support if persistent
