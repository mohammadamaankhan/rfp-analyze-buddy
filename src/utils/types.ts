export interface RFPResult {
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
  createdAt: string;
  fileName: string;
  fileSize: string;
}

export interface DocumentAnalysis {
  id: string;
  project_name: string | null;
  deadline: string | null;
  budget: string | null;
  summary: string | null;
  requirements: string[] | null;
  stakeholders: string[] | null;
  evaluation_criteria: string[] | null;
  submission_instructions: string | null;
  contact_information: string | null;
}

export interface Document {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  created_at: string;
  document_analyses: DocumentAnalysis[];
}
