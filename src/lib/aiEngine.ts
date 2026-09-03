import type {
  EmailConfig,
  MeetingSummary,
  TaskPlan,
  ResearchInsight,
  ChatMessage,
  PresentationConfig,
  PresentationResult,
  SlideContent,
} from '@/types';

function randomDelay(min = 900, max = 1900): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));
}

const toneMap: Record<string, string> = {
  professional: 'formal and polished',
  friendly: 'warm and approachable',
  persuasive: 'compelling and convincing',
  urgent: 'direct and time-sensitive',
  empathetic: 'understanding and considerate',
};

const audienceMap: Record<string, string> = {
  team: 'your internal team',
  client: 'an external client',
  leadership: 'senior leadership',
  vendor: 'an external vendor or partner',
  customer: 'a valued customer',
};

export async function generateEmail(config: EmailConfig): Promise<string> {
  await randomDelay();
  const { topic, tone, audience, keyPoints, callToAction } = config;

  const subject = `Re: ${topic}`;
  const points = keyPoints
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const pointsHtml = points.length
    ? points.map((p) => `  • ${p}`).join('\n')
    : '  • (Add your specific details here)';

  return `Subject: ${subject}

Dear ${audience === 'team' ? 'Team' : audience === 'leadership' ? 'Leadership Team' : 'Valued Colleague'},

I hope this message finds you well. I'm writing to share an update regarding ${topic}.

Key highlights:
${pointsHtml}

${callToAction ? `Next steps: ${callToAction}` : 'Please let me know if you have any questions or need further detail.'}

The tone of this communication is ${toneMap[tone]}, tailored for ${audienceMap[audience]}. I'm happy to adjust any section to better fit your needs.

Best regards,
[Your Name]
[Your Title]`;
}

export async function summarizeMeeting(notes: string): Promise<MeetingSummary> {
  await randomDelay(1200, 2200);
  const lines = notes
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const keyPoints = lines.slice(0, Math.min(5, lines.length)).map((l) =>
    l.replace(/^[-•*\d.)\s]+/, '').trim()
  ).filter(Boolean);

  const actionItems = lines
    .filter((l) => /action|todo|follow.?up|deadline|assign|owner|by\s+\w+/i.test(l))
    .slice(0, 4)
    .map((l) => {
      const ownerMatch = l.match(/\b([A-Z][a-z]+)\b/);
      const deadlineMatch = l.match(/\b(\d{1,2}\/\d{1,2}|\w+day|next week|EOD|tomorrow)\b/i);
      return {
        task: l.replace(/^[-•*\d.)\s]+/, '').trim(),
        owner: ownerMatch ? ownerMatch[1] : 'Unassigned',
        deadline: deadlineMatch ? deadlineMatch[1] : 'This week',
      };
    });

  const decisions = lines
    .filter((l) => /decid|agreed|approved|conclud|final|will\b/i.test(l))
    .slice(0, 3)
    .map((l) => l.replace(/^[-•*\d.)\s]+/, '').trim());

  return {
    summary: `This meeting covered ${keyPoints.length} main topics. The discussion centered on ${keyPoints[0] || 'the agenda items below'}, with ${actionItems.length} action items identified and ${decisions.length} decisions reached.`,
    keyPoints: keyPoints.length ? keyPoints : ['No specific key points detected — try adding more detail to your notes.'],
    actionItems: actionItems.length
      ? actionItems
      : [{ task: 'Review and assign action items from meeting notes', owner: 'Meeting lead', deadline: 'This week' }],
    decisions: decisions.length ? decisions : ['No explicit decisions detected in the notes provided.'],
  };
}

