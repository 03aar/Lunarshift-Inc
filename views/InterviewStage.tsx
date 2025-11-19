import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Card, Layout, Badge } from '../components/Common';
import { ViewState, Message, AntiCheatStatus } from '../types';
import { generateQuestion, evaluateResponse } from '../services/geminiService';
import { Mic, MicOff, Video, VideoOff, Play, SkipForward, AlertOctagon, Terminal } from 'lucide-react';

interface InterviewStageProps {
  stage: 1 | 2;
  setViewState: (view: ViewState) => void;
  updateAntiCheat: (stats: Partial<AntiCheatStatus>) => void;
  saveResult: (score: number) => void;
}

export const InterviewStage: React.FC<InterviewStageProps> = ({ stage, setViewState, updateAntiCheat, saveResult }) => {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('Initializing AI interviewer...');
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [timer, setTimer] = useState(0);
  const [code, setCode] = useState('// Write your solution here\n\nfunction solve(input) {\n  \n}');
  const [cameraOn, setCameraOn] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const timerInterval = useRef<number | undefined>(undefined);

  // --- Initialization ---
  useEffect(() => {
    startCamera();
    loadNextQuestion();
    
    // Anti-cheat: Tab Focus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateAntiCheat({ tabSwitches: 1 });
        triggerWarning("Tab switch detected. Please stay on this page.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Timer
    timerInterval.current = window.setInterval(() => setTimer(t => t + 1), 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(timerInterval.current);
      stopCamera();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Anti-Cheat Loop (Simulated) ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Random check for demo purposes
      if (Math.random() > 0.98) {
        triggerWarning("Please maintain eye contact with the camera.");
        updateAntiCheat({ eyeContactLost: 1 });
      }
      if (Math.random() > 0.99) {
        // updateAntiCheat({ facesDetected: 1 }); // Too annoying for demo
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [updateAntiCheat]);

  const triggerWarning = (msg: string) => {
    setWarning(msg);
    setTimeout(() => setWarning(null), 4000);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.error("Camera error", e);
      setCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // --- Game Logic ---
  const loadNextQuestion = async () => {
    const q = await generateQuestion(stage, stage === 1 ? "teamwork" : "array manipulation", "Strict");
    setCurrentQuestion(q);
    addMessage('ai', q);
  };

  const handleNext = async () => {
    // Determine response to evaluate
    const lastUserMsg = messages.filter(m => m.sender === 'user').pop()?.text || "";
    
    if (!lastUserMsg && !code) {
       triggerWarning("Please provide an answer before proceeding.");
       return;
    }

    const result = await evaluateResponse(currentQuestion, lastUserMsg, stage === 2 ? code : undefined);
    saveResult(result.score);

    if (stage === 1) {
       // Move to stage 2 after 1 question for demo speed
       setViewState(ViewState.STAGE_2);
    } else {
       setViewState(ViewState.REPORT);
    }
  };

  const addMessage = (sender: 'ai' | 'user', text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender, text, timestamp: Date.now() }]);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setLiveTranscript('');
    transcriptRef.current = '';

    // Browser Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const current = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setLiveTranscript(current);
        transcriptRef.current = current;
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
           triggerWarning("Microphone access denied.");
           setIsRecording(false);
        }
      };

      recognitionRef.current.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    const finalText = transcriptRef.current.trim();
    if (finalText) {
      addMessage('user', finalText);
    } else {
      // Fallback if nothing was captured
      triggerWarning("No audio detected. Please try again.");
    }
    setLiveTranscript('');
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, liveTranscript, isRecording]);

  return (
    <Layout className="h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 border-b border-black flex items-center justify-between px-6 bg-white z-10">
        <span className="font-bold text-sm">Stage {stage} of 2 – {stage === 1 ? 'Common Interview' : 'IT Job Simulation'}</span>
        <div className="flex items-center gap-4">
          <Badge active>{formatTime(timer)}</Badge>
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} title="Recording Status" />
        </div>
      </div>

      <div className="flex flex-1 h-[calc(100vh-3.5rem)]">
        {/* Left: Main Interaction Area (70%) */}
        <div className="w-[70%] p-6 flex flex-col gap-6 bg-gray-50 relative">
          {/* Warning Overlay */}
          {warning && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-pill flex items-center gap-2 shadow-lg animate-bounce">
              <AlertOctagon className="w-4 h-4" />
              {warning}
            </div>
          )}

          {/* Question Card */}
          <Card className="bg-white shrink-0">
             <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Current Question</h3>
             <p className="text-xl font-medium">{currentQuestion}</p>
          </Card>

          {/* Content Area: Video or Code */}
          <div className="flex-1 bg-white border border-black rounded-card overflow-hidden relative shadow-[0_4px_0_0_rgba(0,0,0,1)]">
             {stage === 2 && (
               <div className="absolute inset-0 z-0 flex flex-col">
                 <div className="h-8 border-b border-black bg-gray-100 flex items-center px-4 text-xs font-mono">main.js</div>
                 <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
                    spellCheck={false}
                 />
                 <div className="h-32 border-t border-black bg-black text-white p-4 font-mono text-xs overflow-y-auto">
                    <div className="flex items-center gap-2 mb-2 text-gray-400"><Terminal className="w-3 h-3"/> Console Output</div>
                    {/* Simulated output */}
                    <span className="text-green-400">Waiting for execution...</span>
                 </div>
               </div>
             )}

             {/* The User Video is always visible, but smaller in Stage 2 */}
             <div className={`absolute transition-all duration-300 border-black bg-black overflow-hidden shadow-lg
                ${stage === 1 ? 'inset-0 rounded-none' : 'bottom-4 right-4 w-48 h-36 rounded-card border-2'}
             `}>
               <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-90" />
               
               {/* Anti-Cheat Overlay Visuals */}
               <div className="absolute top-2 left-2 flex gap-1">
                 <div className="w-2 h-2 bg-green-500 rounded-full" /> {/* Liveness */}
                 <div className="w-2 h-2 bg-green-500 rounded-full" /> {/* Eye Track */}
               </div>
               {!cameraOn && <div className="absolute inset-0 flex items-center justify-center text-white">Camera Off</div>}
             </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button onClick={() => setCameraOn(!cameraOn)} className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button 
              onClick={toggleRecording}
              className={`h-16 px-8 rounded-pill border border-black flex items-center justify-center gap-3 font-bold transition-all ${isRecording ? 'bg-red-600 text-white border-red-600' : 'bg-black text-white hover:scale-105'}`}
            >
              {isRecording ? <><MicOff className="w-5 h-5" /> Stop Answer</> : <><Mic className="w-5 h-5" /> Start Answer</>}
            </button>
            <button onClick={handleNext} className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Transcript (30%) */}
        <div className="w-[30%] border-l border-black bg-white flex flex-col">
          <div className="p-4 border-b border-black font-bold bg-gray-50">Live Transcript</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={containerRef}>
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">{m.sender} • {new Date(m.timestamp).toLocaleTimeString()}</span>
                <div className={`max-w-[90%] p-3 rounded-2xl text-sm border border-black ${m.sender === 'ai' ? 'bg-gray-100 rounded-tl-none' : 'bg-black text-white rounded-tr-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isRecording && (
               <div className="flex flex-col items-end">
                 <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">User • Listening...</span>
                 <div className="bg-gray-100 p-3 rounded-2xl rounded-tr-none text-sm border border-gray-200 text-gray-800 italic animate-pulse">
                   {liveTranscript || "Listening..."}
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
