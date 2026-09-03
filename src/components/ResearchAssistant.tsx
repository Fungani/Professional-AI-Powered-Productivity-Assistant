import { useState } from 'react';
import { Search, Sparkles, RotateCcw, Lightbulb, Target, TrendingUp, BookOpen } from 'lucide-react';
import { Button, Card, LoadingState, Disclaimer, CopyButton } from './ui';
import { PageHeader, Field, EmptyState, inputClass } from './EmailGenerator';
import { researchTopic } from '@/lib/aiEngine';
import type { ResearchInsight } from '@/types';

export function ResearchAssistant() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<ResearchInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleResearch = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setHasGenerated(true);
    const research = await researchTopic(topic);
    setResult(research);
    setLoading(false);
  };

  const handleReset = () => {
    setTopic('');
    setResult(null);
    setHasGenerated(false);
  };

  const fullText = result
    ? `SUMMARY\n${result.summary}\n\nINSIGHTS\n${result.insights.map((i) => `• ${i}`).join('\n')}\n\nKEY FINDINGS\n${result.keyFindings.map((f) => `• ${f.title}: ${f.detail}`).join('\n')}\n\nRECOMMENDATIONS\n${result.recommendations.map((r) => `• ${r}`).join('\n')}`
    : '';

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        icon={<Search className="w-6 h-6 text-white" />}
        iconBg="bg-violet-600"
        title="AI Research Assistant"
        subtitle="Get structured insights and summaries on any topic"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-600" />
            Research Topic
          </h3>
          <Field label="What would you like to research?" required>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={"e.g., The impact of remote work on team productivity\nor: Market opportunities for AI-powered SaaS in healthcare"}
              rows={6}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleResearch} disabled={!topic.trim() || loading} className="flex-1">
              <Sparkles className="w-4 h-4" />
              Research Topic
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-violet-50/40 border border-violet-100/60">
            <p className="text-xs font-semibold text-violet-700 mb-2">Try these topics</p>
            <div className="space-y-1.5">
              {['Remote work productivity trends', 'AI adoption in enterprise', 'Sustainable supply chain strategies'].map((s) => (
                <button
                  key={s}
                  onClick={() => setTopic(s)}
                  className="block w-full text-left text-xs text-slate-600 hover:text-violet-700 transition-colors"
                >
                  → {s}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Research Brief</h3>
            {result && <CopyButton text={fullText} />}
          </div>
          <div className="flex-1 min-h-[300px]">
            {!hasGenerated && !loading && (
              <EmptyState icon={<Search className="w-8 h-8" />} text="Your research brief will appear here" />
            )}
            {loading && <LoadingState label="Researching your topic..." />}
            {result && !loading && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-xl bg-violet-50/40 border border-violet-100/60">
                  <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
                </div>

                <RSection title="Key Insights" icon={<Lightbulb className="w-4 h-4 text-amber-500" />}>
                  <ul className="space-y-2">
                    {result.insights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </RSection>

                <RSection title="Key Findings" icon={<Target className="w-4 h-4 text-violet-600" />}>
                  <div className="space-y-2.5">
                    {result.keyFindings.map((finding, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-sm font-semibold text-slate-700 mb-1">{finding.title}</p>
                        <p className="text-sm text-slate-500 leading-relaxed">{finding.detail}</p>
                      </div>
                    ))}
                  </div>
                </RSection>

                <RSection title="Recommendations" icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed pt-0.5">{rec}</p>
                      </div>
                    ))}
                  </div>
                </RSection>

                <Disclaimer />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function RSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2.5">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}
