import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface Testimonial {
  name: string;
  designation: string;
  department: string;
  linkedin: string;
  comment: string;
  rating: number;
}

// Sample testimonials - these will be replaced with actual data from Google Sheets
// For now, using static data that matches feedback sheet structure
const sampleTestimonials: Testimonial[] = [
  {
    name: 'Loading...',
    designation: '',
    department: '',
    linkedin: '',
    comment: 'Fetching testimonials from feedback...',
    rating: 5,
  },
];

// Function to extract LinkedIn username from URL
function getLinkedInUsername(url: string): string {
  if (!url) return '';
  const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
  return match ? match[1] : '';
}

// Function to generate LinkedIn profile image URL
function getLinkedInAvatar(linkedinUrl: string, name: string): string {
  // LinkedIn doesn't allow direct image access, so we use UI Avatars as fallback
  // with initials from the name
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Use UI Avatars service for consistent avatar generation
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=150&background=1e88e5&color=ffffff&bold=true`;
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4].map((star) => (
        <span
          key={star}
          className={star <= (5 - rating) ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const linkedinUsername = getLinkedInUsername(testimonial.linkedin);

  return (
    <div className={styles.testimonialCard}>
      <div className={styles.cardHeader}>
        <div className={styles.avatarContainer}>
          <img
            src={getLinkedInAvatar(testimonial.linkedin, testimonial.name)}
            alt={testimonial.name}
            className={styles.avatar}
          />
          {testimonial.linkedin && (
            <a
              href={testimonial.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkedinBadge}
              title="View LinkedIn Profile"
            >
              in
            </a>
          )}
        </div>
        <div className={styles.personInfo}>
          <h4 className={styles.personName}>{testimonial.name}</h4>
          <p className={styles.personTitle}>{testimonial.designation}</p>
          <p className={styles.personDept}>{testimonial.department}</p>
        </div>
      </div>
      <div className={styles.cardBody}>
        <StarRating rating={testimonial.rating} />
        <blockquote className={styles.comment}>
          "{testimonial.comment}"
        </blockquote>
      </div>
    </div>
  );
}

export default function Testimonials(): JSX.Element {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch testimonials from Google Sheets via published CSV
    const fetchTestimonials = async () => {
      try {
        // Google Sheets published CSV URL (requires sheet to be published to web)
        // File → Share → Publish to web → Select 'feedback' sheet → Publish as CSV
        const sheetId = '1zppcLNd-ClDtz63E2hlAwhSPobOMaiXFEXF4eiJIDRs';
        const gid = '0'; // Sheet GID for feedback tab (check URL when viewing sheet)
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

        const response = await fetch(csvUrl);

        if (!response.ok) {
          // If fetch fails, try alternative URL format
          const altUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=feedback`;
          const altResponse = await fetch(altUrl);

          if (!altResponse.ok) {
            throw new Error('Failed to fetch testimonials');
          }

          const csvText = await altResponse.text();
          processCSV(csvText);
          return;
        }

        const csvText = await response.text();
        processCSV(csvText);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Unable to load testimonials');
        setTestimonials([]);
        setLoading(false);
      }
    };

    const processCSV = (csvText: string) => {
      try {
        const rows = parseCSV(csvText);

        // Skip header row and filter valid testimonials
        // Column indexes based on feedback sheet:
        // 1=Name, 2=Designation, 3=Department, 5=LinkedIn, 17=Overall Satisfied
        // 24=Future Topics, 25=Best About Session, 26=Suggestions, 27=Other Comments
        const validTestimonials = rows.slice(1)
          .filter(row => row[1] && (row[24] || row[25] || row[26])) // Has name and has any comment
          .map(row => ({
            name: row[1] || 'Anonymous',
            designation: row[2] || '',
            department: row[3] || '',
            linkedin: row[5] || '',
            comment: row[24] || row[25] || row[26] || 'Great training program!',
            rating: parseInt(row[17]) || 1,
          }))
          .filter(t => t.comment && t.comment.length > 5); // Only include meaningful comments

        if (validTestimonials.length > 0) {
          setTestimonials(validTestimonials);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        console.error('Error processing CSV:', err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Simple CSV parser
  function parseCSV(text: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\n' || char === '\r') && !insideQuotes) {
        if (currentCell || currentRow.length > 0) {
          currentRow.push(currentCell.trim());
          rows.push(currentRow);
          currentRow = [];
          currentCell = '';
        }
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
      } else {
        currentCell += char;
      }
    }

    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
    }

    return rows;
  }

  // Don't render section if no testimonials and not loading
  if (!loading && testimonials.length === 0) {
    return (
      <section className={styles.testimonials}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What Participants Say</h2>
          <p className={styles.sectionSubtitle}>
            Feedback from our training participants will appear here after they submit their evaluations.
          </p>
          <div className={styles.noTestimonials}>
            <p>Be the first to share your feedback!</p>
            <a href="/evaluation" className={styles.feedbackButton}>
              Submit Your Feedback
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.testimonials}>
      <div className="container">
        <h2 className={styles.sectionTitle}>What Participants Say</h2>
        <p className={styles.sectionSubtitle}>
          Real feedback from SIEHS leaders who completed the training
        </p>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading testimonials...</p>
          </div>
        ) : (
          <div className={styles.testimonialGrid}>
            {testimonials.slice(0, 6).map((testimonial, idx) => (
              <TestimonialCard key={idx} testimonial={testimonial} />
            ))}
          </div>
        )}

        <div className={styles.ctaSection}>
          <p>Completed the training? Share your experience!</p>
          <a href="/evaluation" className={styles.feedbackButton}>
            Submit Your Feedback
          </a>
        </div>
      </div>
    </section>
  );
}
