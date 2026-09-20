export interface WeekLesson {
  weekId: string;
  title: string;
  dateRange: string;
  estimatedMinutes: number;
  stations: Station[];
}

export interface Station {
  id: string;
  title: string;
  subject: string;
  conceptTags: string[];
  estimatedMinutes: number;
  problems?: Problem[];
  content?: StationContent;
}

export interface Problem {
  id: string;
  tier: number;
  type: string;
  prompt: string;
  parts: ProblemPart[];
  enrichment?: string;
}

export interface ProblemPart {
  partId: string;
  question: string;
  type: 'text' | 'numeric' | 'multiple-choice';
  correctAnswer?: any;
  options?: string[];
  validation?: Validation;
  hint?: string;
  explanation?: string;
  optional?: boolean;
}

export interface Validation {
  type?: 'exact' | 'range';
  keywords?: string[];
  minLength?: number;
  maxLength?: number;
}

export interface StationContent {
  type: 'exploration' | 'reflection';
  introduction: string;
  mediaReference?: string;
  prompts: ContentPrompt[];
  enrichment?: string;
}

export interface ContentPrompt {
  id: string;
  question: string;
  type: 'reflection' | 'text';
  validation?: Validation;
  hint?: string;
  optional?: boolean;
}

export interface UserProgress {
  weekId: string;
  stationId: string;
  problemId?: string;
  partId?: string;
  promptId?: string;
  answer: any;
  correct?: boolean;
  attempts: number;
  timestamp: number;
  conceptTags: string[];
}

export interface WeekProgress {
  weekId: string;
  startedAt: number;
  completedAt?: number;
  stationsCompleted: string[];
  totalAttempts: number;
  correctAnswers: number;
  hintsUsed: number;
}

export interface ConceptMastery {
  conceptTag: string;
  attempts: number;
  correct: number;
  lastAttempt: number;
  masteryLevel: 'needs-practice' | 'developing' | 'proficient';
}

export interface AppState {
  weeks: WeekProgress[];
  userProgress: UserProgress[];
  conceptMastery: Record<string, ConceptMastery>;
  currentWeekId?: string;
  currentStationId?: string;
}
