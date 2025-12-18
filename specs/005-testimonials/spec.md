# Feature Specification: Participant Testimonials

**Feature Branch**: `005-testimonials`
**Created**: 2025-12-18
**Status**: Completed
**Input**: Display LinkedIn profiles and comments from feedback Excel sheet on landing page

## Overview

A testimonials section on the landing page that displays participant feedback collected via the evaluation form. Testimonials are fetched dynamically from a published Google Sheets CSV, showing participant names, designations, departments, LinkedIn links, star ratings, and comments.

## User Scenarios & Testing

### User Story 1 - View Testimonials on Landing Page (Priority: P1)

A visitor to the SIEHS Agentic AI Training site sees real feedback from training participants on the homepage, building credibility and social proof.

**Acceptance Scenarios**:

1. **Given** testimonials exist in Google Sheet, **When** landing page loads, **Then** up to 6 testimonials are displayed
2. **Given** participant has LinkedIn URL, **When** testimonial displays, **Then** LinkedIn badge is clickable
3. **Given** no testimonials in sheet, **When** page loads, **Then** graceful fallback message shown
4. **Given** fetch fails, **When** error occurs, **Then** "No feedback available" message displayed

### User Story 2 - Testimonial Card Display (Priority: P1)

Each testimonial card shows participant info, their rating, and a comment excerpt.

**Acceptance Scenarios**:

1. **Given** testimonial data, **When** card renders, **Then** avatar shows initials via UI Avatars API
2. **Given** rating value, **When** card renders, **Then** star rating visualization displayed
3. **Given** long comment, **When** card renders, **Then** comment truncated to 4 lines

## Requirements

### Functional Requirements

- **FR-001**: Testimonials MUST fetch from published Google Sheets CSV
- **FR-002**: Display MUST show participant name, designation, department
- **FR-003**: Display MUST show LinkedIn badge if URL provided
- **FR-004**: Display MUST show star rating (1-4 scale converted to stars)
- **FR-005**: Display MUST show comment (from Future Topics, Best About, or Suggestions)
- **FR-006**: Grid MUST be responsive (3 columns desktop, 1 column mobile)
- **FR-007**: Component MUST NOT provide form submission (read-only)

### Data Source

**Published CSV URL**:
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vTOkvdjC4EEqMu6BWD8ix5V6nogV0n9_my87xyKoj392jHf20XYE5zG4jtRmgjSA4Crh5xYbmwZcUB_/pub?gid=877343173&single=true&output=csv
```

**Column Mapping**:
| Index | Field | Usage |
|-------|-------|-------|
| 1 | Name | Display name |
| 2 | Designation | Job title |
| 3 | Department | Department name |
| 5 | LinkedIn | LinkedIn URL (optional) |
| 17 | Overall Satisfied | Star rating (1-4) |
| 24 | Future Topics | Comment option 1 |
| 25 | Best About Session | Comment option 2 |
| 26 | Suggestions | Comment option 3 |

## Technical Implementation

### Files Created/Modified

| File | Purpose | Status |
|------|---------|--------|
| `frontend/src/components/Testimonials/index.tsx` | React testimonial component | ✅ Complete |
| `frontend/src/components/Testimonials/styles.module.css` | Testimonial styling | ✅ Complete |
| `frontend/src/pages/index.tsx` | Added Testimonials to landing page | ✅ Complete |

### Component Architecture

```typescript
// Key components
Testimonials        // Main section component
├── TestimonialCard // Individual card
│   ├── Avatar (UI Avatars API)
│   ├── LinkedInBadge
│   ├── StarRating
│   └── Comment
└── Loading/Error states
```

### Avatar Generation

Uses UI Avatars API for consistent profile pictures:
```
https://ui-avatars.com/api/?name={name}&size=150&background=1e88e5&color=ffffff&bold=true
```

### CSV Parsing

Custom CSV parser handles:
- Quoted fields with commas
- Escaped quotes (`""`)
- Mixed line endings (`\n`, `\r\n`)

## Success Criteria

- [x] Testimonials fetch from published CSV URL
- [x] Up to 6 testimonials displayed in grid
- [x] Avatar shows participant initials
- [x] LinkedIn badge links to profile
- [x] Star rating displays correctly
- [x] Comments truncated appropriately
- [x] Loading spinner during fetch
- [x] Graceful handling when no data
- [x] Dark mode support
- [x] Mobile responsive

## Deployment

**Live URL**: https://enggqasim.github.io/agentic-ai-leaders-training/

Testimonials section appears between "3-Day Training Program" and "Training Participants" sections.
