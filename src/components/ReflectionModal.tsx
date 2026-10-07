import React, { useState } from 'react';
import { Department } from '../types/game';
import { DEPARTMENTS } from '../data/curriculumData';
import { sound } from '../utils/audio';
import { Send } from 'lucide-react';

interface ReflectionModalProps {
  department: Department;
  onCompleteReflection: (reflections: { q1: string; q2: string; q3: string }) => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  department,
  onCompleteReflection,
}) => {
  const deptInfo = DEPARTMENTS[department];

  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1.trim() || !q2.trim() || !q3.trim()) {
      setError('Silakan isi ketiga pertanyaan refleksi untuk melengkapi portofolio.');
      sound.playError();
      return;
    }
    sound.playSuccess();
    onCompleteReflection({
      q1: q1.trim(),
      q2: q2.trim(),
      q3: q3.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB]/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-retro-dots">
      <div className="w-full max-w-xl bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[5px_5px_0_0_#2B2D42] rounded-3xl p-5 sm:p-7 text-[#2B2D42] my-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D8F3DC] border border-[#2B2D42] text-[#1B4332] rounded-full text-xs font-bold mb-1.5 shadow-[1.5px_1.5px_0_0_#2B2D42]">
            <span className="text-xs">🔥</span>
            <span>Kurikulum Merdeka · Deep Learning Reflection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2B2D42] tracking-tight">
            Refleksi Bahasa Inggris Kejuruan
          </h2>
          <p className="text-xs text-[#4A4E69] mt-0.5 font-medium">
            Renungkan pembelajaran kejuruanmu di SMK Muhammadiyah Bawang.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Question 1 */}
          <div className="bg-[#FFF3B0]/60 p-3.5 rounded-2xl border-1.5 border-[#2B2D42]">
            <label className="block text-xs font-bold text-[#78350F] mb-1.5">
              1. Apa yang kamu pelajari tentang jurusanmu ({deptInfo.shortName})?
            </label>
            <textarea
              rows={2}
              value={q1}
              onChange={(e) => {
                setQ1(e.target.value);
                if (error) setError(null);
              }}
              placeholder={`Contoh: Saya belajar mendeskripsikan ${deptInfo.projectTitle} menggunakan istilah teknis seperti...`}
              className="w-full bg-[#FFFDF9] border-1.5 border-[#2B2D42] rounded-xl p-2.5 text-xs text-[#2B2D42] font-medium placeholder-[#6C757D] focus:outline-none focus:bg-[#FFF3B0]/30 resize-none shadow-xs"
            />
          </div>

          {/* Question 2 */}
          <div className="bg-[#EFF7F6] p-3.5 rounded-2xl border-1.5 border-[#2B2D42]">
            <label className="block text-xs font-bold text-[#1B4332] mb-1.5">
              2. Ungkapan bahasa Inggris mana yang paling bermanfaat?
            </label>
            <textarea
              rows={2}
              value={q2}
              onChange={(e) => {
                setQ2(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Struktur Identification + Description serta preposisi tempat seperti 'under the seat' atau 'next to the server'..."
              className="w-full bg-[#FFFDF9] border-1.5 border-[#2B2D42] rounded-xl p-2.5 text-xs text-[#2B2D42] font-medium placeholder-[#6C757D] focus:outline-none focus:bg-[#EFF7F6] resize-none shadow-xs"
            />
          </div>

          {/* Question 3 */}
          <div className="bg-[#FFD8BE]/50 p-3.5 rounded-2xl border-1.5 border-[#2B2D42]">
            <label className="block text-xs font-bold text-[#78290F] mb-1.5">
              3. Bagaimana bahasa Inggris membantumu di dunia kerja/karier masa depan?
            </label>
            <textarea
              rows={2}
              value={q3}
              onChange={(e) => {
                setQ3(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Membantu saya menjelaskan spesifikasi produk kepada klien, membaca manual teknis, dan mempresentasikan karya inovasi..."
              className="w-full bg-[#FFFDF9] border-1.5 border-[#2B2D42] rounded-xl p-2.5 text-xs text-[#2B2D42] font-medium placeholder-[#6C757D] focus:outline-none focus:bg-[#FFD8BE]/30 resize-none shadow-xs"
            />
          </div>

          {error && (
            <p className="text-xs text-[#E63946] font-bold text-center bg-[#FFD6D6] border border-[#E63946] py-1.5 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#FFD166] hover:bg-[#FFC024] text-[#2B2D42] font-black rounded-2xl text-xs sm:text-sm postmodern-btn shadow-md flex items-center justify-center gap-2"
          >
            <span>Kirim Hasil Resmi Expo 2026</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
