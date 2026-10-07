export type Department = 'AKL' | 'OTOMOTIF' | 'TJKT';

export type CharacterGender = 'boy' | 'girl_hijab' | 'girl_nohijab';

export type GamePhase =
  | 'TITLE'
  | 'CHARACTER_SELECT'
  | 'PROLOGUE'
  | 'EXPLORATION'
  | 'PUZZLE'
  | 'PLOT_TWIST'
  | 'COURTYARD_FINALE'
  | 'FINAL_CHALLENGE'
  | 'REFLECTION'
  | 'MISSION_COMPLETE';

export interface StudentProfile {
  name: string;
  className: string;
  gender: CharacterGender;
  department: Department;
}

export interface ScoreState {
  vocabulary: number;      // max 20
  grammar: number;         // max 20
  structure: number;       // max 20
  problemSolving: number;  // max 20
  finalDescription: number;// max 20
}

export type RankTitle =
  | 'DESCRIPTION MASTER'
  | 'EXCELLENT EXPLORER'
  | 'SKILLED EXPLORER'
  | 'DEVELOPING EXPLORER'
  | 'KEEP EXPLORING';

export interface ObjectiveInfo {
  currentObjective: string;
  location: string;
  requiredAction: string;
  successCondition: string;
  nextObjective: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'tool' | 'key' | 'clue' | 'document';
  description: string;
  icon: string;
}

export interface InteractiveObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'object' | 'npc' | 'door' | 'terminal';
  department?: Department;
  label: string;
  description: string;
  questStep?: number;
  highlight?: boolean;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  avatar: 'mr_hendra' | 'naya' | 'raka' | 'dimas' | 'player';
  text: string;
  nextId?: string;
  onComplete?: () => void;
}

export interface ScaffoldingLevel {
  level: number;
  title: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
}

export interface GameProgress {
  profile: StudentProfile | null;
  currentMap: 'courtyard' | 'akl_lab' | 'otomotif_workshop' | 'tjkt_lab';
  playerPosition: { x: number; y: number; direction: 'down' | 'up' | 'left' | 'right' };
  currentQuestStep: number; // 0: Prologue, 1-5: Dept Quests, 6: Final Mystery, 7: Final Text, 8: Complete
  completedQuests: string[];
  inventory: InventoryItem[];
  scores: ScoreState;
  startTime: number;
  timePlayedSeconds: number;
  phase: GamePhase;
  reflections: {
    q1: string;
    q2: string;
    q3: string;
  };
  finalText: string;
  submitted: boolean;
  submissionError: string | null;
}
