'use client';

// Short sound + vibration when something important happens.
// Browsers only allow audio after the user has tapped the page once,
// so the audio context is unlocked on the first tap.

let ctx: AudioContext | null = null;

if (typeof window !== 'undefined') {
  const unlock = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      ctx = ctx ?? new AudioCtx();
      ctx.resume();
    } catch {}
  };
  window.addEventListener('pointerdown', unlock, { once: true });
}

export function alertUser() {
  try {
    navigator.vibrate?.([150, 80, 150]);
  } catch {}
  if (!ctx) return;
  const now = ctx.currentTime;
  [660, 880].forEach((freq, i) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, now + i * 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.3);
    osc.connect(gain).connect(ctx!.destination);
    osc.start(now + i * 0.18);
    osc.stop(now + i * 0.18 + 0.3);
  });
}
