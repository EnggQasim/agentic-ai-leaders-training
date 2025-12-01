# Research: Mind Map & Summary Feature

**Feature**: 008-mindmap-summary
**Date**: 2025-11-30
**Status**: Complete

## Research Tasks

### 1. Mind Map Visualization Library Selection

**Question**: Which JavaScript library is best for interactive mind map visualization in React?

**Options Evaluated**:

| Library | Bundle Size | React Support | Features | Learning Curve |
|---------|-------------|---------------|----------|----------------|
| React Flow | 45KB | Native | Zoom, pan, tooltips, custom nodes | Low |
| D3.js | 250KB | Wrapper needed | Full control, animations | High |
| vis-network | 180KB | Wrapper needed | Force layout, physics | Medium |
| GoJS | Commercial | Good | Enterprise features | Medium |
| Mermaid | 1MB+ | Markdown | Static diagrams only | Low |

**Decision**: **React Flow**

**Rationale**:
- Native React component library (no wrappers needed)
- Small bundle size (45KB gzipped)
- Built-in zoom, pan, minimap, controls
- Custom node rendering with React components
- Active maintenance and good documentation
- MIT license (free for commercial use)
- Used by major companies (Stripe, Datadog)

**Alternatives Rejected**:
- D3.js: Powerful but requires significant custom code, larger bundle
- vis-network: Physics-based layout not ideal for hierarchical mind maps
- Mermaid: Static only, doesn't support interactive features

---

### 2. AI Summary Generation Approach

**Question**: How to generate high-quality, structured summaries from chapter content?

**Approaches Evaluated**:

1. **Single-shot GPT prompt**: One API call with full content
2. **Extract-then-summarize**: First extract key concepts, then summarize
3. **Chunked summarization**: Split content, summarize chunks, merge

**Decision**: **Single-shot GPT prompt with structured output**

**Rationale**:
- Chapter content fits within GPT-4o-mini context window (128K tokens)
- Structured JSON output ensures consistent format
- Simpler implementation than multi-step approaches
- Lower latency (single API call)
- OpenAI already used in project (no new dependencies)

**Prompt Template**:
```
Summarize this chapter content into a structured format:
- 3-5 key points (bullet points)
- Main concepts (with brief definitions)
- Key takeaways for learners

Output as JSON with fields: key_points[], main_concepts[], takeaways[]
```

---

### 3. Mind Map Structure Generation

**Question**: How to extract concept relationships from text for mind map nodes?

**Decision**: **AI-generated JSON structure**

**Rationale**:
- AI can understand semantic relationships (not just keyword extraction)
- Hierarchical structure matches mind map layout
- Can identify main topic, subtopics, and details

**Prompt Template**:
```
Analyze this chapter and create a mind map structure:
- Central topic (chapter main theme)
- 4-6 primary nodes (main concepts)
- 2-3 child nodes per primary (details/examples)

Output as JSON with fields:
- central: { label, description }
- nodes: [{ id, label, description, parent_id, level }]
```

**Node Limits**:
- Maximum 25 nodes per mind map (performance)
- Maximum 3 levels of hierarchy (readability)
- Minimum 5 nodes (meaningful content)

---

### 4. Caching Strategy

**Question**: How to cache generated summaries and mind maps?

**Decision**: **JSON file cache (following existing podcast pattern)**

**Rationale**:
- Consistent with existing diagram/podcast caching
- No additional infrastructure needed
- Survives server restarts
- Easy to debug and manage

**Cache Key**: MD5 hash of `chapter_id + content_hash[:500]`

**Cache Structure**:
```json
{
  "summaries": {
    "cache_key": {
      "chapter_id": "intro",
      "summary": {...},
      "generated_at": "2025-11-30T12:00:00Z"
    }
  },
  "mindmaps": {
    "cache_key": {
      "chapter_id": "intro",
      "mindmap": {...},
      "generated_at": "2025-11-30T12:00:00Z"
    }
  }
}
```

---

### 5. Export to PNG

**Question**: How to export interactive mind map as image?

**Options Evaluated**:
1. html-to-image library (client-side)
2. Server-side rendering with Puppeteer
3. React Flow's built-in export

**Decision**: **html-to-image library (client-side)**

**Rationale**:
- No server resources needed
- Instant export (no API call)
- Preserves exact visual state
- Small library (~10KB)

**Implementation**:
```typescript
import { toPng } from 'html-to-image';

const exportPng = async (nodeRef) => {
  const dataUrl = await toPng(nodeRef.current);
  // Trigger download
};
```

---

### 6. React Flow Layout Algorithm

**Question**: How to automatically position mind map nodes?

**Decision**: **Dagre layout algorithm (hierarchical)**

**Rationale**:
- Dagre specializes in directed graphs (perfect for mind maps)
- Top-to-bottom or left-to-right layouts
- Handles any node/edge count
- React Flow has dagre integration examples

**Layout Configuration**:
```typescript
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: 'TB' }); // Top to Bottom
```

---

## Best Practices Applied

### From Existing Codebase

1. **Service Pattern**: Follow `services/podcast.py` structure
   - Singleton service instance
   - Cache management methods
   - Async generation methods

2. **Router Pattern**: Follow `routers/diagram.py` structure
   - Pydantic request/response models
   - Clear endpoint documentation
   - Error handling with HTTPException

3. **Component Pattern**: Follow `PodcastPlayer` structure
   - Loading states with spinner
   - Error states with retry
   - API_URL configuration for dev/prod

### Performance Optimizations

1. **Lazy Loading**: Only fetch summary/mindmap when tab is clicked
2. **Cache-First**: Always check cache before generation
3. **Debounce**: Prevent rapid API calls on tab switching
4. **Progressive Loading**: Show skeleton while loading

---

## Unresolved Questions

None - all technical decisions made with reasonable defaults.

---

## References

- [React Flow Documentation](https://reactflow.dev/)
- [Dagre Layout Algorithm](https://github.com/dagrejs/dagre)
- [html-to-image](https://github.com/bubkoo/html-to-image)
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
