type SoundEffect = 'success' | 'error' | 'hint' | 'levelup' | 'achievement' | 'bossDefeat' | 'secretReveal' | 'xp';

class SoundManager {
  private ctx: AudioContext | null = null;
  private _muted = false;
  private _volume = 0.3;

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  get muted() { return this._muted; }
  set muted(v: boolean) { this._muted = v; }

  get volume() { return this._volume; }
  set volume(v: number) { this._volume = Math.max(0, Math.min(1, v)); }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', delay = 0) {
    if (this._muted) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = this._volume * 0.5;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  }

  play(effect: SoundEffect) {
    if (this._muted) return;
    try {
      switch (effect) {
        case 'success':
          // Quick ascending two-tone
          this.playTone(523, 0.1, 'sine', 0);     // C5
          this.playTone(659, 0.15, 'sine', 0.1);   // E5
          break;
        case 'error':
          // Low buzz
          this.playTone(200, 0.15, 'square', 0);
          this.playTone(150, 0.15, 'square', 0.1);
          break;
        case 'hint':
          // Soft single tone
          this.playTone(440, 0.2, 'sine', 0);      // A4
          break;
        case 'xp':
          // Quick bright blip
          this.playTone(880, 0.08, 'sine', 0);     // A5
          break;
        case 'levelup':
          // Ascending arpeggio C-E-G-C
          this.playTone(523, 0.12, 'sine', 0);     // C5
          this.playTone(659, 0.12, 'sine', 0.1);   // E5
          this.playTone(784, 0.12, 'sine', 0.2);   // G5
          this.playTone(1047, 0.25, 'sine', 0.3);  // C6
          break;
        case 'achievement':
          // Fanfare: two quick notes + held note
          this.playTone(587, 0.1, 'triangle', 0);    // D5
          this.playTone(784, 0.1, 'triangle', 0.1);  // G5
          this.playTone(988, 0.3, 'triangle', 0.2);  // B5
          break;
        case 'bossDefeat':
          // Epic ascending scale
          this.playTone(523, 0.1, 'sine', 0);     // C5
          this.playTone(587, 0.1, 'sine', 0.08);  // D5
          this.playTone(659, 0.1, 'sine', 0.16);  // E5
          this.playTone(784, 0.1, 'sine', 0.24);  // G5
          this.playTone(1047, 0.3, 'triangle', 0.32); // C6
          break;
        case 'secretReveal':
          // Mysterious descending + ascending
          this.playTone(659, 0.2, 'sine', 0);     // E5
          this.playTone(554, 0.2, 'sine', 0.2);   // C#5
          this.playTone(440, 0.2, 'sine', 0.4);   // A4
          this.playTone(554, 0.2, 'sine', 0.6);   // C#5
          this.playTone(659, 0.3, 'triangle', 0.8); // E5
          break;
      }
    } catch {
      // Audio not supported, ignore silently
    }
  }
}

export const soundManager = new SoundManager();
