// Web Audio API Synthesis Engine (No external mp3 dependencies)
class AudioService {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;
  private lofiInterval: number | null = null;
  private lofiGain: GainNode | null = null;
  public isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft Kalimba / Meditation Bell chime for timer completion
  public playChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (major chord)

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.9);
      });
    } catch {
      // Audio context might be blocked until user interacts
    }
  }

  // Soft bubble pop sound for fidget clicks and small wins
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // ignore
    }
  }

  // Realistic animal vocalizations synthesized in real-time
  public playPetVoice(type: string = 'cat') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (type === 'cat') {
        // Sweet kitten mew: 680Hz -> 510Hz with soft vibrato
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(490, now + 0.32);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'dog') {
        // Friendly playful puppy yip: 380Hz -> 540Hz -> 300Hz
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.linearRampToValueAtTime(560, now + 0.07);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.22);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'gecko') {
        // Cute gecko click-chirp: dual rapid high-frequency blips
        [0, 0.09].forEach((offset) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, now + offset);
          osc.frequency.exponentialRampToValueAtTime(1900, now + offset + 0.04);

          gain.gain.setValueAtTime(0.14, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.07);
        });
      } else if (type === 'rabbit') {
        // Soft nose snuffle & squeak
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(840, now);
        osc.frequency.linearRampToValueAtTime(980, now + 0.08);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'squirrel') {
        // Quick playful acorn chatter
        [0, 0.06, 0.12].forEach((offset, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1100 + idx * 200, now + offset);
          gain.gain.setValueAtTime(0.12, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.045);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.05);
        });
      } else {
        // Turtle cute peaceful water drop bubble chime
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      }
    } catch {
      // ignore
    }
  }

  // Deep soothing cat purr rumble simulation
  public playPurr() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Low frequency carrier with tremolo modulation
      const carrier = this.ctx.createOscillator();
      const tremolo = this.ctx.createOscillator();
      const tremoloGain = this.ctx.createGain();
      const mainGain = this.ctx.createGain();

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(32, now); // 32 Hz deep rumble

      tremolo.type = 'sine';
      tremolo.frequency.setValueAtTime(24, now); // Purr flutter rate
      tremoloGain.gain.setValueAtTime(0.5, now);

      tremolo.connect(tremoloGain.gain);

      mainGain.gain.setValueAtTime(0.001, now);
      mainGain.gain.linearRampToValueAtTime(0.22, now + 0.3);
      mainGain.gain.linearRampToValueAtTime(0.18, now + 0.9);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      carrier.connect(mainGain);
      mainGain.connect(this.ctx.destination);

      carrier.start(now);
      tremolo.start(now);
      carrier.stop(now + 1.45);
      tremolo.stop(now + 1.45);
    } catch {
      // ignore
    }
  }

  // Realistic crunchy munching sound for feeding treats
  public playMunch() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [0, 0.16, 0.32].forEach((offset) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320 + Math.random() * 80, now + offset);
        osc.frequency.exponentialRampToValueAtTime(140, now + offset + 0.08);

        gain.gain.setValueAtTime(0.18, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } catch {
      // ignore
    }
  }


  // Gentle Pink/Brown Noise filtered for gentle rainfall outside study room
  public startRain(volume: number = 0.25) {
    if (this.rainNode) {
      if (this.rainGain) this.rainGain.gain.setValueAtTime(volume, this.ctx?.currentTime || 0);
      return;
    }
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise algorithm
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Lowpass filter to simulate rain through window
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(volume, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      noise.start();
      this.rainNode = noise;
    } catch {
      // ignore
    }
  }

  public stopRain() {
    if (this.rainNode) {
      try {
        (this.rainNode as AudioBufferSourceNode).stop();
        this.rainNode.disconnect();
      } catch {
        // ignore
      }
      this.rainNode = null;
    }
  }

  // Soft Ambient Lo-fi chords
  public startLofi(volume: number = 0.15) {
    if (this.lofiInterval) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.lofiGain = this.ctx.createGain();
      this.lofiGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.lofiGain.connect(this.ctx.destination);

      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];

      let chordIndex = 0;
      const playChord = () => {
        if (!this.ctx || !this.lofiGain || this.isMuted) return;
        const currentChord = chords[chordIndex % chords.length];
        const now = this.ctx.currentTime;

        currentChord.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const noteGain = this.ctx!.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.linearRampToValueAtTime(0.08, now + 1.2);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

          osc.connect(noteGain);
          noteGain.connect(this.lofiGain!);

          osc.start(now);
          osc.stop(now + 4);
        });

        chordIndex++;
      };

      playChord();
      this.lofiInterval = window.setInterval(playChord, 4000);
    } catch {
      // ignore
    }
  }

  public stopLofi() {
    if (this.lofiInterval) {
      clearInterval(this.lofiInterval);
      this.lofiInterval = null;
    }
  }

  public stopAll() {
    this.stopRain();
    this.stopLofi();
  }
}

export const audioService = new AudioService();
