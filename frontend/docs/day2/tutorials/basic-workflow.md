---
sidebar_position: 1
title: "Tutorial 1: Basic Customer Workflow"
---

# Tutorial 1: Your First n8n Workflow

In this tutorial, you'll build your first n8n workflow that retrieves customer data and sends personalized messages. This is the foundation for all automation you'll build at SIEHS.

## What You'll Build

A workflow that:
1. Manually triggers when you click "Execute"
2. Fetches customer data from a datastore
3. Transforms the data fields
4. Sends personalized messages to each customer

```
[Manual Trigger] → [Customer Datastore] → [Edit Fields] → [Customer Messenger]
```

## Prerequisites

- n8n account (cloud.n8n.io or self-hosted)
- Basic understanding of JSON data

---

## Step 1: Create a New Workflow

1. Log into your n8n instance
2. Click **"New Workflow"** button (top right)
3. Give it a name: `Basic SIEHS Welcome`
4. Click **"Save"**

:::note
Your canvas should now show an empty workflow with a save option.
:::

---

## Step 2: Add the Manual Trigger

The Manual Trigger starts your workflow when you click "Execute."

### Instructions:

1. Click the **"+"** button in the center of the canvas
2. Search for **"Manual Trigger"**
3. Click to add it to your canvas

### Node Settings:
- No configuration needed - it's ready to use!

### What This Does:
This node waits for you to click "Execute Workflow" before running.

:::tip For SIEHS
Manual triggers are great for testing and on-demand tasks like sending announcement emails to specific groups.
:::

---

## Step 3: Add Customer Datastore

Now we'll add a node to fetch customer data.

### Instructions:

1. Click the **"+"** button to the right of the Manual Trigger
2. Search for **"Customer Datastore (n8n training)"**
3. Click to add it

### Node Configuration:

| Setting | Value |
|---------|-------|
| **Operation** | Get All People |

### What This Does:
This training node simulates fetching customer records. In real SIEHS workflows, you'd use:
- Google Sheets
- Airtable
- PostgreSQL database
- HTTP Request to an API

### Sample Output:
```json
[
  {
    "id": "1",
    "name": "Haji Khan Rahu",
    "country": "Pakistan",
    "email": "haji@siehs.org"
  },
  {
    "id": "2",
    "name": "Muhammad Amman Hassan",
    "country": "Pakistan",
    "email": "amman@siehs.org"
  }
]
```

---

## Step 4: Add Edit Fields Node

Transform and select only the fields you need.

### Instructions:

1. Click **"+"** to the right of Customer Datastore
2. Search for **"Edit Fields"** (also called "Set")
3. Click to add it

### Node Configuration:

Click **"Add Field"** three times and configure:

| Field Name | Value | Type |
|------------|-------|------|
| `customer_name` | `{{ $json.name }}` | String |
| `customer_country` | `{{ $json.country }}` | String |
| `id` | `{{ $json.id }}` | String |

### Understanding Expressions:

In n8n, expressions use double curly braces `{{ }}`:

| Expression | Meaning |
|------------|---------|
| `{{ $json.name }}` | Get the "name" field from input |
| `{{ $json.country }}` | Get the "country" field from input |
| `{{ $json.id }}` | Get the "id" field from input |

### Why Transform Data?

1. **Rename fields** to match your output format
2. **Select only needed fields** to simplify data
3. **Add computed fields** (like full names from first + last)

---

## Step 5: Add Customer Messenger

Send personalized messages to each customer.

### Instructions:

1. Click **"+"** to the right of Edit Fields
2. Search for **"Customer Messenger (n8n training)"**
3. Click to add it

### Node Configuration:

| Setting | Value |
|---------|-------|
| **Customer ID** | `{{ $json.id }}` |
| **Message** | See below |

### Message Template:

```
Dear {{ $json.customer_name }},

Welcome {{ $json.customer_country }} SIEHS Region!

Regards,
Muhammad Qasim
```

### Understanding the Message:

| Part | Meaning |
|------|---------|
| `{{ $json.customer_name }}` | Inserts customer's name |
| `{{ $json.customer_country }}` | Inserts customer's country |
| Static text | Stays the same for everyone |

---

## Step 6: Connect the Nodes

Your nodes should already be connected if you added them sequentially. If not:

1. **Drag** from the gray dot on the right of one node
2. **Drop** on the gray dot on the left of the next node

### Connection Order:
```
Manual Trigger → Customer Datastore → Edit Fields → Customer Messenger
```

---

## Step 7: Test Your Workflow

### Execute the Workflow:

1. Click **"Execute Workflow"** button (top right)
2. Watch each node light up green as it executes
3. Click any node to see its output

### Check the Output:

Click on **Customer Messenger** node to see:

```json
{
  "success": true,
  "message": "Message sent to customer 1"
}
```

---

## Step 8: Save and Activate

1. Click **"Save"** to save your workflow
2. (Optional) Toggle **"Active"** to run on schedule

:::warning
This workflow uses manual trigger, so "Active" doesn't apply. For scheduled workflows, you must activate them.
:::

---

## Complete Workflow JSON

Here's the complete workflow you just built:

```json
{
  "name": "Basic SIEHS Welcome",
  "nodes": [
    {
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger"
    },
    {
      "name": "Customer Datastore (n8n training)",
      "type": "n8n-nodes-base.n8nTrainingCustomerDatastore",
      "parameters": {
        "operation": "getAllPeople"
      }
    },
    {
      "name": "Edit Fields",
      "type": "n8n-nodes-base.set",
      "parameters": {
        "assignments": {
          "assignments": [
            {"name": "customer_name", "value": "={{ $json.name }}"},
            {"name": "customer_country", "value": "={{ $json.country }}"},
            {"name": "id", "value": "={{ $json.id }}"}
          ]
        }
      }
    },
    {
      "name": "Customer Messenger (n8n training)",
      "type": "n8n-nodes-base.n8nTrainingCustomerMessenger",
      "parameters": {
        "customerId": "={{ $json.id }}",
        "message": "Dear {{ $json.customer_name }},\n\nWelcome {{ $json.customer_country }} SIEHS Region!\n\nRegards,\nMuhammad Qasim"
      }
    }
  ]
}
```

---

## Key Concepts Learned

| Concept | Description |
|---------|-------------|
| **Nodes** | Building blocks of workflows |
| **Triggers** | What starts a workflow |
| **Expressions** | Dynamic values using `{{ }}` |
| **Data Flow** | How data passes between nodes |
| **Edit Fields** | Transform data between nodes |

---

## SIEHS Applications

This pattern can be used for:

| Use Case | Data Source | Action |
|----------|-------------|--------|
| Welcome emails | Staff roster | Send welcome |
| Shift notifications | Schedule sheet | Notify staff |
| Equipment alerts | Inventory DB | Alert managers |
| Training reminders | HR system | Email trainees |

---

## Next Steps

Now that you understand the basics, proceed to:

**[Tutorial 2: Gmail + Google Sheets Automation](./gmail-sheets-workflow)** - Build a production-ready automated email system.

---

## Troubleshooting

### Node shows red (error)?
- Check that expressions are correct
- Verify the previous node has output data
- Click the node to see the error message

### No data flowing?
- Make sure nodes are connected
- Check that the trigger has been executed
- Verify data exists in the source

### Expression not working?
- Use `{{ $json.fieldName }}` format
- Field names are case-sensitive
- Test with the Expression Editor
