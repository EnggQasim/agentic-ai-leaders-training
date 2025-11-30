import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './styles.module.css';

interface PodcastPlayerProps {
  chapterId: string;
  chapterTitle: string;
  chapterContent?: string;
  className?: string;
}

interface PodcastData {
  success: boolean;
  podcast_id?: string;
  url?: string;
  title?: string;
  duration?: number;
  cached?: boolean;
  error?: string;
}

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : 'https://mqasim077-physical-ai-textbook-api.hf.space';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PodcastPlayer({
  chapterId,
  chapterTitle,
  chapterContent = '',
  className = '',
}: PodcastPlayerProps): JSX.Element {
  const [podcastUrl, setPodcastUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Check if podcast already exists on mount
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const response = await fetch(`${API_URL}/api/podcast/chapter/${chapterId}/info`);
        if (response.ok) {
          const data = await response.json();
          if (data.has_generated_podcast && data.podcast?.url) {
            setPodcastUrl(data.podcast.url);
          }
        }
      } catch {
        // Ignore errors on check
      }
    };
    checkExisting();
  }, [chapterId]);

  const generatePodcast = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/podcast/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapter_id: chapterId,
          chapter_content: chapterContent || `Content for ${chapterTitle}`,
          chapter_title: chapterTitle,
          force_regenerate: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate podcast');
      }

      const data: PodcastData = await response.json();

      if (data.success && data.url) {
        setPodcastUrl(data.url);
        setShowControls(true);
      } else {
        setError(data.error || 'Failed to generate podcast');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [chapterId, chapterTitle, chapterContent]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleDownload = () => {
    if (!podcastUrl) return;
    const link = document.createElement('a');
    link.href = podcastUrl;
    link.download = `${chapterTitle.replace(/\s+/g, '-')}-podcast.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className={`${styles.podcastContainer} ${className}`}>
      {!podcastUrl && !isLoading && !error && (
        <button
          className={styles.generateButton}
          onClick={generatePodcast}
          aria-label={`Generate podcast for ${chapterTitle}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span>Generate Podcast</span>
        </button>
      )}

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span>Generating podcast... This may take 1-2 minutes</span>
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
          <button className={styles.retryButton} onClick={generatePodcast}>
            Retry
          </button>
        </div>
      )}

      {podcastUrl && (
        <div className={styles.playerWrapper}>
          <audio
            ref={audioRef}
            src={podcastUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className={styles.playerHeader}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            <span className={styles.title}>Podcast: {chapterTitle}</span>
          </div>

          <div className={styles.mainControls}>
            <button
              className={styles.skipButton}
              onClick={() => skip(-15)}
              aria-label="Rewind 15 seconds"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
              <span>15</span>
            </button>

            <button
              className={styles.playButton}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              className={styles.skipButton}
              onClick={() => skip(15)}
              aria-label="Forward 15 seconds"
            >
              <span>15</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            </button>
          </div>

          <div className={styles.progressContainer}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className={styles.progressBar}
            />
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>

          <div className={styles.secondaryControls}>
            <div className={styles.volumeControl}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
              />
            </div>

            <div className={styles.playbackSpeed}>
              {[0.5, 1, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  className={`${styles.speedButton} ${playbackRate === rate ? styles.activeSpeed : ''}`}
                  onClick={() => changePlaybackRate(rate)}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <button
              className={styles.downloadButton}
              onClick={handleDownload}
              aria-label="Download podcast"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
