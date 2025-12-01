# Quickstart: Mind Map & Summary Feature

## Overview

This feature adds two AI-powered learning tools to each chapter page:
1. **Summary Tab**: Concise 200-400 word summaries with key points
2. **Mind Map Tab**: Interactive visual concept maps

## Prerequisites

- Node.js 18+ (frontend)
- Python 3.11+ (backend)
- OpenAI API key (existing in project)

## Backend Setup

### 1. Add New Service

Create `backend/app/services/mindmap.py`:

```python
from app.config import get_settings
import openai

class MindMapService:
    def __init__(self):
        settings = get_settings()
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.cache_dir = Path(__file__).parent.parent.parent / "mindmap"
        self.cache_dir.mkdir(exist_ok=True)

    async def generate_summary(self, chapter_id, content, title):
        # Check cache first
        # Generate with OpenAI if not cached
        # Cache result
        pass

    async def generate_mindmap(self, chapter_id, content, title):
        # Similar pattern
        pass
```

### 2. Add Router

Create `backend/app/routers/mindmap.py`:

```python
from fastapi import APIRouter
from app.services.mindmap import get_mindmap_service

router = APIRouter(prefix="/mindmap", tags=["mindmap"])

@router.post("/summary")
async def generate_summary(request: SummaryRequest):
    service = get_mindmap_service()
    return await service.generate_summary(...)

@router.post("/generate")
async def generate_mindmap(request: MindMapRequest):
    service = get_mindmap_service()
    return await service.generate_mindmap(...)
```

### 3. Register Router

In `backend/app/main.py`:

```python
from app.routers import mindmap

app.include_router(mindmap.router, prefix="/api")
```

## Frontend Setup

### 1. Install React Flow

```bash
cd frontend
npm install reactflow html-to-image dagre @types/dagre
```

### 2. Create Summary Component

Create `frontend/src/components/SummaryPanel/index.tsx`:

```tsx
export default function SummaryPanel({ chapterId, chapterContent }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/mindmap/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter_id: chapterId, chapter_content: chapterContent })
    });
    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  };

  return (
    <div className={styles.summaryPanel}>
      {loading ? <Spinner /> : <SummaryDisplay summary={summary} />}
    </div>
  );
}
```

### 3. Create Mind Map Component

Create `frontend/src/components/MindMapViewer/index.tsx`:

```tsx
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

export default function MindMapViewer({ chapterId, chapterContent }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Fetch and render mind map
  // Use dagre for layout
  // Add custom node types with tooltips

  return (
    <div style={{ height: '500px' }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
}
```

### 4. Add Tabs to Doc Pages

Modify DocItem Layout to add tab navigation:

```tsx
<Tabs>
  <TabItem value="content" label="Content" default>
    {/* Existing doc content */}
  </TabItem>
  <TabItem value="summary" label="Summary">
    <SummaryPanel chapterId={docId} chapterContent={content} />
  </TabItem>
  <TabItem value="mindmap" label="Mind Map">
    <MindMapViewer chapterId={docId} chapterContent={content} />
  </TabItem>
</Tabs>
```

## Testing

### Backend

```bash
# Start backend
cd backend
uvicorn app.main:app --reload

# Test summary endpoint
curl -X POST http://localhost:8000/api/mindmap/summary \
  -H "Content-Type: application/json" \
  -d '{"chapter_id":"test","chapter_content":"Test content...","chapter_title":"Test"}'
```

### Frontend

```bash
# Start frontend
cd frontend
npm start

# Navigate to any chapter and click Summary/Mind Map tabs
```

## Deployment

### HuggingFace Spaces

```bash
# Upload new backend files
huggingface-cli upload mqasim077/physical-ai-textbook-api \
  backend/app/services/mindmap.py app/services/mindmap.py \
  --repo-type space

huggingface-cli upload mqasim077/physical-ai-textbook-api \
  backend/app/routers/mindmap.py app/routers/mindmap.py \
  --repo-type space
```

### GitHub Pages

Frontend deploys automatically via GitHub Actions when pushed to master.

## Common Issues

### "Mind map not rendering"
- Ensure React Flow CSS is imported
- Check browser console for errors
- Verify API response has valid nodes/edges

### "Summary taking too long"
- Check OpenAI API status
- Verify API key is set in HuggingFace secrets
- Check cache directory permissions

### "Export not working"
- html-to-image requires DOM element ref
- Ensure mind map container has explicit dimensions
