/**
 * Web Audio API retro & vocal sound generator for Muhiba Mystery
 * Features procedural male bass voices, female melodic voices,
 * Web Speech API integration, and tactile feedback for mobile touch flick.
 */

export type SpeakerAvatar = 'mr_hendra' | 'naya' | 'raka' | 'dimas' | 'player';

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (!this.isMuted && this.bgmGain && this.isBgmPlaying) {
      this.bgmGain.gain.setValueAtTime(0.04, this.ctx?.currentTime || 0);
    }
    if (this.isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  public stopSpeech() {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  /**
   * Sound for sentuh jentik (flick gesture swipe) - soft airy glide swoosh
   */
  public playFlickSwoosh(intensity: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600 * intensity, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  public playStep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(65, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }

  public playInteract() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(920, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // ignore
    }
  }

  /**
   * Suara saat NPC diajak bicara:
   * - Suara LAKI-LAKI NGEBAS (Deep resonant bass tone ~90-115Hz with throat harmonics)
   * - Suara PEREMPUAN (Sweet, bright melodic harmonic vocalization ~380-520Hz)
   * Plus Web Speech API vocalization with pitch modulation!
   */
  public playSpeakerGreeting(
    avatar: SpeakerAvatar,
    gender: 'male' | 'female',
    spokenText?: string
  ) {
    if (this.isMuted) return;
    this.initCtx();

    // 1. Web Speech API synthesis - Read full English text completely without cutting off
    if ('speechSynthesis' in window && spokenText) {
      try {
        window.speechSynthesis.cancel();

        // Sanitize text for clean vocal reading (remove emojis and UI markup, keep complete English speech)
        const cleanText = spokenText
          .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
          .replace(/[“"]/g, '"')
          .replace(/\s+/g, ' ')
          .trim();

        if (cleanText.length > 0) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = 'en-US';

          if (gender === 'male') {
            // Suara Laki-Laki Bass (deep bass tone, authoritative and clear)
            utterance.pitch = avatar === 'mr_hendra' ? 0.65 : 0.72;
            utterance.rate = 0.93;
            utterance.volume = 1.0;
          } else {
            // Suara Perempuan (bright, clear, friendly female cadence)
            utterance.pitch = 1.28;
            utterance.rate = 0.98;
            utterance.volume = 1.0;
          }

          // Pick English voice
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            const englishVoices = voices.filter(
              (v) => v.lang.startsWith('en') || v.lang.includes('US') || v.lang.includes('GB')
            );
            const pool = englishVoices.length > 0 ? englishVoices : voices;

            let chosenVoice: SpeechSynthesisVoice | undefined;
            if (gender === 'male') {
              chosenVoice = pool.find((v) => {
                const name = v.name.toLowerCase();
                return (
                  name.includes('david') ||
                  name.includes('male') ||
                  name.includes('guy') ||
                  name.includes('daniel') ||
                  name.includes('george') ||
                  name.includes('alex') ||
                  name.includes('fred')
                );
              });
            } else {
              chosenVoice = pool.find((v) => {
                const name = v.name.toLowerCase();
                return (
                  name.includes('female') ||
                  name.includes('zira') ||
                  name.includes('samantha') ||
                  name.includes('victoria') ||
                  name.includes('karen') ||
                  name.includes('susan')
                );
              });
            }
            if (!chosenVoice && pool.length > 0) {
              chosenVoice = pool[0];
            }
            if (chosenVoice) {
              utterance.voice = chosenVoice;
            }
          }

          window.speechSynthesis.speak(utterance);
        }
      } catch {
        // Fallback gracefully to Web Audio procedural synthesis
      }
    }

    // 2. Guaranteed Procedural Web Audio Vocalization
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      if (gender === 'male') {
        // === SUARA LAKI-LAKI NGEBAS ===
        // Deep fundamental frequency: Mr. Hendra ~88Hz, Raka ~108Hz, Dimas ~118Hz
        const baseFreq = avatar === 'mr_hendra' ? 88 : avatar === 'raka' ? 108 : 118;

        // Multi-oscillator formant synthesis for rich male vocal tract resonance
        const oscBass = this.ctx.createOscillator();
        const oscThroat = this.ctx.createOscillator();
        const oscSub = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const subFilter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        // Resonant lowpass for chest/throat formant
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
        filter.Q.setValueAtTime(3.5, now); // Warm vocal resonance peak

        subFilter.type = 'bandpass';
        subFilter.frequency.setValueAtTime(160, now);
        subFilter.Q.setValueAtTime(2.0, now);

        // Deep Sawtooth for rich male vocal harmonics
        oscBass.type = 'sawtooth';
        oscBass.frequency.setValueAtTime(baseFreq, now);
        oscBass.frequency.linearRampToValueAtTime(baseFreq * 1.08, now + 0.08);
        oscBass.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, now + 0.26);

        // Triangle throat overtone
        oscThroat.type = 'triangle';
        oscThroat.frequency.setValueAtTime(baseFreq * 1.5, now);
        oscThroat.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.26);

        // Sub bass sine wave for deep physical weight
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(baseFreq * 0.75, now);
        oscSub.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.26);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

        oscBass.connect(filter);
        oscThroat.connect(filter);
        oscSub.connect(subFilter);

        filter.connect(gain);
        subFilter.connect(gain);
        gain.connect(this.ctx.destination);

        oscBass.start(now);
        oscThroat.start(now);
        oscSub.start(now);

        oscBass.stop(now + 0.27);
        oscThroat.stop(now + 0.27);
        oscSub.stop(now + 0.27);
      } else {
        // === SUARA PEREMPUAN LEMBUT & CERAH ===
        // Gentle female chime greeting ~440Hz -> 587Hz (A4 -> D5 cheerful melodic interval)
        const notes = [440, 554.37, 659.25]; // A4, C#5, E5 major chord
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const vibrato = this.ctx!.createOscillator();
          const vibratoGain = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();
          const gain = this.ctx!.createGain();

          // Soft vocal vibrato
          vibrato.frequency.setValueAtTime(6.0, now);
          vibratoGain.gain.setValueAtTime(5.0, now);
          vibrato.connect(vibratoGain);
          vibratoGain.connect(osc.frequency);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + idx * 0.06 + 0.16);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(freq * 1.2, now + idx * 0.06);
          filter.Q.setValueAtTime(1.5, now);

          gain.gain.setValueAtTime(0.001, now + idx * 0.06);
          gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.06 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.16);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx!.destination);

          vibrato.start(now + idx * 0.06);
          osc.start(now + idx * 0.06);

          vibrato.stop(now + idx * 0.06 + 0.17);
          osc.stop(now + idx * 0.06 + 0.17);
        });
      }
    } catch {
      // ignore
    }
  }

  /**
   * Suara ketikan per huruf menyesuaikan gender pembicara
   */
  public playTypingVoice(gender: 'male' | 'female', avatar?: SpeakerAvatar) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (gender === 'male') {
        // Suara ketukan laki-laki ngebas (deep low tap)
        const isHendra = avatar === 'mr_hendra';
        const baseFreq = isHendra ? 85 + Math.random() * 20 : 105 + Math.random() * 25;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.038);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);
      } else {
        // Suara ketukan perempuan cerah (soft melodious click)
        const baseFreq = 440 + Math.random() * 50;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.04, now + 0.032);

        gain.gain.setValueAtTime(0.055, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  public playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + index * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + index * 0.08);
        osc.stop(this.ctx!.currentTime + index * 0.08 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  public playError() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {
      // ignore
    }
  }

  public playDiscovery() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const chords = [440, 554.37, 659.25, 830.61]; // A major 7 arpeggio
      chords.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.14, this.ctx!.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.1);
        osc.stop(this.ctx!.currentTime + idx * 0.1 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const sequence = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 523.25, t: 0.14, d: 0.12 },
        { f: 523.25, t: 0.28, d: 0.12 },
        { f: 659.25, t: 0.42, d: 0.25 },
        { f: 783.99, t: 0.7, d: 0.25 },
        { f: 1046.5, t: 0.98, d: 0.6 },
      ];
      sequence.forEach(({ f, t, d }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + t);

        gain.gain.setValueAtTime(0.18, this.ctx!.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + t + d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + t);
        osc.stop(this.ctx!.currentTime + t + d);
      });
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
