export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean>
  | ClassValue[];

export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  const push = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === 'string' || typeof v === 'number') {
      out.push(String(v));
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(push);
      return;
    }
    for (const [k, ok] of Object.entries(v)) {
      if (ok) out.push(k);
    }
  };

  values.forEach(push);
  return out.join(' ');
}

