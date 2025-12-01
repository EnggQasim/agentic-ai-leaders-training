# Implementation Plan: Mind Map & Summary Tabs

**Branch**: `008-mindmap-summary` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-mindmap-summary/spec.md`

## Summary

Add two AI-powered learning enhancement features to each textbook chapter page:
1. **Summary Tab**: AI-generated concise summaries (200-400 words) for quick review
2. **Mind Map Tab**: Interactive visual concept maps showing topic relationships (inspired by Google NotebookLM)

Technical approach: Leverage existing OpenAI integration for content generation, add new FastAPI endpoints following established patterns (similar to diagram/podcast), create React components with D3.js/React Flow for mind map visualization.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI, OpenAI API, React 18, React Flow (mind map visualization)
**Storage**: JSON file-based caching (following existing podcast/diagram pattern)
**Testing**: pytest (backend), manual testing (frontend - existing pattern)
**Target Platform**: Web browser (GitHub Pages frontend + HuggingFace Spaces backend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**:
- Summary: 3s cached, 10s generation
- Mind Map: 5s cached, 15s generation
**Constraints**:
- OpenAI API rate limits
- HuggingFace Spaces free tier resources
**Scale/Scope**: ~15 chapters, ~100 concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Deadline-First | ✅ PASS | Feature is P3 bonus, won't block required features |
| II. Content-Before-Enhancement | ✅ PASS | Book content exists (4+ chapters), feature enhances existing |
| III. Testable Criteria | ✅ PASS | Spec has measurable acceptance criteria (time, quality metrics) |
| IV. Grounded AI Responses | ✅ PASS | Summaries/maps derived from chapter content only |
| V. Accessibility-First | ✅ PASS | Mind map will be keyboard navigable, alt text for export |
| VI. Security Boundaries | ✅ PASS | Uses existing API key patterns, no new secrets |
| VII. Spec-Driven Development | ✅ PASS | Spec completed before planning |
| VIII. Visual Learning | ✅ PASS | Mind maps align with visual learning principle |

**Gate Status**: PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/008-mindmap-summary/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI specs)
│   └── mindmap-api.yaml
└── tasks.md             # Phase 2 output (/sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── services/
│   │   └── mindmap.py          # NEW: Mind map & summary generation service
│   └── routers/
│       └── mindmap.py          # NEW: API endpoints for summary & mind map

frontend/
├── src/
│   ├── components/
│   │   ├── SummaryPanel/       # NEW: Summary display component
│   │   │   ├── index.tsx
│   │   │   └── styles.module.css
│   │   └── MindMapViewer/      # NEW: Interactive mind map component
│   │       ├── index.tsx
│   │       └── styles.module.css
│   └── theme/
│       └── DocItem/            # MODIFY: Add tabs to doc pages
│           └── Layout/
│               └── index.tsx   # Wrap with summary/mindmap tabs
```

**Structure Decision**: Web application pattern matching existing feature implementations (diagram, podcast). New service + router pair for backend, new component pair for frontend.

## Complexity Tracking

No violations - design follows established patterns with minimal new dependencies.

---

## Phase 0: Research (Completed)

See [research.md](./research.md) for detailed findings.

**Key Decisions**:
1. **Mind Map Visualization**: React Flow library (lightweight, React-native, good performance)
2. **AI Generation**: OpenAI GPT-4o-mini for both summary and mind map structure
3. **Caching Strategy**: JSON file cache following existing podcast pattern
4. **Export Format**: HTML Canvas to PNG using html-to-image library

---

## Phase 1: Design (Completed)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ SummaryPanel │  │ MindMapViewer │  │ DocItem Layout (tabs) │ │
│  └──────┬──────┘  └───────┬──────┘  └───────────┬────────────┘ │
│         │                 │                      │               │
│         └─────────────────┴──────────────────────┘               │
│                           │                                      │
│                    REST API Calls                                │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│                         Backend API                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    /api/mindmap                              │  │
│  │  POST /summary      - Generate chapter summary              │  │
│  │  POST /mindmap      - Generate mind map structure           │  │
│  │  GET  /chapter/{id} - Get cached summary + mind map         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                    ┌──────┴──────┐                               │
│                    │MindMapService│                              │
│                    └──────┬──────┘                               │
│                           │                                      │
│              ┌────────────┴────────────┐                        │
│              ▼                         ▼                        │
│       ┌──────────┐              ┌──────────┐                    │
│       │ OpenAI   │              │ Cache    │                    │
│       │ GPT-4o   │              │ (JSON)   │                    │
│       └──────────┘              └──────────┘                    │
└───────────────────────────────────────────────────────────────────┘
```

### API Contracts

See [contracts/mindmap-api.yaml](./contracts/mindmap-api.yaml) for OpenAPI specification.

### Data Model

See [data-model.md](./data-model.md) for entity definitions.

### Integration Points

1. **Doc Pages**: Modify `DocItem/Layout` to add Summary/Mind Map tabs alongside existing content
2. **API Registration**: Add mindmap router to FastAPI main.py
3. **HuggingFace Deployment**: Upload new service and router files

---

## Implementation Phases

### Phase A: Backend Service (P1)
1. Create `backend/app/services/mindmap.py` with:
   - `generate_summary()` - AI summary generation
   - `generate_mindmap()` - AI mind map structure generation
   - JSON file caching (following podcast pattern)
2. Create `backend/app/routers/mindmap.py` with endpoints
3. Register router in `main.py`

### Phase B: Frontend Components (P1-P2)
1. Create `SummaryPanel` component
   - Fetch and display formatted summary
   - Loading and error states
2. Create `MindMapViewer` component
   - React Flow integration for visualization
   - Node tooltips, zoom/pan controls
   - Export to PNG functionality

### Phase C: Doc Page Integration (P2)
1. Modify DocItem Layout to add tab navigation
2. Integrate Summary and MindMap components
3. Handle tab state and lazy loading

### Phase D: Polish & Deployment (P3-P4)
1. Add mind map navigation to content sections
2. Theme support (light/dark)
3. Deploy to HuggingFace
4. Test and iterate

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI rate limits | Medium | Aggressive caching, generation queuing |
| Mind map rendering performance | Medium | Virtualization for large maps, limit node count |
| Complex content parsing | Low | Use AI to extract concepts, not regex |
| Tab integration conflicts | Low | Follow existing PodcastPlayer pattern |

---

## Next Steps

Run `/sp.tasks` to generate detailed task breakdown with test cases.
