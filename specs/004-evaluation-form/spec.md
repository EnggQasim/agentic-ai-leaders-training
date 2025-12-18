# Feature Specification: Training Evaluation Form

**Feature Branch**: `004-evaluation-form`
**Created**: 2025-12-18
**Status**: Completed
**Input**: SIEHS-P&C-F-25-Training Evaluation Form Issue 03.docx

## Overview

A Docusaurus-based training evaluation form that collects participant feedback after completing the SIEHS Agentic AI Training program. Form data is submitted to Google Sheets via Google Apps Script for centralized data collection and analysis.

## User Scenarios & Testing

### User Story 1 - Submit Training Evaluation (Priority: P1)

A training participant completes the evaluation form after finishing the 3-day program. They rate various aspects of the training and provide feedback comments.

**Acceptance Scenarios**:

1. **Given** a participant visits the evaluation page, **When** they load the form, **Then** all rating questions and feedback fields are displayed
2. **Given** participant fills out ratings, **When** they submit, **Then** data is sent to Google Sheets via Apps Script
3. **Given** successful submission, **When** response received, **Then** success message displayed and form reset
4. **Given** submission fails, **When** error occurs, **Then** data saved to localStorage as backup

## Requirements

### Functional Requirements

- **FR-001**: Form MUST collect participant info (name, designation, department, email, LinkedIn)
- **FR-002**: Form MUST collect training info (program name, venue, trainer, date)
- **FR-003**: Form MUST include 3 content usefulness ratings (1-4 scale)
- **FR-004**: Form MUST include 4 instructor effectiveness ratings (1-4 scale)
- **FR-005**: Form MUST include 6 overall satisfaction ratings (1-4 scale)
- **FR-006**: Form MUST include 4 open-ended feedback fields
- **FR-007**: Form MUST submit to Google Apps Script webhook
- **FR-008**: Form MUST store backup in localStorage

### Rating Questions (1-4 Scale)

**Content Ratings:**
1. How useful was the information presented at this training?
2. How beneficial is this training to you professionally?
3. How valuable are the materials and resources?

**Instructor Ratings:**
1. How clear was the trainer's presentation?
2. How well did the trainer answer questions/clear doubts?
3. How lively and interesting was the trainer?
4. How knowledgeable was the trainer on the subject?

**Overall Ratings:**
1. How satisfied are you with this training?
2. Would you like to learn more topics by this trainer?
3. How satisfied are you with the facility?
4. How was the food quality?
5. How would you rate the training information content?
6. How relevant is this training to your job responsibilities?

**Open-Ended Questions:**
1. What topics would you like covered in future training?
2. What was the best thing about this session?
3. How could this training be improved?
4. Any other comments?

## Technical Implementation

### Files Created/Modified

| File | Purpose | Status |
|------|---------|--------|
| `frontend/src/components/EvaluationForm/index.tsx` | React form component | ✅ Complete |
| `frontend/src/components/EvaluationForm/styles.module.css` | Form styling | ✅ Complete |
| `frontend/src/pages/evaluation.tsx` | Evaluation page | ✅ Complete |
| `frontend/docs/resources/google-apps-script.md` | Setup documentation | ✅ Complete |

### Google Sheets Integration

**Sheet URL**: `https://docs.google.com/spreadsheets/d/1zppcLNd-ClDtz63E2hlAwhSPobOMaiXFEXF4eiJIDRs/edit`

**Apps Script Webhook**: `https://script.google.com/macros/s/AKfycbyArW58MJtcJ9iS-oQvP8uheSUG-xjzq6EpOfs0TJxnH2w7Qf-v4PY80qFyEQnv-44r/exec`

**Data Flow**:
```
Form Submit → fetch(POST) → Google Apps Script → "feedback" Sheet Row
     ↓
localStorage (backup)
```

**Sheet Columns** (27 total):
Timestamp, Name, Designation, Department, Email, LinkedIn, Program, Venue, Trainer, Date, Content Useful, Content Beneficial, Material Valuable, Instructor Clear, Instructor Doubts, Instructor Lively, Instructor Knowledge, Overall Satisfied, Want More Topics, Facility, Food Quality, Training Info, Training Relevant, Future Topics, Best About Session, Suggestions, Other Comments

## Success Criteria

- [x] Form displays all 13 rating questions + 4 feedback fields
- [x] Form submits to Google Sheets successfully
- [x] Data appears in "feedback" sheet with correct columns
- [x] localStorage backup works when offline
- [x] Form is mobile responsive
- [x] Dark mode support

## Deployment

**Live URL**: https://enggqasim.github.io/agentic-ai-leaders-training/evaluation/
