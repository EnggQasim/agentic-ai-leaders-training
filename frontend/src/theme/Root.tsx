import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';

// Wrap the Root component to include ChatWidget on all pages
export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
