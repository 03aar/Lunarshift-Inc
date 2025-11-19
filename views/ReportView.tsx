import React from 'react';
import { Button, Card, Layout, Badge } from '../components/Common';
import { ViewState, Candidate, AntiCheatStatus } from '../types';
import { Download, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportProps {
  setViewState: (view: ViewState) => void;
  candidateData: Candidate;
  antiCheatData: AntiCheatStatus;
}

export const ReportView: React.FC<ReportProps> = ({ setViewState, candidateData, antiCheatData }) => {
  
  const metrics = [
    { name: 'Communication', score: candidateData.stage1Score || 0 },
    { name: 'Technical', score: candidateData.stage2Score || 0 },
    { name: 'Problem Solving', score: 82 },
    { name: 'Culture Fit', score: 90 },
  ];

  const passed = (candidateData.stage1Score || 0) > 70 && (candidateData.stage2Score || 0) > 70;

  return (
    <Layout className="items-center justify-center p-6 bg-gray-50">
      <Card className="max-w-4xl w-full p-0 overflow-hidden border-black shadow-2xl">
        {/* Header */}
        <div className="bg-black text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Candidate Report</h2>
          <div className="text-gray-400 text-sm uppercase tracking-widest">{candidateData.email}</div>
          
          <div className="mt-8 flex justify-center">
            <div className={`px-6 py-2 rounded-full border-2 font-bold text-lg flex items-center gap-2 ${passed ? 'border-white text-white' : 'border-white text-white opacity-80'}`}>
              {passed ? <CheckCircle /> : <AlertTriangle />}
              VERDICT: {passed ? 'PASS' : 'FAIL'}
            </div>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* Scores */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-b border-black pb-2">Performance Metrics</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics} layout="vertical" margin={{ left: 40 }}>
                   <XAxis type="number" domain={[0, 100]} hide />
                   <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} interval={0}/>
                   <Tooltip 
                      contentStyle={{borderRadius: '8px', border: '1px solid black'}}
                      cursor={{fill: 'transparent'}}
                   />
                   <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                      {metrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#000000' : '#999999'} />
                      ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-gray-600 italic">
              AI Summary: The candidate demonstrated strong verbal reasoning in Stage 1 but showed hesitation during the array manipulation task in Stage 2.
            </div>
          </div>

          {/* Fraud & Details */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-b border-black pb-2">Integrity Check</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-black rounded-card">
                <div className="text-xs text-gray-500 uppercase">Deepfake Prob.</div>
                <div className="text-2xl font-bold">{antiCheatData.deepfakeConfidence}%</div>
              </div>
              <div className="p-4 border border-black rounded-card">
                 <div className="text-xs text-gray-500 uppercase">Tab Switches</div>
                 <div className="text-2xl font-bold">{antiCheatData.tabSwitches}</div>
              </div>
              <div className="p-4 border border-black rounded-card">
                 <div className="text-xs text-gray-500 uppercase">Eye Contact Lost</div>
                 <div className="text-2xl font-bold">{antiCheatData.eyeContactLost}</div>
              </div>
              <div className="p-4 border border-black rounded-card">
                 <div className="text-xs text-gray-500 uppercase">Integrity Score</div>
                 <div className="text-2xl font-bold">98/100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black bg-gray-50 flex justify-between items-center">
          <button onClick={() => setViewState(ViewState.LANDING)} className="text-sm font-bold hover:underline">Exit Session</button>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setViewState(ViewState.DASHBOARD)}>Recruiter View</Button>
            <Button onClick={() => alert("Downloading PDF...")}>
               <Download className="w-4 h-4" /> Download Report
            </Button>
          </div>
        </div>
      </Card>
    </Layout>
  );
};