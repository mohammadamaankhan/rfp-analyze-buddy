
import { RFPResult } from './types';

// Mock data for demonstration purposes
export const getMockResults = (): RFPResult[] => {
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
};

export const getMockResult = (id: string): RFPResult | undefined => {
  return getMockResults().find(result => result.id === id);
};
