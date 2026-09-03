import { useState } from 'react';
import { ListChecks, Sparkles, RotateCcw, Clock, Calendar, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { Button, Card, LoadingState, Disclaimer, CopyButton } from './ui';
import { PageHeader, Field, EmptyState, inputClass } from './EmailGenerator';
import { planTasks } from '@/lib/aiEngine';
import type { TaskPlan } from '@/types';

const priorityConfig = {
  high: { label: 'High', icon: ArrowUp, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-500' },
  medium: { label: 'Medium', icon: ArrowRight, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500' },
  low: { label: 'Low', icon: ArrowDown, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', dot: 'bg-slate-400' },
};

export function TaskPlanner() {
  const [taskList, setTaskList] = useState('');
  const [plan, setPlan] = useState<TaskPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handlePlan = async () => {
    if (!taskList.trim()) return;
    setLoading(true);
    setHasGenerated(true);
    const result = await planTasks(taskList);
    setPlan(result);
    setLoading(false);
  };

  const handleReset = () => {
    setTaskList('');
    setPlan(null);
    setHasGenerated(false);
  };

  const fullText = plan
    ? `OVERVIEW\n${plan.overview}\n\nSCHEDULE\n${plan.tasks.map((t) => `[${t.priority.toUpperCase()}] ${t.name}\n  Time: ${t.estimatedTime} | Slot: ${t.scheduledFor}\n  Why: ${t.rationale}`).join('\n\n')}\n\nNOTE: ${plan.scheduleNote}`
    : '';

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        icon={<ListChecks className="w-6 h-6 text-white" />}
        iconBg="bg-amber-600"
        title="AI Task Planner"
        subtitle="Prioritize and schedule your tasks with AI-powered planning"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-amber-600" />
            Your Tasks
          </h3>
          <Field label="List your tasks" hint="One per line — include urgency hints for better prioritization">
            <textarea
              value={taskList}
              onChange={(e) => setTaskList(e.target.value)}
              placeholder={"Urgent: Finish Q3 presentation for tomorrow\nReview team timesheets\nDraft proposal for new client\nEventually update the wiki documentation"}
              rows={10}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <div className="flex gap-3 pt-4">
            <Button onClick={handlePlan} disabled={!taskList.trim() || loading} className="flex-1">
              <Sparkles className="w-4 h-4" />
              Generate Plan
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">AI-Optimized Schedule</h3>
            {plan && <CopyButton text={fullText} />}
          </div>
          <div className="flex-1 min-h-[300px]">
            {!hasGenerated && !loading && (
              <EmptyState icon={<ListChecks className="w-8 h-8" />} text="Your optimized task plan will appear here" />
            )}
            {loading && <LoadingState label="Optimizing your schedule..." />}
            {plan && !loading && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                  <p className="text-sm text-slate-600 leading-relaxed">{plan.overview}</p>
                </div>

                <div className="space-y-2.5">
                  {plan.tasks.map((task, i) => {
                    const pc = priorityConfig[task.priority];
                    const Icon = pc.icon;
                    return (
                      <div key={i} className={`p-4 rounded-xl ${pc.bg} ${pc.border} border`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-start gap-2.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${pc.color} bg-white`}>
                              <Icon className="w-3 h-3" />
                              {pc.label}
                            </span>
                            <p className="text-sm font-medium text-slate-700">{task.name}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 ml-1">
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5" /> {task.estimatedTime}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="w-3.5 h-3.5" /> {task.scheduledFor}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 ml-1 italic leading-relaxed">{task.rationale}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <span className="font-semibold text-slate-600">Scheduling note:</span> {plan.scheduleNote}
                  </p>
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
