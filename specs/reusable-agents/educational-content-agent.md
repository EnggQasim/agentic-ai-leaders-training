# Agent Specification: Educational Content Generator Agent

**Version**: 1.0.0
**Created**: 2025-12-02
**Status**: Production-Ready Specification
**Source**: Physical AI Textbook Project Experience

## Overview

An AI agent specialized in generating pedagogically-sound educational content including diagrams, animated GIFs, mind maps, and summaries. Built on research-based best practices from Graphics for Learning, Educational Voice, and cognitive load theory.

## Agent Identity

```yaml
name: educational-content-agent
type: specialized
framework: claude-agent-sdk  # or langchain/crewai
role: Educational Content Generator
goal: Transform complex concepts into visual and textual learning materials
backstory: |
  Expert in instructional design, visual learning theory, and educational
  psychology. Skilled at creating diagrams, animations, and summaries that
  maximize learning retention and comprehension.
```

## Core Capabilities

### 1. Diagram Generation

| Diagram Type | Description | Best Use Cases |
|--------------|-------------|----------------|
| **Concept Map** | Shows relationships between interconnected ideas | Understanding relationships, big picture view |
| **Flowchart** | Sequential process with decision points | Processes, algorithms, troubleshooting |
| **Mind Map** | Hierarchical branching from central concept | Topic overview, note-taking, organizing |
| **Architecture** | Layered system components | System design, software architecture |
| **Sequence** | Time-ordered interactions | Communication protocols, API calls |
| **Comparison** | Side-by-side feature comparison | Choosing between options |
| **Tree** | Hierarchical parent-child relationships | Classification, organizational structure |
| **Cycle** | Circular/iterative processes | Feedback loops, life cycles |

### 2. Animated GIF Generation

**Research-Based Parameters:**
- Duration: 10-20 seconds total
- Steps: 4-6 maximum (cognitive load limit)
- Timing: 2-2.5 seconds per step
- Visual hierarchy: Highlight active elements

**Animation Types:**
- `sequence_animation`: Linear step-by-step process
- `cycle_animation`: Circular/repeating process
- `request_response`: Two-way communication
- `multimodal_flow`: Multiple inputs converging
- `pipeline_animation`: Data transformation stages

### 3. Summary Generation

- Length: 200-400 words
- Structure: Key points, main concepts, takeaways
- Format: Bulleted lists with hierarchy
- Caching: Store for instant retrieval

### 4. Mind Map Generation

- Central node: Main topic
- Levels: 2-3 hierarchy levels
- Nodes: 5-15 concepts per map
- Interactivity: Zoom, pan, expand/collapse

## Design Guidelines (Research-Based)

```python
DESIGN_GUIDELINES = {
    "visual_hierarchy": "Animate/highlight primary elements first, supporting details second",
    "color_scheme": {
        "primary": "#76b900",      # Green - main concepts, success
        "secondary": "#4285f4",    # Blue - processes, actions
        "accent": "#ff9800",       # Orange - highlights, warnings
        "success": "#4caf50",      # Green - completed states
        "info": "#2196f3",         # Light blue - informational
        "neutral": "#757575"       # Gray - supporting elements
    },
    "animation_timing": {
        "step_duration_ms": 2500,  # Per step (10-20 sec total)
        "transition_ms": 300,       # Between steps
        "max_steps": 8              # Maximum for comprehension
    },
    "accessibility": {
        "min_contrast_ratio": 4.5,
        "font_size_min": 14,
        "clear_labels": True,
        "alt_text": "required"
    },
    "chunking": {
        "max_concepts_per_diagram": 8,
        "max_words_per_label": 5,
        "max_nesting_levels": 3
    }
}
```

## Tools & Integrations

### Required Tools

```yaml
tools:
  - name: gemini_image_generator
    description: Generate diagrams using Google Gemini
    provider: google
    model: gemini-pro-vision / imagen-3

  - name: pillow_gif_creator
    description: Create animated GIFs from frames
    provider: local
    library: PIL/Pillow

  - name: openai_text_generator
    description: Generate summaries and mind map structures
    provider: openai
    model: gpt-4o-mini

  - name: d3_visualizer
    description: Client-side mind map rendering
    provider: frontend
    library: d3.js / react-d3-tree

  - name: cache_manager
    description: Store and retrieve generated content
    provider: local
    storage: file_system / redis
```

### API Endpoints

```yaml
endpoints:
  - POST /diagram/generate
    input: { concept: string, custom_prompt?: string, force_regenerate?: boolean }
    output: { success: boolean, url: string, title: string, cached: boolean }

  - GET /diagram/predefined
    output: PredefinedDiagram[]

  - GET /diagram/types
    output: DiagramTypeInfo[]

  - POST /gif/generate
    input: { workflow: string, custom_steps?: string[], force_regenerate?: boolean }
    output: { success: boolean, frames: GifFrame[], step_count: number }

  - POST /summary/generate
    input: { content: string, chapter_id: string }
    output: { success: boolean, summary: string, key_points: string[] }

  - POST /mindmap/generate
    input: { content: string, chapter_id: string }
    output: { success: boolean, nodes: MindMapNode[], edges: Edge[] }
```

## Memory & State

