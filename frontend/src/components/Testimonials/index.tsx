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

// Generate a consistent color based on name
function getColorFromName(name: string): string {
  const colors = [
    '1e88e5', // Blue
    '43a047', // Green
    'e53935', // Red
    '8e24aa', // Purple
    'f4511e', // Deep Orange
    '00897b', // Teal
    '3949ab', // Indigo
    'c2185b', // Pink
    '7b1fa2', // Deep Purple
    '0097a7', // Cyan
  ];

  // Simple hash function to get consistent color for each name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

// Function to generate fallback avatar URL with personalized colors
function getFallbackAvatarUrl(name: string): string {
  const bgColor = getColorFromName(name);

  // Use UI Avatars service with personalized background color
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=150&background=${bgColor}&color=ffffff&bold=true&rounded=true`;
}

// Function to get LinkedIn profile picture using unavatar.io service
function getLinkedInAvatarUrl(linkedinUrl: string, name: string): string {
  const username = getLinkedInUsername(linkedinUrl);

  if (username) {
    // Use unavatar.io to fetch LinkedIn profile picture
    // It tries multiple sources including LinkedIn
    return `https://unavatar.io/linkedin/${username}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=150&background=${getColorFromName(name)}&color=ffffff&bold=true`;
  }

  // Fallback to generated avatar if no LinkedIn URL
  return getFallbackAvatarUrl(name);
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
  // Get LinkedIn profile picture or fallback to generated avatar
  const avatarSrc = getLinkedInAvatarUrl(testimonial.linkedin, testimonial.name);

  return (
    <div className={styles.testimonialCard}>
      <div className={styles.cardHeader}>
        <div className={styles.avatarContainer}>
          <img
            src={avatarSrc}
            alt={testimonial.name}
            className={styles.avatar}
            onError={(e) => {
              // Fallback to generated avatar if image fails to load
              (e.target as HTMLImageElement).src = getFallbackAvatarUrl(testimonial.name);
            }}
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
        // Published Google Sheet CSV URL (feedback sheet - gid=877343173)
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOkvdjC4EEqMu6BWD8ix5V6nogV0n9_my87xyKoj392jHf20XYE5zG4jtRmgjSA4Crh5xYbmwZcUB_/pub?gid=877343173&single=true&output=csv';

        const response = await fetch(csvUrl);

        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
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
            Feedback from our training participants will appear here.
          </p>
          <div className={styles.noTestimonials}>
            <p>No feedback available yet.</p>
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
      </div>
    </section>
  );
}
