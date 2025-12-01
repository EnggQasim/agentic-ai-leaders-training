import React, { useState, useCallback } from 'react';
import styles from './styles.module.css';

interface SummaryPanelProps {
  chapterId: string;
  chapterTitle: string;
  chapterContent: string;
}

interface Concept {
  term: string;
  definition: string;
}

interface Summary {
  chapter_id: string;
  title: string;
  key_points: string[];
  main_concepts: Concept[];
  takeaways: string[];
  word_count: number;
  generated_at: string;
}

interface SummaryResponse {
  success: boolean;
  summary?: Summary;
  cached: boolean;
  error?: string;
}

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : 'https://mqasim077-physical-ai-textbook-api.hf.space';

export default function SummaryPanel({
  chapterId,
  chapterTitle,
  chapterContent,
}: SummaryPanelProps): JSX.Element {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchSummary = useCallback(async (forceRegenerate: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/mindmap/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapter_id: chapterId,
          chapter_content: chapterContent,
          chapter_title: chapterTitle,
          force_regenerate: forceRegenerate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate summary: ${response.statusText}`);
      }

      const data: SummaryResponse = await response.json();

      if (data.success && data.summary) {
        setSummary(data.summary);
        setIsCached(data.cached);
        setHasLoaded(true);
      } else {
        setError(data.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [chapterId, chapterContent, chapterTitle]);

  // Auto-fetch on mount if not loaded
  React.useEffect(() => {
    if (!hasLoaded && !isLoading && chapterContent.length > 100) {
      fetchSummary();
    }
  }, [hasLoaded, isLoading, chapterContent, fetchSummary]);

  const handleRegenerate = () => {
    fetchSummary(true);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Generating AI Summary...</span>
          <span className={styles.loadingSubtext}>Analyzing chapter content and extracting key points</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <svg className={styles.errorIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className={styles.errorText}>{error}</span>
          <button className={styles.retryButton} onClick={() => fetchSummary()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContainer}>
          <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span className={styles.emptyText}>Click to generate an AI summary of this chapter</span>
          <button className={styles.generateButton} onClick={() => fetchSummary()}>
            Generate Summary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Chapter Summary</h3>
          {isCached && (
            <span className={styles.cachedBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Cached
            </span>
          )}
        </div>
        <button
          className={styles.regenerateButton}
          onClick={handleRegenerate}
          title="Regenerate summary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          Regenerate
        </button>
      </div>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          Key Points
        </h4>
        <ul className={styles.keyPointsList}>
          {summary.key_points.map((point, index) => (
            <li key={index} className={styles.keyPoint}>
              <span className={styles.bulletPoint}>{index + 1}</span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" y1="8" x2="12" y2="8" />
            <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
            <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
          </svg>
          Main Concepts
        </h4>
        <div className={styles.conceptsGrid}>
          {summary.main_concepts.map((concept, index) => (
            <div key={index} className={styles.conceptCard}>
              <span className={styles.conceptTerm}>{concept.term}</span>
              <p className={styles.conceptDefinition}>{concept.definition}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Key Takeaways
        </h4>
        <ul className={styles.takeawaysList}>
          {summary.takeaways.map((takeaway, index) => (
            <li key={index} className={styles.takeaway}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14" />
                <path d="M19 12l-7 7-7-7" />
              </svg>
              {takeaway}
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.footer}>
        <span className={styles.wordCount}>~{summary.word_count} words</span>
        <span className={styles.generatedAt}>
          Generated: {new Date(summary.generated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
