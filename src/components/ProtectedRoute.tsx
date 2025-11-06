import { ReactNode } from "react";
import { useUser } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isRegistered, user } = useUser();

  // If not registered or no user, don't render children
  // The App component will handle showing WelcomeForm
  if (!isRegistered || !user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

