// Simple local storage manager for user progress
interface UserProgress {
  completedLessons: string[];
  activityScores: {
    [key: string]: number;
  };
  badges: string[];
  totalScore: number;
}

const STORAGE_KEY = "ai_explorers_progress";

const defaultProgress: UserProgress = {
  completedLessons: [],
  activityScores: {},
  badges: [],
  totalScore: 0,
};

export const getProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProgress;
  } catch {
    return defaultProgress;
  }
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
};

export const markLessonComplete = (lessonId: string): void => {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    saveProgress(progress);
  }
};

export const updateActivityScore = (activityId: string, score: number): void => {
  const progress = getProgress();
  progress.activityScores[activityId] = Math.max(
    progress.activityScores[activityId] || 0,
    score
  );
  progress.totalScore = Object.values(progress.activityScores).reduce((a, b) => a + b, 0);
  saveProgress(progress);
};

export const earnBadge = (badgeId: string): void => {
  const progress = getProgress();
  if (!progress.badges.includes(badgeId)) {
    progress.badges.push(badgeId);
    saveProgress(progress);
  }
};

export const resetProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
