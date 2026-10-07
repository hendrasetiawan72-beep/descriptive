import React, { useState, useEffect } from 'react';
import { CharacterGender, Department } from '../types/game';
import { sound, SpeakerAvatar } from '../utils/audio';
import { Volume2, ChevronRight, HelpCircle, Flame } from 'lucide-react';

interface DialogueBoxProps {
  speaker: string;
  avatar: SpeakerAvatar;
  text: string;
  gender: CharacterGender;
  department: Department;
  onNext: () => void;
  nextLabel?: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  avatar,
  text,
  gender,
  department,
  onNext,
  nextLabel = 'Lanjut →',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  const speakerGender: 'male' | 'female' =
    avatar === 'naya'
      ? 'female'
      : avatar === 'player' && (gender === 'girl_hijab' || gender === 'girl_nohijab')
      ? 'female'
      : 'male';

  const voiceLabel =
    avatar === 'mr_hendra'
      ? 'English Voice · Deep Bass Male (Mr. Hendra)'
      : avatar === 'naya'
      ? 'English Voice · Friendly Female (Naya - AKL)'
      : avatar === 'raka'
      ? 'English Voice · Deep Bass Male (Raka - Otomotif)'
      : avatar === 'dimas'
      ? 'English Voice · Deep Bass Male (Dimas - TJKT)'
      : speakerGender === 'male'
      ? 'English Voice · Male'
      : 'English Voice · Female';

  // Check if text has a conversational stimulus question
  const hasQuestion = text.includes('?');

  // Check if text is an object inspection log: [ObjectName]: ObjectDescription (Inspected: X/5 ...)
  const isObservationLog = speaker === 'Observation Log' || text.startsWith('[');
  const logMatch = isObservationLog ? text.match(/^\[(.*?)\]:\s*(.*?)(?:\s*\((Inspected:.*?)\))?$/s) : null;

