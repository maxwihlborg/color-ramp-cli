export function clamp(n: number, a: number, b: number): number {
  return Math.min(Math.max(n, a), b);
}

/**
 * @category math
 */
export function clamp1(n: number): number {
  return clamp(n, 0, 1);
}

/**
 * @category math
 */
export function lerp(t: number, a: number, b: number): number {
  const x = clamp1(t);
  return a + x * (b - a);
}

/**
 * @category math
 */
export function step(t: number, a: number, b: number): number {
  return clamp1((t - a) / (b - a));
}
