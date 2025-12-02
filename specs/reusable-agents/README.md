# Reusable Intelligence Agents

**Version**: 1.0.0
**Created**: 2025-12-02
**Source**: Physical AI Robotics Textbook Project

## Overview

This directory contains production-ready specifications for reusable AI agents extracted from the Physical AI Textbook project. These agents can be composed, customized, and deployed across different domains and use cases.

## Agent Catalog

| Agent | Purpose | Framework Support |
|-------|---------|-------------------|
| [Educational Content Agent](./educational-content-agent.md) | Diagrams, GIFs, summaries, mind maps | Claude SDK, LangChain, CrewAI |
| [Multimodal RAG Agent](./multimodal-rag-agent.md) | Text + image search, Q&A with citations | Claude SDK, LangChain, CrewAI |
| [SDD Planning Agent](./sdd-planning-agent.md) | Specs, plans, tasks, ADRs, PHRs | Claude SDK, LangChain, CrewAI |

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                   ORCHESTRATOR AGENT                      │
│         (Routes requests to specialized agents)           │
│                                                          │
│  Capabilities:                                           │
│  • Request classification                                │
│  • Agent selection & coordination                        │
│  • Result aggregation                                    │
│  • Error handling & fallbacks                           │
└─────────────────────────┬────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  Educational  │ │  Multimodal   │ │     SDD       │
│   Content     │ │     RAG       │ │   Planning    │
│    Agent      │ │    Agent      │ │    Agent      │
├───────────────┤ ├───────────────┤ ├───────────────┤
│ • Diagrams    │ │ • Text search │ │ • Spec writer │
│ • GIFs        │ │ • Image search│ │ • Task gen    │
│ • Summaries   │ │ • Q&A + cite  │ │ • ADR/PHR     │
│ • Mind maps   │ │ • Context mgmt│ │ • Workflows   │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
              ┌───────────────────────┐
              │   Shared Services     │
              │ • Vector DB (Qdrant)  │
              │ • LLM APIs (OpenAI)   │
              │ • Image Gen (Gemini)  │
              │ • Storage (S3/HF)     │
              │ • Cache (Redis/File)  │
              └───────────────────────┘
```

## Quick Start

### 1. Choose Your Framework

| Framework | Best For | Learning Curve |
|-----------|----------|----------------|
| **Claude Agent SDK** | Production agents, complex workflows | Medium |
| **LangChain/LangGraph** | Flexible, modular systems | Steep |
| **CrewAI** | Role-based agent teams | Easy |
| **AutoGen** | Multi-agent conversations | Medium |

### 2. Select Agents

Based on your use case:

| Use Case | Recommended Agents |
|----------|-------------------|
| **Educational Platform** | Educational Content + Multimodal RAG |
| **Documentation Site** | Multimodal RAG + SDD Planning |
| **Development Tool** | SDD Planning |
| **Knowledge Base** | Multimodal RAG |
| **Content Creation** | Educational Content |

### 3. Configure Domain

Each agent supports domain customization:

```yaml
# Example: Medical Education Domain
domain:
  name: medical_education
  topics: [Anatomy, Physiology, Pharmacology]
  color_primary: "#e91e63"  # Medical pink
  terminology: medical_terms.json
  content_restrictions:
    - Require citations for medical claims
    - Include disclaimer for medical advice
```

## Framework Integration Examples

### Claude Agent SDK

```typescript
import { Agent, Orchestrator } from '@anthropic-ai/claude-agent-sdk';

// Create specialized agents
const educationalAgent = new Agent({ ... });
const ragAgent = new Agent({ ... });
const planningAgent = new Agent({ ... });

// Create orchestrator
const orchestrator = new Orchestrator({
  agents: [educationalAgent, ragAgent, planningAgent],
  routingStrategy: 'intent-based'
});

// Process request
const result = await orchestrator.process(userRequest);
```

### LangChain

```python
from langchain.agents import AgentExecutor, create_openai_tools_agent

# Create agent executors
educational_executor = AgentExecutor(agent=educational_agent, tools=edu_tools)
rag_executor = AgentExecutor(agent=rag_agent, tools=rag_tools)
planning_executor = AgentExecutor(agent=planning_agent, tools=plan_tools)

# Router chain
router = RouterChain(
    chains={
        "educational": educational_executor,
        "question": rag_executor,
        "planning": planning_executor
    }
)
```

### CrewAI

```python
from crewai import Agent, Task, Crew

# Define agents
content_creator = Agent(role="Educational Content Creator", ...)
researcher = Agent(role="Knowledge Researcher", ...)
planner = Agent(role="Development Planner", ...)

# Create crew
knowledge_crew = Crew(
    agents=[content_creator, researcher, planner],
    tasks=[...],
    process="hierarchical"  # Orchestrated by manager
)
```

## Shared Services Configuration

### Vector Database (Qdrant)

```yaml
qdrant:
  url: "https://your-cluster.qdrant.io"
  api_key: "${QDRANT_API_KEY}"
  collections:
    - name: knowledge_base
      vectors:
        text: { size: 1536, distance: Cosine }
        image: { size: 512, distance: Cosine }
```

### LLM APIs

```yaml
llm:
  openai:
    api_key: "${OPENAI_API_KEY}"
    models:
      embedding: text-embedding-3-small
      chat: gpt-4o-mini
      completion: gpt-4o

  anthropic:
    api_key: "${ANTHROPIC_API_KEY}"
    models:
      chat: claude-sonnet-4-20250514

  google:
    api_key: "${GEMINI_API_KEY}"
    models:
      vision: gemini-pro-vision
      image: imagen-3
```

### Storage

```yaml
storage:
  provider: huggingface_spaces  # or s3, cloudflare_r2
  bucket: your-space-name
  paths:
    diagrams: /generated/diagrams/
    audio: /generated/audio/
    cache: /cache/
```

## Cost Estimation

### Per 1,000 Operations

| Operation | Cost |
|-----------|------|
| Text embedding | $0.02 |
| Chat completion (500 tokens) | $0.08 |
| Image generation | $0.10 |
| Vector search | $0.001 |
| Audio generation (1 min) | $0.05 |

### Monthly Estimates

| Usage Tier | Operations | Estimated Cost |
|------------|------------|----------------|
| Small | 10K | ~$100 |
| Medium | 100K | ~$1,000 |
| Large | 1M | ~$10,000 |

## Best Practices

### 1. Start Simple
- Begin with single agent
- Add complexity as needed
- Test thoroughly at each stage

### 2. Cache Aggressively
- Cache embeddings
- Cache generated content
- Use CDN for static assets

### 3. Monitor & Iterate
- Track success metrics
- Collect user feedback
- Iterate on prompts

### 4. Security
- Never expose API keys
- Validate user input
- Rate limit requests
- Log for audit

## Research References

1. [Claude Agent SDK Documentation](https://docs.claude.com/en/api/agent-sdk/overview)
2. [Building Agents with Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
3. [LangChain Documentation](https://python.langchain.com/docs/)
4. [CrewAI Documentation](https://docs.crewai.com/)
5. [AutoGen Framework](https://microsoft.github.io/autogen/)
6. [Comparing AI Agent Frameworks](https://www.datacamp.com/tutorial/crewai-vs-langgraph-vs-autogen)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-02 | Initial release from Physical AI Textbook project |

---

*Generated from the Physical AI Robotics Textbook project experience. These agents are production-tested and ready for customization.*
