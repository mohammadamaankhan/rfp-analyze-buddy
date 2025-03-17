import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ResultsDisplay } from '../components/results/ResultsDisplay';
import { getMockResult, useDocument } from '../utils/api';
import { RFPResult } from '../utils/types';
import { supabaseClient } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface DocumentAnalysis {
  project_name?: string;
  deadline?: string;
  budget?: string;
  requirements?: string[];
  evaluation_criteria?: string[];
  stakeholders?: string[];
  summary?: string;
}

interface Document {
  id: string;
  file_name: string;
  created_at: string;
  analysis: DocumentAnalysis;
  ocr_text: string;
}

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchDocument = async () => {
      const { data, error } = await supabaseClient
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching document:', error);
        setError(true);
      } else {
        setDocument(data);
      }
      setLoading(false);
    };

    fetchDocument();
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !document) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Document not found</h2>
        </div>
      </Layout>
    );
  }
  
  const analysis = document?.analysis || {
    project_name: 'Processing...',
    deadline: 'Not available',
    budget: 'Not available',
    requirements: [],
    summary: 'Document analysis in progress'
  };

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto py-6">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading document</div>
        ) : document ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">{analysis.project_name}</h2>
              <p className="text-gray-600">{analysis.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.deadline && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Deadline</h3>
                  <p>{analysis.deadline}</p>
                </div>
              )}

              {analysis.budget && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Budget</h3>
                  <p>{analysis.budget}</p>
                </div>
              )}
            </div>

            {analysis.requirements && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Requirements</h3>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.evaluation_criteria && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Evaluation Criteria</h3>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.evaluation_criteria.map((criteria, index) => (
                    <li key={index} className="text-gray-700">{criteria}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ) : (
          <div>Document not found</div>
        )}
      </div>
    </Layout>
  );
};

export default DocumentPage;
