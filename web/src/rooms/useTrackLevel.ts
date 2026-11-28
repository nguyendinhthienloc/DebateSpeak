import { useEffect, useState } from 'react';
import { speechThreshold } from './useMicCheck';

/** How long one loud moment keeps "heard" true. */
const holdMs = 1500;

/**
 * The live level of a track that is already open. It never asks for a microphone and never stops the track:
 * it only listens through its own AudioContext, which it closes when the track changes or on unmount.
 */
export function useTrackLevel(track?: MediaStreamTrack) {
  const [level, setLevel] = useState(0);
  const [heard, setHeard] = useState(false);

  useEffect(() => {
    setLevel(0);
    setHeard(false);
    if (!track) return;
    const context = new AudioContext();
    void context.resume();
    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    const source = context.createMediaStreamSource(new MediaStream([track]));
    source.connect(analyser);
    const samples = new Float32Array(analyser.fftSize);
    let loudAt = -Infinity;
    let frame = 0;
    const tick = (now: number) => {
      analyser.getFloatTimeDomainData(samples);
      const value = Math.min(1, Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length));
      if (value > speechThreshold) loudAt = now;
      setLevel(value);
      setHeard(now - loudAt < holdMs);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      source.disconnect();
      void context.close();
    };
  }, [track]);

  return { level, heard };
}
