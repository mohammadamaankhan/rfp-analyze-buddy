
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ResultsDisplay } from '../components/results/ResultsDisplay';
import { getMockResult } from '../utils/api';

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const result = id ? getMockResult(id) : undefined;
  
  if (!result) {
    return (
      <Layout>
        <div className="max-w-screen-lg mx-auto py-6 text-center">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-4">Document Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The document you're looking for doesn't exist or has been removed.
            </p>
            <button 
              onClick={() => navigate('/results')} 
              className="glass-button"
            >
              Back to Results
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto py-6">
        <ResultsDisplay result={result} />
      </div>
    </Layout>
  );
};

export default DocumentPage;
