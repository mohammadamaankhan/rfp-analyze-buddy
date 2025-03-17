
import React, { useState, useRef } from 'react';
import { Upload, File } from 'lucide-react';
import { ProcessingIndicator } from './ProcessingIndicator';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const allowedTypes = [
    'application/pdf', 
    'image/jpeg', 
    'image/png', 
    'image/jpg'
  ];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload a PDF or image file (PNG, JPG, JPEG)');
      return false;
    }
    
    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage('File size must be less than 100MB');
      return false;
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMessage(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processDocument = async (filePath: string, documentId: string) => {
    try {
      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Set upload phase complete
      setUploadProgress(40);
      
      // Call Supabase Edge Function to process the document with Mistral OCR
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: { 
          fileUrl: publicUrl,
          documentId: documentId,
          userId: user?.id
        }
      });

      if (error) {
        throw new Error(`Error processing document: ${error.message}`);
      }

      // Update progress for OCR phase
      setUploadProgress(70);
      
      // Set a timeout to simulate AI analysis phase
      setTimeout(() => {
        setUploadProgress(100);
        
        // Navigate to document page after a short delay
        setTimeout(() => {
          setIsProcessing(false);
          toast.success('Document analysis complete');
          navigate(`/document/${documentId}`);
        }, 1000);
      }, 2000);
      
      return data;
    } catch (error) {
      console.error('Error in processDocument:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!file || !user) {
      setErrorMessage('Please select a file to upload');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Simulate initial upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 35) {
            clearInterval(interval);
            return 35;
          }
          return prev + 5;
        });
      }, 200);
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Store document metadata in the database
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type
        })
        .select()
        .single();
      
      if (insertError) {
        throw insertError;
      }
      
      clearInterval(interval);
      
      // Process the document with OCR
      await processDocument(filePath, document.id);
      
    } catch (error: any) {
      console.error('Error uploading document:', error.message);
      toast.error('Failed to upload document. Please try again.');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFile(null);
    setErrorMessage(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isProcessing) {
    return <ProcessingIndicator progress={uploadProgress} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto glass-card p-8 animate-fade-up">
      <h2 className="text-2xl font-semibold text-center mb-6">Upload RFP Document</h2>
      
      {/* Error message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive animate-fade-in">
          {errorMessage}
        </div>
      )}
      
      {/* File upload zone */}
      <div
        className={`upload-zone flex flex-col items-center justify-center text-center cursor-pointer ${
          isDragging ? 'border-primary' : ''
        } ${file ? 'bg-orange-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        
        {!file ? (
          <>
            <div className="rounded-full bg-orange-100 p-4 mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Drag & Drop or Click to Upload</h3>
            <p className="text-muted-foreground mb-2">
              Support for PDF, PNG, JPG, JPEG (Max 100MB)
            </p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <File className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">{file.name}</h3>
            <p className="text-muted-foreground mb-2">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
        {file && (
          <button
            onClick={resetForm}
            className="px-6 py-3 border border-orange-200 rounded-md text-foreground hover:bg-orange-50 transition-colors"
          >
            Remove File
          </button>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={!file}
          className={`glass-button ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Analyze Document
        </button>
      </div>
    </div>
  );
};
