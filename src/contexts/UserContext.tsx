import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserData, saveUserData } from "@/lib/firebaseService";

interface UserContextType {
  user: UserData | null;
  sessionId: string | null;
  setUser: (user: Omit<UserData, "createdAt" | "sessionId">) => Promise<void>;
  isRegistered: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "ai_explorers_user";
const SESSION_STORAGE_KEY = "ai_explorers_session";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
      
      if (storedUser && storedSessionId) {
        const userData = JSON.parse(storedUser);
        setUserState(userData);
        setSessionId(storedSessionId);
        setIsRegistered(true);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const setUser = async (userData: Omit<UserData, "createdAt" | "sessionId">) => {
    try {
      const newSessionId = await saveUserData(userData);
      
      const fullUserData: UserData = {
        ...userData,
        sessionId: newSessionId,
        createdAt: new Date(),
      };
      
      setUserState(fullUserData);
      setSessionId(newSessionId);
      setIsRegistered(true);
      
      // Save to localStorage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fullUserData));
      localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
    } catch (error) {
      console.error("Error setting user:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, sessionId, setUser, isRegistered }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

