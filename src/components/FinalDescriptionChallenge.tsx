import React, { useState, useMemo } from 'react';
import { Department } from '../types/game';
import { DEPARTMENTS } from '../data/curriculumData';
import { sound } from '../utils/audio';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface FinalDescriptionChallengeProps {
  department: Department;
  onCompleteFinalText: (text: string, scoreEarned: number) => void;
}

export const FinalDescriptionChallenge: React.FC<FinalDescriptionChallengeProps> = ({
  department,
  onCompleteFinalText,
}) => {
  const deptInfo = DEPARTMENTS[department];

  // Default initial draft placeholder for inspiration
  const [studentText, setStudentText] = useState('');
  const [showWordBank, setShowWordBank] = useState(false);

  // Vocabulary bank based on department
  const vocabBank = useMemo(() => {
    if (department === 'AKL') {
      return {
        nouns: ['Smart Financial Dashboard', 'accounting laboratory', 'modern computers', 'ledger', 'calculator', 'Islamic banking system'],
        adjectives: ['modern', 'organized', 'accurate', 'digital', 'efficient', 'clear'],
        verbs: ['is', 'are', 'has', 'have', 'records', 'calculates', 'displays'],
        prepositions: ['in', 'on', 'inside', 'next to', 'near'],
      };
    } else if (department === 'OTOMOTIF') {
      return {
        nouns: ['Smart Electric Motorcycle', 'automotive workshop', 'lithium battery', 'electric motor', 'digital dashboard', 'LED headlight'],
        adjectives: ['sleek', 'powerful', 'efficient', 'compact', 'digital', 'aerodynamic'],
        verbs: ['is', 'are', 'has', 'have', 'drives', 'stores', 'illuminates'],
        prepositions: ['under', 'above', 'in', 'behind', 'next to'],
      };
    } else {
      return {
        nouns: ['Smart School Network', 'network laboratory', 'server rack', 'router', 'managed switch', 'Ethernet cables'],
        adjectives: ['high-speed', 'resilient', 'secure', 'connected', 'modern', 'digital'],
        verbs: ['is', 'are', 'has', 'have', 'connects', 'transmits', 'monitors'],
        prepositions: ['next to', 'below', 'near', 'inside', 'between'],
      };
    }
  }, [department]);

  // Linguistic Evaluation Engine
  const analysis = useMemo(() => {
    const raw = studentText.trim();
    // Split into sentences (by period, exclamation, or question mark)
    const sentences = raw
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    const sentenceCount = sentences.length;

    // Check 1: Identification (mentions department project/lab or "is a/an...")
    const hasIdentification =
      /smart|financial|motorcycle|electric|network|laboratory|workshop|dashboard/i.test(
        sentences[0] || ''
      ) && /is|developed|created/i.test(sentences[0] || '');

    // Check 2: Technical vocabulary usage
    const matchedNouns = vocabBank.nouns.filter((noun) =>
      new RegExp(noun.split(' ')[0], 'i').test(raw)
    );

    // Check 3: Adjectives usage
    const matchedAdjectives = vocabBank.adjectives.filter((adj) =>
      new RegExp(`\\b${adj}\\b`, 'i').test(raw)
    );

    // Check 4: Linking verbs & Possession (is/are, has/have)
    const hasLinkingOrPossession = /\b(is|are|has|have)\b/i.test(raw);

    // Check 5: Preposition of place
    const hasPreposition = /\b(in|on|under|above|next to|near|behind|inside|between)\b/i.test(
      raw
    );

    // Scoring rubric (max 20 points):
    let score = 0;
    if (sentenceCount >= 4) score += 4;
    else if (sentenceCount >= 2) score += 2;

    if (hasIdentification) score += 4;
    if (matchedNouns.length >= 2) score += 4;
    else if (matchedNouns.length >= 1) score += 2;

    if (matchedAdjectives.length >= 2) score += 3;
    else if (matchedAdjectives.length >= 1) score += 1;

    if (hasLinkingOrPossession) score += 3;
    if (hasPreposition) score += 2;

    const isReady =
      sentenceCount >= 4 &&
      hasIdentification &&
      matchedNouns.length >= 2 &&
      matchedAdjectives.length >= 1 &&
      hasLinkingOrPossession;

    return {
      sentenceCount,
      hasIdentification,
      matchedNouns,
      matchedAdjectives,
      hasLinkingOrPossession,
      hasPreposition,
      score: Math.min(20, score),
      isReady,
    };
  }, [studentText, vocabBank]);

  const handleInsertWord = (word: string) => {
    sound.playInteract();
    setStudentText((prev) => (prev ? `${prev} ${word}` : word));
  };

  const handleUseSample = () => {
    sound.playInteract();
    let template = '';
    if (department === 'AKL') {
      template =
        'The Smart Financial Dashboard is an innovative financial system developed by AKL students. The accounting laboratory has several modern computers and organized ledgers. The financial calculator is an accurate tool for auditing balance sheets. The system has digital analytics that display transactions in real time.';
    } else if (department === 'OTOMOTIF') {
      template =
        'The Smart Electric Motorcycle is an eco-friendly vehicle created in the Muhiba workshop. It has a sleek chassis and two aerodynamic tires. The high-capacity battery is under the comfortable seat. The digital dashboard is above the handlebar, and the powerful electric motor is in the rear wheel.';
    } else {
      template =
        'The Smart School Network is a high-speed campus infrastructure built by TJKT students. The network laboratory has an enterprise server rack and a core router. The router is next to the server, and the managed switch is below the monitor. Cat6 Ethernet cables connect all computers securely inside the school.';
    }
    setStudentText(template);
  };

  const handleSubmit = () => {
    if (!analysis.isReady && analysis.sentenceCount < 3) {
      sound.playError();
      return;
    }
    sound.playFanfare();
    onCompleteFinalText(studentText, analysis.score);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB]/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-retro-dots">
      <div className="w-full max-w-2xl bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[5px_5px_0_0_#2B2D42] rounded-3xl p-5 sm:p-7 text-[#2B2D42] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2B2D42]/20 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF3B0] border border-[#2B2D42] flex items-center justify-center text-[#2B2D42] shadow-[1.5px_1.5px_0_0_#2B2D42]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-[#2B2D42]">
                  Level 6: Produksi Teks Deskriptif Mandiri
                </h3>
                <span className="font-pixel text-[9px] bg-[#FFD166] text-[#2B2D42] px-2 py-0.5 rounded border border-[#2B2D42] font-bold">
                  FINAL EXPO
                </span>
              </div>
              <p className="text-[11px] text-[#6C757D] font-medium">
                Jurusan: {deptInfo.name} ({deptInfo.shortName})
              </p>
            </div>
          </div>
        </div>

        {/* Task Briefing */}
        <div className="bg-[#FFF3B0]/60 p-3 rounded-2xl border-1.5 border-[#2B2D42] mb-3 text-xs">
          <p className="text-[#4A4E69] leading-relaxed font-medium">
            Tulis teks deskriptif utuh (4–5 kalimat) mengenai <strong>{deptInfo.projectTitle}</strong> atau <strong>{deptInfo.labName}</strong>.
            Terapkan struktur:
            <strong> Identification (kalimat pembuka mengenalkan subjek)</strong> + <strong> Description (bagian, kata sifat, has/have, is/are, preposisi tempat)</strong>.
          </p>
        </div>

        {/* Writing Area */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#2B2D42] font-bold">Tulis Teks Deskriptif Bahasa Inggris:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWordBank(!showWordBank)}
                className="text-[#1A73E8] hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{showWordBank ? 'Tutup Kosakata' : 'Buka Bank Kosakata'}</span>
              </button>
              <button
                type="button"
                onClick={handleUseSample}
                className="text-[#E07A5F] hover:underline font-bold text-[11px]"
              >
                Draf Awal
              </button>
            </div>
          </div>

          <textarea
            value={studentText}
            onChange={(e) => setStudentText(e.target.value)}
            rows={4}
            placeholder={`e.g. The ${deptInfo.projectTitle} is an innovative project developed by ${deptInfo.shortName} students. It has... It is located...`}
            className="w-full bg-[#FFFDF9] border-2 border-[#2B2D42] rounded-2xl p-3 text-xs sm:text-sm text-[#2B2D42] font-medium placeholder-[#6C757D] focus:outline-none focus:bg-[#FFF3B0]/20 shadow-[2px_2px_0_0_#2B2D42] resize-none leading-relaxed"
          />

          {/* Optional Word Bank Drawer */}
          {showWordBank && (
            <div className="p-3 bg-[#FEF9E7] rounded-xl border border-[#2B2D42] text-[11px] space-y-1.5">
              <span className="text-[#78350F] font-bold block">Saran Kosakata Kejuruan (Klik untuk menambah):</span>
              <div className="flex flex-wrap gap-1">
                {vocabBank.nouns.concat(vocabBank.adjectives).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleInsertWord(w)}
                    className="bg-[#FFFDF9] hover:bg-[#FFF3B0] text-[#2B2D42] px-2 py-0.5 rounded border border-[#2B2D42] font-semibold"
                  >
                    + {w}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real-time Rubric & Criteria Verification */}
        <div className="bg-[#EFF7F6] border-2 border-[#2B2D42] rounded-2xl p-3.5 mb-3 shadow-[2px_2px_0_0_#2B2D42]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-[#1B4332] uppercase tracking-wide">
              Evaluasi Rubrik Tata Bahasa Real-Time:
            </span>
            <span className="text-xs sm:text-sm font-black text-[#2B2D42] font-mono">
              Skor: {analysis.score} / 20 pts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {/* Sentence Count */}
            <div className="flex items-center gap-1.5">
              {analysis.sentenceCount >= 4 ? (
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#E07A5F] shrink-0" />
              )}
              <span className="text-[#2B2D42] font-medium">
                4-5 Kalimat ({analysis.sentenceCount}/4)
              </span>
            </div>

            {/* Identification sentence */}
            <div className="flex items-center gap-1.5">
              {analysis.hasIdentification ? (
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#6C757D] shrink-0" />
              )}
              <span className="text-[#2B2D42] font-medium">Identification</span>
            </div>

            {/* Technical Nouns */}
            <div className="flex items-center gap-1.5">
              {analysis.matchedNouns.length >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#6C757D] shrink-0" />
              )}
              <span className="text-[#2B2D42] font-medium">
                Kosakata ({analysis.matchedNouns.length})
              </span>
            </div>

            {/* Adjectives */}
            <div className="flex items-center gap-1.5">
              {analysis.matchedAdjectives.length >= 1 ? (
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#6C757D] shrink-0" />
              )}
              <span className="text-[#2B2D42] font-medium">
                Kata Sifat ({analysis.matchedAdjectives.length})
              </span>
            </div>

            {/* Linking Verbs / Possession */}
            <div className="flex items-center gap-1.5">
              {analysis.hasLinkingOrPossession ? (
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#6C757D] shrink-0" />
              )}
              <span className="text-[#2B2D42] font-medium">Simple Present (is/has)</span>
            </div>

            {/* Preposition of Place */}
            <div className="flex items-center gap-1.5">
              {analysis.hasPreposition ? (
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#6C757D] shrink-0" />
              )}
              <span className="text-[#2B2D42] font-medium">Preposisi Tempat</span>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={studentText.trim().length < 20}
            className={`py-2.5 px-5 rounded-2xl font-black text-xs sm:text-sm postmodern-btn shadow-md flex items-center gap-2 ${
              studentText.trim().length >= 20
                ? 'bg-[#FFD166] hover:bg-[#FFC024] text-[#2B2D42]'
                : 'bg-[#F0ECE1] text-[#6C757D] cursor-not-allowed border-[#2B2D42]/40'
            }`}
          >
            <span>Selesaikan Level 6 & Buka Refleksi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

