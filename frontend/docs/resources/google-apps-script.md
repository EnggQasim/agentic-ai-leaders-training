---
sidebar_position: 10
title: "Setup: Google Sheets Integration"
---

# Google Sheets Integration for Evaluation Form

Follow these steps to collect evaluation form submissions in Google Sheets.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: `SIEHS Training Evaluations`
4. In Row 1, add these headers:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Designation | Department | Email | LinkedIn | Program | Venue | Trainer | Date | Content Useful | Content Beneficial | Material Valuable | Instructor Clear | Instructor Doubts | Instructor Lively | Instructor Knowledge | Overall Satisfied | Want More Topics | Facility | Food Quality | Training Info | Training Relevant |

Continue in next columns:

| X | Y | Z | AA |
|---|---|---|---|
| Future Topics | Best About Session | Suggestions | Other Comments |

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
// Google Apps Script for SIEHS Training Evaluation Form
// Deploy as Web App to receive form submissions

function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);

    // Create timestamp
    var timestamp = new Date().toISOString();

    // Prepare row data matching the headers
    var rowData = [
      timestamp,
      data.participantName || '',
      data.designation || '',
      data.department || '',
      data.email || '',
      data.linkedinProfile || '',
      data.programName || '',
      data.venue || '',
      data.trainer || '',
      data.trainingDate || '',
      data.contentUseful || '',
      data.contentBeneficial || '',
      data.materialValuable || '',
      data.instructorClear || '',
      data.instructorClarifiedDoubts || '',
      data.instructorLively || '',
      data.instructorKnowledge || '',
      data.overallSatisfied || '',
      data.wantMoreTopics || '',
      data.facilityEnvironment || '',
      data.foodQuality || '',
      data.trainingInformation || '',
      data.trainingRelevant || '',
      data.futureTopics || '',
      data.bestAboutSession || '',
      data.suggestions || '',
      data.otherComments || ''
    ];

    // Append the row to the sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Evaluation submitted successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight requests
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'SIEHS Evaluation Form API is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **Web app**
4. Configure:
   - **Description**: `SIEHS Evaluation Form v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
5. Click **Deploy**
6. Click **Authorize access** and follow the prompts
7. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

## Step 4: Update Environment Variable

Add your Web App URL to the site configuration:

1. In Vercel/GitHub, add environment variable:
   ```
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

2. Or update directly in the code (see next section)

## Step 5: Test the Integration

1. Go to the [Evaluation Form](/evaluation)
2. Fill out the form completely
3. Click **Submit Evaluation**
4. Check your Google Sheet - a new row should appear!

## Viewing Submissions

### In Google Sheets
- Open your spreadsheet anytime
- All submissions appear with timestamps
- Use filters to analyze data

### Export Options
- **Download**: File → Download → CSV/Excel
- **Share**: Share button → Add collaborators
- **Charts**: Insert → Chart for visualizations

## Troubleshooting

### Form not submitting?
- Check browser console for errors
- Verify the Web App URL is correct
- Ensure the script is deployed with "Anyone" access

### Data not appearing in sheet?
- Check the Apps Script execution log: Extensions → Apps Script → Executions
- Verify column headers match the script

### CORS errors?
- Redeploy the web app
- Make sure "Who has access" is set to "Anyone"

## Security Notes

- The Google Sheet is private by default
- Only share with trusted team members
- Consider adding form validation on the server side
- Monitor the sheet for spam submissions
