/** Total XP needed to *reach* a level: 40 · (n − 1) · n  →  L2 = 80, L5 = 800, L10 = 3,600. */
export const LEVEL_XP_BASE = 40;

/** Titles are friendly, not CEFR. Level 10 = "Conversational". */
export const LEVEL_TITLES: readonly string[] = [
  "Beginner", // 1
  "Newcomer", // 2
  "Greeter", // 3
  "Wanderer", // 4
  "Explorer", // 5
  "Chatterbox", // 6
  "Storyteller", // 7
  "Local", // 8
  "Confident", // 9
  "Conversational", // 10
  "Expressive", // 11
  "Fluent", // 12+
];
