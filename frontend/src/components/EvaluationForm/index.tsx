import React, { useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

interface FormData {
  // Participant Info
  participantName: string;
  designation: string;
  department: string;
  email: string;
  linkedinProfile: string;
  photoUrl: string;

  // Program Info
  programName: string;
  venue: string;
  trainer: string;
  trainingDate: string;

  // Content Ratings (1-4)
  contentUseful: string;
  contentBeneficial: string;
  materialValuable: string;

  // Instructor Ratings (1-4)
  instructorClear: string;
  instructorClarifiedDoubts: string;
  instructorLively: string;
  instructorKnowledge: string;

  // Overall Ratings (1-4)
  overallSatisfied: string;
  wantMoreTopics: string;
  facilityEnvironment: string;
  foodQuality: string;
  trainingInformation: string;
  trainingRelevant: string;

  // Open-ended questions
  futureTopics: string;
  bestAboutSession: string;
  suggestions: string;
  otherComments: string;
}

const initialFormData: FormData = {
  participantName: '',
  designation: '',
  department: '',
  email: '',
  linkedinProfile: '',
  photoUrl: '',
  programName: 'Agentic AI Leaders Training',
  venue: 'SIEHS – HO – Board Room',
  trainer: 'Muhammad Qasim',
  trainingDate: 'December 16-18, 2025',
  contentUseful: '',
  contentBeneficial: '',
  materialValuable: '',
  instructorClear: '',
  instructorClarifiedDoubts: '',
  instructorLively: '',
  instructorKnowledge: '',
  overallSatisfied: '',
  wantMoreTopics: '',
  facilityEnvironment: '',
  foodQuality: '',
  trainingInformation: '',
  trainingRelevant: '',
  futureTopics: '',
  bestAboutSession: '',
  suggestions: '',
  otherComments: '',
};

const ratingLabels = {
  '1': 'Exceeds Expectations',
  '2': 'Met Expectations',
  '3': 'Somewhat Satisfied',
  '4': 'Not at all Satisfied',
};

// Google Apps Script Web App URL for form submissions
// Sheet: https://docs.google.com/spreadsheets/d/1zppcLNd-ClDtz63E2hlAwhSPobOMaiXFEXF4eiJIDRs/
// Data saves to 'feedback' sheet tab
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyArW58MJtcJ9iS-oQvP8uheSUG-xjzq6EpOfs0TJxnH2w7Qf-v4PY80qFyEQnv-44r/exec';

export default function EvaluationForm(): JSX.Element {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateLinkedIn = (url: string): boolean => {
    if (!url) return true; // Optional field
    return url.includes('linkedin.com/in/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate LinkedIn URL
    if (formData.linkedinProfile && !validateLinkedIn(formData.linkedinProfile)) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)');
      return;
    }

    // Check required ratings
    const requiredRatings = [
      'contentUseful', 'contentBeneficial', 'materialValuable',
      'instructorClear', 'instructorClarifiedDoubts', 'instructorLively', 'instructorKnowledge',
      'overallSatisfied', 'wantMoreTopics', 'facilityEnvironment', 'foodQuality',
      'trainingInformation', 'trainingRelevant'
    ];

    for (const field of requiredRatings) {
      if (!formData[field as keyof FormData]) {
        setError('Please complete all rating questions before submitting.');
        return;
      }
    }

    setSubmitting(true);

    try {
      // Save to localStorage for backup first
      const submissions = JSON.parse(localStorage.getItem('evaluationSubmissions') || '[]');
      submissions.push({ ...formData, submittedAt: new Date().toISOString() });
      localStorage.setItem('evaluationSubmissions', JSON.stringify(submissions));

      // Submit to Google Sheets via Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // With no-cors mode, we can't read the response, but the request is sent
      // The submission is considered successful if no error is thrown
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('An error occurred. Your response has been saved locally. Please try again or contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  const generateEmailBody = (data: FormData): string => {
    return `
SIEHS Training Evaluation Form
==============================

PARTICIPANT INFORMATION
-----------------------
Name: ${data.participantName}
Designation: ${data.designation}
Department: ${data.department}
Email: ${data.email}
LinkedIn: ${data.linkedinProfile}

PROGRAM INFORMATION
-------------------
Program: ${data.programName}
Venue: ${data.venue}
Trainer: ${data.trainer}
Date: ${data.trainingDate}

CONTENT RATINGS (1=Exceeds, 2=Met, 3=Somewhat, 4=Not Satisfied)
---------------------------------------------------------------
1. Content was useful: ${data.contentUseful}
2. Beneficial for job performance: ${data.contentBeneficial}
3. Material provided valuable learning: ${data.materialValuable}

INSTRUCTOR RATINGS
------------------
4. Instructor was clear and audible: ${data.instructorClear}
5. Instructor clarified doubts: ${data.instructorClarifiedDoubts}
6. Session was lively and interesting: ${data.instructorLively}
7. Instructor had depth of knowledge: ${data.instructorKnowledge}

OVERALL RATINGS
---------------
8. Overall satisfied with session: ${data.overallSatisfied}
9. Want to be part of other topics: ${data.wantMoreTopics}
10. Facility and environment: ${data.facilityEnvironment}
11. Quality of food/snacks: ${data.foodQuality}
12. Training information was sufficient: ${data.trainingInformation}
13. Training was relevant to my role: ${data.trainingRelevant}

FEEDBACK
--------
Future topics suggestion: ${data.futureTopics || 'N/A'}

Best about session: ${data.bestAboutSession || 'N/A'}

Suggestions for improvement: ${data.suggestions || 'N/A'}

Other comments: ${data.otherComments || 'N/A'}
    `.trim();
  };

  if (submitted) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <h2>Thank You!</h2>
        <p>Your evaluation has been submitted successfully.</p>
        <p>Your feedback has been recorded and will help us improve future training programs.</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--ifm-color-gray-600)', marginTop: '1rem' }}>
          We appreciate you taking the time to share your thoughts!
        </p>
        <button
          className={styles.submitButton}
          onClick={() => { setSubmitted(false); setFormData(initialFormData); }}
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  const logoUrl = useBaseUrl('/img/logo.svg');

  return (
    <form className={styles.evaluationForm} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <img src={logoUrl} alt="SIEHS Logo" className={styles.logo} />
        <h1>Training Evaluation Form</h1>
        <p className={styles.subtitle}>SIEHS-P&C-F-25 | Issue 03</p>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Participant Information */}
      <section className={styles.section}>
        <h2>Participant Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="participantName">Full Name *</label>
            <input
              type="text"
              id="participantName"
              name="participantName"
              value={formData.participantName}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="designation">Designation *</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
              placeholder="e.g., Manager, Officer"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              placeholder="e.g., IT, HR, Operations"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your.email@siehs.org"
            />
          </div>
          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="linkedinProfile">
              LinkedIn Profile URL
              <span className={styles.linkedinIcon}>in</span>
            </label>
            <input
              type="url"
              id="linkedinProfile"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <small className={styles.helpText}>
              Share your LinkedIn profile to connect with fellow participants
            </small>
          </div>
          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="photoUrl">
              Profile Photo URL (Optional)
            </label>
            <input
              type="url"
              id="photoUrl"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleInputChange}
              placeholder="https://drive.google.com/... or any image URL"
            />
            <small className={styles.helpText}>
              Upload your photo to Google Drive (make it public) or use any image hosting service and paste the link here. Your photo will appear in testimonials.
            </small>
          </div>
        </div>
      </section>

      {/* Program Information */}
      <section className={styles.section}>
        <h2>Program Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="programName">Program Name</label>
            <input
              type="text"
              id="programName"
              name="programName"
              value={formData.programName}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="trainer">Trainer/Instructor</label>
            <input
              type="text"
              id="trainer"
              name="trainer"
              value={formData.trainer}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="trainingDate">Training Date</label>
            <input
              type="text"
              id="trainingDate"
              name="trainingDate"
              value={formData.trainingDate}
              onChange={handleInputChange}
              readOnly
            />
          </div>
        </div>
      </section>

      {/* Rating Scale Legend */}
      <section className={styles.section}>
        <h2>Rating Scale</h2>
        <div className={styles.ratingLegend}>
          <div className={styles.legendItem}>
            <span className={styles.legendNumber}>1</span>
            <span>Exceeds Expectations</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendNumber}>2</span>
            <span>Met Expectations</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendNumber}>3</span>
            <span>Somewhat Satisfied</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendNumber}>4</span>
            <span>Not at all Satisfied</span>
          </div>
        </div>
      </section>

      {/* Content Ratings */}
      <section className={styles.section}>
        <h2>Content</h2>
        <RatingQuestion
          number={1}
          question="The content of the session was useful to me"
          name="contentUseful"
          value={formData.contentUseful}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={2}
          question="This session will be beneficial to me in the performance of my job"
          name="contentBeneficial"
          value={formData.contentBeneficial}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={3}
          question="The material used provided valuable learning opportunity for me"
          name="materialValuable"
          value={formData.materialValuable}
          onChange={handleRatingChange}
        />
      </section>

      {/* Instructor Ratings */}
      <section className={styles.section}>
        <h2>Instructor(s)</h2>
        <RatingQuestion
          number={4}
          question="The instructor(s) was clear and audible"
          name="instructorClear"
          value={formData.instructorClear}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={5}
          question="The instructor(s) clarified my doubts"
          name="instructorClarifiedDoubts"
          value={formData.instructorClarifiedDoubts}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={6}
          question="The instructor(s) was able to keep the session lively and interesting"
          name="instructorLively"
          value={formData.instructorLively}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={7}
          question="The instructor(s) had real depth of knowledge in the subject"
          name="instructorKnowledge"
          value={formData.instructorKnowledge}
          onChange={handleRatingChange}
        />
      </section>

      {/* Overall Ratings */}
      <section className={styles.section}>
        <h2>Overall</h2>
        <RatingQuestion
          number={8}
          question="Overall I am satisfied with this session"
          name="overallSatisfied"
          value={formData.overallSatisfied}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={9}
          question="I would like to be part of other development topics"
          name="wantMoreTopics"
          value={formData.wantMoreTopics}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={10}
          question="The facility and environment was conducive for learning"
          name="facilityEnvironment"
          value={formData.facilityEnvironment}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={11}
          question="Quality of Food/Snacks"
          name="foodQuality"
          value={formData.foodQuality}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={12}
          question="To what extent was the training/information provided on this subject sufficient for you?"
          name="trainingInformation"
          value={formData.trainingInformation}
          onChange={handleRatingChange}
        />
        <RatingQuestion
          number={13}
          question="The training was easy to follow and very relevant to my role"
          name="trainingRelevant"
          value={formData.trainingRelevant}
          onChange={handleRatingChange}
        />
      </section>

      {/* Open-ended Questions */}
      <section className={styles.section}>
        <h2>Your Feedback</h2>

        <div className={styles.formGroup}>
          <label htmlFor="futureTopics">
            15. What other topics would you like us to cover in future programs?
          </label>
          <textarea
            id="futureTopics"
            name="futureTopics"
            value={formData.futureTopics}
            onChange={handleInputChange}
            rows={3}
            placeholder="Share your suggestions for future training topics..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bestAboutSession">
            16. What did you like best about this session?
          </label>
          <textarea
            id="bestAboutSession"
            name="bestAboutSession"
            value={formData.bestAboutSession}
            onChange={handleInputChange}
            rows={3}
            placeholder="Tell us what you enjoyed most..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="suggestions">
            17. What are your suggestions to further improve the program?
          </label>
          <textarea
            id="suggestions"
            name="suggestions"
            value={formData.suggestions}
            onChange={handleInputChange}
            rows={3}
            placeholder="Help us improve future sessions..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="otherComments">
            Any other comments:
          </label>
          <textarea
            id="otherComments"
            name="otherComments"
            value={formData.otherComments}
            onChange={handleInputChange}
            rows={3}
            placeholder="Any additional feedback..."
          />
        </div>
      </section>

      {/* Submit Button */}
      <div className={styles.submitSection}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Evaluation'}
        </button>
        <p className={styles.privacyNote}>
          Your feedback helps us improve our training programs.
          All responses are confidential.
        </p>
      </div>
    </form>
  );
}

interface RatingQuestionProps {
  number: number;
  question: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

function RatingQuestion({ number, question, name, value, onChange }: RatingQuestionProps): JSX.Element {
  return (
    <div className={styles.ratingQuestion}>
      <div className={styles.questionText}>
        <span className={styles.questionNumber}>{number}.</span>
        {question}
      </div>
      <div className={styles.ratingOptions}>
        {['1', '2', '3', '4'].map((rating) => (
          <label key={rating} className={styles.ratingOption}>
            <input
              type="radio"
              name={name}
              value={rating}
              checked={value === rating}
              onChange={() => onChange(name, rating)}
            />
            <span className={styles.ratingCircle}>{rating}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
