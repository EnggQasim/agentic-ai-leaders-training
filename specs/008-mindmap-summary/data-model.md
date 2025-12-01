# Data Model: Mind Map & Summary Feature

**Feature**: 008-mindmap-summary
**Date**: 2025-11-30

## Entity Definitions

### Summary

AI-generated chapter summary for quick review.

```typescript
interface Summary {
  chapter_id: string;           // e.g., "intro", "module-1-ros2-nodes"
  title: string;                // Chapter title
  key_points: string[];         // 3-5 bullet points
  main_concepts: Concept[];     // Key concepts with definitions
  takeaways: string[];          // Learning takeaways
  word_count: number;           // Summary word count (200-400)
  generated_at: string;         // ISO timestamp
  content_hash: string;         // Hash of source content (for cache invalidation)
}

interface Concept {
  term: string;                 // Concept name
  definition: string;           // Brief definition (1-2 sentences)
}
```

**Validation Rules**:
- `key_points`: 3-5 items, each 10-50 words
- `main_concepts`: 3-6 items
- `takeaways`: 2-4 items
- `word_count`: 200-400 words total

---

### MindMap

Structured representation of chapter concepts and relationships.

```typescript
interface MindMap {
  chapter_id: string;           // e.g., "intro"
  title: string;                // Chapter title
  central_topic: MindMapNode;   // Root node
  nodes: MindMapNode[];         // All nodes (flat list)
  edges: MindMapEdge[];         // Connections between nodes
  node_count: number;           // Total node count
  max_depth: number;            // Maximum hierarchy depth
  generated_at: string;         // ISO timestamp
  content_hash: string;         // Hash of source content
}
```

**Validation Rules**:
- `node_count`: 5-25 nodes
- `max_depth`: 1-3 levels

---

### MindMapNode

Individual concept in the mind map.

```typescript
interface MindMapNode {
  id: string;                   // Unique identifier (e.g., "node_1")
  label: string;                // Display text (2-5 words)
  description: string;          // Tooltip text (1-2 sentences)
  level: number;                // Hierarchy level (0=central, 1=primary, 2=secondary)
  parent_id: string | null;     // Parent node ID (null for central)
  content_anchor?: string;      // Optional: section ID to link to in chapter
  position?: {                  // Calculated by layout algorithm
    x: number;
    y: number;
  };
}
```

**Validation Rules**:
- `label`: 2-30 characters
- `description`: 10-200 characters
- `level`: 0, 1, or 2

---

### MindMapEdge

Connection between two nodes.

```typescript
interface MindMapEdge {
  id: string;                   // Unique identifier
  source: string;               // Source node ID
  target: string;               // Target node ID
  label?: string;               // Optional relationship label
  type: 'default' | 'dashed';   // Edge style
}
```

---

## Cache Structure

File: `backend/mindmap/cache.json`

```json
{
  "version": "1.0",
  "summaries": {
    "<cache_key>": {
      "chapter_id": "intro",
      "summary": { /* Summary object */ },
      "generated_at": "2025-11-30T12:00:00Z",
      "content_hash": "abc123..."
    }
  },
  "mindmaps": {
    "<cache_key>": {
      "chapter_id": "intro",
      "mindmap": { /* MindMap object */ },
      "generated_at": "2025-11-30T12:00:00Z",
      "content_hash": "abc123..."
    }
  }
}
```

**Cache Key Generation**:
```python
cache_key = hashlib.md5(f"{chapter_id}:{content[:500]}".encode()).hexdigest()[:12]
```

---

## API Request/Response Models

### SummaryRequest

```typescript
interface SummaryRequest {
  chapter_id: string;           // Required
  chapter_content: string;      // Required: Full chapter text
  chapter_title: string;        // Required
  force_regenerate?: boolean;   // Default: false
}
```

### SummaryResponse

```typescript
interface SummaryResponse {
  success: boolean;
  summary?: Summary;
  cached: boolean;
  error?: string;
}
```

### MindMapRequest

