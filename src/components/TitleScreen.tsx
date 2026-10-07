import React from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

interface TitleScreenProps {
  onStartNew: () => void;
  onContinue?: () => void;
  hasSavedGame: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartNew,
  onContinue,
  hasSavedGame,
}) => {
  return (
    <div className="relative w-full h-full min-h-screen bg-[#F7F4EB] text-[#2B2D42] flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto select-none bg-retro-dots">
      {/* Top School Trust Brand */}
      <header className="z-10 text-center pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFDF9] border-2 border-[#2B2D42] shadow-[2px_2px_0_0_#2B2D42] rounded-full text-xs font-bold text-[#2B2D42]">
          <span className="w-2 h-2 rounded-full bg-[#E07A5F] animate-ping" />
          <span>SMK Muhammadiyah Bawang</span>
          <span className="text-[#C4B9A7]">·</span>
          <span className="text-[#E07A5F]">Expo 2026</span>
        </div>
      </header>

      {/* Center Game Title Card in Eclectic Postmodern Pastel */}
      <main className="z-10 text-center max-w-xl my-auto py-4 sm:py-6 px-2 w-full">
        <div className="bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[6px_6px_0_0_#2B2D42] rounded-3xl p-5 sm:p-8">
          <div className="mb-3">
            <span className="font-pixel text-[10px] sm:text-xs text-[#2B2D42] bg-[#FFF3B0] border border-[#2B2D42] px-3 py-1 rounded-md tracking-wider uppercase inline-block font-bold">
              VOCATIONAL ENGLISH ADVENTURE
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2B2D42] tracking-tight leading-tight mb-2">
            MUHIBA MYSTERY:
            <span className="block text-[#E07A5F] font-pixel text-lg sm:text-2xl mt-1 tracking-normal">
              THE LOST DESCRIPTION
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#4A4E69] max-w-md mx-auto leading-relaxed mb-6 font-medium">
            Deskripsi inovasi proyek Expo mendadak hilang! Jelajahi bengkel & laboratorium SMK Muhammadiyah Bawang, kuasai <strong>Descriptive Text</strong>, dan temukan kepingan misteri.
          </p>

          {/* Route Highlights in Eclectic Pastels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-left">
            <div className="bg-[#D8F3DC] border-1.5 border-[#2B2D42] rounded-xl p-2.5 shadow-[2px_2px_0_0_#2B2D42]">
              <span className="text-[9px] font-bold text-[#1B4332] font-mono block">RUTE AKL</span>
              <h4 className="font-extrabold text-xs text-[#1B4332] leading-tight">Financial Dashboard</h4>
              <p className="text-[10px] text-[#2D6A4F] mt-0.5">Perbankan Syariah</p>
            </div>

            <div className="bg-[#FFD8BE] border-1.5 border-[#2B2D42] rounded-xl p-2.5 shadow-[2px_2px_0_0_#2B2D42]">
              <span className="text-[9px] font-bold text-[#78290F] font-mono block">RUTE OTOMOTIF</span>
              <h4 className="font-extrabold text-xs text-[#78290F] leading-tight">Electric Motorcycle</h4>
              <p className="text-[10px] text-[#9A031E] mt-0.5">Motor Listrik Pintar</p>
            </div>

            <div className="bg-[#E2D4F0] border-1.5 border-[#2B2D42] rounded-xl p-2.5 shadow-[2px_2px_0_0_#2B2D42]">
              <span className="text-[9px] font-bold text-[#240046] font-mono block">RUTE TJKT</span>
              <h4 className="font-extrabold text-xs text-[#240046] leading-tight">Smart Network</h4>
              <p className="text-[10px] text-[#3C096C] mt-0.5">Server & Router Jaringan</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playSuccess();
                onStartNew();
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#FFD166] hover:bg-[#FFC024] text-[#2B2D42] font-extrabold rounded-2xl text-sm sm:text-base postmodern-btn flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Petualangan</span>
            </button>

            {hasSavedGame && onContinue && (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onContinue();
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#FFFDF9] hover:bg-[#F7F4EB] text-[#2B2D42] font-bold rounded-2xl text-xs sm:text-sm postmodern-btn flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Lanjutkan Ekspedisi</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer Educational Standards */}
      <footer className="z-10 text-center text-[11px] text-[#6C757D] font-medium flex flex-wrap items-center justify-center gap-3 py-2 border-t border-[#2B2D42]/20 w-full max-w-xl">
        <span>Kurikulum Merdeka</span>
        <span>·</span>
        <span>Sentuh Jentik Immersif</span>
        <span>·</span>
        <span>Kelas X SMK Muhammadiyah Bawang</span>
      </footer>
    </div>
  );
};
