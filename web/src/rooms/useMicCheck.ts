import { useCallback, useEffect, useRef, useState } from 'react';

export type MicStatus = 'idle' | 'requesting' | 'listening' | 'passed' | 'blocked' | 'silent';

const threshold = 0.05;
const needed = 1000;
const giveUpAfter = 6000;

interface Check { stream: MediaStream; context: AudioContext; frame: number; timer: number }

/**
 * A microphone test that stays in the browser. Nothing is requested until `start()`.
 * Every track is stopped and the audio context closed when the check passes or gives up, on `stop()`, and on unmount.
 */
export function useMicCheck() {
  const [status, setStatus] = useState<MicStatus>('idle');
  const [level, setLevel] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>();
  const live = useRef<Check>();
  const attempt = useRef(0);

  const release = useCallback(() => {
    const check = live.current;
    live.current = undefined;
    if (!check) return;
    cancelAnimationFrame(check.frame);
    window.clearTimeout(check.timer);
    check.stream.getTracks().forEach(track => track.stop());
    void check.context.close();
  }, []);

  useEffect(() => () => { attempt.current += 1; release(); }, [release]);

  const start = useCallback(async () => {
    release();
    const mine = ++attempt.current;
    setStatus('requesting');
    setLevel(0);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: deviceId ? { deviceId: { exact: deviceId } } : true });
    } catch {
      if (attempt.current === mine) setStatus('blocked');
      return;
    }
    if (attempt.current !== mine) { stream.getTracks().forEach(track => track.stop()); return; }

    const context = new AudioContext();
    void context.resume();
    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    context.createMediaStreamSource(stream).connect(analyser);
    const samples = new Float32Array(analyser.fftSize);
    const check: Check = { stream, context, frame: 0, timer: 0 };
    live.current = check;
    setStatus('listening');
    navigator.mediaDevices.enumerateDevices()
      .then(list => setDevices(list.filter(device => device.kind === 'audioinput')), () => {});

    let heard = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (live.current !== check) return;
      analyser.getFloatTimeDomainData(samples);
      const rms = Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length);
      const value = Math.min(1, rms);
      if (value > threshold) heard += now - last;
      last = now;
      setLevel(value);
      if (heard >= needed) { release(); setLevel(0); setStatus('passed'); return; }
      check.frame = requestAnimationFrame(tick);
    };
    check.frame = requestAnimationFrame(tick);
    check.timer = window.setTimeout(() => {
      if (live.current !== check) return;
      release();
      setLevel(0);
      setStatus('silent');
    }, giveUpAfter);
  }, [deviceId, release]);

  const stop = useCallback(() => {
    attempt.current += 1;
    release();
    setLevel(0);
    setStatus(current => (current === 'passed' ? current : 'idle'));
  }, [release]);

  const selectDevice = useCallback((id: string) => {
    stop();
    setDeviceId(id);
    setStatus('idle');
  }, [stop]);

  return { status, level, devices, deviceId, selectDevice, start, stop };
}
