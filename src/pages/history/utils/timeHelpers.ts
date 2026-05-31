export function calculateDurationParts(startedAt: string, finishedAt?: string, durationSeconds?: number) {
  const start = new Date(startedAt);
  const end = new Date(finishedAt || startedAt);
  const dur = durationSeconds ?? Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
  const mm = String(Math.floor(dur / 60)).padStart(2, '0');
  const ss = String(dur % 60).padStart(2, '0');
  return { start, end, dur, mm, ss };
}
