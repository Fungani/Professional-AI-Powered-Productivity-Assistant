import { useState } from 'react';
import { FileText, Sparkles, RotateCcw, CheckCircle2, AlertCircle, Calendar, User, ClipboardList } from 'lucide-react';
import { Button, Card, LoadingState, Disclaimer, CopyButton } from './ui';
import { PageHeader, Field, EmptyState, inputClass } from './EmailGenerator';
import { summarizeMeeting } from '@/lib/aiEngine';
import type { MeetingSummary } from '@/types';

export function MeetingSummarizer() {
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleSummarize = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setHasGenerated(true);
    const summary = await summarizeMeeting(notes);
    setResult(summary);
    setLoading(false);
  };

  const handleReset = () => {
    setNotes('');
    setResult(null);
    setHasGenerated(false);
  };

  const fullText = result
    ? `SUMMARY\n${result.summary}\n\nKEY POINTS\n${result.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nACTION ITEMS\n${result.actionItems.map((a) => `• ${a.task} — Owner: ${a.owner} — Deadline: ${a.deadline}`).join('\n')}\n\nDECISIONS\n${result.decisions.map((d) => `• ${d}`).join('\n')}`
    : '';

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        icon={<FileText className="w-6 h-6 text-white" />}
        iconBg="bg-emerald-600"
        title="Meeting Notes Summarizer"
        subtitle="Extract key points, action items, and decisions automatically"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-emerald-600" />
            Raw Meeting Notes
          </h3>
          <Field label="Paste your meeting notes" hint="Include action items, decisions, and deadlines for best results">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={"Discussed Q3 roadmap and resource allocation\nSarah will prepare the budget by 10/15\nDecided to prioritize the mobile app launch\nAction: John to follow up with vendor by next week\nApproved the new design system proposal"}
              rows={12}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSummarize} disabled={!notes.trim() || loading} className="flex-1">
              <Sparkles className="w-4 h-4" />
              Summarize Meeting
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Structured Summary</h3>
            {result && <CopyButton text={fullText} />}
          </div>
          <div className="flex-1 min-h-[300px]">
            {!hasGenerated && !loading && (
              <EmptyState icon={<FileText className="w-8 h-8" />} text="Your meeting summary will appear here" />
            )}
            {loading && <LoadingState label="Analyzing your notes..." />}
            {result && !loading && (
              <div className="space-y-5 animate-fade-in">
                <Section title="Overview" icon={<FileText className="w-4 h-4" />}>
                  <p className="text-sm text-slate-600 leading-relaxed">{result.summary}</p>
                </Section>

                <Section title="Key Points" icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}>
                  <ul className="space-y-1.5">
                    {result.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title="Action Items" icon={<AlertCircle className="w-4 h-4 text-amber-600" />}>
                  <div className="space-y-2">
                    {result.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">{item.task}</p>
                          <div className="flex flex-wrap gap-3 mt-1.5">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <User className="w-3 h-3" /> {item.owner}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" /> {item.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Decisions" icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}>
                  <ul className="space-y-1.5">
                    {result.decisions.map((decision, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        {decision}
                      </li>
                    ))}
                  </ul>
                </Section>

                <Disclaimer />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}
