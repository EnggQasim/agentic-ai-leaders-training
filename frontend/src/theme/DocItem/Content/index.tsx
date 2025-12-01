import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type { Props } from '@theme/DocItem/Content';
import PodcastPlayer from '@site/src/components/PodcastPlayer';
import SummaryPanel from '@site/src/components/SummaryPanel';
import MindMapViewer from '@site/src/components/MindMapViewer';
import styles from './styles.module.css';

// Extract text content from MDX children for AI features
function extractTextContent(children: React.ReactNode): string {
  let text = '';
  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      text += child;
    } else if (React.isValidElement(child) && child.props.children) {
      text += extractTextContent(child.props.children);
    }
  });
  return text.slice(0, 8000); // Limit to 8000 chars for AI processing
}

function useSyntheticTitle(): string | null {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

type TabType = 'content' | 'summary' | 'mindmap';

export default function DocItemContent({ children }: Props): JSX.Element {
  const syntheticTitle = useSyntheticTitle();
  const { metadata, frontMatter } = useDoc();
  const [activeTab, setActiveTab] = useState<TabType>('content');

  // Generate chapter ID from the doc path
  const chapterId = metadata.id.replace(/\//g, '-');
  const chapterTitle = metadata.title;

  // Extract content for AI features
  const chapterContent = typeof children === 'string'
    ? children
    : extractTextContent(children);

  // Navigate from mind map node to content section
  const handleNavigateToSection = useCallback((anchor: string) => {
    setActiveTab('content');
    // Small delay to allow tab switch, then scroll
    setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add brief highlight
        element.classList.add(styles.highlight);
        setTimeout(() => element.classList.remove(styles.highlight), 2000);
      }
    }, 100);
  }, []);

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle ? (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      ) : null}

      {/* Podcast Player - compact bar at the top of each chapter */}
      <PodcastPlayer
        chapterId={chapterId}
        chapterTitle={chapterTitle}
        chapterContent={chapterContent}
        compact={true}
      />

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <div className={styles.tabList} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'content'}
            className={clsx(styles.tab, activeTab === 'content' && styles.activeTab)}
            onClick={() => setActiveTab('content')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Content
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'summary'}
            className={clsx(styles.tab, activeTab === 'summary' && styles.activeTab)}
            onClick={() => setActiveTab('summary')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Summary
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'mindmap'}
            className={clsx(styles.tab, activeTab === 'mindmap' && styles.activeTab)}
            onClick={() => setActiveTab('mindmap')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
            </svg>
            Mind Map
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className={styles.tabPanels}>
        {activeTab === 'content' && (
          <div role="tabpanel" className={styles.tabPanel}>
            <MDXContent>{children}</MDXContent>
          </div>
        )}

        {activeTab === 'summary' && (
          <div role="tabpanel" className={styles.tabPanel}>
            <SummaryPanel
              chapterId={chapterId}
              chapterTitle={chapterTitle}
              chapterContent={chapterContent}
            />
          </div>
        )}

        {activeTab === 'mindmap' && (
          <div role="tabpanel" className={styles.tabPanel}>
            <MindMapViewer
              chapterId={chapterId}
              chapterTitle={chapterTitle}
              chapterContent={chapterContent}
              onNavigateToSection={handleNavigateToSection}
            />
          </div>
        )}
      </div>
    </div>
  );
}
