import React, { useState } from 'react';
import { DESCRIPTIVE_TEXT_GUIDE } from '../data/curriculumData';
import { sound } from '../utils/audio';
import { BookOpen, ArrowRight, Lightbulb } from 'lucide-react';

interface PrologueTutorialModalProps {
  onClose: () => void;
}

export const PrologueTutorialModal: React.FC<PrologueTutorialModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'structure' | 'grammar'>('structure');

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB]/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-retro-dots">
      <div className="w-full max-w-2xl bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[5px_5px_0_0_#2B2D42] rounded-3xl p-5 sm:p-7 text-[#2B2D42] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2B2D42]/20 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF3B0] border border-[#2B2D42] flex items-center justify-center text-[#2B2D42] shadow-[1.5px_1.5px_0_0_#2B2D42]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#2B2D42]">
                Panduan Belajar: Descriptive Text
              </h3>
              <p className="text-[11px] text-[#6C757D] font-medium">
                Kurikulum Merdeka · Kelas X SMK Muhammadiyah Bawang
              </p>
            </div>
          </div>
          <span className="font-pixel text-[9px] text-[#2B2D42] bg-[#FFD8BE] px-2 py-0.5 rounded border border-[#2B2D42] font-bold">
            TUTORIAL
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-[#F0ECE1] rounded-xl mb-4 text-xs font-bold border border-[#2B2D42]">
          <button
            onClick={() => {
              sound.playInteract();
              setTab('structure');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'structure'
                ? 'bg-[#FFD166] text-[#2B2D42] shadow-[1.5px_1.5px_0_0_#2B2D42] border border-[#2B2D42]'
                : 'text-[#6C757D] hover:text-[#2B2D42]'
            }`}
          >
            1. Generic Structure (Identification & Description)
          </button>
          <button
            onClick={() => {
              sound.playInteract();
              setTab('grammar');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'grammar'
                ? 'bg-[#FFD166] text-[#2B2D42] shadow-[1.5px_1.5px_0_0_#2B2D42] border border-[#2B2D42]'
                : 'text-[#6C757D] hover:text-[#2B2D42]'
            }`}
          >
            2. Language & Grammar Features
          </button>
        </div>

        {/* Tab 1: Generic Structure */}
        {tab === 'structure' ? (
          <div className="space-y-3.5 text-xs">
            <div className="bg-[#FFF3B0]/60 p-3 rounded-2xl border-1.5 border-[#2B2D42]">
              <span className="text-[#2B2D42] font-extrabold block mb-0.5">Apa itu Descriptive Text?</span>
              <p className="text-[#4A4E69] leading-relaxed font-medium">
                {DESCRIPTIVE_TEXT_GUIDE.definition}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DESCRIPTIVE_TEXT_GUIDE.genericStructure.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#EFF7F6] border-1.5 border-[#2B2D42] rounded-2xl p-3 flex flex-col justify-between shadow-[2px_2px_0_0_#2B2D42]"
                >
                  <div>
                    <h4 className="font-extrabold text-[#1B4332] text-xs mb-1">
                      {item.part}
                    </h4>
                    <p className="text-[#4A4E69] text-[11px] mb-2 font-medium">{item.function}</p>
                  </div>
                  <div className="bg-[#FFFDF9] p-2 rounded-xl border border-[#2B2D42]/40 text-[11px] text-[#2B2D42] italic">
                    "{item.example}"
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#D8F3DC] border border-[#2B2D42] p-2.5 rounded-xl flex items-start gap-2 shadow-[1.5px_1.5px_0_0_#2B2D42]">
              <Lightbulb className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#1B4332] font-semibold">
                <strong>Ingat:</strong> Selalu awali dengan <strong>Identification</strong> (mengenalkan subjek/benda) sebelum menuliskan <strong>Description</strong> (bagian, fitur, dan fungsi)!
              </p>
            </div>
          </div>
        ) : (
          /* Tab 2: Language Features */
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DESCRIPTIVE_TEXT_GUIDE.languageFeatures.map((lf, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFDF9] border-1.5 border-[#2B2D42] rounded-xl p-2.5 shadow-[1.5px_1.5px_0_0_#2B2D42]"
                >
                  <span className="font-extrabold text-[#2B2D42] block mb-0.5">
                    {lf.feature}
                  </span>
                  <p className="text-[#4A4E69] text-[11px] leading-relaxed font-medium">{lf.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#FEF9E7] p-3 rounded-2xl border-1.5 border-[#2B2D42] text-xs">
              <span className="text-[#2B2D42] font-extrabold block mb-1">
                Kaidah Tata Bahasa Penting:
              </span>
              <ul className="space-y-1 text-[#4A4E69] text-[11px] list-disc list-inside font-medium">
                <li>
                  <strong>Linking Verbs:</strong> Gunakan <code className="text-[#78350F] font-bold">is</code> untuk tunggal (The computer is modern) dan <code className="text-[#78350F] font-bold">are</code> untuk jamak (The cables are long).
                </li>
                <li>
                  <strong>Possession:</strong> Gunakan <code className="text-[#78350F] font-bold">has</code> untuk tunggal (The bike has a battery) dan <code className="text-[#78350F] font-bold">have</code> untuk jamak (The students have tools).
                </li>
                <li>
                  <strong>Prepositions of Place:</strong> <code className="text-[#1A73E8] font-bold">under</code> the seat, <code className="text-[#1A73E8] font-bold">above</code> the handlebar, <code className="text-[#1A73E8] font-bold">next to</code> the server.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t-2 border-[#2B2D42]/20 flex justify-end">
          <button
            onClick={() => {
              sound.playSuccess();
              onClose();
            }}
            className="px-4 py-2 bg-[#FFD166] hover:bg-[#FFC024] text-[#2B2D42] font-black rounded-xl text-xs sm:text-sm postmodern-btn flex items-center gap-2"
          >
            <span>Paham, Mari Selidiki!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
