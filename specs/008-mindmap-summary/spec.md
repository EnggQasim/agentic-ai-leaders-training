# Feature Specification: Mind Map & Summary Tabs

**Feature Branch**: `008-mindmap-summary`
**Created**: 2025-11-30
**Status**: Draft
**Input**: User description: "I want also add mind map feature like google 'notebooklm' and also add summary tab on each page"

## Overview

Add two new interactive learning features to each textbook page:
1. **Mind Map**: An AI-generated visual mind map showing key concepts and their relationships (inspired by Google NotebookLM)
2. **Summary Tab**: A concise summary of the page content for quick review

These features enhance the learning experience by providing multiple ways to understand and review educational content.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View AI-Generated Summary (Priority: P1)

As a student reading a chapter, I want to see a concise summary of the page content so I can quickly understand the main points before diving into details or review key takeaways after reading.

**Why this priority**: Summary is the most fundamental feature - it provides immediate value with minimal complexity. Users can quickly assess if a chapter is relevant and review key points.

**Independent Test**: Can be fully tested by clicking the "Summary" tab on any chapter page and verifying a coherent summary appears. Delivers standalone value for quick review.

**Acceptance Scenarios**:

1. **Given** a user is viewing any chapter page, **When** they click the "Summary" tab, **Then** they see a concise AI-generated summary of the page content within 3 seconds
2. **Given** the summary tab is open, **When** the user reads the summary, **Then** it contains the key concepts, main takeaways, and important terms from the chapter
3. **Given** a user has previously viewed a chapter's summary, **When** they return to the same chapter, **Then** the summary loads instantly from cache

---

### User Story 2 - View Interactive Mind Map (Priority: P2)

As a visual learner, I want to see an interactive mind map of the chapter concepts so I can understand how different topics relate to each other and navigate the content structure.

**Why this priority**: Mind maps provide significant value for visual learners and concept exploration, but require more complex generation and rendering. Builds on summary generation.

**Independent Test**: Can be fully tested by clicking the "Mind Map" tab on any chapter and verifying an interactive visualization appears showing concept relationships.

**Acceptance Scenarios**:

1. **Given** a user is viewing any chapter page, **When** they click the "Mind Map" tab, **Then** they see an AI-generated visual mind map of the chapter's key concepts
2. **Given** a mind map is displayed, **When** the user hovers over a node, **Then** they see a tooltip with a brief description of that concept
3. **Given** a mind map is displayed, **When** the user clicks on a node, **Then** the node expands to show sub-concepts or related details
4. **Given** a mind map is displayed, **When** the user zooms or pans, **Then** they can navigate large mind maps smoothly

---

### User Story 3 - Navigate from Mind Map to Content (Priority: P3)

As a learner exploring a mind map, I want to click on a concept and be taken to the relevant section of the chapter so I can learn more about specific topics that interest me.

**Why this priority**: Enhances mind map utility by creating navigation links, but requires content section mapping. Depends on User Story 2.

**Independent Test**: Can be tested by clicking a concept node in the mind map and verifying the page scrolls to the relevant section.

**Acceptance Scenarios**:

1. **Given** a mind map is displayed with clickable concepts, **When** the user double-clicks a concept node, **Then** the page scrolls to the section where that concept is discussed
2. **Given** a concept spans multiple sections, **When** the user double-clicks that concept node, **Then** they see a list of relevant sections to choose from

---

### User Story 4 - Export Mind Map (Priority: P4)

As a student preparing for exams, I want to export the mind map as an image so I can include it in my study notes or share with classmates.

**Why this priority**: Nice-to-have feature that adds polish. Core functionality works without it.

**Independent Test**: Can be tested by clicking export button and verifying a downloadable image file is generated.

**Acceptance Scenarios**:

1. **Given** a mind map is displayed, **When** the user clicks the "Export" button, **Then** they can download the mind map as a PNG image
2. **Given** a mind map is exported, **When** the user opens the downloaded file, **Then** it shows a high-quality rendering of the mind map with readable text

