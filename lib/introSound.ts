let sharedContext: AudioContext | null = null;
let introIsPlaying = false;

type WebkitAudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

function createContext(): AudioContext | null {
  const browserWindow = window as WebkitAudioWindow;
  const AudioContextConstructor = browserWindow.AudioContext ?? browserWindow.webkitAudioContext;

  if (!AudioContextConstructor) return null;
  if (!sharedContext || sharedContext.state === "closed") {
    sharedContext = new AudioContextConstructor();
  }

  return sharedContext;
}

/** Original synthesized approximation of a cinematic intro sting; not a copy of any trademarked audio. */
export async function playIntroSound(): Promise<void> {
  if (introIsPlaying || typeof window === "undefined") return;

  introIsPlaying = true;

  try {
    const context = createContext();
    if (!context) {
      introIsPlaying = false;
      return;
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    const now = context.currentTime;
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const nodes: AudioNode[] = [master, compressor];
    const sources: AudioScheduledSourceNode[] = [];

    master.gain.setValueAtTime(0.6, now);
    compressor.threshold.setValueAtTime(-18, now);
    compressor.knee.setValueAtTime(18, now);
    compressor.ratio.setValueAtTime(8, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.22, now);
    master.connect(compressor).connect(context.destination);

    const addTone = (
      type: OscillatorType,
      frequency: number,
      level: number,
      start: number,
      end: number,
    ) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(level, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, end);
      oscillator.connect(gain).connect(master);
      oscillator.start(start);
      oscillator.stop(end + 0.03);
      nodes.push(oscillator, gain);
      sources.push(oscillator);
      return oscillator;
    };

    addTone("sine", 55, 0.72, now, now + 0.45);
    addTone("triangle", 110, 0.2, now, now + 0.38);

    const clickNoise = context.createBufferSource();
    const clickFilter = context.createBiquadFilter();
    const clickGain = context.createGain();
    const clickLength = Math.ceil(context.sampleRate * 0.03);
    const clickBuffer = context.createBuffer(1, clickLength, context.sampleRate);
    const clickData = clickBuffer.getChannelData(0);
    for (let index = 0; index < clickData.length; index += 1) {
      clickData[index] = Math.random() * 2 - 1;
    }
    clickNoise.buffer = clickBuffer;
    clickFilter.type = "lowpass";
    clickFilter.frequency.setValueAtTime(800, now);
    clickGain.gain.setValueAtTime(0.2, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    clickNoise.connect(clickFilter).connect(clickGain).connect(master);
    clickNoise.start(now);
    clickNoise.stop(now + 0.04);
    nodes.push(clickNoise, clickFilter, clickGain);
    sources.push(clickNoise);

    const dumStart = now + 0.28;
    const dum = addTone("sine", 65, 0.92, dumStart, now + 1.3);
    dum.frequency.exponentialRampToValueAtTime(40, now + 1.28);
    const sub = addTone("sine", 32.5, 0.22, dumStart, now + 1.25);
    sub.frequency.exponentialRampToValueAtTime(20, now + 1.23);

    const shimmerStart = now + 0.2;
    const shimmerEnd = now + 1.4;
    const shimmerFilter = context.createBiquadFilter();
    const shimmerGain = context.createGain();
    shimmerFilter.type = "lowpass";
    shimmerFilter.frequency.setValueAtTime(200, shimmerStart);
    shimmerFilter.frequency.exponentialRampToValueAtTime(2500, now + 1.14);
    shimmerGain.gain.setValueAtTime(0.0001, shimmerStart);
    shimmerGain.gain.linearRampToValueAtTime(0.25, now + 0.85);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, shimmerEnd);
    shimmerFilter.connect(shimmerGain).connect(master);
    nodes.push(shimmerFilter, shimmerGain);

    [110, 110.7].forEach((frequency) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(frequency, shimmerStart);
      oscillator.connect(shimmerFilter);
      oscillator.start(shimmerStart);
      oscillator.stop(shimmerEnd + 0.03);
      nodes.push(oscillator);
      sources.push(oscillator);
    });

    window.setTimeout(() => {
      sources.forEach((source) => {
        source.onended = null;
        try {
          source.disconnect();
        } catch {
          // The source may have already been released by the browser.
        }
      });
      nodes.forEach((node) => {
        try {
          node.disconnect();
        } catch {
          // Disconnection is best-effort and must never affect navigation.
        }
      });
      introIsPlaying = false;
    }, 1650);
  } catch {
    introIsPlaying = false;
  }
}
