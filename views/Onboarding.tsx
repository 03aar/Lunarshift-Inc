import React, { useState } from 'react';
import { Button, Input, Card, Layout } from '../components/Common';
import { ArrowRight, Check, Shield, Eye, UserX, Monitor, AlertTriangle } from 'lucide-react';
import { ViewState } from '../types';

interface OnboardingProps {
  setViewState: (view: ViewState) => void;
  setCandidateEmail: (email: string) => void;
}

export const LandingView: React.FC<OnboardingProps> = ({ setViewState }) => (
  <Layout className="items-center justify-center">
    <div className="text-center space-y-8 animate-fade-in-up">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Welcome to your<br/>AI Interview</h1>
      <p className="text-lg max-w-md mx-auto">Minimal. Fair. Intelligent.</p>
      <Button onClick={() => setViewState(ViewState.EMAIL)}>
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  </Layout>
);

export const EmailView: React.FC<OnboardingProps> = ({ setViewState, setCandidateEmail }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setCandidateEmail(email);
      setViewState(ViewState.TERMS);
    }
  };

  return (
    <Layout className="items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 text-center">
        <h2 className="text-2xl font-bold">Identify Yourself</h2>
        <Input 
          type="email" 
          placeholder="Enter your email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          required
        />
        <Button type="submit" className="w-full">Proceed</Button>
      </form>
    </Layout>
  );
};

export const TermsView: React.FC<OnboardingProps> = ({ setViewState }) => {
  const [scrolled, setScrolled] = useState(false);
  const [accepted, setAccepted] = useState({ privacy: false, cheat: false });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setScrolled(true);
    }
  };

  return (
    <Layout className="items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6">
        <h2 className="text-2xl font-bold text-center">Terms & Consent</h2>
        
        <Card className="h-64 overflow-y-auto" >
          <div onScroll={handleScroll} className="space-y-4 text-sm leading-relaxed">
            <h3 className="font-bold">1. Data Collection</h3>
            <p>We collect video and audio data solely for the purpose of evaluation. Data is encrypted and stored securely.</p>
            <h3 className="font-bold">2. Anti-Cheat Monitoring</h3>
            <p>This platform utilizes advanced AI to ensure fairness. By proceeding, you consent to real-time monitoring including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Eye tracking analysis for focus verification.</li>
              <li>Audio environment analysis to detect secondary voices (helpers).</li>
              <li>Browser focus monitoring (tab switching).</li>
              <li>Deepfake detection algorithms on video frames.</li>
            </ul>
            <h3 className="font-bold">3. Code Integrity</h3>
            <p>Code submissions are analyzed against verbal reasoning. Copy-pasting large blocks without explanation will be flagged.</p>
            <div className="h-10"></div> {/* Spacer for scroll trigger */}
          </div>
        </Card>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 border border-black rounded-card hover:bg-gray-50 transition-colors">
            <div className={`w-6 h-6 rounded-full border border-black flex items-center justify-center ${accepted.privacy ? 'bg-black text-white' : 'bg-white'}`}>
              {accepted.privacy && <Check className="w-4 h-4" />}
            </div>
            <input type="checkbox" className="hidden" onChange={() => setAccepted(p => ({...p, privacy: !p.privacy}))} />
            <span className="text-sm font-medium">I accept the Privacy Policy and Data Processing terms.</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 border border-black rounded-card hover:bg-gray-50 transition-colors">
            <div className={`w-6 h-6 rounded-full border border-black flex items-center justify-center ${accepted.cheat ? 'bg-black text-white' : 'bg-white'}`}>
              {accepted.cheat && <Check className="w-4 h-4" />}
            </div>
            <input type="checkbox" className="hidden" onChange={() => setAccepted(p => ({...p, cheat: !p.cheat}))} />
            <span className="text-sm font-medium">I consent to Anti-Cheat monitoring during the session.</span>
          </label>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            disabled={!accepted.privacy || !accepted.cheat}
            onClick={() => setViewState(ViewState.INSTRUCTIONS)}
            className="w-full md:w-auto"
          >
            Accept & Continue
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export const InstructionsView: React.FC<OnboardingProps> = ({ setViewState }) => (
  <Layout className="items-center justify-center p-6">
    <div className="max-w-4xl w-full space-y-12">
      <h2 className="text-3xl font-bold text-center">Session Guidelines</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="space-y-6 border-black">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"><Check className="w-5 h-5" /></div>
            DO
          </h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-start gap-3">
              <Monitor className="w-5 h-5 shrink-0" />
              Keep your camera enabled and face visible at all times.
            </li>
            <li className="flex items-start gap-3">
              <Eye className="w-5 h-5 shrink-0" />
              Maintain eye contact with the screen.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 font-mono text-center font-bold border border-black rounded text-xs leading-5">Aa</div>
              Speak clearly and think aloud during coding tasks.
            </li>
          </ul>
        </Card>

        <Card className="space-y-6 border-black">
          <h3 className="text-xl font-bold flex items-center gap-2">
             <div className="w-8 h-8 rounded-full border border-black bg-white text-black flex items-center justify-center"><UserX className="w-5 h-5" /></div>
            DON'T
          </h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-start gap-3">
              <UserX className="w-5 h-5 shrink-0" />
              Have other people in the room.
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-5 h-5 shrink-0" />
              Switch tabs or minimize the browser window.
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Look away for extended periods or use a phone.
            </li>
          </ul>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setViewState(ViewState.STAGE_1)} className="px-12">
          Start Stage 1
        </Button>
      </div>
    </div>
  </Layout>
);