export async function planTasks(taskList: string): Promise<TaskPlan> {
  await randomDelay(1000, 2000);
  const tasks = taskList
    .split('\n')
    .map((t) => t.trim().replace(/^[-•*\d.)\s]+/, '').trim())
    .filter(Boolean);

  const priorityKeywords: Record<string, 'high' | 'medium' | 'low'> = {
    urgent: 'high', asap: 'high', critical: 'high', important: 'high', deadline: 'high', today: 'high',
    soon: 'medium', next: 'medium', review: 'medium', prepare: 'medium', draft: 'medium',
    eventually: 'low', later: 'low', consider: 'low', optional: 'low',
  };

  const planned = tasks.map((task, i) => {
    let priority: 'high' | 'medium' | 'low' = i === 0 ? 'high' : i < tasks.length / 2 ? 'medium' : 'low';
    const lower = task.toLowerCase();
    for (const [kw, p] of Object.entries(priorityKeywords)) {
      if (lower.includes(kw)) { priority = p; break; }
    }
    const times: Record<string, string> = {
      high: '30–60 min',
      medium: '20–45 min',
      low: '15–30 min',
    };
    const slots: Record<string, string> = {
      high: i === 0 ? '9:00 AM – First thing' : '10:30 AM – Morning focus block',
      medium: '1:00 PM – Early afternoon',
      low: '3:30 PM – Low-energy window',
    };
    const rationale: Record<string, string> = {
      high: 'High impact and time-sensitive — address early when energy is highest.',
      medium: 'Important but not blocking — schedule during a steady focus window.',
      low: 'Lower urgency — batch with similar tasks in the afternoon.',
    };
    return {
      name: task,
      priority,
      estimatedTime: times[priority],
      scheduledFor: slots[priority],
      rationale: rationale[priority],
    };
  });

  return {
    overview: `I've analyzed ${planned.length} task${planned.length !== 1 ? 's' : ''} and organized them by priority and energy alignment. The plan front-loads high-priority items into your morning focus blocks and reserves the afternoon for lower-urgency work.`,
    tasks: planned.length
      ? planned
      : [{ name: 'No tasks entered', priority: 'low', estimatedTime: '—', scheduledFor: '—', rationale: 'Add tasks above to generate a plan.' }],
    scheduleNote: 'Schedule adapts to your natural energy curve — deep work in the morning, shallow tasks after lunch.',
  };
}

export async function researchTopic(topic: string): Promise<ResearchInsight> {
  await randomDelay(1300, 2300);
  const t = topic.trim() || 'the requested topic';

  return {
    summary: `Based on analysis of ${t}, here is a synthesized overview of the current landscape, key trends, and actionable recommendations. This research highlights the most relevant findings for professional decision-making.`,
    insights: [
      `${t} is an evolving area with multiple intersecting factors that influence outcomes.`,
      `Stakeholders should monitor emerging trends and adjust strategies accordingly.`,
      `Data quality and continuous measurement are critical to sustained success.`,
    ],
    keyFindings: [
      { title: 'Market Context', detail: `${t} sits within a broader landscape that rewards adaptability and evidence-based approaches.` },
      { title: 'Key Drivers', detail: 'Three primary factors shape outcomes: resource allocation, stakeholder alignment, and timing of execution.' },
      { title: 'Risk Factors', detail: 'Common pitfalls include underestimating complexity, insufficient communication, and lack of measurable milestones.' },
    ],
    recommendations: [
      `Begin with a focused pilot to validate assumptions about ${t}.`,
      'Establish clear KPIs before scaling effort or investment.',
      'Schedule regular review checkpoints to course-correct early.',
    ],
  };
}

