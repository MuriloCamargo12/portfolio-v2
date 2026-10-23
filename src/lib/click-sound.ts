let level = 0.6;
let context: AudioContext | null = null;
let lastPreview = 0;

export function setClickVolume(percent: number) {
  level = Math.min(1, Math.max(0, percent / 100));
}

function bubble(audio: AudioContext, when: number, peak: number) {
  const body = audio.createOscillator();
  const bodyGain = audio.createGain();
  body.type = "sine";
  body.frequency.setValueAtTime(240, when);
  body.frequency.exponentialRampToValueAtTime(680, when + 0.05);
  bodyGain.gain.setValueAtTime(0.0001, when);
  bodyGain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), when + 0.016);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.12);
  body.connect(bodyGain);
  bodyGain.connect(audio.destination);
  body.start(when);
  body.stop(when + 0.13);

  const skin = audio.createOscillator();
  const skinGain = audio.createGain();
  skin.type = "sine";
  skin.frequency.setValueAtTime(480, when);
  skin.frequency.exponentialRampToValueAtTime(1320, when + 0.028);
  skinGain.gain.setValueAtTime(0.0001, when);
  skinGain.gain.exponentialRampToValueAtTime(Math.max(peak * 0.22, 0.0002), when + 0.008);
  skinGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.045);
  skin.connect(skinGain);
  skinGain.connect(audio.destination);
  skin.start(when);
  skin.stop(when + 0.05);
}

function startTone(audio: AudioContext) {
  if (level <= 0) return;
  bubble(audio, audio.currentTime, 0.3 * level);
}

export function playWindowOpen() {
  if (level <= 0 || typeof window === "undefined") return;

  const audio = context ?? new AudioContext();
  context = audio;
  if (audio.state === "suspended") {
    void audio.resume().then(() => startTone(audio));
    return;
  }
  startTone(audio);
}

export function previewClick() {
  const stamp = performance.now();
  if (stamp - lastPreview < 140) return;
  lastPreview = stamp;
  playWindowOpen();
}
