import React, { useState } from 'react';
import { CharacterGender, Department, StudentProfile } from '../types/game';
import { DEPARTMENTS } from '../data/curriculumData';
import { sound } from '../utils/audio';
import { User, School, ArrowRight, Check } from 'lucide-react';

interface CharacterSelectProps {
  onStartGame: (profile: StudentProfile) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onStartGame }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('X AKL 1');
  const [gender, setGender] = useState<CharacterGender>('girl_hijab');
  const [department, setDepartment] = useState<Department>('AKL');
  const [error, setError] = useState<string | null>(null);

  const defaultClasses = [
    'X AKL 1',
    'X AKL 2',
    'X Otomotif 1',
    'X Otomotif 2',
    'X TJKT 1',
    'X TJKT 2',
  ];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Silakan masukkan nama lengkap siswa.');
      sound.playError();
      return;
    }
    sound.playSuccess();
    onStartGame({
      name: name.trim(),
      className: className.trim(),
      gender,
      department,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB]/95 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-retro-dots">
      <div className="w-full max-w-xl bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[5px_5px_0_0_#2B2D42] rounded-3xl p-5 sm:p-7 text-[#2B2D42] my-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF3B0] border border-[#2B2D42] rounded-full text-xs font-bold mb-1.5 shadow-[1.5px_1.5px_0_0_#2B2D42]">
            <span className="text-xs">🔥</span>
            <span>SMK Muhammadiyah Bawang · Profil Siswa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2B2D42] tracking-tight">
            Pilih Karakter & Jurusan
          </h2>
          <p className="text-xs text-[#4A4E69] mt-0.5 font-medium">
            Tentukan identitas dan jalur kejuruanmu untuk memulai petualangan.
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-4">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2B2D42] mb-1">
                Nama Siswa *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Contoh: Ahmad Fauzi / Siti Rahma"
                  maxLength={40}
                  className="w-full bg-[#FFFDF9] border-2 border-[#2B2D42] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2B2D42] font-semibold placeholder-[#6C757D] focus:outline-none focus:bg-[#FFF3B0]/30 shadow-[2px_2px_0_0_#2B2D42]"
                />
                <User className="w-4 h-4 text-[#6C757D] absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2D42] mb-1">
                Kelas / Rombel *
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="class-options"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: X AKL 1"
                  className="w-full bg-[#FFFDF9] border-2 border-[#2B2D42] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2B2D42] font-semibold placeholder-[#6C757D] focus:outline-none focus:bg-[#FFF3B0]/30 shadow-[2px_2px_0_0_#2B2D42]"
                />
                <datalist id="class-options">
                  {defaultClasses.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <School className="w-4 h-4 text-[#6C757D] absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Character Appearance */}
          <div>
            <label className="block text-xs font-bold text-[#2B2D42] mb-1.5">
              Pilihan Tampilan Siswa:
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: 'boy' as CharacterGender, label: 'Siswa Laki-laki', emoji: '👦', bg: '#D0F4DE' },
                { id: 'girl_hijab' as CharacterGender, label: 'Siswi Berhijab', emoji: '🧕', bg: '#B7E4C7' },
                { id: 'girl_nohijab' as CharacterGender, label: 'Siswi Non-hijab', emoji: '👧', bg: '#E2D4F0' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    sound.playInteract();
                    setGender(item.id);
                    if (item.id === 'boy') {
                      sound.playSpeakerGreeting('player', 'male', 'Halo! Saya siap berpetualang di SMK Muhammadiyah Bawang!');
                    } else {
                      sound.playSpeakerGreeting('player', 'female', 'Halo! Saya siap berpetualang di SMK Muhammadiyah Bawang!');
                    }
                  }}
                  className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                    gender === item.id
                      ? 'border-[#2B2D42] shadow-[3px_3px_0_0_#2B2D42] font-extrabold scale-[1.02]'
                      : 'border-[#2B2D42]/40 opacity-75 hover:opacity-100 hover:border-[#2B2D42]'
                  }`}
                  style={{ backgroundColor: item.bg }}
                >
                  <span className="text-2xl sm:text-3xl mb-1">{item.emoji}</span>
                  <span className="text-[11px] sm:text-xs text-[#2B2D42] leading-tight font-bold">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-xs font-bold text-[#2B2D42] mb-1.5">
              Pilih Jurusan Kejuruan (Rute Misi):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(Object.keys(DEPARTMENTS) as Department[]).map((deptKey) => {
                const dept = DEPARTMENTS[deptKey];
                const isSelected = department === deptKey;
                const pastelBg =
                  deptKey === 'AKL'
                    ? '#D8F3DC'
                    : deptKey === 'OTOMOTIF'
                    ? '#FFD8BE'
                    : '#E2D4F0';

                return (
                  <button
                    type="button"
                    key={deptKey}
                    onClick={() => {
                      sound.playInteract();
                      setDepartment(deptKey);
                      if (className.startsWith('X ')) {
                        setClassName(`X ${dept.shortName} 1`);
                      }
                      if (deptKey === 'AKL') {
                        sound.playSpeakerGreeting('naya', 'female', 'Halo! Saya Naya dari Akuntansi dan Perbankan Syariah.');
                      } else if (deptKey === 'OTOMOTIF') {
                        sound.playSpeakerGreeting('raka', 'male', 'Halo! Saya Raka dari Teknik Otomotif.');
                      } else {
                        sound.playSpeakerGreeting('dimas', 'male', 'Halo! Saya Dimas dari Teknik Jaringan Komputer dan Telekomunikasi.');
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#2B2D42] shadow-[3px_3px_0_0_#2B2D42] scale-[1.02]'
                        : 'border-[#2B2D42]/40 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: pastelBg }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-pixel text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FFFDF9] border border-[#2B2D42] text-[#2B2D42]">
                          {dept.shortName}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#2B2D42]" />}
                      </div>
                      <h4 className="font-extrabold text-xs text-[#2B2D42] leading-snug">
                        {dept.name}
                      </h4>
                      <p className="text-[10px] text-[#2B2D42] font-semibold mt-1">
                        {dept.projectTitle}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#2B2D42]/30 flex items-center justify-between text-[9px] text-[#4A4E69] font-medium">
                      <span>NPC: {dept.npcName}</span>
                      <span>Laboratorium</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#E63946] font-bold text-center bg-[#FFD6D6] border border-[#E63946] py-1.5 rounded-xl">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#FFD166] hover:bg-[#FFC024] text-[#2B2D42] font-black rounded-2xl text-xs sm:text-sm postmodern-btn shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>Masuk SMK Muhammadiyah Bawang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
