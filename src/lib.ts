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

export function invariant(condition: unknown): asserts condition {
  if (!condition) {
    throw new TypeError("invariant failed");
  }
}

export const chain =
  <A, B>(fn: (a: A) => B | null | undefined | false) =>
  (a: A | null | undefined | false): B | null => {
    if (a) {
      const b = fn(a);
      if (b) return b;
    }
    return null;
  };

export const pipe: {
  <A>(a: A): A;
  <A, B>(a: A, ab: (a: A) => B): B;
  <A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
  <A, B, C, D>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D;
  <A, B, C, D, E>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
  ): E;
  <A, B, C, D, E, F>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
  ): F;
  <A, B, C, D, E, F, G>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
  ): G;
} = (a: unknown, ...fns: Function[]) => fns.reduce((acc, fn) => fn(acc), a);

export function getErrorMessage(error: unknown) {
  return error != null && typeof error === "object" && "message" in error
    ? error.message
    : error;
}
