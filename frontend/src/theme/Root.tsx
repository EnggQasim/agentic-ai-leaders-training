import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';
import { AuthProvider } from '@site/src/components/Auth';

// Wrap the Root component to include ChatWidget and AuthProvider on all pages
export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <AuthProvider>
      {children}
      <ChatWidget />
    </AuthProvider>
  );
}
