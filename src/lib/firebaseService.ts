import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc,
  query,
  where,
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserData {
  firstName: string;
  lastName: string;
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

// Find user by first name and last name
export const findUserByName = async (
  firstName: string,
  lastName: string
): Promise<(UserData & { id: string }) | null> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("firstName", "==", firstName.trim()),
      where("lastName", "==", lastName.trim())
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as UserData & { id: string };
    }
    
    return null;
  } catch (error) {
    console.error("Error finding user by name:", error);
    throw error;
  }
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

// Save activity reflection
export const saveActivityReflection = async (
  sessionId: string,
  activityId: string,
  reflection: string
): Promise<void> => {
  try {
    const progressRef = doc(db, "userProgress", sessionId);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      const currentData = progressSnap.data();
      const reflections = currentData.reflections || {};
      
      reflections[activityId] = {
        text: reflection,
        timestamp: serverTimestamp(),
      };
      
      await updateDoc(progressRef, {
        reflections,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error saving reflection:", error);
    throw error;
  }
};

// Admin functions
export const getAllUsers = async (): Promise<(UserData & { id: string })[]> => {
  try {
    const { getDocs, collection } = await import("firebase/firestore");
    const usersSnapshot = await getDocs(collection(db, "users"));
    return usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as UserData & { id: string }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

export const getAllUserProgress = async (): Promise<(UserProgress & { sessionId: string })[]> => {
  try {
    const { getDocs, collection } = await import("firebase/firestore");
    const progressSnapshot = await getDocs(collection(db, "userProgress"));
    return progressSnapshot.docs.map((doc) => ({
      sessionId: doc.id,
      ...doc.data(),
    } as UserProgress & { sessionId: string }));
  } catch (error) {
    console.error("Error getting all user progress:", error);
    throw error;
  }
};