```typescript
interface MindMapRequest {
  chapter_id: string;           // Required
  chapter_content: string;      // Required: Full chapter text
  chapter_title: string;        // Required
  force_regenerate?: boolean;   // Default: false
}
```

### MindMapResponse

```typescript
interface MindMapResponse {
  success: boolean;
  mindmap?: MindMap;
  cached: boolean;
  error?: string;
}
```

### ChapterInfoResponse

Combined summary + mindmap status for a chapter.

```typescript
interface ChapterInfoResponse {
  chapter_id: string;
  has_summary: boolean;
  has_mindmap: boolean;
  summary?: Summary;
  mindmap?: MindMap;
}
```

---

## State Transitions

### Summary Generation

```
[No Summary] --generate_summary()--> [Generating] --success--> [Cached]
                                        |
                                        +--error--> [Error]

[Cached] --force_regenerate--> [Generating] --success--> [Cached (new)]
```

### Mind Map Generation

```
[No MindMap] --generate_mindmap()--> [Generating] --success--> [Cached]
                                        |
                                        +--error--> [Error]

[Cached] --force_regenerate--> [Generating] --success--> [Cached (new)]
```

---

## React Flow Integration

### Node Data for React Flow

```typescript
// Convert MindMapNode to React Flow node
const reactFlowNode = {
  id: node.id,
  type: 'mindmapNode',  // Custom node type
  data: {
    label: node.label,
    description: node.description,
    level: node.level,
    contentAnchor: node.content_anchor
  },
  position: node.position || { x: 0, y: 0 }
};
```

### Edge Data for React Flow

```typescript
// Convert MindMapEdge to React Flow edge
const reactFlowEdge = {
  id: edge.id,
  source: edge.source,
  target: edge.target,
  label: edge.label,
  type: edge.type === 'dashed' ? 'step' : 'smoothstep',
  animated: false
};
```

---

## Example Data

### Example Summary

```json
{
  "chapter_id": "intro",
  "title": "Introduction to Physical AI",
  "key_points": [
    "Physical AI combines artificial intelligence with real-world robotics",
    "Humanoid robots require integration of perception, planning, and control",
    "ROS2 is the standard framework for robot software development",
    "Simulation environments allow safe testing before hardware deployment"
  ],
  "main_concepts": [
    {
      "term": "Physical AI",
      "definition": "AI systems that interact with the physical world through sensors and actuators"
    },
    {
      "term": "Humanoid Robotics",
      "definition": "Robots designed with human-like form and capabilities"
    },
    {
      "term": "ROS2",
      "definition": "Robot Operating System 2, a middleware for robot software development"
    }
  ],
  "takeaways": [
    "Understanding Physical AI is essential for building autonomous robots",
    "This textbook covers the full stack from simulation to deployment"
  ],
  "word_count": 287,
  "generated_at": "2025-11-30T12:00:00Z"
}
```

### Example MindMap

```json
{
  "chapter_id": "intro",
  "title": "Introduction to Physical AI",
  "central_topic": {
    "id": "central",
    "label": "Physical AI",
    "description": "AI systems that interact with the physical world",
    "level": 0,
    "parent_id": null
  },
  "nodes": [
    {
      "id": "node_1",
      "label": "Perception",
      "description": "Sensing the environment through cameras and sensors",
      "level": 1,
      "parent_id": "central"
    },
    {
      "id": "node_2",
      "label": "Planning",
      "description": "Deciding actions based on goals and environment",
      "level": 1,
      "parent_id": "central"
    },
    {
      "id": "node_1_1",
      "label": "Computer Vision",
      "description": "Processing camera images to understand the scene",
      "level": 2,
      "parent_id": "node_1"
    }
  ],
  "edges": [
    { "id": "e1", "source": "central", "target": "node_1" },
    { "id": "e2", "source": "central", "target": "node_2" },
    { "id": "e3", "source": "node_1", "target": "node_1_1" }
  ],
  "node_count": 4,
  "max_depth": 2,
  "generated_at": "2025-11-30T12:00:00Z"
}
```
