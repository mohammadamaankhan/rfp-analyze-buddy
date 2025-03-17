
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getMockResults, useUserDocuments } from '../utils/api';
import { FileText, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import { RFPResult } from '../utils/types';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<RFPResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Fetch results
    const fetchResults = async () => {
      try {
        const data = await getMockResults();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [navigate]);
  
  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto py-6">
        <div className="mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            Document History
          </div>
          <h1 className="text-3xl font-bold mb-3">Analysis Results</h1>
          <p className="text-muted-foreground">
            View and manage your previously analyzed RFP documents.
          </p>
        </div>
        
        {loading ? (
          <div className="glass-card p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Loading documents...</h3>
          </div>
        ) : results.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="rounded-full bg-secondary p-4 inline-flex mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No documents analyzed yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first RFP document to get started with the analysis.
            </p>
            <Link to="/upload" className="glass-button inline-flex">
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <Link 
                key={result.id} 
                to={`/document/${result.id}`}
                className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-md transition-all duration-200 animate-fade-up"
              >
                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                  <div className="rounded-lg bg-primary/10 p-3 mt-1">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{result.projectName}</h3>
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(result.createdAt).toLocaleDateString()} • {result.fileName} • {result.fileSize}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-secondary/50 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {result.deadline}
                      </div>
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-secondary/50 text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {result.budget}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center ml-auto">
                  <span className="text-muted-foreground text-sm mr-2">View Details</span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Link to="/upload" className="glass-button">
            Upload New Document
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
