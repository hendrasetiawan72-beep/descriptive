import React, { useEffect, useState, useRef } from 'react';
import { GameProgress } from '../types/game';
import { calculateTotalScore, getRankTitle, formatTimePlayed, submitGameResult } from '../utils/formSubmit';
import { DEPARTMENTS } from '../data/curriculumData';
import { sound } from '../utils/audio';
import {
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Clock,
  User,
  Sparkles,
  Award,
} from 'lucide-react';

interface MissionCompleteScreenProps {
  progress: GameProgress;
  onRestart: () => void;
}

export const MissionCompleteScreen: React.FC<MissionCompleteScreenProps> = ({
  progress,
  onRestart,
}) => {
  const [submissionState, setSubmissionState] = useState<'submitting' | 'success' | 'error'>(
    progress.submitted ? 'success' : 'submitting'
  );
  const [submissionMsg, setSubmissionMsg] = useState(
    progress.submitted ? 'Data hasil berhasil terkirim ke formulir Expo.' : 'Mengirimkan hasil ke sistem Expo...'
  );
  const submittedRef = useRef(progress.submitted);

  const totalScore = calculateTotalScore(progress.scores);
  const rank = getRankTitle(totalScore);
  const timeFormatted = formatTimePlayed(progress.timePlayedSeconds);
  const deptInfo = progress.profile ? DEPARTMENTS[progress.profile.department] : null;

  // Automatic Submission Effect on Mount
  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const performSubmission = async () => {
      setSubmissionState('submitting');
      setSubmissionMsg('Mengirimkan hasil nilai ke formulir Expo...');

      const result = await submitGameResult(progress);
      if (result.success) {
        sound.playFanfare();
        setSubmissionState('success');
        setSubmissionMsg('Hasil kamu telah berhasil dikirim ke server Expo.');
      } else {
        sound.playError();
        setSubmissionState('error');
        setSubmissionMsg(result.message || 'Pengiriman gagal. Nilai tersimpan di perangkat dan dapat dicoba lagi.');
      }
    };

    performSubmission();
  }, [progress]);

  const handleRetry = async () => {
    sound.playInteract();
    setSubmissionState('submitting');
    setSubmissionMsg('Mencoba mengirim kembali...');
    const result = await submitGameResult(progress);
    if (result.success) {
      sound.playFanfare();
      setSubmissionState('success');
      setSubmissionMsg('Hasil kamu telah berhasil dikirim ke server Expo.');
    } else {
      sound.playError();
      setSubmissionState('error');
      setSubmissionMsg(result.message || 'Pengiriman gagal. Nilai tersimpan di perangkat dan dapat dicoba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB] text-[#2B2D42] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-retro-dots">
      <div className="w-full max-w-xl bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[6px_6px_0_0_#2B2D42] rounded-3xl p-5 sm:p-7 my-auto">
        {/* Banner */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF3B0] border border-[#2B2D42] text-[#2B2D42] rounded-full text-xs font-bold mb-2 font-pixel shadow-[1.5px_1.5px_0_0_#2B2D42]">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>EXPO ARCHIVE RESTORED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B2D42] tracking-tight">
            MISI SELESAI!
          </h1>
          <p className="text-xs text-[#4A4E69] mt-0.5 font-medium">
            SMK Muhammadiyah Bawang · Muhiba Skill & Innovation Expo 2026
          </p>
        </div>

        {/* Certificate Card in Eclectic Pastel */}
        <div className="bg-[#EFF7F6] rounded-2xl border-2 border-[#2B2D42] p-4 sm:p-5 mb-5 space-y-3.5 shadow-[3px_3px_0_0_#2B2D42]">
          {/* Top Line: Name & Class */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-[#2B2D42]/20 gap-2">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#6C757D] font-bold block">
                Nama Siswa:
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#2B2D42] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#E07A5F]" />
                <span>{progress.profile?.name}</span>
              </h2>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-mono text-[#6C757D] font-bold block">
                Kelas & Jurusan:
              </span>
              <div className="text-xs sm:text-sm font-bold text-[#1B4332]">
                {progress.profile?.className} · {deptInfo?.name}
              </div>
            </div>
          </div>

          {/* Score & Rank Hero Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-1 text-center">
            <div className="bg-[#FFF3B0] p-3 rounded-xl border-1.5 border-[#2B2D42] shadow-[2px_2px_0_0_#2B2D42]">
              <span className="text-[10px] text-[#78350F] font-bold block mb-0.5">Nilai Akhir</span>
              <span className="text-2xl sm:text-3xl font-black text-[#2B2D42] font-mono">
                {totalScore}
                <span className="text-xs font-normal text-[#6C757D]">/100</span>
              </span>
            </div>

            <div className="bg-[#E2D4F0] p-3 rounded-xl border-1.5 border-[#2B2D42] shadow-[2px_2px_0_0_#2B2D42]">
              <span className="text-[10px] text-[#240046] font-bold block mb-0.5">Peringkat</span>
              <span className="text-xs font-extrabold text-[#240046] font-pixel block leading-snug mt-1">
                {rank}
              </span>
            </div>

            <div className="bg-[#D8F3DC] p-3 rounded-xl border-1.5 border-[#2B2D42] shadow-[2px_2px_0_0_#2B2D42]">
              <span className="text-[10px] text-[#1B4332] font-bold block mb-0.5">Status Misi</span>
              <span className="text-xs font-black text-[#1B4332] flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>COMPLETED</span>
              </span>
            </div>
          </div>

          {/* Detailed Category Score Breakdown */}
          <div className="pt-2 border-t border-[#2B2D42]/20">
            <span className="text-[10px] font-black text-[#2B2D42] uppercase tracking-wide block mb-1.5">
              Rincian Penilaian Rubrik:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-center text-xs">
              <div className="bg-[#FFFDF9] p-1.5 rounded-lg border border-[#2B2D42]">
                <span className="text-[9px] text-[#6C757D] font-bold block">Vocabulary</span>
                <span className="font-bold text-[#2B2D42] font-mono">{progress.scores.vocabulary}/20</span>
              </div>
              <div className="bg-[#FFFDF9] p-1.5 rounded-lg border border-[#2B2D42]">
                <span className="text-[9px] text-[#6C757D] font-bold block">Grammar</span>
                <span className="font-bold text-[#2B2D42] font-mono">{progress.scores.grammar}/20</span>
              </div>
              <div className="bg-[#FFFDF9] p-1.5 rounded-lg border border-[#2B2D42]">
                <span className="text-[9px] text-[#6C757D] font-bold block">Structure</span>
                <span className="font-bold text-[#2B2D42] font-mono">{progress.scores.structure}/20</span>
              </div>
              <div className="bg-[#FFFDF9] p-1.5 rounded-lg border border-[#2B2D42]">
                <span className="text-[9px] text-[#6C757D] font-bold block">PBL Solusi</span>
                <span className="font-bold text-[#2B2D42] font-mono">{progress.scores.problemSolving}/20</span>
              </div>
              <div className="bg-[#FFFDF9] p-1.5 rounded-lg border border-[#2B2D42] col-span-2 sm:col-span-1">
                <span className="text-[9px] text-[#6C757D] font-bold block">Teks Akhir</span>
                <span className="font-bold text-[#2B2D42] font-mono">{progress.scores.finalDescription}/20</span>
              </div>
            </div>
          </div>

          {/* Time Played */}
          <div className="pt-2 border-t border-[#2B2D42]/20 flex items-center justify-between text-[11px] text-[#4A4E69]">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Waktu Bermain: <strong className="text-[#2B2D42]">{timeFormatted}</strong></span>
            </span>
            <span>Inovasi: <strong className="text-[#2B2D42]">{deptInfo?.projectTitle}</strong></span>
          </div>
        </div>

        {/* Web3Forms Auto-Submission Status Banner */}
        <div
          className={`p-3.5 rounded-2xl border-2 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-[2px_2px_0_0_#2B2D42] ${
            submissionState === 'success'
              ? 'bg-[#D8F3DC] border-[#2B2D42] text-[#1B4332]'
              : submissionState === 'submitting'
              ? 'bg-[#E8F0FE] border-[#2B2D42] text-[#1A73E8]'
              : 'bg-[#FFD6D6] border-[#2B2D42] text-[#E63946]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {submissionState === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] shrink-0" />
            ) : submissionState === 'submitting' ? (
              <RefreshCw className="w-5 h-5 text-[#1A73E8] shrink-0 animate-spin" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#E63946] shrink-0" />
            )}
            <div>
              <h4 className="font-black text-xs sm:text-sm">
                {submissionState === 'success'
                  ? 'Data hasil telah dikirimkan secara otomatis.'
                  : submissionState === 'submitting'
                  ? 'Sedang mengirim hasil ke database Expo...'
                  : 'Pengiriman gagal. Nilai tersimpan di perangkat dan dapat dicoba lagi.'}
              </h4>
              <p className="text-[10px] opacity-85 mt-0.5 font-medium">
                {submissionState === 'success'
                  ? 'Tervalidasi Web3Forms · Tersimpan di Arsip Expo SMK Muhammadiyah Bawang'
                  : submissionState === 'submitting'
                  ? 'Mengunggah nilai siswa dan refleksi...'
                  : submissionMsg}
              </p>
            </div>
          </div>

          {submissionState === 'error' && (
            <button
              onClick={handleRetry}
              className="px-3.5 py-1.5 bg-[#E63946] hover:bg-[#D62828] text-white font-bold rounded-xl text-xs postmodern-btn shrink-0"
            >
              Coba Kirim Ulang
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-[#6C757D] font-medium text-center sm:text-left">
            Terima kasih telah belajar bahasa Inggris bersama <strong>SMK Muhammadiyah Bawang</strong>!
          </p>

          <button
            onClick={() => {
              sound.playSuccess();
              onRestart();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#FFD166] hover:bg-[#FFC024] text-[#2B2D42] font-black rounded-2xl text-xs postmodern-btn transition-all"
          >
            Main Ulang / Pilih Rute Lain
          </button>
        </div>
      </div>
    </div>
  );
};
