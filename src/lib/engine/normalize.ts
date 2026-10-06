const ENG_CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bi'm\b/g, "i am"],
  [/\byou're\b/g, "you are"],
  [/\bhe's\b/g, "he is"],
  [/\bshe's\b/g, "she is"],
  [/\bit's\b/g, "it is"],
  [/\bwe're\b/g, "we are"],
  [/\bthey're\b/g, "they are"],
  [/\bwhat's\b/g, "what is"],
  [/\bwhere's\b/g, "where is"],
  [/\bwho's\b/g, "who is"],
  [/\bhow's\b/g, "how is"],
  [/\bthat's\b/g, "that is"],
  [/\bthere's\b/g, "there is"],
  [/\blet's\b/g, "let us"],
  [/\bdon't\b/g, "do not"],
  [/\bdoesn't\b/g, "does not"],
  [/\bcan't\b/g, "cannot"],
  [/\bi've\b/g, "i have"],
  [/\bi'd\b/g, "i would"],
  [/\bi'll\b/g, "i will"],
];

/** Remove diacritics but keep ñ — "año" and "ano" are different words. */
export function stripAccents(input: string): string {
  return input
    .replace(/ñ/g, "\u0001")
    .replace(/Ñ/g, "\u0002")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\u0001/g, "ñ")
    .replace(/\u0002/g, "Ñ")
    .normalize("NFC");
}

/** Case-, punctuation- and whitespace-insensitive form used for comparisons. */
export function normalizeText(input: string, lang: "es" | "en"): string {
  let s = input
    .normalize("NFC")
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[¿?¡!.,;:"“”()…—–-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (lang === "en") {
    for (const [pattern, replacement] of ENG_CONTRACTIONS) s = s.replace(pattern, replacement);
    s = s.replace(/'/g, "");
  }
  return s;
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[b.length];
}

export type TextMatch =
  | { result: "exact"; matched: string }
  | { result: "accent"; matched: string }
  | { result: "typo"; matched: string }
  | { result: "wrong" };

/** Minimum length before a one-letter slip is forgiven as a typo. */
const TYPO_MIN_LENGTH = 6;

export function matchText(input: string, accepted: string[], lang: "es" | "en"): TextMatch {
  const given = normalizeText(input, lang);
  if (!given) return { result: "wrong" };

  let accentHit: string | null = null;
  let typoHit: string | null = null;

  for (const candidate of accepted) {
    const target = normalizeText(candidate, lang);
    if (given === target) return { result: "exact", matched: candidate };
    const g = stripAccents(given);
    const t = stripAccents(target);
    if (g === t) accentHit ??= candidate;
    else if (t.length >= TYPO_MIN_LENGTH && levenshtein(g, t) <= 1) typoHit ??= candidate;
  }

  if (accentHit) return lang === "es" ? { result: "accent", matched: accentHit } : { result: "exact", matched: accentHit };
  if (typoHit) return { result: "typo", matched: typoHit };
  return { result: "wrong" };
}

/** Split an answer into word tiles (punctuation removed, case kept). */
export function tokenize(sentence: string): string[] {
  return sentence
    .replace(/[¿?¡!.,;:]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
