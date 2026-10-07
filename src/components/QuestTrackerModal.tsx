import React from 'react';
import { Department, ScoreState } from '../types/game';
import { DEPARTMENTS, getDepartmentObjective } from '../data/curriculumData';
import { calculateTotalScore } from '../utils/formSubmit';
import { sound } from '../utils/audio';
import { Compass, CheckCircle2, Circle, X, Flame } from 'lucide-react';

interface QuestTrackerModalProps {
  department: Department;
  currentQuestStep: number;
  scores: ScoreState;
  onClose: () => void;
}

export const QuestTrackerModal: React.FC<QuestTrackerModalProps> = ({
  department,
  currentQuestStep,
  scores,
  onClose,
}) => {
  const deptInfo = DEPARTMENTS[department];
  const totalScore = calculateTotalScore(scores);

  const scaffoldingLevels = [
    {
      level: 1,
      title: 'Level 1: Amati & Kumpulkan Kosakata',
      desc: `Jelajahi ${deptInfo.labName} dan kumpulkan 5 kata benda teknis.`,
      targetStep: 1,
    },
    {
      level: 2,
      title: 'Level 2: Tantangan Pasangan Adjektiva',
      desc: 'Pasangkan benda teknis dengan kata sifat deskriptif yang tepat.',
      targetStep: 2,
    },
    {
      level: 3,
      title: 'Level 3: Susun Kalimat Deskriptif',
      desc: 'Rangkai kalimat gramatikal dengan Simple Present, is/are, has/have.',
      targetStep: 3,
    },
    {
      level: 4,
      title: 'Level 4: Konstruksi Paragraf (Generic Structure)',
      desc: 'Atur kalimat menjadi Identification lalu diikuti Description.',
      targetStep: 4,
    },
    {
      level: 5,
      title: 'Level 5: Pemecahan Masalah Kejuruan & Petunjuk',
      desc: `Selesaikan error proyek ${deptInfo.projectTitle} dan temukan log rahasia.`,
      targetStep: 5,
    },
    {
      level: 6,
      title: 'Level 6: Produksi Teks Deskriptif Mandiri',
      desc: 'Tulis teks deskriptif utuh 4–5 kalimat di panggung utama Expo.',
      targetStep: 7,
    },
  ];

  const currentObj = getDepartmentObjective(department, currentQuestStep);

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB]/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-retro-dots">
      <div className="w-full max-w-xl bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[5px_5px_0_0_#2B2D42] rounded-3xl p-5 sm:p-6 text-[#2B2D42] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2B2D42]/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F0FE] border border-[#2B2D42] flex items-center justify-center text-[#1A73E8] shadow-[1.5px_1.5px_0_0_#2B2D42]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#2B2D42]">
                Pelacak Misi & Scaffolding
              </h3>
              <p className="text-[11px] text-[#6C757D] font-medium">
                {deptInfo.name} ({deptInfo.shortName})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playInteract();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-[#F0ECE1] text-[#2B2D42]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Rubric Bar */}
        <div className="bg-[#FFF3B0]/60 p-3 rounded-2xl border-1.5 border-[#2B2D42] mb-3 flex flex-wrap items-center justify-between gap-2 shadow-[2px_2px_0_0_#2B2D42]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#E76F51]" />
            <div>
              <span className="text-[10px] text-[#6C757D] font-bold block">Skor Total:</span>
              <span className="text-sm font-black text-[#2B2D42] font-mono">
                {totalScore} / 100
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold flex-wrap">
            <span className="bg-[#FFFDF9] px-2 py-0.5 rounded border border-[#2B2D42]">
              Vocab: {scores.vocabulary}/20
            </span>
            <span className="bg-[#FFFDF9] px-2 py-0.5 rounded border border-[#2B2D42]">
              Grammar: {scores.grammar}/20
            </span>
            <span className="bg-[#FFFDF9] px-2 py-0.5 rounded border border-[#2B2D42]">
              Structure: {scores.structure}/20
            </span>
            <span className="bg-[#FFFDF9] px-2 py-0.5 rounded border border-[#2B2D42]">
              PBL: {scores.problemSolving}/20
            </span>
          </div>
        </div>

        {/* Current Objective Card */}
        <div className="bg-[#FFD8BE]/50 border-1.5 border-[#2B2D42] p-3 rounded-2xl mb-3 shadow-[2px_2px_0_0_#2B2D42]">
          <span className="text-[9px] font-bold text-[#78290F] font-pixel uppercase block mb-1">
            TARGET MISI AKTIF
          </span>
          <h4 className="font-extrabold text-xs sm:text-sm text-[#2B2D42] mb-1.5">{currentObj.currentObjective}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#4A4E69] font-medium">
            <div>
              <strong className="text-[#2B2D42]">Lokasi:</strong> {currentObj.location}
            </div>
            <div>
              <strong className="text-[#2B2D42]">Aksi:</strong> {currentObj.requiredAction}
            </div>
          </div>
        </div>

        {/* Scaffolding Progression Steps */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          <span className="text-[11px] font-extrabold text-[#2B2D42] uppercase tracking-wide block">
            Progres Tahapan Scaffolding (Level 1–6):
          </span>
          {scaffoldingLevels.map((lvl) => {
            const isCompleted = currentQuestStep > lvl.targetStep;
            const isCurrent = currentQuestStep === lvl.targetStep;

            return (
              <div
                key={lvl.level}
                className={`p-2.5 rounded-xl border-1.5 flex items-start gap-2.5 transition-all ${
                  isCompleted
                    ? 'bg-[#D8F3DC] border-[#2B2D42]'
                    : isCurrent
                    ? 'bg-[#FFF3B0] border-[#2B2D42] shadow-[2px_2px_0_0_#2B2D42]'
                    : 'bg-[#F7F4EB] border-[#2B2D42]/30 opacity-70'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                ) : isCurrent ? (
                  <span className="text-sm shrink-0 mt-0.5 animate-pulse">🔥</span>
                ) : (
                  <Circle className="w-4 h-4 text-[#6C757D] shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold text-xs ${
                        isCompleted ? 'text-[#1B4332]' : isCurrent ? 'text-[#2B2D42]' : 'text-[#6C757D]'
                      }`}
                    >
                      {lvl.title}
                    </span>
                    <span className="text-[9px] font-mono font-bold">
                      {isCompleted ? 'SELESAI' : isCurrent ? 'AKTIF' : 'TERKUNCI'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#4A4E69] mt-0.5 font-medium">{lvl.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t-2 border-[#2B2D42]/20 flex justify-end">
          <button
            onClick={() => {
              sound.playInteract();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#FFD166] hover:bg-[#FFC024] text-[#2B2D42] font-black rounded-xl text-xs postmodern-btn"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
