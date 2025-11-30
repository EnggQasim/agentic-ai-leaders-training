import React, { useState, useCallback, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface Frame {
  step: number;
  description: string;
  url?: string | null;
}

interface WorkflowAnimatorProps {
  workflow: string;
  title?: string;
  className?: string;
}

interface GifData {
  success: boolean;
  frames: Frame[];
  title?: string;
  step_count?: number;
  animation_only?: boolean;
  cached?: boolean;
  error?: string;
}

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : 'https://mqasim077-physical-ai-textbook-api.hf.space';

export default function WorkflowAnimator({
  workflow,
  title,
  className = '',
}: WorkflowAnimatorProps): JSX.Element {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gifTitle, setGifTitle] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateAnimation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/diagram/gif/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow,
          force_regenerate: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate animation');
      }

      const data: GifData = await response.json();

      if (data.success && data.frames.length > 0) {
        setFrames(data.frames);
        setGifTitle(data.title || workflow);
        setCurrentStep(0);
        setIsPlaying(true);
      } else {
        setError(data.error || 'Failed to generate animation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [workflow]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % frames.length);
      }, 2000); // 2 seconds per step
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, frames.length]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentStep((prev) => (prev - 1 + frames.length) % frames.length);
    setIsPlaying(false);
  };

  const goToNext = () => {
    setCurrentStep((prev) => (prev + 1) % frames.length);
    setIsPlaying(false);
  };

  const displayTitle = title || workflow.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={`${styles.animatorContainer} ${className}`}>
      {frames.length === 0 && !isLoading && !error && (
        <button
          className={styles.generateButton}
          onClick={generateAnimation}
          aria-label={`Animate workflow: ${displayTitle}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>Animate Workflow: {displayTitle}</span>
        </button>
      )}

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span>Generating animation...</span>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
          <button className={styles.retryButton} onClick={generateAnimation}>
            Retry
          </button>
        </div>
      )}

      {frames.length > 0 && (
        <div className={styles.animationWrapper}>
          <div className={styles.header}>
            <h4>{gifTitle}</h4>
            <span className={styles.stepIndicator}>
              Step {currentStep + 1} of {frames.length}
            </span>
          </div>

          <div className={styles.frameContainer}>
            {frames[currentStep].url ? (
              <img
                src={frames[currentStep].url}
                alt={frames[currentStep].description}
                className={styles.frameImage}
              />
            ) : (
              <div className={styles.stepBox}>
                <div className={styles.stepNumber}>{currentStep + 1}</div>
                <div className={styles.stepDescription}>
                  {frames[currentStep].description}
                </div>
              </div>
            )}
          </div>

          <div className={styles.controls}>
            <button
              className={styles.controlButton}
              onClick={goToPrevious}
              aria-label="Previous step"
              title="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" />
              </svg>
            </button>

            <button
              className={`${styles.controlButton} ${styles.playButton}`}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              className={styles.controlButton}
              onClick={goToNext}
              aria-label="Next step"
              title="Next"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>
          </div>

          <div className={styles.progressBar}>
            {frames.map((_, index) => (
              <button
                key={index}
                className={`${styles.progressDot} ${index === currentStep ? styles.active : ''}`}
                onClick={() => goToStep(index)}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <div className={styles.stepList}>
            {frames.map((frame, index) => (
              <div
                key={index}
                className={`${styles.stepItem} ${index === currentStep ? styles.activeStep : ''}`}
                onClick={() => goToStep(index)}
              >
                <span className={styles.stepBadge}>{index + 1}</span>
                <span className={styles.stepText}>{frame.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
