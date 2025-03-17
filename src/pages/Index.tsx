
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (user && !loading) {
      navigate('/upload');
    }
  }, [navigate, user, loading]);

  if (loading) {
    return (
      <Layout showNav={false}>
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showNav={false}>
      <div className="flex-grow flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary rounded-full text-white mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
              <path d="M10 9H8"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold">Unirail RFP Analyzer</h1>
          <p className="mt-3 text-muted-foreground">
            Extract and analyze information from your Request for Proposal documents using advanced AI.
          </p>
        </div>
        
        <AuthForm />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
          <div className="glass-card p-6 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
            <p className="text-muted-foreground text-sm">
              Easily upload RFP documents in PDF or image formats for analysis.
            </p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Automatically extract key information using advanced AI technology.
            </p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Review Results</h3>
            <p className="text-muted-foreground text-sm">
              Get organized results highlighting key information from your RFPs.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
