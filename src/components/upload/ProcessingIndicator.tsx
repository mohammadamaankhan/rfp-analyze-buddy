
import React from 'react';

interface ProcessingIndicatorProps {
  progress: number;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ progress }) => {
  // Phase based on progress
  let phase = 'Uploading document';
  let detail = 'Preparing file for processing';
  
  if (progress > 40) {
    phase = 'Extracting text';
    detail = 'Using Mistral OCR to extract document content';
  }
  
  if (progress > 70) {
    phase = 'Analyzing content';
    detail = 'Using Gemini AI to analyze RFP information';
  }
  
  if (progress === 100) {
    phase = 'Finalizing results';
    detail = 'Preparing your analysis report';
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto glass-card p-8 animate-fade-up">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative h-32 w-32 mb-6">
          {/* Circular progress background */}
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
            />
            {/* Animated progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="transition-all duration-300 ease-in-out"
            />
          </svg>
          
          {/* Centered percentage */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold">
            {progress}%
          </div>
        </div>
        
        <h3 className="text-xl font-medium mb-2">{phase}</h3>
        <p className="text-muted-foreground mb-8">{detail}</p>
        
        {/* Processing steps */}
        <div className="w-full max-w-md grid grid-cols-3 gap-2">
          <div className={`flex flex-col items-center ${progress >= 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
            <div className={`h-2 w-2 rounded-full mb-2 ${progress >= 0 ? 'bg-primary' : 'bg-secondary'}`}></div>
            <span className="text-xs">Upload</span>
          </div>
          <div className={`flex flex-col items-center ${progress >= 40 ? 'text-foreground' : 'text-muted-foreground'}`}>
            <div className={`h-2 w-2 rounded-full mb-2 ${progress >= 40 ? 'bg-primary' : 'bg-secondary'}`}></div>
            <span className="text-xs">Extract</span>
          </div>
          <div className={`flex flex-col items-center ${progress >= 70 ? 'text-foreground' : 'text-muted-foreground'}`}>
            <div className={`h-2 w-2 rounded-full mb-2 ${progress >= 70 ? 'bg-primary' : 'bg-secondary'}`}></div>
            <span className="text-xs">Analyze</span>
          </div>
        </div>
        
        {/* Animated icons */}
        <div className="flex mt-8 space-x-8">
          <div className={`animate-pulse-opacity ${progress < 40 ? 'opacity-100' : 'opacity-0'}`}>
            <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className={`animate-pulse-opacity ${progress >= 40 && progress < 70 ? 'opacity-100' : 'opacity-0'}`}>
            <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className={`animate-pulse-opacity ${progress >= 70 ? 'opacity-100' : 'opacity-0'}`}>
            <svg className="h-6 w-6 text-primary animate-spin-slow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
