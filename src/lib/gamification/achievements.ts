export interface AchievementStats {
  lessonsCompleted: number;
  perfectLessons: number;
  wordsLearned: number;
  wordsMastered: number;
  verbsLearned: number;
  grammarLearned: number;
  currentStreak: number;
  longestStreak: number;
  reviewCardsCompleted: number;
  unitsCompleted: string[];
  realTalkLessons: number;
  dailyGoalsHit: number;
  level: number;
  /** Conjugation Dojo belts; they're earned in order, so 7 means black belt. */
  beltsEarned: number;
}

export type AchievementTone = "teal" | "rosa" | "sol" | "leaf" | "violet";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  /** Lucide icon key resolved in the UI layer. */
  icon: string;
  tone: AchievementTone;
  target: number;
  progress: (s: AchievementStats) => number;
}

/** Add an entry here and it appears everywhere — unlock toasts, progress page, profile. */
export const ACHIEVEMENTS: readonly AchievementDef[] = [
  { id: "first-lesson", title: "First Lesson", description: "Finish your very first lesson.", icon: "sparkles", tone: "teal", target: 1, progress: (s) => s.lessonsCompleted },
  { id: "perfect-lesson", title: "Perfect Lesson", description: "Finish a lesson without a single miss.", icon: "target", tone: "sol", target: 1, progress: (s) => s.perfectLessons },
  { id: "words-25", title: "First 25 Words", description: "Meet 25 Spanish words.", icon: "book-open", tone: "teal", target: 25, progress: (s) => s.wordsLearned },
  { id: "words-100", title: "First 100 Words", description: "Learn 100 words and phrases.", icon: "library", tone: "rosa", target: 100, progress: (s) => s.wordsLearned },
  { id: "words-500", title: "500 Words", description: "Build a 500-word vocabulary.", icon: "gem", tone: "violet", target: 500, progress: (s) => s.wordsLearned },
  { id: "streak-3", title: "Warming Up", description: "Practice 3 days in a row.", icon: "flame", tone: "sol", target: 3, progress: (s) => s.longestStreak },
  { id: "streak-7", title: "7 Day Streak", description: "Practice 7 days in a row.", icon: "flame", tone: "rosa", target: 7, progress: (s) => s.longestStreak },
  { id: "streak-30", title: "30 Day Streak", description: "A whole month of daily Spanish.", icon: "flame", tone: "violet", target: 30, progress: (s) => s.longestStreak },
  { id: "first-unit", title: "Unit Complete", description: "Finish every lesson in a unit.", icon: "flag", tone: "leaf", target: 1, progress: (s) => s.unitsCompleted.length },
  { id: "verb-rookie", title: "Verb Rookie", description: "Learn 8 verbs — the engine of every sentence.", icon: "zap", tone: "teal", target: 8, progress: (s) => s.verbsLearned },
  { id: "grammar-nerd", title: "Grammar Nerd", description: "Learn 5 grammar concepts.", icon: "graduation-cap", tone: "violet", target: 5, progress: (s) => s.grammarLearned },
  { id: "restaurant-ready", title: "Restaurant Ready", description: "Finish Food & Drink and order like a local.", icon: "utensils", tone: "rosa", target: 1, progress: (s) => (s.unitsCompleted.includes("unit-05-food") ? 1 : 0) },
  { id: "street-smart", title: "Street Smart", description: "Finish a Real Talk lesson.", icon: "message-circle", tone: "sol", target: 1, progress: (s) => s.realTalkLessons },
  { id: "memory-keeper", title: "Memory Keeper", description: "Get 10 words to strong mastery.", icon: "brain", tone: "leaf", target: 10, progress: (s) => s.wordsMastered },
  { id: "review-100", title: "100 Review Cards", description: "Complete 100 review cards.", icon: "repeat", tone: "teal", target: 100, progress: (s) => s.reviewCardsCompleted },
  { id: "goal-getter", title: "Goal Getter", description: "Hit your daily XP goal.", icon: "trophy", tone: "sol", target: 1, progress: (s) => s.dailyGoalsHit },
  { id: "explorer", title: "Explorer", description: "Reach level 5.", icon: "compass", tone: "leaf", target: 5, progress: (s) => s.level },
  { id: "first-belt", title: "On the Mat", description: "Earn your first belt in the Conjugation Dojo.", icon: "medal", tone: "sol", target: 1, progress: (s) => s.beltsEarned },
  { id: "black-belt", title: "Cinta Negra", description: "Earn the black belt in the Conjugation Dojo.", icon: "swords", tone: "violet", target: 7, progress: (s) => s.beltsEarned },
];

export interface AchievementStatus {
  def: AchievementDef;
  progress: number;
  unlocked: boolean;
}

export function achievementStatuses(stats: AchievementStats): AchievementStatus[] {
  return ACHIEVEMENTS.map((def) => {
    const progress = Math.min(def.target, def.progress(stats));
    return { def, progress, unlocked: progress >= def.target };
  });
}

export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
