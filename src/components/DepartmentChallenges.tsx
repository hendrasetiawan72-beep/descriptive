import React, { useState } from 'react';
import { Department, ScoreState, InventoryItem } from '../types/game';
import { DEPARTMENTS } from '../data/curriculumData';
import { sound } from '../utils/audio';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  FileCheck,
  AlertTriangle,
  Key,
} from 'lucide-react';

interface DepartmentChallengesProps {
  department: Department;
  questStep: number;
  onCompleteStep: (scoreEarned: Partial<ScoreState>, rewardItem?: InventoryItem) => void;
  onClose: () => void;
}

export const DepartmentChallenges: React.FC<DepartmentChallengesProps> = ({
  department,
  questStep,
  onCompleteStep,
  onClose,
}) => {
  const deptInfo = DEPARTMENTS[department];

  // ==========================================
  // AKL STATE & CHALLENGES
  // ==========================================
  // Quest 2: AKL Adjective matching
  const aklAdjectivePairs = [
    { noun: 'computer', correctAdj: 'modern', options: ['modern', 'greasy', 'heavy'] },
    { noun: 'ledger', correctAdj: 'organized', options: ['organized', 'noisy', 'spicy'] },
    { noun: 'calculator', correctAdj: 'accurate', options: ['accurate', 'rusty', 'wooden'] },
    { noun: 'system', correctAdj: 'digital', options: ['digital', 'fragile', 'windy'] },
    { noun: 'dashboard', correctAdj: 'efficient', options: ['efficient', 'blurry', 'sleepy'] },
  ];
  const [aklAdjSelections, setAklAdjSelections] = useState<{ [key: string]: string }>({});

  // Quest 3: AKL Sentence Builder
  const aklSentenceTasks = [
    {
      id: 's1',
      label: 'Build sentence about modern computers in the lab:',
      fragments: ['The accounting laboratory', 'has', 'several modern computers.'],
      shuffled: ['several modern computers.', 'The accounting laboratory', 'has'],
    },
    {
      id: 's2',
      label: 'Build sentence about the financial calculator:',
      fragments: ['The calculator', 'is', 'an accurate tool', 'for auditing.'],
      shuffled: ['is', 'for auditing.', 'The calculator', 'an accurate tool'],
    },
  ];
  const [aklSentenceAnswers, setAklSentenceAnswers] = useState<{ [key: string]: string[] }>({
    s1: [],
    s2: [],
  });

  // Quest 4: AKL Paragraph Builder (Identification + Description)
  const [aklParagraphOrder, setAklParagraphOrder] = useState<string[]>([]);
  const aklParagraphItems = [
    {
      id: 'p_ident',
      type: 'IDENTIFICATION',
      text: 'The Smart Financial Dashboard is an innovative software developed by AKL students for the Muhiba Expo.',
    },
    {
      id: 'p_desc1',
      type: 'DESCRIPTION',
      text: 'It features modern computers and digital Islamic banking ledgers to record transactions.',
    },
    {
      id: 'p_desc2',
      type: 'DESCRIPTION',
      text: 'The system has accurate calculation modules that provide clear real-time reports.',
    },
  ];

  // Quest 5: AKL Problem Solving (Identify genuine project description)
  const [aklSelectedSolution, setAklSelectedSolution] = useState<number | null>(null);

  // ==========================================
  // OTOMOTIF STATE & CHALLENGES
  // ==========================================
  // Quest 2: Otomotif Adjective Matching
  const otoAdjectivePairs = [
    { noun: 'motorcycle', correctAdj: 'sleek', options: ['sleek', 'paper', 'ancient'] },
    { noun: 'dashboard', correctAdj: 'digital', options: ['digital', 'chewy', 'muddy'] },
    { noun: 'battery', correctAdj: 'efficient', options: ['efficient', 'lazy', 'rusty'] },
    { noun: 'electric motor', correctAdj: 'powerful', options: ['powerful', 'soft', 'leaky'] },
    { noun: 'chassis', correctAdj: 'compact', options: ['compact', 'liquid', 'melted'] },
  ];
  const [otoAdjSelections, setOtoAdjSelections] = useState<{ [key: string]: string }>({});

  // Quest 3: Otomotif Spatial Prepositions
  const otoSpatialQuestions = [
    {
      question: 'Where is the high-capacity battery located?',
      correct: 'under the seat',
      options: ['under the seat', 'inside the exhaust', 'above the cloud'],
    },
    {
      question: 'Where is the digital dashboard placed?',
      correct: 'above the handlebar',
      options: ['above the handlebar', 'under the tire', 'behind the license plate'],
    },
    {
      question: 'Where is the electric motor mounted?',
      correct: 'in the rear wheel hub',
      options: ['in the rear wheel hub', 'on top of the mirror', 'inside the fuel tank'],
    },
  ];
  const [otoSpatialAnswers, setOtoSpatialAnswers] = useState<{ [key: number]: string }>({});

  // Quest 4: Otomotif Function Challenge
  const otoFunctionPairs = [
    { part: 'Battery Pack', correctFunc: 'stores electrical energy', options: ['stores electrical energy', 'burns gasoline', 'washes clothes'] },
    { part: 'Electric Motor', correctFunc: 'powers the rear wheel silently', options: ['powers the rear wheel silently', 'steers the headlights', 'prints paper'] },
    { part: 'LED Headlight', correctFunc: 'illuminates the road safely', options: ['illuminates the road safely', 'charges smartphones', 'refrigerates drinks'] },
  ];
  const [otoFunctionAnswers, setOtoFunctionAnswers] = useState<{ [key: string]: string }>({});

  // Quest 5: Otomotif Sentence Repair
  const [otoRepairedSentences, setOtoRepairedSentences] = useState<{ [key: number]: number }>({});
  const otoSentenceCorrections = [
    {
      errorText: '“The motorcycle has four large tires.”',
      options: [
        'The motorcycle has two aerodynamic tires.',
        'The motorcycle has six wooden wheels.',
        'The motorcycle have no tires.',
      ],
      correctIndex: 0,
    },
    {
      errorText: '“The electric motor are noisy and produces smoke.”',
      options: [
        'The electric motor is silent and produces zero emissions.',
        'The motor are very loud and hot.',
        'The motor have smoke and oil.',
      ],
      correctIndex: 0,
    },
  ];

  // ==========================================
  // TJKT STATE & CHALLENGES
  // ==========================================
  // Quest 2: TJKT Spatial Descriptive Challenge
  const tjktSpatialTasks = [
    {
      device: 'Router',
      clue: '“The router is placed next to the main server rack.”',
      correctPrep: 'next to',
      options: ['next to', 'underneath', 'across town'],
    },
    {
      device: 'Managed Switch',
      clue: '“The switch is positioned below the monitoring display.”',
      correctPrep: 'below',
      options: ['below', 'behind the sun', 'inside the keyboard'],
    },
    {
      device: 'Network Rack',
      clue: '“The secure server rack is standing near the wall.”',
      correctPrep: 'near',
      options: ['near', 'floating above', 'inside the water tank'],
    },
  ];
  const [tjktSpatialAnswers, setTjktSpatialAnswers] = useState<{ [key: string]: string }>({});

  // Quest 3: TJKT Network Topology Sequence
  const [tjktSequence, setTjktSequence] = useState<string[]>([]);
  const tjktRequiredOrder = ['Server', 'Router', 'Switch', 'Computer'];

  // Quest 4: TJKT Server Investigation
  const [tjktClueUnderstood, setTjktClueUnderstood] = useState(false);

  // Quest 5: TJKT Network Descriptive Repair
  const [tjktConfigChoice, setTjktConfigChoice] = useState<number | null>(null);

  // General error feedback state
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // ==========================================
  // HANDLERS PER DEPARTMENT & STEP
  // ==========================================

  // AKL SUBMISSION HANDLERS
  const handleAklAdjSubmit = () => {
    let allCorrect = true;
    for (const pair of aklAdjectivePairs) {
      if (aklAdjSelections[pair.noun] !== pair.correctAdj) {
        allCorrect = false;
        break;
      }
    }
    if (!allCorrect) {
      sound.playError();
      setFeedbackError('Some adjective pairings are incorrect. Think about their vocational qualities!');
      return;
    }
    sound.playSuccess();
    sound.playSpeakerGreeting('naya', 'female', 'Hebat sekali! Kosa kata akuntansi sudah tepat.');
    setFeedbackError(null);
    onCompleteStep(
      { vocabulary: 10, problemSolving: 5 },
      {
        id: 'vocab_card_akl',
        name: 'Accounting Vocabulary Index',
        category: 'tool',
        description: 'Modern computers, organized ledger, accurate calculator, digital system.',
        icon: '📊',
      }
    );
  };

  const handleAklSentenceSubmit = () => {
    const s1Done = aklSentenceAnswers.s1.join(' ') === aklSentenceTasks[0].fragments.join(' ');
    const s2Done = aklSentenceAnswers.s2.join(' ') === aklSentenceTasks[1].fragments.join(' ');
    if (!s1Done || !s2Done) {
      sound.playError();
      setFeedbackError('Please arrange all fragments in grammatically sound order (Subject + Verb + Object)!');
      return;
    }
    sound.playSuccess();
    setFeedbackError(null);
    onCompleteStep({ grammar: 10, structure: 5 });
  };

  const handleAklParagraphSubmit = () => {
    if (
      aklParagraphOrder.length === 3 &&
      aklParagraphOrder[0] === 'p_ident' &&
      aklParagraphOrder[1] === 'p_desc1' &&
      aklParagraphOrder[2] === 'p_desc2'
    ) {
      sound.playSuccess();
      setFeedbackError(null);
      onCompleteStep({ structure: 15 });
    } else {
      sound.playError();
      setFeedbackError('Remember: Put IDENTIFICATION first, followed by supporting DESCRIPTIONS!');
    }
  };

  const handleAklProblemSubmit = () => {
    if (aklSelectedSolution === 1) {
      sound.playFanfare();
      setFeedbackError(null);
      onCompleteStep(
        { problemSolving: 15, vocabulary: 10, grammar: 10 },
        {
          id: 'accounting_key',
          name: 'Accounting Key (Log 07 Fragment)',
          category: 'key',
          description:
            'A golden USB key storing DESCRIPTION_LOG_07. Contains a timestamp matching the Automotive Workshop!',
          icon: '🔑',
        }
      );
    } else {
      sound.playError();
      setFeedbackError('Incorrect analysis. Select the description that accurately reflects the Smart Financial Dashboard!');
    }
  };

  // OTOMOTIF SUBMISSION HANDLERS
  const handleOtoAdjSubmit = () => {
    let allCorrect = true;
    for (const pair of otoAdjectivePairs) {
      if (otoAdjSelections[pair.noun] !== pair.correctAdj) {
        allCorrect = false;
        break;
      }
    }
    if (!allCorrect) {
      sound.playError();
      setFeedbackError('Double-check your adjective choices! Match technical terms accurately.');
      return;
    }
    sound.playSuccess();
    sound.playSpeakerGreeting('raka', 'male', 'Mantap! Komponen motor listrik sudah teridentifikasi.');
    setFeedbackError(null);
    onCompleteStep(
      { vocabulary: 10, problemSolving: 5 },
      {
        id: 'vocab_card_oto',
        name: 'Automotive Component Index',
        category: 'tool',
        description: 'Sleek motorcycle, digital dashboard, efficient battery, powerful electric motor.',
        icon: '🏍️',
      }
    );
  };

  const handleOtoSpatialSubmit = () => {
    const q0 = otoSpatialAnswers[0] === otoSpatialQuestions[0].correct;
    const q1 = otoSpatialAnswers[1] === otoSpatialQuestions[1].correct;
    const q2 = otoSpatialAnswers[2] === otoSpatialQuestions[2].correct;
    if (!q0 || !q1 || !q2) {
      sound.playError();
      setFeedbackError('Review your spatial prepositions (under, above, in)!');
      return;
    }
    sound.playSuccess();
    setFeedbackError(null);
    onCompleteStep({ grammar: 10, structure: 5 });
  };

  const handleOtoFunctionSubmit = () => {
    let allGood = true;
    for (const p of otoFunctionPairs) {
      if (otoFunctionAnswers[p.part] !== p.correctFunc) {
        allGood = false;
        break;
      }
    }
    if (!allGood) {
      sound.playError();
      setFeedbackError('Check the functions of each component in the Present Tense.');
      return;
    }
    sound.playSuccess();
    setFeedbackError(null);
    onCompleteStep({ vocabulary: 10, structure: 10 });
  };

  const handleOtoSentenceRepairSubmit = () => {
    if (otoRepairedSentences[0] === 0 && otoRepairedSentences[1] === 0) {
      sound.playFanfare();
      setFeedbackError(null);
      onCompleteStep(
        { problemSolving: 15, grammar: 10, vocabulary: 10 },
        {
          id: 'automotive_key',
          name: 'Automotive Key (Diagnostic Fragment)',
          category: 'key',
          description:
            'A diagnostic dongle with matching Expo server timestamp. Unlocks the central Expo terminal!',
          icon: '🔑',
        }
      );
    } else {
      sound.playError();
      setFeedbackError('Select the grammatically and factually accurate correction for both sentences.');
    }
  };

  // TJKT SUBMISSION HANDLERS
  const handleTjktSpatialSubmit = () => {
    let allGood = true;
    for (const t of tjktSpatialTasks) {
      if (tjktSpatialAnswers[t.device] !== t.correctPrep) {
        allGood = false;
        break;
      }
    }
    if (!allGood) {
      sound.playError();
      setFeedbackError('Review the prepositions of place in the descriptive clues (next to, below, near)!');
      return;
    }
    sound.playSuccess();
    sound.playSpeakerGreeting('dimas', 'male', 'Bagus sekali! Perangkat jaringan tersusun rapi.');
    setFeedbackError(null);
    onCompleteStep({ vocabulary: 10, grammar: 10 });
  };

  const handleTjktTopologySubmit = () => {
    if (
      tjktSequence.length === 4 &&
      tjktSequence[0] === 'Server' &&
      tjktSequence[1] === 'Router' &&
      tjktSequence[2] === 'Switch' &&
      tjktSequence[3] === 'Computer'
    ) {
      sound.playSuccess();
      setFeedbackError(null);
      onCompleteStep({ problemSolving: 10, structure: 10 });
    } else {
      sound.playError();
      setFeedbackError('Remember the descriptive connection sequence: Server → Router → Switch → Computer!');
    }
  };

  const handleTjktInvestigationSubmit = () => {
    if (tjktClueUnderstood) {
      sound.playSuccess();
      setFeedbackError(null);
      onCompleteStep(
        { structure: 10, problemSolving: 10 },
        {
          id: 'backup_doc',
          name: 'EXPO_DESCRIPTION_BACKUP.txt',
          category: 'document',
          description:
            'Unified Expo archive file showing that all 3 department descriptions were stored together.',
          icon: '📄',
        }
      );
    } else {
      sound.playError();
      setFeedbackError('Read the terminal log and confirm you understand the backup discovery!');
    }
  };

  const handleTjktConfigSubmit = () => {
    if (tjktConfigChoice === 1) {
      sound.playFanfare();
      setFeedbackError(null);
      onCompleteStep(
        { problemSolving: 15, grammar: 10, vocabulary: 10 },
        {
          id: 'network_key',
          name: 'Network Key (Expo Gateway)',
          category: 'key',
          description:
            'A fiber-optic token key revealing that the files were never deleted, only moved for the challenge!',
          icon: '🔑',
        }
      );
    } else {
      sound.playError();
      setFeedbackError('Select the correct descriptive network configuration.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB]/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-retro-dots">
      <div className="w-full max-w-xl bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[5px_5px_0_0_#2B2D42] rounded-3xl p-5 sm:p-6 text-[#2B2D42] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2B2D42]/20 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-[#2B2D42] font-pixel shadow-xs"
              style={{
                backgroundColor:
                  department === 'AKL' ? '#B7E4C7' : department === 'OTOMOTIF' ? '#FFD8BE' : '#C8B6FF',
                color: '#2B2D42',
              }}
            >
              {deptInfo.shortName}
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#2B2D42]">
                Tantangan Misi {questStep}
              </h3>
              <p className="text-[11px] text-[#6C757D] font-medium">{deptInfo.labName}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playInteract();
              onClose();
            }}
            className="text-xs font-bold text-[#6C757D] hover:text-[#2B2D42] px-2 py-1 rounded hover:bg-[#F0ECE1]"
          >
            Lanjut Jelajah
          </button>
        </div>

        {/* FEEDBACK ERROR ALERT */}
        {feedbackError && (
          <div className="mb-3 bg-[#FFD6D6] border border-[#E63946] p-2.5 rounded-xl flex items-center gap-2 text-xs text-[#E63946] font-bold">
            <AlertTriangle className="w-4 h-4 text-[#E63946] shrink-0" />
            <span>{feedbackError}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* AKL ROUTE CHALLENGES (Step 2 - 5) */}
        {/* ============================================================== */}
        {department === 'AKL' && (
          <>
            {/* Quest 2: Adjective Hunt */}
            {questStep === 2 && (
              <div className="space-y-3">
                <div className="bg-[#FFF3B0]/60 p-3 rounded-2xl border-1.5 border-[#2B2D42] text-xs">
                  <h4 className="font-extrabold text-[#2B2D42] mb-0.5">
                    Quest 2: Tantangan Pasangan Adjektiva
                  </h4>
                  <p className="text-[#4A4E69] font-medium">
                    Pasangkan setiap kata benda akuntansi dengan kata sifat deskriptif yang paling tepat.
                  </p>
                </div>

                <div className="space-y-3">
                  {aklAdjectivePairs.map((pair) => (
                    <div
                      key={pair.noun}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs"
                    >
                      <span className="font-bold text-white capitalize">
                        {pair.noun} →
                      </span>
                      <div className="flex items-center gap-2">
                        {pair.options.map((adj) => (
                          <button
                            key={adj}
                            type="button"
                            onClick={() => {
                              sound.playInteract();
                              setAklAdjSelections({
                                ...aklAdjSelections,
                                [pair.noun]: adj,
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                              aklAdjSelections[pair.noun] === adj
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm font-bold'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            {adj}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAklAdjSubmit}
                  className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Verify Adjective Match</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quest 3: Build Sentences */}
            {questStep === 3 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 3: Build Descriptive Sentences
                  </h4>
                  <p className="text-slate-300">
                    Click fragments in the correct order to construct sentences using <strong>has/have</strong> and <strong>is/are</strong>.
                  </p>
                </div>

                {aklSentenceTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2.5"
                  >
                    <span className="font-semibold text-slate-300 block">{task.label}</span>
                    <div className="min-h-[38px] p-2 bg-slate-900 border border-slate-700 rounded-lg flex flex-wrap items-center gap-1.5">
                      {aklSentenceAnswers[task.id]?.length === 0 ? (
                        <span className="text-slate-500 italic text-[11px]">
                          Click word blocks below...
                        </span>
                      ) : (
                        aklSentenceAnswers[task.id]?.map((word, wIdx) => (
                          <span
                            key={wIdx}
                            onClick={() => {
                              sound.playInteract();
                              setAklSentenceAnswers({
                                ...aklSentenceAnswers,
                                [task.id]: aklSentenceAnswers[task.id].filter(
                                  (_, idx) => idx !== wIdx
                                ),
                              });
                            }}
                            className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded cursor-pointer hover:bg-rose-950 hover:text-rose-300 transition-colors"
                          >
                            {word} ✕
                          </span>
                        ))
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {task.shuffled.map((fragment, fIdx) => {
                        const isUsed = aklSentenceAnswers[task.id]?.includes(fragment);
                        return (
                          <button
                            key={fIdx}
                            disabled={isUsed}
                            onClick={() => {
                              sound.playInteract();
                              setAklSentenceAnswers({
                                ...aklSentenceAnswers,
                                [task.id]: [...(aklSentenceAnswers[task.id] || []), fragment],
                              });
                            }}
                            className={`px-2.5 py-1 rounded border text-xs transition-colors ${
                              isUsed
                                ? 'bg-slate-800 text-slate-600 border-slate-800 cursor-not-allowed'
                                : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-400'
                            }`}
                          >
                            {fragment}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAklSentenceSubmit}
                  className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Submit Sentences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quest 4: Paragraph Builder */}
            {questStep === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 4: Paragraph Structure Construction
                  </h4>
                  <p className="text-slate-300">
                    Arrange the paragraphs into the correct Descriptive Text generic structure:
                    <strong> 1. Identification → 2. Description</strong>.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {aklParagraphItems.map((item) => {
                    const isAdded = aklParagraphOrder.includes(item.id);
                    const positionIndex = aklParagraphOrder.indexOf(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          sound.playInteract();
                          if (isAdded) {
                            setAklParagraphOrder(aklParagraphOrder.filter((id) => id !== item.id));
                          } else {
                            setAklParagraphOrder([...aklParagraphOrder, item.id]);
                          }
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isAdded
                            ? 'border-emerald-400 bg-emerald-950/30 shadow-md'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAdded
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isAdded ? positionIndex + 1 : '+'}
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <span className="text-[10px] font-mono uppercase text-amber-400 block mb-0.5">
                            {item.type}
                          </span>
                          <p className="text-slate-200">{item.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleAklParagraphSubmit}
                  className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Verify Paragraph Generic Structure</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quest 5: Problem Solving */}
            {questStep === 5 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 5: Solve the Financial Dashboard Problem
                  </h4>
                  <p className="text-slate-300">
                    The Expo Archive contains corrupted entries. Which description accurately and professionally describes the <strong>Smart Financial Dashboard</strong>?
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 0,
                      title: 'Option A (Inaccurate / Casual)',
                      text: 'The dashboard is just an old calculator with buttons and paper clips for counting money in the classroom.',
                    },
                    {
                      id: 1,
                      title: 'Option B (Accurate Vocational Descriptive Text)',
                      text: 'The Smart Financial Dashboard is an innovative financial software developed by AKL students. It features modern computers, an organized digital ledger, and accurate analytics for Islamic banking accounting.',
                    },
                    {
                      id: 2,
                      title: 'Option C (Missing Identification & Grammar Errors)',
                      text: 'Computers is fast and ledgers are red. We like mathematics very much in Bawang.',
                    },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => {
                        sound.playInteract();
                        setAklSelectedSolution(opt.id);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        aklSelectedSolution === opt.id
                          ? 'border-emerald-400 bg-emerald-950/40 shadow-lg'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <h5 className="font-bold text-xs text-white mb-1">{opt.title}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">{opt.text}</p>
                    </div>
                  ))}
                </div>

                {/* Plot Twist Disclosure Banner */}
                <div className="bg-amber-950/30 border border-amber-600/40 p-3 rounded-xl text-[11px] text-amber-200">
                  ⚠️ <strong>Terminal Notice:</strong> Solving this will decrypt the system log and reveal the mysterious cross-department timestamp!
                </div>

                <button
                  onClick={handleAklProblemSubmit}
                  className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Resolve & Decrypt System Log</span>
                  <Key className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* OTOMOTIF ROUTE CHALLENGES (Step 2 - 5) */}
        {/* ============================================================== */}
        {department === 'OTOMOTIF' && (
          <>
            {/* Quest 2: Adjective Challenge */}
            {questStep === 2 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 2: Automotive Adjective Challenge
                  </h4>
                  <p className="text-slate-300">
                    Match each motorcycle component with its proper technical adjective.
                  </p>
                </div>

                <div className="space-y-3">
                  {otoAdjectivePairs.map((pair) => (
                    <div
                      key={pair.noun}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs"
                    >
                      <span className="font-bold text-white capitalize">
                        {pair.noun} →
                      </span>
                      <div className="flex items-center gap-2">
                        {pair.options.map((adj) => (
                          <button
                            key={adj}
                            type="button"
                            onClick={() => {
                              sound.playInteract();
                              setOtoAdjSelections({
                                ...otoAdjSelections,
                                [pair.noun]: adj,
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                              otoAdjSelections[pair.noun] === adj
                                ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-sm font-bold'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            {adj}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOtoAdjSubmit}
                  className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Verify Adjectives</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quest 3: Spatial Location Challenge */}
            {questStep === 3 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 3: Spatial Location Challenge
                  </h4>
                  <p className="text-slate-300">
                    Use prepositions of place (<strong>under</strong>, <strong>above</strong>, <strong>in</strong>) to locate motorcycle components.
                  </p>
                </div>

                <div className="space-y-3">
                  {otoSpatialQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2"
                    >
                      <span className="font-semibold text-slate-200 block">{q.question}</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              sound.playInteract();
                              setOtoSpatialAnswers({
                                ...otoSpatialAnswers,
                                [idx]: opt,
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                              otoSpatialAnswers[idx] === opt
                                ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-sm font-bold'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOtoSpatialSubmit}
                  className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Confirm Component Locations</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quest 4: Function Challenge */}
            {questStep === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 4: Component Function Challenge
                  </h4>
                  <p className="text-slate-300">
                    Connect each motorcycle component with its present tense function.
                  </p>
                </div>

                <div className="space-y-3">
                  {otoFunctionPairs.map((pair) => (
                    <div
                      key={pair.part}
                      className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2"
                    >
                      <span className="font-bold text-orange-400">{pair.part}:</span>
                      <div className="flex flex-col gap-1.5">
                        {pair.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              sound.playInteract();
                              setOtoFunctionAnswers({
                                ...otoFunctionAnswers,
                                [pair.part]: opt,
                              });
                            }}
                            className={`p-2 rounded-lg border text-left text-xs transition-all ${
                              otoFunctionAnswers[pair.part] === opt
                                ? 'bg-orange-500/20 text-orange-300 border-orange-400 font-semibold'
                                : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOtoFunctionSubmit}
                  className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Verify Part Functions</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quest 5: Sentence Repair */}
            {questStep === 5 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 5: Diagnostic Sentence Repair
                  </h4>
                  <p className="text-slate-300">
                    The motorcycle dashboard throws error codes due to corrupted grammar and factual mismatches. Select the correct fix for each sentence!
                  </p>
                </div>

                <div className="space-y-3">
                  {otoSentenceCorrections.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2"
                    >
                      <div className="text-rose-400 font-semibold">
                        Corrupted Diagnostic: {item.errorText}
                      </div>
                      <div className="space-y-1.5">
                        {item.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            onClick={() => {
                              sound.playInteract();
                              setOtoRepairedSentences({
                                ...otoRepairedSentences,
                                [idx]: optIdx,
                              });
                            }}
                            className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                              otoRepairedSentences[idx] === optIdx
                                ? 'bg-orange-500/20 border-orange-400 text-orange-200 font-semibold'
                                : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOtoSentenceRepairSubmit}
                  className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Reboot Motorcycle & Read Diagnostic Log</span>
                  <Key className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* TJKT ROUTE CHALLENGES (Step 2 - 5) */}
        {/* ============================================================== */}
        {department === 'TJKT' && (
          <>
            {/* Quest 2: Spatial Challenge */}
            {questStep === 2 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 2: Spatial Descriptive Challenge
                  </h4>
                  <p className="text-slate-300">
                    Identify the correct preposition of place for each networking device based on the room layout.
                  </p>
                </div>

                <div className="space-y-3">
                  {tjktSpatialTasks.map((task) => (
                    <div
                      key={task.device}
                      className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2"
                    >
                      <div className="text-sky-300 font-semibold">{task.clue}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Position preposition:</span>
                        {task.options.map((prep) => (
                          <button
                            key={prep}
                            type="button"
                            onClick={() => {
                              sound.playInteract();
                              setTjktSpatialAnswers({
                                ...tjktSpatialAnswers,
                                [task.device]: prep,
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                              tjktSpatialAnswers[task.device] === prep
                                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm font-bold'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            {prep}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleTjktSpatialSubmit}
                  className="w-full mt-4 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Confirm Spatial Clues</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quest 3: Network Topology */}
            {questStep === 3 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 3: Build the Network Topology Sequence
                  </h4>
                  <p className="text-slate-300">
                    Connect the equipment in the logical descriptive sequence to establish internet access across the lab.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-3">
                  <span className="text-slate-400 block font-semibold">Active Sequence Flow:</span>
                  <div className="flex items-center gap-2 flex-wrap min-h-[40px] p-2.5 bg-slate-900 border border-slate-700 rounded-lg">
                    {tjktSequence.length === 0 ? (
                      <span className="text-slate-500 italic text-[11px]">
                        Select devices in sequence below...
                      </span>
                    ) : (
                      tjktSequence.map((dev, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2.5 py-1 rounded font-bold">
                            {idx + 1}. {dev}
                          </span>
                          {idx < tjktSequence.length - 1 && (
                            <span className="text-slate-500">→</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {['Switch', 'Server', 'Computer', 'Router'].map((dev) => {
                      const isSelected = tjktSequence.includes(dev);
                      return (
                        <button
                          key={dev}
                          disabled={isSelected}
                          onClick={() => {
                            sound.playInteract();
                            setTjktSequence([...tjktSequence, dev]);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-slate-800 text-slate-600 border-slate-800 cursor-not-allowed'
                              : 'bg-slate-800 text-white border-slate-700 hover:border-sky-400'
                          }`}
                        >
                          + Add {dev}
                        </button>
                      );
                    })}
                    {tjktSequence.length > 0 && (
                      <button
                        onClick={() => {
                          sound.playInteract();
                          setTjktSequence([]);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-rose-800 text-rose-400 hover:bg-rose-950 text-xs font-semibold"
                      >
                        Reset Flow
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleTjktTopologySubmit}
                  className="w-full mt-4 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Connect Network Topology</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quest 4: Investigate Server Backup */}
            {questStep === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 4: Investigate Server Backup Archive
                  </h4>
                  <p className="text-slate-300">
                    A file named <strong>EXPO_DESCRIPTION_BACKUP.txt</strong> has been recovered. Read its content!
                  </p>
                </div>

                <div className="p-4 bg-slate-950 font-mono text-[11px] rounded-xl border border-sky-500/50 text-sky-300 space-y-2 leading-relaxed">
                  <div className="text-slate-400">=== EXPO_DESCRIPTION_BACKUP.txt ===</div>
                  <div>SYSTEM IDENTIFICATION: SMK Muhammadiyah Bawang Central Repository</div>
                  <div>ARCHIVE NOTE: All 3 department projects are linked under one architecture:</div>
                  <div className="text-emerald-400">· AKL: Smart Financial Dashboard</div>
                  <div className="text-orange-400">· Otomotif: Smart Electric Motorcycle</div>
                  <div className="text-sky-400">· TJKT: Smart School Network</div>
                  <div className="text-amber-300">
                    CONCLUSION: The project descriptions were never individually destroyed! They were consolidated into a unified puzzle.
                  </div>
                </div>

                <label className="flex items-center gap-2.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={tjktClueUnderstood}
                    onChange={(e) => {
                      sound.playInteract();
                      setTjktClueUnderstood(e.target.checked);
                    }}
                    className="w-4 h-4 accent-sky-500 rounded"
                  />
                  <span className="text-slate-200">
                    I have analyzed the backup file and understand that all 3 departments are unified.
                  </span>
                </label>

                <button
                  onClick={handleTjktInvestigationSubmit}
                  className="w-full mt-4 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Save Backup Evidence</span>
                  <FileCheck className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quest 5: Restore Network Configuration */}
            {questStep === 5 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs">
                  <h4 className="font-bold text-amber-400 mb-1">
                    Quest 5: Restore Network Configuration
                  </h4>
                  <p className="text-slate-300">
                    Choose the complete descriptive text configuration to bring the Expo gateway online and unlock the final key.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 0,
                      title: 'Config A (Corrupted / Incomplete)',
                      text: 'Network is wired cables. Internet is fast when we play games.',
                    },
                    {
                      id: 1,
                      title: 'Config B (Accurate Descriptive Configuration)',
                      text: 'The Smart School Network is an enterprise campus infrastructure developed by TJKT students. It has an enterprise rack server, a core Gigabit router, and managed switches that provide high-speed connectivity across the entire Expo.',
                    },
                  ].map((cfg) => (
                    <div
                      key={cfg.id}
                      onClick={() => {
                        sound.playInteract();
                        setTjktConfigChoice(cfg.id);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        tjktConfigChoice === cfg.id
                          ? 'border-sky-400 bg-sky-950/40 shadow-lg'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <h5 className="font-bold text-xs text-white mb-1">{cfg.title}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">{cfg.text}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleTjktConfigSubmit}
                  className="w-full mt-4 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm pixel-btn shadow-md flex items-center justify-center gap-2"
                >
                  <span>Deploy Configuration & Decrypt Key</span>
                  <Key className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
