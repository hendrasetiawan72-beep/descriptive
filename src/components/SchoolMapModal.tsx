import React from 'react';
import { Department } from '../types/game';
import { DEPARTMENTS } from '../data/curriculumData';
import { sound } from '../utils/audio';
import { MapPin, X, Navigation } from 'lucide-react';

interface SchoolMapModalProps {
  currentMap: 'courtyard' | 'akl_lab' | 'otomotif_workshop' | 'tjkt_lab';
  department: Department;
  onClose: () => void;
}

export const SchoolMapModal: React.FC<SchoolMapModalProps> = ({
  currentMap,
  department,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB]/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-retro-dots">
      <div className="w-full max-w-xl bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[5px_5px_0_0_#2B2D42] rounded-3xl p-5 sm:p-6 text-[#2B2D42] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2B2D42]/20 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] border border-[#2B2D42] flex items-center justify-center text-[#1B4332] shadow-[1.5px_1.5px_0_0_#2B2D42]">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#2B2D42]">
                Peta Kampus SMK Muhammadiyah Bawang
              </h3>
              <p className="text-[11px] text-[#6C757D] font-medium">
                Muhiba Skill & Innovation Expo 2026
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

        {/* Vintage Postmodern Campus Map Layout */}
        <div className="relative bg-[#F7F4EB] rounded-2xl border-2 border-[#2B2D42] p-4 min-h-[260px] flex flex-col justify-between overflow-hidden shadow-inner">
          {/* North: TJKT Lab */}
          <div className="flex justify-center">
            <div
              className={`p-2.5 rounded-xl border-2 w-56 text-center transition-all ${
                currentMap === 'tjkt_lab'
                  ? 'border-[#2B2D42] bg-[#E2D4F0] shadow-[3px_3px_0_0_#2B2D42] scale-105'
                  : 'border-[#2B2D42]/40 bg-[#FFFDF9]'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#3C096C]" />
                <span className="font-extrabold text-xs text-[#2B2D42]">Lab Komputer TJKT</span>
              </div>
              <p className="text-[10px] text-[#4A4E69] font-medium">Smart Network · Dimas</p>
              {currentMap === 'tjkt_lab' && (
                <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-[#3C096C] font-bold bg-[#FFFDF9] px-2 py-0.5 rounded border border-[#2B2D42]">
                  <MapPin className="w-3 h-3 text-[#E07A5F]" /> POSISI KAMU
                </span>
              )}
            </div>
          </div>

          {/* Central Corridor & Wings: West AKL, Center Courtyard, East Otomotif */}
          <div className="flex items-center justify-between gap-2 my-4">
            {/* West: AKL Lab */}
            <div
              className={`p-2.5 rounded-xl border-2 w-44 text-center transition-all ${
                currentMap === 'akl_lab'
                  ? 'border-[#2B2D42] bg-[#D8F3DC] shadow-[3px_3px_0_0_#2B2D42] scale-105'
                  : 'border-[#2B2D42]/40 bg-[#FFFDF9]'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#1B4332]" />
                <span className="font-extrabold text-xs text-[#2B2D42]">Lab Akuntansi AKL</span>
              </div>
              <p className="text-[10px] text-[#4A4E69] font-medium">Dashboard · Naya</p>
              {currentMap === 'akl_lab' && (
                <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-[#1B4332] font-bold bg-[#FFFDF9] px-2 py-0.5 rounded border border-[#2B2D42]">
                  <MapPin className="w-3 h-3 text-[#E07A5F]" /> POSISI KAMU
                </span>
              )}
            </div>

            {/* Center: Courtyard */}
            <div
              className={`p-3 rounded-xl border-2 w-48 text-center transition-all ${
                currentMap === 'courtyard'
                  ? 'border-[#2B2D42] bg-[#FFF3B0] shadow-[3px_3px_0_0_#2B2D42] scale-105'
                  : 'border-[#2B2D42]/40 bg-[#FFFDF9]'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                <span className="font-extrabold text-xs text-[#2B2D42]">Halaman & Panggung</span>
              </div>
              <p className="text-[10px] text-[#4A4E69] font-medium">Terminal Expo · Mr. Hendra</p>
              {currentMap === 'courtyard' && (
                <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-[#78350F] font-bold bg-[#FFFDF9] px-2 py-0.5 rounded border border-[#2B2D42]">
                  <MapPin className="w-3 h-3 text-[#E07A5F]" /> POSISI KAMU
                </span>
              )}
            </div>

            {/* East: Otomotif */}
            <div
              className={`p-2.5 rounded-xl border-2 w-44 text-center transition-all ${
                currentMap === 'otomotif_workshop'
                  ? 'border-[#2B2D42] bg-[#FFD8BE] shadow-[3px_3px_0_0_#2B2D42] scale-105'
                  : 'border-[#2B2D42]/40 bg-[#FFFDF9]'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#78290F]" />
                <span className="font-extrabold text-xs text-[#2B2D42]">Bengkel Otomotif</span>
              </div>
              <p className="text-[10px] text-[#4A4E69] font-medium">Motor Listrik · Raka</p>
              {currentMap === 'otomotif_workshop' && (
                <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-[#78290F] font-bold bg-[#FFFDF9] px-2 py-0.5 rounded border border-[#2B2D42]">
                  <MapPin className="w-3 h-3 text-[#E07A5F]" /> POSISI KAMU
                </span>
              )}
            </div>
          </div>

          {/* South: Gate */}
          <div className="flex justify-center">
            <div className="bg-[#FFFDF9] border border-[#2B2D42] px-4 py-1.5 rounded-lg text-center text-[#6C757D] text-[11px] font-bold shadow-[1.5px_1.5px_0_0_#2B2D42]">
              🏫 Gerbang Utama SMK Muhammadiyah Bawang
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#4A4E69]">
          <span className="font-medium">Misi Jurusan: <strong className="text-[#2B2D42]">{DEPARTMENTS[department].name}</strong></span>
          <button
            onClick={() => {
              sound.playInteract();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#FFD166] hover:bg-[#FFC024] text-[#2B2D42] font-black rounded-xl text-xs postmodern-btn"
          >
            Tutup Peta
          </button>
        </div>
      </div>
    </div>
  );
};
