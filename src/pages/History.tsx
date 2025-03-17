import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { supabaseClient } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatFileSize, formatDate } from '@/lib/utils';

interface Document {
  id: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

const History = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabaseClient
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
      } else {
        setDocuments(data || []);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto py-6">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-2"
          >
            Document History
          </motion.div>
          <h1 className="text-3xl font-bold mb-3">Analysis Results</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            View and manage your previously analyzed RFP documents.
          </p>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-50 rounded">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{doc.file_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{formatDate(doc.created_at)}</span>
                    <span>•</span>
                    <span>{doc.file_name}</span>
                    <span>•</span>
                    <span>{formatFileSize(doc.file_size)}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <span className="text-sm text-gray-500">Not specified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <span className="text-sm text-gray-500">Not specified</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/document/${doc.id}`}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/upload"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Upload New Document
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default History; 