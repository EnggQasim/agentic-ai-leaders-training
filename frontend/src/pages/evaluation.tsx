import React from 'react';
import Layout from '@theme/Layout';
import EvaluationForm from '@site/src/components/EvaluationForm';

export default function EvaluationPage(): JSX.Element {
  return (
    <Layout
      title="Training Evaluation Form"
      description="SIEHS Agentic AI Training Evaluation Form - Share your feedback"
    >
      <main style={{ padding: '2rem 0' }}>
        <EvaluationForm />
      </main>
    </Layout>
  );
}
