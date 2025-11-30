/**
 * BilingualView Component
 *
 * Provides side-by-side English/Urdu view for content comparison.
 * Desktop only - shows full bilingual layout.
 */
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

// API URL configuration
const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : 'https://mqasim077-physical-ai-textbook-api.hf.space';

interface BilingualViewProps {
  englishContent: string;
  chapterId: string;
  className?: string;
}

export default function BilingualView({
  englishContent,
  chapterId,
  className = ''
}: BilingualViewProps): JSX.Element {
  const [urduContent, setUrduContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we're on desktop
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Fetch translation when enabled
  useEffect(() => {
    if (!isEnabled || urduContent) return;

    const fetchTranslation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/translation/translate/paragraph`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: englishContent,
            preserve_technical_terms: true,
            context: 'robotics textbook'
          })
        });

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const data = await response.json();
        setUrduContent(data.translation);
      } catch (err) {
        setError('ترجمہ دستیاب نہیں (Translation unavailable)');
        console.error('Translation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();
  }, [isEnabled, englishContent, urduContent]);

  // Don't show on mobile
  if (!isDesktop) {
    return <div className={className}>{englishContent}</div>;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Toggle Button */}
      <button
        className={`${styles.toggleButton} ${isEnabled ? styles.active : ''}`}
        onClick={() => setIsEnabled(!isEnabled)}
        title={isEnabled ? 'Hide Urdu translation' : 'Show side-by-side with Urdu'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="18" rx="1" />
          <rect x="14" y="3" width="7" height="18" rx="1" />
        </svg>
        <span>{isEnabled ? 'دو طرفہ منظر' : 'Side-by-Side'}</span>
      </button>

      {/* Content Area */}
      {isEnabled ? (
        <div className={styles.bilingualLayout}>
          {/* English Side */}
          <div className={styles.englishPane}>
            <div className={styles.paneHeader}>
              <span className={styles.langLabel}>English</span>
            </div>
            <div className={styles.paneContent}>
              {englishContent}
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Urdu Side */}
          <div className={styles.urduPane}>
            <div className={styles.paneHeader}>
              <span className={styles.langLabel}>اردو</span>
            </div>
            <div className={styles.paneContent} dir="rtl" lang="ur">
              {isLoading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                  <span>ترجمہ کیا جا رہا ہے...</span>
                </div>
              ) : error ? (
                <div className={styles.error}>{error}</div>
              ) : (
                urduContent
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.singleView}>
          {englishContent}
        </div>
      )}
    </div>
  );
}

/**
 * BilingualToggle - Standalone toggle for enabling bilingual mode site-wide
 */
export function BilingualToggle(): JSX.Element | null {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    // Load preference
    const saved = localStorage.getItem('bilingual-mode');
    if (saved === 'true') setIsEnabled(true);

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const toggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('bilingual-mode', String(newValue));
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('bilingual-mode-change', { detail: newValue }));
  };

  if (!isDesktop) return null;

  return (
    <button
      className={styles.globalToggle}
      onClick={toggle}
      title={isEnabled ? 'Disable bilingual mode' : 'Enable bilingual mode'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="18" rx="1" />
        <rect x="14" y="3" width="7" height="18" rx="1" />
      </svg>
      {isEnabled ? 'اردو | EN' : 'EN | اردو'}
    </button>
  );
}