export async function chatResponse(message: string, history: ChatMessage[]): Promise<string> {
  await randomDelay(700, 1600);
  const msg = message.toLowerCase().trim();

  if (/hello|hi|hey|good (morning|afternoon|evening)/.test(msg)) {
    return "Hello! I'm your AI workplace assistant. I can help you draft emails, summarize meeting notes, plan your tasks, or research topics. What would you like to work on today?";
  }

  if (/email|draft|write.*message/.test(msg)) {
    return "I can help you draft an email. To get the best result, tell me:\n\n1. What the email is about\n2. Who it's for (team, client, leadership, etc.)\n3. The tone you want (professional, friendly, persuasive, urgent, empathetic)\n4. Any key points to include\n\nYou can also use the Smart Email Generator tab for a structured approach.";
  }

  if (/meeting|notes|summary|minutes/.test(msg)) {
    return "I'd be happy to help summarize your meeting notes. Paste your raw notes into the Meeting Notes Summarizer tab, and I'll extract key points, action items with owners and deadlines, and decisions made. The more detail in your notes, the better the summary.";
  }

  if (/task|plan|schedule|prioriti|productiv/.test(msg)) {
    return "For task planning, head to the AI Task Planner tab. List your tasks (one per line) and I'll prioritize them, estimate time, suggest a schedule aligned with your energy levels, and explain the reasoning behind each placement.";
  }

  if (/research|analyz|investigat|insight/.test(msg)) {
    return "The AI Research Assistant tab is designed for this. Enter a topic and I'll generate a structured brief with a summary, key insights, findings, and recommendations. It's great for quickly getting up to speed on a new area.";
  }

  if (/thank/.test(msg)) {
    return "You're welcome! Feel free to ask anytime — I'm here to help streamline your workday.";
  }

  if (/help|what can you/.test(msg)) {
    return "Here's what I can help with:\n\n• **Smart Email Generator** — Draft emails by tone and audience\n• **Meeting Notes Summarizer** — Extract key points, actions, and decisions\n• **AI Task Planner** — Prioritize and schedule your to-do list\n• **AI Research Assistant** — Get insights and summaries on any topic\n\nJust describe what you need, or use the dedicated tabs in the sidebar.";
  }

  const contextual = `That's a great question about "${message}". Here's how I'd approach it:\n\n1. **Clarify the goal** — Define what success looks like for this specific situation.\n2. **Gather context** — Collect the relevant information and constraints.\n3. **Plan the approach** — Break it into manageable steps with clear priorities.\n4. **Execute and review** — Take action, then assess results and adjust.\n\nFor more specialized help, try the feature-specific tools in the sidebar. Is there a particular aspect you'd like me to dig deeper into?`;
  return contextual;
}

const presentationTemplates: Record<string, { intro: string; agenda: string; sections: string[][] }> = {
  corporate: {
    intro: 'An overview prepared for {audience}, covering strategic priorities and key outcomes.',
    agenda: 'Review the current landscape, examine key findings, and align on next steps.',
    sections: [
      ['Current state assessment', 'Market position and competitive landscape', 'Key strengths and areas for improvement'],
      ['Strategic priorities', 'Primary objectives for the coming period', 'Resource allocation and investment focus'],
      ['Key findings and data', 'Quantitative results and trend analysis', 'Benchmark comparisons and insights'],
      ['Risk assessment', 'Primary risks and mitigation strategies', 'Contingency planning overview'],
      ['Implementation roadmap', 'Phased approach with clear milestones', 'Timeline and dependency mapping'],
      ['Next steps and actions', 'Immediate priorities and ownership', 'Decision points and approvals needed'],
    ],
  },
  creative: {
    intro: 'A fresh perspective on {topic}, designed to inspire and ignite new ideas.',
    agenda: 'Explore creative directions, review concepts, and chart an innovative path forward.',
    sections: [
      ['The big idea', 'Why this matters now', 'Vision and creative direction'],
      ['Concept exploration', 'Three creative directions', 'Visual language and mood'],
      ['Audience journey', 'How people will experience this', 'Emotional touchpoints'],
      ['Creative assets', 'Key deliverables and formats', 'Production considerations'],
      ['Timeline and milestones', 'Concept to launch roadmap', 'Review and feedback cycles'],
      ['Measuring success', 'Engagement and impact metrics', 'What great looks like'],
    ],
  },
  minimal: {
    intro: 'A concise briefing on {topic} with the essential information you need.',
    agenda: 'Context, findings, and recommendations — kept brief and actionable.',
    sections: [
      ['Context', 'Why we are discussing this', 'Background summary'],
      ['Key findings', 'What the data tells us', 'Primary takeaways'],
      ['Options considered', 'Approach A vs Approach B', 'Trade-offs evaluated'],
      ['Recommendation', 'Proposed direction', 'Rationale and expected impact'],
      ['Next steps', 'What needs to happen', 'Who is responsible'],
    ],
  },
  bold: {
    intro: 'The case for decisive action on {topic} — opportunities, challenges, and the path to winning.',
    agenda: 'The opportunity is real. The window is closing. Here is the plan.',
    sections: [
      ['The opportunity', 'Market size and growth potential', 'Why the timing is critical'],
      ['The challenge', 'Obstacles standing in our way', 'What happens if we wait'],
      ['The strategy', 'Our bold move and why it works', 'Differentiation from competitors'],
      ['Execution plan', '90-day sprint to launch', 'Team, budget, and resources'],
      ['Expected outcomes', 'Revenue and growth projections', 'Market position impact'],
      ['The ask', 'What we need from leadership', 'Decision deadline and implications'],
    ],
  },
};

