
import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  LayoutDashboard, Database, FileText, BrainCircuit, Activity, 
  Settings, RefreshCw, ChevronRight, AlertCircle, TrendingUp, CheckCircle2,
  Database as DbIcon, HardDrive, Download, Search, Play
} from 'lucide-react';
import { DataSource, DataRecord, AnalysisResponse } from './types';
import { MOCK_SOURCES, generateMockData } from './utils/mockData';
import { analyzeData } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sources' | 'analysis' | 'reports'>('dashboard');
  const [sources, setSources] = useState<DataSource[]>(MOCK_SOURCES);
  const [data, setData] = useState<DataRecord[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  const handlePollData = () => {
    setIsPolling(true);
    // Simulate network delay for polling from SQL/Access
    setTimeout(() => {
      setData(generateMockData());
      setSources(prev => prev.map(s => ({
        ...s,
        lastSync: new Date().toLocaleString(),
        status: 'CONNECTED'
      })));
      setIsPolling(false);
    }, 2000);
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeData(data);
      setAnalysis(result);
      setActiveTab('analysis');
    } catch (error) {
      console.error(error);
      alert("AI Analysis encountered an error.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const SidebarItem: React.FC<{ 
    id: typeof activeTab, 
    icon: React.ReactNode, 
    label: string 
  }> = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">InsightStream</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem id="sources" icon={<Database size={20} />} label="Data Sources" />
          <SidebarItem id="analysis" icon={<BrainCircuit size={20} />} label="AI Insights" />
          <SidebarItem id="reports" icon={<FileText size={20} />} label="Reports" />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <SidebarItem id="dashboard" icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab} Overview</h1>
            <p className="text-slate-500">Managing real-time enterprise data streams</p>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handlePollData}
              disabled={isPolling}
              className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={isPolling ? 'animate-spin' : ''} />
              <span>{isPolling ? 'Polling DBs...' : 'Poll Sources'}</span>
            </button>
            <button 
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-shadow shadow-md disabled:bg-indigo-400"
            >
              <BrainCircuit size={18} className={isAnalyzing ? 'animate-pulse' : ''} />
              <span>{isAnalyzing ? 'Analyzing...' : 'AI Deep Analysis'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value="$42,390" trend="+12.5%" icon={<TrendingUp className="text-emerald-500" />} />
              <StatCard title="Avg Profit Margin" value="28.4%" trend="+2.3%" icon={<CheckCircle2 className="text-indigo-500" />} />
              <StatCard title="Connected DBs" value="2 Active" trend="Stable" icon={<DbIcon className="text-blue-500" />} />
              <StatCard title="Sync Latency" value="1.2s" trend="-0.4s" icon={<Activity className="text-orange-500" />} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Trend (Simulated SQL Polling)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.slice(0, 15)}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Inventory by Region (MS Access Mirror)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="region" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="inventory" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Records Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Live Polling Buffer</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search records..." 
                    className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Source ID</th>
                      <th className="px-6 py-4 font-semibold">Timestamp</th>
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Region</th>
                      <th className="px-6 py-4 font-semibold">Value</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {data.slice(0, 5).map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700">#SQL-{row.id}</td>
                        <td className="px-6 py-4 text-slate-500">{row.date}</td>
                        <td className="px-6 py-4 text-slate-700">{row.product}</td>
                        <td className="px-6 py-4 text-slate-500">{row.region}</td>
                        <td className="px-6 py-4 text-slate-900 font-semibold">${row.sales.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase">Synced</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((source) => (
              <div key={source.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${source.type === 'SQL_SERVER' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                    {source.type === 'SQL_SERVER' ? <HardDrive size={32} /> : <DbIcon size={32} />}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    source.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {source.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{source.name}</h3>
                <p className="text-slate-500 text-sm mb-6">Database Type: <span className="text-slate-700 font-medium">{source.type}</span></p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Last Sync</span>
                    <span className="text-slate-700 font-medium">{source.lastSync}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Record Count</span>
                    <span className="text-slate-700 font-medium">{source.recordCount.toLocaleString()} items</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 border border-slate-200 py-2 rounded-xl text-slate-600 hover:bg-slate-50">
                    <Settings size={16} />
                    <span>Config</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700">
                    <Play size={16} />
                    <span>Resync</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="border-2 border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-400 cursor-pointer transition-all">
              <RefreshCw size={40} className="mb-4" />
              <p className="font-semibold text-lg">Connect New Database</p>
              <p className="text-sm">Azure SQL, Local Access, or MySQL</p>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="max-w-4xl mx-auto">
            {!analysis ? (
              <div className="text-center py-20">
                <BrainCircuit size={64} className="mx-auto text-slate-200 mb-6" />
                <h2 className="text-2xl font-bold text-slate-800 mb-4">No AI Insights Yet</h2>
                <p className="text-slate-500 mb-8">Run a deep analysis to let Gemini Pro scan your SQL & Access data for patterns.</p>
                <button 
                  onClick={runAIAnalysis}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all font-semibold"
                >
                  Start Analysis Engine
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <BrainCircuit className="text-indigo-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Executive AI Summary</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {analysis.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.insights.map((insight, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-1 h-full ${
                        insight.type === 'TREND' ? 'bg-blue-500' :
                        insight.type === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                          insight.type === 'TREND' ? 'bg-blue-50 text-blue-600' :
                          insight.type === 'WARNING' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {insight.type}
                        </span>
                        <span className="text-xs font-medium text-slate-400">Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <h4 className="font-bold text-slate-800 mb-2">{insight.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{insight.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <AlertCircle size={24} className="text-indigo-400" />
                    AI-Driven Recommendations
                  </h3>
                  <ul className="space-y-4">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-1 bg-indigo-500/20 p-1 rounded-full text-indigo-400">
                          <ChevronRight size={16} />
                        </div>
                        <span className="text-slate-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-10 rounded-3xl shadow-xl max-w-5xl mx-auto border border-slate-200">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center space-x-3">
                <Activity className="text-indigo-600" size={32} />
                <h2 className="text-2xl font-bold text-slate-800">Operational Performance Report</h2>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-slate-800 font-bold">Report ID: ISR-2023-X92</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Revenue Breakdown</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.slice(0, 10)}>
                      <CartesianGrid vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-slate-500 text-sm mb-1">Net Performance</p>
                  <p className="text-3xl font-black text-slate-800">+14.2%</p>
                  <div className="w-full bg-slate-200 h-2 mt-4 rounded-full">
                    <div className="bg-indigo-600 h-full w-[74%] rounded-full" />
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-slate-500 text-sm mb-1">Resource Utilization</p>
                  <p className="text-3xl font-black text-slate-800">88.5%</p>
                  <div className="w-full bg-slate-200 h-2 mt-4 rounded-full">
                    <div className="bg-emerald-500 h-full w-[88%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-10 flex justify-between">
              <div className="text-sm text-slate-500 max-w-sm">
                This report aggregates data from active SQL Server clusters and legacy MS Access instances via the InsightStream middleware.
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 border border-slate-200 px-6 py-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 transition-all">
                  <Download size={20} />
                  Export PDF
                </button>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all font-semibold">
                  Print Report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard: React.FC<{ 
  title: string, 
  value: string, 
  trend: string, 
  icon: React.ReactNode 
}> = ({ title, value, trend, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
      }`}>
        {trend}
      </span>
    </div>
    <p className="text-slate-500 text-sm mb-1 font-medium">{title}</p>
    <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
  </div>
);

export default App;
