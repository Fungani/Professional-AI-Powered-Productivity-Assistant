import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar, type ViewId } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { EmailGenerator } from '@/components/EmailGenerator';
import { MeetingSummarizer } from '@/components/MeetingSummarizer';
import { TaskPlanner } from '@/components/TaskPlanner';
import { ResearchAssistant } from '@/components/ResearchAssistant';
import { Chatbot } from '@/components/Chatbot';
import { PresentationGenerator } from '@/components/PresentationGenerator';

function App() {
  const [view, setView] = useState<ViewId>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard onNavigate={setView} />;
      case 'email': return <EmailGenerator />;
      case 'meeting': return <MeetingSummarizer />;
      case 'tasks': return <TaskPlanner />;
      case 'research': return <ResearchAssistant />;
      case 'presentation': return <PresentationGenerator />;
      case 'chat': return <Chatbot />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        active={view}
        onNavigate={setView}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 lg:hidden">
          <div className="flex items-center gap-3 px-4 h-14">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-sm font-semibold text-slate-700">FlowDesk AI</p>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
