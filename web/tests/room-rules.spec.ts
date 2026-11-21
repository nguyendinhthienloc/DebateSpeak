import { expect, test } from '@playwright/test';
import { countdownLeft, formatClock, phaseAt, secondsLeft, serverOffsetMs, timedPhases } from '../src/rooms/clock';
import type { RoomSnapshot } from '../src/rooms/contracts';
import { initialSpotlight, nextSpotlight } from '../src/rooms/spotlight';
import { snapshot } from './helpers/rooms';

const live = (overrides: Record<string, unknown>) => snapshot({ status: 'LIVE', ...overrides }) as unknown as RoomSnapshot;

test('the clock counts down from the shared start time', () => {
  const room = live({ started_at: '2026-11-19T10:00:03.000Z', duration_seconds: 600 });
  expect(secondsLeft(room, Date.parse('2026-11-19T10:02:21.000Z'))).toBe(462);
  expect(formatClock(462)).toBe('07:42');
  expect(secondsLeft(room, Date.parse('2026-11-19T10:30:00.000Z'))).toBe(0);
  expect(countdownLeft(room, Date.parse('2026-11-19T10:00:01.000Z'))).toBe(2);
});

test('the server offset corrects a client clock that runs ahead', () => {
  const room = live({ server_now: '2026-11-19T10:00:00.000Z' });
  expect(serverOffsetMs(room, Date.parse('2026-11-19T10:00:05.000Z'))).toBe(-5000);
  expect(countdownLeft(live({ started_at: '2026-11-19T10:00:03.000Z' }), Date.parse('2026-11-19T10:00:09.000Z'))).toBe(0);
});

test('timed turns follow the spec and last 390 seconds', () => {
  expect(timedPhases.reduce((sum, phase) => sum + phase.seconds, 0)).toBe(390);
  expect(phaseAt(0)).toMatchObject({ phase: { label: 'Opening', side: 'FOR' }, turnLeft: 60 });
  expect(phaseAt(61)).toMatchObject({ phase: { label: 'Opening', side: 'AGAINST' }, turnLeft: 59 });
  expect(phaseAt(210)).toMatchObject({ phase: { label: 'Cross-talk', side: null } });
  expect(phaseAt(390)).toBeUndefined();
});

test('a speaker holds the spotlight for at least 1.2 seconds', () => {
  const a = nextSpotlight(initialSpotlight, { type: 'speakers', ids: ['linh'] }, 1000);
  expect(nextSpotlight(a, { type: 'speakers', ids: ['sam'] }, 1500).ids).toEqual(['linh']);
  expect(nextSpotlight(a, { type: 'speakers', ids: ['sam'] }, 2200).ids).toEqual(['sam']);
});

test('two speakers share the spotlight and silence keeps the last speaker', () => {
  const a = nextSpotlight(initialSpotlight, { type: 'speakers', ids: ['linh'] }, 1000);
  expect(nextSpotlight(a, { type: 'speakers', ids: ['linh', 'sam'] }, 2300).mode).toBe('both');
  expect(nextSpotlight(a, { type: 'speakers', ids: [] }, 2300)).toMatchObject({ mode: 'quiet', ids: ['linh'] });
});

test('after a quiet spell the next speaker shows at once', () => {
  const a = nextSpotlight(initialSpotlight, { type: 'speakers', ids: ['linh'] }, 1000);
  const quiet = nextSpotlight(a, { type: 'speakers', ids: [] }, 2300);
  expect(nextSpotlight(quiet, { type: 'speakers', ids: ['sam'] }, 2400)).toMatchObject({ mode: 'speaking', ids: ['sam'] });
  expect(nextSpotlight(initialSpotlight, { type: 'speakers', ids: [] }, 500)).toBe(initialSpotlight);
});

test('a typed turn holds for 6 seconds unless another typed turn arrives', () => {
  const typed = nextSpotlight(initialSpotlight, { type: 'typed', id: 'sam', text: 'Cars pollute.' }, 1000);
  expect(nextSpotlight(typed, { type: 'speakers', ids: ['linh'] }, 5000).mode).toBe('typed');
  expect(nextSpotlight(typed, { type: 'speakers', ids: ['linh'] }, 7100).mode).toBe('speaking');
  expect(nextSpotlight(typed, { type: 'typed', id: 'linh', text: 'No.' }, 2000)).toMatchObject({ ids: ['linh'], text: 'No.' });
});
