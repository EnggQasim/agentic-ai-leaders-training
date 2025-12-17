# Research: Day 2 - n8n Workflow Automation

**Feature**: 002-day2-n8n-automation
**Date**: 2025-12-18
**Status**: Complete

## Research Tasks Completed

### 1. n8n Platform Selection

**Decision**: Use n8n as the primary workflow automation platform
**Rationale**:
- Open source with strong community
- Visual, no-code interface ideal for non-technical users
- Self-hosting option for data privacy (SIEHS requirement)
- 400+ integrations including Google Workspace
- Free cloud tier available for training
**Alternatives Considered**:
- Zapier: More polished UI but expensive, no self-hosting
- Make (Integromat): Good but less intuitive interface
- Power Automate: Requires Microsoft ecosystem
- Apache Airflow: Too technical for target audience

### 2. n8n Access Strategy

**Decision**: Use n8n Cloud free tier for training
**Rationale**:
- Instant setup, no infrastructure needed
- Free tier supports 5 active workflows
- Sufficient for training exercises
- Participants can upgrade or self-host later
**Implementation**:
- Create training accounts or use personal signups
- Provide backup self-hosted instance as fallback
- Export workflow JSON for participants to keep

### 3. Google Integration Setup

**Decision**: Use OAuth 2.0 with Google Cloud Console for Sheets/Gmail
**Rationale**:
- Standard authentication method
- One-time setup covers both services
- Participants learn real production setup
**Setup Steps**:
1. Create Google Cloud Project
2. Enable Google Sheets API and Gmail API
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials
5. Add credentials to n8n

### 4. SIEHS Workflow Use Cases

**Decision**: Focus on patient communication workflow as primary example
**Rationale**: Immediately applicable, demonstrates full automation cycle
**Use Case Details**:

| Workflow | Trigger | Data Source | Action | SIEHS Department |
|----------|---------|-------------|--------|------------------|
| Patient Follow-up | Schedule/Manual | Google Sheet | Send Gmail | Call Center |
| Incident Alert | New Row | Google Sheet | Email Team | Operations |
| Shift Reminder | Cron | Google Sheet | SMS/Email | HR/Scheduling |
| Feedback Collection | Form Submit | Google Form | Sheet + Email | Quality |

### 5. Error Handling Patterns

**Decision**: Implement Error Trigger + notification pattern
**Rationale**: Critical for healthcare workflows where failures must be caught
**Pattern**:
```
Main Workflow
    ↓ (on error)
Error Trigger Node
    ↓
Send Alert Email to Admin
    ↓
Log to Error Sheet
```

### 6. Rate Limits and Constraints

**Research Findings**:

| Service | Limit | Mitigation |
|---------|-------|------------|
| Gmail API | 100 emails/day (free) | Use batching, add delays |
| Google Sheets API | 300 requests/minute | Add wait nodes |
| n8n Cloud Free | 5 active workflows | Archive unused workflows |
| n8n Executions | Varies by plan | Monitor execution count |

### 7. Security Considerations

**Decision**: Emphasize credential isolation and data privacy
**Key Points for Training**:
- Never share OAuth tokens
- Use environment variables for sensitive data
- Consider self-hosting for production SIEHS workflows
- Test data only (no real patient information)
- Credential encryption in n8n

## Technical Requirements Resolved

| Requirement | Resolution |
|-------------|------------|
| n8n Access | Cloud free tier (n8n.cloud) |
| Google Auth | OAuth 2.0 via Cloud Console |
| Exercise Data | Pre-built Google Sheets templates |
| Workflow Export | JSON export for all participants |
| Error Handling | Error Trigger node pattern |

## Sample Workflow Architecture

### Google Sheets → Gmail Automation

```
┌─────────────────┐
│ Schedule Trigger│ (or Manual)
│  Every Hour     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Google Sheets   │
│ Read Contacts   │
│ Filter: Status  │
│ = "pending"     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Loop Over Items │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gmail: Send     │
│ To: {{email}}   │
│ Subject: Follow │
│ Body: Template  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Google Sheets   │
│ Update Status   │
│ = "sent"        │
└─────────────────┘
```

## Dependencies Identified

1. **n8n Cloud Account**: Free tier registration
2. **Google Account**: For OAuth authentication
3. **Google Cloud Project**: For API credentials
4. **Test Data**: Sample contact spreadsheet
5. **Internet Connection**: Required throughout

## Risk Analysis

| Risk | Mitigation |
|------|------------|
| n8n Cloud outage | Have self-hosted backup instance |
| Google API quota exceeded | Pre-test with limited data, add delays |
| OAuth setup complexity | Step-by-step screenshots, helper video |
| Workflow saving issues | Auto-save enabled, export frequently |
| Time zone confusion | Use explicit time zone settings |
