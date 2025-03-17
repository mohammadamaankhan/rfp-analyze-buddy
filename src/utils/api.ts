
import { supabase } from '@/integrations/supabase/client';
import { RFPResult } from './types';
import { useQuery } from '@tanstack/react-query';

// Function to fetch document results for the current user
export const getUserDocuments = async (): Promise<RFPResult[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      id,
      file_name,
      file_size,
      file_type,
      created_at,
      document_analyses (
        id,
        project_name,
        deadline,
        budget,
        summary,
        requirements,
        stakeholders,
        evaluation_criteria,
        submission_instructions,
        contact_information
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }

  // Convert the data to the expected format
  return data.map(doc => {
    const analysis = doc.document_analyses?.[0] || {};
    
    return {
      id: doc.id,
      fileName: doc.file_name,
      fileSize: `${(doc.file_size / (1024 * 1024)).toFixed(2)} MB`,
      createdAt: doc.created_at,
      projectName: analysis.project_name || doc.file_name.split('.')[0],
      deadline: analysis.deadline || 'Not specified',
      budget: analysis.budget || 'Not specified',
      summary: analysis.summary || 'No summary available',
      requirements: analysis.requirements || [],
      stakeholders: analysis.stakeholders || [],
      evaluationCriteria: analysis.evaluation_criteria || [],
      submissionInstructions: analysis.submission_instructions || 'Not specified',
      contactInformation: analysis.contact_information || 'Not specified'
    };
  });
};

// Function to fetch a specific document by ID
export const getDocumentById = async (id: string): Promise<RFPResult> => {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      id,
      file_name,
      file_size,
      file_type,
      created_at,
      document_analyses (
        id,
        project_name,
        deadline,
        budget,
        summary,
        requirements,
        stakeholders,
        evaluation_criteria,
        submission_instructions,
        contact_information
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching document:', error);
    throw error;
  }

  const analysis = data.document_analyses?.[0] || {};

  return {
    id: data.id,
    fileName: data.file_name,
    fileSize: `${(data.file_size / (1024 * 1024)).toFixed(2)} MB`,
    createdAt: data.created_at,
    projectName: analysis.project_name || data.file_name.split('.')[0],
    deadline: analysis.deadline || 'Not specified',
    budget: analysis.budget || 'Not specified',
    summary: analysis.summary || 'No summary available',
    requirements: analysis.requirements || [],
    stakeholders: analysis.stakeholders || [],
    evaluationCriteria: analysis.evaluation_criteria || [],
    submissionInstructions: analysis.submission_instructions || 'Not specified',
    contactInformation: analysis.contact_information || 'Not specified'
  };
};

// Hook to fetch documents with React Query
export const useUserDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: getUserDocuments
  });
};

// Hook to fetch a specific document with React Query
export const useDocument = (id: string) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => getDocumentById(id),
    enabled: !!id
  });
};

// Mock data for demonstration purposes (fallback)
export const getMockResults = async (): Promise<RFPResult[]> => {
  try {
    const results = await getUserDocuments();
    if (results && results.length > 0) {
      return results;
    }
    
    // Fallback to mock data if no results are found
    return [
      {
        id: "123",
        projectName: "Railway Signaling System Upgrade",
        deadline: "October 15, 2023",
        budget: "$2.5M - $3.2M",
        requirements: [
          "Replace outdated signaling equipment across 15 stations",
          "Implement modern ETCS Level 2 signaling protocol",
          "Ensure compatibility with existing train control systems",
          "Provide training for operations staff",
          "Deliver comprehensive documentation"
        ],
        summary: "Unirail is seeking proposals for upgrading the signaling infrastructure across the northeastern corridor. The project aims to enhance safety, improve reliability, and increase train frequency capabilities through modern signaling technologies.",
        stakeholders: [
          "Operations Department",
          "Safety & Compliance Team",
          "IT Infrastructure Division",
          "Station Managers"
        ],
        evaluationCriteria: [
          "Technical expertise (30%)",
          "Previous experience with similar projects (25%)",
          "Cost efficiency (20%)",
          "Implementation timeline (15%)",
          "References and track record (10%)"
        ],
        submissionInstructions: "Proposals must be submitted electronically by 5:00 PM EST on the deadline date. All submissions should include technical specifications, project timeline, detailed budget breakdown, and team qualification documents.",
        contactInformation: "procurement@unirail.example.com",
        createdAt: "2023-09-18T14:32:00.000Z",
        fileName: "Unirail_RFP_2023-57.pdf",
        fileSize: "3.2 MB"
      },
      {
        id: "456",
        projectName: "Station Accessibility Improvements",
        deadline: "November 30, 2023",
        budget: "$1.8M - $2.3M",
        requirements: [
          "Install elevators at 5 key stations",
          "Upgrade platform edge detection systems",
          "Implement tactile guidance paths",
          "Enhance audio announcement systems",
          "Revise signage for improved visibility"
        ],
        summary: "This project focuses on enhancing accessibility across key stations in the Unirail network to comply with updated accessibility regulations and improve service for all passengers.",
        stakeholders: [
          "Accessibility Compliance Team",
          "Passenger Experience Department",
          "Engineering Division",
          "Legal Department"
        ],
        evaluationCriteria: [
          "Compliance with accessibility standards (35%)",
          "Innovation in solutions (20%)",
          "Cost efficiency (20%)",
          "Implementation timeline (15%)",
          "Minimal service disruption (10%)"
        ],
        submissionInstructions: "Proposals must include detailed designs, implementation methodology, timeline with milestones, and references from similar completed projects. Electronic submissions only.",
        contactInformation: "accessibility@unirail.example.com",
        createdAt: "2023-10-05T09:47:00.000Z",
        fileName: "Accessibility_RFP_2023-12.pdf",
        fileSize: "4.7 MB"
      }
    ];
  } catch (error) {
    console.error('Error in getMockResults:', error);
    return [];
  }
};

export const getMockResult = async (id: string): Promise<RFPResult | undefined> => {
  try {
    return await getDocumentById(id);
  } catch (error) {
    console.error('Error in getMockResult:', error);
    // Fallback to mock data
    const results = await getMockResults();
    return results.find(result => result.id === id);
  }
};
