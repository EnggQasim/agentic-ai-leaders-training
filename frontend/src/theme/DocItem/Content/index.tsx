import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/DocItem/Content';
import PodcastPlayer from '@site/src/components/PodcastPlayer';

// Extract text content from MDX children for podcast
function extractTextContent(children: React.ReactNode): string {
  let text = '';
  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      text += child;
    } else if (React.isValidElement(child) && child.props.children) {
      text += extractTextContent(child.props.children);
    }
  });
  return text.slice(0, 5000); // Limit to 5000 chars for podcast
}

function useSyntheticTitle(): string | null {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({children}: Props): JSX.Element {
  const syntheticTitle = useSyntheticTitle();
  const {metadata, frontMatter} = useDoc();

  // Generate chapter ID from the doc path
  const chapterId = metadata.id.replace(/\//g, '-');
  const chapterTitle = metadata.title;

  // Extract content for podcast (simplified)
  const chapterContent = typeof children === 'string'
    ? children
    : extractTextContent(children);

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

      <MDXContent>{children}</MDXContent>
    </div>
  );
}
