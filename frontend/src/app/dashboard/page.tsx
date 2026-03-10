'use client';

import { useState, useEffect } from 'react';
import { analyticsAPI, aiAPI } from '@/lib/api';
import { Loader, Send, Search, BarChart3, Zap, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    messagesSent: 0,
    repliesReceived: 0,
    websiteVisitors: 0,
  });
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await analyticsAPI.getSummary();
      setMetrics(response.data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await aiAPI.ask(question);
      setAiResponse(response.data.answer);
      setQuestion('');
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('Sorry, could not process your request');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ label, value, icon, color }: any) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${color}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <h3 className="text-4xl font-bold text-gray-900 mt-2">{value}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">🚀 Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to TK Nexus</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {loadingMetrics ? (
            <div className="col-span-4 text-center py-12">
              <Loader className="animate-spin inline text-blue-600" size={40} />
            </div>
          ) : (
            <>
              <MetricCard 
                label="Total Leads" 
                value={metrics.totalLeads} 
                icon="🎯" 
                color="border-blue-400"
              />
              <MetricCard 
                label="Messages Sent" 
                value={metrics.messagesSent} 
                icon="📨" 
                color="border-purple-400"
              />
              <MetricCard 
                label="Replies Received" 
                value={metrics.repliesReceived} 
                icon="💬" 
                color="border-green-400"
              />
              <MetricCard 
                label="Website Visitors" 
                value={metrics.websiteVisitors} 
                icon="👁️" 
                color="border-orange-400"
              />
            </>
          )}
        </div>

        {/* AI Assistant */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="text-yellow-400" size={28} />
            Ask TK Nexus AI
          </h2>
          
          <form onSubmit={handleAskAI} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything... (e.g., 'Find leads in my area', 'Generate content ideas')"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition font-semibold"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </form>

          {aiResponse && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-800 leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition transform hover:scale-105">
            <Search className="text-blue-600 mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Find Leads</h3>
            <p className="text-gray-600">Discover 50+ qualified business leads</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition transform hover:scale-105">
            <MessageSquare className="text-purple-600 mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Send Outreach</h3>
            <p className="text-gray-600">Automate messages to your leads</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition transform hover:scale-105">
            <BarChart3 className="text-green-600 mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-gray-600">Track your business growth metrics</p>
          </div>
        </div>
      </main>
    </div>
  );
}
