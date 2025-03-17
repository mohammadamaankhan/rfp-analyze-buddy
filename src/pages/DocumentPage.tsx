
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ResultsDisplay } from '../components/results/ResultsDisplay';
import { getMockResult, useDocument } from '../utils/api';
import { RFPResult } from '../utils/types';

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<RFPResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }
      
      try {
        const doc = await getMockResult(id);
        if (doc) {
          setResult(doc);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch document:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="max-w-screen-lg mx-auto py-6 text-center">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-4">Loading document...</h2>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !result) {
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
