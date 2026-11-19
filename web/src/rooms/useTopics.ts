import { useCallback, useEffect, useState } from 'react';
import { listTopics } from './api';
import type { Topic } from './contracts';

/** Loads the seeded motions once. `retry` asks again after a failure. */
export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setFailed(false);
    listTopics(controller.signal).then(setTopics, () => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [attempt]);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  return { topics, failed, retry };
}
