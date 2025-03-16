
import React from 'react';
import { Download, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RFPResult {
  id: string;
  projectName: string;
  deadline: string;
  budget: string;
  requirements: string[];
  summary: string;
  stakeholders: string[];
  evaluationCriteria: string[];
  submissionInstructions: string;
  contactInformation: string;
}

interface ResultsDisplayProps {
  result: RFPResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-up">
      {/* Header section */}
      <div className="glass-card p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              RFP Analysis
            </div>
            <h1 className="text-3xl font-bold">{result.projectName}</h1>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-border bg-background hover:bg-secondary/50 transition-colors">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-border bg-background hover:bg-secondary/50 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-secondary/30 border border-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Deadline</p>
            <p className="font-medium">{result.deadline}</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Budget</p>
            <p className="font-medium">{result.budget}</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Contact</p>
            <p className="font-medium">{result.contactInformation}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-medium mb-2">Summary</h3>
          <p className="text-muted-foreground">{result.summary}</p>
        </div>
      </div>
      
      {/* Requirements section */}
      <div className="glass-card p-8 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
        <ul className="space-y-2">
          {result.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p>{req}</p>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Stakeholders and Evaluation sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold mb-4">Stakeholders</h2>
          <ul className="space-y-2">
            {result.stakeholders.map((stakeholder, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                <p>{stakeholder}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold mb-4">Evaluation Criteria</h2>
          <ul className="space-y-2">
            {result.evaluationCriteria.map((criteria, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                <p>{criteria}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Submission Instructions */}
      <div className="glass-card p-8 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Submission Instructions</h2>
        <p className="text-muted-foreground">{result.submissionInstructions}</p>
      </div>
    </div>
  );
};
