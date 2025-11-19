import React, { useState } from 'react';
import { Layout, Button, Card, Badge } from '../components/Common';
import { ViewState } from '../types';
import { Users, FileText, Settings, LogOut, Search, ChevronRight, Plus } from 'lucide-react';

interface DashboardProps {
  setViewState: (view: ViewState) => void;
}

export const RecruiterDashboard: React.FC<DashboardProps> = ({ setViewState }) => {
  const [activeTab, setActiveTab] = useState('candidates');

  const candidates = [
    { name: 'Alex Chen', role: 'Frontend Engineer', status: 'Completed', score: 92, date: '2h ago' },
    { name: 'Sarah Jones', role: 'Backend Dev', status: 'Stage 2 Passed', score: 88, date: '4h ago' },
    { name: 'Mike Ross', role: 'Full Stack', status: 'Flagged', score: 45, date: '1d ago' },
    { name: 'Jessica Pearson', role: 'CTO', status: 'Pending', score: 0, date: 'Just now' },
  ];

  return (
    <Layout className="bg-gray-50">
      {/* Navigation */}
      <nav className="bg-black text-white h-16 px-8 flex items-center justify-between shadow-md">
        <div className="font-bold text-xl tracking-tight">AI INTERVIEW <span className="font-light opacity-70">RECRUITER</span></div>
        <div className="flex gap-6 text-sm font-medium">
          {['Candidates', 'Interviews', 'Reports', 'Settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`hover:text-gray-300 transition-colors ${activeTab === tab.toLowerCase() ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={() => setViewState(ViewState.LANDING)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </nav>

      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Candidates', val: '1,240' },
            { label: 'Interviews Today', val: '12' },
            { label: 'Avg. Technical Score', val: '78%' },
            { label: 'Fraud Flags', val: '3' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-card border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-sm text-gray-500 font-bold uppercase">{stat.label}</div>
              <div className="text-3xl font-bold mt-2">{stat.val}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <Card className="min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="pl-10 pr-4 py-2 rounded-full border border-black text-sm w-64" placeholder="Search candidates..." />
              </div>
              <Button className="h-10 px-4 text-xs gap-2">
                <Plus className="w-3 h-3" /> New Position
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black text-xs uppercase text-gray-500">
                  <th className="py-4 pl-4">Candidate</th>
                  <th className="py-4">Role</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Score</th>
                  <th className="py-4">Date</th>
                  <th className="py-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {candidates.map((c, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 group transition-colors">
                    <td className="py-4 pl-4 font-bold">{c.name}</td>
                    <td className="py-4 text-gray-600">{c.role}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        c.status === 'Completed' ? 'bg-black text-white border-black' :
                        c.status === 'Flagged' ? 'bg-white text-black border-black decoration-wavy underline' :
                        'bg-white text-black border-gray-300'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 font-mono">{c.score > 0 ? c.score : '-'}</td>
                    <td className="py-4 text-gray-400">{c.date}</td>
                    <td className="py-4">
                      <button className="w-8 h-8 rounded-full border border-transparent hover:border-black flex items-center justify-center transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </Layout>
  );
};