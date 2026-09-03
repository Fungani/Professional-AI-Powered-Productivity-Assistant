import { useState } from 'react';
import { Mail, Send, Wand2, RotateCcw } from 'lucide-react';
import { Button, Card, LoadingState, Disclaimer, CopyButton } from './ui';
import { generateEmail } from '@/lib/aiEngine';
import type { EmailConfig, Tone, Audience } from '@/types';

const tones: { value: Tone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'empathetic', label: 'Empathetic' },
];

const audiences: { value: Audience; label: string }[] = [
  { value: 'team', label: 'Team' },
  { value: 'client', label: 'Client' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'vendor', label: 'Vendor / Partner' },
  { value: 'customer', label: 'Customer' },
];

export function EmailGenerator() {
  const [config, setConfig] = useState<EmailConfig>({
    topic: '',
    tone: 'professional',
    audience: 'team',
    keyPoints: '',
    callToAction: '',
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!config.topic.trim()) return;
    setLoading(true);
    setHasGenerated(true);
    const result = await generateEmail(config);
    setOutput(result);
    setLoading(false);
  };

  const handleReset = () => {
    setConfig({ topic: '', tone: 'professional', audience: 'team', keyPoints: '', callToAction: '' });
    setOutput('');
    setHasGenerated(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        icon={<Mail className="w-6 h-6 text-white" />}
        iconBg="bg-blue-600"
        title="Smart Email Generator"
        subtitle="Draft professional emails tailored by tone and audience"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-blue-600" />
            Configuration
          </h3>
          <div className="space-y-4">
            <Field label="Email Topic" required>
              <input
                type="text"
                value={config.topic}
                onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                placeholder="e.g., Q3 Project Update"
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Tone">
                <select
                  value={config.tone}
                  onChange={(e) => setConfig({ ...config, tone: e.target.value as Tone })}
                  className={inputClass}
                >
                  {tones.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Audience">
                <select
                  value={config.audience}
                  onChange={(e) => setConfig({ ...config, audience: e.target.value as Audience })}
                  className={inputClass}
                >
                  {audiences.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Key Points" hint="One per line">
              <textarea
                value={config.keyPoints}
                onChange={(e) => setConfig({ ...config, keyPoints: e.target.value })}
                placeholder={"Project is on track for Q3 launch\nBudget approved at $50K\nNeed 2 additional developers"}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field label="Call to Action">
              <input
                type="text"
                value={config.callToAction}
                onChange={(e) => setConfig({ ...config, callToAction: e.target.value })}
                placeholder="e.g., Please review the attached timeline by Friday"
                className={inputClass}
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleGenerate} disabled={!config.topic.trim() || loading} className="flex-1">
                <Send className="w-4 h-4" />
                Generate Email
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Generated Email</h3>
            {output && <CopyButton text={output} />}
          </div>
          <div className="flex-1 min-h-[300px]">
            {!hasGenerated && !loading && (
              <EmptyState icon={<Mail className="w-8 h-8" />} text="Your generated email will appear here" />
            )}
            {loading && <LoadingState label="Crafting your email..." />}
            {output && !loading && (
              <div className="animate-fade-in">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-sans bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {output}
                </pre>
                <Disclaimer className="mt-3" />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PageHeader({ icon, iconBg, title, subtitle }: { icon: React.ReactNode; iconBg: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-700">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
        {icon}
      </div>
      <p className="text-sm text-slate-400 max-w-xs">{text}</p>
    </div>
  );
}

export const inputClass = 'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

export { PageHeader };
