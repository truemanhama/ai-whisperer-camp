import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserData {
  name: string;
  grade: string;
  school: string;
  createdAt: any;
  sessionId: string;
}

export interface UserProgress {
  completedLessons: string[];
  activityScores: {
    [key: string]: number;
  };
  badges: string[];
  totalScore: number;
}

// Generate a unique session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Save user information to Firebase
export const saveUserData = async (userData: Omit<UserData, "createdAt" | "sessionId">): Promise<string> => {
  try {
    const sessionId = generateSessionId();
    const userDoc: UserData = {
      ...userData,
      sessionId,
      createdAt: serverTimestamp(),
    };

    // Save user data
    const userRef = doc(db, "users", sessionId);
    await setDoc(userRef, userDoc);

    // Initialize progress document
    const progressRef = doc(db, "userProgress", sessionId);
    const initialProgress: UserProgress = {
      completedLessons: [],
      activityScores: {},
      badges: [],
      totalScore: 0,
    };
    await setDoc(progressRef, {
      ...initialProgress,
      sessionId,
      updatedAt: serverTimestamp(),
    });

    return sessionId;
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

// Update user progress in Firebase
export const updateUserProgress = async (
  sessionId: string,
  progress: Partial<UserProgress>
): Promise<void> => {
  try {
    const progressRef = doc(db, "userProgress", sessionId);
    await updateDoc(progressRef, {
      ...progress,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw error;
  }
};

// Get user progress from Firebase
export const getUserProgress = async (sessionId: string): Promise<UserProgress | null> => {
  try {
    const progressRef = doc(db, "userProgress", sessionId);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      const data = progressSnap.data();
      return {
        completedLessons: data.completedLessons || [],
        activityScores: data.activityScores || {},
        badges: data.badges || [],
        totalScore: data.totalScore || 0,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user progress:", error);
    return null;
  }
};

// Save activity score
export const saveActivityScore = async (
  sessionId: string,
  activityId: string,
  score: number
): Promise<void> => {
  try {
    const progressRef = doc(db, "userProgress", sessionId);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      const currentData = progressSnap.data();
      const activityScores = currentData.activityScores || {};
      
      // Keep the maximum score
      activityScores[activityId] = Math.max(
        activityScores[activityId] || 0,
        score
      );
      
      // Calculate total score
      const totalScore = Object.values(activityScores).reduce(
        (sum: number, s: number) => sum + s,
        0
      );
      
      await updateDoc(progressRef, {
        activityScores,
        totalScore,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error saving activity score:", error);
    throw error;
  }
};

