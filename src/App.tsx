import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import WelcomeForm from "./components/WelcomeForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import Activities from "./pages/Activities";
import RealOrAI from "./pages/RealOrAI";
import Myths from "./pages/Myths";
import BuildAI from "./pages/BuildAI";
import Review from "./pages/Review";
import AIModule from "./pages/AIModule";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isRegistered, user } = useUser();

  // Show welcome form if user is not registered or user data doesn't exist
  if (!isRegistered || !user) {
    return <WelcomeForm />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/lessons" 
          element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/activities" 
          element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/activities/real-or-ai" 
          element={
            <ProtectedRoute>
              <RealOrAI />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/activities/myths" 
          element={
            <ProtectedRoute>
              <Myths />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/activities/build-ai" 
          element={
            <ProtectedRoute>
              <BuildAI />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ai-module" 
          element={
            <ProtectedRoute>
              <AIModule />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/review" 
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