export async function generatePresentation(config: PresentationConfig): Promise<PresentationResult> {
  await randomDelay(1400, 2400);
  const { topic, audience, theme, slideCount, keyPoints } = config;

  const template = presentationTemplates[theme] || presentationTemplates.corporate;
  const audLabel = audienceMap[audience] || 'your audience';

  const userPoints = keyPoints
    .split('\n')
    .map((p) => p.trim().replace(/^[-•*\d.)\s]+/, '').trim())
    .filter(Boolean);

  const introSlide: SlideContent = {
    title: topic,
    bulletPoints: [
      template.intro.replace('{audience}', audLabel).replace('{topic}', topic),
    ],
    speakerNotes: `Welcome the audience. Introduce yourself and the purpose of this presentation. Set expectations: we will cover the key aspects of ${topic} and align on next steps. This presentation is designed for ${audLabel}.`,
  };

  const agendaSlide: SlideContent = {
    title: 'Agenda',
    bulletPoints: [
      'Introduction and context',
      'Key discussion areas',
      'Findings and analysis',
      'Recommendations and next steps',
    ],
    speakerNotes: `Walk through the agenda briefly. Let the audience know the structure and when questions will be taken. Keep this to under one minute.`,
  };

  const sections = template.sections;
  const contentSlides: SlideContent[] = [];

  for (let i = 0; i < Math.min(slideCount, sections.length); i++) {
    const section = sections[i];
    const bullets = [...section.slice(1)];
    if (userPoints[i]) {
      bullets.push(`Your point: ${userPoints[i]}`);
    }
    contentSlides.push({
      title: section[0],
      bulletPoints: bullets.length ? bullets : ['Add your detailed content here'],
      speakerNotes: `Discuss ${section[0].toLowerCase()}. ${userPoints[i] ? `Highlight: ${userPoints[i]}.` : ''} Provide context and invite questions. Keep this section focused and data-driven.`,
    });
  }

  const summarySlide: SlideContent = {
    title: 'Summary & Next Steps',
    bulletPoints: [
      `Recap: We covered ${contentSlides.length} key areas related to ${topic}`,
      'Key decisions needed from the audience',
      'Action items will be circulated within 48 hours',
      'Questions and discussion',
    ],
    speakerNotes: `Summarize the key takeaways. Clearly state what decisions are needed and from whom. Confirm next steps and timelines. Open the floor for questions.`,
  };

  return {
    title: topic,
    subtitle: template.intro.replace('{audience}', audLabel).replace('{topic}', topic),
    slides: [introSlide, agendaSlide, ...contentSlides, summarySlide].slice(0, slideCount + 2),
  };
}
