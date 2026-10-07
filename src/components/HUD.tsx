import React, { useState, useEffect } from 'react';
import { Department, ObjectiveInfo, ScoreState } from '../types/game';
import { DEPARTMENTS } from '../data/curriculumData';
import { calculateTotalScore } from '../utils/formSubmit';
import { sound } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  MapPin,
  Compass,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Flame,
  Menu,
  Target,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface HUDProps {
  department: Department;
  scores: ScoreState;
  objective: ObjectiveInfo;
  questStep: number;
  totalSteps: number;
  onOpenMap: () => void;
  onOpenInventory: () => void;
  onOpenQuestTracker: () => void;
  currentMapTitle: string;
  isPlayerMoving?: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  department,
  scores,
  objective,
  questStep,
  totalSteps,
  onOpenMap,
  onOpenInventory,
  onOpenQuestTracker,
  currentMapTitle,
  isPlayerMoving = false,
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [isObjectiveExpanded, setIsObjectiveExpanded] = useState(false);
  const [forceVisible, setForceVisible] = useState(false);
  const [delayedHidden, setDelayedHidden] = useState(false);

  const totalScore = calculateTotalScore(scores);
  const progressPercent = Math.min(100, Math.round((questStep / totalSteps) * 100));
  const deptInfo = DEPARTMENTS[department];

  // Auto-hide when player moves, with smooth grace delay when stopping
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayerMoving) {
      setDelayedHidden(true);
      setForceVisible(false);
    } else {
      // Grace delay before reappearing after player stops moving
      timer = setTimeout(() => {
        setDelayedHidden(false);
      }, 350);
    }
    return () => clearTimeout(timer);
  }, [isPlayerMoving]);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const isHidden = delayedHidden && !forceVisible;

  const deptPastel =
    department === 'AKL'
      ? { bg: '#B7E4C7', text: '#1B4332', border: '#74C69D' }
      : department === 'OTOMOTIF'
      ? { bg: '#FFD8BE', text: '#78290F', border: '#E76F51' }
      : { bg: '#C8B6FF', text: '#240046', border: '#9D4EDD' };

  return (
    <>
      {/* Floating Tiny Pill: Appears at bottom-right when navigation auto-hides during movement */}
      <div
        className={`fixed bottom-3 right-3 z-40 transition-all duration-300 pointer-events-auto ${
          isHidden ? 'opacity-95 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            sound.playInteract();
            setForceVisible(!forceVisible);
          }}
          className="px-3 py-1.5 bg-[#FFFDF9]/95 backdrop-blur-xs border-2 border-[#2B2D42] rounded-full shadow-[2.5px_2.5px_0_0_#2B2D42] flex items-center gap-1.5 text-xs font-black text-[#2B2D42] active:scale-95"
          title="Tampilkan Navigasi & Misi"
        >
          <Menu className="w-3.5 h-3.5 text-[#E76F51]" />
          <span>Navigasi</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#FFF3B0] rounded-md border border-[#2B2D42]/40 font-bold">
            {totalScore} pts
          </span>
        </button>
      </div>

      {/* Main Bottom Navigation Bar & Clear Mission Tracker */}
      <nav
        aria-label="Game Navigation"
        className={`fixed bottom-0 left-0 right-0 z-30 select-none px-2 sm:px-4 pb-2.5 max-w-4xl mx-auto transition-all duration-300 ease-out flex flex-col gap-1.5 ${
          isHidden
            ? 'translate-y-[135%] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 pointer-events-none'
        }`}
      >
        {/* 1. CLEAR MISSION TRACKER ACCORDION BANNER */}
        <div className="w-full pointer-events-auto">
          <div className="bg-[#FFFDF9] border-[2.5px] border-[#2B2D42] shadow-[3.5px_3.5px_0_0_#2B2D42] rounded-2xl p-2.5 text-xs text-[#2B2D42]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="px-2 py-0.5 bg-[#FFF3B0] text-[#78350F] border border-[#2B2D42] rounded-lg text-[9px] font-black shrink-0 font-pixel flex items-center gap-1 shadow-xs">
                  <Target className="w-2.5 h-2.5 text-[#E76F51]" />
                  MISI {questStep}/8
                </span>
                <p className="font-black text-[#2B2D42] truncate text-xs sm:text-sm">
                  {objective.currentObjective}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playInteract();
                  setIsObjectiveExpanded(!isObjectiveExpanded);
                }}
                className="text-[#2B2D42] hover:bg-[#F7F4EB] flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-extrabold shrink-0 border border-[#2B2D42] bg-[#FAF5EE] shadow-[1px_1px_0_0_#2B2D42] transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>{isObjectiveExpanded ? 'Tutup Rincian' : 'Rincian Misi'}</span>
                {isObjectiveExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* 4-Poin Misi Jelas (Kurikulum Merdeka & Problem Based Learning) */}
            {isObjectiveExpanded && (
              <div className="mt-2.5 pt-2.5 border-t border-[#E3D3C1] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] animate-fadeIn">
                <div className="bg-[#FAF5EE] p-2 rounded-xl border border-[#2B2D42]/30">
                  <div className="flex items-center gap-1 text-[#6C757D] font-bold mb-0.5">
                    <MapPin className="w-3 h-3 text-[#E07A5F]" />
                    <span>1. LOKASI MISI:</span>
                  </div>
                  <p className="font-bold text-[#2B2D42] pl-4">{objective.location}</p>
                </div>

                <div className="bg-[#FAF5EE] p-2 rounded-xl border border-[#2B2D42]/30">
                  <div className="flex items-center gap-1 text-[#E07A5F] font-bold mb-0.5">
                    <Target className="w-3 h-3 text-[#E07A5F]" />
                    <span>2. AKSI YANG DIPERLUKAN:</span>
                  </div>
                  <p className="font-bold text-[#E07A5F] pl-4">{objective.requiredAction}</p>
                </div>

                <div className="bg-[#FAF5EE] p-2 rounded-xl border border-[#2B2D42]/30">
                  <div className="flex items-center gap-1 text-[#2A9D8F] font-bold mb-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#2A9D8F]" />
                    <span>3. KONDISI SUKSES:</span>
                  </div>
                  <p className="font-bold text-[#2A9D8F] pl-4">{objective.successCondition}</p>
                </div>

                <div className="bg-[#FAF5EE] p-2 rounded-xl border border-[#2B2D42]/30">
                  <div className="flex items-center gap-1 text-[#457B9D] font-bold mb-0.5">
                    <ArrowRight className="w-3 h-3 text-[#457B9D]" />
                    <span>4. MISI BERIKUTNYA:</span>
                  </div>
                  <p className="font-bold text-[#457B9D] pl-4">{objective.nextObjective}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. BOTTOM NAVIGATION BAR: Brand, Location, Progress & Action Buttons */}
        <div className="w-full bg-[#FFFDF9] border-[2.5px] border-[#2B2D42] shadow-[3.5px_3.5px_0_0_#2B2D42] rounded-2xl px-2.5 sm:px-4 py-2 flex items-center justify-between text-[#2B2D42] pointer-events-auto relative overflow-hidden">
          {/* Subtle Postmodern Memphis corner strip */}
          <div
            className="absolute top-0 left-0 w-2 h-full"
            style={{ backgroundColor: deptPastel.bg }}
          />

          {/* Left Zone: Brand & Department route */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 pl-1.5">
            <div
              className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-black border-2 border-[#2B2D42] shrink-0 shadow-[1.5px_1.5px_0_0_#2B2D42]"
              style={{ backgroundColor: deptPastel.bg, color: deptPastel.text }}
            >
              {deptInfo.shortName}
            </div>

            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-black tracking-tight truncate text-[#2B2D42]">
                MUHIBA MYSTERY
              </h1>
              <p className="text-[9px] text-[#6C757D] font-bold truncate hidden sm:block">
                SMK Muhammadiyah Bawang
              </p>
            </div>
          </div>

          {/* Center Zone: Location & Progress Bar (Hidden on tiny screens) */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-[#4A4E69] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#2B2D42]/30">
              <MapPin className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span className="font-bold">{currentMapTitle}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#6C757D] text-[10px] font-bold">Expo:</span>
              <div className="w-16 sm:w-20 bg-[#F0ECE1] rounded-full h-2 overflow-hidden border border-[#2B2D42]">
                <div
                  className="h-full bg-[#74C69D] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-xs font-black text-[#1B4332]">{progressPercent}%</span>
            </div>
          </div>

          {/* Right Zone: Action Buttons (Misi, Petunjuk, Peta, Audio) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Score Badge */}
            <div className="flex items-center gap-1 px-2 py-1 bg-[#FFF3B0] border-2 border-[#2B2D42] rounded-xl text-xs font-bold text-[#2B2D42] shadow-[1.5px_1.5px_0_0_#2B2D42]">
              <Flame className="w-3.5 h-3.5 text-[#E76F51] shrink-0" />
              <span className="font-mono font-black">{totalScore}</span>
              <span className="text-[10px] text-[#6C757D]">/100</span>
            </div>

            {/* Quest Tracker */}
            <button
              type="button"
              onClick={() => {
                sound.playInteract();
                onOpenQuestTracker();
              }}
              className="px-2 py-1 bg-[#C8B6FF] hover:bg-[#B8C0FF] border-2 border-[#2B2D42] rounded-xl text-xs font-bold text-[#240046] shadow-[1.5px_1.5px_0_0_#2B2D42] transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1"
              title="Quest Log"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Misi</span>
            </button>

            {/* Inventory */}
            <button
              type="button"
              onClick={() => {
                sound.playInteract();
                onOpenInventory();
              }}
              className="px-2 py-1 bg-[#FFD8BE] hover:bg-[#FDC3A0] border-2 border-[#2B2D42] rounded-xl text-xs font-bold text-[#78290F] shadow-[1.5px_1.5px_0_0_#2B2D42] transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1"
              title="Clues & Inventory"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Petunjuk</span>
            </button>

            {/* Map */}
            <button
              type="button"
              onClick={() => {
                sound.playInteract();
                onOpenMap();
              }}
              className="px-2 py-1 bg-[#B7E4C7] hover:bg-[#95D5B2] border-2 border-[#2B2D42] rounded-xl text-xs font-bold text-[#1B4332] shadow-[1.5px_1.5px_0_0_#2B2D42] transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1"
              title="School Map"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Peta</span>
            </button>

            {/* Audio toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-1.5 bg-[#FFFDF9] hover:bg-[#FAF5EE] border-2 border-[#2B2D42] rounded-xl text-[#2B2D42] shadow-[1.5px_1.5px_0_0_#2B2D42] transition-transform active:translate-x-0.5 active:translate-y-0.5"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-[#E63946]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#2A9D8F]" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
