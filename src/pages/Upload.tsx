import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { uploadDocument } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

type UploadStage = 'upload' | 'extract' | 'analyze' | 'complete';

const Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<UploadStage>('upload');
  const navigate = useNavigate();

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setCurrentStage('upload');
      
      // Initial upload stage (0-30%)
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 25) {
            clearInterval(uploadInterval);
            return 25;
          }
          return prev + 5;
        });
      }, 100);

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        clearInterval(uploadInterval);
        setIsUploading(false);
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, PNG, JPG, or JPEG file.",
          variant: "destructive",
        });
        return;
      }

      // Start extraction stage (25-60%)
      setCurrentStage('extract');
      const extractInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 55) {
            clearInterval(extractInterval);
            return 55;
          }
          return Math.min(prev + 2, 55);
        });
      }, 200);

      // Upload and process the document
      const document = await uploadDocument(file);
      clearInterval(extractInterval);

      // Analysis stage (60-95%)
      setCurrentStage('analyze');
      setUploadProgress(60);
      
      const analysisInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(analysisInterval);
            return 95;
          }
          return Math.min(prev + 3, 95);
        });
      }, 300);

      // Completion stage
      await new Promise(resolve => setTimeout(resolve, 500));
      clearInterval(analysisInterval);
      setCurrentStage('complete');
      setUploadProgress(100);

      // Show success message and navigate
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been processed with OCR.",
      });

      navigate(`/document/${document.id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Failed to upload document",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentStage('upload');
    }
  };

  const getStageColor = (stage: string) => {
    switch (currentStage) {
      case 'upload':
        return stage === 'upload' ? 'text-orange-600' : 'text-gray-400';
      case 'extract':
        return ['upload', 'extract'].includes(stage) ? 'text-orange-600' : 'text-gray-400';
      case 'analyze':
        return ['upload', 'extract', 'analyze'].includes(stage) ? 'text-orange-600' : 'text-gray-400';
      case 'complete':
        return 'text-orange-600';
      default:
        return 'text-gray-400';
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
            Document Upload
          </motion.div>
          <h1 className="text-3xl font-bold mb-3">Upload RFP Document</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your Request for Proposal document to extract and analyze key information. 
            Supported formats: PDF, PNG, JPG, and JPEG.
          </p>
        </div>

        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto text-center p-8 rounded-lg bg-white shadow-sm"
          >
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-orange-600 transition-all duration-300"
                  strokeWidth="10"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 45}`,
                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - uploadProgress / 100)}`
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold text-orange-600">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {currentStage === 'upload' && 'Uploading document...'}
              {currentStage === 'extract' && 'Extracting content...'}
              {currentStage === 'analyze' && 'Analyzing content...'}
              {currentStage === 'complete' && 'Processing complete!'}
            </h3>
            <p className="text-gray-600">Using AI to analyze RFP information</p>
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <div className={`text-sm ${getStageColor('upload')}`}>Upload</div>
                <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${getStageColor('upload')} bg-current`} />
              </div>
              <div className="text-center">
                <div className={`text-sm ${getStageColor('extract')}`}>Extract</div>
                <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${getStageColor('extract')} bg-current`} />
              </div>
              <div className="text-center">
                <div className={`text-sm ${getStageColor('analyze')}`}>Analyze</div>
                <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${getStageColor('analyze')} bg-current`} />
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="border-2 border-dashed border-orange-200 rounded-lg p-12 text-center max-w-2xl mx-auto bg-orange-50/50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Select File
          </label>
          <p className="mt-2 text-sm text-muted-foreground">
            or drag and drop your file here
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: 1,
              title: "Upload Document",
              description: "Drag and drop or select your RFP document file"
            },
            {
              step: 2,
              title: "Processing",
              description: "Our AI extracts and analyzes the document content"
            },
            {
              step: 3,
              title: "Review Results",
              description: "View the organized insights from your document"
            }
          ].map((item, index) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                {item.step}
              </div>
              <h3 className="font-medium mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
