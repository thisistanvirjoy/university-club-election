export interface Candidate {
  id: string;
  name: string;
  position: string;
  year: string;
  platform: string;
  experience: string[];
  photoUrl: string;
  photoFile?: File;
  email: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Position {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
}

export interface Voter {
  email: string;
  name: string;
  semester: string;
  studentId: string;
}

export interface Vote {
  positionId: string;
  candidateId: string;
  timestamp: number;
  voterEmail: string;
  voterName: string;
  voterSemester: string;
  voterStudentId: string;
}

export interface ElectionState {
  isAdmin: boolean;
  isVoting: boolean;
  isConfirmationStep: boolean;
  electionStartTime?: number;
  electionEndTime?: number;
  electionName: string;
  voters: Record<string, Voter>;
}

export interface ElectionConfig {
  name: string;
  positions: Position[];
}