import { GameProgress, ScoreState } from '../types/game';

const STORAGE_KEY = 'muhiba_mystery_save_v1';

export const initialScores: ScoreState = {
  vocabulary: 0,
  grammar: 0,
  structure: 0,
  problemSolving: 0,
  finalDescription: 0,
};

export const defaultProgress: GameProgress = {
  profile: null,
  currentMap: 'courtyard',
  playerPosition: { x: 400, y: 380, direction: 'up' },
  currentQuestStep: 0,
  completedQuests: [],
  inventory: [],
  scores: initialScores,
  startTime: Date.now(),
  timePlayedSeconds: 0,
  phase: 'TITLE',
  reflections: {
    q1: '',
    q2: '',
    q3: '',
  },
  finalText: '',
  submitted: false,
  submissionError: null,
};

export function saveGameProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Could not save progress to localStorage', e);
  }
}

export function loadGameProgress(): GameProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameProgress;
    return parsed;
  } catch (e) {
    console.warn('Could not load progress from localStorage', e);
    return null;
  }
}

export function clearGameProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear progress', e);
  }
}
