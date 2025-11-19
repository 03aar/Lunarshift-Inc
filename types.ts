export enum ViewState {
  LANDING,
  EMAIL,
  TERMS,
  INSTRUCTIONS,
  STAGE_1, // Common Interview
  STAGE_2, // IT Simulation
  REPORT,
  DASHBOARD
}

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export interface Candidate {
  email: string;
  stage1Score?: number;
  stage2Score?: number;
  fraudScore?: number;
  status: 'Pending' | 'Stage 1 Passed' | 'Stage 2 Passed' | 'Completed' | 'Flagged';
}

export interface AntiCheatStatus {
  tabSwitches: number;
  facesDetected: number;
  eyeContactLost: number;
  suspiciousAudio: number;
  deepfakeConfidence: number; // 0-100, lower is better
}

export enum InterviewMode {
  STRICT = 'Strict',
  CASUAL = 'Casual',
  FORMAL = 'Formal'
}