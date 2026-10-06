import type { AudioRef, AudioSpeed } from "@/content/types";

/** Speech rates for synthesized audio. Real recordings ignore these. */
export const SPEECH_RATE: Record<AudioSpeed, number> = { slow: 0.6, normal: 0.92 };

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

let cachedVoice: SpeechSynthesisVoice | null | undefined;
let currentAudio: HTMLAudioElement | null = null;
let voicesListenerAttached = false;

/** macOS ships character voices (Grandma, Bubbles…) that are fun but poor for learning. */
const NOVELTY_VOICE = /grandma|grandpa|bad news|good news|bahh|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|fred|junior|kathy|ralph/i;
/** Voices known to sound natural, or tagged as higher quality by the platform. */
const NATURAL_VOICE = /paulina|angélica|angelica|siri|premium|enhanced|natural|neural|google|jorge|juan|diego|marisol|dalia/i;

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase().replace("_", "-");
  let score = 0;
  if (lang === "es-mx") score += 100;
  else if (lang === "es-us" || lang === "es-419") score += 60;
  else if (lang === "es-es") score += 10;
  else score += 30;
  if (NATURAL_VOICE.test(voice.name)) score += 30;
  if (NOVELTY_VOICE.test(voice.name)) score -= 60;
  return score;
}

/** Best available Spanish voice, preferring Mexican Spanish. */
export function getSpanishVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  if (!voicesListenerAttached) {
    voicesListenerAttached = true;
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      cachedVoice = undefined;
    });
  }
  if (cachedVoice !== undefined) return cachedVoice;
  const spanish = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("es"));
  if (spanish.length === 0) return null; // voices may not have loaded yet — don't cache
  cachedVoice = spanish.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
  return cachedVoice;
}

export function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

/**
 * Play a clip. Recorded audio (`clip.sources[speed]`) wins when present; otherwise the
 * text is synthesized. Resolves when playback ends (or fails — audio is never blocking).
 */
export function playClip(clip: AudioRef, speed: AudioSpeed): Promise<void> {
  stopAudio();
  const src = clip.sources?.[speed] ?? clip.sources?.normal;
  if (src) {
    return new Promise((resolve) => {
      const audio = new Audio(src);
      currentAudio = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }
  if (!isSpeechSupported()) return Promise.resolve();
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(clip.text);
    const voice = getSpanishVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? clip.lang ?? "es-MX";
    utterance.rate = SPEECH_RATE[speed];
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}
