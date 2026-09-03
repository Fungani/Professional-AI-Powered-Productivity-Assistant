import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, RotateCcw, Bot, User } from 'lucide-react';
import { Button, Card, Disclaimer } from './ui';
import { PageHeader } from './EmailGenerator';
import { chatResponse } from '@/lib/aiEngine';
import type { ChatMessage } from '@/types';

const suggestions = [
  'Help me draft a follow-up email',
  'Summarize my meeting notes',
  'Plan my tasks for today',
  'Research a topic for me',
];

export function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await chatResponse(content, [...messages, userMsg]);
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        icon={<MessageSquare className="w-6 h-6 text-white" />}
        iconBg="bg-cyan-600"
        title="AI Chatbot Interface"
        subtitle="Ask anything — your AI workplace assistant is ready to help"
      />

      <Card className="flex flex-col h-[calc(100vh-220px)] min-h-[400px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">FlowDesk Assistant</p>
              <p className="text-[11px] text-green-600 font-medium">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4 bg-slate-50/30">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">How can I help you today?</h3>
              <p className="text-sm text-slate-500 max-w-md mb-6">
                I can help with emails, meeting summaries, task planning, research, and more. Try one of these:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md w-full">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-left px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 hover:border-cyan-300 hover:bg-cyan-50/40 hover:text-cyan-700 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-slate-600" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-md'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <p className={`text-[10px] text-slate-400 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-slate-200">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '200ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-slate-100 bg-white">
          <div className="flex gap-2.5 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 focus:bg-white transition-all resize-none max-h-32"
              style={{ minHeight: '42px' }}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="shrink-0"
              style={{ height: '42px' }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <Disclaimer className="mt-2 text-center" />
        </div>
      </Card>
    </div>
  );
}
