import { useState } from 'react';
import { Presentation, Sparkles, RotateCcw, Download, FileText, Clock, Layers, Check } from 'lucide-react';
import { Button, Card, LoadingState, Disclaimer } from './ui';
import { PageHeader, Field, inputClass } from './EmailGenerator';
import { generatePresentation } from '@/lib/aiEngine';
import { downloadPresentation } from '@/lib/pptxGenerator';
import type { PresentationConfig, PresentationTheme, PresentationResult } from '@/types';

const themes: { value: PresentationTheme; label: string; desc: string }[] = [
  { value: 'corporate', label: 'Corporate', desc: 'Professional blue tones' },
  { value: 'creative', label: 'Creative', desc: 'Bold, expressive palette' },
  { value: 'minimal', label: 'Minimal', desc: 'Clean, understated slate' },
  { value: 'bold', label: 'Bold', desc: 'High-impact red & navy' },
];

const themeColors: Record<PresentationTheme, string> = {
  corporate: 'from-blue-600 to-blue-700',
  creative: 'from-fuchsia-600 to-purple-600',
  minimal: 'from-slate-700 to-slate-800',
  bold: 'from-red-600 to-red-800',
};

export function PresentationGenerator() {
  const [config, setConfig] = useState<PresentationConfig>({
    topic: '',
    audience: 'leadership',
    theme: 'corporate',
    slideCount: 5,
    keyPoints: '',
  });
  const [result, setResult] = useState<PresentationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!config.topic.trim()) return;
    setLoading(true);
    setHasGenerated(true);
    const presentation = await generatePresentation(config);
    setResult(presentation);
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      await downloadPresentation(result, config.theme);
    } catch (e) {
      console.error('Download failed', e);
    }
    setDownloading(false);
  };

  const handleReset = () => {
    setConfig({ topic: '', audience: 'leadership', theme: 'corporate', slideCount: 5, keyPoints: '' });
    setResult(null);
    setHasGenerated(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        icon={<Presentation className="w-6 h-6 text-white" />}
        iconBg="bg-indigo-600"
        title="AI Presentation Generator"
        subtitle="Generate a downloadable PowerPoint from your topic and key points"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Presentation Setup
          </h3>
          <div className="space-y-4">
            <Field label="Presentation Topic" required>
              <input
                type="text"
                value={config.topic}
                onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                placeholder="e.g., Q3 Strategy Review"
                className={inputClass}
              />
            </Field>

            <Field label="Audience">
              <select
                value={config.audience}
                onChange={(e) => setConfig({ ...config, audience: e.target.value as PresentationConfig['audience'] })}
                className={inputClass}
              >
                <option value="team">Team</option>
                <option value="client">Client</option>
                <option value="leadership">Leadership</option>
                <option value="vendor">Vendor / Partner</option>
                <option value="customer">Customer</option>
              </select>
            </Field>

            <Field label="Theme">
              <div className="grid grid-cols-2 gap-2.5">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setConfig({ ...config, theme: t.value })}
                    className={`relative text-left p-3 rounded-xl border transition-all ${
                      config.theme === t.value
                        ? 'border-indigo-400 ring-2 ring-indigo-500/20 bg-indigo-50/40'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-full h-2 rounded-full bg-gradient-to-r ${themeColors[t.value]} mb-2`} />
                    <p className="text-sm font-medium text-slate-700">{t.label}</p>
                    <p className="text-[11px] text-slate-400">{t.desc}</p>
                    {config.theme === t.value && (
                      <Check className="absolute top-2.5 right-2.5 w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Number of Content Slides" hint="Max 6">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={3}
                  max={6}
                  value={config.slideCount}
                  onChange={(e) => setConfig({ ...config, slideCount: Number(e.target.value) })}
                  className="flex-1 accent-indigo-600"
                />
                <span className="text-sm font-semibold text-slate-700 w-8 text-center tabular-nums">
                  {config.slideCount}
                </span>
              </div>
            </Field>

            <Field label="Key Points" hint="Optional — one per line">
              <textarea
                value={config.keyPoints}
                onChange={(e) => setConfig({ ...config, keyPoints: e.target.value })}
                placeholder={"Revenue grew 23% year-over-year\nNew product launch scheduled for Q4\nKey risk: supply chain delays"}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleGenerate} disabled={!config.topic.trim() || loading} className="flex-1">
                <Sparkles className="w-4 h-4" />
                Generate Slides
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
            <h3 className="text-sm font-semibold text-slate-700">Slide Preview</h3>
            {result && (
              <Button size="sm" onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    Building...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Download .pptx
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex-1 min-h-[300px] overflow-y-auto scrollbar-thin">
            {!hasGenerated && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
                  <Presentation className="w-8 h-8" />
                </div>
                <p className="text-sm text-slate-400 max-w-xs">Your slide outline and download button will appear here</p>
              </div>
            )}
            {loading && <LoadingState label="Designing your presentation..." />}
            {result && !loading && (
              <div className="space-y-3 animate-fade-in">
                {result.slides.map((slide, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
                  >
                    <div className={`bg-gradient-to-r ${themeColors[config.theme]} px-4 py-2.5`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white/60 tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-sm font-semibold text-white truncate">{slide.title}</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white">
                      <ul className="space-y-1.5">
                        {slide.bulletPoints.map((bp, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                            {bp}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2.5 pt-2.5 border-t border-slate-100">
                        <p className="text-[11px] text-slate-400 italic">
                          <span className="font-medium">Speaker notes:</span> {slide.speakerNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100/60">
                  <Layers className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      {result.slides.length + 1} slides total (including title & closing)
                    </p>
                    <p className="text-xs text-slate-500">Click download to save as a PowerPoint file</p>
                  </div>
                </div>

                <Disclaimer />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
