import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  Presentation,
  Sparkles,
  X,
} from 'lucide-react';

export type ViewId = 'dashboard' | 'email' | 'meeting' | 'tasks' | 'research' | 'presentation' | 'chat';

interface NavItem {
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & quick actions' },
  { id: 'email', label: 'Email Generator', icon: Mail, description: 'Tone + audience based' },
  { id: 'meeting', label: 'Meeting Summarizer', icon: FileText, description: 'Key points & actions' },
  { id: 'tasks', label: 'Task Planner', icon: ListChecks, description: 'Prioritize & schedule' },
  { id: 'research', label: 'Research Assistant', icon: Search, description: 'Insights & summaries' },
  { id: 'presentation', label: 'Presentation Generator', icon: Presentation, description: 'PowerPoint export' },
  { id: 'chat', label: 'AI Chatbot', icon: MessageSquare, description: 'Ask anything' },
];

interface SidebarProps {
  active: ViewId;
  onNavigate: (view: ViewId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">FlowDesk AI</p>
              <p className="text-[11px] text-slate-400 leading-tight">Workplace Productivity</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}>
                  <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{item.label}</p>
                  <p className="text-[11px] text-slate-400 leading-tight truncate">{item.description}</p>
                </div>
                {isActive && <div className="w-1 h-8 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200 shrink-0">
          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/60 p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold text-slate-700">AI Assistant</p>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              AI-generated content may require human review.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
