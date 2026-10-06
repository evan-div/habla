"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { AudioRef, AudioSpeed } from "@/content/types";
import { isSpeechSupported, playClip, stopAudio } from "@/lib/audio/speech";

const noopSubscribe = () => () => {};

/** Whether this browser can speak at all (false during SSR so markup matches). */
export function useSpeechSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, isSpeechSupported, () => false);
}

/** Play audio clips; tracks which one is playing and stops on unmount. */
export function useAudio() {
  const supported = useSpeechSupported();
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const token = useRef(0);

  useEffect(() => () => stopAudio(), []);

  const play = useCallback(async (clip: AudioRef, speed: AudioSpeed, key: string = clip.text) => {
    const mine = ++token.current;
    setPlayingKey(key);
    await playClip(clip, speed);
    if (token.current === mine) setPlayingKey(null);
  }, []);

  const stop = useCallback(() => {
    token.current++;
    stopAudio();
    setPlayingKey(null);
  }, []);

  return { supported, playingKey, play, stop };
}
