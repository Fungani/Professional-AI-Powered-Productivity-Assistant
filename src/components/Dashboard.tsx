import { Mail, FileText, ListChecks, Search, MessageSquare, Presentation, ArrowRight, Sparkles, Clock, Zap, TrendingUp } from 'lucide-react';
import type { ViewId } from './Sidebar';

interface DashboardProps {
  onNavigate: (view: ViewId) => void;
}

const features = [
  { id: 'email' as ViewId, icon: Mail, label: 'Smart Email Generator', desc: 'Draft professional emails by tone and audience', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', iconBg: 'bg-blue-600' },
  { id: 'meeting' as ViewId, icon: FileText, label: 'Meeting Notes Summarizer', desc: 'Extract key points, actions, and deadlines', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', iconBg: 'bg-emerald-600' },
  { id: 'tasks' as ViewId, icon: ListChecks, label: 'AI Task Planner', desc: 'Prioritize and schedule your workday', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', iconBg: 'bg-amber-600' },
  { id: 'research' as ViewId, icon: Search, label: 'AI Research Assistant', desc: 'Get insights and summaries on any topic', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', iconBg: 'bg-violet-600' },
  { id: 'presentation' as ViewId, icon: Presentation, label: 'Presentation Generator', desc: 'Generate downloadable PowerPoint decks', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', iconBg: 'bg-indigo-600' },
  { id: 'chat' as ViewId, icon: MessageSquare, label: 'AI Chatbot Interface', desc: 'Ask anything and get instant help', color: 'from-cyan-500 to-teal-500', bg: 'bg-cyan-50', iconBg: 'bg-cyan-600' },
];

const stats = [
  { icon: Zap, label: 'Tasks Automated', value: '24', sub: 'this week', color: 'text-blue-600 bg-blue-50' },
  { icon: Clock, label: 'Time Saved', value: '6.5h', sub: 'this week', color: 'text-emerald-600 bg-emerald-50' },
  { icon: TrendingUp, label: 'Productivity', value: '+38%', sub: 'vs last week', color: 'text-amber-600 bg-amber-50' },
  { icon: Sparkles, label: 'AI Sessions', value: '52', sub: 'total', color: 'text-violet-600 bg-violet-50' },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 lg:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white/80 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Productivity Suite
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
            Good day. Let's make work flow.
          </h1>
          <p className="text-slate-300 text-base lg:text-lg max-w-2xl leading-relaxed">
            Automate your daily work with AI — draft emails, summarize meetings, plan tasks, and research topics, all in one place.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigate('email')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Start with Email Generator
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
              <p className="text-[11px] text-slate-400">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">AI Tools</h2>
            <p className="text-sm text-slate-500">Choose a tool to get started</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => onNavigate(feature.id)}
                className="group text-left bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200 animate-slide-up"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1.5 group-hover:text-blue-700 transition-colors">
                  {feature.label}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">{feature.desc}</p>
                <div className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                  Open
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700">About FlowDesk AI</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              FlowDesk AI uses structured prompt engineering to generate professional, clear outputs for your daily workplace tasks. Each tool is designed to save you time while maintaining quality and clarity.
            </p>
            <p className="text-xs text-slate-400 italic mt-2">AI-generated content may require human review.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
