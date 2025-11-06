// Simple local storage manager for user progress with Firebase sync
import { saveActivityScore, updateUserProgress } from "./firebaseService";

interface UserProgress {
  completedLessons: string[];
  activityScores: {
    [key: string]: number;
  };
  badges: string[];
  totalScore: number;
}

const STORAGE_KEY = "ai_explorers_progress";
const SESSION_STORAGE_KEY = "ai_explorers_session";

const defaultProgress: UserProgress = {
  completedLessons: [],
  activityScores: {},
  badges: [],
  totalScore: 0,
};

// Get session ID from localStorage
const getSessionId = (): string | null => {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
};

// Sync progress to Firebase if sessionId is available
const syncToFirebase = async (progress: UserProgress): Promise<void> => {
  const sessionId = getSessionId();
  if (sessionId) {
    try {
      await updateUserProgress(sessionId, progress);
    } catch (error) {
      console.error("Failed to sync progress to Firebase:", error);
      // Don't throw - we still want to save to localStorage
    }
  }
};

export const getProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProgress;
  } catch {
    return defaultProgress;
  }
};

export const saveProgress = async (progress: UserProgress): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    await syncToFirebase(progress);
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
};

export const markLessonComplete = async (lessonId: string): Promise<void> => {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    await saveProgress(progress);
  }
};

export const updateActivityScore = async (activityId: string, score: number): Promise<void> => {
  const progress = getProgress();
  const previousScore = progress.activityScores[activityId] || 0;
  const newScore = Math.max(previousScore, score);
  
  progress.activityScores[activityId] = newScore;
  progress.totalScore = Object.values(progress.activityScores).reduce((a, b) => a + b, 0);
  
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
  
  // Sync to Firebase
  const sessionId = getSessionId();
  if (sessionId) {
    try {
      await saveActivityScore(sessionId, activityId, newScore);
    } catch (error) {
      console.error("Failed to save activity score to Firebase:", error);
    }
  }
};

export const earnBadge = async (badgeId: string): Promise<void> => {
  const progress = getProgress();
  if (!progress.badges.includes(badgeId)) {
    progress.badges.push(badgeId);
    await saveProgress(progress);
  }
};

export const resetProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