```yaml
memory_type: structured
memory_schema:
  - cache_key: string (md5 hash of prompt)
  - generated_content:
      url: string
      title: string
      chapter: string
      section: string
      created_at: timestamp
  - user_feedback:
      helpful: boolean
      regenerate_count: number

persistence:
  - file_system: /generated/diagrams/, /generated/gifs/
  - cache_metadata: cache.json
  - expiry: never (content is static)
```

## Prompting Strategy

### Diagram Generation Prompt Template

```
Create an educational {DIAGRAM_TYPE} diagram showing {CONCEPT}.

Requirements:
1. Visual Style:
   - Clean white background
   - Color scheme: Primary {primary_color}, Secondary {secondary_color}
   - Font size minimum 14px
   - Professional technical style

2. Content Structure:
   - Central/main element: {MAIN_CONCEPT}
   - Connected elements: {SUB_CONCEPTS}
   - Relationships: {RELATIONSHIPS}
   - Max {MAX_ELEMENTS} elements for clarity

3. Educational Best Practices:
   - Clear visual hierarchy
   - Labeled connections/arrows
   - Consistent iconography
   - Accessibility compliant

Learning Objective: {LEARNING_OBJECTIVE}
```

### GIF Animation Prompt Template

```
Create step {STEP_NUMBER} of {TOTAL_STEPS} for {WORKFLOW_NAME} animation.

Current Step: {STEP_DESCRIPTION}

Visual Requirements:
- Highlight active component in {ACTIVE_COLOR}
- Dim inactive components in {INACTIVE_COLOR}
- Show step indicator "{STEP_NUMBER}/{TOTAL_STEPS}" in corner
- Include {HIGHLIGHT_INSTRUCTIONS}

Previous Steps Context: {PREVIOUS_STEPS_SUMMARY}
```

## Quality Assurance

### Validation Rules

```python
VALIDATION_RULES = {
    "diagram": {
        "min_resolution": (800, 600),
        "max_file_size_kb": 500,
        "required_fields": ["url", "title", "alt_text"],
        "concept_accuracy": "manual_review"
    },
    "gif": {
        "max_file_size_mb": 5,
        "min_steps": 3,
        "max_steps": 8,
        "duration_range_seconds": (10, 20)
    },
    "summary": {
        "word_count_range": (200, 400),
        "required_sections": ["key_points", "main_concepts", "takeaways"],
        "readability_score": "grade_8_or_below"
    },
    "mindmap": {
        "min_nodes": 5,
        "max_nodes": 15,
        "max_depth": 3,
        "required_fields": ["id", "label", "description"]
    }
}
```

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Diagram accuracy | 80%+ | Manual review of concept representation |
| Generation time (diagram) | < 15 seconds | API response time |
| Generation time (GIF) | < 30 seconds | API response time |
| Cache hit rate | > 70% | Requests served from cache |
| User satisfaction | 90%+ | Helpful/not helpful feedback |
| Accessibility compliance | 100% | WCAG 2.1 AA |

## Error Handling

```python
ERROR_RESPONSES = {
    "api_unavailable": "Diagram service temporarily unavailable. Please try again.",
    "generation_failed": "Couldn't generate diagram. Try a different description.",
    "unsupported_topic": "Can only create diagrams about [DOMAIN] topics.",
    "too_complex": "Concept too complex for single diagram. Creating series...",
    "rate_limited": "Generation limit reached. Pre-generated content still available."
}
```

## Reusability Configuration

### Domain Customization

```yaml
domain_config:
  robotics:
    concepts: [ROS2, Gazebo, SLAM, URDF, Isaac]
    color_primary: "#76b900"  # NVIDIA green

  web_development:
    concepts: [React, Node.js, APIs, Databases]
    color_primary: "#61dafb"  # React blue

  data_science:
    concepts: [ML, Neural Networks, Data Pipeline]
    color_primary: "#ff6f00"  # TensorFlow orange

  biology:
    concepts: [Cells, DNA, Ecosystems]
    color_primary: "#4caf50"  # Nature green
```

### Integration Examples

**LangChain Integration:**
```python
from langchain.agents import Tool
from langchain.agents import AgentExecutor

educational_tools = [
    Tool(
        name="generate_diagram",
        func=diagram_service.generate_diagram,
        description="Generate educational diagram for a concept"
    ),
    Tool(
        name="generate_summary",
        func=summary_service.generate_summary,
        description="Generate concise summary of content"
    )
]
```

**CrewAI Integration:**
```python
from crewai import Agent, Task

educational_agent = Agent(
    role="Educational Content Creator",
    goal="Create visual learning materials",
    tools=[DiagramTool(), GifTool(), SummaryTool()],
    verbose=True
)
```

**Claude Agent SDK Integration:**
```typescript
import { Agent } from '@anthropic-ai/claude-agent-sdk';

const educationalAgent = new Agent({
  name: 'educational-content-agent',
  tools: [
    { name: 'generate_diagram', ... },
    { name: 'generate_gif', ... }
  ],
  systemPrompt: EDUCATIONAL_SYSTEM_PROMPT
});
```

## Research References

1. **Graphics for Learning** (Ruth Clark & Chopeta Lyons) - Visual design principles
2. **Visible Learning** (John Hattie) - Effect sizes for educational interventions
3. **Educational Voice** - Animated infographics guidelines (10-20 seconds)
4. **UAF Center for Teaching and Learning** - GIF guidelines for education
5. **Cognitive Load Theory** (Sweller) - Chunking and visual hierarchy

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-02 | Initial specification from Physical AI Textbook project |
