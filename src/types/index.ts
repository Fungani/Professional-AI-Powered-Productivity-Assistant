export type Tone = 'professional' | 'friendly' | 'persuasive' | 'urgent' | 'empathetic';
export type Audience = 'team' | 'client' | 'leadership' | 'vendor' | 'customer';

export interface EmailConfig {
  topic: string;
  tone: Tone;
  audience: Audience;
  keyPoints: string;
  callToAction: string;
}

export interface MeetingSummary {
  summary: string;
  keyPoints: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
  decisions: string[];
}

export interface PlannedTask {
  name: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  scheduledFor: string;
  rationale: string;
}

export interface TaskPlan {
  overview: string;
  tasks: PlannedTask[];
  scheduleNote: string;
}

export interface ResearchInsight {
  summary: string;
  insights: string[];
  keyFindings: { title: string; detail: string }[];
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type PresentationTheme = 'corporate' | 'creative' | 'minimal' | 'bold';

export interface PresentationConfig {
  topic: string;
  audience: Audience;
  theme: PresentationTheme;
  slideCount: number;
  keyPoints: string;
}

export interface SlideContent {
  title: string;
  bulletPoints: string[];
  speakerNotes: string;
}

export interface PresentationResult {
  title: string;
  subtitle: string;
  slides: SlideContent[];
}
