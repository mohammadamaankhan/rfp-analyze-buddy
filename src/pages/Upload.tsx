
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FileUploader } from '../components/upload/FileUploader';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [navigate]);
  
  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto py-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            Document Upload
          </div>
          <h1 className="text-3xl font-bold mb-3">Upload RFP Document</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your Request for Proposal document to extract and analyze key information. 
            Supported formats: PDF, PNG, JPG, and JPEG.
          </p>
        </div>
        
        <FileUploader />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-medium mb-2">Upload Document</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop or select your RFP document file
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-medium mb-2">Processing</h3>
            <p className="text-muted-foreground text-sm">
              Our AI extracts and analyzes the document content
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-medium mb-2">Review Results</h3>
            <p className="text-muted-foreground text-sm">
              View the organized insights from your document
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
