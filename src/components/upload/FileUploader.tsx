
import React, { useState, useRef } from 'react';
import { Upload, File } from 'lucide-react';
import { ProcessingIndicator } from './ProcessingIndicator';
import { useNavigate } from 'react-router-dom';

export const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB');
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

  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage('Please select a file to upload');
      return;
    }

    setIsProcessing(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Simulate processing time after upload completes
          setTimeout(() => {
            setIsProcessing(false);
            // Navigate to results page after processing
            navigate('/document/123');
          }, 2000);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
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
        } ${file ? 'bg-secondary/30' : ''}`}
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
            <div className="rounded-full bg-secondary p-4 mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Drag & Drop or Click to Upload</h3>
            <p className="text-muted-foreground mb-2">
              Support for PDF, PNG, JPG, JPEG (Max 10MB)
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
            className="px-6 py-3 border border-border rounded-full text-foreground hover:bg-secondary/50 transition-colors"
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