  // Trigger vocal greeting when dialogue changes
  useEffect(() => {
    setDisplayedText('');
    setIsDone(false);
    let index = 0;

    // Full English Voiceover reading entire text completely without cutting off
    sound.playSpeakerGreeting(avatar, speakerGender, text);

    const interval = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        if (index % 3 === 0) {
          sound.playTypingVoice(speakerGender, avatar);
        }
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, 18);

    return () => {
      clearInterval(interval);
      sound.stopSpeech();
    };
  }, [text, avatar, speakerGender]);

  const handleReplayVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.stopSpeech();
    sound.playSpeakerGreeting(avatar, speakerGender, text);
  };

  const handleSkipOrNext = () => {
    if (!isDone) {
      setDisplayedText(text);
      setIsDone(true);
    } else {
      sound.stopSpeech();
      sound.playInteract();
      onNext();
    }
  };

  const renderChibiPortrait = () => {
    if (avatar === 'mr_hendra') {
      return (
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFE5D9] rounded-2xl border-2 border-[#2B2D42] shadow-[2.5px_2.5px_0_0_#2B2D42] flex items-center justify-center shrink-0 relative overflow-hidden">
          <div className="text-2xl sm:text-3xl select-none animate-pulse">👨‍🏫</div>
          <div className="absolute bottom-0 inset-x-0 py-0.5 bg-[#9D4EDD] text-[9px] text-white font-extrabold text-center tracking-wider">
            TEACHER
          </div>
        </div>
      );
    }
    if (avatar === 'naya') {
      return (
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#D8F3DC] rounded-2xl border-2 border-[#2B2D42] shadow-[2.5px_2.5px_0_0_#2B2D42] flex items-center justify-center shrink-0 relative overflow-hidden">
          <div className="text-2xl sm:text-3xl select-none animate-bounce">🧕</div>
          <div className="absolute bottom-0 inset-x-0 py-0.5 bg-[#2D6A4F] text-[9px] text-[#D8F3DC] font-extrabold text-center tracking-wider">
            AKL
          </div>
        </div>
      );
    }
    if (avatar === 'raka') {
      return (
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFD8BE] rounded-2xl border-2 border-[#2B2D42] shadow-[2.5px_2.5px_0_0_#2B2D42] flex items-center justify-center shrink-0 relative overflow-hidden">
          <div className="text-2xl sm:text-3xl select-none">🧑‍🔧</div>
          <div className="absolute bottom-0 inset-x-0 py-0.5 bg-[#E76F51] text-[9px] text-white font-extrabold text-center tracking-wider">
            OTOMOTIF
          </div>
        </div>
      );
    }
    if (avatar === 'dimas') {
      return (
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#C8B6FF] rounded-2xl border-2 border-[#2B2D42] shadow-[2.5px_2.5px_0_0_#2B2D42] flex items-center justify-center shrink-0 relative overflow-hidden">
          <div className="text-2xl sm:text-3xl select-none">🧑‍💻</div>
          <div className="absolute bottom-0 inset-x-0 py-0.5 bg-[#5A189A] text-[9px] text-[#C8B6FF] font-extrabold text-center tracking-wider">
            TJKT
          </div>
        </div>
      );
    }

    // Player Avatar
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFF3B0] rounded-2xl border-2 border-[#2B2D42] shadow-[2.5px_2.5px_0_0_#2B2D42] flex items-center justify-center shrink-0 relative overflow-hidden">
        <div className="text-2xl sm:text-3xl select-none">
          {gender === 'girl_hijab' ? '🧕' : gender === 'girl_nohijab' ? '👧' : '👦'}
        </div>
        <div className="absolute bottom-0 inset-x-0 py-0.5 bg-[#2B2D42] text-[9px] text-white font-extrabold text-center tracking-wider">
          YOU
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={handleSkipOrNext}
      className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:w-[700px] z-50 cursor-pointer pointer-events-auto max-h-[82vh] flex flex-col justify-end"
    >
      {/* Vintage Postmodernism Eclectic Dialogue Card with Strict Overflow Protection */}
      <div className="relative bg-[#FFFDF9] border-[2.5px] border-[#2B2D42] shadow-[4px_4px_0_0_#2B2D42] rounded-2xl p-3 sm:p-5 flex items-start gap-3 sm:gap-4.5 overflow-hidden max-h-[80vh]">
        {/* Postmodern Memphis decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#FFE6A7] rounded-full border-2 border-[#2B2D42]/30 opacity-60" />
        </div>

        {renderChibiPortrait()}

        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch overflow-hidden">
          <div className="overflow-y-auto max-h-[56vh] pr-1">
            {/* Header: Speaker name + English Voiceover indicator + Sound Replay button */}
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 bg-[#FFF3B0] rounded-lg border border-[#2B2D42] text-xs font-black text-[#2B2D42] shadow-[1px_1px_0_0_#2B2D42]">
                  {speaker}
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FAF5EE] rounded-md border border-[#2B2D42]/40 text-[10px] font-bold text-[#5A5D75]">
                  <span
                    className={`w-2 h-2 rounded-full inline-block animate-pulse ${
                      speakerGender === 'male' ? 'bg-[#3A86FF]' : 'bg-[#FF006E]'
                    }`}
                  />
                  {voiceLabel}
                </span>
              </div>

              {/* Button to replay authentic voice */}
              <button
                type="button"
                onClick={handleReplayVoice}
                className="px-2.5 py-1 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] border border-[#2B2D42]/60 rounded-lg text-[10px] font-black flex items-center gap-1 transition-transform active:scale-95 shadow-[1px_1px_0_0_#2B2D42]"
                title="Dengarkan kembali suara narator bahasa Inggris lengkap"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ulangi Suara Penuh</span>
              </button>
            </div>

            {/* Stimulus indicator if conversational question present */}
            {hasQuestion && (
              <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEF08A] rounded-md text-[10px] font-extrabold text-[#713F12] border border-[#CA8A04]/40">
                <HelpCircle className="w-3 h-3 text-[#CA8A04]" />
                <span>Conversational Stimulus: Listen & Answer in your mind!</span>
              </div>
            )}

            {/* Structured Card for Object Inspection to guarantee text NEVER overflows out of frame */}
            {logMatch ? (
              <div className="space-y-2 bg-[#FBF8F1] border-1.5 border-[#2B2D42] rounded-xl p-2.5 sm:p-3 shadow-xs">
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFD8BE] text-[#78290F] border border-[#2B2D42] rounded-md text-[9px] font-black uppercase font-mono">
                    <Flame className="w-3 h-3 text-[#E76F51]" />
                    <span>Hasil Pemeriksaan Objek</span>
                  </div>
                  {logMatch[3] && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#D8F3DC] text-[#1B4332] border border-[#2B2D42] rounded-md text-[9px] font-black font-mono">
                      <span>🔥 {logMatch[3]}</span>
                    </div>
                  )}
                </div>

                <div className="bg-[#FFFDF9] border border-[#2B2D42]/30 px-2.5 py-1 rounded-lg">
                  <span className="text-[10px] font-bold text-[#6C757D] block uppercase font-mono">Peralatan Kejuruan:</span>
                  <h4 className="text-xs sm:text-sm font-black text-[#2B2D42] break-words">
                    {logMatch[1]}
                  </h4>
                </div>

                <div className="bg-[#FFFDF9] border border-[#2B2D42]/30 p-2.5 rounded-lg">
                  <span className="text-[10px] font-bold text-[#6C757D] block uppercase font-mono mb-0.5">Deskripsi Bahasa Inggris:</span>
                  <p className="text-xs sm:text-sm font-semibold text-[#2B2D42] leading-relaxed break-words">
                    {isDone ? logMatch[2] : displayedText.replace(/^\[.*?\]:\s*/, '')}
                    {!isDone && <span className="inline-block w-1.5 h-3.5 bg-[#E76F51] ml-0.5 animate-pulse" />}
                  </p>
                </div>
              </div>
            ) : (
              /* Typewritten Regular Dialogue Content in English */
              <div className="min-h-[44px]">
                <p className="text-xs sm:text-sm font-semibold text-[#2B2D42] leading-relaxed tracking-wide break-words whitespace-pre-line">
                  {displayedText}
                  {!isDone && <span className="inline-block w-1.5 h-3.5 bg-[#E76F51] ml-0.5 animate-pulse" />}
                </p>
              </div>
            )}
          </div>

          {/* Action indicator at bottom */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8DFD0] shrink-0">
            <span className="text-[10px] text-[#7E8299] font-medium flex items-center gap-1">
              <span className="text-xs">🔥</span>
              Ketuk untuk lanjut membaca
            </span>

            <button
              type="button"
              onClick={handleSkipOrNext}
              className="px-3 py-1 bg-[#2B2D42] text-white hover:bg-[#3D405B] rounded-lg text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0_0_#E76F51] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>{isDone ? nextLabel : 'Cepat →'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
