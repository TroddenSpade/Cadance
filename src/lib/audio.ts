import { midiToFrequency, type RhythmItem } from './music';

export type Timbre = 'piano' | 'guitar';

const LOOKAHEAD = 0.03;

class SynthEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private wet: GainNode | null = null;
  private dry: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private active = new Set<AudioScheduledSourceNode>();
  private guitarBuffers = new Map<number, AudioBuffer>();
  private timbre: Timbre = 'piano';
  private volume = 0.85;
  private muted = false;

  setTimbre(timbre: Timbre) {
    this.timbre = timbre;
  }

  /** Create or resume the audio context from a user gesture. */
  unlock() {
    this.ensure();
  }

  get currentTime(): number {
    return this.ensure().currentTime;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) this.stopAll();
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02);
    }
  }

  private ensure(): AudioContext {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    }
    const Ctor: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = this.volume;

    const dry = ctx.createGain();
    dry.gain.value = 0.92;
    const wet = ctx.createGain();
    wet.gain.value = 0.18;

    const reverb = ctx.createConvolver();
    reverb.buffer = this.makeImpulse(ctx, 1.8, 2.6);

    dry.connect(master);
    wet.connect(reverb);
    reverb.connect(master);
    master.connect(ctx.destination);

    this.master = master;
    this.dry = dry;
    this.wet = wet;
    this.reverb = reverb;
    return ctx;
  }

  private makeImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const impulse = ctx.createBuffer(2, length, rate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }

  private output(): { ctx: AudioContext } {
    return { ctx: this.ensure() };
  }

  private connectVoice(gain: GainNode) {
    const ctx = this.ctx!;
    const pan = ctx.createStereoPanner();
    gain.connect(pan);
    pan.connect(this.dry!);
    pan.connect(this.wet!);
  }

  stopAll() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.active.forEach((source) => {
      try {
        source.stop(now + 0.02);
      } catch {
        /* already stopped */
      }
    });
    this.active.clear();
  }

  private track(source: AudioScheduledSourceNode) {
    this.active.add(source);
    source.addEventListener('ended', () => this.active.delete(source));
  }

  playNote(midi: number, when = 0, duration = 1.4, velocity = 0.8) {
    if (this.muted) return;
    if (this.timbre === 'guitar') this.playGuitar(midi, when, velocity);
    else this.playPiano(midi, when, duration, velocity);
  }

  /** Play an exact frequency, used for tuner reference tones at any A4. */
  playTone(frequency: number, duration = 1.8, velocity = 0.55) {
    if (this.muted) return;
    this.stopAll();
    const { ctx } = this.output();
    const t = ctx.currentTime + LOOKAHEAD;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.24 * velocity, t + 0.03);
    gain.gain.setValueAtTime(0.24 * velocity, t + duration - 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    this.connectVoice(gain);
    osc.start(t);
    osc.stop(t + duration + 0.02);
    this.track(osc);
  }

  private playPiano(midi: number, when: number, duration: number, velocity: number) {
    const { ctx } = this.output();
    const t = ctx.currentTime + when + LOOKAHEAD;
    const freq = midiToFrequency(midi);
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(7000, 1800 + freq * 4), t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(500, freq * 1.4), t + duration * 0.8);
    filter.Q.value = 0.4;

    const peak = 0.16 * velocity;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(peak * 0.55, t + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    const partials: Array<[OscillatorType, number, number]> = [
      ['triangle', 1, 1],
      ['sine', 2, 0.32],
      ['sine', 3, 0.12],
      ['sine', 4.01, 0.055],
    ];
    partials.forEach(([type, ratio, level]) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq * ratio;
      osc.detune.value = ratio === 1 ? -2 : 2;
      const partialGain = ctx.createGain();
      partialGain.gain.value = level;
      osc.connect(partialGain);
      partialGain.connect(filter);
      osc.start(t);
      osc.stop(t + duration + 0.05);
      this.track(osc);
    });

    filter.connect(gain);
    this.connectVoice(gain);
  }

  private getGuitarBuffer(ctx: AudioContext, midi: number): AudioBuffer {
    const cached = this.guitarBuffers.get(midi);
    if (cached) return cached;
    const freq = midiToFrequency(midi);
    const rate = ctx.sampleRate;
    const seconds = 2.8;
    const length = Math.floor(rate * seconds);
    const buffer = ctx.createBuffer(1, length, rate);
    const data = buffer.getChannelData(0);
    const period = Math.max(2, Math.round(rate / freq));
    const burst = Math.min(length, period * 3);
    for (let i = 0; i < burst; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }
    const damping = 0.9955;
    for (let i = burst; i < length; i++) {
      const a = data[i - period] ?? 0;
      const b = data[i - period - 1] ?? a;
      data[i] = (a + b) * 0.5 * damping;
    }
    this.guitarBuffers.set(midi, buffer);
    return buffer;
  }

  private playGuitar(midi: number, when: number, velocity: number) {
    const { ctx } = this.output();
    const t = ctx.currentTime + when + LOOKAHEAD;
    const buffer = this.getGuitarBuffer(ctx, midi);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = 1;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = Math.min(5200, 1200 + midiToFrequency(midi) * 5);
    filter.Q.value = 0.6;

    const gain = ctx.createGain();
    const peak = 0.42 * velocity;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.7);

    source.connect(filter);
    filter.connect(gain);
    this.connectVoice(gain);
    source.start(t);
    source.stop(t + 2.8);
    this.track(source);
  }

  playSequence(midis: number[], mode: 'sequence' | 'chord' = 'sequence', tempo = 0.62) {
    this.stopAll();
    if (mode === 'chord') {
      midis.forEach((midi, i) => this.playNote(midi, i * 0.045, 2.2, 0.7));
    } else {
      midis.forEach((midi, i) => this.playNote(midi, i * tempo, 1.6, 0.8));
    }
    return mode === 'sequence' ? midis.length * tempo : 2.2;
  }

  playChords(chords: number[][], tempo = 0.8) {
    this.stopAll();
    chords.forEach((chord, i) => {
      chord.forEach((midi, j) => this.playNote(midi, i * tempo + j * 0.035, 1.7, 0.68));
    });
  }

  /**
   * Schedule a click at an absolute AudioContext time. The metronome uses this
   * with a lookahead scheduler so tempo stays steady even when the main thread
   * is busy.
   */
  scheduleMetronomeClick(time: number, accent = false, volume = 1, subdivision = false) {
    if (this.muted) return;
    const ctx = this.ensure();
    const t = Math.max(ctx.currentTime, time);
    const level = Math.max(0, Math.min(1, volume));
    if (level === 0) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = subdivision ? 1760 : accent ? 1568 : 1046;
    gain.gain.setValueAtTime((subdivision ? 0.045 : accent ? 0.14 : 0.1) * level, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.06);
    this.track(osc);
  }

  private click(when: number, accent = false) {
    this.scheduleMetronomeClick(this.ensure().currentTime + when + LOOKAHEAD, accent);
  }

  playMetronomeClick(accent = false) {
    this.click(0, accent);
  }

  /** Play a rhythm as a pitched pulse. `tempo` is seconds per beat. */
  playRhythm(items: RhythmItem[], tempo = 0.46, midi = 84) {
    this.stopAll();
    let cursor = 0;
    items.forEach((item) => {
      if (!item.rest) {
        const onBar = Math.abs(cursor % 4) < 1e-6;
        const beats = Math.abs(item.beats);
        this.playNote(midi, cursor * tempo, Math.max(0.2, beats * tempo * 0.95), onBar ? 0.75 : 0.55);
      }
      cursor += Math.abs(item.beats);
    });
    return cursor * tempo;
  }
}

export const synth = new SynthEngine();