---

### Edge Cases

- What happens when chapter content is very short (< 100 words)? Display simplified summary and minimal mind map with available concepts.
- What happens when AI generation fails? Show error message with retry option; fall back to cached version if available.
- What happens when user rapidly switches between tabs? Debounce requests and show loading state; cancel pending requests when switching.
- How does system handle chapters with complex code blocks? Include code concepts in mind map but summarize code purpose rather than syntax.
- What happens on slow network connections? Show progressive loading; prioritize text summary over mind map visualization.

## Requirements *(mandatory)*

### Functional Requirements

#### Summary Feature
- **FR-001**: System MUST provide a "Summary" tab on each chapter/doc page
- **FR-002**: System MUST generate concise summaries (200-400 words) capturing key concepts, main takeaways, and important terms
- **FR-003**: System MUST cache generated summaries to avoid regeneration on repeat visits
- **FR-004**: System MUST display summaries within 3 seconds for cached content, 10 seconds for new generation
- **FR-005**: Summary MUST be formatted with clear structure (key points, main concepts, takeaways)

#### Mind Map Feature
- **FR-006**: System MUST provide a "Mind Map" tab on each chapter/doc page
- **FR-007**: System MUST generate mind maps with the chapter's main topic as the central node
- **FR-008**: Mind map MUST show at least 2 levels of concept hierarchy (main topic → subtopics → details)
- **FR-009**: System MUST render mind maps as interactive visualizations supporting zoom, pan, and node interaction
- **FR-010**: System MUST display tooltips with concept descriptions on node hover
- **FR-011**: System MUST support node expansion/collapse for navigating complex topics
- **FR-012**: System MUST cache generated mind map data to avoid regeneration on repeat visits

#### Navigation & Export
- **FR-013**: Mind map nodes SHOULD link to relevant content sections when identifiable
- **FR-014**: System SHOULD provide export functionality for mind maps as PNG images
- **FR-015**: System MUST show loading states while content is being generated

#### Integration
- **FR-016**: Features MUST be accessible via tabs alongside existing content (alongside "Listen as Podcast" etc.)
- **FR-017**: Features MUST work on both English and Urdu content
- **FR-018**: Features MUST respect user's color mode preference (light/dark theme)

### Key Entities

- **Summary**: AI-generated text summarizing chapter content; includes key_points, main_concepts, takeaways, chapter_id, generated_at
- **MindMap**: Structured representation of concept relationships; includes central_topic, nodes (id, label, description, parent_id, level), edges (source, target, relationship), chapter_id, generated_at
- **MindMapNode**: Individual concept in the mind map; includes id, label, description, content_anchor (optional link to content section)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view a chapter summary in under 3 seconds (cached) or 10 seconds (new generation)
- **SC-002**: Mind maps display within 5 seconds (cached) or 15 seconds (new generation)
- **SC-003**: 90% of generated summaries accurately capture the chapter's main points (validated through user feedback)
- **SC-004**: Mind maps contain at least 5 concept nodes for chapters with 500+ words of content
- **SC-005**: Interactive mind map supports smooth zoom/pan at 60fps on standard devices
- **SC-006**: Feature adoption: 30% of users interact with Summary or Mind Map tabs within first month
- **SC-007**: Export functionality generates downloadable images within 2 seconds

## Assumptions

- Users have modern browsers supporting interactive visualizations
- AI text generation (OpenAI) is available for summary and mind map structure generation
- Existing chapter content structure can be parsed to identify sections for navigation
- Caching infrastructure (existing podcast/diagram cache pattern) can be extended for this feature
- Mind map visualization will use a client-side rendering approach for interactivity

## Out of Scope

- Real-time collaborative mind map editing
- User-created custom mind maps (only AI-generated from content)
- Mind map templates or themes (uses default styling)
- Audio narration of summaries (covered by existing podcast feature)
- Summary translation (relies on existing Urdu translation feature for localized content)
