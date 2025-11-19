import React, { useState } from 'react';
import { ViewState, Candidate, AntiCheatStatus } from './types';
import { LandingView, EmailView, TermsView, InstructionsView } from './views/Onboarding';
import { InterviewStage } from './views/InterviewStage';
import { ReportView } from './views/ReportView';
import { RecruiterDashboard } from './views/RecruiterDashboard';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  
  // Global Application State
  const [candidateData, setCandidateData] = useState<Candidate>({
    email: '',
    status: 'Pending'
  });

  const [antiCheatData, setAntiCheatData] = useState<AntiCheatStatus>({
    tabSwitches: 0,
    facesDetected: 1,
    eyeContactLost: 0,
    suspiciousAudio: 0,
    deepfakeConfidence: 2 // Mock low probability
  });

  const updateAntiCheat = (stats: Partial<AntiCheatStatus>) => {
    setAntiCheatData(prev => ({ ...prev, ...stats }));
  };

  const handleCandidateEmail = (email: string) => {
    setCandidateData(prev => ({ ...prev, email }));
  };

  const handleStage1Result = (score: number) => {
    setCandidateData(prev => ({ ...prev, stage1Score: score, status: 'Stage 1 Passed' }));
  };

  const handleStage2Result = (score: number) => {
    setCandidateData(prev => ({ ...prev, stage2Score: score, status: 'Completed' }));
  };

  // View Router
  const renderView = () => {
    switch (viewState) {
      case ViewState.LANDING:
        return <LandingView setViewState={setViewState} setCandidateEmail={handleCandidateEmail} />;
      case ViewState.EMAIL:
        return <EmailView setViewState={setViewState} setCandidateEmail={handleCandidateEmail} />;
      case ViewState.TERMS:
        return <TermsView setViewState={setViewState} setCandidateEmail={handleCandidateEmail} />;
      case ViewState.INSTRUCTIONS:
        return <InstructionsView setViewState={setViewState} setCandidateEmail={handleCandidateEmail} />;
      case ViewState.STAGE_1:
        return (
          <InterviewStage 
            stage={1} 
            setViewState={setViewState} 
            updateAntiCheat={updateAntiCheat}
            saveResult={handleStage1Result}
          />
        );
      case ViewState.STAGE_2:
        return (
          <InterviewStage 
            stage={2} 
            setViewState={setViewState} 
            updateAntiCheat={updateAntiCheat}
            saveResult={handleStage2Result}
          />
        );
      case ViewState.REPORT:
        return (
          <ReportView 
            setViewState={setViewState} 
            candidateData={candidateData}
            antiCheatData={antiCheatData}
          />
        );
      case ViewState.DASHBOARD:
        return <RecruiterDashboard setViewState={setViewState} />;
      default:
        return <LandingView setViewState={setViewState} setCandidateEmail={handleCandidateEmail} />;
    }
  };

  return (
    <div className="antialiased text-black">
      {renderView()}
    </div>
  );
};

export default App;