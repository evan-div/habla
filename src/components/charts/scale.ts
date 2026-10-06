/** Round a maximum up to a clean axis top (10, 20, 50, 100, 200, 500…) with 2 intervals. */
export function niceMax(value: number): number {
  if (value <= 0) return 10;
  const steps = [10, 20, 40, 50, 100, 150, 200, 300, 400, 500, 1000];
  for (const s of steps) if (value <= s) return s;
  return Math.ceil(value / 500) * 500;
}

export function ticksFor(max: number): number[] {
  return [0, max / 2, max];
}
