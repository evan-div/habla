import { DEFAULT_DAILY_GOAL_XP } from "@/config/xp";
import type { LearnerState } from "./types";

export const STATE_VERSION = 1;
export const LOCAL_USER_ID = "local-learner";

export function createInitialState(userId: string = LOCAL_USER_ID): LearnerState {
  return {
    version: STATE_VERSION,
    userId,
    profile: {
      displayName: "",
      selfLevel: "new",
      reasons: [],
      dailyGoalXp: DEFAULT_DAILY_GOAL_XP,
      onboardedAt: null,
    },
    settings: {
      translationSupport: "full",
      autoPlayAudio: true,
      defaultAudioSpeed: "normal",
      theme: "system",
      openCourse: false,
    },
    totalXp: 0,
    words: {},
    grammar: {},
    lessons: {},
    activity: {},
    achievements: {},
    counters: {
      reviewCardsCompleted: 0,
      reviewCorrect: 0,
      reviewSessions: 0,
      perfectLessons: 0,
      realTalkLessons: 0,
      dailyGoalsHit: 0,
    },
    clockOffsetMs: 0,
  };
}
